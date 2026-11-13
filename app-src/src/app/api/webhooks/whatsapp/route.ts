// Meta WhatsApp Cloud API Webhook Endpoint
// GET: Webhook verification challenge (Meta handshake)
// POST: Incoming WhatsApp message receiver & auto-audit logger

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/webhooks/whatsapp
 * Meta verification handshake. Meta queries this URL when you configure the webhook in developers.facebook.com
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const configuredToken = process.env.WHATSAPP_VERIFY_TOKEN || 'healthsure_verify_token_2026';

  if (mode === 'subscribe' && token === configuredToken) {
    console.log('[WhatsApp Webhook] Handshake verified successfully with Meta!');
    return new Response(challenge || '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  console.warn('[WhatsApp Webhook] Verification token mismatch:', { received: token, expected: configuredToken });
  return new Response('Forbidden: Token mismatch', { status: 403 });
}

/**
 * POST /api/webhooks/whatsapp
 * Receives incoming messages sent by participants/market traders on WhatsApp
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log payload in development/audit
    console.log('[WhatsApp Webhook] Incoming event:', JSON.stringify(body, null, 2));

    // Fast acknowledgement to Meta (Meta requires 200 OK within 3 seconds)
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;

    if (!change || !change.messages || change.messages.length === 0) {
      // Event may be a delivery receipt (sent/delivered/read), return 200 OK
      return NextResponse.json({ status: 'ignored_receipt' }, { status: 200 });
    }

    const message = change.messages[0];
    const senderPhone = message.from; // e.g. "2348031234567"
    const messageId = message.id;
    const messageText = message.text?.body || `[Media/Interactive message type: ${message.type}]`;
    const contactName = change.contacts?.[0]?.profile?.name || 'WhatsApp User';

    // Normalize phone variations to match our DB format ('080...' and '234...')
    let localPhone = senderPhone;
    if (senderPhone.startsWith('234') && senderPhone.length === 13) {
      localPhone = '0' + senderPhone.substring(3);
    }

    // 1. Search for existing participant in Registration database
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        OR: [
          { phone: { contains: localPhone } },
          { phone: { contains: senderPhone } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. If matched to a participant, automatically log a FollowUp entry
    if (existingRegistration) {
      await prisma.followUp.create({
        data: {
          registrationId: existingRegistration.id,
          userId: 'whatsapp_webhook',
          type: 'WHATSAPP',
          outcome: 'REACHED',
          notes: `[Inbound WhatsApp from ${contactName}]: "${messageText}"`,
        },
      });

      // Update participant status to IN_PROGRESS if they were NEW or CONTACTED
      if (existingRegistration.status === 'NEW' || existingRegistration.status === 'CONTACTED') {
        await prisma.registration.update({
          where: { id: existingRegistration.id },
          data: { status: 'IN_PROGRESS' },
        });
      }

      console.log(`[WhatsApp Webhook] Auto-logged inbound message for participant: ${existingRegistration.fullName} (${existingRegistration.referenceNumber})`);
    } else {
      // 3. If phone is not yet registered, create an Inquiry entry in the Operations portal
      await prisma.inquiry.create({
        data: {
          name: contactName,
          phone: localPhone,
          message: `[Inbound WhatsApp]: ${messageText}`,
          type: 'REGISTRATION_HELP',
          status: 'NEW',
          locale: 'en',
        },
      });

      console.log(`[WhatsApp Webhook] Created new triage inquiry from unregistered phone: ${localPhone}`);
    }

    // 4. Log notification audit entry
    await prisma.notificationLog.create({
      data: {
        channel: 'whatsapp_webhook_inbound',
        recipient: senderPhone,
        eventType: 'inbound_message',
        payload: {
          messageId,
          text: messageText,
          senderName: contactName,
          matchedRegistration: existingRegistration?.referenceNumber || null,
        },
        success: true,
      },
    }).catch(() => {});

    return NextResponse.json({ status: 'processed' }, { status: 200 });
  } catch (err) {
    console.error('[WhatsApp Webhook] Processing error:', err);
    // Still return 200 to prevent Meta from retrying failed webhooks indefinitely
    return NextResponse.json({ status: 'error_logged' }, { status: 200 });
  }
}


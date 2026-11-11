// Notification service — dispatches team alerts via email and WhatsApp

import { sendEmail, teamNotificationEmail } from './email';
import { sendWhatsAppTextMessage } from './whatsapp';
import prisma from '@/lib/db';

export interface NotificationEvent {
  type: 'new_registration' | 'status_change' | 'new_inquiry' | 'follow_up_overdue';
  registration?: {
    referenceNumber: string;
    fullName: string;
    phone: string;
    state: string;
    lga: string;
    workerType: string;
    coveragePreference: string;
    locale: string;
  };
  inquiry?: {
    name: string;
    phone: string;
    message: string;
    type: string;
  };
  meta?: Record<string, string>;
}

const WORKER_TYPE_LABELS: Record<string, string> = {
  MARKET_TRADER: 'Market Trader',
  SHOP_OWNER: 'Shop Owner',
  PETTY_TRADER: 'Petty Trader',
  ARTISAN: 'Artisan / Craftworker',
  FARMER: 'Farmer',
  FOOD_SELLER: 'Food Vendor',
  TRANSPORT: 'Transport Worker',
  SELF_EMPLOYED: 'Self-Employed',
  OTHER: 'Other',
};

/**
 * Notify team and participant about an event via all configured channels
 */
export async function notifyTeam(event: NotificationEvent) {
  const results: Array<{ channel: string; success: boolean; error?: string }> = [];

  // ━━━ Channel 1: Email via Resend ━━━
  try {
    if (event.type === 'new_registration' && event.registration) {
      const reg = event.registration;
      await sendEmail({
        to: teamNotificationEmail(),
        subject: `🆕 New Registration: ${reg.fullName} — ${reg.referenceNumber}`,
        html: buildRegistrationEmailHtml(reg),
      });
      results.push({ channel: 'email', success: true });
    } else if (event.type === 'new_inquiry' && event.inquiry) {
      const inq = event.inquiry;
      await sendEmail({
        to: teamNotificationEmail(),
        subject: `📩 New Inquiry from ${inq.name}: ${inq.type}`,
        html: buildInquiryEmailHtml(inq),
      });
      results.push({ channel: 'email', success: true });
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    results.push({ channel: 'email', success: false, error: errMsg });
    console.error('[Notification] Email failed:', errMsg);
  }

  // ━━━ Channel 2: WhatsApp Cloud API ━━━
  try {
    if (event.type === 'new_registration' && event.registration) {
      const reg = event.registration;

      // 1. Send instant WhatsApp confirmation to participant
      const greetingMsg = reg.locale === 'pcm'
        ? `Kóóyo ${reg.fullName}! Thank you as you register for WeNaijaHealth.\nYour registration code na: *${reg.referenceNumber}*.\nOur care officer go call you within 24 hours make we guide you to get KwaraCare / NHIA card near ${reg.lga || reg.state}.\nReply this message if you get any urgent question!`
        : `Hello ${reg.fullName}, thank you for registering on WeNaijaHealth!\nYour registration code is: *${reg.referenceNumber}*.\nA care officer will call you within 24 hours to guide you to the nearest accredited clinic (KwaraCare / NHIA) near ${reg.lga || reg.state}.\nFeel free to reply directly to this WhatsApp message!`;

      const waRes = await sendWhatsAppTextMessage({
        to: reg.phone,
        message: greetingMsg,
      });

      if (waRes.success) {
        results.push({ channel: 'whatsapp_participant', success: true });
      }

      // 2. If team WhatsApp lead is set in environment, notify team lead
      const teamWhatsApp = process.env.TEAM_WHATSAPP_PHONE;
      if (teamWhatsApp) {
        await sendWhatsAppTextMessage({
          to: teamWhatsApp,
          message: `🚨 *New Participant Registered!*\nName: ${reg.fullName}\nPhone: ${reg.phone}\nRef: ${reg.referenceNumber}\nLocation: ${reg.state} (${reg.lga})\nTrade: ${reg.workerType}\nCoverage: ${reg.coveragePreference}`,
        });
        results.push({ channel: 'whatsapp_team', success: true });
      }
    }
  } catch (waErr) {
    const errMsg = waErr instanceof Error ? waErr.message : 'Unknown WhatsApp error';
    results.push({ channel: 'whatsapp', success: false, error: errMsg });
    console.error('[Notification] WhatsApp outbound failed:', errMsg);
  }

  // Log all notification attempts to database audit
  for (const result of results) {
    await prisma.notificationLog.create({
      data: {
        channel: result.channel,
        recipient: teamNotificationEmail(),
        eventType: event.type,
        payload: event as never,
        success: result.success,
        errorMessage: result.error || null,
      },
    }).catch(() => {});
  }

  return results;
}

// ━━━ Email HTML Templates ━━━

function buildRegistrationEmailHtml(reg: NonNullable<NotificationEvent['registration']>): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f7f4; padding: 20px;">
<div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #008751 0%, #00a86b 100%); padding: 24px 32px; color: white;">
    <h1 style="margin: 0; font-size: 20px; font-weight: 700;">🆕 New Registration</h1>
    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">WeNaijaHealth — Someone needs health insurance help</p>
  </div>

  <!-- Body -->
  <div style="padding: 24px 32px;">
    <div style="background: #e8f5e9; border-left: 4px solid #008751; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
      <strong style="font-size: 16px; color: #008751;">Ref: ${reg.referenceNumber}</strong>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${reg.fullName}</td></tr>
      <tr style="background: #fafafa;"><td style="padding: 8px; color: #666;">Phone</td><td style="padding: 8px; font-weight: 600;"><a href="tel:${reg.phone}" style="color: #008751;">${reg.phone}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">State / LGA</td><td style="padding: 8px 0; font-weight: 600;">${reg.state}${reg.lga ? ' / ' + reg.lga : ''}</td></tr>
      <tr style="background: #fafafa;"><td style="padding: 8px; color: #666;">Work Type</td><td style="padding: 8px; font-weight: 600;">${WORKER_TYPE_LABELS[reg.workerType] || reg.workerType}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Coverage</td><td style="padding: 8px 0; font-weight: 600;">${reg.coveragePreference === 'FAMILY' ? '👨‍👩‍👧‍👦 Family' : '🧑 Individual'}</td></tr>
      <tr style="background: #fafafa;"><td style="padding: 8px; color: #666;">Language</td><td style="padding: 8px; font-weight: 600;">${reg.locale.toUpperCase()}</td></tr>
    </table>

    <!-- CTA -->
    <div style="margin-top: 24px; text-align: center;">
      <a href="https://wa.me/234${reg.phone.substring(1)}?text=${encodeURIComponent(`Hello ${reg.fullName}, this is WeNaijaHealth. We received your registration (Ref: ${reg.referenceNumber}). We're here to help you get health insurance. When is a good time to talk?`)}"
         style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        📱 WhatsApp ${reg.fullName}
      </a>
      <a href="tel:${reg.phone}"
         style="display: inline-block; background: #008751; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-left: 8px;">
        📞 Call Now
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="background: #f8f9fa; padding: 16px 32px; text-align: center; font-size: 12px; color: #999;">
    ⏰ Follow up within 24 hours. This person is waiting.
  </div>
</div>
</body>
</html>`;
}

function buildInquiryEmailHtml(inq: NonNullable<NotificationEvent['inquiry']>): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f7f4; padding: 20px;">
<div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
  <div style="background: linear-gradient(135deg, #c28200 0%, #e09900 100%); padding: 24px 32px; color: white;">
    <h1 style="margin: 0; font-size: 20px; font-weight: 700;">📩 New Inquiry</h1>
    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Type: ${inq.type}</p>
  </div>
  <div style="padding: 24px 32px;">
    <p><strong>From:</strong> ${inq.name}</p>
    <p><strong>Phone:</strong> <a href="tel:${inq.phone}" style="color: #008751;">${inq.phone}</a></p>
    <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0; white-space: pre-wrap;">${inq.message}</p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://wa.me/234${inq.phone.substring(1)}" style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        📱 Reply on WhatsApp
      </a>
    </div>
  </div>
</div>
</body>
</html>`;
}

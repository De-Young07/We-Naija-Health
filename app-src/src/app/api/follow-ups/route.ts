// POST /api/follow-ups — Create a follow-up entry

import { NextRequest, NextResponse } from 'next/server';
import { followUpSchema } from '@/modules/registration/schema';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = followUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Create the follow-up
    const followUp = await prisma.followUp.create({
      data: {
        registrationId: result.data.registrationId,
        userId: body.userId || 'system', // TODO: get from auth session
        type: result.data.type,
        outcome: result.data.outcome,
        notes: result.data.notes,
        nextActionDate: result.data.nextActionDate ? new Date(result.data.nextActionDate) : null,
      },
    });

    // Auto-update registration status based on outcome
    const statusMap: Record<string, string> = {
      REACHED: 'CONTACTED',
      NOT_REACHED: 'CONTACTED',
      CALLBACK_REQUESTED: 'CONTACTED',
      DOCUMENTS_SHARED: 'DOCUMENTS_READY',
      ENROLLMENT_SCHEDULED: 'ENROLLMENT_SCHEDULED',
      ENROLLED: 'ENROLLED',
      DROPPED: 'DROPPED',
    };

    const newStatus = statusMap[result.data.outcome];
    if (newStatus) {
      await prisma.registration.update({
        where: { id: result.data.registrationId },
        data: { status: newStatus as never },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'follow_up.create',
        entityType: 'FollowUp',
        entityId: followUp.id,
        userId: body.userId || null,
        details: { registrationId: result.data.registrationId, outcome: result.data.outcome },
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, followUp }, { status: 201 });
  } catch (err) {
    console.error('[API] Follow-up error:', err);
    return NextResponse.json({ error: 'Failed to create follow-up' }, { status: 500 });
  }
}


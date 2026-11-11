// POST /api/inquiries — Create new inquiry
// GET  /api/inquiries — List inquiries (admin)

import { NextRequest, NextResponse } from 'next/server';
import { inquirySchema } from '@/modules/registration/schema';
import prisma from '@/lib/db';
import { notifyTeam } from '@/modules/notifications/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email || null,
        message: result.data.message,
        type: result.data.type,
        locale: result.data.locale,
        status: 'NEW',
      },
    });

    // Notify team (non-blocking)
    notifyTeam({
      type: 'new_inquiry',
      inquiry: {
        name: result.data.name,
        phone: result.data.phone,
        message: result.data.message,
        type: result.data.type,
      },
    }).catch(err => console.error('Inquiry notification failed:', err));

    return NextResponse.json(
      { success: true, id: inquiry.id, message: 'Inquiry submitted' },
      { status: 201 }
    );
  } catch (err) {
    console.error('[API] Inquiry error:', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    return NextResponse.json({ inquiries, total, page, limit });
  } catch (err) {
    console.error('[API] List inquiries error:', err);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}


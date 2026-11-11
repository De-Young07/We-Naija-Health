// GET /api/dashboard — Dashboard stats

import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/modules/registration/service';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error('[API] Dashboard stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}


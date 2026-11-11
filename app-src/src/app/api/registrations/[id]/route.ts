// GET  /api/registrations/[id] — Get single registration
// PATCH /api/registrations/[id] — Update status/notes

import { NextRequest, NextResponse } from 'next/server';
import { getRegistrationById, updateRegistrationStatus } from '@/modules/registration/service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const registration = await getRegistrationById(id);

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json(registration);
  } catch (err) {
    console.error('[API] Get registration error:', err);
    return NextResponse.json({ error: 'Failed to fetch registration' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const registration = await updateRegistrationStatus(id, body.status, body.notes);
    return NextResponse.json(registration);
  } catch (err) {
    console.error('[API] Update registration error:', err);
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}


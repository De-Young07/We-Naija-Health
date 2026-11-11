// POST /api/registrations — Create new registration
// GET  /api/registrations — List registrations (admin)

import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/modules/registration/schema';
import { createRegistration, getRegistrations } from '@/modules/registration/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await createRegistration(result.data);

    return NextResponse.json(
      {
        success: true,
        referenceNumber: registration.referenceNumber,
        id: registration.id,
        message: 'Registration submitted successfully',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[API] Registration error:', err);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const state = searchParams.get('state') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const data = await getRegistrations({ status, state, search, page, limit });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[API] List registrations error:', err);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}


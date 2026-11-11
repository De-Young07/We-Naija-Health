// Registration service — business logic

import prisma from '@/lib/db';
import { RegistrationInput } from './schema';
import { notifyTeam } from '@/modules/notifications/service';

/**
 * Generate a unique reference number: WNH-YYYYMMDD-XXXXX
 */
function generateRefNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `WNH-${date}-${rand}`;
}

/**
 * Create a new registration and notify the team
 */
export async function createRegistration(input: RegistrationInput) {
  const referenceNumber = generateRefNumber();

  const registration = await prisma.registration.create({
    data: {
      referenceNumber,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || null,
      state: input.state,
      lga: input.lga || null,
      community: input.community || null,
      preferredContact: input.preferredContact,
      workerType: input.workerType,
      workerTypeOther: input.workerTypeOther || null,
      currentInsurance: input.currentInsurance,
      coveragePreference: input.coveragePreference,
      consentDataUsage: input.consentDataUsage,
      consentSharing: input.consentSharing,
      consentReimbursement: input.consentReimbursement,
      consentComms: input.consentComms,
      locale: input.locale,
      source: input.source,
      status: 'NEW',
    },
  });

  // Log audit entry
  await prisma.auditLog.create({
    data: {
      action: 'registration.create',
      entityType: 'Registration',
      entityId: registration.id,
      details: { referenceNumber, source: input.source },
    },
  }).catch(() => { }); // Non-blocking

  // Notify team (non-blocking)
  notifyTeam({
    type: 'new_registration',
    registration: {
      referenceNumber,
      fullName: input.fullName,
      phone: input.phone,
      state: input.state,
      lga: input.lga || '',
      workerType: input.workerType,
      coveragePreference: input.coveragePreference,
      locale: input.locale,
    },
  }).catch(err => console.error('Notification failed:', err));

  return registration;
}

/**
 * Get all registrations with optional filters
 */
export async function getRegistrations(filters?: {
  status?: string;
  state?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters?.status) {
    where.status = filters.status;
  }
  if (filters?.state) {
    where.state = filters.state;
  }
  if (filters?.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search } },
      { referenceNumber: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [registrations, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      include: {
        followUps: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { user: { select: { name: true } } },
        },
        _count: { select: { followUps: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.registration.count({ where }),
  ]);

  return {
    registrations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single registration with all follow-ups
 */
export async function getRegistrationById(id: string) {
  return prisma.registration.findUnique({
    where: { id },
    include: {
      followUps: {
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      },
      preferredScheme: true,
    },
  });
}

/**
 * Update registration status
 */
export async function updateRegistrationStatus(id: string, status: string, notes?: string) {
  const registration = await prisma.registration.update({
    where: { id },
    data: {
      status: status as never,
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'registration.status_change',
      entityType: 'Registration',
      entityId: id,
      details: { newStatus: status, notes },
    },
  }).catch(() => { });

  return registration;
}

/**
 * Dashboard stats
 */
export async function getDashboardStats() {
  const [
    totalRegistrations,
    newCount,
    contactedCount,
    enrolledCount,
    droppedCount,
    todayCount,
    weekCount,
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { status: 'NEW' } }),
    prisma.registration.count({ where: { status: 'CONTACTED' } }),
    prisma.registration.count({ where: { status: 'ENROLLED' } }),
    prisma.registration.count({ where: { status: 'DROPPED' } }),
    prisma.registration.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.registration.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const totalInquiries = await prisma.inquiry.count();
  const newInquiries = await prisma.inquiry.count({ where: { status: 'NEW' } });

  return {
    totalRegistrations,
    newCount,
    contactedCount,
    enrolledCount,
    droppedCount,
    todayCount,
    weekCount,
    totalInquiries,
    newInquiries,
    conversionRate: totalRegistrations > 0
      ? ((enrolledCount / totalRegistrations) * 100).toFixed(1)
      : '0.0',
  };
}


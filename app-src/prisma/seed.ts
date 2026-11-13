import { PrismaClient, UserRole, SchemeTag } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HealthSure Connect database...');

  // Default hashed password for initial admin/agent accounts: "HealthSurePilot2026!"
  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('HealthSurePilot2026!', salt);

  // 1. Seed Team Members
  const teamMembers = [
    {
      name: 'Admin Team',
      email: 'team.accesscare@gmail.com',
      role: UserRole.ADMIN,
    },
    {
      name: 'Quadri Adebisi',
      email: 'quadriadebisi084@gmail.com',
      role: UserRole.ADMIN,
    },
    {
      name: 'Saleemah Hamzat',
      email: 'saleemah@healthsureconnect.org',
      role: UserRole.AGENT,
    },
    {
      name: 'Jimoh Habeebullahi',
      email: 'habeeb@healthsureconnect.org',
      role: UserRole.AGENT,
    },
  ];

  for (const member of teamMembers) {
    await prisma.user.upsert({
      where: { email: member.email },
      update: {
        name: member.name,
        role: member.role,
      },
      create: {
        name: member.name,
        email: member.email,
        passwordHash: defaultPasswordHash,
        role: member.role,
        active: true,
      },
    });
    console.log(`👤 Seeded user: ${member.name} (${member.email})`);
  }

  // 2. Seed Verified Schemes
  const schemes = [
    {
      name: 'KwaraCARE Health Plan',
      provider: 'Kwara State Health Insurance Agency (KWHIA)',
      state: 'Kwara',
      tag: SchemeTag.STATE_SHIS,
      verified: true,
      lastVerifiedAt: new Date(),
      cost: '₦1,500/month or ₦15,500/year (Individual)',
      costDetail: 'Individual: ₦1,500/month (₦15,500 annual) • Family Plan: ₦75,000/year (enrollee + spouse + 4 children under 18)',
      eligibility: [
        'Resident of Kwara State (all 16 LGAs)',
        'Self-employed, artisan, market trader, or informal worker',
        'Age 0–65 years (special vulnerability provisions for elderly)',
        'Valid NIN, voter card, or Kwara Residents ID (KWASRRA)',
      ],
      benefits: [
        'Primary healthcare consultations and outpatient treatment',
        'Generic essential drugs and standard prescription medications',
        'Antenatal, delivery, and postnatal maternal care',
        'Child immunisations and pediatric check-ups',
        'Emergency stabilisation and minor surgeries',
        'Basic diagnostic laboratory tests (malaria, typhoid, PCV, urinalysis)',
        'Referral to secondary General Hospitals when needed',
      ],
      exclusions: [
        'Cosmetic or aesthetic surgeries',
        'High-end advanced oncology/cancer chemotherapy',
        'Dialysis beyond emergency stabilisation',
      ],
      facilities: '47 accredited Primary Healthcare Centres and General Hospitals across all 16 LGAs in Kwara State',
      registrationSteps: [
        'Walk into any accredited KWHIA enrollment centre or register via HealthSure Connect desk',
        'Present 11-digit National Identification Number (NIN)',
        'Undergo biometric photograph and fingerprint capture',
        'Pay premium (₦1,500 monthly or ₦15,500 annually) via Remita or approved bank slip',
        'Collect unique KwaraCARE policy card; care activates on 1st of following month',
      ],
      contactPhone: '0800 100 1001 (Toll-Free)',
      contactEmail: 'info@kwaracare.com.ng',
      contactAddress: 'House 27B Ahmadu Bello Way, G.R.A, Ilorin, Kwara State',
      officialUrl: 'https://kwaracare.com.ng',
      subsidyAvailable: true,
    },
    {
      name: 'NHIA Basic Healthcare Provision Fund (BHCPF)',
      provider: 'National Health Insurance Authority',
      state: 'Nationwide',
      tag: SchemeTag.FEDERAL,
      verified: true,
      lastVerifiedAt: new Date(),
      cost: 'FREE (100% Government-Funded)',
      costDetail: 'Funded via the Federal Government Consolidated Revenue Fund (1% CRF allocation) for poor and vulnerable populations.',
      eligibility: [
        'Nigerian citizen resident in any state',
        'Identified vulnerable household (income below living minimum)',
        'Pregnant women and nursing mothers',
        'Children under 5 years of age',
        'Elderly citizens aged 65 and above',
        'Persons living with physical disabilities',
      ],
      benefits: [
        'Essential primary healthcare consultation at empaneled public PHCs',
        'Free maternal care (antenatal, normal delivery, post-delivery checkups)',
        'Child immunisation and nutrition monitoring',
        'Treatment of endemic conditions (malaria, diarrhea, respiratory infections)',
        'Essential generic medicines listed on National Essential Drug List',
        'Emergency transportation/referral to secondary facility',
      ],
      exclusions: [
        'Private hospital care',
        'Elective procedures and surgeries',
      ],
      facilities: 'Over 10,000 empaneled Primary Healthcare Centres nationwide (at least 1 per political ward)',
      registrationSteps: [
        'Community mobilization verification via Ward Development Committee (WDC)',
        'Visit nearest ward Primary Healthcare Centre',
        'Present National Identification Number (NIN)',
        'Biometric capture and immediate vulnerability enrollment',
      ],
      contactPhone: '+234 9 903 0000',
      contactEmail: 'info@nhia.gov.ng',
      officialUrl: 'https://www.nhia.gov.ng',
      subsidyAvailable: false,
    },
    {
      name: 'NHIA GIFSHIP (Informal Sector Health Programme)',
      provider: 'National Health Insurance Authority',
      state: 'Nationwide',
      tag: SchemeTag.FEDERAL,
      verified: true,
      lastVerifiedAt: new Date(),
      cost: '₦1,700/month or ₦18,000/year (Individual)',
      costDetail: 'Individual: ₦18,000 per year • Family/Group: ₦72,000/year (covers main enrollee + 4 dependents)',
      eligibility: [
        'Self-employed Nigerian citizen or foreign resident',
        'Organised informal sector associations (market unions, NURTW, artisan guilds)',
        'Not covered under formal government payroll or private corporate HMO',
      ],
      benefits: [
        'Comprehensive outpatient care with accredited private/public hospitals',
        'Inpatient hospital admission (up to 15 cumulative days/year)',
        'Maternity and obstetric care up to 4 live births',
        'Basic dental extractions and minor eye optical care',
        'Prescribed generic drugs from accredited facility pharmacies',
      ],
      facilities: 'Nationwide accredited HMO networks and over 3,000 participating public and private hospitals',
      registrationSteps: [
        'Select accredited HMO or register via MyNHIA mobile app',
        'Submit digital enrollment form with NIN and photograph',
        'Select accredited Primary Healthcare Provider (hospital)',
        'Pay annual premium via Remita online channel',
        'Coverage commences after standard 30-day waiting period',
      ],
      contactPhone: '0800 4687 6442',
      contactEmail: 'support@nhia.gov.ng',
      officialUrl: 'https://www.nhia.gov.ng',
      subsidyAvailable: true,
    },
  ];

  for (const scheme of schemes) {
    const existing = await prisma.scheme.findFirst({
      where: { name: scheme.name },
    });

    if (existing) {
      await prisma.scheme.update({
        where: { id: existing.id },
        data: scheme,
      });
      console.log(`🏥 Updated scheme: ${scheme.name}`);
    } else {
      await prisma.scheme.create({
        data: scheme,
      });
      console.log(`🏥 Created scheme: ${scheme.name}`);
    }
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


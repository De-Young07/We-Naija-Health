// Registration module — Zod validation schemas

import { z } from 'zod';

// Forgiving Nigerian phone validator: strips spaces, dashes, converts +234 to 0
const nigerianPhone = z.string()
  .transform((val) => {
    let clean = val.replace(/[\s\-\(\)\.]/g, '');
    if (clean.startsWith('+234')) clean = '0' + clean.slice(4);
    else if (clean.startsWith('234') && clean.length === 13) clean = '0' + clean.slice(3);
    return clean;
  })
  .refine((val) => /^0[789]\d{9}$/.test(val), {
    message: 'Enter a valid 11-digit Nigerian phone number (e.g. 08012345678 or +234...)',
  });

export const registrationSchema = z.object({
  // Step 1 — About You
  fullName: z.string().min(2, 'Full name is required').max(100),
  phone: nigerianPhone,
  email: z.string().optional().nullable().transform((e) => (e && e.trim() !== '' ? e.trim() : null)),
  state: z.string().min(1, 'State is required'),
  lga: z.string().optional().nullable().default(''),
  community: z.string().optional().nullable().default(''),
  preferredContact: z.string().default('sms'),

  // Step 2 — Work Type
  workerType: z.enum([
    'MARKET_TRADER', 'SHOP_OWNER', 'PETTY_TRADER', 'ARTISAN',
    'FARMER', 'FOOD_SELLER', 'TRANSPORT', 'SELF_EMPLOYED', 'OTHER',
  ]).default('OTHER'),
  workerTypeOther: z.string().optional().nullable(),

  // Step 3 — Insurance Status
  currentInsurance: z.enum(['YES', 'NO', 'NOT_SURE']).default('NOT_SURE'),

  // Step 4 — Coverage
  coveragePreference: z.enum(['SELF', 'FAMILY']).default('SELF'),

  // Step 5 — Consent
  consentDataUsage: z.boolean().refine((val) => val === true, {
    message: 'You must consent to data collection',
  }),
  consentSharing: z.boolean().default(false),
  consentReimbursement: z.boolean().default(false),
  consentComms: z.boolean().default(false),

  // Metadata
  locale: z.string().default('en'),
  source: z.enum(['WEB', 'FIELD_AGENT', 'PHONE', 'WHATSAPP']).default('WEB'),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

// Inquiry schema
export const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  phone: nigerianPhone,
  email: z.string().optional().nullable().transform((e) => (e && e.trim() !== '' ? e.trim() : null)),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000),
  type: z.enum(['GENERAL', 'REGISTRATION_HELP', 'SCHEME_QUESTION', 'COMPLAINT', 'PARTNERSHIP']).default('GENERAL'),
  locale: z.string().default('en'),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// Follow-up schema
export const followUpSchema = z.object({
  registrationId: z.string().min(1),
  type: z.enum(['PHONE_CALL', 'WHATSAPP', 'EMAIL', 'IN_PERSON', 'SMS', 'INTERNAL_NOTE']),
  outcome: z.enum(['REACHED', 'NOT_REACHED', 'CALLBACK_REQUESTED', 'DOCUMENTS_SHARED', 'ENROLLMENT_SCHEDULED', 'ENROLLED', 'DROPPED']),
  notes: z.string().min(1, 'Notes are required'),
  nextActionDate: z.string().datetime().optional().nullable(),
});

export type FollowUpInput = z.infer<typeof followUpSchema>;

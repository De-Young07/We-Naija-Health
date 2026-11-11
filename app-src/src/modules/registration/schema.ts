// Registration module — Zod validation schemas

import { z } from 'zod';

// Nigerian phone: 080/081/090/091/070/071 + 8 digits
const nigerianPhone = z.string().regex(
  /^0[789][01]\d{8}$/,
  'Enter a valid Nigerian phone number (e.g. 08012345678)'
);

export const registrationSchema = z.object({
  // Step 1 — About You
  fullName: z.string().min(2, 'Full name is required').max(100),
  phone: nigerianPhone,
  email: z.string().email().optional().or(z.literal('')),
  state: z.string().min(1, 'State is required'),
  lga: z.string().optional().default(''),
  community: z.string().optional().default(''),
  preferredContact: z.string().default('sms'),

  // Step 2 — Work Type
  workerType: z.enum([
    'MARKET_TRADER', 'SHOP_OWNER', 'PETTY_TRADER', 'ARTISAN',
    'FARMER', 'FOOD_SELLER', 'TRANSPORT', 'SELF_EMPLOYED', 'OTHER',
  ]),
  workerTypeOther: z.string().optional(),

  // Step 3 — Insurance Status
  currentInsurance: z.enum(['YES', 'NO', 'NOT_SURE']),

  // Step 4 — Coverage
  coveragePreference: z.enum(['SELF', 'FAMILY']),

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
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
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
  nextActionDate: z.string().datetime().optional(),
});

export type FollowUpInput = z.infer<typeof followUpSchema>;


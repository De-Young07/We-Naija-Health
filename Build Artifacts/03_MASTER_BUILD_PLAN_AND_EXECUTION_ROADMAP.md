# Master Build Plan & Execution Roadmap
## WeNaijaHealth: Pilot Operation to National Scale

**Document Reference:** `WNH-BP-2026-V1`  
**Target:** Live Pilot Readiness (Tomorrow Morning) + Long-term Reusable Architecture  
**Stack:** Next.js (App Router), TypeScript, Tailwind CSS / Vanilla Design Tokens, PostgreSQL / Prisma ORM

---

## 1. Executive Build Architecture

The master build plan balances **immediate velocity** (to guarantee flawless execution for tomorrow's pilot) with **engineering rigor** (ensuring the codebase is clean, modular, and reusable without requiring a rewrite next week).

```
                                      WeNaijaHealth Architecture
                                      
  +-------------------------------------------------------------------------------------------------+
  |                                        CLIENT TIER                                              |
  |  +---------------------------+  +---------------------------+  +-----------------------------+  |
  |  |   Participant Flow        |  |   POS Assistant Portal    |  |   Admin Command Center      |  |
  |  | - Multilingual Language   |  | - Rapid Intake (<90s)     |  | - Participant Metrics       |  |
  |  | - 5-Step Low-Literacy Form|  | - Agent Referral Code     |  | - Scheme Management         |  |
  |  | - Verified Reference Card |  | - Verified Commission Log |  | - Financial Ledger & Audit  |  |
  |  +-------------+-------------+  +-------------+-------------+  +--------------+--------------+  |
  +----------------|------------------------------|-------------------------------|-----------------+
                   |                              |                               |
  +----------------v------------------------------v-------------------------------v-----------------+
  |                                     NEXT.JS APPLICATION LAYER                                   |
  |  +-------------------------------------------------------------------------------------------+  |
  |  | Core Controllers & Server Actions:                                                        |  |
  |  | - /api/register (Validation, Reference Generation, Consent Record)                        |  |
  |  | - /api/assistance (Eligibility assessment, schedule calculator)                           |  |
  |  | - /api/schemes (Directory filtering by State, LGA, Occupation)                          |  |
  |  | - /api/admin (RBAC enforcement, status approvals, CSV export)                            |  |
  |  +---------------------------------------------+---------------------------------------------+  |
  |                                                |                                                |
  |  +---------------------------------------------v---------------------------------------------+  |
  |  | Business Logic & Service Adapters:                                                        |  |
  |  | - i18n Engine (Type-safe dictionary: EN, YO, HA, IG, PCM - Nigerian Pidgin)               |  |
  |  | - Reference Generator (Cryptographically random, collision-checked: WNH-YYYY-XXXXXX)      |  |
  |  | - Notification Service (Adapter with Multi-provider: Termii SMS, Resend, Mock Fallback)   |  |
  |  | - Agency Integration Adapter (NHIA / KwaraCare integration contracts)                     |  |
  |  | - Double-Entry Financial Ledger (Integer Kobo units, balance reconciliation)              |  |
  |  +---------------------------------------------+---------------------------------------------+  |
  +------------------------------------------------|------------------------------------------------+
                                                   |
  +------------------------------------------------v------------------------------------------------+
  |                                        PERSISTENCE LAYER                                        |
  |  +-------------------------------------------------------------------------------------------+  |
  |  | PostgreSQL via Prisma ORM:                                                                |  |
  |  | - Users & Role Permissions (SuperAdmin, Admin, Assistant, Participant)                    |  |
  |  | - ParticipantProfiles (Demographics, Trade, Language, Location)                         |  |
  |  | - EnrolmentApplications (State, Status history, Referral records)                         |  |
  |  | - InsuranceSchemes & Facility Directory (KwaraCare, NHIA GIFSHIP, verified clinics)      |  |
  |  | - FinancialAssistance & ReimbursementLedger (Agreed schedules, payments, receipts)        |  |
  |  | - CommunityAssistants & IncentiveLedger (POS tracking, ₦2,000 commission states)          |  |
  |  | - AuditLogs (NDPA compliance trail, timestamped change attribution)                       |  |
  |  +-------------------------------------------------------------------------------------------+  |
  +-------------------------------------------------------------------------------------------------+
```

---

## 2. Fast-Track Timeline for Pilot Operation Tomorrow

### Phase 0: Rapid Pilot Build (Tonight — 3 to 4 Hours)

```
[20:00 - 20:45] Step 1: Foundation & Design System Setup
                - Initialize Next.js project with TypeScript and Tailwind CSS.
                - Setup color tokens: Green (#0D5C3A), Teal (#0E8388), Warm Amber (#F59E0B), Slate (#F8FAFC).
                - Configure i18n localization dictionary (EN, YO, HA, IG, PCM - Nigerian Pidgin).
                - Setup Prisma schema with core models and initial migration.

[20:45 - 21:45] Step 2: Core User Experience & Multilingual Registration
                - Implement top navigation with persistent language selector and high contrast.
                - Build 5-step registration wizard with 48px touch targets:
                  * Step 1: Basic Info (Name, Phone, State, LGA, Market).
                  * Step 2: Work/Trade selection (Large icon tiles: Market Trader, Tailor, Artisan, etc.).
                  * Step 3: Current insurance status (Yes, No, Unsure).
                  * Step 4: Household coverage preferences.
                  * Step 5: Plain-language NDPA consent and review.
                - LocalStorage auto-save to ensure form recovery on signal loss.
                - Generate formatted reference receipt (`WNH-2026-XXXXXX`) with 1-tap WhatsApp share.

[21:45 - 22:30] Step 3: Verified Scheme Directory & Assistance Module
                - Build Scheme Explorer pre-seeded with KwaraCare and NHIA GIFSHIP data.
                - Build Flexible Financial Assistance intake questionnaire:
                  * Comfortable repayment amounts (₦500/week, ₦1,000/week, ₦2,500/month).
                  * Transparent disclaimer: "Subject to program approval & available funds".

[22:30 - 23:15] Step 4: Assistant Portal & Admin Command Center
                - Assistant Fast-Intake mode: Enables POS operator to register a customer in < 90 seconds.
                - Admin Dashboard:
                  * Live registration counter & charts (by language, trade, state).
                  * Participant management table with search and filtering.
                  * 1-click status updates (`REGISTERED` -> `REFERRED_TO_AGENCY` -> `CONFIRMED`).
                  * CSV Data Export for agency transmission and field debrief.

[23:15 - 23:45] Step 5: Verification, Smoke Testing & Cloud Deployment
                - Execute end-to-end user tests across all 5 languages (EN, YO, HA, IG, PCM).
                - Verify mobile layout in Chrome DevTools (simulating low-end Android on 3G).
                - Deploy to cloud hosting (Vercel) connected to managed PostgreSQL.
```

---

## 3. Tomorrow Morning: Pilot Day Operating Runbook (The Market Protocol)

### 07:30 – 08:30 (Preparation & Tech Health Check)
1. **Device Readiness:**
   - Charge phones and power banks to 100%.
   - Ensure mobile data (MTN / Airtel / Glo) is active on devices.
   - Open `wenaijahealth.com.ng` in Chrome and bookmark the Assistant Portal URL.
2. **Smoke Test Run:**
   - Submit one test registration under the name `PILOT TESTER` in Yoruba and confirm it appears in the Admin Dashboard.
   - Delete or mark test record as `TEST_DATA`.

### 09:00 – 12:30 (Market Intake & Field Engagement)
1. **The Engagement Script (For POS Operators / Assistants):**
   - *English:* "Good morning ma/sir. We are from WeNaijaHealth. We are helping market traders understand how to get government health insurance so you don't have to pay full hospital bills from your pocket when sickness comes. Registration takes only 2 minutes on our phone."
   - *Pidgin:* "Good morning well-done ma/sir! We dey from WeNaijaHealth. We wan help market people register for government health insurance, so dat hospital bills no go shake your business when sickness come. Di register na just 2 minutes for our phone."
2. **Execution Steps:**
   - Open language picker -> let participant pick Pidgin (Naija) / Yoruba / Hausa / Igbo / English.
   - Enter full name, phone number, and trade.
   - Select healthcare needs.
   - Show them the generated Reference Number.
   - Click "Share on WhatsApp" to send the reference number to their phone, or write it on a physical paper token card.

### 13:00 – 14:00 (Mid-Day Sync & Triage)
- Check Admin Dashboard: Count total submissions, check language distribution, inspect any dropped forms.
- Address any participant questions or concerns immediately.

### 16:00 (Post-Pilot Debrief)
- Export CSV of all registered participants.
- Review conversion rate, time-per-intake, and participant feedback.

---

## 4. Reusability & Post-Pilot Evolution (Phases 2 to 5)

```
+-------------------------------------------------------------------------------------+
| PHASE 1: PILOT LAUNCH (TOMORROW)                                                    |
| - Multilingual Registration (5 languages: English, Yoruba, Hausa, Igbo, Pidgin)     |
| - Verified Scheme Directory (KwaraCare + NHIA)                                      |
| - Reference code generator & WhatsApp receipt                                       |
| - Assistant fast-intake & Admin dashboard with CSV export                           |
+-------------------------------------------------------------------------------------+
                                          |
                                          v
+-------------------------------------------------------------------------------------+
| PHASE 2: AGENCY PARTNER PORTALS (WEEKS 1–3)                                         |
| - Official partner login for Kwara State Health Insurance Agency (KWCHIA)           |
| - Batch referral transmission with digital verification acknowledgments              |
| - Bi-directional enrolment status syncing                                           |
+-------------------------------------------------------------------------------------+
                                          |
                                          v
+-------------------------------------------------------------------------------------+
| PHASE 3: AUTOMATED REIMBURSEMENT & PAYMENT INTEGRATION (WEEKS 4–6)                  |
| - Direct Paystack / Monnify integration for flexible repayment collection           |
| - Automated SMS repayment reminders via Termii / BulkSMS                            |
| - Double-entry ledger with automated bank reconciliation                            |
+-------------------------------------------------------------------------------------+
                                          |
                                          v
+-------------------------------------------------------------------------------------+
| PHASE 4: NATIONWIDE COMMUNITY POS EXPANSION (MONTHS 2–3)                            |
| - Automated POS agent KYC verification                                              |
| - Automated ₦2,000 commission escrow & payout triggers                              |
| - Offline-first Progressive Web App (PWA) with background sync                      |
+-------------------------------------------------------------------------------------+
                                          |
                                          v
+-------------------------------------------------------------------------------------+
| PHASE 5: NATIONAL HEALTH INCLUSION ENGINE (MONTHS 4+)                               |
| - Direct integration with NHIA national digital health portal                       |
| - Multilingual AI Voice Assistant for illiterate workers                            |
| - Expansion to all 36 Nigerian states and FCT                                       |
+-------------------------------------------------------------------------------------+
```

---

## 5. Summary of Architecture Principles
1. **Credibility Over Hype:** Never fake agency affiliations or claim active coverage before official authorization.
2. **Extreme Simplicity:** If a tomato seller in Ilorin or Oshodi needs technical instructions to register, the UX has failed.
3. **Resilient Data Design:** Store monetary values in integer Kobo, maintain full audit trails, and ensure zero data loss during network drops.
4. **Cultural Dignity:** Treat market workers as valued economic contributors, with high-quality, professional design and respectful vernacular communication.

# Pilot Operation Decision Brief & Multi-Skill Review
## YC Office Hours · Designer's Eye Review · Eng Manager Architecture Review

**Target:** Pilot Operation (Tomorrow Morning)  
**Product:** WeNaijaHealth (`wenaijahealth.com.ng`)  
**Scope:** Pilot Readiness, User Experience, Technical Architecture, Field Viability

---

## Part 1: YC Office Hours Critique & Reality Check (/office-hours)

### 1. The Core Forcing Questions

#### Q1: What is the narrowest possible wedge for tomorrow?
- **The Trap:** Trying to demo an end-to-end fintech lending platform, an automated NHIA API integration, a POS commission escrow account, and an AI doctor chat all on Day 1. That is a recipe for catastrophic failure in front of market women.
- **The Reality:** The real wedge for tomorrow is **Trust and Frictionless Intake**. 
  Can an informal trader (who has never had health insurance, fears scams, and has no formal salary slip) sit with a friendly POS operator or use their own phone to find their scheme, register in under 3 minutes in their preferred language (Pidgin, Yoruba, Hausa, Igbo, or English), and walk away with a real reference number and transparent next steps?
- **The Pilot Wedge:**
  1. Multilingual Homepage with instant 5-language picker (English, Pidgin, Yoruba, Hausa, Igbo).
  2. 5-Step Assisted or Self-Serve Registration (Name, Language, Phone, Trade, Scheme Interest).
  3. Real verified Scheme Directory (KwaraCare / NHIA GIFSHIP) showing actual benefits and realistic costs.
  4. Honest Financial Assistance Application (collecting repayment preferences without making false promises of instant free money).
  5. Instant Reference Slip (`WNH-2026-XXXXXX`) that can be saved, screenshotted, or shared via WhatsApp.
  6. Functional Admin Dashboard for the team to view, filter, verify, and export the registrations.

#### Q2: What status quo are we actually replacing?
- Today, informal workers either pay out-of-pocket at patent medicine vendors (chemist shops) when sick, borrow money from thrift/esusu groups at usurious rates, or avoid hospitals until conditions are catastrophic.
- Traditional HMOs ignore them because they lack monthly payroll deductions.
- Government schemes (NHIA / State Health Agencies) exist, but the enrolment forms are bureaucratic, websites are often down or confusing, and payment requires lump-sum annual commitments (₦12,000–₦15,000 upfront) that daily-income earners cannot spare in one day.

#### Q3: How do we avoid "Founder Cosplay" & Protect Credibility?
- **Crucial Rule:** We must **NEVER** claim or display:
  - *"In official partnership with the Federal Ministry of Health"* (unless a formal signed MOU exists).
  - *"Your health insurance is now active!"* upon submitting our form.
  - *"We guarantee 100% free healthcare."*
- **How We Win Trust:** Be aggressively honest.
  - State clearly: *"WeNaijaHealth is an independent access platform that guides you to official government and state schemes and helps arrange flexible support. Your official coverage is activated by the scheme authority upon verification."*
  - This level of transparency makes government partners, donors, and informal workers trust the platform instantly.

---

## Part 2: Designer's Eye Plan Review (/plan-design-review)

### Design Dimensions Scorecard (0–10)

```
[Design Dimension]               [Current Score]  [Target for 10/10]
1. Visual Hierarchy & Scannability:   8.5/10  -->  Make primary CTA 54px high; sticky bottom action on mobile
2. Typography & Contrast (Sunlight):  8.0/10  -->  Inter font, minimum 16px body, 4.5:1+ contrast against white
3. Mobile Ergonomics (Thumb Zone):    9.0/10  -->  All interactive buttons in lower 60% of viewport
4. Multilingual Cultural Tone:        9.0/10  -->  Full 5-language native copy (Pidgin: "Your work no suppose chop your health"; Yoruba: "Ètò Ìbánisọ̀rọ̀ Ìlera")
5. Cognitive Load & Friction:         9.5/10  -->  1–2 questions per step; zero typing required for trade/needs
6. Trust & Transparency:              9.0/10  -->  Official disclaimers in clear language; verifiable reference code
7. Form Validation & Error States:    8.0/10  -->  Inline green checkmarks; non-punitive errors ("Please enter 11 digits")
8. Anti-AI Slop Aesthetic:           9.5/10  -->  Authentic Nigerian green palette; clean cards; zero generic 3D blobs
9. Proof / Receipt Delivery UX:       9.0/10  -->  Dedicated confirmation card with 1-tap WhatsApp share
10. Offline / Low Signal UX:          7.5/10  -->  LocalStorage draft persistence so form state is never lost
```

### Usability Heuristics & Field Rules
1. **The 3-Second Billboard Rule (Krug):**
   - In 3 seconds, a market woman must understand:
     - English: *"Your Work Shouldn't Cost You Your Health. Health insurance made simple for market traders and artisans."*
     - Pidgin: *"Your Work No Suppose Chop Your Health. Beta health insurance wey simple for every market person and artisan."*
2. **Zero Medical Jargon:**
   - Replace *"Premium contribution"* with *"Cost per year / month"*.
   - Replace *"Capitation and fee-for-service provider network"* with *"Clinics and general hospitals near you"*.
   - Replace *"Underwriting exclusions"* with *"What is covered and what is not covered"*.
3. **Touch Targets for Working Hands:**
   - Market traders often use phones with greasy, wet, or dusted fingers in outdoor daylight.
   - Buttons must be at least **48px x 48px** with clear active feedback and high contrast.

---

## Part 3: Engineering Manager Architecture Review (/plan-eng-review)

### 1. Architecture Simplicity ("Choose Boring Technology")
- **Framework:** Next.js (App Router) with TypeScript.
  - Single, robust codebase handling responsive mobile client, server actions, and administrative views.
  - Fast server-side rendering for quick first-contentful-paint on 3G connections.
- **Styling:** Vanilla CSS / Tailwind CSS utility tokens.
  - Predictable, lightweight CSS payload with zero runtime performance penalty.
- **Database:** PostgreSQL with Prisma ORM.
  - Schema with strict relational integrity, foreign key cascades, and timestamp auditing.
  - Money stored as minor integer units (Kobo) to eliminate IEEE floating-point rounding errors.

### 2. Blast Radius & Fault Isolation

```
+-----------------------------------------------------------------------------------+
|                              WeNaijaHealth Platform                               |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +--------------------+     +---------------------+     +----------------------+  |
|  |   Participant UI   |     |   Assistant Portal  |     |   Admin Dashboard    |  |
|  |   (Mobile-First)   |     |     (Quick Form)    |     |   (Audits & Ledger)  |  |
|  +---------+----------+     +----------+----------+     +----------+-----------+  |
|            |                           |                           |              |
|            +---------------------------+---------------------------+              |
|                                        |                                          |
|                                        v                                          |
|                         +------------------------------+                          |
|                         |  Next.js Server API & Zod    |                          |
|                         +--------------+---------------+                          |
|                                        |                                          |
|                 +----------------------+----------------------+                   |
|                 |                                             |                   |
|                 v                                             v                   |
|    +-------------------------+                   +-------------------------+      |
|    |    Database Layer       |                   |   Integration Adapters  |      |
|    |  (PostgreSQL / Prisma)  |                   |   (SMS / Agency / Pay)  |      |
|    |                         |                   |                         |      |
|    | - Participants          |                   | - SMS Gateway (Termii)  |      |
|    | - Registrations         |                   |   [Mock/Live Fallback]  |      |
|    | - Scheme Directory      |                   | - NHIA / State Stubs    |      |
|    | - Reimbursement Ledger  |                   | - Resend Email Adapter  |      |
|    | - Audit Logs            |                   +-------------------------+      |
|    +-------------------------+                                                    |
+-----------------------------------------------------------------------------------+
```

### 3. Resilience Against Nigerian Market Realities
- **Unreliable Power & Connectivity:** 
  - If network drops during registration, form state is backed up to `localStorage` every 5 seconds.
  - If the user reloads or connection returns, the form resumes at the exact step without re-typing.
- **Simulated Provider Safety:**
  - If external SMS gateway credits are exhausted or unconfigured, the system **never fails the registration**.
  - Instead, the SMS dispatch is saved as `PENDING_GATEWAY_CONFIG` in `NotificationLogs` with an alert on the admin screen, while the user immediately receives their on-screen reference code.

---

## Part 4: Operational Decisions for Tomorrow's Pilot

### Decision D1: Financial Reimbursement Handling for Pilot Day
- **Option A (Recommended):** **Application & Eligibility Assessment Mode**
  - Participants indicate interest in flexible payments (weekly/monthly) and their comfortable amount. The system logs their application as `UNDER_REVIEW`. Staff review and explain the program during follow-up.
  - *Pros:* Zero financial risk on Day 1; 100% compliant with lending/banking regulations; tests demand directly.
  - *Cons:* Does not disburse instant cash in the market stall.
- **Option B:** Live Float Disbursal on Day 1
  - *Risk:* High cash risk, reconciliation errors, potential regulatory scrutiny without partner bank escrow.
- **Verdict:** **Execute Option A.**

### Decision D2: Language Selection Default
- **Option A (Recommended):** **Prominent 5-Button Modal on First Visit**
  - Modal prompts: *"Which language do you prefer? / Which language you prefer? / Èdè wo lo fẹ́? / Wace harshe kuke so? / Kedu asụsụ ị kacha chọọ?"*
  - 5 Large Selectable Options: **English** · **Pidgin (Naija)** · **Yorùbá** · **Hausa** · **Asụsụ Igbo**
  - Saves choice in cookie/localStorage; toggle always accessible in top navigation bar.
- **Verdict:** **Execute Option A.**

### Decision D3: Primary State Scheme Featured for Tomorrow
- **Option A (Recommended):** **KwaraCare (Kwara State Health Insurance Agency) & NHIA GIFSHIP**
  - Pre-seed with actual KwaraCare pricing (₦12,000/year or ₦3,000/quarter) and verified general hospital / primary healthcare centre networks in Kwara (Ilorin, Offa, etc.).
- **Verdict:** **Execute Option A.**

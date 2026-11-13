# HealthSure Connect — Production Deployment Pre-Flight Checklist
> **Date:** November 2026  
> **Target Platforms:** Vercel (Recommended for Next.js Frontend & API) + Supabase (PostgreSQL Database)  
> **Status:** All codebases compiled, database seeded, schemas synced

---

## 1. Production Architecture Overview

```
                      [ Nigerian Informal Workers / Public ]
                                       │
                                       ▼
                       [ Vercel / Railway Hosting ]
                   Next.js 16 App Router (SSR + Static)
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
       [ Supabase PostgreSQL ]                       [ Resend Email API ]
   Connection Pooler (Port 6543)                 Instant Triage Team Alerts
  Users, Registrations, Follow-Ups,                 to team.accesscare@gmail.com
  Schemes, Inquiries, Audit Logs
```

---

## 2. Environment Variables Required on Vercel / Railway

Set these exact environment variables in your hosting provider's dashboard (**Project Settings → Environment Variables**):

| Variable Name | Production Value / Description | Sensitive? |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.bhxluasuibkhnnbdunnl:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | 🔒 Yes |
| `DIRECT_URL` | `postgresql://postgres.bhxluasuibkhnnbdunnl:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres` | 🔒 Yes |
| `RESEND_API_KEY` | Your Resend API key (e.g. `re_...`) from your local `.env` | 🔒 Yes |
| `TEAM_NOTIFICATION_EMAIL` | `team.accesscare@gmail.com` | No |
| `NEXTAUTH_SECRET` | Generate a 32-character random string (e.g., `openssl rand -base64 32`) | 🔒 Yes |
| `NEXTAUTH_URL` | Your live production domain (e.g., `https://healthsureconnect.org` or `https://healthsure-connect.vercel.app`) | No |

---

## 3. Step-by-Step Vercel Deployment Guide

### Option A: Via GitHub (Recommended)
1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete modular full-stack with PostgreSQL, notifications, and operations triage portal"
   git push origin main
   ```
2. **Import Project into Vercel:**
   - Log in to [vercel.com](https://vercel.com).
   - Click **"Add New..." → "Project"**.
   - Select your `We_Naija_Health` repository.
3. **Configure Project Settings:**
   - **Root Directory:** Set to `app-src` *(crucial since Next.js lives in the `app-src` subfolder)*.
   - **Framework Preset:** `Next.js` (auto-detected).
   - **Build Command:** `prisma generate && next build` (automatically runs via `package.json`).
4. **Add Environment Variables:**
   - Copy-paste the 6 variables from the table above.
5. **Click "Deploy":**
   - Vercel builds the project in ~45 seconds and gives you an instant live URL (e.g. `https://healthsure-connect.vercel.app`).

---

## 4. Pre-Launch Verification Run (Sanity Checks)

Once deployed, verify these 5 critical workflows on the live production URL:

1. **Public Site Accessibility:**
   - Open `/` (Homepage in 5 languages: English, Pidgin, Yorùbá, Hausa, Igbo).
   - Open `/schemes` (Verify KwaraCare, NHIA BHCPF, NHIA GIFSHIP plans render).
   - Open `/about` (Verify FAQ accordion opens and responds).
   - Open `/privacy` and `/terms` (Verify legal disclosures load without 404).

2. **End-to-End Registration Test:**
   - Navigate to `/register`.
   - Submit a test registration (e.g., test market trader with phone `080XXXXXXXX`).
   - Check confirmation screen: verify reference code appears (`HSC-YYYYMMDD-XXXXX`).

3. **Email Notification Check:**
   - Check the inbox of `team.accesscare@gmail.com`.
   - Verify branded alert received with the participant's name, phone, trade, and direct dial buttons.

4. **Operations Command Center Check:**
   - Open `/admin` on the live domain.
   - Verify KPI cards reflect the new test registration.
   - Open `/admin/registrations/[id]`.
   - Test the pre-filled **WhatsApp (Pidgin)** button and verify it opens WhatsApp with the customized greeting.
   - Log a test follow-up entry ("Attempted call — line busy, sent WhatsApp message") and verify it appears on the timeline.

5. **Custom Domain Setup (Optional):**
   - On Vercel: go to **Project Settings → Domains**.
   - Add your custom domain (e.g. `healthsureconnect.org`).
   - Update DNS records at your domain registrar (A record to `76.76.21.21`).


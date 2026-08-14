# SaathiCare — Home Care & Patient Assistance Marketplace

**Trusted care for the people you love.**

## Quick Start

### 1. Set up PostgreSQL

Use [Neon](https://neon.tech) (free) or local PostgreSQL. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set `DATABASE_URL` and `AUTH_SECRET` (generate with `openssl rand -base64 32`).

### 2. Initialize database

```bash
npm run db:setup
```

This runs migrations and seeds demo data (caregivers, customer, bookings).

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role | Phone | Notes |
|------|-------|-------|
| Customer | +91 99887 76600 | Seeded with bookings |
| Caregiver | +91 98765 43210 | Lakshmi Devi |
| Admin | +91 99887 76655 | Admin dashboard |

OTP is shown in the UI when `DEV_OTP_EXPOSE=true`.

## What's Real Now

- **PostgreSQL** — users, caregivers, bookings, reviews, care events
- **Phone OTP auth** — JWT sessions with role-based access
- **Booking lifecycle** — create → pay → confirm → start → complete
- **Caregiver actions** — accept, reject, start service, end service
- **Care events** — check-in, activities, SOS alerts persisted
- **Reviews** — saved to DB, updates caregiver rating
- **Admin** — verification queue, stats from real data
- **Payments** — demo mode (no Razorpay keys needed); add keys for production

## Vercel Deployment

Set these environment variables in Vercel:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=<random-32-char-secret>
DEV_OTP_EXPOSE=false
RAZORPAY_KEY_ID=... (optional)
RAZORPAY_KEY_SECRET=... (optional)
```

After deploy, run `npm run db:setup` against your production database (locally with production DATABASE_URL).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:setup` | Push schema + seed data |
| `npm run db:seed` | Re-seed data only |

## Tech Stack

Next.js 16 · TypeScript · Tailwind · shadcn/ui · Prisma · PostgreSQL · Jose (JWT) · Razorpay

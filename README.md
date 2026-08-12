# SaathiCare — Home Care & Patient Assistance Marketplace

**Trusted care for the people you love.**

A modern marketplace platform where families can find and book verified caregivers and home-care professionals for elderly people, patients, and hospital assistance.

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (schema ready, mock data for MVP)
- **Auth:** Phone OTP + Email (UI implemented)
- **Payments:** Razorpay (demo UI)
- **AI Matching:** Rule-based requirement parser with extensible matching engine

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Key Routes

### Customer
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Customer login (OTP) |
| `/register` | Customer registration |
| `/home` | Customer dashboard |
| `/book` | Multi-step booking flow with AI assistant |
| `/caregivers/[id]` | Caregiver profile |
| `/booking/payment` | Payment page |
| `/booking/active` | Active booking tracking |
| `/family` | Family care dashboard |
| `/history` | Booking history |
| `/reviews` | Leave a review |
| `/profile` | Customer profile |

### Caregiver
| Route | Description |
|-------|-------------|
| `/caregiver/login` | Caregiver login |
| `/caregiver/register` | Caregiver onboarding |
| `/caregiver/dashboard` | Job requests, earnings, stats |

### Admin
| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Overview, bookings, caregivers, reviews |

## Features

- **AI Requirement Assistant** — Natural language input parsed into structured booking data
- **Smart Caregiver Matching** — Score-based matching with explained recommendations
- **Family Care Dashboard** — Real-time activity tracking for remote family members
- **Trust & Safety** — Verification badges, SOS button, check-in/check-out
- **Multi-role Support** — Customer, Caregiver, and Admin portals

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
├── components/
│   ├── booking/          # Booking flow components
│   ├── caregiver/        # Caregiver cards & profiles
│   ├── landing/          # Landing page sections
│   ├── layout/           # Navbar, Footer
│   ├── shared/           # Reusable UI components
│   └── ui/               # shadcn/ui primitives
├── contexts/             # React context (booking state)
└── lib/
    ├── ai-parser.ts      # Requirement parsing logic
    ├── matching.ts       # Caregiver matching algorithm
    ├── mock-data.ts      # Realistic mock data
    ├── types.ts          # TypeScript types
    └── constants.ts      # App constants & config
```

## MVP Scope

This MVP includes all 13 priority features with realistic mock data:

1. Customer registration
2. Caregiver registration
3. Caregiver verification status
4. Service selection
5. Requirement creation (with AI)
6. Caregiver search & matching
7. Caregiver profiles
8. Booking flow
9. Payment (demo)
10. Booking status tracking
11. Check-in/check-out
12. Reviews
13. Admin dashboard

## Disclaimer

SaathiCare provides trained, verified caregivers for **non-medical assistance**. Caregivers are not licensed nurses or doctors.

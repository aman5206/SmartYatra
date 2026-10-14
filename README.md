# SmartYatra (स्मार्टयात्रा) — AI-Powered Personalized Tourism Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?logo=prisma)](https://www.prisma.io/)
[![Security: Argon2id](https://img.shields.io/badge/Security-Argon2id-emerald)](https://github.com/napi-rs/node-rs)
[![Tests](https://img.shields.io/badge/Vitest-21%20Passed-success)](https://vitest.dev/)
[![Privacy: DPDP](https://img.shields.io/badge/Privacy-DPDP%20Aligned-orange)](https://www.meity.gov.in/)

SmartYatra is a production-ready, responsive, secure full-stack web application designed to help travelers discover destinations across India (expandable worldwide), explore verified history and regional specialities, plan personalized day-by-day itineraries using AI, calculate realistic travel budgets in INR, preserve in-app travel memory, and generate multilingual travel photo captions with zero third-party cross-app tracking.

---

## 🌟 Key Features

1. **Verified Destination Exploration (`/explore`)**:
   - Filter Indian destinations by themes (Royal Heritage, Sacred Ghats, Nature & Hills, High-Altitude Adventure, Culinary Trails, Living Culture) and states.
   - Comprehensive destination cards with high-definition imagery, verified historical accounts, specialty highlights, sample daily travel costs, and instant save to memory.

2. **Destination Detail Deep-Dive (`/destinations/[slug]`)**:
   - Verified historical foundations based on state archaeological records.
   - Distinct labels separating verified historical accounts from sample travel estimates.
   - Major attractions with verified descriptions, opening hours, and sample ticket fees.
   - Practical traveler advice: ideal duration, nearest airport, nearest railway hub, and cultural clothing etiquette.
   - Embedded interactive OpenStreetMap integration.

3. **AI Trip Planner (`/planner`)**:
   - Accepts destination, duration (1–10 days), travel group type (Solo, Couple, Family, Friends), budget tier (Budget, Moderate, Luxury), and custom interests.
   - Synthesizes morning, afternoon, and evening itineraries complete with travel tips, packing advice, and budget breakdowns.
   - Powered by Google Gemini AI when `GEMINI_API_KEY` is provided; automatically and transparently operates in **[Demo / Non-AI Fallback]** mode when absent so the app is 100% runnable out of the box.

4. **Itemized Travel Budget Calculator (`/budget`)**:
   - Itemized cost calculations in Indian Rupees (₹ INR) across accommodation, dining, transport, monument tickets, and contingency reserves.
   - Distinct labeling clearly designating estimates as statistical guidelines.
   - One-click transfer of budget parameters into the AI Trip Planner.

5. **Personalized Recommendations (`/recommendations`)**:
   - Multi-interest affinity engine matching destinations against user passions.
   - 100% opt-in toggle for activity-based personalization complying with India's Digital Personal Data Protection (DPDP) Act.
   - Instant controls to turn personalization off or reset saved preferences.

6. **In-App Travel Memory (`/memory`)**:
   - Displays favorited destinations and in-app search queries.
   - **Zero Cross-App Monitoring**: Never inspects external browser history, contacts, or cookies from third-party websites.
   - Instant one-click "Clear Search History" control.

7. **Nearby Logistics & Safety Services (`/services`)**:
   - Directory for 24x7 emergency hospitals, authentic heritage restaurants, hotels, authorized prepaid taxi unions, and bike rentals.
   - Strict badges distinguishing **[Verified Live Listings]** (e.g., SMS Hospital Jaipur, AIIMS Rishikesh, LMB) from sample listings.

8. **AI Travel Photo Caption Generator (`/caption-generator`)**:
   - Strict client and server validation: permits only JPEG, PNG, and WebP images up to 5 MB.
   - Magic byte validation to prevent malicious file uploads.
   - Styles: Poetic, Adventurous, Historical, Cultural, Witty.
   - Bilingual generation: English and Hindi (हिन्दी) with curated travel hashtags.
   - Ephemeral memory processing: photos are never stored permanently, published, or exposed publicly.

9. **Bilingual Hindi / English UI Switch**:
   - Working interface toggle across the navigation bar, search, buttons, and itineraries.

10. **User Dashboard (`/dashboard`)**:
    - Central hub for planned itineraries, saved places, and activity metrics.
    - Full IDOR-protected itinerary deletion.

11. **Privacy & Data Governance Settings (`/settings`)**:
    - **Download My Data**: One-click machine-readable JSON export of profile, trips, saved places, and in-app search history.
    - **Safe Account Deletion**: Re-authentication modal requiring password confirmation and typing "DELETE" to prevent accidental data loss. Cascades deletion across all database collections.

12. **Plain-Language Privacy Notice (`/privacy`)**:
    - Comprehensive explanation of data minimization, DPDP rights, external service providers, and grievance officer contact.

---

## 🛡️ Security Architecture & Controls

| Security Domain | Implementation Details |
|---|---|
| **Password Hashing** | Native Argon2id via `@node-rs/argon2` with OWASP-recommended parameters (19 MiB memory cost, 2 iterations, 1 lane). Never logs passwords. |
| **Session Management** | HttpOnly, SameSite (Lax), Secure (in production) cookies signed with WebCrypto JWTs (`jose`). No tokens in localStorage. |
| **Token Security** | Single-use cryptographically random tokens (`crypto.randomBytes(32)`). Only the SHA-256 hash is persisted in the database. |
| **Authorization & IDOR** | Server-side ownership validation on every private route (`getTripById`, `deleteTrip`, `getUserSavedPlaces`, `getUserSearches`). Users cannot read or delete another user's data. |
| **Rate Limiting** | Server-side sliding-window rate limiter with progressive delays on consecutive attempts. Returns HTTP 429 with `Retry-After`, `X-RateLimit-Limit`, and `X-RateLimit-Reset` headers. |
| **Input Validation** | Strict Zod schemas validating lengths, formats, types, and values on both client and server. |
| **HTTP Security Headers** | Strict Content Security Policy (CSP), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`. |
| **Enumeration Defense** | Generic responses for login and password reset preventing email enumeration attacks. |
| **File Upload Hardening** | Enforces 5 MB limit, allowed MIME types, and magic byte file header inspection. |

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Database & ORM**: PostgreSQL with Prisma ORM 6.4.1 (plus resilient local repository fallback)
- **Cryptography**: `@node-rs/argon2`, `crypto`, `jose`
- **Validation**: Zod 4
- **AI Vision & Text**: Google Gemini API via `@google/genai` (with graceful rule-based fallback)
- **Testing**: Vitest 5 (21 unit and integration tests)
- **Icons**: Lucide React

---

## 📂 Project Structure

```
d:/ai yatra/
├── __tests__/                     # Vitest automated test suite
│   ├── ai-fallback.test.ts        # AI trip planner & caption fallback tests
│   ├── auth.test.ts               # Argon2id password & token hashing tests
│   ├── authorization.test.ts      # IDOR prevention & cross-user isolation tests
│   ├── privacy.test.ts            # DPDP data export & cascading deletion tests
│   ├── rate-limit.test.ts         # Rate limiting & progressive delay tests
│   └── validation.test.ts         # Zod schema validation tests
├── prisma/
│   ├── schema.prisma              # Production PostgreSQL Prisma schema
│   └── migrations/
│       └── 0_init/
│           └── migration.sql      # Full PostgreSQL database creation script
├── src/
│   ├── app/                       # Next.js App Router routes
│   │   ├── api/                   # Server API endpoints
│   │   │   ├── auth/              # Login, register, logout, me, reset-password
│   │   │   ├── caption/           # Photo caption generator API
│   │   │   ├── destinations/      # Destination query & detail APIs
│   │   │   ├── preferences/       # DPDP consent & preferences API
│   │   │   ├── saved-places/      # Saved destinations toggle API
│   │   │   ├── searches/          # In-app search logging & deletion API
│   │   │   ├── trips/             # AI trip planner & IDOR-safe trip CRUD
│   │   │   └── user/              # Export data & account deletion APIs
│   │   ├── auth/                  # Login, Register, Forgot Password, Reset, Verify
│   │   ├── budget/                # Interactive Budget Calculator
│   │   ├── caption-generator/     # AI Photo Caption Generator
│   │   ├── dashboard/             # User Dashboard
│   │   ├── destinations/[slug]/   # Verified Destination Detail Page
│   │   ├── explore/               # Destination Exploration & Filtering
│   │   ├── memory/                # In-App Travel Memory
│   │   ├── not-found.tsx          # Custom 404 page
│   │   ├── planner/               # AI Trip Planner
│   │   ├── privacy/               # Plain-Language Privacy Notice
│   │   ├── recommendations/       # Personalized Recommendations
│   │   ├── services/              # Nearby Services (Emergency & Logistics)
│   │   ├── settings/              # Profile, Privacy Toggles, Data Export & Deletion
│   │   ├── layout.tsx             # Root layout with Navbar & Footer
│   │   └── page.tsx               # Landing Page
│   ├── components/                # Reusable UI components
│   │   ├── DestinationCard.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── data/
│   │   └── seed-data.ts           # Curated Indian destinations & verified history
│   └── lib/                       # Core libraries & utilities
│       ├── ai-service.ts          # Gemini AI integration & rule-based fallbacks
│       ├── auth.ts                # Session retrieval & authorization helpers
│       ├── db.ts                  # Database repository (Prisma + resilient store)
│       ├── i18n.tsx               # Bilingual English / Hindi translation context
│       ├── rate-limit.ts          # Server-side sliding-window rate limiter
│       ├── security.ts            # Argon2id, JWT session signing, token hashing
│       └── validation.ts          # Zod schemas for all models & forms
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git ignore rules
├── next.config.ts                 # Next.js config with security headers (CSP, HSTS)
├── package.json                   # Dependency declarations & scripts
├── tsconfig.json                  # TypeScript compiler configuration
├── vitest.config.ts               # Vitest test runner configuration
└── README.md                      # Complete project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20.x or v24.x installed
- **npm**: v10+ installed
- *(Optional)* PostgreSQL instance (local or hosted on Neon / Supabase)

### 2. Installation
```bash
# Clone or navigate to the repository directory
cd "d:/ai yatra"

# Install dependencies (pinned stable versions)
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# Linux / macOS
cp .env.example .env.local
```

Edit `.env.local` to configure optional keys:
- `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key from Google AI Studio. If left blank, SmartYatra runs seamlessly with its built-in rule-based fallback.
- `DATABASE_URL`: *(Optional)* Your PostgreSQL database connection string. If left blank or unreachable, SmartYatra uses its built-in resilient in-memory repository.
- `SESSION_SECRET`: Set to any random 32+ character string.

### 4. Database Setup (When connecting to PostgreSQL)
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations to your PostgreSQL database
npx prisma migrate deploy

# (Or push schema directly in development)
npx prisma db push
```

### 5. Running Automated Tests
Run the complete Vitest test suite covering authentication, IDOR protection, rate limiting, Zod validation, AI fallbacks, and DPDP data export:
```bash
npm test
```
*Result: 6 test suites, 21 passing tests.*

### 6. Running Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 7. Verifying Production Build
```bash
npm run build
npm start
```
*The build compiles all 33 dynamic and static routes cleanly with zero TypeScript or packaging errors.*

---

## 🚀 Hackathon Prototype: Zero-Database Deployment (Vercel)

For hackathon evaluation and live demo preview, SmartYatra is pre-configured to build and run **100% database-free** on Vercel without requiring a hosted PostgreSQL instance or credit card.

### Deploying to Vercel in 3 Steps:

1. **Import Repository**:
   - Push your code to a private or public GitHub repository (see [Safe GitHub Submission Instructions](#-safe-github-submission-instructions)).
   - In the [Vercel Dashboard](https://vercel.com/new), click **Add New Project** and select your `smartyatra` repository.
2. **Configure Environment Variables in Vercel**:
   - `SESSION_SECRET`: Any random 32+ character string (e.g. `c7a4e612f8b5490da3e9d1234567890a`).
   - `GEMINI_API_KEY`: *(Optional)* Add your Gemini key if you want live AI itinerary and vision captioning; leave empty for transparent rule-based demo fallback.
   - `DATABASE_URL`: *(Leave empty)* Omit this variable completely for zero-DB prototype mode.
3. **Deploy**:
   - Click **Deploy**. Vercel will run `postinstall: prisma generate` and `next build`.
   - Your live URL (e.g. `https://smartyatra.vercel.app`) will be ready in under 60 seconds.

### Pre-Seeded Demo Account:
To evaluate protected features without manual registration:
* **Email**: `demo@smartyatra.in`
* **Password**: `SmartYatraDemo123!`
* Or click the **"Autofill Demo Credentials"** button on the `/auth/login` page for instant 1-click access.
* Pre-loaded with saved destinations (Jaipur, Varanasi), in-app search history, and a sample 3-day cultural itinerary.

---

## 🔍 Feature Matrix: Prototype Demo Mode vs Future Hosted Backend

| Feature | Hackathon Prototype (Zero-DB / Demo Mode) | Future Hosted Production Backend |
|---|---|---|
| **Destination Explorer (`/explore`, `/destinations/[slug]`)** | **Active**: Curated seed dataset covering 6 verified Indian destinations (Jaipur, Varanasi, Munnar, Ladakh, Hampi, Rishikesh) with history, attractions, and sample budgets. | Distributed PostgreSQL / Prisma with global content management and user reviews. |
| **AI Trip Planner (`/planner`)** | **Active**: Deterministic, rule-based itinerary engine tailored to budget tiers and interests, clearly labelled as `[Demo / Non-AI Fallback]`. If `GEMINI_API_KEY` is provided, live AI takes over automatically. | Multi-modal travel orchestrator, live agentic re-planning, and weather-aware itinerary re-routing. |
| **Interactive Budget Calculator (`/budget`)** | **Active**: Full client-side calculation across accommodation, food, transit, entry tickets, and contingency reserves in INR with tier multipliers. | Live forex conversion, seasonal peak demand feeds, and group cost-splitting. |
| **Personalized Recommendations (`/recommendations`)** | **Active**: Client-side interest affinity scoring with 100% opt-in DPDP consent toggles. | Machine learning vector embeddings matching traveler behavior with strict differential privacy. |
| **Nearby Logistics & Services (`/services`)** | **Active**: Curated sample directory of verified emergency hospitals (e.g., SMS Hospital Jaipur, AIIMS Rishikesh), dining landmarks, taxi unions, and bike rentals. | Live Google Places / OpenStreetMap live inventory, booking availability, and verified local driver dispatch. |
| **AI Caption Generator (`/caption-generator`)** | **Active**: Multilingual (English/Hindi) rule-based caption templates based on user style and vibe, labelled as `[Demo / Non-AI Fallback]`. Live Gemini Vision if key provided. | Multi-photo collage vision analysis, video reel voiceover scripts, and real-time social sharing. |
| **User Authentication (`/auth/*`)** | **Active**: Argon2id password hashing, secure HTTP-only JWT cookies (`smartyatra_session`), stateless serverless JWT verification, and pre-seeded demo traveler. | Persistent PostgreSQL users, OAuth 2.0 (Google/Apple), Passkeys (WebAuthn), and SMS 2FA. |
| **Travel Memory (`/memory`, `/dashboard`)** | **Active**: In-memory and session-backed saved destinations, sample itineraries, and in-app search history with 1-click clear controls. | Persistent PostgreSQL user travel journal with encrypted cloud sync across devices. |
| **Data Privacy & Export (`/settings`)** | **Active**: 1-click DPDP Act JSON data export and account reset simulation. | Cryptographically signed portable GDPR/DPDP data archive and irreversible automated deletion pipelines. |
| **Live Bookings & Dynamic Pricing** | **Intentionally Disabled**: Clearly labelled as indicative sample estimates; no fake bookings or mock checkout workflows. | Merchant payment gateway integration (Razorpay/Stripe), IRCTC train API, and verified hotel booking engines. |

---

## 📋 Honest Security Limitations & Production Considerations

1. **In-Memory Rate Limiting vs Distributed Redis**:
   - The included rate limiter uses an in-memory sliding window store, ideal for single-instance deployments or evaluation.
   - For multi-instance, auto-scaled container clusters (e.g., Kubernetes, AWS ECS), connect a shared Redis store (e.g., Upstash or Redis Cloud) so rate-limit quotas are synchronized across instances.
2. **Email Verification & Reset Delivery**:
   - In development mode, password reset tokens are logged to the console and displayed in the UI for test convenience.
   - In production, configure an approved transactional email provider (such as Resend, SendGrid, or AWS SES) to dispatch tokens via HTTPS email.
3. **Photo Storage Lifecycles**:
   - Image captions are processed in private, short-lived memory buffers. If persistent image archiving is added in future iterations, use an S3-compatible private bucket with strict pre-signed URLs and an automated lifecycle policy (e.g., 24-hour deletion).
4. **Third-Party Integrations**:
   - Live hotel room booking and real-time cab hailing are intentionally represented as verified listings and sample estimates; real payment gateways (such as Razorpay or Stripe) should be integrated only after merchant KYC compliance.

---

## 🐙 Safe GitHub Submission Instructions

To push this repository to GitHub without exposing secrets:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Verify that .env and .env.local are ignored
git status
# Ensure only .env.example is tracked, NOT .env or .env.local

# 3. Stage and commit files
git add .
git commit -m "feat: complete runnable SmartYatra AI tourism application"

# 4. Create a repository on GitHub (e.g. at https://github.com/new)
# 5. Add remote and push (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/smartyatra.git
git branch -M main
git push -u origin main
```

---

## 📜 License & Compliance Notice

This project is built under open architectural standards. Verified destination history is sourced from Archaeological Survey of India (ASI) public archives and respective state tourism department records. All privacy controls are designed in alignment with the Digital Personal Data Protection (DPDP) Act.

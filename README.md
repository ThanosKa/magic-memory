<div align="center">

# magic-memory

![magic-memory Banner](/public/og-image.png)

**AI-powered photo restoration that brings your memories back to life**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/restore-photos?style=social)](https://github.com/yourusername/restore-photos)

[Demo](https://magic-memory.app) · [Report Bug](https://github.com/yourusername/magic-memory/issues) · [Request Feature](https://github.com/yourusername/magic-memory/issues)

</div>

---

## Features

- **AI-Powered Restoration** - Uses GFPGAN model via Replicate API for state-of-the-art face restoration
- **Free Daily Credits** - 1 free restoration per day, resets at midnight UTC
- **Credit Packages** - Purchase credits that never expire (100, 350, or 1000 credits)
- **Instant Results** - Get restored photos in 5-15 seconds
- **Interactive Comparison** - Slider and side-by-side comparison views
- **NSFW Detection** - Client-side content filtering before upload
- **Secure Authentication** - Google OAuth via Clerk
- **Stripe Payments** - Secure payment processing for credit purchases

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Authentication** | Clerk |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **AI Model** | GFPGAN via Replicate API |
| **Rate Limiting** | Upstash Redis |
| **Payments** | Stripe |
| **Logging** | Pino |
| **Validation** | Zod |
| **Animations** | Framer Motion |
| **Deployment** | Vercel |

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Accounts for: Clerk, Supabase, Stripe, Replicate, Upstash

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/magic-memory.git
cd magic-memory

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual API keys

# Run database migrations (in Supabase SQL Editor)
# Execute scripts/001_create_users_table.sql through scripts/005_create_atomic_credit_functions.sql

# Start development server
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

See [`.env.example`](.env.example) for the full list of required variables and where to obtain them.

## Project Structure

\`\`\`
magic-memory/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── credits/       # Credit management
│   │   ├── restore/       # Photo restoration
│   │   ├── stripe/        # Payment webhooks
│   │   └── upload/        # File uploads
│   ├── pricing/           # Pricing page
│   ├── restore/           # Restore page (protected)
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── landing/          # Landing page sections
│   ├── pricing/          # Pricing components
│   ├── restore/          # Restore tool components
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase clients
│   ├── validations/      # Zod schemas
│   ├── constants.ts      # App constants
│   ├── logger.ts         # Pino logger
│   └── redis.ts          # Upstash Redis client
├── scripts/              # Database migrations
├── .cursor/              # Cursor IDE rules
└── agents.md             # AI agent guidelines
\`\`\`

## Database Schema

### Users
- `id` (uuid, PK)
- `clerk_user_id` (text, unique)
- `email` (text, unique)
- `name` (text)
- `profile_image` (text)
- `paid_credits` (integer, default: 0)
- `created_at`, `updated_at` (timestamps)

### Restorations
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `original_image_url` (text)
- `restored_image_url` (text)
- `used_free_credit` (boolean)
- `created_at` (timestamp)

### Purchases
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `stripe_payment_id` (text)
- `credits_purchased` (integer)
- `amount_paid` (integer, cents)
- `package_type` (text)
- `created_at` (timestamp)

## Credit System

| Type | Credits | Price | Expiry |
|------|---------|-------|--------|
| Free | 1/day | $0 | Resets at midnight UTC |
| Starter | 100 | $9 | Never |
| Growth | 350 | $19 | Never |
| Premium | 1000 | $29 | Never |

**Priority**: Free credits are used first, then paid credits.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/credits` | GET | Get user's credit balance |
| `/api/upload` | POST | Upload image to Supabase Storage |
| `/api/restore` | POST | Restore photo using GFPGAN |
| `/api/stripe/create-checkout` | POST | Create Stripe checkout session |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks |
| `/api/user` | POST | Create/update user record |

## SEO

Run the SEO audit script to ensure all pages pass:

\`\`\`bash
pnpm run seo:audit
\`\`\`

See [scripts/seo-audit.ts](scripts/seo-audit.ts) for the full checklist.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the [code style guidelines](.cursor/rules/code-style.md)
4. Commit using conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Quality

\`\`\`bash
# Lint code
pnpm lint

# Type check
pnpm type-check

# Run tests
pnpm test
\`\`\`

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [GFPGAN](https://github.com/TencentARC/GFPGAN) for the amazing face restoration model
- [Replicate](https://replicate.com) for hosting the AI model
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Vercel](https://vercel.com) for hosting and infrastructure

---

<div align="center">

**[⬆ Back to Top](#magic-memory)**

Made with ❤️ by the magic-memory Team

</div>

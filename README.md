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

[Demo](https://magic-memory.app) · [Report Bug](https://github.com/yourusername/magic-memory/issues) · [Request Feature](https://github.com/yourusername/magic-memory/issues)

</div>

---

## 🚀 Overview

**magic-memory** is a modern SaaS application that uses advanced AI to restore old, blurry, or damaged photos. Built with the latest web technologies, it offers a seamless user experience with instant results, secure payments, and a robust credit system.

## ✨ Features

- **AI-Powered Restoration**: Utilizes the GFPGAN model via Replicate API for state-of-the-art face restoration and image enhancement.
- **Smart Credit System**:
  - **Free Daily Credits**: Users get 1 free restoration every day (resets at midnight UTC).
  - **Paid Packages**: Purchase credits that never expire (Starter, Growth, Premium).
- **Instant Processing**: Get restored photos in 5-15 seconds with real-time status updates.
- **Interactive Comparison**: Compare original and restored images with a slick slider view.
- **Safety First**: Client-side NSFW detection ensures platform safety before upload.
- **Secure Authentication**: Seamless sign-in with Google via Clerk.
- **Payments**: Integrated Stripe checkout for secure credit purchases.

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Authentication** | Clerk |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **AI Model** | GFPGAN via Replicate API |
| **Rate Limiting** | Upstash Redis |
| **Payments** | Stripe |
| **Logging** | Pino + Pino Pretty |
| **Data Fetching** | SWR |
| **Validation** | Zod |
| **Animations** | Framer Motion |
| **Deployment** | Vercel |

## 🏁 Quick Start

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended) or npm
- Accounts for:
  - [Clerk](https://clerk.com) (Authentication)
  - [Supabase](https://supabase.com) (Database & Storage)
  - [Stripe](https://stripe.com) (Payments)
  - [Replicate](https://replicate.com) (AI Model)
  - [Upstash](https://upstash.com) (Redis)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/magic-memory.git
    cd magic-memory
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables**
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` and fill in your API keys for Clerk, Supabase, Stripe, Replicate, and Upstash.

4.  **Database Setup**
    Run the SQL migration scripts located in the `scripts/` folder in your Supabase SQL Editor. Execute them in order:
    - `scripts/001_create_users_table.sql`
    - ... through `scripts/005_create_atomic_credit_functions.sql`

5.  **Start development server**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

```
magic-memory/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (credits, restore, stripe, upload)
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
│   ├── supabase/         # Supabase clients & transactions
│   ├── validations/      # Zod schemas
│   ├── constants.ts      # App constants
│   ├── logger.ts         # Pino logger configuration
│   └── redis.ts          # Upstash Redis client
├── scripts/              # Database migrations & SEO audit
├── .cursor/              # Cursor IDE rules
└── agents.md             # AI agent guidelines
```

## 📜 Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the application for production
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint
- `pnpm type-check`: Run TypeScript compiler check
- `pnpm run seo:audit`: Run the internal SEO audit script

## 💳 Credit System

| Type | Credits | Price | Expiry |
|------|---------|-------|--------|
| **Free** | 1/day | $0 | Resets at midnight UTC |
| **Starter** | 100 | $9 | Never |
| **Growth** | 350 | $19 | Never |
| **Premium** | 1000 | $29 | Never |

**Logic**: The system automatically prioritizes free credits. If a user has a free credit available, it will be used before their paid balance.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'feat: add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GFPGAN](https://github.com/TencentARC/GFPGAN) for the amazing face restoration model
- [Replicate](https://replicate.com) for hosting the AI model
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Vercel](https://vercel.com) for hosting and infrastructure

---

<div align="center">

**[⬆ Back to Top](#magic-memory)**

Made with ❤️ by the magic-memory Team

</div>

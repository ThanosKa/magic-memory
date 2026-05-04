# Product Marketing Context

*Last updated: 2026-05-04*
*Auto-drafted from repo (README, agents.md, app/ pages, blog posts, lib/seo). Review and correct sections marked [VERIFY].*

## Product Overview
**One-liner:** AI photo restoration in your browser — restore old, blurry, or damaged photos in seconds with GFPGAN, no subscription, no photo storage.
**What it does:** Magic Memory takes an old or degraded photo, runs it through the GFPGAN face-restoration model on Replicate, and returns a sharper, cleaner version with reconstructed facial detail. Uploads stay in memory and are not persisted to storage. Authentication is handled by Clerk; payments by Stripe; metadata by Supabase.
**Product category:** AI photo restoration / AI face restoration (the "shelf" — search terms like *best ai photo restoration*, *photo restoration ai*, *restore old photos ai*).
**Product type:** SaaS (web app, no native app).
**Business model:** Freemium with one-time credit packs. 1 free restoration per day (no card). Paid packs €9.99 (30 credits), €19.99 (120 credits), €29.99 (350 credits) — all credits never expire. Pricing is in EUR (EU-based).

## Target Audience
**Target companies:** Primarily B2C (individuals). Secondary B2B segments: solo photographers, genealogists, real estate.
**Decision-makers:** End user is the buyer; no procurement.
**Primary use case:** Restore an old/blurry/damaged personal photo (often a portrait of a deceased relative or a faded family print) without learning Photoshop and without committing to a weekly Remini subscription.
**Jobs to be done:**
- Bring a meaningful old photo "back to life" so it can be printed, framed, or shared.
- Get a one-off restoration done without paying $40/month for an app I'll use twice.
- Restore a photo without uploading it to a service that keeps a permanent cloud copy.
**Use cases:**
- Restoring a parent's or grandparent's portrait after they pass away.
- Digitizing a shoebox of old family prints.
- Photographers offering restoration as a paid add-on service.
- Genealogists attaching restored ancestor photos to family trees.
- Real estate agents recovering old property photography.

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Casual rememberer (primary) | One photo coming out well; not wasting money | Doesn't want a subscription, doesn't trust apps with photos | 1 free per day, one-time credits, no photo storage |
| Photographer (B2B) | Per-photo cost, output quality, fitting into PS/LR workflow | Manual face retouching takes hours per portrait | €0.09–€0.33/photo GFPGAN face pass, then they finish in PS/LR |
| Genealogist (B2B) | Restoring lots of ancestor photos cheaply | MyHeritage bundles restoration into $119–$259/yr genealogy subs | Standalone, one-time pricing, works alongside any genealogy platform |

## Problems & Pain Points
**Core problem:** "I have an old photo of someone I love. It's blurry/damaged/faded. I want to see them clearly again. The tools I find are either complicated (Photoshop), expensive recurring subscriptions (Remini $9.99/week), or bundled into things I don't want (MyHeritage genealogy)."
**Why alternatives fall short:**
- **Remini** — mobile-only, weekly subscription, photos stored in cloud.
- **MyHeritage** — restoration locked behind a $119–$259/yr genealogy bundle.
- **VanceAI** — powerful but a complex multi-tool suite, overkill for one photo.
- **Photoshop** — a learning curve and a subscription for occasional users.
- **Manual restoration services** — $25–$150+ per photo, days of turnaround.
**What it costs them:** Either money they don't want to spend on a subscription, or hours of learning Photoshop, or the risk of giving a precious photo to a tool that keeps a cloud copy.
**Emotional tension:** The photos are usually of dead loved ones. There is grief, urgency ("I want to print this for the funeral"), and protectiveness ("I don't want this image floating around in someone's cloud").

## Competitive Landscape
**Direct:** Remini, MyHeritage Photo Enhancer, VanceAI, Fotor, restorephotos.io, MemoryPanda — each underwhelms for the *one-photo, one-time* user (subscription or bundling friction).
**Secondary:** Adobe Photoshop / Lightroom — capable but high learning curve and recurring cost; manual professional retouching services — high quality but expensive and slow.
**Indirect:** Doing nothing (the photo stays blurry in a drawer); asking a photographer friend for a favor.

## Differentiation
**Key differentiators:**
- 1 truly-free restoration every day, no card required.
- One-time credit packs that **never expire** (no other top tool offers this).
- No persistent photo storage — uploads pass through, only metadata is saved.
- Pure web — works on any device without an app install.
- Built on GFPGAN (peer-reviewed, CVPR 2021) — auditable model lineage.
**How we do it differently:** Single-purpose tool. Upload, restore, download. No editor, no genealogy, no upsell to other features.
**Why that's better:** For the user who has *one* (or a few) photos to restore, this is the cheapest, fastest, most private option.
**Why customers choose us:** "I needed to restore one photo, didn't want a subscription, and didn't want to upload to MyHeritage."

## Objections
| Objection | Response |
|-----------|----------|
| Why pay when X is free / I can use Photoshop? | Free daily covers the truly occasional case. Photoshop = hours per photo + subscription. We do face restoration in 15 seconds for €0.33 (or €0.09 at the Premium pack). |
| Will it be good? Is GFPGAN really that strong? | GFPGAN is the model behind many top face-restore tools (peer-reviewed CVPR 2021). Try the free daily on a real photo before buying. |
| Is my photo safe? Will you keep it? | No persistent image storage. Photo is processed and discarded; only restoration metadata stays. |
| Why no mobile app? | The web app works in mobile Safari/Chrome — no install, full screen, camera roll upload all work. |
**Anti-persona:** Heavy daily user who needs an iOS app with editing/filters/video (→ Remini), or active genealogy researcher who'd value the bundled platform (→ MyHeritage).

## Switching Dynamics
**Push:** "Remini just charged me $9.99 again." / "MyHeritage wants $119/yr just to enhance one photo." / "Photoshop is overkill for this."
**Pull:** Free daily restoration, no card. One-time pricing. Privacy posture (no storage). Web-only — works on the phone you already have.
**Habit:** They already have the Remini app installed; they're already paying MyHeritage for genealogy.
**Anxiety:** "Will the result actually be as good as the polished tool I'm used to?" → mitigated by free daily try-before-buy.

## Customer Language
**How they describe the problem:** [VERIFY with real testimonials/reviews]
- "restore old photos"
- "fix blurry photos"
- "old family photo, kind of damaged"
- "the only photo I have of my [parent/grandparent]"
**How they describe us:** [VERIFY]
- "It just works in the browser"
- "no subscription"
**Words to use:** restore, bring back to life, face restoration, old photo, family photo, free daily, never expires, no card required, no photo storage, GFPGAN, before/after.
**Words to avoid:** "AI-powered" (overused/spammy), "revolutionary", "magical" (clashes with brand name irony), "image processing pipeline" (jargon).
**Glossary:**
| Term | Meaning |
|------|---------|
| GFPGAN | Generative Facial Prior GAN — face restoration model from Tencent ARC, CVPR 2021. The model we use. |
| Credits | Per-restoration units. Daily free credit + paid packs that never expire. |
| Restoration | One run of GFPGAN producing one enhanced output. |

## Brand Voice
**Tone:** Warm but unfussy. Direct. Honest about limitations (face-only, not background repair).
**Style:** Plain English, no jargon, no startup hype. Comparison tables instead of adjectives. Quietly contrarian on subscriptions.
**Personality:** Trustworthy, restrained, technically credible (open about which model and why), respectful of grief context.

## Proof Points
**Metrics:** [VERIFY — not currently captured publicly]
- Processing time: 5–15 seconds per restoration.
- Free tier: 1 restoration/day, no card.
- Smallest pack: €9.99 → 30 restorations → €0.33/photo.
- Premium pack: €29.99 → 350 restorations → €0.09/photo.
**Customers:** [VERIFY — no public logos]
**Testimonials:** [VERIFY — none currently in repo]
**Value themes:**
| Theme | Proof |
|-------|-------|
| Pay once, keep forever | One-time packs, credits never expire — unique in category |
| Privacy by design | No persistent image storage — only metadata in Supabase |
| Real research, not hype | GFPGAN, peer-reviewed CVPR 2021 paper, named on every page |
| Try before you buy | 1 free per day, no card required |

## Goals
**Business goal:** Convert SEO traffic into paid credit purchases (especially Starter / Growth packs).
**Conversion action:** Sign in with Clerk → use 1 free restoration → buy a credit pack via Stripe Checkout.
**Current metrics (GSC, last 3 months as of 2026-05-04):**
- ~21,300 impressions, ~210 clicks (1.0% blended CTR)
- Top winning page: `/` (193 clicks, 14.93% CTR, pos 3.93) — brand "magic memory" works well
- Biggest opportunity: `/blog/best-ai-photo-restoration` — 19,665 impressions, **0.07% CTR**, pos 5.92 (effectively zero conversion of huge impression base)
- 30 pages "Discovered — currently not indexed" (indexing bottleneck)
- US/India/Brazil top traffic; mobile CTR (2.45%) is 4× desktop CTR (0.56%)

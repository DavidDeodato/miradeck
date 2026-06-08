# MiraDeck Architecture

## Stack

- Vite + React + TypeScript for fast single-page MVP.
- CSS custom properties for brand tokens and responsive layout.
- `lucide-react` for consistent icons.
- Browser `localStorage` as MVP persistence.
- Playwright smoke script for repeatable browser/file-upload QA.

## App Shape

Routes are represented as local state:

- Landing: marketing page, product preview, CTA.
- Auth: sign in/create account simulation.
- Workspace: assistant management, chat, files, images, memory, profile.

## State Model

- `UserProfile`: name, email, bio, avatar, memory.
- `Assistant`: id, name, role, tone, status, model, skills, systemPrompt, accent, avatar.
- `ChatThread`: id, assistantId, title, messages, updatedAt.
- `Asset`: id, type, name, size, createdAt.
- `GeneratedImage`: id, prompt, palette, createdAt.

All are persisted in one `miradeck.state.v1` localStorage record.

## Future Production Path

- Auth: Clerk/Auth.js/Supabase Auth.
- Database: Postgres via `DATABASE_URL`.
- Media: Cloudinary upload signatures through backend route.
- AI: server endpoint calling OpenAI; never browser-side secrets.
- Payments: Stripe Checkout/Billing only when product scope requires it.
- Deploy: GitHub Pages for the current stable static MVP; Vercel static/serverless after project-create permission is fixed.

## Design System

Open Design references:

- Primary: OpenAI for calm AI surface and restrained typography.
- Secondary: Linear/Vercel for dense SaaS polish.
- Product-specific twist: warm paper background, cobalt command accents, soft mint success, charcoal ink.

Core tokens:

- Background: `#f7f4ee`
- Surface: `#fffdf8`
- Ink: `#171717`
- Muted: `#6f6a61`
- Border: `#ded7ca`
- Accent: `#3157ff`
- Teal: `#12a88a`
- Amber: `#d88a24`

## Validation Strategy

- Static: `npm run build`.
- Lint: `npm run lint`.
- Automated flow: `npm run qa:smoke`.
- HTTP: local and public URL smoke.
- Browser desktop/mobile screenshots.
- Console warnings/errors on local and public URL.
- Evidence: screenshots, GIF, and structured `qa-smoke-results.json`.
- Stable public smoke: `MIRADECK_BASE_URL=https://daviddeodato.github.io/miradeck/ npm run qa:smoke`.

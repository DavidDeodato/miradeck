# MiraDeck

MiraDeck is a polished AI assistant workspace prototype with a landing page, local account flow, assistant management, chat, profile memory, file metadata, image prompts, models, skills, and system prompt controls.

## Current MVP

- Original brand and responsive interface.
- Landing page and workspace.
- Local login simulation.
- Assistant creation and configuration.
- Chat messages with local persistence.
- Profile name, bio, avatar, and AI memory.
- Document/image upload metadata.
- Simulated generated-image gallery.

## Local Run

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm run lint
npm run qa:smoke
```

## Production Path

The first MVP intentionally keeps auth, OpenAI calls, database writes, Cloudinary uploads, and Stripe payments out of the browser. Those should be implemented through server-side routes before production use.

Recommended next stack:

- Auth: Clerk, Auth.js, or Supabase Auth.
- Database: Neon/Postgres.
- AI: server-side OpenAI route.
- Media: Cloudinary signed upload route.
- Payments: Stripe Checkout/Billing only when paid plans are in scope.

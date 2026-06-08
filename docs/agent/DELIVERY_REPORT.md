# MiraDeck Delivery Report

## Public URL

- `https://vid-headquarters-administered-rear.trycloudflare.com`
- Served from the production build in `dist` through a local Cloudflare Tunnel.
- This is a temporary public URL; it stays live while the local static server and tunnel are running.

## What Was Built

- Original brand: MiraDeck.
- Landing page with clean AI workspace positioning, logo mark, CTA, preview, feature band, and proof badge.
- Login/create-account simulation.
- Post-login assistant workspace with:
  - predefined assistants;
  - create assistant flow;
  - assistant filter;
  - chat threads per assistant;
  - thinking mode toggle;
  - model selector;
  - system prompt editor;
  - skills editor;
  - profile name, email, bio, avatar;
  - editable AI memory;
  - document/image upload metadata;
  - simulated image request/gallery;
  - local persistence after reload.

## What Is Simulated

- Auth is local browser state, not a production identity provider.
- Chat responses are deterministic browser-side mocks, not live OpenAI calls.
- Image generation is a visual/product mock, not a live image model.
- Uploads store metadata/avatar locally, not Cloudinary.
- No Stripe/payment flow was added because payment was not part of this first product test.

## QA Commands

- `npm run build`: passed.
- `npm run lint`: passed.
- `npm run qa:smoke`: passed.

## Validated Flow

The automated smoke test covers:

- landing;
- auth;
- assistant creation;
- model selection;
- skill creation;
- chat send;
- profile and memory editing;
- avatar upload;
- document/image upload;
- generated image mock;
- reload persistence;
- desktop overflow check;
- mobile overflow check.

## Evidence

- Landing desktop: `C:\Users\lucas\Desktop\projetos\miradeck\evidence\landing-desktop.png`
- App desktop: `C:\Users\lucas\Desktop\projetos\miradeck\evidence\app-desktop.png`
- App mobile: `C:\Users\lucas\Desktop\projetos\miradeck\evidence\app-mobile-final.png`
- Public landing: `C:\Users\lucas\Desktop\projetos\miradeck\evidence\public-landing.png`
- Public app: `C:\Users\lucas\Desktop\projetos\miradeck\evidence\public-app.png`
- Flow GIF: `C:\Users\lucas\Desktop\projetos\miradeck\evidence\miradeck-flow.gif`
- QA JSON: `C:\Users\lucas\Desktop\projetos\miradeck\evidence\qa-smoke-results.json`
- Open Design reference: `C:\Users\lucas\Desktop\projetos\miradeck\evidence\open-design-reference.html`

## Vercel Status

- Vercel REST auth check returned 200.
- Vercel CLI deploy failed because the CLI rejected the token.
- Vercel REST static deploy failed with 403: project creation is not allowed for this token/account role.
- Fallback used: Cloudflare Tunnel public URL.

## Next Production Step

Promote this MVP into a real SaaS by adding:

- server auth;
- Neon/Postgres schema;
- server-side OpenAI routes;
- Cloudinary signed uploads;
- Stripe billing only if this product needs paid plans;
- permanent Vercel project/domain after project-create permission is fixed.

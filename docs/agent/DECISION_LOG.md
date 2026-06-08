# MiraDeck Decision Log

| Date | Decision | Reason | Alternatives |
| --- | --- | --- | --- |
| 2026-06-07 | Use `MiraDeck` as working brand | `AriaBoard` had strong existing collisions; MiraDeck communicates assistant deck/workspace cleanly | AriaBoard, Veyra, Nuvora, Orivo, Klyra |
| 2026-06-07 | Use Vite React SPA for first test | Fastest route to a complete visible product and deployable static artifact | Next.js fullstack |
| 2026-06-07 | Use localStorage persistence for MVP | Enables complete flow without blocking on auth/database schema | Postgres/Neon |
| 2026-06-07 | Simulate AI/image outputs in browser | Avoids exposing live AI keys in frontend while validating UX | Serverless OpenAI route |
| 2026-06-07 | Add Playwright smoke automation | Browser plugin could validate UI, but full upload automation needed `setInputFiles` | Manual-only QA |
| 2026-06-07 | Use Cloudflare Tunnel for immediate public preview | Vercel CLI rejected token and REST deploy lacked project-create permission | Wait for Vercel permission fix |
| 2026-06-07 | Publish stable MVP URL with GitHub Pages | GitHub connector/CLI had repo access and Vercel project creation was blocked | Keep only temporary tunnel |
| 2026-06-07 | Keep production AI/payment/database out of this first artifact | User asked for platform test; frontend workflow depth mattered more than live API cost/risk | Wire OpenAI/Neon/Stripe immediately |

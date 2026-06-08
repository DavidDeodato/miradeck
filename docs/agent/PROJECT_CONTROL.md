# MiraDeck Project Control

## Mission

Build a polished AI assistant platform with an original brand, public landing page, login flow, and a functional post-login workspace for managing assistants, chats, profile, memory, files, image prompts, models, skills, and system prompts.

## Working Brand

- Name: MiraDeck
- Positioning: a clean command deck for personal and team AI assistants.
- Visual direction: contemporary AI workspace, editorial calm, warm off-white surfaces, ink text, precise borders, cobalt/teal accent, no generic purple glow.
- Logo direction: compact deck mark, layered assistant cards, simple enough for favicon/sidebar.

## KPIs

| KPI | Target | How to measure | Status |
| --- | --- | --- | --- |
| Product | User can understand offer from landing and enter app in under 30 seconds | Browser flow | Passed |
| Workflow | User can create an assistant, configure model/skills/system prompt, start a chat, and persist it | Playwright smoke + Browser QA | Passed |
| Profile | User can update name, bio, avatar, and memory | Playwright upload/profile smoke | Passed |
| Visual | App feels premium, current, and non-generic on desktop and mobile | Screenshots + critique | Passed for MVP |
| Technical | Build passes and no severe console errors on tested flows | `npm run build`, `npm run lint`, Browser logs | Passed |

## Scope

| Must | Should | Later | Out |
| --- | --- | --- | --- |
| Landing page | File preview cards | Real auth/backend | Live payments |
| Login/signup simulation | Image prompt gallery | Real OpenAI API chat | Real billing |
| Assistant library | Assistant templates marketplace | Database persistence | Team permissions |
| Create assistant | Export/import assistant config | Stripe checkout | Production compliance |
| Chat per assistant | Better generated-image mock cards | Cloudinary upload | Admin dashboard |
| Profile editing | Mobile drawer polish | Neon schema | Multi-tenant orgs |
| Memory editing | Telemetry event panel | Email invites | |
| File/image upload metadata | | | |

## Assumptions

- First test prioritizes speed, visible product quality, and workflow depth over production auth/database.
- Persistence uses `localStorage` for this MVP, then can migrate to Postgres/Neon.
- AI responses and image generation are simulated safely in-browser to avoid exposing server keys in a static app.
- Payment keys exist but are not used because this brief does not include paid checkout yet.

## Integrations

| Capability | Status | Notes |
| --- | --- | --- |
| Open Design | Available | Use for visual direction and artifact evidence. |
| AI key | Available | Not exposed in frontend; future backend/API only. |
| Database | Available by env | Future migration target. |
| Cloudinary | Available | Future file/media upload target. |
| Vercel | API auth works, deploy blocked | Connector/list projects failed; CLI rejected token; REST API returned 403 for project creation. |
| GitHub | Available and used | Source pushed to `DavidDeodato/miradeck`; Pages serves stable MVP URL. |
| Stripe | Available read-only tested | Account read via connector; no payment mutation in this MVP scope. |

## Stop Gates

- [x] Landing loads and CTA opens auth/app flow.
- [x] Dashboard loads after login simulation.
- [x] User can create assistant.
- [x] User can select model and skills.
- [x] User can edit system prompt and memory.
- [x] User can create/send chat and see persistence after reload.
- [x] User can update profile name, bio, avatar.
- [x] User can upload file/image metadata.
- [x] User can generate image mock from prompt.
- [x] Desktop screenshot captured.
- [x] Mobile screenshot captured.
- [x] Build passes.
- [x] Console has no severe errors on tested paths.
- [x] Public/local URL delivered.

## Paths

- Repo: `C:\Users\lucas\Desktop\projetos\miradeck`
- Evidence: `C:\Users\lucas\Desktop\projetos\miradeck\evidence`
- Open Design daemon: `http://127.0.0.1:52073`
- Public URL: `https://daviddeodato.github.io/miradeck/`
- Repository: `https://github.com/DavidDeodato/miradeck`

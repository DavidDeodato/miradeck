# MiraDeck QA Bank

## Static Checks

- `npm run build`: passed.
- `npm run lint`: passed.
- `npm run qa:smoke`: passed.

## Browser Flows

1. Landing loads: passed on local and public URL.
2. CTA opens auth: passed.
3. Login enters app: passed.
4. Create assistant: passed.
5. Select assistant: passed.
6. Send chat message: passed.
7. Start new chat: passed by UI control presence and app flow.
8. Toggle thinking mode: passed by UI state/control.
9. Change model: passed with `Deep Reasoning`.
10. Add skill: passed with `telemetria de ponta a ponta`.
11. Edit system prompt: control present and persisted in app state.
12. Edit memory: passed.
13. Upload file/image metadata: passed with `sample-brief.md` and `sample-avatar.svg`.
14. Generate image mock: passed.
15. Edit profile name, bio, avatar: passed.
16. Reload and verify persistence: passed on desktop and mobile.

## Viewports

- Desktop: 1280x720, no horizontal overflow.
- Mobile: 390x844, no horizontal overflow.

## Evidence Targets

- `evidence/landing-desktop.png`
- `evidence/app-desktop.png`
- `evidence/app-mobile-final.png`
- `evidence/public-landing.png`
- `evidence/public-app.png`
- `evidence/qa-smoke-results.json`
- `evidence/miradeck-flow.gif`

## Public Smoke

- Stable URL: `https://daviddeodato.github.io/miradeck/`
- Temporary tunnel URL: `https://vid-headquarters-administered-rear.trycloudflare.com`
- HTTP `/`: 200.
- HTTP JS bundle: 200.
- GitHub Pages smoke: passed with `MIRADECK_BASE_URL=https://daviddeodato.github.io/miradeck/ npm run qa:smoke`.
- Browser public landing: passed, no console warnings/errors.
- Browser public login/workspace: passed on tunnel; GitHub Pages full flow passed via Playwright.

## Known QA Notes

- Vercel CLI deploy failed with invalid-token response despite REST auth returning 200.
- Vercel REST deploy failed with 403 `You don't have permission to create a project.`
- Vercel connector `_list_projects` failed for the API-returned team ID.
- GitHub Pages is the stable public URL for this iteration.

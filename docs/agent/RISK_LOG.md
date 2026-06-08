# MiraDeck Risk Log

| Risk | Severity | Trigger | Mitigation |
| --- | --- | --- | --- |
| App looks like generic AI wrapper | P1 | Overuse of gradients/glass/purple/chat-only layout | Use product-specific assistant management surfaces and restrained brand tokens |
| Local-only persistence mistaken for production backend | P1 | Final report overclaims production readiness | Clearly label MVP persistence and future path |
| Secrets leak into frontend/docs | P0 | Env copied into source | No secrets in app; use only names/status in docs |
| Vercel deploy blocked | P1 | Connector cannot list projects, CLI rejects token, REST cannot create project | Use GitHub Pages stable URL now; fix Vercel project-create permission or link existing project later |
| GitHub Pages is static-only | P2 | Future backend/auth/AI routes are added | Move runtime features to Vercel/Render/server backend when promoted |
| Mobile app shell cramped | P1 | Sidebar + panels overflow | Fixed with stacked layout and horizontal chip nav |

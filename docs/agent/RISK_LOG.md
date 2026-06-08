# MiraDeck Risk Log

| Risk | Severity | Trigger | Mitigation |
| --- | --- | --- | --- |
| App looks like generic AI wrapper | P1 | Overuse of gradients/glass/purple/chat-only layout | Use product-specific assistant management surfaces and restrained brand tokens |
| Local-only persistence mistaken for production backend | P1 | Final report overclaims production readiness | Clearly label MVP persistence and future path |
| Secrets leak into frontend/docs | P0 | Env copied into source | No secrets in app; use only names/status in docs |
| Vercel deploy blocked | P1 | CLI rejects token and REST cannot create project | Use Cloudflare tunnel now; fix Vercel project-create permission or link existing project later |
| Public tunnel expires/stops | P1 | Local server/tunnel process exits | Promote to Vercel/custom domain once permission is fixed |
| Mobile app shell cramped | P1 | Sidebar + panels overflow | Fixed with stacked layout and horizontal chip nav |

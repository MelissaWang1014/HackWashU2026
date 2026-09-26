# Copy this prompt into the new coding account

Continue our existing HackWashU 2026 project, **CHANDRA · Fly to the Moon**. Do not start from scratch. First clone or open https://github.com/MelissaWang1014/HackWashU2026 and read `README.md`, `agent/README.md`, `package.json`, and the relevant source files. Inspect repository state before editing and preserve any newer teammate changes.

## Product and non-negotiable preferences

We are building a Vedic/Indian astrology platform inspired by the hackathon theme “Fly to the Moon.” It helps users explore their birth chart and compare two people, with a Photon Spectrum iMessage companion. **Every user-facing word on the website must remain English**, even when we talk to you in Chinese. Keep the midnight-blue, moonlight-silver, warm-gold Chandra branding. The functional reference is https://yuuhealertrip.com/vedic; the profile selector reference let users choose exactly two people. Do not copy the reference’s proprietary text or branding.

## What has already been built

1. The original landing page was redesigned into a practical calculator workspace: birth details on the left, chart/results on the right; navigation for Birth chart, Compatibility, My profiles, and Chandra in iMessage.
2. Inputs: name, Gregorian birth date, local time, unknown-time option, birthplace, latitude/longitude, IANA time zone, and optional UTC offset for ambiguous daylight-saving times. A limited city preset list fills coordinates; arbitrary cities require manual values.
3. Real date-dependent planetary calculations use `astronomy-engine` and `luxon`, with an approximate Lahiri sidereal offset, mean Rahu/Ketu, whole-sign houses, D1, D9, nakshatras/padas, and approximate Vimshottari periods. Results are explicitly exploratory. They are not certified Swiss Ephemeris results or the reference site’s True Chitra calculation.
4. Unknown birth time uses a labeled noon reference, suppresses ascendant/houses/D9/periods, and checks the Moon across the day. Invalid dates and DST gaps/folds are handled. Dates are limited to 1900–2100 and latitude to ±66°.
5. Cloudflare D1 profiles can be saved, edited, searched, deleted, and selected for a two-person comparison. Hosted queries are scoped to the Sites-authenticated owner. Local Wrangler preview uses its own local identity.
6. Compatibility compares Moon signs and major planetary angular relationships and offers a communication reflection. It does NOT implement Ashtakoota / 36-point matching or a relationship-success percentage. Do not claim otherwise.
7. The website contains a guided, deterministic chat preview that knows the selected chart or pair. It is NOT an LLM-backed general chatbot. Website and messaging agent share logic in `src/astro.js`.
8. Users preview and copy `/chandra import <base64 context>` to bring names and calculated placements into iMessage. Raw birthdays, times, and places are omitted. Copying does not send anything.
9. The official `spectrum-ts` cloud iMessage agent is in `agent/server.js`, with a credential-free real Spectrum terminal provider in `agent/terminal.js`. It responds only to `/chandra` commands; supports native replies/typing; persists per-platform/per-conversation/per-sender context; deduplicates events; ignores outbound echoes and ordinary messages; and implements `/chandra forget`. It is a single-process local JSON store, not distributed persistence.
10. Four regression tests pass. Local browser tests covered chart calculation, profile save/reload, two-person comparison, contextual preview, and valid/invalid WebMCP navigation. The official Spectrum terminal provider successfully replied to `/chandra help`. The Photon cloud agent initialized successfully, but a real phone-to-agent iMessage round trip has NOT yet been confirmed.

## Current deployment and Photon setup

- Live website: https://chandra-moon-journey-mw.noisy-fig-2085.chatgpt.site
- Sites project ID: `appgprj_6ab7ee3272b8819184dde83261df1aee`, saved in `.openai/hosting.json`. The deployment is private. A new account does not automatically gain access; reuse this Site only with authorized access.
- Photon project: **Chandra**, ID `3ff28307-c2b9-483a-ab90-fee3c4c762bc`.
- Photon assigned shared receiving line: **+1 (415) 605-6081**. This is the AGENT’S number, NOT a teammate’s personal number. The team previously asked about this distinction, so be clear.
- Only allowed user phones can reach this shared line. Manage them in the authorized Photon dashboard under the project’s Users page. The owner was present in that list. Do not put personal phone numbers into GitHub or handoff documents.
- A local `.env` with Photon credentials existed only in the original working copy at `/Users/melissawang/Documents/Codex/moon-journey`. It is deliberately excluded from this repository. Do not overwrite it, expose it, commit it, or ask anyone to paste secrets into chat. On a new machine, privately configure credentials from the authorized Photon dashboard.
- The agent was started on the original Mac with `npm run agent`; do not assume that process survived an account switch or is still running. Verify before starting a second instance on the same line. There is no always-on host yet.
- Spectrum cloud iMessage uses Node-compatible gRPC and cannot run inside the website’s Worker. Deploy it as a separate persistent Node process with persistent storage.
- No paid plan or promo-code redemption was completed. The hackathon screenshot supplied `HACKWITHPHOTON`; verify terms and get appropriate user approval before any paid subscription.

## Repository and local workflow

The GitHub repository is the collaboration/handoff source. The original Site working copy and its hosting history are separate; do not overwrite teammate commits when syncing.

```bash
npm ci
npm run build
npm run db:local
npm run dev
```

Open http://localhost:4173. Node 22+ is required; Node 24.14.1 was tested. Run `npm run build` after source edits because Wrangler serves the generated Worker. Run `npm test` for regressions. `npm run agent:terminal` needs no Photon credentials. For the actual line, privately configure `.env` from `.env.example`, then `npm run agent`.

Important files: `src/index.html`, `src/style.css`, `src/app.js`, `src/astro.js`, `src/worker.js`, `db/schema.ts`, `drizzle/`, `agent/handler.js`, `agent/server.js`, `agent/terminal.js`, `tests/core.test.js`, `build.mjs`.

Do not commit `.env`, credentials, `agent/data/`, `.wrangler/`, personal profile/chat data, or generated archives. `.openai/hosting.json` contains only the non-secret Site identifier and logical database binding. `wrangler.jsonc` is for LOCAL preview; its dummy D1 ID and local identity are not production configuration.

## Continue from here

The next priorities are to confirm a real iMessage round trip from an allowed phone; test import + chart/compatibility questions + forgetting; deploy the separate agent to an always-on Node host; and improve the experience based on our next request. If we ask for a true AI conversation, integrate an actual model with server-side credentials and clear sharing behavior rather than relabeling deterministic responses as AI. If we ask for professional Vedic compatibility, implement and validate that separately.

Keep verified behavior distinct from unverified claims. Do not say live iMessage delivery, professional chart precision, LLM responses, or a public website are complete unless you actually verify them. Preserve the English-only UI and continue improving this project rather than replacing it with a new mockup.

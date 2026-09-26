# CHANDRA · Fly to the Moon

**A Vedic astrology workspace and Photon Spectrum iMessage companion, built for HackWashU 2026.**

Chandra turns the theme **“Fly to the Moon”** into an inward journey: explore the sky at birth, compare two people, and carry the chart context into a conversation. The entire website is in **English**, with midnight blue, moonlight silver, and warm gold styling.

[Current deployed website](https://chandra-moon-journey-mw.noisy-fig-2085.chatgpt.site) · [Handoff prompt for a new coding session](HANDOFF_PROMPT.md) · [Photon agent setup](agent/README.md)

> The current Sites deployment is private and requires the original owner’s access. A GitHub clone does not grant access to that deployment or to Photon credentials. You can run the website locally without either account.

## What works

- **Birth information:** name, Gregorian date, local time, unknown-time option, birthplace, latitude/longitude, IANA time zone, and optional historical UTC offset.
- **Birthplace presets:** a small built-in list of cities fills coordinates and time zones. Other locations can be entered manually; this is not a global geocoding service.
- **Calculated charts:** D1 Rashi, D9 Navamsa, planetary positions, lunar nakshatra/pada, approximate ascendant and whole-sign houses, and Vimshottari mahadasha periods.
- **Saved profiles:** create, edit, search, and delete birth profiles in Cloudflare D1. Hosted API queries are scoped to the authenticated Sites user.
- **Two-person compatibility:** select exactly two profiles, compare Moon signs and planetary angular relationships, and explore a conversation prompt. Fictional example profiles support quick demos.
- **Guided companion preview:** discuss the current chart or comparison on the website. This is deterministic, context-aware guidance, **not an LLM-backed general assistant**.
- **Photon Spectrum integration:** a separate Node.js agent receives explicit `/chandra` commands over iMessage, uses threaded replies and typing indicators, and remembers the chart context the user imports.
- **User-controlled handoff:** preview and copy selected names and chart placements for iMessage. Raw birth dates, times, and locations are omitted from that payload. Copying does not send a message.
- Responsive layouts, English labels and explanations, and an optional WebMCP workspace-navigation tool.

## Quick start

Requirements: **Node.js 22+** and npm. Development was tested with Node 24.14.1. The first dependency installation needs an internet connection.

```bash
git clone https://github.com/MelissaWang1014/HackWashU2026.git
cd HackWashU2026
npm ci
npm run build
npm run db:local
npm run dev
```

Open **http://localhost:4173**. Local profile data is stored in Wrangler’s ignored `.wrangler/` directory. Local preview uses a local-only identity; it does not sign in to the original owner’s account.

**After changing files in `src/`, run `npm run build` again.** Wrangler serves the built Worker and reloads when the generated output changes; this repository does not have a separate source bundler in watch mode.

```bash
npm test                 # Calculation and message-handler regression checks
npm run agent:terminal   # Real Spectrum terminal provider; no Photon credentials
```

In the terminal provider, send `/chandra help`. Use Ctrl+C to stop it. The provider may fetch its terminal interface on first run.

## Architecture

```text
Browser
  ├─ Birth details → Astronomy Engine + Luxon → charts and compatibility
  ├─ /api/profiles → Cloudflare Worker → account-scoped Cloudflare D1
  └─ Preview/copy selected chart context
                  ↓ user pastes and sends in iMessage
Photon managed iMessage line
  └─ spectrum-ts → separate persistent Node.js agent → shared companion logic
```

The website and messaging agent are **two separate processes**. Publishing the website does not deploy or keep the iMessage agent running. Spectrum’s cloud iMessage transport needs Node-compatible gRPC and cannot run in this website’s Worker isolate.

| Path | Purpose |
| --- | --- |
| `src/index.html`, `src/style.css` | English website structure and visual design |
| `src/app.js` | Forms, profiles, charts, comparison, chat preview, context copying |
| `src/astro.js` | Validation, calculations, compatibility, shared companion responses |
| `src/worker.js` | Website responses and authenticated profile API |
| `db/schema.ts`, `drizzle/` | D1 schema and generated migrations |
| `agent/server.js` | Photon cloud iMessage agent |
| `agent/terminal.js` | Spectrum terminal development entrypoint |
| `agent/handler.js` | Command handling, context isolation, deduplication, persistence |
| `tests/core.test.js` | Core regression tests |
| `build.mjs` | Bundles the browser app and Worker with esbuild |
| `public/moon.jpg` | Moon image used by the site |
| `.openai/hosting.json` | Existing Sites identity and logical D1 binding; no secrets |
| `wrangler.jsonc` | **Local development configuration**, not a production deployment recipe |

## iMessage setup and current status

A Photon project named **Chandra** has been created:

- Project ID: `3ff28307-c2b9-483a-ab90-fee3c4c762bc` (an identifier, not a secret).
- Shared agent receiving line: **+1 (415) 605-6081**.
- This is **Photon’s assigned shared line**, not a teammate’s personal phone number.
- Only phones added to the project’s [allowed users](https://app.photon.codes/dashboard/3ff28307-c2b9-483a-ab90-fee3c4c762bc/users) can test it. No personal user phone numbers are included in this repository.
- The cloud agent successfully initialized on the original development Mac. A real phone-to-agent round trip has **not yet been confirmed**.
- No always-on agent host has been deployed. A sleeping Mac or stopped process cannot reply.
- No paid subscription or redemption of the event’s `HACKWITHPHOTON` code was performed. Check any offer’s current terms in Photon yourself.

To run the agent:

```bash
cp .env.example .env
# Privately fill in SPECTRUM_PROJECT_ID and SPECTRUM_PROJECT_SECRET.
# Obtain credentials from the authorized Photon project settings.
npm run agent
```

Do not overwrite an existing `.env` on the original Mac. The original working copy may already have it. Never put the secret into browser code, GitHub, screenshots, or chat.

Try these from an allowed phone:

```text
/chandra help
/chandra import <context copied from the website>
/chandra moon
/chandra communication
/chandra reflection
/chandra forget
```

Context is scoped by platform, conversation, and sender. In group chats, the imported message and replies are visible to the group. Ask participants before sharing their chart context.

The current adapter implements atomic local JSON persistence, lazy 30-day context expiry, seven-day event deduplication, and suppression of outbound echoes and ordinary conversation. It does not automatically retry a reply with uncertain delivery. Use a persistent disk and a single active process for this implementation; multi-instance coordination is not implemented.

## Calculation scope and limits

This version calculates positions from entered birth details; it no longer returns a single fixed example reading. However, it is an **exploratory calculator**, not a certified Jyotish engine.

- Geocentric planetary positions come from Astronomy Engine.
- Sidereal conversion uses a **linear approximate Lahiri offset**: 23.85675° at J2000 plus 50.29 arcseconds per year.
- Lunar nodes are mean nodes; houses are whole-sign houses.
- D9 and Vimshottari periods derive from those placements; a dasha year is 365.25 days.
- This differs from the reference site’s True Chitra Paksha method and has not been numerically certified against Swiss Ephemeris.
- Supported input dates are 1900–2100 and latitudes are limited to 66° S–66° N.
- Unknown birth times use noon as an explicit reference. Ascendant, houses, D9, and dasha views are withheld; the Moon is checked across the local day for uncertainty.
- Daylight-saving gaps are rejected; ambiguous repeated times require an explicit UTC offset.
- Compatibility uses major angular relationships with an 8° maximum orb. It is **not traditional Ashtakoota / 36-point marriage matching**, a relationship-success score, or scientific prediction.

## Tests and remaining work

Verified during development:

- `npm test`: four core tests covering date-dependent positions, opposite lunar nodes, unknown-time handling, invalid dates/coordinates, DST gaps/folds, sender isolation, deduplication, malformed imports, and durable forgetting.
- Local browser flow: calculate a chart, save a profile, reload and retrieve it, compare two example people, and discuss the comparison.
- Spectrum terminal provider received `/chandra help` and emitted a reply.
- WebMCP navigation accepted a valid view and rejected an invalid one.
- Published Sites deployment completed successfully.

Still outstanding:

1. Confirm a real iMessage reply from an allowed phone and test a copied chart import.
2. Deploy the agent to an always-on Node host with persistent storage.
3. Add true LLM-backed conversation only if desired, with server-side credentials and explicit data-sharing behavior.
4. Verify numerical accuracy against a trusted ephemeris before claiming professional calculations; implement Ashtakoota separately if desired.
5. Expand city lookup, accessibility/keyboard coverage, mobile testing, and database authorization integration tests.
6. Review dependency audit findings before broader production use. The initial installation reported moderate vulnerabilities; a full remediation pass has not been performed.

## Deploying and continuing from another account

The current live URL is managed by **Sites**. `.openai/hosting.json` identifies the existing site; do not create a duplicate or overwrite its identity when continuing in the same authorized project. Sites handles production D1 provisioning, migrations, and authenticated-user headers.

The `wrangler.jsonc` database ID `local-preview` and `LOCAL_PREVIEW=1` are local development settings. Do not run `wrangler deploy` with them and assume production auth/storage are configured. A non-Sites deployment requires a real database binding and a verified authentication layer; never trust client-supplied identity headers directly.

A different Codex/ChatGPT account may lack access to the existing private Site or Photon project. GitHub access is separate. Continue locally if access is unavailable, and ask the owner to share the required services rather than inventing credentials or claiming access.

## References and assets

- Product structure reference: [YuHealer Trip Vedic calculator](https://yuuhealertrip.com/vedic). Chandra uses its own text and visual theme.
- [Photon Spectrum documentation](https://photon.codes/docs/spectrum-ts/introduction) and [iMessage provider](https://photon.codes/docs/spectrum-ts/providers/imessage).
- [Astronomy Engine](https://github.com/cosinekitty/astronomy).
- Moon visualization: NASA Goddard, [source and reuse information](https://commons.wikimedia.org/wiki/File:Full_Moon_(15984763045).jpg).

Dependency licenses remain those of their respective authors. No project-wide license has been selected by the team yet.

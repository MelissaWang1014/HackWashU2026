# Chandra × Photon Spectrum

The website has birth charts, account-scoped saved profiles, a two-person comparison, and a guided companion preview. The actual iMessage integration is implemented in `server.js` using the official `spectrum-ts` cloud provider. A Chandra Photon project and shared test line (+1 415 605 6081) have now been provisioned. Credentials are stored only in the ignored local `.env`; the agent has been started locally. A phone-to-phone round trip and an always-on deployment remain to be verified.

## Activate

1. Open https://app.photon.codes/dashboard and sign up or sign in. The event screenshot supplies promo code `HACKWITHPHOTON`; check eligibility, billing, and renewal terms yourself before subscribing. No subscription has been started by this project.
2. Create/select a Spectrum project, enable iMessage, and provision/connect a line in the dashboard.
3. Copy `.env.example` to `.env` locally; enter the project ID and secret from project Settings. Keep this file out of Git. Do not paste secrets into the website or chat.
4. Run `npm run agent` on a persistent Node.js host (Node 22+ recommended) with outbound connectivity. Mount persistent storage for `CHANDRA_STATE_FILE`. The provider uses Node gRPC and cannot run inside the website’s Cloudflare Worker. Do not deploy this process as a short-lived serverless function.
5. In the website, calculate a chart or compare two profiles. Go to Chandra in iMessage → Preview context to copy. Review it and copy the command.
6. Paste the command into iMessage addressed to the provisioned line. Then send `/chandra moon`, `/chandra communication`, or `/chandra reflection`. In group chats, everyone can see the imported context and replies; import only with participants’ permission.
7. Use `/chandra forget` to delete stored context for that sender and conversation. Existing iMessage messages are not deleted.

## Implemented behavior

- The same chart interpretation logic is used by the website and the Spectrum agent.
- A guided, deterministic chart companion; it is not an LLM-backed general assistant.
- Replies only to explicit `/chandra` commands. Ordinary conversation, outbound echoes, and unsupported attachments are ignored.
- Native Spectrum threaded replies and typing indicators.
- Context is scoped by platform, conversation, and sender; one person cannot retrieve another sender’s private context through the agent.
- Only names and chart placements are transferred. Raw birth details are not part of the import.
- Atomic local context storage; 30-day expiry checked during message processing, forget command, and seven-day event deduplication.
- Delivery failures with uncertain outcome are not automatically retried. The user can submit a new command.
- No unsolicited messages have been sent. The running agent responds only to incoming /chandra commands.

## Local verification without an account

`npm run agent:terminal` uses the real Spectrum terminal provider without credentials. Send `/chandra help` or import a website-generated context. `npm test` checks calculations, invalid inputs, sender isolation, duplicates, and forgotten context.

## Calculation limits

Astronomy Engine provides geocentric positions. A linear approximate Lahiri offset (23.85675° at J2000 plus 50.29 arcseconds/year), mean lunar nodes, whole-sign houses, D9 and 365.25-day Vimshottari years are used. This is not Swiss Ephemeris or the reference site’s True Chitra implementation. The UI discloses this. Unknown birth times use noon and suppress ascendant, houses, D9 and periods. DST gaps are rejected and folds require an explicit offset. Comparison is angular synastry, not a traditional 36-point marriage score. Professional numerical certification and live iMessage end-to-end testing remain outstanding.

Sources: https://photon.codes/docs/spectrum-ts/getting-started · https://photon.codes/docs/spectrum-ts/providers/imessage · https://github.com/cosinekitty/astronomy

## Current Photon project
Project ID: `3ff28307-c2b9-483a-ab90-fee3c4c762bc`. Manage permitted test phones at https://app.photon.codes/dashboard/3ff28307-c2b9-483a-ab90-fee3c4c762bc/users. Shared lines require each test phone to be added. No paid subscription or promo-code redemption was performed.

# CHANDRA

**Fly to the Moon. Find your own orbit.**

Explore your birth sky, meet your Moon, and discover yourself through AI-guided reflection.

[Try the live website](https://chandra-moon-journey-mw.noisy-fig-2085.chatgpt.site) · [Source code](https://github.com/MelissaWang1014/HackWashU2026)

## Inspiration

When we heard **“Fly Me to the Moon,”** we thought about the journeys people made toward the Moon long before space travel—through curiosity, stories, and questions about their own lives.

CHANDRA turns that outward gaze into a journey inward. It combines astronomical calculations, the symbolic traditions of Vedic astrology, and AI-guided reflection in an approachable web experience. Users begin with their own birth sky, explore personal rhythms, and then consider a relationship from two perspectives.

Our goal is to give complex ideas a gentle doorway while leaving room for each person’s own judgment.

## Explore CHANDRA

| Feature | What you can do |
| --- | --- |
| Interactive birth chart | Enter your birth date, required local birth time, and city. Explore signs, planets, houses, and their symbolic themes. |
| Chart views | Switch between the birth chart, Navamsa D9, planetary positions, and approximate Vedic life periods. |
| Basic and AI readings | Start with structured explanations, then ask DeepSeek questions grounded in calculated chart data. |
| Your birth Moon | See an automatically rotating lunar globe with a phase calculated for your birth moment. Move through the 15 days before and after birth with the timeline. |
| Two-person compatibility | Select two profiles, explore their individual charts and a midpoint composite chart, and request relationship reflections. |
| Profiles and reports | Save profiles in your browser and download a simple HTML chart report without creating an account. |
| Motion controls | Pause decorative motion and explore the interface with reduced-motion support. |

### Try a quick demo

1. Open the [live website](https://chandra-moon-journey-mw.noisy-fig-2085.chatgpt.site).
2. Choose **Explore an example chart**, or enter your own birth details.
3. Hover over or select chart areas to explore their meanings.
4. Open **DeepSeek reading** and ask a reflection question.
5. Open **Birth Moon** and move the timeline to see the phase change.
6. In **Two-person compatibility**, try the fictional example pair and switch between Chart A, Chart B, and Composite.

The birth chart remains the default result view. Date and time controls use browser-native pickers, so their appearance and 12/24-hour format vary by browser and device.

## How it works

- **Astronomy Engine** calculates astronomical positions and lunar phase information.
- **Luxon** interprets local birth times and time zones.
- The astrology layer uses an **approximate Lahiri sidereal offset**, **mean lunar nodes**, and **whole-sign houses**, with derived D9 placements and Vimshottari life periods.
- **SVG** supports interactive charts. **Canvas** renders a rotating globe using a NASA lunar surface map.
- A **Cloudflare Worker** handles requests to the **DeepSeek API**, keeping credentials out of browser code.
- **OpenAI Sites** hosts the public website. **GitHub** supports collaboration and version control; **OpenAI Codex** assisted development and iteration.

The Moon’s rotation is accelerated for exploration. Its illumination responds to the selected instant, but the animation is not a photograph or a reconstruction of the exact view from a particular location. Local tilt and libration are not modeled.

## Run locally

Use a recent Node.js version supported by the installed Wrangler release, with npm.

```bash
git clone https://github.com/MelissaWang1014/HackWashU2026.git
cd HackWashU2026
npm ci
npm run build
npm run dev
```

Open **http://localhost:4173**.

The current build bundles the frontend into the Worker. After editing source files, run `npm run build` again and refresh the page; the development server does not directly bundle those source changes for you.

### Enable local AI readings

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` privately:

```dotenv
DEEPSEEK_API_KEY=your_private_key
DEEPSEEK_MODEL=deepseek-flash
```

Restart `npm run dev` after changing these values. The example model is the application’s configured default; set `DEEPSEEK_MODEL` to a model available to your account if needed.

Without a key, local charts, basic readings, and the Moon explorer still work. AI readings display a configuration message. Provider access, available credit, and network connectivity are required for generation.

**Never commit API keys.** `.dev.vars` and `.env` are ignored. Production secrets are configured separately in Sites; a local secret file does not configure the published website.

## Development and validation

```bash
npm run build
npm test
```

The current suite contains 18 tests covering astronomical calculations, birth-time validation, chart context, lunar phases and illumination direction, API response handling, and the separate messaging agent’s context behavior. Provider tests use mocked responses; they do not replace live connectivity checks. A deployed DeepSeek request was also successfully tested with fictional birth data during development.

| Location | Purpose |
| --- | --- |
| `src/index.html` | Page structure and forms |
| `src/style.css` | Shared visual design and responsive styles |
| `src/app.js` | Profiles, chart navigation, comparison, and report downloads |
| `src/astro.js` | Chart calculations and compatibility helpers |
| `src/interpretation.js` | Interpretation helpers and reading-context validation |
| `src/chart-reading.js` | Interactive chart exploration and personal readings |
| `src/birth-moon.js` | Lunar calculations, rotating globe, and timeline |
| `src/preview-motion.js` | Page motion controls |
| `src/reading-api.js` | Server-side DeepSeek integration |
| `src/worker.js` | Website assets and API routing |
| `public/` | Lunar imagery and other public assets |
| `tests/` | Automated checks |
| `agent/` | Separate experimental Photon Spectrum integration |

## Privacy and boundaries

- No account is required for the website.
- Birth charts are calculated in the browser. Saved profiles use that browser’s local storage; they are not automatically synchronized between devices. Clearing site data removes saved profiles.
- Requesting an AI reading sends chart context and the question through the server to DeepSeek. Individual-reading context omits names and raw birth dates, times, and locations. Relationship-reading context includes the selected profile names and chart placements. Information typed into a question is also sent.
- API credentials remain server-side. Treat downloaded reports as personal files.

CHANDRA is for **cultural exploration and reflection**. Astrology readings are symbolic interpretations, not scientifically established predictions or medical, financial, or relationship advice. Calculations are exploratory approximations and may differ from specialist ephemerides, especially near boundaries. Users’ choices and lived experiences matter more than a chart.

## What we learned

Our biggest design challenge was keeping detailed charts approachable while making the Moon feel personal. Feedback led us to preserve the chart as the main starting point, give the Moon its own view, and keep both automatic rotation and a visible time slider.

We also learned to distinguish astronomical calculations, cultural interpretation, and AI-generated language. Each plays a different role, and clear boundaries make the experience easier to understand.

## Deployment and integration notes

The public application is deployed through OpenAI Sites using the existing project configuration in `.openai/hosting.json`. Pushing to GitHub alone does **not** automatically update that website; publication is a separate step. Preserve production secrets and public-access settings when deploying.

The repository retains an experimental **Photon Spectrum** agent. The website’s former “Discuss with Chandra” chat preview, iMessage entry point, and context-copy interface have been removed. Publishing the website does not start the standalone agent or establish a live iMessage service. It is not part of the current website demo.

Older D1 configuration and migration scripts also remain in the repository. The current website’s profile workflow uses browser storage rather than D1.

## Next steps

- Improve date/time picker consistency across browsers.
- Expand keyboard, screen-reader, and mobile testing.
- Validate chart calculations against additional references.
- Make AI data-sharing boundaries clearer, especially for relationship readings.
- Explore optional journaling and richer explanations of Vedic traditions.

## Credits

- [NASA Scientific Visualization Studio — CGI Moon Kit](https://svs.gsfc.nasa.gov/4720): lunar surface imagery, credited to NASA / GSFC / Arizona State University.
- Astronomy Engine and Luxon for calculation and time-handling foundations.
- DeepSeek for AI-generated readings.
- Built collaboratively for HackWashU 2026 around the “Fly Me to the Moon” theme.

*Astronomy draws the sky, culture offers a language for exploring it, and AI makes room for questions. How you live remains yours to decide.*

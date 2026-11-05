# CYPHR Toolkit

CYPHR is a browser-based market-research toolkit for crypto traders. It brings together price/time calculations, Gann-inspired research utilities, market-data views, a watchlist, and exportable research notes in a single-page interface.

The project is a research and educational tool, not an investment adviser, trading execution system, or guarantee of market outcomes. Calculations and external market data can be incomplete or delayed; verify important inputs independently.

## Project structure

- `index.html` — single-page application and client-side modules.
- `functions/api/` — Vercel serverless API routes.
- `functions/_middleware.js` — API CORS policy.
- `vercel.json` — response security headers and URL behavior.
- `manifest.webmanifest`, `sw.js`, `icon.svg` — installable PWA assets.
- `netlify/` and `netlify.toml` — legacy Netlify implementation retained for reference; its alert/rules functionality is disabled pending authentication.
- `SECURITY.md` — security reporting and security-design notes.
- `OPEN_SOURCE_RELEASE_CHECKLIST.md` — release-readiness requirements.

The frontend is intentionally dependency-light and currently has no package-manager manifest or application build step. Vercel serves the static frontend and API functions.

## Run locally

For a frontend-only preview, run a static HTTP server from the repository root:

```bash
python -m http.server 3000
```

Then open `http://localhost:3000`.

The static server does not emulate Vercel Functions. API-backed features that depend on `/api/*` require a Vercel Preview or a local Vercel development environment with the appropriate project configuration.

## Deploy with Vercel

1. Import this GitHub repository into Vercel, or use the existing CYPHR Vercel project.
2. Set the project root to the repository root.
3. Keep the framework preset set to **Other** / no framework detection, unless the project configuration is intentionally changed.
4. Leave the build command empty; the current frontend is static and has no build step.
5. Verify the Preview deployment before changing the Production branch or promoting a deployment.

Vercel Git integration creates Preview deployments for non-production branches. Do not put environment files, deployment state, API credentials, or private user data in Git.

## API routes

| Route | Purpose | Current status |
|---|---|---|
| `GET /api/health` | Basic backend availability probe | Available |
| `GET /api/news` | Aggregated crypto-news feed | Available |
| `GET /api/klines` | Binance candlestick data proxy | Available |
| `GET /api/depth` | Binance order-book depth proxy | Available |
| `GET /api/funding` | Funding, mark price, open interest, long/short data | Available |
| `GET /api/multi` | Cross-exchange price comparison | Available |
| `GET /api/gems` | DexScreener token discovery aggregation | Available |
| `GET /api/safety` | GoPlus token-risk lookup | Available |
| `GET /api/proxy` | Exact-host allowlisted HTTPS proxy | Restricted |
| `POST /api/alert` | Notification relay | Disabled pending authentication |
| `GET/POST/DELETE /api/rules` | Shared alert-rule storage | Disabled pending authorization and per-user isolation |

The alert and rules endpoints deliberately return `503` until they have proper caller authentication, authorization, per-user storage isolation, validation, and rate limits. Do not re-enable these routes by adding secrets alone.

## Browser-side market data

The watchlist can use public market-data endpoints and an optional Twelve Data key entered by the user in the browser. That key is stored in that browser's local storage and sent directly to Twelve Data. Use a restricted data-only key, never an exchange trading or withdrawal credential, and never commit a key to the repository.

## Security and responsible use

Read [SECURITY.md](SECURITY.md) before reporting or changing security-sensitive behavior. The current API middleware uses an origin allowlist, but CORS is not authentication. The Content Security Policy is report-only because the existing single-page UI uses inline scripts and event handlers; do not enforce a stricter policy without a tested migration.

Run the source-level checks with:

```bash
node scripts/security-smoke.mjs
```

These smoke checks are a guardrail, not a penetration test or proof that the application is secure. Review the full Git history, deployment configuration, API handlers, and frontend rendering paths before a public release.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please do not include credentials, personal data, or screenshots containing secrets in issues or pull requests.

## License

No license has been added yet. Until the maintainers choose and add a license after confirming they have the necessary rights to the source code and assets, do not assume that the repository grants permission to use, modify, or redistribute its contents.

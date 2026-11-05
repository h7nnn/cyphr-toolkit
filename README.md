# Cyphr Toolkit

> Open-Source W.D. Gann Market Geometry, Time-Price Cycle Harmonics & Real-Time Crypto/Metals PWA

Live Production: https://cyphr-toolkit.vercel.app

---

## Why Cyphr Toolkit Exists (Ecosystem Gap)

In retail and quantitative technical analysis, non-linear market geometry tools—such as W.D. Gann Square of 9, cardinal and ordinal degree grids, price-time cycle harmonics, and cycle confluences—are typically locked inside expensive proprietary trading terminals or closed-source scripts. Independent traders, quantitative analysts, students, and developers often lack access to a transparent, auditable reference implementation.

Cyphr Toolkit solves this ecosystem gap by providing a fully open-source, zero-dependency, browser-native toolkit. All calculations execute transparently on the client side without black-box logic or proprietary software lock-in.

---

## Core Features & Architecture

- Zero-Dependency Vanilla JS + HTML PWA: Single-page Progressive Web App architecture (`index.html`, client-side modules) with offline capabilities via Service Worker (`sw.js`) and web app manifest (`manifest.webmanifest`).
- W.D. Gann & Cycle Calculation Suite: Built-in algorithms for Gann Square of 9, cardinal/ordinal angle grids, price-time harmonic levels, and multi-timeframe cycle confluences.
- Live & Historical Market Aggregation: Real-time data streaming and historical price aggregation for cryptocurrencies and metals (including XAU/USD).
- Local Storage Watchlists & Exportable Notes: Client-side local-storage state management for custom watchlists, key price levels, and downloadable research notes.
- Hardened Serverless API Proxies: Vercel serverless proxy functions located in `functions/api/` for secure external data fetching.

### Project Structure

- `index.html` - single-page application and client-side modules.
- `functions/api/` - Vercel serverless API routes.
- `functions/_middleware.js` - API CORS policy.
- `vercel.json` - response security headers and URL behavior.
- `manifest.webmanifest`, `sw.js`, `icon.svg` - installable PWA assets.
- `netlify/` and `netlify.toml` - legacy Netlify implementation retained for reference; its alert/rules functionality is disabled pending authentication.
- `SECURITY.md` - security reporting and security-design notes.
- `CONTRIBUTING.md` - contributor guidelines and community standards.
- `LICENSE` - MIT License file.

---

## Security & Open-Source Governance

- DOM XSS Sanitization: All dynamic user inputs and external data feeds undergo strict client-side DOM XSS sanitization before rendering.
- HTTPS Host-Allowlisted Proxy Boundaries: Serverless proxy endpoints (`functions/api/`) enforce strict HTTPS target host allowlists to prevent SSRF and unauthorized requests.
- Disabled Unauthenticated Routes: Legacy notification and alert routes remain disabled pending rate-limited authentication infrastructure.
- Vulnerability Reporting Policy: Clear disclosure process documented in `SECURITY.md`.
- Open-Source Governance: Community contribution guidelines outlined in `CONTRIBUTING.md` and standard open-source governance.
- MIT License: Fully open-source codebase licensed under the `MIT License` (`LICENSE`).

---

## Open-Source Roadmap

- Extracting a standalone `@cyphr/gann-core` TypeScript/NPM package for core mathematical geometry algorithms with 100% unit test coverage.
- Implementing property-based mathematical verification against historical market datasets.
- Building authenticated edge alert webhooks.

---

## Run Locally

For a frontend-only preview, run a static HTTP server from the repository root:

```bash
python -m http.server 3000
```

---

## Disclaimer

The project is a research and educational tool, not an investment adviser, trading execution system, or guarantee of market outcomes. Calculations and external market data can be incomplete or delayed; verify important inputs independently.

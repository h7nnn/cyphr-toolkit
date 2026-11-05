# Cyphr Toolkit

> Open-source W.D. Gann mathematical market geometry (Square of 9, time-price cycle harmonics) & real-time crypto/metals analytics PWA.

**[License: MIT](LICENSE)** | **[Live Demo: cyphr-toolkit.vercel.app](https://cyphr-toolkit.vercel.app)** | **[PWA Ready](manifest.webmanifest)** | **[Security Policy](SECURITY.md)** | **[PRs Welcome](CONTRIBUTING.md)**

---

## Overview & Ecosystem Gap

In retail and quantitative technical analysis, non-linear market geometry tools—such as W.D. Gann Square of 9, cardinal and ordinal degree grids, price-time cycle harmonics, and cycle confluences—are traditionally locked behind expensive proprietary desktop terminals or closed-source scripts. Independent traders, quantitative analysts, students, and developers often lack access to a transparent, auditable reference implementation.

Cyphr Toolkit solves this ecosystem gap by providing a fully open-source, zero-dependency, browser-native reference implementation. All calculations execute transparently on the client side without black-box logic or proprietary software lock-in.

---

## Core Capabilities

- **W.D. Gann & Cycle Harmonics Engine:** Square of 9 degree/angle projections, cardinal and ordinal cross levels, and time-price cycle confluence calculators.
- **Market Data Aggregation:** Real-time and historical cryptocurrency and metals (XAUUSD) price feeds and cycle analysis.
- **Zero-Dependency Offline-First PWA:** Built with vanilla JavaScript and HTML (`sw.js`, `manifest.webmanifest`) with zero client-side framework bloat, local-storage watchlists, and markdown/JSON note exports.
- **Hardened Serverless Proxy Layer:** Edge/serverless proxy endpoints (`functions/api/` for Vercel and `netlify/functions/` for legacy deployments).

---

## Architecture & Repository Structure

```
cyphr-toolkit/
├── index.html                  # Main PWA UI layout and component entry point
├── sw.js                       # Offline caching Service Worker implementation
├── manifest.webmanifest        # Progressive Web App manifest configuration
├── functions/                  # Vercel Serverless / Edge Function API endpoints
│   └── api/                    # Hardened proxy endpoints for external market feeds
├── netlify/                    # Netlify legacy serverless functions
│   └── functions/              # Proxy endpoints for legacy deployments
├── .github/                    # GitHub workflow, issue templates, and community standards
│   ├── ISSUE_TEMPLATE/         # Bug report and feature request templates
│   └── pull_request_template.md# Standard pull request verification checklist
├── CODE_OF_CONDUCT.md          # Contributor Covenant Code of Conduct
├── CONTRIBUTING.md             # Contribution guidelines & development workflow
├── SECURITY.md                 # Security disclosure policy and hardening details
└── LICENSE                     # MIT Open Source License
```

---

## Security & Open-Source Hardening

Cyphr Toolkit incorporates comprehensive defense-in-depth protections implemented in PR #1:

- **DOM XSS Escaping:** Strict escaping on all user-controlled watchlist/history strings prior to DOM insertion.
- **Serverless Proxy Hardening:** HTTPS-only host-allowlisted proxy validation with a 2 MB response cap to mitigate SSRF and buffer exhaustion.
- **Route Gating:** Gated unauthenticated notification/alert-rule routes pending rate-limited auth.
- **Secrets Exclusion:** Secret exclusions maintained in `.gitignore`.
- **Private Vulnerability Reporting:** GitHub Private Vulnerability Reporting enabled and documented in `SECURITY.md`.

---

## Quick Start & Local Development

### Local Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/h7nnn/cyphr-toolkit
   cd cyphr-toolkit
   ```

2. **Serve locally:**
   ```bash
   npx serve .
   # or using Vercel CLI
   vercel dev
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

---

## Open-Source Roadmap

- [ ] **@cyphr/gann-core Package:** Extracting a standalone, tree-shakeable `@cyphr/gann-core` TypeScript/NPM package with 100% unit test coverage.
- [ ] **Property-Based Verification:** Property-based mathematical verification against historical market datasets.
- [ ] **Authenticated Edge Alerts:** Authenticated edge webhook alerts for market cycle events.

---

## Contributing & License

Contributions are welcome! See [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and [`SECURITY.md`](SECURITY.md).

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full text.

# Cyphr Toolkit

> Open-source W.D. Gann mathematical market geometry (Square of 9, time-price cycle harmonics) & real-time crypto/metals analytics PWA.

[![CI & Security Checks](actions/workflows/ci.yml/badge.svg)](actions/workflows/ci.yml) | [![CodeQL Security Scan](actions/workflows/codeql.yml/badge.svg)](actions/workflows/codeql.yml) | **[License: MIT](LICENSE)** | **[Live Demo: cyphr-toolkit.vercel.app](https://cyphr-toolkit.vercel.app)** | **[PWA Ready](manifest.webmanifest)** | **[Security Policy](SECURITY.md)** | **[PRs Welcome](CONTRIBUTING.md)**

---

## Overview & Ecosystem Gap

In retail and quantitative technical analysis, non-linear market geometry tools—such as W.D. Gann Square of 9, cardinal and ordinal degree grids, price-time cycle harmonics, and cycle confluences—are traditionally locked behind expensive proprietary desktop terminals or closed-source scripts. Independent traders, quantitative analysts, students, and developers often lack access to a transparent, auditable reference implementation.

Cyphr Toolkit solves this ecosystem gap by providing a fully open-source, zero-dependency, browser-native reference implementation. All calculations execute transparently on the client side without black-box logic or proprietary software lock-in.

---

## System & Security Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Offline-First PWA Client"]
        A["index.html UI Interface"] --> B["sw.js Service Worker Cache"]
        A --> C["DOM XSS Sanitizer Engine"]
        A --> D["LocalStorage Watchlist Storage"]
    end
    
    subgraph Security["Vercel Edge Security Layer"]
        E["vercel.json (HSTS, CSP, Frame-Deny Headers)"] --> F["functions/api/ (HTTPS Host-Allowlisted & 2MB-Capped Proxy)"]
    end
    
    subgraph Feeds["External Market Data Feeds"]
        G["Cryptocurrency Market APIs"]
        H["Metals (XAU/USD) Market Feeds"]
    end

    Client --> E
    F --> Feeds
```

---

## Core Capabilities

- **W.D. Gann & Cycle Harmonics Engine:** Square of 9 degree/angle projections, cardinal and ordinal cross levels, and time-price cycle confluence calculators.
- **Market Data Aggregation:** Real-time and historical cryptocurrency and metals (XAUUSD) price feeds and cycle analysis.
- **Zero-Dependency Offline-First PWA:** Built with vanilla JavaScript and HTML (`sw.js`, `manifest.webmanifest`) with zero client-side framework bloat, local-storage watchlists, and markdown/JSON note exports.
- **Hardened Serverless Proxy Layer:** Edge/serverless proxy endpoints (`functions/api/`) for Vercel and Netlify (`netlify/functions/api.js`) with host allowlisting and request payload limits (2MB).

---

## Enterprise Security Architecture & Defense-in-Depth

Security is integrated natively into every architectural layer of Cyphr Toolkit:

- **Automated SAST Scanning:** Integrated GitHub [CodeQL SAST Workflow](.github/workflows/codeql.yml) running on `push`, `pull_request`, and weekly cron schedules to detect security vulnerabilities and static bugs.
- **Automated Dependency Management:** Automated updates via GitHub [Dependabot Configuration](.github/dependabot.yml) monitoring GitHub Actions ecosystem dependencies weekly.
- **Code Ownership & Guardrails:** Explicit code ownership defined in [.github/CODEOWNERS](.github/CODEOWNERS) assigning core repository paths (`*`, `/.github/`, `/functions/`) to maintainer `@h7nnn`.
- **RFC 9116 Security Manifest:** Publicly disclosed security metadata at [.well-known/security.txt](.well-known/security.txt) standardizing vulnerability report procedures.
- **Enterprise HTTP Security Headers:** Strict global HTTP header enforcement in [vercel.json](vercel.json) including HSTS (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive `Permissions-Policy`.
- **Client-Side Data Isolation & Sanitization:** Zero external tracking, client-side DOM XSS sanitization, and strict input validation.

---

## Repository Structure

```
.
├── .github/
│   ├── CODEOWNERS              # Code ownership declarations
│   ├── dependabot.yml          # Dependabot automation rules
│   └── workflows/              # GitHub Actions CI & CodeQL SAST workflows
├── .well-known/
│   └── security.txt            # RFC 9116 security contact manifest
├── functions/                  # Vercel serverless proxy functions
├── index.html                  # Core PWA application layout & engine
├── manifest.webmanifest        # PWA application manifest
├── sw.js                       # Offline service worker cache engine
└── vercel.json                 # Enterprise HTTP security header rules
```

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

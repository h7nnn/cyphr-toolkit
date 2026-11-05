# Cyphr · Quant Vault — Cloudflare Pages deploy

Static frontend (`index.html`) + edge backend (`functions/`) + PWA. No build step.

## Deploy (2 minutes, free)

### Option A — drag & drop
1. **Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets**.
2. Drag this whole `cyphr-pages` folder in.
3. **Deploy** → live at `https://<project>.pages.dev`.

### Option B — Git
1. Push this folder to GitHub.
2. Pages → **Connect to Git** → select repo.
3. Framework preset: **None**. Build command: *(empty)*. Output dir: `/`.

## API endpoints (auto-served from `functions/`)

| Route | Purpose |
|---|---|
| `GET /api/health` | Backend probe (frontend auto-detects) |
| `GET /api/news` | Aggregated headlines (CoinDesk, Cointelegraph, The Block, Decrypt) |
| `GET /api/klines?symbol=&interval=&limit=` | Binance OHLC proxy (works in geo-blocked regions) |
| `GET /api/multi?symbol=` | Cross-exchange price + spread (Binance, Bybit, OKX, Coinbase) |
| `GET /api/funding?symbol=` | Perp funding rate, mark price, open interest, long/short ratio |
| `GET /api/proxy?url=<allowlisted>` | Generic passthrough for whitelisted hosts |
| `POST /api/alert` | Relay one-shot alert to Telegram / Discord |
| `GET/POST/DELETE /api/rules` | Persistent alert rules (needs KV binding `CYPHR_KV`) |

## Alerts (optional)
**Pages → Settings → Environment variables**:
- `TG_BOT_TOKEN` + `TG_CHAT_ID` — Telegram
- `DISCORD_WEBHOOK` — Discord webhook URL

## Persistent rules + background monitor (optional)
1. **Pages → Settings → Functions → KV namespace bindings** → add `CYPHR_KV`.
2. Deploy the companion `cyphr-cron` worker (see its README) bound to the **same** KV namespace. It checks rules every 5 min and pushes hits to Telegram even with no browser open.

## PWA
`manifest.webmanifest` + `sw.js` make the app installable and offline-capable. The service worker only registers over HTTPS (i.e. once deployed), and never caches `/api/*`.

## Graceful fallback
Opened as a local file, the app uses public APIs directly. Deployed on Pages, it auto-routes news, klines, the cross-exchange spread, and funding through the edge — same file, works everywhere.

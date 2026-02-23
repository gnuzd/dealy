# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend development (SvelteKit on port 1420)
bun run dev

# Full Tauri desktop app dev (launches Rust + frontend together)
bunx tauri dev

# Build frontend only
bun run build

# Build full Tauri app
bunx tauri build

# Type-check
bun run check
bun run check:watch
```

Cloudflare Workers in `services/` are started individually:
- `get-deals` worker → port 8787
- `compare` worker → port 8788

## Architecture

**Tauri desktop app** wrapping a SvelteKit SPA. No SSR — `ssr = false` is set in `src/routes/+layout.ts` and `adapter-static` is used with `fallback: "index.html"`. This means **no `+server.ts` route files** — all external API calls go through Cloudflare Workers.

```
src/                  # SvelteKit frontend (SPA)
  routes/             # Pages only, no server routes
src-tauri/            # Rust/Tauri layer
  src/lib.rs          # Tauri commands (invoke handlers)
  tauri.conf.json     # App config, window size, build commands
services/             # Cloudflare Workers (each a separate project)
  get-deals/          # Deals fetching worker (port 8787)
  compare/            # Product comparison worker (port 8788)
```

Frontend communicates with backend via:
1. `invoke()` from `@tauri-apps/api/core` — calls Rust Tauri commands
2. HTTP fetch to Cloudflare Workers — for Accesstrade API calls

## UI

- **DaisyUI v5** with the **"lofi" theme** — do not add `rounded-*` to DaisyUI `btn`/`input` components
- **Svelte 5 runes**: use `$state`, `$props`, `$derived`, `$effect`
- **Snippets**: defined with `{#snippet name(params)}`, called with `{@render name(args)}` — not as components

## Key Dependencies

- `ts-pattern` — pattern matching; always terminate with `.otherwise(() => {})` or `.exhaustive()`
- `@tauri-apps/api` v2 — Tauri JS bindings
- `@tauri-apps/plugin-opener` — open URLs/files from Rust side

## Accesstrade API

Auth header: `Authorization: Token {access_key}`
Base URL: `https://api.accesstrade.vn`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v1/offers_informations/coupon` | GET | Coupon codes by domain |
| `/v1/offers_informations/multi_link_2_coupons` | POST | Coupons for exact product URL |
| `/v1/products` | GET | Product search by keyword (`sort=price_asc`) |

Deeplink format: `https://go.isclix.com/deep_link/{pubId}?url={encodedUrl}&utm_source=dealy_app`
Pub ID: `6919596271058314754`

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PUBLIC_GET_DEALS_URL` | get-deals Worker URL |
| `PUBLIC_COMPARE_URL` | compare Worker URL |
| `PUBLIC_AT_ACCESS_KEY` | Accesstrade access key (intentionally client-exposed) |

Access keys may be hardcoded for local dev — do not revert them to `env[]`.

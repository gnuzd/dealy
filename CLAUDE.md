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

### Bento Grid Layout

The main app layout uses a 12-column bento grid. Follow these rules strictly.

**Colors — zero hardcoded values:**
- Use only daisyUI semantic classes: `bg-primary`, `bg-base-100`, `text-base-content`, etc.
- Depth via opacity modifiers: `bg-primary/10`, `text-base-content/80`. Never use hex codes or arbitrary grays.
- Never use `bg-white` or `bg-black`.

**Radius — always use daisyUI config tokens:**
- `rounded-box` — all bento cells and main containers
- `rounded-btn` — buttons and small interactive elements
- `rounded-badge` — tags
- Never use `rounded-xl`, `rounded-3xl`, `rounded-none`, `rounded-sm`, or `rounded-full` (except avatars)

**Grid structure:**
```html
<div class="grid grid-cols-12 gap-4 md:gap-6">
  <!-- Default cell -->
  <div class="col-span-12 md:col-span-6 lg:col-span-4 bg-base-200 rounded-box p-6 border border-base-content/5">
  <!-- Featured cell -->
  <div class="col-span-12 lg:col-span-6 bg-primary/5 border border-primary/10 rounded-box p-6">
```

Responsive column spans: `col-span-12` (mobile) → `md:col-span-6` → `lg:col-span-3/4/6`. Use `row-span-2` for tall cells to break horizontal uniformity.

**Typography:**
- Headings: `text-base-content font-bold text-lg` or `text-xl`
- Body: `text-base-content/70`
- Small print: `text-base-content/50 text-xs`
- Icons: `@lucide/svelte` only — consistent size (`size={16}` or `size={20}`), color via Tailwind (`class="text-primary"` or `class="text-base-content/60"`)

**daisyUI components to use inside cells:** `stats`, `progress`, `radial-progress`, `badge`, `loading`. Prefer a plain `div` with custom padding over `card-body` for tighter bento control.

**Shadows:** avoid `shadow-*` — use clean borders (`border border-base-content/5`) instead.

**Cell planning workflow:** categorize content as Primary / Secondary / Metric → place hero top-left (large span) → surround with supporting metrics → use `bg-base-300` or `bg-secondary/10` for visual contrast variety.

### Icons

**Package:** `@lucide/svelte` — this is the Svelte 5 package. Do NOT use `lucide-react` or `lucide-svelte`.

**Import** (prefer direct path for faster builds):
```svelte
<script>
  import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
  // or named import
  import { Tag, Search } from '@lucide/svelte';
</script>

<ShoppingCart class="text-primary" size={20} />
```

**Props:** `size` (number, default 24), `color` (default `currentColor` — use Tailwind `class` instead), `strokeWidth` (number, default 2).

**Before using any icon**, verify it exists and is not deprecated at https://lucide.dev/icons/. Use the exact PascalCase name shown there.

**Deprecated icons** (do not use — no drop-in replacement in lucide):
- `Twitter`, `Facebook`, `Instagram`, `Github`, `Linkedin` — all brand icons removed due to brand guideline policy

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

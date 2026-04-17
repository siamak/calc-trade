# Calc Trade

**Professional trading position-size and risk/reward calculator — built as a production-grade PWA.**

[![Live app](https://img.shields.io/badge/Live-calc--trade.netlify.app-informational?logo=netlify)](https://calc-trade.netlify.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## Overview

Calc Trade helps traders calculate the exact position size, margin, and potential profit/loss for any trade — instantly, on device, and fully offline.

Key user flows:
1. Enter account balance, risk %, stop-loss %, and leverage.
2. See risked capital, required margin, and total position size in real time.
3. Adjust the risk/reward slider to preview estimated PnL and ROE.
4. Install to the home screen and use it anywhere, even without internet.

All calculations run entirely in the browser — no data is ever sent to a server.

---

## Features

| Category | Details |
|---|---|
| **Calculator** | Position size, risked capital, margin, PnL, ROE, percent change |
| **PWA** | Installable, offline-first, update prompt, offline banner |
| **i18n** | English (`en`) and Persian/Farsi (`fa`) with full RTL layout |
| **Themes** | Light / dark / system via `next-themes` |
| **Persistence** | Form values persisted to `localStorage` via `react-hook-form-persist` |
| **Analytics** | Umami event tracking (privacy-friendly, no PII) |
| **Fonts** | Google Fonts Inter (en) · IRANSansX variable font (fa) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router, React Server Components |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + [Motion](https://motion.dev/) animations |
| UI primitives | [Radix UI](https://www.radix-ui.com/) (shadcn/ui components) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| PWA / SW | [next-pwa](https://github.com/shadowwalker/next-pwa) + [Workbox](https://developer.chrome.com/docs/workbox/) |
| Analytics | [Umami](https://umami.is/) |
| URL state | [nuqs](https://nuqs.47ng.com/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Package manager | [pnpm](https://pnpm.io/) |
| Deployment | [Netlify](https://netlify.com/) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22 (LTS recommended)
- **pnpm** ≥ 10 — install with `npm i -g pnpm`

### Installation

```bash
git clone https://github.com/siamak/calc-trade.git
cd calc-trade
pnpm install
```

### Environment variables

Copy the example file and fill in the required values:

```bash
cp env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Optional | URL to your Umami tracking script |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Optional | Umami website ID |

The app works without Umami configured — analytics events are simply no-ops.

### Development

```bash
pnpm dev          # start dev server at http://localhost:3000
```

> The service worker and PWA features are **disabled in development** (`disable: process.env.NODE_ENV === "development"` in `next.config.ts`). To test PWA locally, use the production build.

### Production build

```bash
pnpm build        # compile + generate service worker
pnpm start        # serve the production build locally
```

### Lint

```bash
pnpm lint
```

---

## Project Structure

```
calc-trade/
├── app/
│   ├── layout.tsx                  # Root layout — font preloads
│   └── [locale]/
│       ├── layout.tsx              # Locale layout — providers, meta, PWA shell
│       └── page.tsx                # Main calculator page
├── src/
│   ├── components/
│   │   ├── providers/
│   │   │   └── pwa-provider.tsx    # PWA context — SW, online, install, update
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── calc-form.tsx           # Calculator form
│   │   ├── result.tsx              # Calculation results
│   │   ├── risk-rewards.tsx        # Risk/reward slider + PnL summary
│   │   ├── offline-banner.tsx      # Offline / reconnected strip
│   │   ├── pwa-update-prompt.tsx   # "Update available" card
│   │   └── pwa-install-button.tsx  # Floating install button
│   ├── hooks/
│   │   ├── use-pwa.ts              # Re-exports usePWAContext — public API
│   │   └── use-analytics.ts        # Umami event helpers
│   ├── lib/
│   │   ├── schemas.ts              # Zod form schemas
│   │   └── analytics.ts            # Umami event wrappers
│   └── i18n/
│       ├── routing.ts              # Locale config (en, fa)
│       └── request.ts              # next-intl server config
├── public/
│   ├── manifest.json               # PWA web app manifest
│   ├── sw.js                       # Workbox-generated service worker (gitignored)
│   ├── sw-custom.js                # Deprecated stub — self-unregisters old SW
│   ├── icons/                      # Android + iOS launcher icons
│   ├── splash/                     # iOS splash screens
│   └── webfont/                    # Self-hosted IRANSansX
├── messages/
│   ├── en.json                     # English strings
│   └── fa.json                     # Persian strings
├── contents/                       # Markdown educational content
├── next.config.ts                  # Next.js + next-pwa + next-intl config
└── netlify.toml                    # Netlify deployment config
```

---

## PWA Architecture

### Service worker strategy

The app uses **Workbox `generateSW`** via `next-pwa`. All caching rules are declared in `next.config.ts` — no boilerplate SW file is needed.

**Why `generateSW` instead of `injectManifest`?**  
Every caching requirement is expressible through Workbox's built-in strategies. `generateSW` keeps all configuration colocated and readable. `injectManifest` would only be needed for complex custom fetch logic (e.g., streaming, partial responses, push payloads) which this app does not require.

### SW registration & update lifecycle

`register: false` in `next.config.ts` — registration is handled manually by `PWAProvider` so the app controls the full update flow:

```
New deploy
  └─ Browser fetches /sw.js (byte-changed)
       └─ New SW enters "installing" → "installed (waiting)" state
            └─ PWAProvider detects waiting SW → hasUpdate = true
                 └─ <PWAUpdatePrompt> shown to user
                      └─ User clicks "Update"
                           └─ applyUpdate() sends {type:'SKIP_WAITING'}
                                └─ controllerchange fires → page reloads
```

`skipWaiting: false` ensures the new SW never activates mid-session without the user's consent.

### Caching rules (by resource type)

| Resource | Strategy | Cache name | TTL |
|---|---|---|---|
| Google Fonts CSS | Cache First | `google-fonts-stylesheets` | 1 year |
| Google Fonts binary | Cache First | `google-fonts-webfonts` | 1 year |
| Local webfonts (woff/woff2) | Cache First | `static-font-assets` | 1 year |
| Images (png/svg/ico/webp) | Cache First | `static-image-assets` | 30 days |
| `/_next/image` | StaleWhileRevalidate | `next-image` | 24 h |
| JS bundles | StaleWhileRevalidate | `static-js-assets` | 24 h |
| CSS | StaleWhileRevalidate | `static-style-assets` | 24 h |
| `/_next/data` JSON | NetworkFirst (5 s) | `next-data` | 24 h |
| `/api/content/*` (markdown) | NetworkFirst (8 s) | `api-content` | 7 days |
| Other GET `/api/*` | NetworkFirst (10 s) | `api-others` | 24 h |
| HTML / navigation | NetworkFirst (5 s) | `pages` | 24 h |
| Everything else | NetworkFirst (10 s) | `others` | 24 h |

**What is never cached:**
- POST / PUT / PATCH / DELETE requests
- Auth tokens (there is no auth in this app)

### Offline UX

| Scenario | Behaviour |
|---|---|
| Network unavailable | Amber banner: "You're offline — using cached content" |
| Network restored | Green flash: "Back online" (auto-hides after 3 s) |
| New SW waiting | Bottom-right card with "Update" button |
| Previously visited page | Served from cache (NetworkFirst fallback) |
| Never-visited page offline | Empty cache → browser error (expected) |

### Manifest

`/public/manifest.json` declares:
- `id`, `scope`, `start_url`, `display`, `display_override`
- `purpose: maskable` on the 512 × 512 icon (Android adaptive icons)
- `shortcuts` for quick-launch from the home screen
- `categories: ["finance", "utilities"]`
- `dir: auto` for bilingual support

---

## Internationalisation

Supported locales: **`en`** (English, LTR) and **`fa`** (Persian, RTL).

Route structure:
```
/          →  redirect to /en/
/en/       →  English calculator
/fa/       →  Persian calculator (RTL, IRANSansX font)
```

Adding a new locale:
1. Add it to `src/i18n/routing.ts` → `locales` array.
2. Create `messages/<locale>.json` with the same keys as `en.json`.
3. Add a font class and CSS in `app/globals.css` if a custom font is needed.

---

## Analytics

Analytics are collected via **Umami** (client-side only, privacy-friendly). Page views are tracked automatically by the Umami script. Custom events include:

| Event | Trigger |
|---|---|
| `form_input_changed` | Any form field change |
| `calculation_performed` | Form value change (debounced result) |
| `risk_reward_ratio_changed` | Slider drag |
| `form_reset` | Reset button |
| `theme_changed` | Theme toggle |
| `locale_changed` | Language switch |
| `pwa_install_prompt_shown` | `beforeinstallprompt` fires |
| `pwa_installed` | User accepts install |
| `external_link_clicked` | Outbound link |
| `error_occurred` | Error boundary catches |

All analytics are fire-and-forget. If `NEXT_PUBLIC_UMAMI_SCRIPT_URL` / `NEXT_PUBLIC_UMAMI_WEBSITE_ID` are not set, events are silently skipped.

---

## Deployment

### Netlify (default)

A `netlify.toml` is included. Push to `main` and Netlify will:
1. Run `pnpm build`
2. Publish the `.next/` output

Set `NEXT_PUBLIC_UMAMI_SCRIPT_URL` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in the Netlify dashboard environment variables (optional).

### Other platforms (Vercel, Railway, etc.)

```bash
# Build command
pnpm build

# Output directory
.next

# Install command
pnpm install --frozen-lockfile
```

---

## Testing checklist

### Offline mode
- [ ] Visit the app, then go offline (DevTools → Network → Offline)
- [ ] Reload — amber banner appears, calculator is still usable
- [ ] All calculations work (no network required)
- [ ] Restore connection — green "Back online" flash appears and fades

### First install
- [ ] Open in Chrome desktop → install button appears in address bar
- [ ] Click install → app opens in standalone window
- [ ] Install button no longer appears

### Repeat visit (online)
- [ ] All assets load instantly from SW cache (no waterfall)
- [ ] Lighthouse PWA score ≥ 90

### App update
- [ ] Deploy a code change with a unique build hash
- [ ] Open the already-installed PWA — update prompt appears within ~5 s
- [ ] Click "Update" → page reloads with new version

### Cache invalidation
- [ ] Deploy a new build
- [ ] Old cached assets are served (StaleWhileRevalidate) until SW activates
- [ ] After update prompt and reload, fresh assets load

### Multiple users / multi-tab
- [ ] Open two tabs — both show the same update prompt when a new SW arrives
- [ ] Clicking "Update" in one tab reloads both

### Browser compatibility
- [ ] Chrome 90+ (desktop + Android) — full PWA support
- [ ] Edge 90+ — full PWA support
- [ ] Safari 16.4+ (iOS/macOS) — installable, service worker works, no `beforeinstallprompt`
- [ ] Firefox 90+ — service worker works, no install prompt

### RTL / locale
- [ ] `/fa/` route renders in Persian with RTL layout
- [ ] IRANSansX font loads offline after first visit
- [ ] Offline banner and update prompt display Persian text on `/fa/`

---

## Development notes

### Running PWA features locally

```bash
# Build for production
pnpm build

# Serve the production build
pnpm start

# Open http://localhost:3000
# DevTools → Application → Service Workers to inspect SW state
```

### Clearing service worker state during development

```javascript
// In DevTools console:

// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));

// List all caches
caches.keys().then(console.log);

// Delete all caches
caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
```

---

## License

MIT — see `LICENSE` for details.

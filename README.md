# Art Floor Website

Editorial site for **Art Floor LLC**, a ceramic tile, porcelain tile & natural stone installation company (bathrooms, showers, kitchens, fireplaces, backsplashes, and flooring). Plain HTML/CSS/JS, no build step, no framework, no dependencies.

**Live site:** https://www.artflooratl.com
**Repo:** https://github.com/gabip3/art-floor
**Hosting:** GitHub Pages, custom domain via the `CNAME` file, HTTPS auto-issued by GitHub.

## Concept: "Art you live in."
The floor, shower, or backsplash is the one surface you touch every day, treated here like artwork. Slate-teal + terracotta + white palette (from the logo), Boska (display serif) + General Sans type, immersive full-bleed sections, a drag-through gallery of real project photos, an interactive before/after slider, and a horizontal animated "how it works" workflow.

## Run locally
```bash
npx serve .
```

## Structure
```
index.html        # main site: markup + JSON-LD schema + OG tags + CSP
admin.html         # demo photo-manager panel (not wired to a real backend yet, see below)
review.html        # standalone "leave us a Google review" landing page, for sharing after a job
404.html           # branded not-found page
css/styles.css     # design tokens + all styling
js/main.js         # reveals, gallery, before/after slider, workflow, contact form
js/admin.js        # admin.html's photo-preview demo logic
assets/web/        # logos + optimized real project photos/videos
netlify.toml       # INERT, kept only for reference, GitHub Pages ignores this file
```

## Brand tokens (in :root of styles.css)
| Token | Value | Use |
|---|---|---|
| `--green` | #2E4A57 | slate teal, dark sections, buttons, headings |
| `--coral` | #BC5A2D | terracotta, accents, hovers, CTA |
| `--paper` | #FFFFFF | white, page background |
| `--bone` | #F2F3F4 | neutral off-white, alternating sections |
| `--ink` | #24221E | warm near-black text |

**Type:** Boska (display serif, headings) + General Sans (body), both from Fontshare. `admin.html` also uses Libre Baskerville (Google Fonts) for its own headings, for better legibility at small sizes.
**Logo:** `assets/web/logo-horizontal.png` (header, colored), `logo-horizontal-white.png` (footer + dark pages, transparent white version), `logo-mark.png` (favicon + square mark).

## Contact form (Web3Forms)
The form (`#estimateForm` in `index.html`) posts via `fetch()` to the Web3Forms API using a public `access_key`. Submissions are delivered to the inbox configured in the Web3Forms dashboard for the "Art Floor" form. This key is meant to be public (same model as a Firebase client config or reCAPTCHA site key); the Web3Forms free plan does not support domain-locking the key, only the paid plan does.

## Security
- `Content-Security-Policy` + `Referrer-Policy` set via `<meta>` on every page (adjusted per page to what it actually loads).
- GitHub Pages does not support custom HTTP headers, so `X-Frame-Options` / `X-Content-Type-Options` / HSTS cannot be set from this repo. If those are ever required, front the site with Cloudflare Pages/Workers.
- No third-party JS libraries anywhere (no npm dependencies), no `eval`/`innerHTML`/inline scripts.

## `admin.html`: photo manager
Password-gated panel (client-side SHA-256 check via `js/admin-lock.js`, deterrent only, not real auth) for Artur & Rozi to add project photos themselves. Photos upload for real to a Cloudinary account (unsigned upload preset, `js/admin.js`), tagged per category. `js/gallery-cloud.js` on `index.html` fetches Cloudinary's public tag-based resource list and appends new photos to the "Selected work" gallery automatically, no manual step required. Requires the Cloudinary account's Settings → Security → "Resource list" restriction to stay unchecked (public, tag-scoped listing only, no account secrets exposed).

## Built in
Semantic HTML, single h1, skip link, visible focus, ARIA on widgets; JSON-LD `HomeAndConstructionBusiness`, Open Graph, canonical; lazy-loaded images with explicit dimensions; reduced-motion support throughout.

# Art Floor — Website

Editorial site for **Art Floor LLC**, a flooring company (hardwood, luxury vinyl, laminate, tile & stone). Plain HTML/CSS/JS, no build step — deploy the folder to any static host.

> Repurposed from an earlier build. All previous-client content has been removed.

## Concept — "Art you walk on"
The floor is the one surface you touch every day — treated here like artwork. Terracotta + slate-teal + cream palette (from the logo), Zodiak + General Sans type, immersive sections, a drag-through gallery of floors, and a "prep → finish" section showing the hidden subfloor craft.

## Run locally
```bash
npx serve .
```

## Structure
```
index.html        # markup + JSON-LD schema + OG tags
css/styles.css    # design tokens + all styling
js/main.js        # reveals, counters, gallery, reviews, form
404.html          # branded not-found page
assets/web/       # logo.svg + optimized floor photos
```

## Brand tokens (in :root of styles.css)
| Token | Value | Use |
|---|---|---|
| `--green` | #2E4A57 | slate teal — dark sections, buttons, headings |
| `--coral` | #BC5A2D | terracotta — accents, dots, emphasis, hovers |
| `--paper` / `--bone` | #F5EFE2 / #EBE1CE | cream backgrounds |
| `--ink` | #24221E | warm near-black text |

**Type:** Zodiak (display serif) + General Sans (body), from Fontshare.
**Logo:** `assets/web/logo.svg` (self-contained badge; used in header + footer + favicon).

## ⚠️ Placeholder content to replace before launch
- **Phone** is fictitious: `(555) 240-7519` — swap for the real number (search the codebase for it).
- **Photos** in `assets/web/` are placeholders — replace with Art Floor's own project photos (same filenames).
- **Reviews** (3 quotes) and **stats** (10+ yrs, 500+ floors, 5.0 Google) are representative placeholders — set to real values.
- **Service areas** are generic neighborhood names — set to the real coverage area.
- **Domain**: `www.artfloor.example` in canonical/OG/sitemap/robots — replace with the real domain.

## Contact form (Netlify Forms)
The form is wired for Netlify Forms (`name="estimate"`, honeypot spam trap). Once deployed on Netlify, submissions appear in **Netlify → Forms → estimate**. Add an email notification in *Forms → Settings*. (It does not send when opened locally.)

## Built in
Semantic HTML, single h1, skip link, visible focus, ARIA on widgets; JSON-LD `HomeAndConstructionBusiness` + `FAQPage`, Open Graph, canonical; lazy-loaded images with explicit dimensions; reduced-motion support.

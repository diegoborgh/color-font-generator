# Kern & Hue — Color Palettes & Font Pairings

A browser-based tool that generates cohesive color palettes and typography pairings using color harmony principles and curated font combinations. No build step, no dependencies — just open and use.

---

## Features

### Color Palette Generation
- 4 harmony modes: **Complementary**, **Analogous**, **Triadic**, **Split-Complementary**
- HSL-based algorithm assigns distinct saturation/lightness ranges per color role (primary, secondary, accent, background, text)
- Lock individual colors to preserve them across regenerations
- Interactive color editor with HSL sliders and hex input
- "Regenerate Others from This Hue" — regenerates the full palette around a chosen hue
- Copy any hex value to clipboard

### Font Pairing System
- 40+ hand-curated Google Fonts pairings across three categories: **Serif**, **Sans/Geometric**, and **Display**
- Lock heading or body font independently
- Fonts are loaded on-demand via the Google Fonts API

### Live Preview
- Styled page preview updates in real time as you generate or edit
- Toggle light and dark mode preview
- Full-page preview mode renders a complete landing page mockup with the selected palette and fonts

### Accessibility Checker
- WCAG 2.1 contrast ratio calculator
- Real-time **AA** (4.5:1), **AAA** (7:1), and **AA Large** (3:1) pass/fail badges
- Tests text color against background color

### Export
- **CSS Variables** — ready-to-paste `:root` custom properties with Google Fonts `@import`
- **Tailwind Config** — `theme.extend` block for direct use in `tailwind.config.js`
- **JSON** — structured export with harmony type, font metadata, hex values, and Google Fonts URL

### History
- Stores up to 10 recent generations in session
- Visual mini-swatches for quick identification
- Click any snapshot to restore it

### Favorites
- Save up to 10 aesthetics that persist across browser sessions (stored in `localStorage`)
- Heart button in the Live Preview pane and in the full-page Forma preview to save/unsave
- Hover a favorite card to reveal a × remove button overlaid on the palette swatches
- Heart button disables with a tooltip when the 10-favorite limit is reached; remove one to free a slot
- Restoring a favorited aesthetic highlights its card and fills the heart icon
- Clear all favorites at once with the trash icon — deletion is immediately persisted to `localStorage`

---

## Tech Stack

| Layer | Details |
|---|---|
| HTML | Semantic HTML5, ARIA labels |
| CSS | CSS custom properties, Grid, Flexbox, responsive with `clamp()` |
| JavaScript | Vanilla ES6+, no frameworks or build tools |
| Fonts | Google Fonts API (loaded dynamically) |
| Storage | `localStorage` for theme preference and saved favorites |

---

## Getting Started

1. Clone or download the repository
2. Open `index.html` in any modern browser

No installation, no server, no build step required. Google Fonts loads from CDN on first use.

**Keyboard shortcuts:**
- `Space` — generate a new aesthetic
- `Esc` — close the color picker

---

## Project Structure

```
color-font-generator/
├── index.html      # App shell, layout, and markup
├── style.css       # Theming, components, and responsive styles
├── script.js       # All app logic — generation, rendering, events, export
└── favicon.svg     # Brand icon
```

---

## How It Works

**Palette generation** picks a random base hue, then derives four additional hues using the selected harmony algorithm. Each of the five color roles (primary, secondary, accent, background, text) is assigned a distinct saturation and lightness range to create visual hierarchy.

**Font pairing** selects from a curated list of heading + body combinations. Each pair is tagged with a category (e.g. `Serif + Humanist`, `Geometric + Mono`) and a font mode. The Google Fonts URL is built dynamically and injected as a `<link>` element at runtime.

**Export** reads the current state and formats it as CSS custom properties, a Tailwind `theme.extend` object, or raw JSON — ready to drop into any project.

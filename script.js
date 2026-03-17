/* ============================================================
   AESTHETIC GENERATOR — script.js
   Color generation, font pairing, WCAG contrast, export, history
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   CONSTANTS
────────────────────────────────────────────────────────────── */

const COLOR_ROLES = ['primary', 'secondary', 'accent', 'background', 'text'];

const HARMONY_TYPES = ['complementary', 'analogous', 'triadic', 'split-complementary'];

/**
 * Curated Google Fonts pairings: each has a heading + body font,
 * a typographic category label, and display weights.
 */
const FONT_PAIRS = [
  { heading: 'Playfair Display', headingWeights: '400;700', body: 'Lato', bodyWeights: '400;500', category: 'Serif + Humanist' },
  { heading: 'Merriweather', headingWeights: '400;700', body: 'Source Sans 3', bodyWeights: '400;600', category: 'Serif + Geometric' },
  { heading: 'Libre Baskerville', headingWeights: '400;700', body: 'Open Sans', bodyWeights: '400;600', category: 'Serif + Sans' },
  { heading: 'Cormorant Garamond', headingWeights: '600;700', body: 'Raleway', bodyWeights: '400;500', category: 'Display + Geometric' },
  { heading: 'Lora', headingWeights: '400;700', body: 'Nunito', bodyWeights: '400;600', category: 'Serif + Rounded' },
  { heading: 'DM Serif Display', headingWeights: '400', body: 'DM Sans', bodyWeights: '400;500', category: 'Serif + Geometric' },
  { heading: 'Fraunces', headingWeights: '400;700', body: 'Inter', bodyWeights: '400;500', category: 'Optical + Neutral' },
  { heading: 'Montserrat', headingWeights: '600;700', body: 'Merriweather', bodyWeights: '400', category: 'Geometric + Serif' },
  { heading: 'Space Grotesk', headingWeights: '500;700', body: 'Space Mono', bodyWeights: '400', category: 'Geometric + Mono' },
  { heading: 'Josefin Sans', headingWeights: '300;600', body: 'Crimson Text', bodyWeights: '400;600', category: 'Geometric + Serif' },
  { heading: 'Syne', headingWeights: '600;800', body: 'Outfit', bodyWeights: '400;500', category: 'Display + Geometric' },
  { heading: 'Plus Jakarta Sans', headingWeights: '500;700', body: 'Lora', bodyWeights: '400', category: 'Humanist + Serif' },
  { heading: 'Abril Fatface', headingWeights: '400', body: 'Lato', bodyWeights: '400;500', category: 'Display + Humanist' },
  { heading: 'Fjalla One', headingWeights: '400', body: 'Cantarell', bodyWeights: '400;700', category: 'Condensed + Humanist' },
  { heading: 'Spectral', headingWeights: '400;700', body: 'Karla', bodyWeights: '400;500', category: 'Serif + Grotesque' },
];

/* ──────────────────────────────────────────────────────────────
   APPLICATION STATE
────────────────────────────────────────────────────────────── */

const state = {
  palette: {
    primary:    { h: 0, s: 0, l: 0, hex: '#000000' },
    secondary:  { h: 0, s: 0, l: 0, hex: '#000000' },
    accent:     { h: 0, s: 0, l: 0, hex: '#000000' },
    background: { h: 0, s: 0, l: 0, hex: '#000000' },
    text:       { h: 0, s: 0, l: 0, hex: '#000000' },
  },
  locks: {
    primary:    false,
    secondary:  false,
    accent:     false,
    background: false,
    text:       false,
    heading:    false,
    body:       false,
  },
  fonts: {
    heading: null,
    body:    null,
    pair:    null,
  },
  harmony:    '',
  activeTab:  'css',
  history:    [],
  hasGenerated: false,
};

/* ──────────────────────────────────────────────────────────────
   COLOR UTILITIES
────────────────────────────────────────────────────────────── */

/** Wrap hue to 0–360 */
function wrapHue(h) {
  return ((h % 360) + 360) % 360;
}

/** Random float between min and max */
function rnd(min, max) {
  return min + Math.random() * (max - min);
}

/** Random integer between min and max (inclusive) */
function rndInt(min, max) {
  return Math.floor(rnd(min, max + 1));
}

/**
 * Convert HSL (h: 0-360, s: 0-100, l: 0-100) to RGB (0-255 each).
 */
function hslToRgb(h, s, l) {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/** Convert RGB to hex string */
function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Get hex string from HSL */
function hslToHex(h, s, l) {
  return rgbToHex(hslToRgb(h, s, l));
}

/** Build a color object from HSL values */
function makeColor(h, s, l) {
  h = wrapHue(h);
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  return { h, s, l, hex: hslToHex(h, s, l) };
}

/* ──────────────────────────────────────────────────────────────
   PALETTE GENERATION — Harmony Algorithms
────────────────────────────────────────────────────────────── */

/**
 * Generate a 5-color palette based on the given harmony type.
 * Each call randomizes saturation/lightness within sensible ranges
 * while keeping the hue relationships consistent.
 */
function generatePalette(harmonyType, baseHue) {
  const H = baseHue ?? rnd(0, 360);
  let palette = {};

  switch (harmonyType) {
    case 'complementary': {
      // Two hues 180° apart
      const C = wrapHue(H + 180);
      palette = {
        background: makeColor(H,  rnd(6, 14),  rnd(93, 97)),
        text:       makeColor(H,  rnd(15, 30), rnd(9,  17)),
        primary:    makeColor(H,  rnd(60, 78), rnd(38, 52)),
        secondary:  makeColor(C,  rnd(45, 65), rnd(44, 58)),
        accent:     makeColor(C,  rnd(65, 82), rnd(52, 66)),
      };
      break;
    }
    case 'analogous': {
      // Three hues each 30° apart
      const H2 = wrapHue(H + 30);
      const H3 = wrapHue(H + 60);
      palette = {
        background: makeColor(H,  rnd(6, 12),  rnd(93, 97)),
        text:       makeColor(H,  rnd(18, 32), rnd(9,  16)),
        primary:    makeColor(H,  rnd(62, 78), rnd(38, 52)),
        secondary:  makeColor(H2, rnd(52, 68), rnd(44, 57)),
        accent:     makeColor(H3, rnd(55, 72), rnd(48, 62)),
      };
      break;
    }
    case 'triadic': {
      // Three hues 120° apart
      const T1 = wrapHue(H + 120);
      const T2 = wrapHue(H + 240);
      palette = {
        background: makeColor(H,  rnd(6, 12),  rnd(93, 97)),
        text:       makeColor(T1, rnd(18, 34), rnd(9,  18)),
        primary:    makeColor(H,  rnd(60, 76), rnd(40, 52)),
        secondary:  makeColor(T1, rnd(48, 65), rnd(44, 57)),
        accent:     makeColor(T2, rnd(55, 72), rnd(46, 60)),
      };
      break;
    }
    case 'split-complementary':
    default: {
      // Base hue + two hues flanking the complement (±30°)
      const S1 = wrapHue(H + 150);
      const S2 = wrapHue(H + 210);
      palette = {
        background: makeColor(H,  rnd(6, 14),  rnd(93, 97)),
        text:       makeColor(H,  rnd(15, 30), rnd(9,  17)),
        primary:    makeColor(H,  rnd(60, 78), rnd(38, 52)),
        secondary:  makeColor(S1, rnd(48, 65), rnd(44, 57)),
        accent:     makeColor(S2, rnd(55, 72), rnd(48, 62)),
      };
      break;
    }
  }

  return palette;
}

/* ──────────────────────────────────────────────────────────────
   WCAG CONTRAST CALCULATION
────────────────────────────────────────────────────────────── */

/**
 * Compute the relative luminance of an sRGB color.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance({ r, g, b }) {
  const toLinear = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Compute WCAG contrast ratio between two hex colors.
 * Returns a number like 4.52.
 */
function contrastRatio(hex1, hex2) {
  const rgb1 = hslToRgbFromHex(hex1);
  const rgb2 = hslToRgbFromHex(hex2);
  const L1 = relativeLuminance(rgb1);
  const L2 = relativeLuminance(rgb2);
  const lighter = Math.max(L1, L2);
  const darker  = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse a hex color to RGB. Accepts #RRGGBB or #RGB.
 */
function hslToRgbFromHex(hex) {
  const c = hex.replace('#', '');
  const full = c.length === 3
    ? c.split('').map(x => x + x).join('')
    : c;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/* ──────────────────────────────────────────────────────────────
   FONT LOADING
────────────────────────────────────────────────────────────── */

/** Build a Google Fonts CSS2 URL for a font pair */
function buildGoogleFontsUrl(pair) {
  const h = pair.heading.replace(/ /g, '+');
  const b = pair.body.replace(/ /g, '+');
  const params = [
    `family=${h}:ital,wght@0,${pair.headingWeights};1,${pair.headingWeights}`,
    `family=${b}:wght@${pair.bodyWeights}`,
    'display=swap',
  ];
  return `https://fonts.googleapis.com/css2?${params.join('&')}`;
}

/** Inject or update the dynamic font link tag */
function loadFontPair(pair) {
  const id = 'dynamic-fonts';
  let link = document.getElementById(id);
  if (!link) {
    link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = buildGoogleFontsUrl(pair);
}

/* ──────────────────────────────────────────────────────────────
   GENERATION ENGINE
────────────────────────────────────────────────────────────── */

/**
 * Main generation function. Respects locked elements.
 * Called on "Generate" button click.
 */
function generate() {
  // Pick harmony type (or keep if all colors locked)
  const harmonyType = HARMONY_TYPES[rndInt(0, HARMONY_TYPES.length - 1)];
  const newHarmony = harmonyType;

  // Generate full palette
  const newPalette = generatePalette(harmonyType);

  // Apply locks: keep existing color for locked roles
  COLOR_ROLES.forEach(role => {
    if (!state.locks[role]) {
      state.palette[role] = newPalette[role];
    }
  });

  // Always update harmony label if at least one color changed
  state.harmony = newHarmony;

  // Font pair: pick a new pair if not locked
  if (!state.locks.heading || !state.locks.body) {
    const pool = FONT_PAIRS.filter(p => {
      // Don't re-pick the same pair if possible
      if (!state.fonts.pair) return true;
      return p.heading !== state.fonts.pair.heading || p.body !== state.fonts.pair.body;
    });
    const newPair = pool[rndInt(0, pool.length - 1)];

    if (!state.locks.heading) state.fonts.heading = newPair.heading;
    if (!state.locks.body)    state.fonts.body    = newPair.body;

    // Update the full pair reference (used for export URL)
    // Find the pair that matches current heading+body
    const matchedPair = FONT_PAIRS.find(p =>
      p.heading === state.fonts.heading && p.body === state.fonts.body
    ) || newPair;
    state.fonts.pair = matchedPair;

    loadFontPair(matchedPair);
  }

  state.hasGenerated = true;

  // Render everything
  renderAll();

  // Push to history
  pushHistory();
}

/* ──────────────────────────────────────────────────────────────
   RENDER: PALETTE
────────────────────────────────────────────────────────────── */

const ROLE_LABELS = {
  primary:    'Primary',
  secondary:  'Secondary',
  accent:     'Accent',
  background: 'Background',
  text:       'Text',
};

function renderPalette() {
  const grid    = document.getElementById('paletteGrid');
  const hexRow  = document.getElementById('paletteHexRow');
  const badge   = document.getElementById('harmonyBadge');

  badge.textContent = capitalize(state.harmony);

  // Build swatches
  grid.innerHTML = '';
  hexRow.innerHTML = '';

  COLOR_ROLES.forEach(role => {
    const color = state.palette[role];
    const isLocked = state.locks[role];

    // Swatch wrapper
    const wrap = document.createElement('div');
    wrap.className = 'swatch-wrap';

    // Swatch element
    const swatch = document.createElement('div');
    swatch.className = 'swatch' + (isLocked ? ' is-locked' : '');
    swatch.style.background = color.hex;
    swatch.setAttribute('title', `${ROLE_LABELS[role]}: ${color.hex}`);
    swatch.setAttribute('aria-label', `${ROLE_LABELS[role]} color: ${color.hex}${isLocked ? ' (locked)' : ''}`);

    // Lock button inside swatch
    const lockBtn = document.createElement('button');
    lockBtn.className = 'swatch-lock-btn' + (isLocked ? ' is-locked' : '');
    lockBtn.setAttribute('aria-label', (isLocked ? 'Unlock' : 'Lock') + ` ${ROLE_LABELS[role]} color`);
    lockBtn.setAttribute('aria-pressed', String(isLocked));
    lockBtn.dataset.role = role;
    lockBtn.innerHTML = `
      <svg class="lock-icon unlock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
      </svg>
      <svg class="lock-icon locked-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>`;
    lockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleColorLock(role);
    });

    swatch.appendChild(lockBtn);
    swatch.addEventListener('click', () => toggleColorLock(role));

    // Label
    const label = document.createElement('span');
    label.className = 'swatch-label';
    label.textContent = ROLE_LABELS[role];

    wrap.appendChild(swatch);
    wrap.appendChild(label);
    grid.appendChild(wrap);

    // Hex value
    const hexEl = document.createElement('span');
    hexEl.className = 'swatch-hex';
    hexEl.textContent = color.hex.toUpperCase();
    hexEl.title = 'Click to copy';
    hexEl.setAttribute('role', 'button');
    hexEl.setAttribute('tabindex', '0');
    hexEl.addEventListener('click', () => copyHex(hexEl, color.hex));
    hexEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') copyHex(hexEl, color.hex);
    });
    hexRow.appendChild(hexEl);
  });
}

/* ──────────────────────────────────────────────────────────────
   RENDER: FONTS
────────────────────────────────────────────────────────────── */

function renderFonts() {
  const pair = state.fonts.pair;
  if (!pair) return;

  document.getElementById('headingFontName').textContent = state.fonts.heading || '—';
  document.getElementById('bodyFontName').textContent    = state.fonts.body    || '—';
  document.getElementById('pairCategory').textContent   = pair.category || '—';

  const headingPreview = document.getElementById('headingPreview');
  const bodyPreview    = document.getElementById('bodyPreview');

  headingPreview.style.fontFamily = `'${state.fonts.heading}', serif`;
  bodyPreview.style.fontFamily    = `'${state.fonts.body}', sans-serif`;

  // Sync lock button states
  ['heading', 'body'].forEach(key => {
    const btn = document.querySelector(`.lock-btn[data-lock="${key}"]`);
    if (!btn) return;
    const isLocked = state.locks[key];
    btn.classList.toggle('is-locked', isLocked);
    btn.setAttribute('aria-pressed', String(isLocked));
    btn.setAttribute('aria-label', (isLocked ? 'Unlock' : 'Lock') + ` ${key} font`);
  });
}

/* ──────────────────────────────────────────────────────────────
   RENDER: ACCESSIBILITY
────────────────────────────────────────────────────────────── */

function renderAccessibility() {
  const bgHex   = state.palette.background.hex;
  const textHex = state.palette.text.hex;

  document.getElementById('contrastBgSwatch').style.background   = bgHex;
  document.getElementById('contrastTextSwatch').style.background = textHex;

  const ratio = contrastRatio(bgHex, textHex);
  const ratioDisplay = ratio.toFixed(2);

  document.getElementById('contrastRatio').textContent = ratioDisplay;

  // WCAG thresholds
  const aaPass    = ratio >= 4.5;
  const aaaPass   = ratio >= 7.0;
  const aaLarge   = ratio >= 3.0;

  setBadge('badgeAA',    aaPass,  'AA');
  setBadge('badgeAAA',   aaaPass, 'AAA');
  setBadge('badgeLarge', aaLarge, 'AA Large');
}

function setBadge(id, pass, label) {
  const el = document.getElementById(id);
  el.className = 'wcag-badge ' + (pass ? 'pass' : 'fail');
  el.textContent = pass ? `✓ ${label}` : `✗ ${label}`;
  el.setAttribute('aria-label', `${label}: ${pass ? 'Pass' : 'Fail'}`);
}

/* ──────────────────────────────────────────────────────────────
   RENDER: LIVE PREVIEW
────────────────────────────────────────────────────────────── */

function renderPreview() {
  const p = state.palette;
  const headingFont = state.fonts.heading || 'serif';
  const bodyFont    = state.fonts.body    || 'sans-serif';

  const card       = document.getElementById('previewCard');
  const cardBody   = card.querySelector('.preview-card-body');
  const tag        = document.getElementById('previewTag');
  const heading    = document.getElementById('previewHeading');
  const para       = document.getElementById('previewPara');
  const btnPrimary = document.getElementById('previewBtnPrimary');
  const btnGhost   = document.getElementById('previewBtnGhost');
  const footer     = document.getElementById('previewCardFooter');
  const dot        = document.getElementById('previewDot');

  // Card background
  card.style.background = p.background.hex;
  card.style.color      = p.text.hex;

  // Tag pill: accent background
  tag.style.background = hexWithAlpha(p.accent.hex, 0.15);
  tag.style.color      = p.accent.hex;

  // Heading font
  heading.style.fontFamily = `'${headingFont}', serif`;
  heading.style.color      = p.text.hex;

  // Body font
  para.style.fontFamily = `'${bodyFont}', sans-serif`;
  para.style.color      = hexWithAlpha(p.text.hex, 0.7);

  // Primary button: primary color
  btnPrimary.style.background  = p.primary.hex;
  btnPrimary.style.color       = getContrastColor(p.primary.hex);
  btnPrimary.style.border      = 'none';
  btnPrimary.style.fontFamily  = `'${bodyFont}', sans-serif`;

  // Ghost button
  btnGhost.style.background   = 'transparent';
  btnGhost.style.color        = p.primary.hex;
  btnGhost.style.border       = `1.5px solid ${p.primary.hex}`;
  btnGhost.style.fontFamily   = `'${bodyFont}', sans-serif`;

  // Footer
  footer.style.background = hexWithAlpha(p.text.hex, 0.04);
  footer.style.color      = hexWithAlpha(p.text.hex, 0.5);
  dot.style.background    = p.accent.hex;
}

/**
 * Given a hex color, return '#fff' or '#000' for best legibility.
 */
function getContrastColor(hex) {
  const rgb = hslToRgbFromHex(hex);
  const L = relativeLuminance(rgb);
  return L > 0.179 ? '#000000' : '#FFFFFF';
}

/**
 * Convert a hex color to rgba string with given alpha.
 * Crude but effective for preview use.
 */
function hexWithAlpha(hex, alpha) {
  const { r, g, b } = hslToRgbFromHex(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ──────────────────────────────────────────────────────────────
   RENDER: EXPORT
────────────────────────────────────────────────────────────── */

function renderExport() {
  if (!state.hasGenerated) return;
  const tab  = state.activeTab;
  const code = buildExportString(tab);
  document.getElementById('exportCodeInner').textContent = code;
  document.getElementById('copyBtn').disabled = false;
}

function buildExportString(format) {
  const p    = state.palette;
  const pair = state.fonts.pair;
  const fontsUrl = pair ? buildGoogleFontsUrl(pair) : '';

  switch (format) {
    case 'css': return buildCSSExport(p, fontsUrl);
    case 'tailwind': return buildTailwindExport(p, fontsUrl);
    case 'json': return buildJSONExport(p, fontsUrl);
    default: return '';
  }
}

function buildCSSExport(p, fontsUrl) {
  return [
    `/* Google Fonts */`,
    `@import url('${fontsUrl}');`,
    ``,
    `:root {`,
    `  /* Colors */`,
    `  --color-primary:    ${p.primary.hex};`,
    `  --color-secondary:  ${p.secondary.hex};`,
    `  --color-accent:     ${p.accent.hex};`,
    `  --color-background: ${p.background.hex};`,
    `  --color-text:       ${p.text.hex};`,
    ``,
    `  /* Typography */`,
    `  --font-heading: '${state.fonts.heading}', serif;`,
    `  --font-body:    '${state.fonts.body}', sans-serif;`,
    `}`,
  ].join('\n');
}

function buildTailwindExport(p, fontsUrl) {
  const heading = state.fonts.heading || '';
  const body    = state.fonts.body    || '';
  return [
    `// Google Fonts: ${fontsUrl}`,
    ``,
    `/** @type {import('tailwindcss').Config} */`,
    `module.exports = {`,
    `  theme: {`,
    `    extend: {`,
    `      colors: {`,
    `        primary:    '${p.primary.hex}',`,
    `        secondary:  '${p.secondary.hex}',`,
    `        accent:     '${p.accent.hex}',`,
    `        background: '${p.background.hex}',`,
    `        foreground: '${p.text.hex}',`,
    `      },`,
    `      fontFamily: {`,
    `        heading: ['${heading}', 'serif'],`,
    `        body:    ['${body}', 'sans-serif'],`,
    `      },`,
    `    },`,
    `  },`,
    `}`,
  ].join('\n');
}

function buildJSONExport(p, fontsUrl) {
  const obj = {
    harmony:  state.harmony,
    fonts: {
      heading: state.fonts.heading,
      body:    state.fonts.body,
      googleFontsUrl: fontsUrl,
    },
    colors: {
      primary:    p.primary.hex,
      secondary:  p.secondary.hex,
      accent:     p.accent.hex,
      background: p.background.hex,
      text:       p.text.hex,
    },
  };
  return JSON.stringify(obj, null, 2);
}

/* ──────────────────────────────────────────────────────────────
   RENDER: ALL
────────────────────────────────────────────────────────────── */

function renderAll() {
  renderPalette();
  renderFonts();
  renderAccessibility();
  renderPreview();
  renderExport();
}

/* ──────────────────────────────────────────────────────────────
   LOCK MANAGEMENT
────────────────────────────────────────────────────────────── */

function toggleColorLock(role) {
  state.locks[role] = !state.locks[role];
  renderPalette(); // Re-render swatches to reflect lock state
}

function toggleFontLock(key) {
  state.locks[key] = !state.locks[key];
  renderFonts();
}

/* ──────────────────────────────────────────────────────────────
   HISTORY
────────────────────────────────────────────────────────────── */

function pushHistory() {
  const snapshot = {
    palette:  JSON.parse(JSON.stringify(state.palette)),
    fonts:    JSON.parse(JSON.stringify(state.fonts)),
    harmony:  state.harmony,
    id:       Date.now(),
  };

  // Add to front
  state.history.unshift(snapshot);

  // Cap at 10
  if (state.history.length > 10) {
    state.history.pop();
  }

  renderHistory();
}

function restoreSnapshot(snapshot) {
  state.palette  = JSON.parse(JSON.stringify(snapshot.palette));
  state.fonts    = JSON.parse(JSON.stringify(snapshot.fonts));
  state.harmony  = snapshot.harmony;
  state.hasGenerated = true;

  // Reload fonts
  if (snapshot.fonts.pair) {
    loadFontPair(snapshot.fonts.pair);
  }

  renderAll();
  renderHistory(snapshot.id);
}

function renderHistory(activeId) {
  const grid  = document.getElementById('historyGrid');
  const count = document.getElementById('historyCount');
  const empty = document.getElementById('historyEmpty');

  count.textContent = `${state.history.length} / 10`;

  if (state.history.length === 0) {
    grid.innerHTML = '';
    if (empty) grid.appendChild(empty);
    return;
  }

  grid.innerHTML = '';

  state.history.forEach(snapshot => {
    const card = document.createElement('div');
    card.className = 'history-card' + (snapshot.id === activeId ? ' active' : '');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Restore ${snapshot.harmony} aesthetic with ${snapshot.fonts.heading} and ${snapshot.fonts.body}`);

    // Mini palette strip
    const palette = document.createElement('div');
    palette.className = 'history-palette';
    COLOR_ROLES.forEach(role => {
      const swatch = document.createElement('div');
      swatch.className = 'history-swatch';
      swatch.style.background = snapshot.palette[role].hex;
      palette.appendChild(swatch);
    });

    // Info
    const info = document.createElement('div');
    info.className = 'history-info';

    const fonts = document.createElement('div');
    fonts.className = 'history-fonts';
    fonts.textContent = `${snapshot.fonts.heading} / ${snapshot.fonts.body}`;

    const harmony = document.createElement('div');
    harmony.className = 'history-harmony';
    harmony.textContent = capitalize(snapshot.harmony);

    info.appendChild(fonts);
    info.appendChild(harmony);

    card.appendChild(palette);
    card.appendChild(info);

    card.addEventListener('click', () => restoreSnapshot(snapshot));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        restoreSnapshot(snapshot);
      }
    });

    grid.appendChild(card);
  });
}

/* ──────────────────────────────────────────────────────────────
   CLIPBOARD
────────────────────────────────────────────────────────────── */

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const success = document.execCommand('copy');
    document.body.removeChild(ta);
    return success;
  }
}

async function copyHex(el, hex) {
  const ok = await copyToClipboard(hex);
  if (ok) {
    el.classList.add('copied');
    const original = el.textContent;
    el.textContent = 'Copied!';
    setTimeout(() => {
      el.textContent = original;
      el.classList.remove('copied');
    }, 1500);
  }
}

async function copyExport() {
  const code = document.getElementById('exportCodeInner').textContent;
  const btn  = document.getElementById('copyBtn');
  if (!code || !state.hasGenerated) return;

  const ok = await copyToClipboard(code);
  if (ok) {
    btn.classList.add('copied');
    const span = btn.querySelector('.copy-text');
    const original = span.textContent;
    span.textContent = 'Copied!';
    setTimeout(() => {
      span.textContent = original;
      btn.classList.remove('copied');
    }, 2000);
  }
}

/* ──────────────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────────────── */

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ──────────────────────────────────────────────────────────────
   ANIMATION HELPER
────────────────────────────────────────────────────────────── */

function triggerGenerateAnimation() {
  const main = document.querySelector('.generator-grid');
  main.classList.add('generating');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      main.classList.remove('generating');
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   EVENT LISTENERS
────────────────────────────────────────────────────────────── */

function initEvents() {
  // Generate button
  document.getElementById('generateBtn').addEventListener('click', () => {
    triggerGenerateAnimation();
    generate();
  });

  // Font lock buttons
  document.querySelectorAll('.lock-btn[data-lock]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFontLock(btn.dataset.lock);
    });
  });

  // Export tab switcher
  document.querySelectorAll('.export-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.export-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      state.activeTab = tab.dataset.tab;
      renderExport();
    });
  });

  // Copy export button
  document.getElementById('copyBtn').addEventListener('click', copyExport);

  // Keyboard: spacebar on Generate
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      triggerGenerateAnimation();
      generate();
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────────── */

function init() {
  initEvents();
  // Auto-generate on first load for instant visual impact
  generate();
}

document.addEventListener('DOMContentLoaded', init);

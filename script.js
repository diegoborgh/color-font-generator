/* ============================================================
   AESTHETIC GENERATOR — script.js
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   CONSTANTS
────────────────────────────────────────────────────────────── */

const COLOR_ROLES   = ['primary', 'secondary', 'accent', 'background', 'text'];
const HARMONY_TYPES = ['complementary', 'analogous', 'triadic', 'split-complementary'];

const ROLE_LABELS = {
  primary: 'Primary', secondary: 'Secondary',
  accent:  'Accent',  background: 'Background', text: 'Text',
};

/**
 * Curated font pairs with typographic categories.
 * type: 'serif' | 'sans' | 'display'
 */
const FONT_PAIRS = [
  { heading: 'Playfair Display', hw: '400;700', body: 'Lato',          bw: '400;500', category: 'Serif + Humanist',    type: 'serif'   },
  { heading: 'Merriweather',     hw: '400;700', body: 'Source Sans 3', bw: '400;600', category: 'Serif + Geometric',   type: 'serif'   },
  { heading: 'Libre Baskerville',hw: '400;700', body: 'Open Sans',     bw: '400;600', category: 'Serif + Sans',        type: 'serif'   },
  { heading: 'Lora',             hw: '400;700', body: 'Nunito',        bw: '400;600', category: 'Serif + Rounded',     type: 'serif'   },
  { heading: 'DM Serif Display', hw: '400',     body: 'DM Sans',       bw: '400;500', category: 'Serif + Geometric',   type: 'serif'   },
  { heading: 'Fraunces',         hw: '400;700', body: 'Inter',         bw: '400;500', category: 'Optical + Neutral',   type: 'serif'   },
  { heading: 'Spectral',         hw: '400;700', body: 'Karla',         bw: '400;500', category: 'Serif + Grotesque',   type: 'serif'   },
  { heading: 'Montserrat',       hw: '600;700', body: 'Merriweather',  bw: '400',     category: 'Geometric + Serif',   type: 'sans'    },
  { heading: 'Space Grotesk',    hw: '500;700', body: 'Space Mono',    bw: '400',     category: 'Geometric + Mono',    type: 'sans'    },
  { heading: 'Josefin Sans',     hw: '300;600', body: 'Crimson Text',  bw: '400;600', category: 'Geometric + Serif',   type: 'sans'    },
  { heading: 'Syne',             hw: '600;800', body: 'Outfit',        bw: '400;500', category: 'Display + Geometric', type: 'sans'    },
  { heading: 'Plus Jakarta Sans',hw: '500;700', body: 'Lora',          bw: '400',     category: 'Humanist + Serif',    type: 'sans'    },
  { heading: 'Fjalla One',       hw: '400',     body: 'Cantarell',     bw: '400;700', category: 'Condensed + Humanist',type: 'sans'    },
  { heading: 'Cormorant Garamond',hw:'600;700', body: 'Raleway',       bw: '400;500', category: 'Display + Geometric',      type: 'display' },
  { heading: 'Abril Fatface',    hw: '400',     body: 'Lato',          bw: '400;500', category: 'Display + Humanist',       type: 'display' },
  // Serif (+14)
  { heading: 'EB Garamond',        hw: '400;700', body: 'Nunito Sans',    bw: '400;600', category: 'Classic + Humanist',       type: 'serif'   },
  { heading: 'Crimson Pro',        hw: '400;600', body: 'Work Sans',      bw: '400;500', category: 'Serif + Grotesque',         type: 'serif'   },
  { heading: 'Bodoni Moda',        hw: '400;700', body: 'Jost',           bw: '400;500', category: 'High Contrast + Geometric', type: 'serif'   },
  { heading: 'Alegreya',           hw: '400;700', body: 'Alegreya Sans',  bw: '400;500', category: 'Humanist Serif + Sans',     type: 'serif'   },
  { heading: 'Vollkorn',           hw: '400;700', body: 'Mulish',         bw: '400;500', category: 'Robust Serif + Geometric',  type: 'serif'   },
  { heading: 'Bitter',             hw: '400;700', body: 'Hind',           bw: '400;500', category: 'Slab Serif + Humanist',     type: 'serif'   },
  { heading: 'Arvo',               hw: '400;700', body: 'PT Sans',        bw: '400;700', category: 'Slab Serif + Humanist',     type: 'serif'   },
  { heading: 'Zilla Slab',         hw: '400;600', body: 'Asap',           bw: '400;500', category: 'Slab Serif + Grotesque',    type: 'serif'   },
  { heading: 'Domine',             hw: '400;700', body: 'Cabin',          bw: '400;600', category: 'Serif + Humanist',          type: 'serif'   },
  { heading: 'Cormorant',          hw: '400;700', body: 'Proza Libre',    bw: '400;500', category: 'Display Serif + Humanist',  type: 'serif'   },
  { heading: 'Cardo',              hw: '400;700', body: 'Fira Sans',      bw: '400;500', category: 'Classical + Sans',          type: 'serif'   },
  { heading: 'Neuton',             hw: '400;700', body: 'Oxygen',         bw: '400;700', category: 'Transitional + Humanist',   type: 'serif'   },
  { heading: 'Noto Serif',         hw: '400;700', body: 'Noto Sans',      bw: '400;500', category: 'Universal Serif + Sans',    type: 'serif'   },
  { heading: 'Rokkitt',            hw: '400;700', body: 'Rubik',          bw: '400;500', category: 'Slab Serif + Rounded',      type: 'serif'   },
  // Sans (+12)
  { heading: 'Raleway',            hw: '500;700', body: 'PT Serif',       bw: '400;700', category: 'Elegant + Serif',           type: 'sans'    },
  { heading: 'Work Sans',          hw: '500;700', body: 'Playfair Display',bw: '400;700', category: 'Grotesque + Serif',        type: 'sans'    },
  { heading: 'Nunito',             hw: '600;800', body: 'Lora',           bw: '400',     category: 'Rounded + Serif',           type: 'sans'    },
  { heading: 'Rubik',              hw: '500;700', body: 'Source Serif 4', bw: '400;600', category: 'Rounded + Serif',           type: 'sans'    },
  { heading: 'Barlow',             hw: '500;700', body: 'EB Garamond',    bw: '400;600', category: 'Condensed + Classic',       type: 'sans'    },
  { heading: 'Outfit',             hw: '500;700', body: 'Bitter',         bw: '400',     category: 'Geometric + Slab',          type: 'sans'    },
  { heading: 'Manrope',            hw: '500;700', body: 'Crimson Text',   bw: '400;600', category: 'Humanist + Serif',          type: 'sans'    },
  { heading: 'DM Sans',            hw: '500;700', body: 'Spectral',       bw: '400;600', category: 'Geometric + Serif',         type: 'sans'    },
  { heading: 'Mulish',             hw: '500;700', body: 'Merriweather',   bw: '400',     category: 'Geometric + Serif',         type: 'sans'    },
  { heading: 'Exo 2',              hw: '500;700', body: 'Noto Serif',     bw: '400',     category: 'Technical + Serif',         type: 'sans'    },
  { heading: 'Lexend',             hw: '500;700', body: 'Vollkorn',       bw: '400;600', category: 'Readable + Serif',          type: 'sans'    },
  { heading: 'Urbanist',           hw: '500;700', body: 'Lora',           bw: '400;600', category: 'Geometric + Serif',         type: 'sans'    },
  // Display (+4)
  { heading: 'Yeseva One',         hw: '400',     body: 'Josefin Sans',   bw: '400;600', category: 'Display + Geometric',       type: 'display' },
  { heading: 'Playfair Display SC',hw: '400;700', body: 'Source Sans 3',  bw: '400;500', category: 'Small Caps + Geometric',    type: 'display' },
  { heading: 'Righteous',          hw: '400',     body: 'Hind',           bw: '400;500', category: 'Display + Humanist',         type: 'display' },
  { heading: 'Philosopher',        hw: '400;700', body: 'Nunito',         bw: '400;600', category: 'Display Serif + Rounded',    type: 'display' },
];

/* ──────────────────────────────────────────────────────────────
   STATE
────────────────────────────────────────────────────────────── */

const state = {
  palette: {
    primary:    { h: 0, s: 0, l: 0, hex: '#000000' },
    secondary:  { h: 0, s: 0, l: 0, hex: '#000000' },
    accent:     { h: 0, s: 0, l: 0, hex: '#000000' },
    background: { h: 0, s: 0, l: 0, hex: '#000000' },
    text:       { h: 0, s: 0, l: 0, hex: '#000000' },
  },
  locks:   { primary: false, secondary: false, accent: false, background: false, text: false, heading: false, body: false },
  fonts:   { heading: null, body: null, pair: null },
  harmony:      '',
  harmonyMode:  'random',
  fontMode:     'random',
  activeTab:    'css',
  history:      [],
  hasGenerated: false,
  previewDark:  false,
  // Color picker
  picker: { isOpen: false, role: null },
};

/* ──────────────────────────────────────────────────────────────
   COLOR UTILITIES
────────────────────────────────────────────────────────────── */

function wrapHue(h) { return ((h % 360) + 360) % 360; }
function rnd(min, max) { return min + Math.random() * (max - min); }
function rndInt(min, max) { return Math.floor(rnd(min, max + 1)); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function hslToRgb(h, s, l) {
  h = h / 360; s = s / 100; l = l / 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2 = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2(p, q, h + 1/3);
    g = hue2(p, q, h);
    b = hue2(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex) {
  const c = hex.replace('#', '');
  const full = c.length === 3 ? c.split('').map(x => x + x).join('') : c;
  return { r: parseInt(full.slice(0,2), 16), g: parseInt(full.slice(2,4), 16), b: parseInt(full.slice(4,6), 16) };
}

function hexToHsl(hex) { const rgb = hexToRgb(hex); return rgbToHsl(rgb.r, rgb.g, rgb.b); }
function hslToHex(h, s, l) { return rgbToHex(hslToRgb(h, s, l)); }

function makeColor(h, s, l) {
  h = wrapHue(h);
  s = clamp(s, 0, 100);
  l = clamp(l, 0, 100);
  return { h, s, l, hex: hslToHex(h, s, l) };
}

function hexWithAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ──────────────────────────────────────────────────────────────
   WCAG CONTRAST
────────────────────────────────────────────────────────────── */

function relativeLuminance({ r, g, b }) {
  const lin = v => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(hex1, hex2) {
  const L1 = relativeLuminance(hexToRgb(hex1));
  const L2 = relativeLuminance(hexToRgb(hex2));
  const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

function getContrastColor(hex) {
  return relativeLuminance(hexToRgb(hex)) > 0.179 ? '#000000' : '#FFFFFF';
}

/* ──────────────────────────────────────────────────────────────
   PALETTE GENERATION — Harmony Algorithms
────────────────────────────────────────────────────────────── */

function generatePalette(harmonyType, baseHue) {
  const H = baseHue ?? rnd(0, 360);
  switch (harmonyType) {
    case 'complementary': {
      const C = wrapHue(H + 180);
      return {
        background: makeColor(H, rnd(6,14),  rnd(93,97)),
        text:       makeColor(H, rnd(15,30), rnd(9,17)),
        primary:    makeColor(H, rnd(60,78), rnd(38,52)),
        secondary:  makeColor(C, rnd(45,65), rnd(44,58)),
        accent:     makeColor(C, rnd(65,82), rnd(52,66)),
      };
    }
    case 'analogous': {
      const H2 = wrapHue(H + 30), H3 = wrapHue(H + 60);
      return {
        background: makeColor(H,  rnd(6,12),  rnd(93,97)),
        text:       makeColor(H,  rnd(18,32), rnd(9,16)),
        primary:    makeColor(H,  rnd(62,78), rnd(38,52)),
        secondary:  makeColor(H2, rnd(52,68), rnd(44,57)),
        accent:     makeColor(H3, rnd(55,72), rnd(48,62)),
      };
    }
    case 'triadic': {
      const T1 = wrapHue(H + 120), T2 = wrapHue(H + 240);
      return {
        background: makeColor(H,  rnd(6,12),  rnd(93,97)),
        text:       makeColor(T1, rnd(18,34), rnd(9,18)),
        primary:    makeColor(H,  rnd(60,76), rnd(40,52)),
        secondary:  makeColor(T1, rnd(48,65), rnd(44,57)),
        accent:     makeColor(T2, rnd(55,72), rnd(46,60)),
      };
    }
    default: { // split-complementary
      const S1 = wrapHue(H + 150), S2 = wrapHue(H + 210);
      return {
        background: makeColor(H,  rnd(6,14),  rnd(93,97)),
        text:       makeColor(H,  rnd(15,30), rnd(9,17)),
        primary:    makeColor(H,  rnd(60,78), rnd(38,52)),
        secondary:  makeColor(S1, rnd(48,65), rnd(44,57)),
        accent:     makeColor(S2, rnd(55,72), rnd(48,62)),
      };
    }
  }
}

/* ──────────────────────────────────────────────────────────────
   FONT LOADING
────────────────────────────────────────────────────────────── */

function buildGoogleFontsUrl(pair) {
  const h = pair.heading.replace(/ /g, '+');
  const b = pair.body.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${h}:ital,wght@0,${pair.hw};1,${pair.hw}&family=${b}:wght@${pair.bw}&display=swap`;
}

function loadFontPair(pair) {
  let link = document.getElementById('dynamic-fonts');
  if (!link) {
    link = document.createElement('link');
    link.id = 'dynamic-fonts';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = buildGoogleFontsUrl(pair);
}

/* ──────────────────────────────────────────────────────────────
   GENERATION ENGINE
────────────────────────────────────────────────────────────── */

function generate() {
  // Pick harmony type
  const harmonyType = state.harmonyMode === 'random'
    ? HARMONY_TYPES[rndInt(0, HARMONY_TYPES.length - 1)]
    : state.harmonyMode;

  state.harmony = harmonyType;

  // Generate new palette, apply locks
  const newPalette = generatePalette(harmonyType);
  COLOR_ROLES.forEach(role => {
    if (!state.locks[role]) state.palette[role] = newPalette[role];
  });

  // Pick font pair filtered by fontMode
  if (!state.locks.heading || !state.locks.body) {
    const pool = FONT_PAIRS.filter(p => {
      const modeOk = state.fontMode === 'random' || p.type === state.fontMode;
      const notSame = !state.fonts.pair ||
        p.heading !== state.fonts.pair.heading || p.body !== state.fonts.pair.body;
      return modeOk && notSame;
    });
    const candidates = pool.length > 0 ? pool : FONT_PAIRS;
    const newPair = candidates[rndInt(0, candidates.length - 1)];
    if (!state.locks.heading) state.fonts.heading = newPair.heading;
    if (!state.locks.body)    state.fonts.body    = newPair.body;
    const matched = FONT_PAIRS.find(p =>
      p.heading === state.fonts.heading && p.body === state.fonts.body
    ) || newPair;
    state.fonts.pair = matched;
    loadFontPair(matched);
  }

  state.hasGenerated = true;
  renderAll();
  pushHistory();
}

/* ──────────────────────────────────────────────────────────────
   RENDER: PALETTE
────────────────────────────────────────────────────────────── */

function renderPalette() {
  const grid   = document.getElementById('paletteGrid');
  const hexRow = document.getElementById('paletteHexRow');
  document.getElementById('harmonyBadge').textContent = capitalize(state.harmony);

  grid.innerHTML   = '';
  hexRow.innerHTML = '';

  COLOR_ROLES.forEach(role => {
    const color    = state.palette[role];
    const isLocked = state.locks[role];

    // Swatch wrapper
    const wrap = document.createElement('div');
    wrap.className = 'swatch-wrap';

    // Swatch element
    const swatch = document.createElement('div');
    swatch.className = 'swatch' + (isLocked ? ' is-locked' : '');
    swatch.style.background = color.hex;
    swatch.title = `Edit ${ROLE_LABELS[role]}`;
    swatch.setAttribute('aria-label', `${ROLE_LABELS[role]} color: ${color.hex}. Click to edit.`);

    // Edit hint overlay
    const hint = document.createElement('span');
    hint.className = 'swatch-edit-hint';
    hint.textContent = 'Edit';
    hint.setAttribute('aria-hidden', 'true');
    swatch.appendChild(hint);

    // Lock button
    const lockBtn = document.createElement('button');
    lockBtn.className = 'swatch-lock-btn' + (isLocked ? ' is-locked' : '');
    lockBtn.setAttribute('aria-label', (isLocked ? 'Unlock' : 'Lock') + ` ${ROLE_LABELS[role]} color`);
    lockBtn.setAttribute('aria-pressed', String(isLocked));
    lockBtn.dataset.role = role;
    lockBtn.innerHTML = `
      <svg class="lock-icon unlock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
      <svg class="lock-icon locked-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
    lockBtn.addEventListener('click', e => { e.stopPropagation(); toggleColorLock(role); });
    swatch.appendChild(lockBtn);

    // Click swatch → open color picker
    swatch.addEventListener('click', () => {
      if (state.hasGenerated) openColorPicker(role, swatch);
    });

    // Label
    const label = document.createElement('span');
    label.className = 'swatch-label';
    label.textContent = ROLE_LABELS[role];

    wrap.appendChild(swatch);
    wrap.appendChild(label);
    grid.appendChild(wrap);

    // Hex value (click to copy)
    const hexEl = document.createElement('span');
    hexEl.className  = 'swatch-hex';
    hexEl.textContent = color.hex.toUpperCase();
    hexEl.title = 'Click to copy';
    hexEl.setAttribute('role', 'button');
    hexEl.setAttribute('tabindex', '0');
    hexEl.addEventListener('click', () => copyHex(hexEl, color.hex));
    hexEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') copyHex(hexEl, color.hex); });
    hexRow.appendChild(hexEl);
  });

  updateBrandIcon();
  updateFavicon();
}

/* ──────────────────────────────────────────────────────────────
   RENDER: FONTS
────────────────────────────────────────────────────────────── */

function renderFonts() {
  if (!state.fonts.pair) return;
  document.getElementById('headingFontName').textContent = state.fonts.heading || '—';
  document.getElementById('bodyFontName').textContent    = state.fonts.body    || '—';
  document.getElementById('pairCategory').textContent   = state.fonts.pair.category || '—';

  document.getElementById('headingPreview').style.fontFamily = `'${state.fonts.heading}', serif`;
  document.getElementById('bodyPreview').style.fontFamily    = `'${state.fonts.body}', sans-serif`;

  ['heading', 'body'].forEach(key => {
    const btn = document.querySelector(`.lock-btn[data-lock="${key}"]`);
    if (!btn) return;
    btn.classList.toggle('is-locked', state.locks[key]);
    btn.setAttribute('aria-pressed', String(state.locks[key]));
    btn.setAttribute('aria-label', (state.locks[key] ? 'Unlock' : 'Lock') + ` ${key} font`);
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
  document.getElementById('contrastRatio').textContent = ratio.toFixed(2);
  setBadge('badgeAA',    ratio >= 4.5, 'AA');
  setBadge('badgeAAA',   ratio >= 7.0, 'AAA');
  setBadge('badgeLarge', ratio >= 3.0, 'AA Large');
}

function setBadge(id, pass, label) {
  const el = document.getElementById(id);
  el.className = 'wcag-badge ' + (pass ? 'pass' : 'fail');
  el.textContent = pass ? `✓ ${label}` : `✗ ${label}`;
}

/* ──────────────────────────────────────────────────────────────
   RENDER: LIVE PREVIEW
────────────────────────────────────────────────────────────── */

function renderPreview() {
  const p           = state.palette;
  const headingFont = state.fonts.heading || 'serif';
  const bodyFont    = state.fonts.body    || 'sans-serif';
  const dark        = state.previewDark;

  // Derive dark-mode card colors from palette hues
  const bgHsl       = hexToHsl(p.background.hex);
  const darkCardBg  = hslToHex(bgHsl.h, Math.round(bgHsl.s * 0.5), 11);
  const lightText   = hslToHex(bgHsl.h, 15, 88);

  // Stage dark-mode attribute
  document.getElementById('previewStage').toggleAttribute('data-preview-dark', dark);

  // Card background
  const card = document.getElementById('previewCard');
  card.style.background = dark ? darkCardBg : p.background.hex;

  // Band: secondary color
  const band = document.getElementById('previewBand');
  band.style.background = p.secondary.hex;
  band.style.color      = getContrastColor(p.secondary.hex);

  // Heading
  const heading = document.getElementById('previewHeading');
  heading.style.fontFamily = `'${headingFont}', serif`;
  heading.style.color      = dark ? lightText : p.text.hex;

  // Paragraph
  const para = document.getElementById('previewPara');
  para.style.fontFamily = `'${bodyFont}', sans-serif`;
  para.style.color      = dark ? hexWithAlpha(lightText, 0.65) : hexWithAlpha(p.text.hex, 0.7);

  // Primary button
  const btnPrimary = document.getElementById('previewBtnPrimary');
  btnPrimary.style.background  = p.primary.hex;
  btnPrimary.style.color       = getContrastColor(p.primary.hex);
  btnPrimary.style.border      = 'none';
  btnPrimary.style.fontFamily  = `'${bodyFont}', sans-serif`;

  // Ghost button: uses secondary color for outline/text
  const btnGhost = document.getElementById('previewBtnGhost');
  btnGhost.style.background  = 'transparent';
  btnGhost.style.color       = p.secondary.hex;
  btnGhost.style.border      = `1.5px solid ${p.secondary.hex}`;
  btnGhost.style.fontFamily  = `'${bodyFont}', sans-serif`;

  // Footer: accent tint
  const footer = document.getElementById('previewCardFooter');
  footer.style.background  = dark ? hexWithAlpha(p.accent.hex, 0.12) : hexWithAlpha(p.accent.hex, 0.08);
  footer.style.color       = dark ? hexWithAlpha(lightText, 0.45) : hexWithAlpha(p.text.hex, 0.5);
  footer.style.borderTop   = dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)';

  const dot = document.getElementById('previewDot');
  dot.style.background = p.accent.hex;
}

function togglePreviewDark() {
  state.previewDark = !state.previewDark;
  const btn = document.getElementById('previewDarkToggle');
  btn.setAttribute('aria-pressed', String(state.previewDark));
  if (state.hasGenerated) renderPreview();
}

/* ──────────────────────────────────────────────────────────────
   FULL PAGE PREVIEW
────────────────────────────────────────────────────────────── */

let previewWindow = null;

function buildFullPageHTML() {
  const p           = state.palette;
  const headingFont = state.fonts.heading || 'Georgia';
  const bodyFont    = state.fonts.body    || 'system-ui';
  const pair        = state.fonts.pair;
  const googleFontsUrl = pair ? buildGoogleFontsUrl(pair) : '';

  // Derive dark-mode equivalents from background hue
  const bgHsl    = hexToHsl(p.background.hex);
  const darkBg   = hslToHex(bgHsl.h, Math.round(bgHsl.s * 0.4), 11);
  const darkText = hslToHex(bgHsl.h, 15, 88);

  // Contrast-safe text on each chromatic color
  const onPrimary   = getContrastColor(p.primary.hex);
  const onSecondary = getContrastColor(p.secondary.hex);
  const onAccent    = getContrastColor(p.accent.hex);

  const fontsLinkTag = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link id="dynamic-fonts" rel="stylesheet" href="${googleFontsUrl.replace('display=swap', 'display=block')}">`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forma — Ship beautiful products, faster.</title>
  ${fontsLinkTag}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        ${p.background.hex};
      --text:      ${p.text.hex};
      --primary:   ${p.primary.hex};
      --secondary: ${p.secondary.hex};
      --accent:    ${p.accent.hex};
      --on-primary:   ${onPrimary};
      --on-secondary: ${onSecondary};
      --on-accent:    ${onAccent};
      --heading-font: '${headingFont}', Georgia, serif;
      --body-font:    '${bodyFont}', system-ui, sans-serif;
      --dark-bg:   ${darkBg};
      --dark-text: ${darkText};
      --border-subtle:      ${hexWithAlpha(p.text.hex, 0.08)};
      --border-faint:       ${hexWithAlpha(p.text.hex, 0.2)};
      --border-hover:       ${hexWithAlpha(p.text.hex, 0.5)};
      --shadow-soft:        ${hexWithAlpha(p.text.hex, 0.07)};
      --shadow-medium:      ${hexWithAlpha(p.text.hex, 0.12)};
      --accent-tint-light:  ${hexWithAlpha(p.accent.hex, 0.15)};
      --accent-tint-border: ${hexWithAlpha(p.accent.hex, 0.3)};
      --secondary-subtle:   ${hexWithAlpha(p.secondary.hex, 0.05)};
      --secondary-mid:      ${hexWithAlpha(p.secondary.hex, 0.09)};
      --secondary-dark-bg:  ${hexWithAlpha(p.secondary.hex, 0.1)};
      --secondary-card:     ${hexWithAlpha(p.secondary.hex, 0.12)};
      --secondary-quote:    ${hexWithAlpha(p.secondary.hex, 0.16)};
      --footer-dark-bg:     ${darkText};
      --footer-dark-text:   ${darkBg};
      --nav-bg:             ${p.text.hex};
      --nav-bg-dark:        ${darkText};
      --nav-text:           ${getContrastColor(p.text.hex)};
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--body-font);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    body.dark {
      background: var(--dark-bg);
      color: var(--dark-text);
    }
    body.dark nav { background: var(--dark-bg); color: var(--dark-text); }

    /* NAV */
    nav {
      display: flex;
      align-items: center;
      padding: 1.25rem 5%;
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      background: var(--nav-bg);
      color: var(--nav-text);
      backdrop-filter: blur(8px);
      z-index: 100;
      gap: 1rem;
    }
    .nav-logo {
      font-family: var(--heading-font);
      font-size: 1.9rem;
      font-weight: 700;
      color: var(--secondary);
      letter-spacing: -0.03em;
      flex-shrink: 0;
    }
    .nav-spacer { flex: 1; }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }
    .nav-links a {
      color: inherit;
      text-decoration: none;
      font-size: 0.9rem;
      opacity: 0.75;
      transition: opacity 0.2s;
    }
    .nav-links a:hover { opacity: 1; }
    .hamburger {
      display: none;
      background: none;
      border: 1px solid var(--border-faint);
      border-radius: 6px;
      padding: 0.4rem;
      cursor: pointer;
      color: inherit;
      align-items: center;
      justify-content: center;
    }

    /* DARK TOGGLE — circular, matching main site */
    .dark-toggle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-faint);
      cursor: pointer;
      color: inherit;
      transition: border-color 0.2s;
      flex-shrink: 0;
    }
    .dark-toggle:hover { border-color: var(--border-hover); }
    .icon-sun  { display: none; }
    .icon-moon { display: block; }
    body.dark .icon-sun  { display: block; }
    body.dark .icon-moon { display: none; }

    /* BUTTONS */
    .btn {
      display: inline-block;
      padding: 0.55rem 1.25rem;
      border-radius: 6px;
      font-family: var(--body-font);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      text-decoration: none;
      transition: opacity 0.2s, transform 0.1s;
    }
    .btn:hover { opacity: 0.88; }
    .btn:active { transform: scale(0.97); }
    .btn-primary {
      background: var(--primary);
      color: var(--on-primary);
    }
    .btn-ghost {
      background: transparent;
      color: var(--secondary);
      border: 1.5px solid var(--secondary);
    }
    .btn-accent {
      background: var(--accent);
      color: var(--on-accent);
    }

    /* HERO */
    .hero {
      padding: 6rem 5% 5rem;
      text-align: center;
      max-width: 860px;
      margin: 0 auto;
    }
    .hero-badge {
      display: inline-block;
      background: var(--accent-tint-light);
      color: var(--accent);
      border: 1px solid var(--accent-tint-border);
      border-radius: 99px;
      padding: 0.25rem 0.85rem;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }
    .hero h1 {
      font-family: var(--heading-font);
      font-size: clamp(2.4rem, 6vw, 4rem);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 1.25rem;
      color: inherit;
    }
    .hero p {
      font-size: 1.15rem;
      opacity: 0.7;
      max-width: 560px;
      margin: 0 auto 2.25rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      width: fit-content;
      margin: 0 auto;
    }
    .hero-actions .btn { padding: 0.75rem 1.75rem; font-size: 1rem; }

    /* FEATURES */
    .features {
      padding: 5rem 5%;
      background: var(--secondary-subtle);
    }
    body.dark .features { background: var(--secondary-dark-bg); }
    .features-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    .features-header h2 {
      font-family: var(--heading-font);
      font-size: clamp(1.6rem, 3.5vw, 2.4rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.6rem;
    }
    .features-header p { opacity: 0.65; max-width: 480px; margin: 0 auto; }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    .feature-card {
      background: var(--bg);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px var(--shadow-soft);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    body.dark .feature-card { background: var(--secondary-card); }
    .feature-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px var(--shadow-medium);
    }
    .feature-card-bar {
      height: 4px;
      background: var(--secondary);
    }
    .feature-card-body { padding: 1.75rem; }
    .feature-icon {
      width: 42px; height: 42px;
      background: var(--accent-tint-light);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1rem;
      color: var(--accent);
    }
    .feature-card h3 {
      font-family: var(--heading-font);
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .feature-card p { font-size: 0.9rem; opacity: 0.65; line-height: 1.6; }

    /* TESTIMONIAL */
    .testimonial {
      padding: 5rem 5%;
      text-align: center;
    }
    .testimonial-inner {
      max-width: 680px;
      margin: 0 auto;
      background: var(--secondary-mid);
      border-left: 4px solid var(--secondary);
      border-radius: 0 12px 12px 0;
      padding: 3rem;
      text-align: left;
    }
    body.dark .testimonial-inner { background: var(--secondary-quote); }
    .testimonial blockquote {
      font-family: var(--heading-font);
      font-size: clamp(1.2rem, 2.5vw, 1.6rem);
      font-style: italic;
      font-weight: 400;
      line-height: 1.45;
      margin-bottom: 1.5rem;
      color: inherit;
    }
    .testimonial cite {
      font-style: normal;
      font-size: 0.9rem;
      opacity: 0.6;
      font-weight: 600;
    }
    .testimonial-dot {
      display: inline-block;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--accent);
      margin-right: 0.5rem;
      vertical-align: middle;
    }

    /* CTA BANNER */
    .cta-banner {
      padding: 5rem 5%;
      background: var(--accent);
      color: var(--on-accent);
      text-align: center;
    }
    .cta-banner h2 {
      font-family: var(--heading-font);
      font-size: clamp(1.6rem, 3.5vw, 2.4rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
    }
    .cta-banner p { opacity: 0.8; margin-bottom: 2rem; font-size: 1.05rem; }
    .cta-banner .btn-primary { font-size: 1rem; padding: 0.85rem 2rem; }

    /* FOOTER */
    footer {
      background: var(--text);
      color: var(--bg);
      padding: 3rem 5%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    body.dark footer { background: var(--footer-dark-bg); color: var(--footer-dark-text); }
    .footer-logo {
      font-family: var(--heading-font);
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      opacity: 0.9;
    }
    .footer-links {
      display: flex;
      gap: 1.5rem;
      list-style: none;
      font-size: 0.85rem;
    }
    .footer-links a { color: inherit; text-decoration: none; opacity: 0.55; }
    .footer-links a:hover { opacity: 0.9; }
    .footer-copy { font-size: 0.8rem; opacity: 0.4; }

    /* MOBILE NAV */
    @media (max-width: 768px) {
      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0; right: 0;
        flex-direction: column;
        gap: 0;
        background: var(--bg);
        border-bottom: 1px solid var(--border-subtle);
        padding: 0.5rem 0;
        z-index: 99;
      }
      body.dark .nav-links { background: var(--dark-bg); }
      nav.nav-open .nav-links { display: flex; }
      .nav-links li a {
        display: block;
        padding: 0.75rem 5%;
        font-size: 1rem;
      }
      .hamburger { display: flex; }
      .nav-right .btn { display: none; }
    }
  </style>
</head>
<body>

  <nav id="mainNav">
    <span class="nav-logo">Forma</span>
    <div class="nav-spacer"></div>
    <div class="nav-right">
      <ul class="nav-links">
        <li><a href="#">Product</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Docs</a></li>
        <li><a href="#">Blog</a></li>
      </ul>
      <button class="dark-toggle" id="darkToggle" aria-label="Toggle dark mode">
        <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
      <a href="#" class="btn btn-primary">Get Started Free</a>
      <button class="hamburger" id="hamburger" aria-label="Open menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-badge">Now in Beta</div>
    <h1><span style="display:block">Ship beautiful products,</span><span style="display:block">faster.</span></h1>
    <p>Forma gives your team a unified design language — from tokens to components — so you build with confidence every time.</p>
    <div class="hero-actions">
      <a href="#" class="btn btn-primary">Start for Free</a>
      <a href="#" class="btn btn-ghost">See How It Works</a>
    </div>
  </section>

  <section class="features">
    <div class="features-header">
      <h2>Everything your team needs</h2>
      <p>A complete design system toolkit that scales from startup to enterprise.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-card-bar"></div>
        <div class="feature-card-body">
          <div class="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><path d="M10.4 21.4A8 8 0 0 1 3.6 10.4"/><path d="M13.6 2.6A8 8 0 0 1 20.4 13.6"/>
            </svg>
          </div>
          <h3>Design Tokens</h3>
          <p>Define your colors, spacing, and typography once. Sync them automatically across every platform and framework.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-card-bar"></div>
        <div class="feature-card-body">
          <div class="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
            </svg>
          </div>
          <h3>Component Library</h3>
          <p>A battle-tested set of accessible, composable components that work out of the box — no configuration needed.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-card-bar"></div>
        <div class="feature-card-body">
          <div class="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/>
            </svg>
          </div>
          <h3>Live Collaboration</h3>
          <p>Design and engineering share one source of truth. Changes propagate instantly so your team is always in sync.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="testimonial">
    <div class="testimonial-inner">
      <blockquote>"Forma cut our design-to-production cycle in half. Our engineers and designers finally speak the same language."</blockquote>
      <cite><span class="testimonial-dot"></span>Maya Okonkwo — Head of Product, Arclight</cite>
    </div>
  </section>

  <section class="cta-banner">
    <h2>Ready to build something beautiful?</h2>
    <p>Join thousands of teams who ship with confidence using Forma.</p>
    <a href="#" class="btn btn-primary">Get Started Free</a>
  </section>

  <footer>
    <span class="footer-logo">Forma</span>
    <ul class="footer-links">
      <li><a href="#">Privacy</a></li>
      <li><a href="#">Terms</a></li>
      <li><a href="#">Status</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
    <span class="footer-copy">© 2025 Forma, Inc.</span>
  </footer>

  <script>
    document.getElementById('darkToggle').addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('mainNav').classList.toggle('nav-open');
    });
    window.addEventListener('message', (e) => {
      if (!e.data || e.data.type !== 'FORMA_UPDATE') return;
      const root = document.documentElement;
      Object.entries(e.data.vars).forEach(([k, v]) => root.style.setProperty(k, v));
      if (e.data.googleFontsUrl) {
        const link = document.getElementById('dynamic-fonts');
        if (link) link.href = e.data.googleFontsUrl;
      }
    });
  </script>

</body>
</html>`;
}

function openFullPagePreview() {
  if (!state.hasGenerated) return;
  if (previewWindow && !previewWindow.closed) {
    previewWindow.focus();
    pushPreviewUpdate();
    return;
  }
  const html = buildFullPageHTML();
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  previewWindow = window.open(
    url,
    'forma-preview',
    'width=1280,height=900,menubar=no,toolbar=no,location=no,scrollbars=yes,resizable=yes'
  );
  if (previewWindow) setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function pushPreviewUpdate() {
  if (!previewWindow || previewWindow.closed) return;
  const p           = state.palette;
  const headingFont = state.fonts.heading || 'Georgia';
  const bodyFont    = state.fonts.body    || 'system-ui';
  const pair        = state.fonts.pair;
  const bgHsl    = hexToHsl(p.background.hex);
  const darkBg   = hslToHex(bgHsl.h, Math.round(bgHsl.s * 0.4), 11);
  const darkText = hslToHex(bgHsl.h, 15, 88);
  previewWindow.postMessage({
    type: 'FORMA_UPDATE',
    vars: {
      '--bg':              p.background.hex,
      '--text':            p.text.hex,
      '--primary':         p.primary.hex,
      '--secondary':       p.secondary.hex,
      '--accent':          p.accent.hex,
      '--on-primary':      getContrastColor(p.primary.hex),
      '--on-secondary':    getContrastColor(p.secondary.hex),
      '--on-accent':       getContrastColor(p.accent.hex),
      '--dark-bg':         darkBg,
      '--dark-text':       darkText,
      '--heading-font':    `'${headingFont}', Georgia, serif`,
      '--body-font':       `'${bodyFont}', system-ui, sans-serif`,
      '--border-subtle':   hexWithAlpha(p.text.hex, 0.08),
      '--border-faint':    hexWithAlpha(p.text.hex, 0.2),
      '--border-hover':    hexWithAlpha(p.text.hex, 0.5),
      '--shadow-soft':     hexWithAlpha(p.text.hex, 0.07),
      '--shadow-medium':   hexWithAlpha(p.text.hex, 0.12),
      '--accent-tint-light':  hexWithAlpha(p.accent.hex, 0.15),
      '--accent-tint-border': hexWithAlpha(p.accent.hex, 0.3),
      '--secondary-subtle':   hexWithAlpha(p.secondary.hex, 0.05),
      '--secondary-mid':      hexWithAlpha(p.secondary.hex, 0.09),
      '--secondary-dark-bg':  hexWithAlpha(p.secondary.hex, 0.1),
      '--secondary-card':     hexWithAlpha(p.secondary.hex, 0.12),
      '--secondary-quote':    hexWithAlpha(p.secondary.hex, 0.16),
      '--footer-dark-bg':     darkText,
      '--footer-dark-text':   darkBg,
      '--nav-bg':             p.text.hex,
      '--nav-bg-dark':        darkText,
      '--nav-text':           getContrastColor(p.text.hex),
    },
    googleFontsUrl: pair ? buildGoogleFontsUrl(pair) : '',
  }, '*');
}

/* ──────────────────────────────────────────────────────────────
   RENDER: EXPORT
────────────────────────────────────────────────────────────── */

function renderExport() {
  if (!state.hasGenerated) return;
  document.getElementById('exportCodeInner').textContent = buildExportString(state.activeTab);
  document.getElementById('copyBtn').disabled = false;
}

function buildExportString(format) {
  const p       = state.palette;
  const pair    = state.fonts.pair;
  const fontsUrl = pair ? buildGoogleFontsUrl(pair) : '';
  switch (format) {
    case 'css':      return buildCSS(p, fontsUrl);
    case 'tailwind': return buildTailwind(p, fontsUrl);
    case 'json':     return buildJSON(p, fontsUrl);
    default: return '';
  }
}

function buildCSS(p, fontsUrl) {
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

function buildTailwind(p, fontsUrl) {
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
    `        heading: ['${state.fonts.heading}', 'serif'],`,
    `        body:    ['${state.fonts.body}', 'sans-serif'],`,
    `      },`,
    `    },`,
    `  },`,
    `}`,
  ].join('\n');
}

function buildJSON(p, fontsUrl) {
  return JSON.stringify({
    harmony: state.harmony,
    fonts: { heading: state.fonts.heading, body: state.fonts.body, googleFontsUrl: fontsUrl },
    colors: { primary: p.primary.hex, secondary: p.secondary.hex, accent: p.accent.hex, background: p.background.hex, text: p.text.hex },
  }, null, 2);
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
  pushPreviewUpdate();
}

/* ──────────────────────────────────────────────────────────────
   BRAND ICON + FAVICON (dynamic palette colors)
────────────────────────────────────────────────────────────── */

function updateBrandIcon() {
  // Brand colors are fixed — no dynamic updates needed
}

function updateFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="11" cy="16" r="11" fill="#D4566A"/>
    <circle cx="21" cy="16" r="11" fill="#2D3748"/>
    <text x="9.5" y="20" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" font-family="sans-serif">K</text>
    <text x="22.5" y="20" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" font-family="sans-serif">H</text>
  </svg>`;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.type = 'image/svg+xml';
  link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/* ──────────────────────────────────────────────────────────────
   LOCK MANAGEMENT
────────────────────────────────────────────────────────────── */

function toggleColorLock(role) {
  state.locks[role] = !state.locks[role];
  renderPalette();
}

function toggleFontLock(key) {
  state.locks[key] = !state.locks[key];
  renderFonts();
}

/* ──────────────────────────────────────────────────────────────
   COLOR PICKER
────────────────────────────────────────────────────────────── */

function openColorPicker(role, swatchEl) {
  state.picker.role = role;
  const popover  = document.getElementById('colorPickerPopover');
  const backdrop = document.getElementById('pickerBackdrop');

  // Sync content
  syncPickerToState(role);

  // Position near swatch, keeping in viewport
  const rect   = swatchEl.getBoundingClientRect();
  const popW   = 240;
  const margin = 10;
  let left = rect.left;
  let top  = rect.bottom + margin;

  if (left + popW > window.innerWidth - margin) left = window.innerWidth - popW - margin;
  if (left < margin) left = margin;
  // If not enough room below, show above
  if (top + 300 > window.innerHeight) top = rect.top - 300 - margin;
  if (top < margin) top = margin;

  popover.style.left = left + 'px';
  popover.style.top  = top  + 'px';

  popover.classList.add('is-open');
  popover.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('is-open');
  state.picker.isOpen = true;
}

function closeColorPicker() {
  const popover  = document.getElementById('colorPickerPopover');
  const backdrop = document.getElementById('pickerBackdrop');
  popover.classList.remove('is-open');
  popover.setAttribute('aria-hidden', 'true');
  backdrop.classList.remove('is-open');
  state.picker.isOpen = false;
  state.picker.role   = null;
}

function syncPickerToState(role) {
  const color = state.palette[role];
  document.getElementById('pickerRoleLabel').textContent    = ROLE_LABELS[role];
  document.getElementById('pickerHexBadge').textContent     = color.hex.toUpperCase();
  document.getElementById('pickerPreviewSwatch').style.background = color.hex;
  document.getElementById('pickerNativeInput').value        = color.hex;
  document.getElementById('pickerHue').value                = Math.round(color.h);
  document.getElementById('pickerSaturation').value         = Math.round(color.s);
  document.getElementById('pickerLightness').value          = Math.round(color.l);
  document.getElementById('pickerHueVal').textContent       = Math.round(color.h) + '°';
  document.getElementById('pickerSatVal').textContent       = Math.round(color.s) + '%';
  document.getElementById('pickerLightVal').textContent     = Math.round(color.l) + '%';
}

function applyPickerColor(role, hex) {
  const { h, s, l } = hexToHsl(hex);
  state.palette[role] = makeColor(h, s, l);
  syncPickerToState(role);
  renderAll();
  if (state.picker.isOpen) pushHistory();
}

function applySliderChange(role) {
  const h = parseFloat(document.getElementById('pickerHue').value);
  const s = parseFloat(document.getElementById('pickerSaturation').value);
  const l = parseFloat(document.getElementById('pickerLightness').value);
  state.palette[role] = makeColor(h, s, l);
  const hex = state.palette[role].hex;
  document.getElementById('pickerPreviewSwatch').style.background = hex;
  document.getElementById('pickerHexBadge').textContent           = hex.toUpperCase();
  document.getElementById('pickerNativeInput').value              = hex;
  document.getElementById('pickerHueVal').textContent             = Math.round(h) + '°';
  document.getElementById('pickerSatVal').textContent             = Math.round(s) + '%';
  document.getElementById('pickerLightVal').textContent           = Math.round(l) + '%';
  renderAll();
}

/** Extract hue from current edited color, regenerate all unlocked roles around it */
function harmonizeFromPickedColor() {
  const role  = state.picker.role;
  if (!role) return;
  const color = state.palette[role];
  // Regenerate palette using this hue
  const newPalette = generatePalette(state.harmony || HARMONY_TYPES[0], color.h);
  COLOR_ROLES.forEach(r => {
    if (!state.locks[r] && r !== role) state.palette[r] = newPalette[r];
  });
  syncPickerToState(role);
  renderAll();
  pushHistory();
}

/* ──────────────────────────────────────────────────────────────
   HISTORY
────────────────────────────────────────────────────────────── */

function pushHistory() {
  const snapshot = {
    palette: JSON.parse(JSON.stringify(state.palette)),
    fonts:   JSON.parse(JSON.stringify(state.fonts)),
    harmony: state.harmony,
    id:      Date.now(),
  };
  state.history.unshift(snapshot);
  if (state.history.length > 10) state.history.pop();
  renderHistory();
}

function restoreSnapshot(snapshot) {
  state.palette  = JSON.parse(JSON.stringify(snapshot.palette));
  state.fonts    = JSON.parse(JSON.stringify(snapshot.fonts));
  state.harmony  = snapshot.harmony;
  state.hasGenerated = true;
  if (snapshot.fonts.pair) loadFontPair(snapshot.fonts.pair);
  renderAll();
  renderHistory(snapshot.id);
}

function clearHistory() {
  state.history = [];
  renderHistory();
}

function renderHistory(activeId) {
  const grid  = document.getElementById('historyGrid');
  const count = document.getElementById('historyCount');
  const clearBtn = document.getElementById('clearHistoryBtn');
  count.textContent = `${state.history.length} / 10`;
  if (clearBtn) clearBtn.disabled = state.history.length === 0;
  if (state.history.length === 0) { grid.innerHTML = ''; grid.appendChild(document.getElementById('historyEmpty') || createEmptyEl()); return; }
  grid.innerHTML = '';
  state.history.forEach(snap => {
    const card = document.createElement('div');
    card.className = 'history-card' + (snap.id === activeId ? ' active' : '');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Restore ${snap.harmony} palette`);

    const palette = document.createElement('div');
    palette.className = 'history-palette';
    COLOR_ROLES.forEach(role => {
      const s = document.createElement('div');
      s.className = 'history-swatch';
      s.style.background = snap.palette[role].hex;
      palette.appendChild(s);
    });

    const info = document.createElement('div');
    info.className = 'history-info';
    info.innerHTML = `
      <div class="history-fonts">${snap.fonts.heading || '—'} / ${snap.fonts.body || '—'}</div>
      <div class="history-harmony">${capitalize(snap.harmony)}</div>`;

    card.appendChild(palette);
    card.appendChild(info);
    card.addEventListener('click', () => restoreSnapshot(snap));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); restoreSnapshot(snap); } });
    grid.appendChild(card);
  });
}

function createEmptyEl() {
  const p = document.createElement('p');
  p.className = 'history-empty';
  p.id        = 'historyEmpty';
  p.textContent = 'Generate your first aesthetic to see history here.';
  return p;
}

/* ──────────────────────────────────────────────────────────────
   CLIPBOARD
────────────────────────────────────────────────────────────── */

async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; }
}

async function copyHex(el, hex) {
  if (!await copyToClipboard(hex)) return;
  el.classList.add('copied');
  const orig = el.textContent;
  el.textContent = 'Copied!';
  setTimeout(() => { el.textContent = orig; el.classList.remove('copied'); }, 1500);
}

async function copyExport() {
  const code = document.getElementById('exportCodeInner').textContent;
  if (!code || !state.hasGenerated) return;
  const btn  = document.getElementById('copyBtn');
  if (!await copyToClipboard(code)) return;
  btn.classList.add('copied');
  const span = btn.querySelector('.copy-text');
  const orig = span.textContent;
  span.textContent = 'Copied!';
  setTimeout(() => { span.textContent = orig; btn.classList.remove('copied'); }, 2000);
}

/* ──────────────────────────────────────────────────────────────
   DARK MODE
────────────────────────────────────────────────────────────── */

function initDarkMode() {
  const saved = localStorage.getItem('ag-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
}

function toggleDarkMode() {
  const html    = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ag-theme', next);
}

/* ──────────────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────────────── */

function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }

/* ──────────────────────────────────────────────────────────────
   EVENT LISTENERS
────────────────────────────────────────────────────────────── */

function initEvents() {
  // Generate
  document.getElementById('generateBtn').addEventListener('click', generate);

  // Dark mode toggle
  document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);

  // Font lock buttons
  document.querySelectorAll('.lock-btn[data-lock]').forEach(btn => {
    btn.addEventListener('click', () => toggleFontLock(btn.dataset.lock));
  });

  // Export tabs
  document.querySelectorAll('.export-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.export-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      state.activeTab = tab.dataset.tab;
      renderExport();
    });
  });

  // Copy export
  document.getElementById('copyBtn').addEventListener('click', copyExport);
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
  document.getElementById('previewDarkToggle').addEventListener('click', togglePreviewDark);
  document.getElementById('previewBtnGhost').addEventListener('click', openFullPagePreview);

  // Harmony mode chips
  document.getElementById('harmonyChips').addEventListener('click', e => {
    const chip = e.target.closest('.mode-chip');
    if (!chip) return;
    document.querySelectorAll('#harmonyChips .mode-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.harmonyMode = chip.dataset.harmony;
  });

  // Font mode chips
  document.getElementById('fontModeChips').addEventListener('click', e => {
    const chip = e.target.closest('.mode-chip');
    if (!chip) return;
    document.querySelectorAll('#fontModeChips .mode-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.fontMode = chip.dataset.fontmode;
  });

  // Color picker: close button
  document.getElementById('pickerClose').addEventListener('click', closeColorPicker);

  // Color picker: backdrop click
  document.getElementById('pickerBackdrop').addEventListener('click', closeColorPicker);

  // Color picker: native color input
  document.getElementById('pickerNativeInput').addEventListener('input', e => {
    const role = state.picker.role;
    if (!role) return;
    applyPickerColor(role, e.target.value);
  });

  // Color picker: hue slider
  document.getElementById('pickerHue').addEventListener('input', () => {
    if (state.picker.role) applySliderChange(state.picker.role);
  });

  // Color picker: saturation slider
  document.getElementById('pickerSaturation').addEventListener('input', () => {
    if (state.picker.role) applySliderChange(state.picker.role);
  });

  // Color picker: lightness slider
  document.getElementById('pickerLightness').addEventListener('input', () => {
    if (state.picker.role) applySliderChange(state.picker.role);
  });

  // Color picker: harmonize button
  document.getElementById('pickerHarmonizeBtn').addEventListener('click', harmonizeFromPickedColor);

  // Close picker on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.picker.isOpen) closeColorPicker();
  });

  // Keyboard: Space on body = generate
  document.addEventListener('keydown', e => {
    if (e.key === ' ' && e.target === document.body && !state.picker.isOpen) {
      e.preventDefault();
      generate();
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────────── */

function init() {
  initDarkMode();
  initEvents();
  generate(); // auto-generate on first load
}

document.addEventListener('DOMContentLoaded', init);

---
name: CHANDRA
description: A reflective Vedic astrology workspace
colors:
  primary: "#D9BD8B"
  night: "#0B1321"
  surface: "#121D2D"
  recessed: "#0E1827"
  raised: "#19263A"
  text: "#F2EEE6"
  muted-text: "#B1BBCA"
  divider: "#D7E1EF24"
  accent-soft: "#D9BD8B1F"
typography:
  display:
    fontFamily: "Iowan Old Style, Baskerville, Palatino Linotype, Georgia, serif"
    fontSize: "52px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  control: "8px"
  panel: "12px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#172030"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#E6D0A9"
    textColor: "#172030"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  field:
    backgroundColor: "{colors.recessed}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    height: "44px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "24px"
  chart-pill:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
---

# Design System: CHANDRA

## 1. Overview

**Creative North Star: "The Midnight Observatory"**

Someone explores a birth chart in a quiet room after dark. The interface should feel moonlit and contemplative while keeping the chart, controls, and caveats easy to read. The current midnight-blue and warm-gold identity stays in place, with the chart and NASA Moon imagery providing the atmosphere.

The product uses a restrained workspace with modest asymmetry around the chart and form. `DESIGN_VARIANCE: 5`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 4`: familiar app navigation, clear working surfaces, and motion only for feedback or state change. Native system text keeps controls quick to read; a platform serif gives major headings a quiet contrast. This system rejects cluttered dashboards, neon sci-fi effects, purple gradients, generic horoscope clichés, and decorative details that compete with the chart.

**Key Characteristics:**
- Deep blue surfaces with one warm-gold accent.
- Flat tonal layers, with borders used to define working areas.
- Serif reserved for major headings; sans serif for controls and chart data.
- Responsive chart and profile surfaces with visible keyboard focus.

## 2. Colors

The palette keeps CHANDRA’s midnight setting and uses gold sparingly for action, selection, and celestial emphasis.

### Primary
- **Moonlit Gold**: Primary action, active tabs, chart highlights, and selected controls.

### Neutral
- **Night Sky**: Global page background.
- **Observatory Surface**: Main panels and working areas.
- **Recessed Slate**: Text fields and inset controls.
- **Raised Blue Slate**: Nested reading and comparison regions.
- **Moonlight**: Main text and high-priority chart labels.
- **Soft Moonlight**: Secondary copy, helper text, and inactive controls. Keep it readable against every surface.
- **Quiet Divider**: Full borders and separators. Never use it as a decorative grid.

**The One Accent Rule.** Gold marks primary actions, selected states, and meaningful chart data. Use semantic error colors only for actual errors.

## 3. Typography

**Display Font:** Iowan Old Style / Baskerville / Palatino Linotype / Georgia, with a Georgia serif fallback.
**Body Font:** Native system sans-serif.
**Label/Mono Font:** Native system sans-serif.

**Character:** Platform typography keeps the interface immediate, while a restrained serif gives the main page and chart titles a more reflective voice. Labels, buttons, dates, tables, and data remain sans-serif.

### Hierarchy
- **Display** (400, 52px, 1.08 line-height): Main page title; 42px on narrow screens.
- **Headline** (400, 32-36px, 1.18 line-height): View and section titles.
- **Title** (400-500, 21-28px, 1.2-1.25 line-height): Panels and reading sections.
- **Body** (400, 15px, 1.55 line-height): Explanatory text; keep prose near 65ch.
- **Label** (500, 13px, 1.4 line-height): Form labels and controls. Avoid tiny tracked uppercase copy.

**The Two Voice Rule.** Display serif is for headings. Interface labels, buttons, and numerical data use the system sans-serif.

## 4. Elevation

Depth comes from three dark tonal surfaces and quiet full borders, not decorative shadows. Tooltips and suggestions may use a small shadow to separate from content; the Moon canvas may use a soft shadow to hold its image against the page. Panels remain flat at rest.

**The Flat Surface Rule.** Do not pair a full border with a large soft shadow. Use surface contrast and spacing first.

## 5. Components

Components feel direct and calm. Use one control vocabulary across chart, profile, and comparison views.

### Buttons
- **Shape:** Gently rounded controls (8px).
- **Primary:** Moonlit Gold with dark text, 44px minimum height, 10px 16px padding.
- **Hover / Focus:** Slightly lighter gold on hover; a clear 2px gold focus outline with 3px offset.
- **Secondary / Ghost:** Transparent surface with a quiet gold border and readable gold text.
- **Active / Disabled:** Press by 1px; disabled controls remain visibly unavailable.

### Chips
- **Style:** Rounded pill (999px), quiet surface tint, muted text.
- **State:** Selected values use the gold tint; text stays high-contrast.

### Cards / Containers
- **Corner Style:** Working panels use 12px; nested controls use 8px.
- **Background:** Observatory Surface for primary panels; Raised Blue Slate for contained readings.
- **Shadow Strategy:** Flat at rest; small shadows only for overlays.
- **Border:** One subtle full border. No colored side stripes.
- **Internal Padding:** 24px desktop, 18-20px narrow screens.

### Inputs / Fields
- **Style:** Recessed Slate fill, a quiet full border, and 8px corners.
- **Focus:** 2px gold outline, visible without relying on color alone.
- **Error / Disabled:** Inline error copy; disabled state uses reduced opacity without hiding the label.

### Navigation
- **Style:** Workspace tabs keep their existing labels and order. Inactive tabs use Soft Moonlight; the selected tab uses Moonlit Gold and a short underline.
- **Mobile:** The same tabs remain available in a horizontally scrollable row. Do not replace them with a different mode or navigation model.

### Chart and Reading
- Chart labels use Moonlight or Soft Moonlight, with gold for selected houses and key placements.
- Keep chart exploration keyboard-operable and preserve `aria-pressed`, focus, and selected states.
- Compatibility remains a reflective view; never turn visual treatments into a relationship verdict.

## 6. Do's and Don'ts

### Do:
- **Do** keep the chart and the person’s task visually ahead of decoration.
- **Do** use the existing Moon image and calculated chart visuals for atmosphere.
- **Do** preserve visible focus, keyboard chart navigation, readable contrast, and reduced-motion behavior.
- **Do** keep birth-calculation limits and privacy notes legible.
- **Do** use one gold accent for actions and selected states.

### Don't:
- **Don't** build cluttered dashboards and decorative UI that competes with the chart.
- **Don't** add neon sci-fi effects, purple gradients, and generic horoscope clichés.
- **Don't** present compatibility scores as a verdict about a relationship.
- **Don't** hide keyboard behavior, lower text contrast, or ignore motion preferences.
- **Don't** add new product modes, reorder primary tabs, or change existing workflows as part of a visual refresh.

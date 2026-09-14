---
name: Kinetic Discipline
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c3c9b2'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8d937e'
  outline-variant: '#434938'
  surface-tint: '#a4d64c'
  primary: '#fefff1'
  on-primary: '#233600'
  primary-container: '#bef264'
  on-primary-container: '#4b6e00'
  inverse-primary: '#476800'
  secondary: '#b3d17a'
  on-secondary: '#243600'
  secondary-container: '#385005'
  on-secondary-container: '#a5c36d'
  tertiary: '#fffeff'
  on-tertiary: '#362b47'
  tertiary-container: '#ebdbff'
  on-tertiary-container: '#6a5e7d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#bff365'
  primary-fixed-dim: '#a4d64c'
  on-primary-fixed: '#131f00'
  on-primary-fixed-variant: '#354e00'
  secondary-fixed: '#ceee93'
  secondary-fixed-dim: '#b3d17a'
  on-secondary-fixed: '#131f00'
  on-secondary-fixed-variant: '#364e03'
  tertiary-fixed: '#ecdcff'
  tertiary-fixed-dim: '#cfc0e3'
  on-tertiary-fixed: '#201731'
  on-tertiary-fixed-variant: '#4d425e'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.05em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.045em
  display-sm:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.03em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.025em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system operates under an ethos of quiet austerity, absolute focus, and relentless momentum. Engineered for high-performing individuals who treat self-accountability as a craft, the interface rejects decorative digital noise in favor of stark, monastic clarity. It evokes calm precision, psychological stillness, and deliberate intent.

The aesthetic fuses **Swiss Editorial Typography** with **Functional Linear Minimalism**:
- **Pure Subtraction:** Zero decorative containers, no elevated card elevations, no multi-color badges, and no radial gradients. Structure is conveyed strictly through spatial rhythm, disciplined typographic scale, and structural hairline dividers.
- **Intentional Contrast:** Deep, void-like blacks ground the canvas, punctuated only by an electric chartreuse accent when an action is confirmed, a streak is sustained, or momentum is locked.
- **Utilitarian Rhythm:** Dense, tactile data points (e.g., commit heatmaps, streak integers) live harmoniously alongside expansive, breathing margins to honor cognitive bandwidth.

## Colors

The palette enforces extreme chromatic discipline. Color is never decorative; it is an active signal indicating completion, continuity, or primary focus.

### Base Canvases & Structural Tones
- **Canvas Base (`#050505`):** The foundational absolute black canvas, eliminating screen glow on OLED devices and framing content in total darkness.
- **Surface Deep (`#0A0A0A`):** The primary view background layer.
- **Hairline Divider (`#1F1F1F` / `rgba(255, 255, 255, 0.08)`): Used strictly for 1px baseline structural rules and row demarcations. Never exceeds 1px.

### Text & Glyph Tiers
- **Text Primary (`#F5F5F5`):** Reserved for core metrics, active titles, and selected states.
- **Text Secondary (`#A3A3A3`):** Metadata, secondary values, timestamps, and active icons.
- **Text Muted (`#525252`):** Inactive indicators, empty-state cells, and structural labels.
- **Text Faint (`#262626`):** Inactive heat map cells and track markers.

### Accent Mechanics
- **Primary Accent (`#BEF264`):** Electric chartreuse. Used solely for the primary completion CTA, verified checkmarks, and active streak signals.
- **Secondary Highlight (`#D9F99D`):** Light chartreuse. Used for glowing numerical focal points, selected dates, and tap feedback.
- **Accent Interactive Hover/Press (`#A3E635`):** Compressed state feedback for primary actionable surfaces.

## Typography

The typographical voice is anchored entirely in `Inter`, tuned to deliver an architectural, data-dense editorial aesthetic. 

- **Tracking Strategy:** Large headlines, streaks, and numeric values employ aggressive negative tracking (`-0.03em` to `-0.05em`), consolidating glyphs into tight, impactful typographic blocks. Uppercase functional labels receive expanded tracking (`+0.04em` to `+0.08em`) to guarantee legibility at minute scales without compromising structure.
- **Tabular Numerics:** All numerals within habit tallies, heatmaps, counters, and clock interfaces must enable `font-feature-settings: "tnum" 1, "cv05" 1` to ensure rigid columnar alignment across rows.
- **Hierarchical Discipline:** Content hierarchy is achieved through weight shifting (`400` body vs `600` titles) and distinct opacity intervals (`#F5F5F5` down to `#525252`), never through random color accents or expressive font switching.

## Layout & Spacing

The layout is built for fluid mobile-first precision with a strict vertical rhythm derived from a 4px grid standard.

- **Grid Architecture:** Single-column fluid framework on mobile devices with consistent outer canvas margins of `1.25rem` (20px). Multi-column content within data visualizers (like weekly matrices or heatmaps) adheres to a strict 7-column cadence matching the days of the week, with fractional gutters of `4px` to `6px`.
- **Vertical Airflow:** Because the system forbids framed cards or bounding boxes, content separation is orchestrated via deliberate emptiness:
  - Sections sit separated by `2.5rem` (`space-xl`).
  - Item rows inside a group maintain a structural vertical rhythm of `1rem` (`space-md`) to `1.25rem`.
  - Micro-spacing (`space-xs` to `space-sm`) clusters actionable labels directly beneath their metrics.
- **Safe Areas & Pinning:** The bottom action boundary conforms to native mobile hardware home-indicators, padding the floating primary action `1rem` above the system bar.

## Elevation & Depth

This system fundamentally rejects three-dimensional illusionism. There are no drop shadows, no directional lighting, and no layered skeuomorphic bevels.

- **Zero-Shadow Philosophy:** `box-shadow` values are globally set to `none`. Visual hierarchy is purely optical, achieved through contrast differentials between deep charcoal backdrops and crisp typography.
- **Flat Boundary Delineation:** Rather than lifting surfaces forward via elevation tiers, spatial zones are demarcated using:
  - **Sub-pixel Hairlines:** A single `1px solid rgba(255, 255, 255, 0.08)` border to separate structural rows or navigation bars.
  - **Color Inversion:** Floating elements, such as the primary pill CTA, cut through the darkness with a pure `#BEF264` fill against `#050505`, creating instantaneous dominance without spatial extrusion.
- **Overlays & Modals:** Ephemeral sheets slide directly over the viewport with an unblurred, solid `#0A0A0A` background, separated only by a top hairline border (`#1F1F1F`).

## Shapes

The shape vocabulary balances rigid, architectural edges with fully rounded pill contours for focal touchpoints.

- **Pill Primitives:** High-leverage interactive touch surfaces—such as the full-width primary CTA, filter chips, and habit completion checks—are engineered as complete pill enclosures (`border-radius: 9999px`).
- **Data Primitives:** Data visualization modules, matrix indicators, and calendar cells use subtle squircle rounding (`4px` or `space-xs`), preventing visual collision when densely packed.
- **Zero-Box Structural Containers:** The canvas itself and list items retain razor-sharp zero-radius architecture, flowing organically edge-to-edge across the phone screen.

## Components

### Buttons & Actions
- **Primary CTA:** Full-width pill element (`height: 52px`, `border-radius: 9999px`) saturated in `#BEF264`. Contains bold, centered text in `#0A0A0A` (`label-md`, `fontWeight: 600`). In pressed states, it scales slightly to `0.98` with a background shift to `#A3E635`.
- **Secondary Ghost Action:** Full-width pill with transparent background, hairline border (`1px solid rgba(255, 255, 255, 0.15)`), and `#F5F5F5` label.

### Habit Row Items (Cards Replacement)
- Habits do not sit inside rounded boxes or shaded cards. 
- Each habit is an edge-to-edge row separated by a bottom hairline divider (`1px solid rgba(255, 255, 255, 0.06)`).
- Left side: Displays the habit name (`body-lg`, `#F5F5F5`) with current streak badge underneath (`label-sm`, `#A3A3A3` with the streak number highlighted in `#D9F99D`).
- Right side: Houses the completion trigger.

### Completion Triggers (Checkboxes & Targets)
- Circular pill ring (`width: 32px`, `height: 32px`, `border: 1.5px solid #333333`).
- When toggled complete, the ring fills completely with `#BEF264`, and an obsidian black checkmark icon (`#050505`) snaps into place with a subtle haptic vibration.

### Minimal Bottom Navigation
- Fixed, ultra-slim dock pinned to the bottom screen safe area (`background: #050505`, `border-top: 1px solid rgba(255, 255, 255, 0.08)`).
- Icons rendered in monochromatic `#525252`.
- Active state: Icon shifts to `#F5F5F5`, accompanied by a centered micro-dot (`3px` diameter, `#BEF264`) placed `4px` beneath the icon.

### Minimal Contribution Heatmap
- Dense 7xN grid tracking habit consistency across days/weeks.
- Cells: `10px x 10px` rounded squares (`border-radius: 2px`).
- Inactive / Empty day: `#141414`.
- Partial completion: `#263914` (dark desaturated lime tint).
- Full completion: `#BEF264` (full accent signal).

### Inputs & Text Entry
- Single-line editorial inputs with zero background filling.
- Bottom hairline rule only (`1px solid #333333`), transitioning to `1px solid #BEF264` on focus.
- Placeholder text styled in `#525252` (`body-lg`), input values typed in `#F5F5F5`.
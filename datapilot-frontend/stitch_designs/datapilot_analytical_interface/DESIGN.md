---
name: DataPilot Analytical Interface
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#a1d2ff'
  on-tertiary: '#003351'
  tertiary-container: '#5cb9ff'
  on-tertiary-container: '#00486f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  metric-val:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-compact: 0.5rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system embodies the intersection of deep quantitative analysis and high-velocity AI orchestration. Synthesizing the data density and precision of a Bloomberg Terminal with the refined, fluid tactility of Linear and the clear, unstructured thought workspace of Notion AI, the visual language prioritizes utility, speed, and analytical rigor.

### Key Brand Tenets
- **Authoritative Precision:** Information is treated as high-signal intelligence. Visual styling avoids ornamental excess; every border, mono-accent, and hue shift communicates state, lineage, or certainty.
- **Controlled Density:** Complex multidimensional telemetry (agent run states, DuckDB vectorized queries, vector embeddings) remains dense yet legible through strict vertical hierarchy, subtle tonal step-downs, and disciplined micro-spacing.
- **Deep Slate Luminance:** Dark-mode-first environment crafted to eliminate fatigue during prolonged query authoring and pipeline inspection. The interface recedes, permitting highlighted code, data arrays, and status signals to emerge with crisp contrast.

## Colors

The palette is engineered specifically for dense data interfaces, using a cool charcoal foundation paired with targeted luminescence.

### Functional Roles
- **Surfaces & Backgrounds:**
  - Base Canvas (`#0B0F17`): Deepest background for overall application frame and persistent navigation.
  - Surface Layer 1 (`#111827`): Primary card, panel, and data-table container backdrop.
  - Surface Layer 2 (`#1E293B`): Active row highlights, elevated popovers, and nested agent execution blocks.
- **Borders & Dividers:**
  - Subdued Border (`#1F2937`): Subtle separation lines for internal cards and grid partitions.
  - Interactive/Strong Border (`#374151`): Field inputs, focused cards, and interactive boundaries.
- **Accents & AI States:**
  - Primary Cyan (`#38BDF8`): System triggers, active DuckDB query execution nodes, primary selections, and cursor state.
  - Deep Cyan (`#0284C7`): Deep hover states and secondary action surfaces.
  - Orchestration Indigo (`#6366F1`): Multi-agent orchestration paths, LangGraph state transitions, and vector RAG citations.
- **Telemetry & Semantic Status:**
  - Health/Success Emerald (`#10B981`): Validated queries, finished pipeline steps, low latency markers.
  - Warning Amber (`#F59E0B`): Token threshold warnings, slow scans, fallback agent logic triggers.
  - Critical Crimson (`#EF4444`): SQL syntax errors, failed model contexts, connection drops.

## Typography

Typography establishes an instant boundary between conversational synthesis and structured data execution.

- **Geist (Interface Core):** Deployed across all UI surfaces, natural language synthesis outputs, markdown briefings, and operational controls. Its tight tracking and geometric balance provide neutral, uncompromised legibility.
- **JetBrains Mono (Technical Core):** Utilized for SQL query editors, raw data grids, latency numbers, LangGraph node identifiers, token counts, and small uppercase metadata labels. Monospaced characters ensure strict numerical vertical alignment across large DuckDB result sets.

## Layout & Spacing

The layout is built upon a high-density, multi-pane workbench paradigm engineered for deep multi-monitor desktop environments while retaining full vertical reflow capability on compact screens.

### Grid & Composition
- **Desktop (>= 1280px):** Multi-column flexible workspace. Common layout spans a narrow collapsible agent timeline/sidebar (260px fixed), an expandable SQL/Notion-style scratchpad (fluid 40-50%), and a live analytical visualization canvas/table pane (fluid 50-60%). Internal grids use 12 columns with a strict `1rem` gutter.
- **Tablet (768px - 1279px):** Two-pane view with secondary analysis panels docked into slide-out drawers or tabbed views. Gutters step down to `0.75rem`.
- **Mobile (< 768px):** Single-column stacked workflow. Sidebars collapse to modal navigation; tables and graph visualization panes switch to horizonal card scrollers. Global margin contracts to `0.75rem`.
- **Spacing Rhythm:** Standard layout increments operate on a strict 4px sub-grid (`space-xs`: 4px, `space-sm`: 8px, `space-md`: 12px, `space-lg`: 16px, `space-xl`: 24px) ensuring dense data displays without clutter.

## Elevation & Depth

This design system avoids high-blur diffuse ambient drop shadows, relying instead on structural layering through low-contrast ghost outlines, subtle luminous accents, and tiered tonal surfaces.

- **Base Layer (Level 0):** `#0B0F17` canvas surface. Direct backdrop for root structural scaffolding.
- **Container Surfaces (Level 1):** `#111827` surfaces bounded by a continuous 1px `#1F2937` border. Used for static metrics, standard table cells, and document panels.
- **Elevated Interactive Layer (Level 2):** `#161F30` surface with a 1px border colored `#374151`. Used for hover states, floating parameter toolbars, and active agent execution steps.
- **Overlay & Command Palette (Level 3):** `#111827` backed by an ultra-subtle directional glow: `box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px #374151`.
- **Agent Focus Mode:** When an AI agent executes an action or writes to the scratchpad, the active container acquires an inset subtle border transition to `#38BDF8` with a 2px outer aura: `0 0 12px -2px rgba(56, 189, 248, 0.15)`.

## Shapes

The interface embraces a compact, technical sharpness. Micro-radii reinforce high information density and align with terminal-inspired design.

- **Default Radii (`rounded` - 4px / 0.25rem):** Standard buttons, input bars, code blocks, table cell selections, and status pills.
- **Container Radii (`rounded-lg` - 8px / 0.5rem):** Analytical card panels, modal dialogs, flyout drawers, and data-grid wrappers.
- **Pill Exceptions:** Restricted strictly to active runtime indicators, live agent loop markers, and status tags (e.g., streaming status badges).

## Components

### Buttons & Interactive Triggers
- **Primary:** High-signal solid `#38BDF8` with `#0B0F17` bold typography. Hover shifts to `#0284C7` with text shifting to `#FFFFFF`. Focused state adds a 2px offset border.
- **Secondary / Ghost:** Transparent background with 1px border `#374151` and text `#E2E8F0`. Hover triggers background `#1E293B` and border `#64748B`.
- **Run Query Action:** Monospaced keyboard shortcut suffix (`⌘+Enter`), embedded inside the button in muted tones.

### Input Fields & SQL Console
- **Field Base:** Dark input field (`#0B0F17`) framed by 1px `#1F2937` border, typography set in Geist for prompts and JetBrains Mono for SQL inputs.
- **Active / Focused:** Border transitions instantaneously to `#38BDF8` with zero outer ring expansion, preserving razor-sharp terminal precision.

### Status Chips & Agent Tags
- **Design:** Compact 20px height, uppercase `label-caps` typography, 1px border with 10% translucent tinted backgrounds.
- **Variants:**
  - *DuckDB Execution:* Border `#0284C7`, text `#38BDF8`, background `rgba(2, 132, 199, 0.12)`.
  - *LangGraph Agent Active:* Border `#6366F1`, text `#A5B4FC`, background `rgba(99, 102, 241, 0.12)`.
  - *RAG Source Verified:* Border `#10B981`, text `#6EE7B7`, background `rgba(16, 185, 129, 0.12)`.

### Cards & Analytical Panels
- **Layout:** Built on `#111827` backgrounds with 1px `#1F2937` border. 
- **Header Structure:** Header row decoupled by a clean 1px bottom border `#1F2937`, containing an icon, title in `headline-sm`, and right-aligned monospaced performance telemetry (e.g., `42ms | 1.2M rows`).

### Data Grids & Tabular Visualizations
- **Header:** Background `#0B0F17`, bottom border 1px `#374151`, typography `label-caps` in `#94A3B8`.
- **Cells:** Padding `space-sm` vertical, `space-md` horizontal. Alternating rows strictly avoided; row hover states use transparent cyan wash `rgba(56, 189, 248, 0.04)`. All numbers displayed in `code-md`.

### Agent Multi-Step Execution Nodes
- **Node Component:** Vertical timeline node with 1px connecting lines (`#1F2937`).
- **States:** Pending (hollow ring `#374151`), Running (pulsing ring `#38BDF8`), Complete (solid emerald glyph `#10B981`), Blocked/Failed (solid crimson `#EF4444`).
- **Insight Embeds:** Collapsible Notion-like callout blocks with left accent line (2px solid `#6366F1`) indicating AI-derived prescriptive actions.
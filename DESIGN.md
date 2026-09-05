# LVPD Duty Portal Design System

## 1. Atmosphere & Identity
LVPD feels like a live operations briefing: calm, exact, and cinematic. The signature is a real incident-film surface behind a disciplined evidence layout. Motion communicates system state and route changes; it never decorates empty space.

## 2. Color

| Role | Token | Value | Usage |
|------|------|------|------|
| Surface primary | `--surface-primary` | `#020617` | Page background |
| Surface secondary | `--surface-secondary` | `#0f172a` | Panels and navigation |
| Surface elevated | `--surface-elevated` | `#111c31` | Hero content and active surfaces |
| Text primary | `--text-primary` | `#f8fafc` | Headings and key values |
| Text secondary | `--text-secondary` | `#94a3b8` | Body copy |
| Text tertiary | `--text-tertiary` | `#64748b` | Metadata |
| Border default | `--border-default` | `#1e293b` | Structural dividers |
| Accent primary | `--accent-primary` | `#3b82f6` | Links, active state, CTA |
| Accent hover | `--accent-hover` | `#60a5fa` | Hover and focus |
| Status live | `--status-live` | `#22d3ee` | Live system indicator (pulse dot, dispatch chevron) |
| Status safe | `--status-safe` | `#4ade80` | KONDUSIF, aktif |
| Status caution | `--status-caution` | `#facc15` | INVESTIGASI |
| Status alert | `--status-alert` | `#ef4444` | Urgent, offline |

**Color hierarchy rules:**
- Cyan: ONLY for live/real-time indicators (pulse dots, dispatch chevrons, radar)
- Blue: interactive elements (links, buttons, active nav, CTAs)
- Green/Yellow/Red: operational status only (district status, member status)
- Never use cyan for buttons or links; never use blue for status dots

## 3. Typography

- Display: `Oswald`, sans-serif; condensed, uppercase, 600-700.
- Body: `Plus Jakarta Sans`, sans-serif; 400-600.
- Data: Plus Jakarta Sans with tabular numerals.
- Display scale: `clamp(3rem, 8vw, 7.5rem)` with line height `0.88`.
- Body scale: 14-16px, line height 1.6.
- Overline: 10-11px, 700, positive tracking.
- **Rule**: uppercase only for labels, overlines, and short status text. Body text, descriptions, and names use normal case.

## 4. Spacing & Layout

- Base unit: 4px.
- Page width: max 1280px (max-w-5xl for content, max-w-6xl for full-bleed).
- **12-column grid**: Use `grid-cols-12` for dashboard layouts. Stats panels = 3 cols, main content = 9 cols.
- Hero uses an asymmetric 7/5 split at desktop and a single stack below 768px.
- Major sections use 48-64px vertical rhythm.
- Mobile horizontal padding: 24px. Desktop horizontal padding: 32px.
- Card padding: always `p-6` (24px). Never p-8 on cards.

## 5. Components

### PanelHeader (reusable)
- Structure: icon (left) + title + status text (right) + border-bottom.
- All panels use this header pattern: Personil, Activity, Laporan, Dispatch, Tactical Map, Admin cards.
- Props: `icon`, `iconColor`, `title`, `status`, `live` (adds cyan pulse dot).

### Panel card
- Background: `bg-slate-950/80` or `bg-slate-900/80`
- Border: `border border-slate-800`
- Padding: `p-6`
- Top accent line: optional `h-1 bg-blue-500/50` or gradient

### Cinematic hero
- Structure: status line, two-line display title, concise description, primary/tertiary actions, evidence rail.
- States: default, hover, focus-visible, reduced-motion.
- Surface: full-bleed MP4, 55% opacity, directional dark wash, grid texture.
- Motion: staggered content entry; video remains passive and muted.

### Route navigation
- Structure: LVPD identity, route links, admin action, mobile menu.
- States: default, active underline, hover, focus-visible, expanded mobile menu.
- Motion: 180ms opacity/transform transitions only.

### Mobile bottom navigation
- Structure: four primary destinations with icon, label, and active state; secondary routes stay in the header menu.
- Surface: fixed slate navigation above device safe area, visible below 768px only.
- Accessibility: active destination uses `aria-current`; main and footer reserve navigation height.

### Filter toolbar
- Search and select controls synchronize with URL query parameters so state survives refresh and sharing.
- Labels stay visible to assistive technology; results update without navigation.

### Member detail drawer
- Native modal dialog with backdrop, Escape dismissal, close control, portrait, status, rank, specialization, and mission count.
- Trigger state is stored in the URL and remains keyboard accessible.

### Duty timeline
- Chronological rail on mobile and desktop with a selected report detail surface.
- Public timeline excludes drafts; status and period filters persist in the URL.

### Actionable toast
- Mutation states use direct Indonesian labels: Menyimpan, Tersimpan, and Gagal.
- Destructive actions are optimistic and provide a short Batalkan action before server deletion.

### Evidence rail
- Structure: three compact operational facts below hero content.
- Surface: tonal shift with one-pixel border; square corners.
- Accessibility: facts remain readable without video and at reduced motion.

### Chapter heading
- Structure: two-digit chapter marker, operational overline, display title, and concise context.
- Entry: opacity plus vertical transform when chapter enters the viewport.
- Accessibility: semantic heading order remains intact; no information depends on motion.

### Skeleton loader
- Pattern: gradient shimmer animation on `bg-slate-800/60` blocks.
- Shape matches the panel it replaces (PanelSkeleton, CardSkeleton).
- Disabled when `prefers-reduced-motion: reduce`.

### Empty state
- Centered layout: icon (48px, muted) + title + description + optional CTA button.
- Used for: no search results, no data, error states.

## 6. Motion & Interaction

- Entry: 400-600ms cubic-bezier(0.16, 1, 0.3, 1), opacity + transform.
- Controls: 180ms ease-out; hover uses transform/opacity/color only.
- Hero depth: fog, grid, and skyline translate at separate low velocities during scroll.
- `prefers-reduced-motion: reduce` disables non-essential motion and hides video movement while preserving its first frame.
- Radar animation pauses when tab is hidden (`visibilitychange`).
- Every link and button has visible `focus-visible` treatment.

## 7. Depth & Surface

Mixed strategy: tonal shifts establish hierarchy, structural borders clarify operational panels, and video supplies dimensional light. No generic black shadows or decorative floating orbs.

## 8. Accessibility Constraints & Accepted Debt

- Target WCAG 2.2 AA.
- Body contrast target 4.5:1; large display text target 3:1.
- Video is muted, decorative, and never required to understand content.
- Keyboard focus must remain visible on every interactive element.
- Claims such as live or real-time are used only for subscribed data; simulated dispatch is labeled explicitly.
- Accepted debt: data remains mock/local until Supabase table schema and RLS policy are supplied.

## 9. Panel Standard (Beranda)

All panels on the homepage follow this structure:
```
┌─ accent line (optional) ─────────────────────┐
│ [icon] Panel Title              [status text] │
│ ─────────── border-bottom ────────────────── │
│                                              │
│                Panel Content                 │
│                                              │
└──────────────────────────────────────────────┘
```

- Grid: 12-column (`lg:grid-cols-12`)
- Left stats: 3 cols (Personil + Aktivitas stacked, flex-1 for equal height)
- Right content: 9 cols (Laporan Terbaru)
- Bottom row: 2 equal cols (Dispatch + TacticalMap)
- All cards: `p-6`, `border-slate-800`, consistent header height via PanelHeader

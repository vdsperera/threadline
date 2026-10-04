# UI/UX Design Specifications — Threadline

## 1. Design System

### Colour palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1A202C` | Primary text, titles |
| `--color-primary-hover` | `#2D3748` | Primary hover state |
| `--color-secondary` | `#718096` | Secondary actions, metadata, timestamps |
| `--color-background` | `#F7FAFC` | Page background |
| `--color-surface` | `#FFFFFF` | Event cards, filter bar background |
| `--color-text-primary` | `#1A202C` | Body text, headings |
| `--color-text-secondary` | `#4A5568` | Supporting text, deks |
| `--color-border` | `#E2E8F0` | Default borders, timeline spine |
| `--color-cat-crime` | `#E53E3E` | Status badge for crime (rust) |
| `--color-cat-invest` | `#3182CE` | Status badge for investigation (steel) |
| `--color-cat-trial` | `#D69E2E` | Status badge for trial (brass) |
| `--color-cat-outcome` | `#38A169` | Status badge for outcome (moss) |
| `--color-cat-forensic`| `#319795` | Status badge for forensic (teal) |

### Typography scale
Font family: `Inter`, sans-serif
| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| `--font-heading-1` | 2.5rem | 700 | 1.2 | Case title |
| `--font-heading-2` | 1.5rem | 600 | 1.3 | Event titles |
| `--font-body` | 1rem | 400 | 1.6 | Event summaries and quotes |
| `--font-body-small` | 0.875rem| 400 | 1.5 | Metadata, timestamps, captions |
| `--font-label` | 0.75rem | 600 | 1.2 | Badges, category filters |

### Spacing scale
Base unit: 4px
| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight padding inside badges |
| `--space-sm` | 8px | Between icon and text |
| `--space-md` | 16px | Padding inside event cards |
| `--space-lg` | 24px | Between events |
| `--space-xl` | 32px | Between header and timeline |
| `--space-2xl` | 48px | Page-level padding (desktop) |

### Border radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, buttons |
| `--radius-md` | 8px | Event cards |
| `--radius-full` | 9999px| Timeline dots, person avatars |

### Elevation / shadows
| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.1)` | Event cards (default) |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Filter bar (sticky) |

### Breakpoints
| Name | Min width | Typical device |
|------|-----------|----------------|
| Mobile | 320px | Phone (portrait) |
| Tablet | 768px | Tablet (portrait) |
| Desktop | 1024px | Laptop / small desktop |

---

## 2. Page / View Specifications

```text
Page: Case Timeline View (US-005, US-006)
Route: `/[case-id]`
Purpose: Displays the metadata of the case and an interactive, chronological list of events.
Layout: Single column, max-width constrained for readability (e.g. 800px max-width), centered.

Sections:
  - Header: Contains case title, location, years, dek, and source link. Top of page.
  - Sticky Filter Bar: Contains category buttons. Sticks to the top of the viewport on scroll.
  - Timeline Spine: A vertical line running down the left side connecting events.
  - Event List: The chronological rendering of event cards.

Key components: Filter Button, Event Card, Category Badge.

Responsive behaviour:
  - Mobile: Timeline spine is aligned to the left edge. Event cards take up remaining width.
  - Tablet/Desktop: Timeline spine remains on the left, but overall container is centered with generous margins.

Accessibility notes:
  - Header uses `<h1>`.
  - Main timeline region uses `<main>` landmark.
  - Filter bar uses `aria-controls` to indicate it filters the timeline.
```

---

## 3. Component Specifications

```text
Component: Event Card
Purpose: Displays a single point in the timeline.
Used on: Case Timeline View

Props / inputs:
  - date: string — The display date
  - title: string — Event summary
  - detail: string — Extended description
  - category: enum — crime, invest, etc.
  - quote (optional): object — text and cite

States:
  - Default: Card with `--shadow-sm`, white background, category badge in top right.
  - Hover: N/A (read-only), though links inside detail text show underline.
  - Focus: If containing links, standard browser focus ring.
  - Empty: N/A.

Interaction: None on the card itself, but contained links are clickable.

Responsive:
  - Mobile: 100% width minus the timeline spine margin.
  - Desktop: 100% width of the constrained 800px container.

Accessibility:
  - Role: `article`.
  - Label: `aria-labelledby` pointing to the event title ID.
```

```text
Component: Filter Button
Purpose: Toggles visibility of specific categories in the timeline.
Used on: Sticky Filter Bar

Props / inputs:
  - category: string — The category name
  - color: string — The associated category color token

States:
  - Default: Outlined with the category color, white background, text is category color.
  - Hover: Background fills with 10% opacity of the category color.
  - Focus: standard 2px outline.
  - Active (Selected): Background fills solid with the category color, text becomes white.
  - Disabled: N/A.

Interaction:
  - Click/Tap: Toggles the active state and immediately filters the event list using vanilla JS.

Accessibility:
  - Role: `button`.
  - Keyboard: Space or Enter toggles state. Uses `aria-pressed="true/false"`.
```

---

## 4. User Flow Maps

```text
Flow: Filter Timeline Events (US-006)
Trigger: Reader clicks a category filter button in the sticky header.
Steps:
  1. User sees the full Case Timeline View → all events displayed.
  2. User clicks "Trial" filter button → button state changes to active.
  3. System (Vanilla JS) instantly applies `display: none` to all event cards not matching "Trial" → only trial events remain visible.

Edge cases:
  - All filters deselected → All events are displayed.
  - Filter yields empty result → Empty state card appears: "No events match the selected filters."
```

---

## 5. Navigation Structure

```text
Navigation type: Top breadcrumb / back link.

Primary navigation:
  - "← Back to all cases" → `/` (Home / Directory)

Active state: N/A (single page view).
```

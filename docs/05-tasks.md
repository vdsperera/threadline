# Task Backlog — Threadline

## Critical Path
TASK-001 → TASK-003 → TASK-004 → TASK-005 → TASK-008 → TASK-009

---

## Layer 1: Infrastructure

```text
ID: TASK-001
Title: Scaffold Astro Project
Layer: 1
Linked stories: US-005
Linked component: SSG Builder
Depends on: None
Input: Architecture document.
Output: An empty Astro project running locally on port 4321.
Acceptance condition: `npm run dev` starts without errors and serves a default index page.
Estimated size: S
Risk / notes: None.
```

```text
ID: TASK-002
Title: Configure GitHub Actions CI/CD
Layer: 1
Linked stories: US-007
Linked component: CI/CD Pipeline
Depends on: None
Input: Architecture document, GitHub repository access.
Output: `.github/workflows/deploy.yml` configured for Astro and GitHub Pages.
Acceptance condition: Pushing a commit to `main` triggers a successful build and deploy to GitHub Pages.
Estimated size: S
Risk / notes: Requires correct GitHub Pages settings to be enabled in the repo.
```

---

## Layer 2: Data models & migrations

```text
ID: TASK-003
Title: Define Case Data Schemas
Layer: 2
Linked stories: US-002, US-003
Linked component: Git Storage Backend, SSG Builder
Depends on: TASK-001
Input: JSON schema requirements from Requirements document.
Output: Zod schemas (or TypeScript interfaces) defined in `src/content/config.ts`.
Acceptance condition: TypeScript compiler validates the shapes of Case, Person, and Event successfully against sample data.
Estimated size: S
Risk / notes: Forms the contract for both CMS config and Astro page generation.
```

---

## Layer 3: API contracts & interfaces

```text
ID: TASK-004
Title: Configure Sveltia CMS Collections
Layer: 3
Linked stories: US-001, US-002, US-003, US-004
Linked component: Visual CMS
Depends on: TASK-003
Input: Zod schemas from TASK-003, Sveltia CMS documentation.
Output: `public/admin/config.yml` mapping exactly to the Threadline schemas.
Acceptance condition: A user can log into `/admin/` with a PAT, create a new case visually, and save it to generate a valid `.json` file in `cases/`.
Estimated size: M
Risk / notes: Risk of Sveltia CMS UI types not fully matching our strict Zod schema requirements.
```

---

## Layer 4: Business logic & services

```text
ID: TASK-005
Title: Implement Astro Data Fetching
Layer: 4
Linked stories: US-005
Linked component: SSG Builder
Depends on: TASK-003
Input: Sample `.json` case files in the `cases/` directory.
Output: An Astro function that reads and parses all JSON files using the defined schemas.
Acceptance condition: Astro build correctly loads and exposes all case metadata and timeline events to page templates.
Estimated size: S
Risk / notes: File system reading in Astro needs to be efficient.
```

---

## Layer 5: UI & integration

```text
ID: TASK-006
Title: Build Event Card Component
Layer: 5
Linked stories: US-005
Linked component: SSG Builder
Depends on: TASK-005
Input: Design specs for Event Card, typography, colours.
Output: `src/components/EventCard.astro` component.
Acceptance condition: Component visually matches the design spec across mobile and desktop, including the status badge.
Estimated size: S
Risk / notes: None.
```

```text
ID: TASK-007
Title: Build Sticky Filter Bar Component
Layer: 5
Linked stories: US-006
Linked component: Client-Side Timeline Filter
Depends on: TASK-005
Input: Design specs for Filter Button and Filter Bar.
Output: `src/components/FilterBar.astro` component.
Acceptance condition: Filter bar renders all available categories and sticks to the top of the viewport on scroll.
Estimated size: S
Risk / notes: Needs to be accessible (ARIA roles).
```

```text
ID: TASK-008
Title: Assemble Case Timeline Page
Layer: 5
Linked stories: US-005
Linked component: SSG Builder
Depends on: TASK-005, TASK-006, TASK-007
Input: Data fetching logic (TASK-005) and UI components (TASK-006, TASK-007).
Output: `src/pages/[id].astro` rendering a complete case timeline.
Acceptance condition: Page renders the case metadata in the header and all events chronologically below it.
Estimated size: M
Risk / notes: Ensuring the timeline spine aligns correctly across breakpoints.
```

```text
ID: TASK-009
Title: Implement Interactive Timeline Filtering
Layer: 5
Linked stories: US-006
Linked component: Client-Side Timeline Filter
Depends on: TASK-008
Input: Assembled page (TASK-008).
Output: `<script>` tag inside `FilterBar.astro` containing vanilla JS.
Acceptance condition: Clicking a filter button instantly toggles visibility of event cards without a page reload.
Estimated size: S
Risk / notes: Must ensure zero framework overhead.
```

---

## Layer 6: Hardening & observability

```text
ID: TASK-010
Title: Enforce Schema Validation on Build
Layer: 6
Linked stories: US-005
Linked component: SSG Builder
Depends on: TASK-003, TASK-005
Input: Architecture Risk Flags (Undefined data migration path).
Output: Build script update.
Acceptance condition: `astro build` fails with a descriptive error if a JSON file in `cases/` violates the defined Zod schema.
Estimated size: S
Risk / notes: Addresses ADR-001 data integrity concerns.
```

---

## Coverage Matrix

### Stories × Tasks
- **US-001** (Authenticate CMS): TASK-004
- **US-002** (Manage Case Metadata): TASK-003, TASK-004
- **US-003** (Manage Timeline Events): TASK-003, TASK-004
- **US-004** (Commit Content): TASK-004
- **US-005** (View Case Timeline): TASK-001, TASK-005, TASK-006, TASK-008, TASK-010
- **US-006** (Filter Timeline Events): TASK-007, TASK-009
- **US-007** (Automated CI/CD Deployment): TASK-002

### Components × Tasks
- **Visual CMS (Sveltia)**: TASK-004
- **Git Storage Backend**: TASK-003
- **SSG Builder (Astro)**: TASK-001, TASK-003, TASK-005, TASK-006, TASK-008, TASK-010
- **Client-Side Timeline Filter**: TASK-007, TASK-009
- **CI/CD Pipeline**: TASK-002

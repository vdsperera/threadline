# Requirements Document — Threadline

## Issues List

ID: REQ-001
Type: Gap
Location: "Visual CMS Integration — Sveltia CMS configured to allow visual editing of case data."
Problem: The specific data schema and fields available for visual editing are not explicitly stated in the requirements.
Question: What are the exact fields required for a case, and which ones are mandatory vs. optional?
Suggested fix: Specify that the visual CMS must support editing the strict JSON Case Schema (id, title, location, years, statusBadge, dek, cardBlurb, source, persons, and events).

ID: REQ-002
Type: Ambiguity
Location: "interactive timeline filtering (zero-JS overhead)"
Problem: True "zero-JS" filtering is often impossible without page reloads, contradicting "interactive".
Question: Does this mean absolutely no JS, or just no JS frameworks?
Suggested fix: Clarify that a minimal, vanilla JavaScript snippet will be used for client-side interactive filtering, avoiding heavy framework overhead.

ID: REQ-003
Type: Missing constraint
Location: "Automated pipeline to publish changes made in the CMS to GitHub Pages."
Problem: The trigger condition for this pipeline is not stated.
Question: Should the pipeline trigger on every commit to `main`, or on a specific release/tag?
Suggested fix: The pipeline must trigger automatically upon any commit to the `main` branch containing changes to the `cases/*.json` files.

---

## Refined Requirements

### 1. User Roles & Access
1. **Content Creator / Admin:** [REFINED] Can authenticate into the Sveltia CMS using a GitHub Personal Access Token to create, update, and delete case timelines.
2. **Reader:** [REFINED] Anonymous users who can view the published, read-only static HTML pages for each case.

### 2. Content Management (CMS)
1. **CMS Configuration:** [REFINED] The system must integrate Sveltia CMS as a static `/admin/` route.
2. **Data Schema Support:** [REFINED] The CMS must be configured to visually edit the exact Threadline JSON schema, including:
   - Case Metadata: `id`, `title`, `location`, `years`, `dek`, `cardBlurb`, `source`
   - UI Badges: `statusBadge` (with specific color constraints)
   - Entities: `persons` (name, role, status, statusColor)
   - Timeline: `events` (year, date, category, persons involved, title, summary, detail, quotes)
3. **Commit Workflow:** [REFINED] Changes made in the CMS must be committed directly to the GitHub repository as flat `.json` files in the `cases/` directory.

### 3. Website & Rendering
1. **Static Site Generation:** [REFINED] At build time, Astro must parse all `.json` files in `cases/` and generate individual, pre-rendered HTML pages for each case.
2. **Timeline Interface:** [REFINED] The case page must render events in roughly chronological order.
3. **Interactive Filtering:** [REFINED] Readers must be able to filter timeline events by category (e.g., crime, invest, trial) and by person. This filtering should be handled by a minimal vanilla JavaScript snippet to ensure maximum performance. [NEEDS CLARIFICATION on whether categories are dynamically derived or fixed].
4. **Performance:** [REFINED] The site must score highly on performance metrics by shipping zero JavaScript frameworks to the client.

### 4. Deployment
1. **CI/CD Pipeline:** [REFINED] A GitHub Actions workflow must be configured to automatically build the Astro site and deploy it to GitHub Pages whenever a commit is pushed to the `main` branch.

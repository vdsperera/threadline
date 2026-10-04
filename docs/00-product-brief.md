# Product Brief — Threadline

## Problem
True crime and investigative journalism enthusiasts, writers, and creators often struggle to maintain and visualize complex timelines of investigations, evidence, and people involved. Existing tools are either too generic, require coding skills, or rely on heavy databases that are slow and costly to host.

## Target Users
- Primary: Content creators, investigative writers, and true crime enthusiasts who want to document and publish complex cases without knowing how to code.
- Secondary: Readers who want to explore and filter interactive case timelines to understand how events unfolded.
- Not for: Users looking for a general-purpose blogging platform.

## Value Proposition
For writers and true crime creators who need to document complex investigations, Threadline is a static-site generator and headless CMS combo that provides a sleek visual dashboard for creating interactive case timelines. Unlike heavy database-driven CMSs, it uses a zero-database, Git-backed architecture for maximum performance, security, and zero cost.

## Business Model
- Revenue model: Open-source project (Free to use/host). Potential for a managed hosting tier in the future or premium themes.
- Pricing direction: Free (Git-backed).
- Free vs paid: The core software is free and open-source.

## MVP Scope
### Core hypothesis
Content creators will adopt a Git-backed, zero-database CMS if the writing experience is visual and tailored specifically for case timelines, eliminating the need to understand JSON or Astro.

### In MVP (launch features)
1. Visual CMS Integration — Sveltia CMS configured to allow visual editing of case data.
2. JSON Case Schema — A strict schema for cases, persons, and events.
3. SSG Case Pages — Astro-generated static pages for each case with interactive timeline filtering (zero-JS overhead).
4. GitHub Actions Deployment — Automated pipeline to publish changes made in the CMS to GitHub Pages.

### NOT in MVP (deferred)
1. User accounts/paywalls for readers — Not needed to test the core creation/publishing loop.
2. Complex media management (video hosting) — Text and basic images are enough for now.
3. Comments and community features — Too complex, focus on content first.

### Success metric
Successful publication of a complete case timeline by a non-technical writer using the CMS, and sub-second page load times for the generated case pages.

## Risks & Assumptions
| # | Risk | Assumption | Impact if wrong | Validation approach |
|---|------|-----------|----------------|-------------------|
| 1 | Technical Risk | Writers will find the Git-backed CMS workflow (login with PAT) intuitive enough | Writers get stuck at login | Observe a non-technical user attempting to set up and use the CMS |
| 2 | Technical Risk | Flat JSON files will scale reasonably well for large cases | Build times or file sizes become unmanageable | Test building a case with 1000+ events and 50+ persons |
| 3 | Market Risk | Writers want a dedicated timeline tool rather than just writing a medium article | No adoption from creators | Share the demo with true crime communities |

## Recommendation
Go

The technical foundation (Astro + Sveltia CMS) is well-chosen to solve the problem of hosting costs and performance. The zero-DB architecture is a strong differentiator. Proceed to Requirements Analysis.

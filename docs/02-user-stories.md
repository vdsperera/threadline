# User Stories — Threadline

## US-001: Authenticate to CMS
ID: US-001
Title: Authenticate to Sveltia CMS
Statement: As a Content Creator, I want to authenticate to the `/admin/` route using my GitHub Personal Access Token, so that I can securely access the content management system without needing a separate database-backed account.
Priority: Must have (Required for any content editing)
Assumptions: Sveltia CMS is integrated into the site's static files.
Out of scope: Traditional username/password authentication, social logins.
Acceptance criteria:
- Happy path:
  ```gherkin
  Given an unauthenticated Content Creator on the /admin/ route
  When they enter a valid GitHub Personal Access Token
  Then they are granted access to the CMS dashboard
  ```
- Sad path:
  ```gherkin
  Given an unauthenticated Content Creator on the /admin/ route
  When they enter an invalid or expired GitHub Personal Access Token
  Then they are shown an authentication error
  And they remain on the login screen
  ```

## US-002: Manage Case Metadata
ID: US-002
Title: Edit Case Metadata and Entities
Statement: As a Content Creator, I want to create and edit case metadata (title, location, years, dek, badges) and entities (persons), so that I can accurately structure the high-level details of an investigation.
Priority: Must have (Core data structure for a case)
Assumptions: US-001 is complete and the user is authenticated.
Out of scope: Editing timeline events (covered in US-003).
Acceptance criteria:
- Happy path:
  ```gherkin
  Given an authenticated Content Creator in the CMS dashboard
  When they create a new case or edit an existing one
  And they fill out all required fields matching the JSON schema
  Then the data is successfully staged for saving
  ```
- Edge case:
  ```gherkin
  Given an authenticated Content Creator editing a case
  When they omit a mandatory field (like 'id' or 'title')
  Then the CMS prevents them from saving
  And highlights the missing mandatory fields
  ```

## US-003: Manage Timeline Events
ID: US-003
Title: Add and Edit Timeline Events
Statement: As a Content Creator, I want to add, edit, and reorder events within a case, so that I can build a chronological history of the investigation.
Priority: Must have (Core content of the product)
Assumptions: The case metadata exists (US-002).
Out of scope: Rendering the events on the frontend.
Acceptance criteria:
- Happy path:
  ```gherkin
  Given an authenticated Content Creator editing a case
  When they add an event with a date, category, title, summary, and persons involved
  Then the event is added to the case's event list
  ```
- Sad path:
  ```gherkin
  Given an authenticated Content Creator editing an event
  When they assign an invalid category or unsupported statusColor
  Then the CMS prevents saving
  And prompts the user to select from the predefined options
  ```

## US-004: Commit Content to Repository
ID: US-004
Title: Save Content to GitHub
Statement: As a Content Creator, I want my changes in the CMS to be committed directly to the GitHub repository as flat JSON files, so that the zero-database architecture is maintained.
Priority: Must have (Replaces database operations)
Assumptions: Sveltia CMS is configured to communicate with the GitHub API.
Out of scope: Deploying the site to production (handled by US-007).
Acceptance criteria:
- Happy path:
  ```gherkin
  Given an authenticated Content Creator with staged case changes
  When they click 'Publish' or 'Save'
  Then the CMS creates a commit on the main branch
  And writes the changes to a flat `.json` file in the `cases/` directory
  ```
- Sad path:
  ```gherkin
  Given an authenticated Content Creator attempting to save
  When the GitHub API is unreachable or rate-limited
  Then an error message is displayed
  And the changes remain staged locally in the browser
  ```

## US-005: View Chronological Case Timeline
ID: US-005
Title: View Case Timeline Page
Statement: As a Reader, I want to view a fast-loading, pre-rendered page for a specific case, so that I can read the investigation history in chronological order.
Priority: Must have (Primary consumption format)
Assumptions: The site has been built by Astro from the JSON files.
Out of scope: Interactive filtering (covered in US-006).
Acceptance criteria:
- Happy path:
  ```gherkin
  Given a Reader navigates to a published case URL
  When the page loads
  Then they see the case metadata and all timeline events rendered in chronological order
  ```
- Edge case:
  ```gherkin
  Given a Reader navigates to a published case URL
  When the case has no events defined
  Then the page renders the case metadata
  And displays an empty state message for the timeline
  ```

## US-006: Filter Timeline Events
ID: US-006
Title: Filter Events by Category and Person
Statement: As a Reader, I want to filter timeline events by specific categories and people, so that I can focus on specific aspects of a complex investigation.
Priority: Should have (Enhances readability for large cases)
Assumptions: US-005 is complete. *[NEEDS CLARIFICATION]* We assumed categories are fixed (crime, invest, forensic, trial, outcome) per the prompt schema.
Out of scope: Full-text search, server-side filtering, or heavy JS framework usage.
Acceptance criteria:
- Happy path:
  ```gherkin
  Given a Reader viewing a case timeline with multiple events
  When they select the "trial" category filter
  Then the timeline instantly updates using vanilla JS to only show events categorised as "trial"
  ```
- Edge case:
  ```gherkin
  Given a Reader viewing a case timeline
  When they select a filter combination that yields no matching events
  Then the timeline displays a message indicating no events match the current filters
  ```

## US-007: Automated CI/CD Deployment
ID: US-007
Title: Trigger Static Site Deployment
Statement: As a Content Creator, I want the site to automatically build and deploy whenever I commit changes, so that my published cases are visible to Readers without manual intervention.
Priority: Must have (Required for content delivery)
Assumptions: GitHub Actions and GitHub Pages are enabled on the repository.
Out of scope: Local development previewing.
Acceptance criteria:
- Happy path:
  ```gherkin
  Given a new commit is pushed to the `main` branch containing changes to `cases/*.json`
  When the GitHub Actions workflow runs
  Then Astro builds the static HTML pages
  And deploys them to GitHub Pages successfully
  ```
- Sad path:
  ```gherkin
  Given a new commit with malformed JSON data is pushed
  When the GitHub Actions workflow runs the Astro build
  Then the build fails
  And the existing production site remains unaffected
  ```

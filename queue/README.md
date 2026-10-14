# 📂 Case Queue

Drop upcoming case `.json` files into this directory.

## How it works
1. Add new case JSON files here (e.g., `the-green-river.json`, `01-boston-strangler.json`).
2. An automated GitHub Action (`.github/workflows/publish-cases.yml`) runs every **Monday** and **Wednesday** at **19:00 IST (13:30 UTC)**.
3. On each run, if a case is in this queue:
   - It publishes **1 case** by moving it into `cases/`.
   - It adds the case ID to `cases/manifest.json`.
   - It commits and pushes the changes, automatically triggering a deployment to GitHub Pages.
   - If this queue is empty, the workflow exits cleanly without publishing anything.
4. You can also trigger an immediate manual publish anytime from the **Actions** tab in GitHub by selecting the **Publish Scheduled Cases** workflow and clicking **Run workflow**.

## Ordering
Files are published in natural alphabetical order by filename.
If you want to control the order in which queued cases are published, you can prefix the filenames with numbers:
- `01-first-case.json`
- `02-second-case.json`
- `03-third-case.json`

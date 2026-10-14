# 🧵 Threadline

Threadline is a growing library of interactive case timelines. Each timeline traces how a real investigation actually unfolded, evidence by evidence, allowing users to filter complex histories by category or person.

---

## ✍️ For Content Creators & Writers
You do not need to know how to code to add new cases to Threadline! 

This project includes a built-in visual writing dashboard. 
1. Navigate to `[Your Site URL]/admin/`
2. Click **Sign in with a Personal Access Token**.
3. You will be greeted with a sleek, user-friendly CMS (Content Management System) where you can write cases, add events, and publish them with the click of a button.

*Note: All cases are ultimately saved as raw `.json` files in the `cases/` directory, meaning you can also automate content creation by pushing JSON files directly to the repository.*

---

## ⏱️ Automated Scheduled Publishing (Queue)

Threadline includes an automated publishing pipeline powered by **GitHub Actions**:

1. **Queue Cases:** Drop new case `.json` files into the [`queue/`](file:///c:/Activities/Projects/threadline/queue) folder.
2. **Schedule:** The workflow runs every **Monday** and **Wednesday** at **19:00 IST** (`13:30 UTC`).
3. **Execution:** On each scheduled run:
   - Takes **1 case** from `queue/` (in alphabetical/numbered order).
   - Moves it to `cases/<id>.json`.
   - Adds the case ID to `cases/manifest.json`.
   - Commits and pushes the change, automatically triggering a deployment to GitHub Pages.
   - If `queue/` is empty, it safely does nothing.
4. **Manual Trigger / Dry Run:**
   - From GitHub: Go to **Actions** -> **Publish Scheduled Cases** -> **Run workflow**.
   - Locally: Test anytime with `npm run publish:dry-run`.

> [!IMPORTANT]
> **One-time GitHub Setup**: In your GitHub repository, navigate to **Settings** → **Actions** → **General** → **Workflow permissions**, and ensure **Read and write permissions** is selected so GitHub Actions can commit the published cases back to `main`.

---

## 💻 For Software Engineers
Threadline is built with a highly optimized, zero-database architecture designed for maximum performance, security, and SEO.

### Tech Stack
* **Framework:** [Astro](https://astro.build/) (Static Site Generation)
* **CMS:** [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (Git-backed Headless CMS)
* **Deployment:** GitHub Actions -> GitHub Pages
* **Styling:** Vanilla CSS 

### Architecture Highlights
1. **Zero Database / Git-Backed:** All data is stored as flat `.json` files. Sveltia CMS provides a visual interface for writers, but commits their changes directly to GitHub via API. There is no database to maintain or secure.
2. **SSG (Static Site Generation):** At build time, Astro reads the `cases/*.json` files and generates a hardcoded, highly-optimized `.html` file for every single case. 
3. **Zero-JS by Default:** The site ships zero JavaScript framework overhead to the client. The only JavaScript executed in the browser is a tiny vanilla script used to handle the timeline filtering.
4. **N+1 Fetch Solved:** By moving from a traditional SPA to Astro, we eliminated the need for the client to fetch a `manifest.json` followed by 100+ individual case files.

### Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Start the Astro development server:
   ```bash
   npm run dev
   ```
3. To view the local CMS dashboard, navigate to `http://localhost:4321/admin/`.

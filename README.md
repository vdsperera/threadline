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

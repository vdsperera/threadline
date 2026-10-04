# Threadline

Interactive case-timeline web app. This is the manual-workflow version: cases live as
separate JSON files, and you add new ones by hand (with Claude's help generating the
JSON) instead of through an automated pipeline. Once this feels solid, the same file
structure is what an automated pipeline would write into — nothing here gets thrown away
when you eventually automate it.

## Project structure

```
threadline/
├── index.html            ← the whole app (styling + logic). You shouldn't need to
│                            touch this to add a case — only to change the design.
├── README.md              ← this file
└── cases/
    ├── manifest.json      ← ordered list of case IDs to load
    ├── river-park-1996.json
    └── canine-dna-1996.json
```

`index.html` fetches `cases/manifest.json` on load, then fetches each `cases/<id>.json`
it lists, and renders them. To add a case, you're only ever touching the `cases/` folder.

## How to add a new case (manual, step by step)

1. **Get a transcript.** Copy it from YouTube's transcript panel, or use whatever
   summary/transcript you already have.

2. **Ask Claude to convert it.** Paste the transcript into a chat with this prompt
   (copy it as-is, it's also saved in `CASE_PROMPT.txt` in this folder):

   > Turn the attached transcript into a Threadline case, matching the JSON schema
   > below exactly. Use a lowercase-hyphenated id for the case, e.g. "some-case-name-1997".
   > Only include quotes that are genuinely present in the transcript — don't invent or
   > paraphrase dialogue into a quote. If a date isn't stated precisely, use an
   > approximate label like "late 1990s" rather than inventing a specific date.
   > Return only the JSON, no other text.
   >
   > [paste the schema from CASE_SCHEMA.md here, or just say "same schema as the
   > cases already in my project" if you're continuing an existing conversation]

3. **Save the result.** Take what Claude returns and save it as
   `cases/<the-id-you-used>.json` — the filename (minus `.json`) must match the
   `"id"` field inside the file.

4. **Add it to the manifest.** Open `cases/manifest.json` and add the new id to the
   array, e.g.:
   ```json
   [
     "river-park-1996",
     "canine-dna-1996",
     "your-new-case-id"
   ]
   ```

5. **Bundle the cases.** The app loads a single combined JSON file for performance. Run this in your terminal from the project folder:
   ```
   node build-cases.js
   ```

6. **Test locally (optional but recommended).** Because this uses `fetch()`, opening
   `index.html` directly as a `file://` URL won't work in most browsers — you need a
   tiny local server. From inside the `threadline` folder:
   ```
   python3 -m http.server 8000
   ```
   then open `http://localhost:8000` in your browser.

7. **Commit and push.** If this folder is connected to Vercel, Netlify, or GitHub
   Pages, pushing to your repo redeploys the site automatically with the new case live.

## Deploying (one-time setup)

1. Create a new GitHub repository and push this folder to it.
2. Go to [vercel.com](https://vercel.com) (or [netlify.com](https://netlify.com)) →
   "New Project" → import that repo → deploy. No build command needed — it's a static
   site, just serve the folder as-is.
3. From then on, every `git push` to the connected branch redeploys automatically.

## Case JSON schema

Each file in `cases/` is one object:

```jsonc
{
  "id": "some-case-name-1997",        // must match the filename (without .json)
  "title": "The Some Case",           // display title
  "location": "City, State",
  "years": "1997 – 1999",             // display range, can be approximate
  "statusBadge": { "label": "Exoneration", "color": "var(--teal)" }, // or omit entirely
  "dek": "One or two sentences, shown at the top of the case page.",
  "cardBlurb": "A slightly punchier one-liner shown on the index card. Falls back to dek if omitted.",
  "source": "A short note on where this timeline was built from, and any caveats about approximate dates.",

  "persons": {
    "somekey": {
      "name": "Full Name",
      "role": "One short line — who they are in this case",
      "status": "e.g. 'Convicted, 20 years' or 'Wrongfully convicted'",
      "statusColor": "var(--rust)"   // see allowed colors below
    }
    // one entry per named person, keyed by a short lowercase id you invent
  },

  "events": [
    {
      "year": "1997",                 // groups events under a year-marker in the UI
      "date": "March 1997",           // more specific label shown on the event itself
      "cat": "crime",                 // one of: crime | invest | forensic | trial | outcome
      "persons": ["somekey"],         // array of person keys involved, or [] if none named yet
      "title": "Short event title",
      "summary": "1-2 sentences shown on the collapsed timeline card.",
      "detail": "A paragraph shown when the card is expanded — more context, not repetition.",
      "quote": { "text": "A real quote from the transcript, kept short.", "cite": "Who said it" }
      // or: "quote": null
    }
    // ...one object per event, in roughly chronological order
  ]
}
```

**Allowed colors** (these map to the site's palette and work in both light and dark mode):
`var(--rust)`, `var(--steel)`, `var(--brass)`, `var(--teal)`, `var(--moss)`

**Allowed `cat` values:** `crime`, `invest`, `forensic`, `trial`, `outcome` — these five
are hardcoded into `index.html`'s color legend, so stick to them unless you also edit
the `CATS` object near the top of the `<script>` block.

## A note on accuracy

This app is built around real cases and real people. Before adding a new case:
- Read through what Claude generated and check it against the transcript — especially
  quotes and dates. Don't publish anything you haven't actually verified.
- If a date isn't clearly stated, prefer a vague label ("late 1990s") over inventing
  a specific one.
- Keep quotes short and only include ones that are genuinely in the source material.

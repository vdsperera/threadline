import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const QUEUE_DIR = path.join(ROOT_DIR, 'queue');
const CASES_DIR = path.join(ROOT_DIR, 'cases');
const MANIFEST_PATH = path.join(CASES_DIR, 'manifest.json');

/**
 * Parses CLI arguments
 * Supported:
 *   --count <n>   Number of cases to publish (default: 1)
 *   --dry-run     Simulate publication without writing changes
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let count = 1;
  let isDryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && i + 1 < args.length) {
      const parsed = parseInt(args[i + 1], 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        count = parsed;
      }
      i++;
    } else if (args[i] === '--dry-run') {
      isDryRun = true;
    }
  }

  return { count, isDryRun };
}

/**
 * Appends key=value to $GITHUB_OUTPUT if running in GitHub Actions
 */
async function setGithubOutput(key, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;

  const line = `${key}=${value}\n`;
  await fs.appendFile(outputPath, line, 'utf8');
}

async function main() {
  const { count, isDryRun } = parseArgs();

  console.log(`[publish-case] Starting case publisher...`);
  console.log(`[publish-case] Mode: ${isDryRun ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log(`[publish-case] Target count: ${count}`);

  // Ensure queue directory exists
  try {
    await fs.access(QUEUE_DIR);
  } catch {
    console.log(`[publish-case] Queue directory not found at ${QUEUE_DIR}. Creating it.`);
    if (!isDryRun) {
      await fs.mkdir(QUEUE_DIR, { recursive: true });
    }
    await setGithubOutput('published', 'false');
    console.log(`[publish-case] Queue is empty. Nothing to publish.`);
    return;
  }

  // Read files in queue
  const entries = await fs.readdir(QUEUE_DIR, { withFileTypes: true });
  const queueFiles = entries
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.json'))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  if (queueFiles.length === 0) {
    console.log(`[publish-case] No pending case JSON files in queue (${QUEUE_DIR}).`);
    await setGithubOutput('published', 'false');
    return;
  }

  console.log(`[publish-case] Found ${queueFiles.length} case(s) in queue:`);
  queueFiles.forEach((file, index) => console.log(`  ${index + 1}. ${file}`));

  // Ensure manifest.json exists
  let manifest = [];
  try {
    const rawManifest = await fs.readFile(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(rawManifest);
    if (!Array.isArray(manifest)) {
      throw new TypeError('manifest.json must be an array of case IDs');
    }
  } catch (error) {
    console.warn(`[publish-case] Warning reading manifest.json: ${error.message}. Initializing empty list.`);
    manifest = [];
  }

  const casesToPublish = queueFiles.slice(0, count);
  const publishedCases = [];

  for (const fileName of casesToPublish) {
    const sourcePath = path.join(QUEUE_DIR, fileName);
    const rawContent = await fs.readFile(sourcePath, 'utf8');

    let caseData;
    try {
      caseData = JSON.parse(rawContent);
    } catch (parseError) {
      console.error(`[publish-case] Error parsing JSON file "${fileName}":`, parseError.message);
      continue;
    }

    const caseId = (caseData.id && typeof caseData.id === 'string' && caseData.id.trim())
      ? caseData.id.trim()
      : path.basename(fileName, '.json');

    const caseTitle = caseData.title || caseId;
    const destFileName = `${caseId}.json`;
    const destPath = path.join(CASES_DIR, destFileName);

    console.log(`[publish-case] Publishing: "${caseTitle}" (ID: ${caseId})`);
    console.log(`  From: ${sourcePath}`);
    console.log(`  To:   ${destPath}`);

    if (!isDryRun) {
      // Normalize case id inside the file if missing
      if (!caseData.id) {
        caseData.id = caseId;
      }
      // Write to cases/ destination
      await fs.writeFile(destPath, JSON.stringify(caseData, null, 2) + '\n', 'utf8');

      // Remove from queue
      await fs.unlink(sourcePath);

      // Add to manifest if not already present
      if (!manifest.includes(caseId)) {
        manifest.push(caseId);
      }
    }

    publishedCases.push({ id: caseId, title: caseTitle });
  }

  if (publishedCases.length === 0) {
    console.log(`[publish-case] No cases were successfully published.`);
    await setGithubOutput('published', 'false');
    return;
  }

  if (!isDryRun) {
    // Save updated manifest
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    console.log(`[publish-case] Updated ${MANIFEST_PATH} with ${publishedCases.length} case(s).`);
  }

  const titlesSummary = publishedCases.map(c => c.title).join(', ');
  const idsSummary = publishedCases.map(c => c.id).join(', ');

  console.log(`[publish-case] Successfully published ${publishedCases.length} case(s): ${titlesSummary}`);

  await setGithubOutput('published', 'true');
  await setGithubOutput('case_id', idsSummary);
  await setGithubOutput('case_title', titlesSummary);
}

main().catch(async (error) => {
  console.error('[publish-case] Fatal error during execution:', error);
  await setGithubOutput('published', 'false').catch(() => {});
  process.exit(1);
});

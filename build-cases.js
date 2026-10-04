const fs = require('fs');
const path = require('path');

const casesDir = path.join(__dirname, 'cases');
const manifestPath = path.join(casesDir, 'manifest.json');
const outputPath = path.join(casesDir, 'all-cases.json');

try {
  const manifestRaw = fs.readFileSync(manifestPath, 'utf8');
  const ids = JSON.parse(manifestRaw);

  const allCases = [];
  for (const id of ids) {
    const casePath = path.join(casesDir, `${id}.json`);
    if (fs.existsSync(casePath)) {
      const caseRaw = fs.readFileSync(casePath, 'utf8');
      const caseData = JSON.parse(caseRaw);
      allCases.push(caseData);
    } else {
      console.warn(`Warning: ${casePath} not found.`);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(allCases, null, 2));
  console.log(`Successfully bundled ${allCases.length} cases into all-cases.json`);
} catch (err) {
  console.error('Error building cases:', err);
  process.exit(1);
}

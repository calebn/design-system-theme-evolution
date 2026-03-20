/**
 * build-inventory.ts
 *
 * Main orchestrator for the design system inventory pipeline.
 * Runs all steps in sequence:
 *   1. parse-figma.ts         — raw/ → data/tokens.json, components.json, variant-axes.json
 *   2. map-dtcg.ts            — data/tokens.json → data/dtcg/*.json
 *   3. gap-analysis.ts        — data/tokens.json + commerce-theme → data/gap-analysis.json
 *   4. audit-brand-styles.ts  — raw/figma-brand-styles-extracted.json → data/brand-styles-audit.json
 *                               (optional: only runs if raw/figma-brand-styles-extracted.json exists)
 *   5. generate-docs.ts       — data/*.json → docs/*.md
 *
 * Usage: npm run build  (or npx tsx build-inventory.ts)
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseFigma } from './src/parse-figma.js';
import { mapDtcg } from './src/map-dtcg.js';
import { runGapAnalysis } from './src/gap-analysis.js';
import { runAudit } from './src/audit-brand-styles.js';
import { generateDocs } from './src/generate-docs.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const start = Date.now();
console.log('╔══════════════════════════════════════════════════╗');
console.log('║     Design System Inventory Pipeline             ║');
console.log('╚══════════════════════════════════════════════════╝');

await parseFigma();
await mapDtcg();
await runGapAnalysis();

const brandStylesPath = join(__dirname, 'raw', 'figma-brand-styles-extracted.json');
if (existsSync(brandStylesPath)) {
  runAudit();
} else {
  console.log('\n  (skipping brand-styles audit — raw/figma-brand-styles-extracted.json not found)');
}

await generateDocs();

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n✅ Done in ${elapsed}s — see docs/ for generated markdown`);

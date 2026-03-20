/**
 * build-inventory.ts
 *
 * Main orchestrator for the design system inventory pipeline.
 * Runs all steps in sequence:
 *   1. parse-figma.ts    — raw/ → data/tokens.json, components.json, variant-axes.json
 *   2. map-dtcg.ts       — data/tokens.json → data/dtcg/*.json
 *   3. gap-analysis.ts   — data/tokens.json + commerce-theme → data/gap-analysis.json
 *   4. generate-docs.ts  — data/*.json → docs/*.md
 *
 * Usage: npm run build  (or npx tsx build-inventory.ts)
 */

import { parseFigma } from './src/parse-figma.js';
import { mapDtcg } from './src/map-dtcg.js';
import { runGapAnalysis } from './src/gap-analysis.js';
import { generateDocs } from './src/generate-docs.js';

const start = Date.now();
console.log('╔══════════════════════════════════════════════════╗');
console.log('║     Design System Inventory Pipeline             ║');
console.log('╚══════════════════════════════════════════════════╝');

await parseFigma();
await mapDtcg();
await runGapAnalysis();
await generateDocs();

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n✅ Done in ${elapsed}s — see docs/ for generated markdown`);

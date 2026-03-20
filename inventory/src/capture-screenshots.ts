/**
 * capture-screenshots.ts
 *
 * One-time script to download screenshots of all Figma component frames
 * using the Figma REST API.
 *
 * Usage:
 *   FIGMA_TOKEN=your-token npx tsx src/capture-screenshots.ts
 *
 * The script reads data/components.json, requests image export URLs from the
 * Figma API, and saves each PNG to screenshots/{figmaId-with-hyphens}.png.
 *
 * Requires: FIGMA_TOKEN environment variable (Figma personal access token).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { FigmaComponent } from './types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const FIGMA_FILE_KEY = '8J2B4UtoSMRvkLqBqyoZjB';

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function main() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    console.error('Error: FIGMA_TOKEN environment variable is not set.');
    console.error('Get a personal access token from https://www.figma.com/developers/api#access-tokens');
    process.exit(1);
  }

  const components: FigmaComponent[] = JSON.parse(
    readFileSync(join(ROOT, 'data', 'components.json'), 'utf-8')
  );

  const screenshotsDir = join(ROOT, 'screenshots');
  ensureDir(screenshotsDir);

  // Build comma-separated list of node IDs (API uses hyphens, not colons)
  const nodeIds = components.map((c) => c.figmaId.replace(':', '-')).join(',');

  console.log(`Requesting image export URLs for ${components.length} components...`);

  const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${nodeIds}&format=png&scale=1`;
  const resp = await fetch(url, {
    headers: { 'X-Figma-Token': token },
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error(`Figma API error ${resp.status}: ${text}`);
    process.exit(1);
  }

  const data = (await resp.json()) as { images: Record<string, string | null>; err?: string };

  if (data.err) {
    console.error(`Figma API returned error: ${data.err}`);
    process.exit(1);
  }

  let saved = 0;
  let skipped = 0;

  for (const component of components) {
    const urlKey = component.figmaId.replace(':', '-');
    const imageUrl = data.images[urlKey];

    if (!imageUrl) {
      console.warn(`  No image URL for ${component.name} (${component.figmaId})`);
      skipped++;
      continue;
    }

    const filename = `${urlKey}.png`;
    const outputPath = join(screenshotsDir, filename);

    if (existsSync(outputPath)) {
      console.log(`  ✓ Already exists: ${filename}`);
      saved++;
      continue;
    }

    const imgResp = await fetch(imageUrl);
    if (!imgResp.ok) {
      console.warn(`  Failed to download ${filename}: ${imgResp.status}`);
      skipped++;
      continue;
    }

    const buffer = Buffer.from(await imgResp.arrayBuffer());
    writeFileSync(outputPath, buffer);
    console.log(`  ✓ Saved: ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
    saved++;

    // Polite delay to avoid hitting Figma CDN rate limits
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\nDone: ${saved} saved, ${skipped} skipped`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});

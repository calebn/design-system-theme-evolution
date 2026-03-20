/**
 * gap-analysis.ts
 *
 * Compares Figma tokens (data/tokens.json) against commerce-theme source files.
 * Produces data/gap-analysis.json with matched/figmaOnly/codeOnly entries per category.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { TokenCategory, GapAnalysis, GapEntry } from './types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

const COMMERCE_THEME_PATH =
  '/Users/caleb.nelson/projects/work/CommerceComponents/packages/commerce-theme/src';

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function writeJson(p: string, data: unknown) {
  ensureDir(dirname(p));
  writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  wrote ${p.replace(ROOT, '.')}`);
}

// ---------------------------------------------------------------------------
// Extract code tokens from commerce-theme source files
// ---------------------------------------------------------------------------

interface CodeColor {
  key: string; // e.g. "primary.c300"
  hex: string; // e.g. "#1e6afe"
}

/**
 * Line-by-line parser that correctly includes the parent group name in the key.
 * Handles the nested color structure in colors.ts:
 *   primary: {
 *     c300: { hex: '#1e6afe' },
 *   }
 * → { key: "primary.c300", hex: "#1e6afe" }
 */
function extractCodeColors(): CodeColor[] {
  const src = readFileSync(join(COMMERCE_THEME_PATH, 'colors.ts'), 'utf-8');
  const colors: CodeColor[] = [];
  const lines = src.split('\n');

  let currentGroup = '';
  let currentShade = '';

  for (const line of lines) {
    // Top-level group start: 2-space indent, word key, opening brace, no hex on same line
    // e.g. "  primary: {" but NOT "  pureBlack: { hex: '#000' }"
    const topGroupMatch = line.match(/^  (\w+):\s*\{\s*$/);
    if (topGroupMatch) {
      currentGroup = topGroupMatch[1];
      currentShade = '';
      continue;
    }

    // Shade entry: 4-space indent, shade key (cXXX, base, vivid) with opening brace
    // e.g. "    c300: { hex: '#1e6afe' },"
    const shadeWithHex = line.match(/^\s{4,}(c\d+|base|vivid|c\d+\w*):\s*\{\s*hex:\s*'(#[0-9A-Fa-f]+)'\s*\}/);
    if (shadeWithHex) {
      colors.push({ key: `${currentGroup}.${shadeWithHex[1]}`, hex: shadeWithHex[2] });
      continue;
    }

    // Direct single-value entry: 2-space indent, word key, hex inline
    // e.g. "  pureBlack: { hex: '#000000' },"
    const directHex = line.match(/^  (\w+):\s*\{\s*hex:\s*'(#[0-9A-Fa-f]+)'\s*\}/);
    if (directHex) {
      colors.push({ key: directHex[1], hex: directHex[2] });
      continue;
    }
  }

  return colors;
}

interface CodeSpacing {
  key: string; // e.g. "sp8"
  value: string; // e.g. "8px"
  px: number;
}

function extractCodeSpacing(): CodeSpacing[] {
  const src = readFileSync(join(COMMERCE_THEME_PATH, 'spacing.ts'), 'utf-8');
  const spacings: CodeSpacing[] = [];
  const pattern = /(sp\d+):\s*'(\d+)px'/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(src)) !== null) {
    spacings.push({ key: m[1], value: `${m[2]}px`, px: Number(m[2]) });
  }
  return spacings;
}

interface CodeFontSize {
  key: string;
  value: string;
  px: number;
}

function extractCodeFontSizes(): CodeFontSize[] {
  const src = readFileSync(join(COMMERCE_THEME_PATH, 'fonts.ts'), 'utf-8');
  const sizes: CodeFontSize[] = [];
  const pattern = /(fs\d+):\s*'(\d+)px'/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(src)) !== null) {
    sizes.push({ key: m[1], value: `${m[2]}px`, px: Number(m[2]) });
  }
  return sizes;
}

interface CodeShadow {
  key: string;
  value: string;
}

function extractCodeShadows(): CodeShadow[] {
  const src = readFileSync(join(COMMERCE_THEME_PATH, 'shadows.ts'), 'utf-8');
  const shadows: CodeShadow[] = [];
  const pattern = /(\w+):\s*'([^']+)'/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(src)) !== null) {
    shadows.push({ key: m[1], value: m[2] });
  }
  return shadows;
}

// ---------------------------------------------------------------------------
// Matching helpers
// ---------------------------------------------------------------------------

function normalizeHex(hex: string): string {
  return hex.toLowerCase().replace(/^#/, '');
}

// ---------------------------------------------------------------------------
// Gap analysis per category
// ---------------------------------------------------------------------------

function analyzeColors(figmaTokens: TokenCategory, codeColors: CodeColor[]) {
  // Map hex -> all figma keys sharing that hex (preserves duplicates like Secondary/White + white)
  const figmaKeysByHex = new Map<string, string[]>();
  for (const t of figmaTokens.colors) {
    const h = normalizeHex(t.rawValue);
    if (!figmaKeysByHex.has(h)) figmaKeysByHex.set(h, []);
    figmaKeysByHex.get(h)!.push(t.figmaKey);
  }

  // Map hex -> all code keys sharing that hex
  const codeColorsByHex = new Map<string, string[]>();
  for (const c of codeColors) {
    const h = normalizeHex(c.hex);
    if (!codeColorsByHex.has(h)) codeColorsByHex.set(h, []);
    codeColorsByHex.get(h)!.push(c.key);
  }

  const matched: GapEntry[] = [];
  const figmaOnly: GapEntry[] = [];
  const codeOnly: GapEntry[] = [];
  const matchedHexes = new Set<string>();

  // One matched/figmaOnly entry per figma key so every token shows its own row
  for (const t of figmaTokens.colors) {
    const hex = normalizeHex(t.rawValue);
    if (codeColorsByHex.has(hex)) {
      const codeKeys = codeColorsByHex.get(hex)!;
      matched.push({
        figmaKey: t.figmaKey,
        figmaValue: `#${hex}`,
        codeKey: codeKeys.join(', '),
        codeValue: `#${hex}`,
      });
      matchedHexes.add(hex);
    } else {
      figmaOnly.push({ figmaKey: t.figmaKey, figmaValue: `#${hex}` });
    }
  }

  for (const c of codeColors) {
    const hex = normalizeHex(c.hex);
    if (!matchedHexes.has(hex)) {
      codeOnly.push({ codeKey: c.key, codeValue: `#${hex}` });
      matchedHexes.add(hex); // avoid duplicating code-only entries for same hex
    }
  }

  return { matched, figmaOnly, codeOnly };
}

function analyzeSpacing(figmaTokens: TokenCategory, codeSpacing: CodeSpacing[]) {
  const matched: GapEntry[] = [];
  const figmaOnly: GapEntry[] = [];
  const codeOnly: GapEntry[] = [];

  const matchedCodeKeys = new Set<string>();

  // Each Figma spacing token is independently checked - multiple tokens can match the same code key
  for (const t of figmaTokens.spacing) {
    const px = Number(t.rawValue);
    if (isNaN(px)) continue;
    const codeMatch = codeSpacing.find((s) => s.px === px);
    if (codeMatch) {
      matched.push({
        figmaKey: t.figmaKey,
        figmaValue: `${px}px`,
        codeKey: codeMatch.key,
        codeValue: `${px}px`,
      });
      matchedCodeKeys.add(codeMatch.key);
    } else {
      figmaOnly.push({ figmaKey: t.figmaKey, figmaValue: `${px}px` });
    }
  }

  for (const s of codeSpacing) {
    if (!matchedCodeKeys.has(s.key)) {
      codeOnly.push({ codeKey: s.key, codeValue: s.value });
    }
  }

  return { matched, figmaOnly, codeOnly };
}

function analyzeTypography(figmaTokens: TokenCategory, codeFontSizes: CodeFontSize[]) {
  const figmaFontSizes = new Map<number, string>();

  // Inline sizes from typography composite tokens
  for (const t of figmaTokens.typography) {
    const m = t.rawValue.match(/size:\s*(?:[\w\/]+|(\d+))/);
    if (m && m[1]) {
      figmaFontSizes.set(Number(m[1]), t.figmaKey);
    }
  }
  // Explicit font size dimension tokens (Headings/*, Body/*, UI/*)
  for (const t of figmaTokens.fontSizes) {
    const num = Number(t.rawValue);
    if (!isNaN(num)) figmaFontSizes.set(num, t.figmaKey);
  }

  const codeSizeMap = new Map(codeFontSizes.map((s) => [s.px, s.key]));

  const matched: GapEntry[] = [];
  const figmaOnly: GapEntry[] = [];
  const codeOnly: GapEntry[] = [];

  for (const [px, figmaKey] of figmaFontSizes.entries()) {
    if (codeSizeMap.has(px)) {
      matched.push({ figmaKey, figmaValue: `${px}px`, codeKey: codeSizeMap.get(px), codeValue: `${px}px` });
    } else {
      figmaOnly.push({ figmaKey, figmaValue: `${px}px` });
    }
  }

  for (const [px, codeKey] of codeSizeMap.entries()) {
    if (!figmaFontSizes.has(px)) {
      codeOnly.push({ codeKey, codeValue: `${px}px` });
    }
  }

  return { matched, figmaOnly, codeOnly };
}

function analyzeShadows(figmaTokens: TokenCategory, codeShadows: CodeShadow[]) {
  const matched: GapEntry[] = [];
  const figmaOnly: GapEntry[] = [];
  const codeOnly: GapEntry[] = [];

  const figmaShadowNames = figmaTokens.shadows.map((t) => ({
    figmaKey: t.figmaKey,
    rawValue: t.rawValue,
    dpMatch: t.figmaKey.match(/(\d+)dp/)?.[1],
  }));

  const codeShadowNames = codeShadows.map((s) => ({
    codeKey: s.key,
    value: s.value,
    dpMatch: s.key.match(/dp(\d+)/)?.[1],
  }));

  const figmaMatchedKeys = new Set<string>();
  const codeMatchedKeys = new Set<string>();

  for (const fs of figmaShadowNames) {
    const codeMatch = codeShadowNames.find(
      (cs) => cs.dpMatch && fs.dpMatch && cs.dpMatch === fs.dpMatch
    );
    if (codeMatch) {
      matched.push({
        figmaKey: fs.figmaKey,
        figmaValue: fs.rawValue.slice(0, 60) + '...',
        codeKey: codeMatch.codeKey,
        codeValue: codeMatch.value.slice(0, 60) + '...',
      });
      figmaMatchedKeys.add(fs.figmaKey);
      codeMatchedKeys.add(codeMatch.codeKey);
    }
  }

  for (const fs of figmaShadowNames) {
    if (!figmaMatchedKeys.has(fs.figmaKey)) {
      figmaOnly.push({ figmaKey: fs.figmaKey, figmaValue: fs.rawValue.slice(0, 80) + '...' });
    }
  }

  for (const cs of codeShadowNames) {
    if (!codeMatchedKeys.has(cs.codeKey) && /^dp\d+$/.test(cs.codeKey)) {
      codeOnly.push({ codeKey: cs.codeKey, codeValue: cs.value.slice(0, 60) + '...' });
    }
  }

  return { matched, figmaOnly, codeOnly };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function runGapAnalysis() {
  console.log('\n=== gap-analysis: comparing Figma tokens vs commerce-theme ===');

  const tokens: TokenCategory = JSON.parse(
    readFileSync(join(ROOT, 'data', 'tokens.json'), 'utf-8')
  );

  const codeColors = extractCodeColors();
  const codeSpacing = extractCodeSpacing();
  const codeFontSizes = extractCodeFontSizes();
  const codeShadows = extractCodeShadows();

  console.log(
    `  commerce-theme: ${codeColors.length} colors, ${codeSpacing.length} spacing, ${codeFontSizes.length} font sizes, ${codeShadows.length} shadow values`
  );

  const colorGap = analyzeColors(tokens, codeColors);
  const spacingGap = analyzeSpacing(tokens, codeSpacing);
  const typographyGap = analyzeTypography(tokens, codeFontSizes);
  const shadowGap = analyzeShadows(tokens, codeShadows);

  const gap: GapAnalysis = {
    colors: colorGap,
    spacing: spacingGap,
    typography: typographyGap,
    shadows: shadowGap,
  };

  writeJson(join(ROOT, 'data', 'gap-analysis.json'), gap);

  console.log(`  colors:     ${colorGap.matched.length} matched, ${colorGap.figmaOnly.length} Figma-only, ${colorGap.codeOnly.length} code-only`);
  console.log(`  spacing:    ${spacingGap.matched.length} matched, ${spacingGap.figmaOnly.length} Figma-only, ${spacingGap.codeOnly.length} code-only`);
  console.log(`  typography: ${typographyGap.matched.length} matched, ${typographyGap.figmaOnly.length} Figma-only, ${typographyGap.codeOnly.length} code-only`);
  console.log(`  shadows:    ${shadowGap.matched.length} matched, ${shadowGap.figmaOnly.length} Figma-only, ${shadowGap.codeOnly.length} code-only`);
}

const isMain = process.argv[1]?.endsWith('gap-analysis.ts') || process.argv[1]?.endsWith('gap-analysis.js');
if (isMain) runGapAnalysis().catch((e) => { console.error(e); process.exit(1); });

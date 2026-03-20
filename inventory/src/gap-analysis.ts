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
// Extract code tokens from commerce-theme source files using regex
// (avoids needing to import/execute TypeScript)
// ---------------------------------------------------------------------------

interface CodeColor {
  key: string; // e.g. "primary.c300"
  hex: string; // e.g. "#1e6afe"
}

function extractCodeColors(): CodeColor[] {
  const src = readFileSync(join(COMMERCE_THEME_PATH, 'colors.ts'), 'utf-8');
  const colors: CodeColor[] = [];

  // Match patterns like: c300: { hex: '#1e6afe' },
  // Also handle pureBlack: { hex: '#000000' }
  const groupPattern = /(\w+):\s*\{([^}]+)\}/g;
  let groupMatch: RegExpExecArray | null;

  while ((groupMatch = groupPattern.exec(src)) !== null) {
    const groupName = groupMatch[1];
    const groupBody = groupMatch[2];

    // Check if it's a shade group (has cXXX: { hex: ... } entries)
    const shadePattern = /(c\d+|base|vivid):\s*\{\s*hex:\s*'([^']+)'\s*\}/g;
    let shadeMatch: RegExpExecArray | null;
    while ((shadeMatch = shadePattern.exec(groupBody)) !== null) {
      colors.push({ key: `${groupName}.${shadeMatch[1]}`, hex: shadeMatch[2] });
    }

    // Direct hex match (pureBlack, pureWhite)
    const directHex = groupBody.match(/hex:\s*'([^']+)'/);
    if (directHex && !/c\d+|base|vivid/.test(groupBody)) {
      colors.push({ key: groupName, hex: directHex[1] });
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
  // Match dp1: '...', imgSoft: '...' etc
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

// Parse first layer of a Figma Effect shadow to extract color
function figmaShadowColor(raw: string): string | null {
  const m = raw.match(/color:\s*(#[0-9A-Fa-f]+)/);
  return m ? normalizeHex(m[1]) : null;
}

// ---------------------------------------------------------------------------
// Gap analysis per category
// ---------------------------------------------------------------------------

function analyzeColors(figmaTokens: TokenCategory, codeColors: CodeColor[]) {
  const figmaColorMap = new Map(
    figmaTokens.colors.map((t) => [normalizeHex(t.rawValue), t.figmaKey])
  );
  const codeColorMap = new Map(
    codeColors.map((c) => [normalizeHex(c.hex), c.key])
  );

  const matched: GapEntry[] = [];
  const figmaOnly: GapEntry[] = [];
  const codeOnly: GapEntry[] = [];

  for (const [hex, figmaKey] of figmaColorMap.entries()) {
    if (codeColorMap.has(hex)) {
      matched.push({
        figmaKey,
        figmaValue: `#${hex}`,
        codeKey: codeColorMap.get(hex),
        codeValue: `#${hex}`,
      });
    } else {
      figmaOnly.push({ figmaKey, figmaValue: `#${hex}` });
    }
  }

  for (const [hex, codeKey] of codeColorMap.entries()) {
    if (!figmaColorMap.has(hex)) {
      codeOnly.push({ codeKey, codeValue: `#${hex}` });
    }
  }

  return { matched, figmaOnly, codeOnly };
}

function analyzeSpacing(figmaTokens: TokenCategory, codeSpacing: CodeSpacing[]) {
  const figmaSpacingMap = new Map(
    figmaTokens.spacing.map((t) => [Number(t.rawValue), t.figmaKey])
  );
  const codeSpacingMap = new Map(codeSpacing.map((s) => [s.px, s.key]));

  const matched: GapEntry[] = [];
  const figmaOnly: GapEntry[] = [];
  const codeOnly: GapEntry[] = [];

  for (const [px, figmaKey] of figmaSpacingMap.entries()) {
    if (isNaN(px)) continue;
    if (codeSpacingMap.has(px)) {
      matched.push({
        figmaKey,
        figmaValue: `${px}px`,
        codeKey: codeSpacingMap.get(px),
        codeValue: `${px}px`,
      });
    } else {
      figmaOnly.push({ figmaKey, figmaValue: `${px}px` });
    }
  }

  for (const [px, codeKey] of codeSpacingMap.entries()) {
    if (!figmaSpacingMap.has(px)) {
      codeOnly.push({ codeKey, codeValue: `${px}px` });
    }
  }

  return { matched, figmaOnly, codeOnly };
}

function analyzeTypography(figmaTokens: TokenCategory, codeFontSizes: CodeFontSize[]) {
  // Extract font sizes from Figma typography tokens
  const figmaFontSizes = new Map<number, string>();
  for (const t of figmaTokens.typography) {
    const m = t.rawValue.match(/size:\s*(?:[\w\/]+|(\d+))/);
    if (m && m[1]) {
      figmaFontSizes.set(Number(m[1]), t.figmaKey);
    }
    // Also check the raw dimension sizes
  }
  // Also include heading/body dimension keys
  for (const t of figmaTokens.layout) {
    if (/headings|body|ui/i.test(t.figmaKey)) {
      const num = Number(t.rawValue);
      if (!isNaN(num)) figmaFontSizes.set(num, t.figmaKey);
    }
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

  // Match by dp level in the name
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

  for (const cs of codeShadowNames.slice(0, 10)) { // Only include dp shadows, not button shadows
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

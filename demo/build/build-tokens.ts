/**
 * build-tokens.ts
 *
 * Style Dictionary v4 build script.
 * For each brand (logos, verbum):
 *   1. Merges tokens/core/ + tokens/brand/{brand}/ into a single token set
 *   2. Generates:
 *      - generated/{brand}/variables.css   — CSS custom properties scoped to [data-brand="{brand}"]
 *      - generated/{brand}/tokens.ts       — TypeScript constants + type map
 *      - generated/{brand}/tailwind.cjs    — Tailwind color config fragment
 *
 * Usage:
 *   tsx build/build-tokens.ts              # builds from tokens/ (current)
 *   tsx build/build-tokens.ts --version 1.1.0   # builds from tokens-history/1.1.0/
 *   tsx build/build-tokens.ts --all-versions     # builds every version in tokens-history/
 */

import StyleDictionary from 'style-dictionary';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);
const versionFlag = args.indexOf('--version');
const allVersions = args.includes('--all-versions');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadTokenDir(dir: string): Record<string, unknown> {
  if (!existsSync(dir)) return {};
  const merged: Record<string, unknown> = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const raw = JSON.parse(readFileSync(join(dir, file), 'utf-8')) as Record<string, unknown>;
    Object.assign(merged, raw);
  }
  return merged;
}

function shadowValueToString(v: unknown): string {
  if (typeof v !== 'object' || v === null) return String(v);
  const s = v as { offsetX: string; offsetY: string; blur: string; spread: string; color: string };
  return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`;
}

/** Recursively flatten a token tree into a dot-path map, stripping DTCG $ keys */
function flattenTokens(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, { value: unknown; type?: string; description?: string }> {
  const result: Record<string, { value: unknown; type?: string; description?: string }> = {};
  const inheritedType = obj['$type'] as string | undefined;

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof val === 'object' && val !== null && '$value' in val) {
      const token = val as { $value: unknown; $type?: string; $description?: string };
      result[path] = {
        value: token.$value,
        type: token.$type ?? inheritedType,
        description: token.$description,
      };
    } else if (typeof val === 'object' && val !== null) {
      const nested = val as Record<string, unknown>;
      if (!('$value' in nested)) {
        const sub = flattenTokens(
          { $type: (nested['$type'] ?? inheritedType) as string, ...nested },
          path,
        );
        Object.assign(result, sub);
      }
    }
  }
  return result;
}

/** Convert a dot-path token key to a CSS variable name: color.primary-light => --color-primary-light */
function toCssVar(path: string): string {
  return `--${path.replace(/\./g, '-')}`;
}

/** Convert a dot-path token key to a TS constant name: color.primary-light => colorPrimaryLight */
function toCamelConst(path: string): string {
  return path
    .replace(/[.-](.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toLowerCase());
}

// ---------------------------------------------------------------------------
// CSS generator
// ---------------------------------------------------------------------------

function generateCSS(
  brand: string,
  flatTokens: Record<string, { value: unknown; type?: string }>,
  isCore: boolean,
): string {
  const selector = isCore ? ':root' : `[data-brand="${brand}"]`;
  const lines: string[] = [`${selector} {`];

  for (const [path, token] of Object.entries(flatTokens)) {
    const varName = toCssVar(path);
    let cssValue: string;

    if (token.type === 'shadow' && typeof token.value === 'object') {
      cssValue = shadowValueToString(token.value);
    } else {
      cssValue = String(token.value);
    }

    lines.push(`  ${varName}: ${cssValue};`);
  }

  lines.push('}');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// TypeScript generator
// ---------------------------------------------------------------------------

function generateTS(
  brand: string,
  flatTokens: Record<string, { value: unknown; type?: string; description?: string }>,
): string {
  const lines: string[] = [
    `// AUTO-GENERATED — do not edit. Run: npm run build:tokens`,
    `// Brand: ${brand}`,
    ``,
    `export const tokens = {`,
  ];

  for (const [path, token] of Object.entries(flatTokens)) {
    const constName = toCamelConst(path);
    const valueStr =
      typeof token.value === 'object'
        ? JSON.stringify(token.value)
        : JSON.stringify(token.value);
    const comment = token.description ? ` // ${token.description}` : '';
    lines.push(`  ${constName}: ${valueStr} as const,${comment}`);
  }

  lines.push(`} as const;`);
  lines.push(``);
  lines.push(`export type TokenKey = keyof typeof tokens;`);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Tailwind config generator (CJS for Tailwind compatibility)
// ---------------------------------------------------------------------------

function generateTailwind(
  flatTokens: Record<string, { value: unknown; type?: string }>,
): string {
  const colors: Record<string, string> = {};

  for (const [path] of Object.entries(flatTokens)) {
    if (!path.startsWith('color.')) continue;
    const key = path.replace('color.', '');
    const varName = toCssVar(path);
    colors[key] = `var(${varName})`;
  }

  return [
    `// AUTO-GENERATED — do not edit. Run: npm run build:tokens`,
    `// Use this fragment in your Tailwind config: colors: require('./generated/{brand}/tailwind.cjs')`,
    `module.exports = ${JSON.stringify(colors, null, 2)};`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Build a single brand from a token source directory
// ---------------------------------------------------------------------------

async function buildBrand(
  brand: string,
  tokenSourceDir: string,
  outputDir: string,
): Promise<void> {
  const coreDir = join(tokenSourceDir, 'core');
  const brandDir = join(tokenSourceDir, 'brand', brand);

  const coreTokens = loadTokenDir(coreDir);
  const brandTokens = loadTokenDir(brandDir);

  const flatCore = flattenTokens(coreTokens);
  const flatBrand = flattenTokens(brandTokens);
  const flatAll = { ...flatCore, ...flatBrand };

  mkdirSync(outputDir, { recursive: true });

  // CSS: core vars in :root, brand vars scoped to [data-brand]
  const coreCSS = generateCSS(brand, flatCore, true);
  const brandCSS = generateCSS(brand, flatBrand, false);
  writeFileSync(join(outputDir, 'variables.css'), `${coreCSS}\n\n${brandCSS}\n`);

  // TypeScript
  writeFileSync(join(outputDir, 'tokens.ts'), generateTS(brand, flatAll));

  // Tailwind config
  writeFileSync(join(outputDir, 'tailwind.cjs'), generateTailwind(flatBrand));

  console.log(`✓ ${brand} → ${outputDir}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  const brands = ['logos', 'verbum'];

  if (allVersions) {
    const historyDir = join(ROOT, 'tokens-history');
    const versions = readdirSync(historyDir).filter((v) =>
      existsSync(join(historyDir, v, 'core')),
    );
    for (const version of versions) {
      console.log(`\n── Building version ${version} ──`);
      for (const brand of brands) {
        await buildBrand(brand, join(historyDir, version), join(ROOT, 'public', 'generated', 'versions', version, brand));
        await buildBrand(brand, join(historyDir, version), join(ROOT, 'generated', 'versions', version, brand));
      }
    }
    return;
  }

  if (versionFlag !== -1) {
    const version = args[versionFlag + 1];
    const historyDir = join(ROOT, 'tokens-history', version);
    if (!existsSync(historyDir)) {
      console.error(`Version ${version} not found in tokens-history/`);
      process.exit(1);
    }
    console.log(`\n── Building version ${version} ──`);
    for (const brand of brands) {
      await buildBrand(brand, historyDir, join(ROOT, 'public', 'generated', 'versions', version, brand));
      await buildBrand(brand, historyDir, join(ROOT, 'generated', 'versions', version, brand));
    }
    return;
  }

  // generated/{brand}/ — for CLI reference and the CSS strings TS file
  // public/generated/versions/{ver}/{brand}/ — for runtime CSS <link> loading
  console.log('\n── Building current tokens ──');
  const currentCssStrings: Record<string, string> = {};
  for (const brand of brands) {
    await buildBrand(brand, join(ROOT, 'tokens'), join(ROOT, 'generated', brand));
    const cssPath = join(ROOT, 'generated', brand, 'variables.css');
    currentCssStrings[brand] = readFileSync(cssPath, 'utf-8');
  }

  console.log('\n── Building all history versions ──');
  const historyDir = join(ROOT, 'tokens-history');
  const versionedCssStrings: Record<string, Record<string, string>> = {};
  if (existsSync(historyDir)) {
    const versions = readdirSync(historyDir).filter((v) =>
      existsSync(join(historyDir, v, 'core')),
    );
    for (const version of versions) {
      versionedCssStrings[version] = {};
      for (const brand of brands) {
        await buildBrand(brand, join(historyDir, version), join(ROOT, 'public', 'generated', 'versions', version, brand));
        await buildBrand(brand, join(historyDir, version), join(ROOT, 'generated', 'versions', version, brand));
        const cssPath = join(ROOT, 'generated', 'versions', version, brand, 'variables.css');
        versionedCssStrings[version][brand] = readFileSync(cssPath, 'utf-8');
      }
    }
  }

  // Write a TS file so App.tsx can import all CSS content as strings.
  // This lets theme switching be a synchronous <style> textContent swap —
  // no network requests, no flash of unstyled content on any switch.
  const versionedCssBlock = [
    `export const versionedCss: Record<string, Record<string, string>> = {`,
    ...Object.entries(versionedCssStrings).map(([version, brandMap], vi, vArr) => {
      const brandLines = Object.entries(brandMap)
        .map(([brand, css], bi, bArr) =>
          `    ${JSON.stringify(brand)}: ${JSON.stringify(css)}${bi < bArr.length - 1 ? ',' : ''}`,
        );
      return `  ${JSON.stringify(version)}: {\n${brandLines.join('\n')}\n  }${vi < vArr.length - 1 ? ',' : ''}`;
    }),
    `};`,
  ].join('\n');

  const cssStringsSrc = [
    `// AUTO-GENERATED — do not edit. Run: npm run build:tokens`,
    ``,
    ...Object.entries(currentCssStrings).map(
      ([brand, css]) =>
        `export const ${brand}VarsCss = ${JSON.stringify(css)};`,
    ),
    ``,
    versionedCssBlock,
    ``,
  ].join('\n');
  writeFileSync(join(ROOT, 'src', 'token-css-strings.ts'), cssStringsSrc);

  console.log('\n✅ Token build complete.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

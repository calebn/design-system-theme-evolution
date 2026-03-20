/**
 * map-dtcg.ts
 *
 * Converts data/tokens.json into W3C Design Tokens Community Group (DTCG) format.
 * Outputs:
 *   data/dtcg/primitives.json  -- Tier 1: raw values
 *   data/dtcg/semantic.json    -- Tier 2: intent-based aliases
 *   data/dtcg/component.json   -- Tier 3: component-scoped tokens
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { TokenCategory, FigmaToken, DtcgToken } from './types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function writeJson(p: string, data: unknown) {
  ensureDir(dirname(p));
  writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  wrote ${p.replace(ROOT, '.')}`);
}

// ---------------------------------------------------------------------------
// Naming helpers
// ---------------------------------------------------------------------------

function toKebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function figmaKeyToTokenName(figmaKey: string): string {
  // "Primary/Logos Blue" -> "primary-logos-blue"
  // "Spacing | Horizontal/MD" -> "spacing-horizontal-md"
  return toKebab(figmaKey.replace(/\s*\|\s*/g, '-').replace(/\//g, '-'));
}

// ---------------------------------------------------------------------------
// Semantic intent mapping
// ---------------------------------------------------------------------------

const COLOR_SEMANTIC_MAP: Array<[RegExp, string]> = [
  [/primary\/logos blue/i, 'color-brand-primary'],
  [/primary\/deep blue/i, 'color-brand-deep'],
  [/primary\/subscription blue/i, 'color-brand-subscription'],
  [/secondary\/white/i, 'color-surface-default'],
  [/secondary\/light blue 3/i, 'color-surface-subtle'],
  [/secondary\/light blue 2/i, 'color-surface-tint'],
  [/secondary\/light blue 1/i, 'color-border-light'],
  [/secondary\/alt blue/i, 'color-brand-secondary'],
  [/secondary\/deep blue 2/i, 'color-brand-deep-secondary'],
  [/secondary\/very deep gray/i, 'color-text-inverse'],
  [/deep colors\/green/i, 'color-feedback-success'],
  [/deep colors\/yellow/i, 'color-feedback-warning'],
  [/deep colors\/red/i, 'color-feedback-danger'],
  [/bright colors\/bright yellow/i, 'color-accent-yellow'],
  [/bright colors\/bright red/i, 'color-accent-red'],
  [/^white$/i, 'color-white'],
];

const SPACING_SEMANTIC_MAP: Array<[RegExp, string]> = [
  [/spacing \| horizontal\/xs/i, 'spacing-h-xs'],
  [/spacing \| horizontal\/sm/i, 'spacing-h-sm'],
  [/spacing \| horizontal\/md/i, 'spacing-h-md'],
  [/spacing \| horizontal\/lg/i, 'spacing-h-lg'],
  [/spacing \| horizontal\/xl/i, 'spacing-h-xl'],
  [/spacing \| horizontal\/xxl/i, 'spacing-h-xxl'],
  [/spacing \| vertical\/xxs/i, 'spacing-v-xxs'],
  [/spacing \| vertical\/xs/i, 'spacing-v-xs'],
  [/spacing \| vertical\/sm/i, 'spacing-v-sm'],
  [/vertical\/small/i, 'spacing-v-small'],
  [/padding\/xs/i, 'padding-xs'],
  [/padding\/sm/i, 'padding-sm'],
  [/padding\/md/i, 'padding-md'],
  [/padding\/lg/i, 'padding-lg'],
  [/padding\/xl/i, 'padding-xl'],
  [/padding\/xxl/i, 'padding-xxl'],
  [/gutter\/default/i, 'gutter-default'],
  [/gutter\/large/i, 'gutter-large'],
];

const COMPONENT_TOKEN_MAP: Array<[RegExp, string]> = [
  [/cta button.*horizontal/i, 'component-button-padding-horizontal'],
  [/cta button.*vertical/i, 'component-button-padding-vertical'],
  [/cta button.*text link/i, 'component-button-text-gap'],
  [/cta - disclaimer/i, 'component-cta-disclaimer-gap'],
  [/accordion padding.*vertical/i, 'component-accordion-padding-vertical'],
  [/text - image/i, 'component-text-image-gap'],
  [/body cta/i, 'component-body-cta-gap'],
  [/headline - note/i, 'component-headline-note-gap'],
  [/kicker - headline/i, 'component-kicker-headline-gap'],
];

// ---------------------------------------------------------------------------
// Parse typography Font(...) string
// ---------------------------------------------------------------------------

interface ParsedFont {
  family: string;
  style: string;
  weight: number;
  lineHeight: number | string;
  letterSpacing: number;
}

function parseFontValue(raw: string): ParsedFont | null {
  const m = raw.match(
    /Font\(family:\s*"([^"]+)",\s*style:\s*([^,]+),\s*size:[^,]+,\s*weight:\s*(\d+),\s*lineHeight:\s*([^,]+),\s*letterSpacing:\s*([^)]+)\)/
  );
  if (!m) return null;
  return {
    family: m[1],
    style: m[2].trim(),
    weight: Number(m[3]),
    lineHeight: isNaN(Number(m[4])) ? m[4].trim() : Number(m[4]),
    letterSpacing: Number(m[5]),
  };
}

// ---------------------------------------------------------------------------
// Build DTCG token objects
// ---------------------------------------------------------------------------

type DtcgTree = Record<string, DtcgToken>;

function buildPrimitives(tokens: TokenCategory): DtcgTree {
  const primitives: DtcgTree = {};

  // Colors
  for (const t of tokens.colors) {
    const name = figmaKeyToTokenName(t.figmaKey);
    primitives[name] = {
      $value: t.rawValue.toLowerCase(),
      $type: 'color',
      $description: `Figma: ${t.figmaKey}`,
      tier: 'primitive',
      figmaKey: t.figmaKey,
    };
  }

  // Spacing / layout dimensions
  for (const t of [...tokens.spacing, ...tokens.layout, ...tokens.strokes]) {
    const name = figmaKeyToTokenName(t.figmaKey);
    const numVal = Number(t.rawValue);
    primitives[name] = {
      $value: isNaN(numVal) ? t.rawValue : `${numVal}px`,
      $type: 'dimension',
      $description: `Figma: ${t.figmaKey}`,
      tier: 'primitive',
      figmaKey: t.figmaKey,
    };
  }

  // Typography: just the font families and sizes as primitives
  for (const t of tokens.typography) {
    const font = parseFontValue(t.rawValue);
    if (!font) continue;
    const name = figmaKeyToTokenName(t.figmaKey);
    primitives[`${name}-family`] = {
      $value: font.family,
      $type: 'fontFamily',
      $description: `Figma: ${t.figmaKey} (family)`,
      tier: 'primitive',
      figmaKey: t.figmaKey,
    };
    primitives[`${name}-weight`] = {
      $value: font.weight,
      $type: 'fontWeight',
      $description: `Figma: ${t.figmaKey} (weight)`,
      tier: 'primitive',
      figmaKey: t.figmaKey,
    };
  }

  // Shadows
  for (const t of tokens.shadows) {
    const name = figmaKeyToTokenName(t.figmaKey);
    primitives[name] = {
      $value: t.rawValue,
      $type: 'shadow',
      $description: `Figma: ${t.figmaKey}`,
      tier: 'primitive',
      figmaKey: t.figmaKey,
    };
  }

  return primitives;
}

function buildSemantic(tokens: TokenCategory, primitives: DtcgTree): DtcgTree {
  const semantic: DtcgTree = {};

  // Color semantic aliases
  for (const t of tokens.colors) {
    const primitiveName = figmaKeyToTokenName(t.figmaKey);
    for (const [pattern, semanticName] of COLOR_SEMANTIC_MAP) {
      if (pattern.test(t.figmaKey)) {
        semantic[semanticName] = {
          $value: `{${primitiveName}}`,
          $type: 'color',
          $description: `Semantic alias for ${t.figmaKey}`,
          tier: 'semantic',
          figmaKey: t.figmaKey,
        };
        break;
      }
    }
  }

  // Spacing semantic aliases
  for (const t of tokens.spacing) {
    const primitiveName = figmaKeyToTokenName(t.figmaKey);
    // Skip in-component spacing -- those go to component tier
    if (/in component/i.test(t.figmaKey)) continue;
    for (const [pattern, semanticName] of SPACING_SEMANTIC_MAP) {
      if (pattern.test(t.figmaKey)) {
        semantic[semanticName] = {
          $value: `{${primitiveName}}`,
          $type: 'dimension',
          $description: `Semantic alias for ${t.figmaKey}`,
          tier: 'semantic',
          figmaKey: t.figmaKey,
        };
        break;
      }
    }
  }

  // Typography composite tokens
  for (const t of tokens.typography) {
    const font = parseFontValue(t.rawValue);
    if (!font) continue;
    const name = figmaKeyToTokenName(t.figmaKey);
    semantic[name] = {
      $value: {
        fontFamily: font.family,
        fontWeight: font.weight,
        lineHeight: font.lineHeight,
        letterSpacing: font.letterSpacing,
      } as unknown as string,
      $type: 'typography',
      $description: `Figma: ${t.figmaKey}`,
      tier: 'semantic',
      figmaKey: t.figmaKey,
    };
  }

  return semantic;
}

function buildComponentTokens(tokens: TokenCategory, primitives: DtcgTree): DtcgTree {
  const component: DtcgTree = {};

  for (const t of tokens.spacing) {
    if (!/in component/i.test(t.figmaKey)) continue;
    const primitiveName = figmaKeyToTokenName(t.figmaKey);
    let componentName = primitiveName;
    for (const [pattern, name] of COMPONENT_TOKEN_MAP) {
      if (pattern.test(t.figmaKey)) {
        componentName = name;
        break;
      }
    }
    component[componentName] = {
      $value: `{${primitiveName}}`,
      $type: 'dimension',
      $description: `Component-scoped: ${t.figmaKey}`,
      tier: 'component',
      figmaKey: t.figmaKey,
    };
  }

  return component;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function mapDtcg() {
  console.log('\n=== map-dtcg: converting to W3C DTCG format ===');

  const tokensPath = join(ROOT, 'data', 'tokens.json');
  const tokens: TokenCategory = JSON.parse(readFileSync(tokensPath, 'utf-8'));

  const primitives = buildPrimitives(tokens);
  const semantic = buildSemantic(tokens, primitives);
  const component = buildComponentTokens(tokens, primitives);

  writeJson(join(ROOT, 'data', 'dtcg', 'primitives.json'), primitives);
  writeJson(join(ROOT, 'data', 'dtcg', 'semantic.json'), semantic);
  writeJson(join(ROOT, 'data', 'dtcg', 'component.json'), component);

  console.log(
    `  ${Object.keys(primitives).length} primitives, ${Object.keys(semantic).length} semantic, ${Object.keys(component).length} component tokens`
  );
}

const isMain = process.argv[1]?.endsWith('map-dtcg.ts') || process.argv[1]?.endsWith('map-dtcg.js');
if (isMain) mapDtcg().catch((e) => { console.error(e); process.exit(1); });

/**
 * parse-figma.ts
 *
 * Parses raw Figma MCP output into structured inventory JSON:
 *   raw/figma-metadata.xml  -> data/components.json, data/variant-axes.json
 *   raw/figma-variables.json -> data/tokens.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type {
  FigmaComponent,
  VariantAxis,
  FigmaToken,
  TokenCategory,
  Section,
  ComponentVariantProperties,
} from './types.js';

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
// Section detection by Figma section name
// ---------------------------------------------------------------------------

function detectSection(sectionName: string): Section {
  const n = sectionName.toLowerCase();
  if (n.includes('input') || n.includes('form') || n.includes('checkbox') ||
      n.includes('radio') || n.includes('toggle') || n.includes('switch') ||
      n.includes('dropdown') || n.includes('slider') || n.includes('search') ||
      n.includes('upload') || n.includes('email capture') || n.includes('selector')) return 'inputs';
  if (n.includes('molecule')) return 'molecules';
  if (n.includes('atom') || n.includes('button') || n.includes('breadcrumb') ||
      n.includes('accordion') || n.includes('stepper') || n.includes('star') ||
      n.includes('review') || n.includes('tab') || n.includes('menu')) return 'atoms';
  return 'other';
}

// ---------------------------------------------------------------------------
// HTML element inference from component name
// ---------------------------------------------------------------------------

const HTML_ELEMENT_MAP: Array<[RegExp, string]> = [
  [/text input|search field|email capture/i, 'input'],
  [/dropdown|select/i, 'select'],
  [/checkbox/i, 'input[type=checkbox]'],
  [/radio/i, 'input[type=radio]'],
  [/switch|toggle/i, 'input[type=checkbox]'],
  [/text area|multiline/i, 'textarea'],
  [/upload/i, 'input[type=file]'],
  [/breadcrumb/i, 'nav'],
  [/menu|navigation|subnav/i, 'nav'],
  [/accordion/i, 'details'],
  [/modal|dialog/i, 'dialog'],
  [/toast|alert/i, 'output'],
  [/slider/i, 'input[type=range]'],
  [/button|cta|stepper|play|star|fab/i, 'button'],
  [/image|product image/i, 'img'],
  [/list/i, 'ul'],
  [/badge|tag|price|sale/i, 'span'],
  [/text section|section headline|hero/i, 'section'],
  [/card|product/i, 'article'],
  [/form/i, 'form'],
  [/reviews/i, 'div'],
];

function inferHtmlElement(name: string): string {
  for (const [pattern, element] of HTML_ELEMENT_MAP) {
    if (pattern.test(name)) return element;
  }
  return 'div';
}

// ---------------------------------------------------------------------------
// Parse variant name string into property map
// e.g. "Type=CTA (Default), Size=Large, Style=Solid" -> { Type: ["CTA (Default)"], Size: ["Large"] }
// ---------------------------------------------------------------------------

function parseVariantName(variantName: string): Record<string, string> {
  const props: Record<string, string> = {};
  // Split on ", " but not inside parentheses
  const parts = variantName.split(/,\s*(?![^(]*\))/);
  for (const part of parts) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const val = part.slice(eqIdx + 1).trim();
    props[key] = val;
  }
  return props;
}

// ---------------------------------------------------------------------------
// Parse XML metadata
// ---------------------------------------------------------------------------

interface RawFrame {
  id: string;
  name: string;
  parentSection: string;
  symbols: Array<{ id: string; name: string }>;
}

function parseXml(xml: string): RawFrame[] {
  const frames: RawFrame[] = [];
  let currentSection = 'atoms';

  // Extract section names
  const sectionPattern = /<section\s+[^>]*name="([^"]+)"/g;
  const sectionMatches = [...xml.matchAll(sectionPattern)];
  const sectionNames = sectionMatches.map((m) => m[1]);

  // Find section boundaries (byte offsets)
  const sectionBoundaries: Array<{ name: string; start: number }> = [];
  let sectionSearch = sectionPattern;
  sectionSearch.lastIndex = 0;
  let m: RegExpExecArray | null;
  const sp2 = /<section\s+[^>]*name="([^"]+)"/g;
  while ((m = sp2.exec(xml)) !== null) {
    sectionBoundaries.push({ name: m[1], start: m.index });
  }

  // Parse each <frame> with its child <symbol> elements
  const framePattern = /<frame\s+id="([^"]+)"\s+name="([^"]+)"[^>]*>([\s\S]*?)<\/frame>/g;
  let fm: RegExpExecArray | null;
  while ((fm = framePattern.exec(xml)) !== null) {
    const id = fm[1];
    const name = fm[2]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    const body = fm[3];
    const frameStart = fm.index;

    // Determine which section this frame belongs to
    let parentSection = 'atoms';
    for (const boundary of sectionBoundaries) {
      if (boundary.start <= frameStart) {
        parentSection = boundary.name;
      }
    }

    // Extract symbols (variants)
    const symbols: Array<{ id: string; name: string }> = [];
    const symbolPattern = /<symbol\s+id="([^"]+)"\s+name="([^"]+)"/g;
    let sm: RegExpExecArray | null;
    while ((sm = symbolPattern.exec(body)) !== null) {
      symbols.push({
        id: sm[1],
        name: sm[2].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
      });
    }

    if (symbols.length > 0) {
      frames.push({ id, name, parentSection, symbols });
    }
  }

  return frames;
}

function framesToComponents(frames: RawFrame[]): FigmaComponent[] {
  return frames.map((frame) => {
    const allProps: Record<string, Set<string>> = {};

    for (const sym of frame.symbols) {
      const parsed = parseVariantName(sym.name);
      for (const [k, v] of Object.entries(parsed)) {
        if (!allProps[k]) allProps[k] = new Set();
        allProps[k].add(v);
      }
    }

    const properties: ComponentVariantProperties = {};
    for (const [k, vSet] of Object.entries(allProps)) {
      properties[k] = [...vSet].sort();
    }

    const hasResponsive = frame.symbols.some(
      (s) => /desktop|tablet|mobile/i.test(s.name)
    );

    const section = detectSection(frame.parentSection);

    return {
      name: frame.name,
      figmaId: frame.id,
      section,
      variantCount: frame.symbols.length,
      properties,
      hasResponsive,
      suggestedHtmlElement: inferHtmlElement(frame.name),
    } satisfies FigmaComponent;
  });
}

function buildVariantAxes(components: FigmaComponent[]): VariantAxis[] {
  const axisMap = new Map<string, { values: Set<string>; components: Set<string> }>();

  for (const comp of components) {
    for (const [axis, values] of Object.entries(comp.properties)) {
      if (!axisMap.has(axis)) {
        axisMap.set(axis, { values: new Set(), components: new Set() });
      }
      const entry = axisMap.get(axis)!;
      for (const v of values) entry.values.add(v);
      entry.components.add(comp.name);
    }
  }

  return [...axisMap.entries()]
    .map(([axis, { values, components }]) => ({
      axis,
      values: [...values].sort(),
      components: [...components].sort(),
    }))
    .sort((a, b) => b.components.length - a.components.length);
}

// ---------------------------------------------------------------------------
// Parse Figma variables
// ---------------------------------------------------------------------------

type RawVars = Record<string, string>;

function classifyToken(key: string, value: string): FigmaToken['type'] {
  if (value.startsWith('#') || (value.startsWith('rgba') ?? value.startsWith('rgb'))) return 'color';
  if (value.startsWith('Font(')) return 'typography';
  if (value.startsWith('Effect(')) return 'shadow';
  const lower = key.toLowerCase();
  if (lower.includes('stroke')) return 'stroke';
  if (lower.includes('column') || lower.includes('viewport') || lower.includes('gutter')) return 'layout';
  if (!isNaN(Number(value))) return 'dimension';
  return 'dimension';
}

function parseGroup(key: string): string {
  const slashIdx = key.indexOf('/');
  if (slashIdx === -1) {
    const pipeIdx = key.indexOf(' | ');
    if (pipeIdx !== -1) return key.slice(0, pipeIdx).trim();
    return 'misc';
  }
  return key.slice(0, slashIdx);
}

function parseName(key: string): string {
  const slashIdx = key.lastIndexOf('/');
  if (slashIdx !== -1) return key.slice(slashIdx + 1).trim();
  return key;
}

function parseVariables(rawVars: RawVars): TokenCategory {
  const tokens: TokenCategory = {
    colors: [],
    typography: [],
    spacing: [],
    shadows: [],
    strokes: [],
    layout: [],
    dimensions: [],
  };

  for (const [key, value] of Object.entries(rawVars)) {
    // Skip pure numeric keys (bare dimension values like "0", "4", "8" etc.)
    if (/^\d+(\.\d+)?$/.test(key)) {
      tokens.dimensions.push({
        figmaKey: key,
        group: 'raw',
        name: key,
        rawValue: value,
        type: 'dimension',
      });
      continue;
    }

    const type = classifyToken(key, value);
    const token: FigmaToken = {
      figmaKey: key,
      group: parseGroup(key),
      name: parseName(key),
      rawValue: value,
      type,
    };

    if (type === 'color') {
      tokens.colors.push(token);
    } else if (type === 'typography') {
      tokens.typography.push(token);
    } else if (type === 'shadow') {
      tokens.shadows.push(token);
    } else if (type === 'stroke') {
      tokens.strokes.push(token);
    } else if (type === 'layout') {
      tokens.layout.push(token);
    } else {
      // dimension - route by group
      const grp = parseGroup(key).toLowerCase();
      if (grp.includes('spacing') || grp.includes('padding') || grp.includes('gutter') ||
          grp.includes('vertical') || grp.includes('horizontal')) {
        tokens.spacing.push({ ...token, type: 'dimension' });
      } else {
        tokens.layout.push(token);
      }
    }
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function parseFigma() {
  console.log('\n=== parse-figma: parsing Figma MCP data ===');

  const xmlPath = join(ROOT, 'raw', 'figma-metadata.xml');
  const varsPath = join(ROOT, 'raw', 'figma-variables.json');

  const xml = readFileSync(xmlPath, 'utf-8');
  const rawVars: RawVars = JSON.parse(readFileSync(varsPath, 'utf-8'));

  // Parse components
  const frames = parseXml(xml);
  console.log(`  parsed ${frames.length} component frames from XML`);

  const components = framesToComponents(frames);
  const variantAxes = buildVariantAxes(components);
  const tokens = parseVariables(rawVars);

  writeJson(join(ROOT, 'data', 'components.json'), components);
  writeJson(join(ROOT, 'data', 'variant-axes.json'), variantAxes);
  writeJson(join(ROOT, 'data', 'tokens.json'), tokens);

  console.log(`  ${components.length} components, ${variantAxes.length} variant axes`);
  console.log(`  tokens: ${tokens.colors.length} colors, ${tokens.typography.length} typography, ${tokens.spacing.length} spacing, ${tokens.shadows.length} shadows`);
}

// Run standalone when called directly
const isMain = process.argv[1]?.endsWith('parse-figma.ts') || process.argv[1]?.endsWith('parse-figma.js');
if (isMain) parseFigma().catch((e) => { console.error(e); process.exit(1); });

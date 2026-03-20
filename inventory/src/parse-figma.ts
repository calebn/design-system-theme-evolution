/**
 * parse-figma.ts
 *
 * Parses raw Figma MCP output into structured inventory JSON:
 *   raw/figma-metadata.xml  -> data/components.json, data/variant-axes.json, data/taxonomy.json
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
  FunctionalCategory,
  Taxonomy,
  TaxonomyCategory,
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
// Functional category assignment (explicit name lookup)
// ---------------------------------------------------------------------------

const FUNCTIONAL_CATEGORY_MAP: Record<string, FunctionalCategory> = {
  // Navigation
  'Breadcrumbs': 'navigation',
  'Simple Menu': 'navigation',
  'Button Menu': 'navigation',
  'Tabbed Selector': 'navigation',
  'Tabbed Selector Button': 'navigation',
  'Subnav Dropdown': 'navigation',
  'Subnav Dropdown Options': 'navigation',
  // Actions
  'Button': 'actions',
  'Text Button—Icon Right': 'actions',
  'Text Button—Icon Left': 'actions',
  'Close Button': 'actions',
  'Floating Action Button': 'actions',
  'Floating Action Button with Text': 'actions',
  'Play Button': 'actions',
  'Category Button': 'actions',
  'CTA Row': 'actions',
  'Stateful Action Button': 'actions',
  'Stepper CTA': 'actions',
  'Stepper Control': 'actions',
  // Feedback
  'Toast Bar': 'feedback',
  'Modal Dialog': 'feedback',
  'Modal Button Group': 'feedback',
  // Content Layout
  'Section Headline': 'content-layout',
  'Section Headline with CTA': 'content-layout',
  'Text Section': 'content-layout',
  'Text Section with Button Group': 'content-layout',
  'Accordion Section': 'content-layout',
  // Product
  'Product Content': 'product',
  'Product Grid Card': 'product',
  'Product Lineup—Single': 'product',
  'Free Trial Card': 'product',
  'Carousel Product': 'product',
  'Multi-CTA List': 'product',
  // Data Display
  'Badges and Tags': 'data-display',
  'Price and Label': 'data-display',
  'Sale Percentage': 'data-display',
  'Reviews': 'data-display',
  'Star': 'data-display',
  'Product Images': 'data-display',
  'Image Ratios': 'data-display',
  'List': 'data-display',
  // Selection / Controls
  'Next-Previous Buttons': 'selection',
  'Next-Previous Selector': 'selection',
  'Increase-Decrease Buttons': 'selection',
  'Expand-Collapse Button': 'selection',
  'Slider Scroll Bar': 'selection',
  'Slider page selector': 'selection',
  'Button group': 'selection',
  'Multi-Select with Text': 'selection',
  'Multi-Selector': 'selection',
  'Toggle Switch (text)': 'selection',
  'Toggle with Text': 'selection',
  'Text Toggle Selector': 'selection',
  'Single Select Box': 'selection',
  // Data Entry
  'Checkbox': 'data-entry',
  'Dropdown': 'data-entry',
  'Email Capture': 'data-entry',
  'Form Dropdown': 'data-entry',
  'Form Dropdown Option': 'data-entry',
  'Radio Button': 'data-entry',
  'Search Field': 'data-entry',
  'Slider': 'data-entry',
  'Switch': 'data-entry',
  'Text Input (name, two fields)': 'data-entry',
  'Text Input (single line)': 'data-entry',
  'Text Input—Date': 'data-entry',
  'Text Input—Multiline': 'data-entry',
  'Text Input—Password': 'data-entry',
  'Upload Image Area': 'data-entry',
  'Basic Form': 'data-entry',
};

function assignFunctionalCategory(name: string): FunctionalCategory {
  return FUNCTIONAL_CATEGORY_MAP[name] ?? 'data-display';
}

// ---------------------------------------------------------------------------
// Proposed code names (PascalCase, no em-dashes, no ambiguous abbreviations)
// ---------------------------------------------------------------------------

const PROPOSED_CODE_NAMES: Record<string, string> = {
  'Button': 'Button',
  'Text Button—Icon Right': 'TextButtonIconRight',
  'Text Button—Icon Left': 'TextButtonIconLeft',
  'Close Button': 'CloseButton',
  'Floating Action Button': 'FloatingActionButton',
  'Floating Action Button with Text': 'FloatingActionButtonLabel',
  'Play Button': 'PlayButton',
  'Category Button': 'CategoryButton',
  'CTA Row': 'CtaRow',
  'Stateful Action Button': 'StatefulButton',
  'Stepper CTA': 'StepperCta',
  'Stepper Control': 'StepperControl',
  'Modal Button Group': 'ModalButtonGroup',
  'Button group': 'ButtonGroup',
  'Breadcrumbs': 'Breadcrumbs',
  'Simple Menu': 'SimpleMenu',
  'Button Menu': 'ButtonMenu',
  'Tabbed Selector': 'TabbedSelector',
  'Tabbed Selector Button': 'TabbedSelectorTab',
  'Subnav Dropdown': 'SubnavDropdown',
  'Subnav Dropdown Options': 'SubnavDropdownOption',
  'Accordion Section': 'Accordion',
  'Next-Previous Buttons': 'PreviousNextButtons',
  'Next-Previous Selector': 'PreviousNextSelector',
  'Increase-Decrease Buttons': 'QuantityButtons',
  'Expand-Collapse Button': 'ExpandCollapseButton',
  'Slider Scroll Bar': 'ScrollBar',
  'Slider page selector': 'PageSelector',
  'Reviews': 'ReviewRating',
  'Star': 'StarIcon',
  'Badges and Tags': 'Badge',
  'Price and Label': 'PriceLabel',
  'Sale Percentage': 'SaleBadge',
  'Image Ratios': 'ImageContainer',
  'Product Images': 'ProductImage',
  'List': 'List',
  'Toast Bar': 'Toast',
  'Modal Dialog': 'Modal',
  'Section Headline': 'SectionHeadline',
  'Section Headline with CTA': 'SectionHeadlineWithCta',
  'Text Section': 'TextSection',
  'Text Section with Button Group': 'TextSectionWithButtons',
  'Product Content': 'ProductContent',
  'Product Grid Card': 'ProductCard',
  'Product Lineup—Single': 'ProductLineup',
  'Free Trial Card': 'FreeTrialCard',
  'Carousel Product': 'ProductCarousel',
  'Multi-CTA List': 'CtaList',
  'Basic Form': 'Form',
  'Text Input (single line)': 'TextInput',
  'Text Input (name, two fields)': 'TextInputGroup',
  'Text Input—Date': 'DateInput',
  'Text Input—Multiline': 'Textarea',
  'Text Input—Password': 'PasswordInput',
  'Dropdown': 'Dropdown',
  'Form Dropdown': 'FormDropdown',
  'Form Dropdown Option': 'DropdownOption',
  'Checkbox': 'Checkbox',
  'Radio Button': 'RadioButton',
  'Switch': 'Switch',
  'Toggle with Text': 'Toggle',
  'Toggle Switch (text)': 'ToggleGroup',
  'Multi-Select with Text': 'MultiSelect',
  'Multi-Selector': 'MultiSelector',
  'Text Toggle Selector': 'TextToggleSelector',
  'Single Select Box': 'SelectBox',
  'Search Field': 'SearchField',
  'Email Capture': 'EmailCaptureField',
  'Upload Image Area': 'FileUpload',
  'Slider': 'Slider',
};

function assignProposedCodeName(name: string): string {
  if (PROPOSED_CODE_NAMES[name]) return PROPOSED_CODE_NAMES[name];
  // Fallback: PascalCase from name, strip em-dashes and special chars
  return name
    .replace(/—/g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');
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
  [/multiline/i, 'textarea'],
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
// ---------------------------------------------------------------------------

function parseVariantName(variantName: string): Record<string, string> {
  const props: Record<string, string> = {};
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

  const sectionBoundaries: Array<{ name: string; start: number }> = [];
  const sp2 = /<section\s+[^>]*name="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = sp2.exec(xml)) !== null) {
    sectionBoundaries.push({ name: m[1], start: m.index });
  }

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

    let parentSection = 'atoms';
    for (const boundary of sectionBoundaries) {
      if (boundary.start <= frameStart) {
        parentSection = boundary.name;
      }
    }

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

    return {
      name: frame.name,
      figmaId: frame.id,
      section: detectSection(frame.parentSection),
      functionalCategory: assignFunctionalCategory(frame.name),
      proposedCodeName: assignProposedCodeName(frame.name),
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
// Build taxonomy.json
// ---------------------------------------------------------------------------

const TAXONOMY_DEFINITIONS: TaxonomyCategory[] = [
  {
    id: 'actions',
    label: 'Actions',
    description: 'Buttons and interactive controls that trigger an operation or navigate.',
    components: [],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    description: 'Components that help users move between pages, sections, or states.',
    components: [],
  },
  {
    id: 'data-entry',
    label: 'Data Entry',
    description: 'Form controls that capture user input.',
    components: [],
  },
  {
    id: 'selection',
    label: 'Selection & Controls',
    description: 'Controls for choosing values, navigating ranges, or toggling options.',
    components: [],
  },
  {
    id: 'data-display',
    label: 'Data Display',
    description: 'Read-only components that present information or status.',
    components: [],
  },
  {
    id: 'feedback',
    label: 'Feedback & Overlays',
    description: 'Components that communicate system state or require user acknowledgment.',
    components: [],
  },
  {
    id: 'content-layout',
    label: 'Content Layout',
    description: 'Structural components that arrange and present content sections.',
    components: [],
  },
  {
    id: 'product',
    label: 'Product',
    description: 'Commerce-specific compositions for displaying and selling products.',
    components: [],
  },
];

const PROPOSED_FOLDER_STRUCTURE = [
  'src/',
  '  actions/',
  '    Button/',
  '    TextButtonIconRight/',
  '    TextButtonIconLeft/',
  '    CloseButton/',
  '    FloatingActionButton/',
  '    FloatingActionButtonLabel/',
  '    PlayButton/',
  '    CategoryButton/',
  '    CtaRow/',
  '    StatefulButton/',
  '    StepperCta/',
  '    StepperControl/',
  '  navigation/',
  '    Breadcrumbs/',
  '    SimpleMenu/',
  '    ButtonMenu/',
  '    TabbedSelector/',
  '    TabbedSelectorTab/',
  '    SubnavDropdown/',
  '    SubnavDropdownOption/',
  '  data-entry/',
  '    TextInput/',
  '    TextInputGroup/',
  '    DateInput/',
  '    Textarea/',
  '    PasswordInput/',
  '    Dropdown/',
  '    FormDropdown/',
  '    DropdownOption/',
  '    Checkbox/',
  '    RadioButton/',
  '    Switch/',
  '    SearchField/',
  '    EmailCaptureField/',
  '    FileUpload/',
  '    Slider/',
  '    Form/',
  '  selection/',
  '    PreviousNextButtons/',
  '    PreviousNextSelector/',
  '    QuantityButtons/',
  '    ExpandCollapseButton/',
  '    ScrollBar/',
  '    PageSelector/',
  '    ButtonGroup/',
  '    MultiSelect/',
  '    MultiSelector/',
  '    ToggleGroup/',
  '    Toggle/',
  '    TextToggleSelector/',
  '    SelectBox/',
  '  data-display/',
  '    Badge/',
  '    PriceLabel/',
  '    SaleBadge/',
  '    ReviewRating/',
  '    StarIcon/',
  '    ProductImage/',
  '    ImageContainer/',
  '    List/',
  '  feedback/',
  '    Toast/',
  '    Modal/',
  '    ModalButtonGroup/',
  '  content-layout/',
  '    SectionHeadline/',
  '    SectionHeadlineWithCta/',
  '    TextSection/',
  '    TextSectionWithButtons/',
  '    Accordion/',
  '  product/',
  '    ProductContent/',
  '    ProductCard/',
  '    ProductLineup/',
  '    FreeTrialCard/',
  '    ProductCarousel/',
  '    CtaList/',
];

function buildTaxonomy(components: FigmaComponent[]): Taxonomy {
  const categories = TAXONOMY_DEFINITIONS.map((def) => ({
    ...def,
    components: components
      .filter((c) => c.functionalCategory === def.id)
      .map((c) => c.name)
      .sort(),
  }));

  return {
    categories,
    proposedFolderStructure: PROPOSED_FOLDER_STRUCTURE,
  };
}

// ---------------------------------------------------------------------------
// Parse Figma variables
// ---------------------------------------------------------------------------

type RawVars = Record<string, string>;

// Keys that are font size references (numeric values used by typography tokens)
const FONT_SIZE_KEY_PREFIXES = ['Headings/', 'Body/', 'UI/'];

function isFontSizeKey(key: string): boolean {
  return FONT_SIZE_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function classifyToken(key: string, value: string): FigmaToken['type'] {
  if (value.startsWith('#') || value.startsWith('rgba') || value.startsWith('rgb')) return 'color';
  if (value.startsWith('Font(')) return 'typography';
  if (value.startsWith('Effect(')) return 'shadow';
  const lower = key.toLowerCase();
  if (lower.includes('stroke')) return 'stroke';
  if (lower.includes('column') || lower.includes('viewport') || lower.includes('gutter')) return 'layout';
  if (!isNaN(Number(value))) {
    if (isFontSizeKey(key)) return 'fontSize';
    return 'dimension';
  }
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
    fontSizes: [],
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
    } else if (type === 'fontSize') {
      tokens.fontSizes.push(token);
    } else if (type === 'layout') {
      tokens.layout.push(token);
    } else {
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

  const frames = parseXml(xml);
  console.log(`  parsed ${frames.length} component frames from XML`);

  const components = framesToComponents(frames);
  const variantAxes = buildVariantAxes(components);
  const tokens = parseVariables(rawVars);
  const taxonomy = buildTaxonomy(components);

  writeJson(join(ROOT, 'data', 'components.json'), components);
  writeJson(join(ROOT, 'data', 'variant-axes.json'), variantAxes);
  writeJson(join(ROOT, 'data', 'tokens.json'), tokens);
  writeJson(join(ROOT, 'data', 'taxonomy.json'), taxonomy);

  const catSummary = taxonomy.categories.map((c) => `${c.label}=${c.components.length}`).join(', ');
  console.log(`  ${components.length} components, ${variantAxes.length} variant axes`);
  console.log(`  taxonomy: ${catSummary}`);
  console.log(`  tokens: ${tokens.colors.length} colors, ${tokens.typography.length} typography, ${tokens.fontSizes.length} font sizes, ${tokens.spacing.length} spacing, ${tokens.shadows.length} shadows`);
}

const isMain = process.argv[1]?.endsWith('parse-figma.ts') || process.argv[1]?.endsWith('parse-figma.js');
if (isMain) parseFigma().catch((e) => { console.error(e); process.exit(1); });

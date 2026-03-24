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
  CodeComponent,
} from './types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

// Figma file key for the primary brand components file.
// Used to construct deep-link URLs to specific component frames.
export const FIGMA_FILE_KEY = '8J2B4UtoSMRvkLqBqyoZjB';

// Build a Figma deep-link URL for a given node ID.
// Node IDs use colons internally (e.g. "1623:3480") but hyphens in URLs.
export function figmaNodeUrl(nodeId: string): string {
  const urlId = nodeId.replace(':', '-');
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/Logos-Brand-Components?node-id=${urlId}`;
}

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
  'Stepper Control': 'data-entry',
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
  'Next-Previous Selector': 'selection',
  'Increase-Decrease Buttons': 'actions',
  'Expand-Collapse Button': 'actions',
  'Next-Previous Buttons': 'actions',
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
// Code component mapping: many Figma frames -> one React component
// ---------------------------------------------------------------------------

const CODE_COMPONENT_MAP: CodeComponent[] = [
  // ── Primitives ──────────────────────────────────────────────────────────────

  {
    name: 'Button',
    directoryName: 'button',
    tier: 'primitive',
    functionalCategory: 'actions',
    description: 'Standard labelled action button covering primary, secondary, tertiary, and stateful variants.',
    htmlElement: 'button',
    figmaSources: [
      'Button',
      'Category Button',
      'Floating Action Button with Text',
      'Stateful Action Button',
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'tertiary' | 'stateful'", figmaAxis: 'Type', default: 'primary', description: 'Visual hierarchy — never use color/appearance words. primary/secondary are implemented; tertiary and stateful are proposed.', proposed: true },
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md', description: 'Size — always a separate prop, never encoded in variant' },
      { name: 'state', type: "'default' | 'hover' | 'active' | 'disabled' | 'loading' | 'success'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'IconButton',
    directoryName: 'icon-button',
    tier: 'primitive',
    functionalCategory: 'actions',
    description: 'Icon-only button with no visible label. Requires an aria-label. Covers close, play, floating action, expand-collapse, increment/decrement, and navigation variants.',
    htmlElement: 'button',
    figmaSources: [
      'Close Button',
      'Play Button',
      'Floating Action Button',
      'Expand-Collapse Button',
      'Increase-Decrease Buttons',
      'Next-Previous Buttons',
    ],
    props: [
      { name: 'variant', type: "'default' | 'floating' | 'close' | 'play' | 'expand-collapse' | 'increment' | 'navigate'", figmaAxis: 'Style', default: 'default', description: 'Distinguishes the Figma source frame within one component. Values are proposed — derived from Figma frame names, not a Figma axis.', proposed: true },
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'hover' | 'active' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'LinkButton',
    directoryName: 'link-button',
    tier: 'primitive',
    functionalCategory: 'actions',
    description: 'Inline anchor link with an optional leading or trailing icon. Always renders as an <a> element and requires an href.',
    htmlElement: 'a',
    figmaSources: [
      'Text Button—Icon Left',
      'Text Button—Icon Right',
    ],
    props: [
      { name: 'href', type: 'string', figmaAxis: '', default: '', description: 'Required. The URL the link points to.' },
      { name: 'variant', type: "'default' | 'arrow-link'", figmaAxis: 'Type', default: 'default', description: 'Distinguishes a plain text link from a directional/arrow-style link. Values are proposed — not derived from a Figma axis.', proposed: true },
      { name: 'iconPosition', type: "'leading' | 'trailing'", figmaAxis: 'Type', default: 'trailing', description: 'Leading = icon left, trailing = icon right' },
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'hover' | 'active' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'Input',
    directoryName: 'input',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Single-line text entry field covering all text, date, password, and search variants.',
    htmlElement: 'input',
    figmaSources: [
      'Text Input (single line)',
      'Text Input—Date',
      'Text Input—Password',
      'Search Field',
    ],
    props: [
      { name: 'type', type: "'text' | 'date' | 'password' | 'search'", figmaAxis: 'Type', default: 'text' },
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'filled' | 'disabled' | 'error' | 'success'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'Textarea',
    directoryName: 'textarea',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Multi-line text entry field.',
    htmlElement: 'textarea',
    figmaSources: ['Text Input—Multiline'],
    props: [
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'filled' | 'disabled' | 'error'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'TextInputGroup',
    directoryName: 'text-input-group',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Two-column name-capture input (first + last).',
    htmlElement: 'div',
    figmaSources: ['Text Input (name, two fields)'],
    props: [
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
    ],
  },

  {
    name: 'Select',
    directoryName: 'select',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Dropdown select control. Covers both inline and form-embedded variants.',
    htmlElement: 'select',
    figmaSources: ['Dropdown', 'Form Dropdown', 'Form Dropdown Option'],
    props: [
      { name: 'variant', type: "'default' | 'form'", figmaAxis: 'Type', default: 'default', description: 'Use form for label+border style in a form context' },
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'open' | 'disabled' | 'error'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'Checkbox',
    directoryName: 'checkbox',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Boolean checkbox input with label.',
    htmlElement: 'input[type=checkbox]',
    figmaSources: ['Checkbox'],
    props: [
      { name: 'state', type: "'default' | 'hover' | 'checked' | 'indeterminate' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'RadioButton',
    directoryName: 'radio-button',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Single radio option — used inside a RadioGroup.',
    htmlElement: 'input[type=radio]',
    figmaSources: ['Radio Button'],
    props: [
      { name: 'state', type: "'default' | 'hover' | 'checked' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'Switch',
    directoryName: 'switch',
    tier: 'primitive',
    functionalCategory: 'selection',
    description: 'On/off switch control, optionally with a text label.',
    htmlElement: 'input[type=checkbox]',
    figmaSources: ['Switch', 'Toggle with Text'],
    props: [
      { name: 'variant', type: "'default' | 'with-label'", figmaAxis: 'Type', default: 'default' },
      { name: 'state', type: "'on' | 'off' | 'disabled'", figmaAxis: 'State', default: 'off' },
    ],
  },

  {
    name: 'Slider',
    directoryName: 'slider',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Range input slider for selecting a numeric value.',
    htmlElement: 'input[type=range]',
    figmaSources: ['Slider'],
    props: [
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'Badge',
    directoryName: 'badge',
    tier: 'primitive',
    functionalCategory: 'data-display',
    description: 'Small label for tags, status indicators, and sale callouts.',
    htmlElement: 'span',
    figmaSources: ['Badges and Tags', 'Sale Percentage'],
    props: [
      { name: 'variant', type: "'default' | 'sale' | 'tag' | 'info' | 'success' | 'warning' | 'error'", figmaAxis: 'Type', default: 'default', description: 'Use semantic variants (success/warning/error) not color words' },
      { name: 'scale', type: "'sm' | 'md'", figmaAxis: 'Size', default: 'md' },
    ],
  },

  {
    name: 'StarRating',
    directoryName: 'star-rating',
    tier: 'primitive',
    functionalCategory: 'data-display',
    description: 'Star icon for ratings, with optional count display.',
    htmlElement: 'div',
    figmaSources: ['Star', 'Reviews'],
    props: [
      { name: 'variant', type: "'star' | 'with-count'", figmaAxis: 'Type', default: 'star' },
      { name: 'scale', type: "'sm' | 'md'", figmaAxis: 'Size', default: 'md' },
    ],
  },

  {
    name: 'PriceLabel',
    directoryName: 'price-label',
    tier: 'primitive',
    functionalCategory: 'data-display',
    description: 'Price display with optional original/sale price.',
    htmlElement: 'span',
    figmaSources: ['Price and Label'],
    props: [
      { name: 'variant', type: "'default' | 'with-sale'", figmaAxis: 'Type', default: 'default' },
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
    ],
  },

  {
    name: 'Breadcrumbs',
    directoryName: 'breadcrumbs',
    tier: 'primitive',
    functionalCategory: 'navigation',
    description: 'Hierarchical page location indicator.',
    htmlElement: 'nav',
    figmaSources: ['Breadcrumbs'],
    props: [
      { name: 'scale', type: "'sm' | 'md'", figmaAxis: 'Size', default: 'md' },
    ],
  },

  {
    name: 'Menu',
    directoryName: 'menu',
    tier: 'primitive',
    functionalCategory: 'navigation',
    description: 'Navigation menu — simple text links or button-style items.',
    htmlElement: 'nav',
    figmaSources: ['Simple Menu', 'Button Menu'],
    props: [
      { name: 'variant', type: "'simple' | 'button'", figmaAxis: 'Type', default: 'simple' },
      { name: 'state', type: "'default' | 'hover' | 'active' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'Tabs',
    directoryName: 'tabs',
    tier: 'primitive',
    functionalCategory: 'navigation',
    description: 'Tab bar for switching between content panels. Covers container and individual tab item.',
    htmlElement: 'div',
    figmaSources: ['Tabbed Selector', 'Tabbed Selector Button'],
    props: [
      { name: 'variant', type: "'container' | 'item'", figmaAxis: 'Type', default: 'container', description: 'container is the full tab bar; item is a single tab' },
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'hover' | 'active' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'SubnavDropdown',
    directoryName: 'subnav-dropdown',
    tier: 'primitive',
    functionalCategory: 'navigation',
    description: 'Sub-navigation dropdown with trigger and option list.',
    htmlElement: 'nav',
    figmaSources: ['Subnav Dropdown', 'Subnav Dropdown Options'],
    props: [
      { name: 'variant', type: "'trigger' | 'option'", figmaAxis: 'Type', default: 'trigger' },
      { name: 'state', type: "'default' | 'hover' | 'open' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'QuantityInput',
    directoryName: 'quantity-input',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Numeric quantity picker with increment and decrement buttons.',
    htmlElement: 'div',
    figmaSources: ['Stepper Control'],
    props: [
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'AddToCart',
    directoryName: 'add-to-cart',
    tier: 'composition',
    functionalCategory: 'actions',
    description: 'Multi-stage add-to-cart widget: CTA button → quantity picker → in-cart confirmation. Deferred — not planned for initial implementation.',
    htmlElement: 'div',
    figmaSources: ['Stepper CTA'],
    props: [
      { name: 'stage', type: "'default' | 'quantity' | 'selected'", figmaAxis: 'Stage', default: 'default' },
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'minimum' | 'maximum' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'Pagination',
    directoryName: 'pagination',
    tier: 'primitive',
    functionalCategory: 'selection',
    description: 'Navigation controls for paging through content.',
    htmlElement: 'nav',
    figmaSources: [
      'Next-Previous Selector',
      'Slider page selector',
      'Slider Scroll Bar',
    ],
    props: [
      { name: 'variant', type: "'buttons' | 'selector' | 'page' | 'scroll'", figmaAxis: 'Type', default: 'buttons' },
      { name: 'scale', type: "'sm' | 'md'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'first-page' | 'last-page' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'Toast',
    directoryName: 'toast',
    tier: 'primitive',
    functionalCategory: 'feedback',
    description: 'Transient status notification.',
    htmlElement: 'output',
    figmaSources: ['Toast Bar'],
    props: [
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", figmaAxis: 'Type', default: 'info', description: 'Always semantic — never color words' },
    ],
  },

  // ── Compositions ─────────────────────────────────────────────────────────────

  {
    name: 'Modal',
    directoryName: 'modal',
    tier: 'composition',
    functionalCategory: 'feedback',
    description: 'Dialog overlay with header, body, and action group. Content areas use BuilderBlocks.',
    htmlElement: 'dialog',
    figmaSources: ['Modal Dialog', 'Modal Button Group'],
    props: [
      { name: 'variant', type: "'default' | 'confirmation' | 'fullscreen'", figmaAxis: 'Type', default: 'default' },
    ],
  },

  {
    name: 'Accordion',
    directoryName: 'accordion',
    tier: 'composition',
    functionalCategory: 'content-layout',
    description: 'Expandable/collapsible section with header and body content.',
    htmlElement: 'details',
    figmaSources: ['Accordion Section'],
    props: [
      { name: 'state', type: "'expanded' | 'collapsed'", figmaAxis: 'State', default: 'collapsed' },
      { name: 'variant', type: "'standalone' | 'section'", figmaAxis: 'Type', default: 'section' },
    ],
  },

  {
    name: 'EmailCapture',
    directoryName: 'email-capture',
    tier: 'composition',
    functionalCategory: 'data-entry',
    description: 'Email address input with inline submit action.',
    htmlElement: 'form',
    figmaSources: ['Email Capture'],
    props: [
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'focus' | 'error' | 'success'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'FileUpload',
    directoryName: 'file-upload',
    tier: 'composition',
    functionalCategory: 'data-entry',
    description: 'Drag-and-drop / click-to-browse file upload area.',
    htmlElement: 'input[type=file]',
    figmaSources: ['Upload Image Area'],
    props: [
      { name: 'state', type: "'default' | 'hover' | 'active' | 'uploaded' | 'error'", figmaAxis: 'State', default: 'default' },
    ],
  },

  {
    name: 'SelectionGroup',
    directoryName: 'selection-group',
    tier: 'composition',
    functionalCategory: 'selection',
    description: 'Group of mutually exclusive or multi-select options (toggles, checkboxes, radio buttons, or text tabs).',
    htmlElement: 'div',
    figmaSources: [
      'Toggle Switch (text)',
      'Multi-Select with Text',
      'Multi-Selector',
      'Text Toggle Selector',
      'Single Select Box',
    ],
    props: [
      { name: 'type', type: "'toggle' | 'checkbox' | 'radio' | 'single-select'", figmaAxis: 'Style', default: 'toggle', description: 'Selection mode — drives the underlying input semantics' },
      { name: 'layout', type: "'horizontal' | 'vertical'", figmaAxis: undefined, default: 'horizontal' },
    ],
  },

  {
    name: 'ButtonGroup',
    directoryName: 'button-group',
    tier: 'composition',
    functionalCategory: 'actions',
    description: 'Horizontal or vertical group of Button components for related actions.',
    htmlElement: 'div',
    figmaSources: ['Button group', 'CTA Row'],
    props: [
      { name: 'layout', type: "'horizontal' | 'vertical'", figmaAxis: undefined, default: 'horizontal' },
      { name: 'align', type: "'start' | 'center' | 'end'", figmaAxis: undefined, default: 'start' },
    ],
  },

  {
    name: 'ProductCard',
    directoryName: 'product-card',
    tier: 'composition',
    functionalCategory: 'product',
    description: 'Grid-format product card with image, title, price, reviews, and actions.',
    htmlElement: 'article',
    figmaSources: ['Product Grid Card'],
    props: [
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
    ],
  },

  {
    name: 'ProductDetail',
    directoryName: 'product-detail',
    tier: 'composition',
    functionalCategory: 'product',
    description: 'Full product detail display with purchase actions.',
    htmlElement: 'article',
    figmaSources: ['Product Content', 'Product Lineup—Single'],
    props: [
      { name: 'variant', type: "'full' | 'lineup'", figmaAxis: 'Type', default: 'full' },
    ],
  },

  {
    name: 'FreeTrialCard',
    directoryName: 'free-trial-card',
    tier: 'composition',
    functionalCategory: 'product',
    description: 'Promotional card for free trial offers.',
    htmlElement: 'article',
    figmaSources: ['Free Trial Card'],
    props: [],
  },

  // ── Builder Blocks ────────────────────────────────────────────────────────────

  {
    name: 'SectionLayout',
    directoryName: 'section-layout',
    tier: 'builder-block',
    functionalCategory: 'content-layout',
    description: 'Page section with headline, body copy, and optional CTA slots. Content authors manage children via BuilderBlocks.',
    htmlElement: 'section',
    figmaSources: [
      'Section Headline',
      'Section Headline with CTA',
      'Text Section',
      'Text Section with Button Group',
    ],
    props: [
      { name: 'variant', type: "'headline-only' | 'headline-cta' | 'text' | 'text-buttons'", figmaAxis: 'Type', default: 'headline-only' },
    ],
  },

  {
    name: 'ProductCarousel',
    directoryName: 'product-carousel',
    tier: 'builder-block',
    functionalCategory: 'product',
    description: 'Horizontally scrollable carousel of ProductCard items backed by API data.',
    htmlElement: 'section',
    figmaSources: ['Carousel Product'],
    props: [
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md' },
    ],
  },

  {
    name: 'CtaList',
    directoryName: 'cta-list',
    tier: 'builder-block',
    functionalCategory: 'product',
    description: 'Vertical list of CTA rows, each linking to a product or resource.',
    htmlElement: 'ul',
    figmaSources: ['Multi-CTA List'],
    props: [],
  },

  {
    name: 'BasicForm',
    directoryName: 'basic-form',
    tier: 'builder-block',
    functionalCategory: 'data-entry',
    description: 'Generic form with field layout managed via BuilderBlocks.',
    htmlElement: 'form',
    figmaSources: ['Basic Form'],
    props: [],
  },
];

function buildCodeComponents(): CodeComponent[] {
  return CODE_COMPONENT_MAP;
}

// ---------------------------------------------------------------------------
// Build taxonomy.json
// ---------------------------------------------------------------------------

const TAXONOMY_DEFINITIONS: TaxonomyCategory[] = [
  { id: 'actions', label: 'Actions', description: 'Buttons and interactive controls that trigger an operation or navigate.', components: [], codeComponents: [] },
  { id: 'navigation', label: 'Navigation', description: 'Components that help users move between pages, sections, or states.', components: [], codeComponents: [] },
  { id: 'data-entry', label: 'Data Entry', description: 'Form controls that capture user input.', components: [], codeComponents: [] },
  { id: 'selection', label: 'Selection & Controls', description: 'Controls for choosing values, navigating ranges, or toggling options.', components: [], codeComponents: [] },
  { id: 'data-display', label: 'Data Display', description: 'Read-only components that present information or status.', components: [], codeComponents: [] },
  { id: 'feedback', label: 'Feedback & Overlays', description: 'Components that communicate system state or require user acknowledgment.', components: [], codeComponents: [] },
  { id: 'content-layout', label: 'Content Layout', description: 'Structural components that arrange and present content sections.', components: [], codeComponents: [] },
  { id: 'product', label: 'Product', description: 'Commerce-specific compositions for displaying and selling products.', components: [], codeComponents: [] },
];

// Kebab-case directory structure matching commerce-components/src/components/ convention
const PROPOSED_FOLDER_STRUCTURE = [
  'packages/commerce-components/src/components/',
  '  # Primitives',
  '  button/',
  '    component.tsx   # React component — no Builder.io imports',
  '    register.tsx    # Builder.io registration only',
  '    component.test.tsx',
  '    index.ts        # barrel re-export',
  '  input/',
  '  textarea/',
  '  text-input-group/',
  '  select/',
  '  checkbox/',
  '  radio-button/',
  '  toggle/',
  '  slider/',
  '  badge/',
  '  star-rating/',
  '  price-label/',
  '  breadcrumbs/',
  '  menu/',
  '  tabs/',
  '  subnav-dropdown/',
  '  stepper/',
  '  pagination/',
  '  toast/',
  '  # Compositions (React-first, Builder.io optional)',
  '  modal/',
  '  accordion/',
  '  email-capture/',
  '  file-upload/',
  '  selection-group/',
  '  button-group/',
  '  product-card/',
  '  product-detail/',
  '  free-trial-card/',
  '  # Builder Blocks (require register.tsx with BuilderBlocks)',
  '  section-layout/',
  '  product-carousel/',
  '  cta-list/',
  '  basic-form/',
];

function buildTaxonomy(components: FigmaComponent[]): Taxonomy {
  const codeComponents = buildCodeComponents();

  // Build a reverse map: figma frame name -> code component name
  const figmaToCode = new Map<string, string>();
  for (const cc of codeComponents) {
    for (const src of cc.figmaSources) {
      figmaToCode.set(src, cc.name);
    }
  }

  const categories = TAXONOMY_DEFINITIONS.map((def) => ({
    ...def,
    components: components
      .filter((c) => c.functionalCategory === def.id)
      .map((c) => c.name)
      .sort(),
    codeComponents: codeComponents
      .filter((cc) => cc.functionalCategory === def.id)
      .map((cc) => cc.name)
      .sort(),
  }));

  return {
    categories,
    codeComponents,
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
  const brandStylesAuditPath = join(ROOT, 'raw', 'figma-brand-styles-extracted.json');
  const hasBrandStyles = existsSync(brandStylesAuditPath);

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
  writeJson(join(ROOT, 'data', 'code-components.json'), taxonomy.codeComponents);

  const catSummary = taxonomy.categories.map((c) => `${c.label}=${c.components.length}`).join(', ');
  console.log(`  ${components.length} Figma frames → ${taxonomy.codeComponents.length} code components`);
  console.log(`  taxonomy: ${catSummary}`);
  console.log(`  tokens: ${tokens.colors.length} colors, ${tokens.typography.length} typography, ${tokens.fontSizes.length} font sizes, ${tokens.spacing.length} spacing, ${tokens.shadows.length} shadows`);
  if (hasBrandStyles) {
    console.log('  Brand Styles extracted file found — run audit-brand-styles for migration report');
  }
}

const isMain = process.argv[1]?.endsWith('parse-figma.ts') || process.argv[1]?.endsWith('parse-figma.js');
if (isMain) parseFigma().catch((e) => { console.error(e); process.exit(1); });

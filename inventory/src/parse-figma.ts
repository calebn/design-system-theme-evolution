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
  'Multi-Select with Text': 'data-entry',
  'Multi-Selector': 'data-entry',
  'Toggle Switch (text)': 'selection',
  'Toggle with Text': 'selection',
  'Text Toggle Selector': 'data-entry',
  'Single Select Box': 'data-entry',
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
  'Floating Action Button with Text': 'FloatingActionButton',
  'Play Button': 'PlayButton',
  'Category Button': 'Chip',
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
  'Slider page selector': 'ScrollBar',
  'Reviews': 'ReviewRating',
  'Star': 'StarIcon',
  'Badges and Tags': 'Badge',
  'Price and Label': 'PriceLabel',
  'Sale Percentage': 'SaleCallout',
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
  'Text Input (name, two fields)': 'Input',
  'Text Input—Date': 'DateInput',
  'Text Input—Multiline': 'Textarea',
  'Text Input—Password': 'PasswordInput',
  'Dropdown': 'Dropdown',
  'Form Dropdown': 'FormDropdown',
  'Form Dropdown Option': 'DropdownOption',
  'Checkbox': 'Checkbox',
  'Radio Button': 'RadioButton',
  'Switch': 'Switch',
  'Toggle with Text': 'Switch',
  'Toggle Switch (text)': 'ToggleGroup',
  'Multi-Select with Text': 'RadioGroup',
  'Text Toggle Selector': 'Switch',
  'Single Select Box': 'Checkbox',
  'Category Button': 'Chip',
  'Product Lineup—Single': 'ProductLineup',
  'Sale Percentage': 'SaleCallout',
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
    description: 'Standard labelled action button covering primary, secondary, and tertiary visual hierarchy.',
    htmlElement: 'button',
    figmaSources: [
      'Button',
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'tertiary'", figmaAxis: 'Type', default: 'primary', description: 'Visual hierarchy — never use color/appearance words.' },
      { name: 'scale', type: "'sm' | 'md' | 'lg'", figmaAxis: 'Size', default: 'md', description: 'Size — always a separate prop, never encoded in variant' },
      { name: 'state', type: "'default' | 'hover' | 'active' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Core labelled button — primary, secondary, tertiary hierarchy. FloatingActionButton and StatefulButton are separate compositions with distinct APIs.',
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
    justification: 'All icon-only buttons; unified by absence of text label (MUI/Radix IconButton convention)',
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
    justification: 'Both are anchor links with inline text + icon; icon position (leading vs trailing) is the only layout axis',
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
    justification: 'All single-line text inputs; HTML type attribute distinguishes text, date, password, and search variants',
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
    justification: 'Single multi-line text input; no grouping needed',
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
    justification: 'All select dropdown elements; Form Dropdown adds label + border for form context',
  },

  {
    name: 'Checkbox',
    directoryName: 'checkbox',
    tier: 'primitive',
    functionalCategory: 'data-entry',
    description: 'Boolean checkbox input with label. Also covers the single-consent / long-text checkbox pattern.',
    htmlElement: 'input[type=checkbox]',
    figmaSources: ['Checkbox', 'Single Select Box'],
    props: [
      { name: 'state', type: "'default' | 'hover' | 'checked' | 'indeterminate' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Both are input[type=checkbox] with label; Single Select Box is a long-text usage pattern of the same element',
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
    justification: 'Single input[type=radio] element; error state belongs to parent RadioGroup',
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
    justification: 'Both are role="switch" controls; Toggle with Text is the same switch plus an inline text label',
  },

  {
    name: 'ToggleGroup',
    directoryName: 'toggle-group',
    tier: 'primitive',
    functionalCategory: 'selection',
    description: 'Segmented control for mutually exclusive selection between 2-3 options. Implement with @radix-ui/react-toggle-group.',
    htmlElement: 'div',
    figmaSources: ['Toggle Switch (text)'],
    props: [
      { name: 'size', type: "'2' | '3'", figmaAxis: 'Size', default: '2' },
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Segmented control for mutually exclusive option selection; Radix ToggleGroup provides ARIA and keyboard nav',
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
    justification: 'Single input[type=range] element with a numeric value display',
  },

  {
    name: 'Badge',
    directoryName: 'badge',
    tier: 'primitive',
    functionalCategory: 'data-display',
    description: 'Small inline label for tags, status indicators, and countdown timers.',
    htmlElement: 'span',
    figmaSources: ['Badges and Tags'],
    props: [
      { name: 'variant', type: "'default' | 'sale' | 'tag' | 'info' | 'success' | 'warning' | 'error'", figmaAxis: 'Type', default: 'default', description: 'Use semantic variants (success/warning/error) not color words' },
      { name: 'scale', type: "'sm' | 'md'", figmaAxis: 'Size', default: 'md' },
    ],
    justification: 'Inline promotional pills and countdown timers share the same compact inline display pattern',
  },

  {
    name: 'SaleCallout',
    directoryName: 'sale-callout',
    tier: 'primitive',
    functionalCategory: 'data-display',
    description: 'Large promotional display text showing a percentage discount headline (e.g. "Save up to 75%").',
    htmlElement: 'div',
    figmaSources: ['Sale Percentage'],
    props: [
      { name: 'scale', type: "'sm' | 'md' | 'lg' | 'xl'", figmaAxis: 'Size', default: 'md' },
    ],
    justification: 'Large display-heading promotional text; visually and structurally distinct from small inline Badge elements',
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
    justification: 'Star is the atomic icon unit; Reviews is the full rating row — one component renders both',
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
    justification: 'Single price display element; sale/value/subscription are all formatting variants of the same data',
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
    justification: 'Single breadcrumb navigation trail',
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
    justification: 'Both are dropdown menu triggers; simple = text links, button = pill-shaped — same interaction, different visual treatment',
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
    justification: 'Container and individual tab item are inseparable parts of one Radix Tabs primitive',
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
    justification: 'Trigger and options list are parts of one dropdown navigation; both required for the full interaction',
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
    justification: 'Single +/- quantity picker control; split from AddToCart which is a higher-level composition',
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
    justification: 'Multi-stage add-to-cart flow (CTA → quantity picker → in-cart confirmation); deferred pending design finalization',
  },

  {
    name: 'Pagination',
    directoryName: 'pagination',
    tier: 'primitive',
    functionalCategory: 'selection',
    description: 'Numbered or dot-style page selector with previous/next buttons.',
    htmlElement: 'nav',
    figmaSources: ['Next-Previous Selector'],
    props: [
      { name: 'variant', type: "'numbered' | 'solid'", figmaAxis: 'Style', default: 'numbered' },
      { name: 'scale', type: "'sm' | 'md'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'first-page' | 'last-page' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Single numbered/dot page selector with prev/next controls; distinct from ScrollBar which is a raw scroll position indicator',
  },

  {
    name: 'ScrollBar',
    directoryName: 'scroll-bar',
    tier: 'primitive',
    functionalCategory: 'selection',
    description: 'Horizontal scroll position indicator for carousels and media sliders. Shows current scroll offset as a dark line on a light track.',
    htmlElement: 'div',
    figmaSources: ['Slider Scroll Bar'],
    props: [
      { name: 'scale', type: "'sm' | 'md'", figmaAxis: 'Size', default: 'md' },
    ],
    justification: 'Single scroll position indicator; Slider page selector is a layout composition of ScrollBar + Pagination and is unmapped',
  },

  {
    name: 'Toast',
    directoryName: 'toast',
    tier: 'primitive',
    functionalCategory: 'feedback',
    description: 'Transient status notification bar. Implement with @radix-ui/react-toast; role="status" for info/success, role="alert" for warning/error.',
    htmlElement: 'div',
    figmaSources: ['Toast Bar'],
    props: [
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", figmaAxis: 'Type', default: 'info', description: 'Always semantic — never color words' },
    ],
    justification: 'Single notification bar; dynamic ARIA role per severity (Radix Toast)',
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
    justification: 'Dialog content and footer button row are inseparable parts of one dialog element (Radix Dialog)',
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
    justification: 'Single expandable section with title trigger and body content (Radix Accordion)',
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
    justification: 'Single inline email form with embedded submit action; input and button are too coupled to split',
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
    justification: 'Single drag-and-drop / click-to-browse file upload zone',
  },

  {
    name: 'RadioGroup',
    directoryName: 'radio-group',
    tier: 'composition',
    functionalCategory: 'data-entry',
    description: 'Group of mutually exclusive radio options with field label and error state. Implement with @radix-ui/react-radio-group.',
    htmlElement: 'fieldset',
    figmaSources: ['Multi-Selector', 'Multi-Select with Text'],
    props: [
      { name: 'variant', type: "'list' | 'inline'", figmaAxis: 'Size', default: 'list', description: 'list = vertical with field label (Multi-Selector), inline = compact horizontal pills (Multi-Select with Text)' },
      { name: 'state', type: "'default' | 'error'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Both show grouped radio options with fieldset wrapper; list vs inline are layout variants (Radix RadioGroup)',
  },

  {
    name: 'CheckboxGroup',
    directoryName: 'checkbox-group',
    tier: 'composition',
    functionalCategory: 'data-entry',
    description: 'Group of multi-select checkbox options with field label and error state.',
    htmlElement: 'fieldset',
    figmaSources: ['Multi-Selector', 'Multi-Select with Text'],
    props: [
      { name: 'variant', type: "'list' | 'inline'", figmaAxis: 'Size', default: 'list', description: 'list = vertical with field label, inline = compact horizontal pills' },
      { name: 'state', type: "'default' | 'error'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Both show grouped checkbox options in a fieldset; list vs inline are layout variants of the same control',
  },

  {
    name: 'ButtonGroup',
    directoryName: 'button-group',
    tier: 'composition',
    functionalCategory: 'actions',
    description: 'Horizontal or vertical group of Button components for related actions.',
    htmlElement: 'div',
    figmaSources: ['Button group'],
    props: [
      { name: 'layout', type: "'horizontal' | 'vertical'", figmaAxis: undefined, default: 'horizontal' },
      { name: 'align', type: "'start' | 'center' | 'end'", figmaAxis: undefined, default: 'start' },
    ],
    justification: 'Groups 2-4 side-by-side action buttons; horizontal alignment with optional description text below',
  },

  {
    name: 'CtaRow',
    directoryName: 'cta-row',
    tier: 'composition',
    functionalCategory: 'actions',
    description: 'Full-width navigational link row with text and trailing arrow icon. Used in lists of navigation links.',
    htmlElement: 'a',
    figmaSources: ['CTA Row'],
    props: [
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Full-width link row with arrow icon; structurally a navigational link, not a button group',
  },

  {
    name: 'Chip',
    directoryName: 'chip',
    tier: 'composition',
    functionalCategory: 'actions',
    description: 'Filter chip wrapping Button with constrained API: pill shape, icon + text label, selected/unselected states.',
    htmlElement: 'button',
    figmaSources: ['Category Button'],
    props: [
      { name: 'selected', type: 'boolean', figmaAxis: 'State', default: 'false' },
      { name: 'state', type: "'default' | 'hover' | 'active' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Filter-chip pattern on top of Button; Category Button uses pill shape and icon+label API not shared by general Button (MUI Chip convention)',
  },

  {
    name: 'FloatingActionButton',
    directoryName: 'floating-action-button',
    tier: 'composition',
    functionalCategory: 'actions',
    description: 'Rounded pill button with text label and plus icon. Wraps Button with a constrained pill-shape API.',
    htmlElement: 'button',
    figmaSources: ['Floating Action Button with Text'],
    props: [
      { name: 'scale', type: "'sm' | 'md'", figmaAxis: 'Size', default: 'md' },
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'active' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Pill-shaped variant of Button with mandatory icon; distinct visual treatment not shared with rectangular Button',
  },

  {
    name: 'StatefulButton',
    directoryName: 'stateful-button',
    tier: 'composition',
    functionalCategory: 'actions',
    description: 'Button with built-in loading and success transition states (CTA → loading spinner → success checkmark). Wraps Button with async state management.',
    htmlElement: 'button',
    figmaSources: ['Stateful Action Button'],
    props: [
      { name: 'state', type: "'default' | 'hover' | 'focus' | 'loading' | 'success' | 'disabled'", figmaAxis: 'State', default: 'default' },
    ],
    justification: 'Loading and success state transitions require internal state management not present in base Button',
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
    justification: 'Single grid product card — badge, image, title, rating, price, CTA',
  },

  {
    name: 'ProductDetail',
    directoryName: 'product-detail',
    tier: 'composition',
    functionalCategory: 'product',
    description: 'Full product detail display with description, quantity picker, and purchase actions.',
    htmlElement: 'article',
    figmaSources: ['Product Content'],
    props: [
      { name: 'variant', type: "'full' | 'compact'", figmaAxis: 'Type', default: 'full' },
    ],
    justification: 'Single full-detail product view; distinct from card (grid listing) and ProductLineup (hero showcase)',
  },

  {
    name: 'ProductLineup',
    directoryName: 'product-lineup',
    tier: 'composition',
    functionalCategory: 'product',
    description: 'Hero-style product showcase with blue image area, ownership badge, and purchase CTA. Three responsive variants (desktop/tablet/mobile).',
    htmlElement: 'article',
    figmaSources: ['Product Lineup—Single'],
    props: [
      { name: 'size', type: "'desktop' | 'tablet' | 'mobile'", figmaAxis: 'Size', default: 'desktop' },
    ],
    justification: 'Hero product showcase with distinct layout and responsive variants; not a detail view or grid card',
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
    justification: 'Single pricing/trial card with plan name, price, CTA button, and feature checklist',
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
    justification: 'All are full-width section blocks with a headline; variants progressively add CTA link, body copy, and button group',
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
    justification: 'Single horizontally scrolling product card container backed by API data',
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
    justification: 'Single vertical list of CTA link rows with arrow icons',
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
    justification: 'Generic form shell with field layout managed entirely via Builder.io slot content',
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
  '  select/',
  '  checkbox/',
  '  radio-button/',
  '  switch/',
  '  toggle-group/',
  '  slider/',
  '  badge/',
  '  sale-callout/',
  '  star-rating/',
  '  price-label/',
  '  breadcrumbs/',
  '  menu/',
  '  tabs/',
  '  subnav-dropdown/',
  '  quantity-input/',
  '  pagination/',
  '  scroll-bar/',
  '  toast/',
  '  # Compositions (React-first, Builder.io optional)',
  '  floating-action-button/',
  '  stateful-button/',
  '  modal/',
  '  accordion/',
  '  email-capture/',
  '  file-upload/',
  '  radio-group/',
  '  checkbox-group/',
  '  button-group/',
  '  cta-row/',
  '  chip/',
  '  product-card/',
  '  product-detail/',
  '  product-lineup/',
  '  free-trial-card/',
  '  # Builder Blocks (require register.tsx with BuilderBlocks)',
  '  section-layout/',
  '  product-carousel/',
  '  cta-list/',
  '  basic-form/',
];

// ---------------------------------------------------------------------------
// Figma frame visual descriptions (captured from screenshot review)
// Written to data/figma-frame-descriptions.json to avoid re-screenshotting.
// ---------------------------------------------------------------------------

const FIGMA_FRAME_DESCRIPTIONS: Record<string, string> = {
  // Actions — buttons
  'Button': 'Full-width CTA button in primary (solid blue), secondary (outlined), and tertiary (ghost) styles. Shows "Call to action", "External link", and "+ Add" text patterns. 3 sizes, 6 states (default/hover/focus/active/disabled/loading), light and dark backgrounds.',
  'Category Button': 'Pill-shaped button with brand icon + text label (e.g. "Commentaries"). 4 states (default/hover/focus/disabled). Used as a filter chip or category selector.',
  'Floating Action Button with Text': 'Rounded pill button with "Action +" text and plus icon. 2 sizes, 5 states. Light and dark backgrounds.',
  'Stateful Action Button': 'Full-width button with loading spinner and success checkmark states. Shows "Call to action" → loading → "CTA submitted" transition.',
  'Close Button': 'Circular icon-only X button for dismissing overlays. 3 sizes (sm/md/lg), 3 background contexts (light/dark/blue), 4 states. Also shown without fill ring.',
  'Play Button': 'Circular icon-only play triangle button for media. 4 states (default/hover/focus/disabled). Solid fill in dark navy and blue.',
  'Floating Action Button': 'Circular floating icon-only button showing a heart/wishlist icon. 3 sizes, 3 background contexts (light/dark/transparent), 4 states. No text label.',
  'Expand-Collapse Button': 'Circular icon-only chevron button for accordion/collapse toggles. 2 sizes, 3 background contexts, 4 states.',
  'Increase-Decrease Buttons': 'Circular icon-only + and – buttons for quantity adjustment. 2 sizes (sm/md), 4 states. Used inside quantity pickers.',
  'Next-Previous Buttons': 'Circular icon-only < and > navigation buttons. 2 sizes, 4 states. Used in carousels and media players alongside a page counter.',
  'Text Button—Icon Left': 'Inline text link with left-pointing arrow icon. Underlined on hover. Multiple states. Renders as <a>.',
  'Text Button—Icon Right': 'Inline text link with right-pointing arrow icon. Underlined on hover. Multiple states. Renders as <a>.',
  // Inputs — text
  'Text Input (single line)': 'Labeled single-line text input field with placeholder, filled, error, and disabled states. Standard border style.',
  'Text Input—Date': 'Labeled date input field with mm/dd/yyyy placeholder and calendar icon on the right. 6 states.',
  'Text Input—Password': 'Labeled password input field with show/hide eye icon. 6 states.',
  'Text Input—Multiline': 'Multi-line textarea with label, placeholder, and resize handle. 6 states.',
  'Text Input (name, two fields)': 'Two side-by-side text inputs in a horizontal row (First Name + Last Name). 6 states including shared error. Layout pattern for grouped fields.',
  'Search Field': 'Search input with magnifying glass icon and clear X button. Labeled, with placeholder.',
  'Text Input—Password': 'Labeled password input with show/hide toggle icon. 6 states.',
  // Inputs — selection
  'Dropdown': 'Inline dropdown select with chevron icon. Compact style without external label border.',
  'Form Dropdown': 'Full-width dropdown in form context — labeled, with border and chevron. 7 states. 10 visible options in open state.',
  'Form Dropdown Option': 'Individual option row inside an open form dropdown. 5 states (default/hover/focus/selected/disabled).',
  'Checkbox': 'Single checkbox with label text. 5 states (default/hover/checked/indeterminate/disabled). Square check icon.',
  'Radio Button': 'Single radio button with label. 2 states (default/active). Circle indicator.',
  'Switch': 'On/off toggle pill switch. 2 states (on/off). No label in this frame.',
  'Toggle with Text': 'On/off toggle switch with an inline text label beside it. Same pill control as Switch but with "Option" text label. 6 states.',
  'Toggle Switch (text)': 'Segmented pill bar with 2 or 3 mutually exclusive text options. Selected option fills dark navy. 5 states.',
  'Slider': 'Horizontal range slider with draggable thumb, current value display, and dropdown. Shows "How many licenses do you need? 35". 6 states.',
  'Multi-Select with Text': 'Compact inline radio/checkbox chips — rounded buttons with radio circle or checkbox square plus text label. Both radio and checkbox styles. 6 states.',
  'Multi-Selector': 'Vertical list of radio buttons or checkboxes under a "Field Name" label, with error state. Both radio and checkbox styles. Standard form layout.',
  'Text Toggle Selector': 'Vertical list of text items, each with an on/off switch toggle on the right side. Like a settings preferences list.',
  'Single Select Box': 'Large checkbox with a multi-line paragraph of descriptive text (terms/consent pattern). 2 states (default/error).',
  'Upload Image Area': 'Dashed-border drag-and-drop upload zone with upload icon and "Upload image" label. 4 states.',
  'Email Capture': 'Inline email input field with adjacent "Call to action" submit button and consent text below. 6 states.',
  'Basic Form': 'Full form with first name, last name, email inputs, sign up button, and fine print. Multiple responsive layouts (desktop/tablet/mobile) and a success state.',
  // Data display
  'Badges and Tags': 'Small pill/tag labels — "SAVE 30%" sale badges in multiple sizes and colors (navy/red/outlined), plus countdown timers ("ENDS IN 12:23:59:59") in navy/red.',
  'Sale Percentage': 'Large promotional display headline — "Save up to 75%" in 4 display font sizes. Two rows: bold weight (top) and regular weight (bottom).',
  'Star': 'Single star icon used for ratings. 2 sizes (sm/lg), 5 states (default/hover/focus/half-filled/filled/disabled).',
  'Reviews': 'Star rating row with 5 stars (half-star support) and a review count in parentheses. 2 sizes, multiple rating values (0–5 in 0.5 increments).',
  'Price and Label': 'Price display with formatted dollar amount and cents superscript. Multiple styles: default, sale (strikethrough + discount), value (with "Value:" label), subscription (with billing note). 2 sizes.',
  'Product Images': 'Product book cover image in multiple aspect ratios (1.2:1, 1.33:1, 1.5:1, etc.). Placeholder checkerboard shown.',
  'Image Ratios': 'Generic image container in standard ratios (16x9, 1x1, 4x3, etc.). Placeholder checkerboard.',
  'List': 'Bulleted or numbered list element for body content.',
  // Navigation
  'Breadcrumbs': 'Horizontal breadcrumb trail with slash separators (Link 1 / Link 2 / Link 3). 4 states — first item is link, last item is current page.',
  'Simple Menu': 'Vertical dropdown menu with plain text links (Lorem Ipsum). 7+ items, 5 states per item.',
  'Button Menu': 'Dropdown trigger button with "Menu ↓" text. Single pill-shaped trigger with open/closed states. 5 states.',
  'Tabbed Selector': 'Horizontal tab bar with 5 pill-shaped "Tab Option" buttons. One tab is active (filled blue/selected). Multiple states.',
  'Tabbed Selector Button': 'Single tab item from the tab bar. Same pill shape as Tabbed Selector items. 5 states.',
  'Subnav Dropdown': 'Sub-navigation with multiple column dropdown layout — shows nested link groups. Large grid of "Lorem Ipsum" items across multiple columns.',
  'Subnav Dropdown Options': 'Individual option row for the Subnav Dropdown. Plain text link, 5 states.',
  'Next-Previous Selector': 'Numbered/dot pagination: "1/4" with < and > buttons. Also shows pause ❙❙ button variant. 2 styles (numbered/solid), 2 sizes.',
  'Slider page selector': 'Progress bar + slide counter ("1/4") + arrow navigation buttons. Indicates current slide position. 2 sizes.',
  'Slider Scroll Bar': 'Horizontal scroll progress indicator — dark line on light track showing scroll position. 4 variants.',
  // Selection & Controls
  'Stepper Control': 'Quantity +/- picker with minus button, number field, and plus button. 2 sizes, 4 states (default/hover/focus/disabled). Rounded pill shape.',
  'Stepper CTA': 'Multi-stage add-to-cart widget: Stage 1 = "Add to cart" button, Stage 2 = quantity picker (−999+), Stage 3 = "999 ✓ in cart". Minimum stage shows trash icon.',
  // Feedback
  'Toast Bar': 'Horizontal notification bar with status icon (info/success/warning/error), message text "Info toast", "Call to action" button, and X dismiss button. Dark and light themes, 4 severity types.',
  'Modal Dialog': 'Dialog overlay with title, body text, and Cancel/Call-to-Action button row. Sizes for desktop/tablet/mobile. Multi-step variant shows "2 of 3" progress with Back/Next.',
  'Modal Button Group': 'Button footer row for Modal — Cancel + primary CTA, or Back + Cancel + Next pattern. Multiple states.',
  // Content Layout
  'Accordion Section': 'Expandable section with title + chevron trigger and optional image content area. Multiple sizes and states. Collapsed shows only title; expanded shows body + image.',
  'Section Headline': 'Section label + large headline + author/category text. 3 size variants. No CTA.',
  'Section Headline with CTA': 'Section label + headline + inline "Call to action →" link. 3 alignment variants.',
  'Text Section': 'Full-width marketing section with label, headline, description paragraph, and bullet checklist. Multiple responsive sizes.',
  'Text Section with Button Group': 'Text Section plus a horizontal primary + secondary button row at the bottom.',
  // Product
  'Product Grid Card': 'Product listing card: "BEST SELLER" badge, book cover image, truncated title, author, star rating + count, price (with sale), and "Add to cart" button. 3 responsive sizes.',
  'Product Content': 'Full product detail: sale badge, large headline title, author, star rating, description paragraph, price, quantity picker, "Add to cart" button, and "Call to action →" link. 3 responsive sizes.',
  'Product Lineup—Single': 'Hero-style product showcase: blue hero image area (full-width), "YOURS FOREVER" badge, title, author, star rating, price (with value), and "Add to cart" button. 3 responsive variants with distinct layout (image above on mobile).',
  'Free Trial Card': 'Pricing card: plan name + "MOST POPULAR" badge, original price, discounted monthly price, description, "Start 30-day free trial" CTA, feature checklist, and AI feature pills.',
  'Carousel Product': 'Single-card carousel slide: product image, "SAVE 30%" badge, truncated title, author, star rating, price. Used inside a scrollable carousel container.',
  'Multi-CTA List': 'Vertical list of 5 CTA link rows — each row has "Call to action" text with a → arrow icon. Dividers between rows.',
  'CTA Row': 'Single CTA row with "Call to action →" text. Hover shows underline. One of 4 states. Used inside Multi-CTA List.',
  'Button group': 'Two-button group showing a primary CTA + secondary outline button side by side. With optional description text below. Also a stacked full-width variant.',
};

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
  writeJson(join(ROOT, 'data', 'figma-frame-descriptions.json'), FIGMA_FRAME_DESCRIPTIONS);
  console.log(`  wrote ./data/figma-frame-descriptions.json (${Object.keys(FIGMA_FRAME_DESCRIPTIONS).length} frames)`);

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

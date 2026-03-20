/**
 * generate-docs.ts
 *
 * Reads all data/*.json files and produces 7 markdown documents + README.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type {
  FigmaComponent,
  VariantAxis,
  TokenCategory,
  GapAnalysis,
  FigmaToken,
  Section,
} from './types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function writeDoc(p: string, content: string) {
  ensureDir(dirname(p));
  writeFileSync(p, content, 'utf-8');
  console.log(`  wrote ${p.replace(ROOT, '.')}`);
}

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(ROOT, 'data', name), 'utf-8')) as T;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SECTION_LABELS: Record<Section, string> = {
  atoms: 'Atoms',
  molecules: 'Molecules',
  inputs: 'Inputs & Forms',
  other: 'Other',
};

function matchStatus(figmaKey: string, gapColors: GapAnalysis['colors']): string {
  if (gapColors.matched.some((e) => e.figmaKey === figmaKey)) return '✅ Matched';
  if (gapColors.figmaOnly.some((e) => e.figmaKey === figmaKey)) return '⚠️ Figma-only';
  return '—';
}

function colorSwatch(hex: string): string {
  const clean = hex.replace(/^#/, '').toLowerCase();
  return `<span style="display:inline-block;width:14px;height:14px;background:#${clean};border:1px solid #ccc;border-radius:2px;vertical-align:middle;margin-right:4px"></span>`;
}

// Detect inconsistent state names
const KNOWN_STATES = new Set([
  'default', 'hover', 'focus', 'active', 'disabled', 'error',
  'loading', 'success', 'selected', 'filled', 'half-filled',
  'on', 'off', 'expanded', 'collapsed', 'checked', 'unchecked',
]);

function isInconsistentStateName(val: string): boolean {
  return /^state\d+$/i.test(val) || /^variant\d+$/i.test(val) || /^property\s*\d+$/i.test(val);
}

// ---------------------------------------------------------------------------
// Doc 01: Token Map
// ---------------------------------------------------------------------------

function doc01TokenMap(tokens: TokenCategory, gap: GapAnalysis): string {
  const lines: string[] = [
    '# 01 · Design Token Map',
    '',
    '> Generated from Figma Variables (`raw/figma-variables.json`).',
    '> DTCG tiers: **P** = Primitive, **S** = Semantic, **C** = Component.',
    '> Code match: ✅ matched in `commerce-theme` · ⚠️ Figma-only · 🔴 code-only.',
    '',
  ];

  // Colors
  lines.push('## Colors', '');
  lines.push('| Swatch | Figma Name | Hex Value | Group | DTCG Tier | Code Match |');
  lines.push('|--------|------------|-----------|-------|-----------|------------|');
  for (const t of tokens.colors) {
    const swatch = colorSwatch(t.rawValue);
    const matchStr = matchStatus(t.figmaKey, gap.colors);
    // Classify tier
    const isInComponent = /in component/i.test(t.figmaKey);
    const tier = isInComponent ? 'C' : /primary|secondary|deep colors|bright/i.test(t.figmaKey) ? 'P' : 'S';
    lines.push(`| ${swatch} | \`${t.figmaKey}\` | \`${t.rawValue.toLowerCase()}\` | ${t.group} | ${tier} | ${matchStr} |`);
  }

  // Code-only colors
  if (gap.colors.codeOnly.length > 0) {
    lines.push('', '### Colors in `commerce-theme` not in Figma', '');
    lines.push('| Code Key | Hex Value |');
    lines.push('|----------|-----------|');
    for (const e of gap.colors.codeOnly) {
      lines.push(`| \`${e.codeKey}\` | ${colorSwatch(e.codeValue ?? '')} \`${e.codeValue}\` |`);
    }
  }

  // Typography
  lines.push('', '## Typography', '');
  lines.push('| Figma Name | Family | Weight | Line Height | Letter Spacing | Group |');
  lines.push('|------------|--------|--------|-------------|----------------|-------|');
  for (const t of tokens.typography) {
    const m = t.rawValue.match(/family:\s*"([^"]+)".*weight:\s*(\d+).*lineHeight:\s*([^,]+),.*letterSpacing:\s*([^)]+)/);
    if (m) {
      lines.push(`| \`${t.figmaKey}\` | ${m[1]} | ${m[2]} | ${m[3].trim()} | ${m[4].trim()} | ${t.group} |`);
    }
  }

  // Spacing
  lines.push('', '## Spacing', '');
  lines.push('| Figma Name | Value | Group | DTCG Tier | Code Match |');
  lines.push('|------------|-------|-------|-----------|------------|');
  for (const t of tokens.spacing) {
    const isInComponent = /in component/i.test(t.figmaKey);
    const tier = isInComponent ? 'C' : 'S';
    const spMatch = gap.spacing.matched.some((e) => e.figmaKey === t.figmaKey)
      ? '✅ Matched'
      : gap.spacing.figmaOnly.some((e) => e.figmaKey === t.figmaKey)
      ? '⚠️ Figma-only'
      : '—';
    lines.push(`| \`${t.figmaKey}\` | \`${t.rawValue}px\` | ${t.group} | ${tier} | ${spMatch} |`);
  }

  if (gap.spacing.codeOnly.length > 0) {
    lines.push('', '### Spacing in `commerce-theme` not in Figma', '');
    lines.push('| Code Key | Value |');
    lines.push('|----------|-------|');
    for (const e of gap.spacing.codeOnly) {
      lines.push(`| \`${e.codeKey}\` | \`${e.codeValue}\` |`);
    }
  }

  // Shadows
  lines.push('', '## Shadows', '');
  lines.push('| Figma Name | Description | Code Match |');
  lines.push('|------------|-------------|------------|');
  for (const t of tokens.shadows) {
    const shadowMatch = gap.shadows.matched.some((e) => e.figmaKey === t.figmaKey)
      ? '✅ Matched'
      : '⚠️ Figma-only';
    const firstEffect = t.rawValue.split(';')[0].trim();
    lines.push(`| \`${t.figmaKey}\` | ${firstEffect.slice(0, 80)}... | ${shadowMatch} |`);
  }

  if (gap.shadows.codeOnly.length > 0) {
    lines.push('', '### Shadows in `commerce-theme` not in Figma', '');
    lines.push('| Code Key | Description |');
    lines.push('|----------|-------------|');
    for (const e of gap.shadows.codeOnly) {
      lines.push(`| \`${e.codeKey}\` | ${(e.codeValue ?? '').slice(0, 80)}... |`);
    }
  }

  // Strokes
  lines.push('', '## Strokes (Border Widths)', '');
  lines.push('| Figma Name | Value |');
  lines.push('|------------|-------|');
  for (const t of tokens.strokes) {
    lines.push(`| \`${t.figmaKey}\` | \`${t.rawValue}px\` |`);
  }

  // Layout
  lines.push('', '## Layout & Grid', '');
  lines.push('| Figma Name | Value | Group |');
  lines.push('|------------|-------|-------|');
  for (const t of tokens.layout) {
    lines.push(`| \`${t.figmaKey}\` | \`${t.rawValue}\` | ${t.group} |`);
  }

  lines.push('', '---', `*Generated by \`build-inventory.ts\`*`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Doc 02: Component Inventory
// ---------------------------------------------------------------------------

function doc02ComponentInventory(components: FigmaComponent[]): string {
  const lines: string[] = [
    '# 02 · Component Inventory',
    '',
    `> **${components.length} total components** extracted from the "Molecules & Atoms" Figma page.`,
    '',
  ];

  const sections: Section[] = ['atoms', 'molecules', 'inputs', 'other'];
  for (const section of sections) {
    const group = components.filter((c) => c.section === section);
    lines.push(`## ${SECTION_LABELS[section]} (${group.length})`, '');
    lines.push('| Component | Variants | Property Axes | Responsive | HTML Element | Figma ID |');
    lines.push('|-----------|----------|---------------|------------|--------------|----------|');
    for (const c of group.sort((a, b) => a.name.localeCompare(b.name))) {
      const axes = Object.keys(c.properties).join(', ');
      const responsive = c.hasResponsive ? '✅' : '—';
      lines.push(`| ${c.name} | ${c.variantCount} | ${axes || '—'} | ${responsive} | \`<${c.suggestedHtmlElement}>\` | \`${c.figmaId}\` |`);
    }
    lines.push('');
  }

  lines.push('---', `*Generated by \`build-inventory.ts\`*`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Doc 03: State Completeness Matrix
// ---------------------------------------------------------------------------

const EXPECTED_STATES = ['Default', 'Hover', 'Focus', 'Active', 'Disabled', 'Error', 'Loading', 'Success', 'Selected'];

function doc03StateMatrix(components: FigmaComponent[]): string {
  const lines: string[] = [
    '# 03 · State Completeness Matrix',
    '',
    '> **Legend:** `Y` = state exists with proper naming · `??` = state exists with inconsistent name · `—` = not applicable · `MISS` = expected but absent',
    '',
    '**Note:** Components without a `State` property axis are excluded from this table.',
    '',
  ];

  const stateComponents = components.filter(
    (c) => c.properties['State'] || c.properties['Property 1']
  );

  // Header
  lines.push(`| Component | Section | ${EXPECTED_STATES.join(' | ')} |`);
  lines.push(`|-----------|---------|${EXPECTED_STATES.map(() => '---').join('|')}|`);

  let totalInconsistent = 0;

  for (const c of stateComponents.sort((a, b) => a.name.localeCompare(b.name))) {
    const stateValues = c.properties['State'] ?? c.properties['Property 1'] ?? [];
    const normalizedValues = stateValues.map((v) => v.toLowerCase());

    const cells = EXPECTED_STATES.map((state) => {
      const lower = state.toLowerCase();
      if (normalizedValues.includes(lower)) return 'Y';
      // Check for inconsistent names
      const hasInconsistent = stateValues.some((v) => isInconsistentStateName(v));
      if (hasInconsistent) { totalInconsistent++; return '??' }

      // Active/Focus often share -- if component has neither, mark MISS only for interactive components
      if (state === 'Error' || state === 'Loading' || state === 'Success' || state === 'Selected') return '—';
      if ((state === 'Hover' || state === 'Focus' || state === 'Active' || state === 'Disabled') && stateValues.length > 0) return 'MISS';
      return '—';
    });

    const inconsistentNames = stateValues.filter((v) => isInconsistentStateName(v));
    const noteStr = inconsistentNames.length > 0 ? ` ⚠️ *${inconsistentNames.join(', ')}*` : '';

    lines.push(`| ${c.name}${noteStr} | ${SECTION_LABELS[c.section]} | ${cells.join(' | ')} |`);
  }

  lines.push('', '## Inconsistency Summary', '');
  const allInconsistentNames = new Set<string>();
  for (const c of stateComponents) {
    const stateValues = c.properties['State'] ?? c.properties['Property 1'] ?? [];
    for (const v of stateValues) {
      if (isInconsistentStateName(v)) allInconsistentNames.add(`${c.name}: "${v}"`);
    }
  }

  if (allInconsistentNames.size > 0) {
    lines.push('The following components have unnamed/auto-generated state values that should be renamed in Figma:');
    lines.push('');
    for (const item of allInconsistentNames) {
      lines.push(`- ${item}`);
    }
  } else {
    lines.push('No inconsistent state names detected. ✅');
  }

  lines.push('', '---', `*Generated by \`build-inventory.ts\`*`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Doc 04: Responsive Catalog
// ---------------------------------------------------------------------------

function doc04ResponsiveCatalog(components: FigmaComponent[]): string {
  const lines: string[] = [
    '# 04 · Responsive Pattern Catalog',
    '',
    '> Breakpoints implied by Figma frame widths: **Desktop** = 1440px · **Tablet** = 834px · **Mobile** = 390px',
    '',
  ];

  const fullyResponsive = components.filter((c) => {
    const sizes = (c.properties['Size'] ?? []).map((v) => v.toLowerCase());
    return (
      c.hasResponsive ||
      (sizes.includes('desktop') && sizes.includes('tablet') && sizes.includes('mobile'))
    );
  });

  const partiallyResponsive = components.filter((c) => {
    if (fullyResponsive.includes(c)) return false;
    const sizes = (c.properties['Size'] ?? []).map((v) => v.toLowerCase());
    return (
      sizes.includes('desktop') ||
      sizes.includes('tablet') ||
      sizes.includes('mobile') ||
      c.hasResponsive
    );
  });

  const notResponsive = components.filter(
    (c) => !fullyResponsive.includes(c) && !partiallyResponsive.includes(c)
  );

  lines.push(`## ✅ Fully Responsive (${fullyResponsive.length})`, '');
  lines.push('Components with Desktop + Tablet + Mobile variants:', '');
  lines.push('| Component | Section | Breakpoint Variants |');
  lines.push('|-----------|---------|---------------------|');
  for (const c of fullyResponsive.sort((a, b) => a.name.localeCompare(b.name))) {
    const sizes = (c.properties['Size'] ?? []).filter((v) => /desktop|tablet|mobile/i.test(v)).join(', ');
    lines.push(`| ${c.name} | ${SECTION_LABELS[c.section]} | ${sizes || 'Desktop, Tablet, Mobile'} |`);
  }

  lines.push('', `## ⚠️ Partially Responsive (${partiallyResponsive.length})`, '');
  lines.push('Components with some but not all responsive variants:', '');
  lines.push('| Component | Section | Has | Missing |');
  lines.push('|-----------|---------|-----|---------|');
  for (const c of partiallyResponsive.sort((a, b) => a.name.localeCompare(b.name))) {
    const has = (c.properties['Size'] ?? []).filter((v) => /desktop|tablet|mobile/i.test(v)).join(', ');
    const all = ['Desktop', 'Tablet', 'Mobile'];
    const missing = all.filter((bp) => !has.toLowerCase().includes(bp.toLowerCase())).join(', ');
    lines.push(`| ${c.name} | ${SECTION_LABELS[c.section]} | ${has || '—'} | ${missing} |`);
  }

  lines.push('', `## — Not Responsive (${notResponsive.length})`, '');
  lines.push('Single-size components. Flag for responsive treatment as needed:', '');
  lines.push('| Component | Section | Sizes Available | HTML Element |');
  lines.push('|-----------|---------|-----------------|--------------|');
  for (const c of notResponsive.sort((a, b) => a.name.localeCompare(b.name))) {
    const sizes = (c.properties['Size'] ?? []).join(', ') || '—';
    lines.push(`| ${c.name} | ${SECTION_LABELS[c.section]} | ${sizes} | \`<${c.suggestedHtmlElement}>\` |`);
  }

  lines.push('', '---', `*Generated by \`build-inventory.ts\`*`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Doc 05: Variant Analysis
// ---------------------------------------------------------------------------

function doc05VariantAnalysis(components: FigmaComponent[], axes: VariantAxis[]): string {
  const lines: string[] = [
    '# 05 · Variant Analysis',
    '',
    '## Property Axes Used Across Components',
    '',
    '| Axis | # Components | Values | Components |',
    '|------|-------------|--------|------------|',
  ];

  for (const ax of axes) {
    const vals = ax.values.join(', ');
    const comps = ax.components.join(', ');
    lines.push(`| **${ax.axis}** | ${ax.components.length} | ${vals} | ${comps} |`);
  }

  // Naming inconsistencies
  lines.push('', '## ⚠️ Naming Inconsistencies', '');
  lines.push('The following property values are auto-generated Figma names and should be given descriptive names:', '');

  const issues: Array<{ component: string; axis: string; badValues: string[] }> = [];
  for (const c of components) {
    for (const [axis, values] of Object.entries(c.properties)) {
      const badVals = values.filter((v) => isInconsistentStateName(v));
      if (badVals.length > 0) {
        issues.push({ component: c.name, axis, badValues: badVals });
      }
    }
  }

  if (issues.length > 0) {
    lines.push('| Component | Axis | Bad Value(s) | Recommendation |');
    lines.push('|-----------|------|-------------|----------------|');
    for (const issue of issues) {
      lines.push(
        `| ${issue.component} | ${issue.axis} | \`${issue.badValues.join('`, `')}\` | Replace with descriptive state name (e.g., \`Checked\`, \`Read-only\`) |`
      );
    }
  } else {
    lines.push('No auto-generated names detected. ✅');
  }

  // Consolidation opportunities
  lines.push('', '## 💡 Consolidation Opportunities', '');
  lines.push('Components that could potentially be merged (same property axes, similar names):', '');

  const consolidationCandidates: Array<[string, string, string]> = [
    ['Text Button—Icon Right', 'Text Button—Icon Left', 'Merge into `TextButton` with `iconPosition: "left" | "right"` prop'],
    ['Toggle Switch (text)', 'Multi-Select with Text', 'Consider unified `SelectionGroup` with `type: "toggle" | "checkbox" | "radio"`'],
    ['Text Input (single line)', 'Text Input (name, two fields)', 'Consider `TextInput` with `layout: "single" | "twoColumn"` prop'],
    ['Text Toggle Selector', 'Text Toggle Selector', 'Two separate frames with same name — deduplicate in Figma'],
    ['Tabbed Selector', 'Tabbed Selector Button', 'These may be the container vs. item — clarify relationship'],
    ['Form Dropdown', 'Dropdown', 'Consider unified `Dropdown` with `variant: "form" | "inline"` prop'],
    ['Next-Previous Selector', 'Slider page selector', 'Both are pagination-style controls — consider unifying'],
  ];

  lines.push('| Component A | Component B | Opportunity |');
  lines.push('|-------------|-------------|-------------|');
  for (const [a, b, opp] of consolidationCandidates) {
    lines.push(`| ${a} | ${b} | ${opp} |`);
  }

  // Variant explosion
  lines.push('', '## 💥 Variant Count Overview', '');
  lines.push('Components ordered by variant count (highest = most complex to implement):', '');
  lines.push('| Component | Section | Variant Count | Property Axes |');
  lines.push('|-----------|---------|---------------|---------------|');
  const sortedByVariants = [...components].sort((a, b) => b.variantCount - a.variantCount);
  for (const c of sortedByVariants.slice(0, 20)) {
    const axes = Object.keys(c.properties).length;
    lines.push(`| ${c.name} | ${SECTION_LABELS[c.section]} | ${c.variantCount} | ${axes} |`);
  }

  lines.push('', '---', `*Generated by \`build-inventory.ts\`*`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Doc 06: Dependency Graph
// ---------------------------------------------------------------------------

const DEPENDENCY_MAP: Record<string, string[]> = {
  // Molecules depend on atoms
  'Button Group': ['Button', 'Text Button—Icon Right'],
  'Toast Bar': ['Close Button'],
  'Text Section with Button Group': ['Button', 'Text Button—Icon Right'],
  'Free Trial Card': ['Button', 'Stepper CTA'],
  'Product Content': ['Button', 'Stepper CTA', 'Reviews', 'Badges and Tags', 'Price and Label'],
  'Slider page selector': ['Next-Previous Selector', 'Slider Scroll Bar'],
  'Carousel Product': ['Next-Previous Buttons', 'Slider Scroll Bar', 'Slider page selector'],
  'Section Headline with CTA': ['Button', 'Text Button—Icon Right'],
  'Section Headline': [],
  'Text Section': [],
  'Basic Form': ['Text Input (single line)', 'Dropdown', 'Checkbox', 'Radio Button', 'Button'],
  'Multi-CTA List': ['CTA Row'],
  'Product Grid Card': ['Button', 'Badges and Tags', 'Price and Label', 'Reviews'],
  'Modal Dialog': ['Button', 'Close Button', 'Modal Button Group'],
  'Product Lineup—Single': ['Button', 'Stepper CTA', 'Reviews', 'Badges and Tags', 'Price and Label'],
  'Subnav Dropdown': ['Subnav Dropdown Options'],
  // Atoms depend on HTML elements
  'Button': [],
  'Text Button—Icon Right': [],
  'Text Button—Icon Left': [],
  'Close Button': [],
  'Next-Previous Buttons': [],
  'Expand-Collapse Button': [],
  'Increase-Decrease Buttons': [],
  'Floating Action Button': [],
  'Floating Action Button with Text': [],
  'Play Button': [],
  'Breadcrumbs': [],
  'Simple Menu': [],
  'Button Menu': [],
  'Tabbed Selector': ['Tabbed Selector Button'],
  'Accordion Section': ['Expand-Collapse Button'],
  'Modal Button Group': ['Button'],
  'CTA Row': ['Button'],
  'Category Button': [],
  'Stepper CTA': ['Increase-Decrease Buttons', 'Button'],
  'Stepper Control': ['Increase-Decrease Buttons'],
  'Reviews': ['Star'],
  'Stateful Action Button': ['Button'],
};

function doc06DependencyGraph(components: FigmaComponent[]): string {
  const lines: string[] = [
    '# 06 · Component Dependency Graph',
    '',
    '> Initial mappings inferred from component names and Figma section hierarchy. Refine as needed.',
    '',
    '## Full Hierarchy',
    '',
    '```mermaid',
    'graph TD',
  ];

  // HTML elements subgraph
  lines.push('  subgraph htmlElements ["HTML Elements"]');
  const htmlEls = [...new Set(components.map((c) => c.suggestedHtmlElement))];
  for (const el of htmlEls) {
    const id = el.replace(/[^a-zA-Z0-9]/g, '_');
    lines.push(`    ${id}["&lt;${el}&gt;"]`);
  }
  lines.push('  end');

  // Atoms subgraph
  const atoms = components.filter((c) => c.section === 'atoms');
  lines.push('  subgraph atomsGroup ["Atoms"]');
  for (const c of atoms) {
    const id = c.name.replace(/[^a-zA-Z0-9]/g, '_');
    lines.push(`    ${id}["${c.name}"]`);
  }
  lines.push('  end');

  // Molecules subgraph
  const molecules = components.filter((c) => c.section === 'molecules');
  lines.push('  subgraph moleculesGroup ["Molecules"]');
  for (const c of molecules) {
    const id = c.name.replace(/[^a-zA-Z0-9]/g, '_');
    lines.push(`    ${id}["${c.name}"]`);
  }
  lines.push('  end');

  // Inputs subgraph
  const inputs = components.filter((c) => c.section === 'inputs');
  lines.push('  subgraph inputsGroup ["Inputs"]');
  for (const c of inputs) {
    const id = c.name.replace(/[^a-zA-Z0-9]/g, '_');
    lines.push(`    ${id}["${c.name}"]`);
  }
  lines.push('  end');

  // HTML -> Atom edges
  lines.push('');
  lines.push('  %% HTML to Atom connections');
  for (const c of [...atoms, ...inputs]) {
    const compId = c.name.replace(/[^a-zA-Z0-9]/g, '_');
    const htmlId = c.suggestedHtmlElement.replace(/[^a-zA-Z0-9]/g, '_');
    lines.push(`  ${htmlId} --> ${compId}`);
  }

  // Atom -> Molecule edges
  lines.push('');
  lines.push('  %% Atom/Input to Molecule connections');
  for (const [molName, deps] of Object.entries(DEPENDENCY_MAP)) {
    const mol = components.find((c) => c.name === molName);
    if (!mol || mol.section !== 'molecules') continue;
    const molId = molName.replace(/[^a-zA-Z0-9]/g, '_');
    for (const dep of deps) {
      const depId = dep.replace(/[^a-zA-Z0-9]/g, '_');
      lines.push(`  ${depId} --> ${molId}`);
    }
  }

  lines.push('```');

  // Simplified atom-only graph
  lines.push('', '## Atoms with Internal Dependencies', '');
  lines.push('```mermaid', 'graph TD');
  lines.push('  subgraph atomDeps ["Atom Dependencies"]');
  for (const [name, deps] of Object.entries(DEPENDENCY_MAP)) {
    const comp = components.find((c) => c.name === name && c.section === 'atoms');
    if (!comp || deps.length === 0) continue;
    const parentId = name.replace(/[^a-zA-Z0-9]/g, '_');
    for (const dep of deps) {
      const depId = dep.replace(/[^a-zA-Z0-9]/g, '_');
      lines.push(`    ${depId}["${dep}"] --> ${parentId}["${name}"]`);
    }
  }
  lines.push('  end', '```');

  // Molecule dependency table
  lines.push('', '## Molecule → Atom Dependencies', '');
  lines.push('| Molecule | Depends On |');
  lines.push('|----------|------------|');
  for (const c of molecules.sort((a, b) => a.name.localeCompare(b.name))) {
    const deps = DEPENDENCY_MAP[c.name] ?? [];
    lines.push(`| ${c.name} | ${deps.length > 0 ? deps.join(', ') : '—'} |`);
  }

  lines.push('', '---', `*Generated by \`build-inventory.ts\`*`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Doc 07: Priority Dashboard
// ---------------------------------------------------------------------------

interface PriorityScore {
  component: FigmaComponent;
  sectionScore: number;
  variantScore: number;
  stateScore: number;
  responsiveScore: number;
  total: number;
  recommendation: string;
}

function scorePriority(c: FigmaComponent): PriorityScore {
  // Section: atoms are foundation, must come first
  const sectionScore = c.section === 'atoms' ? 3 : c.section === 'inputs' ? 2 : c.section === 'molecules' ? 1 : 0;

  // Variant score: well-defined properties (no inconsistent names) = higher score
  const stateValues = c.properties['State'] ?? c.properties['Property 1'] ?? [];
  const inconsistentCount = stateValues.filter((v) => isInconsistentStateName(v)).length;
  const variantScore = inconsistentCount === 0 ? 2 : Math.max(0, 2 - inconsistentCount);

  // State score: has at least Default, Hover, Disabled = full points
  const hasDefaultStates = stateValues.some((v) => /default/i.test(v)) &&
    stateValues.some((v) => /hover/i.test(v)) &&
    stateValues.some((v) => /disabled/i.test(v));
  const stateScore = hasDefaultStates ? 2 : stateValues.length > 0 ? 1 : 0;

  // Responsive score
  const responsiveScore = c.hasResponsive ? 1 : 0;

  const total = sectionScore + variantScore + stateScore + responsiveScore;

  let recommendation: string;
  if (inconsistentCount > 0) {
    recommendation = '⚠️ Needs Figma cleanup (inconsistent state names)';
  } else if (total >= 6) {
    recommendation = '✅ Ready to build';
  } else if (total >= 4) {
    recommendation = '🔄 Build with minor caveats';
  } else {
    recommendation = '⏳ Consider responsive variants / state coverage first';
  }

  return { component: c, sectionScore, variantScore, stateScore, responsiveScore, total, recommendation };
}

function doc07PriorityDashboard(components: FigmaComponent[]): string {
  const lines: string[] = [
    '# 07 · Build Priority Dashboard',
    '',
    '> Scoring: **Section** (atoms=3, inputs=2, molecules=1) + **Variant quality** (no bad names=2) + **State coverage** (default+hover+disabled=2) + **Responsive** (1). Max = 8.',
    '',
  ];

  const scores = components.map(scorePriority).sort((a, b) => b.total - a.total || a.component.name.localeCompare(b.component.name));

  lines.push('| Component | Section | Sec | Var | State | Resp | **Total** | Recommendation |');
  lines.push('|-----------|---------|-----|-----|-------|------|-----------|----------------|');
  for (const s of scores) {
    lines.push(
      `| ${s.component.name} | ${SECTION_LABELS[s.component.section]} | ${s.sectionScore} | ${s.variantScore} | ${s.stateScore} | ${s.responsiveScore} | **${s.total}** | ${s.recommendation} |`
    );
  }

  // Summary counts
  const ready = scores.filter((s) => s.recommendation.startsWith('✅')).length;
  const minor = scores.filter((s) => s.recommendation.startsWith('🔄')).length;
  const cleanup = scores.filter((s) => s.recommendation.startsWith('⚠️')).length;
  const deferred = scores.filter((s) => s.recommendation.startsWith('⏳')).length;

  lines.push('', '## Summary', '');
  lines.push(`| Status | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| ✅ Ready to build | ${ready} |`);
  lines.push(`| 🔄 Build with minor caveats | ${minor} |`);
  lines.push(`| ⚠️ Needs Figma cleanup | ${cleanup} |`);
  lines.push(`| ⏳ Deferred | ${deferred} |`);

  lines.push('', '---', `*Generated by \`build-inventory.ts\`*`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// README
// ---------------------------------------------------------------------------

function readme(components: FigmaComponent[], tokens: TokenCategory, gap: GapAnalysis): string {
  const totalVariants = components.reduce((s, c) => s + c.variantCount, 0);
  const responsiveCount = components.filter((c) => c.hasResponsive).length;

  return `# Design System Inventory

> Logos Brand Components — generated from Figma MCP data.
> **Re-generate:** update \`raw/\` files then run \`npm run build\` in this directory.

## Stats

| | Count |
|--|-------|
| Total components | ${components.length} |
| Atoms | ${components.filter((c) => c.section === 'atoms').length} |
| Molecules | ${components.filter((c) => c.section === 'molecules').length} |
| Inputs & Forms | ${components.filter((c) => c.section === 'inputs').length} |
| Other | ${components.filter((c) => c.section === 'other').length} |
| Total variants | ${totalVariants} |
| Responsive components | ${responsiveCount} |
| Figma color tokens | ${tokens.colors.length} |
| Matched in commerce-theme | ${gap.colors.matched.length} colors, ${gap.spacing.matched.length} spacing |
| Figma-only tokens | ${gap.colors.figmaOnly.length} colors, ${gap.spacing.figmaOnly.length} spacing |
| Code-only tokens | ${gap.colors.codeOnly.length} colors, ${gap.spacing.codeOnly.length} spacing |

## Documents

| # | Document | Description |
|---|----------|-------------|
| 01 | [Token Map](./01-token-map.md) | All Figma variables with DTCG tiers and commerce-theme match status |
| 02 | [Component Inventory](./02-component-inventory.md) | All 71 components with variants, axes, and HTML element mappings |
| 03 | [State Completeness Matrix](./03-state-matrix.md) | Cross-component interaction state coverage |
| 04 | [Responsive Catalog](./04-responsive-catalog.md) | Components grouped by responsive coverage |
| 05 | [Variant Analysis](./05-variant-analysis.md) | Naming consistency, consolidation opportunities, variant counts |
| 06 | [Dependency Graph](./06-dependency-graph.md) | HTML → Atom → Molecule relationships (Mermaid) |
| 07 | [Priority Dashboard](./07-priority-dashboard.md) | Scored build order recommendations |

## Data Files

| File | Description |
|------|-------------|
| \`data/tokens.json\` | All Figma variables by category |
| \`data/components.json\` | All components with parsed variant properties |
| \`data/variant-axes.json\` | Deduplicated property axes across all components |
| \`data/gap-analysis.json\` | Figma vs. commerce-theme token comparison |
| \`data/dtcg/primitives.json\` | Tier 1 DTCG tokens (raw values) |
| \`data/dtcg/semantic.json\` | Tier 2 DTCG tokens (intent-based aliases) |
| \`data/dtcg/component.json\` | Tier 3 DTCG tokens (component-scoped) |

## Pipeline

\`\`\`
raw/figma-metadata.xml     ─┐
raw/figma-variables.json   ─┤─► parse-figma.ts ──► data/*.json
                            │
commerce-theme/src/*.ts    ─┘─► gap-analysis.ts ──► data/gap-analysis.json
                                map-dtcg.ts ──────► data/dtcg/*.json
                                generate-docs.ts ──► docs/*.md
\`\`\`
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function generateDocs() {
  console.log('\n=== generate-docs: generating markdown documents ===');

  const components: FigmaComponent[] = readJson('components.json');
  const axes: VariantAxis[] = readJson('variant-axes.json');
  const tokens: TokenCategory = readJson('tokens.json');
  const gap: GapAnalysis = readJson('gap-analysis.json');

  const docsDir = join(ROOT, 'docs');

  writeDoc(join(docsDir, '01-token-map.md'), doc01TokenMap(tokens, gap));
  writeDoc(join(docsDir, '02-component-inventory.md'), doc02ComponentInventory(components));
  writeDoc(join(docsDir, '03-state-matrix.md'), doc03StateMatrix(components));
  writeDoc(join(docsDir, '04-responsive-catalog.md'), doc04ResponsiveCatalog(components));
  writeDoc(join(docsDir, '05-variant-analysis.md'), doc05VariantAnalysis(components, axes));
  writeDoc(join(docsDir, '06-dependency-graph.md'), doc06DependencyGraph(components));
  writeDoc(join(docsDir, '07-priority-dashboard.md'), doc07PriorityDashboard(components));
  writeDoc(join(docsDir, 'README.md'), readme(components, tokens, gap));

  console.log(`  8 documents written to ./docs/`);
}

const isMain = process.argv[1]?.endsWith('generate-docs.ts') || process.argv[1]?.endsWith('generate-docs.js');
if (isMain) generateDocs().catch((e) => { console.error(e); process.exit(1); });

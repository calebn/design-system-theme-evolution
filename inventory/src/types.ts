export type Section = 'atoms' | 'molecules' | 'inputs' | 'other';

export type FunctionalCategory =
  | 'actions'
  | 'navigation'
  | 'data-entry'
  | 'data-display'
  | 'feedback'
  | 'content-layout'
  | 'product'
  | 'selection';

/**
 * Three tiers of code components, matching the React-first architecture:
 * - primitive: standalone, reusable React component (Button, Input, Badge)
 * - composition: multi-primitive React component (Modal, Accordion, ProductCard)
 * - builder-block: page-level composition registered in Builder.io with BuilderBlocks slots
 */
export type ComponentTier = 'primitive' | 'composition' | 'builder-block';

export interface ComponentVariantProperties {
  [axis: string]: string[];
}

export interface FigmaComponent {
  name: string;
  figmaId: string;
  section: Section;
  functionalCategory: FunctionalCategory;
  proposedCodeName: string;
  variantCount: number;
  properties: ComponentVariantProperties;
  hasResponsive: boolean;
  suggestedHtmlElement: string;
}

export interface VariantAxis {
  axis: string;
  values: string[];
  components: string[];
}

export interface FigmaToken {
  figmaKey: string;
  group: string;
  name: string;
  rawValue: string;
  type: 'color' | 'dimension' | 'typography' | 'shadow' | 'stroke' | 'layout' | 'fontSize';
}

export interface TokenCategory {
  colors: FigmaToken[];
  typography: FigmaToken[];
  spacing: FigmaToken[];
  shadows: FigmaToken[];
  strokes: FigmaToken[];
  layout: FigmaToken[];
  fontSizes: FigmaToken[];
  dimensions: FigmaToken[];
}

export type DtcgTier = 'primitive' | 'semantic' | 'component';

export interface DtcgToken {
  $value: string | number;
  $type: string;
  $description?: string;
  tier: DtcgTier;
  figmaKey?: string;
}

export interface GapEntry {
  figmaKey?: string;
  figmaValue?: string;
  codeKey?: string;
  codeValue?: string;
}

export interface GapAnalysis {
  colors: { matched: GapEntry[]; figmaOnly: GapEntry[]; codeOnly: GapEntry[] };
  spacing: { matched: GapEntry[]; figmaOnly: GapEntry[]; codeOnly: GapEntry[] };
  typography: { matched: GapEntry[]; figmaOnly: GapEntry[]; codeOnly: GapEntry[] };
  shadows: { matched: GapEntry[]; figmaOnly: GapEntry[]; codeOnly: GapEntry[] };
}

export interface CodeComponentProp {
  name: string;       // e.g. "variant"
  type: string;       // e.g. "'primary' | 'secondary'"
  figmaAxis?: string; // Figma property axis this maps from
  default?: string;   // default value
  description?: string;
  proposed?: boolean; // true = values are proposed/TBD, not from Figma axes or a real implementation
}

export interface CodeComponent {
  name: string;              // PascalCase React component name
  directoryName: string;     // kebab-case directory name
  tier: ComponentTier;
  functionalCategory: FunctionalCategory;
  description: string;
  figmaSources: string[];    // Figma frame names that collapse into this component
  props: CodeComponentProp[];
  htmlElement: string;
}

export interface TaxonomyCategory {
  id: FunctionalCategory;
  label: string;
  description: string;
  components: string[];
  codeComponents: string[];  // code component names in this category
}

export interface Taxonomy {
  categories: TaxonomyCategory[];
  codeComponents: CodeComponent[];
  proposedFolderStructure: string[];
}

// ─── Brand Styles Migration Types ────────────────────────────────────────────

export type TokenSource = 'brand-components' | 'brand-styles' | 'both';

export type MigrationStatus =
  | 'variable'        // already a Figma variable - no action needed
  | 'local-style-only' // exists as a local style but NOT a variable - needs migration
  | 'duplicate'       // same value exists under a different name as a variable
  | 'missing';        // referenced but value not extractable

export type MigrationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface TokenMigrationItem {
  styleName: string;
  group: string;
  type: 'color' | 'shadow' | 'gradient' | 'typography';
  status: MigrationStatus;
  extractedValue?: string;
  existingVariableKey?: string;
  priority: MigrationPriority;
  notes: string;
  scope?: 'sub-brand';
}

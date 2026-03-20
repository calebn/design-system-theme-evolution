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

export interface TaxonomyCategory {
  id: FunctionalCategory;
  label: string;
  description: string;
  components: string[];
}

export interface Taxonomy {
  categories: TaxonomyCategory[];
  proposedFolderStructure: string[];
}

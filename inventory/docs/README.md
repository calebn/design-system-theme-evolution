# Design System Inventory

> Logos Brand Components — generated from Figma MCP data.
> **Re-generate:** update `raw/` files then run `npm run build` in this directory.

## Stats

| | Count |
|--|-------|
| Figma component frames | 71 |
| Code components | 40 |
| Total Figma variants | 973 |
| Responsive Figma frames | 11 |
| Figma color tokens | 16 |
| Colors matched in `commerce-theme` | 16 |
| Colors Figma-only (need code impl) | 0 |
| Colors code-only (orphaned) | 26 |

## Code Component Architecture

| Tier | Count | Description |
|------|-------|-------------|
| Primitives | 22 | Standalone React components |
| Compositions | 14 | Multi-primitive compositions |
| Builder Blocks | 4 | Page-level Builder.io blocks |

## By Functional Category

| Category | Figma Frames | Code Components |
|----------|-------------|-----------------|
| Actions | 14 | 6 |
| Navigation | 7 | 4 |
| Data Entry | 22 | 13 |
| Data Display | 8 | 4 |
| Feedback & Overlays | 3 | 2 |
| Content Layout | 5 | 2 |
| Product | 6 | 6 |
| Selection & Controls | 6 | 3 |

## Documents

| # | Document | Description |
|---|----------|-------------|
| 01 | [Token Map](./01-token-map.md) | All Figma variables with DTCG tiers, swatches, and commerce-theme match status |
| 02 | [Component Inventory](./02-component-inventory.md) | All 71 Figma frames with functional category, variants, axes, and HTML mappings |
| 03 | [State Completeness Matrix](./03-state-matrix.md) | Cross-component interaction state coverage |
| 04 | [Responsive Catalog](./04-responsive-catalog.md) | Figma frames grouped by responsive coverage |
| 05 | [Variant Analysis](./05-variant-analysis.md) | State axis quality, naming consistency, consolidation opportunities |
| 06 | [Dependency Graph](./06-dependency-graph.md) | HTML → Atom → Molecule relationships (Mermaid) |
| 07 | [Priority Dashboard](./07-priority-dashboard.md) | Build order scored by code component (40 rows) with full Figma-frame detail |
| 08 | [Functional Taxonomy](./08-taxonomy.md) | Three-axis classification (atomic · category · tier), Mermaid diagram, folder structure |
| 09 | [Component Architecture](./09-component-architecture.md) | React-first component list, prop API conventions, Figma axis → prop mapping, directory structure |
| 10 | [Figma Cleanup Checklist](./10-figma-cleanup.md) | Figma → code consolidation map + actionable cleanup items |
| 11 | [Design Token Migration Guide](./11-design-token-migration.md) | Brand Styles audit — which local styles need to become Figma variables |
| 12 | [Component Surface Area](./12-component-surface-area.md) | Proposed prop API, CSS custom properties, slots, and accessibility requirements per component |

## Data Files

| File | Description |
|------|-------------|
| `data/tokens.json` | All Figma variables by category (incl. fontSizes) |
| `data/components.json` | All 71 Figma frames with functionalCategory and proposedCodeName |
| `data/code-components.json` | 40 code components with tier, props, and Figma source mapping |
| `data/variant-axes.json` | Deduplicated property axes across all Figma frames |
| `data/taxonomy.json` | Category definitions, code components, and proposed folder structure |
| `data/gap-analysis.json` | Figma vs. commerce-theme token comparison |
| `data/brand-styles-audit.json` | Brand Styles local styles vs. variables audit |
| `data/dtcg/primitives.json` | Tier 1 DTCG tokens (raw values) |
| `data/dtcg/semantic.json` | Tier 2 DTCG tokens (intent-based aliases) |
| `data/dtcg/component.json` | Tier 3 DTCG tokens (component-scoped) |
|| `raw/figma-brand-styles-metadata.xml` | Logos Brand Styles Figma canvas structure (manually fetched via MCP) |
|| `raw/figma-brand-styles-extracted.json` | Extracted color/gradient/shadow values from Brand Styles local styles |

## Pipeline

```
raw/figma-metadata.xml                 ─┐
raw/figma-variables.json               ─┤─► parse-figma.ts ──► data/*.json + code-components.json
                                        │
commerce-theme/src/*.ts                ─┤─► gap-analysis.ts + map-dtcg.ts ──► data/*.json
raw/figma-brand-styles-extracted.json  ─┘─► audit-brand-styles.ts ──► brand-styles-audit.json
                                            generate-docs.ts ──► docs/*.md (12 docs + README)
```

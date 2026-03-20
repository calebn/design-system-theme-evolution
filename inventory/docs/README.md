# Design System Inventory

> Logos Brand Components — generated from Figma MCP data.
> **Re-generate:** update `raw/` files then run `npm run build` in this directory.

## Stats

| | Count |
|--|-------|
| Figma component frames | 71 |
| Code components | 34 |
| Total Figma variants | 973 |
| Responsive Figma frames | 11 |
| Figma color tokens | 16 |
| Colors matched in `commerce-theme` | 16 |
| Colors Figma-only (need code impl) | 0 |
| Colors code-only (orphaned) | 26 |

## Code Component Architecture

| Tier | Count | Description |
|------|-------|-------------|
| Primitives | 21 | Standalone React components |
| Compositions | 9 | Multi-primitive compositions |
| Builder Blocks | 4 | Page-level Builder.io blocks |

## By Functional Category

| Category | Figma Frames | Code Components |
|----------|-------------|-----------------|
| Actions | 12 | 4 |
| Navigation | 7 | 4 |
| Data Entry | 16 | 10 |
| Data Display | 8 | 3 |
| Feedback & Overlays | 3 | 2 |
| Content Layout | 5 | 2 |
| Product | 6 | 5 |
| Selection & Controls | 14 | 4 |

## Documents

| # | Document | Description |
|---|----------|-------------|
| 01 | [Token Map](./01-token-map.md) | All Figma variables with DTCG tiers, swatches, and commerce-theme match status |
| 02 | [Component Inventory](./02-component-inventory.md) | All 71 Figma frames with functional category, variants, axes, and HTML mappings |
| 03 | [State Completeness Matrix](./03-state-matrix.md) | Cross-component interaction state coverage |
| 04 | [Responsive Catalog](./04-responsive-catalog.md) | Figma frames grouped by responsive coverage |
| 05 | [Variant Analysis](./05-variant-analysis.md) | State axis quality, naming consistency, consolidation opportunities |
| 06 | [Dependency Graph](./06-dependency-graph.md) | HTML → Atom → Molecule relationships (Mermaid) |
| 07 | [Priority Dashboard](./07-priority-dashboard.md) | Build order scored by code component (34 rows) with full Figma-frame detail |
| 08 | [Functional Taxonomy](./08-taxonomy.md) | Three-axis classification (atomic · category · tier), Mermaid diagram, folder structure |
| 09 | [Component Architecture](./09-component-architecture.md) | React-first component list, prop API conventions, Figma axis → prop mapping, directory structure |
| 10 | [Figma Cleanup Checklist](./10-figma-cleanup.md) | Figma → code consolidation map + actionable cleanup items |
| 11 | [Design Token Migration Guide](./11-design-token-migration.md) | Brand Styles audit — which local styles need to become Figma variables |
| 12 | [Component Surface Area](./12-component-surface-area.md) | Proposed prop API, CSS custom properties, slots, and accessibility requirements per component |
| 13 | [Design Token Pipeline](./13-token-pipeline.md) | End-to-end pipeline specification: Figma → DTCG → CSS vars → Tailwind → CommerceWeb, with inter-stage contracts, tool comparisons, breaking-change detection, and implementation phases |

## Data Files

| File | Description |
|------|-------------|
| `data/tokens.json` | All Figma variables by category (incl. fontSizes) |
| `data/components.json` | All 71 Figma frames with functionalCategory and proposedCodeName |
| `data/code-components.json` | 34 code components with tier, props, and Figma source mapping |
| `data/variant-axes.json` | Deduplicated property axes across all Figma frames |
| `data/taxonomy.json` | Category definitions, code components, and proposed folder structure |
| `data/gap-analysis.json` | Figma vs. commerce-theme token comparison |
| `data/brand-styles-audit.json` | Brand Styles local styles vs. variables audit |
| `data/verified-dependencies.json` | Component dependencies verified via `get_design_context` MCP calls — confidence levels and notes per entry |
| `data/dtcg/primitives.json` | Tier 1 DTCG tokens (raw values) |
| `data/dtcg/semantic.json` | Tier 2 DTCG tokens (intent-based aliases) |
| `data/dtcg/component.json` | Tier 3 DTCG tokens (component-scoped) |
| `raw/figma-brand-styles-metadata.xml` | Logos Brand Styles Figma canvas structure (manually fetched via MCP) |
| `raw/figma-brand-styles-extracted.json` | Extracted color/gradient/shadow values from Brand Styles local styles |
| `raw/design-context/` | Full `get_design_context` MCP responses per component — layer hierarchy, auto-layout, generated code. See README inside. |
| `screenshots/` | Component screenshots downloaded via Figma REST API. See README inside for capture instructions. |

## Pipeline

```
raw/figma-metadata.xml                 ─┐
raw/figma-variables.json               ─┤─► parse-figma.ts ──► data/*.json + code-components.json
                                        │
commerce-theme/src/*.ts                ─┤─► gap-analysis.ts + map-dtcg.ts ──► data/*.json
raw/figma-brand-styles-extracted.json  ─┘─► audit-brand-styles.ts ──► brand-styles-audit.json
                                            generate-docs.ts ──► docs/*.md (12 docs + README)

One-time capture (not part of regular build):
raw/design-context/   ◄── get_design_context MCP (run manually per component)
screenshots/          ◄── src/capture-screenshots.ts (Figma REST API, requires FIGMA_TOKEN env var)
data/verified-dependencies.json ◄── analysed from raw/design-context/ output
```

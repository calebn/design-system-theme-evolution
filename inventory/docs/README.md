# Design System Inventory

> Logos Brand Components — generated from Figma MCP data.
> **Re-generate:** update `raw/` files then run `npm run build` in this directory.

## Stats

| | Count |
|--|-------|
| Total components | 71 |
| Total variants | 973 |
| Responsive components | 11 |
| Figma color tokens | 16 |
| Colors matched in `commerce-theme` | 15 |
| Colors Figma-only (need code impl) | 0 |
| Colors code-only (orphaned) | 26 |

## By Atomic Level

| Level | Count |
|-------|-------|
| Atoms | 27 |
| Molecules | 16 |
| Inputs & Forms | 22 |
| Other | 6 |

## By Functional Category

| Category | Count |
|----------|-------|
| Actions | 12 |
| Navigation | 7 |
| Data Entry | 16 |
| Data Display | 8 |
| Feedback & Overlays | 3 |
| Content Layout | 5 |
| Product | 6 |
| Selection & Controls | 14 |

## Documents

| # | Document | Description |
|---|----------|-------------|
| 01 | [Token Map](./01-token-map.md) | All Figma variables with DTCG tiers, swatches, and commerce-theme match status |
| 02 | [Component Inventory](./02-component-inventory.md) | All 71 components with functional category, variants, axes, and HTML mappings |
| 03 | [State Completeness Matrix](./03-state-matrix.md) | Cross-component interaction state coverage |
| 04 | [Responsive Catalog](./04-responsive-catalog.md) | Components grouped by responsive coverage |
| 05 | [Variant Analysis](./05-variant-analysis.md) | State axis quality, naming consistency, consolidation opportunities |
| 06 | [Dependency Graph](./06-dependency-graph.md) | HTML → Atom → Molecule relationships (Mermaid) |
| 07 | [Priority Dashboard](./07-priority-dashboard.md) | Scored build order including dependency weight |
| 08 | [Functional Taxonomy](./08-taxonomy.md) | Dual-axis classification, Mermaid category tree, proposed folder structure |
| 09 | [Naming Conventions](./09-naming-conventions.md) | Component/token/axis naming rules with Figma-to-code mapping |
| 10 | [Figma Cleanup Checklist](./10-figma-cleanup.md) | Actionable checkboxes for every detected issue |

## Data Files

| File | Description |
|------|-------------|
| `data/tokens.json` | All Figma variables by category (incl. fontSizes) |
| `data/components.json` | All 71 components with functionalCategory and proposedCodeName |
| `data/variant-axes.json` | Deduplicated property axes across all components |
| `data/taxonomy.json` | Category definitions and proposed folder structure |
| `data/gap-analysis.json` | Figma vs. commerce-theme token comparison |
| `data/dtcg/primitives.json` | Tier 1 DTCG tokens (raw values) |
| `data/dtcg/semantic.json` | Tier 2 DTCG tokens (intent-based aliases) |
| `data/dtcg/component.json` | Tier 3 DTCG tokens (component-scoped) |

## Pipeline

```
raw/figma-metadata.xml     ─┐
raw/figma-variables.json   ─┤─► parse-figma.ts ──► data/*.json + data/taxonomy.json
                            │
commerce-theme/src/*.ts    ─┘─► gap-analysis.ts ──► data/gap-analysis.json
                                map-dtcg.ts ──────► data/dtcg/*.json
                                generate-docs.ts ──► docs/*.md (10 docs + README)
```

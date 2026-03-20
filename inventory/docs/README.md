# Design System Inventory

> Logos Brand Components — generated from Figma MCP data.
> **Re-generate:** update `raw/` files then run `npm run build` in this directory.

## Stats

| | Count |
|--|-------|
| Total components | 71 |
| Atoms | 27 |
| Molecules | 16 |
| Inputs & Forms | 22 |
| Other | 6 |
| Total variants | 973 |
| Responsive components | 11 |
| Figma color tokens | 16 |
| Matched in commerce-theme | 9 colors, 9 spacing |
| Figma-only tokens | 6 colors, 2 spacing |
| Code-only tokens | 17 colors, 11 spacing |

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
| `data/tokens.json` | All Figma variables by category |
| `data/components.json` | All components with parsed variant properties |
| `data/variant-axes.json` | Deduplicated property axes across all components |
| `data/gap-analysis.json` | Figma vs. commerce-theme token comparison |
| `data/dtcg/primitives.json` | Tier 1 DTCG tokens (raw values) |
| `data/dtcg/semantic.json` | Tier 2 DTCG tokens (intent-based aliases) |
| `data/dtcg/component.json` | Tier 3 DTCG tokens (component-scoped) |

## Pipeline

```
raw/figma-metadata.xml     ─┐
raw/figma-variables.json   ─┤─► parse-figma.ts ──► data/*.json
                            │
commerce-theme/src/*.ts    ─┘─► gap-analysis.ts ──► data/gap-analysis.json
                                map-dtcg.ts ──────► data/dtcg/*.json
                                generate-docs.ts ──► docs/*.md
```

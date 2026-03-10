# Design Tokens Pipeline Demo

A live, runnable demo that makes the full design tokens pipeline **tangible** for both designers and developers.

**Core proposition:** Designers change a value in a JSON file (or a Figma Variable). One command later, every UI component across every brand re-themes automatically. No developer involvement required for visual updates.

---

## Quick start

```bash
npm install
npm run dev          # builds tokens + launches browser at http://localhost:5173
```

---

## What this demo proves

| Claim | Where to see it |
|---|---|
| One source of truth | `tokens/` → `generated/` via `npm run build:tokens` |
| Multi-brand from one codebase | Brand switcher (Logos ↔ Verbum), zero component changes |
| Clean theme/UI separation | `src/components/*.tsx` — no brand names anywhere |
| Breaking change detection | `npm run diff -- 1.1.0 2.0.0` |
| Governance enforcement | `npm run check -- 1.1.0 2.0.0` exits 1 |
| Designer empowerment | Edit a value in `tokens/brand/logos/color.json`, run `npm run build:tokens`, reload browser |

---

## Live demo walkthrough script

Use this script when presenting in a meeting. Each step is a talking point + command or browser action.

---

### Step 1 — The source of truth (2 min)

> "Everything starts here."

Open `tokens/brand/logos/color.json` and `tokens/brand/verbum/color.json` side by side.

**Talking point:** Both files define the same semantic token names — `color.primary`, `color.danger`, `color.success`, etc. — but with brand-specific values. This is exactly how Figma Variable collections work: one collection, two modes (Logos / Verbum). The same token contract drives different visual outcomes.

Point to the W3C DTCG format (`$value`, `$type`, `$description`) and note it is tool-agnostic — it is not tied to Style Dictionary, Tailwind, or any specific platform.

---

### Step 2 — One command generates everything (2 min)

> "The designer's change becomes code instantly."

```bash
npm run build:tokens
```

Show the output:

```
── Building current tokens ──
✓ logos → generated/logos
✓ verbum → generated/verbum

── Building all history versions ──
✓ logos → generated/versions/1.0.0/logos
✓ verbum → generated/versions/1.0.0/verbum
... (6 more)

✅ Token build complete.
```

Open `generated/logos/variables.css` and `generated/verbum/variables.css`. Show:
- `[data-brand="logos"]` and `[data-brand="verbum"]` selectors
- The same property names (`--color-primary`), different values
- Core tokens in `:root` (spacing, radii, shadows) — shared, not duplicated

**Talking point:** "One file per brand. The component never knows which one is loaded."

---

### Step 3 — The UI has zero brand awareness (2 min)

> "The component is the most portable part of the system."

Open `src/components/Button.tsx`. Show:

```tsx
backgroundColor: 'var(--color-primary)',
color: 'var(--color-on-primary)',
borderRadius: 'var(--dimension-radius-md)',
```

**Talking point:** "No hex values. No theme imports. No ThemeProvider. No brand conditionals. This same component could be dropped into Vue, Svelte, Swift, or a static HTML page. The CSS variable contract is the entire interface between design and implementation."

---

### Step 4 — Multi-brand live in the browser (3 min)

> "Let's actually see it."

Open `http://localhost:5173` in the browser.

1. Start on Logos, version 1.0.0. Walk through the Component showcase — buttons, badges, alerts, cards.
2. Click **Verbum**. Watch everything re-theme instantly — header turns burgundy, buttons shift to deep red, fonts switch to Playfair Display + Source Serif.
3. Ask: "How many lines of JavaScript ran to do that?" Answer: **zero JavaScript re-render**. Only the `data-brand` attribute changed. The browser applied CSS. Components didn't re-render.
4. Open the **Token inspector** tab. Show the live CSS variable values — `--color-primary: #7b1f2e` for Verbum, `#1e6afe` for Logos. These are computed by the browser, not hardcoded.

---

### Step 5 — Version history: watching the design evolve (3 min)

> "Now let's see how the system handles change over time."

Switch to the **Diff viewer** tab.

Point to the `1.0.0 → 1.1.0` diff:
- `color.primary` restyled (new shade of blue/burgundy) → **patch**
- `color.accent` added → **minor**
- `dimension.radius-lg` combined into `radius-md` → **minor**
- **Result: MINOR bump. Non-breaking. CI gate passes.**

Then show `1.1.0 → 2.0.0`:
- `color.primary` **removed** (split into `primary-light-mode` + `primary-dark-mode`) → **BREAKING**
- `color.accent` **deleted** → **BREAKING**
- **Result: MAJOR bump. Breaking. CI gate fails.**

Switch between version tabs in the browser (1.0.0 → 1.1.0 → 2.0.0) while on the Component showcase to show the visual evolution. On v2.0.0 with Logos, note that `--color-primary` is now unresolved (the token was split) — demonstrating exactly *why* splits are breaking.

---

### Step 6 — The CI gate (2 min)

> "This is where the system protects itself."

```bash
# This passes — non-breaking changes
npm run check -- 1.0.0 1.1.0

# This fails — breaking changes (split + delete)
npm run check -- 1.1.0 2.0.0
```

**Talking point:** "In CI, every PR that touches token files runs this check. If a designer (or developer) accidentally removes a token or splits it — something that would break components — the build fails before it ever merges. The PR gets labelled `major / breaking` and requires a migration guide."

Show the constraint label in the output: `Diagram 1 (restyle · combine · add only)`.

Explain Diagram 1 vs Diagram 2:
- **Diagram 1** (safe governance): restyle values, combine tokens, add new tokens
- **Diagram 2** (breaking): split a token into multiple names, delete a token outright
- The check tool enforces Diagram 1. Diagram 2 changes require a major bump + migration guide.

---

### Step 7 — What designers get (1 min)

> "Let me show you what the designer workflow looks like."

```bash
# 1. Designer opens tokens/brand/logos/color.json and changes:
#    "primary": { "$value": "#1E6AFE" }
#    to:
#    "primary": { "$value": "#0050D0" }

# 2. One command
npm run build:tokens

# 3. Reload browser — every button, badge, and alert updates
```

**Talking point:** "In a fully integrated workflow, step 2 would be triggered automatically by a Figma Tokens Studio sync — the designer publishes their changes in Figma, a GitHub Action runs `build:tokens`, and a PR is opened with the generated diff. No developer involvement for a restyle."

---

### Step 8 — What developers get (1 min)

> "And developers aren't bottlenecks for visual changes."

- Color changes: **zero dev work** (restyle = patch, CI auto-approves)
- New tokens (e.g., adding `color.accent`): **minor bump**, dev writes a component that uses it
- Breaking changes (split/delete): **major bump**, dev and design collaborate on migration

**Talking point:** "The semver contract tells developers exactly how much work is coming. A patch PR can auto-merge. A major PR triggers a conversation. The system makes the impact of design decisions legible to engineers."

---

### Step 9 — Migration path for commerce-components (2 min)

> "How do we get here from where we are today?"

Walk through the five migration steps (see plan file for details):

1. **Extract** — Convert `colors.ts` hex values to DTCG JSON; use semantic names (primary, danger, etc.)
2. **Add Style Dictionary** — `colors.ts` becomes a generated file, not hand-written
3. **Close CSS variable gap** — `tailwind-helper.ts` references `var(--color-*)` instead of hardcoded hex
4. **Add CI tools** — `check-breaking.ts` runs on every PR touching tokens
5. **Connect to Figma** — Tokens Studio syncs Figma Variables → JSON → automated PR

**Talking point:** "Steps 1–3 can happen in a single PR with zero visual change to consumers. Steps 4–5 are additive. At no point do existing components break."

---

## npm scripts reference

| Command | What it does |
|---|---|
| `npm run dev` | Build tokens + diff data + start Vite dev server |
| `npm run build` | Production build |
| `npm run build:tokens` | Generate CSS, TypeScript, and Tailwind fragments for all brands and versions |
| `npm run build:diff-data` | Generate `src/diff-data.ts` for the in-browser diff viewer |
| `npm run diff -- <from> <to>` | Show token changelog between two versions |
| `npm run check -- <from> <to>` | CI gate: exit 1 if breaking (Diagram 1 violation) |

**Version examples:**
```bash
npm run diff -- 1.0.0 1.1.0      # non-breaking: minor bump
npm run diff -- 1.1.0 2.0.0      # breaking: major bump
npm run diff -- 1.0.0 current    # compare a history snapshot to live tokens
npm run check -- 1.0.0 1.1.0     # passes
npm run check -- 1.1.0 2.0.0     # fails
```

---

## Project structure

```
demo/
├── tokens/                    ← SOURCE OF TRUTH (edit these)
│   ├── core/
│   │   ├── dimension.json     ← Shared spacing / radii
│   │   └── shadow.json        ← Shared elevations
│   └── brand/
│       ├── logos/
│       │   ├── color.json     ← Logos palette
│       │   └── font.json      ← Logos typefaces
│       └── verbum/
│           ├── color.json     ← Verbum palette
│           └── font.json      ← Verbum typefaces
│
├── tokens-history/            ← Version snapshots (for diff demo)
│   ├── 1.0.0/
│   ├── 1.1.0/                 ← Minor: restyle + add + combine
│   └── 2.0.0/                 ← Major: split + delete (breaking)
│
├── build/                     ← PIPELINE TOOLS
│   ├── build-tokens.ts        ← Generates CSS, TS, Tailwind from tokens
│   ├── diff-tokens.ts         ← Classifies changes as patch/minor/major
│   ├── check-breaking.ts      ← CI gate: rejects Diagram 2 changes
│   └── generate-diff-data.ts  ← Pre-computes diffs for browser
│
├── generated/                 ← BUILD OUTPUTS (do not hand-edit)
│   ├── logos/variables.css
│   ├── logos/tokens.ts
│   ├── logos/tailwind.cjs
│   ├── verbum/...
│   └── versions/{1.0.0,1.1.0,2.0.0}/{logos,verbum}/...
│
└── src/                       ← DEMO REACT APP
    ├── components/
    │   ├── Button.tsx          ← var(--color-primary), var(--dimension-radius-md)
    │   ├── Card.tsx            ← var(--color-surface), var(--shadow-card)
    │   ├── Alert.tsx           ← var(--color-danger/warning/success)
    │   └── Badge.tsx           ← var(--color-primary), var(--font-caption)
    └── panels/
        ├── TokenInspector.tsx  ← Live CSS var readout
        └── DiffPanel.tsx       ← Version changelog viewer
```

---

## The key architectural insight

```
Figma Variable collection "Brand"
  ├── Mode: Logos   →  tokens/brand/logos/*.json   →  generated/logos/variables.css
  └── Mode: Verbum  →  tokens/brand/verbum/*.json  →  generated/verbum/variables.css

At runtime: switching brands = loading a different CSS file.
No component code changes. No JavaScript re-render. Instant.
```

The component contract is a set of CSS custom property names. Any platform that can read CSS custom properties can consume these tokens: React, Vue, Angular, Svelte, iOS (via CSS-in-Swift wrappers), Android Web Views, email HTML.

---

## Semantic versioning for design tokens

| Operation | SemVer impact | Diagram 1? | Example |
|---|---|---|---|
| Restyle (change value) | patch | ✅ | `primary: #1E6AFE → #0F5FCC` |
| Add new token | minor | ✅ | Add `color.accent` |
| Combine (alias old names) | minor | ✅ | `radius-sm` + `radius-lg` → `radius-md` |
| Split (one name → multiple) | **major** | ❌ | `primary` → `primary-light-mode` + `primary-dark-mode` |
| Delete | **major** | ❌ | Remove `color.accent` |

Diagram 1 (safe governance): only restyle, add, and combine are permitted without a major bump.
Diagram 2 (breaking): splits and deletes require a major version + migration guide.

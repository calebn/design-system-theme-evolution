# 09 · Component Architecture

> React-first component architecture: multiple Figma frames collapse into semantic code components with typed props.
> Builder.io registration is always in a separate `register.tsx` file — never in `component.tsx`.

## A · Code Components

34 code components derived from 71 Figma frames.

### Primitives (21)

| Component | Directory | Category | Figma Sources | HTML |
|-----------|-----------|----------|---------------|------|
| `Button` | `button/` | Actions | Button, Category Button, Floating Action Button with Text, Stateful Action Button | `<button>` |
| `IconButton` | `icon-button/` | Actions | Close Button, Play Button, Floating Action Button | `<button>` |
| `LinkButton` | `link-button/` | Actions | Text Button—Icon Left, Text Button—Icon Right | `<button>` |
| `Input` | `input/` | Data Entry | Text Input (single line), Text Input—Date, Text Input—Password, Search Field | `<input>` |
| `Textarea` | `textarea/` | Data Entry | Text Input—Multiline | `<textarea>` |
| `TextInputGroup` | `text-input-group/` | Data Entry | Text Input (name, two fields) | `<div>` |
| `Select` | `select/` | Data Entry | Dropdown, Form Dropdown, Form Dropdown Option | `<select>` |
| `Checkbox` | `checkbox/` | Data Entry | Checkbox | `<input[type=checkbox]>` |
| `RadioButton` | `radio-button/` | Data Entry | Radio Button | `<input[type=radio]>` |
| `Toggle` | `toggle/` | Selection & Controls | Switch, Toggle with Text | `<input[type=checkbox]>` |
| `Slider` | `slider/` | Data Entry | Slider | `<input[type=range]>` |
| `Badge` | `badge/` | Data Display | Badges and Tags, Sale Percentage | `<span>` |
| `StarRating` | `star-rating/` | Data Display | Star, Reviews | `<div>` |
| `PriceLabel` | `price-label/` | Data Display | Price and Label | `<span>` |
| `Breadcrumbs` | `breadcrumbs/` | Navigation | Breadcrumbs | `<nav>` |
| `Menu` | `menu/` | Navigation | Simple Menu, Button Menu | `<nav>` |
| `Tabs` | `tabs/` | Navigation | Tabbed Selector, Tabbed Selector Button | `<div>` |
| `SubnavDropdown` | `subnav-dropdown/` | Navigation | Subnav Dropdown, Subnav Dropdown Options | `<nav>` |
| `Stepper` | `stepper/` | Selection & Controls | Stepper CTA, Stepper Control, Increase-Decrease Buttons | `<div>` |
| `Pagination` | `pagination/` | Selection & Controls | Next-Previous Buttons, Next-Previous Selector, Slider page selector, Slider Scroll Bar | `<nav>` |
| `Toast` | `toast/` | Feedback & Overlays | Toast Bar | `<output>` |

### Compositions (9)

| Component | Directory | Category | Figma Sources | HTML |
|-----------|-----------|----------|---------------|------|
| `Modal` | `modal/` | Feedback & Overlays | Modal Dialog, Modal Button Group | `<dialog>` |
| `Accordion` | `accordion/` | Content Layout | Accordion Section, Expand-Collapse Button | `<details>` |
| `EmailCapture` | `email-capture/` | Data Entry | Email Capture | `<form>` |
| `FileUpload` | `file-upload/` | Data Entry | Upload Image Area | `<input[type=file]>` |
| `SelectionGroup` | `selection-group/` | Selection & Controls | Toggle Switch (text), Multi-Select with Text, Multi-Selector, Text Toggle Selector, Single Select Box | `<div>` |
| `ButtonGroup` | `button-group/` | Actions | Button group, CTA Row | `<div>` |
| `ProductCard` | `product-card/` | Product | Product Grid Card | `<article>` |
| `ProductDetail` | `product-detail/` | Product | Product Content, Product Lineup—Single | `<article>` |
| `FreeTrialCard` | `free-trial-card/` | Product | Free Trial Card | `<article>` |

### Builder Blocks (4)

| Component | Directory | Category | Figma Sources | HTML |
|-----------|-----------|----------|---------------|------|
| `SectionLayout` | `section-layout/` | Content Layout | Section Headline, Section Headline with CTA, Text Section, Text Section with Button Group | `<section>` |
| `ProductCarousel` | `product-carousel/` | Product | Carousel Product | `<section>` |
| `CtaList` | `cta-list/` | Product | Multi-CTA List | `<ul>` |
| `BasicForm` | `basic-form/` | Data Entry | Basic Form | `<form>` |

## B · Prop API Conventions

These conventions come from `CommerceComponents/.github/copilot-instructions.md` and `BuilderIoBestPractices.mdx`.


### `variant` — Visual hierarchy
Describes **what the variant is**, never how it looks. No color words.

| Value | Meaning |
|-------|---------|
| `primary` | Highest visual prominence, main CTA |
| `secondary` | Supporting action |
| `tertiary` | Low-emphasis, ghost-style action |
| `arrow-link` | Inline navigational link with arrow |
| `icon-only` | No label, icon carries meaning |
| `floating` | FAB — fixed/absolute positioned |

Surface suffixes append to variant values when needed:
- `primary-inverse` — primary on a dark/inverted surface
- `primary-brand` — primary on the brand blue surface

Semantic variants for status-bearing components:
- `success`, `warning`, `error`, `info`

---

### `scale` — Size
Always a **separate prop** from `variant`. Never encode size in the variant name.

| Value | Token reference |
|-------|-----------------|
| `sm` | `--cc-scale-sm` |
| `md` | `--cc-scale-md` (default) |
| `lg` | `--cc-scale-lg` |

---

### `state` — Interaction state
Map Figma `State=` axis values to these prop values. States are typically internal (controlled via CSS) but exposed as a prop for Storybook testing.

`default` | `hover` | `focus` | `active` | `disabled` | `error` | `success` | `filled` | `loading`

---

### CSS class prefix
All components use the `cc-` prefix: `cc-button`, `cc-input`, `cc-product-card`.

## C · Figma Axis → Code Prop Mapping

How Figma property axes translate to React component props.

| Figma Axis | Figma Values (examples) | Code Prop | Code Values |
|------------|------------------------|-----------|-------------|
| `Type` | `CTA (Default)`, `Secondary CTA` | `variant` | `primary`, `secondary` |
| `Type` | `Solid`, `Outline`, `Ghost` | `variant` | `primary`, `secondary`, `tertiary` (semantic, not appearance) |
| `Size` | `Large`, `Medium`, `Small` | `scale` | `lg`, `md`, `sm` |
| `State` | `Default`, `Hover`, `Disabled` | `state` (or CSS) | `default`, `hover`, `disabled` |
| `State` | `Error`, `Success` | `state` | `error`, `success` |
| `Background` | `Light`, `Dark`, `Logos Blue` | `variant` suffix | `primary`, `primary-inverse`, `primary-brand` |
| `Direction` | `Left`, `Right`, `Next`, `Previous` | `iconPosition` | `leading`, `trailing` |
| `Style` | `Checkbox`, `Radio` | `type` | `checkbox`, `radio` |
| `Responsive` | `Desktop`, `Tablet`, `Mobile` | CSS only | handled via CSS breakpoints, not a prop |

## D · Token Naming Rules


### Token format
`{tier}-{category}-{variant}-{property}`

- **Primitive tier:** no prefix — raw values: `logos-blue-500`, `spacing-4`
- **Semantic tier:** category prefix — `color-brand-primary`, `spacing-h-md`, `shadow-elevation-1`
- **Component tier:** `component-{name}-{property}` — `component-button-padding-horizontal`
- **All kebab-case.** No camelCase.

### Examples

| Figma Variable | CSS Variable | DTCG Tier |
|----------------|-------------|-----------|
| `Primary/Logos Blue` | `--cc-color-brand-primary` | Semantic |
| `Deep Colors/Green` | `--cc-color-feedback-success` | Semantic |
| `Spacing | Horizontal/MD` | `--cc-spacing-h-md` | Semantic |
| `Spacing | In Component/CTA Button | Horizontal` | `--cc-component-button-padding-horizontal` | Component |

## E · Directory Structure

Each code component gets its own directory under `packages/commerce-components/src/components/`.

```
packages/commerce-components/src/components/
  button/
    component.tsx    # React component — zero Builder.io imports
    register.tsx     # Builder.io registration, inputs, defaults
    component.test.tsx
    index.ts         # barrel: export { Button } from "./component"
  input/
    component.tsx
    register.tsx
    component.test.tsx
    index.ts
  # ... one directory per code component
```

> **Rule:** `component.tsx` must not import anything from `@builder.io/*`. Builder.io concerns live exclusively in `register.tsx`.

## F · Full Figma → Code Mapping

Every Figma frame and the code component it maps to.

| Figma Frame | Code Component | Tier | CSS Class | Key Props |
|-------------|----------------|------|-----------|-----------|
| Accordion Section | `Accordion` | Composition | `cc-accordion` | `state`, `variant` |
| Badges and Tags | `Badge` | Primitive | `cc-badge` | `variant`, `scale` |
| Basic Form | `BasicForm` | Builder Block | `cc-basic-form` | — |
| Breadcrumbs | `Breadcrumbs` | Primitive | `cc-breadcrumbs` | `scale` |
| Button | `Button` | Primitive | `cc-button` | `variant`, `scale`, `state` |
| Button group | `ButtonGroup` | Composition | `cc-button-group` | `layout`, `align` |
| Button Menu | `Menu` | Primitive | `cc-menu` | `variant`, `state` |
| Carousel Product | `ProductCarousel` | Builder Block | `cc-product-carousel` | `scale` |
| Category Button | `Button` | Primitive | `cc-button` | `variant`, `scale`, `state` |
| Checkbox | `Checkbox` | Primitive | `cc-checkbox` | `state` |
| Close Button | `IconButton` | Primitive | `cc-icon-button` | `variant`, `scale`, `state` |
| CTA Row | `ButtonGroup` | Composition | `cc-button-group` | `layout`, `align` |
| Dropdown | `Select` | Primitive | `cc-select` | `variant`, `scale`, `state` |
| Email Capture | `EmailCapture` | Composition | `cc-email-capture` | `scale`, `state` |
| Expand-Collapse Button | `Accordion` | Composition | `cc-accordion` | `state`, `variant` |
| Floating Action Button | `IconButton` | Primitive | `cc-icon-button` | `variant`, `scale`, `state` |
| Floating Action Button with Text | `Button` | Primitive | `cc-button` | `variant`, `scale`, `state` |
| Form Dropdown | `Select` | Primitive | `cc-select` | `variant`, `scale`, `state` |
| Form Dropdown Option | `Select` | Primitive | `cc-select` | `variant`, `scale`, `state` |
| Free Trial Card | `FreeTrialCard` | Composition | `cc-free-trial-card` | — |
| Image Ratios | — | — | — | — |
| Increase-Decrease Buttons | `Stepper` | Primitive | `cc-stepper` | `variant`, `scale`, `state` |
| List | — | — | — | — |
| Modal Button Group | `Modal` | Composition | `cc-modal` | `variant` |
| Modal Dialog | `Modal` | Composition | `cc-modal` | `variant` |
| Multi-CTA List | `CtaList` | Builder Block | `cc-cta-list` | — |
| Multi-Select with Text | `SelectionGroup` | Composition | `cc-selection-group` | `type`, `layout` |
| Multi-Selector | `SelectionGroup` | Composition | `cc-selection-group` | `type`, `layout` |
| Next-Previous Buttons | `Pagination` | Primitive | `cc-pagination` | `variant`, `scale`, `state` |
| Next-Previous Selector | `Pagination` | Primitive | `cc-pagination` | `variant`, `scale`, `state` |
| Play Button | `IconButton` | Primitive | `cc-icon-button` | `variant`, `scale`, `state` |
| Price and Label | `PriceLabel` | Primitive | `cc-price-label` | `variant`, `scale` |
| Product Content | `ProductDetail` | Composition | `cc-product-detail` | `variant` |
| Product Grid Card | `ProductCard` | Composition | `cc-product-card` | `scale` |
| Product Images | — | — | — | — |
| Product Lineup—Single | `ProductDetail` | Composition | `cc-product-detail` | `variant` |
| Radio Button | `RadioButton` | Primitive | `cc-radio-button` | `state` |
| Reviews | `StarRating` | Primitive | `cc-star-rating` | `variant`, `scale` |
| Sale Percentage | `Badge` | Primitive | `cc-badge` | `variant`, `scale` |
| Search Field | `Input` | Primitive | `cc-input` | `type`, `scale`, `state` |
| Section Headline | `SectionLayout` | Builder Block | `cc-section-layout` | `variant` |
| Section Headline with CTA | `SectionLayout` | Builder Block | `cc-section-layout` | `variant` |
| Simple Menu | `Menu` | Primitive | `cc-menu` | `variant`, `state` |
| Single Select Box | `SelectionGroup` | Composition | `cc-selection-group` | `type`, `layout` |
| Slider | `Slider` | Primitive | `cc-slider` | `state` |
| Slider page selector | `Pagination` | Primitive | `cc-pagination` | `variant`, `scale`, `state` |
| Slider Scroll Bar | `Pagination` | Primitive | `cc-pagination` | `variant`, `scale`, `state` |
| Star | `StarRating` | Primitive | `cc-star-rating` | `variant`, `scale` |
| Stateful Action Button | `Button` | Primitive | `cc-button` | `variant`, `scale`, `state` |
| Stepper Control | `Stepper` | Primitive | `cc-stepper` | `variant`, `scale`, `state` |
| Stepper CTA | `Stepper` | Primitive | `cc-stepper` | `variant`, `scale`, `state` |
| Subnav Dropdown | `SubnavDropdown` | Primitive | `cc-subnav-dropdown` | `variant`, `state` |
| Subnav Dropdown Options | `SubnavDropdown` | Primitive | `cc-subnav-dropdown` | `variant`, `state` |
| Switch | `Toggle` | Primitive | `cc-toggle` | `variant`, `state` |
| Tabbed Selector | `Tabs` | Primitive | `cc-tabs` | `variant`, `scale`, `state` |
| Tabbed Selector Button | `Tabs` | Primitive | `cc-tabs` | `variant`, `scale`, `state` |
| Text Button—Icon Left | `LinkButton` | Primitive | `cc-link-button` | `variant`, `iconPosition`, `scale`, `state` |
| Text Button—Icon Right | `LinkButton` | Primitive | `cc-link-button` | `variant`, `iconPosition`, `scale`, `state` |
| Text Input (name, two fields) | `TextInputGroup` | Primitive | `cc-text-input-group` | `scale` |
| Text Input (single line) | `Input` | Primitive | `cc-input` | `type`, `scale`, `state` |
| Text Input—Date | `Input` | Primitive | `cc-input` | `type`, `scale`, `state` |
| Text Input—Multiline | `Textarea` | Primitive | `cc-textarea` | `scale`, `state` |
| Text Input—Password | `Input` | Primitive | `cc-input` | `type`, `scale`, `state` |
| Text Section | `SectionLayout` | Builder Block | `cc-section-layout` | `variant` |
| Text Section with Button Group | `SectionLayout` | Builder Block | `cc-section-layout` | `variant` |
| Text Toggle Selector | `SelectionGroup` | Composition | `cc-selection-group` | `type`, `layout` |
| Text Toggle Selector | `SelectionGroup` | Composition | `cc-selection-group` | `type`, `layout` |
| Toast Bar | `Toast` | Primitive | `cc-toast` | `variant` |
| Toggle Switch (text) | `SelectionGroup` | Composition | `cc-selection-group` | `type`, `layout` |
| Toggle with Text | `Toggle` | Primitive | `cc-toggle` | `variant`, `state` |
| Upload Image Area | `FileUpload` | Composition | `cc-file-upload` | `state` |

---
*Generated by `build-inventory.ts`*
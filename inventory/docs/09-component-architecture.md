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
Describes **what the variant is**, never how it looks. No color or appearance words.

The established hierarchy in `CommerceComponents` is `primary` > `secondary`. A `tertiary` level can be added when a third tier of emphasis is needed. Hierarchy levels follow decreasing visual prominence — never use color words like `blue`, `dark`, or `filled`.

Surface context is expressed as a suffix on the base variant, not as a separate prop:
- `primary-inverse` — primary on a dark/inverted surface
- `primary-brand` — primary on the brand blue surface
- `secondary-inverse`, `secondary-brand` — same pattern for secondary

For status-bearing components (toast, badge, alert), use semantic variants instead:
`success` | `warning` | `error` | `info`

See **doc 12** for the specific `variant` values defined for each component.

---

### `scale` — Size
Always a **separate prop** from `variant`. Never encode size in the variant name.

| Value | Typical spacing classes | Theme tokens |
|-------|-------------------------|:-------------|
| `sm` | `py-sp6 px-sp12` | `--theme-spacing-sp6`, `--theme-spacing-sp12` |
| `md` | `py-sp14 px-sp16` (default) | `--theme-spacing-sp14`, `--theme-spacing-sp16` |
| `lg` | `py-sp20 px-sp48` | `--theme-spacing-sp20`, `--theme-spacing-sp48` |

---

### `state` — Interaction state
Map Figma `State=` axis values to these prop values. States are typically internal (driven by CSS `:hover`, `:focus`, etc.) but exposed as a prop for Storybook testing and forced-state stories.

`default` | `hover` | `focus` | `active` | `disabled` | `error` | `success` | `filled` | `loading`

---

### Styling approach
Components use **Tailwind utility classes** via the `cn()` helper, not component-scoped CSS classes. Always apply `tw-preflight` on the outermost root element to establish a CSS reset boundary.

```tsx
<div className={cn('tw-preflight', 'flex gap-sp12 bg-primary text-white', className)}>
```

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

| Figma Variable | CSS Variable (`--theme-*`) | Tailwind Class | DTCG Tier |
|----------------|---------------------------|----------------|-----------|
| `Primary/Logos Blue` | `--theme-colors-primary-c300-hex` | `bg-primary`, `text-primary`, `border-primary` | Semantic |
| `Deep Colors/Green` | `--theme-colors-success-base-hex` | `bg-success`, `text-success` | Semantic |
| `Spacing \| Horizontal/MD` | `--theme-spacing-sp16` | `px-sp16`, `gap-sp16` | Semantic |
| `Spacing \| In Component/CTA Button` | `--theme-spacing-sp14` | `py-sp14 px-sp16` | Component |

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

| Figma Frame | Code Component | Tier | Directory | Key Props |
|-------------|----------------|------|-----------|-----------|
| Accordion Section | `Accordion` | Composition | `accordion/` | `state`, `variant` |
| Badges and Tags | `Badge` | Primitive | `badge/` | `variant`, `scale` |
| Basic Form | `BasicForm` | Builder Block | `basic-form/` | — |
| Breadcrumbs | `Breadcrumbs` | Primitive | `breadcrumbs/` | `scale` |
| Button | `Button` | Primitive | `button/` | `variant`, `scale`, `state` |
| Button group | `ButtonGroup` | Composition | `button-group/` | `layout`, `align` |
| Button Menu | `Menu` | Primitive | `menu/` | `variant`, `state` |
| Carousel Product | `ProductCarousel` | Builder Block | `product-carousel/` | `scale` |
| Category Button | `Button` | Primitive | `button/` | `variant`, `scale`, `state` |
| Checkbox | `Checkbox` | Primitive | `checkbox/` | `state` |
| Close Button | `IconButton` | Primitive | `icon-button/` | `variant`, `scale`, `state` |
| CTA Row | `ButtonGroup` | Composition | `button-group/` | `layout`, `align` |
| Dropdown | `Select` | Primitive | `select/` | `variant`, `scale`, `state` |
| Email Capture | `EmailCapture` | Composition | `email-capture/` | `scale`, `state` |
| Expand-Collapse Button | `Accordion` | Composition | `accordion/` | `state`, `variant` |
| Floating Action Button | `IconButton` | Primitive | `icon-button/` | `variant`, `scale`, `state` |
| Floating Action Button with Text | `Button` | Primitive | `button/` | `variant`, `scale`, `state` |
| Form Dropdown | `Select` | Primitive | `select/` | `variant`, `scale`, `state` |
| Form Dropdown Option | `Select` | Primitive | `select/` | `variant`, `scale`, `state` |
| Free Trial Card | `FreeTrialCard` | Composition | `free-trial-card/` | — |
| Image Ratios | — | — | — | — |
| Increase-Decrease Buttons | `Stepper` | Primitive | `stepper/` | `variant`, `scale`, `state` |
| List | — | — | — | — |
| Modal Button Group | `Modal` | Composition | `modal/` | `variant` |
| Modal Dialog | `Modal` | Composition | `modal/` | `variant` |
| Multi-CTA List | `CtaList` | Builder Block | `cta-list/` | — |
| Multi-Select with Text | `SelectionGroup` | Composition | `selection-group/` | `type`, `layout` |
| Multi-Selector | `SelectionGroup` | Composition | `selection-group/` | `type`, `layout` |
| Next-Previous Buttons | `Pagination` | Primitive | `pagination/` | `variant`, `scale`, `state` |
| Next-Previous Selector | `Pagination` | Primitive | `pagination/` | `variant`, `scale`, `state` |
| Play Button | `IconButton` | Primitive | `icon-button/` | `variant`, `scale`, `state` |
| Price and Label | `PriceLabel` | Primitive | `price-label/` | `variant`, `scale` |
| Product Content | `ProductDetail` | Composition | `product-detail/` | `variant` |
| Product Grid Card | `ProductCard` | Composition | `product-card/` | `scale` |
| Product Images | — | — | — | — |
| Product Lineup—Single | `ProductDetail` | Composition | `product-detail/` | `variant` |
| Radio Button | `RadioButton` | Primitive | `radio-button/` | `state` |
| Reviews | `StarRating` | Primitive | `star-rating/` | `variant`, `scale` |
| Sale Percentage | `Badge` | Primitive | `badge/` | `variant`, `scale` |
| Search Field | `Input` | Primitive | `input/` | `type`, `scale`, `state` |
| Section Headline | `SectionLayout` | Builder Block | `section-layout/` | `variant` |
| Section Headline with CTA | `SectionLayout` | Builder Block | `section-layout/` | `variant` |
| Simple Menu | `Menu` | Primitive | `menu/` | `variant`, `state` |
| Single Select Box | `SelectionGroup` | Composition | `selection-group/` | `type`, `layout` |
| Slider | `Slider` | Primitive | `slider/` | `state` |
| Slider page selector | `Pagination` | Primitive | `pagination/` | `variant`, `scale`, `state` |
| Slider Scroll Bar | `Pagination` | Primitive | `pagination/` | `variant`, `scale`, `state` |
| Star | `StarRating` | Primitive | `star-rating/` | `variant`, `scale` |
| Stateful Action Button | `Button` | Primitive | `button/` | `variant`, `scale`, `state` |
| Stepper Control | `Stepper` | Primitive | `stepper/` | `variant`, `scale`, `state` |
| Stepper CTA | `Stepper` | Primitive | `stepper/` | `variant`, `scale`, `state` |
| Subnav Dropdown | `SubnavDropdown` | Primitive | `subnav-dropdown/` | `variant`, `state` |
| Subnav Dropdown Options | `SubnavDropdown` | Primitive | `subnav-dropdown/` | `variant`, `state` |
| Switch | `Toggle` | Primitive | `toggle/` | `variant`, `state` |
| Tabbed Selector | `Tabs` | Primitive | `tabs/` | `variant`, `scale`, `state` |
| Tabbed Selector Button | `Tabs` | Primitive | `tabs/` | `variant`, `scale`, `state` |
| Text Button—Icon Left | `LinkButton` | Primitive | `link-button/` | `variant`, `iconPosition`, `scale`, `state` |
| Text Button—Icon Right | `LinkButton` | Primitive | `link-button/` | `variant`, `iconPosition`, `scale`, `state` |
| Text Input (name, two fields) | `TextInputGroup` | Primitive | `text-input-group/` | `scale` |
| Text Input (single line) | `Input` | Primitive | `input/` | `type`, `scale`, `state` |
| Text Input—Date | `Input` | Primitive | `input/` | `type`, `scale`, `state` |
| Text Input—Multiline | `Textarea` | Primitive | `textarea/` | `scale`, `state` |
| Text Input—Password | `Input` | Primitive | `input/` | `type`, `scale`, `state` |
| Text Section | `SectionLayout` | Builder Block | `section-layout/` | `variant` |
| Text Section with Button Group | `SectionLayout` | Builder Block | `section-layout/` | `variant` |
| Text Toggle Selector | `SelectionGroup` | Composition | `selection-group/` | `type`, `layout` |
| Text Toggle Selector | `SelectionGroup` | Composition | `selection-group/` | `type`, `layout` |
| Toast Bar | `Toast` | Primitive | `toast/` | `variant` |
| Toggle Switch (text) | `SelectionGroup` | Composition | `selection-group/` | `type`, `layout` |
| Toggle with Text | `Toggle` | Primitive | `toggle/` | `variant`, `state` |
| Upload Image Area | `FileUpload` | Composition | `file-upload/` | `state` |

---
*Generated by `build-inventory.ts`*
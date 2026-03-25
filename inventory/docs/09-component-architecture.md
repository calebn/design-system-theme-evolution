# 09 · Component Architecture

> React-first component architecture: multiple Figma frames collapse into semantic code components with typed props.
> Builder.io registration is always in a separate `register.tsx` file — never in `component.tsx`.

## A · Code Components

50 code components derived from 71 Figma frames.

### Primitives (23)

| Component | Directory | Category | Figma Sources | HTML | Justification |
|-----------|-----------|----------|---------------|------|---------------|
| `Button` | `button/` | Actions | [Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-3480) | `<button>` | Core labelled button — primary, secondary, tertiary hierarchy. FloatingActionButton and StatefulButton are separate compositions with distinct APIs. |
| `IconButton` | `icon-button/` | Actions | [Floating Action Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4908) | `<button>` | Visual shape primitive for icon-only buttons; accepts any icon as children. Wrapper compositions (CloseButton, ExpandCollapseButton, etc.) compose this for fixed-icon use cases. |
| `LinkButton` | `link-button/` | Actions | [Text Button—Icon Left](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5762-102995), [Text Button—Icon Right](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4782) | `<a>` | Both are anchor links with inline text + icon; icon position (leading vs trailing) is the only layout axis |
| `Input` | `input/` | Data Entry | [Text Input (single line)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5130), [Text Input—Date](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5660), [Text Input—Password](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5741), [Search Field](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5874) | `<input>` | All single-line text inputs; HTML type attribute distinguishes text, date, password, and search variants |
| `Textarea` | `textarea/` | Data Entry | [Text Input—Multiline](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5422) | `<textarea>` | Single multi-line text input; no grouping needed |
| `Select` | `select/` | Data Entry | [Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5473), [Form Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5532), [Form Dropdown Option](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2015-39220) | `<select>` | All select dropdown elements; Form Dropdown adds label + border for form context |
| `Checkbox` | `checkbox/` | Data Entry | [Checkbox](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5118), [Single Select Box](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=4543-14867) | `<input[type=checkbox]>` | Both are input[type=checkbox] with label; Single Select Box is a long-text usage pattern of the same element |
| `RadioButton` | `radio-button/` | Data Entry | [Radio Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5243) | `<input[type=radio]>` | Single input[type=radio] element; error state belongs to parent RadioGroup |
| `Switch` | `switch/` | Selection & Controls | [Switch](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5125), [Toggle with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5311) | `<input[type=checkbox]>` | Both are role="switch" controls; Toggle with Text is the same switch plus an inline text label |
| `ToggleGroup` | `toggle-group/` | Selection & Controls | [Toggle Switch (text)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5340) | `<div>` | Segmented control for mutually exclusive option selection; Radix ToggleGroup provides ARIA and keyboard nav |
| `Slider` | `slider/` | Data Entry | [Slider](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5807) | `<input[type=range]>` | Single input[type=range] element with a numeric value display |
| `Badge` | `badge/` | Data Display | [Badges and Tags](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1773-12115) | `<span>` | Inline promotional pills and countdown timers share the same compact inline display pattern |
| `SaleCallout` | `sale-callout/` | Data Display | [Sale Percentage](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5173-41321) | `<div>` | Large display-heading promotional text; visually and structurally distinct from small inline Badge elements |
| `StarRating` | `star-rating/` | Data Display | [Star](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9407), [Reviews](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9371) | `<div>` | Star is the atomic icon unit; Reviews is the full rating row — one component renders both |
| `PriceLabel` | `price-label/` | Data Display | [Price and Label](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=3707-42767) | `<span>` | Single price display element; sale/value/subscription are all formatting variants of the same data |
| `Breadcrumbs` | `breadcrumbs/` | Navigation | [Breadcrumbs](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4917) | `<nav>` | Single breadcrumb navigation trail |
| `Menu` | `menu/` | Navigation | [Simple Menu](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4958), [Button Menu](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5096) | `<nav>` | Both are dropdown menu triggers; simple = text links, button = pill-shaped — same interaction, different visual treatment |
| `Tabs` | `tabs/` | Navigation | [Tabbed Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76540), [Tabbed Selector Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2532-76553) | `<div>` | Container and individual tab item are inseparable parts of one Radix Tabs primitive |
| `SubnavDropdown` | `subnav-dropdown/` | Navigation | [Subnav Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=6331-34404), [Subnav Dropdown Options](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=6331-34528) | `<nav>` | Trigger and options list are parts of one dropdown navigation; both required for the full interaction |
| `QuantityInput` | `quantity-input/` | Data Entry | [Stepper Control](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5401) | `<div>` | Single +/- quantity picker control; split from AddToCart which is a higher-level composition |
| `Pagination` | `pagination/` | Selection & Controls | [Next-Previous Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1758-5088) | `<nav>` | Single numbered/dot page selector with prev/next controls; distinct from ScrollBar which is a raw scroll position indicator |
| `ScrollBar` | `scroll-bar/` | Selection & Controls | [Slider Scroll Bar](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2245-93685) | `<div>` | Single scroll position indicator; Slider page selector is a layout composition of ScrollBar + Pagination and is unmapped |
| `Toast` | `toast/` | Feedback & Overlays | [Toast Bar](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-8729) | `<div>` | Single notification bar; dynamic ARIA role per severity (Radix Toast) |

### Compositions (23)

| Component | Directory | Category | Figma Sources | HTML | Justification |
|-----------|-----------|----------|---------------|------|---------------|
| `AddToCart` | `add-to-cart/` | Actions | [Stepper CTA](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5773-64162) | `<div>` | Multi-stage add-to-cart flow (CTA → quantity picker → in-cart confirmation); deferred pending design finalization |
| `Modal` | `modal/` | Feedback & Overlays | [Modal Dialog](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5787-116045), [Modal Button Group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5762-105611) | `<dialog>` | Dialog content and footer button row are inseparable parts of one dialog element (Radix Dialog) |
| `Accordion` | `accordion/` | Content Layout | [Accordion Section](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1859-51731) | `<details>` | Single expandable section with title trigger and body content (Radix Accordion) |
| `EmailCapture` | `email-capture/` | Data Entry | [Email Capture](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5925) | `<form>` | Single inline email form with embedded submit action; input and button are too coupled to split |
| `FileUpload` | `file-upload/` | Data Entry | [Upload Image Area](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5327) | `<input[type=file]>` | Single drag-and-drop / click-to-browse file upload zone |
| `RadioGroup` | `radio-group/` | Data Entry | [Multi-Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5614), [Multi-Select with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5250) | `<fieldset>` | Both show grouped radio options with fieldset wrapper; list vs inline are layout variants (Radix RadioGroup) |
| `CheckboxGroup` | `checkbox-group/` | Data Entry | [Multi-Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5614), [Multi-Select with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5250) | `<fieldset>` | Both show grouped checkbox options in a fieldset; list vs inline are layout variants of the same control |
| `ButtonGroup` | `button-group/` | Actions | [Button group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5083) | `<div>` | Groups 2-4 side-by-side action buttons; horizontal alignment with optional description text below |
| `CtaRow` | `cta-row/` | Actions | [CTA Row](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2769-25152) | `<a>` | Full-width link row with arrow icon; structurally a navigational link, not a button group |
| `FormField` | `form-field/` | Data Entry | [Text Toggle Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5653) | `<div>` | Generic label + error wrapper for any child control (Chakra FormControl / shadcn FormField pattern); Text Toggle Selector frames are usage examples |
| `FormRow` | `form-row/` | Data Entry | [Text Input (name, two fields)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2758-3449) | `<div>` | Multi-column form field row; 2-column is the only Figma-evidenced layout — extensible to 3-4 columns when more patterns emerge |
| `Chip` | `chip/` | Actions | [Category Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1935-4111) | `<button>` | Filter-chip pattern on top of Button; Category Button uses pill shape and icon+label API not shared by general Button (MUI Chip convention) |
| `CloseButton` | `close-button/` | Actions | [Close Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4757) | `<button>` | Fixed-icon IconButton wrapper; always renders ClearIcon — separate from IconButton which accepts any icon as children |
| `PlayButton` | `play-button/` | Actions | [Play Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1864-94164) | `<button>` | Fixed-icon IconButton wrapper; always renders PlayIcon — separate from IconButton which accepts any icon as children |
| `ExpandCollapseButton` | `expand-collapse-button/` | Actions | [Expand-Collapse Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4708) | `<button>` | Fixed-icon IconButton wrapper with aria-expanded behavior; icon rotation and ARIA semantics require component-level logic not present in base IconButton |
| `IncrementButton` | `increment-button/` | Actions | [Increase-Decrease Buttons](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4610) | `<button>` | Fixed-icon IconButton wrapper; action prop selects IncreaseIcon or DecreaseIcon — used inside QuantityInput composition |
| `NavigateButton` | `navigate-button/` | Actions | [Next-Previous Buttons](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4561) | `<button>` | Fixed-icon IconButton wrapper; action prop selects RightIcon or LeftIcon — similar to NextPreviousButton but for inline carousel navigation without surface variants |
| `FloatingActionButton` | `floating-action-button/` | Actions | [Floating Action Button with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5650-121531) | `<button>` | Pill-shaped variant of Button with mandatory icon; distinct visual treatment not shared with rectangular Button |
| `StatefulButton` | `stateful-button/` | Actions | [Stateful Action Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=7538-45104) | `<button>` | Loading and success state transitions require internal state management not present in base Button |
| `ProductCard` | `product-card/` | Product | [Product Grid Card](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1982-24943) | `<article>` | Single grid product card — badge, image, title, rating, price, CTA |
| `ProductDetail` | `product-detail/` | Product | [Product Content](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1949-59922) | `<article>` | Single full-detail product view; distinct from card (grid listing) and ProductLineup (hero showcase) |
| `ProductLineup` | `product-lineup/` | Product | [Product Lineup—Single](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1949-49395) | `<article>` | Hero product showcase with distinct layout and responsive variants; not a detail view or grid card |
| `FreeTrialCard` | `free-trial-card/` | Product | [Free Trial Card](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1880-108955) | `<article>` | Single pricing/trial card with plan name, price, CTA button, and feature checklist |

### Builder Blocks (4)

| Component | Directory | Category | Figma Sources | HTML | Justification |
|-----------|-----------|----------|---------------|------|---------------|
| `SectionLayout` | `section-layout/` | Content Layout | [Section Headline](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76419), [Section Headline with CTA](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2457-71522), [Text Section](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76369), [Text Section with Button Group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9202) | `<section>` | All are full-width section blocks with a headline; variants progressively add CTA link, body copy, and button group |
| `ProductCarousel` | `product-carousel/` | Product | [Carousel Product](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2262-261677) | `<section>` | Single horizontally scrolling product card container backed by API data |
| `CtaList` | `cta-list/` | Product | [Multi-CTA List](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2769-25078) | `<ul>` | Single vertical list of CTA link rows with arrow icons |
| `BasicForm` | `basic-form/` | Data Entry | [Basic Form](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2761-34608) | `<form>` | Generic form shell with field layout managed entirely via Builder.io slot content |

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
| [Accordion Section](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1859-51731) | `Accordion` | Composition | `accordion/` | `state`, `variant` |
| [Badges and Tags](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1773-12115) | `Badge` | Primitive | `badge/` | `variant`, `scale` |
| [Basic Form](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2761-34608) | `BasicForm` | Builder Block | `basic-form/` | — |
| [Breadcrumbs](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4917) | `Breadcrumbs` | Primitive | `breadcrumbs/` | `scale` |
| [Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-3480) | `Button` | Primitive | `button/` | `variant`, `scale`, `state` |
| [Button group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5083) | `ButtonGroup` | Composition | `button-group/` | `layout`, `align` |
| [Button Menu](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5096) | `Menu` | Primitive | `menu/` | `variant`, `state` |
| [Carousel Product](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2262-261677) | `ProductCarousel` | Builder Block | `product-carousel/` | `scale` |
| [Category Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1935-4111) | `Chip` | Composition | `chip/` | `selected`, `state` |
| [Checkbox](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5118) | `Checkbox` | Primitive | `checkbox/` | `state` |
| [Close Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4757) | `CloseButton` | Composition | `close-button/` | `scale` |
| [CTA Row](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2769-25152) | `CtaRow` | Composition | `cta-row/` | `state` |
| [Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5473) | `Select` | Primitive | `select/` | `variant`, `scale`, `state` |
| [Email Capture](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5925) | `EmailCapture` | Composition | `email-capture/` | `scale`, `state` |
| [Expand-Collapse Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4708) | `ExpandCollapseButton` | Composition | `expand-collapse-button/` | `expanded`, `scale` |
| [Floating Action Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4908) | `IconButton` | Primitive | `icon-button/` | `variant`, `scale` |
| [Floating Action Button with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5650-121531) | `FloatingActionButton` | Composition | `floating-action-button/` | `scale`, `state` |
| [Form Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5532) | `Select` | Primitive | `select/` | `variant`, `scale`, `state` |
| [Form Dropdown Option](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2015-39220) | `Select` | Primitive | `select/` | `variant`, `scale`, `state` |
| [Free Trial Card](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1880-108955) | `FreeTrialCard` | Composition | `free-trial-card/` | — |
| [Image Ratios](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=4450-79904) | — | — | — | — |
| [Increase-Decrease Buttons](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4610) | `IncrementButton` | Composition | `increment-button/` | `action`, `scale` |
| [List](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1874-101886) | — | — | — | — |
| [Modal Button Group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5762-105611) | `Modal` | Composition | `modal/` | `variant` |
| [Modal Dialog](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5787-116045) | `Modal` | Composition | `modal/` | `variant` |
| [Multi-CTA List](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2769-25078) | `CtaList` | Builder Block | `cta-list/` | — |
| [Multi-Select with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5250) | `RadioGroup` | Composition | `radio-group/` | `variant`, `state` |
| [Multi-Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5614) | `RadioGroup` | Composition | `radio-group/` | `variant`, `state` |
| [Next-Previous Buttons](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4561) | `NavigateButton` | Composition | `navigate-button/` | `action`, `scale` |
| [Next-Previous Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1758-5088) | `Pagination` | Primitive | `pagination/` | `variant`, `scale`, `state` |
| [Play Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1864-94164) | `PlayButton` | Composition | `play-button/` | `scale` |
| [Price and Label](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=3707-42767) | `PriceLabel` | Primitive | `price-label/` | `variant`, `scale` |
| [Product Content](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1949-59922) | `ProductDetail` | Composition | `product-detail/` | `variant` |
| [Product Grid Card](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1982-24943) | `ProductCard` | Composition | `product-card/` | `scale` |
| [Product Images](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1946-5555) | — | — | — | — |
| [Product Lineup—Single](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1949-49395) | `ProductLineup` | Composition | `product-lineup/` | `size` |
| [Radio Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5243) | `RadioButton` | Primitive | `radio-button/` | `state` |
| [Reviews](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9371) | `StarRating` | Primitive | `star-rating/` | `variant`, `scale` |
| [Sale Percentage](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5173-41321) | `SaleCallout` | Primitive | `sale-callout/` | `scale` |
| [Search Field](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5874) | `Input` | Primitive | `input/` | `type`, `scale`, `state` |
| [Section Headline](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76419) | `SectionLayout` | Builder Block | `section-layout/` | `variant` |
| [Section Headline with CTA](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2457-71522) | `SectionLayout` | Builder Block | `section-layout/` | `variant` |
| [Simple Menu](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4958) | `Menu` | Primitive | `menu/` | `variant`, `state` |
| [Single Select Box](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=4543-14867) | `Checkbox` | Primitive | `checkbox/` | `state` |
| [Slider](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5807) | `Slider` | Primitive | `slider/` | `state` |
| [Slider page selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1756-2384) | — | — | — | — |
| [Slider Scroll Bar](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2245-93685) | `ScrollBar` | Primitive | `scroll-bar/` | `scale` |
| [Star](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9407) | `StarRating` | Primitive | `star-rating/` | `variant`, `scale` |
| [Stateful Action Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=7538-45104) | `StatefulButton` | Composition | `stateful-button/` | `state` |
| [Stepper Control](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5401) | `QuantityInput` | Primitive | `quantity-input/` | `scale`, `state` |
| [Stepper CTA](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5773-64162) | `AddToCart` | Composition | `add-to-cart/` | `stage`, `state` |
| [Subnav Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=6331-34404) | `SubnavDropdown` | Primitive | `subnav-dropdown/` | `variant`, `state` |
| [Subnav Dropdown Options](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=6331-34528) | `SubnavDropdown` | Primitive | `subnav-dropdown/` | `variant`, `state` |
| [Switch](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5125) | `Switch` | Primitive | `switch/` | `variant`, `state` |
| [Tabbed Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76540) | `Tabs` | Primitive | `tabs/` | `variant`, `scale`, `state` |
| [Tabbed Selector Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2532-76553) | `Tabs` | Primitive | `tabs/` | `variant`, `scale`, `state` |
| [Text Button—Icon Left](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5762-102995) | `LinkButton` | Primitive | `link-button/` | `href`, `variant`, `iconPosition`, `scale`, `state` |
| [Text Button—Icon Right](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4782) | `LinkButton` | Primitive | `link-button/` | `href`, `variant`, `iconPosition`, `scale`, `state` |
| [Text Input (name, two fields)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2758-3449) | `FormRow` | Composition | `form-row/` | `columns` |
| [Text Input (single line)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5130) | `Input` | Primitive | `input/` | `type`, `scale`, `state` |
| [Text Input—Date](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5660) | `Input` | Primitive | `input/` | `type`, `scale`, `state` |
| [Text Input—Multiline](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5422) | `Textarea` | Primitive | `textarea/` | `scale`, `state` |
| [Text Input—Password](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5741) | `Input` | Primitive | `input/` | `type`, `scale`, `state` |
| [Text Section](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76369) | `SectionLayout` | Builder Block | `section-layout/` | `variant` |
| [Text Section with Button Group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9202) | `SectionLayout` | Builder Block | `section-layout/` | `variant` |
| [Text Toggle Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5649) | `FormField` | Composition | `form-field/` | `label`, `required`, `error`, `description` |
| [Text Toggle Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5653) | `FormField` | Composition | `form-field/` | `label`, `required`, `error`, `description` |
| [Toast Bar](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-8729) | `Toast` | Primitive | `toast/` | `variant` |
| [Toggle Switch (text)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5340) | `ToggleGroup` | Primitive | `toggle-group/` | `size`, `state` |
| [Toggle with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5311) | `Switch` | Primitive | `switch/` | `variant`, `state` |
| [Upload Image Area](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5327) | `FileUpload` | Composition | `file-upload/` | `state` |

---
*Generated by `build-inventory.ts`*
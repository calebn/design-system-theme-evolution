# 12 · Component Surface Area

> Proposed public API for each code component: props, CSS custom properties, slots, and accessibility requirements.
> This is the **contract** between design system consumers and component authors.
> All CSS custom properties use the `--cc-` prefix. All class names use the `cc-` prefix.

## Reading This Document

| Column | Meaning |
|--------|---------|
| **Prop** | React prop name |
| **Type** | TypeScript type |
| **Default** | Default value |
| **Figma Axis** | The Figma property axis this prop maps to |
| **Description** | What the prop controls |

## Primitives (21)

---

### `Button`

**CSS class:** `cc-button` · **HTML element:** `<button>` · **Category:** Actions

**Figma sources:** Button, Category Button, Floating Action Button with Text, Stateful Action Button


> Standard labelled action button covering primary, secondary, tertiary, and stateful variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'primary' | 'secondary' | 'tertiary' | 'stateful'` | `primary` | Type | Visual hierarchy — never use color/appearance words |
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | Size — always a separate prop, never encoded in variant |
| `state` | `'default' | 'hover' | 'active' | 'disabled' | 'loading' | 'success'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-button-bg`
- `--cc-button-color`
- `--cc-button-border-color`
- `--cc-button-border-radius`
- `--cc-button-padding-x`
- `--cc-button-padding-y`
- `--cc-button-font-size`

**Accessibility requirements:**

- `role="button"` (implicit on `<button>`)
- `aria-label` when icon-only
- `aria-disabled` when disabled (do not use HTML `disabled` if you need focusability)
- `aria-pressed` for toggle-style buttons

<details><summary>Usage example</summary>

```tsx
import { Button } from '@faithlife/commerce-components';

<Button variant="primary" scale="md" state="default">
  Add to cart
</Button>
```

</details>

---

### `IconButton`

**CSS class:** `cc-icon-button` · **HTML element:** `<button>` · **Category:** Actions

**Figma sources:** Close Button, Play Button, Floating Action Button


> Icon-only button with no visible label. Requires an aria-label. Covers close, play, and floating action variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' | 'floating' | 'close' | 'play'` | `default` | Style | Semantic shape/context of the icon button |
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `state` | `'default' | 'hover' | 'active' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-icon-button-size`
- `--cc-icon-button-bg`
- `--cc-icon-button-color`
- `--cc-icon-button-border-radius`

**Accessibility requirements:**

- `aria-label` required (no visible text)
- `role="button"` (implicit on `<button>`)
- `aria-disabled` when disabled

<details><summary>Usage example</summary>

```tsx
import { IconButton } from '@faithlife/commerce-components';

<IconButton variant="close" scale="md" aria-label="Close dialog" />
```

</details>

---

### `LinkButton`

**CSS class:** `cc-link-button` · **HTML element:** `<button>` · **Category:** Actions

**Figma sources:** Text Button—Icon Left, Text Button—Icon Right


> Inline text link with an optional leading or trailing icon. Renders as an anchor or button depending on context.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' | 'arrow-link'` | `default` | Type | — |
| `iconPosition` | `'leading' | 'trailing'` | `trailing` | Type | Leading = icon left, trailing = icon right |
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `state` | `'default' | 'hover' | 'active' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-link-button-color`
- `--cc-link-button-color-hover`
- `--cc-link-button-gap`

**Accessibility requirements:**

- `aria-label` or visible text required
- If rendered as `<a>`, must have `href`
- `aria-current="page"` when marking active link

<details><summary>Usage example</summary>

```tsx
import { LinkButton } from '@faithlife/commerce-components';

<LinkButton iconPosition="trailing">Learn more</LinkButton>
```

</details>

---

### `Input`

**CSS class:** `cc-input` · **HTML element:** `<input>` · **Category:** Data Entry

**Figma sources:** Text Input (single line), Text Input—Date, Text Input—Password, Search Field


> Single-line text entry field covering all text, date, password, and search variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `type` | `'text' | 'date' | 'password' | 'search'` | `text` | Type | — |
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `state` | `'default' | 'hover' | 'focus' | 'filled' | 'disabled' | 'error' | 'success'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-input-border-color`
- `--cc-input-border-radius`
- `--cc-input-bg`
- `--cc-input-color`
- `--cc-input-placeholder-color`
- `--cc-input-focus-ring-color`

**Accessibility requirements:**

- `<label>` associated via `for`/`id` or `aria-label`
- `aria-required` when required
- `aria-invalid` + `aria-describedby` on error
- `autocomplete` attribute for common fields

<details><summary>Usage example</summary>

```tsx
import { Input } from '@faithlife/commerce-components';

<Input type="text" scale="md" placeholder="Search..." />
```

</details>

---

### `Textarea`

**CSS class:** `cc-textarea` · **HTML element:** `<textarea>` · **Category:** Data Entry

**Figma sources:** Text Input—Multiline


> Multi-line text entry field.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `state` | `'default' | 'hover' | 'focus' | 'filled' | 'disabled' | 'error'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `<label>` associated via `for`/`id` or `aria-label`
- `aria-required` when required
- `aria-invalid` + `aria-describedby` on error

<details><summary>Usage example</summary>

```tsx
import { Textarea } from '@faithlife/commerce-components';

<Textarea scale="md">{/* content */}</Textarea>
```

</details>

---

### `TextInputGroup`

**CSS class:** `cc-text-input-group` · **HTML element:** `<div>` · **Category:** Data Entry

**Figma sources:** Text Input (name, two fields)


> Two-column name-capture input (first + last).

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

<details><summary>Usage example</summary>

```tsx
import { TextInputGroup } from '@faithlife/commerce-components';

<TextInputGroup scale="md">{/* content */}</TextInputGroup>
```

</details>

---

### `Select`

**CSS class:** `cc-select` · **HTML element:** `<select>` · **Category:** Data Entry

**Figma sources:** Dropdown, Form Dropdown, Form Dropdown Option


> Dropdown select control. Covers both inline and form-embedded variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' | 'form'` | `default` | Type | Use form for label+border style in a form context |
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `state` | `'default' | 'hover' | 'focus' | 'open' | 'disabled' | 'error'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-select-border-color`
- `--cc-select-border-radius`
- `--cc-select-bg`
- `--cc-select-color`

**Accessibility requirements:**

- `<label>` associated via `for`/`id` or `aria-label`
- `aria-required` when required
- `aria-expanded` when open

<details><summary>Usage example</summary>

```tsx
import { Select } from '@faithlife/commerce-components';

<Select variant="default">{/* content */}</Select>
```

</details>

---

### `Checkbox`

**CSS class:** `cc-checkbox` · **HTML element:** `<input[type=checkbox]>` · **Category:** Data Entry

**Figma sources:** Checkbox


> Boolean checkbox input with label.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' | 'hover' | 'checked' | 'indeterminate' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-checkbox-size`
- `--cc-checkbox-border-color`
- `--cc-checkbox-checked-bg`
- `--cc-checkbox-checked-color`

**Accessibility requirements:**

- `<label>` associated
- `aria-checked` for indeterminate state
- `aria-required` when required

<details><summary>Usage example</summary>

```tsx
import { Checkbox } from '@faithlife/commerce-components';

<Checkbox state="default">{/* content */}</Checkbox>
```

</details>

---

### `RadioButton`

**CSS class:** `cc-radio-button` · **HTML element:** `<input[type=radio]>` · **Category:** Data Entry

**Figma sources:** Radio Button


> Single radio option — used inside a RadioGroup.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' | 'hover' | 'checked' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-radio-size`
- `--cc-radio-border-color`
- `--cc-radio-checked-color`

**Accessibility requirements:**

- `<fieldset>` + `<legend>` wrapping radio groups
- `aria-required` on group

<details><summary>Usage example</summary>

```tsx
import { RadioButton } from '@faithlife/commerce-components';

<RadioButton state="default">{/* content */}</RadioButton>
```

</details>

---

### `Toggle`

**CSS class:** `cc-toggle` · **HTML element:** `<input[type=checkbox]>` · **Category:** Selection & Controls

**Figma sources:** Switch, Toggle with Text


> On/off toggle switch, optionally with a text label.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' | 'with-label'` | `default` | Type | — |
| `state` | `'on' | 'off' | 'disabled'` | `off` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-toggle-track-bg`
- `--cc-toggle-thumb-bg`
- `--cc-toggle-checked-track-bg`
- `--cc-toggle-size`

**Accessibility requirements:**

- `role="switch"` with `aria-checked`
- `aria-label` describing what is toggled

<details><summary>Usage example</summary>

```tsx
import { Toggle } from '@faithlife/commerce-components';

<Toggle variant="default">{/* content */}</Toggle>
```

</details>

---

### `Slider`

**CSS class:** `cc-slider` · **HTML element:** `<input[type=range]>` · **Category:** Data Entry

**Figma sources:** Slider


> Range input slider for selecting a numeric value.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' | 'hover' | 'focus' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-label` or `<label>`

<details><summary>Usage example</summary>

```tsx
import { Slider } from '@faithlife/commerce-components';

<Slider state="default">{/* content */}</Slider>
```

</details>

---

### `Badge`

**CSS class:** `cc-badge` · **HTML element:** `<span>` · **Category:** Data Display

**Figma sources:** Badges and Tags, Sale Percentage


> Small label for tags, status indicators, and sale callouts.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' | 'sale' | 'tag' | 'info' | 'success' | 'warning' | 'error'` | `default` | Type | Use semantic variants (success/warning/error) not color words |
| `scale` | `'sm' | 'md'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-badge-bg`
- `--cc-badge-color`
- `--cc-badge-border-radius`
- `--cc-badge-font-size`

**Accessibility requirements:**

- `role="status"` if dynamic
- `aria-label` for icon-only badges

<details><summary>Usage example</summary>

```tsx
import { Badge } from '@faithlife/commerce-components';

<Badge variant="default">{/* content */}</Badge>
```

</details>

---

### `StarRating`

**CSS class:** `cc-star-rating` · **HTML element:** `<div>` · **Category:** Data Display

**Figma sources:** Star, Reviews


> Star icon for ratings, with optional count display.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'star' | 'with-count'` | `star` | Type | — |
| `scale` | `'sm' | 'md'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="img"` with `aria-label` for display-only
- `role="radiogroup"` for interactive rating

<details><summary>Usage example</summary>

```tsx
import { StarRating } from '@faithlife/commerce-components';

<StarRating variant="star">{/* content */}</StarRating>
```

</details>

---

### `PriceLabel`

**CSS class:** `cc-price-label` · **HTML element:** `<span>` · **Category:** Data Display

**Figma sources:** Price and Label


> Price display with optional original/sale price.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' | 'with-sale'` | `default` | Type | — |
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

<details><summary>Usage example</summary>

```tsx
import { PriceLabel } from '@faithlife/commerce-components';

<PriceLabel variant="default">{/* content */}</PriceLabel>
```

</details>

---

### `Breadcrumbs`

**CSS class:** `cc-breadcrumbs` · **HTML element:** `<nav>` · **Category:** Navigation

**Figma sources:** Breadcrumbs


> Hierarchical page location indicator.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' | 'md'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `<nav aria-label="Breadcrumb">`
- `aria-current="page"` on last item

<details><summary>Usage example</summary>

```tsx
import { Breadcrumbs } from '@faithlife/commerce-components';

<Breadcrumbs scale="md">{/* content */}</Breadcrumbs>
```

</details>

---

### `Menu`

**CSS class:** `cc-menu` · **HTML element:** `<nav>` · **Category:** Navigation

**Figma sources:** Simple Menu, Button Menu


> Navigation menu — simple text links or button-style items.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'simple' | 'button'` | `simple` | Type | — |
| `state` | `'default' | 'hover' | 'active' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="menu"` or `role="navigation"`
- `aria-expanded` on trigger
- `aria-haspopup` on trigger

<details><summary>Usage example</summary>

```tsx
import { Menu } from '@faithlife/commerce-components';

<Menu variant="simple">{/* content */}</Menu>
```

</details>

---

### `Tabs`

**CSS class:** `cc-tabs` · **HTML element:** `<div>` · **Category:** Navigation

**Figma sources:** Tabbed Selector, Tabbed Selector Button


> Tab bar for switching between content panels. Covers container and individual tab item.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'container' | 'item'` | `container` | Type | container is the full tab bar; item is a single tab |
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `state` | `'default' | 'hover' | 'active' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-tabs-border-color`
- `--cc-tab-active-color`
- `--cc-tab-active-border-color`

**Accessibility requirements:**

- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected` on active tab
- `aria-controls` linking tab to panel

<details><summary>Usage example</summary>

```tsx
import { Tabs } from '@faithlife/commerce-components';

<Tabs variant="container">{/* content */}</Tabs>
```

</details>

---

### `SubnavDropdown`

**CSS class:** `cc-subnav-dropdown` · **HTML element:** `<nav>` · **Category:** Navigation

**Figma sources:** Subnav Dropdown, Subnav Dropdown Options


> Sub-navigation dropdown with trigger and option list.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'trigger' | 'option'` | `trigger` | Type | — |
| `state` | `'default' | 'hover' | 'open' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

<details><summary>Usage example</summary>

```tsx
import { SubnavDropdown } from '@faithlife/commerce-components';

<SubnavDropdown variant="trigger">{/* content */}</SubnavDropdown>
```

</details>

---

### `Stepper`

**CSS class:** `cc-stepper` · **HTML element:** `<div>` · **Category:** Selection & Controls

**Figma sources:** Stepper CTA, Stepper Control, Increase-Decrease Buttons


> Quantity control with increment/decrement. Covers standalone controls and CTA-embedded variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'cta' | 'control' | 'quantity'` | `control` | Type | cta = with add-to-cart button, control = inline control, quantity = bare +/- buttons |
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `state` | `'default' | 'minimum' | 'maximum' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` on increment/decrement buttons
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on value display

<details><summary>Usage example</summary>

```tsx
import { Stepper } from '@faithlife/commerce-components';

<Stepper variant="control">{/* content */}</Stepper>
```

</details>

---

### `Pagination`

**CSS class:** `cc-pagination` · **HTML element:** `<nav>` · **Category:** Selection & Controls

**Figma sources:** Next-Previous Buttons, Next-Previous Selector, Slider page selector, Slider Scroll Bar


> Navigation controls for paging through content.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'buttons' | 'selector' | 'page' | 'scroll'` | `buttons` | Type | — |
| `scale` | `'sm' | 'md'` | `md` | Size | — |
| `state` | `'default' | 'first-page' | 'last-page' | 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-pagination-gap`
- `--cc-pagination-button-size`

**Accessibility requirements:**

- `<nav aria-label="Pagination">`
- `aria-current="page"` on current page
- `aria-label` on prev/next buttons

<details><summary>Usage example</summary>

```tsx
import { Pagination } from '@faithlife/commerce-components';

<Pagination variant="buttons">{/* content */}</Pagination>
```

</details>

---

### `Toast`

**CSS class:** `cc-toast` · **HTML element:** `<output>` · **Category:** Feedback & Overlays

**Figma sources:** Toast Bar


> Transient status notification.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'info' | 'success' | 'warning' | 'error'` | `info` | Type | Always semantic — never color words |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-toast-bg`
- `--cc-toast-color`
- `--cc-toast-border-radius`

**Accessibility requirements:**

- `role="status"` or `role="alert"` depending on urgency
- `aria-live="polite"` for non-urgent
- `aria-live="assertive"` for urgent

<details><summary>Usage example</summary>

```tsx
import { Toast } from '@faithlife/commerce-components';

<Toast variant="info">{/* content */}</Toast>
```

</details>

## Compositions (9)

---

### `Modal`

**CSS class:** `cc-modal` · **HTML element:** `<dialog>` · **Category:** Feedback & Overlays

**Figma sources:** Modal Dialog, Modal Button Group


> Dialog overlay with header, body, and action group. Content areas use BuilderBlocks.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' | 'confirmation' | 'fullscreen'` | `default` | Type | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-modal-bg`
- `--cc-modal-max-width`
- `--cc-modal-border-radius`
- `--cc-modal-overlay-bg`

**Accessibility requirements:**

- `role="dialog"` with `aria-modal="true"`
- `aria-labelledby` pointing to title
- Focus trap when open
- Escape key closes

**Slots / children:**

- `children` — primary content area
- `title` — modal heading (required for accessibility)
- `footerActions` — action buttons rendered in the footer

<details><summary>Usage example</summary>

```tsx
import { Modal } from '@faithlife/commerce-components';

<Modal title="Confirm purchase" footerActions={<Button>Confirm</Button>}>
  Are you sure you want to purchase this item?
</Modal>
```

</details>

---

### `Accordion`

**CSS class:** `cc-accordion` · **HTML element:** `<details>` · **Category:** Content Layout

**Figma sources:** Accordion Section, Expand-Collapse Button


> Expandable/collapsible section with header and body content.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'expanded' | 'collapsed'` | `collapsed` | State | — |
| `variant` | `'standalone' | 'section'` | `section` | Type | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**CSS custom properties:**

- `--cc-accordion-border-color`
- `--cc-accordion-padding`
- `--cc-accordion-trigger-color`

**Accessibility requirements:**

- `role="region"` on panel
- `aria-expanded` on trigger button
- `aria-controls` linking trigger to panel

**Slots / children:**

- `children` — primary content area
- `trigger` — the clickable header row
- `children` — the expandable panel content

<details><summary>Usage example</summary>

```tsx
import { Accordion } from '@faithlife/commerce-components';

<Accordion state="collapsed">{/* content */}</Accordion>
```

</details>

---

### `EmailCapture`

**CSS class:** `cc-email-capture` · **HTML element:** `<form>` · **Category:** Data Entry

**Figma sources:** Email Capture


> Email address input with inline submit action.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `state` | `'default' | 'focus' | 'error' | 'success'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { EmailCapture } from '@faithlife/commerce-components';

<EmailCapture scale="md">{/* content */}</EmailCapture>
```

</details>

---

### `FileUpload`

**CSS class:** `cc-file-upload` · **HTML element:** `<input[type=file]>` · **Category:** Data Entry

**Figma sources:** Upload Image Area


> Drag-and-drop / click-to-browse file upload area.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' | 'hover' | 'active' | 'uploaded' | 'error'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { FileUpload } from '@faithlife/commerce-components';

<FileUpload state="default">{/* content */}</FileUpload>
```

</details>

---

### `SelectionGroup`

**CSS class:** `cc-selection-group` · **HTML element:** `<div>` · **Category:** Selection & Controls

**Figma sources:** Toggle Switch (text), Multi-Select with Text, Multi-Selector, Text Toggle Selector, Single Select Box


> Group of mutually exclusive or multi-select options (toggles, checkboxes, radio buttons, or text tabs).

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `type` | `'toggle' | 'checkbox' | 'radio' | 'single-select'` | `toggle` | Style | Selection mode — drives the underlying input semantics |
| `layout` | `'horizontal' | 'vertical'` | `horizontal` | — | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area
- `children` — `Checkbox`, `RadioButton`, or `Toggle` elements

<details><summary>Usage example</summary>

```tsx
import { SelectionGroup } from '@faithlife/commerce-components';

<SelectionGroup type="toggle">{/* content */}</SelectionGroup>
```

</details>

---

### `ButtonGroup`

**CSS class:** `cc-button-group` · **HTML element:** `<div>` · **Category:** Actions

**Figma sources:** Button group, CTA Row


> Horizontal or vertical group of Button components for related actions.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `layout` | `'horizontal' | 'vertical'` | `horizontal` | — | — |
| `align` | `'start' | 'center' | 'end'` | `start` | — | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area
- `children` — `Button`, `LinkButton`, or `IconButton` elements

<details><summary>Usage example</summary>

```tsx
import { ButtonGroup } from '@faithlife/commerce-components';

<ButtonGroup layout="horizontal">{/* content */}</ButtonGroup>
```

</details>

---

### `ProductCard`

**CSS class:** `cc-product-card` · **HTML element:** `<article>` · **Category:** Product

**Figma sources:** Product Grid Card


> Grid-format product card with image, title, price, reviews, and actions.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { ProductCard } from '@faithlife/commerce-components';

<ProductCard scale="md">{/* content */}</ProductCard>
```

</details>

---

### `ProductDetail`

**CSS class:** `cc-product-detail` · **HTML element:** `<article>` · **Category:** Product

**Figma sources:** Product Content, Product Lineup—Single


> Full product detail display with purchase actions.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'full' | 'lineup'` | `full` | Type | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { ProductDetail } from '@faithlife/commerce-components';

<ProductDetail variant="full">{/* content */}</ProductDetail>
```

</details>

---

### `FreeTrialCard`

**CSS class:** `cc-free-trial-card` · **HTML element:** `<article>` · **Category:** Product

**Figma sources:** Free Trial Card


> Promotional card for free trial offers.

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { FreeTrialCard } from '@faithlife/commerce-components';

<FreeTrialCard>{/* content */}</FreeTrialCard>
```

</details>

## Builder Blocks (4)

---

### `SectionLayout`

**CSS class:** `cc-section-layout` · **HTML element:** `<section>` · **Category:** Content Layout

**Figma sources:** Section Headline, Section Headline with CTA, Text Section, Text Section with Button Group


> Page section with headline, body copy, and optional CTA slots. Content authors manage children via BuilderBlocks.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'headline-only' | 'headline-cta' | 'text' | 'text-buttons'` | `headline-only` | Type | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { SectionLayout } from '@faithlife/commerce-components';

<SectionLayout variant="headline-only">{/* content */}</SectionLayout>
```

</details>

---

### `ProductCarousel`

**CSS class:** `cc-product-carousel` · **HTML element:** `<section>` · **Category:** Product

**Figma sources:** Carousel Product


> Horizontally scrollable carousel of ProductCard items backed by API data.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' | 'md' | 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { ProductCarousel } from '@faithlife/commerce-components';

<ProductCarousel scale="md">{/* content */}</ProductCarousel>
```

</details>

---

### `CtaList`

**CSS class:** `cc-cta-list` · **HTML element:** `<ul>` · **Category:** Product

**Figma sources:** Multi-CTA List


> Vertical list of CTA rows, each linking to a product or resource.

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { CtaList } from '@faithlife/commerce-components';

<CtaList>{/* content */}</CtaList>
```

</details>

---

### `BasicForm`

**CSS class:** `cc-basic-form` · **HTML element:** `<form>` · **Category:** Data Entry

**Figma sources:** Basic Form


> Generic form with field layout managed via BuilderBlocks.

**Slots / children:**

- `children` — primary content area

<details><summary>Usage example</summary>

```tsx
import { BasicForm } from '@faithlife/commerce-components';

<BasicForm>{/* content */}</BasicForm>
```

</details>

---
*Generated by `build-inventory.ts`*
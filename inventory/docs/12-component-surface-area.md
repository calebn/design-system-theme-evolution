# 12 · Component Surface Area

> Proposed public API for each code component: props, Tailwind token usage, slots, and accessibility requirements.
> This is the **contract** between design system consumers and component authors.
> Styling uses **Tailwind utility classes** backed by `@faithlife/commerce-theme` tokens. Underlying CSS variables use the `--theme-*` prefix (e.g. `--theme-colors-primary-c300-hex`). There are no component-scoped CSS custom properties.

## Reading This Document

| Column | Meaning |
|--------|---------|
| **Prop** | React prop name |
| **Type** | TypeScript type |
| **Default** | Default value |
| **Figma Axis** | The Figma property axis this prop maps to |
| **Description** | What the prop controls |

## Common Conventions

These rules apply to **every** component. They are sourced from
[`copilot-instructions.md`](../../CommerceComponents/.github/copilot-instructions.md) and
[`BuilderIoBestPractices.mdx`](../../CommerceComponents/packages/commerce-components/stories/guidelines/BuilderIoBestPractices.mdx).

| Convention | Rule | Enforcement |
|------------|------|-------------|
| `tw-preflight` | Must appear on the **outermost root element** via `cn('tw-preflight', ...)`. Establishes a CSS reset boundary so Tailwind classes work in any host page. | Lint: `commerce-theme/require-tw-preflight` (presence); **code review** (placement) |
| `cn()` utility | All class composition **must** use `cn()` from `../../utils` (combines `clsx` + `tailwind-merge`). Never import `clsx` directly. | Lint: `commerce-theme/no-direct-clsx` |
| `Typography` | All text **must** use the `Typography` component. Raw `<h1>`–`<h6>` and `<p>` tags are forbidden. Use the `tag` prop when semantic HTML differs from visual style. | Lint: `commerce-theme/no-raw-html-text` |
| `AmberImage` | Use `AmberImage` instead of `<img>` or `next/image`. Requires `width` and `height` props so the CDN serves the correct size. | Lint: `commerce-theme/no-img-element` |
| No outer-boundary styling | Components **must not** style their own `width`, `height`, `margin`, or `padding`. Layout is the wrapping component's responsibility. | **Code review** |
| sp-tokens for spacing | Spacing utilities (`p-*`, `m-*`, `gap-*`) **must** use sp-tokens (e.g. `p-sp16`, `gap-sp8`). Raw numeric (`p-4`) and arbitrary (`mt-[30px]`) spacing are forbidden. | Lint: `commerce-theme/no-numeric-spacing`, `commerce-theme/no-arbitrary-spacing` |
| sp-tokens for spacing only | sp-tokens **must not** be used for sizing (`w-sp16`, `h-sp24`). Use standard Tailwind sizing (`w-12`, `h-[36px]`) instead. | Lint: `commerce-theme/no-sp-token-misuse` |
| Font sizes | Use `text-fsXX` tokens (e.g. `text-fs16`) or the `Typography` component. Raw Tailwind font sizes like `text-lg` are forbidden. | Lint: `commerce-theme/no-raw-font-size` |
| No hardcoded colors | Colors **must** reference theme CSS variables (`var(--theme-colors-*)`) or Tailwind theme classes (`bg-primary`, `text-grey-500`). No hex, rgb, or hsl values. | Lint: `commerce-theme/no-hardcoded-colors` |
| `motion-reduce:` variants | Every `animate-*` class **must** include a `motion-reduce:` variant (at minimum `motion-reduce:animate-none`) to respect the OS reduced-motion preference. | Lint: `commerce-theme/no-animate-without-reduced-motion` |
| Named exports only | No default exports. Use named exports for every component and type. | **Code review** |
| File structure | `component.tsx` — React component (zero `@builder.io/*` imports); `register.tsx` — Builder.io registration; `index.ts` — re-export barrel; sub-components in kebab-case files within the same directory. | Lint: `commerce-theme/builder-registration-in-register-file` (partial) |
| `BuilderBlocks` for content areas | Editable/extensible sections **must** use `<BuilderBlocks>` with a `defaultValue`. Scalar values, backend IDs, and fixed enums use explicit props. | Lint: `commerce-theme/builder-blocks-require-default-value` |
| Backend data | Components requiring backend data **must** receive it via `CommerceComponentsContext` or an explicit prop callback — never by calling APIs directly. Storybook stories **must** provide stub implementations. | **Code review** |
| Variant naming | `variant` describes visual hierarchy (`primary`, `secondary`, `tertiary`); `scale` is always a separate prop for size (`sm`, `md`, `lg`). Surface context: `-inverse` (dark surface), `-brand` (brand surface). No color or appearance words in variant names. | **Code review** |

## Primitives (23)

---

### `Button`

**HTML element:** `<button>` · **Directory:** `button/` · **Category:** Actions

**Figma sources:** [Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-3480)


> Standard labelled action button covering primary, secondary, and tertiary visual hierarchy.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `primary` | Type | Visual hierarchy — never use color/appearance words. |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | Size — always a separate prop, never encoded in variant |
| `state` | `'default' \| 'hover' \| 'active' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `bg-primary`, `text-white`, `border-primary`, `hover:bg-primary-500`, `text-primary`, `disabled:bg-secondary-200`
- **Spacing:** `py-sp6`, `py-sp12`, `py-sp18`, `px-sp12`, `px-sp16`, `px-sp48`
- **Typography:** `text-fs18`, `text-fs16`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `role="button"` (implicit on `<button>`)
- `aria-label` when icon-only
- `aria-disabled` when disabled (do not use HTML `disabled` if you need focusability)
- `aria-pressed` for toggle-style buttons

<details><summary>Consumer usage</summary>

```tsx
import { Button } from '@faithlife/commerce-components';

<Button variant="primary" scale="medium" state="default">
  Add to cart
</Button>

// inverse variant for dark surfaces
<Button variant="primary-inverse" scale="medium">Buy now</Button>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Button({ variant = 'primary', scale = 'medium', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'tw-preflight',
        'inline-flex items-center justify-center gap-sp12 rounded-[2px]',
        'transition-colors duration-short motion-reduce:transition-none',
        // variant and scale class maps live in button-variants.ts
        variantClasses[variant],
        scaleClasses[scale],
        className,
      )}
      {...props}
    >
      <Typography variant="buttonTextLg" tag="span">{children}</Typography>
    </button>
  );
}
```

</details>

---

### `IconButton`

**HTML element:** `<button>` · **Directory:** `icon-button/` · **Category:** Actions

**Figma sources:** [Floating Action Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4908)


> Flexible icon-only button base. Accepts any icon as children. Only controls visual shape (default = transparent, floating = circular white with shadow). Fixed-icon use cases (close, play, expand-collapse, increment, navigate) are separate convenience wrapper compositions that compose this primitive.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' \| 'floating'` | `default` | Style | Controls visual shape only. default = transparent square, floating = circular white with shadow. |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `bg-primary`, `text-white`, `bg-transparent`, `text-primary`
- **Spacing:** `p-sp6`, `p-sp10`, `p-sp14`, `gap-sp8`
- **Shadows:** `shadow-dp4`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `aria-label` required — describe the action, not the icon (e.g. "Add to wishlist", "Close dialog", "Play video")
- `role="button"` (implicit on `<button>`)
- `aria-disabled` when disabled
- Accepts any icon as `children`; fixed-icon use cases (close, play, expand-collapse) are separate wrapper compositions that add their own ARIA semantics (e.g. `aria-expanded` on ExpandCollapseButton)

<details><summary>Consumer usage</summary>

```tsx
import { IconButton } from '@faithlife/commerce-components';

// aria-label is required — there is no visible text
<IconButton variant="close" scale="medium" aria-label="Close dialog" />
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// icon-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function IconButton({ variant = 'default', scale = 'medium', className, children, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        'tw-preflight',
        'inline-flex items-center justify-center gap-sp12 rounded-[2px]',
        'transition-colors duration-short motion-reduce:transition-none',
        // variant and scale class maps live in icon-button-variants.ts
        variantClasses[variant],
        scaleClasses[scale],
        className,
      )}
      {...props}
    >
      <Typography variant="buttonTextLg" tag="span">{children}</Typography>
    </button>
  );
}
```

</details>

---

### `LinkButton`

**HTML element:** `<a>` · **Directory:** `link-button/` · **Category:** Actions

**Figma sources:** [Text Button—Icon Left](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5762-102995), [Text Button—Icon Right](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4782)


> Inline anchor link with an optional leading or trailing icon. Always renders as an <a> element and requires an href.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `href` | `string` | `` |  | Required. The URL the link points to. |
| `variant` | `'default' \| 'arrow-link'` _(proposed)_ | `default` | Type | Distinguishes a plain text link from a directional/arrow-style link. Values are proposed — not derived from a Figma axis. |
| `iconPosition` | `'leading' \| 'trailing'` | `trailing` | Type | Leading = icon left, trailing = icon right |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'active' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `text-primary`, `hover:text-primary-500`, `text-white`
- **Spacing:** `gap-sp6`, `gap-sp8`
- **Typography:** `buttonTextLg`, `buttonTextSm`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `href` required — always renders as `<a>`
- `aria-label` or visible text required
- `aria-current="page"` when marking active link

<details><summary>Consumer usage</summary>

```tsx
import { LinkButton } from '@faithlife/commerce-components';

<LinkButton iconPosition="trailing">Learn more</LinkButton>
<LinkButton iconPosition="leading">Back to results</LinkButton>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// link-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function LinkButton({ variant = '', scale = 'medium', className, children, ...props }: LinkButtonProps) {
  return (
    <a
      className={cn(
        'tw-preflight',
        'inline-flex items-center justify-center gap-sp12 rounded-[2px]',
        'transition-colors duration-short motion-reduce:transition-none',
        // variant and scale class maps live in link-button-variants.ts
        variantClasses[variant],
        scaleClasses[scale],
        className,
      )}
      {...props}
    >
      <Typography variant="buttonTextLg" tag="span">{children}</Typography>
    </a>
  );
}
```

</details>

---

### `Input`

**HTML element:** `<input>` · **Directory:** `input/` · **Category:** Data Entry

**Figma sources:** [Text Input (single line)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5130), [Text Input—Date](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5660), [Text Input—Password](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5741), [Search Field](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5874)


> Single-line text entry field covering all text, date, password, and search variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `type` | `'text' \| 'date' \| 'password' \| 'search'` | `text` | Type | — |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'focus' \| 'filled' \| 'disabled' \| 'error' \| 'success'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `border-primary`, `bg-white`, `text-primary`, `border-secondary-200`, `focus:border-primary`
- **Spacing:** `py-sp8`, `py-sp12`, `px-sp12`, `px-sp16`, `gap-sp8`
- **Typography:** `text-fs16`, `text-fs14`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `<label>` associated via `for`/`id` or `aria-label`
- `aria-required` when required
- `aria-invalid` + `aria-describedby` on error
- `autocomplete` attribute for common fields

<details><summary>Consumer usage</summary>

```tsx
import { Input } from '@faithlife/commerce-components';

<Input type="text" scale="medium" placeholder="Search..." />
<Input type="email" scale="medium" state="error" />
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// input/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Input({ variant = 'text', className, children, ...props }: InputProps) {
  return (
    <input className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </input>
  );
}
```

</details>

---

### `Textarea`

**HTML element:** `<textarea>` · **Directory:** `textarea/` · **Category:** Data Entry

**Figma sources:** [Text Input—Multiline](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5422)


> Multi-line text entry field.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'focus' \| 'filled' \| 'disabled' \| 'error'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `<label>` associated via `for`/`id` or `aria-label`
- `aria-required` when required
- `aria-invalid` + `aria-describedby` on error

<details><summary>Consumer usage</summary>

```tsx
import { Textarea } from '@faithlife/commerce-components';

<Textarea scale="md">{/* content */}</Textarea>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// textarea/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Textarea({ variant = 'md', className, children, ...props }: TextareaProps) {
  return (
    <textarea className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </textarea>
  );
}
```

</details>

---

### `Select`

**HTML element:** `<select>` · **Directory:** `select/` · **Category:** Data Entry

**Figma sources:** [Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5473), [Form Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5532), [Form Dropdown Option](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2015-39220)


> Dropdown select control. Covers both inline and form-embedded variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' \| 'form'` | `default` | Type | Use form for label+border style in a form context |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'focus' \| 'open' \| 'disabled' \| 'error'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `border-primary`, `bg-white`, `text-primary`, `border-secondary-200`
- **Spacing:** `py-sp8`, `py-sp12`, `px-sp12`, `px-sp16`
- **Typography:** `text-fs16`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `<label>` associated via `for`/`id` or `aria-label`
- `aria-required` when required
- `aria-expanded` when open

<details><summary>Consumer usage</summary>

```tsx
import { Select } from '@faithlife/commerce-components';

<Select variant="default">{/* content */}</Select>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// select/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Select({ variant = 'default', className, children, ...props }: SelectProps) {
  return (
    <select className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </select>
  );
}
```

</details>

---

### `Checkbox`

**HTML element:** `<input[type=checkbox]>` · **Directory:** `checkbox/` · **Category:** Data Entry

**Figma sources:** [Checkbox](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5118), [Single Select Box](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=4543-14867)


> Boolean checkbox input with label. Also covers the single-consent / long-text checkbox pattern.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' \| 'hover' \| 'checked' \| 'indeterminate' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `border-primary`, `bg-primary`, `text-white`, `border-secondary-200`
- **Spacing:** `gap-sp8`, `gap-sp12`
- **Typography:** `text-fs14`, `text-fs16`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `<label>` associated
- `aria-checked` for indeterminate state
- `aria-required` when required

<details><summary>Consumer usage</summary>

```tsx
import { Checkbox } from '@faithlife/commerce-components';

<Checkbox state="default">{/* content */}</Checkbox>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// checkbox/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Checkbox({ variant = 'default', className, children, ...props }: CheckboxProps) {
  return (
    <input[type=checkbox] className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </input[type=checkbox]>
  );
}
```

</details>

---

### `RadioButton`

**HTML element:** `<input[type=radio]>` · **Directory:** `radio-button/` · **Category:** Data Entry

**Figma sources:** [Radio Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5243)


> Single radio option — used inside a RadioGroup.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' \| 'hover' \| 'checked' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `border-primary`, `bg-primary`, `text-primary`, `border-secondary-200`
- **Spacing:** `gap-sp8`, `gap-sp12`
- **Typography:** `text-fs14`, `text-fs16`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `<fieldset>` + `<legend>` wrapping radio groups
- `aria-required` on group

<details><summary>Consumer usage</summary>

```tsx
import { RadioButton } from '@faithlife/commerce-components';

<RadioButton state="default">{/* content */}</RadioButton>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// radio-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function RadioButton({ variant = 'default', className, children, ...props }: RadioButtonProps) {
  return (
    <input[type=radio] className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </input[type=radio]>
  );
}
```

</details>

---

### `Switch`

**HTML element:** `<input[type=checkbox]>` · **Directory:** `switch/` · **Category:** Selection & Controls

**Figma sources:** [Switch](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5125), [Toggle with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5311)


> On/off switch control, optionally with a text label.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' \| 'with-label'` | `default` | Type | — |
| `state` | `'on' \| 'off' \| 'disabled'` | `off` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `bg-secondary-200`, `bg-primary`, `text-white`
- **Spacing:** `gap-sp8`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `role="switch"` with `aria-checked`
- `aria-label` describing what is toggled

<details><summary>Consumer usage</summary>

```tsx
import { Switch } from '@faithlife/commerce-components';

<Switch variant="default">{/* content */}</Switch>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// switch/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Switch({ variant = 'default', className, children, ...props }: SwitchProps) {
  return (
    <input[type=checkbox] className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </input[type=checkbox]>
  );
}
```

</details>

---

### `ToggleGroup`

**HTML element:** `<div>` · **Directory:** `toggle-group/` · **Category:** Selection & Controls

**Figma sources:** [Toggle Switch (text)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5340)


> Segmented control for mutually exclusive selection between 2-3 options. Implement with @radix-ui/react-toggle-group.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `size` | `'2' \| '3'` | `2` | Size | — |
| `state` | `'default' \| 'hover' \| 'focus' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="radiogroup"` on container (Radix ToggleGroup handles this)
- `role="radio"` + `aria-checked` on each option
- Arrow key navigation between options (provided by Radix)

<details><summary>Consumer usage</summary>

```tsx
import { ToggleGroup } from '@faithlife/commerce-components';

<ToggleGroup size="2">{/* content */}</ToggleGroup>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// toggle-group/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function ToggleGroup({ variant = '2', className, children, ...props }: ToggleGroupProps) {
  return (
    <div className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </div>
  );
}
```

</details>

---

### `Slider`

**HTML element:** `<input[type=range]>` · **Directory:** `slider/` · **Category:** Data Entry

**Figma sources:** [Slider](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5807)


> Range input slider for selecting a numeric value.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' \| 'hover' \| 'focus' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-label` or `<label>`

<details><summary>Consumer usage</summary>

```tsx
import { Slider } from '@faithlife/commerce-components';

<Slider state="default">{/* content */}</Slider>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// slider/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Slider({ variant = 'default', className, children, ...props }: SliderProps) {
  return (
    <input[type=range] className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </input[type=range]>
  );
}
```

</details>

---

### `Badge`

**HTML element:** `<span>` · **Directory:** `badge/` · **Category:** Data Display

**Figma sources:** [Badges and Tags](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1773-12115)


> Small inline label for tags, status indicators, and countdown timers.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' \| 'sale' \| 'tag' \| 'info' \| 'success' \| 'warning' \| 'error'` | `default` | Type | Use semantic variants (success/warning/error) not color words |
| `scale` | `'sm' \| 'md'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `bg-primary`, `text-white`, `bg-secondary-100`, `text-primary`, `bg-success`, `bg-warning`, `bg-danger`
- **Spacing:** `py-sp2`, `py-sp4`, `px-sp8`, `px-sp12`
- **Typography:** `text-fs12`, `text-fs14`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `role="status"` if dynamic
- `aria-label` for icon-only badges

<details><summary>Consumer usage</summary>

```tsx
import { Badge } from '@faithlife/commerce-components';

<Badge variant="default">{/* content */}</Badge>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// badge/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </span>
  );
}
```

</details>

---

### `SaleCallout`

**HTML element:** `<div>` · **Directory:** `sale-callout/` · **Category:** Data Display

**Figma sources:** [Sale Percentage](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5173-41321)


> Large promotional display text showing a percentage discount headline (e.g. "Save up to 75%").

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="img"` with `aria-label` describing the promotion (e.g. "Save up to 75%")
- `role="status"` if the text updates dynamically

<details><summary>Consumer usage</summary>

```tsx
import { SaleCallout } from '@faithlife/commerce-components';

<SaleCallout scale="md">{/* content */}</SaleCallout>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// sale-callout/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function SaleCallout({ variant = 'md', className, children, ...props }: SaleCalloutProps) {
  return (
    <div className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </div>
  );
}
```

</details>

---

### `StarRating`

**HTML element:** `<div>` · **Directory:** `star-rating/` · **Category:** Data Display

**Figma sources:** [Star](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9407), [Reviews](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9371)


> Star icon for ratings, with optional count display.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'star' \| 'with-count'` | `star` | Type | — |
| `scale` | `'sm' \| 'md'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="img"` with `aria-label` for display-only
- `role="radiogroup"` for interactive rating

<details><summary>Consumer usage</summary>

```tsx
import { StarRating } from '@faithlife/commerce-components';

<StarRating variant="star">{/* content */}</StarRating>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// star-rating/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function StarRating({ variant = 'star', className, children, ...props }: StarRatingProps) {
  return (
    <div className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </div>
  );
}
```

</details>

---

### `PriceLabel`

**HTML element:** `<span>` · **Directory:** `price-label/` · **Category:** Data Display

**Figma sources:** [Price and Label](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=3707-42767)


> Price display with optional original/sale price.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' \| 'with-sale'` | `default` | Type | — |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

<details><summary>Consumer usage</summary>

```tsx
import { PriceLabel } from '@faithlife/commerce-components';

<PriceLabel variant="default">{/* content */}</PriceLabel>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// price-label/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function PriceLabel({ variant = 'default', className, children, ...props }: PriceLabelProps) {
  return (
    <span className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </span>
  );
}
```

</details>

---

### `Breadcrumbs`

**HTML element:** `<nav>` · **Directory:** `breadcrumbs/` · **Category:** Navigation

**Figma sources:** [Breadcrumbs](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4917)


> Hierarchical page location indicator.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `<nav aria-label="Breadcrumb">`
- `aria-current="page"` on last item

<details><summary>Consumer usage</summary>

```tsx
import { Breadcrumbs } from '@faithlife/commerce-components';

<Breadcrumbs scale="md">{/* content */}</Breadcrumbs>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// breadcrumbs/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Breadcrumbs({ variant = 'md', className, children, ...props }: BreadcrumbsProps) {
  return (
    <nav className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </nav>
  );
}
```

</details>

---

### `Menu`

**HTML element:** `<nav>` · **Directory:** `menu/` · **Category:** Navigation

**Figma sources:** [Simple Menu](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4958), [Button Menu](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5096)


> Navigation menu — simple text links or button-style items.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'simple' \| 'button'` | `simple` | Type | — |
| `state` | `'default' \| 'hover' \| 'active' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="menu"` or `role="navigation"`
- `aria-expanded` on trigger
- `aria-haspopup` on trigger

<details><summary>Consumer usage</summary>

```tsx
import { Menu } from '@faithlife/commerce-components';

<Menu variant="simple">{/* content */}</Menu>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// menu/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Menu({ variant = 'simple', className, children, ...props }: MenuProps) {
  return (
    <nav className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </nav>
  );
}
```

</details>

---

### `Tabs`

**HTML element:** `<div>` · **Directory:** `tabs/` · **Category:** Navigation

**Figma sources:** [Tabbed Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76540), [Tabbed Selector Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2532-76553)


> Tab bar for switching between content panels. Covers container and individual tab item.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'container' \| 'item'` | `container` | Type | container is the full tab bar; item is a single tab |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'active' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `text-primary`, `border-primary`, `text-secondary-400`, `border-transparent`
- **Spacing:** `py-sp12`, `px-sp16`, `gap-sp8`
- **Typography:** `text-fs14`, `text-fs16`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected` on active tab
- `aria-controls` linking tab to panel

<details><summary>Consumer usage</summary>

```tsx
import { Tabs } from '@faithlife/commerce-components';

<Tabs variant="container">{/* content */}</Tabs>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// tabs/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Tabs({ variant = 'container', className, children, ...props }: TabsProps) {
  return (
    <div className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </div>
  );
}
```

</details>

---

### `SubnavDropdown`

**HTML element:** `<nav>` · **Directory:** `subnav-dropdown/` · **Category:** Navigation

**Figma sources:** [Subnav Dropdown](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=6331-34404), [Subnav Dropdown Options](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=6331-34528)


> Sub-navigation dropdown with trigger and option list.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'trigger' \| 'option'` | `trigger` | Type | — |
| `state` | `'default' \| 'hover' \| 'open' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

<details><summary>Consumer usage</summary>

```tsx
import { SubnavDropdown } from '@faithlife/commerce-components';

<SubnavDropdown variant="trigger">{/* content */}</SubnavDropdown>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// subnav-dropdown/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function SubnavDropdown({ variant = 'trigger', className, children, ...props }: SubnavDropdownProps) {
  return (
    <nav className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </nav>
  );
}
```

</details>

---

### `QuantityInput`

**HTML element:** `<div>` · **Directory:** `quantity-input/` · **Category:** Data Entry

**Figma sources:** [Stepper Control](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5401)


> Numeric quantity picker with increment and decrement buttons.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'focus' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` on increment/decrement buttons (e.g. "Increase quantity", "Decrease quantity")
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on value display

<details><summary>Consumer usage</summary>

```tsx
import { QuantityInput } from '@faithlife/commerce-components';

<QuantityInput scale="md">{/* content */}</QuantityInput>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// quantity-input/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function QuantityInput({ variant = 'md', className, children, ...props }: QuantityInputProps) {
  return (
    <div className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </div>
  );
}
```

</details>

---

### `Pagination`

**HTML element:** `<nav>` · **Directory:** `pagination/` · **Category:** Selection & Controls

**Figma sources:** [Next-Previous Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1758-5088)


> Numbered or solid-style page selector with previous/next buttons. Solid variant includes a play/pause toggle for auto-advancing carousels.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'numbered' \| 'solid'` | `numbered` | Style | — |
| `scale` | `'sm' \| 'md'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'focus' \| 'disabled' \| 'play'` | `default` | State | play = pause/play toggle active (solid variant only) |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `text-primary`, `bg-primary`, `text-white`, `bg-transparent`
- **Spacing:** `gap-sp8`, `p-sp8`, `p-sp12`
- **Typography:** `text-fs14`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `<nav aria-label="Pagination">`
- `aria-current="page"` on current page
- `aria-label` on prev/next buttons

<details><summary>Consumer usage</summary>

```tsx
import { Pagination } from '@faithlife/commerce-components';

<Pagination variant="numbered">{/* content */}</Pagination>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// pagination/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Pagination({ variant = 'numbered', className, children, ...props }: PaginationProps) {
  return (
    <nav className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </nav>
  );
}
```

</details>

---

### `ScrollBar`

**HTML element:** `<div>` · **Directory:** `scroll-bar/` · **Category:** Selection & Controls

**Figma sources:** [Slider Scroll Bar](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2245-93685)


> Horizontal scroll position indicator for carousels and media sliders. Shows current scroll offset as a dark line on a light track.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` on the container (e.g. "Scroll position")
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on the scroll indicator

<details><summary>Consumer usage</summary>

```tsx
import { ScrollBar } from '@faithlife/commerce-components';

<ScrollBar scale="md">{/* content */}</ScrollBar>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// scroll-bar/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function ScrollBar({ variant = 'md', className, children, ...props }: ScrollBarProps) {
  return (
    <div className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </div>
  );
}
```

</details>

---

### `Toast`

**HTML element:** `<div>` · **Directory:** `toast/` · **Category:** Feedback & Overlays

**Figma sources:** [Toast Bar](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-8729)


> Transient status notification bar. Implement with @radix-ui/react-toast; role="status" for info/success, role="alert" for warning/error.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `info` | Type | Always semantic — never color words |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `bg-primary`, `bg-success`, `bg-danger`, `bg-warning`, `text-white`
- **Spacing:** `py-sp12`, `px-sp16`, `gap-sp8`
- **Typography:** `text-fs14`
- **Shadows:** `shadow-dp4`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `role="status"` or `role="alert"` depending on urgency
- `aria-live="polite"` for non-urgent
- `aria-live="assertive"` for urgent

<details><summary>Consumer usage</summary>

```tsx
import { Toast } from '@faithlife/commerce-components';

<Toast variant="info">{/* content */}</Toast>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// toast/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Toast({ variant = 'info', className, children, ...props }: ToastProps) {
  return (
    <div className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </div>
  );
}
```

</details>

## Compositions (22)

---

### `AddToCart`

**HTML element:** `<div>` · **Directory:** `add-to-cart/` · **Category:** Actions

**Figma sources:** [Stepper CTA](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5773-64162)


> Multi-stage add-to-cart widget: CTA button → quantity picker → in-cart confirmation. Deferred — not planned for initial implementation.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `stage` | `'default' \| 'quantity' \| 'selected'` | `default` | Stage | — |
| `state` | `'default' \| 'hover' \| 'focus' \| 'minimum' \| 'maximum' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` describing current stage (e.g. "Add to cart", "Quantity picker", "In cart")
- `aria-live="polite"` on the container so stage transitions are announced to screen readers

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { AddToCart } from '@faithlife/commerce-components';

<AddToCart stage="default">
  {/* BuilderBlocks renders editable content here */}
</AddToCart>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// add-to-cart/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function AddToCart({ title, content, ...props }: AddToCartProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `Modal`

**HTML element:** `<dialog>` · **Directory:** `modal/` · **Category:** Feedback & Overlays

**Figma sources:** [Modal Dialog](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5787-116045), [Modal Button Group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5762-105611)


> Dialog overlay with header, body, and action group. Content areas use BuilderBlocks.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' \| 'confirmation' \| 'fullscreen'` | `default` | Type | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `bg-white`, `bg-black/50`
- **Spacing:** `p-sp24`, `p-sp32`, `gap-sp16`
- **Shadows:** `shadow-dp24`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `role="dialog"` with `aria-modal="true"`
- `aria-labelledby` pointing to title
- Focus trap when open
- Escape key closes

**Slots / children:**

- `children` — primary content area
- `title` — modal heading (required for accessibility)
- `footerActions` — action buttons rendered in the footer

<details><summary>Consumer usage</summary>

```tsx
import { Modal, Button } from '@faithlife/commerce-components';

<Modal title="Confirm purchase" footerActions={<Button variant="primary">Confirm</Button>}>
  <Typography variant="bodyMd">Are you sure you want to purchase this item?</Typography>
</Modal>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// modal/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function Modal({ title, content, ...props }: ModalProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `Accordion`

**HTML element:** `<details>` · **Directory:** `accordion/` · **Category:** Content Layout

**Figma sources:** [Accordion Section](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1859-51731)


> Expandable/collapsible section with header and body content.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'expanded' \| 'collapsed'` | `collapsed` | State | — |
| `variant` | `'standalone' \| 'section'` | `section` | Type | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `text-primary`, `border-secondary-200`
- **Spacing:** `py-sp16`, `px-sp16`, `gap-sp8`
- **Typography:** `text-fs16`
- **Transitions:** `duration-short`, `animate-radixAccordionItemSlideDown`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `role="region"` on panel
- `aria-expanded` on trigger button
- `aria-controls` linking trigger to panel

**Slots / children:**

- `children` — primary content area
- `trigger` — the clickable header row
- `children` — the expandable panel content

<details><summary>Consumer usage</summary>

```tsx
import { Accordion } from '@faithlife/commerce-components';

<Accordion state="collapsed">
  {/* BuilderBlocks renders editable content here */}
</Accordion>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// accordion/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function Accordion({ title, content, ...props }: AccordionProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `EmailCapture`

**HTML element:** `<form>` · **Directory:** `email-capture/` · **Category:** Data Entry

**Figma sources:** [Email Capture](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5925)


> Email address input with inline submit action.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'focus' \| 'error' \| 'success'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { EmailCapture } from '@faithlife/commerce-components';

<EmailCapture scale="md">
  {/* BuilderBlocks renders editable content here */}
</EmailCapture>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// email-capture/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function EmailCapture({ title, content, ...props }: EmailCaptureProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `FileUpload`

**HTML element:** `<input[type=file]>` · **Directory:** `file-upload/` · **Category:** Data Entry

**Figma sources:** [Upload Image Area](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5327)


> Drag-and-drop / click-to-browse file upload area.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' \| 'hover' \| 'active' \| 'uploaded' \| 'error'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { FileUpload } from '@faithlife/commerce-components';

<FileUpload state="default">
  {/* BuilderBlocks renders editable content here */}
</FileUpload>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// file-upload/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function FileUpload({ title, content, ...props }: FileUploadProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `RadioGroup`

**HTML element:** `<fieldset>` · **Directory:** `radio-group/` · **Category:** Data Entry

**Figma sources:** [Multi-Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5614), [Multi-Select with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5250)


> Group of mutually exclusive radio options with field label and error state. Implement with @radix-ui/react-radio-group.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'list' \| 'inline'` | `list` | Size | list = vertical with field label (Multi-Selector), inline = compact horizontal pills (Multi-Select with Text) |
| `state` | `'default' \| 'error'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `<fieldset>` + `<legend>` wrapping the group (rendered as `<fieldset>`)
- `role="radiogroup"` on fieldset (Radix RadioGroup handles this)
- `aria-invalid` + `aria-describedby` on fieldset for error messages

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { RadioGroup } from '@faithlife/commerce-components';

<RadioGroup variant="list">
  {/* BuilderBlocks renders editable content here */}
</RadioGroup>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// radio-group/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function RadioGroup({ title, content, ...props }: RadioGroupProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `CheckboxGroup`

**HTML element:** `<fieldset>` · **Directory:** `checkbox-group/` · **Category:** Data Entry

**Figma sources:** [Multi-Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5614), [Multi-Select with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5250)


> Group of multi-select checkbox options with field label and error state.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'list' \| 'inline'` | `list` | Size | list = vertical with field label, inline = compact horizontal pills |
| `state` | `'default' \| 'error'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `<fieldset>` + `<legend>` wrapping the group (rendered as `<fieldset>`)
- `role="group"` on fieldset
- `aria-invalid` + `aria-describedby` on fieldset for error messages

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { CheckboxGroup } from '@faithlife/commerce-components';

<CheckboxGroup variant="list">
  {/* BuilderBlocks renders editable content here */}
</CheckboxGroup>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// checkbox-group/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function CheckboxGroup({ title, content, ...props }: CheckboxGroupProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `ButtonGroup`

**HTML element:** `<div>` · **Directory:** `button-group/` · **Category:** Actions

**Figma sources:** [Button group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5083)


> Horizontal or vertical group of Button components for related actions.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `layout` | `'horizontal' \| 'vertical'` | `horizontal` | — | — |
| `align` | `'start' \| 'center' \| 'end'` | `start` | — | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area
- `children` — `Button`, `LinkButton`, or `IconButton` elements

<details><summary>Consumer usage</summary>

```tsx
import { ButtonGroup } from '@faithlife/commerce-components';

<ButtonGroup layout="horizontal">
  {/* BuilderBlocks renders editable content here */}
</ButtonGroup>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// button-group/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function ButtonGroup({ title, content, ...props }: ButtonGroupProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `CtaRow`

**HTML element:** `<a>` · **Directory:** `cta-row/` · **Category:** Actions

**Figma sources:** [CTA Row](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2769-25152)


> Full-width navigational link row with text and trailing arrow icon. Used in lists of navigation links.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' \| 'hover' \| 'focus' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `href` required — renders as an anchor link
- `aria-label` if the visible text is not descriptive enough
- `aria-current="page"` when marking an active link

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { CtaRow } from '@faithlife/commerce-components';

<CtaRow state="default">
  {/* BuilderBlocks renders editable content here */}
</CtaRow>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// cta-row/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function CtaRow({ title, content, ...props }: CtaRowProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `FormField`

**HTML element:** `<div>` · **Directory:** `form-field/` · **Category:** Data Entry

**Figma sources:** [Text Toggle Selector](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-5653)


> Generic field wrapper providing label, required indicator, description, and error message for any child form control.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `label` | `string` | `` |  | — |
| `required` | `boolean` | `false` |  | — |
| `error` | `string` | `` |  | — |
| `description` | `string` | `` |  | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `for` attribute on the label linked to the child control's `id`
- `aria-required` on child control when required
- `aria-describedby` on child control pointing to description and error elements
- `aria-invalid` on child control when error is present

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { FormField } from '@faithlife/commerce-components';

<FormField label="">
  {/* BuilderBlocks renders editable content here */}
</FormField>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// form-field/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function FormField({ title, content, ...props }: FormFieldProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `FormRow`

**HTML element:** `<div>` · **Directory:** `form-row/` · **Category:** Data Entry

**Figma sources:** [Text Input (name, two fields)](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2758-3449)


> Multi-column row of form fields. Starts with 2-column layout (first/last name pattern); extensible to more columns when additional Figma patterns exist.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `columns` | `'2'` _(proposed)_ | `2` |  | Number of equal-width columns. Only 2-column is defined from Figma; extend when more patterns emerge. |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` or `aria-labelledby` on the row if it has a group-level heading
- Each child FormField maintains its own accessible label independently

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { FormRow } from '@faithlife/commerce-components';

<FormRow columns="2">
  {/* BuilderBlocks renders editable content here */}
</FormRow>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// form-row/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function FormRow({ title, content, ...props }: FormRowProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `Chip`

**HTML element:** `<button>` · **Directory:** `chip/` · **Category:** Actions

**Figma sources:** [Category Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1935-4111)


> Filter chip wrapping Button with constrained API: pill shape, icon + text label, selected/unselected states.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `selected` | `boolean` | `false` | State | — |
| `state` | `'default' \| 'hover' \| 'active' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- Same requirements as `button`
- `aria-pressed` for selected/unselected toggle state
- `aria-label` with icon context if icon is the primary indicator

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { Chip } from '@faithlife/commerce-components';

<Chip selected="false">
  {/* BuilderBlocks renders editable content here */}
</Chip>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// chip/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function Chip({ title, content, ...props }: ChipProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `CloseButton`

**HTML element:** `<button>` · **Directory:** `close-button/` · **Category:** Actions

**Figma sources:** [Close Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4757)


> Convenience wrapper composing IconButton with ClearIcon pre-wired. Used to dismiss overlays, modals, and toasts. Deferred — not planned for initial implementation.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` required (e.g. "Close dialog", "Dismiss notification")
- Should set focus to an appropriate element after dismissal

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { CloseButton } from '@faithlife/commerce-components';

<CloseButton scale="md">
  {/* BuilderBlocks renders editable content here */}
</CloseButton>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// close-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function CloseButton({ title, content, ...props }: CloseButtonProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `PlayButton`

**HTML element:** `<button>` · **Directory:** `play-button/` · **Category:** Actions

**Figma sources:** [Play Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1864-94164)


> Convenience wrapper composing IconButton with PlayIcon pre-wired. Used for media playback controls. Deferred — not planned for initial implementation.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` required (e.g. "Play video", "Play audio")
- `aria-pressed` if toggle-style (play/pause)

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { PlayButton } from '@faithlife/commerce-components';

<PlayButton scale="md">
  {/* BuilderBlocks renders editable content here */}
</PlayButton>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// play-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function PlayButton({ title, content, ...props }: PlayButtonProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `ExpandCollapseButton`

**HTML element:** `<button>` · **Directory:** `expand-collapse-button/` · **Category:** Actions

**Figma sources:** [Expand-Collapse Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4708)


> Convenience wrapper composing IconButton with a chevron icon. Manages aria-expanded state and icon rotation. Used by Accordion. Deferred — not planned for initial implementation.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `expanded` | `boolean` | `false` | State | Controls aria-expanded and chevron rotation direction. |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-expanded` required — reflects current open/closed state
- `aria-controls` pointing to the controlled panel id
- `aria-label` required (e.g. "Expand section")

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { ExpandCollapseButton } from '@faithlife/commerce-components';

<ExpandCollapseButton expanded="false">
  {/* BuilderBlocks renders editable content here */}
</ExpandCollapseButton>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// expand-collapse-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function ExpandCollapseButton({ title, content, ...props }: ExpandCollapseButtonProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `IncrementButton`

**HTML element:** `<button>` · **Directory:** `increment-button/` · **Category:** Actions

**Figma sources:** [Increase-Decrease Buttons](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1623-4610)


> Convenience wrapper composing IconButton with IncreaseIcon or DecreaseIcon pre-wired. Used inside QuantityInput. Deferred — not planned for initial implementation.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `action` | `'increment' \| 'decrement'` | `increment` | Type | — |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` on both increment and decrement buttons (e.g. "Increase quantity", "Decrease quantity")
- `aria-disabled` when at min/max boundary

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { IncrementButton } from '@faithlife/commerce-components';

<IncrementButton action="increment">
  {/* BuilderBlocks renders editable content here */}
</IncrementButton>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// increment-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function IncrementButton({ title, content, ...props }: IncrementButtonProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `FloatingActionButton`

**HTML element:** `<button>` · **Directory:** `floating-action-button/` · **Category:** Actions

**Figma sources:** [Floating Action Button with Text](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=5650-121531)


> Rounded pill button with text label and plus icon. Wraps Button with a constrained pill-shape API.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'focus' \| 'active' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- Same requirements as `button`
- `aria-label` required — describe the action, not the icon

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { FloatingActionButton } from '@faithlife/commerce-components';

<FloatingActionButton scale="md">
  {/* BuilderBlocks renders editable content here */}
</FloatingActionButton>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// floating-action-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function FloatingActionButton({ title, content, ...props }: FloatingActionButtonProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `StatefulButton`

**HTML element:** `<button>` · **Directory:** `stateful-button/` · **Category:** Actions

**Figma sources:** [Stateful Action Button](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=7538-45104)


> Button with built-in loading and success transition states (CTA → loading spinner → success checkmark). Wraps Button with async state management.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `state` | `'default' \| 'hover' \| 'focus' \| 'loading' \| 'success' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-busy="true"` while in loading state
- `aria-live="polite"` region to announce success/error transitions

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { StatefulButton } from '@faithlife/commerce-components';

<StatefulButton state="default">
  {/* BuilderBlocks renders editable content here */}
</StatefulButton>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// stateful-button/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function StatefulButton({ title, content, ...props }: StatefulButtonProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `ProductCard`

**HTML element:** `<article>` · **Directory:** `product-card/` · **Category:** Product

**Figma sources:** [Product Grid Card](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1982-24943)


> Grid-format product card with image, title, price, reviews, and actions.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { ProductCard } from '@faithlife/commerce-components';

<ProductCard scale="md">
  {/* BuilderBlocks renders editable content here */}
</ProductCard>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// product-card/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function ProductCard({ title, content, ...props }: ProductCardProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `ProductDetail`

**HTML element:** `<article>` · **Directory:** `product-detail/` · **Category:** Product

**Figma sources:** [Product Content](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1949-59922)


> Full product detail display with description, quantity picker, and purchase actions.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'full' \| 'compact'` | `full` | Type | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { ProductDetail } from '@faithlife/commerce-components';

<ProductDetail variant="full">
  {/* BuilderBlocks renders editable content here */}
</ProductDetail>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// product-detail/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function ProductDetail({ title, content, ...props }: ProductDetailProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `ProductLineup`

**HTML element:** `<article>` · **Directory:** `product-lineup/` · **Category:** Product

**Figma sources:** [Product Lineup—Single](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1949-49395)


> Hero-style product showcase with blue image area, ownership badge, and purchase CTA. Three responsive variants (desktop/tablet/mobile).

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `size` | `'desktop' \| 'tablet' \| 'mobile'` | `desktop` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `role="article"` (implicit on `<article>`)
- `aria-label` naming the product
- Ensure heading hierarchy is maintained within the card

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { ProductLineup } from '@faithlife/commerce-components';

<ProductLineup size="desktop">
  {/* BuilderBlocks renders editable content here */}
</ProductLineup>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// product-lineup/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function ProductLineup({ title, content, ...props }: ProductLineupProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

---

### `FreeTrialCard`

**HTML element:** `<article>` · **Directory:** `free-trial-card/` · **Category:** Product

**Figma sources:** [Free Trial Card](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1880-108955)


> Promotional card for free trial offers.

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { FreeTrialCard } from '@faithlife/commerce-components';

<FreeTrialCard>
  {/* BuilderBlocks renders editable content here */}
</FreeTrialCard>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// free-trial-card/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function FreeTrialCard({ title, content, ...props }: FreeTrialCardProps) {
  return (
    <section className={cn('tw-preflight', 'flex flex-col gap-sp16', props.className)}>
      {title && <Typography variant="h3">{title}</Typography>}
      <BuilderBlocks parentElementId={props.builderBlock?.id} dataPath="component.options.content" blocks={content} />
    </section>
  );
}
```

</details>

## Builder Blocks (4)

---

### `SectionLayout`

**HTML element:** `<section>` · **Directory:** `section-layout/` · **Category:** Content Layout

**Figma sources:** [Section Headline](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76419), [Section Headline with CTA](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2457-71522), [Text Section](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2529-76369), [Text Section with Button Group](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=1770-9202)


> Page section with headline, body copy, and optional CTA slots. Content authors manage children via BuilderBlocks.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'headline-only' \| 'headline-cta' \| 'text' \| 'text-buttons'` | `headline-only` | Type | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { SectionLayout } from '@faithlife/commerce-components';

<SectionLayout variant="headline-only">
  {/* BuilderBlocks renders editable content here */}
</SectionLayout>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// section-layout/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function SectionLayout({ variant = 'headline-only', className, children, ...props }: SectionLayoutProps) {
  return (
    <section className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </section>
  );
}
```

</details>

---

### `ProductCarousel`

**HTML element:** `<section>` · **Directory:** `product-carousel/` · **Category:** Product

**Figma sources:** [Carousel Product](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2262-261677)


> Horizontally scrollable carousel of ProductCard items backed by API data.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { ProductCarousel } from '@faithlife/commerce-components';

<ProductCarousel scale="md">
  {/* BuilderBlocks renders editable content here */}
</ProductCarousel>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// product-carousel/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function ProductCarousel({ variant = 'md', className, children, ...props }: ProductCarouselProps) {
  return (
    <section className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </section>
  );
}
```

</details>

---

### `CtaList`

**HTML element:** `<ul>` · **Directory:** `cta-list/` · **Category:** Product

**Figma sources:** [Multi-CTA List](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2769-25078)


> Vertical list of CTA rows, each linking to a product or resource.

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { CtaList } from '@faithlife/commerce-components';

<CtaList>
  {/* BuilderBlocks renders editable content here */}
</CtaList>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// cta-list/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function CtaList({ variant = 'default', className, children, ...props }: CtaListProps) {
  return (
    <ul className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </ul>
  );
}
```

</details>

---

### `BasicForm`

**HTML element:** `<form>` · **Directory:** `basic-form/` · **Category:** Data Entry

**Figma sources:** [Basic Form](https://www.figma.com/design/8J2B4UtoSMRvkLqBqyoZjB/Logos-Brand-Components?node-id=2761-34608)


> Generic form with field layout managed via BuilderBlocks.

**Slots / children:**

- `children` — primary content area

<details><summary>Consumer usage</summary>

```tsx
import { BasicForm } from '@faithlife/commerce-components';

<BasicForm>
  {/* BuilderBlocks renders editable content here */}
</BasicForm>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// basic-form/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function BasicForm({ variant = 'default', className, children, ...props }: BasicFormProps) {
  return (
    <form className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </form>
  );
}
```

</details>

---
*Generated by `build-inventory.ts`*
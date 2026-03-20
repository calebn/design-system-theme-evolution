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

## Primitives (21)

---

### `Button`

**HTML element:** `<button>` · **Directory:** `button/` · **Category:** Actions

**Figma sources:** Button, Category Button, Floating Action Button with Text, Stateful Action Button


> Standard labelled action button covering primary, secondary, tertiary, and stateful variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'stateful'` _(proposed)_ | `primary` | Type | Visual hierarchy — never use color/appearance words. primary/secondary are implemented; tertiary and stateful are proposed. |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | Size — always a separate prop, never encoded in variant |
| `state` | `'default' \| 'hover' \| 'active' \| 'disabled' \| 'loading' \| 'success'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `bg-primary`, `text-white`, `border-primary`, `hover:bg-primary-500`, `text-primary`, `disabled:bg-secondary-200`
- **Spacing:** `py-sp6`, `py-sp14`, `py-sp20`, `px-sp12`, `px-sp16`, `px-sp48`, `gap-sp12`
- **Typography:** `buttonTextLg`, `buttonTextSm`
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

**Figma sources:** Close Button, Play Button, Floating Action Button


> Icon-only button with no visible label. Requires an aria-label. Covers close, play, and floating action variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'default' \| 'floating' \| 'close' \| 'play'` _(proposed)_ | `default` | Style | Distinguishes Close Button, Play Button, and Floating Action Button Figma frames within one component. Values are proposed — derived from Figma frame names, not a Figma axis. |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'hover' \| 'active' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Tailwind token usage:**

- **Colors:** `bg-primary`, `text-white`, `bg-transparent`, `text-primary`
- **Spacing:** `p-sp6`, `p-sp10`, `p-sp14`, `gap-sp8`
- **Shadows:** `shadow-dp4`
- **Transitions:** `duration-short`

> Token source: `@faithlife/commerce-theme` · See `packages/commerce-theme/src/` for raw values.

**Accessibility requirements:**

- `aria-label` required (no visible text)
- `role="button"` (implicit on `<button>`)
- `aria-disabled` when disabled

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

**HTML element:** `<button>` · **Directory:** `link-button/` · **Category:** Actions

**Figma sources:** Text Button—Icon Left, Text Button—Icon Right


> Inline text link with an optional leading or trailing icon. Renders as an anchor or button depending on context.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
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

- `aria-label` or visible text required
- If rendered as `<a>`, must have `href`
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

export function LinkButton({ variant = 'default', scale = 'medium', className, children, ...props }: LinkButtonProps) {
  return (
    <button
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
    </button>
  );
}
```

</details>

---

### `Input`

**HTML element:** `<input>` · **Directory:** `input/` · **Category:** Data Entry

**Figma sources:** Text Input (single line), Text Input—Date, Text Input—Password, Search Field


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

**Figma sources:** Text Input—Multiline


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

### `TextInputGroup`

**HTML element:** `<div>` · **Directory:** `text-input-group/` · **Category:** Data Entry

**Figma sources:** Text Input (name, two fields)


> Two-column name-capture input (first + last).

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

<details><summary>Consumer usage</summary>

```tsx
import { TextInputGroup } from '@faithlife/commerce-components';

<TextInputGroup scale="md">{/* content */}</TextInputGroup>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// text-input-group/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function TextInputGroup({ variant = 'md', className, children, ...props }: TextInputGroupProps) {
  return (
    <div className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </div>
  );
}
```

</details>

---

### `Select`

**HTML element:** `<select>` · **Directory:** `select/` · **Category:** Data Entry

**Figma sources:** Dropdown, Form Dropdown, Form Dropdown Option


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

**Figma sources:** Checkbox


> Boolean checkbox input with label.

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

**Figma sources:** Radio Button


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

### `Toggle`

**HTML element:** `<input[type=checkbox]>` · **Directory:** `toggle/` · **Category:** Selection & Controls

**Figma sources:** Switch, Toggle with Text


> On/off toggle switch, optionally with a text label.

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
import { Toggle } from '@faithlife/commerce-components';

<Toggle variant="default">{/* content */}</Toggle>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// toggle/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Toggle({ variant = 'default', className, children, ...props }: ToggleProps) {
  return (
    <input[type=checkbox] className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </input[type=checkbox]>
  );
}
```

</details>

---

### `Slider`

**HTML element:** `<input[type=range]>` · **Directory:** `slider/` · **Category:** Data Entry

**Figma sources:** Slider


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

**Figma sources:** Badges and Tags, Sale Percentage


> Small label for tags, status indicators, and sale callouts.

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

### `StarRating`

**HTML element:** `<div>` · **Directory:** `star-rating/` · **Category:** Data Display

**Figma sources:** Star, Reviews


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

**Figma sources:** Price and Label


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

**Figma sources:** Breadcrumbs


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

**Figma sources:** Simple Menu, Button Menu


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

**Figma sources:** Tabbed Selector, Tabbed Selector Button


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

**Figma sources:** Subnav Dropdown, Subnav Dropdown Options


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

### `Stepper`

**HTML element:** `<div>` · **Directory:** `stepper/` · **Category:** Selection & Controls

**Figma sources:** Stepper CTA, Stepper Control, Increase-Decrease Buttons


> Quantity control with increment/decrement. Covers standalone controls and CTA-embedded variants.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'cta' \| 'control' \| 'quantity'` | `control` | Type | cta = with add-to-cart button, control = inline control, quantity = bare +/- buttons |
| `scale` | `'sm' \| 'md' \| 'lg'` | `md` | Size | — |
| `state` | `'default' \| 'minimum' \| 'maximum' \| 'disabled'` | `default` | State | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Accessibility requirements:**

- `aria-label` on increment/decrement buttons
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on value display

<details><summary>Consumer usage</summary>

```tsx
import { Stepper } from '@faithlife/commerce-components';

<Stepper variant="control">{/* content */}</Stepper>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// stepper/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Stepper({ variant = 'control', className, children, ...props }: StepperProps) {
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

**Figma sources:** Next-Previous Buttons, Next-Previous Selector, Slider page selector, Slider Scroll Bar


> Navigation controls for paging through content.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'buttons' \| 'selector' \| 'page' \| 'scroll'` | `buttons` | Type | — |
| `scale` | `'sm' \| 'md'` | `md` | Size | — |
| `state` | `'default' \| 'first-page' \| 'last-page' \| 'disabled'` | `default` | State | — |
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

<Pagination variant="buttons">{/* content */}</Pagination>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// pagination/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { Typography } from '../typography/component';

export function Pagination({ variant = 'buttons', className, children, ...props }: PaginationProps) {
  return (
    <nav className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </nav>
  );
}
```

</details>

---

### `Toast`

**HTML element:** `<output>` · **Directory:** `toast/` · **Category:** Feedback & Overlays

**Figma sources:** Toast Bar


> Transient status notification.

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
    <output className={cn('tw-preflight', /* variant classes */, className)} {...props}>
      {children}
    </output>
  );
}
```

</details>

## Compositions (9)

---

### `Modal`

**HTML element:** `<dialog>` · **Directory:** `modal/` · **Category:** Feedback & Overlays

**Figma sources:** Modal Dialog, Modal Button Group


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

**Figma sources:** Accordion Section, Expand-Collapse Button


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

**Figma sources:** Email Capture


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

**Figma sources:** Upload Image Area


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

### `SelectionGroup`

**HTML element:** `<div>` · **Directory:** `selection-group/` · **Category:** Selection & Controls

**Figma sources:** Toggle Switch (text), Multi-Select with Text, Multi-Selector, Text Toggle Selector, Single Select Box


> Group of mutually exclusive or multi-select options (toggles, checkboxes, radio buttons, or text tabs).

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `type` | `'toggle' \| 'checkbox' \| 'radio' \| 'single-select'` | `toggle` | Style | Selection mode — drives the underlying input semantics |
| `layout` | `'horizontal' \| 'vertical'` | `horizontal` | — | — |
| `className` | `string` | — | — | Additional CSS class |
| `data-testid` | `string` | — | — | Test selector hook |

**Slots / children:**

- `children` — primary content area
- `children` — `Checkbox`, `RadioButton`, or `Toggle` elements

<details><summary>Consumer usage</summary>

```tsx
import { SelectionGroup } from '@faithlife/commerce-components';

<SelectionGroup type="toggle">
  {/* BuilderBlocks renders editable content here */}
</SelectionGroup>
```

</details>

<details><summary>Implementation sketch (component.tsx)</summary>

```tsx
// selection-group/component.tsx
// No @builder.io/* imports allowed here — those go in register.tsx
import { cn } from '../../utils';
import { BuilderBlocks } from '@builder.io/react';
import { Typography } from '../typography/component';

export function SelectionGroup({ title, content, ...props }: SelectionGroupProps) {
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

**Figma sources:** Button group, CTA Row


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

### `ProductCard`

**HTML element:** `<article>` · **Directory:** `product-card/` · **Category:** Product

**Figma sources:** Product Grid Card


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

**Figma sources:** Product Content, Product Lineup—Single


> Full product detail display with purchase actions.

**Props:**

| Prop | Type | Default | Figma Axis | Description |
|------|------|---------|------------|-------------|
| `variant` | `'full' \| 'lineup'` | `full` | Type | — |
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

### `FreeTrialCard`

**HTML element:** `<article>` · **Directory:** `free-trial-card/` · **Category:** Product

**Figma sources:** Free Trial Card


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

**Figma sources:** Section Headline, Section Headline with CTA, Text Section, Text Section with Button Group


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

**Figma sources:** Carousel Product


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

**Figma sources:** Multi-CTA List


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

**Figma sources:** Basic Form


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
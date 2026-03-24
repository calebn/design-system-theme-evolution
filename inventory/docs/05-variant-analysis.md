# 05 · Variant Analysis

## Property Axes Used Across Components

> Component lists are collapsed below the summary table for readability.

| Axis | # Components | Values |
|------|-------------|--------|
| **State** | 43 | Active, Checkbox, Click, Default, Desktop, Disable, Disabled, Error, Expanded, Filled, Filled—Hide, Filled—Show, First Page, Focu, Focus, Focused, Half-Filled, Hover, Last Page, Loading, Maxium, Minimum, Mobile, Radio, Selected, State2, State3, State4, State6, State8, Success, Success no Button, Tablet, Variant4 |
| **Size** | 32 | 2, 3, Condensed, Default, Desktop, Large, Medium, Mobile, Mobile-CTA, Small, Tablet, X-Large |
| **Style** | 20 | 01, 02, 03, 04, Checkbox, Dark, Default, Horizontal, Icon, Large, Light, Medium, Multi-step, Numbered, Outline, Overlay, Page Number, Paged, Radio, Sale, Sale-Timer, Sale—Vertical, Small, Solid, Solid—Dark, Solid—Light, Subscription, Subscription—Vertical, Transparent, Value, Value—Vertical, Vertical |
| **Background** | 8 | Dark, Dark and Logos Blue, Light, Logos Blue |
| **Type** | 6 | Add (Generic), Attention, CTA (Default), Default, Error, External Link, Header-Middle, Header-Top, Info, Primary-Secondary, Primary-Tertiary, Success |
| **Property 1** | 3 | Default, Disabled, Error, Focus, Hover, Selected, Variant6 |
| **Selection** | 2 | 1, 2, 3, 4, 5, Option 1, Option 2 |
| **Aspect Ratio** | 2 | 1.2:1, 1.33:1, 1.4:1, 1.5:1, 1.6:1, 1.8:1, 16x9, 1:1, 1x1, 2_5x1, 2x1, 3x2, 4x3, 4x5, 5x4 |
| **Direction** | 1 | Next, Previous |
| **Change** | 1 | Decrease, Increase |
| **Toggle** | 1 | Collapse, Expand |
| **Stage** | 1 | Default, Quantity, Selected |
| **Rating** | 1 | .5, 0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 |
| **Headline Size** | 1 | H1, H2, H3, H4, H5 |
| **Background Color** | 1 | Dark, Light |
| **On-Off** | 1 | Off, On |

<details><summary><strong>State</strong> — 43 components</summary>

- Accordion Section
- Basic Form
- Breadcrumbs
- Button
- Button Menu
- CTA Row
- Category Button
- Checkbox
- Close Button
- Dropdown
- Email Capture
- Expand-Collapse Button
- Floating Action Button
- Floating Action Button with Text
- Form Dropdown
- Form Dropdown Option
- Increase-Decrease Buttons
- Modal Button Group
- Modal Dialog
- Multi-Select with Text
- Multi-Selector
- Next-Previous Buttons
- Play Button
- Radio Button
- Search Field
- Simple Menu
- Single Select Box
- Slider
- Slider Scroll Bar
- Star
- Stateful Action Button
- Stepper CTA
- Stepper Control
- Subnav Dropdown Options
- Tabbed Selector Button
- Text Button—Icon Left
- Text Button—Icon Right
- Text Input (name, two fields)
- Text Input (single line)
- Text Input—Date
- Text Input—Multiline
- Text Input—Password
- Toggle Switch (text)

</details>

<details><summary><strong>Size</strong> — 32 components</summary>

- Accordion Section
- Badges and Tags
- Basic Form
- Button
- Button Menu
- Button group
- Close Button
- Expand-Collapse Button
- Floating Action Button
- Floating Action Button with Text
- Increase-Decrease Buttons
- Modal Dialog
- Multi-CTA List
- Multi-Select with Text
- Next-Previous Buttons
- Next-Previous Selector
- Product Grid Card
- Product Lineup—Single
- Reviews
- Sale Percentage
- Search Field
- Section Headline
- Section Headline with CTA
- Slider page selector
- Star
- Stepper Control
- Subnav Dropdown
- Tabbed Selector Button
- Text Button—Icon Left
- Text Button—Icon Right
- Text Section with Button Group
- Toggle Switch (text)

</details>

<details><summary><strong>Style</strong> — 20 components</summary>

- Badges and Tags
- Button
- Carousel Product
- Close Button
- Floating Action Button
- Free Trial Card
- List
- Modal Button Group
- Modal Dialog
- Multi-Select with Text
- Next-Previous Buttons
- Next-Previous Selector
- Price and Label
- Product Content
- Product Grid Card
- Sale Percentage
- Slider page selector
- Text Input (name, two fields)
- Text Input (single line)
- Toast Bar

</details>

<details><summary><strong>Background</strong> — 8 components</summary>

- Button
- Close Button
- Expand-Collapse Button
- Increase-Decrease Buttons
- Next-Previous Buttons
- Switch
- Text Button—Icon Left
- Text Button—Icon Right

</details>

<details><summary><strong>Type</strong> — 6 components</summary>

- Button
- Button group
- Subnav Dropdown Options
- Text Button—Icon Left
- Text Button—Icon Right
- Toast Bar

</details>

<details><summary><strong>Property 1</strong> — 3 components</summary>

- Text Toggle Selector
- Toggle with Text
- Upload Image Area

</details>

<details><summary><strong>Selection</strong> — 2 components</summary>

- Tabbed Selector
- Toggle Switch (text)

</details>

<details><summary><strong>Aspect Ratio</strong> — 2 components</summary>

- Image Ratios
- Product Images

</details>

<details><summary><strong>Direction</strong> — 1 components</summary>

- Next-Previous Buttons

</details>

<details><summary><strong>Change</strong> — 1 components</summary>

- Increase-Decrease Buttons

</details>

<details><summary><strong>Toggle</strong> — 1 components</summary>

- Expand-Collapse Button

</details>

<details><summary><strong>Stage</strong> — 1 components</summary>

- Stepper CTA

</details>

<details><summary><strong>Rating</strong> — 1 components</summary>

- Reviews

</details>

<details><summary><strong>Headline Size</strong> — 1 components</summary>

- Text Section

</details>

<details><summary><strong>Background Color</strong> — 1 components</summary>

- Basic Form

</details>

<details><summary><strong>On-Off</strong> — 1 components</summary>

- Switch

</details>

## ⚠️ State Axis Quality Issues

The `State` property axis contains values that are not interaction states. These should be moved to separate axes in Figma.

**Breakpoint values mixed into State axis:** `Desktop`, `Mobile`, `Tablet`
→ These should be the `Size` axis (Desktop/Tablet/Mobile), not State.

**Input type values mixed into State axis:** `Checkbox`, `Radio`
→ These should be the `Style` axis (Checkbox/Radio), not State.

**Typos / inconsistent naming in State axis:**

| Found | Should Be |
|-------|-----------|
| `Disable` | `Disabled` |
| `Focu` | `Focus` |
| `Focused` | `Focus (duplicate of "Focus")` |
| `Maxium` | `Maximum` |

**Auto-generated state names:** `State2`, `State3`, `State4`, `State6`, `State8`, `Variant4`
→ Replace with descriptive names.


## Auto-Generated Property Values

| Component | Axis | Bad Value(s) | Action |
|-----------|------|-------------|--------|
| Text Button—Icon Left | State | `State8` | Rename with descriptive value in Figma |
| Play Button | State | `State2`, `State3`, `State4` | Rename with descriptive value in Figma |
| Category Button | State | `Variant4` | Rename with descriptive value in Figma |
| Toggle with Text | Property 1 | `Variant6` | Rename with descriptive value in Figma |
| Text Input—Multiline | State | `State4`, `State6` | Rename with descriptive value in Figma |

## 💡 Consolidation Opportunities

Components ranked by consolidation strength. **Already consolidated** = frames already mapped to the same code component.

### ✅ Already Consolidated (mapped to same code component)

| Figma Frame A | Figma Frame B | Code Component |
|---------------|---------------|----------------|
| Text Section with Button Group | Section Headline | `SectionLayout` |
| Text Toggle Selector (Figma ID: 1623:5649) | Text Toggle Selector (Figma ID: 1623:5653) | `—` |
| Increase-Decrease Buttons | Expand-Collapse Button | `IconButton` |
| Increase-Decrease Buttons | Close Button | `IconButton` |
| Expand-Collapse Button | Close Button | `IconButton` |
| Text Button—Icon Right | Text Button—Icon Left | `LinkButton` |
| Text Section with Button Group | Section Headline with CTA | `SectionLayout` |
| Section Headline with CTA | Section Headline | `SectionLayout` |
| Next-Previous Buttons | Close Button | `IconButton` |
| Text Input—Date | Text Input—Password | `Input` |
| Next-Previous Buttons | Increase-Decrease Buttons | `IconButton` |
| Next-Previous Buttons | Expand-Collapse Button | `IconButton` |
| Dropdown | Form Dropdown Option | `Select` |
| Simple Menu | Button Menu | `Menu` |
| Star | Reviews | `StarRating` |
| Text Input (single line) | Text Input—Date | `Input` |
| Next-Previous Selector | Slider page selector | `Pagination` |
| Close Button | Floating Action Button | `IconButton` |
| Increase-Decrease Buttons | Floating Action Button | `IconButton` |
| Expand-Collapse Button | Floating Action Button | `IconButton` |
| Text Input (single line) | Search Field | `Input` |
| Text Input—Date | Search Field | `Input` |
| Multi-Selector | Single Select Box | `CheckboxGroup` |
| Next-Previous Buttons | Floating Action Button | `IconButton` |
| Button | Floating Action Button with Text | `Button` |
| Text Input (single line) | Text Input—Password | `Input` |
| Dropdown | Form Dropdown | `Select` |
| Form Dropdown | Form Dropdown Option | `Select` |
| Text Input—Password | Search Field | `Input` |
| Modal Button Group | Modal Dialog | `Modal` |
| Floating Action Button with Text | Stateful Action Button | `Button` |
| Multi-Select with Text | Single Select Box | `CheckboxGroup` |
| Floating Action Button | Play Button | `IconButton` |
| Multi-Select with Text | Multi-Selector | `CheckboxGroup` |
| Button | Stateful Action Button | `Button` |
| Increase-Decrease Buttons | Play Button | `IconButton` |
| Expand-Collapse Button | Play Button | `IconButton` |
| Close Button | Play Button | `IconButton` |
| Next-Previous Buttons | Play Button | `IconButton` |
| Tabbed Selector Button | Tabbed Selector | `Tabs` |
| Slider Scroll Bar | Next-Previous Selector | `Pagination` |
| Slider Scroll Bar | Slider page selector | `Pagination` |
| CTA Row | Button group | `ButtonGroup` |
| Subnav Dropdown Options | Subnav Dropdown | `SubnavDropdown` |
| Text Section with Button Group | Text Section | `SectionLayout` |
| Text Section | Section Headline with CTA | `SectionLayout` |
| Text Section | Section Headline | `SectionLayout` |
| Switch | Toggle with Text | `Switch` |
| Text Input (name, two fields) | Text Toggle Selector | `FieldGroup` |

### 🔍 Candidates for Review

| Component A | Component B | Shared Axes | Value Overlap | Recommendation |
|-------------|-------------|-------------|---------------|----------------|
| Button Menu | Tabbed Selector Button | Size, State | 100% | Same axes [Size, State] · 100% value overlap — strong merge candidate |
| Stepper Control | Search Field | Size, State | 86% | Same axes [Size, State] · 86% value overlap — strong merge candidate |
| Text Input (single line) | Text Input (name, two fields) | Style, State | 63% | Text Input (name, two fields) is a composition of two Text Input fields with a specific two-column layout. Map to TextInputGroup (a thin wrapper), not to the base Input primitive. |
| Slider Scroll Bar | Slider | State | 43% | Merge into a single Slider component. Slider Scroll Bar is a visual variant (appears inside a carousel), not a distinct interaction pattern. Use a variant prop to differentiate. |
| Floating Action Button | Floating Action Button with Text | Size, State | 75% | Merge into a single IconButton or Button component using a variant='floating' prop. The text-label variant is additive (children prop), not a separate component. |
| Stepper Control | Stepper CTA | State | 67% | Both map to the Stepper code component. Stepper CTA is the full quantity-selector (increment/decrement + display), Stepper Control is the bare control. Use a variant='cta' \| 'control' prop. |
| Button | Button Menu | State, Size | 75% | Common stem "Button" · shares [State, Size] axes — review for variant prop consolidation |
| Multi-CTA List | Multi-Select with Text | Size | 50% | Unrelated despite the 'Multi' stem. Multi-CTA List is a content layout block; Multi-Select with Text is a form control. Keep separate. |
| Button Menu | Button group | Size | — | Different components despite the 'Button' stem. Button Menu is a navigation dropdown (nav element); ButtonGroup is a layout wrapper for action buttons. Keep separate. |
| Button | Button group | Size, Type | — | Common stem "Button" · shares [Size, Type] axes — review for variant prop consolidation |
| Slider page selector | Slider | — | — | Common stem "Slider" · no shared axes — review for variant prop consolidation |
| Multi-CTA List | Multi-Selector | — | — | Different purposes despite the 'Multi' stem. Multi-CTA List is a layout component (list of CTAs), Multi-Selector is a form control (multi-select). Keep separate. |
| Toggle with Text | Toggle Switch (text) | — | — | Merge into a single Toggle component. 'With Text' describes the label presence — make it a children prop, not a separate component. |

## 💥 Variant Count Overview

| Component | Section | Variant Count | Axes |
|-----------|---------|---------------|------|
| Button | Atoms | 216 | 5 |
| Next-Previous Buttons | Atoms | 144 | 5 |
| Increase-Decrease Buttons | Atoms | 48 | 4 |
| Expand-Collapse Button | Atoms | 48 | 4 |
| Close Button | Atoms | 48 | 4 |
| Floating Action Button | Atoms | 36 | 3 |
| Text Button—Icon Right | Atoms | 32 | 4 |
| Multi-Select with Text | Inputs & Forms | 24 | 3 |
| Reviews | Atoms | 22 | 2 |
| Text Button—Icon Left | Atoms | 16 | 4 |
| Stepper CTA | Atoms | 12 | 2 |
| Star | Atoms | 12 | 2 |
| Accordion Section | Atoms | 12 | 2 |
| Text Input (single line) | Inputs & Forms | 12 | 2 |
| Badges and Tags | Other | 12 | 2 |
| Button Menu | Atoms | 10 | 2 |
| Tabbed Selector Button | Atoms | 10 | 2 |
| Floating Action Button with Text | Atoms | 10 | 2 |
| Toggle Switch (text) | Inputs & Forms | 10 | 3 |
| Search Field | Inputs & Forms | 10 | 2 |
| Stepper Control | Atoms | 8 | 2 |
| Toast Bar | Molecules | 8 | 2 |
| Image Ratios | Other | 8 | 1 |
| Sale Percentage | Other | 8 | 2 |
| Subnav Dropdown Options | Atoms | 7 | 2 |
| Basic Form | Molecules | 7 | 3 |
| Dropdown | Inputs & Forms | 7 | 1 |
| Text Input—Password | Inputs & Forms | 7 | 1 |
| Product Images | Other | 7 | 1 |
| Price and Label | Other | 7 | 1 |
| Stateful Action Button | Atoms | 6 | 1 |
| Button group | Molecules | 6 | 2 |
| Modal Dialog | Molecules | 6 | 3 |
| Text Input (name, two fields) | Inputs & Forms | 6 | 2 |
| Toggle with Text | Inputs & Forms | 6 | 1 |
| Text Input—Multiline | Inputs & Forms | 6 | 1 |
| Text Input—Date | Inputs & Forms | 6 | 1 |
| Slider | Inputs & Forms | 6 | 1 |
| Email Capture | Inputs & Forms | 6 | 1 |
| Simple Menu | Atoms | 5 | 1 |
| Tabbed Selector | Atoms | 5 | 1 |
| Modal Button Group | Atoms | 5 | 2 |
| Text Section | Molecules | 5 | 1 |
| Form Dropdown Option | Inputs & Forms | 5 | 1 |
| Play Button | Atoms | 4 | 1 |
| Breadcrumbs | Atoms | 4 | 1 |
| Slider Scroll Bar | Atoms | 4 | 1 |
| Next-Previous Selector | Atoms | 4 | 2 |
| CTA Row | Atoms | 4 | 1 |
| Category Button | Atoms | 4 | 1 |
| Section Headline with CTA | Molecules | 4 | 1 |
| Upload Image Area | Inputs & Forms | 4 | 1 |
| Multi-Selector | Inputs & Forms | 4 | 1 |
| List | Other | 4 | 1 |
| Text Section with Button Group | Molecules | 3 | 1 |
| Product Content | Molecules | 3 | 1 |
| Section Headline | Molecules | 3 | 1 |
| Product Grid Card | Molecules | 3 | 2 |
| Product Lineup—Single | Molecules | 3 | 1 |
| Subnav Dropdown | Molecules | 3 | 1 |
| Form Dropdown | Inputs & Forms | 3 | 1 |
| Slider page selector | Molecules | 2 | 2 |
| Checkbox | Inputs & Forms | 2 | 1 |
| Switch | Inputs & Forms | 2 | 2 |
| Radio Button | Inputs & Forms | 2 | 1 |
| Single Select Box | Inputs & Forms | 2 | 1 |
| Free Trial Card | Molecules | 1 | 1 |
| Carousel Product | Molecules | 1 | 1 |
| Multi-CTA List | Molecules | 1 | 1 |
| Text Toggle Selector | Inputs & Forms | 1 | 1 |
| Text Toggle Selector | Inputs & Forms | 1 | 1 |

---
*Generated by `build-inventory.ts`*
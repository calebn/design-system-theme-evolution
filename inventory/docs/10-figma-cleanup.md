# 10 · Figma Cleanup Checklist

> Actionable items to improve Figma consistency before building components in code.
> Check items off as you address them and re-run `npm run build` to verify.

## 0. Figma → Code Component Consolidation

The following table shows which Figma frames will be collapsed into a single React component. Designers can optionally restructure Figma to reflect this hierarchy, but it is not required.

| Code Component | Tier | Figma Frames |
|----------------|------|--------------|
| `Button` | Primitive | Button, Category Button, Floating Action Button with Text, Stateful Action Button |
| `IconButton` | Primitive | Close Button, Play Button, Floating Action Button, Expand-Collapse Button, Increase-Decrease Buttons, Next-Previous Buttons |
| `LinkButton` | Primitive | Text Button—Icon Left, Text Button—Icon Right |
| `Input` | Primitive | Text Input (single line), Text Input—Date, Text Input—Password, Search Field |
| `Textarea` | Primitive | Text Input—Multiline |
| `TextInputGroup` | Primitive | Text Input (name, two fields) |
| `Select` | Primitive | Dropdown, Form Dropdown, Form Dropdown Option |
| `Checkbox` | Primitive | Checkbox |
| `RadioButton` | Primitive | Radio Button |
| `Switch` | Primitive | Switch, Toggle with Text |
| `Slider` | Primitive | Slider |
| `Badge` | Primitive | Badges and Tags, Sale Percentage |
| `StarRating` | Primitive | Star, Reviews |
| `PriceLabel` | Primitive | Price and Label |
| `Breadcrumbs` | Primitive | Breadcrumbs |
| `Menu` | Primitive | Simple Menu, Button Menu |
| `Tabs` | Primitive | Tabbed Selector, Tabbed Selector Button |
| `SubnavDropdown` | Primitive | Subnav Dropdown, Subnav Dropdown Options |
| `QuantityInput` | Primitive | Stepper Control |
| `AddToCart` | Composition | Stepper CTA |
| `Pagination` | Primitive | Next-Previous Selector, Slider page selector, Slider Scroll Bar |
| `Toast` | Primitive | Toast Bar |
| `Modal` | Composition | Modal Dialog, Modal Button Group |
| `Accordion` | Composition | Accordion Section |
| `EmailCapture` | Composition | Email Capture |
| `FileUpload` | Composition | Upload Image Area |
| `SelectionGroup` | Composition | Toggle Switch (text), Multi-Select with Text, Multi-Selector, Text Toggle Selector, Single Select Box |
| `ButtonGroup` | Composition | Button group, CTA Row |
| `ProductCard` | Composition | Product Grid Card |
| `ProductDetail` | Composition | Product Content, Product Lineup—Single |
| `FreeTrialCard` | Composition | Free Trial Card |
| `SectionLayout` | Builder Block | Section Headline, Section Headline with CTA, Text Section, Text Section with Button Group |
| `ProductCarousel` | Builder Block | Carousel Product |
| `CtaList` | Builder Block | Multi-CTA List |
| `BasicForm` | Builder Block | Basic Form |

### Unmapped Figma frames

These frames are not yet assigned to a code component — review and assign:

- [ ] **Product Images** (Data Display)
- [ ] **Image Ratios** (Data Display)
- [ ] **List** (Data Display)

## 1. Rename Auto-Generated Property Values

These components have Figma auto-names (`State2`, `Variant4`, etc.) that make it impossible to know what state is being represented.

- [ ] **Text Button—Icon Left** — rename `State=State8` to a descriptive value
- [ ] **Play Button** — rename `State=State2` to a descriptive value
- [ ] **Play Button** — rename `State=State3` to a descriptive value
- [ ] **Play Button** — rename `State=State4` to a descriptive value
- [ ] **Category Button** — rename `State=Variant4` to a descriptive value
- [ ] **Toggle with Text** — rename `Property 1=Variant6` to a descriptive value
- [ ] **Text Input—Multiline** — rename `State=State4` to a descriptive value
- [ ] **Text Input—Multiline** — rename `State=State6` to a descriptive value

## 2. Fix State Axis Pollution

Values incorrectly placed in the `State` axis.

- [ ] **Text Button—Icon Left** — rename `State=Disable` to `State=Disabled`
- [ ] **Stepper CTA** — rename `State=Maxium` to `State=Maximum`
- [ ] **CTA Row** — rename `State=Focused` to `State=Focus (duplicate of "Focus")`
- [ ] **Toggle Switch (text)** — rename `State=Focu` to `State=Focus`
- [ ] **Form Dropdown** — move `State=Desktop` to the `Size` axis
- [ ] **Form Dropdown** — move `State=Mobile` to the `Size` axis
- [ ] **Form Dropdown** — move `State=Tablet` to the `Size` axis
- [ ] **Multi-Selector** — move `State=Checkbox` to the `Style` axis
- [ ] **Multi-Selector** — move `State=Radio` to the `Style` axis

## 3. Deduplicate Component Frames

Components with duplicate names that appear twice in Figma:

- [ ] **Text Toggle Selector** — appears 2 times (IDs: 1623:5649, 1623:5653) — delete or rename the duplicate

## 4. Add Missing Critical States

Components missing Hover, Focus, or Disabled states (minimum viable interactive states).

- [ ] **Play Button** — add `Hover, Disabled` state variant(s)
- [ ] **Category Button** — add `Disabled` state variant(s)
- [ ] **Modal Button Group** — add `Hover, Disabled` state variant(s)
- [ ] **Accordion Section** — add `Disabled` state variant(s)
- [ ] **Stateful Action Button** — add `Disabled` state variant(s)
- [ ] **Basic Form** — add `Hover, Disabled` state variant(s)
- [ ] **Modal Dialog** — add `Hover, Disabled` state variant(s)
- [ ] **Checkbox** — add `Hover, Disabled` state variant(s)
- [ ] **Text Input (name, two fields)** — add `Disabled` state variant(s)
- [ ] **Radio Button** — add `Hover, Disabled` state variant(s)
- [ ] **Text Input—Multiline** — add `Disabled` state variant(s)
- [ ] **Form Dropdown** — add `Hover, Disabled` state variant(s)
- [ ] **Multi-Selector** — add `Hover, Disabled` state variant(s)
- [ ] **Single Select Box** — add `Hover, Disabled` state variant(s)

## 5. Reclassify "Other" Section Components

Move components out of the catch-all "Other" Figma section into their proper atomic sections.

- [ ] **Badges and Tags** → move to **Atoms** section
- [ ] **Product Images** → move to **Atoms** section
- [ ] **Price and Label** → move to **Atoms** section
- [ ] **Image Ratios** → move to **Consider removing — this is a layout constraint, not a component** section
- [ ] **Sale Percentage** → move to **Atoms** section
- [ ] **List** → move to **Atoms** section

## 6. Add Responsive Variants

Key molecules/atoms that should have Desktop + Tablet + Mobile variants but currently do not.

- [ ] **Button** — add Desktop, Tablet, Mobile size variants
- [ ] **Text Input (single line)** — add Desktop, Tablet, Mobile size variants
- [ ] **Dropdown** — add Desktop, Tablet, Mobile size variants
- [ ] **Search Field** — add Desktop, Tablet, Mobile size variants
- [ ] **Toast Bar** — add Desktop, Tablet, Mobile size variants
- [ ] **Carousel Product** — add Desktop, Tablet, Mobile size variants
- [ ] **Product Content** — add Desktop, Tablet, Mobile size variants

## 7. Implement Missing Tokens in Code

Figma variables that have no matching token in `commerce-theme`.


**Colors (in Figma, not in code):**

**Spacing (in Figma, not in code):**
- [ ] Add `Spacing | Horizontal/LG` (`18px`) to `commerce-theme/src/spacing.ts`
- [ ] Add `Spacing | In Component/CTA Button - CTA text link | Horizontal` (`32px`) to `commerce-theme/src/spacing.ts`
- [ ] Add `Padding/LG` (`32px`) to `commerce-theme/src/spacing.ts`

**Shadows (in Figma, not in code):**
- [ ] Add `Product Shadows/Large` to `commerce-theme/src/shadows.ts`
- [ ] Add `Product Shadows/Small` to `commerce-theme/src/shadows.ts`

## 8. Audit Code-Only Tokens

Tokens that exist in `commerce-theme` but have no Figma variable. These are either orphaned (remove) or missing from Figma (add variable).


**Code-only colors:**
- [ ] `secondary.c150` (`#9bcdff`) — add to Figma or remove from `colors.ts`
- [ ] `secondary.c300` (`#3640b8`) — add to Figma or remove from `colors.ts`
- [ ] `success.vivid` (`#54eb54`) — add to Figma or remove from `colors.ts`
- [ ] `yellow.c100` (`#f2ebbd`) — add to Figma or remove from `colors.ts`
- [ ] `yellow.c200` (`#efdf79`) — add to Figma or remove from `colors.ts`
- [ ] `yellow.c300` (`#dec62b`) — add to Figma or remove from `colors.ts`
- [ ] `orange.c100` (`#ecd1c1`) — add to Figma or remove from `colors.ts`
- [ ] `orange.c200` (`#d87c44`) — add to Figma or remove from `colors.ts`
- [ ] `orange.c300` (`#ad4100`) — add to Figma or remove from `colors.ts`
- [ ] `red.c100` (`#edcbcb`) — add to Figma or remove from `colors.ts`
- [ ] `red.c200` (`#da6969`) — add to Figma or remove from `colors.ts`
- [ ] `red.c300` (`#b31e31`) — add to Figma or remove from `colors.ts`
- [ ] `purple.c100` (`#debbda`) — add to Figma or remove from `colors.ts`
- [ ] `purple.c200` (`#a4619c`) — add to Figma or remove from `colors.ts`
- [ ] `purple.c300` (`#502d4c`) — add to Figma or remove from `colors.ts`
- [ ] `green.c100` (`#c8e4c8`) — add to Figma or remove from `colors.ts`
- [ ] `green.c200` (`#88ce88`) — add to Figma or remove from `colors.ts`
- [ ] `green.c300` (`#227421`) — add to Figma or remove from `colors.ts`
- [ ] `grey.c200` (`#f5f5f5`) — add to Figma or remove from `colors.ts`
- [ ] `grey.c300` (`#ebebeb`) — add to Figma or remove from `colors.ts`
- [ ] `grey.c400` (`#dbdbdb`) — add to Figma or remove from `colors.ts`
- [ ] `grey.c500` (`#c7c7c7`) — add to Figma or remove from `colors.ts`
- [ ] `black.c100` (`#7e7e7e`) — add to Figma or remove from `colors.ts`
- [ ] `black.c200` (`#3d3d3d`) — add to Figma or remove from `colors.ts`
- [ ] `black.c400` (`#1f1d20`) — add to Figma or remove from `colors.ts`
- [ ] `pureBlack` (`#000000`) — add to Figma or remove from `colors.ts`

**Code-only spacing:**
- [ ] `sp0` (`0px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp2` (`2px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp4` (`4px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp10` (`10px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp14` (`14px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp20` (`20px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp45` (`45px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp90` (`90px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp120` (`120px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp144` (`144px`) — add to Figma or remove from `spacing.ts`
- [ ] `sp180` (`180px`) — add to Figma or remove from `spacing.ts`

---
*Generated by `build-inventory.ts`*
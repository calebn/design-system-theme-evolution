# 10 · Figma Cleanup Checklist

> Actionable items to improve Figma consistency before building components in code.
> Check items off as you address them and re-run `npm run build` to verify.

## 1. Rename Auto-Generated Property Values

These components have Figma auto-names (`State2`, `Variant4`, etc.) that make it impossible to know what state is being represented.

- [ ] **Category Button** — rename `State=Variant4` to a descriptive value
- [ ] **Play Button** — rename `State=State2` to a descriptive value
- [ ] **Play Button** — rename `State=State3` to a descriptive value
- [ ] **Play Button** — rename `State=State4` to a descriptive value
- [ ] **Text Button—Icon Left** — rename `State=State8` to a descriptive value
- [ ] **Text Input—Multiline** — rename `State=State4` to a descriptive value
- [ ] **Text Input—Multiline** — rename `State=State6` to a descriptive value
- [ ] **Toggle with Text** — rename `Property 1=Variant6` to a descriptive value

## 2. Fix State Axis Pollution

Values incorrectly placed in the `State` axis.

- [ ] **CTA Row** — rename `State=Focused` to `State=Focus (duplicate of "Focus")`
- [ ] **Form Dropdown** — move `State=Desktop` to the `Size` axis
- [ ] **Form Dropdown** — move `State=Mobile` to the `Size` axis
- [ ] **Form Dropdown** — move `State=Tablet` to the `Size` axis
- [ ] **Multi-Selector** — move `State=Checkbox` to the `Style` axis
- [ ] **Multi-Selector** — move `State=Radio` to the `Style` axis
- [ ] **Stepper CTA** — rename `State=Maxium` to `State=Maximum`
- [ ] **Text Button—Icon Left** — rename `State=Disable` to `State=Disabled`
- [ ] **Toggle Switch (text)** — rename `State=Focu` to `State=Focus`

## 3. Deduplicate Component Frames

Components with duplicate names that appear twice in Figma:

- [ ] **Text Toggle Selector** — appears 2 times (IDs: 1623:5649, 1623:5653) — delete or rename the duplicate

## 4. Add Missing Critical States

Components missing Hover, Focus, or Disabled states (minimum viable interactive states).

- [ ] **Accordion Section** — add `Disabled` state variant(s)
- [ ] **Basic Form** — add `Hover, Disabled` state variant(s)
- [ ] **Category Button** — add `Disabled` state variant(s)
- [ ] **Checkbox** — add `Hover, Disabled` state variant(s)
- [ ] **Form Dropdown** — add `Hover, Disabled` state variant(s)
- [ ] **Modal Button Group** — add `Hover, Disabled` state variant(s)
- [ ] **Modal Dialog** — add `Hover, Disabled` state variant(s)
- [ ] **Multi-Selector** — add `Hover, Disabled` state variant(s)
- [ ] **Play Button** — add `Hover, Disabled` state variant(s)
- [ ] **Radio Button** — add `Hover, Disabled` state variant(s)
- [ ] **Single Select Box** — add `Hover, Disabled` state variant(s)
- [ ] **Stateful Action Button** — add `Disabled` state variant(s)
- [ ] **Text Input (name, two fields)** — add `Disabled` state variant(s)
- [ ] **Text Input—Multiline** — add `Disabled` state variant(s)

## 5. Reclassify "Other" Section Components

Move components out of the catch-all "Other" Figma section into their proper atomic sections.

- [ ] **Badges and Tags** → move to **Atoms** section
- [ ] **Image Ratios** → move to **Consider removing — this is a layout constraint, not a component** section
- [ ] **List** → move to **Atoms** section
- [ ] **Price and Label** → move to **Atoms** section
- [ ] **Product Images** → move to **Atoms** section
- [ ] **Sale Percentage** → move to **Atoms** section

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
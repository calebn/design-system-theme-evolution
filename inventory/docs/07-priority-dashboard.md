# 07 · Build Priority Dashboard

> Scored by **code component** (not Figma frame). The "By Code Component" table uses the **max** score across all constituent Figma frames.

## Scoring Methodology

| Dimension | Max Points | How Points Are Earned |
|-----------|------------|----------------------|
| **Section** | 3 | Atoms = 3 · Inputs & Forms = 2 · Molecules = 1 · Other = 0 |
| **Variant Quality** | 2 | 2 if no auto-generated/inconsistent state names · −1 per issue (min 0) |
| **State Coverage** | 2 | 2 if Default + Hover + Disabled all present · 1 if any states exist · 0 otherwise |
| **Responsive** | 1 | 1 if Figma frame has Desktop/Tablet/Mobile variants |
| **Dependency Weight** | 2 | 2 if 3+ components depend on this · 1 if 1–2 · 0 if none |
| **Total** | **10** | |

**Recommendation thresholds:**

| Score | Label | Meaning |
|-------|-------|---------|
| 7–10 | ✅ Build first | High-value, well-specified, many dependents |
| 5–6 | ✅ Ready to build | Well-specified, few or no dependents |
| 3–4 | 🔄 Build with minor caveats | Missing some Figma specs; build is unblocked but gaps exist |
| 0–2 | ⏳ Address coverage gaps first | Significant Figma gaps; resolve before building |
| any | ⚠️ Needs Figma cleanup | Auto-generated state names present — resolve regardless of score |

## By Code Component

| Code Component | Tier | Category | Figma Frames | Dep | **Score** | Recommendation |
|----------------|------|----------|-------------|-----|-----------|----------------|
| `Button` | Primitive | Actions | 4 ⚠️ | 15 | **9** | ✅ Build first — high dependency weight (some frames need Figma cleanup) |
| `LinkButton` | Primitive | Actions | 2 ⚠️ | 4 | **9** | ✅ Build first — high dependency weight (some frames need Figma cleanup) |
| `StarRating` | Primitive | Data Display | 2 | 5 | **9** | ✅ Build first — high dependency weight |
| `ButtonGroup` | Composition | Actions | 2 | 1 | **8** | ✅ Build first — high dependency weight |
| `IconButton` | Primitive | Actions | 6 ⚠️ | 5 | **8** | ✅ Build first — high dependency weight (some frames need Figma cleanup) |
| `Pagination` | Primitive | Selection & Controls | 3 | 2 | **8** | ✅ Build first — high dependency weight |
| `Stepper` | Primitive | Selection & Controls | 2 | 2 | **8** | ✅ Build first — high dependency weight |
| `SubnavDropdown` | Primitive | Navigation | 2 | 1 | **8** | ✅ Build first — high dependency weight |
| `Tabs` | Primitive | Navigation | 2 | 1 | **8** | ✅ Build first — high dependency weight |
| `Accordion` | Composition | Content Layout | 1 | 0 | **7** | ✅ Build first — high dependency weight |
| `Breadcrumbs` | Primitive | Navigation | 1 | 0 | **7** | ✅ Build first — high dependency weight |
| `Input` | Primitive | Data Entry | 4 | 1 | **7** | ✅ Build first — high dependency weight |
| `Menu` | Primitive | Navigation | 2 | 0 | **7** | ✅ Build first — high dependency weight |
| `Modal` | Composition | Feedback & Overlays | 2 | 1 | **7** | ✅ Build first — high dependency weight |
| `Select` | Primitive | Data Entry | 3 | 1 | **7** | ✅ Build first — high dependency weight |
| `Checkbox` | Primitive | Data Entry | 1 | 1 | **6** | ✅ Ready to build |
| `EmailCapture` | Composition | Data Entry | 1 | 0 | **6** | ✅ Ready to build |
| `FileUpload` | Composition | Data Entry | 1 | 0 | **6** | ✅ Ready to build |
| `RadioButton` | Primitive | Data Entry | 1 | 1 | **6** | ✅ Ready to build |
| `SelectionGroup` | Composition | Selection & Controls | 6 | 0 | **6** | ✅ Ready to build |
| `Slider` | Primitive | Data Entry | 1 | 0 | **6** | ✅ Ready to build |
| `BasicForm` | Builder Block | Data Entry | 1 | 0 | **5** | ✅ Ready to build |
| `TextInputGroup` | Primitive | Data Entry | 1 | 0 | **5** | ✅ Ready to build |
| `Badge` | Primitive | Data Display | 2 | 5 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants) |
| `PriceLabel` | Primitive | Data Display | 1 | 4 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants) |
| `ProductCard` | Composition | Product | 1 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| `ProductDetail` | Composition | Product | 2 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| `SectionLayout` | Builder Block | Content Layout | 4 | 1 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| `Toggle` | Primitive | Selection & Controls | 2 ⚠️ | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) (some frames need Figma cleanup) |
| `CtaList` | Builder Block | Product | 1 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| `FreeTrialCard` | Composition | Product | 1 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| `ProductCarousel` | Builder Block | Product | 1 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| `Textarea` | Primitive | Data Entry | 1 ⚠️ | 0 | **3** | ⚠️ Needs Figma cleanup (2 inconsistent state name(s) in Figma; missing state(s): Disabled; no responsive variants; no downstream dependents) |
| `Toast` | Primitive | Feedback & Overlays | 1 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |

## By Figma Frame (full detail)

> The source data — one row per Figma component frame.

| Figma Frame | Code Component | Section | Sec | Var | State | Resp | Dep | **Total** | Recommendation |
|-------------|----------------|---------|-----|-----|-------|------|-----|-----------|----------------|
| Button | `Button` | Atoms | 3 | 2 | 2 | 0 | 2 (15) | **9** | ✅ Build first — high dependency weight |
| Star | `StarRating` | Atoms | 3 | 2 | 2 | 0 | 2 (5) | **9** | ✅ Build first — high dependency weight |
| Text Button—Icon Right | `LinkButton` | Atoms | 3 | 2 | 2 | 0 | 2 (4) | **9** | ✅ Build first — high dependency weight |
| Close Button | `IconButton` | Atoms | 3 | 2 | 2 | 0 | 1 (2) | **8** | ✅ Build first — high dependency weight |
| CTA Row | `ButtonGroup` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Expand-Collapse Button | `IconButton` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Increase-Decrease Buttons | `IconButton` | Atoms | 3 | 2 | 2 | 0 | 1 (2) | **8** | ✅ Build first — high dependency weight |
| Slider Scroll Bar | `Pagination` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Stepper Control | `Stepper` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Stepper CTA | `Stepper` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Subnav Dropdown Options | `SubnavDropdown` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Tabbed Selector Button | `Tabs` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Accordion Section | `Accordion` | Atoms | 3 | 2 | 1 | 1 | 0 | **7** | ✅ Build first — high dependency weight |
| Breadcrumbs | `Breadcrumbs` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Button Menu | `Menu` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Dropdown | `Select` | Inputs & Forms | 2 | 2 | 2 | 0 | 1 (1) | **7** | ✅ Build first — high dependency weight |
| Floating Action Button | `IconButton` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Floating Action Button with Text | `Button` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Modal Button Group | `Modal` | Atoms | 3 | 2 | 1 | 0 | 1 (1) | **7** | ✅ Build first — high dependency weight |
| Next-Previous Buttons | `IconButton` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Simple Menu | `Menu` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Text Input (single line) | `Input` | Inputs & Forms | 2 | 2 | 2 | 0 | 1 (1) | **7** | ✅ Build first — high dependency weight |
| Checkbox | `Checkbox` | Inputs & Forms | 2 | 2 | 1 | 0 | 1 (1) | **6** | ✅ Ready to build |
| Email Capture | `EmailCapture` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Form Dropdown | `Select` | Inputs & Forms | 2 | 2 | 1 | 1 | 0 | **6** | ✅ Ready to build |
| Form Dropdown Option | `Select` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Multi-Select with Text | `SelectionGroup` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Next-Previous Selector | `Pagination` | Atoms | 3 | 2 | 0 | 0 | 1 (1) | **6** | ✅ Ready to build |
| Radio Button | `RadioButton` | Inputs & Forms | 2 | 2 | 1 | 0 | 1 (1) | **6** | ✅ Ready to build |
| Search Field | `Input` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Slider | `Slider` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Stateful Action Button | `Button` | Atoms | 3 | 2 | 1 | 0 | 0 | **6** | ✅ Ready to build |
| Text Button—Icon Left | `LinkButton` | Atoms | 3 | 1 | 2 | 0 | 0 | **6** | ⚠️ Needs Figma cleanup (1 inconsistent state name(s) in Figma; no responsive variants; no downstream dependents) |
| Text Input—Date | `Input` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Text Input—Password | `Input` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Toggle Switch (text) | `SelectionGroup` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Upload Image Area | `FileUpload` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Basic Form | `BasicForm` | Molecules | 1 | 2 | 1 | 1 | 0 | **5** | ✅ Ready to build |
| Category Button | `Button` | Atoms | 3 | 1 | 1 | 0 | 0 | **5** | ⚠️ Needs Figma cleanup (1 inconsistent state name(s) in Figma; missing state(s): Disabled; no responsive variants; no downstream dependents) |
| Modal Dialog | `Modal` | Molecules | 1 | 2 | 1 | 1 | 0 | **5** | ✅ Ready to build |
| Multi-Selector | `SelectionGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Reviews | `StarRating` | Atoms | 3 | 2 | 0 | 0 | 0 | **5** | ✅ Ready to build |
| Single Select Box | `SelectionGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Tabbed Selector | `Tabs` | Atoms | 3 | 2 | 0 | 0 | 0 | **5** | ✅ Ready to build |
| Text Input (name, two fields) | `TextInputGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Text Toggle Selector | `SelectionGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Text Toggle Selector | `SelectionGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Badges and Tags | `Badge` | Other | 0 | 2 | 0 | 0 | 2 (5) | **4** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants) |
| Button group | `ButtonGroup` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| Play Button | `IconButton` | Atoms | 3 | 0 | 1 | 0 | 0 | **4** | ⚠️ Needs Figma cleanup (3 inconsistent state name(s) in Figma; missing state(s): Hover, Disabled; no responsive variants; no downstream dependents) |
| Price and Label | `PriceLabel` | Other | 0 | 2 | 0 | 0 | 2 (4) | **4** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants) |
| Product Grid Card | `ProductCard` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| Product Lineup—Single | `ProductDetail` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| Section Headline | `SectionLayout` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| Section Headline with CTA | `SectionLayout` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| Subnav Dropdown | `SubnavDropdown` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| Switch | `Toggle` | Inputs & Forms | 2 | 2 | 0 | 0 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| Text Section | `SectionLayout` | Molecules | 1 | 2 | 0 | 0 | 1 (1) | **4** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants) |
| Text Section with Button Group | `SectionLayout` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats (no state variants in Figma; no downstream dependents) |
| Toggle with Text | `Toggle` | Inputs & Forms | 2 | 1 | 1 | 0 | 0 | **4** | ⚠️ Needs Figma cleanup (1 inconsistent state name(s) in Figma; missing state(s): Disabled; no responsive variants; no downstream dependents) |
| Carousel Product | `ProductCarousel` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| Free Trial Card | `FreeTrialCard` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| Multi-CTA List | `CtaList` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| Product Content | `ProductDetail` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| Slider page selector | `Pagination` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| Text Input—Multiline | `Textarea` | Inputs & Forms | 2 | 0 | 1 | 0 | 0 | **3** | ⚠️ Needs Figma cleanup (2 inconsistent state name(s) in Figma; missing state(s): Disabled; no responsive variants; no downstream dependents) |
| Toast Bar | `Toast` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats (no state variants in Figma; no responsive variants; no downstream dependents) |
| Image Ratios | `—` | Other | 0 | 2 | 0 | 0 | 0 | **2** | ⏳ Address coverage gaps first (no state variants in Figma; no responsive variants; no downstream dependents) |
| List | `—` | Other | 0 | 2 | 0 | 0 | 0 | **2** | ⏳ Address coverage gaps first (no state variants in Figma; no responsive variants; no downstream dependents) |
| Product Images | `—` | Other | 0 | 2 | 0 | 0 | 0 | **2** | ⏳ Address coverage gaps first (no state variants in Figma; no responsive variants; no downstream dependents) |
| Sale Percentage | `Badge` | Other | 0 | 2 | 0 | 0 | 0 | **2** | ⏳ Address coverage gaps first (no state variants in Figma; no responsive variants; no downstream dependents) |

## Summary

| Status | Count |
|--------|-------|
| ✅ Ready / high priority | 45 |
| 🔄 Build with minor caveats | 17 |
| ⚠️ Needs Figma cleanup | 5 |
| ⏳ Deferred | 4 |

---
*Generated by `build-inventory.ts`*
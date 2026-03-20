# 07 · Build Priority Dashboard

> Scored by **code component** (not Figma frame). Multiple Figma frames may contribute to one code component.
> Score = max across constituent Figma frames. **Scoring:** Section (atoms=3, inputs=2, molecules=1) + Variant quality (2) + State coverage (2) + Responsive (1) + Dependency weight (2). Max = 10.

## By Code Component

| Code Component | Tier | Category | Figma Frames | Dep | **Score** | Recommendation |
|----------------|------|----------|-------------|-----|-----------|----------------|
| `Button` | Primitive | Actions | 9 ⚠️ | 18 | **9** | ✅ Build first — high dependency weight (some frames need Figma cleanup) |
| `Stepper` | Primitive | Selection & Controls | 3 | 5 | **9** | ✅ Build first — high dependency weight |
| `Accordion` | Composition | Content Layout | 2 | 1 | **8** | ✅ Build first — high dependency weight |
| `ButtonGroup` | Composition | Actions | 2 | 1 | **8** | ✅ Build first — high dependency weight |
| `Pagination` | Primitive | Selection & Controls | 4 | 5 | **8** | ✅ Build first — high dependency weight |
| `StarRating` | Primitive | Data Display | 2 | 4 | **8** | ✅ Build first — high dependency weight |
| `SubnavDropdown` | Primitive | Navigation | 2 | 1 | **8** | ✅ Build first — high dependency weight |
| `Tabs` | Primitive | Navigation | 2 | 1 | **8** | ✅ Build first — high dependency weight |
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
| `Badge` | Primitive | Data Display | 2 | 3 | **4** | 🔄 Build with minor caveats |
| `PriceLabel` | Primitive | Data Display | 1 | 3 | **4** | 🔄 Build with minor caveats |
| `ProductCard` | Composition | Product | 1 | 0 | **4** | 🔄 Build with minor caveats |
| `ProductDetail` | Composition | Product | 2 | 0 | **4** | 🔄 Build with minor caveats |
| `SectionLayout` | Builder Block | Content Layout | 4 | 0 | **4** | 🔄 Build with minor caveats |
| `Toggle` | Primitive | Selection & Controls | 2 ⚠️ | 0 | **4** | 🔄 Build with minor caveats (some frames need Figma cleanup) |
| `CtaList` | Builder Block | Product | 1 | 0 | **3** | 🔄 Build with minor caveats |
| `FreeTrialCard` | Composition | Product | 1 | 0 | **3** | 🔄 Build with minor caveats |
| `ProductCarousel` | Builder Block | Product | 1 | 0 | **3** | 🔄 Build with minor caveats |
| `Textarea` | Primitive | Data Entry | 1 ⚠️ | 0 | **3** | ⚠️ Needs Figma cleanup (inconsistent state names) |
| `Toast` | Primitive | Feedback & Overlays | 1 | 0 | **3** | 🔄 Build with minor caveats |

## By Figma Frame (full detail)

> The source data — one row per Figma component frame.

| Figma Frame | Code Component | Section | Sec | Var | State | Resp | Dep | **Total** | Recommendation |
|-------------|----------------|---------|-----|-----|-------|------|-----|-----------|----------------|
| Button | `Button` | Atoms | 3 | 2 | 2 | 0 | 2 (13) | **9** | ✅ Build first — high dependency weight |
| Stepper CTA | `Stepper` | Atoms | 3 | 2 | 2 | 0 | 2 (3) | **9** | ✅ Build first — high dependency weight |
| Text Button—Icon Right | `Button` | Atoms | 3 | 2 | 2 | 0 | 2 (3) | **9** | ✅ Build first — high dependency weight |
| Close Button | `Button` | Atoms | 3 | 2 | 2 | 0 | 1 (2) | **8** | ✅ Build first — high dependency weight |
| CTA Row | `ButtonGroup` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Expand-Collapse Button | `Accordion` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Increase-Decrease Buttons | `Stepper` | Atoms | 3 | 2 | 2 | 0 | 1 (2) | **8** | ✅ Build first — high dependency weight |
| Next-Previous Buttons | `Pagination` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Slider Scroll Bar | `Pagination` | Atoms | 3 | 2 | 2 | 0 | 1 (2) | **8** | ✅ Build first — high dependency weight |
| Star | `StarRating` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Subnav Dropdown Options | `SubnavDropdown` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Tabbed Selector Button | `Tabs` | Atoms | 3 | 2 | 2 | 0 | 1 (1) | **8** | ✅ Build first — high dependency weight |
| Accordion Section | `Accordion` | Atoms | 3 | 2 | 1 | 1 | 0 | **7** | ✅ Build first — high dependency weight |
| Breadcrumbs | `Breadcrumbs` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Button Menu | `Menu` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Dropdown | `Select` | Inputs & Forms | 2 | 2 | 2 | 0 | 1 (1) | **7** | ✅ Build first — high dependency weight |
| Floating Action Button | `Button` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Floating Action Button with Text | `Button` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Modal Button Group | `Modal` | Atoms | 3 | 2 | 1 | 0 | 1 (1) | **7** | ✅ Build first — high dependency weight |
| Reviews | `StarRating` | Atoms | 3 | 2 | 0 | 0 | 2 (3) | **7** | ✅ Build first — high dependency weight |
| Simple Menu | `Menu` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
| Stepper Control | `Stepper` | Atoms | 3 | 2 | 2 | 0 | 0 | **7** | ✅ Build first — high dependency weight |
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
| Text Button—Icon Left | `Button` | Atoms | 3 | 1 | 2 | 0 | 0 | **6** | ⚠️ Needs Figma cleanup (inconsistent state names) |
| Text Input—Date | `Input` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Text Input—Password | `Input` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Toggle Switch (text) | `SelectionGroup` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Upload Image Area | `FileUpload` | Inputs & Forms | 2 | 2 | 2 | 0 | 0 | **6** | ✅ Ready to build |
| Basic Form | `BasicForm` | Molecules | 1 | 2 | 1 | 1 | 0 | **5** | ✅ Ready to build |
| Category Button | `Button` | Atoms | 3 | 1 | 1 | 0 | 0 | **5** | ⚠️ Needs Figma cleanup (inconsistent state names) |
| Modal Dialog | `Modal` | Molecules | 1 | 2 | 1 | 1 | 0 | **5** | ✅ Ready to build |
| Multi-Selector | `SelectionGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Single Select Box | `SelectionGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Tabbed Selector | `Tabs` | Atoms | 3 | 2 | 0 | 0 | 0 | **5** | ✅ Ready to build |
| Text Input (name, two fields) | `TextInputGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Text Toggle Selector | `SelectionGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Text Toggle Selector | `SelectionGroup` | Inputs & Forms | 2 | 2 | 1 | 0 | 0 | **5** | ✅ Ready to build |
| Badges and Tags | `Badge` | Other | 0 | 2 | 0 | 0 | 2 (3) | **4** | 🔄 Build with minor caveats |
| Button group | `ButtonGroup` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats |
| Play Button | `Button` | Atoms | 3 | 0 | 1 | 0 | 0 | **4** | ⚠️ Needs Figma cleanup (inconsistent state names) |
| Price and Label | `PriceLabel` | Other | 0 | 2 | 0 | 0 | 2 (3) | **4** | 🔄 Build with minor caveats |
| Product Grid Card | `ProductCard` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats |
| Product Lineup—Single | `ProductDetail` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats |
| Section Headline | `SectionLayout` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats |
| Section Headline with CTA | `SectionLayout` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats |
| Slider page selector | `Pagination` | Molecules | 1 | 2 | 0 | 0 | 1 (1) | **4** | 🔄 Build with minor caveats |
| Subnav Dropdown | `SubnavDropdown` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats |
| Switch | `Toggle` | Inputs & Forms | 2 | 2 | 0 | 0 | 0 | **4** | 🔄 Build with minor caveats |
| Text Section with Button Group | `SectionLayout` | Molecules | 1 | 2 | 0 | 1 | 0 | **4** | 🔄 Build with minor caveats |
| Toggle with Text | `Toggle` | Inputs & Forms | 2 | 1 | 1 | 0 | 0 | **4** | ⚠️ Needs Figma cleanup (inconsistent state names) |
| Carousel Product | `ProductCarousel` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats |
| Free Trial Card | `FreeTrialCard` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats |
| Multi-CTA List | `CtaList` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats |
| Product Content | `ProductDetail` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats |
| Text Input—Multiline | `Textarea` | Inputs & Forms | 2 | 0 | 1 | 0 | 0 | **3** | ⚠️ Needs Figma cleanup (inconsistent state names) |
| Text Section | `SectionLayout` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats |
| Toast Bar | `Toast` | Molecules | 1 | 2 | 0 | 0 | 0 | **3** | 🔄 Build with minor caveats |
| Image Ratios | `—` | Other | 0 | 2 | 0 | 0 | 0 | **2** | ⏳ Address coverage gaps first |
| List | `—` | Other | 0 | 2 | 0 | 0 | 0 | **2** | ⏳ Address coverage gaps first |
| Product Images | `—` | Other | 0 | 2 | 0 | 0 | 0 | **2** | ⏳ Address coverage gaps first |
| Sale Percentage | `Badge` | Other | 0 | 2 | 0 | 0 | 0 | **2** | ⏳ Address coverage gaps first |

## Summary

| Status | Count |
|--------|-------|
| ✅ Ready / high priority | 45 |
| 🔄 Build with minor caveats | 17 |
| ⚠️ Needs Figma cleanup | 5 |
| ⏳ Deferred | 4 |

---
*Generated by `build-inventory.ts`*
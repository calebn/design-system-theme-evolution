# 09 · Naming Conventions

> Proposed naming standards for components, tokens, and property axes to create consistent, predictable identifiers across Figma and code.

## Component Naming Rules

### In Code (React)
1. **PascalCase** for all component names: `Button`, `TextInput`, `ProductCard`
2. **No em-dashes** — replace with nothing or with a word: `Text Button—Icon Right` → `TextButtonIconRight`
3. **No parentheses** — replace with a descriptor: `Text Input (single line)` → `TextInput`, `Text Input (name, two fields)` → `TextInputGroup`
4. **Spell out abbreviations** except: `CTA` (established in the brand), `FAB` (not recommended — prefer `FloatingActionButton`)
5. **No redundant suffixes** — avoid `Component`, `Widget`, `Element` suffixes
6. **Compound words** for composites: `SectionHeadlineWithCta` not `SectionHeadline_With_CTA`

### In Figma
1. Use the proposed code name as the Figma frame name where possible (enables future auto-generation)
2. Separate words with spaces in Figma: `Text Input`, `Section Headline`
3. Use em-dashes only for directional variants: `Text Button—Icon Right`

### CSS Class Prefix
All components use the `cc-` prefix (Commerce Components): `cc-button`, `cc-text-input`, `cc-product-card`

---

## Component Name Mapping

| Figma Name | Proposed Code Name | CSS Class | Category |
|------------|--------------------|-----------|----------|
| Accordion Section | `Accordion` | `cc-accordion` | Content Layout |
| Badges and Tags | `Badge` | `cc-badge` | Data Display |
| Basic Form | `Form` | `cc-form` | Data Entry |
| Breadcrumbs | `Breadcrumbs` | `cc-breadcrumbs` | Navigation |
| Button | `Button` | `cc-button` | Actions |
| Button group | `ButtonGroup` | `cc-button-group` | Selection & Controls |
| Button Menu | `ButtonMenu` | `cc-button-menu` | Navigation |
| Carousel Product | `ProductCarousel` | `cc-product-carousel` | Product |
| Category Button | `CategoryButton` | `cc-category-button` | Actions |
| Checkbox | `Checkbox` | `cc-checkbox` | Data Entry |
| Close Button | `CloseButton` | `cc-close-button` | Actions |
| CTA Row | `CtaRow` | `cc-cta-row` | Actions |
| Dropdown | `Dropdown` | `cc-dropdown` | Data Entry |
| Email Capture | `EmailCaptureField` | `cc-email-capture-field` | Data Entry |
| Expand-Collapse Button | `ExpandCollapseButton` | `cc-expand-collapse-button` | Selection & Controls |
| Floating Action Button | `FloatingActionButton` | `cc-floating-action-button` | Actions |
| Floating Action Button with Text | `FloatingActionButtonLabel` | `cc-floating-action-button-label` | Actions |
| Form Dropdown | `FormDropdown` | `cc-form-dropdown` | Data Entry |
| Form Dropdown Option | `DropdownOption` | `cc-dropdown-option` | Data Entry |
| Free Trial Card | `FreeTrialCard` | `cc-free-trial-card` | Product |
| Image Ratios | `ImageContainer` | `cc-image-container` | Data Display |
| Increase-Decrease Buttons | `QuantityButtons` | `cc-quantity-buttons` | Selection & Controls |
| List | `List` | `cc-list` | Data Display |
| Modal Button Group | `ModalButtonGroup` | `cc-modal-button-group` | Feedback & Overlays |
| Modal Dialog | `Modal` | `cc-modal` | Feedback & Overlays |
| Multi-CTA List | `CtaList` | `cc-cta-list` | Product |
| Multi-Select with Text | `MultiSelect` | `cc-multi-select` | Selection & Controls |
| Multi-Selector | `MultiSelector` | `cc-multi-selector` | Selection & Controls |
| Next-Previous Buttons | `PreviousNextButtons` | `cc-previous-next-buttons` | Selection & Controls |
| Next-Previous Selector | `PreviousNextSelector` | `cc-previous-next-selector` | Selection & Controls |
| Play Button | `PlayButton` | `cc-play-button` | Actions |
| Price and Label | `PriceLabel` | `cc-price-label` | Data Display |
| Product Content | `ProductContent` | `cc-product-content` | Product |
| Product Grid Card | `ProductCard` | `cc-product-card` | Product |
| Product Images | `ProductImage` | `cc-product-image` | Data Display |
| Product Lineup—Single | `ProductLineup` | `cc-product-lineup` | Product |
| Radio Button | `RadioButton` | `cc-radio-button` | Data Entry |
| Reviews | `ReviewRating` | `cc-review-rating` | Data Display |
| Sale Percentage | `SaleBadge` | `cc-sale-badge` | Data Display |
| Search Field | `SearchField` | `cc-search-field` | Data Entry |
| Section Headline | `SectionHeadline` | `cc-section-headline` | Content Layout |
| Section Headline with CTA | `SectionHeadlineWithCta` | `cc-section-headline-with-cta` | Content Layout |
| Simple Menu | `SimpleMenu` | `cc-simple-menu` | Navigation |
| Single Select Box | `SelectBox` | `cc-select-box` | Selection & Controls |
| Slider | `Slider` | `cc-slider` | Data Entry |
| Slider page selector | `PageSelector` | `cc-page-selector` | Selection & Controls |
| Slider Scroll Bar | `ScrollBar` | `cc-scroll-bar` | Selection & Controls |
| Star | `StarIcon` | `cc-star-icon` | Data Display |
| Stateful Action Button | `StatefulButton` | `cc-stateful-button` | Actions |
| Stepper Control | `StepperControl` | `cc-stepper-control` | Actions |
| Stepper CTA | `StepperCta` | `cc-stepper-cta` | Actions |
| Subnav Dropdown | `SubnavDropdown` | `cc-subnav-dropdown` | Navigation |
| Subnav Dropdown Options | `SubnavDropdownOption` | `cc-subnav-dropdown-option` | Navigation |
| Switch | `Switch` | `cc-switch` | Data Entry |
| Tabbed Selector | `TabbedSelector` | `cc-tabbed-selector` | Navigation |
| Tabbed Selector Button | `TabbedSelectorTab` | `cc-tabbed-selector-tab` | Navigation |
| Text Button—Icon Left | `TextButtonIconLeft` | `cc-text-button-icon-left` | Actions |
| Text Button—Icon Right | `TextButtonIconRight` | `cc-text-button-icon-right` | Actions |
| Text Input (name, two fields) | `TextInputGroup` | `cc-text-input-group` | Data Entry |
| Text Input (single line) | `TextInput` | `cc-text-input` | Data Entry |
| Text Input—Date | `DateInput` | `cc-date-input` | Data Entry |
| Text Input—Multiline | `Textarea` | `cc-textarea` | Data Entry |
| Text Input—Password | `PasswordInput` | `cc-password-input` | Data Entry |
| Text Section | `TextSection` | `cc-text-section` | Content Layout |
| Text Section with Button Group | `TextSectionWithButtons` | `cc-text-section-with-buttons` | Content Layout |
| Text Toggle Selector | `TextToggleSelector` | `cc-text-toggle-selector` | Selection & Controls |
| Text Toggle Selector | `TextToggleSelector` | `cc-text-toggle-selector` | Selection & Controls |
| Toast Bar | `Toast` | `cc-toast` | Feedback & Overlays |
| Toggle Switch (text) | `ToggleGroup` | `cc-toggle-group` | Selection & Controls |
| Toggle with Text | `Toggle` | `cc-toggle` | Selection & Controls |
| Upload Image Area | `FileUpload` | `cc-file-upload` | Data Entry |

---

## Token Naming Rules

### Token Name Format
```
{tier}-{category}-{variant}-{property}
```

- **Tier prefixes:** none for primitives · `color-`, `spacing-`, `shadow-` for semantic · `component-{name}-` for component-scoped
- **All kebab-case:** `color-brand-primary`, `spacing-h-md`, `component-button-padding-horizontal`
- **No camelCase in token names**

### Examples

| Figma Variable | DTCG Token Name | Tier |
|----------------|-----------------|------|
| `Primary/Logos Blue` | `primary-logos-blue` | Primitive |
| `Primary/Logos Blue` (alias) | `color-brand-primary` | Semantic |
| `Deep Colors/Green` | `color-feedback-success` | Semantic |
| `Spacing \| Horizontal/MD` | `spacing-h-md` | Semantic |
| `Spacing \| In Component/CTA Button - CTA Button \| Horizontal` | `component-button-padding-horizontal` | Component |

---

## Property Axis Naming Rules

### State Axis
The `State` property should only contain **interaction states**:

| ✅ Valid State Values | ❌ Should Move Elsewhere |
|----------------------|--------------------------|
| Default, Hover, Focus, Active, Disabled | Desktop, Tablet, Mobile → use `Size` axis |
| Error, Loading, Success, Selected | Checkbox, Radio → use `Style` axis |
| Filled, Expanded, Collapsed | Click → remove or use `State=Active` |
| On, Off, Checked, Unchecked | Variant4, State2 → rename descriptively |

### Other Axis Standards
- **Size axis:** T-shirt sizes only: `Small`, `Medium`, `Large`, `X-Large`. Responsive breakpoints go in `Size` too: `Desktop`, `Tablet`, `Mobile`
- **Style axis:** Visual style variants: `Solid`, `Outline`, `Ghost`, `Dark`, `Light`
- **Type axis:** Semantic variants: `Primary`, `Secondary`, `Danger`, `CTA (Default)`
- **Direction axis:** Directional variants: `Left`, `Right`, `Next`, `Previous`
- **Background axis:** Surface context: `Light`, `Dark`, `Logos Blue`

---

*Generated by `build-inventory.ts`*

# 05 · Variant Analysis

## Property Axes Used Across Components

| Axis | # Components | Values | Components |
|------|-------------|--------|------------|
| **State** | 43 | Active, Checkbox, Click, Default, Desktop, Disable, Disabled, Error, Expanded, Filled, Filled—Hide, Filled—Show, First Page, Focu, Focus, Focused, Half-Filled, Hover, Last Page, Loading, Maxium, Minimum, Mobile, Radio, Selected, State2, State3, State4, State6, State8, Success, Success no Button, Tablet, Variant4 | Accordion Section, Basic Form, Breadcrumbs, Button, Button Menu, CTA Row, Category Button, Checkbox, Close Button, Dropdown, Email Capture, Expand-Collapse Button, Floating Action Button, Floating Action Button with Text, Form Dropdown, Form Dropdown Option, Increase-Decrease Buttons, Modal Button Group, Modal Dialog, Multi-Select with Text, Multi-Selector, Next-Previous Buttons, Play Button, Radio Button, Search Field, Simple Menu, Single Select Box, Slider, Slider Scroll Bar, Star, Stateful Action Button, Stepper CTA, Stepper Control, Subnav Dropdown Options, Tabbed Selector Button, Text Button—Icon Left, Text Button—Icon Right, Text Input (name, two fields), Text Input (single line), Text Input—Date, Text Input—Multiline, Text Input—Password, Toggle Switch (text) |
| **Size** | 32 | 2, 3, Condensed, Default, Desktop, Large, Medium, Mobile, Mobile-CTA, Small, Tablet, X-Large | Accordion Section, Badges and Tags, Basic Form, Button, Button Menu, Button group, Close Button, Expand-Collapse Button, Floating Action Button, Floating Action Button with Text, Increase-Decrease Buttons, Modal Dialog, Multi-CTA List, Multi-Select with Text, Next-Previous Buttons, Next-Previous Selector, Product Grid Card, Product Lineup—Single, Reviews, Sale Percentage, Search Field, Section Headline, Section Headline with CTA, Slider page selector, Star, Stepper Control, Subnav Dropdown, Tabbed Selector Button, Text Button—Icon Left, Text Button—Icon Right, Text Section with Button Group, Toggle Switch (text) |
| **Style** | 20 | 01, 02, 03, 04, Checkbox, Dark, Default, Horizontal, Icon, Large, Light, Medium, Multi-step, Numbered, Outline, Overlay, Page Number, Paged, Radio, Sale, Sale-Timer, Sale—Vertical, Small, Solid, Solid—Dark, Solid—Light, Subscription, Subscription—Vertical, Transparent, Value, Value—Vertical, Vertical | Badges and Tags, Button, Carousel Product, Close Button, Floating Action Button, Free Trial Card, List, Modal Button Group, Modal Dialog, Multi-Select with Text, Next-Previous Buttons, Next-Previous Selector, Price and Label, Product Content, Product Grid Card, Sale Percentage, Slider page selector, Text Input (name, two fields), Text Input (single line), Toast Bar |
| **Background** | 8 | Dark, Dark and Logos Blue, Light, Logos Blue | Button, Close Button, Expand-Collapse Button, Increase-Decrease Buttons, Next-Previous Buttons, Switch, Text Button—Icon Left, Text Button—Icon Right |
| **Type** | 6 | Add (Generic), Attention, CTA (Default), Default, Error, External Link, Header-Middle, Header-Top, Info, Primary-Secondary, Primary-Tertiary, Success | Button, Button group, Subnav Dropdown Options, Text Button—Icon Left, Text Button—Icon Right, Toast Bar |
| **Property 1** | 3 | Default, Disabled, Error, Focus, Hover, Selected, Variant6 | Text Toggle Selector, Toggle with Text, Upload Image Area |
| **Selection** | 2 | 1, 2, 3, 4, 5, Option 1, Option 2 | Tabbed Selector, Toggle Switch (text) |
| **Aspect Ratio** | 2 | 1.2:1, 1.33:1, 1.4:1, 1.5:1, 1.6:1, 1.8:1, 16x9, 1:1, 1x1, 2_5x1, 2x1, 3x2, 4x3, 4x5, 5x4 | Image Ratios, Product Images |
| **Direction** | 1 | Next, Previous | Next-Previous Buttons |
| **Change** | 1 | Decrease, Increase | Increase-Decrease Buttons |
| **Toggle** | 1 | Collapse, Expand | Expand-Collapse Button |
| **Stage** | 1 | Default, Quantity, Selected | Stepper CTA |
| **Rating** | 1 | .5, 0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 | Reviews |
| **Headline Size** | 1 | H1, H2, H3, H4, H5 | Text Section |
| **Background Color** | 1 | Dark, Light | Basic Form |
| **On-Off** | 1 | Off, On | Switch |

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

Detected algorithmically from shared axes, name stems, and duplicate frames.

| Component A | Component B | Reason |
|-------------|-------------|--------|
| Button | Button Menu | Common name stem "Button" — review whether these could share a single component with variant props |
| Button | Button group | Common name stem "Button" — review whether these could share a single component with variant props |
| Text Button—Icon Right | Text Button—Icon Left | Same property axes [Type, Size, Background, State] and functional category — consider merging |
| Floating Action Button | Floating Action Button with Text | Common name stem "Floating" — review whether these could share a single component with variant props |
| Button Menu | Tabbed Selector Button | Same property axes [Size, State] and functional category — consider merging |
| Button Menu | Button group | Common name stem "Button" — review whether these could share a single component with variant props |
| Tabbed Selector Button | Tabbed Selector | Common name stem "Tabbed" — review whether these could share a single component with variant props |
| Floating Action Button with Text | Stepper Control | Same property axes [Size, State] and functional category — consider merging |
| Slider Scroll Bar | Slider page selector | Common name stem "Slider" — review whether these could share a single component with variant props |
| Slider Scroll Bar | Slider | Common name stem "Slider" — review whether these could share a single component with variant props |
| Next-Previous Selector | Slider page selector | Same property axes [Style, Size] and functional category — consider merging |
| Stepper Control | Stepper CTA | Common name stem "Stepper" — review whether these could share a single component with variant props |
| Modal Button Group | Modal Dialog | Common name stem "Modal" — review whether these could share a single component with variant props |
| Subnav Dropdown Options | Subnav Dropdown | Common name stem "Subnav" — review whether these could share a single component with variant props |
| Slider page selector | Slider | Common name stem "Slider" — review whether these could share a single component with variant props |
| Multi-CTA List | Multi-Select with Text | Common name stem "Multi" — review whether these could share a single component with variant props |
| Multi-CTA List | Multi-Selector | Common name stem "Multi" — review whether these could share a single component with variant props |
| Text Input (single line) | Text Input (name, two fields) | Same property axes [Style, State] and functional category — consider merging |
| Multi-Select with Text | Multi-Selector | Common name stem "Multi" — review whether these could share a single component with variant props |
| Toggle with Text | Toggle Switch (text) | Common name stem "Toggle" — review whether these could share a single component with variant props |
| Text Toggle Selector (Figma ID: 1623:5649) | Text Toggle Selector (Figma ID: 1623:5653) | Duplicate frame name — deduplicate in Figma |
| Badges and Tags | Sale Percentage | Same property axes [Style, Size] and functional category — consider merging |

## 💥 Variant Count Overview (Top 20)

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

---
*Generated by `build-inventory.ts`*
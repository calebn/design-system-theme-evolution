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

## ⚠️ Naming Inconsistencies

The following property values are auto-generated Figma names and should be given descriptive names:

| Component | Axis | Bad Value(s) | Recommendation |
|-----------|------|-------------|----------------|
| Text Button—Icon Left | State | `State8` | Replace with descriptive state name (e.g., `Checked`, `Read-only`) |
| Play Button | State | `State2`, `State3`, `State4` | Replace with descriptive state name (e.g., `Checked`, `Read-only`) |
| Category Button | State | `Variant4` | Replace with descriptive state name (e.g., `Checked`, `Read-only`) |
| Toggle with Text | Property 1 | `Variant6` | Replace with descriptive state name (e.g., `Checked`, `Read-only`) |
| Text Input—Multiline | State | `State4`, `State6` | Replace with descriptive state name (e.g., `Checked`, `Read-only`) |

## 💡 Consolidation Opportunities

Components that could potentially be merged (same property axes, similar names):

| Component A | Component B | Opportunity |
|-------------|-------------|-------------|
| Text Button—Icon Right | Text Button—Icon Left | Merge into `TextButton` with `iconPosition: "left" | "right"` prop |
| Toggle Switch (text) | Multi-Select with Text | Consider unified `SelectionGroup` with `type: "toggle" | "checkbox" | "radio"` |
| Text Input (single line) | Text Input (name, two fields) | Consider `TextInput` with `layout: "single" | "twoColumn"` prop |
| Text Toggle Selector | Text Toggle Selector | Two separate frames with same name — deduplicate in Figma |
| Tabbed Selector | Tabbed Selector Button | These may be the container vs. item — clarify relationship |
| Form Dropdown | Dropdown | Consider unified `Dropdown` with `variant: "form" | "inline"` prop |
| Next-Previous Selector | Slider page selector | Both are pagination-style controls — consider unifying |

## 💥 Variant Count Overview

Components ordered by variant count (highest = most complex to implement):

| Component | Section | Variant Count | Property Axes |
|-----------|---------|---------------|---------------|
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
# Design System Theme Evolution

Two diagrams showing how a design system's theme elements can evolve across versions. Both use three version columns (V1 → V2 → V3) with the same starting elements, but the set of permitted operations differs between them.

**Reading the diagrams:**

- Rectangular nodes `[ ]` — a carried-forward element
- Pill nodes `([ ])` — a newly introduced element
- Hexagon nodes `{{ }}` — a removed element *(Diagram 2 only)*
- Arrow labels — the operation applied between versions

---

## Diagram 1: A Persistent Design System

*Permitted operations: restyle, combine, create new. Splitting and deletion are not allowed.*

```mermaid
flowchart LR
    subgraph v1 ["Version 1"]
        direction TB
        a1["Primary Color<br/>#0055FF"]
        a2["Secondary Color<br/>#FF6B00"]
        a3["Body Font<br/>16px · Inter"]
        a4["Spacing Unit<br/>8px"]
        a5["Button Radius<br/>4px"]
        a6["Button Radius<br/>6px"]
    end

    subgraph v2 ["Version 2"]
        direction TB
        b1["Primary Color<br/>#1A73E8"]
        b2["Secondary Color<br/>#E8710A"]
        b3["Body Font<br/>18px · Inter"]
        b4["Spacing Unit<br/>8px"]
        b5["Button Radius<br/>5px"]
        b6(["Accent Color<br/>#34A853"])
    end

    subgraph v3 ["Version 3"]
        direction TB
        c1["Primary Color<br/>#0F5FCC"]
        c2["Secondary Color<br/>#CC5A00"]
        c3["Body Font<br/>18px · Neue Haas"]
        c4["Spacing Unit<br/>10px"]
        c5["Button Radius<br/>6px"]
        c6["Accent Color<br/>#2D9142"]
        c7(["Motion Easing<br/>ease-out"])
    end

    a1 -->|restyle| b1
    a2 -->|restyle| b2
    a3 -->|restyle| b3
    a4 -->|restyle| b4
    a5 -->|combine| b5
    a6 -->|combine| b5

    b1 -->|restyle| c1
    b2 -->|restyle| c2
    b3 -->|restyle| c3
    b4 -->|restyle| c4
    b5 -->|restyle| c5
    b6 -->|restyle| c6
```

### What this shows

**Restyle** keeps the token name constant while its value changes. When `Primary Color` updates from `#0055FF` to `#1A73E8`, every component referencing that token picks up the new value automatically. The reference never breaks; the token's identity is preserved.

**Combine** reconciles two inconsistent values for the same concept into one. `Button Radius` existed as both `4px` and `6px` in different parts of the system — a common result of independent design decisions over time. Combining them into a single `5px` token means every component now references one source of truth, and future updates only need to happen in one place.

**New elements** are purely additive. `Accent Color` and `Motion Easing` each begin in the version they're introduced, with no effect on anything that came before.

**Effects across versions:**

- Consumer code (component libraries, stylesheets, application logic) requires no changes between versions — all references remain valid.
- Version-to-version diffs are small and predictable: updated values, a reduced set of tokens after combines, or new additions.
- Every element can be traced back to its origin. The history is linear and unambiguous.
- The total token count tends to hold steady or decrease as combines take effect.
- The constraint: once two tokens are combined they cannot be separated without restructuring; elements that no longer serve a purpose cannot be removed.

---

## Diagram 2: An Open Design System

*All operations from Diagram 1, plus: split and delete.*

```mermaid
flowchart LR
    subgraph v1 ["Version 1"]
        direction TB
        a1["Primary Color<br/>#0055FF"]
        a2["Secondary Color<br/>#FF6B00"]
        a3["Body Font<br/>16px · Inter"]
        a4["Spacing Unit<br/>8px"]
        a5["Button Radius<br/>4px"]
        a6["Button Radius<br/>6px"]
    end

    subgraph v2 ["Version 2"]
        direction TB
        b1["Primary Color<br/>#1A73E8"]
        b2["Secondary Color<br/>#E8710A"]
        b3["Body Font<br/>18px · Inter"]
        b4["Spacing Unit<br/>8px"]
        b5["Button Radius<br/>5px"]
        b6(["Accent Color<br/>#34A853"])
    end

    subgraph v3 ["Version 3"]
        direction TB
        c1["Primary Light<br/>#1A73E8"]
        c2["Primary Dark<br/>#4D9FFF"]
        c3["Secondary Light<br/>#E8710A"]
        c4["Secondary Dark<br/>#FFB347"]
        c5["Body Font<br/>18px · Neue Haas"]
        c6["Spacing Unit<br/>10px"]
        c7["Button Radius<br/>6px"]
        c8(["Motion Easing<br/>ease-out"])
    end

    del1{{"Accent Color<br/>removed"}}

    a1 -->|restyle| b1
    a2 -->|restyle| b2
    a3 -->|restyle| b3
    a4 -->|restyle| b4
    a5 -->|combine| b5
    a6 -->|combine| b5

    b1 -->|split| c1
    b1 -->|split| c2
    b2 -->|split| c3
    b2 -->|split| c4
    b3 -->|restyle| c5
    b4 -->|restyle| c6
    b5 -->|restyle| c7
    b6 -. deleted .-> del1
```

### What this shows

The V1 → V2 step is identical to Diagram 1: restyles, a combine, and one new element, with no breaking changes. The V2 → V3 step introduces two additional operations.

**Split** forks a single token into multiple variants. `Primary Color` becomes `Primary Light` and `Primary Dark` — a natural outcome when adding dark mode support to the product. Each fork is now an independent element with its own future maintenance path: its own restyles, combines, or further splits.

**Delete** removes a token from the system entirely. `Accent Color`, introduced in V2, is removed in V3. Any consumer that referenced it must be located and updated; the reference no longer resolves.

**Effects across versions:**

- V1 → V2 behaves identically to Diagram 1: no breaking changes, all references held intact.
- V2 → V3 introduces breaking changes. Consumers using `Primary Color` or `Secondary Color` by their original names must migrate to a Light or Dark variant. Consumers using `Accent Color` must remove or replace the reference.
- Splits increase the total number of tokens, growing the surface area that every future version must account for.
- Deletions require active coordination: deprecation notices, a versioned changelog, and migration documentation help prevent silent failures in downstream consumers.
- The system can stay more precisely aligned with evolving product needs. The overhead of tracking and communicating changes grows in proportion to the number of splits and deletions introduced over time.

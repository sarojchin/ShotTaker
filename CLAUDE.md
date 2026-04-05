# CLAUDE.md

## Purpose
This repo contains the iOS app for **ShotTaker**.

Build and modify features with:
- exact design fidelity
- compile/build stability
- minimal, local code changes
- token-efficient context usage

Treat this as a **production app**.

The app helps users build a daily photography habit through: - daily photo capture/upload - challenges - streaks - progress tracking - leaderboards - habit reinforcement loops 
This file is the **primary operating guide** for all code changes.
---

## Priorities
Optimize in this order:

1. Correctness
2. Compile/build stability
3. Exact design implementation
4. Minimal, local changes
5. Token efficiency
6. Consistency with existing architecture

Do not optimize for cleverness, abstraction, or unnecessary refactors.

---

## Read Order
Before coding, read in this order:

1. `/CLAUDE.md`
2. `/design_references/DESIGN.md`
3. The png files in `/design_references/`
4. Only then inspect the minimum necessary implementation files

Do **not** scan the whole repo unless required for:
- the task
- a dependency relevant to the task
- a compile/build fix

---

## Source of Truth
When sources conflict, use this order:

1. direct user instruction
2. `/design/`
3. `CLAUDE.md`
4. `/docs/`
5. existing code
6. assumptions

If existing UI conflicts with the design folder, **design wins** unless explicitly told otherwise.

---

## Design Rules
The `/design/` folder is the source of truth for UI/UX.

Before editing UI, inspect:
- `/design/design.md`
- relevant PNG/mockup assets

### Required
- match layout, hierarchy, spacing, typography, sizing, alignment, colors, and CTA emphasis exactly where design exists
- preserve touch target usability
- preserve screen structure and interaction flow from design

### Do Not
- invent alternate layouts
- “clean up” or reinterpret the design
- add decorative UI not shown
- add placeholder copy unless requested
- preserve incorrect existing UI just because it already exists

If design is ambiguous, make the smallest assumption and call it out.

---

## Workflow
For every task:

### 1) Understand
Determine:
- what is being built/fixed
- what exact UI/behavior is required
- what files should change
- what should not change

### 2) Plan
Identify the smallest viable file set.
Reuse existing patterns/components where possible.
Prefer the smallest valid solution.

### 3) Implement
Keep edits:
- narrow
- local
- architecture-consistent
- compile-safe
- design-faithful

Avoid touching unrelated files.

### 4) Verify
Before done, verify:
- requested behavior is implemented
- UI matches design
- no obvious compile errors were introduced
- unrelated files were not changed unnecessarily

Never present work as complete if build integrity is uncertain.

---

## Development Rules

### Always
- prefer existing components over duplicates
- prefer simple solutions over generalized frameworks
- preserve naming conventions
- preserve existing architecture unless explicitly changing it
- keep changes reversible and easy to review

### Never
- refactor unrelated code
- rename files/types/functions without necessity
- invent API contracts or backend fields
- introduce placeholder data unless requested
- add TODOs unless requested
- silently alter app flow or navigation
- make cosmetic cleanup changes unrelated to the task

---

## Architecture Guardrails
Unless explicitly instructed otherwise:

- keep feature logic inside its feature module
- keep shared logic only where genuinely shared
- avoid adding managers/services/helpers without clear repeated need
- keep ownership and data flow easy to follow

Avoid:
- duplicate view components
- speculative service layers
- scattered state
- overuse of protocols
- deep refactors for small feature requests

Prefer a clean local change over architectural expansion.

---

## UI Implementation Rules
When editing SwiftUI or visual UI code, **defer to `/design_references/design.md` and relevant assets in `/design_references/`**.

---

## State / Logic Rules
When editing app logic:

- preserve existing state ownership patterns
- keep async logic consistent with current project patterns
- avoid moving logic across layers unless necessary
- avoid hidden side effects
- prefer explicit, readable flows

If a screen already has an established ViewModel/controller pattern, follow it.

Do not invent a new state management style for one feature.

---

## Data / Backend Rules
If a task touches backend or data flow:

- use only fields/contracts already defined unless explicitly extending them
- do not invent schema or API responses
- do not assume backend behavior without evidence in code/docs
- preserve error handling and auth/session assumptions
- avoid breaking serialization/decoding structures

Inspect only the relevant service/model files.

---

## File Creation Rules
Create a new file only if clearly justified.

### Valid reasons
- new screen
- actually reusable component
- required model/viewmodel/service
- splitting an oversized file for readability

### Invalid reasons
- “felt cleaner”
- “future reuse”
- “better architecture” without need
- splitting files just to appear organized

Prefer smaller diffs over artificial structure.

---

## Build / Compile Safety
Compile safety is mandatory.

When changing code:

- avoid changing public interfaces unnecessarily
- avoid casual renames of referenced properties/functions
- preserve initializer compatibility unless intentionally updating all call sites
- check dependent files if a signature changes
- be conservative around shared models/components

If a change has ripple effects, verify them before calling it done.

---

## Task Scope
Stay inside the requested scope.

If asked to:
- fix a screen → fix that screen
- add a feature → add that feature
- resolve a bug → resolve that bug
- match design → match design

Do **not** silently expand into:
- architecture redesign
- style cleanup
- naming cleanup
- unrelated performance optimization
- unrelated UI polish
- “while I’m here” changes

Stay scoped.

---

## When to Ask Questions
Ask only if the task cannot be completed responsibly without clarification.

### Good reasons
- conflicting design references
- required behavior is genuinely missing
- implementation requires a product decision
- multiple valid interpretations materially change the result

### Bad reasons
- not wanting to inspect relevant files
- asking about something already documented
- broad product questions not needed for execution
- asking permission for obvious implementation details

Default to informed execution.

---

## Response After Implementation
After completing a task, always include:

1. **What changed**
2. **Files changed**
3. **Design fidelity** (exact or assumptions made)
4. **Build/compile status** (confirmed, likely, or blocked)
5. **Remaining blockers** (if any)

Be concise. Do not exaggerate confidence.
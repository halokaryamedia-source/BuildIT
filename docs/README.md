# LazyDesigner Documentation

This is the single entry point for AI and human documentation discovery.

## Load Rule

Do not read all documentation by default. Resolve the task domain first, then load the smallest canonical set.

```text
PRODUCT / FLOW      → 01-product/
REFERENCE PREP      → 02-reference/
ASSET AUTHORING     → 03-authoring/
SYSTEM / CONTROL    → 04-system/
CURRENT OPERATIONS  → 05-operations/
```

## Canonical Hierarchy

```text
docs/
├── 01-product/      product identity, requirements, end-to-end flow
├── 02-reference/    ChatGPT reference preparation, image rules, handoff package
├── 03-authoring/    modelling, texture, animation, validation, finalization
├── 04-system/       Control, source ownership, Skill taxonomy
└── 05-operations/   current status, next action, local acceptance
```

## AI Context Policy

1. Start here only when the task domain is not already known.
2. Read the README of the selected domain.
3. Load only the canonical owner needed for the current decision.
4. Do not load sibling domains unless the task crosses that boundary.
5. `05-operations/` is current-state context, not durable design authority.
6. Git history owns retired architecture and rationale; do not keep duplicate active docs for history.

## Authority Order

```text
explicit current user requirement
→ repository execution rules (AGENTS.md / GITHUB_RULES.md)
→ domain canonical documentation under docs/
→ active operation state under 05-operations/
→ implementation/source evidence
```

One concern must have one canonical owner. Link to an owner instead of copying its rules into another document.

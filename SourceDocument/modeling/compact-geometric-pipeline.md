# Compact Codex + Blockbench Pipeline

Goal: reach the approved model with the least safe amount of reading, MCP calls, screenshots, and approval interruptions.

## Four Rules

1. **One active user-visible stage**
   - Geometry, Texture, optional Animation, or Final Validation.

2. **Bounded batches for initial work**
   - Build a complete logical unit, then verify.
   - One-issue-per-cycle applies only to revisions.

3. **One review at the end of each stage**
   - Internal passes do not require separate approval.

4. **Reference-driven validation**
   - Production Context controls intent.
   - Reference Visual controls visible form.
   - Category documents control implementation details.

## Fast Flow

```text
Reference package intake
→ one-time preflight
→ Geometry internal passes
→ Geometry preview + review
→ Texture internal passes
→ Texture preview + review
→ optional Animation + review
→ Final Validation + final review
```

## Geometry Cycle

```text
Primary Form batch
→ Structural Detail batch
→ standard five-view capture
→ geometry result
→ user review
```

Do not use texture or UV to hide geometry failure.

## Texture Cycle

```text
UV
→ Base Texture
→ Detail Texture
→ atlas + model capture
→ texture result
→ user review
```

Do not rebuild accepted geometry unless Geometry is explicitly reopened.

## Animation Cycle — Optional

```text
hierarchy/pivots
→ required clips or sampled poses
→ neutral-pose and clipping check
→ user review
```

Skip automatically when the approved package does not require animation.

## Final Validation Cycle

```text
run VALIDATION.md
→ run Blockbench validator
→ capture final evidence
→ repair max 2 local failures
→ PASS / REVISION_REQUIRED / BLOCKER
→ final user review
```

## Revision Cycle

```text
one named issue
→ one local edit batch
→ one focused verification set
→ return to same stage review
```

Revision input:

```text
Stage:
Part:
Issue:
Expected:
Do not change:
```

## Stop Conditions

- major reference conflict;
- endpoint/tool unavailable;
- session/project ownership ambiguous;
- same blocker repeated twice;
- fix requires reopening an approved earlier stage.

## Minimum Report

```text
Stage:
Status:
Completed:
Evidence:
Issues:
Next user action:
```

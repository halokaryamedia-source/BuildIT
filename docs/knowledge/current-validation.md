# Current Validation

Updated: 2026-09-03

This file owns **current proof interpretation**. Active continuation belongs in `docs/knowledge/next-action.md`; stable product facts belong in `CONTEXT.md`; exact source/test ownership belongs in `docs/knowledge/implementation-map.md`.

Do not copy every passing workflow run, test count, or historical proof snapshot here. GitHub Actions and Git history own exact run/commit archaeology. Update this file only when the meaningful proof boundary changes.

## Current Proof Boundary

```text
BEDROCK CALLABLE CATALOG:        65 tools across phases
DEFAULT CLIENT EXPOSURE:         MCP Core + Geometry (25 tools)
KNOWN FULL MCP BASELINE:         PASS @ 5ecbf25608f8da879497e2f687854cb68781f3cd
ACCEPTED LIVE BASELINE:          2026-08-12 Blockbench 5.1.6
IMAGE REFERENCE ACTIVE ROUTE:    APPROVED IMAGE ONLY BY DEFAULT
3D-ASSISTED ROUTE STATUS:         OPTIONAL / PARKED
3D-ASSISTED ALIGNMENT FOUNDATION: SOURCE PREPARED — REFERENCE LOAD VERIFIED
CURRENT 3D-ASSISTED LIVE RETEST: STOPPED AFTER EVIDENCE REFERENCE LOAD
CURRENT MODEL-QUALITY CLAIM:     NONE — CUBE AUTHORING DEFERRED
```

`KNOWN FULL MCP BASELINE` is the last deliberately retained full canonical executable/source baseline, not a claim that this file tracks the newest CI run. Current workflow status must be read from the exact current commit/run when it matters.

The Image Reference Route is the default object-agnostic workflow. 3D-Assisted Evidence is optional and must never block it. Image-only versus image+evidence is not an A/B gate; the optional evidence path is activated only when the user explicitly supplies clean supporting evidence and requests it.

## Current Agent-Contract Proof

Current source defines:

```text
MCP CORE + exactly one ACTIVE PHASE
GEOMETRY | TEXTURING | ANIMATION
```

Static/current source contracts retain:

- 51 callable Bedrock tools across phases;
- default Core + Geometry exposure of 25 tools;
- strict foreign-phase `HANDOFF_REQUIRED` behavior;
- 3D-Assisted Evidence as transient Geometry-owned reference evidence rather than production geometry;
- fail-closed targeting, mutation, export, and phase boundaries;
- generated API/prompt ownership through canonical source + generator;
- repository, authoring-policy, executable MCP, experimental runtime, and release verification as separate proof surfaces.

3D-Assisted Evidence alignment planning has a pure source foundation for two deliberately separate operations:

```text
observed GLB bounds + requested Minecraft dimensions
→ uniform fit-envelope scale plan
→ measure fresh scaled bounds
→ center X/Z + ground Y translation plan
```

The pure planner does **not** prove Blockbench Reference Model transform semantics. It does not change `manage_geometry_reference`, does not pre-scale the GLB artifact, does not add non-uniform scaling, and does not convert mesh triangles to Bedrock Cubes. The user has explicitly stopped the 3D-Assisted workflow after the sample GLB enters Blockbench; no Cube reconstruction claim is active.

Exact regression ownership and protected capability gaps live in `docs/knowledge/implementation-map.md`; this file does not duplicate them.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the **actual approved reference image** plus fresh evidence from the current model/revision for the material views being judged.

The following cannot create visual `PASS` by themselves:

- successful MCP/tool execution;
- static source or CI success;
- valid coordinates/hierarchy/export;
- 3D-Assisted Evidence or raw GLB bounds;
- a scalar similarity score;
- a saved artifact whose visual result was not inspected.

Front-view agreement does not prove hidden depth or full 3D fidelity. If required evidence is unavailable, the correct state is `UNVERIFIED` or `LOCAL PROOF REQUIRED`, not inferred success.

For 3D-Assisted Evidence specifically:

```text
requested dimensions = numeric authority
approved image        = visual authority
3D-Assisted Evidence  = 3D depth/volume/attachment evidence
raw GLB bounds        = observation only
```

Fit-envelope alignment may scale the reference **uniformly** to fit the requested envelope, but it must never redefine target dimensions or justify non-uniform deformation.

## Authoring Efficiency

**Static Footprint** and raw call count are guardrails, not Authoring Efficiency proof.

Authoring Efficiency means **Cost to Accepted Result**: the justified work needed to reach an accepted-quality result, including avoidable discovery, readback, retries, recovery, and correction. A smaller prompt/Skill/tool surface is not an improvement if quality regresses or work merely moves elsewhere.

Runtime Authoring Efficiency or model-quality claims require the matching local acceptance procedure and accepted artifact evidence.

For the selected 3D-Assisted workflow, local acceptance measures only whether the image + evidence path reaches an accepted result efficiently and correctly. It does **not** require an image-only comparison run.

## Evidence Limits

Static source/CI evidence can prove the contracts it actually executes, such as schemas, routing, deterministic generated output, buildability, phase ownership, pinned reproducibility inputs, pure alignment math, and fail-closed source invariants.

It **cannot prove visual fidelity**, installed-plugin freshness, fresh client registry state, desktop GLB rendering, live Reference Model scale/origin behavior, live Blockbench Undo/playback/persistence, or model-quality improvement unless those surfaces actually ran.

The completed live boundary for 3D-Assisted Evidence is only:

```text
canonical GLB load into Blockbench as transient Reference Model
→ normal preview restored
```

Everything after that boundary is intentionally deferred:

```text
Cube authoring, fitting, correction, reference cleanup, and .bbmodel export
```

If that selected path passes, 3D-Assisted acceptance is complete for the tested claim. Do not add an image-only A/B gate afterward.

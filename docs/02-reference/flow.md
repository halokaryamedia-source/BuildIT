# LazyDesigner ChatGPT Reference Flow

Updated: 2026-09-11

This document owns the ChatGPT-side operational sequence before an asset reference is handed downstream. Durable policy lives in `policy.md`; image construction lives under `image/`; particle/VFX reference authoring lives under `particle/`; compact Codex package structure and consumption live under `package/`.

## Objective

Convert incomplete or casual user intent into a confirmed, internally clean reference target without requiring the user to understand prompting, topology, UV, rigging, particle JSON, or package terminology.

## Canonical User Flow

```text
USER REQUEST
→ UNDERSTAND
→ REQUIREMENT GATE
→ missing blocking information?
   ├─ YES → ASK SIMPLE QUESTIONS → USER ANSWERS → GATE AGAIN
   └─ NO
→ PROMPT COMPILER
→ CLEAN PRODUCTION BRIEF
→ FINAL CONFIRMATION
→ user approves?
   ├─ NO → revise brief → FINAL CONFIRMATION
   └─ YES
→ CLASSIFY REQUIRED REFERENCE CAPABILITY
   ├─ visual/model only → image/
   ├─ particle/VFX only → particle/
   └─ both only when explicitly/materially required
→ GENERATE ONLY REQUIRED ARTIFACTS
→ BRANCH-SPECIFIC INTERNAL QA
→ USER REVIEW / CORRECTION when material
→ BUILD CLEAN HANDOFF/PACKAGE when required
→ CONSISTENCY GATE
→ DOWNSTREAM USE / CODEX / MCP
```

## 1. Understand

Resolve only what is supported by current intent/evidence:

```text
asset/effect identity
required capability: visual/model, particle/VFX, or both
task: new / continuation / correction
source/reference authority
scale or viewing distance when known
animation or motion requirement
critical parts/actions/materials/style
still-valid approved prior decisions
```

Do not generate yet and do not invent missing facts.

## 2. Requirement Gate

Classify missing information:

```text
BLOCKING
USEFUL
OPTIONAL
```

`BLOCKING` must be resolved when the answer can materially change identity, primary structure, scale/viewing distance, required articulation/motion, or another major output decision.

`USEFUL` is asked only when it is likely to materially improve correctness.

`OPTIONAL` does not block generation and remains unspecified unless evidence resolves it.

For visual/model references, scale follows `image/scale-and-escalation.md`. For particle/VFX tasks, intent normalization follows `particle/authoring-spec.md`.

## 3. Independent Capability Rule

Reference branches are optional and independent.

```text
particle request only
→ particle/
→ do not generate image/model references unless explicitly requested or materially required

visual/model request only
→ image/
→ do not author particle assets unless explicitly requested

combined request
→ use both branches only for the requested dependencies
```

Do not force a visual reference step before particle authoring. A particle can be authored directly from text, an existing visual/reference source, or a confirmed effect brief.

Do not force particle output into visual/model reference tasks.

## 4. Simple Question Rule

Ask the fewest basic, immediately answerable questions.

Good:
- "Ukurannya sekitar setinggi pinggang player, setinggi player, atau lebih tinggi?"
- "Kendaraannya cukup untuk 1 player atau 2 player?"
- "Bagian mana yang perlu bergerak?"
- "Particle ini terutama dilihat dari dekat atau sekitar puluhan blok?"
- "Efeknya sekali meledak atau terus looping?"

Do not ask the user for topology, pivot ownership, UV strategy, Molang implementation, deformation terminology, or a better prompt.

## 5. Prompt Compiler

After blocking information is resolved, run `.agents/skills/lazydesigner-prompt-compiler/SKILL.md`.

```text
raw user intent
+ confirmed answers
+ approved prior decisions
+ source/reference facts
→ CLEAN PRODUCTION BRIEF
```

Rejected or superseded directions are removed. The compiler may normalize wording but may not invent design, scale, materials, topology, motion, duration, or hidden structure.

The compiled brief is internal working state and is not a default handoff file.

## 6. Final Confirmation — Hard Gate

Before generating a new user-facing artifact, show a concise summary and obtain explicit approval when the target materially depends on user decisions.

Recommended shape:

```text
Konfirmasi sebelum dibuat:
- Objek/Efek: <target>
- Skala/Jarak: <only when material>
- Arah: <main visual/structural/motion direction>
- Tambahan: <only material extras>

Sudah sesuai?
```

Silence is not approval. A material revision requires a new bounded confirmation before generating the revised artifact.

## 7. Reference Capability Branches

### Visual / model reference

Use `image/README.md` and choose only modules that materially reduce downstream uncertainty:

```text
CONCEPT
TURNAROUND
STRUCTURAL_DETAIL
MATERIAL_TEXTURE
RIG_DEFORMATION
POSE_ACTION
EXPRESSION_FACE
ANIMATION_KEYFRAME
```

Do not generate every module by default.

### Particle / VFX reference

Use `.agents/skills/lazydesigner-particle-reference-authoring/SKILL.md` and `particle/README.md`.

Typical output may include:

```text
Bedrock .particle.json
particle textures / atlases
manifest + resource-pack structure
static/preflight QA
README usage notes
```

Image reference output is not a prerequisite for this branch.

This branch is ChatGPT-side reference authoring. It does not require MCP or local repository execution.

## 8. Generate + Internal QA

Every generation uses:

```text
confirmed compiled brief
+ approved source/reference authority when available
+ resolved scale/view-distance anchor when material
+ current capability purpose
```

not the uncontrolled full conversation.

Visual/model references use image QA. Particle/VFX references use `particle/qa.md`, including Bedrock structure, Snowstorm compatibility, motion/bundle/atlas/spatial/readability/budget checks when applicable.

Do not run irrelevant QA from another reference branch.

## 9. User Review / Correction

A generated image or particle becomes approved reference authority only after explicit user acceptance when visual/runtime review is material.

For correction:

```text
USER DELTA
→ compile CHANGE + PRESERVE
→ resolve only new blockers
→ concise confirmation when needed
→ bounded correction
→ causal QA
→ user review
```

Preserve unaffected approved authority.

## 10. Package Generation Gate

Create package files only when package generation is explicitly authorized or already unambiguously requested in the current instruction.

Do not create optional files or another reference branch merely to complete a template.

## 11. Package Build

### Visual/model package

Canonical package:

```text
asset_reference/
├── REFERENCE.json
├── GEOMETRY.md
├── TEXTURE.md      ← only when useful
├── ANIMATION.md    ← only when useful / required
└── images/
    └── approved/supporting reference images
```

Canonical owners remain under `package/`.

### Particle/VFX package

Follow `particle/delivery.md`. The particle package itself is the handoff artifact and may be consumed directly in Snowstorm/Minecraft or passed to Codex/MCP.

Do not add image-reference files unless they are actually part of the particle request.

Do not export the compiled production prompt, conversation transcript, duplicate bootstrap files, or internal scratch QA.

## 12. Package Consistency Gate

Before handoff verify the package-specific contract.

For all branches:

```text
all listed/referenced files exist
identifiers/paths agree
no unsupported facts were introduced
omitted optional files are not referenced
blocking unknowns are resolved or explicitly preserved
```

Fix package plumbing internally. Ask the user only when a real requirement conflict needs their decision.

## 13. Downstream Handoff

For visual/model references, consumption is defined by `package/load-contract.md`.

For particle/VFX references, the clean Resource Pack folder/ZIP is the handoff boundary. Codex/MCP may inspect, copy, patch, bind, or preview it according to downstream authority; they should not need the original ChatGPT transcript or a separate image-reference package.

## 14. Authority Order

```text
explicit current user requirement
→ approved branch-specific reference
→ confirmed scale/view-distance requirement
→ canonical branch rules
→ downstream interpretation
```

The compiled brief organizes generation but never outranks approved user/reference facts.

## 15. Stop Conditions

Do not generate when:
- a blocking requirement is unresolved;
- materially conflicting evidence remains unresolved;
- required confirmation is pending;
- a correction would require guessing what must be preserved;
- the proposed artifact does not materially help the downstream decision.

Do not hand off when:
- package consistency fails;
- listed/referenced files are missing;
- readiness contradicts blocking unknowns;
- scale/view-distance authority conflicts internally.

## User Experience Goal

The user should normally only need to:

```text
1. describe what they want
2. answer a few simple questions when vital information is missing
3. approve a concise target summary when material
4. review only the reference artifacts they requested
5. authorize package creation when needed
6. receive the completed handoff
```

Prompt quality, branch selection, particle preflight, package consistency, and technical terminology remain responsibilities of the ChatGPT-side system.

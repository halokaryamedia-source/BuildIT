# LazyDesigner ChatGPT Reference Flow

Updated: 2026-09-11

This document owns the ChatGPT-side operational sequence before an asset reference is handed to Codex. Durable policy lives in `policy.md`; image construction lives under `image/`; package structure and consumption live under `package/`.

## Objective

Convert incomplete or casual user intent into a confirmed, internally clean reference target without requiring the user to understand prompting, topology, UV, rigging, or package terminology.

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
→ REFERENCE PLAN
→ GENERATE REQUIRED IMAGE(S) when useful
→ INTERNAL QA
→ USER VISUAL REVIEW / CORRECTION when material
→ PACKAGE GENERATION CONFIRMATION when required
→ PACKAGE BUILD
→ PACKAGE CONSISTENCY GATE
→ HANDOFF TO CODEX
```

## 1. Understand

Resolve only what is supported by current intent/evidence:

```text
asset identity
primary profile
task: new / continuation / correction
source/reference authority
scale or explicit dimensions when known
animation requirement
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

`BLOCKING` must be resolved when the answer can materially change identity, primary structure, scale, required articulation/action, or another major output decision.

`USEFUL` is asked only when it is likely to materially improve correctness.

`OPTIONAL` does not block generation and remains unspecified unless evidence resolves it.

Scale follows `image/scale-and-escalation.md`: use an explicit numeric requirement when provided; otherwise use a player-relative anchor when safely resolvable; ask only when materially different scale would change the result.

## 3. Simple Question Rule

Ask the fewest basic, immediately answerable questions.

Good:
- "Ukurannya sekitar setinggi pinggang player, setinggi player, atau lebih tinggi?"
- "Kendaraannya cukup untuk 1 player atau 2 player?"
- "Bagian mana yang perlu bergerak?"
- "Gayanya mengikuti gambar yang Anda kirim atau ada arah lain?"

Do not ask the user for topology, pivot ownership, UV strategy, deformation terminology, or a better prompt.

## 4. Prompt Compiler

After blocking information is resolved, run `.agents/skills/lazydesigner-prompt-compiler/SKILL.md`.

```text
raw user intent
+ confirmed answers
+ approved prior decisions
+ source/reference facts
→ CLEAN PRODUCTION BRIEF
```

Rejected or superseded directions are removed. The compiler may normalize wording but may not invent design, scale, materials, topology, motion, or hidden structure.

The compiled brief is internal working state and is not a default Codex handoff file.

## 5. Final Confirmation — Hard Gate

Before generating any new user-facing image or handoff file, show a concise summary and obtain explicit approval.

Recommended shape:

```text
Konfirmasi sebelum dibuat:
- Objek: <asset>
- Skala: <only when material>
- Arah: <main visual/structural direction>
- Tambahan: <only material extras>

Sudah sesuai?
```

Silence is not approval. A material revision requires a new bounded confirmation before generating the revised artifact.

## 6. Reference Plan

Choose only outputs that materially reduce downstream uncertainty.

Possible modules:

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

Do not generate every module by default. Generated images follow `image/README.md` and the Unified Image Reference Standard.

## 7. Generate + Internal QA

Every generation uses:

```text
confirmed compiled brief
+ approved source/reference authority
+ resolved scale anchor
+ current sheet/module purpose
```

not the uncontrolled full conversation.

Before user review, check identity, required parts, cross-view consistency, scale lock, attachment/topology, and any material articulation or material requirements.

## 8. User Visual Review / Correction

A generated image becomes visual authority only after explicit user acceptance when visual approval is material.

For correction:

```text
USER DELTA
→ compile CHANGE + PRESERVE
→ resolve only new blockers
→ concise confirmation
→ bounded correction
→ identity + scale QA
→ user review
```

Preserve unaffected approved authority.

## 9. Package Generation Gate

After required visual authority is accepted, create package files only when package generation is explicitly authorized or already unambiguously requested in the current instruction.

Do not create optional files merely to complete a template.

## 10. Package Build

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

Canonical owners:

```text
REFERENCE.json → package/schema.md
GEOMETRY.md    → package/geometry.md
TEXTURE.md     → package/texture.md
ANIMATION.md   → package/animation.md
handoff        → package/handoff.md
load order     → package/load-contract.md
```

Do not export the compiled production prompt, conversation transcript, duplicate README/bootstrap file, Cube-by-Cube plan, or Tool schema.

## 11. Package Consistency Gate

Before handoff verify:

```text
all listed documents exist
all image IDs and paths resolve
stage documents agree with REFERENCE.json
stage documents introduce no unsupported facts
Texture does not compensate for missing Geometry
Animation does not compensate for a rig defect
readiness agrees with blocking unknowns
omitted optional files are not referenced
scale facts are internally consistent
```

Fix package plumbing internally. Ask the user only when a real requirement conflict needs their decision.

## 12. Codex Handoff

Consumption is defined by `package/load-contract.md`.

Default downstream behavior:

```text
REFERENCE.json
→ determine active stage/readiness
→ load only active stage document when present
→ inspect only image IDs relevant to that stage
→ work
```

The package must be self-contained; Codex should not need the original ChatGPT transcript or compiled prompt.

## 13. Authority Order

```text
explicit current user requirement
→ approved visual reference
→ confirmed scale requirement
→ REFERENCE.json structured facts
→ active stage Markdown projection
→ downstream Codex interpretation
```

The compiled brief organizes generation but never outranks approved user/reference facts.

## 14. Stop Conditions

Do not generate when:
- a blocking requirement is unresolved;
- materially conflicting evidence remains unresolved;
- required confirmation is pending;
- a correction would require guessing what must be preserved;
- the proposed artifact does not materially help the downstream decision.

Do not hand off when:
- package consistency fails;
- listed files/images are missing;
- stage readiness contradicts relevant blocking unknowns;
- scale authority conflicts internally.

## User Experience Goal

The user should normally only need to:

```text
1. describe what they want
2. answer a few simple questions when vital information is missing
3. approve a concise target summary
4. review generated reference when needed
5. authorize package creation
6. receive the completed Codex handoff
```

Prompt quality, reference planning, package consistency, and technical terminology remain responsibilities of the ChatGPT-side system.
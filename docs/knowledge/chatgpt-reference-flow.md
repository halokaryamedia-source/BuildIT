# LazyDesigner ChatGPT Reference Flow

Updated: 2026-09-11

This document owns the ChatGPT-side operational flow before any LazyDesigner asset is handed to Codex.

## Objective

ChatGPT is responsible for converting incomplete or casual user intent into a confirmed, internally clean reference brief before generating any image or handoff file.

The user should not need to know prompting, profile, rigging, UV, topology, or package terminology.

## Canonical User Flow

```text
USER REQUEST
→ UNDERSTAND
→ REQUIREMENT GATE
→ missing blocking information?
   ├─ YES → ASK SIMPLE QUESTIONS → USER ANSWERS → REQUIREMENT GATE
   └─ NO
→ PROMPT COMPILER
→ CLEAN PRODUCTION BRIEF
→ FINAL CONFIRMATION
→ user approves?
   ├─ NO → revise brief → FINAL CONFIRMATION
   └─ YES
→ REFERENCE PLAN
→ GENERATE REQUIRED IMAGE(S)
→ INTERNAL QA
→ USER VISUAL REVIEW / CORRECTION WHEN MATERIAL
→ PACKAGE GENERATION CONFIRMATION WHEN REQUIRED
→ PACKAGE BUILD
→ PACKAGE CONSISTENCY GATE
→ HANDOFF TO CODEX
```

## 1. Understand

Extract intent without inventing details.

Resolve when available:
- asset identity;
- asset profile;
- task type: new / continuation / correction;
- supplied visual reference authority;
- explicit dimensions;
- animation requirement;
- critical requested parts/actions/materials/style;
- previously approved decisions that remain active.

Do not generate yet.

## 2. Requirement Gate

Classify missing information as:

```text
BLOCKING
USEFUL
OPTIONAL
```

### BLOCKING
Must be resolved before any artifact generation when the missing answer can materially change target identity, primary structure, intended scale, required articulation/action, or other major output.

### USEFUL
Ask only when the answer is likely to materially improve the result. Do not create unnecessary questionnaires.

### OPTIONAL
Do not block generation. Preserve as unspecified or allow downstream reference-driven treatment.

If blocking information exists, state only the fewest simple questions needed to resolve it.

## 3. Simple Question Rule

User-facing questions must be basic and immediately answerable.

Good:
- "Mau bentuknya mobil, motor, kereta, atau lainnya?"
- "Ukurannya kira-kira berapa blok?"
- "Perlu ada bagian yang bergerak atau model diam?"
- "Gayanya mengikuti gambar yang Anda kirim, Minecraft stylized, realistis, atau lainnya?"

Bad:
- asking for topology;
- asking for pivot ownership;
- asking for deformation strategy;
- asking for UV/material pipeline terms;
- asking users to write a better prompt.

## 4. Prompt Compiler

When all blocking information is resolved, run `lazydesigner-prompt-compiler`.

The compiler produces one clean production brief from:

```text
raw user intent
+ confirmed answers
+ approved prior decisions
+ source/reference facts
```

Rejected or superseded chat directions must not remain active.

The compiled brief must never introduce new creative facts.

The compiled brief is internal working state. It is not exported as a default Codex handoff file.

## 5. Final Confirmation Gate — HARD GATE

Before generating **any** new user-facing artifact, ChatGPT must show a concise confirmation summary and obtain explicit user approval.

This gate applies before:
- concept image generation;
- turnaround/reference image generation;
- rig/pose/keyframe image generation;
- JSON package creation;
- Markdown handoff file creation;
- any other generated reference file.

Do not interpret silence or prior general approval as approval of a newly compiled target.

Confirmation should be short and practical.

Recommended format:

```text
Konfirmasi sebelum dibuat:
- Objek: <asset>
- Arah: <main visual/structural direction>
- Tambahan: <animation/reference extras, only if relevant>

Sudah sesuai?
```

Do not expose internal profile/module jargon unless it helps the user.

## 6. Reference Plan

After confirmation, choose only reference outputs that materially improve downstream authoring.

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

Do not generate all modules by default.

## 7. Generate + Internal QA

Every generated reference must use:

```text
confirmed compiled brief
+ approved source/reference authority
+ current reference-module purpose
```

not the uncontrolled full conversation.

Before treating an output as ready for user review, internally check identity, required part completeness, cross-view consistency, attachment/topology, dimensions/style constraints, and relevant articulation/material requirements.

## 8. User Visual Review

Material authority-changing visuals still require user acceptance before they become approved visual authority.

For corrections:

```text
USER DELTA
→ compile CHANGE + PRESERVE
→ if the corrected target itself is materially ambiguous, ask
→ concise final confirmation before generating revised artifact
→ generate bounded correction
```

The confirmation gate applies again before a new/revised artifact is generated, but the summary should mention only the changed target and important preserved constraints.

## 9. Package Generation Gate

After required visual authority is accepted, prepare the package plan but do not create files until package generation is explicitly approved when that approval was not already given in the immediately preceding user instruction.

The package confirmation should remain concise, for example:

```text
Reference sudah siap.
Saya akan buat:
- REFERENCE.json
- GEOMETRY.md
- TEXTURE.md
- ANIMATION.md (jika diperlukan)
- image reference yang sudah disetujui

Lanjut generate package?
```

Do not create unnecessary package files merely to fill a template.

## 10. Package Build

Canonical package structure:

```text
asset_reference/
├── REFERENCE.json
├── GEOMETRY.md
├── TEXTURE.md      ← only when required
├── ANIMATION.md    ← only when required
└── images/
    └── approved/supporting reference images
```

`REFERENCE.json` is the canonical structured index and machine-readable fact contract.

Exact schema is owned by:

```text
docs/knowledge/reference-package-schema.md
```

Stage documents are owned by:

```text
GEOMETRY.md
→ docs/knowledge/geometry-reference-contract.md

TEXTURE.md
→ docs/knowledge/texture-reference-contract.md

ANIMATION.md
→ docs/knowledge/animation-reference-contract.md
```

Stage Markdown files are stage-specific projections. They must not become independent competing authorities.

Do not export the compiled production prompt, conversation transcript, or duplicate README/bootstrap files by default.

## 11. Package Consistency Gate

Before handoff to Codex, verify all of the following:

```text
all documents listed in REFERENCE.json actually exist
all referenced image IDs actually exist
all image paths resolve inside the package
stage documents agree with REFERENCE.json
stage documents introduce no unsupported facts
Geometry document contains no Texture/Animation implementation plan
Texture document contains no Geometry workaround or Animation plan
Animation document contains no Geometry workaround or Texture brief
readiness values agree with blocking unknowns
optional omitted files are not referenced
```

If any check fails, correct the package before handoff.

This gate is internal. Do not make the user review package plumbing unless a real requirement conflict requires their decision.

## 12. Codex Handoff / Load Contract

Package consumption is owned by:

```text
docs/knowledge/reference-package-load-contract.md
```

Expected downstream behavior:

```text
REFERENCE.json
→ identify active stage and readiness
→ load only the active stage document
→ inspect only image IDs referenced by that stage
→ work
```

The package is self-contained. Codex should not need the original ChatGPT transcript or compiled prompt.

## 13. Authority Order

```text
explicit current user requirement
→ approved visual reference
→ REFERENCE.json structured facts
→ generated stage Markdown projections
→ downstream Codex interpretation
```

The compiled brief organizes generation but is not a higher authority than approved user/reference facts.

## 14. Stop Conditions

Do not generate when:
- a blocking requirement is missing;
- materially conflicting sources are unresolved;
- the final confirmation has not been approved;
- package generation is pending explicit approval;
- a correction would require guessing what must remain unchanged;
- a requested reference would not materially help the downstream decision.

Do not hand off when:
- package consistency checks fail;
- referenced files/images are missing;
- a blocking unknown contradicts a `READY` stage.

## User Experience Goal

The user should only need to:

```text
1. describe what they want
2. answer a few simple questions when vital information is missing
3. approve a concise final summary
4. review generated reference when necessary
5. approve package generation
6. receive the completed handoff package for Codex
```

Prompt quality and package consistency are responsibilities of the ChatGPT-side system, not the user.
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
→ PACKAGE BUILD
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

## 9. Package Build

Only after the required visual authority is accepted should ChatGPT build the Codex handoff package.

Exact JSON/Markdown/image package content is intentionally defined separately and may evolve without changing this workflow.

No handoff file is created before a concise package-generation confirmation if package creation has not already been explicitly approved in the immediately preceding step.

## 10. Authority Order

```text
explicit current user requirement
→ approved visual reference
→ confirmed compiled brief
→ structured handoff metadata
→ generated stage summaries
```

The compiled brief and package organize authority; they do not override the user or approved images.

## 11. Stop Conditions

Do not generate when:
- a blocking requirement is missing;
- materially conflicting sources are unresolved;
- the final confirmation has not been approved;
- a correction would require guessing what must remain unchanged;
- a requested reference would not materially help the downstream decision.

## User Experience Goal

The user should only need to:

```text
1. describe what they want
2. answer a few simple questions when vital information is missing
3. approve a concise final summary
4. review generated reference when necessary
5. receive the completed handoff package for Codex
```

Prompt quality is the responsibility of the ChatGPT-side system, not the user.

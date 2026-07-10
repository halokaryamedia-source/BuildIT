# Model Session Folder Convention

Use this convention for each model when Codex receives a ChatGPT-generated brief and reference package.

## Folder Layout

```text
SavedData/sessions/[asset]/
  session.md
  session-lock.md
  references/
  final-screenshots/
```

Optional folders only when useful:

```text
SavedData/sessions/[asset]/
  phase-screenshots/
```

Do not keep failed-attempt screenshots unless the user asks for process history.

## Naming

```text
[asset] = lowercase snake_case
```

Examples:

```text
SavedData/sessions/kangaroo/
SavedData/sessions/samurai_guard/
SavedData/sessions/sound_truck/
```

## Required Files

`session.md` should be based on:

```text
SourceDocument/modeling/model-session-checklist-template.md
```

`session-lock.md` should contain only the runtime session lock payload for anti-spam control.

```text
session_id:
active_phase:
endpoint:
lock_owner:
status: active / reset / stale / closed
started_at:
```

Use this template:

- `SourceDocument/modeling/model-session-lock-template.md`

Before first session start, also run the pre-flight phase risk sweep in:

- `SourceDocument/modeling/ops/phase-risk-simulation.md`

`references/` stores the approved reference package for the asset.

`final-screenshots/` stores only final or phase-approved screenshots.

## Screenshot Cleanup

- Keep current phase screenshots only while reviewing that phase.
- Move approved final images to `final-screenshots/`.
- Delete failed or temporary screenshots after the issue is resolved.

## Acceptance Criteria

- Each model has one clear session folder.
- New chats can recover the model context from `session.md`.
- Final screenshots are not mixed with failed attempts.


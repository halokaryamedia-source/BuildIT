# Next Action

Updated: 2026-09-09  
Branch: **`Local` only**. Proof: `current-validation.md`; ownership: `implementation-map.md`.

## Current State
- **AUTHORING TAXONOMY**: user-selected `DIRECT | 3D_ASSISTED`; shared AUTHORING; only AUTHORING/Animation hands off. GPU work remains deferred.
- Candidate: `D:/Work/AI Stuff/BuildIT-refresh`. User will remove the old BuildIT directory later; do not delete or develop in that old checkout.
- Schema/Particle implemented: canonical nested/conditional Runtime listing, branch projection, shared Animation schemas/docs, Particle on Animation, paint transaction docs. Surface: 56 callable / 49 AUTHORING / 20 Animation; four Gateway tools.
- SDK upgraded to 1.30.0 with pinned Bun 1.3.14 and regenerated lockfile.
- **SOURCE_READY**: `verify:closure`/`verify:full` PASS. RGBA fix installed; native Geometry/Texturing PASS. Gateway startup exposed MSIX logical/physical path aliasing; native realpath fix passes 15 managed tests. Package/retest Gateway next.

## Remaining Local Execution Order
1. Reuse the completed `bun run verify:closure` and `bun run verify:full` evidence for unchanged source. New executable changes need their owning verification.
2. Package the verified Windows path-identity fix from a clean tracked checkout using Bun 1.3.14. Host active-Runtime staging and vA-to-vB activation passed; retest installed Gateway, wrapper status and native rollback. Preserve unrelated Codex settings and assets.
3. Local testing is explicitly reactivated. Follow managed installation in `mcp/distribution/README.md`; never manually copy plugin/config/skills. First native Load Plugin from File trust and a fresh Codex session may be required. Do not fake either.
4. On a disposable project, prove installed identity, healthy Runtime, installed Gateway with four tools, AUTHORING read, Geometry mutation + Undo/Redo, shared AUTHORING Texturing, Animation handoff/read/mutation/playback, Particle inspect/create/patch/save/preview, and .bbmodel save/close/reopen persistence.
5. Test managed vA-to-vB update while hosts are active (defer/fail safe), close hosts normally, activate vB, reopen and verify identity, then rollback to vA. No background polling/service.

Stop after acceptance and report missing native proof precisely. Do not publish Stable or infer visual quality/usage savings from source/package tests.

from pathlib import Path
import re


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"missing expected text in {path}: {old[:100]!r}")
    if text.count(old) != 1:
        raise SystemExit(f"expected one match in {path}, found {text.count(old)}")
    p.write_text(text.replace(old, new, 1))


def replace_section(path: str, start: str, end: str, body: str) -> None:
    p = Path(path)
    text = p.read_text()
    pattern = re.compile(re.escape(start) + r".*?(?=" + re.escape(end) + r")", re.S)
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise SystemExit(f"expected one section {start!r} in {path}, found {len(matches)}")
    p.write_text(pattern.sub(body.rstrip() + "\n\n", text, count=1))

# validation-report.md
path = "docs/foundation/validation-report.md"
replace_once(
    path,
    "**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, P0–P7, Reference Generator, professional sample forensics, Box-UV batch parity, authored Molang transform-string keyframes, and current-state synchronization.",
    "**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, P0–P7, Reference Generator, professional PRO-1–PRO-8 static closures (geometry, Box-UV batch state, Molang transform keyframes, sound events, controller inspection), and current-state synchronization."
)
replace_once(
    path,
    """initialize instructions:       386 characters
tool count:                     62
tools/list response:            75,926 characters
tools array:                    75,882 characters
input schemas:                  52,842 characters
descriptions:                   10,783 characters
per-tool payload:               p50 1,082 / p90 2,149 / p95 2,268 / max 3,167""",
    """initialize instructions:       386 characters
tool count:                     62
tools/list response:            76,439 characters
tools array:                    76,395 characters
input schemas:                  53,493 characters
descriptions:                   10,645 characters
per-tool payload:               p50 1,082 / p90 2,149 / p95 2,268 / max 3,167"""
)
replace_section(
    path,
    "## Professional Sample Forensics — Static / Non-Local\n",
    "## Minimal Reference Generator",
    """## Professional Sample Forensics — Static / Non-Local

Nine supplied professional `.bbmodel` files were inspected as learning evidence only. Static evidence supports purposeful transform ownership, plane-like Cubes, signed/local `inflate`, Locator-owned functional anchors, Box-UV/manual atlas state, and motion semantics that avoid keyframe/FPS/curve-density targets.

The sample-driven closures retained on `Local` are deliberately narrow:

```text
PRO-3  place_cube per-element parent + initial inflate
PRO-5  modify_cubes_batch uv_offset / mirror_uv / autouv parity
PRO-6  manage_keyframes authored Molang transform-string preservation
PRO-7  create_animation + inspect_animation Bedrock sound events
PRO-8  inspect_animation read-only AnimationController/state structure
```

Controller **creation/mutation** remains deferred because it requires state-machine ownership rather than a small keyframe extension. Existing-animation direct sound/timeline-effect mutation and bone-binding expressions also remain deferred. The supplied samples contain no timeline-effect keyframes, so they do not justify a new timeline/controller framework.

No professional sample name, anatomy, node count, UV coordinate, hierarchy depth, transition count, or animation density became a preset or generic product law. No local run is active.

Detailed evidence: `docs/knowledge/reviews/professional-sample-forensic-audit-2026-08-13.md` and `docs/knowledge/reviews/professional-animation-controller-prioritization-2026-08-13.md`."""
)
replace_section(
    path,
    "## Professional Modelling / Phase 3 Static Proof\n",
    "## Product / Lifecycle / Export",
    """## Professional Modelling / PRO-1–PRO-8 Static Proof

Professional `.bbmodel` samples remain learning evidence, not presets or anatomy rules. Current object-agnostic reasoning covers representation choice, transform ownership, primary hierarchy timing, identity-weighted detail, intentional Box-UV authored state, motion timing/interpolation judgement, and preservation of authored Molang/effect/controller data without evaluation.

Bounded source closures reuse existing tools:

```text
place_cube.elements[].group / .inflate
modify_cubes_batch uv_offset / mirror_uv / autouv
manage_keyframes finite numbers or authored Molang strings
create_animation.sound_effects
inspect_animation Animation / AnimationController + optional focused state
```

Controller authoring/mutation is intentionally not implemented. Read-only controller inspection preserves authored animation keys even when no local Animation UUID is loaded and never simulates transition execution.

Current GitHub CI contract proof: **218 tests / 0 failures**, TypeScript success, default-surface budget success, production build success, generated-doc freshness success, and official aggregate enforcement success. Tool count remains **62**; max serialized per-tool payload remains **3,167 characters** under the retained **3,200** ceiling. Runtime workflow prompt remains **6,995 characters** under its `<7,000` budget.

**Proof status:** source/schema/tests/generated docs are current repository/CI proof. Live Blockbench persistence/playback/export behavior for the later PRO closures, controller execution, real call reduction, and visual-quality improvement remain `LOCAL PROOF REQUIRED` if local testing is explicitly reactivated."""
)
replace_once(
    path,
    "`create_animation`/`inspect_animation` own bounded new-animation sound-effect authoring/inspection. Existing-animation sound/timeline mutation and controllers remain protected gaps.",
    "`create_animation`/`inspect_animation` own bounded new-animation sound-effect authoring/inspection. `inspect_animation` also owns read-only AnimationController/state inspection. Controller creation/mutation plus existing-animation direct sound/timeline-effect mutation remain protected gaps."
)
replace_once(
    path,
    "animation controllers\nexisting-animation sound/timeline-effect mutation",
    "animation controller creation/mutation\nexisting-animation sound/timeline-effect mutation"
)
replace_once(
    path,
    "Current non-local source/contracts are synchronized through **P0–P7 + the minimal Reference Generator route + professional PRO-1–PRO-6**.",
    "Current non-local source/contracts are synchronized through **P0–P7 + the minimal Reference Generator route + professional PRO-1–PRO-8**. Sample-driven source expansion is stopped unless a concrete new requirement proves another bounded gap."
)

# implementation-map.md
path = "docs/knowledge/implementation-map.md"
replace_once(
    path,
    "| `inspect_animation` | `mcp/server/tools/animation-inspection.ts` | `mcp/tests/context-payload-cleanup.test.ts` |",
    "| `inspect_animation` | `mcp/server/tools/animation-inspection.ts` | `mcp/tests/animation-controller-inspection-contract.test.ts` |"
)
replace_once(
    path,
    """initialize instructions:       386 characters
tool count:                     62
tools/list response:            75,926 characters
tools array:                    75,882 characters
input schemas:                  52,842 characters
descriptions:                   10,783 characters
per-tool payload:               p50 1,082 / p90 2,149 / p95 2,268 / max 3,167""",
    """initialize instructions:       386 characters
tool count:                     62
tools/list response:            76,439 characters
tools array:                    76,395 characters
input schemas:                  53,493 characters
descriptions:                   10,645 characters
per-tool payload:               p50 1,082 / p90 2,149 / p95 2,268 / max 3,167"""
)
replace_once(
    path,
    "Animation tools own identity, focused inspection, numeric or explicit Molang transform keyframes, graph/batch/copy, rigging, and playback/timeline. `manage_keyframes` preserves Molang strings without evaluating them. New-animation sound effects are owned by `create_animation`/`inspect_animation`; controllers and existing-animation sound/timeline mutation remain protected gaps.",
    "Animation tools own identity, focused inspection, numeric or explicit Molang transform keyframes, graph/batch/copy, rigging, playback/timeline, and bounded new-animation sound effects. `manage_keyframes` preserves Molang strings without evaluating them. `inspect_animation` additionally owns read-only AnimationController/state inspection; controller creation/mutation and existing-animation direct sound/timeline-effect mutation remain protected gaps."
)
replace_once(
    path,
    """PRO-6  manage_keyframes authored Molang transform-string support
DOC    current-state synchronization""",
    """PRO-6  manage_keyframes authored Molang transform-string support
PRO-7  create_animation + inspect_animation Bedrock sound-effect closure
PRO-8  inspect_animation read-only AnimationController/state closure
DOC    current-state synchronization"""
)
replace_once(
    path,
    "Remaining direct/model-facing evidence includes installed deferred-search parity, real token/latency/image-context cost, Reference Generator visual quality, actual-image handoff, P5–P7 model-facing effectiveness, and live expression-keyframe persistence/preview/export behavior.",
    "Remaining direct/model-facing evidence includes installed deferred-search parity, real token/latency/image-context cost, Reference Generator visual quality, actual-image handoff, P5–P7 model-facing effectiveness, and live persistence/preview/export behavior for Molang keyframes, sound events, and controller inspection."
)
replace_once(path, "- animation controllers;", "- animation controller creation/mutation;")
replace_once(path, "- existing-animation sound/timeline-effect mutation;", "- existing-animation direct sound/timeline-effect mutation;")

# CONTEXT.md
path = "CONTEXT.md"
replace_once(
    path,
    "Supported ownership includes Cube/Group authoring, texture/Painter/PBR/material instances, Bedrock animation, Locator/Null Object lifecycle, Undo, `.bbmodel`, and Bedrock geometry export. Protected direct-ownership gaps include TextureMesh authoring, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated textures, and bone-binding expressions.",
    "Supported ownership includes Cube/Group authoring, texture/Painter/PBR/material instances, Bedrock animation (including authored Molang transform strings, bounded new-animation sound events, and read-only AnimationController/state inspection), Locator/Null Object lifecycle, Undo, `.bbmodel`, and Bedrock geometry export. Protected direct-ownership gaps include TextureMesh authoring, native visible bounding-box fields, animation controller creation/mutation, existing-animation direct sound/timeline-effect mutation, animated textures, and bone-binding expressions."
)

# README.md
path = "README.md"
replace_once(
    path,
    """62 tools
75,926 tools/list response characters
52,842 input-schema characters
10,783 description characters
initialize instructions: 386 characters""",
    """62 tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
initialize instructions: 386 characters"""
)
replace_once(
    path,
    "**P0–P7, assisted Reference Generator intake/readiness, and professional PRO-1–PRO-6 contracts are implemented on `Local` unless a specific accepted live baseline applies.** Installed Codex deferred-search parity, actual model-visible token/latency/image-context cost, generated-reference quality, and P5–P7 model-facing effectiveness remain direct/local evidence questions when explicitly activated.",
    "**P0–P7, assisted Reference Generator intake/readiness, and professional PRO-1–PRO-8 static contracts are implemented on `Local` unless a specific accepted live baseline applies.** PRO-8 adds read-only controller/state inspection; controller creation/mutation remains deliberately deferred. Installed Codex deferred-search parity, actual model-visible token/latency/image-context cost, generated-reference quality, P5–P7 model-facing effectiveness, and live behavior of later PRO closures remain direct/local evidence questions when explicitly activated."
)

# mcp/README.md
path = "mcp/README.md"
replace_once(
    path,
    "- Bedrock animation/BoneAnimator workflows;",
    "- Bedrock animation/BoneAnimator workflows, authored Molang transform strings, bounded new-animation sound events, and read-only AnimationController/state inspection;"
)
replace_once(
    path,
    """62 tools
74,996 tools/list response characters
51,810 input-schema characters
10,885 description characters
initialize instructions: 386 characters""",
    """62 tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
initialize instructions: 386 characters"""
)

# docs/knowledge/index.md
path = "docs/knowledge/index.md"
replace_once(
    path,
    """62 tools
74,996 tools/list response characters
51,810 input-schema characters
10,885 description characters
initialize instructions: 386 characters""",
    """62 tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
initialize instructions: 386 characters"""
)
replace_once(
    path,
    """REF    assisted intake + pre-generation readiness + buildable reference route
```""",
    """REF    assisted intake + pre-generation readiness + buildable reference route
PRO-1–PRO-4 professional construction + full sample forensic audit
PRO-5  Box-UV batch parity
PRO-6  authored Molang transform keyframes
PRO-7  bounded new-animation sound events
PRO-8  read-only AnimationController/state inspection
```"""
)
replace_once(
    path,
    "No Codex/Blockbench local run is active. Remaining direct-evidence questions include generated-reference quality, installed-client deferred-search parity, actual model-visible token/latency/image-context cost, and P5–P7 model-facing effectiveness.",
    "No Codex/Blockbench local run is active. Remaining direct-evidence questions include generated-reference quality, installed-client deferred-search parity, actual model-visible token/latency/image-context cost, P5–P7 model-facing effectiveness, and live persistence/preview/export behavior for later professional-animation closures."
)

# task-board.md
path = "docs/knowledge/operations/task-board.md"
replace_once(
    path,
    "The first local acceptance pass, non-local efficiency cleanup, P0–P7 reasoning hardening, minimal Reference Generator route, and current-state synchronization are complete at their documented proof levels. **No fresh Codex/Blockbench local trace is active.**",
    "The first local acceptance pass, non-local efficiency cleanup, P0–P7 reasoning hardening, minimal Reference Generator route, professional PRO-1–PRO-8 static closures, and current-state synchronization are complete at their documented proof levels. **No fresh Codex/Blockbench local trace is active.**"
)
replace_once(path, "- animation controllers;", "- animation controller creation/mutation;")
replace_once(path, "- animation sound/timeline effects;", "- existing-animation direct sound/timeline-effect mutation;")
replace_once(
    path,
    "- [x] Re-audit active docs, flow, proof, ownership, public README, and Review Index after P5–P7 + Reference Generator materially changed continuation.\n- [ ] Prune this board when a waiting item becomes irrelevant or active.",
    "- [x] Re-audit active docs, flow, proof, ownership, public README, and Review Index after P5–P7 + Reference Generator materially changed continuation.\n- [x] Synchronize proof/ownership/README/task/review owners after professional PRO-1–PRO-8 static closures.\n- [ ] Prune this board when a waiting item becomes irrelevant or active."
)

# review-graph.md
path = "docs/knowledge/reviews/review-graph.md"
replace_once(
    path,
    "| [Codex Native Deferred MCP Tool Loading](codex-native-deferred-mcp-tool-loading-2026-08-11.md) | **Static architecture implemented; installed-client parity remains optional local proof.** |",
    "| [Codex Native Deferred MCP Tool Loading](codex-native-deferred-mcp-tool-loading-2026-08-11.md) | **Static architecture implemented; installed-client parity remains optional local proof.** |\n| [Professional Authoring Expressiveness](professional-authoring-expressiveness-2026-08-13.md) | **Implemented evidence.** Identified the bounded `place_cube` parent/inflate creation bottleneck without introducing professional presets. |\n| [Professional Sample Forensic Audit](professional-sample-forensic-audit-2026-08-13.md) | **Current static evidence.** Geometry/Texturing/Animation sample patterns drove PRO-4–PRO-7 while remaining learning evidence only. |\n| [Professional Animation Controller Prioritization](professional-animation-controller-prioritization-2026-08-13.md) | **Current static evidence.** Read-only controller inspection is bounded; controller creation/mutation is intentionally deferred. |"
)
replace_section(
    path,
    "## Current Execution Gate\n",
    "Current state: [Next Action]",
    """## Current Execution Gate

```text
LOCAL Codex + Blockbench acceptance                          COMPLETE (historical baseline)
→ post-acceptance static cleanup                             COMPLETE
→ P0–P7 reasoning/routing/reference-fidelity contracts      COMPLETE (static)
→ minimal Reference Generator route/buildability            COMPLETE (static)
→ PRO-1–PRO-4 professional reasoning + forensic audit       COMPLETE (static)
→ PRO-5 Box-UV batch parity                                  COMPLETE (static)
→ PRO-6 authored Molang transform keyframes                 COMPLETE (static)
→ PRO-7 bounded new-animation sound events                  COMPLETE (static)
→ PRO-8 read-only AnimationController/state inspection      COMPLETE (static)
→ current-state proof/ownership synchronization             COMPLETE
→ NO LOCAL RUN ACTIVE
→ NO FURTHER SAMPLE-DRIVEN SOURCE EXPANSION
```

"""
)

# next-action.md
path = "docs/knowledge/next-action.md"
replace_once(
    path,
    "PROFESSIONAL_ANIMATION_CONTROLLER_INSPECTION_PRO8_COMPLETE",
    "PROFESSIONAL_STATIC_PRELOCAL_CONSOLIDATION_COMPLETE"
)
replace_once(
    path,
    "No P8 architecture, preset/profile, evaluator, planner, controller framework, new tool family, or local test was added.",
    "No P8 architecture, preset/profile, evaluator, planner, controller framework, new tool family, or local test was added. Current proof/ownership/README/task/review owners are synchronized through PRO-8."
)
replace_once(
    path,
    "NO FURTHER SAMPLE-DRIVEN SOURCE EXPANSION",
    "NON-LOCAL STOP — NO FURTHER SAMPLE-DRIVEN SOURCE EXPANSION"
)
replace_once(
    path,
    "Keep local testing deferred until the user explicitly reactivates it. Reopen source expansion only from a concrete new authoring requirement or new evidence that demonstrates a bounded missing capability.",
    "Keep local testing deferred until the user explicitly reactivates it. There is no remaining justified sample-driven non-local source task after this synchronization; reopen only from a concrete new authoring requirement or new evidence that demonstrates a bounded missing capability."
)

print("PRO-9 static readiness synchronization applied")

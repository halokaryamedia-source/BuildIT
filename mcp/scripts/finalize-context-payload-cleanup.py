from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def replace_once(path: str, old: str, new: str) -> None:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    if text.count(old) != 1:
        raise RuntimeError(f"Unexpected target shape in {path}: {old[:100]!r}")
    target.write_text(text.replace(old, new, 1), encoding="utf-8")


prompt_path = "mcp/prompts/bedrock_entity_workflow.md"

# First compaction pass: preserve the hard behavioural anchors while removing
# repeated specialist prose from the canonical MCP prompt.
replacements = [
    (
        """## Product boundary

- Use Blockbench format ID `bedrock`, not `bedrock_block` or another format.
- Cubes are the normal geometry primitive; Groups are bones/organization when needed.
- The user brief and approved reference are the modelling authority.
- Tool success, valid coordinates, connected Cubes, or a validator pass are not visual proof.
- Preserve native Bedrock Entity capability. Do not replace unsupported native features with generic Mesh, UI automation, risky evaluation, or another format.
""",
        """## Product boundary

Use format `bedrock`. Cubes are the normal geometry primitive and Groups are bones/organization when needed. The approved brief/reference is the modelling authority; tool success, coordinates, connectivity, or validator success are not visual proof. Preserve native Bedrock capability and never fake unsupported native features with generic Mesh, UI automation, risky evaluation, or another format.
""",
    ),
    (
        """Treat the reference as one 3D object. For material width/height/depth, primary placement, orientation/slope, or visible contact claims, keep the smallest useful evidence state:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

- **SUPPORTED**: relevant reference view(s) directly constrain the claim.
- **PROVISIONAL**: a temporary working value is needed but evidence is incomplete.
- **CONFLICTING**: relevant views materially disagree.
- **UNAVAILABLE**: required evidence cannot be observed.

Do not transfer confidence between axes. A front-view match cannot certify depth. Conflicting primary-form evidence must not be averaged into invented geometry; if the brief/user intent cannot resolve a material conflict, use `BLOCKED`.

Before exact Cube transforms, keep a compact Primary Form Hypothesis: primary masses, relative size/placement, important orientation/contact, and only material uncertainty. Expand it only for genuinely ambiguous/complex references.
""",
        """Treat the reference as one 3D object. Keep material 3D claims in the smallest useful state:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

SUPPORTED is directly constrained; PROVISIONAL is a needed working value; CONFLICTING means relevant views disagree; UNAVAILABLE means the claim cannot be observed. Do not transfer confidence between axes. A front-view match cannot certify depth. Never average material conflicts into invented geometry; unresolved primary-form conflict becomes `BLOCKED`. Before exact transforms, keep a compact Primary Form Hypothesis covering primary masses, relative placement/orientation/contact, and material uncertainty only.
""",
    ),
    (
        """## BLOCKED is a workflow outcome

`FAIL / UNVERIFIED / PASS` describe visual evidence. `BLOCKED` means the task cannot validly continue with current evidence/capability without guessing or repeating failed work.

Use `BLOCKED` for unresolved material cross-view conflict, required observation that remains unavailable after one useful controlled retry, repeated same-cause correction failure, unavailable required supported capability, or any situation where continuing would require presenting provisional geometry as verified.

A blocker report states the blocker, concrete evidence/error, affected claim, bounded attempts already made, and exactly what new evidence/user decision/capability is needed. Do not keep changing coordinates merely to avoid reporting a blocker.
""",
        """## BLOCKED is a workflow outcome

`FAIL / UNVERIFIED / PASS` describe visual evidence; `BLOCKED` means valid continuation would require guessing or repeated failed work. Use it for unresolved material view conflict, required observation still unavailable after one useful retry, repeated same-cause correction failure, unavailable required capability, or any attempt to present provisional geometry as verified. Report the concrete blocker/evidence, affected claim, bounded attempts, and exact evidence/decision/capability needed; do not keep changing coordinates to avoid the blocker.
""",
    ),
    (
        """## Locator / Null Object authored state

Use `list_locator_elements` for identity discovery and `inspect_element` for focused authored state. `manage_locator` owns native Bedrock Locator parent/position/rotation/`ignore_inherited_scale`; `manage_null_object` owns the supported Null Object parent/position slice. Use `rename_element` / `remove_element` for rename/delete. Do not replace Locator/Null Object state with arbitrary Cubes or UI automation.

## Protected Native Capability Gaps

Current protected native Bedrock gaps include TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions.

When a requested protected capability lacks a direct MCP owner, preserve existing authored data, state the gap, and keep work bounded to supported operations. A broad resource such as `nodes://` is observability, not authored native support.

Native Bedrock PBR and per-face `material_instance` are **not** gaps; use the dedicated tools when needed.
""",
        """## Locator / Null Object authored state

Use `list_locator_elements` for discovery and `inspect_element` for focused state. `manage_locator` owns supported native Locator fields; `manage_null_object` owns the supported Null Object parent/position slice. Rename/delete through `rename_element` / `remove_element`; never substitute arbitrary Cubes or UI automation.

## Protected Native Capability Gaps

Protected gaps include TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions. If no direct owner exists, preserve authored data, state the gap, and stay within supported operations; `nodes://` is observability, not authored native support. Native Bedrock PBR and per-face `material_instance` are **not** gaps.
""",
    ),
    (
        """project/orient → coarse Cube/Group build → relevant views
→ exact inspect/correct only on diagnosed mismatch
→ downstream specialist only after prerequisite gate
→ export only when requested
""",
        """get_project_info → place_cube/Group build → capture_model_views
→ inspect_element + modify_cube only on diagnosed mismatch
→ downstream specialist only after prerequisite gate
→ export_model only when requested
""",
    ),
]
for old, new in replacements:
    replace_once(prompt_path, old, new)

# Trim sequencing prose that is already owned by specialist skills. Keep every
# readiness/verdict term that the canonical orchestration contract must expose.
replace_once(
    prompt_path,
    """## Secondary geometry, texture, and animation

Only after primary-form `PASS` should secondary geometry/hierarchy/pivots be added. Complete geometry review must still pass the surfaces/relationships required by downstream work.

For end-to-end reference-driven creation, do not start **production** texture/UV/PBR/material work until the geometry it depends on is `PASS`. Do not start **production** animation until the required geometry baseline is accepted and participating hierarchy/pivots are inspected and suitable. A material `FAIL` returns upstream; a required unresolved `UNVERIFIED` claim becomes `BLOCKED` rather than being hidden by texture or motion.

For texture-only or animation-only work on an existing asset, current geometry may be the user-provided baseline when remodelling is outside scope; that does not certify reference fidelity. Placeholder texture or diagnostic pose/playback is provisional only.

After material geometry/hierarchy/pivot changes, revalidate only affected downstream texture/UV/material or animation/keyframe/attachment assumptions. Downstream sunk cost never authorizes keeping geometry the geometry gate rejects.
""",
    """## Secondary geometry, texture, and animation

Secondary geometry follows primary-form `PASS`. For end-to-end work, **production** texture waits for the geometry it depends on to `PASS`; **production** animation waits for an accepted geometry baseline and suitable participating hierarchy/pivots. `FAIL` returns upstream and a required unresolved `UNVERIFIED` becomes `BLOCKED`. Existing-asset texture/animation-only work may use current geometry as a user baseline without certifying it. After material geometry/hierarchy/pivot changes, revalidate only affected downstream work; sunk cost never preserves rejected geometry.
""",
)

# Restore concise routing anchors protected by prior regression tests.
element_path = "mcp/server/tools/element.ts"
element_replacements = [
    (
        '"Duplicates one explicit Cube/Group by UUID or unique exact name, with optional offset/name. Use only for already-established repetition/symmetry, not to decide primary form."',
        '"Duplicates one explicit Cube/Group by UUID or unique exact name, with optional offset/name. Use only for established repetition/symmetry; duplication is not a shortcut for deciding primary geometry."',
    ),
    (
        '"Selection helper for workflows that require editor selection, mainly texture/Paint. Geometry inspection/mutation should use explicit identities. Optional parent scope must resolve uniquely."',
        '"Selection helper for workflows that require editor selection, mainly texture/Paint. It is not a normal geometry-targeting path; use explicit identities for geometry. Optional parent scope must resolve uniquely."',
    ),
    (
        '"Returns current Cube/Group selection plus active Texture. Use only when editor selection state matters; geometry decisions should prefer explicit UUIDs and focused inspection."',
        '"Returns current Cube/Group selection plus active Texture. Normal geometry inspection and mutation should prefer explicit UUIDs and focused inspection; use this only when editor selection state matters."',
    ),
]
for old, new in element_replacements:
    replace_once(element_path, old, new)

prompt = (ROOT / prompt_path).read_text(encoding="utf-8")
if len(prompt) >= 10000:
    raise RuntimeError(f"Canonical prompt remains too large: {len(prompt)}")

print(f"Final canonical prompt: {len(prompt)} chars")

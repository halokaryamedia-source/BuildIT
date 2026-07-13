from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n", encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one match, found {count}: {old[:100]!r}")
    write(path, source.replace(old, new, 1))


def insert_after(path: str, anchor: str, block: str, marker: str) -> None:
    source = read(path)
    if marker in source:
        return
    if anchor not in source:
        raise RuntimeError(f"{path}: insertion anchor missing: {anchor[:100]!r}")
    write(path, source.replace(anchor, anchor + "\n\n" + block.strip(), 1))


def append_section(path: str, heading: str, body: str) -> None:
    source = read(path)
    if heading in source:
        return
    write(path, source + "\n\n" + heading + "\n\n" + body.strip())


def update_json(path: str, mutator) -> None:
    value = json.loads(read(path))
    mutator(value)
    write(path, json.dumps(value, indent=2, ensure_ascii=False))


# ---------------------------------------------------------------------------
# ChatGPT Reference Studio: candidate creation and Golden Sample promotion
# ---------------------------------------------------------------------------

studio = "engines/chatgpt/skills/blockbench-reference-studio/SKILL.md"
replace_once(
    studio,
    'description: "Create a complete approved Minecraft Bedrock / Blockbench package in ChatGPT using one generated Reference Visual, then produce machine-readable Geometry diagnosis, rotation, texture, animation, validation, and Codex handoff contracts."',
    'description: "Create a complete approved Minecraft Bedrock / Blockbench reference candidate or Golden Sample package in ChatGPT using one generated Reference Visual, then produce synchronized machine-readable Geometry, Texture, Animation, Validation, and Codex handoff contracts."',
)

insert_after(
    studio,
    "Do not connect to MCP, edit `.bbmodel`, acquire a lease, or simulate production from this skill.",
    """
## Contract version and sample modes

This skill emits Reference Studio contract `3.3`, compatible with MCP-Blockbench `1.7.0+` and the one-session Codex workflow.

Choose exactly one package mode before writing files:

- `reference_candidate`: a fresh sample package awaiting promotion. Use this for every newly created sample reference.
- `golden_sample`: a repository-tracked baseline that has already passed package audit, automated repository verification, and explicit promotion approval.

When the user asks to create a new sample reference:

1. use a fresh `asset_id` and set `sample_type` to `reference_candidate`;
2. never copy an existing `.bbmodel`, checkpoint, evidence, runtime identity, or Golden Sample manifest;
3. complete the normal Production Context and Reference Visual approvals;
4. generate the full package and ZIP with `promotion_status = candidate_not_promoted`;
5. stop after package audit and user approval—the candidate must not silently replace a tracked Golden Sample;
6. promote only through a repository update that changes `sample_type` to `golden_sample`, records the exact visual hash, preserves the candidate files byte-for-byte, and leaves local MCP production acceptance explicitly pending until tested.

A Golden Sample is a promoted reference package, not a prebuilt Blockbench model.
""",
    "## Contract version and sample modes",
)

insert_after(
    studio,
    "### Phase 4 — Machine-readable Geometry data\n\nThe manifest must include data that allows MCP to diagnose errors rather than guess.",
    """
#### Package identity and compatibility

`reference_manifest.json` must declare:

```json
{
  "schema_version": "3.3",
  "sample_type": "reference_candidate",
  "contract": {
    "reference_studio": "3.3",
    "mcp_blockbench_minimum": "1.7.0",
    "workflow": "single_reference_visual_one_session"
  }
}
```

For a promoted repository baseline, use `sample_type = golden_sample` and `promotion_status = promoted_golden_sample`. Do not change the approved Reference Visual or its SHA-256 during promotion.

Every package must also declare:

- `geometry.symmetry_policy` as `BILATERAL` or `ASYMMETRIC`;
- bilateral pairs or explicit asymmetry contracts;
- executable part-count, parent, size, center, and rotation contracts where reliable;
- Texture quality limits for alpha, visible coverage, color budget, and palette drift;
- Animation quality limits for required clips, duration, animator/keyframe presence, group references, and root-motion policy;
- five base final views, plus conditional `right_side` when `ASYMMETRIC`.
""",
    "#### Package identity and compatibility",
)

replace_once(
    studio,
    "6. all five crops are non-zero and valid;",
    "6. all five base crops are non-zero and valid, plus a non-zero `right_side` crop when `symmetry_policy` is `ASYMMETRIC`;",
)
replace_once(
    studio,
    "→ final five-view diagnosis with write_diff_image=true",
    "→ final required-view diagnosis with write_diff_image=true (five base views plus `right_side` when `ASYMMETRIC`)",
)

# ---------------------------------------------------------------------------
# ChatGPT templates
# ---------------------------------------------------------------------------

manifest_template = "engines/chatgpt/skills/blockbench-reference-studio/templates/reference_manifest.template.json"


def update_manifest_template(value: dict) -> None:
    value["schema_version"] = "3.3"
    value["sample_type"] = "<reference_candidate_or_golden_sample>"
    value["contract"] = {
        "reference_studio": "3.3",
        "mcp_blockbench_minimum": "1.7.0",
        "workflow": "single_reference_visual_one_session",
    }
    value.setdefault("workflow", {})["promotion_status"] = (
        "<candidate_not_promoted_or_promoted_golden_sample>"
    )
    geometry = value.setdefault("geometry", {})
    geometry["symmetry_policy"] = "<BILATERAL_or_ASYMMETRIC>"
    geometry.setdefault("symmetry_pairs", [])
    geometry.setdefault("asymmetry_contracts", [])
    texture_quality = value.setdefault("texturing", {}).setdefault("quality_contract", {})
    texture_quality["anti_aliasing_allowed"] = False
    texture_quality.setdefault("palette_hex", [])
    grounding = value.setdefault("visual_grounding", {})
    grounding["review_submission_tool"] = "submit_geometry_for_review"
    grounding["approval_tool"] = "complete_geometry_stage"
    validation = value.setdefault("validation", {})
    validation["base_required_views"] = [
        "front",
        "left_side",
        "back",
        "top_footprint",
        "front_left_3_4",
    ]
    validation["conditional_required_views"] = {"ASYMMETRIC": ["right_side"]}


update_json(manifest_template, update_manifest_template)

handoff_template = "engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md"
insert_after(
    handoff_template,
    "- Canonical Model: `<asset_id>.bbmodel`",
    """
- Manifest Schema: `3.3`
- Sample Type: `<reference_candidate_or_golden_sample>`
- Promotion Status: `<candidate_not_promoted_or_promoted_golden_sample>`
""",
    "- Manifest Schema: `3.3`",
)
replace_once(
    handoff_template,
    "→ final five-view diagnosis with write_diff_image=true",
    "→ final required-view diagnosis with write_diff_image=true",
)
insert_after(
    handoff_template,
    "`submit_geometry_for_review` performs fresh `validate_geometry_contract`, verifies embedded review readiness, creates the next unused review checkpoint, and enters `GEOMETRY_REVIEW`. Do not run duplicate validation steps immediately before submission.",
    """
Final required views are `front`, `left_side`, `back`, `top_footprint`, and `front_left_3_4`. Add `right_side` only when `symmetry_policy = ASYMMETRIC`.

Normal implementation uses the selected Terra Medium writer. Sol Medium is inspection-only and is used only for unresolved cross-view judgment, subjective feedback after deterministic PASS, or final visual acceptance. No separate model-routing call is required.
""",
    "Final required views are `front`",
)
insert_after(
    handoff_template,
    "Maximum loaded production skills: `2`. All stage changes continue in the same Codex session and MCP session.",
    "Upstream reopen also continues in the same Codex and MCP session; it releases the prior lease and requires a fresh target-stage lease, not a reconnect.",
    "Upstream reopen also continues",
)

# ---------------------------------------------------------------------------
# Codex skill wording synchronized with runtime
# ---------------------------------------------------------------------------

production_skill = "engines/shared/skills/blockbench-production/SKILL.md"
replace_once(
    production_skill,
    "→ final five-view capture/analyze",
    "→ final required-view capture/analyze (five base views plus conditional `right_side`)",
)
replace_once(
    production_skill,
    "Reference Visual hash, five views, analyzer, visual decision, and rotation audit.",
    "Reference Visual hash, all manifest-required views, analyzer, visual decision, and rotation audit.",
)

geometry_skill = "engines/shared/skills/blockbench-geometry/SKILL.md"
replace_once(
    geometry_skill,
    "→ final five-view capture/analyze with write_diff_image=true",
    "→ final required-view capture/analyze with write_diff_image=true",
)

validation_skill = "engines/shared/skills/blockbench-validation/SKILL.md"
replace_once(
    validation_skill,
    "→ clean five-view final capture",
    "→ clean final required-view capture",
)
replace_once(
    validation_skill,
    "Upstream reopen preserves approved checkpoints as rollback baselines, marks downstream stages `REVALIDATION_REQUIRED`, activates the canonical target-stage profile, releases the old lease, and requires one canonical stage-transition reconnect. Do not activate removed repair profiles.",
    "Upstream reopen preserves approved checkpoints as rollback baselines, marks downstream stages `REVALIDATION_REQUIRED`, activates the canonical target-stage profile, releases the old lease, and continues in the same Codex and MCP session. Acquire a fresh target-stage lease; do not reconnect or activate removed repair profiles.",
)

# ---------------------------------------------------------------------------
# Golden Sample: schema 3.3 and complete executable manifest
# ---------------------------------------------------------------------------

golden_manifest_path = "docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"

GOLDEN_REGIONS = {
    "left_side": [
        {
            "id": "head_horns",
            "rect": [0.0, 0.0, 0.38, 0.62],
            "weight": 1.35,
            "minimum_score": 0.58,
            "critical": True,
            "issue_code": "LEFT_HEAD_HORN_PROFILE_MISMATCH",
            "parts": ["neck", "head", "muzzle", "horn_front", "horn_rear", "ear_left", "ear_right"],
            "recommendation": "Correct the low-forward head chain and horn direction before changing the torso.",
        },
        {
            "id": "shoulder",
            "rect": [0.27, 0.12, 0.34, 0.55],
            "weight": 1.25,
            "minimum_score": 0.62,
            "critical": True,
            "issue_code": "LEFT_SHOULDER_MASS_MISMATCH",
            "parts": ["shoulder_mass", "neck", "torso_core"],
            "recommendation": "Adjust shoulder height/depth and the neck transition; do not compensate with horn or leg changes.",
        },
        {
            "id": "rear_taper",
            "rect": [0.58, 0.18, 0.42, 0.5],
            "weight": 1.1,
            "minimum_score": 0.6,
            "critical": True,
            "issue_code": "LEFT_REAR_TAPER_MISMATCH",
            "parts": ["torso_core", "rear_mass", "tail_base"],
            "recommendation": "Change rear width/topline/bottom transition using stepped cuboids rather than rotating the full body.",
        },
        {
            "id": "legs_ground",
            "rect": [0.2, 0.55, 0.72, 0.45],
            "weight": 0.9,
            "minimum_score": 0.58,
            "critical": False,
            "issue_code": "LEFT_LEG_GROUND_PROFILE_MISMATCH",
            "parts": ["leg_front_left", "leg_front_right", "leg_rear_left", "leg_rear_right"],
            "recommendation": "Correct leg thickness, root positions, length, and ground contact without changing approved body height.",
        },
    ],
    "front": [
        {
            "id": "front_horn_head",
            "rect": [0.22, 0.0, 0.56, 0.58],
            "weight": 1.3,
            "minimum_score": 0.58,
            "critical": True,
            "issue_code": "FRONT_HEAD_HORN_WIDTH_MISMATCH",
            "parts": ["head", "muzzle", "horn_front", "horn_rear", "ear_left", "ear_right"],
            "recommendation": "Correct head/muzzle width, centered horn stack, and ear spacing before changing shoulder width.",
        },
        {
            "id": "front_shoulders",
            "rect": [0.05, 0.18, 0.9, 0.52],
            "weight": 1.15,
            "minimum_score": 0.64,
            "critical": True,
            "issue_code": "FRONT_SHOULDER_WIDTH_MISMATCH",
            "parts": ["shoulder_mass", "torso_core", "neck"],
            "recommendation": "Adjust bilateral shoulder width and upper-body symmetry; keep the head centered.",
        },
        {
            "id": "front_legs",
            "rect": [0.1, 0.56, 0.8, 0.44],
            "weight": 0.9,
            "minimum_score": 0.58,
            "critical": False,
            "issue_code": "FRONT_LEG_SPACING_MISMATCH",
            "parts": ["leg_front_left", "leg_front_right", "foot_front_left", "foot_front_right"],
            "recommendation": "Correct front-leg thickness and spacing within the shoulder footprint.",
        },
    ],
    "back": [
        {
            "id": "back_rear_mass",
            "rect": [0.06, 0.12, 0.88, 0.58],
            "weight": 1.2,
            "minimum_score": 0.62,
            "critical": True,
            "issue_code": "BACK_REAR_MASS_MISMATCH",
            "parts": ["rear_mass", "torso_core", "tail_base", "tail_tip"],
            "recommendation": "Correct rear width/taper and centered tail attachment before changing rear legs.",
        },
        {
            "id": "back_legs",
            "rect": [0.1, 0.55, 0.8, 0.45],
            "weight": 0.9,
            "minimum_score": 0.58,
            "critical": False,
            "issue_code": "BACK_LEG_SPACING_MISMATCH",
            "parts": ["leg_rear_left", "leg_rear_right", "foot_rear_left", "foot_rear_right"],
            "recommendation": "Correct rear-leg thickness, bilateral spacing, and ground contact.",
        },
    ],
    "top_footprint": [
        {
            "id": "top_head",
            "rect": [0.18, 0.0, 0.64, 0.36],
            "weight": 1.2,
            "minimum_score": 0.56,
            "critical": True,
            "issue_code": "TOP_HEAD_FOOTPRINT_MISMATCH",
            "parts": ["neck", "head", "muzzle", "horn_front", "horn_rear"],
            "recommendation": "Correct the narrowing head/muzzle footprint and centered horn chain.",
        },
        {
            "id": "top_shoulders",
            "rect": [0.03, 0.25, 0.94, 0.32],
            "weight": 1.25,
            "minimum_score": 0.63,
            "critical": True,
            "issue_code": "TOP_SHOULDER_FOOTPRINT_MISMATCH",
            "parts": ["shoulder_mass", "torso_core", "neck"],
            "recommendation": "Make the shoulder the widest footprint region while keeping the neck centered.",
        },
        {
            "id": "top_rear_taper",
            "rect": [0.12, 0.52, 0.76, 0.48],
            "weight": 1.15,
            "minimum_score": 0.6,
            "critical": True,
            "issue_code": "TOP_REAR_TAPER_MISMATCH",
            "parts": ["torso_core", "rear_mass", "tail_base"],
            "recommendation": "Narrow the rear footprint progressively; do not leave a full-width rectangular end wall.",
        },
    ],
    "front_left_3_4": [
        {
            "id": "three_quarter_identity",
            "rect": [0.0, 0.0, 1.0, 0.78],
            "weight": 1.25,
            "minimum_score": 0.58,
            "critical": True,
            "issue_code": "THREE_QUARTER_IDENTITY_MISMATCH",
            "parts": ["shoulder_mass", "torso_core", "rear_mass", "neck", "head", "muzzle", "horn_front", "horn_rear"],
            "recommendation": "Correct the combined head/shoulder/torso read; do not optimize one orthographic view at the expense of 3/4 identity.",
        },
        {
            "id": "three_quarter_support",
            "rect": [0.08, 0.5, 0.82, 0.5],
            "weight": 0.85,
            "minimum_score": 0.55,
            "critical": False,
            "issue_code": "THREE_QUARTER_SUPPORT_MISMATCH",
            "parts": ["leg_front_left", "leg_front_right", "leg_rear_left", "leg_rear_right"],
            "recommendation": "Correct visible leg layering, thickness, and ground support without widening the full body.",
        },
    ],
}

ROTATION_CONTRACTS = {
    "neck_down": {
        "id": "neck_down", "cube_patterns": ["neck", "neck_main"], "allowed_axis": "x",
        "minimum_degrees": -25, "maximum_degrees": 0,
        "pivot_anchor": ["center", "center", "max"], "tip_anchor": ["center", "center", "min"],
        "expected_direction": [0, -0.2, -1], "minimum_direction_dot": 0.45,
        "connection_tolerance_units": 2, "affected_views": ["left_side", "front_left_3_4"],
    },
    "head_down": {
        "id": "head_down", "cube_patterns": ["head", "head_main", "head_brow"], "allowed_axis": "x",
        "minimum_degrees": -22, "maximum_degrees": 0,
        "pivot_anchor": ["center", "center", "max"], "tip_anchor": ["center", "center", "min"],
        "expected_direction": [0, -0.18, -1], "minimum_direction_dot": 0.45,
        "connection_tolerance_units": 2, "connect_to_patterns": ["neck", "neck_main"],
        "connect_to_anchor": ["center", "center", "min"], "affected_views": ["left_side", "front_left_3_4"],
    },
    "muzzle_down": {
        "id": "muzzle_down", "cube_patterns": ["muzzle", "muzzle_main"], "allowed_axis": "x",
        "minimum_degrees": -18, "maximum_degrees": 3,
        "pivot_anchor": ["center", "center", "max"], "tip_anchor": ["center", "center", "min"],
        "expected_direction": [0, -0.12, -1], "minimum_direction_dot": 0.5,
        "connection_tolerance_units": 2, "connect_to_patterns": ["head", "head_main"],
        "connect_to_anchor": ["center", "center", "min"],
        "affected_views": ["left_side", "front", "front_left_3_4"],
    },
    "horn_front_up": {
        "id": "horn_front_up", "cube_patterns": ["horn_front", "horn_front_base", "horn_front_mid", "horn_front_tip"],
        "allowed_axis": "x", "minimum_degrees": -35, "maximum_degrees": 5,
        "pivot_anchor": ["center", "min", "center"], "tip_anchor": ["center", "max", "min"],
        "expected_direction": [0, 1, -0.28], "minimum_direction_dot": 0.45,
        "connection_tolerance_units": 1.5, "affected_views": ["left_side", "front", "front_left_3_4"],
    },
    "horn_rear_up": {
        "id": "horn_rear_up", "cube_patterns": ["horn_rear", "horn_rear_base", "horn_rear_tip"],
        "allowed_axis": "x", "minimum_degrees": -28, "maximum_degrees": 8,
        "pivot_anchor": ["center", "min", "center"], "tip_anchor": ["center", "max", "min"],
        "expected_direction": [0, 1, -0.18], "minimum_direction_dot": 0.42,
        "connection_tolerance_units": 1.5, "affected_views": ["left_side", "front", "front_left_3_4"],
    },
    "ear_left_out": {
        "id": "ear_left_out", "cube_patterns": ["ear_left", "ear_left_main"], "allowed_axis": "z",
        "minimum_degrees": -25, "maximum_degrees": 0,
        "pivot_anchor": ["center", "min", "center"], "tip_anchor": ["min", "max", "center"],
        "expected_direction": [-0.28, 1, 0], "minimum_direction_dot": 0.42,
        "connection_tolerance_units": 1.5, "affected_views": ["front", "front_left_3_4"],
    },
    "ear_right_out": {
        "id": "ear_right_out", "cube_patterns": ["ear_right", "ear_right_main"], "allowed_axis": "z",
        "minimum_degrees": 0, "maximum_degrees": 25,
        "pivot_anchor": ["center", "min", "center"], "tip_anchor": ["max", "max", "center"],
        "expected_direction": [0.28, 1, 0], "minimum_direction_dot": 0.42,
        "connection_tolerance_units": 1.5, "affected_views": ["front", "front_left_3_4"],
    },
    "tail_down": {
        "id": "tail_down", "cube_patterns": ["tail", "tail_base", "tail_tip"], "allowed_axis": "x",
        "minimum_degrees": -5, "maximum_degrees": 35,
        "pivot_anchor": ["center", "max", "min"], "tip_anchor": ["center", "min", "max"],
        "expected_direction": [0, -0.35, 1], "minimum_direction_dot": 0.38,
        "connection_tolerance_units": 1.5, "affected_views": ["left_side", "back", "front_left_3_4"],
    },
}

PART_CONSTRAINTS = [
    {"id": "shoulder_mass", "role": "PRIMARY_MASS", "name_patterns": ["shoulder_mass", "shoulder_main"], "parent": "body", "center_range_units": {"min": [-2, 22, -9], "max": [2, 29, -2]}, "size_range_units": {"min": [22, 18, 9], "max": [28, 25, 17]}, "visual_views": ["left_side", "front", "top_footprint", "front_left_3_4"]},
    {"id": "torso_core", "role": "PRIMARY_MASS", "name_patterns": ["torso_core", "torso_main", "belly_transition"], "parent": "body", "center_range_units": {"min": [-2, 19, 1], "max": [2, 27, 10]}, "size_range_units": {"min": [19, 15, 22], "max": [26, 23, 34]}, "visual_views": ["left_side", "front", "back", "top_footprint", "front_left_3_4"]},
    {"id": "rear_mass", "role": "PRIMARY_MASS", "name_patterns": ["rear_mass", "rear_main"], "parent": "body", "center_range_units": {"min": [-2, 18, 13], "max": [2, 26, 20]}, "size_range_units": {"min": [16, 13, 8], "max": [23, 21, 15]}, "visual_views": ["left_side", "back", "top_footprint", "front_left_3_4"]},
    {"id": "neck", "role": "PRIMARY_MASS", "name_patterns": ["neck", "neck_main"], "parent": "body", "rotation_contract": "neck_down", "visual_views": ["left_side", "front", "top_footprint", "front_left_3_4"]},
    {"id": "head", "role": "PRIMARY_MASS", "name_patterns": ["head", "head_main", "head_brow"], "parent": "neck", "rotation_contract": "head_down", "visual_views": ["left_side", "front", "top_footprint", "front_left_3_4"]},
    {"id": "muzzle", "role": "PRIMARY_MASS", "name_patterns": ["muzzle", "muzzle_main"], "parent": "head", "rotation_contract": "muzzle_down", "visual_views": ["left_side", "front", "top_footprint", "front_left_3_4"]},
    {"id": "legs", "role": "PROVISIONAL_SUPPORT", "minimum_elements": 4, "maximum_elements": 4, "name_patterns": ["leg_front_left", "leg_front_right", "leg_rear_left", "leg_rear_right"], "parent": "body", "visual_views": ["left_side", "front", "back", "top_footprint", "front_left_3_4"]},
    {"id": "front_horn", "role": "STRUCTURAL_DETAIL", "minimum_elements": 3, "maximum_elements": 3, "name_patterns": ["horn_front"], "parent": "head", "rotation_contract": "horn_front_up", "visual_views": ["left_side", "front", "front_left_3_4"]},
    {"id": "rear_horn", "role": "STRUCTURAL_DETAIL", "minimum_elements": 2, "maximum_elements": 2, "name_patterns": ["horn_rear"], "parent": "head", "rotation_contract": "horn_rear_up", "visual_views": ["left_side", "front", "front_left_3_4"]},
    {"id": "ears", "role": "STRUCTURAL_DETAIL", "minimum_elements": 2, "maximum_elements": 4, "name_patterns": ["ear_left", "ear_right"], "parent": "head", "visual_views": ["front", "front_left_3_4"]},
    {"id": "feet", "role": "STRUCTURAL_DETAIL", "minimum_elements": 4, "maximum_elements": 4, "name_patterns": ["foot_front_left", "foot_front_right", "foot_rear_left", "foot_rear_right"], "visual_views": ["left_side", "front", "back", "front_left_3_4"]},
    {"id": "tail", "role": "STRUCTURAL_DETAIL", "minimum_elements": 2, "maximum_elements": 2, "name_patterns": ["tail_base", "tail_tip"], "parent": "body", "rotation_contract": "tail_down", "visual_views": ["left_side", "back", "front_left_3_4"]},
]


def update_golden_manifest(value: dict) -> None:
    value["schema_version"] = "3.3"
    value["sample_type"] = "golden_sample"
    value["contract"] = {
        "reference_studio": "3.3",
        "mcp_blockbench_minimum": "1.7.0",
        "workflow": "single_reference_visual_one_session",
    }
    value.setdefault("workflow", {})["promotion_status"] = "promoted_golden_sample"
    lock = value.setdefault("reference_visual_lock", {})
    lock["conditional_required_panels"] = {"ASYMMETRIC": ["right_side"]}
    geometry = value.setdefault("geometry", {})
    geometry["rotation_policy"] = {
        "preferred_axes_per_cube": 1,
        "maximum_axes_per_cube": 1,
        "maximum_absolute_degrees": 45,
        "explicit_origin_required_when_rotating": True,
        "explicit_attachment_contract_required": True,
        "pivot_margin_ratio": 1,
        "capture_affected_view_after_rotated_batch": True,
        "world_space_bounds_required": True,
        "direction_validation_required": True,
        "connection_validation_required_when_declared": True,
        "before_after_visual_score_required": True,
        "automatic_visual_regression_rollback": True,
    }
    geometry["rotation_contracts"] = ROTATION_CONTRACTS
    geometry["part_constraints"] = PART_CONSTRAINTS
    geometry["symmetry_policy"] = "BILATERAL"
    geometry["symmetry_tolerance_units"] = 0.35
    geometry["symmetry_pairs"] = [
        {"id": "ears", "left_patterns": ["ear_left"], "right_patterns": ["ear_right"]},
        {"id": "front_legs", "left_patterns": ["front_left"], "right_patterns": ["front_right"]},
        {"id": "rear_legs", "left_patterns": ["rear_left"], "right_patterns": ["rear_right"]},
    ]
    geometry["asymmetry_contracts"] = []
    texturing = value.setdefault("texturing", {})
    quality = texturing.setdefault("quality_contract", {})
    quality["anti_aliasing_allowed"] = False
    quality["palette_hex"] = list(texturing.get("base_palette", {}).values())
    value["visual_grounding"] = {
        "required": True,
        "geometry_profile": "BEDROCK_CUBOID_GEOMETRY",
        "identity_sync_tool": "rebind_active_project_identity",
        "major_revision_prepare_tool": "prepare_geometry_visual_rebuild",
        "reference_tool": "inspect_reference_visual_preview",
        "feedback_tool": "capture_visual_feedback",
        "diagnosis_tool": "analyze_geometry_views",
        "record_tool": "record_geometry_visual_decision",
        "gate_tool": "verify_geometry_review_ready",
        "review_submission_tool": "submit_geometry_for_review",
        "approval_tool": "complete_geometry_stage",
        "safe_rotation_tool": "rotate_cube_about_attachment",
        "structural_validation_tool": "validate_geometry_contract",
        "revision_scopes": ["LOCAL_REPAIR", "MAJOR_FORM_REVISION"],
        "revision_scopes_are_profiles": False,
        "profile_switch_required_inside_geometry": False,
        "reconnect_required_inside_geometry": False,
        "structural_pass_is_visual_pass": False,
        "multimodal_review_required": True,
        "diagnostic_guard_required": True,
        "fixed_scale_required": True,
        "free_rescale_forbidden": True,
        "maximum_correction_cycles_per_pass": 2,
        "primary_form_views": ["left_side", "front", "top_footprint"],
        "final_views": ["front", "left_side", "back", "top_footprint", "front_left_3_4"],
        "conditional_final_views": {"ASYMMETRIC": ["right_side"]},
        "camera_lock": {"canvas_size": 256, "margin_pixels": 18, "front_axis": "-z"},
        "panels": {
            "left_side": {"crop_normalized": [110 / 1491, 185 / 1055, 590 / 1491, 340 / 1055], "projection": "orthographic", "min_score": 0.74, "scale_basis": "height", "regions": GOLDEN_REGIONS["left_side"]},
            "front": {"crop_normalized": [750 / 1491, 185 / 1055, 270 / 1491, 340 / 1055], "projection": "orthographic", "min_score": 0.74, "scale_basis": "height", "regions": GOLDEN_REGIONS["front"]},
            "back": {"crop_normalized": [1120 / 1491, 185 / 1055, 275 / 1491, 340 / 1055], "projection": "orthographic", "min_score": 0.7, "scale_basis": "height", "regions": GOLDEN_REGIONS["back"]},
            "top_footprint": {"crop_normalized": [30 / 1491, 610 / 1055, 670 / 1491, 290 / 1055], "projection": "orthographic", "min_score": 0.68, "scale_basis": "depth", "regions": GOLDEN_REGIONS["top_footprint"]},
            "front_left_3_4": {"crop_normalized": [820 / 1491, 600 / 1055, 530 / 1491, 350 / 1055], "projection": "perspective", "min_score": 0.62, "scale_basis": "height", "regions": GOLDEN_REGIONS["front_left_3_4"]},
        },
    }
    validation = value.setdefault("validation", {})
    validation["base_required_views"] = ["front", "left_side", "back", "top_footprint", "front_left_3_4"]
    validation["conditional_required_views"] = {"ASYMMETRIC": ["right_side"]}
    validation["required_results"] = [
        "structural_status", "visual_status", "deterministic_visual_status",
        "rotation_status", "evidence_status", "result",
    ]
    value["golden_sample"] = {
        "promotion_status": "PROMOTED",
        "reference_studio_schema": "3.3",
        "visual_profile_source": "manifest_with_builtin_fallback",
        "prebuilt_model_in_reference_package": False,
        "local_mcp_acceptance_status": "PENDING",
    }
    value.setdefault("approval", {})["documentation_revision_date"] = "2026-07-13"


update_json(golden_manifest_path, update_golden_manifest)

# ---------------------------------------------------------------------------
# Golden Sample Markdown synchronization
# ---------------------------------------------------------------------------

production_context = "docs/reference/golden-samples/black_rhinoceros/PRODUCTION_CONTEXT.md"
insert_after(
    production_context,
    "# Black Rhinoceros — PRODUCTION CONTEXT",
    """
**Reference Studio Contract:** `3.3`  
**Sample Type:** `golden_sample`  
**Promotion Status:** `PROMOTED`  
**Local MCP Acceptance:** `PENDING`
""",
    "**Reference Studio Contract:** `3.3`",
)
replace_once(
    production_context,
    "- Documentation Revision Date: `2026-07-12`",
    "- Documentation Revision Date: `2026-07-13`",
)
append_section(
    production_context,
    "## Golden Sample Synchronization Lock",
    """
- The tracked package is a promoted `golden_sample` using manifest schema `3.3`.
- The Reference Visual remains byte-locked to SHA-256 `fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f`.
- The asset is explicitly `BILATERAL`; the five base panels are sufficient. A Right Side panel is required only for future candidates declared `ASYMMETRIC`.
- `reference_manifest.json` now carries the same panel crops, semantic regions, part constraints, rotation contracts, symmetry rules, Texture limits, and Animation limits used by MCP-Blockbench.
- The package contains no prebuilt model. Local zero-start MCP production acceptance remains pending and must create a fresh `.bbmodel` through MCP.
- A future sample must first be produced as `reference_candidate`; repository promotion must preserve the approved candidate files and exact Reference Visual hash.
""",
)

geometry_doc = "docs/reference/golden-samples/black_rhinoceros/GEOMETRY.md"
append_section(
    geometry_doc,
    "## Machine-Readable Enforcement and Review Route",
    """
- Manifest schema: `3.3`.
- Symmetry policy: `BILATERAL`, with executable ear, front-leg, and rear-leg pair contracts. `right_side` is therefore not a required final panel for this sample.
- The manifest contains numeric primary-mass center/size ranges, exact segment-count limits for horns/tail/limbs, parent contracts, and eight rotation contracts.
- Normal correction runs `analyze_geometry_views` without returning the diff image. The final required-view pass writes the canonical diff.
- Review submission uses `submit_geometry_for_review`, which performs fresh structural and visual readiness validation, creates the next unused checkpoint, releases the lease, and enters `GEOMETRY_REVIEW`.
- Revision remains inside `BEDROCK_CUBOID_GEOMETRY` using `LOCAL_REPAIR` or `MAJOR_FORM_REVISION`; no reconnect or removed repair profile is allowed.
""",
)

texture_doc = "docs/reference/golden-samples/black_rhinoceros/TEXTURING.md"
append_section(
    texture_doc,
    "## Deterministic Texture Quality Contract",
    """
The manifest enforces the current Texture quality policy before review:

- anti-aliasing is forbidden;
- partial alpha ratio must remain `0`;
- visible atlas coverage must be at least `0.5%`;
- unique colors must not exceed `96`;
- visible pixels are compared against the approved palette with maximum color distance `72` and maximum outlier ratio `20%`;
- atlas dimensions, UV bounds, PBR absence, and current evidence hashes are mandatory.

`record_stage_review_report` cannot replace these checks; `validate_reference_contract` must pass before `submit_stage_for_review`.
""",
)

animation_doc = "docs/reference/golden-samples/black_rhinoceros/ANIMATION.md"
append_section(
    animation_doc,
    "## Deterministic Animation Quality Contract",
    """
This Golden Sample keeps `ANIMATION_SKIPPED`, so no clip may be inferred or generated. The manifest still records the current reusable quality contract for future animated candidates:

- clip length must remain within `0.05–30` seconds;
- required clips must have animators and keyframes;
- referenced moving/static groups must exist;
- root position motion is forbidden unless the package explicitly authorizes it;
- neutral-pose hierarchy and pivot evidence remain required even when clip production is skipped.
""",
)

validation_doc = "docs/reference/golden-samples/black_rhinoceros/VALIDATION.md"
replace_once(validation_doc, "| Manifest JSON | Parses successfully and uses schema `3.0` |", "| Manifest JSON | Parses successfully and uses schema `3.3` |")
replace_once(
    validation_doc,
    "Use only when all mandatory tests pass with direct evidence. A PASS must include the final `.bbmodel`, texture atlas, five comparison views, hierarchy/pivot report, export/error log, and completed result table.",
    "Use only when all mandatory tests pass with direct evidence. A PASS must include the final `.bbmodel`, texture atlas, all manifest-required comparison views, hierarchy/pivot report, export/error log, and completed result table. This bilateral sample requires the five base views; an asymmetric candidate would additionally require `right_side`.",
)
append_section(
    validation_doc,
    "## 10. Current Runtime Synchronization",
    """
- Reference Studio schema is `3.3`; package type is `golden_sample`.
- Five base Geometry views are required for this bilateral sample. `right_side` is conditional on `symmetry_policy = ASYMMETRIC`.
- Geometry review requires current fixed-scale metrics, semantic-region results, multimodal decision, part/parent/count constraints, symmetry result, rotation audit, and evidence freshness.
- Texture review additionally requires deterministic atlas coverage, alpha, color-budget, palette, UV, and PBR checks.
- Animation review, when enabled by another candidate, requires duration, animator, keyframe, group-reference, and root-motion checks.
- Every normal stage transition and upstream reopen continues in the same Codex and MCP session. A fresh stage lease is required; reconnect is forbidden.
""",
)

handoff_doc = "docs/reference/golden-samples/black_rhinoceros/CODEX_REFERENCE_HANDOFF.md"
insert_after(
    handoff_doc,
    "- Canonical Model: `black_rhinoceros.bbmodel`",
    """
- Manifest Schema: `3.3`
- Sample Type: `golden_sample`
- Promotion Status: `PROMOTED`
- Symmetry Policy: `BILATERAL`
- Local MCP Acceptance: `PENDING`
""",
    "- Manifest Schema: `3.3`",
)
replace_once(
    handoff_doc,
    "→ analyze_geometry_views\n→ edit diagnosed parts\n→ final five-view evidence",
    "→ analyze_geometry_views with return_diff_image=false during correction\n→ edit diagnosed parts\n→ final required-view evidence with write_diff_image=true",
)
replace_once(
    handoff_doc,
    "Current review evidence must include:",
    "Current review evidence must include the five base files below. Add `geometry_right.png` only when a future package declares `ASYMMETRIC`:",
)
replace_once(
    handoff_doc,
    "Final Geometry requires current five-view visual and deterministic PASS, matching fingerprint and Reference Visual hash, structural PASS, and safe rotations.",
    "Final Geometry requires all manifest-required visual and deterministic views to PASS, matching fingerprint/world signature/Reference Visual hash, structural and symmetry PASS, current evidence, and safe rotations.",
)
insert_after(
    handoff_doc,
    "`submit_geometry_for_review` runs current Geometry validation, uses its embedded readiness result, creates the next unused non-approved review checkpoint, and atomically changes state to `GEOMETRY_REVIEW` without reconnecting.",
    "All later stage transitions and any upstream reopen also remain in the same Codex and MCP session. Release the old lease and acquire a fresh target-stage lease; never reconnect for normal recovery.",
    "All later stage transitions and any upstream reopen",
)

# ---------------------------------------------------------------------------
# Regression test and OpenSpec record
# ---------------------------------------------------------------------------

test_path = "mcp-blockbench/tests/reference-studio-golden-sample-sync.test.ts"
write(
    test_path,
    r'''import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { builtInGeometryProfile } from "../src/lib/geometryReferenceProfiles";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;
const GOLDEN_SHA =
  "fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f";

const baseViews = [
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
];

describe("Reference Studio and Golden Sample synchronization", () => {
  test("defines a candidate-first ChatGPT workflow and canonical handoff", () => {
    const skill = read("../engines/chatgpt/skills/blockbench-reference-studio/SKILL.md");
    const handoff = read(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md"
    );
    for (const marker of [
      "reference_candidate",
      "golden_sample",
      "candidate_not_promoted",
      "Reference Studio contract `3.3`",
      "submit_geometry_for_review",
      "final required-view diagnosis",
      "same Codex and MCP session",
    ]) {
      expect(`${skill}\n${handoff}`, marker).toContain(marker);
    }
    expect(skill).not.toContain("record_geometry_visual_result");
    expect(handoff).not.toContain("GEOMETRY_LOCAL_REPAIR");
    expect(handoff).not.toContain("stage-transition reconnect");
  });

  test("keeps the generic manifest template on the executable 3.3 contract", () => {
    const manifest = json(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/reference_manifest.template.json"
    );
    expect(manifest.schema_version).toBe("3.3");
    expect(manifest.sample_type).toBe("<reference_candidate_or_golden_sample>");
    expect(manifest.contract).toMatchObject({
      reference_studio: "3.3",
      mcp_blockbench_minimum: "1.7.0",
      workflow: "single_reference_visual_one_session",
    });
    expect(manifest.geometry.symmetry_policy).toBe("<BILATERAL_or_ASYMMETRIC>");
    expect(manifest.reference_visual_lock.conditional_required_panels.ASYMMETRIC).toEqual([
      "right_side",
    ]);
    expect(manifest.visual_grounding.review_submission_tool).toBe(
      "submit_geometry_for_review"
    );
    expect(manifest.validation.base_required_views).toEqual(baseViews);
    expect(manifest.validation.conditional_required_views.ASYMMETRIC).toEqual([
      "right_side",
    ]);
    expect(manifest.texturing.quality_contract).toMatchObject({
      anti_aliasing_allowed: false,
      maximum_partial_alpha_ratio: 0,
    });
  });

  test("promotes the Black Rhinoceros package to a complete manifest-backed Golden Sample", () => {
    const manifest = json(
      "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"
    );
    expect(manifest.schema_version).toBe("3.3");
    expect(manifest.sample_type).toBe("golden_sample");
    expect(manifest.workflow.promotion_status).toBe("promoted_golden_sample");
    expect(manifest.golden_sample).toMatchObject({
      promotion_status: "PROMOTED",
      prebuilt_model_in_reference_package: false,
      local_mcp_acceptance_status: "PENDING",
    });
    expect(manifest.geometry.symmetry_policy).toBe("BILATERAL");
    expect(Object.keys(manifest.geometry.rotation_contracts)).toHaveLength(8);
    expect(manifest.geometry.part_constraints.length).toBeGreaterThanOrEqual(12);
    expect(manifest.visual_grounding.final_views).toEqual(baseViews);
    expect(manifest.visual_grounding.conditional_final_views.ASYMMETRIC).toEqual([
      "right_side",
    ]);
    for (const view of baseViews) {
      const panel = manifest.visual_grounding.panels[view];
      expect(panel, view).toBeDefined();
      expect(panel.crop_normalized[2], view).toBeGreaterThan(0);
      expect(panel.crop_normalized[3], view).toBeGreaterThan(0);
      expect(panel.regions.length, view).toBeGreaterThan(0);
    }
    expect(manifest.texturing.quality_contract.palette_hex.length).toBeGreaterThan(0);
    expect(manifest.validation.base_required_views).toEqual(baseViews);
  });

  test("matches the manifest visual profile to the runtime Golden Sample fallback", () => {
    const manifest = json(
      "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"
    );
    const fallback = builtInGeometryProfile(GOLDEN_SHA);
    expect(fallback).not.toBeNull();
    for (const view of baseViews) {
      const actual = manifest.visual_grounding.panels[view];
      const expected = fallback!.panels[view];
      expect(actual.projection).toBe(expected!.projection);
      expect(actual.min_score).toBe(expected!.minimum_score);
      expect(actual.scale_basis).toBe(expected!.scale_basis);
      actual.crop_normalized.forEach((value: number, index: number) =>
        expect(value).toBeCloseTo(expected!.crop_normalized[index], 10)
      );
      expect(actual.regions.map((region: any) => region.id)).toEqual(
        expected!.regions.map((region) => region.id)
      );
    }
    expect(Object.keys(manifest.geometry.rotation_contracts).sort()).toEqual(
      Object.keys(fallback!.rotation_contracts).sort()
    );
    expect(manifest.geometry.part_constraints.map((part: any) => part.id)).toEqual(
      fallback!.part_constraints.map((part) => part.id)
    );
  });

  test("removes the final stale reconnect instruction from production skills", () => {
    const validation = read("../engines/shared/skills/blockbench-validation/SKILL.md");
    const production = read("../engines/shared/skills/blockbench-production/SKILL.md");
    const geometry = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    expect(validation).not.toContain("requires one canonical stage-transition reconnect");
    expect(validation).toContain("continues in the same Codex and MCP session");
    expect(production).toContain("all manifest-required views");
    expect(geometry).toContain("final required-view capture/analyze");
  });
});
''',
)

tasks_path = "openspec/changes/codex-local-workflow-rework/tasks.md"
tasks = read(tasks_path)
anchor = "- [x] Require conditional Right Side visual evidence for explicitly asymmetric assets and cover multiple positive archetypes."
addition = anchor + "\n- [x] Synchronize the ChatGPT Reference Studio candidate flow, schema 3.3 templates, and the complete manifest-backed Black Rhinoceros Golden Sample."
if "complete manifest-backed Black Rhinoceros Golden Sample" not in tasks:
    if anchor not in tasks:
        raise RuntimeError("OpenSpec task insertion anchor missing")
    write(tasks_path, tasks.replace(anchor, addition, 1))

print("Reference Studio and Golden Sample synchronization patch applied.")

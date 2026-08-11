# Bedrock Entity Capability Surface Matrix

Updated: 2026-08-10

## Purpose

This matrix connects the official Blockbench Bedrock Entity capability audit to the current BlockIT MCP product surface. It is a deletion guardrail: **a missing or partial MCP mapping is a capability gap to investigate, not evidence that the native Bedrock capability may be removed.**

Primary evidence owners:

- `docs/knowledge/reviews/bedrock-entity-capability-surface-audit.md`
- official Blockbench Bedrock format: `js/formats/bedrock/bedrock.js`
- official Blockbench Bedrock animation format: `js/formats/bedrock/bedrock_animation.js`
- current registration truth: `mcp/lib/registrationProfile.ts`
- current tool/resource/prompt definitions under `mcp/server/`

## Matrix

| Bedrock Entity capability | Current BlockIT mapping | Surface status | Guardrail / next audit |
|---|---|---|---|
| Project format/orientation | `create_project`, `get_project_info` | **Mapped / narrowed** | `create_project` accepts the native `bedrock` Entity format only; arbitrary Blockbench format creation is outside the product tool. |
| Cube/Cuboid geometry | `place_cube`, `modify_cube`, `modify_cubes_batch`, `inspect_element`, `list_outline`, targeted find/filter tools | **Strong mapping** | Keep explicit geometry + UUID-first mutation ownership. |
| Group hierarchy / bones | `add_group`, `bone_rigging`, `list_outline`, `inspect_element` | **Strong mapping** | Groups are Bedrock bones/organization; preserve pivot and parent semantics. |
| Cube face UV / box UV / UV rotation | Cube face/UV fields in Cube tools | **Partial mapping** | Audit native `box_uv`, face UV rotation, mirror/offset semantics explicitly before any further UV reduction. Generic Mesh UV and generic per-face `Texture.apply()` remain outside the Bedrock Entity product path. |
| Texture creation/activation/read | `create_texture`, `activate_texture`, `list_textures`, `get_texture`, `textures://{id}` | **Mapped / narrowed** | Bedrock Entity is native `single_texture`; active/default texture selection is retained while generic per-face `apply_texture` is disabled. Paint, PBR, and `material_instance` retain their separate authored-state owners. |
| Paint | Paint family | **Mapped, runtime-heavy** | Native Painter integration remains Bedrock-relevant; local Blockbench proof still required. |
| PBR / TextureGroup material workflows | texture/PBR family | **Mapped** | Preserve native Bedrock PBR support; audit individual generic file-path operations separately. |
| Per-face `material_instance` | `get_face_material_instances`, `set_face_material_instance`, `list_material_instances`, bulk set/clear | **Mapped** | Official Bedrock geometry codec preserves this field; do not remove as a Bedrock Block-only assumption. |
| Animation / BoneAnimator transforms | `create_animation`, `manage_keyframes`, graph/batch/copy tools, `inspect_animation` | **Mapped** | `create_animation` is explicitly bound to Bedrock AnimationCodec. |
| Particle animation effects | `create_animation.particle_effects`, `inspect_animation.effects` | **Mapped** | Preserve locator reference strings used by particle effects. |
| Sound animation effects | No dedicated current mapping confirmed | **MCP GAP — protected** | Audit official EffectAnimator/Bedrock animation codec before adding or consolidating. Do not delete native sound capability. |
| Timeline animation effects | No dedicated current mapping confirmed | **MCP GAP — protected** | Audit official EffectAnimator timeline channel before making animation family completeness claims. |
| Animation controllers | No dedicated authoring/inspection mapping confirmed | **MCP GAP — protected** | Native Bedrock format enables animation controllers; must remain a protected capability target. |
| Locators | `list_locator_elements`, `manage_locator`, `inspect_element`, plus existing `rename_element` / `remove_element` | **Mapped / local proof required** | Native Locator position, rotation, parent Group, and `ignore_inherited_scale` now have direct authored-state coverage. Keep exact identity and Group-parent preflight; runtime preview/export round-trip remains local proof. |
| Null Objects in Bedrock workflow | `list_locator_elements`, `manage_null_object`, `inspect_element`, plus existing `rename_element` / `remove_element` | **Mapped base state / IK mutation deferred** | Blockbench serializes Null Objects through `_null_` locator entries in Bedrock geometry. Base parent/position authoring is mapped; `ik_target`, `ik_source`, and `lock_ik_target_rotation` are inspected but intentionally not mutated in this minimum slice because they are Blockbench editor/animation state rather than Bedrock locator geometry fields. |
| TextureMesh | No current direct authoring/inspection mapping | **MCP GAP — protected** | Distinct from generic Blockbench `Mesh`; native Bedrock codec support must not be confused with removed generic Mesh family. |
| Native Bedrock bounding-box fields | `inspect_model_bounds` provides rendered Cube observation, not native bounding-box authoring | **Partial / semantic distinction** | Do not claim `inspect_model_bounds` covers Bedrock bounding-box capability; audit format fields separately. |
| Animated textures | Texture metadata exposes frame information; dedicated authoring mapping not confirmed | **Partial / protected** | Native Bedrock format enables animated textures. Audit before surface reduction. |
| Bone binding expression | No dedicated current mapping confirmed | **MCP GAP — protected** | Native Bedrock format enables bone binding expressions; preserve as audit target. |
| Bedrock model/project export | `list_export_formats`, `export_model` | **Mapped / narrowed** | Generic model-codec exposure is limited to native `bedrock` geometry JSON and editable `project` `.bbmodel`. Native Bedrock animation/controller output remains separately protected under AnimationCodec. |
| Undo / redo / checkpoints | history family | **Mapped** | Keep recoverability for bounded mutations. |
| Validator evidence | validator status/check/warning/error resources | **Mapped support evidence** | Text-to-element references are heuristic unless backed by direct object identity; do not present inferred links as authoritative. |
| Canonical visual observation | `capture_model_views`, `capture_screenshot`, `inspect_model_bounds` | **Mapped BlockIT workflow support** | Product evidence helpers, not proof of resemblance by themselves. Generic full-app capture and arbitrary active-camera mutation are default-disabled. |
| Generic `nodes://{id}` observation | `Project.nodes_3d` resource | **Transitional / deferred** | Locator authored-state now has a direct owner, but broad runtime-node observation remains until TextureMesh authored-state inspection also closes its protected gap; do not remove it first. |
| Reference Models plugin integration | conditional `reference_models://{id}` | **Optional external integration** | Not a native Bedrock capability and must not affect baseline capability counts. |

## Surface semantics

- **Exposed** — currently registered through MCP and callable by a client.
- **Disabled** — definition may exist in the loaded source profile but is not callable through MCP or the BlockIT panel test path.
- **Available resource** — resource actually registered for the current Blockbench runtime; conditional integrations may change this count.
- **Catalog** — known metadata/definitions in the loaded plugin; catalog count is not an MCP exposure count.
- **MCP GAP — protected** — official native Bedrock capability whose current MCP authoring/inspection mapping is incomplete or unproven. It must not be removed from the product boundary.

## Immediate follow-up

Locator authored-state coverage is now implemented directly inside the existing Elements family without adding a new registration family or generic element framework. Null Object base state is covered separately from its editor/animation IK metadata. `nodes://` remains transitional because TextureMesh is still a protected direct-inspection gap. The next native structural capability slice should audit TextureMesh against official Blockbench Bedrock source before changing that resource or reintroducing any generic Mesh behavior.

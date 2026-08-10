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
| Cube face UV / box UV / UV rotation | Cube face/UV fields in Cube tools + texture application | **Partial mapping** | Audit native `box_uv`, face UV rotation, mirror/offset semantics explicitly before any further UV reduction. Generic Mesh UV remains outside product scope. |
| Texture creation/application/read | `create_texture`, `apply_texture`, `list_textures`, `get_texture`, `textures://{id}` | **Mapped** | Keep identity-strict texture targeting. |
| Paint | Paint family | **Mapped, runtime-heavy** | Native Painter integration remains Bedrock-relevant; local Blockbench proof still required. |
| PBR / TextureGroup material workflows | texture/PBR family | **Mapped** | Preserve native Bedrock PBR support; audit individual generic file-path operations separately. |
| Per-face `material_instance` | `get_face_material_instances`, `set_face_material_instance`, `list_material_instances`, bulk set/clear | **Mapped** | Official Bedrock geometry codec preserves this field; do not remove as a Bedrock Block-only assumption. |
| Animation / BoneAnimator transforms | `create_animation`, `manage_keyframes`, graph/batch/copy tools, `inspect_animation` | **Mapped** | `create_animation` is explicitly bound to Bedrock AnimationCodec. |
| Particle animation effects | `create_animation.particle_effects`, `inspect_animation.effects` | **Mapped** | Preserve locator reference strings used by particle effects. |
| Sound animation effects | No dedicated current mapping confirmed | **MCP GAP — protected** | Audit official EffectAnimator/Bedrock animation codec before adding or consolidating. Do not delete native sound capability. |
| Timeline animation effects | No dedicated current mapping confirmed | **MCP GAP — protected** | Audit official EffectAnimator timeline channel before making animation family completeness claims. |
| Animation controllers | No dedicated authoring/inspection mapping confirmed | **MCP GAP — protected** | Native Bedrock format enables animation controllers; must remain a protected capability target. |
| Locators / NullObject locators | Particle effect schema can reference locator names, but direct locator authoring/inspection is not mapped | **MCP GAP — protected** | Native Bedrock codec parses/serializes locators. Add/inspect mapping only after official-source contract audit. |
| TextureMesh | No current direct authoring/inspection mapping | **MCP GAP — protected** | Distinct from generic Blockbench `Mesh`; native Bedrock codec support must not be confused with removed generic Mesh family. |
| Native Bedrock bounding-box fields | `inspect_model_bounds` provides rendered Cube observation, not native bounding-box authoring | **Partial / semantic distinction** | Do not claim `inspect_model_bounds` covers Bedrock bounding-box capability; audit format fields separately. |
| Animated textures | Texture metadata exposes frame information; dedicated authoring mapping not confirmed | **Partial / protected** | Native Bedrock format enables animated textures. Audit before surface reduction. |
| Bone binding expression | No dedicated current mapping confirmed | **MCP GAP — protected** | Native Bedrock format enables bone binding expressions; preserve as audit target. |
| Bedrock model/project export | `list_export_formats`, `export_model` | **Mapped / narrowed** | Generic model-codec exposure is limited to native `bedrock` geometry JSON and editable `project` `.bbmodel`. Native Bedrock animation/controller output remains separately protected under AnimationCodec. |
| Undo / redo / checkpoints | history family | **Mapped** | Keep recoverability for bounded mutations. |
| Validator evidence | validator status/check/warning/error resources | **Mapped support evidence** | Text-to-element references are heuristic unless backed by direct object identity; do not present inferred links as authoritative. |
| Canonical visual observation | `capture_model_views`, `capture_screenshot`, `inspect_model_bounds` | **Mapped BlockIT workflow support** | Product evidence helpers, not proof of resemblance by themselves. Generic full-app capture and arbitrary active-camera mutation are default-disabled. |
| Generic `nodes://{id}` observation | `Project.nodes_3d` resource | **Transitional / deferred** | Broad runtime-node observation is retained until explicit Locator/TextureMesh authored-state inspection closes those protected gaps; do not remove it first. |
| Reference Models plugin integration | conditional `reference_models://{id}` | **Optional external integration** | Not a native Bedrock capability and must not affect baseline capability counts. |

## Surface semantics

- **Exposed** — currently registered through MCP and callable by a client.
- **Disabled** — definition may exist in the loaded source profile but is not callable through MCP or the BlockIT panel test path.
- **Available resource** — resource actually registered for the current Blockbench runtime; conditional integrations may change this count.
- **Catalog** — known metadata/definitions in the loaded plugin; catalog count is not an MCP exposure count.
- **MCP GAP — protected** — official native Bedrock capability whose current MCP authoring/inspection mapping is incomplete or unproven. It must not be removed from the product boundary.

## Immediate follow-up

Project creation, model-codec breadth, generic camera/app helpers, and validator inference labeling were reviewed in `mcp-prelocal-generic-semantics-audit-2026-08-10.md`. The canonical MCP prompt is now `bedrock_entity_workflow`, and the repository-owned skill routing is documented in `blockit-agent-skill-surface-2026-08-10.md`. Next capability work should design direct authored-state coverage for protected native gaps before replacing broad transitional resources. Do not start deletion from tool names alone; trace every proposed reduction through official Blockbench Bedrock source first.

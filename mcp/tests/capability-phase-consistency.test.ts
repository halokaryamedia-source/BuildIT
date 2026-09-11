import { describe, expect, test } from "bun:test";
import { classifyMcpToolPhaseByName } from "@/lib/authoringPhase";
import { getCapabilityMetadata } from "@/lib/capabilityMetadata";

const EXPECTED_PHASES = {
  create_project: "core",
  get_project_info: "core",
  inspect_elements: "core",
  export_model: "core",
  manage_cubes: "geometry",
  add_group: "geometry",
  modify_group: "geometry",
  reparent_element: "geometry",
  remove_element: "geometry",
  rename_element: "geometry",
  manage_locator: "geometry",
  manage_null_object: "geometry",
  bone_rigging: "geometry",
  create_texture: "texturing",
  list_textures: "core",
  get_texture: "core",
  activate_texture: "texturing",
  apply_texture: "texturing",
  paint_texture_transaction: "texturing",
  manage_material: "texturing",
  manage_material_instances: "texturing",
  manage_render_profile: "texturing",
  create_animation: "animation",
  inspect_animation: "animation",
  manage_animation_timeline: "animation",
  manage_animation_effects: "animation",
  manage_animation_controller: "animation",
  inspect_particle: "animation",
  manage_particle: "animation",
  switch_authoring_phase: "core",
} as const;

describe("capability metadata / phase consistency", () => {
  for (const [capability, phase] of Object.entries(EXPECTED_PHASES)) {
    test(`${capability} remains routable in ${phase}`, () => {
      expect(classifyMcpToolPhaseByName(capability)).toBe(phase);
      expect(getCapabilityMetadata(capability).tier).not.toBe("maintenance");
    });
  }
});

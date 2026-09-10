import type { NavigatorContextHandle, NavigatorOwner } from "./types";

const ROUTER: NavigatorContextHandle = {
  id: "ctx:skill/blockit-bedrock-entity-mcp@6e1bf9f67e320",
  path: ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
  sha256: "6e1bf9f67e3206c89b26ef2ca502592b3b2dcebb036a35e7efedfbe13675d07d",
};
const MODELLING: NavigatorContextHandle = {
  id: "ctx:skill/blockbench-bedrock-modelling@e70024b08c15",
  path: ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
  sha256: "e70024b08c15fc2ff47c393d92bd344ab2341070b222300bd71376d3a741017a",
};
const TEXTURING: NavigatorContextHandle = {
  id: "ctx:skill/blockit-bedrock-texturing@5d1e8ff498bc",
  path: ".agents/skills/blockit-bedrock-texturing/SKILL.md",
  sha256: "5d1e8ff498bc89c500a6e6da88b2baee12ee59c26807f18a62b628760dd8c0c8",
};
const ANIMATION: NavigatorContextHandle = {
  id: "ctx:skill/blockit-bedrock-animation@cc23c4c26b5e",
  path: ".agents/skills/blockit-bedrock-animation/SKILL.md",
  sha256: "cc23c4c26b5eb8825aecb509c982ce5ad4ffd9ee9a0540a2404683c5fa9f26fa",
};
const WORKFLOW: NavigatorContextHandle = {
  id: "ctx:prompt/bedrock-entity-workflow@e260b0f73081",
  path: "mcp/prompts/bedrock_entity_workflow.md",
  sha256: "e260b0f730811784c4e2e08df7a0e5757ccb2970221661b7f472ced009a73a66",
};

export const NAVIGATOR_CONTEXT_HANDLES = { router: ROUTER, modelling: MODELLING, texturing: TEXTURING, animation: ANIMATION, workflow: WORKFLOW } as const;

export function contextForOwner(owner: NavigatorOwner | null) {
  const required = [ROUTER];
  if (owner === "GEOMETRY") required.push(MODELLING);
  else if (owner === "TEXTURING") required.push(TEXTURING);
  else if (owner === "ANIMATION") required.push(ANIMATION);
  return { required, optional: [WORKFLOW] };
}

const GEOMETRY_CAPABILITIES = new Set(["manage_cubes","add_group","modify_group","reparent_element","remove_element","rename_element","manage_locator","manage_null_object","bone_rigging","inspect_model_bounds"]);
const TEXTURING_CAPABILITIES = new Set(["create_texture","list_textures","get_texture","activate_texture","paint_fill_tool","draw_shape_tool","paint_with_brush","eraser_tool","paint_texture_transaction","manage_material","manage_material_instances","manage_render_profile"]);
const ANIMATION_CAPABILITIES = new Set(["create_animation","inspect_animation","manage_animation_timeline","manage_animation_effects","manage_animation_controller"]);

export function ownerForCapability(capability: string): NavigatorOwner {
  if (GEOMETRY_CAPABILITIES.has(capability)) return "GEOMETRY";
  if (TEXTURING_CAPABILITIES.has(capability)) return "TEXTURING";
  if (ANIMATION_CAPABILITIES.has(capability)) return "ANIMATION";
  return "CORE";
}

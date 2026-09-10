import type {
  NavigatorAuthoringDomain,
  NavigatorContextHandle,
  NavigatorSourceOwner,
} from "./types";

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

export const NAVIGATOR_CONTEXT_HANDLES = {
  router: ROUTER,
  modelling: MODELLING,
  texturing: TEXTURING,
  animation: ANIMATION,
  workflow: WORKFLOW,
} as const;

export function contextForAuthoringDomain(domain: NavigatorAuthoringDomain | null) {
  const required = [ROUTER];
  if (domain === "GEOMETRY") required.push(MODELLING);
  else if (domain === "TEXTURING") required.push(TEXTURING);
  else if (domain === "ANIMATION") required.push(ANIMATION);
  return { required, optional: [WORKFLOW] };
}

const GEOMETRY_CAPABILITIES = new Set([
  "manage_cubes",
  "add_group",
  "modify_group",
  "reparent_element",
  "remove_element",
  "rename_element",
  "manage_locator",
  "manage_null_object",
  "bone_rigging",
  "inspect_model_bounds",
]);
const TEXTURING_CAPABILITIES = new Set([
  "create_texture",
  "list_textures",
  "get_texture",
  "activate_texture",
  "paint_fill_tool",
  "draw_shape_tool",
  "paint_with_brush",
  "eraser_tool",
  "paint_texture_transaction",
  "manage_material",
  "manage_material_instances",
  "manage_render_profile",
]);
const ANIMATION_CAPABILITIES = new Set([
  "create_animation",
  "inspect_animation",
  "manage_animation_timeline",
  "manage_animation_effects",
  "manage_animation_controller",
]);

export function authoringDomainForCapability(capability: string): NavigatorAuthoringDomain {
  if (GEOMETRY_CAPABILITIES.has(capability)) return "GEOMETRY";
  if (TEXTURING_CAPABILITIES.has(capability)) return "TEXTURING";
  if (ANIMATION_CAPABILITIES.has(capability)) return "ANIMATION";
  return "CORE";
}

const SOURCE_BY_CAPABILITY: Record<string, NavigatorSourceOwner> = {
  manage_cubes: {
    source: "mcp/server/tools/cubes.ts",
    specialist: MODELLING.path,
    test_owner: "mcp/tests/model-effectiveness-correction-accuracy.test.ts",
  },
  add_group: {
    source: "mcp/server/tools/element.ts",
    specialist: MODELLING.path,
    test_owner: "mcp/tests/p1-core-ownership.test.ts",
  },
  modify_group: {
    source: "mcp/server/tools/element.ts",
    specialist: MODELLING.path,
    test_owner: "mcp/tests/model-effectiveness-correction-accuracy.test.ts",
  },
  bone_rigging: {
    source: "mcp/server/tools/animation.ts",
    specialist: MODELLING.path,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  capture_model_views: {
    source: "mcp/server/tools/camera.ts",
    specialist: MODELLING.path,
    test_owner: "mcp/tests/camera-framing-contract.test.ts",
  },
  create_texture: {
    source: "mcp/server/tools/texture.ts",
    specialist: TEXTURING.path,
    test_owner: "mcp/tests/authoring/asset-authoring-usage-slimming.test.ts",
  },
  paint_with_brush: {
    source: "mcp/server/tools/paint.ts",
    specialist: TEXTURING.path,
    test_owner: "mcp/tests/paint-stroke.test.ts",
  },
  paint_texture_transaction: {
    source: "mcp/server/tools/prelocal-wiring.ts",
    specialist: TEXTURING.path,
    test_owner: "mcp/tests/prelocal-wiring-policy.test.ts",
  },
  manage_material: {
    source: "mcp/server/tools.ts",
    specialist: TEXTURING.path,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  manage_material_instances: {
    source: "mcp/server/tools/material-instances.ts",
    specialist: TEXTURING.path,
    test_owner: "mcp/tests/material-instance-mutation-result.test.ts",
  },
  create_animation: {
    source: "mcp/server/tools/animation.ts",
    specialist: ANIMATION.path,
    test_owner: "mcp/tests/create-animation-contract.test.ts",
  },
  inspect_animation: {
    source: "mcp/server/tools/animation-inspection.ts",
    specialist: ANIMATION.path,
    test_owner: "mcp/tests/animation-native-intelligence.test.ts",
  },
  manage_animation_timeline: {
    source: "mcp/server/tools.ts",
    specialist: ANIMATION.path,
    test_owner: "mcp/tests/animation-timeline-batch-ownership.test.ts",
  },
  manage_animation_effects: {
    source: "mcp/server/tools/animation-effects.ts",
    specialist: ANIMATION.path,
    test_owner: "mcp/tests/animation-effect-mutation-contract.test.ts",
  },
  manage_animation_controller: {
    source: "mcp/server/tools/animation-controller.ts",
    specialist: ANIMATION.path,
    test_owner: "mcp/tests/animation-controller-mutation-contract.test.ts",
  },
  switch_authoring_phase: {
    source: "mcp/server/tools.ts",
    specialist: ROUTER.path,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  get_project_info: {
    source: "mcp/server/tools/project.ts",
    specialist: ROUTER.path,
    test_owner: "mcp/tests/p1-core-ownership.test.ts",
  },
};

const DEFAULT_SOURCE_BY_DOMAIN: Record<NavigatorAuthoringDomain, NavigatorSourceOwner> = {
  GEOMETRY: {
    source: "mcp/server/tools.ts",
    specialist: MODELLING.path,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  TEXTURING: {
    source: "mcp/server/tools.ts",
    specialist: TEXTURING.path,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  ANIMATION: {
    source: "mcp/server/tools/animation.ts",
    specialist: ANIMATION.path,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  CORE: {
    source: "mcp/server/tools.ts",
    specialist: ROUTER.path,
    test_owner: "mcp/tests/gateway-contract.test.ts",
  },
};

export function sourceOwnerForCapability(capability: string): NavigatorSourceOwner {
  return SOURCE_BY_CAPABILITY[capability] ?? DEFAULT_SOURCE_BY_DOMAIN[authoringDomainForCapability(capability)];
}

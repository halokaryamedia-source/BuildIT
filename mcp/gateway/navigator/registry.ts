import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import type {
  NavigatorAuthoringDomain,
  NavigatorContextHandle,
  NavigatorSourceOwner,
} from "./types";
import type { ControlProfile } from "./referencePackage";

const MODELLING_PATH = ".agents/skills/blockbench-bedrock-modelling/SKILL.md";
const TEXTURING_PATH = ".agents/skills/blockit-bedrock-texturing/SKILL.md";
const ANIMATION_PATH = ".agents/skills/blockit-bedrock-animation/SKILL.md";

const PROFILE_PATHS: Record<ControlProfile, string> = {
  PROP_FURNITURE: "docs/03-authoring/modelling/profiles/prop-furniture.md",
  VEHICLE: "docs/03-authoring/modelling/profiles/vehicle.md",
  HUMANOID: "docs/03-authoring/modelling/profiles/humanoid.md",
  CREATURE: "docs/03-authoring/modelling/profiles/creature.md",
  MECHANICAL: "docs/03-authoring/modelling/profiles/mechanical.md",
  PLANT_FOLIAGE: "docs/03-authoring/modelling/profiles/plant-foliage.md",
  GENERIC: "docs/03-authoring/modelling/profiles/generic.md",
};

type CachedHandle = {
  signature: string;
  handle: NavigatorContextHandle;
};

const contextHandleCache = new Map<string, CachedHandle>();

function contextLabel(path: string): string {
  if (path === MODELLING_PATH) return "skill/modelling";
  if (path === TEXTURING_PATH) return "skill/texturing";
  if (path === ANIMATION_PATH) return "skill/animation";
  const profile = Object.entries(PROFILE_PATHS).find(([, candidate]) => candidate === path)?.[0];
  return profile ? `profile/${profile.toLowerCase().replaceAll("_", "-")}` : "doc/context";
}

function repoFile(path: string): URL {
  return new URL(`../../../${path}`, import.meta.url);
}

async function contentHandle(path: string): Promise<NavigatorContextHandle> {
  const file = repoFile(path);
  const info = await stat(file);
  const signature = `${info.size}:${info.mtimeMs}`;
  const cached = contextHandleCache.get(path);
  if (cached?.signature === signature) return cached.handle;
  const bytes = await readFile(file);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const handle: NavigatorContextHandle = {
    id: `ctx:${contextLabel(path)}@${sha256.slice(0, 12)}`,
    path,
    sha256,
  };
  contextHandleCache.set(path, { signature, handle });
  return handle;
}

export async function contextForAuthoringDomain(
  domain: NavigatorAuthoringDomain | null,
  selectedProfile: ControlProfile | null = null
): Promise<{ required: NavigatorContextHandle[]; optional: NavigatorContextHandle[] }> {
  const required: NavigatorContextHandle[] = [];
  if (domain === "GEOMETRY") {
    required.push(await contentHandle(MODELLING_PATH));
    if (selectedProfile) required.push(await contentHandle(PROFILE_PATHS[selectedProfile]));
  } else if (domain === "TEXTURING") {
    required.push(await contentHandle(TEXTURING_PATH));
  } else if (domain === "ANIMATION") {
    required.push(await contentHandle(ANIMATION_PATH));
  }
  return { required, optional: [] };
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
    specialist: MODELLING_PATH,
    test_owner: "mcp/tests/model-effectiveness-correction-accuracy.test.ts",
  },
  add_group: {
    source: "mcp/server/tools/element.ts",
    specialist: MODELLING_PATH,
    test_owner: "mcp/tests/p1-core-ownership.test.ts",
  },
  modify_group: {
    source: "mcp/server/tools/element.ts",
    specialist: MODELLING_PATH,
    test_owner: "mcp/tests/model-effectiveness-correction-accuracy.test.ts",
  },
  bone_rigging: {
    source: "mcp/server/tools/animation.ts",
    specialist: MODELLING_PATH,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  capture_model_views: {
    source: "mcp/server/tools/camera.ts",
    specialist: MODELLING_PATH,
    test_owner: "mcp/tests/camera-framing-contract.test.ts",
  },
  create_texture: {
    source: "mcp/server/tools/texture.ts",
    specialist: TEXTURING_PATH,
    test_owner: "mcp/tests/authoring/asset-authoring-usage-slimming.test.ts",
  },
  paint_with_brush: {
    source: "mcp/server/tools/paint.ts",
    specialist: TEXTURING_PATH,
    test_owner: "mcp/tests/paint-stroke.test.ts",
  },
  paint_texture_transaction: {
    source: "mcp/server/tools/prelocal-wiring.ts",
    specialist: TEXTURING_PATH,
    test_owner: "mcp/tests/prelocal-wiring-policy.test.ts",
  },
  manage_material: {
    source: "mcp/server/tools.ts",
    specialist: TEXTURING_PATH,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  manage_material_instances: {
    source: "mcp/server/tools/material-instances.ts",
    specialist: TEXTURING_PATH,
    test_owner: "mcp/tests/material-instance-mutation-result.test.ts",
  },
  create_animation: {
    source: "mcp/server/tools/animation.ts",
    specialist: ANIMATION_PATH,
    test_owner: "mcp/tests/create-animation-contract.test.ts",
  },
  inspect_animation: {
    source: "mcp/server/tools/animation-inspection.ts",
    specialist: ANIMATION_PATH,
    test_owner: "mcp/tests/animation-native-intelligence.test.ts",
  },
  manage_animation_timeline: {
    source: "mcp/server/tools.ts",
    specialist: ANIMATION_PATH,
    test_owner: "mcp/tests/animation-timeline-batch-ownership.test.ts",
  },
  manage_animation_effects: {
    source: "mcp/server/tools/animation-effects.ts",
    specialist: ANIMATION_PATH,
    test_owner: "mcp/tests/animation-effect-mutation-contract.test.ts",
  },
  manage_animation_controller: {
    source: "mcp/server/tools/animation-controller.ts",
    specialist: ANIMATION_PATH,
    test_owner: "mcp/tests/animation-controller-mutation-contract.test.ts",
  },
  switch_authoring_phase: {
    source: "mcp/server/tools.ts",
    specialist: null,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  get_project_info: {
    source: "mcp/server/tools/project.ts",
    specialist: null,
    test_owner: "mcp/tests/p1-core-ownership.test.ts",
  },
};

const DEFAULT_SOURCE_BY_DOMAIN: Record<NavigatorAuthoringDomain, NavigatorSourceOwner> = {
  GEOMETRY: {
    source: "mcp/server/tools.ts",
    specialist: MODELLING_PATH,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  TEXTURING: {
    source: "mcp/server/tools.ts",
    specialist: TEXTURING_PATH,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  ANIMATION: {
    source: "mcp/server/tools/animation.ts",
    specialist: ANIMATION_PATH,
    test_owner: "mcp/tests/authoring-phase-surface.test.ts",
  },
  CORE: {
    source: "mcp/server/tools.ts",
    specialist: null,
    test_owner: "mcp/tests/gateway-contract.test.ts",
  },
};

export function sourceOwnerForCapability(capability: string): NavigatorSourceOwner {
  return SOURCE_BY_CAPABILITY[capability] ?? DEFAULT_SOURCE_BY_DOMAIN[authoringDomainForCapability(capability)];
}

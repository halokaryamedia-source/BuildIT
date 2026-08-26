import { z } from "zod";

const normalizedPosition = z
  .tuple([
    z.number().min(0).max(1),
    z.number().min(0).max(1),
    z.number().min(0).max(1),
  ])
  .describe("Normalized model-space position [x,y,z].");

const primaryMass = z.object({
  role: z
    .string()
    .regex(/^(mass|chain|bilateral|attachment|repeated|locator)_[a-z0-9_]+$/, "Use a generic geometry role namespace; keep anatomy in semantic metadata."),
  type: z.enum(["axis_aligned", "rotated", "unresolved"]),
  parent_role: z.string().min(1),
  required: z.boolean().default(true),
});

const roleList = z.array(primaryMass);
const genericRoleId = z.string().regex(/^(mass|chain|bilateral|attachment|repeated|locator)_[a-z0-9_]+$/);
const silhouetteAnchor = z.object({
  role: genericRoleId,
  view: z.string().min(1),
  kind: z.enum(["top", "bottom", "front", "back", "left", "right", "attachment"]),
  point_normalized: normalizedPosition,
  confidence: z.enum(["supported", "provisional"]),
}).strict();

const evidenceMap = z.object({
  approved_views: z.array(z.string().min(1)).min(1),
  silhouette_anchors: z.array(silhouetteAnchor).min(3),
  primary_mass_roles: z.array(genericRoleId).min(1),
  chain_roles: z.array(genericRoleId),
  bilateral_roles: z.array(genericRoleId),
  rotated_attachment_roles: z.array(genericRoleId),
  repeated_detail_roles: z.array(genericRoleId),
  locator_roles: z.array(genericRoleId),
  unsupported_dimensions: z.array(z.string().min(1)),
  first_build_ready: z.literal(true),
}).strict();

const landmark = z.object({
  role: z.string().min(1),
  position_normalized: normalizedPosition,
  source_views: z.array(z.string().min(1)).min(1),
  confidence: z.enum(["supported", "provisional"]),
});

const proportionTarget = z.object({
  role: z.string().min(1),
  min_normalized: normalizedPosition,
  max_normalized: normalizedPosition,
  source_views: z.array(z.string().min(1)).min(1),
  confidence: z.enum(["supported", "provisional"]),
});

const attachment = z.object({
  child_role: z.string().min(1),
  parent_role: z.string().min(1),
  landmark: z.string().min(1),
  invariant: z.string().min(1),
});

const rotationPart = z.object({
  role: z.string().min(1),
  attachment_landmark: z.string().min(1),
  endpoint_landmark: z.string().min(1),
  source_views: z.array(z.string().min(1)).min(1),
  rotation_owner: z.enum(["group", "cube"]),
  pivot_landmark: z.string().min(1),
  rotation_axis: z.enum(["x", "y", "z"]),
  rotation_sign: z.enum(["positive", "negative", "toward_front", "away_from_front"]),
  confidence: z.enum(["supported", "provisional"]),
});

const constructionStrategy = z.object({
  role: z.string().min(1),
  strategy: z.enum(["solid_mass", "bilateral_pair", "segmented_chain", "tapered_chain", "rotated_attachment", "repeated_detail", "locator_only"]),
  counterpart_role: z.string().min(1).optional(),
  segment_index: z.number().int().nonnegative().optional().describe("Required for segmented_chain and tapered_chain; omit for non-chain strategies."),
  repeat_count: z.number().int().min(2).max(64).optional().describe("Required for repeated_detail; generated element count, maximum 64."),
  repeat_axis: z.enum(["x", "y", "z"]).optional().describe("Required for repeated_detail; axis for generated copies."),
  repeat_step: z.number().positive().finite().optional().describe("Required for repeated_detail; spacing on the 0.5-unit grid."),
});

export const prepareGeometryPlanParameters = z
  .object({
    plan_version: z.literal("reference_grounded_v1"),
    role_namespace: z.literal("generic"),
    evidence_map: evidenceMap,
    reference_identity: z.string().min(1),
    reference_views: z.array(z.string().min(1)).min(1),
    front_direction: z.enum(["+z", "-z"]),
    up_direction: z.literal("+y").default("+y"),
    scale: z
      .object({
        basis: z.literal("minecraft_player").default("minecraft_player"),
        player_height_blocks: z.number().positive().finite().default(1.8),
        target_height_blocks: z.number().positive().finite(),
        ground_contact: z.literal("bottom").default("bottom"),
      })
      .strict()
      .describe("World-scale anchor using the 1.8-block Minecraft player baseline."),
    envelope: z.object({
      width: z.number().positive().finite().describe("Width in Blockbench units (16 units = 1 block)."),
      height: z.number().positive().finite().describe("Height in Blockbench units; must match target_height_blocks x 16."),
      length: z.number().positive().finite().describe("Length in Blockbench units (16 units = 1 block)."),
    }).strict(),
    proportion_targets: z
      .array(proportionTarget)
      .min(1)
      .describe("Reference-derived normalized bounds for every role entering the first build."),
    group_roles: roleList.default([]),
    geometry_roles: roleList.default([]),
    landmarks: z.array(landmark).default([]),
    attachments: z.array(attachment).default([]),
    rotation_parts: z.array(rotationPart).default([]),
    construction_strategy: z.array(constructionStrategy).default([]),
    symmetry: z.object({
      enabled: z.boolean().default(false),
      axis: z.literal("x").default("x"),
      tolerance: z.number().nonnegative().finite().default(0.01),
    }).strict().default({ enabled: false, axis: "x", tolerance: 0.01 }),
    first_build_scope: z.array(z.string().min(1)).min(1),
  })
  .strict()
  .superRefine((plan, ctx) => {
    const allRoles = [...plan.group_roles, ...plan.geometry_roles];
    const roles = new Set(allRoles.map((mass) => mass.role));
    const landmarkRoles = new Set(plan.landmarks.map((item) => item.role));
    const massTypes = new Map(allRoles.map((mass) => [mass.role, mass.type]));
    const proportionRoles = new Set(plan.proportion_targets.map((item) => item.role));
    const roleSet = new Set(allRoles.map((item) => item.role));
    const strategies = new Map(plan.construction_strategy.map((item) => [item.role, item]));
    const anchorsByRole = new Map<string, Set<string>>();
    for (const anchor of plan.evidence_map.silhouette_anchors) {
      const kinds = anchorsByRole.get(anchor.role) ?? new Set<string>();
      kinds.add(anchor.kind);
      anchorsByRole.set(anchor.role, kinds);
    }
    const evidenceRoleChecks: Array<[keyof typeof plan.evidence_map, string | string[]]> = [
      ["primary_mass_roles", "solid_mass"],
      ["chain_roles", ["segmented_chain", "tapered_chain"]],
      ["bilateral_roles", "bilateral_pair"],
      ["rotated_attachment_roles", "rotated_attachment"],
      ["repeated_detail_roles", "repeated_detail"],
      ["locator_roles", "locator_only"],
    ];

    if (allRoles.length === 0) {
      ctx.addIssue({ code: "custom", message: "Declare at least one group role or geometry role.", path: ["group_roles"] });
    }

    for (const [field, expectedStrategy] of evidenceRoleChecks) {
      for (const role of plan.evidence_map[field]) {
        if (!roleSet.has(role)) {
          ctx.addIssue({ code: "custom", message: `Evidence map role is not declared: ${role}`, path: ["evidence_map", field] });
          continue;
        }
        const actualStrategy = strategies.get(role)?.strategy;
        const allowedStrategies = Array.isArray(expectedStrategy) ? expectedStrategy : [expectedStrategy];
        if (!actualStrategy || !allowedStrategies.includes(actualStrategy)) {
          ctx.addIssue({ code: "custom", message: `Evidence map role has the wrong construction strategy: ${role}`, path: ["evidence_map", field] });
        }
      }
    }

    const targetHeightUnits = plan.scale.target_height_blocks * 16;
    if (Math.abs(plan.envelope.height - targetHeightUnits) > 0.01) {
      ctx.addIssue({
        code: "custom",
        message: `Envelope height (${plan.envelope.height}) must equal target_height_blocks x 16 (${targetHeightUnits}).`,
        path: ["envelope", "height"],
      });
    }

    for (const mass of allRoles) {
      if (mass.parent_role !== "root" && !roles.has(mass.parent_role)) {
        ctx.addIssue({ code: "custom", message: `Unknown parent role: ${mass.parent_role}`, path: ["group_roles"] });
      }
    }
    for (const role of plan.first_build_scope) {
      if (!roles.has(role)) {
        ctx.addIssue({ code: "custom", message: `first_build_scope role is not declared: ${role}`, path: ["first_build_scope"] });
      }
      if (massTypes.get(role) === "unresolved") {
        ctx.addIssue({ code: "custom", message: `Unresolved mass cannot enter first_build_scope: ${role}`, path: ["first_build_scope"] });
      }
      if (!proportionRoles.has(role)) {
        ctx.addIssue({ code: "custom", message: `first_build_scope role has no proportion target: ${role}`, path: ["proportion_targets"] });
      }
      if (!strategies.has(role)) {
        ctx.addIssue({ code: "custom", message: `first_build_scope role has no construction strategy: ${role}`, path: ["construction_strategy"] });
      }
      if ((anchorsByRole.get(role)?.size ?? 0) < 2) {
        ctx.addIssue({ code: "custom", message: `first_build_scope role needs at least two contour anchor kinds: ${role}`, path: ["evidence_map", "silhouette_anchors"] });
      }
    }
    for (const target of plan.proportion_targets) {
      if (!roles.has(target.role)) {
        ctx.addIssue({ code: "custom", message: `Proportion target role is not declared: ${target.role}`, path: ["proportion_targets"] });
      }
      for (let axis = 0; axis < 3; axis += 1) {
        if (target.min_normalized[axis] > target.max_normalized[axis]) {
          ctx.addIssue({ code: "custom", message: `Proportion target min exceeds max for role: ${target.role}`, path: ["proportion_targets", target.role] });
        }
      }
    }
    for (const strategy of plan.construction_strategy) {
      if (!roleSet.has(strategy.role)) {
        ctx.addIssue({ code: "custom", message: `Construction strategy role is not declared: ${strategy.role}`, path: ["construction_strategy"] });
      }
      if (strategy.counterpart_role && !roleSet.has(strategy.counterpart_role)) {
        ctx.addIssue({ code: "custom", message: `Construction counterpart role is not declared: ${strategy.counterpart_role}`, path: ["construction_strategy"] });
      }
      if ((strategy.strategy === "bilateral_pair" || strategy.strategy === "rotated_attachment") && !strategy.counterpart_role && strategy.strategy === "bilateral_pair") {
        ctx.addIssue({ code: "custom", message: `Bilateral role requires counterpart_role: ${strategy.role}`, path: ["construction_strategy"] });
      }
      if ((strategy.strategy === "segmented_chain" || strategy.strategy === "tapered_chain") && strategy.role !== "root") {
        if (strategy.segment_index === undefined) {
          ctx.addIssue({ code: "custom", message: `Chain role requires segment_index: ${strategy.role}`, path: ["construction_strategy"] });
        }
        const parent = allRoles.find((item) => item.role === strategy.role)?.parent_role;
        if (!parent || parent === "root") {
          ctx.addIssue({ code: "custom", message: `Chain role requires a non-root parent: ${strategy.role}`, path: ["construction_strategy"] });
        }
      }
      if (strategy.strategy === "rotated_attachment" && massTypes.get(strategy.role) !== "rotated") {
        ctx.addIssue({ code: "custom", message: `Rotated attachment must target a rotated role: ${strategy.role}`, path: ["construction_strategy"] });
      }
      if (strategy.strategy === "repeated_detail") {
        if (strategy.repeat_count === undefined || strategy.repeat_axis === undefined || strategy.repeat_step === undefined) {
          ctx.addIssue({ code: "custom", message: `Repeated detail requires repeat_count, repeat_axis, and repeat_step: ${strategy.role}`, path: ["construction_strategy"] });
        }
        if (strategy.repeat_step !== undefined && Math.abs(strategy.repeat_step * 2 - Math.round(strategy.repeat_step * 2)) > 0.000001) {
          ctx.addIssue({ code: "custom", message: `Repeated detail repeat_step must use the 0.5-unit grid: ${strategy.role}`, path: ["construction_strategy"] });
        }
      }
    }
    for (const item of plan.attachments) {
      if (!roles.has(item.child_role) || !roles.has(item.parent_role) || !landmarkRoles.has(item.landmark)) {
        ctx.addIssue({ code: "custom", message: `Attachment references an undeclared role or landmark: ${item.child_role}`, path: ["attachments"] });
      }
    }
    for (const item of plan.rotation_parts) {
      if (!roles.has(item.role) || !landmarkRoles.has(item.attachment_landmark) || !landmarkRoles.has(item.endpoint_landmark) || !landmarkRoles.has(item.pivot_landmark)) {
        ctx.addIssue({ code: "custom", message: `Rotation part references an undeclared role or landmark: ${item.role}`, path: ["rotation_parts"] });
      }
    }

    for (const mass of allRoles) {
      if (mass.type !== "rotated") continue;
      const intents = plan.rotation_parts.filter((item) => item.role === mass.role);
      for (const owner of ["group", "cube"] as const) {
        if (!intents.some((item) => item.rotation_owner === owner)) {
          ctx.addIssue({
            code: "custom",
            message: `Rotated role requires ${owner} rotation intent: ${mass.role}`,
            path: ["rotation_parts"],
          });
        }
      }
    }
  });

export type GeometryPlan = z.infer<typeof prepareGeometryPlanParameters> & {
  plan_id: string;
  project_uuid: string;
  revision: number;
  status: "prepared";
  scale_units: {
    block_units: 16;
    player_height_units: number;
    target_height_units: number;
  };
};

let activePlan: GeometryPlan | null = null;
const roleBindings = new Map<string, { uuid: string; type: "group" | "cube" }>();

function bindingKey(role: string, type: "group" | "cube"): string {
  return `${type}:${role}`;
}

export function setActiveGeometryPlan(plan: GeometryPlan): void {
  activePlan = plan;
  roleBindings.clear();
}

export function clearActiveGeometryPlan(): void {
  activePlan = null;
  roleBindings.clear();
}

export function getActiveGeometryPlan(projectUuid?: string): GeometryPlan | null {
  if (!activePlan) return null;
  if (projectUuid !== undefined && activePlan.project_uuid !== projectUuid) return null;
  return activePlan;
}

export function requireActiveGeometryPlan(projectUuid: string, planId: string): GeometryPlan {
  const plan = getActiveGeometryPlan(projectUuid);
  if (!plan || plan.plan_id !== planId) {
    throw new Error("A current prepare_geometry_plan is required for this project before geometry mutation.");
  }
  return plan;
}

export function requirePlanForOpenProject(planId: string): GeometryPlan {
  if (!Project) throw new Error("No project is open.");
  return requireActiveGeometryPlan(Project.uuid, planId);
}

export function requireDeclaredGeometryRole(
  plan: GeometryPlan,
  role: string,
  context: string,
  type?: "group" | "cube"
): void {
  const declared = type === "group"
    ? plan.group_roles.some((mass) => mass.role === role)
    : type === "cube"
      ? plan.geometry_roles.some((mass) => mass.role === role)
      : [...plan.group_roles, ...plan.geometry_roles].some((mass) => mass.role === role);
  if (!declared) {
    throw new Error(`${context} role "${role}" is not declared in prepare_geometry_plan.`);
  }
}

export function bindGeometryRole(
  plan: GeometryPlan,
  role: string,
  uuid: string,
  type: "group" | "cube"
): void {
  requireDeclaredGeometryRole(plan, role, "Geometry", type);
  const key = bindingKey(role, type);
  const existing = roleBindings.get(key);
  if (existing && (existing.uuid !== uuid || existing.type !== type)) {
    throw new Error(`Geometry role "${role}" is already bound to UUID ${existing.uuid}. Revise the plan before rebinding it.`);
  }
  roleBindings.set(key, { uuid, type });
}

export function getBoundGeometryRole(plan: GeometryPlan, role: string): { uuid: string; type: "group" | "cube" } {
  requireDeclaredGeometryRole(plan, role, "Geometry");
  const binding = roleBindings.get(bindingKey(role, "cube")) ?? roleBindings.get(bindingKey(role, "group"));
  if (!binding) throw new Error(`Geometry role "${role}" is not bound by the active plan.`);
  return binding;
}

export function requireGeometryRoleAvailable(
  plan: GeometryPlan,
  role: string,
  context: string,
  type?: "group" | "cube"
): void {
  requireDeclaredGeometryRole(plan, role, context, type);
  if (type
    ? roleBindings.has(bindingKey(role, type))
    : roleBindings.has(bindingKey(role, "group")) || roleBindings.has(bindingKey(role, "cube"))) {
    throw new Error(`Geometry role "${role}" is already bound. Use the existing UUID for correction instead of creating another element.`);
  }
}

export function requireBoundGeometryTarget(
  plan: GeometryPlan,
  reference: string,
  context: string
): void {
  const bound = [...roleBindings.entries()].some(
    ([key, binding]) => key.endsWith(`:${reference}`) || binding.uuid === reference
  );
  if (!bound) {
    throw new Error(`${context} target "${reference}" is not bound by the active Geometry plan.`);
  }
  void plan;
}

export function requireRotationIntent(
  plan: GeometryPlan,
  role: string,
  owner: "group" | "cube"
): void {
  const resolvedRole = [...plan.group_roles, ...plan.geometry_roles].some((item) => item.role === role)
    ? role
    : [...roleBindings.entries()].find(([, binding]) => binding.uuid === role)?.[0]?.split(":").slice(1).join(":");
  const mass = [...plan.group_roles, ...plan.geometry_roles].find((item) => item.role === resolvedRole);
  if (!resolvedRole || !mass || mass.type !== "rotated") {
    throw new Error(`Role "${role}" is not declared as a rotated primary mass.`);
  }
  const rotation = plan.rotation_parts.find((item) => item.role === resolvedRole);
  if (!rotation) {
    throw new Error(`Rotated role "${resolvedRole}" has no rotation intent in the active Geometry plan.`);
  }
  if (rotation.rotation_owner !== owner) {
    throw new Error(`Rotated role "${resolvedRole}" is owned by ${rotation.rotation_owner}, not ${owner}.`);
  }
}

export function createGeometryPlan(
  projectUuid: string,
  input: z.infer<typeof prepareGeometryPlanParameters>
): GeometryPlan {
  const plan: GeometryPlan = {
    ...input,
    plan_id: crypto.randomUUID(),
    project_uuid: projectUuid,
    revision: 1,
    status: "prepared",
    scale_units: {
      block_units: 16,
      player_height_units: input.scale.player_height_blocks * 16,
      target_height_units: input.scale.target_height_blocks * 16,
    },
  };
  setActiveGeometryPlan(plan);
  return plan;
}

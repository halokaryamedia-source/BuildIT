import { z } from "zod";
import {
  bindGeometryRole,
  requirePlanForOpenProject,
  type GeometryPlan,
} from "@/lib/geometryPlan";

export const compileGeometrySpecParameters = z
  .object({
    plan_id: z.string().min(1).describe("Active prepare_geometry_plan ID."),
    detail_level: z.enum(["blockout", "primary", "refined"]).default("primary"),
  })
  .strict();

export type CompileGeometrySpecArgs = z.infer<typeof compileGeometrySpecParameters>;

function quantizeHalf(value: number): number {
  const rounded = Math.round(value * 2) / 2;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function worldPosition(plan: GeometryPlan, normalized: readonly number[]): [number, number, number] {
  const { width, height, length } = plan.envelope;
  return [
    quantizeHalf(-width / 2 + normalized[0] * width),
    quantizeHalf(normalized[1] * height),
    quantizeHalf(-length / 2 + normalized[2] * length),
  ];
}

function findRoleTarget(plan: GeometryPlan, role: string) {
  const target = plan.proportion_targets.find((item) => item.role === role);
  if (!target) throw new Error(`Role "${role}" has no proportion target.`);
  return target;
}

function parentRole(plan: GeometryPlan, role: string): string {
  return [...plan.group_roles, ...plan.geometry_roles].find((item) => item.role === role)?.parent_role ?? "root";
}

function rotationForRole(plan: GeometryPlan, role: string): [number, number, number] {
  const intent = plan.rotation_parts.find((item) => item.role === role);
  if (!intent) return [0, 0, 0];
  const attachment = plan.landmarks.find((item) => item.role === intent.attachment_landmark);
  const endpoint = plan.landmarks.find((item) => item.role === intent.endpoint_landmark);
  const pivot = plan.landmarks.find((item) => item.role === intent.pivot_landmark);
  if (!attachment || !endpoint || !pivot) throw new Error(`Rotation role "${role}" references missing landmarks.`);
  const a = worldPosition(plan, attachment.position_normalized);
  const e = worldPosition(plan, endpoint.position_normalized);
  const dx = e[0] - a[0];
  const dy = e[1] - a[1];
  const dz = e[2] - a[2];
  let angle = intent.rotation_axis === "x"
    ? Math.atan2(dz, dy)
    : intent.rotation_axis === "y"
      ? Math.atan2(dx, dz)
      : Math.atan2(dy, dx);
  if (intent.rotation_sign === "negative" || intent.rotation_sign === "away_from_front") angle *= -1;
  if (intent.rotation_sign === "toward_front" && plan.front_direction === "-z") angle *= -1;
  const degrees = angle * 180 / Math.PI;
  const rotation: [number, number, number] = [0, 0, 0];
  rotation["xyz".indexOf(intent.rotation_axis)] = degrees;
  void pivot;
  return rotation;
}

function originForRole(plan: GeometryPlan, role: string, fallback: readonly number[]): [number, number, number] {
  const intent = plan.rotation_parts.find((item) => item.role === role);
  if (!intent) return [fallback[0], fallback[1], fallback[2]];
  const pivot = plan.landmarks.find((item) => item.role === intent.pivot_landmark);
  if (!pivot) throw new Error(`Rotation role "${role}" references missing pivot landmark.`);
  return worldPosition(plan, pivot.position_normalized);
}

function parentWorldOrigin(plan: GeometryPlan, role: string): [number, number, number] {
  const parent = parentRole(plan, role);
  if (parent === "root") return [0, 0, 0];
  const target = findRoleTarget(plan, parent);
  return originForRole(plan, parent, worldPosition(plan, target.min_normalized));
}

function localPoint(world: readonly number[], parentOrigin: readonly number[]): [number, number, number] {
  return [
    quantizeHalf(world[0] - parentOrigin[0]),
    quantizeHalf(world[1] - parentOrigin[1]),
    quantizeHalf(world[2] - parentOrigin[2]),
  ];
}

function preflightPlan(plan: GeometryPlan): void {
  const groupRoles = new Set(plan.group_roles.map((item) => item.role));
  const geometryRoles = new Set(plan.geometry_roles.map((item) => item.role));
  const scope = new Set(plan.first_build_scope);

  for (const role of scope) {
    if (!groupRoles.has(role) && !geometryRoles.has(role)) {
      throw new Error(`Compile scope contains undeclared role "${role}".`);
    }
    const target = findRoleTarget(plan, role);
    if (target.confidence === "provisional" && plan.detail_level === undefined) {
      throw new Error(`Role "${role}" has provisional proportions; choose an explicit compile detail level.`);
    }
  }
  for (const role of plan.first_build_scope) {
    const mass = [...plan.group_roles, ...plan.geometry_roles].find((item) => item.role === role);
    if (mass?.type === "rotated") {
      const rotation = plan.rotation_parts.find((item) => item.role === role);
      if (!rotation) throw new Error(`Rotated role "${role}" has no rotation intent.`);
      rotationForRole(plan, role);
    }
  }
  const strategies = new Map(plan.construction_strategy.map((item) => [item.role, item]));
  const targets = new Map(plan.proportion_targets.map((item) => [item.role, item]));
  const tolerance = plan.symmetry.tolerance;
  for (const role of plan.first_build_scope) {
    const strategy = strategies.get(role);
    if (strategy?.strategy === "locator_only") {
      throw new Error(`Locator-only role "${role}" cannot enter Geometry compilation; use a locator operation instead.`);
    }
    if (strategy?.strategy === "segmented_chain" || strategy?.strategy === "tapered_chain") {
      const parent = parentRole(plan, role);
      if (parent !== "root" && !scope.has(parent)) {
        throw new Error(`Chain role "${role}" requires its parent role "${parent}" in compile scope.`);
      }
    }
    if (strategy?.strategy === "bilateral_pair") {
      const counterpart = strategy.counterpart_role ? targets.get(strategy.counterpart_role) : undefined;
      const target = targets.get(role);
      if (!counterpart || !target) throw new Error(`Bilateral role "${role}" is missing a proportion target or counterpart target.`);
      const mirroredMin = 1 - counterpart.max_normalized[0];
      const mirroredMax = 1 - counterpart.min_normalized[0];
      if (Math.abs(target.min_normalized[0] - mirroredMin) > tolerance || Math.abs(target.max_normalized[0] - mirroredMax) > tolerance) {
        throw new Error(`Bilateral targets for "${role}" and "${strategy.counterpart_role}" are not symmetric on x within tolerance ${tolerance}.`);
      }
    }
    if (strategy?.strategy === "tapered_chain" && strategy.counterpart_role) {
      const parent = targets.get(strategy.counterpart_role);
      const target = targets.get(role);
      if (parent && target) {
        const parentWidth = parent.max_normalized[0] - parent.min_normalized[0];
        const targetWidth = target.max_normalized[0] - target.min_normalized[0];
        if (targetWidth >= parentWidth) throw new Error(`Tapered role "${role}" must be narrower than "${strategy.counterpart_role}".`);
      }
    }
  }
}

export function compileGeometrySpec(args: CompileGeometrySpecArgs) {
  if (!Project) throw new Error("No project is open.");
  const plan = requirePlanForOpenProject(args.plan_id);
  preflightPlan({ ...plan, detail_level: args.detail_level } as GeometryPlan & { detail_level: string });

  const groupRoles = plan.group_roles.filter((item) => plan.first_build_scope.includes(item.role));
  const cubeRoles = plan.geometry_roles.filter((item) => plan.first_build_scope.includes(item.role));
  const strategies = new Map(plan.construction_strategy.map((item) => [item.role, item]));
  const existingNames = new Set([
    ...Group.all.map((item) => item.name),
    ...Cube.all.map((item) => item.name),
  ]);
  for (const role of [...groupRoles, ...cubeRoles]) {
    if (existingNames.has(role.role)) throw new Error(`Compile target name already exists: ${role.role}`);
    const strategy = strategies.get(role.role);
    if (strategy?.strategy === "repeated_detail" && strategy.repeat_count) {
      for (let index = 1; index <= strategy.repeat_count; index += 1) {
        const generatedName = `${role.role}_${String(index).padStart(2, "0")}`;
        if (existingNames.has(generatedName)) throw new Error(`Compile target name already exists: ${generatedName}`);
      }
    }
  }

  const groupMap = new Map<string, Group>();
  const orderedGroups = [...groupRoles].sort((a, b) => {
    const depth = (role: string): number => role === "root" ? 0 : 1 + depth(parentRole(plan, role));
    return depth(a.role) - depth(b.role);
  });

  Undo.initEdit({ elements: [], groups: [], outliner: true, collections: [] });
  const createdGroups: Group[] = [];
  const createdCubes: Cube[] = [];
  try {
    for (const role of orderedGroups) {
      const target = findRoleTarget(plan, role.role);
      const worldOrigin = originForRole(plan, role.role, worldPosition(plan, target.min_normalized));
      const origin = localPoint(worldOrigin, parentWorldOrigin(plan, role.role));
      const group = new Group({ name: role.role, origin, rotation: rotationForRole(plan, role.role) }).init();
      const parent = role.parent_role === "root" ? null : groupMap.get(role.parent_role);
      if (role.parent_role !== "root" && !parent) {
        throw new Error(`Compile parent role is not in scope: ${role.parent_role} for ${role.role}.`);
      }
      group.addTo(parent ?? "root");
      groupMap.set(role.role, group);
      createdGroups.push(group);
    }

    for (const role of cubeRoles) {
      const target = findRoleTarget(plan, role.role);
      // Blockbench Cube coordinates remain model/world-space when parented;
      // only the Group owns the hierarchy transform. Converting these bounds
      // to parent-local coordinates moves lower limbs below the ground plane.
      const strategy = strategies.get(role.role);
      const repeatCount = strategy?.strategy === "repeated_detail" ? strategy.repeat_count : 1;
      const repeatAxis = strategy?.strategy === "repeated_detail" ? strategy.repeat_axis : undefined;
      const repeatStep = strategy?.strategy === "repeated_detail" ? strategy.repeat_step : undefined;
      if (strategy?.strategy === "repeated_detail" && (repeatCount === undefined || repeatAxis === undefined || repeatStep === undefined)) {
        throw new Error(`Repeated detail role "${role.role}" is missing repeat specification.`);
      }
      const parent = role.parent_role === "root" ? null : groupMap.get(role.parent_role);
      if (role.parent_role !== "root" && !parent) {
        throw new Error(`Compile cube parent role is not in scope: ${role.parent_role} for ${role.role}.`);
      }
      for (let index = 0; index < repeatCount; index += 1) {
        const baseFrom = worldPosition(plan, target.min_normalized);
        const baseTo = worldPosition(plan, target.max_normalized);
        const offset = index * (repeatStep ?? 0);
        const from = [...baseFrom] as [number, number, number];
        const to = [...baseTo] as [number, number, number];
        if (repeatAxis) {
          const axis = "xyz".indexOf(repeatAxis);
          from[axis] += offset;
          to[axis] += offset;
        }
        if (to.some((value, axis) => value <= from[axis])) {
          throw new Error(`Compile proportion target for ${role.role} produces an empty cube.`);
        }
        const name = repeatCount > 1 ? `${role.role}_${String(index + 1).padStart(2, "0")}` : role.role;
        const cube = new Cube({
          name,
          from,
          to,
          origin: originForRole(plan, role.role, from),
          // Rotated primary masses own their transform at the Group level.
          rotation: role.parent_role === "root" ? rotationForRole(plan, role.role) : [0, 0, 0],
          autouv: 1,
        }).init();
        cube.addTo(parent ?? "root");
        cube.mapAutoUV();
        createdCubes.push(cube);
      }
    }
    Undo.finishEdit("Compile Geometry Spec", { elements: createdCubes, groups: createdGroups });
  } catch (error) {
    Undo.cancelEdit(true);
    Canvas.updateAll();
    throw error;
  }

  createdGroups.forEach((group) => bindGeometryRole(plan, group.name, group.uuid, "group"));
  cubeRoles.forEach((role) => {
    const first = createdCubes.find((cube) => cube.name === role.role || cube.name.startsWith(`${role.role}_`));
    if (first) bindGeometryRole(plan, role.role, first.uuid, "cube");
  });
  Canvas.updateAll();
  const generatedElementsByRole = Object.fromEntries(
    cubeRoles.map((role) => [
      role.role,
      createdCubes.filter((cube) => cube.name === role.role || cube.name.startsWith(`${role.role}_`)).map((cube) => cube.name),
    ])
  );
  return {
    execution: "applied" as const,
    visual_verdict: "not_evaluated" as const,
    detail_level: args.detail_level,
    groups_created: createdGroups.length,
    cubes_created: createdCubes.length,
    roles_compiled: [...createdGroups, ...createdCubes].map((item) => item.name),
    generated_elements_by_role: generatedElementsByRole,
    uv_mode: "auto_mapped" as const,
    structural_audit: {
      unbound_roles: plan.first_build_scope.filter((role) => !groupMap.has(role) && !(generatedElementsByRole[role]?.length)),
      ground_contact: Math.min(...createdCubes.map((cube) => cube.from[1])) === 0,
      bounds: {
        min: [Math.min(...createdCubes.map((cube) => cube.from[0])), Math.min(...createdCubes.map((cube) => cube.from[1])), Math.min(...createdCubes.map((cube) => cube.from[2]))],
        max: [Math.max(...createdCubes.map((cube) => cube.to[0])), Math.max(...createdCubes.map((cube) => cube.to[1])), Math.max(...createdCubes.map((cube) => cube.to[2]))],
      },
    },
  };
}

export const correctGeometryFromReportParameters = z.object({
  plan_id: z.string().min(1),
  corrections: z.array(z.object({
    role: z.string().min(1),
    min_normalized: z.tuple([z.number().min(0).max(1), z.number().min(0).max(1), z.number().min(0).max(1)]),
    max_normalized: z.tuple([z.number().min(0).max(1), z.number().min(0).max(1), z.number().min(0).max(1)]),
  }).strict()).min(1).max(8),
}).strict();

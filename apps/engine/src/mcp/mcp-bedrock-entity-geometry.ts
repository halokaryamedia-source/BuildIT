import type { McpGeometryCube, McpGeometryGroup, McpGeometryIssue, McpGeometryReport, Vec3 } from "./mcp-geometry-planner.js";

const entityCoreGroups = ["root", "body", "head", "accessories"];

function roundToQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

function sanitizeName(value: string, fallback: string): string {
  const safeName = value.trim().replace(/[^a-zA-Z0-9_\-]+/g, "_").replace(/^_+|_+$/g, "");
  return safeName || fallback;
}

function hasNameHint(cube: McpGeometryCube, hints: string[]): boolean {
  const value = (cube.name + " " + cube.group + " " + cube.material).toLowerCase();
  return hints.some((hint) => value.includes(hint));
}

function classifyEntityGroup(cube: McpGeometryCube): string {
  if (hasNameHint(cube, ["head", "face", "eye", "mouth", "horn", "helmet"]) || cube.from[1] >= 18) {
    return "head";
  }

  if (hasNameHint(cube, ["accessory", "accessories", "detail", "backpack", "bag", "hat", "wing", "tail", "weapon", "tool"])) {
    return "accessories";
  }

  return "body";
}

function createEntityGroupList(existingGroups: McpGeometryGroup[]): McpGeometryGroup[] {
  const groupMap = new Map<string, McpGeometryGroup>();

  groupMap.set("root", { name: "root", origin: [0, 0, 0] });
  groupMap.set("body", { name: "body", origin: [0, 12, 0] });
  groupMap.set("head", { name: "head", origin: [0, 24, 0] });
  groupMap.set("accessories", { name: "accessories", origin: [0, 16, 0] });

  for (const group of existingGroups) {
    const name = sanitizeName(group.name, "body");
    if (!groupMap.has(name)) {
      groupMap.set(name, { name, origin: group.origin });
    }
  }

  return Array.from(groupMap.values());
}

function remapCubeForEntity(cube: McpGeometryCube, issues: McpGeometryIssue[]): McpGeometryCube {
  const originalGroup = cube.group;
  const lowerGroup = originalGroup.toLowerCase();
  const isBlockGroup = lowerGroup === "base" || lowerGroup === "block_body" || lowerGroup === "decorative_details";
  const group = entityCoreGroups.includes(originalGroup) && !isBlockGroup ? originalGroup : classifyEntityGroup(cube);

  if (group !== originalGroup) {
    issues.push({
      severity: "warning",
      code: "ENTITY_CUBE_GROUP_REASSIGNED",
      message: "Cube " + cube.name + " was assigned to entity group " + group + " from " + originalGroup + "."
    });
  }

  return {
    ...cube,
    group
  };
}

function hasBodyCube(cubes: McpGeometryCube[]): boolean {
  return cubes.some((cube) => cube.group === "body" && cube.to[1] > 4 && cube.from[1] < 22);
}

function createCube(name: string, group: string, from: Vec3, to: Vec3, material: string): McpGeometryCube {
  return {
    name,
    group,
    from,
    to,
    size: [roundToQuarter(to[0] - from[0]), roundToQuarter(to[1] - from[1]), roundToQuarter(to[2] - from[2])],
    center: [roundToQuarter((from[0] + to[0]) / 2), roundToQuarter((from[1] + to[1]) / 2), roundToQuarter((from[2] + to[2]) / 2)],
    material
  };
}

function addRequiredEntityCubes(cubes: McpGeometryCube[], issues: McpGeometryIssue[]): McpGeometryCube[] {
  const nextCubes = [...cubes];

  if (!hasBodyCube(nextCubes)) {
    nextCubes.push(createCube("generated_entity_body", "body", [-4, 0, -2], [4, 16, 2], "body_material"));
    issues.push({
      severity: "warning",
      code: "ENTITY_BODY_GENERATED",
      message: "Generated a body cube to keep the Bedrock Entity readable as an entity model."
    });
  }

  return nextCubes;
}

function getOccupancy(cubes: McpGeometryCube[]): { min: Vec3; max: Vec3 } {
  const min: Vec3 = [16, 32, 16];
  const max: Vec3 = [-16, 0, -16];

  for (const cube of cubes) {
    min[0] = Math.min(min[0], cube.from[0]);
    min[1] = Math.min(min[1], cube.from[1]);
    min[2] = Math.min(min[2], cube.from[2]);
    max[0] = Math.max(max[0], cube.to[0]);
    max[1] = Math.max(max[1], cube.to[1]);
    max[2] = Math.max(max[2], cube.to[2]);
  }

  return { min, max };
}

function addEntityWarnings(cubes: McpGeometryCube[], issues: McpGeometryIssue[]): void {
  const occupancy = getOccupancy(cubes);
  const width = occupancy.max[0] - occupancy.min[0];
  const depth = occupancy.max[2] - occupancy.min[2];
  const height = occupancy.max[1] - occupancy.min[1];

  if (height < 8) {
    issues.push({
      severity: "warning",
      code: "ENTITY_HEIGHT_LOW",
      message: "Bedrock Entity height is low. Consider adding body or head cubes."
    });
  }

  if (width > 28 || depth > 28) {
    issues.push({
      severity: "warning",
      code: "ENTITY_FOOTPRINT_WIDE",
      message: "Bedrock Entity footprint is very wide. Consider moving wide static details into accessories."
    });
  }
}

export function applyBedrockEntityGeometryRules(report: McpGeometryReport): McpGeometryReport {
  if (report.format !== "bedrock") return report;

  const issues: McpGeometryIssue[] = [...report.issues];
  const groups = createEntityGroupList(report.groups);
  const remappedCubes = report.cubes.map((cube) => remapCubeForEntity(cube, issues));
  const cubes = addRequiredEntityCubes(remappedCubes, issues);

  addEntityWarnings(cubes, issues);

  return {
    ...report,
    groups,
    cubes,
    groupCount: groups.length,
    cubeCount: cubes.length,
    issues,
    valid: !issues.some((issue) => issue.severity === "error")
  };
}

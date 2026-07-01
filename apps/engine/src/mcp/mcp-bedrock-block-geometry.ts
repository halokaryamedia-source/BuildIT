import type { McpGeometryCube, McpGeometryGroup, McpGeometryIssue, McpGeometryReport, Vec3 } from "./mcp-geometry-planner.js";

const blockCoreGroups = ["root", "base", "block_body", "decorative_details"];

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

function classifyBlockGroup(cube: McpGeometryCube): string {
  if (hasNameHint(cube, ["base", "bottom", "floor", "foundation", "pedestal"]) || cube.from[1] <= 2) {
    return "base";
  }

  if (hasNameHint(cube, ["detail", "decor", "trim", "top", "cap", "roof", "crystal", "lamp", "handle"]) || cube.from[1] >= 11) {
    return "decorative_details";
  }

  return "block_body";
}

function createBlockGroupList(existingGroups: McpGeometryGroup[]): McpGeometryGroup[] {
  const groupMap = new Map<string, McpGeometryGroup>();

  for (const groupName of blockCoreGroups) {
    groupMap.set(groupName, { name: groupName, origin: [0, 0, 0] });
  }

  for (const group of existingGroups) {
    const name = sanitizeName(group.name, "block_body");
    if (!groupMap.has(name)) {
      groupMap.set(name, { name, origin: group.origin });
    }
  }

  return Array.from(groupMap.values());
}

function remapCubeForBlock(cube: McpGeometryCube, issues: McpGeometryIssue[]): McpGeometryCube {
  const originalGroup = cube.group;
  const group = blockCoreGroups.includes(originalGroup) ? originalGroup : classifyBlockGroup(cube);

  if (group !== originalGroup) {
    issues.push({
      severity: "warning",
      code: "BLOCK_CUBE_GROUP_REASSIGNED",
      message: "Cube " + cube.name + " was assigned to block group " + group + " from " + originalGroup + "."
    });
  }

  return {
    ...cube,
    group
  };
}

function hasBaseCube(cubes: McpGeometryCube[]): boolean {
  return cubes.some((cube) => cube.group === "base" && cube.from[1] <= 1 && cube.to[1] >= 1);
}

function hasBodyCube(cubes: McpGeometryCube[]): boolean {
  return cubes.some((cube) => cube.group === "block_body" && cube.to[1] > 4 && cube.from[1] < 14);
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

function addRequiredBlockSilhouetteCubes(cubes: McpGeometryCube[], issues: McpGeometryIssue[]): McpGeometryCube[] {
  const nextCubes = [...cubes];

  if (!hasBaseCube(nextCubes)) {
    nextCubes.unshift(createCube("generated_block_base", "base", [-8, 0, -8], [8, 1.5, 8], "base_material"));
    issues.push({
      severity: "warning",
      code: "BLOCK_BASE_GENERATED",
      message: "Generated a base cube to keep the Bedrock Block grounded as a placeable world block."
    });
  }

  if (!hasBodyCube(nextCubes)) {
    nextCubes.push(createCube("generated_block_body", "block_body", [-6, 1.5, -6], [6, 13, 6], "main_material"));
    issues.push({
      severity: "warning",
      code: "BLOCK_BODY_GENERATED",
      message: "Generated a body cube to keep the Bedrock Block readable as a static placeable block."
    });
  }

  return nextCubes;
}

function getOccupancy(cubes: McpGeometryCube[]): { min: Vec3; max: Vec3 } {
  const min: Vec3 = [8, 16, 8];
  const max: Vec3 = [-8, 0, -8];

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

function addSilhouetteWarnings(cubes: McpGeometryCube[], issues: McpGeometryIssue[]): void {
  const occupancy = getOccupancy(cubes);
  const width = occupancy.max[0] - occupancy.min[0];
  const depth = occupancy.max[2] - occupancy.min[2];
  const height = occupancy.max[1] - occupancy.min[1];

  if (width < 6 || depth < 6) {
    issues.push({
      severity: "warning",
      code: "BLOCK_FOOTPRINT_NARROW",
      message: "Bedrock Block footprint is narrow. Consider wider base/body cubes for clearer world placement."
    });
  }

  if (height < 6) {
    issues.push({
      severity: "warning",
      code: "BLOCK_HEIGHT_LOW",
      message: "Bedrock Block height is low. Consider adding body or top detail cubes."
    });
  }
}

export function applyBedrockBlockGeometryRules(report: McpGeometryReport): McpGeometryReport {
  if (report.format !== "bedrock_block") return report;

  const issues: McpGeometryIssue[] = [...report.issues];
  const groups = createBlockGroupList(report.groups);
  const remappedCubes = report.cubes.map((cube) => remapCubeForBlock(cube, issues));
  const cubes = addRequiredBlockSilhouetteCubes(remappedCubes, issues);

  addSilhouetteWarnings(cubes, issues);

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

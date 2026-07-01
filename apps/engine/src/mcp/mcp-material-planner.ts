import type { McpGeometryCube, McpGeometryIssue, McpGeometryReport } from "./mcp-geometry-planner.js";

export interface McpMaterialIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

export interface McpMaterialDefinition {
  name: string;
  displayName: string;
  placeholderColor: string;
  cubeCount: number;
  sourceNames: string[];
}

export interface McpMaterialAssignment {
  cubeName: string;
  group: string;
  originalMaterial: string;
  normalizedMaterial: string;
}

export interface McpMaterialPlanReport {
  createdAt: string;
  valid: boolean;
  materialCount: number;
  materials: McpMaterialDefinition[];
  assignments: McpMaterialAssignment[];
  issues: McpMaterialIssue[];
}

export interface McpMaterializedGeometry {
  geometry: McpGeometryReport;
  materialPlan: McpMaterialPlanReport;
}

const placeholderColors = ["#8b7355", "#6b7280", "#8b5cf6", "#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#0f766e"];

function sanitizeMaterialName(value: string, fallback: string): string {
  const safeName = value.trim().toLowerCase().replace(/[^a-z0-9_\-]+/g, "_").replace(/^_+|_+$/g, "");
  return safeName || fallback;
}

function titleCase(value: string): string {
  return value
    .split(/[_\-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferFallbackMaterial(cube: McpGeometryCube): string {
  const hints = (cube.name + " " + cube.group + " " + cube.material).toLowerCase();

  if (hints.includes("wood") || hints.includes("plank") || hints.includes("log")) return "wood_material";
  if (hints.includes("stone") || hints.includes("rock") || hints.includes("brick")) return "stone_material";
  if (hints.includes("metal") || hints.includes("iron") || hints.includes("gold")) return "metal_material";
  if (hints.includes("crystal") || hints.includes("gem") || hints.includes("magic")) return "crystal_material";
  if (hints.includes("glass") || hints.includes("light")) return "glass_material";
  if (cube.group === "base") return "base_material";
  if (cube.group === "head") return "head_material";
  if (cube.group === "accessories" || cube.group === "decorative_details") return "accent_material";
  return "main_material";
}

function normalizeCubeMaterial(cube: McpGeometryCube): string {
  return sanitizeMaterialName(cube.material, inferFallbackMaterial(cube));
}

function getPlaceholderColor(index: number): string {
  return placeholderColors[index % placeholderColors.length];
}

function buildMaterialDefinitions(assignments: McpMaterialAssignment[]): McpMaterialDefinition[] {
  const map = new Map<string, McpMaterialDefinition>();

  for (const assignment of assignments) {
    const existing = map.get(assignment.normalizedMaterial);
    if (existing) {
      existing.cubeCount += 1;
      if (!existing.sourceNames.includes(assignment.originalMaterial)) existing.sourceNames.push(assignment.originalMaterial);
      continue;
    }

    map.set(assignment.normalizedMaterial, {
      name: assignment.normalizedMaterial,
      displayName: titleCase(assignment.normalizedMaterial),
      placeholderColor: getPlaceholderColor(map.size),
      cubeCount: 1,
      sourceNames: [assignment.originalMaterial]
    });
  }

  return Array.from(map.values()).sort((left, right) => left.name.localeCompare(right.name));
}

function buildAssignments(cubes: McpGeometryCube[]): McpMaterialAssignment[] {
  return cubes.map((cube) => ({
    cubeName: cube.name,
    group: cube.group,
    originalMaterial: cube.material,
    normalizedMaterial: normalizeCubeMaterial(cube)
  }));
}

function applyAssignmentsToCubes(cubes: McpGeometryCube[], assignments: McpMaterialAssignment[]): McpGeometryCube[] {
  const assignmentMap = new Map(assignments.map((assignment) => [assignment.cubeName + "::" + assignment.group, assignment]));

  return cubes.map((cube) => {
    const assignment = assignmentMap.get(cube.name + "::" + cube.group);
    return {
      ...cube,
      material: assignment?.normalizedMaterial ?? normalizeCubeMaterial(cube)
    };
  });
}

function collectIssues(assignments: McpMaterialAssignment[]): McpMaterialIssue[] {
  const issues: McpMaterialIssue[] = [];

  for (const assignment of assignments) {
    if (assignment.originalMaterial !== assignment.normalizedMaterial) {
      issues.push({
        severity: "warning",
        code: "MATERIAL_NAME_NORMALIZED",
        message:
          "Material for cube " +
          assignment.cubeName +
          " was normalized from " +
          assignment.originalMaterial +
          " to " +
          assignment.normalizedMaterial +
          "."
      });
    }
  }

  return issues;
}

function toGeometryIssues(materialIssues: McpMaterialIssue[]): McpGeometryIssue[] {
  return materialIssues.map((issue) => ({
    severity: issue.severity,
    code: issue.code,
    message: issue.message
  }));
}

export function applyMcpMaterialPlaceholders(geometry: McpGeometryReport): McpMaterializedGeometry {
  const assignments = buildAssignments(geometry.cubes);
  const materials = buildMaterialDefinitions(assignments);
  const issues = collectIssues(assignments);
  const cubes = applyAssignmentsToCubes(geometry.cubes, assignments);

  const materialPlan: McpMaterialPlanReport = {
    createdAt: new Date().toISOString(),
    valid: !issues.some((issue) => issue.severity === "error"),
    materialCount: materials.length,
    materials,
    assignments,
    issues
  };

  return {
    geometry: {
      ...geometry,
      cubes,
      issues: [...geometry.issues, ...toGeometryIssues(issues)],
      valid: geometry.valid && materialPlan.valid
    },
    materialPlan
  };
}

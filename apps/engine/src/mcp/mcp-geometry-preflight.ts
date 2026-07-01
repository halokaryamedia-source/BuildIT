import type { McpGeometryCube, McpGeometryIssue, McpGeometryReport } from "./mcp-geometry-planner.js";

export interface McpGeometryPreflightMetric {
  name: string;
  value: number;
  status: "pass" | "warn" | "fail";
  message: string;
}

export interface McpGeometryPreflightReport {
  score: number;
  status: "ready" | "warning" | "blocked";
  metrics: McpGeometryPreflightMetric[];
}

function getAxisSize(cubes: McpGeometryCube[], axis: 0 | 1 | 2): number {
  if (cubes.length === 0) return 0;

  const min = Math.min(...cubes.map((cube) => cube.from[axis]));
  const max = Math.max(...cubes.map((cube) => cube.to[axis]));
  return max - min;
}

function getUniqueGroupCount(cubes: McpGeometryCube[]): number {
  return new Set(cubes.map((cube) => cube.group)).size;
}

function createMetric(name: string, value: number, status: McpGeometryPreflightMetric["status"], message: string): McpGeometryPreflightMetric {
  return { name, value, status, message };
}

function scoreMetric(metric: McpGeometryPreflightMetric): number {
  if (metric.status === "pass") return 20;
  if (metric.status === "warn") return 10;
  return 0;
}

function evaluateCubeCount(report: McpGeometryReport): McpGeometryPreflightMetric {
  const cubeCount = report.cubeCount;

  if (cubeCount === 0) return createMetric("cube_count", cubeCount, "fail", "No cubes are available for MCP execution.");
  if (cubeCount < 2) return createMetric("cube_count", cubeCount, "warn", "Geometry has very few cubes and may look too simple.");
  if (cubeCount > 80) return createMetric("cube_count", cubeCount, "warn", "Geometry has many cubes and may be heavy for early MCP execution.");

  return createMetric("cube_count", cubeCount, "pass", "Cube count is in a safe range.");
}

function evaluateGroupCoverage(report: McpGeometryReport): McpGeometryPreflightMetric {
  const groupCount = getUniqueGroupCount(report.cubes);

  if (groupCount === 0) return createMetric("group_coverage", groupCount, "fail", "No cube groups are available.");
  if (groupCount === 1) return createMetric("group_coverage", groupCount, "warn", "All cubes are in one group. Structure may be hard to maintain.");

  return createMetric("group_coverage", groupCount, "pass", "Geometry uses multiple groups.");
}

function evaluateHeight(report: McpGeometryReport): McpGeometryPreflightMetric {
  const height = getAxisSize(report.cubes, 1);
  const minimum = report.format === "bedrock_block" ? 4 : 8;

  if (height <= 0) return createMetric("height", height, "fail", "Geometry has no vertical size.");
  if (height < minimum) return createMetric("height", height, "warn", "Geometry height may be too low for the selected format.");

  return createMetric("height", height, "pass", "Geometry height is acceptable.");
}

function evaluateFootprint(report: McpGeometryReport): McpGeometryPreflightMetric {
  const width = getAxisSize(report.cubes, 0);
  const depth = getAxisSize(report.cubes, 2);
  const footprint = Math.min(width, depth);
  const minimum = report.format === "bedrock_block" ? 4 : 2;

  if (footprint <= 0) return createMetric("footprint", footprint, "fail", "Geometry has no horizontal footprint.");
  if (footprint < minimum) return createMetric("footprint", footprint, "warn", "Geometry footprint may be too narrow for clear preview.");

  return createMetric("footprint", footprint, "pass", "Geometry footprint is acceptable.");
}

function evaluateWarnings(report: McpGeometryReport): McpGeometryPreflightMetric {
  const warningCount = report.issues.filter((issue) => issue.severity === "warning").length;
  const errorCount = report.issues.filter((issue) => issue.severity === "error").length;

  if (errorCount > 0) return createMetric("geometry_issues", errorCount, "fail", "Geometry has blocking errors.");
  if (warningCount > 6) return createMetric("geometry_issues", warningCount, "warn", "Geometry has several warnings that should be reviewed.");

  return createMetric("geometry_issues", warningCount, "pass", "Geometry issue count is acceptable.");
}

function resolveStatus(metrics: McpGeometryPreflightMetric[]): McpGeometryPreflightReport["status"] {
  if (metrics.some((metric) => metric.status === "fail")) return "blocked";
  if (metrics.some((metric) => metric.status === "warn")) return "warning";
  return "ready";
}

export function evaluateGeometryPreflight(report: McpGeometryReport): McpGeometryPreflightReport {
  const metrics = [
    evaluateCubeCount(report),
    evaluateGroupCoverage(report),
    evaluateHeight(report),
    evaluateFootprint(report),
    evaluateWarnings(report)
  ];
  const score = metrics.reduce((total, metric) => total + scoreMetric(metric), 0);

  return {
    score,
    status: resolveStatus(metrics),
    metrics
  };
}

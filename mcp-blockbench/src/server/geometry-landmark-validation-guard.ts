/// <reference types="blockbench-types" />

import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  resolveCubeWorldAnchor,
  type AnchorSelector,
} from "@/lib/renderedGeometry";
import type { Vec3 } from "@/lib/worldBounds";

interface ToolDefinitionLike {
  execute: (args: Record<string, unknown>, context?: ToolContext) => Promise<unknown>;
}

interface LandmarkContract {
  id?: string;
  cube_patterns?: string[];
  anchor?: AnchorSelector;
  expected_world_point?: Vec3;
  expected_world_range?: { min?: Vec3; max?: Vec3 };
  target_patterns?: string[];
  target_anchor?: AnchorSelector;
  maximum_distance_units?: number;
  required?: boolean;
  severity?: "WARNING" | "REVISION_REQUIRED";
}

interface LandmarkResult {
  id: string;
  status: "PASS" | "WARNING" | "REVISION_REQUIRED";
  cube: string | null;
  source: string | null;
  actual_world_point: Vec3 | null;
  expected_world_point: Vec3 | null;
  target_cube: string | null;
  target_world_point: Vec3 | null;
  distance_units: number | null;
  maximum_distance_units: number | null;
  issues: string[];
}

let installed = false;

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const value = requireNativeModule("fs", {
    message:
      "Semantic landmark validation needs approved reference contracts and Geometry report access.",
    optional: false,
  });
  if (!value) throw new Error("Filesystem access was denied.");
  return value as unknown as NativeFsLike;
}

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function structuredContent(result: unknown): Record<string, any> | null {
  if (!result || typeof result !== "object") return null;
  const value = (result as Record<string, any>).structuredContent;
  return value && typeof value === "object" ? value : null;
}

function patterns(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(String).filter((item) => item.length > 0)
    : [];
}

function matches(name: string, candidates: string[]): boolean {
  const normalized = name.toLowerCase();
  return candidates.some((candidate) =>
    normalized.includes(candidate.toLowerCase())
  );
}

function findCube(candidates: string[]): Cube | null {
  if (!candidates.length) return null;
  return (
    (Cube.all ?? []).find((cube) => matches(cube.name, candidates)) ?? null
  );
}

function finitePoint(value: unknown): Vec3 | null {
  if (!Array.isArray(value) || value.length < 3) return null;
  const point: Vec3 = [Number(value[0]), Number(value[1]), Number(value[2])];
  return point.every(Number.isFinite) ? point : null;
}

function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function outsideRange(
  point: Vec3,
  range: { min?: Vec3; max?: Vec3 } | undefined
): number {
  if (!range) return 0;
  const minimum = finitePoint(range.min);
  const maximum = finitePoint(range.max);
  if (!minimum || !maximum) return 0;
  let squared = 0;
  for (let axis = 0; axis < 3; axis += 1) {
    const low = Math.min(minimum[axis], maximum[axis]);
    const high = Math.max(minimum[axis], maximum[axis]);
    const delta =
      point[axis] < low
        ? low - point[axis]
        : point[axis] > high
          ? point[axis] - high
          : 0;
    squared += delta * delta;
  }
  return Math.sqrt(squared);
}

function anchor(value: unknown): AnchorSelector {
  if (
    Array.isArray(value) &&
    value.length >= 3 &&
    value.every((item) => ["min", "center", "max"].includes(String(item)))
  ) {
    return [
      String(value[0]) as AnchorSelector[0],
      String(value[1]) as AnchorSelector[1],
      String(value[2]) as AnchorSelector[2],
    ];
  }
  return ["center", "center", "center"];
}

export function evaluateGeometryLandmarks(
  contracts: LandmarkContract[]
): LandmarkResult[] {
  return contracts.map((contract, index) => {
    const id = String(contract.id ?? `landmark_${index + 1}`);
    const required = contract.required !== false;
    const severity = contract.severity ?? "REVISION_REQUIRED";
    const cube = findCube(patterns(contract.cube_patterns));
    const issues: string[] = [];
    if (!cube) {
      if (required) issues.push("LANDMARK_CUBE_MISSING");
      return {
        id,
        status: required ? severity : "WARNING",
        cube: null,
        source: null,
        actual_world_point: null,
        expected_world_point: finitePoint(contract.expected_world_point),
        target_cube: null,
        target_world_point: null,
        distance_units: null,
        maximum_distance_units: contract.maximum_distance_units ?? null,
        issues,
      };
    }

    const resolved = resolveCubeWorldAnchor(cube, anchor(contract.anchor));
    const actual = resolved.point;
    const expected = finitePoint(contract.expected_world_point);
    const target = findCube(patterns(contract.target_patterns));
    const targetResolved = target
      ? resolveCubeWorldAnchor(target, anchor(contract.target_anchor))
      : null;
    const expectedDistance = expected ? distance(actual, expected) : 0;
    const rangeDistance = outsideRange(actual, contract.expected_world_range);
    const targetDistance = targetResolved
      ? distance(actual, targetResolved.point)
      : 0;
    const measured = Math.max(expectedDistance, rangeDistance, targetDistance);
    const maximum = Number(contract.maximum_distance_units ?? 0.5);

    if (patterns(contract.target_patterns).length && !target) {
      issues.push("LANDMARK_TARGET_MISSING");
    }
    if (expected && expectedDistance > maximum) {
      issues.push("LANDMARK_POINT_MISMATCH");
    }
    if (rangeDistance > maximum) {
      issues.push("LANDMARK_RANGE_MISMATCH");
    }
    if (targetResolved && targetDistance > maximum) {
      issues.push("LANDMARK_CONNECTION_GAP");
    }

    return {
      id,
      status: issues.length ? severity : "PASS",
      cube: cube.name,
      source: resolved.source,
      actual_world_point: actual,
      expected_world_point: expected,
      target_cube: target?.name ?? null,
      target_world_point: targetResolved?.point ?? null,
      distance_units: measured,
      maximum_distance_units: maximum,
      issues,
    };
  });
}

function contractList(manifest: Record<string, any>): LandmarkContract[] {
  const values =
    manifest.geometry?.landmarks ??
    manifest.visual_grounding?.landmarks ??
    manifest.geometry?.semantic_landmarks ??
    [];
  return Array.isArray(values) ? values : [];
}

function applyLandmarkResults(
  structured: Record<string, any>,
  landmarks: LandmarkResult[]
): void {
  const issues = landmarks.flatMap((landmark) =>
    landmark.issues.map((code) => ({
      code,
      stage: "GEOMETRY",
      severity: landmark.status,
      message: `${landmark.id}: ${code}; measured ${landmark.distance_units ?? "unknown"}u, maximum ${landmark.maximum_distance_units ?? "unknown"}u.`,
      landmark_id: landmark.id,
      cube: landmark.cube,
      target_cube: landmark.target_cube,
    }))
  );
  structured.semantic_landmarks = {
    configured: landmarks.length > 0,
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? "REVISION_REQUIRED"
      : issues.length
        ? "WARNING"
        : "PASS",
    landmarks,
    issues,
  };
  structured.issues = [...(structured.issues ?? []), ...issues];
  if (issues.some((issue) => issue.severity === "REVISION_REQUIRED")) {
    structured.result = "REVISION_REQUIRED";
  }
}

export function installGeometryLandmarkValidationGuard(): void {
  if (installed) return;
  const definition = getAllToolDefinitions()["validate_geometry_contract"] as
    | ToolDefinitionLike
    | undefined;
  if (!definition) throw new Error("validate_geometry_contract is unavailable.");
  const execute = definition.execute;
  definition.execute = async (args, context) => {
    const result = await execute(args, context);
    const structured = structuredContent(result);
    const sessionRoot =
      typeof args.session_root === "string" ? args.session_root : null;
    if (!structured || !sessionRoot) return result;

    const fs = nativeFs();
    const manifestPath = joinPath(
      sessionRoot,
      "references/reference_manifest.json"
    );
    assertInsideRoot(manifestPath, sessionRoot);
    const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
    const landmarks = evaluateGeometryLandmarks(contractList(manifest));
    applyLandmarkResults(structured, landmarks);

    const reportPath = joinPath(
      sessionRoot,
      "evidence/geometry/geometry_report.json"
    );
    assertInsideRoot(reportPath, sessionRoot);
    if (fs.existsSync(reportPath)) {
      const report = readJsonFile<Record<string, any>>(fs, reportPath);
      applyLandmarkResults(report, landmarks);
      writeJsonAtomically(fs, reportPath, report);
    }
    return result;
  };
  installed = true;
}

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n", encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(
            f"{path}: expected one anchor, found {count}: {old[:120]!r}"
        )
    write(path, source.replace(old, new, 1))


# ---------------------------------------------------------------------------
# 1. Enforce a real internal primary-form phase.
# ---------------------------------------------------------------------------

runtime_path = "mcp-blockbench/src/lib/geometryRuntime.ts"
runtime = read(runtime_path)

runtime = runtime.replace(
    '  "rotate_cube_about_attachment",\n]);',
    '  "rotate_cube_about_attachment",\n]);',
    1,
)

anchor = '''function mutationContainsRotation(
  toolName: string,
  args: Record<string, unknown>
): boolean {'''
if anchor not in runtime:
    raise RuntimeError("geometryRuntime mutation anchor missing")

helpers = r'''export type GeometryManifestRole =
  | "PRIMARY_MASS"
  | "PROVISIONAL_SUPPORT"
  | "STRUCTURAL_DETAIL";

interface GeometryRoleConstraint {
  id?: string;
  role?: GeometryManifestRole;
  name_patterns?: string[];
}

export function classifyGeometryManifestRole(
  name: string,
  constraints: GeometryRoleConstraint[]
): GeometryManifestRole | null {
  const normalized = name.toLowerCase();
  for (const constraint of constraints) {
    const patterns = Array.isArray(constraint.name_patterns)
      ? constraint.name_patterns
      : [];
    if (
      constraint.role &&
      patterns.some((pattern) => normalized.includes(String(pattern).toLowerCase()))
    ) {
      return constraint.role;
    }
  }
  return null;
}

function requestedMutationNames(
  toolName: string,
  args: Record<string, unknown>
): string[] {
  if (toolName === "place_cubes_safe" && Array.isArray(args.elements)) {
    return args.elements
      .map((element) =>
        element && typeof element === "object"
          ? String((element as Record<string, unknown>).name ?? "")
          : ""
      )
      .filter(Boolean);
  }
  if (toolName === "modify_cubes" && Array.isArray(args.changes)) {
    return args.changes
      .map((change) =>
        change && typeof change === "object"
          ? String((change as Record<string, unknown>).name ?? "")
          : ""
      )
      .filter(Boolean);
  }
  if (toolName === "rename_element") {
    return typeof args.new_name === "string" ? [args.new_name] : [];
  }
  if (toolName === "duplicate_element") {
    if (typeof args.newName === "string" && args.newName.length > 0) {
      return [args.newName];
    }
    const id = String(args.id ?? "");
    const source = (Cube.all ?? []).find(
      (cube) => cube.uuid === id || cube.name === id
    );
    return source ? [source.name] : [];
  }
  return [];
}

function primaryFormManifest(fs: NativeFsLike, sessionRoot: string): {
  constraints: GeometryRoleConstraint[];
  maximumCubes: number;
  allowUnclassified: boolean;
} {
  const path = joinPath(sessionRoot, "references/reference_manifest.json");
  if (!fs.existsSync(path)) {
    return { constraints: [], maximumCubes: 28, allowUnclassified: false };
  }
  const manifest = readJsonFile<Record<string, any>>(fs, path);
  const gate = manifest.geometry?.primary_form_gate ?? {};
  return {
    constraints: Array.isArray(manifest.geometry?.part_constraints)
      ? manifest.geometry.part_constraints
      : [],
    maximumCubes:
      Number.isFinite(Number(gate.maximum_cubes)) && Number(gate.maximum_cubes) > 0
        ? Number(gate.maximum_cubes)
        : 28,
    allowUnclassified: gate.allow_unclassified_parts === true,
  };
}

'''
runtime = runtime.replace(anchor, helpers + anchor, 1)

old_comment = '''/**
 * Geometry phases are internal progress markers, not user-facing gates.
 * The only hard mutation guard here is contract-driven rotation safety.
 * Any edit after FINAL_REVIEW_READY automatically makes review evidence stale
 * and returns the runtime to normal working mode.
 */'''
new_comment = '''/**
 * Geometry phases remain internal and do not add a user approval or profile.
 * PRIMARY_FORM is nevertheless a deterministic mutation boundary: only
 * manifest-classified PRIMARY_MASS and PROVISIONAL_SUPPORT cuboids may be
 * created until verify_primary_form_ready passes. This prevents detail-first
 * builds from hiding a broken silhouette. Rotation safety remains mandatory.
 * Any edit after FINAL_REVIEW_READY makes review evidence stale.
 */'''
if old_comment not in runtime:
    raise RuntimeError("geometryRuntime phase comment missing")
runtime = runtime.replace(old_comment, new_comment, 1)

old_guard = '''  if (mutationContainsRotation(toolName, args)) {
    throw new Error(
      "ROTATION_CONTRACT_TOOL_REQUIRED: place or modify cubes without rotation, then use rotate_cube_about_attachment so pivot, direction, connection, and before/after visual score are verified."
    );
  }

  if (runtime.phase === "FINAL_REVIEW_READY") {'''
new_guard = '''  if (mutationContainsRotation(toolName, args)) {
    throw new Error(
      "ROTATION_CONTRACT_TOOL_REQUIRED: place or modify cubes without rotation, then use rotate_cube_about_attachment so pivot, direction, connection, and before/after visual score are verified."
    );
  }

  if (runtime.phase === "PRIMARY_FORM") {
    const manifest = primaryFormManifest(fs, sessionRoot);
    const requestedNames = requestedMutationNames(toolName, args);
    for (const name of requestedNames) {
      const role = classifyGeometryManifestRole(name, manifest.constraints);
      if (role === "STRUCTURAL_DETAIL") {
        throw new Error(
          `GEOMETRY_PRIMARY_FORM_NOT_READY: ${name} is STRUCTURAL_DETAIL. Correct body, neck, head, and leg support; apply required primary rotations; then call verify_primary_form_ready before adding detail.`
        );
      }
      if (!role && !manifest.allowUnclassified) {
        throw new Error(
          `GEOMETRY_PRIMARY_FORM_UNCLASSIFIED_PART: ${name} does not match a PRIMARY_MASS or PROVISIONAL_SUPPORT manifest constraint.`
        );
      }
    }

    if (toolName === "place_cubes_safe") {
      const requested = Array.isArray(args.elements) ? args.elements.length : 0;
      if (Cube.all.length + requested > manifest.maximumCubes) {
        throw new Error(
          `GEOMETRY_PRIMARY_FORM_CUBE_BUDGET_EXCEEDED: ${Cube.all.length + requested} exceeds ${manifest.maximumCubes}. Refine existing primary cuboids instead of adding detail.`
        );
      }
    }
  }

  if (runtime.phase === "FINAL_REVIEW_READY") {'''
if old_guard not in runtime:
    raise RuntimeError("geometryRuntime guard anchor missing")
runtime = runtime.replace(old_guard, new_guard, 1)

end_anchor = '''export function readGeometryRuntimeContext(
  sessionRoot: string
): GeometryRuntimeState {
  return readRuntime(nativeFs(), sessionRoot);
}'''
end_replacement = '''export function markPrimaryFormReady(
  sessionRoot: string,
  details: Record<string, unknown>
): GeometryRuntimeState {
  const fs = nativeFs();
  const runtime = readRuntime(fs, sessionRoot);
  runtime.phase = "STRUCTURAL_DETAIL";
  runtime.revision_mode = null;
  runtime.rebuild_mode = false;
  runtime.recommended_scope = null;
  runtime.attention_required = false;
  runtime.last_issues = [];
  runtime.rebuild_preparation = {
    ...(runtime.rebuild_preparation ?? {}),
    primary_form_gate: details,
  };
  writeRuntime(fs, sessionRoot, runtime);
  return runtime;
}

export function readGeometryRuntimeContext(
  sessionRoot: string
): GeometryRuntimeState {
  return readRuntime(nativeFs(), sessionRoot);
}'''
if end_anchor not in runtime:
    raise RuntimeError("geometryRuntime end anchor missing")
runtime = runtime.replace(end_anchor, end_replacement, 1)
write(runtime_path, runtime)

# ---------------------------------------------------------------------------
# 2. Add verify_primary_form_ready.
# ---------------------------------------------------------------------------

primary_gate_source = r'''/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  evaluateGeometryBlueprint,
  type BlueprintElement,
} from "@/lib/geometryBlueprint";
import { markPrimaryFormReady } from "@/lib/geometryRuntime";
import { transformedCubeCorners } from "@/lib/worldBounds";

const parameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().min(1),
});

export const geometryPrimaryGateToolDocs: ToolSpec[] = [
  {
    name: "verify_primary_form_ready",
    description:
      "Verifies that manifest PRIMARY_MASS and PROVISIONAL_SUPPORT geometry, required primary rotations, ground contacts, cube budget, and left/front/top fixed-scale scores are ready before structural detail is allowed. This is an internal phase gate, not a user review.",
    annotations: {
      title: "Verify Primary Form Ready",
      readOnlyHint: false,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_STABLE,
  },
];

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Primary-form verification needs manifest and Geometry metrics access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function normalized(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

function matches(name: string, patterns: unknown): boolean {
  return Array.isArray(patterns) &&
    patterns.some((pattern) => normalized(name).includes(normalized(pattern)));
}

function parentName(cube: Cube): string | null {
  const parent = cube.parent as unknown as { name?: string } | "root";
  return parent && parent !== "root" ? parent.name ?? null : "root";
}

function currentElements(): BlueprintElement[] {
  return (Cube.all ?? []).map((cube) => ({
    name: cube.name,
    parent_name: parentName(cube),
    visibility: cube.visibility,
    export: cube.export,
    world_corners: transformedCubeCorners(cube as any),
  }));
}

function cubeHasContractRotation(cube: Cube, contract: Record<string, any>): boolean {
  if (!matches(cube.name, contract.cube_patterns)) return false;
  const axis = String(contract.allowed_axis ?? "x");
  const index = axis === "y" ? 1 : axis === "z" ? 2 : 0;
  const angle = Number(cube.rotation?.[index] ?? 0);
  const otherAxes = [0, 1, 2].filter((candidate) => candidate !== index);
  return (
    Number.isFinite(angle) &&
    angle >= Number(contract.minimum_degrees) &&
    angle <= Number(contract.maximum_degrees) &&
    otherAxes.every((candidate) => Math.abs(Number(cube.rotation?.[candidate] ?? 0)) <= 1e-6)
  );
}

function cubeMinimumY(cube: Cube): number {
  return Math.min(...transformedCubeCorners(cube as any).map((point) => point[1]));
}

export function registerGeometryPrimaryGateTools(): void {
  createTool(
    geometryPrimaryGateToolDocs[0].name,
    {
      ...geometryPrimaryGateToolDocs[0],
      async execute({ session_root, expected_project_uuid }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const fs = nativeFs();
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        const metricsPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_metrics.json"
        );
        for (const path of [manifestPath, metricsPath]) {
          assertInsideRoot(path, session_root);
        }
        if (!fs.existsSync(metricsPath)) {
          throw new Error(
            "GEOMETRY_PRIMARY_FORM_DIAGNOSIS_MISSING: analyze left_side, front, and top_footprint first."
          );
        }

        const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
        const metrics = readJsonFile<Record<string, any>>(fs, metricsPath);
        const gate = manifest.geometry?.primary_form_gate ?? {};
        const allConstraints = Array.isArray(manifest.geometry?.part_constraints)
          ? manifest.geometry.part_constraints
          : [];
        const primaryConstraints = allConstraints.filter((constraint: any) =>
          ["PRIMARY_MASS", "PROVISIONAL_SUPPORT"].includes(
            String(constraint?.role ?? "")
          )
        );
        const blueprint = evaluateGeometryBlueprint(
          currentElements(),
          primaryConstraints
        );
        const issues: Array<Record<string, unknown>> = blueprint.issues.map(
          (issue) => ({ ...issue, source: "PRIMARY_BLUEPRINT" })
        );

        const maximumCubes = Number.isFinite(Number(gate.maximum_cubes))
          ? Number(gate.maximum_cubes)
          : 28;
        if (Cube.all.length > maximumCubes) {
          issues.push({
            code: "GEOMETRY_PRIMARY_FORM_CUBE_BUDGET_EXCEEDED",
            actual: Cube.all.length,
            maximum: maximumCubes,
          });
        }

        const requiredViews: string[] = Array.isArray(gate.required_views)
          ? gate.required_views.map(String)
          : ["left_side", "front", "top_footprint"];
        const minimumScore = Number.isFinite(Number(gate.minimum_view_score))
          ? Number(gate.minimum_view_score)
          : 0.48;
        const maximumExtentDelta = Number.isFinite(
          Number(gate.maximum_extent_delta_units)
        )
          ? Number(gate.maximum_extent_delta_units)
          : 5;
        const measured = new Map<string, any>(
          (Array.isArray(metrics.views) ? metrics.views : []).map((view: any) => [
            String(view?.view ?? ""),
            view,
          ])
        );
        for (const view of requiredViews) {
          const metric = measured.get(view);
          if (!metric) {
            issues.push({ code: "PRIMARY_VIEW_MISSING", view });
            continue;
          }
          if (Number(metric.score ?? 0) < minimumScore) {
            issues.push({
              code: "PRIMARY_VIEW_SCORE_LOW",
              view,
              score: Number(metric.score ?? 0),
              minimum: minimumScore,
            });
          }
          for (const direction of ["width", "height"] as const) {
            const delta = Math.abs(
              Number(metric.edge_delta_units?.[direction] ?? 0)
            );
            if (delta > maximumExtentDelta) {
              issues.push({
                code: "PRIMARY_VIEW_EXTENT_MISMATCH",
                view,
                direction,
                delta_units: delta,
                maximum_units: maximumExtentDelta,
              });
            }
          }
          if (metric.foreground_result === "REVISION_REQUIRED") {
            issues.push({ code: "PRIMARY_VIEW_FOREGROUND_FAILED", view });
          }
        }

        const contracts = manifest.geometry?.rotation_contracts ?? {};
        const explicitRequired: string[] = Array.isArray(
          gate.required_rotation_contracts
        )
          ? gate.required_rotation_contracts.map(String)
          : [];
        const inferredRequired = primaryConstraints
          .map((constraint: any) => String(constraint.rotation_contract ?? ""))
          .filter(Boolean)
          .filter((id: string) => {
            const contract = contracts[id];
            return (
              contract &&
              !(Number(contract.minimum_degrees) <= 0 &&
                Number(contract.maximum_degrees) >= 0)
            );
          });
        const requiredContracts = Array.from(
          new Set([...explicitRequired, ...inferredRequired])
        );
        for (const id of requiredContracts) {
          const contract = contracts[id];
          if (!contract) {
            issues.push({ code: "PRIMARY_ROTATION_CONTRACT_MISSING", contract: id });
            continue;
          }
          if (!(Cube.all ?? []).some((cube) => cubeHasContractRotation(cube, contract))) {
            issues.push({ code: "PRIMARY_ROTATION_NOT_APPLIED", contract: id });
          }
        }

        const groundTolerance = Number.isFinite(Number(gate.ground_tolerance_units))
          ? Number(gate.ground_tolerance_units)
          : 0.25;
        for (const name of manifest.geometry?.ground_contacts ?? []) {
          const cube = (Cube.all ?? []).find((candidate) => candidate.name === name);
          if (!cube) {
            issues.push({ code: "PRIMARY_GROUND_CONTACT_MISSING", part: name });
            continue;
          }
          const minimumY = cubeMinimumY(cube);
          if (Math.abs(minimumY) > groundTolerance) {
            issues.push({
              code: "PRIMARY_GROUND_CONTACT_FAILED",
              part: name,
              minimum_y: minimumY,
              tolerance: groundTolerance,
            });
          }
        }

        const result = issues.length === 0 ? "PASS" : "REVISION_REQUIRED";
        const runtime =
          result === "PASS"
            ? markPrimaryFormReady(session_root, {
                verified_at: new Date().toISOString(),
                required_views: requiredViews,
                minimum_view_score: minimumScore,
                required_rotation_contracts: requiredContracts,
                cube_count: Cube.all.length,
              })
            : null;

        return {
          content: [
            {
              type: "text",
              text:
                result === "PASS"
                  ? "Primary form passed. Structural detail is now allowed."
                  : `Primary form needs revision: ${issues
                      .map((issue) => issue.code)
                      .join(", ")}.`,
            },
          ],
          structuredContent: {
            status: result,
            result,
            primary_blueprint: blueprint,
            required_views: requiredViews,
            minimum_view_score: minimumScore,
            required_rotation_contracts: requiredContracts,
            issues,
            runtime,
            next_action:
              result === "PASS"
                ? "BUILD_STRUCTURAL_DETAIL"
                : "REPAIR_PRIMARY_FORM_ONLY",
          },
        };
      },
    },
    geometryPrimaryGateToolDocs[0].status
  );
}
'''
write(
    "mcp-blockbench/src/server/tools/geometry-primary-gate.ts",
    primary_gate_source,
)

# Register tool.
replace_once(
    "mcp-blockbench/src/server/tools.ts",
    'import { registerGeometryReviewSubmitTools } from "./tools/geometry-review-submit";\n',
    'import { registerGeometryReviewSubmitTools } from "./tools/geometry-review-submit";\nimport { registerGeometryPrimaryGateTools } from "./tools/geometry-primary-gate";\n',
)
replace_once(
    "mcp-blockbench/src/server/tools.ts",
    "  registerGeometryReviewSubmitTools,\n",
    "  registerGeometryReviewSubmitTools,\n  registerGeometryPrimaryGateTools,\n",
)

# Add profile tool.
profile_path = ROOT / "engines/shared/profiles/tool-profiles.json"
profiles = json.loads(profile_path.read_text(encoding="utf-8"))
geometry_tools = profiles["profiles"]["BEDROCK_CUBOID_GEOMETRY"]["allowed_tools"]
if "verify_primary_form_ready" not in geometry_tools:
    index = geometry_tools.index("analyze_geometry_views") + 1
    geometry_tools.insert(index, "verify_primary_form_ready")
for redundant_tool in ["redo", "get_undo_stack"]:
    if redundant_tool in geometry_tools:
        geometry_tools.remove(redundant_tool)
profile_path.write_text(json.dumps(profiles, indent=2) + "\n", encoding="utf-8")

# ---------------------------------------------------------------------------
# 3. Make reference segmentation adaptive.
# ---------------------------------------------------------------------------

analyzer_path = "mcp-blockbench/src/server/tools/geometry-analyzer.ts"
analyzer = read(analyzer_path)
segment_end = '''export function segmentReferencePixels(
  image: ImageData,
  threshold: number
): BinaryMask {
  const backgrounds = cornerSamples(image);
  const data = new Uint8Array(image.width * image.height);
  for (let pixel = 0; pixel < data.length; pixel += 1) {
    const source = pixel * 4;
    if (image.data[source + 3] < 32) continue;
    const red = image.data[source];
    const green = image.data[source + 1];
    const blue = image.data[source + 2];
    const minimum = Math.min(
      ...backgrounds.map((sample) => colorDistance(red, green, blue, sample))
    );
    if (minimum > threshold) data[pixel] = 1;
  }
  return retainRelevantForeground({ width: image.width, height: image.height, data });
}
'''
segment_replacement = segment_end + r'''
export function segmentReferencePixelsAdaptive(
  image: ImageData,
  preferredThreshold: number
): { mask: BinaryMask; threshold: number; attempts: number[] } {
  const attempts = Array.from(
    new Set([preferredThreshold, 24, 34, 48, 64, 80])
  ).filter((threshold) => threshold >= 8 && threshold <= 120);
  const errors: string[] = [];
  for (const threshold of attempts) {
    try {
      return {
        mask: segmentReferencePixels(image, threshold),
        threshold,
        attempts,
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(
    `REFERENCE_FOREGROUND_ADAPTIVE_FAILED: thresholds ${attempts.join(",")}; ${errors.join(" | ")}`
  );
}
'''
if segment_end not in analyzer:
    raise RuntimeError("geometry analyzer segmentation block missing")
analyzer = analyzer.replace(segment_end, segment_replacement, 1)

old_loop = '''          const segmented = segmentReferencePixels(
            imageDataFor(referenceImage, panel.crop_normalized),
            segmentation_threshold
          );
          const reference = referenceMaskOnFixedFrame({
            source: segmented,'''
new_loop = '''          const segmented = segmentReferencePixelsAdaptive(
            imageDataFor(referenceImage, panel.crop_normalized),
            segmentation_threshold
          );
          const reference = referenceMaskOnFixedFrame({
            source: segmented.mask,'''
if old_loop not in analyzer:
    raise RuntimeError("geometry analyzer segment call missing")
analyzer = analyzer.replace(old_loop, new_loop, 1)
write(analyzer_path, analyzer)

# ---------------------------------------------------------------------------
# 4. Rotation: structural fallback when visual segmentation is unavailable.
# ---------------------------------------------------------------------------

rotation_path = "mcp-blockbench/src/server/tools/geometry-rotation.ts"
rotation = read(rotation_path)

average_anchor = '''function averageScore(result: any): number | null {
  const metrics = result?.structuredContent?.metrics;
  if (!Array.isArray(metrics) || metrics.length === 0) return null;
  const scores = metrics
    .map((metric: any) => Number(metric?.score))
    .filter(Number.isFinite);
  if (!scores.length) return null;
  return scores.reduce((sum: number, score: number) => sum + score, 0) /
    scores.length;
}
'''
recoverable = average_anchor + r'''
function recoverableVisualAnalysisError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return [
    "REFERENCE_FOREGROUND_NOT_FOUND",
    "REFERENCE_FOREGROUND_RATIO_INVALID",
    "REFERENCE_FOREGROUND_ADAPTIVE_FAILED",
    "VISUAL_ANALYSIS_IMAGE_API_UNAVAILABLE",
    "VISUAL_ANALYSIS_IMAGE_LOAD_FAILED",
    "VISUAL_ANALYSIS_CANVAS_UNAVAILABLE",
    "VISUAL_ANALYSIS_CONTEXT_UNAVAILABLE",
  ].some((code) => message.includes(code));
}
'''
if average_anchor not in rotation:
    raise RuntimeError("rotation average anchor missing")
rotation = rotation.replace(average_anchor, recoverable, 1)

old_before = '''        const beforeResult = await analyzer.execute(
          {
            session_root,
            expected_project_uuid: Project.uuid,
            views: contract.affected_views,
            output_dir: joinPath(scratchRoot, "before"),
            return_diff_image: false,
            write_diff_image: false,
          },
          context
        );
        const beforeScore = averageScore(beforeResult);
'''
new_before = '''        let beforeResult: any = null;
        let beforeScore: number | null = null;
        const visualWarnings: string[] = [];
        try {
          beforeResult = await analyzer.execute(
            {
              session_root,
              expected_project_uuid: Project.uuid,
              views: contract.affected_views,
              output_dir: joinPath(scratchRoot, "before"),
              return_diff_image: false,
              write_diff_image: false,
            },
            context
          );
          beforeScore = averageScore(beforeResult);
        } catch (error) {
          if (!recoverableVisualAnalysisError(error)) throw error;
          visualWarnings.push(
            `ROTATION_VISUAL_PRECHECK_UNAVAILABLE: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
'''
if old_before not in rotation:
    raise RuntimeError("rotation before analyzer block missing")
rotation = rotation.replace(old_before, new_before, 1)

old_after = '''          const afterResult = await analyzer.execute(
            {
              session_root,
              expected_project_uuid: Project.uuid,
              views: contract.affected_views,
              output_dir: joinPath(scratchRoot, "after"),
              return_diff_image: false,
              write_diff_image: false,
            },
            context
          );
          const afterScore = averageScore(afterResult);
'''
new_after = '''          let afterResult: any = null;
          let afterScore: number | null = null;
          try {
            afterResult = await analyzer.execute(
              {
                session_root,
                expected_project_uuid: Project.uuid,
                views: contract.affected_views,
                output_dir: joinPath(scratchRoot, "after"),
                return_diff_image: false,
                write_diff_image: false,
              },
              context
            );
            afterScore = averageScore(afterResult);
          } catch (error) {
            if (!recoverableVisualAnalysisError(error)) throw error;
            visualWarnings.push(
              `ROTATION_VISUAL_POSTCHECK_UNAVAILABLE: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
          }
'''
if old_after not in rotation:
    raise RuntimeError("rotation after analyzer block missing")
rotation = rotation.replace(old_after, new_after, 1)

old_text = '''                text: `Rotated ${cube.name} by ${angle_degrees}° around ${contract.allowed_axis.toUpperCase()} using ${contract.id}. Direction, connection, and affected-view score passed.`,'''
new_text = '''                text:
                  visualWarnings.length === 0
                    ? `Rotated ${cube.name} by ${angle_degrees}° around ${contract.allowed_axis.toUpperCase()} using ${contract.id}. Direction, connection, and affected-view score passed.`
                    : `Rotated ${cube.name} by ${angle_degrees}° using ${contract.id}. Direction and connection passed; visual score was unavailable and must be regenerated before primary-form approval.`,'''
if old_text not in rotation:
    raise RuntimeError("rotation success text missing")
rotation = rotation.replace(old_text, new_text, 1)

old_structured = '''              before_report: beforeResult?.structuredContent?.report_path ?? null,
              after_report: afterResult?.structuredContent?.report_path ?? null,
'''
new_structured = '''              before_report: beforeResult?.structuredContent?.report_path ?? null,
              after_report: afterResult?.structuredContent?.report_path ?? null,
              visual_score_status:
                visualWarnings.length === 0
                  ? "PASS"
                  : "UNAVAILABLE_STRUCTURAL_FALLBACK",
              warnings: visualWarnings,
'''
if old_structured not in rotation:
    raise RuntimeError("rotation structured block missing")
rotation = rotation.replace(old_structured, new_structured, 1)
write(rotation_path, rotation)

# ---------------------------------------------------------------------------
# 5. Canonical model persistence.
# ---------------------------------------------------------------------------

project_path = "mcp-blockbench/src/server/tools/project.ts"
project = read(project_path)

project = project.replace(
    'import { STATUS_STABLE } from "@/lib/constants";\n',
    'import { STATUS_STABLE } from "@/lib/constants";\nimport {\n  parentDirectory,\n  readJsonFile,\n  writeFileAtomically,\n  type NativeFsLike,\n} from "@/lib/atomicFiles";\n',
    1,
)

param_anchor = '''  save_path: z.string().min(1).optional(),
});'''
param_replacement = '''  save_path: z.string().min(1).optional(),
  session_root: z.string().min(1).optional(),
  asset_id: z.string().regex(/^[a-z0-9_]+$/).optional(),
  persist_immediately: z.boolean().optional().default(true),
});'''
if param_anchor not in project:
    raise RuntimeError("project parameters anchor missing")
project = project.replace(param_anchor, param_replacement, 1)

helper_anchor = '''function getUvInfo() {'''
project_helpers = r'''function nativeFs(message: string): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
}

function canonicalProjectPath(sessionRoot: string, assetId: string): string {
  const activeRoot = parentDirectory(sessionRoot);
  if (!activeRoot) {
    throw new Error(`CANONICAL_SESSION_ROOT_INVALID: ${sessionRoot}`);
  }
  const separator = sessionRoot.includes("\\") && !sessionRoot.includes("/") ? "\\" : "/";
  return `${activeRoot}${separator}blockbench${separator}${assetId}.bbmodel`;
}

function projectCodecOutput(): string | Buffer {
  // @ts-ignore Blockbench runtime codec registry.
  const codec = Codecs.project as { compile?: (options?: unknown) => unknown; getExportOptions?: () => unknown };
  if (!codec || typeof codec.compile !== "function") {
    throw new Error('Blockbench project codec "project" is unavailable.');
  }
  const value = codec.compile(
    typeof codec.getExportOptions === "function" ? codec.getExportOptions() : undefined
  );
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function persistCanonicalProject(input: {
  savePath: string;
  sessionRoot: string;
  assetId: string;
}): { path: string; byte_length: number } {
  const fs = nativeFs(
    `MCP create_project needs canonical model write access to ${input.savePath}`
  );
  const statePath = `${input.sessionRoot.replace(/[\\/]$/, "")}/state.json`;
  const state = readJsonFile<Record<string, any>>(fs, statePath);
  if (state.asset?.id !== input.assetId) {
    throw new Error(
      `ASSET_ID_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${input.assetId}.`
    );
  }
  const expected = canonicalProjectPath(input.sessionRoot, input.assetId);
  if (normalizePath(input.savePath) !== normalizePath(expected)) {
    throw new Error(
      `CANONICAL_MODEL_PATH_MISMATCH: requested ${input.savePath}; expected ${expected}.`
    );
  }
  const recorded = String(state.project?.save_path ?? "");
  if (recorded && !normalizePath(expected).endsWith(normalizePath(recorded))) {
    throw new Error(
      `CANONICAL_MODEL_STATE_PATH_MISMATCH: state has ${recorded}; expected ${expected}.`
    );
  }
  const output = projectCodecOutput();
  writeFileAtomically(fs, expected, output);
  return {
    path: expected,
    byte_length: Buffer.isBuffer(output)
      ? output.byteLength
      : Buffer.byteLength(output, "utf8"),
  };
}

'''
if helper_anchor not in project:
    raise RuntimeError("project helper anchor missing")
project = project.replace(helper_anchor, project_helpers + helper_anchor, 1)

execute_signature = '''      async execute({ name, format, box_uv, texture_width, texture_height, save_path }) {'''
execute_replacement = '''      async execute({
        name,
        format,
        box_uv,
        texture_width,
        texture_height,
        save_path,
        session_root,
        asset_id,
        persist_immediately,
      }) {'''
if execute_signature not in project:
    raise RuntimeError("project execute signature missing")
project = project.replace(execute_signature, execute_replacement, 1)

old_snapshot = '''        const snapshot = projectSnapshot();
        return {
          content: [{
            type: "text" as const,
            text: `Created project ${snapshot.project.name} (${snapshot.project.uuid}) using ${snapshot.format.id} and ${snapshot.uv.mode} UV.`,
          }],
          structuredContent: { status: "PASS", ...snapshot },
        };'''
new_snapshot = '''        let canonicalSave: { path: string; byte_length: number } | null = null;
        if (save_path && persist_immediately) {
          if (!session_root || !asset_id) {
            throw new Error(
              "CANONICAL_PROJECT_PERSISTENCE_ARGUMENTS_REQUIRED: save_path needs session_root and asset_id."
            );
          }
          canonicalSave = persistCanonicalProject({
            savePath: save_path,
            sessionRoot: session_root,
            assetId: asset_id,
          });
        }

        const snapshot = projectSnapshot();
        return {
          content: [{
            type: "text" as const,
            text: canonicalSave
              ? `Created and persisted project ${snapshot.project.name} (${snapshot.project.uuid}) to ${canonicalSave.path}.`
              : `Created project ${snapshot.project.name} (${snapshot.project.uuid}) using ${snapshot.format.id} and ${snapshot.uv.mode} UV.`,
          }],
          structuredContent: {
            status: "PASS",
            ...snapshot,
            canonical_save: canonicalSave,
          },
        };'''
if old_snapshot not in project:
    raise RuntimeError("project snapshot block missing")
project = project.replace(old_snapshot, new_snapshot, 1)
write(project_path, project)

canonical_save_source = r'''/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  assertInsideRoot,
  parentDirectory,
  readJsonFile,
  writeFileAtomically,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";

const parameters = z.object({
  session_root: z.string().min(1),
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  expected_project_uuid: z.string().min(1),
});

export const canonicalProjectSaveToolDocs: ToolSpec[] = [
  {
    name: "save_canonical_project",
    description:
      "Compiles and atomically saves the active Blockbench project to the canonical workspace/active/<asset>/blockbench/<asset>.bbmodel path derived from the session root and state authority.",
    annotations: {
      title: "Save Canonical Blockbench Project",
      destructiveHint: false,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_STABLE,
  },
];

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function sha256(data: string | Buffer): string {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Canonical project save needs SHA-256 integrity metadata.",
    optional: false,
  }) as any;
  if (!crypto) throw new Error("Crypto access was denied.");
  return crypto.createHash("sha256").update(data).digest("hex");
}

function projectOutput(): string | Buffer {
  // @ts-ignore Blockbench runtime codec registry.
  const codec = Codecs.project as any;
  if (!codec || typeof codec.compile !== "function") {
    throw new Error('Blockbench project codec "project" is unavailable.');
  }
  const value = codec.compile(
    typeof codec.getExportOptions === "function" ? codec.getExportOptions() : undefined
  );
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export function registerCanonicalProjectSaveTools(): void {
  createTool(
    canonicalProjectSaveToolDocs[0].name,
    {
      ...canonicalProjectSaveToolDocs[0],
      async execute({ session_root, asset_id, expected_project_uuid }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        const fs = nativeFs("MCP canonical project save needs workspace write access.");
        const statePath = joinPath(session_root, "state.json");
        assertInsideRoot(statePath, session_root);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        if (state.asset?.id !== asset_id) {
          throw new Error(
            `ASSET_ID_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${asset_id}.`
          );
        }
        const activeRoot = parentDirectory(session_root);
        if (!activeRoot) {
          throw new Error(`CANONICAL_SESSION_ROOT_INVALID: ${session_root}`);
        }
        const canonicalPath = joinPath(
          activeRoot,
          `blockbench/${asset_id}.bbmodel`
        );
        const recorded = String(state.project?.save_path ?? "").replace(/\\/g, "/");
        if (
          recorded &&
          !canonicalPath.replace(/\\/g, "/").toLowerCase().endsWith(recorded.toLowerCase())
        ) {
          throw new Error(
            `CANONICAL_MODEL_STATE_PATH_MISMATCH: state has ${recorded}; derived ${canonicalPath}.`
          );
        }
        const output = projectOutput();
        writeFileAtomically(fs, canonicalPath, output);
        (Project as { save_path?: string }).save_path = canonicalPath;
        const byteLength = Buffer.isBuffer(output)
          ? output.byteLength
          : Buffer.byteLength(output, "utf8");
        const reportPath = joinPath(session_root, "reports/canonical-save.json");
        assertInsideRoot(reportPath, session_root);
        const report = {
          schema_version: "1.0",
          asset_id,
          project_uuid: Project.uuid,
          project_name: Project.name,
          path: canonicalPath,
          byte_length: byteLength,
          sha256: sha256(output),
          cube_count: Cube.all.length,
          group_count: Group.all.length,
          created_at: new Date().toISOString(),
        };
        writeJsonAtomically(fs, reportPath, report);
        return {
          content: [
            {
              type: "text",
              text: `Saved canonical project to ${canonicalPath}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            canonical_save: report,
            report_path: reportPath,
          },
        };
      },
    },
    canonicalProjectSaveToolDocs[0].status
  );
}
'''
write(
    "mcp-blockbench/src/server/tools/project-save.ts",
    canonical_save_source,
)
replace_once(
    "mcp-blockbench/src/server/tools.ts",
    'import { registerProjectTools } from "./tools/project";\n',
    'import { registerProjectTools } from "./tools/project";\nimport { registerCanonicalProjectSaveTools } from "./tools/project-save";\n',
)
replace_once(
    "mcp-blockbench/src/server/tools.ts",
    "  registerProjectTools,\n",
    "  registerProjectTools,\n  registerCanonicalProjectSaveTools,\n",
)

# Expose canonical save across production stages.
profiles = json.loads(profile_path.read_text(encoding="utf-8"))
for profile_id in [
    "BEDROCK_CUBOID_GEOMETRY",
    "BEDROCK_CUBOID_TEXTURE",
    "BEDROCK_CUBOID_ANIMATION",
    "FINAL_VALIDATION_READONLY",
]:
    tools = profiles["profiles"][profile_id]["allowed_tools"]
    if "save_canonical_project" not in tools:
        tools.append("save_canonical_project")
texture_tools = profiles["profiles"]["BEDROCK_CUBOID_TEXTURE"]["allowed_tools"]
if "save_project_checkpoint" in texture_tools:
    texture_tools.remove("save_project_checkpoint")
profile_path.write_text(json.dumps(profiles, indent=2) + "\n", encoding="utf-8")

# ---------------------------------------------------------------------------
# 6. Reconcile Animation requirement from the manifest at transition time.
# ---------------------------------------------------------------------------

workflow_path = "mcp-blockbench/src/server/tools/workflow.ts"
workflow = read(workflow_path)
transition_anchor = '''        const transition = resolveApprovedStageTransition(
          stage,
          state.workflow.animation_required === true
        );'''
transition_replacement = '''        const manifestAnimationRequired =
          String((manifest as any).animation?.status ?? "").toUpperCase() ===
            "ANIMATION_REQUIRED" ||
          (Array.isArray((manifest as any).animation?.required_clips) &&
            (manifest as any).animation.required_clips.length > 0);
        state.workflow.animation_required = manifestAnimationRequired;
        const transition = resolveApprovedStageTransition(
          stage,
          manifestAnimationRequired
        );'''
if transition_anchor not in workflow:
    raise RuntimeError("workflow animation transition anchor missing")
workflow = workflow.replace(transition_anchor, transition_replacement, 1)
write(workflow_path, workflow)

# ---------------------------------------------------------------------------
# 7. Connection recovery: one endpoint, longer timeout, retry, no reconnect.
# ---------------------------------------------------------------------------

config_path = ".codex/config.toml"
config = read(config_path)
config = config.replace("startup_timeout_sec = 5", "startup_timeout_sec = 30")
config = config.replace("tool_timeout_sec = 180", "tool_timeout_sec = 300")
write(config_path, config)

sync_path = "engines/codex/scripts/sync-local-stack.ps1"
sync = read(sync_path)
old_section = '$section = "[mcp_servers.$key]`nurl = `"$url`""'
new_section = '$section = "[mcp_servers.$key]`nurl = `"$url`"`nenabled = true`nrequired = false`nstartup_timeout_sec = 30`ntool_timeout_sec = 300"'
if old_section not in sync:
    raise RuntimeError("sync config section anchor missing")
sync = sync.replace(old_section, new_section, 1)
sync = sync.replace("-TimeoutSec 10", "-TimeoutSec 20")

old_try = '''try {
  $init = McpPost @{ jsonrpc = "2.0"; id = 1; method = "initialize"; params = @{ protocolVersion = "2024-11-05"; capabilities = @{}; clientInfo = @{ name = "buildit-readiness"; version = "1" } } } $null
  $sessionId = [string]$init.Headers["mcp-session-id"]
  if (-not $sessionId) { throw "MCP initialize returned no session ID." }'''
new_try = '''try {
  $init = $null
  $lastInitError = $null
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    try {
      $init = McpPost @{ jsonrpc = "2.0"; id = 1; method = "initialize"; params = @{ protocolVersion = "2024-11-05"; capabilities = @{}; clientInfo = @{ name = "buildit-readiness"; version = "1" } } } $null
      break
    } catch {
      $lastInitError = $_.Exception.Message
      if ($attempt -lt 3) { Start-Sleep -Seconds 2 }
    }
  }
  if (-not $init) { throw "MCP initialize failed after 3 attempts: $lastInitError" }
  $sessionId = [string]$init.Headers["mcp-session-id"]
  if (-not $sessionId) { throw "MCP initialize returned no session ID." }'''
if old_try not in sync:
    raise RuntimeError("sync init block missing")
sync = sync.replace(old_try, new_try, 1)
write(sync_path, sync)

connection_path = "engines/codex/CONNECTION_CONTRACT.md"
connection = read(connection_path)
connection = connection.replace(
    "After readiness `PASS`, acquire `manage_project_write_lease` from the active Codex session before any mutation. The lease binds that session to the project UUID, asset session, stage, state revision, and active tool profile. A stage/profile transition releases it; reacquire after the single required reconnect.",
    "After readiness `PASS`, acquire `manage_project_write_lease` from the active Codex session before any mutation. The lease binds that session to the project UUID, asset session, stage, state revision, and active tool profile. A stage/profile transition releases only the lease; continue in the same Codex and MCP session and reacquire the fresh stage lease. If the readiness script installs a missing Codex config before production begins, restart Codex once, then keep the production session stable.",
)
write(connection_path, connection)

# ---------------------------------------------------------------------------
# 8. Strengthen canonical skills without changing user-facing stages.
# ---------------------------------------------------------------------------

geometry_skill = r'''---
name: blockbench-geometry
description: "Deterministic two-phase Bedrock Geometry with an enforced primary-form boundary, required attachment rotations, fixed-scale diagnosis, one Terra writer, and guarded review submission."
---

# Blockbench Geometry

Use only for `GEOMETRY` with `BEDROCK_CUBOID_GEOMETRY`. `PRIMARY_FORM`,
`STRUCTURAL_DETAIL`, `LOCAL_REPAIR`, and `MAJOR_FORM_REVISION` are internal;
they are not extra user reviews or profiles.

## Entry

```text
get_stage_context
→ create_project when absent, with canonical save_path + session_root + asset_id
→ save_canonical_project
→ rebind identity when required
→ one selected Terra writer acquires the Geometry lease
→ inspect_reference_visual_preview once per unchanged hash
```

## Enforced zero-start route

```text
PRIMARY_FORM
→ build only manifest PRIMARY_MASS and PROVISIONAL_SUPPORT cuboids
→ use mid-range dimensions/centers, not arbitrary range extremes
→ no ears, ossicones, mane, tail, decorative transitions, or micro detail
→ apply every required primary rotation contract
→ capture/analyze left_side + front + top_footprint
→ verify_primary_form_ready
→ save_canonical_project
→ STRUCTURAL_DETAIL
```

`verify_primary_form_ready` must pass before structural detail is allowed. A
failed gate means repair existing primary cuboids; do not add more cubes to hide
the silhouette error.

During PRIMARY_FORM:

- keep within `geometry.primary_form_gate.maximum_cubes`;
- body, neck, head/muzzle, and four support chains must match manifest numeric
  constraints;
- required neck/head rotations must be applied with
  `rotate_cube_about_attachment`;
- all required hooves remain at `Y=0`;
- primary left/front/top scores and extents must pass the internal gate.

## Structural detail

Only after the primary gate passes, add the approved ears, ossicones, mane,
tail, hoof refinement, and other `STRUCTURAL_DETAIL` parts. Keep cube count
inside the manifest budget. Use stepped cuboids where taper is sufficient and
contract rotation only where the approved form is genuinely angled.

## Correction

Capture only affected views first. `analyze_geometry_views` must name view,
region, missing/excess silhouette, direction, magnitude when measurable, parts,
and scope. Modify only diagnosed parts. Use no more than two non-improving
bounded cycles before setting attention and using one focused visual decision.

Use `place_cubes_safe`/`modify_cubes` for zero-rotation work and
`rotate_cube_about_attachment` for every non-zero cube rotation. If rotation
visual scoring is temporarily unavailable, the rotation may pass only through
axis/range/pivot/direction/connection structural fallback; fresh visual analysis
is still mandatory before primary-form or final review readiness.

## Final review

```text
final manifest-required capture/analyze with write_diff_image=true
→ conditional visual_director only for a genuinely unresolved visual judgment
→ record_geometry_visual_decision
→ save_canonical_project
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
```

All final views, project UUID, fingerprints, transformed world-space signature,
Reference Visual hash, analyzer, primary-form gate, visual decision, and rotation
audit must be current. Submission owns fresh validation, checkpoint, transition,
and lease release.

## Compatibility and evidence invariants

- Never analyze an empty project.
- `analyze_geometry_views` persists canonical metrics and therefore remains a lease-owned write.
- The final required-view capture/analyze is the canonical final evidence pass.
- The selected Terra writer performs normal repairs directly.
- visual_director only when deterministic evidence cannot close a genuine visual decision.
- High remains the maximum and is reserved for one coded critical decision.

After user approval, reacquire a fresh Geometry lease and call
`complete_geometry_stage`. Revision reacquires the Geometry lease, diagnoses
affected views, calls `prepare_geometry_visual_rebuild`, and mutates only after
`GEOMETRY_IN_PROGRESS` returns. No reconnect is required.
'''
write("engines/shared/skills/blockbench-geometry/SKILL.md", geometry_skill)

production_path = "engines/shared/skills/blockbench-production/SKILL.md"
production = read(production_path)
production = production.replace(
    '''inspect Reference Visual once per hash
→ zero-start: build primary form before first capture/analyze
   existing/revision: capture affected views first
→ fixed-scale diagnosis
→ bounded targeted edits
→ final manifest-required view pass''',
    '''inspect Reference Visual once per hash
→ zero-start: PRIMARY_MASS + PROVISIONAL_SUPPORT only
→ apply required primary rotations
→ left/front/top fixed-scale diagnosis
→ verify_primary_form_ready
→ save_canonical_project
→ structural detail only after primary PASS
→ affected-view diagnosis and bounded edits
→ final manifest-required view pass''',
)
production = production.replace(
    "Submission owns fresh validation, checkpoint, state transition, and lease release. Every non-zero rotation uses `rotate_cube_about_attachment`.",
    "Submission owns fresh validation, checkpoint, state transition, and lease release. Every non-zero rotation uses `rotate_cube_about_attachment`. Canonical `.bbmodel` persistence is refreshed with `save_canonical_project` at primary-form and review boundaries.",
)
if "## Geometry recovery compatibility invariants" not in production:
    production = production.rstrip() + """

## Geometry recovery compatibility invariants

- zero-start: build primary form before first capture/analyze;
- `verify_primary_form_ready` passes before structural detail;
- final required-view capture/analyze remains mandatory;
- no duplicate happy-path validation is added;
- visual judgment stays conditional rather than mandatory.
"""
write(production_path, production)

# ---------------------------------------------------------------------------
# 9. OpenSpec/Ponytail records the P0 fix and prevents a new loop.
# ---------------------------------------------------------------------------

ponytail_path = "openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
ponytail = read(ponytail_path).rstrip()
if "## Local Geometry P0 recovery" not in ponytail:
    ponytail += r'''

## Local Geometry P0 recovery

Measured local evidence showed that the documented primary-form concept was
advisory, so a full hierarchy and detail set could be built before silhouette
convergence. The minimum corrective scope is:

- one internal `PRIMARY_FORM` mutation boundary;
- one `verify_primary_form_ready` tool;
- adaptive reference segmentation;
- structural rotation fallback without bypassing rotation contracts;
- canonical project persistence;
- connection readiness retry and stable-session wording;
- manifest-derived Animation requirement.

This does not add a user approval, profile, style, or alternate workflow. Do not
add further Geometry tools until the corrected giraffe primary form has been
retested. The failed 39-cube giraffe is a diagnostic fixture, not a baseline to
continue polishing.
'''
write(ponytail_path, ponytail)

tasks_path = "openspec/changes/codex-local-workflow-rework/tasks.md"
tasks = read(tasks_path)
marker = "## Final local Blockbench acceptance — remaining on the workstation"
insert = '''## Local feedback recovery — Geometry P0

- [x] Convert PRIMARY_FORM from wording-only guidance into an internal mutation boundary.
- [x] Block structural-detail and unclassified cuboids before primary-form readiness.
- [x] Add deterministic `verify_primary_form_ready` for primary parts, rotations, views, extents, ground contacts, and cube budget.
- [x] Add adaptive Reference Visual foreground segmentation.
- [x] Permit rotation structural fallback when visual segmentation is temporarily unavailable, while still requiring fresh analysis before readiness.
- [x] Persist the canonical `.bbmodel` at creation and phase boundaries.
- [x] Increase Codex MCP startup/tool timeouts and add bounded readiness retries.
- [x] Remove stale stage-transition reconnect wording.
- [x] Reconcile Animation requirement from the imported manifest.
- [ ] Retest the giraffe from a clean primary-form rebuild; do not continue the failed 39-cube geometry as the quality baseline.

'''
if marker not in tasks:
    raise RuntimeError("OpenSpec task marker missing")
if "## Local feedback recovery — Geometry P0" not in tasks:
    tasks = tasks.replace(marker, insert + marker, 1)
write(tasks_path, tasks)

# ---------------------------------------------------------------------------
# 10. Regression tests.
# ---------------------------------------------------------------------------

primary_test = r'''import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { classifyGeometryManifestRole } from "../src/lib/geometryRuntime";

const read = (path: string) => readFileSync(path, "utf8");

describe("local Geometry P0 recovery", () => {
  test("classifies manifest roles deterministically", () => {
    const constraints = [
      { role: "PRIMARY_MASS" as const, name_patterns: ["torso", "neck"] },
      { role: "PROVISIONAL_SUPPORT" as const, name_patterns: ["leg"] },
      { role: "STRUCTURAL_DETAIL" as const, name_patterns: ["ear", "tail"] },
    ];
    expect(classifyGeometryManifestRole("torso_main", constraints)).toBe("PRIMARY_MASS");
    expect(classifyGeometryManifestRole("leg_front_left_upper", constraints)).toBe("PROVISIONAL_SUPPORT");
    expect(classifyGeometryManifestRole("ear_left", constraints)).toBe("STRUCTURAL_DETAIL");
    expect(classifyGeometryManifestRole("unknown", constraints)).toBeNull();
  });

  test("enforces primary form before detail and exposes one readiness tool", () => {
    const runtime = read("src/lib/geometryRuntime.ts");
    const gate = read("src/server/tools/geometry-primary-gate.ts");
    const profile = read("../engines/shared/profiles/tool-profiles.json");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_NOT_READY");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_UNCLASSIFIED_PART");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_CUBE_BUDGET_EXCEEDED");
    expect(gate).toContain("verify_primary_form_ready");
    expect(gate).toContain("PRIMARY_ROTATION_NOT_APPLIED");
    expect(gate).toContain("PRIMARY_VIEW_SCORE_LOW");
    expect(profile).toContain('"verify_primary_form_ready"');
  });

  test("keeps rotation contracts mandatory while recovering foreground failure", () => {
    const analyzer = read("src/server/tools/geometry-analyzer.ts");
    const rotation = read("src/server/tools/geometry-rotation.ts");
    expect(analyzer).toContain("segmentReferencePixelsAdaptive");
    expect(rotation).toContain("UNAVAILABLE_STRUCTURAL_FALLBACK");
    expect(rotation).toContain("ROTATION_VISUAL_PRECHECK_UNAVAILABLE");
    expect(rotation).toContain("ROTATION_CONNECTION_REJECTED");
  });

  test("persists canonical project and hardens connection startup", () => {
    const project = read("src/server/tools/project.ts");
    const canonical = read("src/server/tools/project-save.ts");
    const config = read("../.codex/config.toml");
    const connection = read("../engines/codex/CONNECTION_CONTRACT.md");
    expect(project).toContain("persist_immediately");
    expect(project).toContain("CANONICAL_MODEL_PATH_MISMATCH");
    expect(canonical).toContain("save_canonical_project");
    expect(config).toContain("startup_timeout_sec = 30");
    expect(config).toContain("tool_timeout_sec = 300");
    expect(connection).toContain("continue in the same Codex and MCP session");
    expect(connection).not.toContain("single required reconnect");
  });

  test("uses manifest Animation requirement at transition time", () => {
    const workflow = read("src/server/tools/workflow.ts");
    expect(workflow).toContain("manifestAnimationRequired");
    expect(workflow).toContain("state.workflow.animation_required = manifestAnimationRequired");
  });
});
'''
write("mcp-blockbench/tests/local-geometry-p0-recovery.test.ts", primary_test)

print("Applied local Geometry P0 recovery hardening.")

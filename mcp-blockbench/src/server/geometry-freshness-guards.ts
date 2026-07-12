import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { computeGeometryWorldSignature } from "@/lib/geometryFreshness";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    openWorldHint?: boolean;
  };
}

const guardedTools = new Set([
  "record_geometry_visual_decision",
  "prepare_geometry_visual_rebuild",
  "verify_geometry_review_ready",
  "submit_geometry_for_review",
  "complete_geometry_stage",
]);

const reportBindingTools = new Set([
  "record_geometry_visual_decision",
  "validate_geometry_contract",
]);

let installed = false;

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Geometry freshness guards need current evidence access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function sessionRoot(args: Record<string, unknown>): string | null {
  return typeof args.session_root === "string" && args.session_root.length > 0
    ? args.session_root
    : null;
}

function metricsPath(root: string): string {
  return joinPath(root, "evidence/geometry/geometry_visual_metrics.json");
}

function freshnessPolicy() {
  return {
    compatibility_fingerprint: "cube_local_v1",
    world_signature: "transformed_geometry_v1",
    group_transforms_included: true,
  };
}

function bindAnalyzerResult(
  args: Record<string, unknown>,
  result: any
): void {
  const root = sessionRoot(args);
  const reportPath = result?.structuredContent?.report_path;
  if (!root || typeof reportPath !== "string") return;

  assertInsideRoot(reportPath, root);
  const fs = nativeFs();
  if (!fs.existsSync(reportPath)) {
    throw new Error(`GEOMETRY_VISUAL_METRICS_MISSING: ${reportPath}`);
  }

  const signature = computeGeometryWorldSignature();
  const report = readJsonFile<Record<string, any>>(fs, reportPath);
  report.geometry_world_signature = signature;
  report.freshness_policy = freshnessPolicy();
  writeJsonAtomically(fs, reportPath, report);

  result.structuredContent.geometry_world_signature = signature;
  result.structuredContent.freshness_policy = report.freshness_policy;
}

function addCurrentSignature(result: any): void {
  if (!result?.structuredContent || typeof result.structuredContent !== "object") {
    return;
  }
  result.structuredContent.geometry_world_signature =
    computeGeometryWorldSignature();
}

function addStageContextSignature(result: any): void {
  const structured = result?.structuredContent;
  const context = structured?.context;
  if (!context || typeof context !== "object") return;
  const signature = computeGeometryWorldSignature();
  context.geometry = context.geometry ?? {};
  context.geometry.current_world_signature = signature;
  structured.geometry_world_signature = signature;
}

function bindWrittenReportSignature(
  args: Record<string, unknown>,
  result: any
): void {
  const structured = result?.structuredContent;
  if (!structured || typeof structured !== "object") return;
  const signature = computeGeometryWorldSignature();
  structured.geometry_world_signature = signature;
  if (structured.report && typeof structured.report === "object") {
    structured.report.geometry_world_signature = signature;
  }

  const root = sessionRoot(args);
  const reportPath = structured.report_path;
  if (!root || typeof reportPath !== "string") return;
  assertInsideRoot(reportPath, root);
  const fs = nativeFs();
  if (!fs.existsSync(reportPath)) return;
  const report = readJsonFile<Record<string, any>>(fs, reportPath);
  report.geometry_world_signature = signature;
  report.freshness_policy = freshnessPolicy();
  writeJsonAtomically(fs, reportPath, report);
}

function assertCurrentEvidenceSignature(args: Record<string, unknown>): void {
  const root = sessionRoot(args);
  if (!root) throw new Error("GEOMETRY_SESSION_ROOT_REQUIRED");
  const path = metricsPath(root);
  assertInsideRoot(path, root);
  const fs = nativeFs();
  if (!fs.existsSync(path)) {
    throw new Error(
      "GEOMETRY_WORLD_SIGNATURE_MISSING: run analyze_geometry_views with the current model before using Geometry evidence."
    );
  }
  const metrics = readJsonFile<Record<string, any>>(fs, path);
  const expected = String(metrics.geometry_world_signature ?? "");
  if (!/^[a-f0-9]{64}$/i.test(expected)) {
    throw new Error(
      "GEOMETRY_WORLD_SIGNATURE_MISSING: current metrics predate transformed-world freshness checks; rerun analyze_geometry_views."
    );
  }
  const current = computeGeometryWorldSignature();
  if (current !== expected.toLowerCase()) {
    throw new Error(
      `GEOMETRY_WORLD_SIGNATURE_STALE: current ${current} differs from evidence ${expected}. Rerun capture/analyze before review, revision preparation, or approval.`
    );
  }
}

function requiresVisualFreshness(
  toolName: string,
  args: Record<string, unknown>
): boolean {
  if (guardedTools.has(toolName)) return true;
  if (toolName === "validate_geometry_contract") {
    return args.require_visual_evidence !== false;
  }
  return false;
}

function shouldWrap(name: string): boolean {
  return (
    name === "analyze_geometry_views" ||
    name === "capture_visual_feedback" ||
    name === "get_stage_context" ||
    name === "validate_geometry_contract" ||
    guardedTools.has(name)
  );
}

/**
 * Installs additive freshness guards before the normal profile/write-lease
 * wrappers. Compatibility fingerprints remain stable while transformed
 * hierarchy changes become authoritative for evidence freshness.
 */
export function installGeometryFreshnessGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;

  const analyzer = definitions.analyze_geometry_views;
  if (analyzer?.annotations) {
    // The analyzer always persists metrics and a diff, even when output_dir is
    // omitted. It is therefore a write operation and must own the project lease.
    analyzer.annotations.readOnlyHint = false;
    analyzer.annotations.destructiveHint = false;
  }

  for (const [name, definition] of Object.entries(definitions)) {
    if (!definition.execute || !shouldWrap(name)) continue;

    const execute = definition.execute;
    definition.execute = async (args, context) => {
      if (requiresVisualFreshness(name, args)) {
        assertCurrentEvidenceSignature(args);
      }

      const result = await execute(args, context);

      if (name === "analyze_geometry_views") {
        bindAnalyzerResult(args, result);
      } else if (name === "capture_visual_feedback") {
        addCurrentSignature(result);
      } else if (name === "get_stage_context") {
        addStageContextSignature(result);
      } else if (reportBindingTools.has(name)) {
        bindWrittenReportSignature(args, result);
      } else {
        addCurrentSignature(result);
      }

      return result;
    };
  }

  installed = true;
}

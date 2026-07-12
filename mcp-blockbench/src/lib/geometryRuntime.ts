/// <reference types="blockbench-types" />

import {
  readJsonFile,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { getProjectWriteLeaseSnapshot } from "@/lib/writeLease";

export type GeometryRuntimePhase =
  | "PRIMARY_FORM"
  | "STRUCTURAL_DETAIL"
  | "FINAL_REVIEW_READY"
  | "VISUAL_CONVERGENCE_FAILED";

interface GeometryIterationState {
  attempts: number;
  best_score: number | null;
  last_score: number | null;
  score_history: number[];
  non_improving_cycles: number;
}

interface GeometryRuntimeState {
  schema_version: string;
  phase: GeometryRuntimePhase;
  primary_form: GeometryIterationState;
  structural_detail: GeometryIterationState;
  final_review: GeometryIterationState;
  revision_mode: "LOCAL_REPAIR" | "MAJOR_FORM_REVISION" | null;
  rebuild_mode: boolean;
  recommended_scope: "LOCAL_REPAIR" | "MAJOR_FORM_REVISION" | null;
  recommended_profile: null;
  last_compared_views: string[];
  last_issues: unknown[];
  attention_required: boolean;
  blocker: null;
  updated_at: string;
  rebuild_preparation?: Record<string, unknown>;
}

const PRIMARY_VIEWS = new Set(["left_side", "front", "top_footprint"]);
const FINAL_VIEWS = new Set([
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);
const MUTATION_TOOLS = new Set([
  "place_cubes_safe",
  "modify_cubes",
  "duplicate_element",
  "rename_element",
  "remove_element",
  "rotate_cube_about_attachment",
]);

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore - Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Geometry runtime tracking needs active-session evidence access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function emptyIteration(): GeometryIterationState {
  return {
    attempts: 0,
    best_score: null,
    last_score: null,
    score_history: [],
    non_improving_cycles: 0,
  };
}

function defaultRuntime(): GeometryRuntimeState {
  return {
    schema_version: "1.1",
    phase: "PRIMARY_FORM",
    primary_form: emptyIteration(),
    structural_detail: emptyIteration(),
    final_review: emptyIteration(),
    revision_mode: null,
    rebuild_mode: false,
    recommended_scope: null,
    recommended_profile: null,
    last_compared_views: [],
    last_issues: [],
    attention_required: false,
    blocker: null,
    updated_at: new Date().toISOString(),
  };
}

function runtimePath(sessionRoot: string): string {
  return joinPath(sessionRoot, "evidence/geometry/geometry_runtime.json");
}

function readRuntime(
  fs: NativeFsLike,
  sessionRoot: string
): GeometryRuntimeState {
  const path = runtimePath(sessionRoot);
  if (!fs.existsSync(path)) return defaultRuntime();
  const value = readJsonFile<Partial<GeometryRuntimeState>>(fs, path);
  const fallback = defaultRuntime();
  const legacyPhase = String(value.phase ?? fallback.phase);
  const phase: GeometryRuntimePhase =
    legacyPhase === "FINAL_REVIEW_READY"
      ? "FINAL_REVIEW_READY"
      : legacyPhase === "STRUCTURAL_DETAIL"
        ? "STRUCTURAL_DETAIL"
        : "PRIMARY_FORM";
  return {
    ...fallback,
    ...value,
    phase,
    recommended_profile: null,
    blocker: null,
    primary_form: { ...fallback.primary_form, ...(value.primary_form ?? {}) },
    structural_detail: {
      ...fallback.structural_detail,
      ...(value.structural_detail ?? {}),
    },
    final_review: { ...fallback.final_review, ...(value.final_review ?? {}) },
  };
}

function writeRuntime(
  fs: NativeFsLike,
  sessionRoot: string,
  runtime: GeometryRuntimeState
): void {
  runtime.updated_at = new Date().toISOString();
  writeJsonAtomically(fs, runtimePath(sessionRoot), runtime);
}

function activeSessionRoot(): string | null {
  const lease = getProjectWriteLeaseSnapshot();
  return lease.status === "ACTIVE" ? lease.session_root : null;
}

function hasNonZeroRotation(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length >= 3 &&
    value.some(
      (angle) =>
        Number.isFinite(Number(angle)) && Math.abs(Number(angle)) > 1e-6
    )
  );
}

function mutationContainsRotation(
  toolName: string,
  args: Record<string, unknown>
): boolean {
  if (toolName === "rotate_cube_about_attachment") return false;
  if (Array.isArray(args.elements)) {
    return args.elements.some(
      (element) =>
        element &&
        typeof element === "object" &&
        hasNonZeroRotation((element as Record<string, unknown>).rotation)
    );
  }
  if (Array.isArray(args.changes)) {
    return args.changes.some(
      (change) =>
        change &&
        typeof change === "object" &&
        hasNonZeroRotation((change as Record<string, unknown>).rotation)
    );
  }
  return false;
}

/**
 * Geometry phases are internal progress markers, not user-facing gates.
 * The only hard mutation guard here is contract-driven rotation safety.
 * Any edit after FINAL_REVIEW_READY automatically makes review evidence stale
 * and returns the runtime to normal working mode.
 */
export function assertGeometryMutationPhase(
  toolName: string,
  _args: Record<string, unknown>,
  _activeProfileId: string
): void {
  if (!MUTATION_TOOLS.has(toolName)) return;
  const args = _args;
  const sessionRoot = activeSessionRoot();
  if (!sessionRoot) return;
  const fs = nativeFs();
  const runtime = readRuntime(fs, sessionRoot);

  if (mutationContainsRotation(toolName, args)) {
    throw new Error(
      "ROTATION_CONTRACT_TOOL_REQUIRED: place or modify cubes without rotation, then use rotate_cube_about_attachment so pivot, direction, connection, and before/after visual score are verified."
    );
  }

  if (runtime.phase === "FINAL_REVIEW_READY") {
    runtime.phase = "STRUCTURAL_DETAIL";
    runtime.attention_required = false;
    runtime.last_compared_views = [];
    runtime.last_issues = [];
    writeRuntime(fs, sessionRoot, runtime);
  }
}

function averageScore(
  metrics: Record<string, unknown> | null,
  views: string[]
): number | null {
  if (!metrics || !Array.isArray(metrics.views)) return null;
  const requested = new Set(views);
  const scores = metrics.views
    .filter(
      (view: any) =>
        requested.has(String(view?.view ?? "")) &&
        Number.isFinite(Number(view?.score))
    )
    .map((view: any) => Number(view.score));
  if (!scores.length) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function recordAttempt(
  iteration: GeometryIterationState,
  score: number | null,
  passed: boolean
): void {
  iteration.attempts += 1;
  iteration.last_score = score;
  if (score !== null) {
    iteration.score_history.push(score);
    if (iteration.score_history.length > 8) iteration.score_history.shift();
    const previousBest = iteration.best_score;
    if (previousBest === null || score > previousBest + 0.01) {
      iteration.best_score = score;
      iteration.non_improving_cycles = 0;
    } else if (!passed) {
      iteration.non_improving_cycles += 1;
    }
  } else if (!passed) {
    iteration.non_improving_cycles += 1;
  }
}

export function recordGeometryVisualRuntimeResult(
  args: Record<string, unknown>,
  toolResult: unknown
): void {
  const sessionRoot =
    typeof args.session_root === "string"
      ? args.session_root
      : activeSessionRoot();
  if (!sessionRoot) return;

  const fs = nativeFs();
  const runtime = readRuntime(fs, sessionRoot);
  const metricsPath = joinPath(
    sessionRoot,
    "evidence/geometry/geometry_visual_metrics.json"
  );
  const metrics = fs.existsSync(metricsPath)
    ? readJsonFile<Record<string, unknown>>(fs, metricsPath)
    : null;
  const comparedViews = Array.isArray(args.compared_views)
    ? args.compared_views.map(String)
    : [];
  const viewSet = new Set(comparedViews);
  const isFinal = [...FINAL_VIEWS].every((view) => viewSet.has(view));
  const isPrimary =
    !isFinal && [...PRIMARY_VIEWS].every((view) => viewSet.has(view));
  const structured =
    toolResult && typeof toolResult === "object"
      ? (toolResult as Record<string, any>).structuredContent
      : null;
  const requestedResult = String(
    structured?.status ?? args.result ?? "REVISION_REQUIRED"
  ).toUpperCase();
  const deterministicPass = String(metrics?.result ?? "MISSING") === "PASS";
  const passed = requestedResult === "PASS" && deterministicPass;
  const score = averageScore(metrics, comparedViews);
  const target = isFinal
    ? runtime.final_review
    : isPrimary
      ? runtime.primary_form
      : runtime.structural_detail;
  recordAttempt(target, score, passed);

  runtime.last_compared_views = comparedViews;
  runtime.last_issues = Array.isArray(args.issues) ? args.issues : [];

  const metricViews = Array.isArray(metrics?.views)
    ? (metrics?.views as any[])
    : [];
  const failingViews = metricViews.filter(
    (view) => (view?.final_view_result ?? view?.result) !== "PASS"
  );
  const requestedScope = String(args.scope ?? "LOCAL_REPAIR");
  const major =
    requestedScope === "MAJOR_FORM_REVISION" ||
    failingViews.length >= 2 ||
    failingViews.some((view) =>
      ["left_side", "front", "top_footprint"].includes(String(view?.view))
    );

  runtime.revision_mode = major ? "MAJOR_FORM_REVISION" : "LOCAL_REPAIR";
  runtime.rebuild_mode = major;
  runtime.recommended_scope = runtime.revision_mode;
  runtime.recommended_profile = null;

  if (passed && isFinal) {
    runtime.phase = "FINAL_REVIEW_READY";
    runtime.revision_mode = null;
    runtime.rebuild_mode = false;
    runtime.recommended_scope = null;
    runtime.attention_required = false;
  } else if (passed && isPrimary) {
    runtime.phase = "STRUCTURAL_DETAIL";
    runtime.attention_required = false;
  } else if (isPrimary) {
    runtime.phase = "PRIMARY_FORM";
  } else {
    runtime.phase = "STRUCTURAL_DETAIL";
  }

  const convergenceTarget = isPrimary
    ? runtime.primary_form
    : isFinal
      ? runtime.final_review
      : runtime.structural_detail;
  runtime.attention_required =
    !passed && convergenceTarget.non_improving_cycles >= 2;

  writeRuntime(fs, sessionRoot, runtime);
}

export function readGeometryRuntimeContext(
  sessionRoot: string
): GeometryRuntimeState {
  return readRuntime(nativeFs(), sessionRoot);
}

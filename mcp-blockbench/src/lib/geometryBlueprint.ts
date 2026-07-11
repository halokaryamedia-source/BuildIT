import type {
  GeometryPartConstraint,
  Vec3,
} from "@/lib/geometryReferenceProfiles";

export interface BlueprintElement {
  name?: string;
  from?: number[];
  to?: number[];
  visibility?: boolean;
  export?: boolean;
}

export interface BlueprintPartResult {
  id: string;
  role: GeometryPartConstraint["role"];
  matched_elements: string[];
  result: "PASS" | "REVISION_REQUIRED" | "NOT_EVALUATED";
  actual: {
    center: Vec3 | null;
    size: Vec3 | null;
    min: Vec3 | null;
    max: Vec3 | null;
  };
  expected: {
    center_range_units?: GeometryPartConstraint["center_range_units"];
    size_range_units?: GeometryPartConstraint["size_range_units"];
  };
  deltas: Array<{
    code: string;
    axis: "x" | "y" | "z";
    actual: number;
    minimum: number;
    maximum: number;
    nearest_correction: number;
  }>;
  visual_views: string[];
  recommendation: string | null;
}

export interface BlueprintEvaluation {
  result: "PASS" | "REVISION_REQUIRED";
  evaluated_parts: number;
  failed_parts: number;
  parts: BlueprintPartResult[];
  issues: Array<{
    code: string;
    part: string;
    role: GeometryPartConstraint["role"];
    views: string[];
    message: string;
    nearest_correction_units: number;
  }>;
}

const AXES = ["x", "y", "z"] as const;

function finiteVec3(value: unknown): Vec3 | null {
  if (!Array.isArray(value) || value.length < 3) return null;
  const vector: Vec3 = [Number(value[0]), Number(value[1]), Number(value[2])];
  return vector.every(Number.isFinite) ? vector : null;
}

function matches(name: string, patterns: string[]): boolean {
  const normalized = name.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

function aggregate(elements: BlueprintElement[]): {
  min: Vec3;
  max: Vec3;
  center: Vec3;
  size: Vec3;
} | null {
  const mins: Vec3 = [Infinity, Infinity, Infinity];
  const maxs: Vec3 = [-Infinity, -Infinity, -Infinity];
  let count = 0;
  for (const element of elements) {
    if (element.visibility === false || element.export === false) continue;
    const from = finiteVec3(element.from);
    const to = finiteVec3(element.to);
    if (!from || !to) continue;
    for (let axis = 0; axis < 3; axis += 1) {
      mins[axis] = Math.min(mins[axis], from[axis], to[axis]);
      maxs[axis] = Math.max(maxs[axis], from[axis], to[axis]);
    }
    count += 1;
  }
  if (count === 0) return null;
  const size: Vec3 = [
    maxs[0] - mins[0],
    maxs[1] - mins[1],
    maxs[2] - mins[2],
  ];
  const center: Vec3 = [
    (mins[0] + maxs[0]) / 2,
    (mins[1] + maxs[1]) / 2,
    (mins[2] + maxs[2]) / 2,
  ];
  return { min: mins, max: maxs, center, size };
}

function rangeDeltas(
  codePrefix: string,
  actual: Vec3,
  range: { min: Vec3; max: Vec3 } | undefined
): BlueprintPartResult["deltas"] {
  if (!range) return [];
  const deltas: BlueprintPartResult["deltas"] = [];
  for (let axis = 0; axis < 3; axis += 1) {
    if (actual[axis] < range.min[axis] || actual[axis] > range.max[axis]) {
      const nearest =
        actual[axis] < range.min[axis]
          ? range.min[axis] - actual[axis]
          : range.max[axis] - actual[axis];
      deltas.push({
        code: `${codePrefix}_${AXES[axis].toUpperCase()}_OUT_OF_RANGE`,
        axis: AXES[axis],
        actual: actual[axis],
        minimum: range.min[axis],
        maximum: range.max[axis],
        nearest_correction: nearest,
      });
    }
  }
  return deltas;
}

function recommendation(
  constraint: GeometryPartConstraint,
  deltas: BlueprintPartResult["deltas"]
): string | null {
  if (!deltas.length) return null;
  const changes = deltas.map((delta) => {
    const direction = delta.nearest_correction > 0 ? "increase/shift positive" : "decrease/shift negative";
    return `${delta.code.toLowerCase()}: ${direction} ${delta.axis.toUpperCase()} by about ${Math.abs(
      delta.nearest_correction
    ).toFixed(2)}u`;
  });
  return `Adjust ${constraint.id} only (${changes.join("; ")}) and re-run the affected views: ${constraint.visual_views.join(
    ", "
  )}.`;
}

export function evaluateGeometryBlueprint(
  elements: BlueprintElement[],
  constraints: GeometryPartConstraint[]
): BlueprintEvaluation {
  const parts: BlueprintPartResult[] = [];
  const issues: BlueprintEvaluation["issues"] = [];

  for (const constraint of constraints) {
    const matched = elements.filter((element) =>
      matches(String(element.name ?? ""), constraint.name_patterns)
    );
    const bounds = aggregate(matched);
    const deltas = bounds
      ? [
          ...rangeDeltas(
            `${constraint.id.toUpperCase()}_CENTER`,
            bounds.center,
            constraint.center_range_units
          ),
          ...rangeDeltas(
            `${constraint.id.toUpperCase()}_SIZE`,
            bounds.size,
            constraint.size_range_units
          ),
        ]
      : [];
    const hasNumericContract = Boolean(
      constraint.center_range_units || constraint.size_range_units
    );
    const result: BlueprintPartResult["result"] = !hasNumericContract
      ? "NOT_EVALUATED"
      : !bounds || deltas.length > 0
        ? "REVISION_REQUIRED"
        : "PASS";
    const part: BlueprintPartResult = {
      id: constraint.id,
      role: constraint.role,
      matched_elements: matched.map((element) => String(element.name ?? "unnamed")),
      result,
      actual: {
        center: bounds?.center ?? null,
        size: bounds?.size ?? null,
        min: bounds?.min ?? null,
        max: bounds?.max ?? null,
      },
      expected: {
        center_range_units: constraint.center_range_units,
        size_range_units: constraint.size_range_units,
      },
      deltas,
      visual_views: constraint.visual_views,
      recommendation: !bounds && hasNumericContract
        ? `Build the missing ${constraint.id} part before visual comparison.`
        : recommendation(constraint, deltas),
    };
    parts.push(part);

    if (result === "REVISION_REQUIRED") {
      if (!bounds) {
        issues.push({
          code: `${constraint.id.toUpperCase()}_MISSING`,
          part: constraint.id,
          role: constraint.role,
          views: constraint.visual_views,
          message: `${constraint.id} has no matching cube for patterns ${constraint.name_patterns.join(
            ", "
          )}.`,
          nearest_correction_units: 0,
        });
      }
      for (const delta of deltas) {
        issues.push({
          code: delta.code,
          part: constraint.id,
          role: constraint.role,
          views: constraint.visual_views,
          message: `${constraint.id} ${delta.axis.toUpperCase()} value ${delta.actual.toFixed(
            2
          )}u is outside ${delta.minimum.toFixed(2)}..${delta.maximum.toFixed(
            2
          )}u; nearest correction ${delta.nearest_correction.toFixed(2)}u.`,
          nearest_correction_units: delta.nearest_correction,
        });
      }
    }
  }

  const failed = parts.filter((part) => part.result === "REVISION_REQUIRED");
  return {
    result: failed.length > 0 ? "REVISION_REQUIRED" : "PASS",
    evaluated_parts: parts.filter((part) => part.result !== "NOT_EVALUATED").length,
    failed_parts: failed.length,
    parts,
    issues,
  };
}

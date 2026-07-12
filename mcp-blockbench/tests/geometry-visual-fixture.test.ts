import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  maskBounds,
  projectElementsGeometry,
  type BinaryMask,
  type CoordinateEnvelope,
  type ProjectableCube,
} from "../src/lib/geometryProjection";
import type { StandardGeometryView } from "../src/lib/geometryReferenceProfiles";

interface SampleProfile {
  bounds: [number, number, number, number];
  pixel_ratio: number;
  row_samples: Array<[number, number, number] | null>;
  column_samples: Array<[number, number, number] | null>;
}

interface Fixture {
  reference_sha256: string;
  sample_bins: number;
  views: Record<StandardGeometryView, SampleProfile>;
}

interface ProfileDiagnostics {
  bound_error: number;
  row_error: number;
  column_error: number;
  pixel_error: number;
  combined_error: number;
  critical_component_error: number;
  rejected: boolean;
}

const fixture = JSON.parse(
  readFileSync(
    "tests/fixtures/black_rhinoceros_reference_profile16.json",
    "utf8"
  )
) as Fixture;
const model = JSON.parse(
  readFileSync(
    "../workspace/active/black_rhinoceros/mcp/checkpoints/11_geometry_revision_01.bbmodel",
    "utf8"
  )
) as { elements?: Array<Record<string, unknown>> };

const envelope: CoordinateEnvelope = {
  x_min: -13.6,
  x_max: 13.6,
  y_min: 0,
  y_max: 40,
  z_min: -30,
  z_max: 22.8,
};

const CRITICAL_COMPONENT_THRESHOLD = 0.05;
const COMBINED_ERROR_THRESHOLD = 0.035;

function profile(mask: BinaryMask, bins: number): SampleProfile {
  const bounds = maskBounds(mask);
  if (!bounds) {
    return {
      bounds: [0, 0, 0, 0],
      pixel_ratio: 0,
      row_samples: Array(bins).fill(null),
      column_samples: Array(bins).fill(null),
    };
  }

  const rowSamples: SampleProfile["row_samples"] = [];
  for (let bin = 0; bin < bins; bin += 1) {
    const y0 = Math.round((bin * mask.height) / bins);
    const y1 = Math.round(((bin + 1) * mask.height) / bins);
    const xs: number[] = [];
    let pixels = 0;
    for (let y = y0; y < y1; y += 1) {
      for (let x = 0; x < mask.width; x += 1) {
        if (mask.data[y * mask.width + x]) {
          xs.push(x);
          pixels += 1;
        }
      }
    }
    rowSamples.push(
      xs.length
        ? [
            Math.min(...xs) / (mask.width - 1),
            Math.max(...xs) / (mask.width - 1),
            pixels / Math.max(1, (y1 - y0) * mask.width),
          ]
        : null
    );
  }

  const columnSamples: SampleProfile["column_samples"] = [];
  for (let bin = 0; bin < bins; bin += 1) {
    const x0 = Math.round((bin * mask.width) / bins);
    const x1 = Math.round(((bin + 1) * mask.width) / bins);
    const ys: number[] = [];
    let pixels = 0;
    for (let x = x0; x < x1; x += 1) {
      for (let y = 0; y < mask.height; y += 1) {
        if (mask.data[y * mask.width + x]) {
          ys.push(y);
          pixels += 1;
        }
      }
    }
    columnSamples.push(
      ys.length
        ? [
            Math.min(...ys) / (mask.height - 1),
            Math.max(...ys) / (mask.height - 1),
            pixels / Math.max(1, (x1 - x0) * mask.height),
          ]
        : null
    );
  }

  return {
    bounds: [
      bounds.min_x / (mask.width - 1),
      bounds.min_y / (mask.height - 1),
      bounds.max_x / (mask.width - 1),
      bounds.max_y / (mask.height - 1),
    ],
    pixel_ratio: bounds.pixel_count / (mask.width * mask.height),
    row_samples: rowSamples,
    column_samples: columnSamples,
  };
}

function tupleError(
  reference: [number, number, number] | null,
  current: [number, number, number] | null
): number {
  if (!reference && !current) return 0;
  if (!reference || !current) return 1;
  return (
    Math.abs(reference[0] - current[0]) +
    Math.abs(reference[1] - current[1]) +
    Math.abs(reference[2] - current[2])
  ) / 3;
}

function profileDiagnostics(
  reference: SampleProfile,
  current: SampleProfile
): ProfileDiagnostics {
  const boundError =
    reference.bounds.reduce(
      (sum, value, index) => sum + Math.abs(value - current.bounds[index]),
      0
    ) / 4;
  const rowError =
    reference.row_samples.reduce(
      (sum, value, index) =>
        sum + tupleError(value, current.row_samples[index]),
      0
    ) / reference.row_samples.length;
  const columnError =
    reference.column_samples.reduce(
      (sum, value, index) =>
        sum + tupleError(value, current.column_samples[index]),
      0
    ) / reference.column_samples.length;
  const pixelError = Math.abs(reference.pixel_ratio - current.pixel_ratio);
  const combinedError =
    0.3 * boundError +
    0.3 * rowError +
    0.3 * columnError +
    0.1 * pixelError;
  const criticalComponentError = Math.max(
    boundError,
    rowError,
    columnError,
    pixelError
  );

  return {
    bound_error: boundError,
    row_error: rowError,
    column_error: columnError,
    pixel_error: pixelError,
    combined_error: combinedError,
    critical_component_error: criticalComponentError,
    rejected:
      criticalComponentError > CRITICAL_COMPONENT_THRESHOLD ||
      combinedError > COMBINED_ERROR_THRESHOLD,
  };
}

function project(view: StandardGeometryView): SampleProfile {
  const elements: ProjectableCube[] = (model.elements ?? []).map((element) => ({
    name: String(element.name ?? "unnamed"),
    uuid: String(element.uuid ?? element.name ?? "unnamed"),
    from: element.from as number[],
    to: element.to as number[],
    origin: element.origin as number[],
    rotation: element.rotation as number[],
    inflate: Number(element.inflate ?? 0),
    visibility: element.visibility !== false,
    export: element.export !== false,
    parent: "root",
  }));
  return profile(
    projectElementsGeometry(elements, {
      view,
      envelope,
      front_axis: "-z",
      width: 128,
      height: 128,
      margin: 8,
    }).mask,
    fixture.sample_bins
  );
}

function assertDiagnostic(
  condition: boolean,
  message: string,
  diagnostics: Record<StandardGeometryView, ProfileDiagnostics>
): void {
  if (!condition) {
    throw new Error(`${message}\n${JSON.stringify(diagnostics, null, 2)}`);
  }
}

describe("failed Black Rhinoceros visual regression fixture", () => {
  test("the preserved failed checkpoint is rejected across multiple real reference views", () => {
    expect(fixture.reference_sha256).toBe(
      "fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f"
    );

    const views: StandardGeometryView[] = [
      "front",
      "left_side",
      "back",
      "top_footprint",
      "front_left_3_4",
    ];
    const diagnostics = Object.fromEntries(
      views.map((view) => [
        view,
        profileDiagnostics(fixture.views[view], project(view)),
      ])
    ) as Record<StandardGeometryView, ProfileDiagnostics>;

    const failedViews = views.filter((view) => diagnostics[view].rejected);
    assertDiagnostic(
      failedViews.length >= 3,
      `Expected at least three rejected views; got ${failedViews.join(", ") || "none"}.`,
      diagnostics
    );
    assertDiagnostic(
      diagnostics.left_side.rejected,
      "Expected left_side to be rejected.",
      diagnostics
    );
    assertDiagnostic(
      diagnostics.top_footprint.rejected,
      "Expected top_footprint to be rejected.",
      diagnostics
    );
    assertDiagnostic(
      diagnostics.front_left_3_4.rejected,
      "Expected front_left_3_4 to be rejected.",
      diagnostics
    );

    // Localized horn, head, shoulder, rear-taper, or footprint drift must not
    // be diluted by otherwise overlapping body pixels.
    assertDiagnostic(
      diagnostics.left_side.critical_component_error >
        CRITICAL_COMPONENT_THRESHOLD,
      "Expected a critical left-side component mismatch.",
      diagnostics
    );
    assertDiagnostic(
      diagnostics.top_footprint.critical_component_error >
        CRITICAL_COMPONENT_THRESHOLD,
      "Expected a critical top-footprint component mismatch.",
      diagnostics
    );
    assertDiagnostic(
      diagnostics.front_left_3_4.critical_component_error >
        CRITICAL_COMPONENT_THRESHOLD,
      "Expected a critical front-left 3/4 component mismatch.",
      diagnostics
    );
  });
});

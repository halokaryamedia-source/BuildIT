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

function profileError(reference: SampleProfile, current: SampleProfile): number {
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
  return 0.3 * boundError + 0.3 * rowError + 0.3 * columnError + 0.1 * pixelError;
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

describe("failed Black Rhinoceros visual regression fixture", () => {
  test("the preserved failed checkpoint is rejected across multiple real reference views", () => {
    expect(fixture.reference_sha256).toBe(
      "fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f"
    );
    const errors = Object.fromEntries(
      (
        [
          "front",
          "left_side",
          "back",
          "top_footprint",
          "front_left_3_4",
        ] as StandardGeometryView[]
      ).map((view) => [view, profileError(fixture.views[view], project(view))])
    ) as Record<StandardGeometryView, number>;

    const failedViews = Object.entries(errors).filter(([, error]) => error > 0.08);
    expect(failedViews.length).toBeGreaterThanOrEqual(3);
    expect(errors.left_side).toBeGreaterThan(0.08);
    expect(errors.top_footprint).toBeGreaterThan(0.08);
    expect(errors.front_left_3_4).toBeGreaterThan(0.08);
  });
});

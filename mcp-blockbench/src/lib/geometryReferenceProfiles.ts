export type StandardGeometryView =
  | "front"
  | "left_side"
  | "right_side"
  | "back"
  | "top_footprint"
  | "front_left_3_4";

export type NormalizedRect = [number, number, number, number];
export type Vec3 = [number, number, number];

export interface GeometryViewRegion {
  id: string;
  rect: NormalizedRect;
  weight: number;
  minimum_score: number;
  critical?: boolean;
  issue_code: string;
  parts: string[];
  recommendation: string;
}

export interface GeometryPanelProfile {
  crop_normalized: NormalizedRect;
  projection: "orthographic" | "perspective";
  minimum_score: number;
  scale_basis: "height" | "depth" | "width";
  regions: GeometryViewRegion[];
}

export type AnchorSelector = "min" | "center" | "max";

export interface GeometryRotationContract {
  id: string;
  cube_patterns: string[];
  allowed_axis: "x" | "y" | "z";
  minimum_degrees: number;
  maximum_degrees: number;
  pivot_anchor: [AnchorSelector, AnchorSelector, AnchorSelector];
  tip_anchor: [AnchorSelector, AnchorSelector, AnchorSelector];
  expected_direction: Vec3;
  minimum_direction_dot: number;
  connection_tolerance_units: number;
  connect_to_patterns?: string[];
  connect_to_anchor?: [AnchorSelector, AnchorSelector, AnchorSelector];
  affected_views: StandardGeometryView[];
}

export interface GeometryPartConstraint {
  id: string;
  role: "PRIMARY_MASS" | "PROVISIONAL_SUPPORT" | "STRUCTURAL_DETAIL";
  name_patterns: string[];
  parent?: string;
  center_range_units?: { min: Vec3; max: Vec3 };
  size_range_units?: { min: Vec3; max: Vec3 };
  rotation_contract?: string;
  required?: boolean;
  minimum_elements?: number;
  maximum_elements?: number;
  visual_views: StandardGeometryView[];
}

export interface GeometryReferenceProfile {
  reference_sha256: string;
  canvas_size: number;
  margin_pixels: number;
  front_axis: "-z" | "+z" | "-x" | "+x";
  panels: Partial<Record<StandardGeometryView, GeometryPanelProfile>>;
  rotation_contracts: Record<string, GeometryRotationContract>;
  part_constraints: GeometryPartConstraint[];
}

export interface ManifestVisualGrounding {
  panels?: Partial<
    Record<
      StandardGeometryView,
      {
        crop_normalized?: NormalizedRect;
        projection?: "orthographic" | "perspective";
        min_score?: number;
        scale_basis?: "height" | "depth" | "width";
        regions?: GeometryViewRegion[];
      }
    >
  >;
  camera_lock?: {
    canvas_size?: number;
    margin_pixels?: number;
    front_axis?: "-z" | "+z" | "-x" | "+x";
  };
}

export interface ManifestGeometryProfile {
  rotation_contracts?: Record<string, GeometryRotationContract>;
  part_constraints?: GeometryPartConstraint[];
}

export function mergeGeometryReferenceProfile(input: {
  referenceSha256?: string | null;
  visualGrounding?: ManifestVisualGrounding | null;
  geometry?: ManifestGeometryProfile | null;
}): GeometryReferenceProfile | null {
  const manifestPanels = input.visualGrounding?.panels ?? {};
  if (Object.keys(manifestPanels).length === 0) return null;

  const panels: Partial<Record<StandardGeometryView, GeometryPanelProfile>> = {};
  for (const view of [
    "front",
    "left_side",
    "right_side",
    "back",
    "top_footprint",
    "front_left_3_4",
  ] as StandardGeometryView[]) {
    const panel = manifestPanels[view];
    if (!panel?.crop_normalized) continue;
    panels[view] = {
      crop_normalized: panel.crop_normalized,
      projection:
        panel.projection ??
        (view === "front_left_3_4" ? "perspective" : "orthographic"),
      minimum_score: panel.min_score ?? 0.7,
      scale_basis:
        panel.scale_basis ?? (view === "top_footprint" ? "depth" : "height"),
      regions: panel.regions ?? [],
    };
  }

  return {
    reference_sha256: input.referenceSha256 ?? "",
    canvas_size: input.visualGrounding?.camera_lock?.canvas_size ?? 256,
    margin_pixels: input.visualGrounding?.camera_lock?.margin_pixels ?? 18,
    front_axis: input.visualGrounding?.camera_lock?.front_axis ?? "-z",
    panels,
    rotation_contracts: input.geometry?.rotation_contracts ?? {},
    part_constraints: input.geometry?.part_constraints ?? [],
  };
}

export type StandardGeometryView =
  | "front"
  | "left_side"
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
  panels: Record<StandardGeometryView, GeometryPanelProfile>;
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

const GOLDEN_SAMPLE_SHA =
  "fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f";

const goldenRegions = {
  left_side: [
    {
      id: "head_horns",
      rect: [0.0, 0.0, 0.38, 0.62] as NormalizedRect,
      weight: 1.35,
      minimum_score: 0.58,
      critical: true,
      issue_code: "LEFT_HEAD_HORN_PROFILE_MISMATCH",
      parts: ["neck", "head", "muzzle", "horn_front", "horn_rear", "ear_left", "ear_right"],
      recommendation:
        "Correct the low-forward head chain and horn direction before changing the torso.",
    },
    {
      id: "shoulder",
      rect: [0.27, 0.12, 0.34, 0.55] as NormalizedRect,
      weight: 1.25,
      minimum_score: 0.62,
      critical: true,
      issue_code: "LEFT_SHOULDER_MASS_MISMATCH",
      parts: ["shoulder_mass", "neck", "torso_core"],
      recommendation:
        "Adjust shoulder height/depth and the neck transition; do not compensate with horn or leg changes.",
    },
    {
      id: "rear_taper",
      rect: [0.58, 0.18, 0.42, 0.5] as NormalizedRect,
      weight: 1.1,
      minimum_score: 0.6,
      critical: true,
      issue_code: "LEFT_REAR_TAPER_MISMATCH",
      parts: ["torso_core", "rear_mass", "tail_base"],
      recommendation:
        "Change rear width/topline/bottom transition using stepped cuboids rather than rotating the full body.",
    },
    {
      id: "legs_ground",
      rect: [0.2, 0.55, 0.72, 0.45] as NormalizedRect,
      weight: 0.9,
      minimum_score: 0.58,
      issue_code: "LEFT_LEG_GROUND_PROFILE_MISMATCH",
      parts: ["leg_front_left", "leg_front_right", "leg_rear_left", "leg_rear_right"],
      recommendation:
        "Correct leg thickness, root positions, length, and ground contact without changing approved body height.",
    },
  ],
  front: [
    {
      id: "front_horn_head",
      rect: [0.22, 0.0, 0.56, 0.58] as NormalizedRect,
      weight: 1.3,
      minimum_score: 0.58,
      critical: true,
      issue_code: "FRONT_HEAD_HORN_WIDTH_MISMATCH",
      parts: ["head", "muzzle", "horn_front", "horn_rear", "ear_left", "ear_right"],
      recommendation:
        "Correct head/muzzle width, centered horn stack, and ear spacing before changing shoulder width.",
    },
    {
      id: "front_shoulders",
      rect: [0.05, 0.18, 0.9, 0.52] as NormalizedRect,
      weight: 1.15,
      minimum_score: 0.64,
      critical: true,
      issue_code: "FRONT_SHOULDER_WIDTH_MISMATCH",
      parts: ["shoulder_mass", "torso_core", "neck"],
      recommendation:
        "Adjust bilateral shoulder width and upper-body symmetry; keep the head centered.",
    },
    {
      id: "front_legs",
      rect: [0.1, 0.56, 0.8, 0.44] as NormalizedRect,
      weight: 0.9,
      minimum_score: 0.58,
      issue_code: "FRONT_LEG_SPACING_MISMATCH",
      parts: ["leg_front_left", "leg_front_right", "foot_front_left", "foot_front_right"],
      recommendation:
        "Correct front-leg thickness and spacing within the shoulder footprint.",
    },
  ],
  back: [
    {
      id: "back_rear_mass",
      rect: [0.06, 0.12, 0.88, 0.58] as NormalizedRect,
      weight: 1.2,
      minimum_score: 0.62,
      critical: true,
      issue_code: "BACK_REAR_MASS_MISMATCH",
      parts: ["rear_mass", "torso_core", "tail_base", "tail_tip"],
      recommendation:
        "Correct rear width/taper and centered tail attachment before changing rear legs.",
    },
    {
      id: "back_legs",
      rect: [0.1, 0.55, 0.8, 0.45] as NormalizedRect,
      weight: 0.9,
      minimum_score: 0.58,
      issue_code: "BACK_LEG_SPACING_MISMATCH",
      parts: ["leg_rear_left", "leg_rear_right", "foot_rear_left", "foot_rear_right"],
      recommendation:
        "Correct rear-leg thickness, bilateral spacing, and ground contact.",
    },
  ],
  top_footprint: [
    {
      id: "top_head",
      rect: [0.18, 0.0, 0.64, 0.36] as NormalizedRect,
      weight: 1.2,
      minimum_score: 0.56,
      critical: true,
      issue_code: "TOP_HEAD_FOOTPRINT_MISMATCH",
      parts: ["neck", "head", "muzzle", "horn_front", "horn_rear"],
      recommendation:
        "Correct the narrowing head/muzzle footprint and centered horn chain.",
    },
    {
      id: "top_shoulders",
      rect: [0.03, 0.25, 0.94, 0.32] as NormalizedRect,
      weight: 1.25,
      minimum_score: 0.63,
      critical: true,
      issue_code: "TOP_SHOULDER_FOOTPRINT_MISMATCH",
      parts: ["shoulder_mass", "torso_core", "neck"],
      recommendation:
        "Make the shoulder the widest footprint region while keeping the neck centered.",
    },
    {
      id: "top_rear_taper",
      rect: [0.12, 0.52, 0.76, 0.48] as NormalizedRect,
      weight: 1.15,
      minimum_score: 0.6,
      critical: true,
      issue_code: "TOP_REAR_TAPER_MISMATCH",
      parts: ["torso_core", "rear_mass", "tail_base"],
      recommendation:
        "Narrow the rear footprint progressively; do not leave a full-width rectangular end wall.",
    },
  ],
  front_left_3_4: [
    {
      id: "three_quarter_identity",
      rect: [0.0, 0.0, 1.0, 0.78] as NormalizedRect,
      weight: 1.25,
      minimum_score: 0.58,
      critical: true,
      issue_code: "THREE_QUARTER_IDENTITY_MISMATCH",
      parts: ["shoulder_mass", "torso_core", "rear_mass", "neck", "head", "muzzle", "horn_front", "horn_rear"],
      recommendation:
        "Correct the combined head/shoulder/torso read; do not optimize one orthographic view at the expense of 3/4 identity.",
    },
    {
      id: "three_quarter_support",
      rect: [0.08, 0.5, 0.82, 0.5] as NormalizedRect,
      weight: 0.85,
      minimum_score: 0.55,
      issue_code: "THREE_QUARTER_SUPPORT_MISMATCH",
      parts: ["leg_front_left", "leg_front_right", "leg_rear_left", "leg_rear_right"],
      recommendation:
        "Correct visible leg layering, thickness, and ground support without widening the full body.",
    },
  ],
};

const BLACK_RHINO_PROFILE: GeometryReferenceProfile = {
  reference_sha256: GOLDEN_SAMPLE_SHA,
  canvas_size: 256,
  margin_pixels: 18,
  front_axis: "-z",
  panels: {
    left_side: {
      crop_normalized: [110 / 1491, 185 / 1055, 590 / 1491, 340 / 1055],
      projection: "orthographic",
      minimum_score: 0.74,
      scale_basis: "height",
      regions: goldenRegions.left_side,
    },
    front: {
      crop_normalized: [750 / 1491, 185 / 1055, 270 / 1491, 340 / 1055],
      projection: "orthographic",
      minimum_score: 0.74,
      scale_basis: "height",
      regions: goldenRegions.front,
    },
    back: {
      crop_normalized: [1120 / 1491, 185 / 1055, 275 / 1491, 340 / 1055],
      projection: "orthographic",
      minimum_score: 0.7,
      scale_basis: "height",
      regions: goldenRegions.back,
    },
    top_footprint: {
      crop_normalized: [30 / 1491, 610 / 1055, 670 / 1491, 290 / 1055],
      projection: "orthographic",
      minimum_score: 0.68,
      scale_basis: "depth",
      regions: goldenRegions.top_footprint,
    },
    front_left_3_4: {
      crop_normalized: [820 / 1491, 600 / 1055, 530 / 1491, 350 / 1055],
      projection: "perspective",
      minimum_score: 0.62,
      scale_basis: "height",
      regions: goldenRegions.front_left_3_4,
    },
  },
  rotation_contracts: {
    neck_down: {
      id: "neck_down",
      cube_patterns: ["neck", "neck_main"],
      allowed_axis: "x",
      minimum_degrees: -25,
      maximum_degrees: 0,
      pivot_anchor: ["center", "center", "max"],
      tip_anchor: ["center", "center", "min"],
      expected_direction: [0, -0.2, -1],
      minimum_direction_dot: 0.45,
      connection_tolerance_units: 2,
      affected_views: ["left_side", "front_left_3_4"],
    },
    head_down: {
      id: "head_down",
      cube_patterns: ["head", "head_main", "head_brow"],
      allowed_axis: "x",
      minimum_degrees: -22,
      maximum_degrees: 0,
      pivot_anchor: ["center", "center", "max"],
      tip_anchor: ["center", "center", "min"],
      expected_direction: [0, -0.18, -1],
      minimum_direction_dot: 0.45,
      connection_tolerance_units: 2,
      connect_to_patterns: ["neck", "neck_main"],
      connect_to_anchor: ["center", "center", "min"],
      affected_views: ["left_side", "front_left_3_4"],
    },
    muzzle_down: {
      id: "muzzle_down",
      cube_patterns: ["muzzle", "muzzle_main"],
      allowed_axis: "x",
      minimum_degrees: -18,
      maximum_degrees: 3,
      pivot_anchor: ["center", "center", "max"],
      tip_anchor: ["center", "center", "min"],
      expected_direction: [0, -0.12, -1],
      minimum_direction_dot: 0.5,
      connection_tolerance_units: 2,
      connect_to_patterns: ["head", "head_main"],
      connect_to_anchor: ["center", "center", "min"],
      affected_views: ["left_side", "front", "front_left_3_4"],
    },
    horn_front_up: {
      id: "horn_front_up",
      cube_patterns: ["horn_front", "horn_front_base", "horn_front_mid", "horn_front_tip"],
      allowed_axis: "x",
      minimum_degrees: -35,
      maximum_degrees: 5,
      pivot_anchor: ["center", "min", "center"],
      tip_anchor: ["center", "max", "min"],
      expected_direction: [0, 1, -0.28],
      minimum_direction_dot: 0.45,
      connection_tolerance_units: 1.5,
      affected_views: ["left_side", "front", "front_left_3_4"],
    },
    horn_rear_up: {
      id: "horn_rear_up",
      cube_patterns: ["horn_rear", "horn_rear_base", "horn_rear_tip"],
      allowed_axis: "x",
      minimum_degrees: -28,
      maximum_degrees: 8,
      pivot_anchor: ["center", "min", "center"],
      tip_anchor: ["center", "max", "min"],
      expected_direction: [0, 1, -0.18],
      minimum_direction_dot: 0.42,
      connection_tolerance_units: 1.5,
      affected_views: ["left_side", "front", "front_left_3_4"],
    },
    ear_left_out: {
      id: "ear_left_out",
      cube_patterns: ["ear_left", "ear_left_main"],
      allowed_axis: "z",
      minimum_degrees: -25,
      maximum_degrees: 0,
      pivot_anchor: ["center", "min", "center"],
      tip_anchor: ["min", "max", "center"],
      expected_direction: [-0.28, 1, 0],
      minimum_direction_dot: 0.42,
      connection_tolerance_units: 1.5,
      affected_views: ["front", "front_left_3_4"],
    },
    ear_right_out: {
      id: "ear_right_out",
      cube_patterns: ["ear_right", "ear_right_main"],
      allowed_axis: "z",
      minimum_degrees: 0,
      maximum_degrees: 25,
      pivot_anchor: ["center", "min", "center"],
      tip_anchor: ["max", "max", "center"],
      expected_direction: [0.28, 1, 0],
      minimum_direction_dot: 0.42,
      connection_tolerance_units: 1.5,
      affected_views: ["front", "front_left_3_4"],
    },
    tail_down: {
      id: "tail_down",
      cube_patterns: ["tail", "tail_base", "tail_tip"],
      allowed_axis: "x",
      minimum_degrees: -5,
      maximum_degrees: 35,
      pivot_anchor: ["center", "max", "min"],
      tip_anchor: ["center", "min", "max"],
      expected_direction: [0, -0.35, 1],
      minimum_direction_dot: 0.38,
      connection_tolerance_units: 1.5,
      affected_views: ["left_side", "back", "front_left_3_4"],
    },
  },
  part_constraints: [
    {
      id: "shoulder_mass",
      role: "PRIMARY_MASS",
      name_patterns: ["shoulder_mass", "shoulder_main"],
      parent: "body",
      center_range_units: { min: [-2, 22, -9], max: [2, 29, -2] },
      size_range_units: { min: [22, 18, 9], max: [28, 25, 17] },
      visual_views: ["left_side", "front", "top_footprint", "front_left_3_4"],
    },
    {
      id: "torso_core",
      role: "PRIMARY_MASS",
      name_patterns: ["torso_core", "torso_main", "belly_transition"],
      parent: "body",
      center_range_units: { min: [-2, 19, 1], max: [2, 27, 10] },
      size_range_units: { min: [19, 15, 22], max: [26, 23, 34] },
      visual_views: ["left_side", "front", "back", "top_footprint", "front_left_3_4"],
    },
    {
      id: "rear_mass",
      role: "PRIMARY_MASS",
      name_patterns: ["rear_mass", "rear_main"],
      parent: "body",
      center_range_units: { min: [-2, 18, 13], max: [2, 26, 20] },
      size_range_units: { min: [16, 13, 8], max: [23, 21, 15] },
      visual_views: ["left_side", "back", "top_footprint", "front_left_3_4"],
    },
    {
      id: "neck",
      role: "PRIMARY_MASS",
      name_patterns: ["neck", "neck_main"],
      parent: "body",
      rotation_contract: "neck_down",
      visual_views: ["left_side", "front", "top_footprint", "front_left_3_4"],
    },
    {
      id: "head",
      role: "PRIMARY_MASS",
      name_patterns: ["head", "head_main", "head_brow"],
      parent: "neck",
      rotation_contract: "head_down",
      visual_views: ["left_side", "front", "top_footprint", "front_left_3_4"],
    },
    {
      id: "muzzle",
      role: "PRIMARY_MASS",
      name_patterns: ["muzzle", "muzzle_main"],
      parent: "head",
      rotation_contract: "muzzle_down",
      visual_views: ["left_side", "front", "top_footprint", "front_left_3_4"],
    },
    {
      id: "legs",
      role: "PROVISIONAL_SUPPORT",
      name_patterns: ["leg_front_left", "leg_front_right", "leg_rear_left", "leg_rear_right"],
      parent: "body",
      visual_views: ["left_side", "front", "back", "top_footprint", "front_left_3_4"],
    },
    {
      id: "front_horn",
      role: "STRUCTURAL_DETAIL",
      minimum_elements: 3,
      maximum_elements: 3,
      name_patterns: ["horn_front"],
      parent: "head",
      rotation_contract: "horn_front_up",
      visual_views: ["left_side", "front", "front_left_3_4"],
    },
    {
      id: "rear_horn",
      role: "STRUCTURAL_DETAIL",
      minimum_elements: 2,
      maximum_elements: 2,
      name_patterns: ["horn_rear"],
      parent: "head",
      rotation_contract: "horn_rear_up",
      visual_views: ["left_side", "front", "front_left_3_4"],
    },
    {
      id: "ears",
      role: "STRUCTURAL_DETAIL",
      minimum_elements: 2,
      maximum_elements: 4,
      name_patterns: ["ear_left", "ear_right"],
      parent: "head",
      visual_views: ["front", "front_left_3_4"],
    },
    {
      id: "feet",
      role: "STRUCTURAL_DETAIL",
      name_patterns: ["foot_front_left", "foot_front_right", "foot_rear_left", "foot_rear_right"],
      visual_views: ["left_side", "front", "back", "front_left_3_4"],
    },
    {
      id: "tail",
      role: "STRUCTURAL_DETAIL",
      minimum_elements: 2,
      maximum_elements: 2,
      name_patterns: ["tail_base", "tail_tip"],
      parent: "body",
      rotation_contract: "tail_down",
      visual_views: ["left_side", "back", "front_left_3_4"],
    },
  ],
};

export function builtInGeometryProfile(
  referenceSha256: string | null | undefined
): GeometryReferenceProfile | null {
  if (referenceSha256?.toLowerCase() === GOLDEN_SAMPLE_SHA) {
    return BLACK_RHINO_PROFILE;
  }
  return null;
}

export function mergeGeometryReferenceProfile(input: {
  referenceSha256?: string | null;
  visualGrounding?: ManifestVisualGrounding | null;
  geometry?: ManifestGeometryProfile | null;
}): GeometryReferenceProfile | null {
  const builtIn = builtInGeometryProfile(input.referenceSha256);
  const manifestPanels = input.visualGrounding?.panels ?? {};
  if (!builtIn && Object.keys(manifestPanels).length === 0) return null;

  const fallback = builtIn ?? {
    reference_sha256: input.referenceSha256 ?? "",
    canvas_size: input.visualGrounding?.camera_lock?.canvas_size ?? 256,
    margin_pixels: input.visualGrounding?.camera_lock?.margin_pixels ?? 18,
    front_axis: input.visualGrounding?.camera_lock?.front_axis ?? "-z",
    panels: {} as Record<StandardGeometryView, GeometryPanelProfile>,
    rotation_contracts: {},
    part_constraints: [],
  };

  const panels = { ...fallback.panels } as Record<
    StandardGeometryView,
    GeometryPanelProfile
  >;
  for (const view of [
    "front",
    "left_side",
    "back",
    "top_footprint",
    "front_left_3_4",
  ] as StandardGeometryView[]) {
    const override = manifestPanels[view];
    const base = panels[view];
    if (!override && base) continue;
    if (!override?.crop_normalized && !base) continue;
    panels[view] = {
      crop_normalized:
        override?.crop_normalized ?? base?.crop_normalized ?? [0, 0, 0, 0],
      projection:
        override?.projection ??
        base?.projection ??
        (view === "front_left_3_4" ? "perspective" : "orthographic"),
      minimum_score: override?.min_score ?? base?.minimum_score ?? 0.7,
      scale_basis:
        override?.scale_basis ??
        base?.scale_basis ??
        (view === "top_footprint" ? "depth" : "height"),
      regions: override?.regions ?? base?.regions ?? [],
    };
  }

  return {
    reference_sha256: input.referenceSha256 ?? fallback.reference_sha256,
    canvas_size:
      input.visualGrounding?.camera_lock?.canvas_size ?? fallback.canvas_size,
    margin_pixels:
      input.visualGrounding?.camera_lock?.margin_pixels ?? fallback.margin_pixels,
    front_axis:
      input.visualGrounding?.camera_lock?.front_axis ?? fallback.front_axis,
    panels,
    rotation_contracts: {
      ...fallback.rotation_contracts,
      ...(input.geometry?.rotation_contracts ?? {}),
    },
    part_constraints:
      input.geometry?.part_constraints ?? fallback.part_constraints,
  };
}

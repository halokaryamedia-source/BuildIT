/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  mapFaceUvToTexturePixels,
  requireFiniteFaceUv,
  requirePositiveTextureMetric,
  type TexturePixelMetrics,
} from "@/lib/facePixelMapping";

export { mapFaceUvToTexturePixels };

export const inspectElementParameters = z.object({
  id: z
    .string()
    .min(1)
    .describe(
      "Exact Cube, Group, Locator, or Null Object UUID, or exact unique name; prefer UUID after discovery."
    ),
  detail: z
    .enum(["geometry", "uv"])
    .optional()
    .default("geometry")
    .describe("Geometry transform by default; request `uv` only when UV mapping needs inspection."),
});

export const elementInspectionToolDocs: ToolSpec[] = [
  {
    name: "inspect_element",
    description:
      "Returns focused authored state for one explicit element. Defaults to compact geometry/hierarchy data; request UV detail only when mapping needs inspection.",
    annotations: {
      title: "Inspect Authored Element",
      readOnlyHint: true,
    },
    parameters: inspectElementParameters,
    status: STATUS_STABLE,
  },
];

type InspectableElement = Cube | Group | Locator | NullObject;

function elementType(
  element: InspectableElement
): "cube" | "group" | "locator" | "null_object" {
  if (element instanceof Cube) return "cube";
  if (element instanceof Group) return "group";
  if (element instanceof Locator) return "locator";
  return "null_object";
}

function resolveInspectableElement(reference: string): InspectableElement {
  if (!Project) {
    throw new Error(
      "No project is open. Open or create the intended Bedrock project before inspecting an element."
    );
  }

  const candidates: InspectableElement[] = [
    ...Cube.all,
    ...Group.all,
    ...Locator.all,
    ...NullObject.all,
  ];

  const uuidMatch = candidates.find((element) => element.uuid === reference);
  if (uuidMatch) return uuidMatch;

  const nameMatches = candidates.filter((element) => element.name === reference);
  if (nameMatches.length > 1) {
    const choices = nameMatches
      .map(
        (element) =>
          `${elementType(element)} "${element.name}" (${element.uuid})`
      )
      .join(", ");
    throw new Error(
      `Element name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${choices}`
    );
  }

  if (nameMatches.length === 1) return nameMatches[0];

  throw new Error(
    `Element "${reference}" not found. Use list_outline, find_elements_by_criteria, or list_locator_elements to locate the intended authored element and then inspect it by UUID.`
  );
}

function parentInfo(
  element: InspectableElement
): { uuid: string; name: string } | null {
  return element.parent instanceof Group
    ? { uuid: element.parent.uuid, name: element.parent.name }
    : null;
}

export function requireFiniteInspectableVector3(
  values: readonly number[],
  context: string
): [number, number, number] {
  if (values.length !== 3 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} contains a non-finite authored transform and cannot be reported safely.`
    );
  }
  return [values[0], values[1], values[2]];
}

export function requireFiniteInspectableVector2(
  values: readonly number[],
  context: string
): [number, number] {
  if (values.length !== 2 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} contains non-finite authored UV state and cannot be reported safely.`
    );
  }
  return [values[0], values[1]];
}

export function requireFiniteInspectableFaceUv(
  values: readonly number[],
  context: string
): [number, number, number, number] {
  return requireFiniteFaceUv(values, context);
}

export function requireFiniteInspectableScalar(value: number, context: string): number {
  if (!Number.isFinite(value)) {
    throw new Error(
      `${context} contains a non-finite authored scalar and cannot be reported safely.`
    );
  }
  return value;
}

type EffectiveTextureSpace =
  | {
      state: "mapped";
      texture: {
        uuid: string;
        name: string;
        id: string;
        width: number;
        height: number;
        display_height: number;
        uv_width: number;
        uv_height: number;
      };
      metrics: TexturePixelMetrics;
    }
  | {
      state: "no_texture" | "texture_error" | "animated_texture_unsupported";
      texture: {
        uuid: string;
        name: string;
        id: string;
        width: number;
        height: number;
        display_height: number;
        uv_width: number;
        uv_height: number;
      } | null;
      metrics: null;
    };

function inspectEffectiveTextureSpace(): EffectiveTextureSpace {
  const texture = Texture.getDefault();
  if (!texture) {
    return { state: "no_texture", texture: null, metrics: null };
  }

  const textureInfo = {
    uuid: texture.uuid,
    name: texture.name,
    id: texture.id,
    width: texture.width,
    height: texture.height,
    display_height: texture.display_height,
    uv_width: texture.getUVWidth(),
    uv_height: texture.getUVHeight(),
  };

  if (texture.error) {
    return { state: "texture_error", texture: textureInfo, metrics: null };
  }

  const metrics = {
    width: requirePositiveTextureMetric(
      textureInfo.width,
      `Texture ${texture.name} (${texture.uuid}) width`
    ),
    displayHeight: requirePositiveTextureMetric(
      textureInfo.display_height,
      `Texture ${texture.name} (${texture.uuid}) display height`
    ),
    uvWidth: requirePositiveTextureMetric(
      textureInfo.uv_width,
      `Texture ${texture.name} (${texture.uuid}) UV width`
    ),
    uvHeight: requirePositiveTextureMetric(
      textureInfo.uv_height,
      `Texture ${texture.name} (${texture.uuid}) UV height`
    ),
  };

  if (textureInfo.height !== textureInfo.display_height) {
    return {
      state: "animated_texture_unsupported",
      texture: textureInfo,
      metrics: null,
    };
  }

  return {
    state: "mapped",
    texture: textureInfo,
    metrics,
  };
}

const CUBE_FACE_KEYS = [
  "north",
  "south",
  "east",
  "west",
  "up",
  "down",
] as const;
type CubeFaceKey = (typeof CUBE_FACE_KEYS)[number];

export const UV_FACE_ASPECT_REVIEW_FACTOR = 1.25;
export const UV_CUBE_DENSITY_SPREAD_REVIEW_FACTOR = 2;

export type FaceUvQuality =
  | {
      state: "degenerate";
      geometry_size: [number, number];
      uv_size: [number, number];
    }
  | {
      state: "measured";
      geometry_size: [number, number];
      uv_size: [number, number];
      geometry_aspect_ratio: number;
      uv_aspect_ratio: number;
      best_aspect_alignment: "direct" | "rotated_90";
      aspect_ratio_scale_error: number;
      aspect_state: "matched" | "review_required";
      logical_uv_area_per_model_area: number;
    };

function ratioScaleError(first: number, second: number): number {
  return Math.max(first / second, second / first);
}

/**
 * Objective face-to-UV construction metrics. `aspect_state` is a conservative
 * review hint, not a visual or semantic PASS/FAIL verdict.
 */
export function summarizeFaceUvQuality(
  geometrySize: readonly [number, number],
  uv: readonly [number, number, number, number]
): FaceUvQuality {
  const width = Math.abs(geometrySize[0]);
  const height = Math.abs(geometrySize[1]);
  const uvWidth = Math.abs(uv[2] - uv[0]);
  const uvHeight = Math.abs(uv[3] - uv[1]);
  const geometry: [number, number] = [width, height];
  const uvSize: [number, number] = [uvWidth, uvHeight];

  if (
    ![width, height, uvWidth, uvHeight].every(Number.isFinite) ||
    width <= 0 ||
    height <= 0 ||
    uvWidth <= 0 ||
    uvHeight <= 0
  ) {
    return { state: "degenerate", geometry_size: geometry, uv_size: uvSize };
  }

  const geometryAspect = width / height;
  const uvAspect = uvWidth / uvHeight;
  const directError = ratioScaleError(geometryAspect, uvAspect);
  const rotatedError = ratioScaleError(geometryAspect, 1 / uvAspect);
  const rotated = rotatedError < directError;
  const aspectError = rotated ? rotatedError : directError;

  return {
    state: "measured",
    geometry_size: geometry,
    uv_size: uvSize,
    geometry_aspect_ratio: geometryAspect,
    uv_aspect_ratio: uvAspect,
    best_aspect_alignment: rotated ? "rotated_90" : "direct",
    aspect_ratio_scale_error: aspectError,
    aspect_state:
      aspectError > UV_FACE_ASPECT_REVIEW_FACTOR
        ? "review_required"
        : "matched",
    logical_uv_area_per_model_area:
      (uvWidth * uvHeight) / (width * height),
  };
}

function cubeFaceGeometrySize(
  size: readonly [number, number, number],
  face: CubeFaceKey
): [number, number] {
  const [x, y, z] = size.map(Math.abs) as [number, number, number];
  if (face === "north" || face === "south") return [x, y];
  if (face === "east" || face === "west") return [z, y];
  return [x, z];
}

function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function summarizeUvDensity(values: readonly number[]) {
  if (values.length === 0) {
    return {
      state: "unavailable" as const,
      measured_faces: 0,
      min: null,
      median: null,
      max: null,
      spread_factor: null,
    };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = min > 0 ? max / min : null;
  return {
    state:
      spread !== null && spread > UV_CUBE_DENSITY_SPREAD_REVIEW_FACTOR
        ? ("review_required" as const)
        : ("consistent" as const),
    measured_faces: values.length,
    min,
    median: median(values),
    max,
    spread_factor: spread,
  };
}

function cubeSize(cube: Cube): [number, number, number] {
  const from = requireFiniteInspectableVector3(cube.from, `Cube ${cube.name} (${cube.uuid}) from`);
  const to = requireFiniteInspectableVector3(cube.to, `Cube ${cube.name} (${cube.uuid}) to`);
  const size = [
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2],
  ] as [number, number, number];
  if (size.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `Cube ${cube.name} (${cube.uuid}) has a non-finite derived size; exact authored correction state cannot be reported safely.`
    );
  }
  return size;
}

function inspectCubeUv(cube: Cube) {
  const textureSpace = inspectEffectiveTextureSpace();
  const size = cubeSize(cube);
  const densityValues: number[] = [];
  let enabledFaceCount = 0;
  let degenerateFaceCount = 0;
  let aspectReviewFaceCount = 0;

  const faces = Object.fromEntries(
    CUBE_FACE_KEYS.map((faceKey) => {
      const face = cube.faces[faceKey];
      const enabled = face.enabled !== false;
      const uv = requireFiniteInspectableFaceUv(
        face.uv,
        `Cube ${cube.name} (${cube.uuid}) face ${faceKey}`
      );
      const pixelMapping =
        enabled && textureSpace.state === "mapped"
          ? mapFaceUvToTexturePixels(
              uv,
              textureSpace.metrics,
              `Cube ${cube.name} (${cube.uuid}) face ${faceKey}`
            )
          : null;
      const quality = enabled
        ? summarizeFaceUvQuality(cubeFaceGeometrySize(size, faceKey), uv)
        : null;

      let physicalPixelAreaPerModelArea: number | null = null;
      if (enabled) enabledFaceCount += 1;
      if (quality?.state === "degenerate") {
        degenerateFaceCount += 1;
      } else if (quality?.state === "measured") {
        densityValues.push(quality.logical_uv_area_per_model_area);
        if (quality.aspect_state === "review_required") {
          aspectReviewFaceCount += 1;
        }
        if (textureSpace.state === "mapped") {
          const pixelsPerUvX =
            textureSpace.metrics.width / textureSpace.metrics.uvWidth;
          const pixelsPerUvY =
            textureSpace.metrics.displayHeight / textureSpace.metrics.uvHeight;
          physicalPixelAreaPerModelArea =
            quality.logical_uv_area_per_model_area *
            pixelsPerUvX *
            pixelsPerUvY;
        }
      }

      return [
        faceKey,
        {
          uv,
          rotation: face.rotation,
          enabled,
          paintable: enabled && pixelMapping !== null,
          mapping_state: enabled ? textureSpace.state : ("disabled_face" as const),
          texture_pixels: pixelMapping,
          quality:
            quality === null
              ? null
              : {
                  ...quality,
                  physical_pixel_area_per_model_area:
                    physicalPixelAreaPerModelArea,
                },
        },
      ];
    })
  );

  return {
    mode: cube.box_uv ? ("box_uv" as const) : ("per_face" as const),
    box_uv: cube.box_uv === true,
    uv_offset: requireFiniteInspectableVector2(
      cube.uv_offset,
      `Cube ${cube.name} (${cube.uuid}) uv_offset`
    ),
    autouv: cube.autouv,
    mirror_uv: cube.mirror_uv === true,
    texture_space: {
      state: textureSpace.state,
      effective_texture: textureSpace.texture,
    },
    quality_summary: {
      enabled_faces: enabledFaceCount,
      degenerate_faces: degenerateFaceCount,
      aspect_review_faces: aspectReviewFaceCount,
      texel_density: summarizeUvDensity(densityValues),
      verdict: "review_hint_only" as const,
      note:
        "Aspect and density diagnostics are objective construction hints only; orientation, seams, semantic reuse, and visual acceptance still require authored context and current model-view evidence.",
    },
    faces,
  };
}

function inspectCube(cube: Cube, detail: "geometry" | "uv") {
  const size = cubeSize(cube);
  return {
    uuid: cube.uuid,
    name: cube.name,
    type: "cube" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(cube),
    from: requireFiniteInspectableVector3(cube.from, `Cube ${cube.name} (${cube.uuid}) from`),
    to: requireFiniteInspectableVector3(cube.to, `Cube ${cube.name} (${cube.uuid}) to`),
    size,
    center: [
      cube.from[0] + size[0] / 2,
      cube.from[1] + size[1] / 2,
      cube.from[2] + size[2] / 2,
    ] as [number, number, number],
    origin: requireFiniteInspectableVector3(cube.origin, `Cube ${cube.name} (${cube.uuid}) origin`),
    rotation: requireFiniteInspectableVector3(cube.rotation, `Cube ${cube.name} (${cube.uuid}) rotation`),
    inflate: requireFiniteInspectableScalar(
      cube.inflate ?? 0,
      `Cube ${cube.name} (${cube.uuid}) inflate`
    ),
    export: cube.export !== false,
    ...(detail === "uv" ? { uv: inspectCubeUv(cube) } : {}),
    visibility: cube.visibility !== false,
  };
}

function inspectGroup(group: Group) {
  return {
    uuid: group.uuid,
    name: group.name,
    type: "group" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(group),
    origin: requireFiniteInspectableVector3(group.origin, `Group ${group.name} (${group.uuid}) origin`),
    rotation: requireFiniteInspectableVector3(group.rotation, `Group ${group.name} (${group.uuid}) rotation`),
    export: group.export !== false,
    visibility: group.visibility !== false,
    children_count: group.children?.length ?? 0,
  };
}

function inspectLocator(locator: Locator) {
  return {
    uuid: locator.uuid,
    name: locator.name,
    type: "locator" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(locator),
    position: requireFiniteInspectableVector3(locator.position, `Locator ${locator.name} (${locator.uuid}) position`),
    rotation: requireFiniteInspectableVector3(locator.rotation, `Locator ${locator.name} (${locator.uuid}) rotation`),
    ignore_inherited_scale: locator.ignore_inherited_scale,
    export: locator.export !== false,
    visibility: locator.visibility !== false,
  };
}

function inspectNullObject(element: NullObject) {
  return {
    uuid: element.uuid,
    name: element.name,
    type: "null_object" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(element),
    position: requireFiniteInspectableVector3(element.position, `Null Object ${element.name} (${element.uuid}) position`),
    ik_target: element.ik_target || null,
    ik_source: element.ik_source || null,
    lock_ik_target_rotation: element.lock_ik_target_rotation,
    export: element.export !== false,
    visibility: element.visibility !== false,
  };
}

export function registerElementInspectionTools() {
  createTool(
    elementInspectionToolDocs[0].name,
    {
      ...elementInspectionToolDocs[0],
      async execute({ id, detail }) {
        const element = resolveInspectableElement(id);
        const result =
          element instanceof Cube
            ? inspectCube(element, detail)
            : element instanceof Group
              ? inspectGroup(element)
              : element instanceof Locator
                ? inspectLocator(element)
                : inspectNullObject(element);
        const detailSummary =
          element instanceof Cube && detail === "uv" ? " with UV mapping detail" : "";

        return {
          content: [
            {
              type: "text" as const,
              text: `Inspected ${result.type} "${result.name}" (${result.uuid})${detailSummary}.`,
            },
          ],
          structuredContent: result,
        };
      },
    },
    elementInspectionToolDocs[0].status
  );
}

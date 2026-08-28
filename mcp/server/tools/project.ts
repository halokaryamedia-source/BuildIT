/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { readRenderedModelBounds, type Vec3 } from "@/lib/renderedModelBounds";
import { isAbsoluteFilesystemPath } from "@/lib/util";

export const DEFAULT_BEDROCK_UV_RESOLUTION = 128;
export const BLOCKIT_ROUTE1_REFERENCE_PREFIX = "blockit_route1__";

const finiteReferenceVec3Schema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
]);

export const route1FrontDirectionSchema = z.enum(["+z", "-z"]);
export type Route1FrontDirection = z.infer<typeof route1FrontDirectionSchema>;

const localGlbPathSchema = z
  .string()
  .min(1)
  .refine(isAbsoluteFilesystemPath, {
    message:
      "Route 1 geometry reference path must be an absolute local filesystem path.",
  })
  .refine((path) => /\.glb$/i.test(path), {
    message: "Route 1 geometry reference supports local .glb files only.",
  });

export const createProjectParameters = z
  .object({
    name: z.string().min(1).describe("Non-empty project name."),
    discard_unsaved: z
      .boolean()
      .optional()
      .describe(
        "Discard unsaved changes in the open project; required when it currently has unsaved work."
      ),
    resolution: z
      .union([z.literal(128), z.literal(256)])
      .optional()
      .describe("Logical UV canvas edge; 128 (default) or 256."),
  })
  .strict();

export const getProjectInfoParameters = z.object({});
export const inspectModelBoundsParameters = z.object({});

export const manageGeometryReferenceParameters = z
  .object({
    action: z
      .enum(["load", "update", "remove"])
      .describe("Route 1 reference lifecycle action."),
    path: localGlbPathSchema
      .optional()
      .describe("Absolute local .glb path; required only for load."),
    id: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Tool-owned Route 1 reference UUID or unique exact name; required for update/remove."
      ),
    source_front_direction: route1FrontDirectionSchema
      .optional()
      .describe(
        "Required load-time front direction encoded by the approved Route 1 GLB."
      ),
    origin: finiteReferenceVec3Schema
      .optional()
      .describe("Reference origin [x,y,z]. Load default is [0,0,0]."),
    uniform_scale: z
      .number()
      .finite()
      .positive()
      .optional()
      .describe(
        "Uniform scale multiplier. Load default is 1; non-uniform scaling is unsupported."
      ),
    visibility: z
      .boolean()
      .optional()
      .describe("Reference visibility. Load default is true."),
    wireframe: z
      .boolean()
      .optional()
      .describe("Reference wireframe mode. Load default is false."),
  })
  .strict()
  .superRefine((value, ctx) => {
    const reject = (key: keyof typeof value, message: string) => {
      if (value[key] !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message });
      }
    };

    if (value.action === "load") {
      if (!value.path) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["path"],
          message: "load requires path.",
        });
      }
      if (!value.source_front_direction) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["source_front_direction"],
          message: "load requires source_front_direction.",
        });
      }
      reject(
        "id",
        "load does not accept id; v1 supports one active Route 1 reference."
      );
      return;
    }

    if (!value.id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id"],
        message: `${value.action} requires id.`,
      });
    }
    reject(
      "path",
      `${value.action} does not change the GLB source; remove and reload instead.`
    );
    reject(
      "source_front_direction",
      `${value.action} does not change source orientation; remove and reload instead.`
    );

    if (value.action === "remove") {
      reject("origin", "remove accepts only action and id.");
      reject("uniform_scale", "remove accepts only action and id.");
      reject("visibility", "remove accepts only action and id.");
      reject("wireframe", "remove accepts only action and id.");
    } else if (
      value.origin === undefined &&
      value.uniform_scale === undefined &&
      value.visibility === undefined &&
      value.wireframe === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["action"],
        message: "update requires an actual transform or display change.",
      });
    }
  });

export const projectToolDocs: ToolSpec[] = [
  {
    name: "create_project",
    description:
      "Creates a new Minecraft Bedrock Entity project in Blockbench's native `bedrock` format; refuses unsaved work without `discard_unsaved`.",
    annotations: {
      title: "Create Project",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: createProjectParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_project_info",
    description:
      "Returns project lifecycle, format, logical UV resolution, and element counts. Use list_outline only when hierarchy detail is needed.",
    annotations: {
      title: "Get Project Info",
      readOnlyHint: true,
    },
    parameters: getProjectInfoParameters,
    status: STATUS_STABLE,
  },
  {
    name: "inspect_model_bounds",
    description:
      "Returns rendered-current-pose Cube bounds, visibility counts, and pose context. Observation only; no visual PASS/FAIL.",
    annotations: {
      title: "Inspect Model Bounds",
      readOnlyHint: true,
    },
    parameters: inspectModelBoundsParameters,
    status: STATUS_STABLE,
  },
  {
    name: "manage_geometry_reference",
    description:
      "Loads, updates, or removes one approved local Route 1 .glb as transient 3D evidence through Blockbench Reference Models. It never converts mesh triangles to Bedrock geometry.",
    annotations: {
      title: "Manage Route 1 Geometry Reference",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: manageGeometryReferenceParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

function getPoseContext(): {
  animation: { uuid: string; name: string } | null;
  timeline_time: number | null;
} {
  const selectedAnimation =
    typeof AnimationItem !== "undefined" ? AnimationItem.selected : null;

  let timelineTime: number | null = null;
  if (
    selectedAnimation &&
    typeof Timeline !== "undefined" &&
    typeof Timeline.time === "number" &&
    Number.isFinite(Timeline.time)
  ) {
    timelineTime = Timeline.time;
  }

  return {
    animation: selectedAnimation
      ? { uuid: selectedAnimation.uuid, name: selectedAnimation.name }
      : null,
    timeline_time: timelineTime,
  };
}

function currentProjectLifecycle() {
  if (!Project) {
    throw new Error("No project is open.");
  }

  return {
    name: Project.name,
    uuid: Project.uuid,
    save_path: Project.save_path ?? null,
    export_path: Project.export_path ?? null,
    export_codec: Project.export_codec ?? null,
    saved: Project.saved === true,
  };
}

type ReferenceFilesystem = {
  existsSync(path: string): boolean;
  statSync(path: string): { isFile(): boolean };
};

export type ReferenceModelRuntime = OutlinerElement & {
  path?: string;
  origin: number[];
  rotation: number[];
  scale: number[];
  visibility: boolean;
  wireframe?: boolean;
  locked?: boolean;
  export?: boolean;
  route1_owned?: boolean;
  mesh?: THREE.Object3D;
  preview_controller?: {
    updateTransform?: (element: ReferenceModelRuntime) => void;
    updateVisibility?: (element: ReferenceModelRuntime) => void;
    updateSelection?: (element: ReferenceModelRuntime) => void;
  };
  extend?: (data: Record<string, unknown>) => ReferenceModelRuntime;
};

type ReferenceModelConstructor = new (
  data?: Record<string, unknown>,
  uuid?: string
) => ReferenceModelRuntime;

export type Route1ReferenceBoundsSummary = {
  bounds_basis: "raw_reference_world_aabb";
  blockbench_units_per_block: number;
  world_bounds: {
    min: Vec3;
    max: Vec3;
    center: Vec3;
    size_xyz: Vec3;
  };
  dimensions_blockbench_units: {
    width: number;
    height: number;
    length: number;
  };
  dimensions_blocks: {
    width: number;
    height: number;
    length: number;
  };
};

export type Route1ReferenceEvidence = Route1ReferenceBoundsSummary & {
  scene_stats: {
    mesh_count: number;
    vertex_count: number;
    triangle_count: number;
  };
};

function requireBedrockReferenceProject(): void {
  if (!Project) {
    throw new Error(
      "Open or create the intended Bedrock project before managing Route 1 geometry evidence."
    );
  }
  const format = Format as
    | { id?: string; forward_direction?: string }
    | undefined;
  if (format?.id !== "bedrock") {
    throw new Error(
      `Route 1 geometry reference requires bedrock format; current format is ${format?.id ?? "unknown"}.`
    );
  }
  const direction = format.forward_direction ?? "-z";
  if (direction !== "+z" && direction !== "-z") {
    throw new Error(
      `Route 1 v1 supports Bedrock project front +z/-z only; current forward direction is ${String(direction)}.`
    );
  }
}

function projectFrontDirection(): Route1FrontDirection {
  const direction =
    (Format as { forward_direction?: string } | undefined)?.forward_direction ??
    "-z";
  const parsed = route1FrontDirectionSchema.safeParse(direction);
  if (!parsed.success) {
    throw new Error(
      `Unsupported Blockbench forward direction ${direction} for Route 1 v1.`
    );
  }
  return parsed.data;
}

export function route1ReferenceYawDegrees(
  source: Route1FrontDirection,
  target: Route1FrontDirection
): number {
  return source === target ? 0 : 180;
}

export function summarizeRoute1WorldBounds(
  min: Vec3,
  max: Vec3,
  blockSize: number
): Route1ReferenceBoundsSummary {
  if (!Number.isFinite(blockSize) || blockSize <= 0) {
    throw new Error("Route 1 reference block size must be finite and positive.");
  }
  if (![...min, ...max].every(Number.isFinite)) {
    throw new Error("Route 1 reference world bounds must be finite.");
  }

  const size: Vec3 = [
    max[0] - min[0],
    max[1] - min[1],
    max[2] - min[2],
  ];
  if (size.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new Error(
      "Route 1 reference must have positive finite 3D span on X, Y, and Z."
    );
  }

  const center: Vec3 = [
    min[0] + size[0] / 2,
    min[1] + size[1] / 2,
    min[2] + size[2] / 2,
  ];
  const dimensionsBlockbenchUnits = {
    width: size[0],
    height: size[1],
    length: size[2],
  };

  return {
    bounds_basis: "raw_reference_world_aabb",
    blockbench_units_per_block: blockSize,
    world_bounds: {
      min: [min[0], min[1], min[2]],
      max: [max[0], max[1], max[2]],
      center,
      size_xyz: size,
    },
    dimensions_blockbench_units: dimensionsBlockbenchUnits,
    dimensions_blocks: {
      width: dimensionsBlockbenchUnits.width / blockSize,
      height: dimensionsBlockbenchUnits.height / blockSize,
      length: dimensionsBlockbenchUnits.length / blockSize,
    },
  };
}

export function isBlockItRoute1Reference(
  element: unknown
): element is ReferenceModelRuntime {
  if (!element || typeof element !== "object") return false;
  const value = element as {
    type?: unknown;
    name?: unknown;
    route1_owned?: unknown;
  };
  return (
    value.type === "reference_model" &&
    (value.route1_owned === true ||
      (typeof value.name === "string" &&
        value.name.startsWith(BLOCKIT_ROUTE1_REFERENCE_PREFIX)))
  );
}

export function listBlockItRoute1References(): ReferenceModelRuntime[] {
  if (typeof Outliner === "undefined") return [];
  return (Outliner.elements ?? []).filter(isBlockItRoute1Reference);
}

function isLoadedReference(reference: ReferenceModelRuntime): boolean {
  return Boolean(reference.mesh && reference.mesh.children.length > 0);
}

export function assertRoute1ReferenceInvariant(
  reference: ReferenceModelRuntime
): void {
  if (reference.parent !== "root") {
    throw new Error(
      `Route 1 geometry reference ${reference.name || reference.uuid} must remain at the outliner root. Remove and reload it with manage_geometry_reference.`
    );
  }
  if (reference.locked !== true) {
    throw new Error(
      `Route 1 geometry reference ${reference.name || reference.uuid} must remain locked. Remove and reload it with manage_geometry_reference.`
    );
  }
  if (reference.export !== false) {
    throw new Error(
      `Route 1 geometry reference ${reference.name || reference.uuid} must remain export=false. Remove and reload it with manage_geometry_reference.`
    );
  }

  const [sx, sy, sz] = reference.scale ?? [];
  if (
    ![sx, sy, sz].every(
      (value) => typeof value === "number" && Number.isFinite(value) && value > 0
    ) ||
    Math.abs(sx - sy) > 1e-9 ||
    Math.abs(sx - sz) > 1e-9
  ) {
    throw new Error(
      `Route 1 geometry reference ${reference.name || reference.uuid} must keep uniform positive scale. Remove and reload it with manage_geometry_reference.`
    );
  }
}

export function readRoute1ReferenceEvidence(
  reference: ReferenceModelRuntime
): Route1ReferenceEvidence {
  assertRoute1ReferenceInvariant(reference);
  if (!reference.mesh || !isLoadedReference(reference)) {
    throw new Error(
      `Route 1 geometry reference ${reference.name || reference.uuid} is not fully loaded.`
    );
  }

  reference.mesh.updateMatrixWorld(true);
  // @ts-expect-error Blockbench provides THREE as a runtime global; current runtime accepts the precise Box3 flag even when installed typings lag it.
  const box = new THREE.Box3().setFromObject(reference.mesh, true);
  if (box.isEmpty()) {
    throw new Error(
      `Route 1 geometry reference ${reference.name || reference.uuid} has no measurable 3D bounds.`
    );
  }

  const rawBlockSize = (Format as { block_size?: number } | undefined)?.block_size;
  const blockSize =
    typeof rawBlockSize === "number" &&
    Number.isFinite(rawBlockSize) &&
    rawBlockSize > 0
      ? rawBlockSize
      : 16;
  const summary = summarizeRoute1WorldBounds(
    [box.min.x, box.min.y, box.min.z],
    [box.max.x, box.max.y, box.max.z],
    blockSize
  );

  let meshCount = 0;
  let vertexCount = 0;
  let triangleCount = 0;
  reference.mesh.traverse((object) => {
    const candidate = object as THREE.Object3D & {
      isMesh?: boolean;
      geometry?: {
        attributes?: { position?: { count?: number } };
        index?: { count?: number } | null;
      };
    };
    if (candidate.isMesh !== true) return;
    meshCount += 1;

    const rawVertexCount = candidate.geometry?.attributes?.position?.count;
    const vertices =
      typeof rawVertexCount === "number" &&
      Number.isFinite(rawVertexCount) &&
      rawVertexCount > 0
        ? Math.floor(rawVertexCount)
        : 0;
    vertexCount += vertices;

    const rawIndexCount = candidate.geometry?.index?.count;
    const indices =
      typeof rawIndexCount === "number" &&
      Number.isFinite(rawIndexCount) &&
      rawIndexCount > 0
        ? Math.floor(rawIndexCount)
        : 0;
    triangleCount += Math.floor((indices > 0 ? indices : vertices) / 3);
  });

  if (meshCount === 0 || vertexCount === 0 || triangleCount === 0) {
    throw new Error(
      `Route 1 geometry reference ${reference.name || reference.uuid} loaded without usable triangle-mesh evidence.`
    );
  }

  return {
    ...summary,
    scene_stats: {
      mesh_count: meshCount,
      vertex_count: vertexCount,
      triangle_count: triangleCount,
    },
  };
}

export function hasVisibleLoadedBlockItRoute1Reference(): boolean {
  return listBlockItRoute1References().some((reference) => {
    if (reference.visibility === false || !isLoadedReference(reference)) {
      return false;
    }
    assertRoute1ReferenceInvariant(reference);
    return true;
  });
}

function resolveBlockItRoute1Reference(id: string): ReferenceModelRuntime {
  const references = listBlockItRoute1References();
  const uuidMatch = references.find((reference) => reference.uuid === id);
  if (uuidMatch) return uuidMatch;

  const nameMatches = references.filter((reference) => reference.name === id);
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(
      `Route 1 geometry reference name "${id}" is ambiguous. Use the UUID.`
    );
  }
  throw new Error(`Route 1 geometry reference "${id}" not found.`);
}

function referenceConstructor(): ReferenceModelConstructor {
  const types = (
    OutlinerElement as unknown as {
      types?: Record<string, ReferenceModelConstructor>;
    }
  ).types;
  const ReferenceModel = types?.reference_model;
  if (!ReferenceModel) {
    throw new Error(
      "Blockbench Reference Models plugin is not active. Enable it, reload BlockIT, then retry manage_geometry_reference."
    );
  }
  return ReferenceModel;
}

function localReferenceFilesystem(): ReferenceFilesystem {
  // @ts-ignore - requireNativeModule is a Blockbench desktop global.
  const fs = requireNativeModule("fs", {
    message: "BlockIT Route 1 needs read access to the approved local GLB",
  }) as ReferenceFilesystem | null;
  if (!fs) {
    throw new Error(
      "File system access was denied for the approved local Route 1 GLB."
    );
  }
  return fs;
}

function referenceName(path: string): string {
  const file = path.replace(/\\/g, "/").split("/").pop() ?? "reference.glb";
  const stem =
    file
      .replace(/\.glb$/i, "")
      .replace(/[^A-Za-z0-9._-]+/g, "_")
      .slice(0, 80) || "reference";
  return `${BLOCKIT_ROUTE1_REFERENCE_PREFIX}${stem}`;
}

function sameVec3(a: readonly number[], b: readonly number[]): boolean {
  return (
    a.length >= 3 &&
    b.length >= 3 &&
    a.slice(0, 3).every((value, axis) => value === b[axis])
  );
}

function refreshReference(reference: ReferenceModelRuntime): void {
  reference.preview_controller?.updateTransform?.(reference);
  reference.preview_controller?.updateVisibility?.(reference);
  reference.preview_controller?.updateSelection?.(reference);
  reference.mesh?.updateMatrixWorld(true);
}

async function waitForReferenceLoad(
  reference: ReferenceModelRuntime,
  timeoutMs = 20_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (isLoadedReference(reference)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(
    `Timed out waiting for Blockbench Reference Models to load ${reference.path ?? "the GLB"}.`
  );
}

function referenceState(reference: ReferenceModelRuntime) {
  return {
    uuid: reference.uuid,
    name: reference.name,
    path: reference.path ?? null,
    route1_owned: true,
    reference_only: true,
    production_geometry: false,
    loaded: isLoadedReference(reference),
    origin: [...reference.origin],
    rotation: [...reference.rotation],
    scale: [...reference.scale],
    visibility: reference.visibility !== false,
    wireframe: reference.wireframe === true,
    locked: reference.locked === true,
    export: reference.export !== false,
    parent: reference.parent === "root" ? "root" : "non_root",
    evidence: isLoadedReference(reference)
      ? readRoute1ReferenceEvidence(reference)
      : null,
    warning:
      "GLB is depth/volume/attachment evidence only. evidence.world_bounds includes every loaded mesh fragment; requested dimensions and the approved Minecraft reference remain authoritative, and raw reconstruction bounds must not define target size.",
  };
}

export function registerProjectTools() {
  createTool(projectToolDocs[0].name, {
    ...projectToolDocs[0],
    async execute({ name, discard_unsaved, resolution }) {
      if (Project && Project.saved === false && discard_unsaved !== true) {
        throw new Error(
          `The open project "${Project.name}" has unsaved changes. Save it first, or pass discard_unsaved: true to abandon them.`
        );
      }

      const created = newProject(Formats.bedrock);

      if (!created) {
        throw new Error("Failed to create project.");
      }

      Project!.name = name;
      Project!.texture_width = resolution ?? DEFAULT_BEDROCK_UV_RESOLUTION;
      Project!.texture_height = resolution ?? DEFAULT_BEDROCK_UV_RESOLUTION;

      const result = {
        project: currentProjectLifecycle(),
        format: { id: "bedrock" as const },
        resolution: {
          texture_width: Project!.texture_width ?? null,
          texture_height: Project!.texture_height ?? null,
        },
      };

      return {
        content: [
          {
            type: "text" as const,
            text: `Created Bedrock project "${result.project.name}" (${result.project.uuid}) with ${result.resolution.texture_width}×${result.resolution.texture_height} logical UV canvas.`,
          },
        ],
        structuredContent: result,
      };
    },
  }, projectToolDocs[0].status);

  createTool(projectToolDocs[1].name, {
    ...projectToolDocs[1],
    async execute() {
      if (!Project) {
        throw new Error(
          "No project is open. Use create_project to start a new one, or open an existing file in Blockbench."
        );
      }

      const format = Format as
        | { id?: string; name?: string; display_name?: string }
        | undefined;
      const rootGroupCount = Outliner.root.reduce(
        (count, node) => count + (node instanceof Group ? 1 : 0),
        0
      );

      const result = {
        project: currentProjectLifecycle(),
        format: {
          id: format?.id ?? null,
          name: format?.display_name ?? format?.name ?? null,
        },
        resolution: {
          texture_width: Project.texture_width ?? null,
          texture_height: Project.texture_height ?? null,
        },
        counts: {
          cubes: Cube.all.length,
          groups: Group.all.length,
          textures: Texture.all.length,
          outliner_elements: Outliner.elements.length,
          root_groups: rootGroupCount,
        },
      };

      return {
        content: [
          {
            type: "text" as const,
            text: `Project ${result.project.name}: ${result.counts.cubes} Cubes, ${result.counts.groups} Groups, ${result.counts.textures} Textures.`,
          },
        ],
        structuredContent: result,
      };
    },
  }, projectToolDocs[1].status);

  createTool(projectToolDocs[2].name, {
    ...projectToolDocs[2],
    async execute() {
      if (!Project) {
        throw new Error(
          "No project is open. Open or create the intended Bedrock project before inspecting model bounds."
        );
      }

      const observed = readRenderedModelBounds();
      const format = Format as { id?: string } | undefined;
      const result = {
        project: {
          uuid: Project.uuid,
          name: Project.name,
          format: format?.id ?? null,
        },
        has_geometry: observed.rendered_cube_count > 0,
        cube_count: observed.total_cube_count,
        rendered_cube_count: observed.rendered_cube_count,
        hidden_cube_count: observed.hidden_cube_count,
        bounds_basis: "rendered_current_pose" as const,
        coordinate_axes: {
          width: "x" as const,
          height: "y" as const,
          length: "z" as const,
        },
        bounds: observed.bounds,
        pose_context: getPoseContext(),
        warnings: observed.warnings,
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    },
  }, projectToolDocs[2].status);

  createTool(projectToolDocs[3].name, {
    ...projectToolDocs[3],
    parameters: manageGeometryReferenceParameters,
    async execute(input) {
      requireBedrockReferenceProject();
      const parsed = manageGeometryReferenceParameters.parse(input);

      if (parsed.action === "load") {
        if (listBlockItRoute1References().length > 0) {
          throw new Error(
            "A BlockIT Route 1 reference is already active. Update or remove it before loading another."
          );
        }

        const path = parsed.path!;
        const fs = localReferenceFilesystem();
        if (!fs.existsSync(path) || !fs.statSync(path).isFile()) {
          throw new Error(`Route 1 GLB file not found: ${path}`);
        }

        const sourceFront = parsed.source_front_direction!;
        const targetFront = projectFrontDirection();
        const yaw = route1ReferenceYawDegrees(sourceFront, targetFront);
        const uniformScale = parsed.uniform_scale ?? 1;
        const ReferenceModel = referenceConstructor();
        let reference: ReferenceModelRuntime | null = null;

        Undo.initEdit({ outliner: true, elements: [], selection: true });
        try {
          reference = new ReferenceModel({
            name: referenceName(path),
            path,
            origin: parsed.origin ?? [0, 0, 0],
            rotation: [0, yaw, 0],
            scale: [uniformScale, uniformScale, uniformScale],
            visibility: parsed.visibility ?? true,
            wireframe: parsed.wireframe ?? false,
            locked: true,
            export: false,
          }).init() as ReferenceModelRuntime;
          reference.route1_owned = true;
          reference.addTo("root");
          await waitForReferenceLoad(reference);
          reference.locked = true;
          reference.export = false;
          refreshReference(reference);
          readRoute1ReferenceEvidence(reference);
          Undo.finishEdit("Load Route 1 geometry reference", {
            outliner: true,
            elements: [reference],
            selection: true,
          });
        } catch (error) {
          try {
            Undo.cancelEdit(true);
          } finally {
            if (
              reference &&
              (Outliner.elements ?? []).some(
                (element) => element.uuid === reference!.uuid
              )
            ) {
              reference.remove();
            }
          }
          throw error;
        }

        const result = {
          action: "load" as const,
          reference: referenceState(reference),
          alignment: {
            source_front_direction: sourceFront,
            project_front_direction: targetFront,
            applied_yaw_degrees: yaw,
            y_up_required: true,
            uniform_scale_only: true,
          },
        };
        return {
          content: [
            {
              type: "text" as const,
              text: `Loaded transient Route 1 GLB reference ${reference.name} (${reference.uuid}); source ${sourceFront} aligned to project ${targetFront} with Y yaw ${yaw}°.`,
            },
          ],
          structuredContent: result,
        };
      }

      const reference = resolveBlockItRoute1Reference(parsed.id!);
      if (parsed.action === "remove") {
        const removed = {
          uuid: reference.uuid,
          name: reference.name,
          path: reference.path ?? null,
        };
        Undo.initEdit({ outliner: true, elements: [reference], selection: true });
        reference.remove();
        Undo.finishEdit("Remove Route 1 geometry reference", {
          outliner: true,
          elements: [reference],
          selection: true,
        });
        return {
          content: [
            {
              type: "text" as const,
              text: `Removed transient Route 1 geometry reference ${removed.name} (${removed.uuid}).`,
            },
          ],
          structuredContent: { action: "remove" as const, removed },
        };
      }

      const nextOrigin = parsed.origin ?? [...reference.origin];
      const nextScale =
        parsed.uniform_scale === undefined
          ? [...reference.scale]
          : [parsed.uniform_scale, parsed.uniform_scale, parsed.uniform_scale];
      const nextVisibility = parsed.visibility ?? reference.visibility;
      const nextWireframe = parsed.wireframe ?? reference.wireframe ?? false;
      if (
        sameVec3(reference.origin, nextOrigin) &&
        sameVec3(reference.scale, nextScale) &&
        reference.visibility === nextVisibility &&
        (reference.wireframe ?? false) === nextWireframe
      ) {
        throw new Error(
          "Route 1 geometry reference update is an exact no-op."
        );
      }

      readRoute1ReferenceEvidence(reference);
      Undo.initEdit({ elements: [reference] });
      const patch = {
        origin: nextOrigin,
        scale: nextScale,
        visibility: nextVisibility,
        wireframe: nextWireframe,
      };
      if (typeof reference.extend === "function") reference.extend(patch);
      else Object.assign(reference, patch);
      reference.route1_owned = true;
      reference.locked = true;
      reference.export = false;
      refreshReference(reference);
      Undo.finishEdit("Update Route 1 geometry reference", {
        elements: [reference],
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Updated transient Route 1 geometry reference ${reference.name} (${reference.uuid}).`,
          },
        ],
        structuredContent: {
          action: "update" as const,
          reference: referenceState(reference),
        },
      };
    },
  }, projectToolDocs[3].status);
}

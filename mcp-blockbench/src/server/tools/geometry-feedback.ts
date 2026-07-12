/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { captureScreenshot } from "@/lib/util";
import {
  assertInsideRoot,
  readJsonFile,
  writeFileAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  auditProjectRotations,
  computeProjectWorldBounds,
  type RotationPolicy,
  type Vec3,
} from "@/lib/worldBounds";

const standardViewEnum = z.enum([
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);

const frontAxisEnum = z.enum(["-z", "+z", "-x", "+x"]);

type StandardView = z.infer<typeof standardViewEnum>;
type FrontAxis = z.infer<typeof frontAxisEnum>;

const inspectReferenceVisualParameters = z.object({
  session_root: z.string().min(1),
  manifest_path: z.string().optional(),
  include_image: z.boolean().optional().default(true),
  max_bytes: z
    .number()
    .int()
    .positive()
    .max(32 * 1024 * 1024)
    .optional()
    .default(12 * 1024 * 1024),
});

const captureVisualFeedbackParameters = z.object({
  project: z.string().optional().describe("Project name or UUID."),
  expected_project_uuid: z.string().optional(),
  session_root: z.string().min(1),
  output_dir: z.string().optional(),
  views: z
    .array(standardViewEnum)
    .min(1)
    .max(5)
    .optional()
    .default(["left_side", "front", "top_footprint"]),
  front_axis: frontAxisEnum.optional().default("-z"),
  margin: z.number().min(1).max(3).optional().default(1.25),
  include_reference: z.boolean().optional().default(false),
  return_images: z.boolean().optional().default(true),
  custom_prefix: z
    .string()
    .regex(/^[a-z0-9_]+$/)
    .optional()
    .default("visual_feedback"),
});

const safeCubeSchema = z.object({
  name: z.string().min(1),
  from: z.array(z.number().finite()).length(3),
  to: z.array(z.number().finite()).length(3),
  origin: z.array(z.number().finite()).length(3).optional(),
  rotation: z
    .array(z.number().finite())
    .length(3)
    .optional()
    .default([0, 0, 0]),
  color: z.number().int().min(0).max(15).optional(),
});

type SafeCubeInput = z.infer<typeof safeCubeSchema>;

const rotationPolicyParameters = {
  allow_compound_rotation: z.boolean().optional().default(false),
  max_abs_rotation: z.number().positive().max(180).optional().default(45),
  pivot_margin_ratio: z.number().min(0).max(4).optional().default(1),
};

const placeCubesSafeParameters = z.object({
  elements: z.array(safeCubeSchema).min(1).max(24),
  group: z.string().optional().default("root"),
  ...rotationPolicyParameters,
});

const cubeChangeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  from: z.array(z.number().finite()).length(3).optional(),
  to: z.array(z.number().finite()).length(3).optional(),
  origin: z.array(z.number().finite()).length(3).optional(),
  rotation: z.array(z.number().finite()).length(3).optional(),
  color: z.number().int().min(0).max(15).optional(),
  inflate: z.number().finite().optional(),
  visibility: z.boolean().optional(),
});

type CubeChangeInput = z.infer<typeof cubeChangeSchema>;

interface ResolvedCubeChange {
  cube: Cube;
  change: CubeChangeInput;
  proposed: {
    name: string;
    from: number[];
    to: number[];
    origin: number[];
    rotation: number[];
  };
}

const modifyCubesParameters = z.object({
  changes: z.array(cubeChangeSchema).min(1).max(16),
  require_explicit_origin_for_rotation: z.boolean().optional().default(true),
  ...rotationPolicyParameters,
});

interface ReferenceManifest {
  asset?: { id?: string };
  package?: { reference_visual?: string };
  reference_visual_lock?: {
    filename?: string;
    sha256?: string;
    width_px?: number;
    height_px?: number;
  };
}

interface ReferenceVisualData {
  filename: string;
  path: string;
  data: Buffer;
  sha256: string;
  width: number | null;
  height: number | null;
  expected_sha256: string | null;
  expected_width: number | null;
  expected_height: number | null;
}

export const geometryFeedbackToolDocs: ToolSpec[] = [
  {
    name: "inspect_reference_visual",
    description:
      "Loads and verifies the approved Reference Visual, then returns it as an MCP image so Codex is visually grounded before Geometry work.",
    annotations: {
      title: "Inspect Reference Visual",
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: inspectReferenceVisualParameters,
    status: STATUS_STABLE,
  },
  {
    name: "capture_visual_feedback",
    description:
      "Captures clean rotation-aware model views and optionally returns the approved Reference Visual in the same response for visual comparison.",
    annotations: {
      title: "Capture Visual Feedback",
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: captureVisualFeedbackParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "place_cubes_safe",
    description:
      "Places a bounded Geometry cube batch with explicit rotation/pivot validation. Compound or unsafe rotations are rejected before mutation.",
    annotations: { title: "Place Cubes Safely", destructiveHint: true },
    parameters: placeCubesSafeParameters,
    status: STATUS_STABLE,
  },
  {
    name: "modify_cubes",
    description:
      "Atomically modifies up to 16 explicit cubes with rotation/pivot guards, one undo record, and rotation-aware before/after bounds.",
    annotations: { title: "Modify Cubes Atomically", destructiveHint: true },
    parameters: modifyCubesParameters,
    status: STATUS_STABLE,
  },
];

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore - Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function sha256(data: string | Buffer): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "Geometry visual grounding requires SHA-256 integrity checks.",
    optional: false,
  }) as {
    createHash: (algorithm: string) => {
      update: (value: string | Buffer) => {
        digest: (encoding: string) => string;
      };
    };
  };
  if (!cryptoModule) throw new Error("Crypto access was denied.");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}

function pngDimensions(data: Buffer): [number | null, number | null] {
  if (data.length < 24 || data.toString("ascii", 1, 4) !== "PNG") {
    return [null, null];
  }
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

function readReferenceVisual(
  fs: NativeFsLike,
  sessionRoot: string,
  manifestPath?: string
): ReferenceVisualData {
  const resolvedManifest =
    manifestPath ?? joinPath(sessionRoot, "references/reference_manifest.json");
  assertInsideRoot(resolvedManifest, sessionRoot);
  const manifest = readJsonFile<ReferenceManifest>(fs, resolvedManifest);
  const filename =
    manifest.reference_visual_lock?.filename ??
    manifest.package?.reference_visual ??
    (manifest.asset?.id
      ? `${manifest.asset.id}_reference_visual.png`
      : "reference_visual.png");
  const path = joinPath(sessionRoot, `references/${filename}`);
  assertInsideRoot(path, sessionRoot);
  if (!fs.existsSync(path)) {
    throw new Error(`REFERENCE_VISUAL_MISSING: ${path}`);
  }

  const raw = fs.readFileSync(path);
  const data = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
  const actualHash = sha256(data);
  const [width, height] = pngDimensions(data);
  const expectedHash =
    manifest.reference_visual_lock?.sha256?.toLowerCase() ?? null;
  const expectedWidth = manifest.reference_visual_lock?.width_px ?? null;
  const expectedHeight = manifest.reference_visual_lock?.height_px ?? null;

  if (expectedHash && actualHash !== expectedHash) {
    throw new Error(
      `REFERENCE_VISUAL_HASH_MISMATCH: ${actualHash}; expected ${expectedHash}.`
    );
  }
  if (expectedWidth && width !== expectedWidth) {
    throw new Error(
      `REFERENCE_VISUAL_WIDTH_MISMATCH: ${width}; expected ${expectedWidth}.`
    );
  }
  if (expectedHeight && height !== expectedHeight) {
    throw new Error(
      `REFERENCE_VISUAL_HEIGHT_MISMATCH: ${height}; expected ${expectedHeight}.`
    );
  }

  return {
    filename,
    path,
    data,
    sha256: actualHash,
    width,
    height,
    expected_sha256: expectedHash,
    expected_width: expectedWidth,
    expected_height: expectedHeight,
  };
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(value: Vec3, amount: number): Vec3 {
  return [value[0] * amount, value[1] * amount, value[2] * amount];
}

function normalize(value: Vec3): Vec3 {
  const length = Math.hypot(value[0], value[1], value[2]);
  return length > 0
    ? [value[0] / length, value[1] / length, value[2] / length]
    : [0, 0, -1];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function frontVector(axis: FrontAxis): Vec3 {
  if (axis === "+z") return [0, 0, 1];
  if (axis === "-x") return [-1, 0, 0];
  if (axis === "+x") return [1, 0, 0];
  return [0, 0, -1];
}

function viewDirection(view: StandardView, axis: FrontAxis): Vec3 {
  const up: Vec3 = [0, 1, 0];
  const front = frontVector(axis);
  const left = scale(normalize(cross(front, up)), -1);
  if (view === "front") return front;
  if (view === "left_side") return left;
  if (view === "back") return scale(front, -1);
  if (view === "top_footprint") return up;
  return normalize(add(add(front, left), scale(up, 0.2)));
}

function withCleanSelection<T>(callback: () => T): T {
  const runtime = globalThis as unknown as {
    Outliner?: { selected?: any[] };
    Transformer?: { visible?: boolean };
    unselectAllElements?: () => void;
  };
  const selected = [...(runtime.Outliner?.selected ?? [])];
  const transformerVisible = runtime.Transformer?.visible;
  try {
    runtime.unselectAllElements?.();
    if (runtime.Transformer) runtime.Transformer.visible = false;
    return callback();
  } finally {
    if (runtime.Transformer && transformerVisible !== undefined) {
      runtime.Transformer.visible = transformerVisible;
    }
    for (const element of selected) {
      if (typeof element?.selectLow === "function") element.selectLow();
      else if (typeof element?.select === "function") element.select();
    }
  }
}

function validateCubeGeometry(
  value: {
    name: string;
    from: number[];
    to: number[];
    origin?: number[];
    rotation?: number[];
  },
  allowCompound: boolean,
  maxAbsRotation: number,
  pivotMarginRatio: number,
  requireExplicitOrigin: boolean
): void {
  const dimensions = value.from.map(
    (coordinate, axis) => value.to[axis] - coordinate
  );
  if (
    dimensions.some(
      (dimension) => !Number.isFinite(dimension) || dimension <= 0
    )
  ) {
    throw new Error(
      `INVALID_CUBE_BOUNDS: ${value.name} requires from < to on every axis.`
    );
  }

  const rotation = value.rotation ?? [0, 0, 0];
  const nonZeroAxes = rotation.filter(
    (angle) => Math.abs(angle) > 1e-6
  ).length;
  if (nonZeroAxes > 0 && requireExplicitOrigin && !value.origin) {
    throw new Error(
      `ROTATION_ORIGIN_REQUIRED: ${value.name} must provide an explicit attachment pivot before rotation.`
    );
  }
  if (!allowCompound && nonZeroAxes > 1) {
    throw new Error(
      `COMPOUND_ROTATION_REJECTED: ${value.name} rotates on ${nonZeroAxes} axes; use one local axis or explicitly allow compound rotation.`
    );
  }
  const maximum = Math.max(...rotation.map((angle) => Math.abs(angle)));
  if (maximum > maxAbsRotation) {
    throw new Error(
      `ROTATION_ANGLE_REJECTED: ${value.name} uses ${maximum}°, above the allowed ${maxAbsRotation}°.`
    );
  }

  if (nonZeroAxes > 0 && value.origin) {
    let squaredDistance = 0;
    for (let axis = 0; axis < 3; axis += 1) {
      const min = Math.min(value.from[axis], value.to[axis]);
      const max = Math.max(value.from[axis], value.to[axis]);
      const delta =
        value.origin[axis] < min
          ? min - value.origin[axis]
          : value.origin[axis] > max
            ? value.origin[axis] - max
            : 0;
      squaredDistance += delta * delta;
    }
    const distance = Math.sqrt(squaredDistance);
    const maxDimension = Math.max(...dimensions);
    if (distance > maxDimension * pivotMarginRatio) {
      throw new Error(
        `ROTATION_PIVOT_REJECTED: ${value.name} pivot is ${distance.toFixed(
          2
        )}u outside its bounds; verify the attachment point.`
      );
    }
  }
}

function geometryFingerprint(): string {
  const cubes = (Cube.all ?? [])
    .map((cube) => ({
      uuid: cube.uuid,
      name: cube.name,
      from: [...cube.from],
      to: [...cube.to],
      origin: [...cube.origin],
      rotation: [...cube.rotation],
      inflate: cube.inflate,
      parent: typeof cube.parent === "string" ? cube.parent : cube.parent?.uuid,
    }))
    .sort((a, b) => String(a.uuid).localeCompare(String(b.uuid)));
  return sha256(JSON.stringify(cubes));
}

function policyFromInput(input: {
  allow_compound_rotation: boolean;
  max_abs_rotation: number;
  pivot_margin_ratio: number;
}): RotationPolicy {
  return {
    preferredAxisCount: 1,
    maximumAxisCount: input.allow_compound_rotation ? 3 : 1,
    maxAbsDegrees: input.max_abs_rotation,
    pivotMarginRatio: input.pivot_margin_ratio,
  };
}

export function registerGeometryFeedbackTools(): void {
  createTool(
    geometryFeedbackToolDocs[0].name,
    {
      ...geometryFeedbackToolDocs[0],
      async execute({ session_root, manifest_path, include_image, max_bytes }) {
        const fs = nativeFs(
          "MCP needs read access to the approved Reference Visual."
        );
        const reference = readReferenceVisual(
          fs,
          session_root,
          manifest_path
        );
        if (reference.data.byteLength > max_bytes) {
          throw new Error(
            `REFERENCE_VISUAL_TOO_LARGE: ${reference.data.byteLength} bytes exceeds ${max_bytes}.`
          );
        }
        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [
          {
            type: "text",
            text: `Approved Reference Visual: ${reference.filename} (${reference.width}×${reference.height}, SHA-256 ${reference.sha256}).`,
          },
        ];
        if (include_image) {
          content.push({
            type: "image",
            data: reference.data.toString("base64"),
            mimeType: "image/png",
          });
        }
        return {
          content,
          structuredContent: {
            status: "PASS",
            reference: {
              filename: reference.filename,
              path: reference.path,
              sha256: reference.sha256,
              width: reference.width,
              height: reference.height,
              returned_image: include_image,
            },
          },
        };
      },
    },
    geometryFeedbackToolDocs[0].status
  );

  createTool(
    geometryFeedbackToolDocs[1].name,
    {
      ...geometryFeedbackToolDocs[1],
      async execute({
        project,
        expected_project_uuid,
        session_root,
        output_dir,
        views,
        front_axis,
        margin,
        include_reference,
        return_images,
        custom_prefix,
      }) {
        let activeProject = Project;
        if (!activeProject) {
          throw new Error("No Blockbench project is open.");
        }
        if (
          expected_project_uuid &&
          activeProject.uuid !== expected_project_uuid
        ) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${activeProject.uuid}, expected ${expected_project_uuid}.`
          );
        }
        if (
          project &&
          activeProject.name !== project &&
          activeProject.uuid !== project
        ) {
          const matched = ModelProject.all.find(
            (candidate) =>
              candidate.name === project || candidate.uuid === project
          );
          if (!matched) throw new Error(`Project "${project}" was not found.`);
          matched.select();
          activeProject = matched;
        }
        if (output_dir) assertInsideRoot(output_dir, session_root);

        const preview = Preview.selected;
        if (!preview) {
          throw new Error("No preview found in the Blockbench editor.");
        }
        const bounds = computeProjectWorldBounds();
        const rotationAudit = auditProjectRotations();
        const distance = Math.max(bounds.maxExtent * 2.4 * margin, 24);
        const fs =
          output_dir || include_reference
            ? nativeFs(
                "MCP visual feedback needs access to Geometry evidence and references."
              )
            : null;
        if (fs && output_dir) {
          fs.mkdirSync(output_dir, { recursive: true });
        }

        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [];
        let reference: ReferenceVisualData | null = null;
        if (include_reference) {
          if (!fs) {
            throw new Error(
              "Filesystem access is required for Reference Visual inspection."
            );
          }
          reference = readReferenceVisual(fs, session_root);
          content.push({
            type: "text",
            text: `REFERENCE: ${reference.filename} (${reference.width}×${reference.height}).`,
          });
          if (return_images) {
            content.push({
              type: "image",
              data: reference.data.toString("base64"),
              mimeType: "image/png",
            });
          }
        }

        const requestedViews = views as StandardView[];
        const captures: Array<Record<string, unknown>> = [];
        withCleanSelection(() => {
          for (const view of requestedViews) {
            const direction = viewDirection(view, front_axis as FrontAxis);
            const position = add(
              bounds.center,
              scale(direction, distance)
            );
            // @ts-ignore - Preview angle preset runtime API.
            preview.loadAnglePreset({
              position,
              target: bounds.center,
              projection:
                view === "front_left_3_4"
                  ? "perspective"
                  : "orthographic",
            });
            const result = captureScreenshot(activeProject.uuid);
            const image = result.content[0];
            if (!image || image.type !== "image") {
              throw new Error(`Failed to capture ${view}.`);
            }
            const data = Buffer.from(image.data, "base64");
            const filename = `${custom_prefix}_${
              view === "top_footprint" ? "top" : view
            }.png`;
            const outputPath = output_dir
              ? joinPath(output_dir, filename)
              : null;
            if (outputPath && fs) {
              assertInsideRoot(outputPath, session_root);
              writeFileAtomically(fs, outputPath, data);
            }
            const [width, height] = pngDimensions(data);
            content.push({
              type: "text",
              text: `CURRENT ${view}: ${outputPath ?? filename}`,
            });
            if (return_images) content.push(image);
            captures.push({
              view,
              filename,
              path: outputPath,
              sha256: sha256(data),
              width,
              height,
              position,
              target: bounds.center,
              projection:
                view === "front_left_3_4"
                  ? "perspective"
                  : "orthographic",
            });
          }
        });

        return {
          content,
          structuredContent: {
            status:
              rotationAudit.status === "REVISION_REQUIRED"
                ? "REVISION_REQUIRED"
                : "PASS",
            instruction:
              "Compare the returned CURRENT views against the approved Reference Visual before any further Geometry mutation. A structural PASS is not a visual PASS.",
            project: {
              name: activeProject.name,
              uuid: activeProject.uuid,
            },
            reference: reference
              ? {
                  filename: reference.filename,
                  sha256: reference.sha256,
                  returned_image: return_images,
                }
              : null,
            world_bounds: bounds,
            rotation_audit: rotationAudit,
            captures,
            geometry_fingerprint: geometryFingerprint(),
          },
        };
      },
    },
    geometryFeedbackToolDocs[1].status
  );

  createTool(
    geometryFeedbackToolDocs[2].name,
    {
      ...geometryFeedbackToolDocs[2],
      async execute({
        elements,
        group,
        allow_compound_rotation,
        max_abs_rotation,
        pivot_margin_ratio,
      }) {
        const groups = Group.all ?? [];
        const targetGroup =
          group === "root"
            ? "root"
            : groups.find(
                (candidate) =>
                  candidate.name === group || candidate.uuid === group
              );
        if (!targetGroup) {
          throw new Error(`Group "${group}" was not found.`);
        }

        const typedElements = elements as SafeCubeInput[];
        for (const element of typedElements) {
          validateCubeGeometry(
            element,
            allow_compound_rotation,
            max_abs_rotation,
            pivot_margin_ratio,
            true
          );
        }

        const beforeBounds =
          Cube.all.length > 0 ? computeProjectWorldBounds() : null;
        Undo.initEdit({ elements: [], outliner: true, collections: [] });
        try {
          const cubes: Cube[] = typedElements.map((element) => {
            const cube = new Cube({
              name: element.name,
              from: element.from as Vec3,
              to: element.to as Vec3,
              origin: (element.origin ?? [0, 0, 0]) as Vec3,
              rotation: element.rotation as Vec3,
              ...(element.color !== undefined
                ? { color: element.color }
                : {}),
            }).init();
            cube.addTo(targetGroup);
            return cube;
          });
          Canvas.updateAll();
          const policy = policyFromInput({
            allow_compound_rotation,
            max_abs_rotation,
            pivot_margin_ratio,
          });
          const audit = auditProjectRotations(policy);
          const newIds = new Set(cubes.map((cube) => cube.uuid));
          const blocking = audit.issues.filter(
            (issue) =>
              issue.severity === "REVISION_REQUIRED" &&
              newIds.has(issue.cube.uuid)
          );
          if (blocking.length > 0) {
            throw new Error(
              `ROTATION_SAFETY_REJECTED: ${blocking
                .map((issue) => issue.message)
                .join(" ")}`
            );
          }
          Undo.finishEdit("Agent placed rotation-safe cube batch");
          return {
            content: [
              {
                type: "text",
                text: `Placed ${cubes.length} rotation-safe cube(s).`,
              },
            ],
            structuredContent: {
              status: "PASS",
              cubes: cubes.map((cube) => ({
                name: cube.name,
                uuid: cube.uuid,
              })),
              before_world_bounds: beforeBounds,
              after_world_bounds: computeProjectWorldBounds(),
              rotation_audit: audit,
              geometry_fingerprint: geometryFingerprint(),
            },
          };
        } catch (error) {
          Undo.cancelEdit();
          Canvas.updateAll();
          throw error;
        }
      },
    },
    geometryFeedbackToolDocs[2].status
  );

  createTool(
    geometryFeedbackToolDocs[3].name,
    {
      ...geometryFeedbackToolDocs[3],
      async execute({
        changes,
        require_explicit_origin_for_rotation,
        allow_compound_rotation,
        max_abs_rotation,
        pivot_margin_ratio,
      }) {
        const seen = new Set<string>();
        const typedChanges = changes as CubeChangeInput[];
        const resolved: ResolvedCubeChange[] = typedChanges.map((change) => {
          const cube = Cube.all.find(
            (candidate) =>
              candidate.uuid === change.id || candidate.name === change.id
          );
          if (!cube) throw new Error(`Cube "${change.id}" was not found.`);
          if (seen.has(cube.uuid)) {
            throw new Error(`DUPLICATE_CUBE_CHANGE: ${change.id}`);
          }
          seen.add(cube.uuid);
          const proposed = {
            name: change.name ?? cube.name,
            from: change.from ?? [...cube.from],
            to: change.to ?? [...cube.to],
            origin: change.origin ?? [...cube.origin],
            rotation: change.rotation ?? [...cube.rotation],
          };
          validateCubeGeometry(
            {
              ...proposed,
              origin:
                change.rotation &&
                require_explicit_origin_for_rotation &&
                !change.origin
                  ? undefined
                  : proposed.origin,
            },
            allow_compound_rotation,
            max_abs_rotation,
            pivot_margin_ratio,
            Boolean(
              change.rotation && require_explicit_origin_for_rotation
            )
          );
          return { cube, change, proposed };
        });

        const beforeBounds = computeProjectWorldBounds();
        Undo.initEdit({
          elements: resolved.map(({ cube }) => cube),
          outliner: true,
          collections: [],
        });
        try {
          for (const { cube, change, proposed } of resolved) {
            cube.extend({
              name: proposed.name,
              from: proposed.from as Vec3,
              to: proposed.to as Vec3,
              origin: proposed.origin as Vec3,
              rotation: proposed.rotation as Vec3,
              color: change.color ?? cube.color,
              inflate: change.inflate ?? cube.inflate,
              visibility: change.visibility ?? cube.visibility,
            });
          }
          Canvas.updateAll();
          const policy = policyFromInput({
            allow_compound_rotation,
            max_abs_rotation,
            pivot_margin_ratio,
          });
          const audit = auditProjectRotations(policy);
          const changedIds = new Set(
            resolved.map(({ cube }) => cube.uuid)
          );
          const blocking = audit.issues.filter(
            (issue) =>
              issue.severity === "REVISION_REQUIRED" &&
              changedIds.has(issue.cube.uuid)
          );
          if (blocking.length > 0) {
            throw new Error(
              `ROTATION_SAFETY_REJECTED: ${blocking
                .map((issue) => issue.message)
                .join(" ")}`
            );
          }
          Undo.finishEdit("Agent modified rotation-safe cube batch");
          return {
            content: [
              {
                type: "text",
                text: `Modified ${resolved.length} cube(s) atomically with rotation safety checks.`,
              },
            ],
            structuredContent: {
              status: "PASS",
              cubes: resolved.map(({ cube }) => ({
                name: cube.name,
                uuid: cube.uuid,
              })),
              before_world_bounds: beforeBounds,
              after_world_bounds: computeProjectWorldBounds(),
              rotation_audit: audit,
              geometry_fingerprint: geometryFingerprint(),
            },
          };
        } catch (error) {
          Undo.cancelEdit();
          Canvas.updateAll();
          throw error;
        }
      },
    },
    geometryFeedbackToolDocs[3].status
  );
}

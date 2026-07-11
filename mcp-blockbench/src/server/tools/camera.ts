/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { captureScreenshot, captureAppScreenshot } from "@/lib/util";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { vector3Schema, projectionEnum } from "@/lib/zodObjects";
import {
  assertInsideRoot,
  writeFileAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { getExecutionProfileState } from "@/lib/executionState";

export const captureScreenshotParameters = z.object({
  project: z.string().optional().describe("Project name or UUID."),
});

export const captureAppScreenshotParameters = z.object({});

export const setCameraAngleParameters = z.object({
  position: vector3Schema.describe("Camera position."),
  target: vector3Schema.optional().describe("Camera target position."),
  rotation: vector3Schema.optional().describe("Camera rotation."),
  projection: projectionEnum.describe("Camera projection type."),
});

const standardViewEnum = z.enum([
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);

export const captureStandardViewsParameters = z
  .object({
    project: z.string().optional().describe("Project name or UUID."),
    expected_project_uuid: z
      .string()
      .optional()
      .describe("Fails when the active project UUID differs."),
    stage: z
      .enum(["GEOMETRY", "TEXTURE", "FINAL", "CUSTOM"])
      .optional()
      .default("CUSTOM")
      .describe("Controls stable evidence filename prefixes."),
    views: z
      .array(standardViewEnum)
      .min(1)
      .optional()
      .default([
        "front",
        "left_side",
        "back",
        "top_footprint",
        "front_left_3_4",
      ]),
    front_axis: z
      .enum(["-z", "+z", "-x", "+x"])
      .optional()
      .default("-z")
      .describe("Approved model-facing axis."),
    margin: z.number().min(1).max(3).optional().default(1.25),
    output_dir: z
      .string()
      .optional()
      .describe("Absolute evidence directory inside session_root."),
    session_root: z
      .string()
      .optional()
      .describe("Absolute active asset-session root required for file output."),
    return_images: z
      .boolean()
      .optional()
      .describe(
        "Return image payloads. Defaults to false when files are written and true otherwise."
      ),
    custom_prefix: z
      .string()
      .regex(/^[a-z0-9_]+$/)
      .optional()
      .describe("Filename prefix used only when stage is CUSTOM."),
  })
  .superRefine((value, context) => {
    if (value.output_dir && !value.session_root) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["session_root"],
        message: "session_root is required when output_dir is provided.",
      });
    }
    if (value.stage === "CUSTOM" && value.output_dir && !value.custom_prefix) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["custom_prefix"],
        message: "custom_prefix is required for CUSTOM file output.",
      });
    }
  });

export const cameraToolDocs: ToolSpec[] = [
  {
    name: "capture_screenshot",
    description: "Returns the current 3D preview image.",
    annotations: { title: "Capture Screenshot", readOnlyHint: true },
    parameters: captureScreenshotParameters,
    status: STATUS_STABLE,
  },
  {
    name: "capture_app_screenshot",
    description: "Returns an image of the entire Blockbench app.",
    annotations: { title: "Capture App Screenshot", readOnlyHint: true },
    parameters: captureAppScreenshotParameters,
    status: STATUS_STABLE,
  },
  {
    name: "set_camera_angle",
    description: "Sets the selected preview camera to an explicit angle.",
    annotations: { title: "Set Camera Angle", destructiveHint: true },
    parameters: setCameraAngleParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "capture_standard_views",
    description:
      "Captures consistent review views in one call, writes sandboxed evidence atomically, and omits large image payloads when file output is used.",
    annotations: {
      title: "Capture Standard Views",
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: captureStandardViewsParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type Vec3 = [number, number, number];
type StandardView = z.infer<typeof standardViewEnum>;

interface Bounds {
  min: Vec3;
  max: Vec3;
  center: Vec3;
  size: Vec3;
  maxExtent: number;
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(v: Vec3, amount: number): Vec3 {
  return [v[0] * amount, v[1] * amount, v[2] * amount];
}

function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]);
  if (length === 0) return [0, 0, 1];
  return [v[0] / length, v[1] / length, v[2] / length];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function getFrontVector(axis: "-z" | "+z" | "-x" | "+x"): Vec3 {
  if (axis === "+z") return [0, 0, 1];
  if (axis === "-x") return [-1, 0, 0];
  if (axis === "+x") return [1, 0, 0];
  return [0, 0, -1];
}

function getModelBounds(): Bounds {
  const points: Vec3[] = [];
  for (const cube of Cube.all) {
    const from = cube.from as Vec3;
    const to = cube.to as Vec3;
    points.push(
      [Math.min(from[0], to[0]), Math.min(from[1], to[1]), Math.min(from[2], to[2])],
      [Math.max(from[0], to[0]), Math.max(from[1], to[1]), Math.max(from[2], to[2])]
    );
  }
  for (const mesh of Mesh.all) {
    const vertices = (mesh as unknown as { vertices?: Record<string, number[]> }).vertices;
    for (const vertex of Object.values(vertices ?? {})) {
      if (vertex.length >= 3) points.push([vertex[0], vertex[1], vertex[2]]);
    }
  }
  if (!points.length) throw new Error("No cube or mesh geometry exists to frame.");

  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const point of points) {
    for (let axis = 0; axis < 3; axis++) {
      min[axis] = Math.min(min[axis], point[axis]);
      max[axis] = Math.max(max[axis], point[axis]);
    }
  }
  const size: Vec3 = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const center: Vec3 = [
    (min[0] + max[0]) / 2,
    (min[1] + max[1]) / 2,
    (min[2] + max[2]) / 2,
  ];
  return { min, max, center, size, maxExtent: Math.max(...size, 1) };
}

function getViewDirection(
  view: StandardView,
  frontAxis: "-z" | "+z" | "-x" | "+x"
): Vec3 {
  const up: Vec3 = [0, 1, 0];
  const front = getFrontVector(frontAxis);
  const left = scale(normalize(cross(front, up)), -1);
  if (view === "front") return front;
  if (view === "left_side") return left;
  if (view === "back") return scale(front, -1);
  if (view === "top_footprint") return up;
  return normalize(add(add(front, left), scale(up, 0.16)));
}

function filenameFor(
  stage: "GEOMETRY" | "TEXTURE" | "FINAL" | "CUSTOM",
  view: StandardView,
  customPrefix?: string
): string {
  const prefix =
    stage === "GEOMETRY"
      ? "geometry"
      : stage === "TEXTURE"
        ? "texture"
        : stage === "FINAL"
          ? "final"
          : customPrefix ?? "preview";
  return `${prefix}_${view === "top_footprint" ? "top" : view}.png`;
}

function joinPath(directory: string, filename: string): string {
  const separator = directory.includes("\\") && !directory.includes("/") ? "\\" : "/";
  return `${directory.replace(/[\\/]$/, "")}${separator}${filename}`;
}

function nativeFs(outputDir: string): NativeFsLike {
  // @ts-ignore - Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: `MCP capture_standard_views requested write access to ${outputDir}`,
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function sha256(data: Buffer): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "MCP evidence capture needs SHA-256 hashing for integrity metadata.",
    optional: false,
  }) as { createHash: (algorithm: string) => { update: (value: Buffer) => any; digest: (encoding: string) => string } };
  if (!cryptoModule) throw new Error("Crypto access was denied.");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}

function pngDimensions(data: Buffer): [number | null, number | null] {
  if (data.length < 24 || data.toString("ascii", 1, 4) !== "PNG") return [null, null];
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

export function registerCameraTools(): void {
  createTool(
    cameraToolDocs[0].name,
    {
      ...cameraToolDocs[0],
      async execute({ project }) {
        return captureScreenshot(project);
      },
    },
    cameraToolDocs[0].status
  );

  createTool(
    cameraToolDocs[1].name,
    {
      ...cameraToolDocs[1],
      async execute() {
        return captureAppScreenshot();
      },
    },
    cameraToolDocs[1].status
  );

  createTool(
    cameraToolDocs[2].name,
    {
      ...cameraToolDocs[2],
      async execute(angle) {
        const preview = Preview.selected;
        if (!preview) throw new Error("No preview found in the Blockbench editor.");
        // @ts-ignore - Preview angle preset runtime API.
        preview.loadAnglePreset({ ...angle });
        return captureScreenshot();
      },
    },
    cameraToolDocs[2].status
  );

  createTool(
    cameraToolDocs[3].name,
    {
      ...cameraToolDocs[3],
      async execute({
        project,
        expected_project_uuid,
        stage,
        views,
        front_axis,
        margin,
        output_dir,
        session_root,
        return_images,
        custom_prefix,
      }) {
        if (!Project) throw new Error("No project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        if (project && Project.name !== project && Project.uuid !== project) {
          const matched = ModelProject.all.find(
            (candidate) => candidate.name === project || candidate.uuid === project
          );
          if (!matched) throw new Error(`Project "${project}" was not found.`);
          matched.select();
        }
        if (output_dir && session_root) assertInsideRoot(output_dir, session_root);

        const preview = Preview.selected;
        if (!preview) throw new Error("No preview found in the Blockbench editor.");
        const bounds = getModelBounds();
        const distance = Math.max(bounds.maxExtent * 2.4 * margin, 24);
        const includeImages = return_images ?? !output_dir;
        const fs = output_dir ? nativeFs(output_dir) : null;
        if (fs && output_dir) fs.mkdirSync(output_dir, { recursive: true });
        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [];
        const captures: Array<Record<string, unknown>> = [];
        const profile = getExecutionProfileState();

        for (const view of views) {
          const direction = getViewDirection(view, front_axis);
          const position = add(bounds.center, scale(direction, distance));
          // @ts-ignore - Preview angle preset runtime API.
          preview.loadAnglePreset({
            position,
            target: bounds.center,
            projection: "orthographic",
          });

          const result = captureScreenshot(Project.uuid);
          const image = result.content[0];
          if (!image || image.type !== "image") {
            throw new Error(`Failed to capture ${view}.`);
          }
          const data = Buffer.from(image.data, "base64");
          const filename = filenameFor(stage, view, custom_prefix);
          const outputPath = output_dir ? joinPath(output_dir, filename) : null;
          if (outputPath && fs && session_root) {
            assertInsideRoot(outputPath, session_root);
            writeFileAtomically(fs, outputPath, data);
          }
          const [width, height] = pngDimensions(data);
          content.push({ type: "text", text: `${view}: ${outputPath ?? filename}` });
          if (includeImages) content.push(image);
          captures.push({
            view,
            filename,
            path: outputPath,
            sha256: sha256(data),
            byte_length: data.byteLength,
            width,
            height,
            position,
            target: bounds.center,
            projection: "orthographic",
          });
        }

        return {
          content,
          structuredContent: {
            status: "PASS",
            project: { name: Project.name, uuid: Project.uuid },
            stage,
            front_axis,
            bounds,
            margin,
            returned_images: includeImages,
            profile,
            captures,
          },
        };
      },
    },
    cameraToolDocs[3].status
  );
}

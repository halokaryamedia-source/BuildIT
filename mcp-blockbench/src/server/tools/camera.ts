/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { captureScreenshot, captureAppScreenshot } from "@/lib/util";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { vector3Schema, projectionEnum } from "@/lib/zodObjects";

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

export const captureStandardViewsParameters = z.object({
  project: z.string().optional().describe("Project name or UUID."),
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
    .describe("Approved model-facing axis. Default Bedrock reference convention is -Z."),
  margin: z
    .number()
    .min(1)
    .max(3)
    .optional()
    .default(1.25)
    .describe("Framing multiplier around the model bounds."),
  output_dir: z
    .string()
    .optional()
    .describe(
      "Optional absolute directory for PNG evidence. When omitted, images are returned only in the MCP response."
    ),
  custom_prefix: z
    .string()
    .regex(/^[a-z0-9_]+$/)
    .optional()
    .describe("Filename prefix used only when stage is CUSTOM."),
});

export const cameraToolDocs: ToolSpec[] = [
  {
    name: "capture_screenshot",
    description: "Returns the image data of the current 3D preview view.",
    annotations: {
      title: "Capture Screenshot",
      readOnlyHint: true,
    },
    parameters: captureScreenshotParameters,
    status: STATUS_STABLE,
  },
  {
    name: "capture_app_screenshot",
    description: "Returns the image data of the entire Blockbench app.",
    annotations: {
      title: "Capture App Screenshot",
      readOnlyHint: true,
    },
    parameters: captureAppScreenshotParameters,
    status: STATUS_STABLE,
  },
  {
    name: "set_camera_angle",
    description: "Sets the selected preview camera to an explicit angle.",
    annotations: {
      title: "Set Camera Angle",
      destructiveHint: true,
    },
    parameters: setCameraAngleParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "capture_standard_views",
    description:
      "Captures consistent Front, Left Side, Back, Top/Footprint, and Front-left 3/4 evidence in one call, with optional stable PNG output paths.",
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
  switch (axis) {
    case "+z":
      return [0, 0, 1];
    case "-x":
      return [-1, 0, 0];
    case "+x":
      return [1, 0, 0];
    case "-z":
    default:
      return [0, 0, -1];
  }
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
    if (!vertices) continue;
    for (const vertex of Object.values(vertices)) {
      if (Array.isArray(vertex) && vertex.length >= 3) {
        points.push([Number(vertex[0]), Number(vertex[1]), Number(vertex[2])]);
      }
    }
  }

  if (points.length === 0) {
    throw new Error("No cube or mesh geometry exists to frame.");
  }

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

  return {
    min,
    max,
    center,
    size,
    maxExtent: Math.max(size[0], size[1], size[2], 1),
  };
}

function getViewDirection(view: StandardView, frontAxis: "-z" | "+z" | "-x" | "+x"): Vec3 {
  const up: Vec3 = [0, 1, 0];
  const front = getFrontVector(frontAxis);
  const right = normalize(cross(front, up));
  const left = scale(right, -1);

  switch (view) {
    case "front":
      return front;
    case "left_side":
      return left;
    case "back":
      return scale(front, -1);
    case "top_footprint":
      return up;
    case "front_left_3_4":
      return normalize(add(add(front, left), scale(up, 0.16)));
  }
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
  const suffix = view === "top_footprint" ? "top" : view;
  return `${prefix}_${suffix}.png`;
}

function joinPath(directory: string, filename: string): string {
  const separator = directory.includes("\\") && !directory.includes("/") ? "\\" : "/";
  return `${directory.replace(/[\\/]$/, "")}${separator}${filename}`;
}

export function registerCameraTools() {
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
      async execute(angle: {
        position: number[];
        target?: number[];
        rotation?: number[];
        projection: string;
      }) {
        const preview = Preview.selected;
        if (!preview) {
          throw new Error("No preview found in the Blockbench editor.");
        }
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
        stage,
        views,
        front_axis,
        margin,
        output_dir,
        custom_prefix,
      }) {
        if (!Project) {
          throw new Error("No project is open.");
        }
        if (stage === "CUSTOM" && output_dir && !custom_prefix) {
          throw new Error("custom_prefix is required for CUSTOM stage file output.");
        }

        if (project && Project.name !== project && Project.uuid !== project) {
          const matched = ModelProject.all.find(
            (candidate) => candidate.name === project || candidate.uuid === project
          );
          if (!matched) throw new Error(`Project "${project}" was not found.`);
          matched.select();
        }

        const preview = Preview.selected;
        if (!preview) {
          throw new Error("No preview found in the Blockbench editor.");
        }

        const bounds = getModelBounds();
        const distance = Math.max(bounds.maxExtent * 2.4 * margin, 24);
        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [];
        const captures: Array<{
          view: StandardView;
          filename: string;
          path: string | null;
          position: Vec3;
          target: Vec3;
          projection: "orthographic";
        }> = [];

        let fs: any = null;
        if (output_dir) {
          // @ts-ignore - requireNativeModule is a Blockbench runtime global.
          fs = requireNativeModule("fs", {
            message: `MCP capture_standard_views requested write access to ${output_dir}`,
          });
          if (!fs) throw new Error("Filesystem access was denied.");
          fs.mkdirSync(output_dir, { recursive: true });
        }

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

          const filename = filenameFor(stage, view, custom_prefix);
          const outputPath = output_dir ? joinPath(output_dir, filename) : null;
          if (outputPath && fs) {
            fs.writeFileSync(outputPath, Buffer.from(image.data, "base64"));
          }

          content.push({ type: "text", text: `${view}: ${outputPath ?? filename}` });
          content.push(image);
          captures.push({
            view,
            filename,
            path: outputPath,
            position,
            target: bounds.center,
            projection: "orthographic",
          });
        }

        return {
          content,
          structuredContent: {
            status: "PASS",
            project: {
              name: Project.name,
              uuid: Project.uuid,
            },
            stage,
            front_axis,
            bounds,
            margin,
            captures,
          },
        };
      },
    },
    cameraToolDocs[3].status
  );
}

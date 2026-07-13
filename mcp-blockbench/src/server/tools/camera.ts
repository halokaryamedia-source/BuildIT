/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import {
  createTool,
  getAllToolDefinitions,
  type ToolContext,
  type ToolSpec,
} from "@/lib/factories";
import { captureScreenshot, captureAppScreenshot } from "@/lib/util";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { vector3Schema, projectionEnum } from "@/lib/zodObjects";
import {
  assertInsideRoot,
  writeFileAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";

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
  "right_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);

type StandardView = z.infer<typeof standardViewEnum>;

export const captureStandardViewsParameters = z
  .object({
    project: z.string().optional().describe("Project name or UUID."),
    expected_project_uuid: z.string().optional(),
    stage: z
      .enum(["GEOMETRY", "TEXTURE", "FINAL", "CUSTOM"])
      .optional()
      .default("CUSTOM"),
    views: z
      .array(standardViewEnum)
      .min(1)
      .max(6)
      .optional()
      .default([
        "front",
        "left_side",
        "back",
        "top_footprint",
        "front_left_3_4",
      ]),
    front_axis: z.enum(["-z", "+z", "-x", "+x"]).optional().default("-z"),
    margin: z.number().min(1).max(3).optional().default(1.25),
    output_dir: z.string().optional(),
    session_root: z.string().optional(),
    return_images: z.boolean().optional(),
    custom_prefix: z.string().regex(/^[a-z0-9_]+$/).optional(),
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
      "Captures clean rotation-aware standard views through the visual-feedback engine and writes canonical evidence names. Asymmetric assets may add the conditional right-side view.",
    annotations: {
      title: "Capture Standard Views",
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: captureStandardViewsParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

function prefixFor(
  stage: "GEOMETRY" | "TEXTURE" | "FINAL" | "CUSTOM",
  customPrefix?: string
): string {
  if (stage === "GEOMETRY") return "geometry";
  if (stage === "TEXTURE") return "texture";
  if (stage === "FINAL") return "final";
  return customPrefix ?? "preview";
}

function canonicalViewName(view: StandardView): string {
  if (view === "left_side") return "left";
  if (view === "right_side") return "right";
  if (view === "top_footprint") return "top";
  return view;
}

function joinPath(directory: string, filename: string): string {
  const separator =
    directory.includes("\\") && !directory.includes("/") ? "\\" : "/";
  return `${directory.replace(/[\\/]$/, "")}${separator}${filename}`;
}

function nativeFs(outputDir: string): NativeFsLike {
  // @ts-ignore - Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: `MCP standard-view capture requested write access to ${outputDir}`,
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function sha256(data: Buffer): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "Standard-view evidence needs SHA-256 integrity metadata.",
    optional: false,
  }) as {
    createHash: (algorithm: string) => {
      update: (value: Buffer) => { digest: (encoding: string) => string };
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
      async execute(
        {
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
        },
        context?: ToolContext
      ) {
        if (!Project) throw new Error("No project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        if (output_dir && session_root) {
          assertInsideRoot(output_dir, session_root);
        }

        const feedbackTool = getAllToolDefinitions()[
          "capture_visual_feedback"
        ] as unknown as {
          execute?: (
            args: Record<string, unknown>,
            context?: ToolContext
          ) => Promise<any>;
        };
        if (!feedbackTool?.execute) {
          throw new Error("capture_visual_feedback is unavailable.");
        }

        const delegated = await feedbackTool.execute(
          {
            project,
            expected_project_uuid,
            session_root,
            views,
            front_axis,
            margin,
            return_images: true,
            include_reference: false,
            custom_prefix: "standard_capture_transient",
          },
          context
        );
        const images = (delegated?.content ?? []).filter(
          (entry: any) => entry?.type === "image"
        );
        if (images.length !== views.length) {
          throw new Error(
            `STANDARD_VIEW_CAPTURE_COUNT_MISMATCH: captured ${images.length}; expected ${views.length}.`
          );
        }

        const prefix = prefixFor(stage, custom_prefix);
        const includeImages = return_images ?? !output_dir;
        const fs = output_dir ? nativeFs(output_dir) : null;
        if (fs && output_dir) fs.mkdirSync(output_dir, { recursive: true });
        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [];
        const captures: Array<Record<string, unknown>> = [];
        for (let index = 0; index < views.length; index += 1) {
          const view = views[index];
          const image = images[index] as {
            type: "image";
            data: string;
            mimeType: string;
          };
          const data = Buffer.from(image.data, "base64");
          const filename = `${prefix}_${canonicalViewName(view)}.png`;
          const path = output_dir ? joinPath(output_dir, filename) : null;
          if (path && fs && session_root) {
            assertInsideRoot(path, session_root);
            writeFileAtomically(fs, path, data);
          }
          const [width, height] = pngDimensions(data);
          content.push({
            type: "text",
            text: `${view}: ${path ?? filename}`,
          });
          if (includeImages) content.push(image);
          captures.push({
            view,
            filename,
            path,
            sha256: sha256(data),
            byte_length: data.byteLength,
            width,
            height,
            projection:
              view === "front_left_3_4" ? "perspective" : "orthographic",
          });
        }

        return {
          content,
          structuredContent: {
            status: delegated?.structuredContent?.status ?? "PASS",
            stage,
            delegated_to: "capture_visual_feedback",
            returned_images: includeImages,
            world_bounds: delegated?.structuredContent?.world_bounds ?? null,
            rotation_audit: delegated?.structuredContent?.rotation_audit ?? null,
            geometry_fingerprint:
              delegated?.structuredContent?.geometry_fingerprint ?? null,
            captures,
            projection_policy: {
              front: "orthographic",
              left_side: "orthographic",
              right_side: "orthographic",
              back: "orthographic",
              top_footprint: "orthographic",
              front_left_3_4: "perspective",
            },
          },
        };
      },
    },
    cameraToolDocs[3].status
  );
}

/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, getAllToolDefinitions, type ToolSpec } from "@/lib/factories";
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
      "Captures clean rotation-aware standard views through the visual-feedback engine: orthographic Front/Left/Back/Top, perspective front-left 3/4, stable filenames, and atomic evidence output.",
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

        const feedbackTool = getAllToolDefinitions()["capture_visual_feedback"] as unknown as {
          execute?: (args: Record<string, unknown>) => Promise<any>;
        };
        if (!feedbackTool?.execute) {
          throw new Error("capture_visual_feedback is unavailable.");
        }

        const delegated = await feedbackTool.execute({
          project,
          expected_project_uuid,
          session_root,
          views,
          front_axis,
          margin,
          output_dir,
          return_images,
          include_reference: false,
          custom_prefix: prefixFor(stage, custom_prefix),
        });

        return {
          content: delegated?.content ?? [],
          structuredContent: {
            ...(delegated?.structuredContent ?? {}),
            status: delegated?.structuredContent?.status ?? "PASS",
            stage,
            delegated_to: "capture_visual_feedback",
            projection_policy: {
              front: "orthographic",
              left_side: "orthographic",
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

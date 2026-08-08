/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { captureScreenshot, captureAppScreenshot, imageContent } from "@/lib/util";
import { readRenderedModelBounds, type RenderedModelBounds, type Vec3 } from "@/lib/renderedModelBounds";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { vector3Schema, projectionEnum } from "@/lib/zodObjects";

const CAPTURE_SIZE = 512;
const FRAME_PADDING = 0.12;
const PERSPECTIVE_FOV = 45;
const CAPTURE_TIMEOUT_MS = 5000;
const RESTORE_EPSILON = 1e-5;

const modelViewEnum = z.enum([
  "front",
  "back",
  "left",
  "right",
  "top",
  "bottom",
  "front_left_3q",
  "front_right_3q",
]);

type ModelView = z.infer<typeof modelViewEnum>;
type FrontDirection = "+z" | "-z";

type FramingInput =
  | { mode: "model" }
  | { mode: "explicit"; min: Vec3; max: Vec3 };

interface CameraSpec {
  view: ModelView;
  projection: "orthographic" | "perspective";
  position: Vec3;
  target: Vec3;
  up: Vec3;
  zoom?: number;
  fov?: number;
}

interface PreviewCameraSnapshot {
  width: number;
  height: number;
  isOrtho: boolean;
  target: Vec3;
  camPers: {
    position: Vec3;
    quaternion: [number, number, number, number];
    up: Vec3;
    zoom: number;
    fov: number;
    aspect: number;
    near: number;
    far: number;
  };
  camOrtho: {
    position: Vec3;
    quaternion: [number, number, number, number];
    up: Vec3;
    zoom: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    near: number;
    far: number;
  };
}

export const captureScreenshotParameters = z.object({
  project: z.string().optional().describe("Project name or UUID."),
});

export const captureAppScreenshotParameters = z.object({});

export const setCameraAngleParameters = z.object({
  position: vector3Schema.describe("Camera position."),
  target: vector3Schema.optional().describe("Camera target position."),
  rotation: vector3Schema.optional().describe("Camera rotation."),
  projection: projectionEnum.describe("Camera projection type."),
  zoom: z.number().positive().optional().describe("Orthographic camera zoom."),
});

const explicitFramingSchema = z
  .object({
    mode: z.literal("explicit"),
    min: z.tuple([z.number(), z.number(), z.number()]),
    max: z.tuple([z.number(), z.number(), z.number()]),
  })
  .refine(
    (value) => value.max.every((entry, axis) => entry > value.min[axis]),
    {
      message: "Each explicit max axis must be greater than min.",
      path: ["max"],
    }
  );

const uniqueModelViewsSchema = z
  .array(modelViewEnum)
  .min(1)
  .max(5)
  .refine((views) => new Set(views).size === views.length, {
    message: "views must contain unique canonical view names.",
  });

export const captureModelViewsParameters = z.object({
  views: uniqueModelViewsSchema.describe(
    "One to five unique canonical model views to capture."
  ),
  front_direction: z
    .enum(["+z", "-z"])
    .describe(
      "Explicit object front direction established by the modelling coordinate frame. No default is used to avoid mirrored comparisons."
    ),
  framing: z
    .union([
      z.object({ mode: z.literal("model") }),
      explicitFramingSchema,
    ])
    .optional()
    .default({ mode: "model" }),
});

export const cameraToolDocs: ToolSpec[] = [
  {
    name: "capture_screenshot",
    description: "Returns the image data of the current view.",
    annotations: {
      title: "Capture Screenshot",
      readOnlyHint: true,
    },
    parameters: captureScreenshotParameters,
    status: STATUS_STABLE,
  },
  {
    name: "capture_app_screenshot",
    description: "Returns the image data of the Blockbench app.",
    annotations: {
      title: "Capture App Screenshot",
      readOnlyHint: true,
    },
    parameters: captureAppScreenshotParameters,
    status: STATUS_STABLE,
  },
  {
    name: "set_camera_angle",
    description: "Sets the camera angle to the specified value.",
    annotations: {
      title: "Set Camera Angle",
      destructiveHint: true,
    },
    parameters: setCameraAngleParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "capture_model_views",
    description:
      "Captures deterministic labeled 512×512 model views from the active project for direct reference comparison. Principal views are true axis-aligned orthographic; 3/4 views are stable perspective context views. Requires explicit front_direction, supports current-model or explicit target-envelope framing, returns actual MCP image content, and leaves the active editor camera/project/selection/model state unchanged. This tool does not compare against a reference, score resemblance, infer front direction, repair geometry, or return PASS/FAIL.",
    annotations: {
      title: "Capture Model Views",
      readOnlyHint: true,
    },
    parameters: captureModelViewsParameters,
    status: STATUS_STABLE,
  },
];

function asVec3(value: readonly number[]): Vec3 {
  return [value[0] ?? 0, value[1] ?? 0, value[2] ?? 0];
}

function snapshotPreviewCamera(preview: Preview): PreviewCameraSnapshot {
  return {
    width: preview.width,
    height: preview.height,
    isOrtho: preview.isOrtho,
    target: asVec3(preview.controls.target.toArray()),
    camPers: {
      position: asVec3(preview.camPers.position.toArray()),
      quaternion: preview.camPers.quaternion.toArray() as [number, number, number, number],
      up: asVec3(preview.camPers.up.toArray()),
      zoom: preview.camPers.zoom,
      fov: preview.camPers.fov,
      aspect: preview.camPers.aspect,
      near: preview.camPers.near,
      far: preview.camPers.far,
    },
    camOrtho: {
      position: asVec3(preview.camOrtho.position.toArray()),
      quaternion: preview.camOrtho.quaternion.toArray() as [number, number, number, number],
      up: asVec3(preview.camOrtho.up.toArray()),
      zoom: preview.camOrtho.zoom,
      left: preview.camOrtho.left,
      right: preview.camOrtho.right,
      top: preview.camOrtho.top,
      bottom: preview.camOrtho.bottom,
      near: preview.camOrtho.near,
      far: preview.camOrtho.far,
    },
  };
}

function resizePreview(preview: Preview, width: number, height: number): void {
  const runtimePreview = preview as Preview & {
    resize: (width: number, height: number) => Preview;
  };
  runtimePreview.resize(width, height);
}

function restorePreviewCamera(
  preview: Preview,
  snapshot: PreviewCameraSnapshot
): void {
  resizePreview(preview, snapshot.width, snapshot.height);
  preview.setProjectionMode(snapshot.isOrtho);

  preview.camPers.position.fromArray(snapshot.camPers.position);
  preview.camPers.quaternion.fromArray(snapshot.camPers.quaternion);
  preview.camPers.up.fromArray(snapshot.camPers.up);
  preview.camPers.zoom = snapshot.camPers.zoom;
  preview.camPers.fov = snapshot.camPers.fov;
  preview.camPers.aspect = snapshot.camPers.aspect;
  preview.camPers.near = snapshot.camPers.near;
  preview.camPers.far = snapshot.camPers.far;
  preview.camPers.updateProjectionMatrix();

  preview.camOrtho.position.fromArray(snapshot.camOrtho.position);
  preview.camOrtho.quaternion.fromArray(snapshot.camOrtho.quaternion);
  preview.camOrtho.up.fromArray(snapshot.camOrtho.up);
  preview.camOrtho.zoom = snapshot.camOrtho.zoom;
  preview.camOrtho.left = snapshot.camOrtho.left;
  preview.camOrtho.right = snapshot.camOrtho.right;
  preview.camOrtho.top = snapshot.camOrtho.top;
  preview.camOrtho.bottom = snapshot.camOrtho.bottom;
  preview.camOrtho.near = snapshot.camOrtho.near;
  preview.camOrtho.far = snapshot.camOrtho.far;
  preview.camOrtho.updateProjectionMatrix();

  preview.controls.target.fromArray(snapshot.target);
  preview.controls.update();
  preview.render();
}

function boundsFromExplicit(framing: Extract<FramingInput, { mode: "explicit" }>): RenderedModelBounds {
  const min = framing.min;
  const max = framing.max;
  const size: Vec3 = [
    max[0] - min[0],
    max[1] - min[1],
    max[2] - min[2],
  ];
  const center: Vec3 = [
    (min[0] + max[0]) / 2,
    (min[1] + max[1]) / 2,
    (min[2] + max[2]) / 2,
  ];

  return {
    min: [...min],
    max: [...max],
    center,
    size_xyz: size,
    dimensions: {
      width: size[0],
      height: size[1],
      length: size[2],
    },
    footprint: {
      min_xz: [min[0], min[2]],
      max_xz: [max[0], max[2]],
      size: {
        width: size[0],
        length: size[2],
      },
    },
  };
}

function vectorScale(value: Vec3, scalar: number): Vec3 {
  return [value[0] * scalar, value[1] * scalar, value[2] * scalar];
}

function vectorAdd(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vectorNormalize(value: Vec3): Vec3 {
  const length = Math.hypot(value[0], value[1], value[2]);
  if (!Number.isFinite(length) || length <= 1e-8) {
    throw new Error("Cannot derive a canonical camera direction from a zero vector.");
  }
  return [value[0] / length, value[1] / length, value[2] / length];
}

function getObjectAxes(frontDirection: FrontDirection): {
  front: Vec3;
  right: Vec3;
} {
  const sign = frontDirection === "+z" ? 1 : -1;
  return {
    front: [0, 0, sign],
    right: [sign, 0, 0],
  };
}

function getOrthographicSpans(view: ModelView, bounds: RenderedModelBounds): [number, number] {
  const [width, height, length] = bounds.size_xyz;
  switch (view) {
    case "front":
    case "back":
      return [width, height];
    case "left":
    case "right":
      return [length, height];
    case "top":
    case "bottom":
      return [width, length];
    default:
      throw new Error(`${view} is not an orthographic principal view.`);
  }
}

function calculateOrthographicZoom(
  preview: Preview,
  horizontalSpan: number,
  verticalSpan: number
): number {
  const paddedHorizontal = Math.max(horizontalSpan * (1 + FRAME_PADDING * 2), 1e-4);
  const paddedVertical = Math.max(verticalSpan * (1 + FRAME_PADDING * 2), 1e-4);

  // Blockbench's Preview.resize() defines the orthographic camera as
  // left/right = ±width/80 and top/bottom = ±height/80. Therefore the visible
  // world span at zoom=1 is width/40 by height/40.
  const baseWidth = preview.width / 40;
  const baseHeight = preview.height / 40;
  const zoom = Math.min(
    baseWidth / paddedHorizontal,
    baseHeight / paddedVertical
  );

  if (!Number.isFinite(zoom) || zoom <= 0) {
    throw new Error("Unable to calculate a trustworthy orthographic framing zoom.");
  }
  return zoom;
}

function principalDirection(
  view: Exclude<ModelView, "front_left_3q" | "front_right_3q">,
  frontDirection: FrontDirection
): { direction: Vec3; up: Vec3 } {
  const { front, right } = getObjectAxes(frontDirection);

  switch (view) {
    case "front":
      return { direction: front, up: [0, 1, 0] };
    case "back":
      return { direction: vectorScale(front, -1), up: [0, 1, 0] };
    case "left":
      return { direction: vectorScale(right, -1), up: [0, 1, 0] };
    case "right":
      return { direction: right, up: [0, 1, 0] };
    case "top":
      // Keep object-relative right on screen-right. This places the object's
      // front toward the bottom of the top view and avoids an arbitrary top-view roll.
      return { direction: [0, 1, 0], up: vectorScale(front, -1) };
    case "bottom":
      return { direction: [0, -1, 0], up: front };
  }
}

function calculateCameraSpec(
  preview: Preview,
  view: ModelView,
  frontDirection: FrontDirection,
  bounds: RenderedModelBounds
): CameraSpec {
  const target = bounds.center;
  const maxSpan = Math.max(...bounds.size_xyz, 1);

  if (view !== "front_left_3q" && view !== "front_right_3q") {
    const { direction, up } = principalDirection(view, frontDirection);
    const distance = Math.max(64, maxSpan * 4 + 32);
    const position = vectorAdd(target, vectorScale(direction, distance));
    const [horizontalSpan, verticalSpan] = getOrthographicSpans(view, bounds);

    return {
      view,
      projection: "orthographic",
      position,
      target: [...target],
      up,
      zoom: calculateOrthographicZoom(preview, horizontalSpan, verticalSpan),
    };
  }

  const { front, right } = getObjectAxes(frontDirection);
  const side =
    view === "front_left_3q" ? vectorScale(right, -1) : right;
  const horizontal = vectorNormalize(vectorAdd(front, side));
  const elevationRadians = (30 * Math.PI) / 180;
  const direction = vectorNormalize([
    horizontal[0] * Math.cos(elevationRadians),
    Math.sin(elevationRadians),
    horizontal[2] * Math.cos(elevationRadians),
  ]);
  const radius =
    0.5 * Math.hypot(...bounds.size_xyz) * (1 + FRAME_PADDING * 2);
  const halfFov = (PERSPECTIVE_FOV * Math.PI) / 360;
  const distance = Math.max(16, radius / Math.sin(halfFov));

  return {
    view,
    projection: "perspective",
    position: vectorAdd(target, vectorScale(direction, distance)),
    target: [...target],
    up: [0, 1, 0],
    fov: PERSPECTIVE_FOV,
  };
}

function applyCameraSpec(preview: Preview, spec: CameraSpec): void {
  preview.setProjectionMode(spec.projection === "orthographic");
  const camera = preview.camera;

  camera.position.fromArray(spec.position);
  camera.up.fromArray(spec.up);
  preview.controls.target.fromArray(spec.target);
  camera.lookAt(preview.controls.target);

  if (spec.projection === "orthographic") {
    preview.camOrtho.zoom = spec.zoom ?? 1;
    const distance = Math.hypot(
      spec.position[0] - spec.target[0],
      spec.position[1] - spec.target[1],
      spec.position[2] - spec.target[2]
    );
    preview.camOrtho.near = -Math.max(200, distance * 2);
    preview.camOrtho.far = Math.max(20_000, distance * 4);
    preview.camOrtho.updateProjectionMatrix();
  } else {
    preview.camPers.fov = spec.fov ?? PERSPECTIVE_FOV;
    preview.camPers.aspect = 1;
    const distance = Math.hypot(
      spec.position[0] - spec.target[0],
      spec.position[1] - spec.target[1],
      spec.position[2] - spec.target[2]
    );
    preview.camPers.near = Math.max(0.01, distance / 10_000);
    preview.camPers.far = Math.max(20_000, distance * 4);
    preview.camPers.updateProjectionMatrix();
  }

  preview.controls.update();
  preview.render();
}

function capturePreviewDataUrl(preview: Preview): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(
          new Error(
            `Model view capture timed out after ${CAPTURE_TIMEOUT_MS}ms.`
          )
        );
      }
    }, CAPTURE_TIMEOUT_MS);

    Screencam.screenshotPreview(
      preview,
      { crop: false, width: CAPTURE_SIZE, height: CAPTURE_SIZE },
      (dataUrl: string) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        if (!dataUrl) {
          reject(new Error("Blockbench returned no image data for model view capture."));
          return;
        }
        resolve(dataUrl);
      }
    );
  });
}

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

function closeNumber(a: number, b: number): boolean {
  return Math.abs(a - b) <= RESTORE_EPSILON;
}

function closeArray(actual: readonly number[], expected: readonly number[]): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => closeNumber(value, expected[index] ?? NaN))
  );
}

function verifyRestoredPreview(
  preview: Preview,
  snapshot: PreviewCameraSnapshot
): void {
  const checks = [
    preview.width === snapshot.width,
    preview.height === snapshot.height,
    preview.isOrtho === snapshot.isOrtho,
    closeArray(preview.controls.target.toArray(), snapshot.target),
    closeArray(preview.camPers.position.toArray(), snapshot.camPers.position),
    closeArray(preview.camPers.quaternion.toArray(), snapshot.camPers.quaternion),
    closeArray(preview.camPers.up.toArray(), snapshot.camPers.up),
    closeNumber(preview.camPers.zoom, snapshot.camPers.zoom),
    closeNumber(preview.camPers.fov, snapshot.camPers.fov),
    closeNumber(preview.camPers.aspect, snapshot.camPers.aspect),
    closeNumber(preview.camPers.near, snapshot.camPers.near),
    closeNumber(preview.camPers.far, snapshot.camPers.far),
    closeArray(preview.camOrtho.position.toArray(), snapshot.camOrtho.position),
    closeArray(preview.camOrtho.quaternion.toArray(), snapshot.camOrtho.quaternion),
    closeArray(preview.camOrtho.up.toArray(), snapshot.camOrtho.up),
    closeNumber(preview.camOrtho.zoom, snapshot.camOrtho.zoom),
    closeNumber(preview.camOrtho.left, snapshot.camOrtho.left),
    closeNumber(preview.camOrtho.right, snapshot.camOrtho.right),
    closeNumber(preview.camOrtho.top, snapshot.camOrtho.top),
    closeNumber(preview.camOrtho.bottom, snapshot.camOrtho.bottom),
    closeNumber(preview.camOrtho.near, snapshot.camOrtho.near),
    closeNumber(preview.camOrtho.far, snapshot.camOrtho.far),
  ];

  if (checks.some((check) => !check)) {
    throw new Error(
      "Offscreen preview camera/lens state could not be restored exactly after capture_model_views."
    );
  }
}

export function registerCameraTools() {
  createTool(cameraToolDocs[0].name, {
    ...cameraToolDocs[0],
    async execute({ project }) {
      return captureScreenshot(project);
    },
  }, cameraToolDocs[0].status);

  createTool(cameraToolDocs[1].name, {
    ...cameraToolDocs[1],
    async execute() {
      return captureAppScreenshot();
    },
  }, cameraToolDocs[1].status);

  createTool(cameraToolDocs[2].name, {
    ...cameraToolDocs[2],
    async execute(angle: { position: number[]; target?: number[]; rotation?: number[]; projection: string; zoom?: number }) {
      const preview = Preview.selected;

      if (!preview) {
        throw new Error("No preview found in the Blockbench editor.");
      }

      // @ts-expect-error Angle CAN be loaded like this
      preview.loadAnglePreset({
        ...angle
      });

      if (angle.zoom !== undefined && preview.camera.isOrthographicCamera) {
        preview.camera.zoom = angle.zoom;
        preview.camera.updateProjectionMatrix();
        preview.controls.update();
      }

      return captureScreenshot();
    },
  }, cameraToolDocs[2].status);

  createTool(cameraToolDocs[3].name, {
    ...cameraToolDocs[3],
    async execute({ views, front_direction, framing }) {
      if (!Project) {
        throw new Error(
          "No project is open. Open or create the intended Bedrock project before capturing model views."
        );
      }
      if (!Preview.selected) {
        throw new Error("No active Blockbench preview is available.");
      }

      const observed = readRenderedModelBounds();
      if (!observed.bounds || observed.rendered_cube_count === 0) {
        throw new Error(
          "The active project has no visible Cube geometry to capture."
        );
      }

      const framingInput = framing as FramingInput;
      const framingBounds =
        framingInput.mode === "explicit"
          ? boundsFromExplicit(framingInput)
          : observed.bounds;

      const capturePreview = Screencam.NoAAPreview;
      if (!capturePreview) {
        throw new Error(
          "Blockbench offscreen screenshot preview is unavailable; deterministic 512×512 capture cannot be guaranteed."
        );
      }

      const snapshot = snapshotPreviewCamera(capturePreview);
      const content: Array<
        | { type: "text"; text: string }
        | { type: "image"; data: string; mimeType: string }
      > = [];
      const captures: Array<{
        view: ModelView;
        projection: "orthographic" | "perspective";
        width: number;
        height: number;
        camera: {
          position: Vec3;
          target: Vec3;
          up: Vec3;
          zoom?: number;
          fov?: number;
        };
      }> = [];
      let primaryError: unknown = null;

      try {
        resizePreview(capturePreview, CAPTURE_SIZE, CAPTURE_SIZE);
        // Preview.resize() updates only the currently active projection. Keep
        // both camera projection bases deterministic for this square capture.
        capturePreview.camPers.aspect = 1;
        capturePreview.camPers.updateProjectionMatrix();
        capturePreview.camOrtho.left = -CAPTURE_SIZE / 80;
        capturePreview.camOrtho.right = CAPTURE_SIZE / 80;
        capturePreview.camOrtho.top = CAPTURE_SIZE / 80;
        capturePreview.camOrtho.bottom = -CAPTURE_SIZE / 80;
        capturePreview.camOrtho.updateProjectionMatrix();

        for (const view of views as ModelView[]) {
          const spec = calculateCameraSpec(
            capturePreview,
            view,
            front_direction as FrontDirection,
            framingBounds
          );
          applyCameraSpec(capturePreview, spec);
          const dataUrl = await capturePreviewDataUrl(capturePreview);
          const image = imageContent(dataUrl, "image/png").content[0];

          content.push({ type: "text", text: `VIEW ${view}` });
          content.push(image);
          captures.push({
            view,
            projection: spec.projection,
            width: CAPTURE_SIZE,
            height: CAPTURE_SIZE,
            camera: {
              position: spec.position,
              target: spec.target,
              up: spec.up,
              ...(spec.zoom !== undefined ? { zoom: spec.zoom } : {}),
              ...(spec.fov !== undefined ? { fov: spec.fov } : {}),
            },
          });
        }
      } catch (error) {
        primaryError = error;
      } finally {
        try {
          restorePreviewCamera(capturePreview, snapshot);
          verifyRestoredPreview(capturePreview, snapshot);
        } catch (restoreError) {
          throw new Error(
            `capture_model_views failed to restore its offscreen camera state: ${
              restoreError instanceof Error
                ? restoreError.message
                : String(restoreError)
            }`
          );
        }
      }

      if (primaryError) {
        throw primaryError;
      }

      const format = Format as { id?: string } | undefined;
      const structuredContent = {
        project: {
          uuid: Project.uuid,
          name: Project.name,
          format: format?.id ?? null,
        },
        count: captures.length,
        front_direction,
        framing:
          framingInput.mode === "explicit"
            ? {
                mode: "explicit" as const,
                min: framingBounds.min,
                max: framingBounds.max,
              }
            : {
                mode: "model" as const,
                min: framingBounds.min,
                max: framingBounds.max,
              },
        captures,
        pose_context: getPoseContext(),
        restored_camera: true,
        active_editor_camera_untouched: true,
        warnings: observed.warnings,
      };

      content.unshift({
        type: "text",
        text:
          "Canonical model views captured for observation only. Compare each labeled image directly with the corresponding approved reference view; this tool does not judge resemblance."
      });

      return { content, structuredContent };
    },
  }, cameraToolDocs[3].status);
}

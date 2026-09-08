/// <reference types="three" />
/// <reference types="blockbench-types" />

import { getAllToolDefinitions } from "@/lib/factories";
import { analyzeGeometryHygiene } from "@/lib/geometryQuality";
import { analyzeTextureColorProfile } from "@/lib/textureColorProfile";
import {
  analyzeRootMotionTracks,
  type RootMotionTrackInput,
} from "@/lib/rootMotionAnalysis";

const wiredTools = new Set<string>();

function objectRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function augmentStructuredResult(
  result: unknown,
  field: string,
  value: unknown
): unknown {
  const record = objectRecord(result);
  if (!record || !("structuredContent" in record)) return result;
  const structured = objectRecord(record.structuredContent);
  if (!structured) return result;
  return {
    ...record,
    structuredContent: {
      ...structured,
      [field]: value,
    },
  };
}

function geometryHygieneRuntime() {
  if (typeof Cube === "undefined" || typeof Group === "undefined") {
    return { state: "unavailable" as const, reason: "blockbench_geometry_runtime_unavailable" as const };
  }
  return analyzeGeometryHygiene(
    (Cube.all ?? []).map((cube: Cube) => ({
      uuid: cube.uuid,
      name: cube.name,
      from: [...cube.from],
      to: [...cube.to],
      origin: [...cube.origin],
      rotation: [...cube.rotation],
      inflate: cube.inflate ?? 0,
    })),
    (Group.all ?? []).map((group: Group) => ({
      uuid: group.uuid,
      name: group.name,
    }))
  );
}

function textureColorProfileRuntime(structuredContent: Record<string, unknown>) {
  if (typeof Texture === "undefined") {
    return { state: "unavailable" as const, reason: "blockbench_texture_runtime_unavailable" as const };
  }
  const textureInfo = objectRecord(structuredContent.texture);
  const uuid = typeof textureInfo?.uuid === "string" ? textureInfo.uuid : null;
  const texture = uuid ? Texture.all.find((candidate: Texture) => candidate.uuid === uuid) : undefined;
  if (!texture) {
    return { state: "unavailable" as const, reason: "inspected_texture_not_resolved" as const };
  }

  try {
    const ctx = texture.ctx;
    const width = ctx?.canvas?.width ?? texture.width;
    const height = ctx?.canvas?.height ?? texture.display_height ?? texture.height;
    if (!ctx || !Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      return { state: "unavailable" as const, reason: "texture_pixel_canvas_unavailable" as const };
    }
    const pixels = ctx.getImageData(0, 0, width, height).data;
    return analyzeTextureColorProfile(pixels, width, height);
  } catch {
    return { state: "unavailable" as const, reason: "texture_pixel_read_failed" as const };
  }
}

function isAnimationControllerRuntime(item: unknown): boolean {
  return typeof AnimationController !== "undefined" && item instanceof AnimationController;
}

function rootMotionRuntime(structuredContent: Record<string, unknown>) {
  if (
    structuredContent.authored_space !== "blockbench_animation" ||
    typeof AnimationItem === "undefined" ||
    typeof Group === "undefined" ||
    typeof BoneAnimator === "undefined"
  ) {
    return { state: "unavailable" as const, reason: "authored_animation_runtime_unavailable" as const };
  }

  const animationInfo = objectRecord(structuredContent.animation);
  const animationUuid = typeof animationInfo?.uuid === "string" ? animationInfo.uuid : null;
  if (!animationUuid) {
    return { state: "unavailable" as const, reason: "animation_identity_unavailable" as const };
  }
  const item = (AnimationItem.all as unknown[]).find(
    (candidate) => objectRecord(candidate)?.uuid === animationUuid
  );
  if (!item || isAnimationControllerRuntime(item)) {
    return { state: "unavailable" as const, reason: "authored_animation_not_resolved" as const };
  }
  const animation = item as _Animation;

  const rootGroups = Group.all.filter((group: Group) => {
    const parent = group.parent as unknown;
    return parent === "root" || parent === null || parent === undefined;
  });
  const tracks: RootMotionTrackInput[] = [];
  for (const group of rootGroups) {
    const animator = animation.animators[group.uuid];
    if (!(animator instanceof BoneAnimator)) continue;
    const keyframes = ((animator.position as _Keyframe[] | undefined) ?? [])
      .slice()
      .sort((left, right) => left.time - right.time)
      .map((keyframe) => ({
        time: keyframe.time,
        value: keyframe.getArray(0) as unknown[],
      }));
    if (keyframes.length === 0) continue;
    tracks.push({ uuid: group.uuid, name: group.name, keyframes });
  }

  return analyzeRootMotionTracks(tracks);
}

function wireTool(
  toolName: string,
  field: string,
  readAugmentation: (structuredContent: Record<string, unknown>) => unknown
): void {
  if (wiredTools.has(toolName)) return;
  const definition = getAllToolDefinitions()[toolName];
  if (!definition) return;
  const execute = definition.execute;
  definition.execute = async (args, context) => {
    const result = await execute(args, context);
    const record = objectRecord(result);
    const structured = record ? objectRecord(record.structuredContent) : null;
    if (!structured) return result;
    return augmentStructuredResult(result, field, readAugmentation(structured)) as typeof result;
  };
  wiredTools.add(toolName);
}

/**
 * Adds bounded, read-only authoring intelligence to existing focused read tools.
 * No MCP Tool is added and no input/public discovery schema changes.
 */
export function wireAuthoringQualityIntelligence(): void {
  wireTool("inspect_model_bounds", "geometry_hygiene", () => geometryHygieneRuntime());
  wireTool("get_texture", "color_profile", textureColorProfileRuntime);
  wireTool("inspect_animation", "root_motion", rootMotionRuntime);
}

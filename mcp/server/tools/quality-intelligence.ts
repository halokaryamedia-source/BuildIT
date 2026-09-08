/// <reference types="three" />
/// <reference types="blockbench-types" />

import { getAllToolDefinitions } from "@/lib/factories";
import { analyzeGeometryHygiene } from "@/lib/geometryQuality";
import { analyzeTextureColorProfile } from "@/lib/textureColorProfile";
import {
  analyzeRootMotionTracks,
  type RootMotionTrackInput,
} from "@/lib/rootMotionAnalysis";
import {
  analyzeProjectedEnvelopeFidelity,
  analyzeRigGraph,
  summarizeSurfaceQualityWarnings,
} from "@/lib/modelQuality";
import {
  listBlockItThreeDAssistedReferences,
  readThreeDAssistedReferenceEvidence,
} from "./project";

const wiredTools = new Set<string>();

function objectRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function finiteVec3(value: unknown): [number, number, number] | null {
  if (
    !Array.isArray(value) ||
    value.length < 3 ||
    !value.slice(0, 3).every(
      (entry) => typeof entry === "number" && Number.isFinite(entry)
    )
  ) {
    return null;
  }
  return [value[0], value[1], value[2]];
}

function geometryHygieneRuntime() {
  if (typeof Cube === "undefined" || typeof Group === "undefined") {
    return {
      state: "unavailable" as const,
      reason: "blockbench_geometry_runtime_unavailable" as const,
    };
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

function surfaceQualitySummaryRuntime(
  structuredContent: Record<string, unknown>
) {
  const warnings = Array.isArray(structuredContent.warnings)
    ? structuredContent.warnings.filter(
        (warning): warning is string => typeof warning === "string"
      )
    : [];
  return summarizeSurfaceQualityWarnings(warnings);
}

function rigGraphRuntime() {
  if (typeof Group === "undefined") {
    return {
      state: "unavailable" as const,
      reason: "blockbench_group_runtime_unavailable" as const,
    };
  }

  return analyzeRigGraph(
    (Group.all ?? []).map((group: Group) => ({
      uuid: group.uuid,
      name: group.name,
      origin: [...group.origin],
      parent_uuid:
        group.parent instanceof Group ? group.parent.uuid : null,
    }))
  );
}

function referenceEnvelopeFidelityRuntime(
  structuredContent: Record<string, unknown>
) {
  const bounds = objectRecord(structuredContent.bounds);
  const modelMin = finiteVec3(bounds?.min);
  const modelMax = finiteVec3(bounds?.max);
  if (!modelMin || !modelMax) {
    return {
      state: "unavailable" as const,
      reason: "rendered_model_bounds_unavailable" as const,
    };
  }

  const references = listBlockItThreeDAssistedReferences();
  if (references.length === 0) {
    return {
      state: "unavailable" as const,
      reason: "no_3d_assisted_reference" as const,
    };
  }
  if (references.length > 1) {
    return {
      state: "unavailable" as const,
      reason: "ambiguous_3d_assisted_reference" as const,
      reference_count: references.length,
    };
  }

  const [reference] = references;
  try {
    const evidence = readThreeDAssistedReferenceEvidence(reference);
    const analysis = analyzeProjectedEnvelopeFidelity({
      model_bounds: { min: modelMin, max: modelMax },
      reference_bounds: evidence.world_bounds,
    });
    if (analysis.state !== "available") return analysis;
    return {
      ...analysis,
      reference: {
        uuid: reference.uuid,
        name: reference.name,
      },
    };
  } catch (error) {
    return {
      state: "unavailable" as const,
      reason: "3d_assisted_reference_evidence_unavailable" as const,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

function textureColorProfileRuntime(
  structuredContent: Record<string, unknown>
) {
  if (typeof Texture === "undefined") {
    return {
      state: "unavailable" as const,
      reason: "blockbench_texture_runtime_unavailable" as const,
    };
  }
  const textureInfo = objectRecord(structuredContent.texture);
  const uuid = typeof textureInfo?.uuid === "string" ? textureInfo.uuid : null;
  const texture = uuid
    ? Texture.all.find((candidate: Texture) => candidate.uuid === uuid)
    : undefined;
  if (!texture) {
    return {
      state: "unavailable" as const,
      reason: "inspected_texture_not_resolved" as const,
    };
  }

  try {
    const ctx = texture.ctx;
    const width = ctx?.canvas?.width ?? texture.width;
    const height =
      ctx?.canvas?.height ?? texture.display_height ?? texture.height;
    if (
      !ctx ||
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width <= 0 ||
      height <= 0
    ) {
      return {
        state: "unavailable" as const,
        reason: "texture_pixel_canvas_unavailable" as const,
      };
    }
    const pixels = ctx.getImageData(0, 0, width, height).data;
    return analyzeTextureColorProfile(pixels, width, height);
  } catch {
    return {
      state: "unavailable" as const,
      reason: "texture_pixel_read_failed" as const,
    };
  }
}

function isAnimationControllerRuntime(item: unknown): boolean {
  return (
    typeof AnimationController !== "undefined" &&
    item instanceof AnimationController
  );
}

function rootMotionRuntime(structuredContent: Record<string, unknown>) {
  if (
    structuredContent.authored_space !== "blockbench_animation" ||
    typeof AnimationItem === "undefined" ||
    typeof Group === "undefined" ||
    typeof BoneAnimator === "undefined"
  ) {
    return {
      state: "unavailable" as const,
      reason: "authored_animation_runtime_unavailable" as const,
    };
  }

  const animationInfo = objectRecord(structuredContent.animation);
  const animationUuid =
    typeof animationInfo?.uuid === "string" ? animationInfo.uuid : null;
  if (!animationUuid) {
    return {
      state: "unavailable" as const,
      reason: "animation_identity_unavailable" as const,
    };
  }
  const item = (AnimationItem.all as unknown[]).find(
    (candidate) => objectRecord(candidate)?.uuid === animationUuid
  );
  if (!item || isAnimationControllerRuntime(item)) {
    return {
      state: "unavailable" as const,
      reason: "authored_animation_not_resolved" as const,
    };
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

type ToolAugmentation = {
  field: string;
  read: (structuredContent: Record<string, unknown>) => unknown;
};

function wireTool(
  toolName: string,
  augmentations: readonly ToolAugmentation[]
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

    const additions: Record<string, unknown> = {};
    for (const augmentation of augmentations) {
      additions[augmentation.field] = augmentation.read(structured);
    }

    return {
      ...record,
      structuredContent: {
        ...structured,
        ...additions,
      },
    } as typeof result;
  };
  wiredTools.add(toolName);
}

/**
 * Adds bounded, read-only authoring intelligence to existing focused read tools.
 * No MCP Tool is added and no input/public discovery schema changes.
 */
export function wireAuthoringQualityIntelligence(): void {
  wireTool("inspect_model_bounds", [
    { field: "geometry_hygiene", read: () => geometryHygieneRuntime() },
    { field: "surface_quality_summary", read: surfaceQualitySummaryRuntime },
    { field: "rig_graph", read: () => rigGraphRuntime() },
    {
      field: "reference_envelope_fidelity",
      read: referenceEnvelopeFidelityRuntime,
    },
  ]);
  wireTool("get_texture", [
    { field: "color_profile", read: textureColorProfileRuntime },
  ]);
  wireTool("inspect_animation", [
    { field: "root_motion", read: rootMotionRuntime },
  ]);
}

from pathlib import Path

path = Path("mcp-blockbench/src/server/tools/workflow.ts")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one anchor, found {count}")
    text = text.replace(old, new, 1)


replace_once(
    '''import {
  analyzeTexturePixels,
  evaluateAnimationQuality,
} from "@/lib/stageQuality";''',
    '''import {
  analyzeTexturePixels,
  evaluateAnimationQuality,
} from "@/lib/stageQuality";
import {
  evaluateAnimationContractQuality,
  evaluateTextureContractQuality,
  rootMotionAllowedFromPolicy,
} from "@/lib/pipelineAcceptance";''',
    "pipeline acceptance import",
)

replace_once(
    '''  geometry?: {
    hierarchy?: Record<string, unknown>;
    symmetry_policy?: string;
  };''',
    '''  geometry?: {
    hierarchy?: Record<string, unknown>;
    symmetry_policy?: string;
    part_constraints?: Array<{
      id?: string;
      name_patterns?: string[];
    }>;
  };''',
    "geometry manifest interface",
)

replace_once(
    '''    quality_contract?: {
      maximum_partial_alpha_ratio?: number;
      minimum_opaque_ratio?: number;
      maximum_unique_colors?: number;
      maximum_palette_distance?: number;
      maximum_palette_outlier_ratio?: number;
    };
  };''',
    '''    quality_contract?: {
      maximum_partial_alpha_ratio?: number;
      minimum_opaque_ratio?: number;
      maximum_unique_colors?: number;
      maximum_palette_distance?: number;
      maximum_palette_outlier_ratio?: number;
    };
    atlas_policy?: {
      minimum?: string;
      selected?: string;
      downgrade_allowed?: boolean;
    };
    micro_detail_contract?: {
      eyes?: {
        minimum_eye_face_width_pixels?: number;
        minimum_eye_face_height_pixels?: number;
        directional_uv_required?: boolean;
      };
    };
  };''',
    "texturing manifest interface",
)

replace_once(
    '''    root_motion_policy?: string;
    quality_contract?: {
      minimum_clip_length?: number;
      maximum_clip_length?: number;
      require_animators?: boolean;
      require_keyframes?: boolean;
    };
  };''',
    '''    root_motion_policy?: string;
    forbidden_inferred_clips?: string[];
    clip_contracts?: Record<
      string,
      {
        length_seconds?: number;
        loop?: boolean;
        return_to_neutral?: boolean;
        root_translation_max_units?: number;
      }
    >;
    quality_contract?: {
      minimum_clip_length?: number;
      maximum_clip_length?: number;
      require_animators?: boolean;
      require_keyframes?: boolean;
      required_clip_count?: number;
      scale_keyframes_allowed?: boolean;
      neutral_recovery_required?: boolean;
    };
  };''',
    "animation manifest interface",
)

replace_once(
    '''        const textureQuality: Array<Record<string, any>> = [];
        if (validateTexture) {''',
    '''        const textureQuality: Array<Record<string, any>> = [];
        if (validateTexture) {''',
    "texture quality anchor",
)

texture_tail = '''          if (uvOutOfBounds > 0) {
            add(
              "TEXTURE_UV_OUT_OF_BOUNDS",
              "TEXTURE",
              "REVISION_REQUIRED",
              `${uvOutOfBounds} cube face UV rectangle(s) exceed the atlas bounds.`
            );
          }
        }

        const animationNames = new Set('''

texture_replacement = '''          if (uvOutOfBounds > 0) {
            add(
              "TEXTURE_UV_OUT_OF_BOUNDS",
              "TEXTURE",
              "REVISION_REQUIRED",
              `${uvOutOfBounds} cube face UV rectangle(s) exceed the atlas bounds.`
            );
          }

          const headConstraint = manifest.geometry?.part_constraints?.find(
            (constraint) =>
              String(constraint.id ?? "").toLowerCase() === "head" ||
              (constraint.name_patterns ?? []).some((pattern) =>
                String(pattern).toLowerCase().includes("head")
              )
          );
          const headPatterns = headConstraint?.name_patterns ?? ["head"];
          const headCube = Cube.all.find((cube) =>
            headPatterns.some((pattern) =>
              cube.name.toLowerCase().includes(String(pattern).toLowerCase())
            )
          );
          const eyeFaces = headCube
            ? (["east", "west"] as const)
                .map((faceName) => {
                  const face = headCube.faces?.[faceName] as
                    | { uv?: number[] }
                    | undefined;
                  return Array.isArray(face?.uv) && face.uv.length >= 4
                    ? {
                        cube: headCube.name,
                        face: faceName,
                        uv: [
                          Number(face.uv[0]),
                          Number(face.uv[1]),
                          Number(face.uv[2]),
                          Number(face.uv[3]),
                        ] as [number, number, number, number],
                        mirror_uv: Boolean(headCube.mirror_uv),
                      }
                    : null;
                })
                .filter((value): value is NonNullable<typeof value> => Boolean(value))
            : [];
          const textureContractQuality = evaluateTextureContractQuality({
            atlasWidth: Project.texture_width,
            atlasHeight: Project.texture_height,
            selectedAtlas:
              manifest.texturing?.atlas_policy?.selected ?? manifest.texturing?.atlas,
            minimumAtlas: manifest.texturing?.atlas_policy?.minimum,
            downgradeAllowed: manifest.texturing?.atlas_policy?.downgrade_allowed,
            eyeContract: manifest.texturing?.micro_detail_contract?.eyes,
            eyeFaces,
          });
          textureQuality.push({
            contract: "atlas_and_eye_uv",
            ...textureContractQuality,
          });
          for (const issue of textureContractQuality.issues) {
            add(issue.code, "TEXTURE", issue.severity, issue.message);
          }
        }

        const animationNames = new Set('''
replace_once(texture_tail, texture_replacement, "texture detailed contract")

old_snapshots = '''          const snapshots = animations.map((animation) => {
            const animators = Object.values(animation.animators ?? {}) as any[];
            let keyframeCount = 0;
            let rootPositionChannels = 0;
            for (const animator of animators) {
              for (const [channel, keyframes] of Object.entries(animator ?? {})) {
                if (Array.isArray(keyframes)) keyframeCount += keyframes.length;
                if (
                  String(channel).toLowerCase().includes("position") &&
                  String(animator?.name ?? animator?.group?.name ?? "").toLowerCase().includes("root")
                ) {
                  rootPositionChannels += Array.isArray(keyframes) ? keyframes.length : 1;
                }
              }
            }
            return {
              name: String(animation.name ?? ""),
              length: Number(animation.length ?? 0),
              animator_count: animators.length,
              keyframe_count: keyframeCount,
              root_position_channels: rootPositionChannels,
            };
          });'''

new_snapshots = '''          const snapshots = animations.map((animation) => {
            const animators = Object.values(animation.animators ?? {}) as any[];
            let keyframeCount = 0;
            let rootPositionChannels = 0;
            let scaleKeyframeCount = 0;
            let neutralRecoveryMaxDelta = 0;
            const vector = (keyframe: any): [number, number, number] | null => {
              const direct = keyframe?.values;
              if (Array.isArray(direct) && direct.length >= 3) {
                return [Number(direct[0]), Number(direct[1]), Number(direct[2])];
              }
              const point = Array.isArray(keyframe?.data_points)
                ? keyframe.data_points[0]
                : null;
              if (point && typeof point === "object") {
                const values = [Number(point.x), Number(point.y), Number(point.z)];
                if (values.every(Number.isFinite)) {
                  return values as [number, number, number];
                }
              }
              if (typeof keyframe?.getArray === "function") {
                const values = keyframe.getArray();
                if (Array.isArray(values) && values.length >= 3) {
                  return [Number(values[0]), Number(values[1]), Number(values[2])];
                }
              }
              return null;
            };
            for (const animator of animators) {
              const animatorName = String(
                animator?.name ?? animator?.group?.name ?? ""
              ).toLowerCase();
              for (const [channel, keyframes] of Object.entries(animator ?? {})) {
                if (!Array.isArray(keyframes)) continue;
                keyframeCount += keyframes.length;
                const normalizedChannel = String(channel).toLowerCase();
                if (normalizedChannel.includes("scale")) {
                  scaleKeyframeCount += keyframes.length;
                }
                if (
                  normalizedChannel.includes("position") &&
                  animatorName.includes("root")
                ) {
                  rootPositionChannels += keyframes.length;
                }
                if (keyframes.length >= 2) {
                  const first = vector(keyframes[0]);
                  const last = vector(keyframes[keyframes.length - 1]);
                  if (first && last) {
                    neutralRecoveryMaxDelta = Math.max(
                      neutralRecoveryMaxDelta,
                      Math.hypot(
                        last[0] - first[0],
                        last[1] - first[1],
                        last[2] - first[2]
                      )
                    );
                  }
                }
              }
            }
            const loopValue = animation.loop;
            return {
              name: String(animation.name ?? ""),
              length: Number(animation.length ?? 0),
              loop: loopValue === true || String(loopValue).toLowerCase() === "loop",
              animator_count: animators.length,
              keyframe_count: keyframeCount,
              root_position_channels: rootPositionChannels,
              scale_keyframe_count: scaleKeyframeCount,
              neutral_recovery_max_delta: neutralRecoveryMaxDelta,
            };
          });'''
replace_once(old_snapshots, new_snapshots, "detailed animation snapshots")

old_quality = '''          animationQuality = evaluateAnimationQuality({
            snapshots,
            requiredClips: requiredAnimations,
            existingGroups: Group.all.map((group) => group.name),
            movingGroups: manifest.animation?.moving_groups ?? [],
            staticGroups: manifest.animation?.static_groups ?? [],
            rootMotionAllowed: !String(manifest.animation?.root_motion_policy ?? "")
              .toLowerCase()
              .startsWith("none"),
            minimumClipLength: animationContract.minimum_clip_length,
            maximumClipLength: animationContract.maximum_clip_length,
            requireAnimators: animationContract.require_animators,
            requireKeyframes: animationContract.require_keyframes,
          });
          for (const issue of animationQuality.issues) {
            add(issue.code, "ANIMATION", issue.severity, issue.message);
          }'''

new_quality = '''          const baseAnimationQuality = evaluateAnimationQuality({
            snapshots,
            requiredClips: requiredAnimations,
            existingGroups: Group.all.map((group) => group.name),
            movingGroups: manifest.animation?.moving_groups ?? [],
            staticGroups: manifest.animation?.static_groups ?? [],
            rootMotionAllowed: rootMotionAllowedFromPolicy(
              manifest.animation?.root_motion_policy
            ),
            minimumClipLength: animationContract.minimum_clip_length,
            maximumClipLength: animationContract.maximum_clip_length,
            requireAnimators: animationContract.require_animators,
            requireKeyframes: animationContract.require_keyframes,
          });
          const detailedAnimationQuality = evaluateAnimationContractQuality({
            snapshots,
            requiredClips: requiredAnimations,
            forbiddenClips: manifest.animation?.forbidden_inferred_clips ?? [],
            requiredClipCount: animationContract.required_clip_count,
            clipContracts: manifest.animation?.clip_contracts,
            rootMotionPolicy: manifest.animation?.root_motion_policy,
            scaleKeyframesAllowed: animationContract.scale_keyframes_allowed,
            neutralRecoveryRequired:
              animationContract.neutral_recovery_required,
          });
          animationQuality = {
            status:
              baseAnimationQuality.status === "PASS" &&
              detailedAnimationQuality.status === "PASS"
                ? "PASS"
                : "REVISION_REQUIRED",
            snapshots,
            base: baseAnimationQuality,
            detailed: detailedAnimationQuality,
            issues: [
              ...baseAnimationQuality.issues,
              ...detailedAnimationQuality.issues,
            ],
          };
          for (const issue of animationQuality.issues) {
            add(issue.code, "ANIMATION", issue.severity, issue.message);
          }'''
replace_once(old_quality, new_quality, "animation detailed contract")

path.write_text(text, encoding="utf-8")
print("Integrated full-pipeline Texture and Animation acceptance into workflow.ts")

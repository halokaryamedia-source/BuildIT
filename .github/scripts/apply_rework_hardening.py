from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n", encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one exact match, found {count}: {old[:100]!r}")
    write(path, source.replace(old, new, 1))


def regex_once(path: str, pattern: str, replacement: str, flags: int = 0) -> None:
    source = read(path)
    updated, count = re.subn(pattern, replacement, source, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f"{path}: expected one regex match, found {count}: {pattern}")
    write(path, updated)


def update_json(path: str, mutate) -> None:
    value = json.loads(read(path))
    mutate(value)
    write(path, json.dumps(value, indent=2, ensure_ascii=False))


# ---------------------------------------------------------------------------
# P0: canonical Reference Studio and runtime routing
# ---------------------------------------------------------------------------

studio = "engines/chatgpt/skills/blockbench-reference-studio/SKILL.md"
replace_once(
    studio,
    """get_stage_context
→ inspect_reference_visual
→ PRIMARY_FORM
→ capture_visual_feedback
→ analyze_geometry_views
→ targeted repair from ranked diagnostics
→ STRUCTURAL_DETAIL
→ affected-view diagnosis
→ final five-view diagnosis
→ record_geometry_visual_result
→ validate_geometry_contract
→ verify_geometry_review_ready
→ user review""",
    """get_stage_context
→ rebind_active_project_identity when required
→ selected Terra writer acquires manage_project_write_lease
→ inspect_reference_visual_preview
→ PRIMARY_FORM
→ capture_visual_feedback
→ analyze_geometry_views
→ targeted repair from ranked diagnostics
→ STRUCTURAL_DETAIL
→ affected-view diagnosis
→ final five-view diagnosis with write_diff_image=true
→ visual_director final acceptance only when needed
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
→ user review""",
)
replace_once(
    studio,
    "Require `rotate_cube_about_attachment` for every non-zero cube rotation. Require `complete_geometry_stage` after explicit approval. Forbid free-rescaling, unrelated trial-and-error changes, and Texture before Geometry approval.",
    "Require `rotate_cube_about_attachment` for every non-zero cube rotation. `submit_geometry_for_review` performs fresh Geometry validation and its embedded readiness gate, so the handoff must not add duplicate validation calls. Require `complete_geometry_stage` only after explicit approval. Forbid free-rescaling, unrelated trial-and-error changes, removed repair profiles, and Texture before Geometry approval.",
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md",
    """# Codex Reference Handoff

Status: `APPROVED`

## Asset

- Asset ID: `<asset_id>`
- Display Name: `<display_name>`
- Target Format: `bedrock_entity`
- Reference Visual: `<asset_id>_reference_visual.png`
- Reference Manifest: `reference_manifest.json`
- Canonical Model: `<asset_id>.bbmodel`

## Source authority order

1. `PRODUCTION_CONTEXT.md`
2. `<asset_id>_reference_visual.png` as the sole visual authority
3. `reference_manifest.json` executable panel, region, part, symmetry, rotation, Texture, and Animation contracts
4. `GEOMETRY.md`
5. `TEXTURING.md`
6. `ANIMATION.md`
7. `VALIDATION.md`
8. `CODEX_REFERENCE_HANDOFF.md`

When files conflict, stop with `REFERENCE_CONFLICT`. Reject numbered-sheet, four-sheet, or three-approval packages with `LEGACY_SKILL_CONFLICT`.

## Project lock

- `1 Minecraft block = 16u`
- Asset envelope: `<width>u W × <depth>u D × <height>u H`
- Ground plane: `<ground_plane>`
- UV Mode: `<uv_mode>`
- Texture Atlas: `<width>x<height>`
- Pixel Style: `<16x_or_32x>`
- Front Direction: `<front_direction>`
- Symmetry Policy: `<BILATERAL_or_ASYMMETRIC>`
- Classic Bedrock: required
- PBR and Vibrant Visuals: forbidden

## Canonical Geometry route

```text
get_stage_context
→ rebind_active_project_identity when required
→ selected Terra writer acquires manage_project_write_lease
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ bounded diagnosed edits
→ final five-view diagnosis with write_diff_image=true
→ visual_director final acceptance only when needed
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ lease released
→ GEOMETRY_REVIEW
```

`submit_geometry_for_review` performs fresh `validate_geometry_contract`, verifies embedded review readiness, creates the next unused review checkpoint, and enters `GEOMETRY_REVIEW`. Do not run duplicate validation steps immediately before submission.

## Stage routing

```text
GEOMETRY         → blockbench-production + blockbench-geometry → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → blockbench-production + blockbench-texture → BEDROCK_CUBOID_TEXTURE
ANIMATION        → blockbench-production + blockbench-animation → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → blockbench-production + blockbench-validation → FINAL_VALIDATION_READONLY
```

Maximum loaded production skills: `2`. All stage changes continue in the same Codex session and MCP session.

## Import

Technical files:

```text
workspace/active/<asset_id>/mcp/references/
```

Visual files:

```text
workspace/active/<asset_id>/blockbench/references/
```

## Non-negotiable rules

- Do not redesign the approved Reference Visual.
- Do not invent parts, materials, clips, or proportions.
- Do not use removed repair profiles; Geometry revision uses internal `LOCAL_REPAIR` or `MAJOR_FORM_REVISION` scope.
- Do not continue through a user review gate automatically.
- Do not reconnect MCP, reload the plugin, or start another Codex session for a normal stage transition.
- Do not load all production skills together.
- Do not use PBR, Hytale, mesh, armature, vertex-weight, UI automation, or risky evaluation in the normal cuboid workflow.
- Every non-zero cube rotation must use `rotate_cube_about_attachment`.
""",
)

routing = "mcp-blockbench/src/server/stage-validation-routing-guards.ts"
replace_once(routing, "issue.reconnect_required = upstream;", "issue.reconnect_required = false;\n      issue.current_session_continues = true;")
replace_once(
    routing,
    """    profile_switch_required: upstream,
    reconnect_required: upstream,
    preserve_approved_checkpoints: upstream,""",
    """    profile_switch_required: upstream,
    reconnect_required: false,
    current_session_continues: true,
    preserve_approved_checkpoints: upstream,""",
)

# Canonical analyzer output: one Geometry profile, internal revision scope.
analyzer_path = "mcp-blockbench/src/server/tools/geometry-analyzer.ts"
replace_once(
    analyzer_path,
    "return_diff_image: z.boolean().optional().default(true),",
    "return_diff_image: z.boolean().optional().default(false),\n  write_diff_image: z.boolean().optional().default(true),",
)
replace_once(
    analyzer_path,
    """      readOnlyHint: true,
      openWorldHint: true,""",
    """      readOnlyHint: false,
      openWorldHint: true,""",
)
replace_once(
    analyzer_path,
    """        return_diff_image,
        segmentation_threshold,""",
    """        return_diff_image,
        write_diff_image,
        segmentation_threshold,""",
)
replace_once(
    analyzer_path,
    """          recommended_profile:
            recommendedScope === "MAJOR_FORM_REVISION"
              ? "GEOMETRY_VISUAL_REBUILD"
              : "GEOMETRY_LOCAL_REPAIR",""",
    """          recommended_profile: "BEDROCK_CUBOID_GEOMETRY",""",
)
replace_once(
    analyzer_path,
    """        const diff = contactSheet(
          views as StandardGeometryView[],
          referenceMasks,
          currentMasks,
          metrics
        );
        const diffPath = joinPath(evidenceRoot, "geometry_visual_diff.png");
        writeFileAtomically(fs, diffPath, diff);""",
    """        const diff = write_diff_image || return_diff_image
          ? contactSheet(
              views as StandardGeometryView[],
              referenceMasks,
              currentMasks,
              metrics
            )
          : null;
        const diffPath = write_diff_image
          ? joinPath(evidenceRoot, "geometry_visual_diff.png")
          : null;
        if (diff && diffPath) writeFileAtomically(fs, diffPath, diff);""",
)
replace_once(
    analyzer_path,
    """        if (return_diff_image) {
          content.push({
            type: "image",
            data: diff.toString("base64"),
            mimeType: "image/png",
          });
        }""",
    """        if (return_diff_image && diff) {
          content.push({
            type: "image",
            data: diff.toString("base64"),
            mimeType: "image/png",
          });
        }""",
)
replace_once(
    analyzer_path,
    """            recommended_scope: recommendedScope,
            recommended_profile: report.recommended_profile,
            returned_diff_image: return_diff_image,""",
    """            recommended_scope: recommendedScope,
            recommended_profile: "BEDROCK_CUBOID_GEOMETRY",
            returned_diff_image: return_diff_image,
            wrote_diff_image: Boolean(diffPath),
            usage: {
              analyzed_views: views.length,
              image_payloads_returned: return_diff_image && diff ? 1 : 0,
              persistent_diff_images_written: diffPath ? 1 : 0,
            },""",
)

# Robust foreground selection keeps meaningful detached ears/horns/tails.
regex_once(
    analyzer_path,
    r"function largestComponent\(mask: BinaryMask\): BinaryMask \{.*?\n\}\n\nfunction segmentReference\(image: ImageData, threshold: number\): BinaryMask \{.*?\n\}",
    r'''interface ForegroundComponent {
  pixels: number[];
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
}

function foregroundComponents(mask: BinaryMask): ForegroundComponent[] {
  const total = mask.width * mask.height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  const components: ForegroundComponent[] = [];
  for (let start = 0; start < total; start += 1) {
    if (!mask.data[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    visited[start] = 1;
    const pixels: number[] = [];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    while (head < tail) {
      const index = queue[head++];
      pixels.push(index);
      const x = index % mask.width;
      const y = Math.floor(index / mask.width);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x + 1 < mask.width ? index + 1 : -1,
        y > 0 ? index - mask.width : -1,
        y + 1 < mask.height ? index + mask.width : -1,
      ];
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && mask.data[neighbor] && !visited[neighbor]) {
          visited[neighbor] = 1;
          queue[tail++] = neighbor;
        }
      }
    }
    components.push({
      pixels,
      min_x: minX,
      min_y: minY,
      max_x: maxX,
      max_y: maxY,
    });
  }
  return components.sort((a, b) => b.pixels.length - a.pixels.length);
}

function componentGap(a: ForegroundComponent, b: ForegroundComponent): number {
  const dx = Math.max(0, a.min_x - b.max_x - 1, b.min_x - a.max_x - 1);
  const dy = Math.max(0, a.min_y - b.max_y - 1, b.min_y - a.max_y - 1);
  return Math.hypot(dx, dy);
}

export function retainRelevantForeground(mask: BinaryMask): BinaryMask {
  const components = foregroundComponents(mask);
  const main = components[0];
  if (!main) throw new Error("REFERENCE_FOREGROUND_NOT_FOUND");
  const minimumDetachedArea = Math.max(4, Math.ceil(main.pixels.length * 0.0125));
  const proximity = Math.max(mask.width, mask.height) * 0.12;
  const selected = components.filter(
    (component, index) =>
      index === 0 ||
      component.pixels.length >= main.pixels.length * 0.08 ||
      (component.pixels.length >= minimumDetachedArea &&
        componentGap(main, component) <= proximity)
  );
  const data = new Uint8Array(mask.width * mask.height);
  let foreground = 0;
  for (const component of selected) {
    for (const index of component.pixels) {
      if (!data[index]) foreground += 1;
      data[index] = 1;
    }
  }
  const ratio = foreground / Math.max(1, data.length);
  if (ratio < 0.002 || ratio > 0.92) {
    throw new Error(`REFERENCE_FOREGROUND_RATIO_INVALID: ${ratio.toFixed(4)}`);
  }
  return { width: mask.width, height: mask.height, data };
}

export function segmentReferencePixels(
  image: ImageData,
  threshold: number
): BinaryMask {
  const backgrounds = cornerSamples(image);
  const data = new Uint8Array(image.width * image.height);
  for (let pixel = 0; pixel < data.length; pixel += 1) {
    const source = pixel * 4;
    if (image.data[source + 3] < 32) continue;
    const red = image.data[source];
    const green = image.data[source + 1];
    const blue = image.data[source + 2];
    const minimum = Math.min(
      ...backgrounds.map((sample) => colorDistance(red, green, blue, sample))
    );
    if (minimum > threshold) data[pixel] = 1;
  }
  return retainRelevantForeground({ width: image.width, height: image.height, data });
}''',
    flags=re.S,
)
replace_once(analyzer_path, "const segmented = segmentReference(", "const segmented = segmentReferencePixels(")

rotation_path = "mcp-blockbench/src/server/tools/geometry-rotation.ts"
replace_once(
    rotation_path,
    """            output_dir: joinPath(scratchRoot, "before"),
            return_diff_image: false,""",
    """            output_dir: joinPath(scratchRoot, "before"),
            return_diff_image: false,
            write_diff_image: false,""",
)
replace_once(
    rotation_path,
    """              output_dir: joinPath(scratchRoot, "after"),
              return_diff_image: false,""",
    """              output_dir: joinPath(scratchRoot, "after"),
              return_diff_image: false,
              write_diff_image: false,""",
)

workflow_path = "mcp-blockbench/src/server/tools/workflow.ts"
replace_once(
    workflow_path,
    'session_root: z.string().min(1).describe("Absolute SavedData/sessions/<asset> directory."),',
    'session_root: z.string().min(1).describe("Canonical workspace/active/<asset>/mcp directory."),',
)
regex_once(
    workflow_path,
    r"function profileForStage\(stage: WorkflowStage, repair = false\): string \{.*?\n\}",
    '''function profileForStage(stage: WorkflowStage): string {
  const profiles: Record<WorkflowStage, string> = {
    GEOMETRY: "BEDROCK_CUBOID_GEOMETRY",
    TEXTURE: "BEDROCK_CUBOID_TEXTURE",
    ANIMATION: "BEDROCK_CUBOID_ANIMATION",
    FINAL_VALIDATION: "FINAL_VALIDATION_READONLY",
  };
  return profiles[stage];
}''',
    flags=re.S,
)
replace_once(
    workflow_path,
    'severity === "REVISION_REQUIRED" ? profileForStage(issueStage, true) : null,',
    'severity === "REVISION_REQUIRED" ? profileForStage(issueStage) : null,',
)

# ---------------------------------------------------------------------------
# P1: deterministic quality enforcement
# ---------------------------------------------------------------------------

write(
    "mcp-blockbench/src/lib/stageQuality.ts",
    r'''export interface QualityIssue {
  code: string;
  message: string;
  severity: "REVISION_REQUIRED" | "WARNING";
}

export interface TextureQualityContract {
  anti_aliasing_allowed?: boolean;
  maximum_partial_alpha_ratio?: number;
  minimum_opaque_ratio?: number;
  maximum_unique_colors?: number;
  palette_hex?: string[];
  maximum_palette_distance?: number;
  maximum_palette_outlier_ratio?: number;
}

function parseHex(value: string): [number, number, number] | null {
  const normalized = value.trim().replace(/^#/, "");
  if (!/^[a-f0-9]{6}$/i.test(normalized)) return null;
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function colorDistance(
  red: number,
  green: number,
  blue: number,
  palette: Array<[number, number, number]>
): number {
  if (!palette.length) return 0;
  return Math.min(
    ...palette.map((color) =>
      Math.hypot(red - color[0], green - color[1], blue - color[2])
    )
  );
}

export function analyzeTexturePixels(input: {
  width: number;
  height: number;
  data: ArrayLike<number>;
  contract?: TextureQualityContract;
}) {
  const contract = input.contract ?? {};
  const total = Math.max(1, input.width * input.height);
  const colors = new Set<string>();
  const palette = (contract.palette_hex ?? [])
    .map(parseHex)
    .filter((value): value is [number, number, number] => Boolean(value));
  let opaque = 0;
  let partialAlpha = 0;
  let paletteOutliers = 0;
  const maximumPaletteDistance = contract.maximum_palette_distance ?? 72;

  for (let pixel = 0; pixel < total; pixel += 1) {
    const offset = pixel * 4;
    const red = Number(input.data[offset] ?? 0);
    const green = Number(input.data[offset + 1] ?? 0);
    const blue = Number(input.data[offset + 2] ?? 0);
    const alpha = Number(input.data[offset + 3] ?? 0);
    if (alpha <= 0) continue;
    opaque += 1;
    if (alpha < 255) partialAlpha += 1;
    colors.add(`${red},${green},${blue},${alpha}`);
    if (
      palette.length > 0 &&
      colorDistance(red, green, blue, palette) > maximumPaletteDistance
    ) {
      paletteOutliers += 1;
    }
  }

  const opaqueRatio = opaque / total;
  const partialAlphaRatio = partialAlpha / Math.max(1, opaque);
  const paletteOutlierRatio = paletteOutliers / Math.max(1, opaque);
  const issues: QualityIssue[] = [];
  const minimumOpaqueRatio = contract.minimum_opaque_ratio ?? 0.005;
  if (opaqueRatio < minimumOpaqueRatio) {
    issues.push({
      code: "TEXTURE_EFFECTIVELY_BLANK",
      severity: "REVISION_REQUIRED",
      message: `Only ${(opaqueRatio * 100).toFixed(2)}% of atlas pixels are visible.`,
    });
  }
  if (
    contract.anti_aliasing_allowed === false &&
    partialAlphaRatio > (contract.maximum_partial_alpha_ratio ?? 0)
  ) {
    issues.push({
      code: "TEXTURE_PARTIAL_ALPHA_FORBIDDEN",
      severity: "REVISION_REQUIRED",
      message: `${partialAlpha} partially transparent pixel(s) violate the sharp-pixel contract.`,
    });
  }
  if (
    typeof contract.maximum_unique_colors === "number" &&
    colors.size > contract.maximum_unique_colors
  ) {
    issues.push({
      code: "TEXTURE_COLOR_BUDGET_EXCEEDED",
      severity: "REVISION_REQUIRED",
      message: `Atlas uses ${colors.size} colors; maximum is ${contract.maximum_unique_colors}.`,
    });
  }
  if (
    palette.length > 0 &&
    paletteOutlierRatio > (contract.maximum_palette_outlier_ratio ?? 0.2)
  ) {
    issues.push({
      code: "TEXTURE_PALETTE_DRIFT",
      severity: "REVISION_REQUIRED",
      message: `${(paletteOutlierRatio * 100).toFixed(2)}% of visible pixels are outside the approved palette tolerance.`,
    });
  }

  return {
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? ("REVISION_REQUIRED" as const)
      : ("PASS" as const),
    metrics: {
      width: input.width,
      height: input.height,
      opaque_ratio: opaqueRatio,
      partial_alpha_ratio: partialAlphaRatio,
      unique_colors: colors.size,
      palette_outlier_ratio: paletteOutlierRatio,
    },
    issues,
  };
}

export interface AnimationSnapshot {
  name: string;
  length: number;
  animator_count: number;
  keyframe_count: number;
  root_position_channels: number;
}

export function evaluateAnimationQuality(input: {
  snapshots: AnimationSnapshot[];
  requiredClips: string[];
  existingGroups: string[];
  movingGroups?: string[];
  staticGroups?: string[];
  rootMotionAllowed?: boolean;
  minimumClipLength?: number;
  maximumClipLength?: number;
  requireAnimators?: boolean;
  requireKeyframes?: boolean;
}) {
  const issues: QualityIssue[] = [];
  const byName = new Map(input.snapshots.map((snapshot) => [snapshot.name, snapshot]));
  const groups = new Set(input.existingGroups);
  for (const name of input.requiredClips) {
    const clip = byName.get(name);
    if (!clip) {
      issues.push({
        code: "REQUIRED_ANIMATION_MISSING",
        severity: "REVISION_REQUIRED",
        message: `Required animation is missing: ${name}.`,
      });
      continue;
    }
    const minimum = input.minimumClipLength ?? 0.05;
    if (!Number.isFinite(clip.length) || clip.length < minimum) {
      issues.push({
        code: "ANIMATION_LENGTH_INVALID",
        severity: "REVISION_REQUIRED",
        message: `${name} length ${clip.length} is below ${minimum}.`,
      });
    }
    if (
      typeof input.maximumClipLength === "number" &&
      clip.length > input.maximumClipLength
    ) {
      issues.push({
        code: "ANIMATION_LENGTH_EXCESS",
        severity: "REVISION_REQUIRED",
        message: `${name} length ${clip.length} exceeds ${input.maximumClipLength}.`,
      });
    }
    if (input.requireAnimators !== false && clip.animator_count === 0) {
      issues.push({
        code: "ANIMATION_HAS_NO_ANIMATORS",
        severity: "REVISION_REQUIRED",
        message: `${name} has no animators.`,
      });
    }
    if (input.requireKeyframes !== false && clip.keyframe_count === 0) {
      issues.push({
        code: "ANIMATION_HAS_NO_KEYFRAMES",
        severity: "REVISION_REQUIRED",
        message: `${name} has no keyframes.`,
      });
    }
    if (input.rootMotionAllowed === false && clip.root_position_channels > 0) {
      issues.push({
        code: "ANIMATION_ROOT_MOTION_FORBIDDEN",
        severity: "REVISION_REQUIRED",
        message: `${name} contains root position motion while root motion is forbidden.`,
      });
    }
  }
  for (const group of [...(input.movingGroups ?? []), ...(input.staticGroups ?? [])]) {
    if (!groups.has(group)) {
      issues.push({
        code: "ANIMATION_GROUP_MISSING",
        severity: "REVISION_REQUIRED",
        message: `Animation contract references missing group: ${group}.`,
      });
    }
  }
  return {
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? ("REVISION_REQUIRED" as const)
      : ("PASS" as const),
    snapshots: input.snapshots,
    issues,
  };
}

export interface SymmetryElement {
  name: string;
  center: [number, number, number];
  size: [number, number, number];
}

export interface SymmetryPairContract {
  id: string;
  left_patterns: string[];
  right_patterns: string[];
}

function includesPattern(name: string, patterns: string[]): boolean {
  const normalized = name.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

function aggregateSymmetry(elements: SymmetryElement[]) {
  if (!elements.length) return null;
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (const element of elements) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], element.center[axis] - element.size[axis] / 2);
      max[axis] = Math.max(max[axis], element.center[axis] + element.size[axis] / 2);
    }
  }
  return {
    center: [
      (min[0] + max[0]) / 2,
      (min[1] + max[1]) / 2,
      (min[2] + max[2]) / 2,
    ] as [number, number, number],
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]] as [number, number, number],
  };
}

export function evaluateGeometrySymmetry(input: {
  policy?: string;
  elements: SymmetryElement[];
  pairs?: SymmetryPairContract[];
  asymmetryContracts?: Array<{ id: string; patterns: string[] }>;
  toleranceUnits?: number;
}) {
  const issues: QualityIssue[] = [];
  const policy = String(input.policy ?? "").toUpperCase();
  const tolerance = input.toleranceUnits ?? 0.35;
  if (!policy) {
    issues.push({
      code: "SYMMETRY_POLICY_MISSING",
      severity: "REVISION_REQUIRED",
      message: "Geometry manifest must declare BILATERAL or ASYMMETRIC symmetry policy.",
    });
  } else if (policy === "BILATERAL") {
    if (!(input.pairs?.length)) {
      issues.push({
        code: "SYMMETRY_PAIRS_MISSING",
        severity: "REVISION_REQUIRED",
        message: "BILATERAL geometry requires machine-readable left/right pair contracts.",
      });
    }
    for (const pair of input.pairs ?? []) {
      const left = aggregateSymmetry(
        input.elements.filter((element) => includesPattern(element.name, pair.left_patterns))
      );
      const right = aggregateSymmetry(
        input.elements.filter((element) => includesPattern(element.name, pair.right_patterns))
      );
      if (!left || !right) {
        issues.push({
          code: "SYMMETRY_PAIR_MISSING",
          severity: "REVISION_REQUIRED",
          message: `${pair.id} is missing its left or right Geometry counterpart.`,
        });
        continue;
      }
      const deltas = [
        Math.abs(left.center[0] + right.center[0]),
        Math.abs(left.center[1] - right.center[1]),
        Math.abs(left.center[2] - right.center[2]),
        ...left.size.map((value, axis) => Math.abs(value - right.size[axis])),
      ];
      if (Math.max(...deltas) > tolerance) {
        issues.push({
          code: "SYMMETRY_PAIR_MISMATCH",
          severity: "REVISION_REQUIRED",
          message: `${pair.id} exceeds bilateral tolerance ${tolerance}u (max delta ${Math.max(...deltas).toFixed(3)}u).`,
        });
      }
    }
  } else if (policy === "ASYMMETRIC") {
    if (!(input.asymmetryContracts?.length)) {
      issues.push({
        code: "ASYMMETRY_CONTRACT_MISSING",
        severity: "REVISION_REQUIRED",
        message: "ASYMMETRIC geometry requires explicit affected-part contracts.",
      });
    }
    for (const contract of input.asymmetryContracts ?? []) {
      if (!input.elements.some((element) => includesPattern(element.name, contract.patterns))) {
        issues.push({
          code: "ASYMMETRY_PART_MISSING",
          severity: "REVISION_REQUIRED",
          message: `Asymmetry contract ${contract.id} does not match current Geometry.`,
        });
      }
    }
  } else if (policy) {
    issues.push({
      code: "SYMMETRY_POLICY_INVALID",
      severity: "REVISION_REQUIRED",
      message: `Unsupported symmetry policy: ${policy}.`,
    });
  }
  return {
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? ("REVISION_REQUIRED" as const)
      : ("PASS" as const),
    policy: policy || null,
    tolerance_units: tolerance,
    issues,
  };
}
''',
)

write(
    "mcp-blockbench/src/lib/geometryBlueprint.ts",
    r'''import type {
  GeometryPartConstraint,
  Vec3,
} from "@/lib/geometryReferenceProfiles";

export interface BlueprintElement {
  name?: string;
  from?: number[];
  to?: number[];
  visibility?: boolean;
  export?: boolean;
  parent_name?: string | null;
  world_corners?: Vec3[];
}

export interface BlueprintPartResult {
  id: string;
  role: GeometryPartConstraint["role"];
  matched_elements: string[];
  result: "PASS" | "REVISION_REQUIRED" | "NOT_EVALUATED";
  actual: {
    center: Vec3 | null;
    size: Vec3 | null;
    min: Vec3 | null;
    max: Vec3 | null;
    element_count: number;
    parent_names: string[];
  };
  expected: {
    center_range_units?: GeometryPartConstraint["center_range_units"];
    size_range_units?: GeometryPartConstraint["size_range_units"];
    parent?: string;
    minimum_elements?: number;
    maximum_elements?: number;
  };
  deltas: Array<{
    code: string;
    axis: "x" | "y" | "z";
    actual: number;
    minimum: number;
    maximum: number;
    nearest_correction: number;
  }>;
  contract_issues: string[];
  visual_views: string[];
  recommendation: string | null;
}

export interface BlueprintEvaluation {
  result: "PASS" | "REVISION_REQUIRED";
  evaluated_parts: number;
  failed_parts: number;
  parts: BlueprintPartResult[];
  issues: Array<{
    code: string;
    part: string;
    role: GeometryPartConstraint["role"];
    views: string[];
    message: string;
    nearest_correction_units: number;
  }>;
}

const AXES = ["x", "y", "z"] as const;

function finiteVec3(value: unknown): Vec3 | null {
  if (!Array.isArray(value) || value.length < 3) return null;
  const vector: Vec3 = [Number(value[0]), Number(value[1]), Number(value[2])];
  return vector.every(Number.isFinite) ? vector : null;
}

function matches(name: string, patterns: string[]): boolean {
  const normalized = name.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

function elementPoints(element: BlueprintElement): Vec3[] {
  if (Array.isArray(element.world_corners) && element.world_corners.length > 0) {
    return element.world_corners.filter(
      (point): point is Vec3 => Boolean(finiteVec3(point))
    );
  }
  const from = finiteVec3(element.from);
  const to = finiteVec3(element.to);
  return from && to ? [from, to] : [];
}

function aggregate(elements: BlueprintElement[]): {
  min: Vec3;
  max: Vec3;
  center: Vec3;
  size: Vec3;
} | null {
  const mins: Vec3 = [Infinity, Infinity, Infinity];
  const maxs: Vec3 = [-Infinity, -Infinity, -Infinity];
  let count = 0;
  for (const element of elements) {
    if (element.visibility === false || element.export === false) continue;
    const points = elementPoints(element);
    if (!points.length) continue;
    for (const point of points) {
      for (let axis = 0; axis < 3; axis += 1) {
        mins[axis] = Math.min(mins[axis], point[axis]);
        maxs[axis] = Math.max(maxs[axis], point[axis]);
      }
    }
    count += 1;
  }
  if (count === 0) return null;
  const size: Vec3 = [
    maxs[0] - mins[0],
    maxs[1] - mins[1],
    maxs[2] - mins[2],
  ];
  const center: Vec3 = [
    (mins[0] + maxs[0]) / 2,
    (mins[1] + maxs[1]) / 2,
    (mins[2] + maxs[2]) / 2,
  ];
  return { min: mins, max: maxs, center, size };
}

function rangeDeltas(
  codePrefix: string,
  actual: Vec3,
  range: { min: Vec3; max: Vec3 } | undefined
): BlueprintPartResult["deltas"] {
  if (!range) return [];
  const deltas: BlueprintPartResult["deltas"] = [];
  for (let axis = 0; axis < 3; axis += 1) {
    if (actual[axis] < range.min[axis] || actual[axis] > range.max[axis]) {
      const nearest =
        actual[axis] < range.min[axis]
          ? range.min[axis] - actual[axis]
          : range.max[axis] - actual[axis];
      deltas.push({
        code: `${codePrefix}_${AXES[axis].toUpperCase()}_OUT_OF_RANGE`,
        axis: AXES[axis],
        actual: actual[axis],
        minimum: range.min[axis],
        maximum: range.max[axis],
        nearest_correction: nearest,
      });
    }
  }
  return deltas;
}

function recommendation(
  constraint: GeometryPartConstraint,
  deltas: BlueprintPartResult["deltas"],
  contractIssues: string[]
): string | null {
  const changes = deltas.map((delta) => {
    const direction =
      delta.nearest_correction > 0
        ? "increase/shift positive"
        : "decrease/shift negative";
    return `${delta.code.toLowerCase()}: ${direction} ${delta.axis.toUpperCase()} by about ${Math.abs(
      delta.nearest_correction
    ).toFixed(2)}u`;
  });
  if (contractIssues.length) changes.push(...contractIssues);
  return changes.length
    ? `Adjust ${constraint.id} only (${changes.join("; ")}) and re-run the affected views: ${constraint.visual_views.join(
        ", "
      )}.`
    : null;
}

export function evaluateGeometryBlueprint(
  elements: BlueprintElement[],
  constraints: GeometryPartConstraint[]
): BlueprintEvaluation {
  const parts: BlueprintPartResult[] = [];
  const issues: BlueprintEvaluation["issues"] = [];

  for (const constraint of constraints) {
    const matched = elements.filter((element) =>
      matches(String(element.name ?? ""), constraint.name_patterns)
    );
    const bounds = aggregate(matched);
    const deltas = bounds
      ? [
          ...rangeDeltas(
            `${constraint.id.toUpperCase()}_CENTER`,
            bounds.center,
            constraint.center_range_units
          ),
          ...rangeDeltas(
            `${constraint.id.toUpperCase()}_SIZE`,
            bounds.size,
            constraint.size_range_units
          ),
        ]
      : [];
    const contractIssues: string[] = [];
    const minimumElements = constraint.minimum_elements ?? 1;
    const maximumElements = constraint.maximum_elements ?? Number.POSITIVE_INFINITY;
    if (matched.length < minimumElements || matched.length > maximumElements) {
      contractIssues.push(
        `element count ${matched.length} is outside ${minimumElements}..${
          Number.isFinite(maximumElements) ? maximumElements : "∞"
        }`
      );
    }
    const knownParents = Array.from(
      new Set(
        matched
          .map((element) => element.parent_name)
          .filter((value): value is string => typeof value === "string" && value.length > 0)
      )
    );
    if (
      constraint.parent &&
      knownParents.length > 0 &&
      knownParents.some((parent) => parent !== constraint.parent)
    ) {
      contractIssues.push(
        `parent must be ${constraint.parent}; found ${knownParents.join(", ")}`
      );
    }
    const hasNumericContract = Boolean(
      constraint.center_range_units || constraint.size_range_units
    );
    const evaluated = hasNumericContract || constraint.required !== false;
    const result: BlueprintPartResult["result"] = !evaluated
      ? "NOT_EVALUATED"
      : !bounds || deltas.length > 0 || contractIssues.length > 0
        ? "REVISION_REQUIRED"
        : "PASS";
    const part: BlueprintPartResult = {
      id: constraint.id,
      role: constraint.role,
      matched_elements: matched.map((element) => String(element.name ?? "unnamed")),
      result,
      actual: {
        center: bounds?.center ?? null,
        size: bounds?.size ?? null,
        min: bounds?.min ?? null,
        max: bounds?.max ?? null,
        element_count: matched.length,
        parent_names: knownParents,
      },
      expected: {
        center_range_units: constraint.center_range_units,
        size_range_units: constraint.size_range_units,
        parent: constraint.parent,
        minimum_elements: minimumElements,
        maximum_elements: Number.isFinite(maximumElements)
          ? maximumElements
          : undefined,
      },
      deltas,
      contract_issues: contractIssues,
      visual_views: constraint.visual_views,
      recommendation: !bounds
        ? `Build the missing ${constraint.id} part before visual comparison.`
        : recommendation(constraint, deltas, contractIssues),
    };
    parts.push(part);

    if (result === "REVISION_REQUIRED") {
      if (!bounds) {
        issues.push({
          code: `${constraint.id.toUpperCase()}_MISSING`,
          part: constraint.id,
          role: constraint.role,
          views: constraint.visual_views,
          message: `${constraint.id} has no matching cube for patterns ${constraint.name_patterns.join(
            ", "
          )}.`,
          nearest_correction_units: 0,
        });
      }
      for (const delta of deltas) {
        issues.push({
          code: delta.code,
          part: constraint.id,
          role: constraint.role,
          views: constraint.visual_views,
          message: `${constraint.id} ${delta.axis.toUpperCase()} value ${delta.actual.toFixed(
            2
          )}u is outside ${delta.minimum.toFixed(2)}..${delta.maximum.toFixed(
            2
          )}u; nearest correction ${delta.nearest_correction.toFixed(2)}u.`,
          nearest_correction_units: delta.nearest_correction,
        });
      }
      for (const contractIssue of contractIssues) {
        issues.push({
          code: `${constraint.id.toUpperCase()}_CONTRACT_MISMATCH`,
          part: constraint.id,
          role: constraint.role,
          views: constraint.visual_views,
          message: `${constraint.id}: ${contractIssue}.`,
          nearest_correction_units: 0,
        });
      }
    }
  }

  const failed = parts.filter((part) => part.result === "REVISION_REQUIRED");
  return {
    result: failed.length > 0 ? "REVISION_REQUIRED" : "PASS",
    evaluated_parts: parts.filter((part) => part.result !== "NOT_EVALUATED").length,
    failed_parts: failed.length,
    parts,
    issues,
  };
}
''',
)

profiles_path = "mcp-blockbench/src/lib/geometryReferenceProfiles.ts"
replace_once(
    profiles_path,
    """  rotation_contract?: string;
  visual_views: StandardGeometryView[];""",
    """  rotation_contract?: string;
  required?: boolean;
  minimum_elements?: number;
  maximum_elements?: number;
  visual_views: StandardGeometryView[];""",
)
for marker, count in [
    ('id: "front_horn",', (3, 3)),
    ('id: "rear_horn",', (2, 2)),
    ('id: "ears",', (2, 4)),
    ('id: "tail",', (2, 2)),
]:
    source = read(profiles_path)
    position = source.find(marker)
    if position < 0:
        raise RuntimeError(f"{profiles_path}: missing {marker}")
    role_position = source.find("role:", position)
    line_end = source.find("\n", role_position)
    insertion = f"\n      minimum_elements: {count[0]},\n      maximum_elements: {count[1]},"
    source = source[:line_end] + insertion + source[line_end:]
    write(profiles_path, source)

validator_path = "mcp-blockbench/src/server/tools/geometry-validator.ts"
replace_once(
    validator_path,
    'import { evaluateGeometryBlueprint } from "@/lib/geometryBlueprint";',
    'import { evaluateGeometryBlueprint } from "@/lib/geometryBlueprint";\nimport { evaluateGeometrySymmetry } from "@/lib/stageQuality";',
)
replace_once(
    validator_path,
    """        const blueprint = profile
          ? evaluateGeometryBlueprint(
              (Cube.all ?? []).map((cube) => ({
                name: cube.name,
                from: [...cube.from],
                to: [...cube.to],
                visibility: cube.visibility,
                export: (cube as unknown as { export?: boolean }).export,
              })),
              profile.part_constraints
            )
          : null;""",
    """        const geometryElements = (Cube.all ?? []).map((cube) => {
          const corners = transformedCubeCorners(cube);
          const minimum = [0, 1, 2].map((axis) =>
            Math.min(...corners.map((point) => point[axis]))
          ) as [number, number, number];
          const maximum = [0, 1, 2].map((axis) =>
            Math.max(...corners.map((point) => point[axis]))
          ) as [number, number, number];
          const parentName =
            typeof cube.parent === "string"
              ? cube.parent
              : (cube.parent as unknown as { name?: string })?.name ?? null;
          return {
            name: cube.name,
            from: [...cube.from],
            to: [...cube.to],
            visibility: cube.visibility,
            export: (cube as unknown as { export?: boolean }).export,
            parent_name: parentName,
            world_corners: corners,
            center: [
              (minimum[0] + maximum[0]) / 2,
              (minimum[1] + maximum[1]) / 2,
              (minimum[2] + maximum[2]) / 2,
            ] as [number, number, number],
            size: [
              maximum[0] - minimum[0],
              maximum[1] - minimum[1],
              maximum[2] - minimum[2],
            ] as [number, number, number],
          };
        });
        const blueprint = profile
          ? evaluateGeometryBlueprint(geometryElements, profile.part_constraints)
          : null;""",
)
replace_once(
    validator_path,
    """        for (const issue of blueprint?.issues ?? []) {
          issues.push({
            code: issue.code,
            severity: "REVISION_REQUIRED",
            message: issue.message,
          });
        }

        const groundY""",
    """        for (const issue of blueprint?.issues ?? []) {
          issues.push({
            code: issue.code,
            severity: "REVISION_REQUIRED",
            message: issue.message,
          });
        }
        const symmetry = evaluateGeometrySymmetry({
          policy: manifest.geometry?.symmetry_policy,
          toleranceUnits: numeric(manifest.geometry?.symmetry_tolerance_units) ?? 0.35,
          pairs: manifest.geometry?.symmetry_pairs ?? [],
          asymmetryContracts: manifest.geometry?.asymmetry_contracts ?? [],
          elements: geometryElements.map((element) => ({
            name: element.name,
            center: element.center,
            size: element.size,
          })),
        });
        for (const issue of symmetry.issues) {
          issues.push({
            code: issue.code,
            severity: issue.severity,
            message: issue.message,
          });
        }

        const groundY""",
)
replace_once(
    validator_path,
    """          blueprint,
          ground_contacts: groundContacts,""",
    """          blueprint,
          symmetry,
          ground_contacts: groundContacts,""",
)

# Extend generic stage validation with deterministic Texture and Animation checks.
replace_once(
    workflow_path,
    '} from "@/lib/atomicFiles";',
    '} from "@/lib/atomicFiles";\nimport {\n  analyzeTexturePixels,\n  evaluateAnimationQuality,\n} from "@/lib/stageQuality";',
)
regex_once(
    workflow_path,
    r"interface ReferenceManifest \{.*?\n\}",
    r'''interface ReferenceManifest {
  asset?: { id?: string; target?: string };
  package?: Record<string, string>;
  main_format?: {
    height_blocks?: number;
    width_blocks?: number;
    depth_blocks?: number;
    blockbench_units_per_block?: number;
  };
  geometry?: { hierarchy?: Record<string, unknown> };
  texturing?: {
    atlas?: string;
    pipeline?: string;
    pbr?: boolean;
    anti_aliasing?: boolean;
    base_palette?: Record<string, string>;
    quality_contract?: {
      maximum_partial_alpha_ratio?: number;
      minimum_opaque_ratio?: number;
      maximum_unique_colors?: number;
      maximum_palette_distance?: number;
      maximum_palette_outlier_ratio?: number;
    };
  };
  animation?: {
    animation_ready?: boolean;
    required_clips?: string[];
    required_animations?: string[];
    animations?: string[];
    moving_groups?: string[];
    static_groups?: string[];
    root_motion_policy?: string;
    quality_contract?: {
      minimum_clip_length?: number;
      maximum_clip_length?: number;
      require_animators?: boolean;
      require_keyframes?: boolean;
    };
  };
}''',
    flags=re.S,
)
replace_once(
    workflow_path,
    """        if (validateTexture) {
          const pbrTextures = Texture.all.filter((texture) =>
            Boolean((texture as unknown as { pbr_channel?: string }).pbr_channel)
          );
          if (pbrTextures.length > 0) {
            add(
              "PBR_TEXTURE_PRESENT",
              "TEXTURE",
              "REVISION_REQUIRED",
              `${pbrTextures.length} texture(s) use PBR channels.`
            );
          }
          if (Texture.all.length === 0) {
            add("TEXTURE_MISSING", "TEXTURE", "REVISION_REQUIRED", "No project texture exists.");
          }
        }

        const animationNames""",
    """        const textureQuality: Array<Record<string, any>> = [];
        if (validateTexture) {
          const pbrTextures = Texture.all.filter((texture) =>
            Boolean((texture as unknown as { pbr_channel?: string }).pbr_channel)
          );
          if (pbrTextures.length > 0) {
            add(
              "PBR_TEXTURE_PRESENT",
              "TEXTURE",
              "REVISION_REQUIRED",
              `${pbrTextures.length} texture(s) use PBR channels.`
            );
          }
          if (Texture.all.length === 0) {
            add("TEXTURE_MISSING", "TEXTURE", "REVISION_REQUIRED", "No project texture exists.");
          }
          const qualityContract = manifest.texturing?.quality_contract ?? {};
          const paletteHex = Object.values(manifest.texturing?.base_palette ?? {});
          for (const texture of Texture.all) {
            try {
              const { ctx } = texture.getActiveCanvas();
              const pixels = ctx.getImageData(0, 0, texture.width, texture.height).data;
              const quality = analyzeTexturePixels({
                width: texture.width,
                height: texture.height,
                data: pixels,
                contract: {
                  anti_aliasing_allowed: manifest.texturing?.anti_aliasing !== false,
                  palette_hex: paletteHex,
                  ...qualityContract,
                },
              });
              textureQuality.push({ texture: texture.name, ...quality });
              for (const issue of quality.issues) {
                add(issue.code, "TEXTURE", issue.severity, `${texture.name}: ${issue.message}`);
              }
            } catch (error) {
              add(
                "TEXTURE_PIXEL_READ_FAILED",
                "TEXTURE",
                "REVISION_REQUIRED",
                `${texture.name}: ${error instanceof Error ? error.message : String(error)}`
              );
            }
          }
          let uvOutOfBounds = 0;
          for (const cube of Cube.all) {
            for (const face of Object.values(cube.faces ?? {})) {
              const uv = (face as unknown as { uv?: number[] }).uv;
              if (!Array.isArray(uv)) continue;
              if (
                uv.some((value, index) =>
                  value < 0 || value > (index % 2 === 0 ? Project.texture_width : Project.texture_height)
                )
              ) {
                uvOutOfBounds += 1;
              }
            }
          }
          if (uvOutOfBounds > 0) {
            add(
              "TEXTURE_UV_OUT_OF_BOUNDS",
              "TEXTURE",
              "REVISION_REQUIRED",
              `${uvOutOfBounds} cube face UV rectangle(s) exceed the atlas bounds.`
            );
          }
        }

        const animationNames""",
)
replace_once(
    workflow_path,
    """        if (validateAnimation) {
          const requiredAnimations =
            manifest.animation?.required_clips ??
            manifest.animation?.required_animations ??
            manifest.animation?.animations ??
            [];
          for (const animation of requiredAnimations) {
            if (!animationNames.has(animation)) {
              add(
                "REQUIRED_ANIMATION_MISSING",
                "ANIMATION",
                "REVISION_REQUIRED",
                `Required animation is missing: ${animation}`
              );
            }
          }
        }

        if (require_evidence)""",
    """        let animationQuality: Record<string, any> | null = null;
        if (validateAnimation) {
          const requiredAnimations =
            manifest.animation?.required_clips ??
            manifest.animation?.required_animations ??
            manifest.animation?.animations ??
            [];
          const animations =
            ((globalThis as unknown as { Animation?: { all?: any[] } }).Animation?.all) ?? [];
          const snapshots = animations.map((animation) => {
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
          });
          const animationContract = manifest.animation?.quality_contract ?? {};
          animationQuality = evaluateAnimationQuality({
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
          }
        }

        if (require_evidence)""",
)
replace_once(
    workflow_path,
    """            blockbench_validator: {
              errors: validatorErrors,
              warnings: validatorWarnings,
            },
            issues,""",
    """            blockbench_validator: {
              errors: validatorErrors,
              warnings: validatorWarnings,
            },
            deterministic_quality: {
              texture: textureQuality,
              animation: animationQuality,
            },
            issues,""",
)

# Machine-readable generic contracts and Golden Sample contracts.
def add_quality_contracts(value: dict) -> None:
    value["schema_version"] = str(value.get("schema_version", "3.3"))
    geometry = value.setdefault("geometry", {})
    geometry.setdefault("symmetry_policy", "BILATERAL")
    geometry.setdefault("symmetry_tolerance_units", 0.35)
    geometry.setdefault(
        "symmetry_pairs",
        [
            {"id": "ears", "left_patterns": ["ear_left"], "right_patterns": ["ear_right"]},
            {"id": "front_legs", "left_patterns": ["front_left"], "right_patterns": ["front_right"]},
            {"id": "rear_legs", "left_patterns": ["rear_left"], "right_patterns": ["rear_right"]},
        ],
    )
    geometry.setdefault("asymmetry_contracts", [])
    texturing = value.setdefault("texturing", {})
    texturing.setdefault(
        "quality_contract",
        {
            "maximum_partial_alpha_ratio": 0,
            "minimum_opaque_ratio": 0.005,
            "maximum_unique_colors": 96,
            "maximum_palette_distance": 72,
            "maximum_palette_outlier_ratio": 0.2,
        },
    )
    animation = value.setdefault("animation", {})
    animation.setdefault(
        "quality_contract",
        {
            "minimum_clip_length": 0.05,
            "maximum_clip_length": 30,
            "require_animators": True,
            "require_keyframes": True,
        },
    )


for manifest_path in [
    "engines/chatgpt/skills/blockbench-reference-studio/templates/reference_manifest.template.json",
    "docs/reference/golden-samples/black_rhinoceros/reference_manifest.json",
    "workspace/active/black_rhinoceros/mcp/references/reference_manifest.json",
]:
    update_json(manifest_path, add_quality_contracts)

# ---------------------------------------------------------------------------
# P2: lower payload/tool overhead and deterministic route recommendation
# ---------------------------------------------------------------------------

tools_path = "mcp-blockbench/src/server/tools.ts"
replace_once(
    tools_path,
    """for (const register of registrationFunctions) register();
for (const register of optionalRegistrationFunctions) register();""",
    """for (const register of registrationFunctions) register();
const extendedCapabilitiesEnabled =
  typeof Settings !== "undefined" &&
  Settings.get("mcp_extended_capabilities") === true;
if (extendedCapabilitiesEnabled) {
  for (const register of optionalRegistrationFunctions) register();
}""",
)

settings_path = "mcp-blockbench/src/ui/settings.ts"
replace_once(
    settings_path,
    """    new Setting("mcp_prompt_cdn_enabled", {
      name: tl("mcp.settings.prompt_cdn_name"),""",
    """    new Setting("mcp_extended_capabilities", {
      name: "Extended MCP capabilities",
      description:
        "Register unrelated Hytale and extended tools. Keep disabled for the compact Bedrock production surface.",
      type: "toggle",
      value: false,
      category,
      icon: "extension_off",
    }),
    new Setting("mcp_prompt_cdn_enabled", {
      name: tl("mcp.settings.prompt_cdn_name"),""",
)

context_path = "mcp-blockbench/src/server/stage-context-routing-guards.ts"
replace_once(
    context_path,
    """function reportResult(report: Record<string, any>): string | null {""",
    """function recommendedModelRoute(next: string, stage: string) {
  if (next.startsWith("AWAIT_")) {
    return { route: "NO_MODEL_WORK", reason: "Waiting for the user review decision." };
  }
  if (
    next.includes("rebind_active_project_identity") ||
    next.includes("manage_project_write_lease")
  ) {
    return {
      route: "TERRA_PARENT_DIRECT",
      reason: "Identity and lease operations are deterministic controller work.",
    };
  }
  if (stage === "GEOMETRY" && next === "CONTINUE_STAGE") {
    return {
      route: "SELECTED_TERRA_WRITER",
      reason:
        "Run deterministic diagnosis and bounded mutations; escalate to Sol Medium only for an unresolved visual conflict or final artistic acceptance.",
    };
  }
  if (next.includes("submit_") || next.includes("complete_")) {
    return {
      route: "SELECTED_TERRA_WRITER",
      reason: "Guarded validation and transition do not require a visual model call.",
    };
  }
  return {
    route: "TERRA_PARENT_DIRECT",
    reason: "Use the cheapest deterministic route until visual judgment is explicitly required.",
  };
}

function reportResult(report: Record<string, any>): string | null {""",
)
replace_once(
    context_path,
    """  context.automation.user_restart_required = false;
}""",
    """  context.automation.user_restart_required = false;
  context.automation.model_route = recommendedModelRoute(next, stage);
  context.automation.visual_escalation = {
    route: "visual_director",
    model: "gpt-5.6-sol",
    effort: "medium",
    only_when: [
      "cross_view_conflict",
      "unclear_visual_root_cause",
      "subjective_user_feedback_after_deterministic_pass",
      "final_visual_acceptance",
    ],
  };
}""",
)

# Canonical production skills describe low-payload analyzer use.
geometry_skill = "engines/shared/skills/blockbench-geometry/SKILL.md"
replace_once(
    geometry_skill,
    """→ capture_visual_feedback
→ analyze_geometry_views
→ bounded edits of diagnosed parts
→ final five-view capture/analyze""",
    """→ capture_visual_feedback
→ analyze_geometry_views with return_diff_image=false during normal correction
→ bounded edits of diagnosed parts
→ final five-view capture/analyze with write_diff_image=true""",
)
replace_once(
    geometry_skill,
    "`analyze_geometry_views` persists canonical metrics and diff; it requires the active Geometry lease. Ephemeral visual capture without `output_dir` may be used by `visual_director`.",
    "`analyze_geometry_views` persists canonical metrics and requires the active Geometry lease. It does not return the diff image by default; the final five-view pass writes the canonical diff, while rotation checks suppress redundant diff files. Ephemeral visual capture without `output_dir` may be used by `visual_director`.",
)

texture_skill = "engines/shared/skills/blockbench-texture/SKILL.md"
replace_once(
    texture_skill,
    "`record_stage_review_report` creates the canonical `texture_report.json` and binds it to the current project serialization plus hashes of the atlas and review views. Do not write a free-form PASS report manually.",
    "`record_stage_review_report` creates the canonical `texture_report.json` and binds it to the current project serialization plus hashes of the atlas and review views. Fresh `validate_reference_contract` also enforces atlas bounds, visible-pixel coverage, partial-alpha policy, color budget, and palette drift before submission. Do not write a free-form PASS report manually.",
)
animation_skill = "engines/shared/skills/blockbench-animation/SKILL.md"
replace_once(
    animation_skill,
    "`record_stage_review_report` creates the canonical `animation_report.json` and binds it to current project serialization plus hashes of hierarchy, pivot, and neutral-pose evidence. Do not write a free-form PASS report manually.",
    "`record_stage_review_report` creates the canonical `animation_report.json` and binds it to current project serialization plus hashes of hierarchy, pivot, and neutral-pose evidence. Fresh `validate_reference_contract` also checks required clips, duration, animator/keyframe presence, referenced groups, and forbidden root motion before submission. Do not write a free-form PASS report manually.",
)

# ---------------------------------------------------------------------------
# Regression tests
# ---------------------------------------------------------------------------

write(
    "mcp-blockbench/tests/stage-quality.test.ts",
    r'''import { describe, expect, test } from "bun:test";
import {
  analyzeTexturePixels,
  evaluateAnimationQuality,
  evaluateGeometrySymmetry,
} from "../src/lib/stageQuality";

describe("deterministic stage quality", () => {
  test("rejects partial alpha and palette drift in a sharp-pixel texture", () => {
    const pixels = new Uint8ClampedArray([
      117, 107, 91, 255,
      255, 0, 255, 128,
    ]);
    const result = analyzeTexturePixels({
      width: 2,
      height: 1,
      data: pixels,
      contract: {
        anti_aliasing_allowed: false,
        maximum_partial_alpha_ratio: 0,
        palette_hex: ["#756B5B"],
        maximum_palette_distance: 24,
        maximum_palette_outlier_ratio: 0.1,
      },
    });
    expect(result.status).toBe("REVISION_REQUIRED");
    expect(result.issues.map((issue) => issue.code)).toContain(
      "TEXTURE_PARTIAL_ALPHA_FORBIDDEN"
    );
    expect(result.issues.map((issue) => issue.code)).toContain(
      "TEXTURE_PALETTE_DRIFT"
    );
  });

  test("accepts a compact approved palette texture", () => {
    const pixels = new Uint8ClampedArray([
      117, 107, 91, 255,
      81, 74, 64, 255,
    ]);
    const result = analyzeTexturePixels({
      width: 2,
      height: 1,
      data: pixels,
      contract: {
        anti_aliasing_allowed: false,
        palette_hex: ["#756B5B", "#514A40"],
        maximum_palette_distance: 8,
        maximum_palette_outlier_ratio: 0,
        maximum_unique_colors: 4,
      },
    });
    expect(result.status).toBe("PASS");
  });

  test("rejects missing keyframes, missing groups, and root motion", () => {
    const result = evaluateAnimationQuality({
      snapshots: [
        {
          name: "walk",
          length: 1,
          animator_count: 1,
          keyframe_count: 0,
          root_position_channels: 2,
        },
      ],
      requiredClips: ["walk"],
      existingGroups: ["body"],
      movingGroups: ["leg_left"],
      rootMotionAllowed: false,
    });
    expect(result.status).toBe("REVISION_REQUIRED");
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "ANIMATION_HAS_NO_KEYFRAMES",
        "ANIMATION_ROOT_MOTION_FORBIDDEN",
        "ANIMATION_GROUP_MISSING",
      ])
    );
  });

  test("enforces bilateral pairs and explicit asymmetric contracts", () => {
    const bilateral = evaluateGeometrySymmetry({
      policy: "BILATERAL",
      toleranceUnits: 0.1,
      pairs: [
        {
          id: "ears",
          left_patterns: ["ear_left"],
          right_patterns: ["ear_right"],
        },
      ],
      elements: [
        { name: "ear_left", center: [-2, 10, 0], size: [1, 2, 1] },
        { name: "ear_right", center: [2.5, 10, 0], size: [1, 2, 1] },
      ],
    });
    expect(bilateral.status).toBe("REVISION_REQUIRED");
    expect(bilateral.issues[0]?.code).toBe("SYMMETRY_PAIR_MISMATCH");

    const asymmetric = evaluateGeometrySymmetry({
      policy: "ASYMMETRIC",
      elements: [{ name: "left_satchel", center: [-3, 5, 0], size: [2, 2, 1] }],
      asymmetryContracts: [{ id: "satchel", patterns: ["left_satchel"] }],
    });
    expect(asymmetric.status).toBe("PASS");
  });
});
''',
)

write(
    "mcp-blockbench/tests/reference-segmentation.test.ts",
    r'''import { describe, expect, test } from "bun:test";
import { retainRelevantForeground } from "../src/server/tools/geometry-analyzer";
import type { BinaryMask } from "../src/lib/geometryProjection";

function mask(width: number, height: number, pixels: Array<[number, number]>): BinaryMask {
  const data = new Uint8Array(width * height);
  for (const [x, y] of pixels) data[y * width + x] = 1;
  return { width, height, data };
}

describe("Reference Visual foreground retention", () => {
  test("keeps a nearby detached silhouette detail but removes remote noise", () => {
    const body: Array<[number, number]> = [];
    for (let y = 4; y <= 10; y += 1) {
      for (let x = 4; x <= 11; x += 1) body.push([x, y]);
    }
    const horn: Array<[number, number]> = [
      [7, 1], [7, 2], [7, 3], [8, 2],
    ];
    const result = retainRelevantForeground(mask(20, 16, [...body, ...horn, [19, 15]]));
    expect(result.data[2 * 20 + 7]).toBe(1);
    expect(result.data[15 * 20 + 19]).toBe(0);
  });
});
''',
)

write(
    "mcp-blockbench/tests/reference-studio-canonical.test.ts",
    r'''import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("Reference Studio canonical handoff", () => {
  test("uses the current one-visual review submission tools", () => {
    const skill = read("../engines/chatgpt/skills/blockbench-reference-studio/SKILL.md");
    const handoff = read(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md"
    );
    for (const source of [skill, handoff]) {
      expect(source).toContain("inspect_reference_visual_preview");
      expect(source).toContain("record_geometry_visual_decision");
      expect(source).toContain("submit_geometry_for_review");
      expect(source).not.toContain("record_geometry_visual_result");
      expect(source).not.toContain("GEOMETRY_LOCAL_REPAIR");
      expect(source).not.toContain("GEOMETRY_VISUAL_REBUILD");
    }
    expect(handoff).not.toContain("01_<asset_id>");
    expect(handoff).not.toContain("Sheet 01");
  });
});
''',
)

# Update existing tests for stricter complete blueprint evaluation.
blueprint_test = "mcp-blockbench/tests/geometry-blueprint.test.ts"
replace_once(
    blueprint_test,
    """      elements,
      profile().part_constraints
    );""",
    """      elements,
      profile().part_constraints.filter(
        (constraint) =>
          Boolean(constraint.center_range_units || constraint.size_range_units)
      )
    );""",
)
replace_once(
    blueprint_test,
    """  test("built-in profile has five non-zero crops, critical regions, and rotation contracts", () => {""",
    """  test("validates transformed bounds, required counts, and parent contracts", () => {
    const result = evaluateGeometryBlueprint(
      [
        {
          name: "horn_front_base",
          parent_name: "head",
          world_corners: [
            [-1, 20, -4],
            [1, 24, 0],
          ],
        },
      ],
      [
        {
          id: "front_horn",
          role: "STRUCTURAL_DETAIL",
          name_patterns: ["horn_front"],
          parent: "head",
          minimum_elements: 2,
          maximum_elements: 3,
          visual_views: ["left_side"],
        },
      ]
    );
    expect(result.result).toBe("REVISION_REQUIRED");
    expect(result.issues[0]?.code).toContain("CONTRACT_MISMATCH");
  });

  test("built-in profile has five non-zero crops, critical regions, and rotation contracts", () => {""",
)

# Regression assertions for no reconnect, canonical profile, and compact extended surface.
stage_flow_test = "mcp-blockbench/tests/stage-flow-audit.test.ts"
replace_once(
    stage_flow_test,
    """    expect(routing).toContain('"reopen_stage_for_revision"');
    expect(routing).toContain("earlierThan");""",
    """    expect(routing).toContain('"reopen_stage_for_revision"');
    expect(routing).toContain("earlierThan");
    expect(routing).toContain("reconnect_required: false");
    expect(routing).not.toContain("reconnect_required: upstream");""",
)

visual_test = "mcp-blockbench/tests/visual-geometry-feedback.test.ts"
replace_once(
    visual_test,
    """    expect(analyzer).toContain("geometry_projection_region_v2");""",
    """    expect(analyzer).toContain("geometry_projection_region_v2");
    expect(analyzer).toContain('recommended_profile: "BEDROCK_CUBOID_GEOMETRY"');
    expect(analyzer).toContain("write_diff_image");
    expect(analyzer).not.toContain('recommendedScope === "MAJOR_FORM_REVISION"');""",
)

workflow_test = "mcp-blockbench/tests/workflow-tools.test.ts"
replace_once(
    workflow_test,
    """    expect(source).toContain("STAGE_EVIDENCE_MISSING");""",
    """    expect(source).toContain("STAGE_EVIDENCE_MISSING");
    expect(source).toContain("analyzeTexturePixels");
    expect(source).toContain("evaluateAnimationQuality");
    expect(source).not.toContain('GEOMETRY: "GEOMETRY_LOCAL_REPAIR"');""",
)

routing_test = "mcp-blockbench/tests/codex-model-routing.test.ts"
replace_once(
    routing_test,
    """    expect(policy).toContain("Full-access caveat");
    expect(policy).toContain("MCP allowlists");""",
    """    expect(policy).toContain("Full-access caveat");
    expect(policy).toContain("MCP allowlists");
    const contextRouting = read("src/server/stage-context-routing-guards.ts");
    expect(contextRouting).toContain("recommendedModelRoute");
    expect(contextRouting).toContain("SELECTED_TERRA_WRITER");
    expect(contextRouting).toContain("visual_escalation");""",
)

# Source-level guard against always-on unrelated registrations.
replace_once(
    "mcp-blockbench/tests/runtime-session-readiness.test.ts",
    """describe("runtime session readiness", () => {""",
    """describe("runtime session readiness", () => {
  test("keeps unrelated extended capabilities opt-in", () => {
    const source = require("node:fs").readFileSync("src/server/tools.ts", "utf8");
    expect(source).toContain('Settings.get("mcp_extended_capabilities") === true');
    expect(source).toContain("if (extendedCapabilitiesEnabled)");
  });""",
)

# Update OpenSpec/task record without declaring local acceptance complete.
tasks_path = "openspec/changes/codex-local-workflow-rework/tasks.md"
source = read(tasks_path)
anchor = "## Final local Blockbench acceptance — remaining on the workstation"
insert = """## Pre-acceptance hardening P0–P2

- [x] Remove legacy Reference Studio tool names and numbered-sheet handoff authority.
- [x] Keep upstream revisions in the same MCP/Codex session with no reconnect.
- [x] Return only the canonical Geometry profile plus internal revision scope.
- [x] Strengthen transformed part, count, parent, symmetry, Texture, and Animation quality enforcement.
- [x] Retain meaningful detached reference details during foreground segmentation.
- [x] Make unrelated extended capabilities opt-in and suppress routine diff image payloads.
- [x] Return deterministic model-route guidance from existing stage context without an extra routing call.

"""
if insert not in source:
    source = source.replace(anchor, insert + anchor)
write(tasks_path, source)

# Synchronization is performed by the one-time workflow after this patch.
print("Rework P0-P2 hardening patch applied.")

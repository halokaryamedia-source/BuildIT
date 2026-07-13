from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def read(path): return (ROOT/path).read_text(encoding='utf-8')
def write(path, content):
    p=ROOT/path; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content.rstrip()+"\n",encoding='utf-8')
def rep(path, old, new):
    s=read(path); c=s.count(old)
    if c!=1: raise RuntimeError(f'{path}: count {c} for {old[:80]!r}')
    write(path,s.replace(old,new,1))
def update_json(path, fn):
    v=json.loads(read(path)); fn(v); write(path,json.dumps(v,indent=2,ensure_ascii=False))

profiles='mcp-blockbench/src/lib/geometryReferenceProfiles.ts'
rep(profiles,'  | "left_side"\n  | "back"','  | "left_side"\n  | "right_side"\n  | "back"')
rep(profiles,'  panels: Record<StandardGeometryView, GeometryPanelProfile>;','  panels: Partial<Record<StandardGeometryView, GeometryPanelProfile>>;')
rep(profiles,'    panels: {} as Record<StandardGeometryView, GeometryPanelProfile>,','    panels: {} as Partial<Record<StandardGeometryView, GeometryPanelProfile>>,')
rep(profiles,'  const panels = { ...fallback.panels } as Record<\n    StandardGeometryView,\n    GeometryPanelProfile\n  >;','  const panels = { ...fallback.panels } as Partial<Record<\n    StandardGeometryView,\n    GeometryPanelProfile\n  >>;')
rep(profiles,'    "left_side",\n    "back",','    "left_side",\n    "right_side",\n    "back",')

projection='mcp-blockbench/src/lib/geometryProjection.ts'
rep(projection,'  if (view === "left_side") {\n    return {\n      right: scaleVector(front, -1),\n      up: worldUp,\n      camera_direction: scaleVector(right, -1),\n      perspective: false,\n    };\n  }','  if (view === "left_side") {\n    return {\n      right: scaleVector(front, -1),\n      up: worldUp,\n      camera_direction: scaleVector(right, -1),\n      perspective: false,\n    };\n  }\n  if (view === "right_side") {\n    return {\n      right: front,\n      up: worldUp,\n      camera_direction: right,\n      perspective: false,\n    };\n  }')

for path in ['mcp-blockbench/src/server/tools/geometry-analyzer.ts','mcp-blockbench/src/server/tools/geometry-feedback.ts','mcp-blockbench/src/server/tools/geometry-decision.ts','mcp-blockbench/src/server/tools/camera.ts']:
    rep(path,'  "left_side",\n  "back",','  "left_side",\n  "right_side",\n  "back",')
rep('mcp-blockbench/src/server/tools/geometry-analyzer.ts','    .max(5)\n    .optional()','    .max(6)\n    .optional()')
rep('mcp-blockbench/src/server/tools/geometry-feedback.ts','    .max(5)\n    .optional()','    .max(6)\n    .optional()')
rep('mcp-blockbench/src/server/tools/camera.ts','      .max(5)\n      .optional()','      .max(6)\n      .optional()')
rep('mcp-blockbench/src/server/tools/geometry-decision.ts','  views: z.array(standardViewEnum).min(1).max(5),','  views: z.array(standardViewEnum).min(1).max(6),')
rep('mcp-blockbench/src/server/tools/geometry-decision.ts','  compared_views: z.array(standardViewEnum).min(1).max(5),','  compared_views: z.array(standardViewEnum).min(1).max(6),')

feedback='mcp-blockbench/src/server/tools/geometry-feedback.ts'
rep(feedback,'  if (view === "left_side") return left;\n  if (view === "back")','  if (view === "left_side") return left;\n  if (view === "right_side") return scale(left, -1);\n  if (view === "back")')

camera='mcp-blockbench/src/server/tools/camera.ts'
rep(camera,'      "Captures clean rotation-aware standard views through the visual-feedback engine and writes canonical evidence names: <prefix>_front, _left, _back, _top, and _front_left_3_4.",','      "Captures clean rotation-aware standard views through the visual-feedback engine and writes canonical evidence names. Asymmetric assets may add the conditional right-side view.",')
rep(camera,'  if (view === "left_side") return "left";\n  if (view === "top_footprint")','  if (view === "left_side") return "left";\n  if (view === "right_side") return "right";\n  if (view === "top_footprint")')
rep(camera,'              left_side: "orthographic",\n              back:','              left_side: "orthographic",\n              right_side: "orthographic",\n              back:')

review='mcp-blockbench/src/server/tools/geometry-review-gate.ts'
rep(review,'const REQUIRED_VIEWS = [','const BASE_REQUIRED_VIEWS = [')
rep(review,'] as const;\n\nfunction joinPath','] as const;\n\nfunction requiredGeometryViews(manifest: Record<string, any> | null): string[] {\n  const views = [...BASE_REQUIRED_VIEWS];\n  if (String(manifest?.geometry?.symmetry_policy ?? "").toUpperCase() === "ASYMMETRIC") {\n    views.splice(2, 0, "right_side");\n  }\n  return views;\n}\n\nfunction evidenceFilename(view: string): string {\n  if (view === "left_side") return "geometry_left.png";\n  if (view === "right_side") return "geometry_right.png";\n  if (view === "top_footprint") return "geometry_top.png";\n  return `geometry_${view}.png`;\n}\n\nfunction joinPath')
static='''        const requiredViewPaths = [
          "geometry_front.png",
          "geometry_left.png",
          "geometry_back.png",
          "geometry_top.png",
          "geometry_front_left_3_4.png",
        ].map((filename) =>
          joinPath(session_root, `evidence/geometry/${filename}`)
        );
'''
rep(review,static,'')
block='''        if (require_standard_views) {
          for (const path of requiredViewPaths) {
            assertInsideRoot(path, session_root);
            if (!fs.existsSync(path)) {
              issues.push({
                code: "GEOMETRY_STANDARD_VIEW_MISSING",
                severity: "BLOCKER",
                message: `Missing required standard view: ${path}`,
              });
            }
          }
        }

'''
rep(review,block,'')
rep(review,'        const visualReport = fs.existsSync(visualReportPath)','        const requiredViews = requiredGeometryViews(manifest);\n        const requiredViewPaths = requiredViews.map((view) =>\n          joinPath(session_root, `evidence/geometry/${evidenceFilename(view)}`)\n        );\n        if (require_standard_views) {\n          for (const path of requiredViewPaths) {\n            assertInsideRoot(path, session_root);\n            if (!fs.existsSync(path)) {\n              issues.push({\n                code: "GEOMETRY_STANDARD_VIEW_MISSING",\n                severity: "BLOCKER",\n                message: `Missing required standard view: ${path}`,\n              });\n            }\n          }\n        }\n        const visualReport = fs.existsSync(visualReportPath)')
s=read(review)
for old in ['REQUIRED_VIEWS.filter', 'for (const view of REQUIRED_VIEWS)']:
    s=s.replace(old, old.replace('REQUIRED_VIEWS','requiredViews'))
if 'REQUIRED_VIEWS.filter' in s or 'for (const view of REQUIRED_VIEWS)' in s:
    raise RuntimeError('review required-view runtime replacement incomplete')
write(review,s)
rep(review,'complete five-view fixed-scale metrics','complete symmetry-aware fixed-scale metrics')

studio='engines/chatgpt/skills/blockbench-reference-studio/SKILL.md'
rep(studio,'- Left Side;\n- Front;','- Left Side;\n- Right Side when `symmetry_policy` is `ASYMMETRIC`;\n- Front;')
rep(studio,'For all five views record normalized `[x, y, width, height]` values in full-image `0..1` space. Every crop must:','For the five base views—and `right_side` whenever `symmetry_policy` is `ASYMMETRIC`—record normalized `[x, y, width, height]` values in full-image `0..1` space. Every required crop must:')
rep(studio,'9. all authorized rotations have contracts;\n10. `VALIDATION.md` starts','9. all authorized rotations have contracts;\n10. asymmetric assets include a measurable Right Side panel and crop;\n11. `VALIDATION.md` starts')
rep(studio,'11. handoff names the final MCP tools;\n12. final ZIP contains only approved package files.','12. handoff names the final MCP tools;\n13. final ZIP contains only approved package files.')

geomskill='engines/shared/skills/blockbench-geometry/SKILL.md'
rep(geomskill,'Final Geometry requires five current views, fixed-scale PASS, structural PASS, matching fingerprint/world signature/reference hash, safe rotations, and current visual acceptance.','Final Geometry requires the five base views plus conditional `right_side` evidence for asymmetric assets, fixed-scale PASS, structural PASS, matching fingerprint/world signature/reference hash, safe rotations, and current visual acceptance.')

def manifest(v):
    lock=v['reference_visual_lock']; lock['conditional_required_panels']={'ASYMMETRIC':['right_side']}
    vg=v['visual_grounding']; vg['conditional_final_views']={'ASYMMETRIC':['right_side']}
    panels=vg['panels']
    panels['right_side']={
        'crop_normalized':['<x>','<y>','<width_positive>','<height_positive>'],
        'projection':'orthographic','min_score':0.7,'scale_basis':'height','regions':[]
    }
update_json('engines/chatgpt/skills/blockbench-reference-studio/templates/reference_manifest.template.json',manifest)

def stage_profiles(value):
    camera = value.setdefault("camera", {})
    if "right_side" not in camera.get("orthographic_views", []):
        camera.setdefault("orthographic_views", []).insert(2, "right_side")
    if "right_side" not in camera.get("views", []):
        camera.setdefault("views", []).insert(2, "right_side")
    value.setdefault("geometry_visual_policy", {})["conditional_final_views"] = {
        "ASYMMETRIC": ["right_side"]
    }
    value.setdefault("profiles", {}).setdefault("GEOMETRY", {})[
        "conditional_required_evidence"
    ] = {"ASYMMETRIC": {"right_side": "evidence/geometry/geometry_right.png"}}
update_json("engines/shared/profiles/stage-profiles.json", stage_profiles)

evidence_path = "engines/shared/workflow/EVIDENCE_CONTRACT.md"
evidence = read(evidence_path)
if "geometry_right.png" not in evidence:
    evidence = evidence.replace(
        "geometry_left.png\ngeometry_back.png",
        "geometry_left.png\ngeometry_right.png  # required only when symmetry_policy = ASYMMETRIC\ngeometry_back.png",
        1,
    )
    evidence = evidence.replace(
        "Final canonical metrics must include all five standard views.",
        "Final canonical metrics must include all five base views. When `symmetry_policy` is `ASYMMETRIC`, `right_side` metrics, visual inspection, and `geometry_right.png` are additionally required.",
        1,
    )
    write(evidence_path, evidence)

tasks_path = "openspec/changes/codex-local-workflow-rework/tasks.md"
tasks = read(tasks_path)
needle = "- [x] Retain meaningful detached reference details during foreground segmentation."
addition = needle + "\n- [x] Require conditional Right Side visual evidence for explicitly asymmetric assets and cover multiple positive archetypes."
if "conditional Right Side visual evidence" not in tasks:
    if needle not in tasks:
        raise RuntimeError("tasks asymmetry insertion anchor missing")
    write(tasks_path, tasks.replace(needle, addition, 1))

write('mcp-blockbench/tests/asymmetric-geometry-flow.test.ts',r'''import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  maskBounds,
  projectElementsGeometry,
  type CoordinateEnvelope,
} from "../src/lib/geometryProjection";

const read = (path: string) => readFileSync(path, "utf8");
const envelope: CoordinateEnvelope = {
  x_min: -8,
  x_max: 8,
  y_min: 0,
  y_max: 24,
  z_min: -12,
  z_max: 12,
};

describe("asymmetric Geometry review support", () => {
  test("projects a distinct right-side silhouette on the same approved frame", () => {
    const elements = [
      {
        name: "body",
        uuid: "body",
        from: [-4, 0, -6],
        to: [4, 16, 6],
        origin: [0, 0, 0],
        rotation: [0, 0, 0],
        parent: "root",
      },
      {
        name: "left_satchel",
        uuid: "left_satchel",
        from: [-7, 5, -2],
        to: [-4, 11, 3],
        origin: [0, 0, 0],
        rotation: [0, 0, 0],
        parent: "root",
      },
    ];
    const common = {
      envelope,
      front_axis: "-z" as const,
      width: 128,
      height: 128,
      margin: 8,
    };
    const left = projectElementsGeometry(elements, { ...common, view: "left_side" });
    const right = projectElementsGeometry(elements, { ...common, view: "right_side" });
    expect(left.frame.scale).toBeCloseTo(right.frame.scale, 8);
    expect(maskBounds(left.mask)).not.toEqual(maskBounds(right.mask));
  });

  test("requires right-side evidence only for asymmetric manifests", () => {
    const gate = read("src/server/tools/geometry-review-gate.ts");
    const studio = read("../engines/chatgpt/skills/blockbench-reference-studio/SKILL.md");
    expect(gate).toContain('symmetry_policy');
    expect(gate).toContain('"right_side"');
    expect(gate).toContain('geometry_right.png');
    expect(studio).toContain('Right Side when `symmetry_policy` is `ASYMMETRIC`');
  });
});
''')

write('mcp-blockbench/tests/generic-archetype-matrix.test.ts',r'''import { describe, expect, test } from "bun:test";
import {
  analyzeTexturePixels,
  evaluateAnimationQuality,
  evaluateGeometrySymmetry,
} from "../src/lib/stageQuality";

describe("generic positive archetype matrix", () => {
  test("passes a symmetric prop contract", () => {
    const result = evaluateGeometrySymmetry({
      policy: "BILATERAL",
      toleranceUnits: 0.05,
      pairs: [{ id: "handles", left_patterns: ["handle_left"], right_patterns: ["handle_right"] }],
      elements: [
        { name: "handle_left", center: [-3, 5, 0], size: [1, 4, 1] },
        { name: "handle_right", center: [3, 5, 0], size: [1, 4, 1] },
      ],
    });
    expect(result.status).toBe("PASS");
  });

  test("passes an explicitly asymmetric equipment contract", () => {
    const result = evaluateGeometrySymmetry({
      policy: "ASYMMETRIC",
      asymmetryContracts: [{ id: "left_satchel", patterns: ["left_satchel"] }],
      elements: [{ name: "left_satchel", center: [-4, 6, 0], size: [3, 4, 2] }],
    });
    expect(result.status).toBe("PASS");
  });

  test("passes compact Texture and Animation quality contracts", () => {
    const texture = analyzeTexturePixels({
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([80, 72, 60, 255, 96, 86, 70, 255]),
      contract: {
        anti_aliasing_allowed: false,
        palette_hex: ["#50483C", "#605646"],
        maximum_palette_distance: 8,
        maximum_palette_outlier_ratio: 0,
        maximum_unique_colors: 4,
      },
    });
    const animation = evaluateAnimationQuality({
      snapshots: [{
        name: "idle",
        length: 1,
        animator_count: 2,
        keyframe_count: 4,
        root_position_channels: 0,
      }],
      requiredClips: ["idle"],
      existingGroups: ["body", "head"],
      movingGroups: ["head"],
      staticGroups: ["body"],
      rootMotionAllowed: false,
    });
    expect(texture.status).toBe("PASS");
    expect(animation.status).toBe("PASS");
  });
});
''')

p='mcp-blockbench/tests/geometry-projection.test.ts'
s=read(p)
insert='''
  test("right-side projection uses the same fixed scale", () => {
    const elements = [{
      name: "asymmetric", uuid: "asymmetric", from: [-7, 0, -5], to: [4, 18, 7],
      origin: [0, 0, 0], rotation: [0, 0, 0], parent: "root",
    }];
    const left = projectElementsGeometry(elements, input);
    const right = projectElementsGeometry(elements, { ...input, view: "right_side" });
    expect(right.frame.scale).toBeCloseTo(left.frame.scale, 8);
    expect(Array.from(right.mask.data)).not.toEqual(Array.from(left.mask.data));
  });
'''
pos=s.rfind('\n});')
if pos<0: raise RuntimeError('projection test close missing')
write(p,s[:pos]+insert+s[pos:])

print('asymmetry patch applied')

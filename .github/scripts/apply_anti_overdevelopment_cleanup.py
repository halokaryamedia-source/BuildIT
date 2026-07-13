from __future__ import annotations

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
        raise RuntimeError(f"{path}: expected one replacement, found {count}: {old[:100]!r}")
    write(path, source.replace(old, new, 1))


# ---------------------------------------------------------------------------
# 1. Manifest-only Geometry authority. Remove asset-specific runtime fallback.
# ---------------------------------------------------------------------------
profile_path = "mcp-blockbench/src/lib/geometryReferenceProfiles.ts"
profile_source = read(profile_path)
marker = "const GOLDEN_SAMPLE_SHA ="
if marker not in profile_source:
    raise RuntimeError("Golden Sample fallback marker was not found.")
prefix = profile_source.split(marker, 1)[0].rstrip()
manifest_only = r'''

export function mergeGeometryReferenceProfile(input: {
  referenceSha256?: string | null;
  visualGrounding?: ManifestVisualGrounding | null;
  geometry?: ManifestGeometryProfile | null;
}): GeometryReferenceProfile | null {
  const manifestPanels = input.visualGrounding?.panels ?? {};
  if (Object.keys(manifestPanels).length === 0) return null;

  const panels: Partial<Record<StandardGeometryView, GeometryPanelProfile>> = {};
  for (const view of [
    "front",
    "left_side",
    "right_side",
    "back",
    "top_footprint",
    "front_left_3_4",
  ] as StandardGeometryView[]) {
    const panel = manifestPanels[view];
    if (!panel?.crop_normalized) continue;
    panels[view] = {
      crop_normalized: panel.crop_normalized,
      projection:
        panel.projection ??
        (view === "front_left_3_4" ? "perspective" : "orthographic"),
      minimum_score: panel.min_score ?? 0.7,
      scale_basis:
        panel.scale_basis ?? (view === "top_footprint" ? "depth" : "height"),
      regions: panel.regions ?? [],
    };
  }

  return {
    reference_sha256: input.referenceSha256 ?? "",
    canvas_size: input.visualGrounding?.camera_lock?.canvas_size ?? 256,
    margin_pixels: input.visualGrounding?.camera_lock?.margin_pixels ?? 18,
    front_axis: input.visualGrounding?.camera_lock?.front_axis ?? "-z",
    panels,
    rotation_contracts: input.geometry?.rotation_contracts ?? {},
    part_constraints: input.geometry?.part_constraints ?? [],
  };
}
'''
write(profile_path, prefix + manifest_only)

# Replace the one Golden Sample fallback synchronization test with a manifest-only test.
test_path = "mcp-blockbench/tests/reference-studio-sync.test.ts"
test_source = read(test_path)
test_source = test_source.replace(
    'import { builtInGeometryProfile } from "../src/lib/geometryReferenceProfiles";',
    'import { mergeGeometryReferenceProfile } from "../src/lib/geometryReferenceProfiles";',
)
test_source = re.sub(
    r'const GOLDEN_SHA =\n\s*"[a-f0-9]{64}";\n',
    "",
    test_source,
    count=1,
)
start = test_source.find(
    '  test("matches the manifest visual profile to the runtime Golden Sample fallback"'
)
end = test_source.find(
    '  test("removes the final stale reconnect instruction from production skills"',
    start,
)
if start < 0 or end < 0:
    raise RuntimeError("Unable to locate the Golden Sample fallback test block.")
replacement = r'''  test("uses the manifest as the only executable Golden Sample geometry authority", () => {
    const manifest = json(
      "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"
    );
    const profile = mergeGeometryReferenceProfile({
      referenceSha256: manifest.reference_visual_lock.sha256,
      visualGrounding: manifest.visual_grounding,
      geometry: manifest.geometry,
    });
    expect(profile).not.toBeNull();
    expect(Object.keys(profile!.panels).sort()).toEqual(baseViews.slice().sort());
    expect(Object.keys(profile!.rotation_contracts).sort()).toEqual(
      Object.keys(manifest.geometry.rotation_contracts).sort()
    );
    expect(profile!.part_constraints.map((part) => part.id)).toEqual(
      manifest.geometry.part_constraints.map((part: any) => part.id)
    );

    const source = read("src/lib/geometryReferenceProfiles.ts");
    expect(source).not.toContain("BLACK_RHINO_PROFILE");
    expect(source).not.toContain("GOLDEN_SAMPLE_SHA");
    expect(source).not.toContain("builtInGeometryProfile");
  });

'''
test_source = test_source[:start] + replacement + test_source[end:]
write(test_path, test_source)

# ---------------------------------------------------------------------------
# 2. Keep stage context compact: do not duplicate the entire visual manifest.
# ---------------------------------------------------------------------------
stage_context = "mcp-blockbench/src/server/tools/stage-context.ts"
source = read(stage_context)
legacy_pattern = re.compile(
    r'''\s+legacy_context_policy:\s*\{.*?\n\s+\},\n\s+reference_visual:''',
    re.S,
)
source, count = legacy_pattern.subn(
    '''\n          legacy_context_policy: {\n            conflict_code: "LEGACY_SKILL_CONFLICT",\n            active_conflict: false,\n          },\n          reference_visual:''',
    source,
    count=1,
)
if count != 1:
    raise RuntimeError(f"Unable to compact legacy context policy: {count}")

visual_pattern = re.compile(
    r'''\s+visual_grounding:\s*\{\n\s+\.\.\.\(manifest\.visual_grounding \?\? \{\}\),.*?\n\s+\},\n\s+\};''',
    re.S,
)
visual_replacement = r'''
          visual_grounding: {
            required: stage === "GEOMETRY",
            geometry_profile: "BEDROCK_CUBOID_GEOMETRY",
            symmetry_policy: manifest.geometry?.symmetry_policy ?? null,
            base_required_views:
              manifest.validation?.base_required_views ??
              manifest.visual_grounding?.final_views ??
              [],
            conditional_required_views:
              manifest.validation?.conditional_required_views ??
              manifest.visual_grounding?.conditional_final_views ??
              {},
            reference_sha256: manifest.reference_visual_lock?.sha256 ?? null,
            fixed_scale_required: true,
            free_rescale_forbidden: true,
            deterministic_guard_required: true,
            contract_source: "references/reference_manifest.json",
          },
        };'''
source, count = visual_pattern.subn(visual_replacement, source, count=1)
if count != 1:
    raise RuntimeError(f"Unable to compact visual grounding payload: {count}")
write(stage_context, source)

# Permanent regression test for manifest-only authority and compact context.
write(
    "mcp-blockbench/tests/anti-overdevelopment.test.ts",
    r'''import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { mergeGeometryReferenceProfile } from "../src/lib/geometryReferenceProfiles";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

describe("anti-overdevelopment invariants", () => {
  test("uses manifest-only geometry contracts without an asset-specific fallback", () => {
    const source = read("src/lib/geometryReferenceProfiles.ts");
    expect(source).not.toContain("BLACK_RHINO_PROFILE");
    expect(source).not.toContain("GOLDEN_SAMPLE_SHA");
    expect(source).not.toContain("builtInGeometryProfile");

    const manifest = json(
      "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"
    );
    const profile = mergeGeometryReferenceProfile({
      referenceSha256: manifest.reference_visual_lock.sha256,
      visualGrounding: manifest.visual_grounding,
      geometry: manifest.geometry,
    });
    expect(profile).not.toBeNull();
    expect(Object.keys(profile!.panels).length).toBe(5);
    expect(profile!.part_constraints.length).toBeGreaterThan(0);
    expect(Object.keys(profile!.rotation_contracts).length).toBeGreaterThan(0);
  });

  test("does not duplicate the full visual grounding manifest in stage context", () => {
    const source = read("src/server/tools/stage-context.ts");
    expect(source).not.toContain("...(manifest.visual_grounding ?? {})");
    expect(source).toContain('contract_source: "references/reference_manifest.json"');
    expect(source).toContain("base_required_views");
    expect(source).toContain("conditional_required_views");
    expect(source).toContain('conflict_code: "LEGACY_SKILL_CONFLICT"');
    expect(source).not.toContain("01_<asset_id>_form_scale_reference.png");
  });

  test("freezes speculative pre-local expansion until measured runtime evidence exists", () => {
    const ponytail = read(
      "../openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
    );
    const tasks = read(
      "../openspec/changes/codex-local-workflow-rework/tasks.md"
    );
    expect(ponytail).toContain("Pre-local optimization freeze");
    expect(ponytail).toContain("measured local acceptance evidence");
    expect(tasks).toContain("Optional role discovery is non-blocking");
  });
});
''',
)

# ---------------------------------------------------------------------------
# 3. Lazy optional-role discovery and a pre-local optimization freeze.
# ---------------------------------------------------------------------------
bootstrap = "engines/codex/BOOTSTRAP.md"
bootstrap_source = read(bootstrap)
bootstrap_source = re.sub(
    r'''## Routing preflight without user interruption\n.*?\n## Model routing''',
    '''## Lazy optional-role routing\n\nDo not enumerate or test every optional role at startup. Start with the Terra parent and the canonical Blockbench MCP connection. Attempt `routine_auditor`, `mcp_builder`, `visual_director`, or `critical_reviewer` only when the deterministic route actually requires that role.\n\nIf the required optional role is unavailable, record `CODEX_PROJECT_CONFIG_NOT_LOADED` at that moment and use the documented current-session fallback. Optional role discovery is non-blocking and never requires another Codex session.\n\n## Model routing''',
    bootstrap_source,
    count=1,
    flags=re.S,
)
write(bootstrap, bootstrap_source)

routing = "engines/codex/MODEL_ROUTING.md"
routing_source = read(routing)
routing_source = re.sub(
    r'''## Preflight without restart\n.*?\n## Defaults and limits''',
    '''## Lazy role discovery\n\nDo not spend startup work enumerating optional agents. The Terra parent begins directly. Resolve an optional role only when a task is classified for that route. Missing roles produce `CODEX_PROJECT_CONFIG_NOT_LOADED` and use the current-session fallback; they are not readiness blockers.\n\n## Defaults and limits''',
    routing_source,
    count=1,
    flags=re.S,
)
write(routing, routing_source)

ponytail = "openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
ponytail_source = read(ponytail).rstrip()
if "## Pre-local optimization freeze" not in ponytail_source:
    ponytail_source += r'''

## Pre-local optimization freeze

After manifest-only authority and compact-context cleanup, do not add or merge another runtime tool, model role, profile, review gate, evidence type, or checkpoint class before the local acceptance run unless it fixes a reproducible P0 blocker or removes a proven duplicate authority.

Further optimization requires measured local acceptance evidence: actual MCP call count, stage-context response bytes, model-route usage, correction cycles, image payload bytes, checkpoint sizes, and elapsed stage time. A theoretical micro-optimization without those measurements is `DEFERRED_NOT_REQUIRED`.
'''
write(ponytail, ponytail_source)

tasks = "openspec/changes/codex-local-workflow-rework/tasks.md"
tasks_source = read(tasks)
tasks_source = tasks_source.replace(
    "- [ ] Confirm all four custom agents are discovered with the intended models and efforts.",
    "- [ ] Optional role discovery is non-blocking; record which roles are available, but do not fail acceptance when the documented parent fallback works.",
)
insert_marker = "## Final local Blockbench acceptance — remaining on the workstation"
if "Remove the built-in Black Rhinoceros runtime fallback" not in tasks_source:
    tasks_source = tasks_source.replace(
        insert_marker,
        "- [x] Remove the built-in Black Rhinoceros runtime fallback so the imported manifest is the only executable Geometry authority.\n- [x] Compact stage context by removing duplicated visual-grounding payloads and static legacy marker lists.\n- [x] Make optional model-role discovery lazy and non-blocking.\n- [x] Freeze speculative pre-local expansion until measured local evidence exists.\n\n" + insert_marker,
        1,
    )
write(tasks, tasks_source)

print("Applied anti-overdevelopment cleanup.")

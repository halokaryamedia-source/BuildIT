from pathlib import Path

root = Path(__file__).resolve().parents[2]
path = Path(__file__).with_name("apply_anti_overdevelopment_cleanup.py")
source = path.read_text(encoding="utf-8")
old = '''# Replace the one Golden Sample fallback synchronization test with a manifest-only test.
test_path = "mcp-blockbench/tests/reference-studio-sync.test.ts"
test_source = read(test_path)
'''
new = '''# Replace the one Golden Sample fallback synchronization test with a manifest-only test.
test_candidates = []
for candidate in (ROOT / "mcp-blockbench/tests").glob("*.test.ts"):
    candidate_source = candidate.read_text(encoding="utf-8")
    if "matches the manifest visual profile to the runtime Golden Sample fallback" in candidate_source:
        test_candidates.append(candidate)
if len(test_candidates) != 1:
    raise RuntimeError(
        f"Expected one Golden Sample fallback test file, found {len(test_candidates)}: {test_candidates}"
    )
test_path = str(test_candidates[0].relative_to(ROOT))
test_source = read(test_path)
'''
if source.count(old) != 1:
    raise RuntimeError(f"Expected one fixed regression-test path block, found {source.count(old)}")
path.write_text(source.replace(old, new, 1), encoding="utf-8")

blueprint = root / "mcp-blockbench/tests/geometry-blueprint.test.ts"
blueprint_source = blueprint.read_text(encoding="utf-8")
blueprint_source = blueprint_source.replace(
    'import { builtInGeometryProfile } from "../src/lib/geometryReferenceProfiles";',
    'import { mergeGeometryReferenceProfile } from "../src/lib/geometryReferenceProfiles";',
)
old_profile = '''const GOLDEN_SAMPLE_SHA =
  "fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f";

function profile() {
  const value = builtInGeometryProfile(GOLDEN_SAMPLE_SHA);
  if (!value) throw new Error("Black Rhinoceros built-in profile is missing.");
  return value;
}
'''
new_profile = '''const goldenManifest = JSON.parse(
  readFileSync(
    "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json",
    "utf8"
  )
) as Record<string, any>;

function profile() {
  const value = mergeGeometryReferenceProfile({
    referenceSha256: goldenManifest.reference_visual_lock.sha256,
    visualGrounding: goldenManifest.visual_grounding,
    geometry: goldenManifest.geometry,
  });
  if (!value) throw new Error("Black Rhinoceros manifest profile is missing.");
  return value;
}
'''
if blueprint_source.count(old_profile) != 1:
    raise RuntimeError(
        f"Expected one Geometry blueprint built-in profile block, found {blueprint_source.count(old_profile)}"
    )
blueprint_source = blueprint_source.replace(old_profile, new_profile, 1)
blueprint_source = blueprint_source.replace(
    'test("built-in profile has five non-zero crops, critical regions, and rotation contracts"',
    'test("manifest profile has five non-zero crops, critical regions, and rotation contracts"',
    1,
)
blueprint_source = blueprint_source.replace(
    "Missing built-in panel:",
    "Missing manifest panel:",
)
blueprint.write_text(blueprint_source, encoding="utf-8")

print("Patched cleanup and Geometry blueprint tests to use manifest-only authority.")

from pathlib import Path

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
print(f"Patched cleanup script to resolve the regression test by content.")

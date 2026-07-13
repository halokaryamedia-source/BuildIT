from pathlib import Path

path = Path(__file__).with_name("apply_local_geometry_recovery.py")
source = path.read_text(encoding="utf-8")

old_one = '''function canonicalProjectPath(sessionRoot: string, assetId: string): string {
  const activeRoot = parentDirectory(sessionRoot);
  const separator = sessionRoot.includes("\\\\") && !sessionRoot.includes("/") ? "\\\\" : "/";
  return `${activeRoot}${separator}blockbench${separator}${assetId}.bbmodel`;
}'''
new_one = '''function canonicalProjectPath(sessionRoot: string, assetId: string): string {
  const activeRoot = parentDirectory(sessionRoot);
  if (!activeRoot) {
    throw new Error(`CANONICAL_SESSION_ROOT_INVALID: ${sessionRoot}`);
  }
  const separator = sessionRoot.includes("\\\\") && !sessionRoot.includes("/") ? "\\\\" : "/";
  return `${activeRoot}${separator}blockbench${separator}${assetId}.bbmodel`;
}'''

old_two = '''        const activeRoot = parentDirectory(session_root);
        const canonicalPath = joinPath(
          activeRoot,
          `blockbench/${asset_id}.bbmodel`
        );'''
new_two = '''        const activeRoot = parentDirectory(session_root);
        if (!activeRoot) {
          throw new Error(`CANONICAL_SESSION_ROOT_INVALID: ${session_root}`);
        }
        const canonicalPath = joinPath(
          activeRoot,
          `blockbench/${asset_id}.bbmodel`
        );'''

for old, new, label in [
    (old_one, new_one, "canonicalProjectPath"),
    (old_two, new_two, "save_canonical_project"),
]:
    if source.count(old) != 1:
        raise RuntimeError(f"Expected one {label} block, found {source.count(old)}")
    source = source.replace(old, new, 1)

path.write_text(source, encoding="utf-8")
print("Patched canonical session parent guards.")

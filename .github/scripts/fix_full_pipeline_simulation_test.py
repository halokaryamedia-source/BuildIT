from pathlib import Path

path = Path("mcp-blockbench/tests/giraffe-full-pipeline-simulation.test.ts")
text = path.read_text(encoding="utf-8")
old = '''    expect(resolveApprovedStageTransition("GEOMETRY", true)).toMatchObject({
      nextState: "TEXTURE_IN_PROGRESS",
      nextStage: "TEXTURE",
      reconnect_required: undefined,
    });'''
new = '''    const geometryTransition = resolveApprovedStageTransition("GEOMETRY", true);
    expect(geometryTransition).toMatchObject({
      nextState: "TEXTURE_IN_PROGRESS",
      nextStage: "TEXTURE",
      nextProfile: "BEDROCK_CUBOID_TEXTURE",
    });
    expect("reconnect_required" in geometryTransition).toBe(false);'''
if text.count(old) != 1:
    raise RuntimeError(f"Expected one obsolete transition assertion, found {text.count(old)}")
path.write_text(text.replace(old, new, 1), encoding="utf-8")
print("Fixed full-pipeline transition assertion.")

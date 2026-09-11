import { describe, expect, test } from "bun:test";

const source = await Bun.file(
  new URL("../server/runtime/consolidatedTools.ts", import.meta.url)
).text();

describe("Consolidated capability validation preservation", () => {
  test("animation timeline branches reuse canonical executor schemas", () => {
    for (const signature of [
      'withToolBranch(manageKeyframesParameters, "operation", "keyframes")',
      'withToolBranch(animationGraphEditorParameters, "operation", "graph")',
      'withToolBranch(animationTimelineParameters, "operation", "timeline")',
      'withToolBranch(batchKeyframeOperationsParameters, "operation", "batch")',
      'withToolBranch(animationCopyPasteParameters, "operation", "copy_paste")',
    ]) {
      expect(source).toContain(signature);
    }
  });

  test("animation consolidation does not rebuild executor schemas with intersections", () => {
    expect(source).not.toContain('manageKeyframesParameters.and(');
    expect(source).not.toContain('animationGraphEditorParameters.and(');
    expect(source).not.toContain('animationTimelineParameters.and(');
    expect(source).not.toContain('batchKeyframeOperationsParameters.and(');
    expect(source).not.toContain('animationCopyPasteParameters.and(');
  });
});

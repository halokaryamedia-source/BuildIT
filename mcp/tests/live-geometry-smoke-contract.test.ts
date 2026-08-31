import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("live Geometry E2E verifier source contract", () => {
  test("requires explicit disposable consent and preserves proof boundaries", async () => {
    const [script, packageText] = await Promise.all([
      source("scripts/verify-geometry-live.ts"),
      source("package.json"),
    ]);
    const scripts = JSON.parse(packageText).scripts as Record<string, string>;

    expect(scripts["verify:geometry-live"]).toBe(
      "bun run ./scripts/verify-geometry-live.ts"
    );
    expect(script).toContain("--confirm-disposable");
    expect(script).toContain("requireDisposableConsent();");
    expect(script).toContain("discard_unsaved: true");
    expect(script).toContain('const EXPECTED_PHASE = "geometry"');
    expect(script).toContain("build_identity");
    expect(script).toContain("ACTIVE PHASE: GEOMETRY");
    expect(script).toContain('visual_quality: "not_evaluated"');
    expect(script).toContain(
      "This proves live mutation/readback/render/Undo/Redo behavior, not reference fidelity or accepted model quality."
    );

    expect(script).not.toContain("risky_eval");
    expect(script).not.toMatch(/similarity[_ -]?score/i);
    expect(script).not.toMatch(/set.*authoring.*phase/i);
  });

  test("runs a bounded create-readback-render-mutate-undo-redo sequence", async () => {
    const script = await source("scripts/verify-geometry-live.ts");

    const consent = script.indexOf("requireDisposableConsent();");
    const preflight = script.indexOf("await preflight();", consent);
    const createProject = script.indexOf('callTool("create_project"', preflight);
    const addGroup = script.indexOf('callTool("add_group"', createProject);
    const placeCube = script.indexOf('callTool("place_cube"', addGroup);
    const firstInspect = script.indexOf("await inspectCube(cubeUuid)", placeCube);
    const firstCapture = script.indexOf("await captureFront()", firstInspect);
    const modify = script.indexOf('callTool("modify_cube"', firstCapture);
    const secondInspect = script.indexOf("await inspectCube(cubeUuid)", modify);
    const secondCapture = script.indexOf("await captureFront()", secondInspect);
    const undo = script.indexOf('callTool("undo"', secondCapture);
    const redo = script.indexOf('callTool("redo"', undo);

    const ordered = [
      consent,
      preflight,
      createProject,
      addGroup,
      placeCube,
      firstInspect,
      firstCapture,
      modify,
      secondInspect,
      secondCapture,
      undo,
      redo,
    ];
    let previous = -1;
    for (const index of ordered) {
      expect(index).toBeGreaterThan(previous);
      previous = index;
    }

    expect(script).toContain("beforeImage.data !== afterImage.data");
    expect(script).toContain('mode: "explicit"');
    expect(script).toContain("Undo did not restore Cube geometry");
    expect(script).toContain("Redo did not restore modified Cube geometry");
  });
});

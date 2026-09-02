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
    expect(script).toContain('expectedPhase: "geometry"');
    expect(script).toContain("build_identity");
    expect(script).toContain('expectedPhase: "geometry"');
    expect(script).toContain('visual_quality: "not_evaluated"');
    expect(script).toContain(
      "Runtime/readback/render/history proof is not reference-fidelity proof."
    );

    expect(script).not.toContain("risky_eval");
    expect(script).not.toMatch(/similarity[_ -]?score/i);
    expect(script).not.toMatch(/set.*authoring.*phase/i);
  });

  test("runs a bounded create-readback-render-mutate-undo-redo sequence", async () => {
    const script = await source("scripts/verify-geometry-live.ts");

    const consent = script.indexOf("requireDisposableConsent();");
    const preflight = script.indexOf("await client.preflight();", consent);
    const createProject = script.indexOf('"create_project",', preflight);
    const addGroup = script.indexOf('"add_group",', createProject);
    const placeCube = script.indexOf('"place_cube",', addGroup);
    const firstInspect = script.indexOf("await inspectCube(client, cubeUuid)", placeCube);
    const firstCapture = script.indexOf("await captureFront(client)", firstInspect);
    const modify = script.indexOf('"modify_cube",', firstCapture);
    const secondInspect = script.indexOf("await inspectCube(client, cubeUuid)", modify);
    const secondCapture = script.indexOf("await captureFront(client)", secondInspect);
    const undo = script.indexOf(
      'await client.callTool("undo"',
      secondCapture
    );
    const redo = script.indexOf('await client.callTool("redo"', undo);

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

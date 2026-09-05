import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("live authoring E2E harness", () => {
  test("shared client owns freshness, phase proof, surface proof, and observable cost", async () => {
    const helper = await source("scripts/live-e2e-common.ts");
    for (const contract of [
      "build_identity",
      "ACTIVE STAGE",
      "tools/list",
      "mutation_calls",
      "inspection_calls",
      "evidence_calls",
      "history_calls",
      "request_bytes",
      "response_bytes",
      "not model tokens",
    ]) {
      expect(helper).toContain(contract);
    }
    expect(helper).toContain("Stale installed BlockIT build");
    expect(helper).toContain("--confirm-disposable");
  });

  test("Geometry produces one reusable disposable fixture and runtime cost receipt", async () => {
    const geometry = await source("scripts/verify-geometry-live.ts");
    for (const tool of [
      "create_project",
      "add_group",
      "place_cube",
      "modify_cube",
      "inspect_element",
      "capture_model_views",
      "undo",
      "redo",
    ]) {
      expect(geometry).toContain(tool);
    }
    expect(geometry).toContain("AUTHORING_E2E_PROJECT_NAME");
    expect(geometry).toContain("AUTHORING_E2E_BONE_NAME");
    expect(geometry).toContain("shared Texturing/Animation fixture");
    expect(geometry).toContain("client.snapshotMetrics()");
  });

  test("Texturing proves one batched paint mutation through exact atlas hashes and history", async () => {
    const texturing = await source("scripts/verify-texturing-live.ts");
    for (const contract of [
      "create_texture",
      "get_texture",
      "paint_with_brush",
      "connect_strokes: false",
      "imageDigest",
      "undo",
      "redo",
      "exact full-atlas PNG",
    ]) {
      expect(texturing).toContain(contract);
    }
    expect(texturing).not.toContain("capture_model_views");
    expect(texturing).not.toContain("place_cube");
    expect(texturing).toContain("client.snapshotMetrics()");
  });

  test("Animation proves a coherent multi-key edit through exact inspection and one history step", async () => {
    const animation = await source("scripts/verify-animation-live.ts");
    for (const contract of [
      "create_animation",
      "inspect_animation",
      "manage_keyframes",
      "batch_keyframe_operations",
      "edited_keyframe_count: 2",
      "undo",
      "redo",
      "client.snapshotMetrics()",
    ]) {
      expect(animation).toContain(contract);
    }
    expect(animation).not.toContain("add_group");
    expect(animation).not.toContain("place_cube");
    expect(animation).toContain("AUTHORING_E2E_BONE_NAME");
  });

  test("package exposes phase-specific live verification without an automatic phase-switch orchestrator", async () => {
    const pkg = JSON.parse(await source("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts["verify:geometry-live"]).toBe(
      "bun run ./scripts/verify-geometry-live.ts"
    );
    expect(pkg.scripts["verify:texturing-live"]).toBe(
      "bun run ./scripts/verify-texturing-live.ts"
    );
    expect(pkg.scripts["verify:animation-live"]).toBe(
      "bun run ./scripts/verify-animation-live.ts"
    );
    expect(pkg.scripts["verify:authoring-live"]).toBeUndefined();
  });
});

import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Lift quality live evidence contract", () => {
  test("refuses the canonical Lift and pins the disposable copy plus approved references", async () => {
    const [script, helper] = await Promise.all([
      source("scripts/verify-lift-quality-live.ts"),
      source("scripts/live-e2e-common.ts"),
    ]);
    expect(script).toContain("BLOCKIT_LIFT_DISPOSABLE_PATH");
    expect(script).toContain("workspace/active/lift/lift.bbmodel");
    expect(script).toContain("refuses the canonical workspace/active/lift/lift.bbmodel");
    expect(script).toContain("approved-reference.png");
    expect(script).toContain("window-detail.png");
    expect(script).toContain("project.save_path === disposablePath");
    expect(script).toContain("requireDisposableConsent(args)");
    expect(helper).toContain("--confirm-disposable");
  });

  test("captures comparable Lift evidence around one native padded repack and restores original state", async () => {
    const script = await source("scripts/verify-lift-quality-live.ts");
    for (const contract of [
      "capture_model_views",
      '"front", "left", "front_left_3q"',
      "get_texture",
      "list_textures",
      "create_texture",
      'type: "template"',
      "pixel_density: 16",
      "power_of_two: true",
      "padding: true",
      "native_power_of_two_512_or_less",
      "candidate-atlas.png",
      "manifest.json",
      'await client.callTool("undo"',
      "original_restored_exactly_after_undo",
      'visual_quality: "UNVERIFIED"',
      "No similarity score or automatic visual PASS is produced.",
    ]) {
      expect(script).toContain(contract);
    }
    expect(script).not.toMatch(/visual_quality:\s*"PASS"/i);
    expect(script).not.toContain("workspace/active/lift/lift.bbmodel\",\n          overwrite");
  });

  test("package exposes the bounded Lift verifier as an explicit live command", async () => {
    const pkg = JSON.parse(await source("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts["verify:lift-quality-live"]).toBe(
      "bun run ./scripts/verify-lift-quality-live.ts"
    );
  });
});

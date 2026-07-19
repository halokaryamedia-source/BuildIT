import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("automatic workspace lifecycle", () => {
  test("create_project accepts the approved ChatGPT reference package", () => {
    const project = read("src/server/tools/project.ts");
    const bootstrap = read("src/lib/workspaceBootstrap.ts");
    for (const marker of [
      "reference_package_root",
      "workspace_root",
      "prepareWorkspaceFromReferencePackage",
      "manual_workspace_setup_required: false",
      "inspect_reference_visual_preview",
    ]) {
      expect(project).toContain(marker);
    }
    for (const marker of [
      "reference_manifest.json",
      "CHATGPT_REFERENCE_PACKAGE",
      "STABLE_PRODUCTION_UNION",
      "workspace.json",
      "copied_reference_images",
      "CREATE_PROJECT",
    ]) {
      expect(bootstrap).toContain(marker);
    }
  });

  test("final approval promotes output and completes the workspace automatically", () => {
    const source = read("src/server/automatic-workspace-finalization.ts");
    for (const marker of [
      "FINAL_VALIDATION",
      "WORKSPACE_COMPLETE",
      "automatic-workspace-finalization",
      "workspace_completion",
      "manual_workspace_completion_required: false",
      'lifecycle: "COMPLETED"',
      'path.join(workspaceRoot, "completed", input.assetId)',
    ]) {
      expect(source).toContain(marker);
    }
  });

  test("installs identity reconciliation and completion around the profile boundary", () => {
    const tools = read("src/server/tools.ts");
    expect(tools).toContain("installAutomaticProjectIdentityGuards();");
    expect(tools).toContain("installAutomaticWorkspaceFinalization();");
    expect(tools.indexOf("initializeToolProfiles();")).toBeLessThan(
      tools.indexOf("installAutomaticProjectIdentityGuards();")
    );
    expect(tools.indexOf("installAutomaticProjectIdentityGuards();")).toBeLessThan(
      tools.indexOf("installAutomaticWorkspaceFinalization();")
    );
  });
});

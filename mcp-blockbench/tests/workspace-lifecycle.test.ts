import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

describe("workspace lifecycle", () => {
  test("separates user-facing Blockbench assets from MCP internals", () => {
    const contract = read("../engines/shared/workspace/WORKSPACE_CONTRACT.md");
    for (const marker of [
      "blockbench/",
      "<asset_id>.bbmodel",
      "textures/",
      "references/",
      "previews/",
      "mcp/",
      "project.json",
      "state.json",
      "checkpoints/",
      "evidence/",
      "reports/",
    ]) {
      expect(contract).toContain(marker);
    }
    expect(contract).toContain("safe to copy alone");
  });

  test("uses one local index for active and completed projects", () => {
    const example = json("../workspace/workspace.example.json");
    expect(example.selected_asset_id).toBeNull();
    expect(example.projects).toEqual({});
    expect(existsSync("../workspace/active/.gitkeep")).toBe(true);
    expect(existsSync("../workspace/completed/.gitkeep")).toBe(true);
    expect(existsSync("../workspace/active-session.example.json")).toBe(false);
    expect(existsSync("../workspace/archive")).toBe(false);
  });

  test("provides one compact lifecycle command", () => {
    const packageJson = json("package.json");
    expect(packageJson.scripts.workspace).toContain("manage-workspace.ts");
    const source = read("../engines/shared/workspace/manage-workspace.ts");
    for (const command of [
      'command === "init"',
      'command === "list"',
      'command === "activate"',
      'command === "inspect"',
      'command === "complete"',
      'command === "reopen"',
    ]) {
      expect(source).toContain(command);
    }
  });

  test("completion promotes validated staging into the Blockbench package", () => {
    const source = read("../engines/shared/workspace/manage-workspace.ts");
    expect(source).toContain("stagedModel");
    expect(source).toContain("stagedTextures");
    expect(source).toContain("await promoteFinal(assetId)");
    expect(source).toContain('lifecycle: "COMPLETED"');
    expect(source).toContain("await replaceCompleted(active.root, completed.root)");
  });

  test("reopen preserves completed baseline and invalidates downstream stages", () => {
    const source = read("../engines/shared/workspace/manage-workspace.ts");
    expect(source).toContain("Completed baseline remains unchanged");
    expect(source).toContain('origin: "REOPENED"');
    expect(source).toContain('record.status = "REVALIDATION_REQUIRED"');
    expect(source).toContain("baseline_model_sha256");
  });

  test("Codex scripts resolve the selected active MCP root", () => {
    for (const path of [
      "../engines/codex/scripts/sync-local-stack.ps1",
      "../engines/codex/scripts/set-tool-profile.ps1",
    ]) {
      const source = read(path);
      expect(source).toContain("workspace\\workspace.json");
      expect(source).toContain("workspace\\active\\$Asset");
      expect(source).toContain('Join-Path $activeRoot "mcp"');
    }
  });
});

import { describe, expect, test } from "bun:test";
import { exportModelParameters } from "@/server/tools/export";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local asset-authoring usage slimming", () => {
  test("asset authoring bypasses repository-development boot and development-brief", async () => {
    const agents = await source("../AGENTS.md");
    expect(agents).toContain("### Asset Authoring");
    expect(agents).toContain("do not automatically load");
    expect(agents).toContain("Asset authoring is not software **Developing**");
    expect(agents).toContain("Do not route it through `development-brief`");
  });

  test("normal authoring skill stack remains compact while hard gates stay present", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    expect(orchestrator.length).toBeLessThan(8_000);
    expect(modelling.length).toBeLessThan(13_000);
    for (const required of [
      "Minimum Necessary Evidence",
      "FAIL / UNVERIFIED / PASS",
      "BLOCKED",
      "capture_model_views",
      "modify_cube",
      "export_model",
    ]) expect(orchestrator).toContain(required);
    for (const required of [
      "SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE",
      "difference-first",
      "FAIL",
      "UNVERIFIED",
      "PASS",
      "BLOCKED",
      "geometry_effect",
      "same causal correction direction has failed twice without new evidence",
    ]) expect(modelling.toLowerCase()).toContain(required.toLowerCase());
  });

  test("filesystem export omits large returned content by default but remains opt-in", () => {
    expect(exportModelParameters.parse({ path: "/tmp/model.json" }).max_content_length).toBeUndefined();
    expect(exportModelParameters.parse({}).max_content_length).toBeUndefined();
    expect(exportModelParameters.parse({ path: "/tmp/model.json", max_content_length: 500 }).max_content_length).toBe(500);
  });

  test("high-frequency read outputs use compact JSON and locator mutation does not require redundant read", async () => {
    const files = await Promise.all([
      source("server/tools/element-inspection.ts"),
      source("server/tools/project.ts"),
      source("server/tools/animation-inspection.ts"),
      source("server/tools/locators.ts"),
    ]);
    for (const text of files) expect(text).not.toContain("JSON.stringify(result, null, 2)");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    expect(orchestrator).toContain("Do not automatically re-read them with `inspect_element`");
  });

  test("capability architecture is unchanged", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const next = await source("../docs/knowledge/next-action.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("asset_authoring_profile");
    expect(next).toContain("MCP_ASSET_AUTHORING_USAGE_SLIMMING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");
    expect(next).toContain("LOCAL — reference-fidelity acceptance scenarios");
  });
});

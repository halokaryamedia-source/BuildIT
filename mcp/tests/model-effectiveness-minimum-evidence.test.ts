import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — minimum necessary evidence", () => {
  test("normal modelling avoids ritual calls while keeping validity gates", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [orchestrator, modelling, workflow]) {
      expect(text.toLowerCase()).toContain("minimum necessary evidence");
      expect(text.toLowerCase()).toContain("unverified");
    }
    expect(orchestrator).toContain("Do not inspect every newly placed Cube");
    expect(orchestrator).toContain("Do not capture after every mutation");
    expect(modelling).toContain("No per-Cube inspection ceremony");
    expect(modelling).toContain("No screenshot-per-mutation loop");
    expect(workflow).toContain("Do not inspect each newly placed Cube or capture after every mutation");
  });

  test("bounds, specialists, checkpoints and uncertainty are conditional rather than mandatory", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    expect(orchestrator).toContain("deferred spec loading after routing");
    expect(orchestrator).toContain("mutation count is not a checkpoint trigger");
    expect(orchestrator).toContain("Use `inspect_model_bounds` only when");
    expect(modelling).toContain("Otherwise skip the bounds call");
    expect(workflow).toContain("Otherwise skip it");
    expect(workflow).toContain("Do not spend additional calls trying to remove UNVERIFIED");
  });

  test("cleanup remains decision-layer only with no new efficiency profile or runtime mode", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("efficiency_mode");
    expect(profile).not.toContain("minimum_evidence");
  });

  test("CI modelling gates remain static proof rather than behavioral or visual proof", async () => {
    const validation = await source("../docs/foundation/validation-report.md");
    expect(validation).toContain("Fresh GitHub-Only Serialized Surface Proof");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
    expect(validation).toContain("Last completed canonical GitHub proof");
    expect(validation).toContain("runtime-usage improvement");
  });
});

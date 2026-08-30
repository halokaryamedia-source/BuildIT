import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — minimum necessary evidence", () => {
  test("domain judgement owns evidence policy while router owns state reuse", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [modelling, workflow]) {
      expect(text.toLowerCase()).toContain("minimum necessary evidence");
      expect(text.toLowerCase()).toContain("unverified");
    }

    expect(orchestrator).toContain("State Reuse / Anti-Loop");
    expect(orchestrator).toContain("Do not automatically re-read fresh mutation targets");
    expect(orchestrator).not.toContain("FAIL / UNVERIFIED / PASS");
    expect(orchestrator.toLowerCase()).not.toContain("difference-first");
    expect(modelling).toContain("No per-Cube inspection ceremony");
    expect(modelling).toContain("No screenshot-per-mutation loop");
    expect(workflow).toContain("Do not inspect every Cube, capture after every mutation");
  });

  test("bounds, discovery, and uncertainty remain conditional rather than mandatory", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    expect(orchestrator).toContain("deferred spec loading after routing");
    expect(orchestrator).toContain("inspect_model_bounds` only for envelope/scale/ground/displacement");
    expect(modelling).toContain("Otherwise skip the bounds call");
    expect(workflow).toContain("inspect_model_bounds` is only for envelope/scale/ground/displacement");
    expect(workflow).toContain("`UNVERIFIED` is not a retry command");
  });

  test("cleanup remains decision-layer only with no new efficiency profile", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("efficiency_mode");
    expect(profile).not.toContain("minimum_evidence");
  });
});

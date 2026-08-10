import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — minimum necessary evidence", () => {
  test("normal modelling avoids ritual calls while keeping validity gates", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const foundation = await source("../docs/foundation/03-modelling-workflow.md");

    for (const text of [orchestrator, modelling, workflow, foundation]) {
      expect(text.toLowerCase()).toContain("minimum necessary evidence");
      expect(text.toLowerCase()).toContain("unverified");
    }
    expect(orchestrator).toContain("Do not inspect every newly placed Cube");
    expect(orchestrator).toContain("Do not capture after every mutation");
    expect(modelling).toContain("No per-Cube inspection ceremony");
    expect(modelling).toContain("No screenshot-per-mutation loop");
    expect(workflow).toContain("Do not inspect each newly placed Cube or capture after every mutation");
    expect(foundation).toContain("no per-Cube inspect by default");
  });

  test("bounds, specialists, checkpoints and uncertainty are conditional rather than mandatory", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    expect(orchestrator).toContain("Load specialists lazily");
    expect(orchestrator).toContain("Mutation count alone is not a checkpoint trigger");
    expect(orchestrator).toContain("Use `inspect_model_bounds` only when");
    expect(modelling).toContain("Otherwise skip the bounds call");
    expect(workflow).toContain("Otherwise skip it");
    expect(workflow).toContain("Do not spend additional calls trying to remove UNVERIFIED");
  });

  test("cleanup remains decision-layer only with no new efficiency profile or runtime mode", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const next = await source("../docs/knowledge/next-action.md");

    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("efficiency_mode");
    expect(profile).not.toContain("minimum_evidence");
    expect(next).toContain("Minimum Necessary Evidence");
    expect(next).toContain("MCP_TOOL_EXPOSURE_WIRE_AUDIT_COMPLETE_LOCAL_DEFERRED_LOADING_PROOF_REQUIRED");
    expect(next).toContain("LOCAL — reference-fidelity acceptance scenarios");
  });

  test("CI modelling gates are explicitly contract proof, not behavioral or visual proof", async () => {
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");
    const next = await source("../docs/knowledge/next-action.md");

    expect(audit).toContain("Proof Taxonomy — Do Not Confuse Contract With Behaviour");
    expect(audit).toContain("contract proof");
    expect(audit).toContain("BEHAVIORAL MODELLING PROOF");
    expect(audit).toContain("REFERENCE-FIDELITY OUTCOME PROOF");
    expect(next).toContain("They are not behavioral proof that Codex follows the workflow");
    expect(next).toContain("not visual proof that a live model resembles its reference");
  });
});

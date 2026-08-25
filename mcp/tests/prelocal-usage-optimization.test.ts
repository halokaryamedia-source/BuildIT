import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local usage optimization contract", () => {
  test("repository work states the real contract before one coherent patch", async () => {
    const brief = await source("../.agents/skills/development-brief/SKILL.md");
    expect(brief).toContain("State the contract");
    expect(brief).toContain("Preflight regressions");
    expect(brief).toContain("Success Metric");
    expect(brief).toContain("Forbidden Proxy / Non-Goal");
    expect(brief).toContain("Implement one coherent patch");
  });

  test("known coherent creation batches without turning uncertainty into a call-saving target", async () => {
    const router = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    expect(router).toContain("place_cube(elements=[...])");
    expect(router).toContain("Known coherent Cubes");
    expect(router).toContain("uncertainty → no batch");
  });

  test("local correction verifies affected views before broader capture", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    expect(modelling).toContain("affected view(s) first");
    expect(modelling).toContain("expand only for material cross-view risk");
    expect(modelling).toContain("helps one view while materially regressing another is rejected");
  });

  test("authoring efficiency uses accepted quality plus observable runtime cost", async () => {
    const runbook = await source("../docs/knowledge/operations/local-acceptance-runbook.md");
    for (const marker of [
      "Authoring Efficiency", "Cost to Accepted Result", "QUALITY FAIL", "QUALITY PASS",
      "Discovery calls", "Redundant readbacks", "tool_search calls / misses",
      "Correction attempts", "Same-cause retries", "CONTRACT_CAUSED", "REASONING_CAUSED",
      "IMPROVED", "UNCHANGED", "REGRESSED",
    ]) expect(runbook).toContain(marker);
    expect(runbook).toContain("Static Footprint");
    expect(runbook).toContain("Do not invent token or latency numbers");
  });

  test("workspace resume persists meaningful state instead of mutation-count checkpoints", async () => {
    const [workspace, active, flow] = await Promise.all([
      source("../workspace/README.md"),
      source("../workspace/active/README.md"),
      source("../docs/knowledge/flow.md"),
    ]);
    expect(workspace).toContain("## Meaningful Persistence");
    expect(workspace).toContain("Do **not** save/checkpoint after every MCP mutation or capture");
    expect(workspace).toContain("Mutation count alone is not a checkpoint trigger");
    expect(workspace).toContain("Current handoff state");
    expect(active).toContain("Full workspace lifecycle and package rules live in `../README.md`");
    expect(flow).toContain("meaningful handoff/resume/park/completion boundaries");
  });

  test("prompt and tool surface stay evidence-gated rather than becoming an optimization profile", async () => {
    const [profile, prompts, next] = await Promise.all([
      source("lib/registrationProfile.ts"),
      source("server/prompts.ts"),
      source("../docs/knowledge/next-action.md"),
    ]);
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("usage_profile");
    expect(prompts).toContain('createPrompt("bedrock_entity_workflow"');
    expect(next).toContain("Authoring Efficiency");
    expect(next).toContain("Static Footprint");
    expect(next).toContain("Success Metric");
    expect(next).toContain("NO ACTIVE DEVELOPMENT");
  });

  test("durable foundation policy preserves minimum-evidence authoring", async () => {
    const [requirements, workflowPolicy, geometry, validation] = await Promise.all([
      source("../docs/foundation/02-product-requirements.md"),
      source("../docs/foundation/03-modelling-workflow.md"),
      source("../docs/foundation/05-geometry-standard.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);
    expect(requirements).toContain("Use `inspect_model_bounds` only when the numeric whole-model envelope materially matters");
    expect(workflowPolicy).toContain("`inspect_element` is a fallback for missing/stale exact target state");
    expect(geometry).toContain("Reuse fresh exact authored state already returned for the target when sufficient");
    expect(validation).toContain("Use `inspect_model_bounds` only when envelope/scale/ground/displacement materially affects the current decision");
  });
});

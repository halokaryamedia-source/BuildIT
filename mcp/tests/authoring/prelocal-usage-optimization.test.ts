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
    expect(router).toContain("manage_cubes(operation=create, elements=[...])");
    expect(router).toContain("Known coherent Cubes");
    expect(router).toContain("uncertainty → no batch");
  });

  test("local correction verifies affected views before broader capture", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    expect(modelling).toContain("affected view(s) first");
    expect(modelling).toContain("expand only for material cross-view risk");
    expect(modelling).toContain("helps one view while materially regressing another is rejected");
  });

  test("authoring efficiency requires accepted quality plus observable runtime cost", async () => {
    const runbook = await source("../docs/knowledge/operations/local-acceptance-runbook.md");
    const normalized = runbook.toLowerCase().replace(/\s+/g, " ");

    for (const concept of [
      "authoring efficiency",
      "cost to accepted result",
      "quality fail",
      "quality gate passes",
      "discovery",
      "redundant readbacks",
      "tool-search misses",
      "correction attempts",
      "same-cause retries",
      "contract_caused",
      "reasoning_caused",
      "improved",
      "unchanged",
      "regressed",
      "static footprint",
    ]) expect(normalized).toContain(concept);

    expect(normalized).toMatch(/quality must stay accepted[\s\S]*cost to accepted result decreases/);
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
    const [profile, prompts, brief] = await Promise.all([
      source("lib/registrationProfile.ts"),
      source("server/prompts.ts"),
      source("../.agents/skills/development-brief/SKILL.md"),
    ]);
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("usage_profile");
    expect(prompts).toContain('createPrompt("bedrock_entity_workflow"');
    expect(brief).toContain("Authoring Efficiency");
    expect(brief).toContain("Static Footprint");
    expect(brief).toContain("Success Metric");
    expect(brief).toContain("Evidence before optimization");
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

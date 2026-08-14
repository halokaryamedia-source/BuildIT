import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local usage optimization contract", () => {
  test("repository work preflights regressions before one coherent patch", async () => {
    const brief = await source("../.agents/skills/development-brief/SKILL.md");
    expect(brief).toContain("Preflight regression assertions");
    expect(brief).toContain("collect all affected owners and required invariants before writing");
    expect(brief).toContain("Implement one coherent patch");
    expect(brief).toContain("Do not use intermediary commits/pushes as regression discovery");
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
    expect(modelling).toContain("A fix that helps one view while materially regressing another is rejected");
  });

  test("local efficiency evidence uses concrete observable counters without telemetry architecture", async () => {
    const runbook = await source("../docs/knowledge/operations/local-acceptance-runbook.md");
    for (const metric of [
      "Total MCP calls",
      "Discovery calls",
      "Redundant readbacks",
      "tool_search calls / misses",
      "place_cube calls / Cubes authored",
      "capture_model_views calls / views requested",
      "Correction attempts",
      "Same-cause retries",
      "Broad repository reads",
    ]) expect(runbook).toContain(metric);
    expect(runbook).toContain("not a new telemetry subsystem");
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
    expect(active).toContain("Full workspace lifecycle and package rules live in `../README.md`");
    expect(flow).toContain("meaningful handoff, resume-state change, park, or completion boundary");
  });

  test("prompt and tool surface remain evidence-gated rather than gaining an optimization profile", async () => {
    const [profile, prompts, next] = await Promise.all([
      source("lib/registrationProfile.ts"),
      source("server/prompts.ts"),
      source("../docs/knowledge/next-action.md"),
    ]);
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("usage_profile");
    expect(prompts).toContain('createPrompt("bedrock_entity_workflow"');
    expect(next).toContain("U7  No change required");
    expect(next).toContain("installed-client evidence");
  });

  test("pre-local closure keeps local acceptance explicitly deferred", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain("PRELOCAL_OPTIMIZATION_COMPLETE");
    expect(next).toContain("NO LOCAL RUN ACTIVE");
    expect(next).toContain("LOCAL ACCEPTANCE DEFERRED");
    expect(next).toContain("LOCAL PROOF REQUIRED");
    expect(next).not.toContain("execute runbook sections 3–4");
    expect(next).toContain("local runbook requires fresh explicit reactivation");
  });
});

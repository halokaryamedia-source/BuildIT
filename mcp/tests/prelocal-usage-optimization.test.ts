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

  test("continuation returns to local acceptance without claiming runtime improvement", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain("PRELOCAL_USAGE_OPTIMIZATION_READY");
    expect(next).toContain("NO LOCAL RUN ACTIVE");
    expect(next).toContain("instruction/test evidence only");
    expect(next).toContain("efficiency impact");
    expect(next).toContain("LOCAL PROOF REQUIRED");
    expect(next).toContain("execute runbook sections 3–4");
  });
});

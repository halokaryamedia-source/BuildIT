import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(path, "utf8").replace(/\r\n?/g, "\n");

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stringValue(source: string, key: string): string | null {
  const match = source.match(
    new RegExp(`^${escapeRegExp(key)}\\s*=\\s*"([^"]+)"`, "m")
  );
  return match?.[1] ?? null;
}

function numberValue(source: string, key: string): number | null {
  const match = source.match(
    new RegExp(`^${escapeRegExp(key)}\\s*=\\s*(\\d+)`, "m")
  );
  return match ? Number(match[1]) : null;
}

const agentDirectory = "../.codex/agents";
const agentFiles = readdirSync(agentDirectory)
  .filter((name) => name.endsWith(".toml"))
  .sort();
const agents = Object.fromEntries(
  agentFiles.map((name) => [name, read(`${agentDirectory}/${name}`)])
);

const forbiddenVisualTools = [
  "analyze_geometry_views",
  "record_geometry_visual_decision",
  "manage_project_write_lease",
  "place_cubes_safe",
  "modify_cubes",
  "rotate_cube_about_attachment",
  "save_project_checkpoint",
  "submit_geometry_for_review",
  "complete_geometry_stage",
];

describe("usage-efficient Codex routing", () => {
  test("defaults standard BuildIT work to Terra Medium without a controller hop", () => {
    const config = read("../.codex/config.toml");
    expect(stringValue(config, "model")).toBe("gpt-5.6-terra");
    expect(stringValue(config, "model_reasoning_effort")).toBe("medium");
    expect(stringValue(config, "model_reasoning_summary")).toBe("none");
    expect(stringValue(config, "sandbox_mode")).toBe("workspace-write");
    expect(numberValue(config, "max_threads")).toBe(2);
    expect(numberValue(config, "max_depth")).toBe(1);
    expect(config).toContain("[mcp_servers.blockbench]");
    expect(config).toContain('url = "http://localhost:3000/bb-mcp"');
    expect(config).not.toMatch(/model_reasoning_effort\s*=\s*"(?:xhigh|max|ultra)"/i);
  });

  test("defines exactly four narrow fallback and specialist roles", () => {
    expect(agentFiles).toEqual([
      "critical-reviewer.toml",
      "mcp-builder.toml",
      "routine-auditor.toml",
      "visual-director.toml",
    ]);

    for (const source of Object.values(agents)) {
      expect(stringValue(source, "name")).toBeTruthy();
      expect(stringValue(source, "description")).toBeTruthy();
      expect(source).toContain('developer_instructions = """');
      expect(source).toContain("spawn another agent");
    }
  });

  test("locks each role to the approved model, effort, and sandbox default", () => {
    const expected: Record<
      string,
      { model: string; effort: string; summary: string; sandbox: string }
    > = {
      "routine-auditor.toml": {
        model: "gpt-5.4-mini",
        effort: "low",
        summary: "none",
        sandbox: "read-only",
      },
      "mcp-builder.toml": {
        model: "gpt-5.6-terra",
        effort: "medium",
        summary: "none",
        sandbox: "workspace-write",
      },
      "visual-director.toml": {
        model: "gpt-5.6-sol",
        effort: "medium",
        summary: "concise",
        sandbox: "read-only",
      },
      "critical-reviewer.toml": {
        model: "gpt-5.6-sol",
        effort: "high",
        summary: "concise",
        sandbox: "read-only",
      },
    };

    for (const [file, route] of Object.entries(expected)) {
      const source = agents[file];
      expect(stringValue(source, "model"), file).toBe(route.model);
      expect(stringValue(source, "model_reasoning_effort"), file).toBe(
        route.effort
      );
      expect(stringValue(source, "model_reasoning_summary"), file).toBe(
        route.summary
      );
      expect(stringValue(source, "sandbox_mode"), file).toBe(route.sandbox);
    }
  });

  test("uses MCP capability boundaries in addition to sandbox defaults", () => {
    expect(agents["routine-auditor.toml"]).toContain(
      "[mcp_servers.blockbench]\nenabled = false"
    );
    expect(agents["critical-reviewer.toml"]).toContain(
      "[mcp_servers.blockbench]\nenabled = false"
    );
    expect(agents["mcp-builder.toml"]).toContain(
      "[mcp_servers.blockbench]\nenabled = true"
    );

    const visual = agents["visual-director.toml"];
    expect(visual).toContain("enabled_tools = [");
    for (const tool of [
      "get_runtime_status",
      "get_stage_context",
      "inspect_reference_visual_preview",
      "capture_visual_feedback",
    ]) {
      expect(visual).toContain(`"${tool}"`);
    }
    for (const tool of forbiddenVisualTools) {
      expect(visual).not.toContain(`"${tool}"`);
    }
  });

  test("keeps High rare and forbids higher configured efforts", () => {
    const efforts = Object.entries(agents).map(([file, source]) => ({
      file,
      effort: stringValue(source, "model_reasoning_effort"),
    }));
    expect(efforts.filter(({ effort }) => effort === "high")).toEqual([
      { file: "critical-reviewer.toml", effort: "high" },
    ]);

    const all = Object.values(agents).join("\n");
    expect(all).not.toMatch(
      /model_reasoning_effort\s*=\s*"(?:xhigh|max|ultra)"/i
    );
    expect(agents["critical-reviewer.toml"]).toContain(
      "CRITICAL_VISUAL_ACCEPTANCE"
    );
    expect(agents["critical-reviewer.toml"]).toContain(
      "SOL_MEDIUM_VALIDATION_FAILED"
    );
  });

  test("separates capability eligibility from model selection and keeps one writer", () => {
    const workspaceWriters = Object.entries(agents)
      .filter(
        ([, source]) => stringValue(source, "sandbox_mode") === "workspace-write"
      )
      .map(([file]) => file);
    expect(workspaceWriters).toEqual(["mcp-builder.toml"]);

    const policy = read("../engines/codex/MODEL_ROUTING.md");
    for (const marker of [
      "deterministic Capability Gate",
      "Candidate Pool",
      "Model Selector",
      "A Model Selector cannot add candidates",
      "exactly one eligible Terra Writer",
      "One active Writer exists",
      "single-candidate pool does not call a Model Selector",
    ]) {
      expect(policy).toContain(marker);
    }
    expect(agents["mcp-builder.toml"]).toContain("fallback single MCP writer");
  });

  test("permits read-only routes without weakening mutation ownership", () => {
    const policy = read("../engines/codex/MODEL_ROUTING.md");
    const mutationContext = read("src/lib/mutationContext.ts");
    expect(policy).toContain("read-only versus Writer eligibility");
    expect(policy).toContain("read_only or writer");
    expect(policy).toContain("allowed_tools");
    expect(policy).toContain("Writer already owned by another session");
    expect(mutationContext).not.toContain("WRITE_LEASE_SESSION_AMBIGUOUS");
    expect(mutationContext).toContain("WRITE_LEASE_SESSION_REQUIRED");
  });

  test("uses deterministic fallback and de-escalates advisory routes", () => {
    const policy = read("../engines/codex/MODEL_ROUTING.md");
    const agentsRules = read("../AGENTS.md");
    const bootstrap = read("../engines/codex/BOOTSTRAP.md");

    expect(agentsRules).toContain("CODEX_PROJECT_CONFIG_NOT_LOADED");
    expect(bootstrap).toContain("CODEX_PROJECT_CONFIG_NOT_LOADED");
    for (const marker of [
      "Never spend a model call only to choose another model",
      "Model Selector unavailable",
      "DeterministicBaselineSelector",
      "returns immediately to the Writer and deterministic evidence",
      "reasoning effort at or below High",
      "A Model Selector never grants permission",
    ]) {
      expect(policy).toContain(marker);
    }
    expect(policy).toContain("EVALUATION_ONLY");
    const contextRouting = read("src/server/stage-context-routing-guards.ts");
    expect(contextRouting).toContain("recommendedModelRoute");
    expect(contextRouting).toContain("SELECTED_TERRA_WRITER");
    expect(contextRouting).toContain("visual_escalation");
  });

  test("production and Geometry adapters match canonical audited skills", () => {
    for (const skill of ["blockbench-production", "blockbench-geometry"]) {
      const canonical = read(`../engines/shared/skills/${skill}/SKILL.md`);
      const agent = read(`../.agents/skills/${skill}/SKILL.md`);
      const codex = read(`../.codex/skills/${skill}/SKILL.md`);
      expect(agent).toBe(canonical);
      expect(codex).toBe(canonical);
      expect(canonical).toContain("selected Terra writer");
      expect(canonical).toContain("visual_director");
      expect(canonical).toContain("High");
    }
  });
});

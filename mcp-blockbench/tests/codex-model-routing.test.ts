import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

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

describe("usage-efficient Codex routing", () => {
  test("defaults the project parent to Luna Medium with bounded delegation", () => {
    const config = read("../.codex/config.toml");
    expect(stringValue(config, "model")).toBe("gpt-5.6-luna");
    expect(stringValue(config, "model_reasoning_effort")).toBe("medium");
    expect(numberValue(config, "max_threads")).toBe(2);
    expect(numberValue(config, "max_depth")).toBe(1);
    expect(config).not.toMatch(/\b(xhigh|max|ultra)\b/i);
  });

  test("defines exactly four narrow custom roles", () => {
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

  test("locks each role to the approved model and effort", () => {
    const expected: Record<
      string,
      { model: string; effort: string; sandbox: string }
    > = {
      "routine-auditor.toml": {
        model: "gpt-5.4-mini",
        effort: "low",
        sandbox: "read-only",
      },
      "mcp-builder.toml": {
        model: "gpt-5.6-terra",
        effort: "medium",
        sandbox: "workspace-write",
      },
      "visual-director.toml": {
        model: "gpt-5.6-sol",
        effort: "medium",
        sandbox: "read-only",
      },
      "critical-reviewer.toml": {
        model: "gpt-5.6-sol",
        effort: "high",
        sandbox: "read-only",
      },
    };

    for (const [file, route] of Object.entries(expected)) {
      const source = agents[file];
      expect(stringValue(source, "model"), file).toBe(route.model);
      expect(stringValue(source, "model_reasoning_effort"), file).toBe(
        route.effort
      );
      expect(stringValue(source, "sandbox_mode"), file).toBe(route.sandbox);
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
    expect(all).not.toMatch(/model_reasoning_effort\s*=\s*"(?:xhigh|max|ultra)"/i);
    expect(agents["critical-reviewer.toml"]).toContain(
      "CRITICAL_VISUAL_ACCEPTANCE"
    );
    expect(agents["critical-reviewer.toml"]).toContain(
      "SOL_MEDIUM_VALIDATION_FAILED"
    );
  });

  test("enforces one active-asset writer", () => {
    const workspaceWriters = Object.entries(agents)
      .filter(([, source]) => stringValue(source, "sandbox_mode") === "workspace-write")
      .map(([file]) => file);
    expect(workspaceWriters).toEqual(["mcp-builder.toml"]);
    expect(agents["mcp-builder.toml"]).toContain("single MCP writer");
    for (const file of [
      "routine-auditor.toml",
      "visual-director.toml",
      "critical-reviewer.toml",
    ]) {
      expect(agents[file]).toContain("Never acquire a write lease");
    }
  });

  test("makes routing policy deterministic and de-escalates expensive judgment", () => {
    const policy = read("../engines/codex/MODEL_ROUTING.md");
    for (const marker of [
      "a model call whose only purpose is choosing another model",
      "only MCP writer",
      "Sol decision packet",
      "Terra implementation",
      "Mini deterministic audit",
      "High is the ceiling",
    ]) {
      expect(policy).toContain(marker);
    }
  });

  test("production and Geometry skills carry the routing policy and adapters match", () => {
    for (const skill of ["blockbench-production", "blockbench-geometry"]) {
      const canonical = read(`../engines/shared/skills/${skill}/SKILL.md`);
      const agent = read(`../.agents/skills/${skill}/SKILL.md`);
      const codex = read(`../.codex/skills/${skill}/SKILL.md`);
      expect(agent).toBe(canonical);
      expect(codex).toBe(canonical);
      expect(canonical).toContain("mcp_builder");
      expect(canonical).toContain("visual_director");
      expect(canonical).toContain("High");
    }
  });
});

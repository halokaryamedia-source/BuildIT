import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(path, "utf8").replace(/\r\n?/g, "\n");

const changeRoot = "../openspec/changes/codex-local-workflow-rework";
const authorityPaths = [
  "../openspec/config.yaml",
  `${changeRoot}/PONYTAIL_EXECUTION.md`,
  `${changeRoot}/proposal.md`,
  `${changeRoot}/tasks.md`,
  `${changeRoot}/specs/codex-local-workflow/spec.md`,
  `${changeRoot}/specs/local-stack-connection/spec.md`,
  `${changeRoot}/specs/mcp-tool-profiles/spec.md`,
  `${changeRoot}/specs/root-architecture/spec.md`,
  `${changeRoot}/specs/skill-orchestration/spec.md`,
  `${changeRoot}/specs/workflow-efficiency-tools/spec.md`,
];
const authority = authorityPaths.map(read).join("\n");

describe("active authority alignment", () => {
  test("tracks the exact package release identity", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      version: string;
    };
    const openSpecConfig = read("../openspec/config.yaml");

    expect(packageJson.version).toBe("1.7.0");
    expect(openSpecConfig).toContain(
      `Current source facts: package version ${packageJson.version};`
    );
  });

  test("uses direct Terra routing without stale Luna controller policy", () => {
    expect(authority).toContain("parent default       Terra Medium");
    expect(authority).toContain("Project parent default: `gpt-5.6-terra`, medium.");
    expect(authority).toContain("fallback sole MCP writer");
    expect(authority).not.toContain("Luna Medium");
    expect(authority).not.toContain("gpt-5.6-luna");
    expect(authority).not.toContain("only `mcp_builder` may mutate");
  });

  test("uses the canonical package and active/completed workspace layout", () => {
    expect(authority).toContain("`mcp-blockbench/` for the complete MCP Blockbench package");
    expect(authority).toContain("workspace/active/<asset>/mcp/state.json");
    expect(authority).toContain("workspace/active/<asset>/mcp/project.json");
    expect(authority).toContain("workspace/completed/<asset>/");
    expect(authority).not.toContain("workspace/sessions/<asset>");
    expect(authority).not.toContain("workspace/active-session.json");
    expect(authority).not.toContain("- `src/` for MCP Blockbench implementation");
    expect(authority).not.toContain("Changing an MCP tool profile MAY reconnect");
  });

  test("deploys from the canonical package and tolerates a missing gh-pages branch", () => {
    const deploy = read("../.github/workflows/deploy.yml");

    expect(deploy).toContain("working-directory: mcp-blockbench");
    expect(deploy).toContain("run: bun install --frozen-lockfile");
    expect(deploy).toContain("cp mcp-blockbench/dist/mcp.js staging/plugin/");
    expect(deploy).toContain("docs/api/api.json docs/api/index.html");
    expect(deploy).toContain("id: checkout-pages");
    expect(deploy).toContain("git switch --orphan gh-pages");
    expect(deploy).toContain("if: steps.checkout-pages.outcome == 'success'");
    expect(deploy).toContain(
      "const baseUrl = `https://${context.repo.owner}.github.io/${context.repo.repo}`;"
    );
    expect(deploy).not.toContain("achmadawdi.github.io");
  });
});
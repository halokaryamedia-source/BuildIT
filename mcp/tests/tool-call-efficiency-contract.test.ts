import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

async function read(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), "utf8");
}

function normalized(value: string): string {
  return value.replace(/\s+/g, " ").toLowerCase();
}

describe("authoring tool-call efficiency contract", () => {
  test("router exposes minimum necessary call paths without fixed quotas", async () => {
    const router = normalized(
      await read(".agents/skills/blockit-bedrock-entity-mcp/SKILL.md")
    );

    expect(router).toContain("minimum necessary call paths");
    expect(router).toContain("new geometry");
    expect(router).toContain("geometry correction");
    expect(router).toContain("existing geometry edit");
    expect(router).toContain("new texture");
    expect(router).toContain("texture correction / existing edit");
    expect(router).toContain("new animation");
    expect(router).toContain("animation correction / existing edit");
    expect(router).toContain("do not turn these into fixed numeric quotas");
  });

  test("canonical evaluation contract treats inspection as conditional evidence", async () => {
    const source = normalized(await read("mcp/docs/TOOL_CALL_EFFICIENCY.md"));

    expect(source).toContain("cost to accepted result");
    expect(source).toContain("decision tools, not progress rituals");
    expect(source).toContain("known target uuid/state -> mutate directly");
    expect(source).toContain("diagnostics=true only when uv/coverage readiness is actually unknown");
    expect(source).toContain("inspect_animation is for unknown/stale clip state, not mandatory before every edit");
    expect(source).toContain("fewer calls are an improvement only when acceptance quality is equivalent or better");
  });

  test("efficiency contract preserves bounded discovery and convergence rules", async () => {
    const router = normalized(
      await read(".agents/skills/blockit-bedrock-entity-mcp/SKILL.md")
    );
    const source = normalized(await read("mcp/docs/TOOL_CALL_EFFICIENCY.md"));

    expect(router).toContain("known exact capability → invoke directly");
    expect(router).toContain("limit=4");
    expect(router).toContain("same causal direction may be attempted at most twice");
    expect(source).toContain("same diagnosed cause twice");
    expect(source).toContain("blocked unless new decision-changing evidence exists");
  });
});

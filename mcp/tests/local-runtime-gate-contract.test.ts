import { describe, expect, test } from "bun:test";
import { getEnabledToolDefinitions } from "@/lib/factories";
import { getMcpSurfaceToolNames } from "@/server/tools";

const REQUIRED_GEOMETRY_TOOLS = [
  "create_project",
  "add_group",
  "place_cube",
  "modify_cube",
  "modify_cubes_batch",
  "modify_group",
  "reparent_element",
  "capture_model_views",
  "bone_rigging",
  "export_model",
] as const;

const PLAN_FREE_GEOMETRY_TOOLS = [
  "add_group",
  "place_cube",
  "modify_cube",
  "modify_cubes_batch",
  "modify_group",
  "reparent_element",
] as const;

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("local runtime gate source contract", () => {
  test("default Geometry acceptance surface is complete and plan-free", () => {
    const names = getMcpSurfaceToolNames("bedrock_entity", "geometry");
    const definitions = getEnabledToolDefinitions();

    expect(names.length).toBe(27);
    for (const toolName of REQUIRED_GEOMETRY_TOOLS) {
      expect(names, toolName).toContain(toolName);
      expect(definitions[toolName], toolName).toBeDefined();
    }

    for (const toolName of PLAN_FREE_GEOMETRY_TOOLS) {
      const definition = definitions[toolName];
      if (!definition) {
        throw new Error(`Missing Geometry definition: ${toolName}`);
      }
      expect(
        Object.keys(definition.inputSchema),
        `${toolName} inputSchema`
      ).not.toContain("plan_id");
    }
  });

  test("operator docs point to the current artifact and handoff contract", async () => {
    const [readme, about, runbook] = await Promise.all([
      source("README.md"),
      source("about.md"),
      source("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    expect(readme).toContain("dist/blockit_mcp.js");
    expect(readme).toContain(
      "runtime workflow prompt             < 9,000 characters"
    );
    expect(readme).not.toContain(
      "runtime workflow prompt             < 7,000 characters"
    );

    expect(about).toContain("reload");
    expect(about).toContain("reconnect");
    expect(about).not.toContain("without restarting Blockbench");

    expect(runbook).toContain("mcp/dist/blockit_mcp.js");
    expect(runbook).not.toContain("mcp/dist/mcp.js");
    expect(runbook).toContain("build_identity");
    expect(runbook).toContain("bun run verify:stateless-local");
    expect(runbook).toContain("plan_id");
    expect(runbook).toContain("Do not invent token or latency numbers");
  });
});

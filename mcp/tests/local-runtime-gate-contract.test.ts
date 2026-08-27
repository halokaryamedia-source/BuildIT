import { describe, expect, test } from "bun:test";
import { getEnabledToolDefinitions } from "@/lib/factories";
import { getMcpSurfaceToolNames } from "@/server/tools";
import {
  classifyPreflightFailure,
  getLocalSmokeDiagnostic,
} from "../scripts/verify-stateless-local";

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
      if (!definition) throw new Error(`Missing Geometry definition: ${toolName}`);
      expect(Object.keys(definition.inputSchema), `${toolName} inputSchema`).not.toContain(
        "plan_id"
      );
    }
  });

  test("diagnostic preflight classifies the first known wrong owner", () => {
    expect(classifyPreflightFailure({ reachable: false })).toBe(
      "BLOCKBENCH_SERVER_UNREACHABLE"
    );
    expect(
      classifyPreflightFailure({ reachable: true, healthReadable: false })
    ).toBe("MCP_HEALTH_UNREADABLE");
    expect(
      classifyPreflightFailure({
        reachable: true,
        healthReadable: true,
        productMatches: false,
        buildMatches: false,
      })
    ).toBe("WRONG_MCP_PRODUCT");
    expect(
      classifyPreflightFailure({
        reachable: true,
        healthReadable: true,
        productMatches: true,
        buildMatches: false,
      })
    ).toBe("STALE_BUILD");
    expect(
      classifyPreflightFailure({
        reachable: true,
        healthReadable: true,
        productMatches: true,
        buildMatches: true,
        processStable: false,
      })
    ).toBe("SERVER_PROCESS_UNSTABLE");
    expect(
      classifyPreflightFailure({
        reachable: true,
        healthReadable: true,
        productMatches: true,
        buildMatches: true,
        processStable: true,
        phaseMatches: false,
      })
    ).toBe("WRONG_AUTHORING_PHASE");
    expect(
      classifyPreflightFailure({
        reachable: true,
        healthReadable: true,
        productMatches: true,
        buildMatches: true,
        processStable: true,
        phaseMatches: true,
        transportMatches: false,
      })
    ).toBe("MCP_HEALTH_CONTRACT_MISMATCH");
    expect(
      classifyPreflightFailure({
        reachable: true,
        healthReadable: true,
        productMatches: true,
        buildMatches: true,
        processStable: true,
        phaseMatches: true,
        transportMatches: true,
      })
    ).toBeNull();
  });

  test("environment/runtime diagnostics stop before downstream surface diagnosis", () => {
    for (const code of [
      "BLOCKBENCH_SERVER_UNREACHABLE",
      "MCP_HEALTH_UNREADABLE",
      "WRONG_MCP_PRODUCT",
      "STALE_BUILD",
      "SERVER_PROCESS_UNSTABLE",
      "WRONG_AUTHORING_PHASE",
      "MCP_HEALTH_CONTRACT_MISMATCH",
      "MCP_INITIALIZE_CONTRACT_MISMATCH",
    ] as const) {
      expect(getLocalSmokeDiagnostic(code).stopBeforeSurface, code).toBe(true);
    }

    expect(getLocalSmokeDiagnostic("STALE_BUILD").classification).toBe(
      "ENVIRONMENT / INSTALL"
    );
    expect(getLocalSmokeDiagnostic("SERVER_PROCESS_UNSTABLE").classification).toBe(
      "BLOCKBENCH_RUNTIME"
    );
    expect(getLocalSmokeDiagnostic("SURFACE_MISMATCH").stopBeforeSurface).toBe(false);
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

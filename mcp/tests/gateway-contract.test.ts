import { describe, expect, test } from "bun:test";
import { getAllToolDefinitions } from "@/lib/factories";
import { getMcpSurfaceToolNames } from "@/server/tools";
import {
  GATEWAY_TOOL_NAMES,
  classifyCapabilityTier,
  classifyInterruptedCall,
  createRuntimeSignature,
  normalizeRuntimeUrl,
  searchCapabilityCatalog,
  type BackendTool,
} from "@/gateway/contract";

type RuntimeToolDefinition = {
  description: string;
  inputSchema?: unknown;
  annotations?: BackendTool["annotations"];
};

function runtimeCatalogForPhase(
  phase: "geometry" | "animation"
): BackendTool[] {
  const definitions = getAllToolDefinitions() as Record<
    string,
    RuntimeToolDefinition
  >;
  return getMcpSurfaceToolNames("bedrock_entity", phase).map((name) => {
    const definition = definitions[name];
    if (!definition) {
      throw new Error(`Missing Runtime definition for Gateway search fixture ${name}.`);
    }
    return {
      name,
      description: definition.description,
      inputSchema: definition.inputSchema,
      annotations: definition.annotations,
    };
  });
}

function expectCapabilityRank(
  catalog: readonly BackendTool[],
  query: string,
  expectedCapability: string,
  maxRank: number
): void {
  const ranked = searchCapabilityCatalog(catalog, query, 8).map(
    (capability) => capability.capability_id
  );
  const index = ranked.indexOf(expectedCapability);
  expect(index).toBeGreaterThanOrEqual(0);
  expect(index).toBeLessThan(maxRank);
}

describe("BlockIT Gateway contract", () => {
  test("client-facing MCP surface stays deliberately small and fixed", () => {
    expect(GATEWAY_TOOL_NAMES).toEqual([
      "status",
      "search_capabilities",
      "describe_capability",
      "invoke_capability",
    ]);
  });

  test("capability discovery ranks primary authoring tools ahead of comparable support tools", () => {
    const tools: BackendTool[] = [
      {
        name: "create_texture",
        description: "Create a texture atlas for BlockIT authoring.",
      },
      {
        name: "create_brush_preset",
        description: "Create a texture brush preset.",
      },
      {
        name: "manage_geometry_reference",
        description: "Load an approved GLB as optional 3D Evidence.",
      },
      {
        name: "emulate_clicks",
        description: "Emulate Blockbench UI clicks for maintenance.",
      },
    ];

    expect(searchCapabilityCatalog(tools, "create texture", 10)[0]?.capability_id).toBe(
      "create_texture"
    );
    expect(classifyCapabilityTier(tools[0]!)).toBe("primary");
    expect(classifyCapabilityTier(tools[1]!)).toBe("support");
    expect(classifyCapabilityTier(tools[2]!)).toBe("experimental");
    expect(classifyCapabilityTier(tools[3]!)).toBe("maintenance");
  });

  test("Gateway search covers representative daily intents against the actual phase catalogs", () => {
    const authoring = runtimeCatalogForPhase("geometry");
    const animation = runtimeCatalogForPhase("animation");

    expectCapabilityRank(authoring, "find group hierarchy", "inspect_elements", 1);
    expectCapabilityRank(authoring, "create several cubes", "manage_cubes", 1);
    expectCapabilityRank(authoring, "capture model views", "capture_model_views", 1);
    expectCapabilityRank(authoring, "paint texture with brush", "paint_with_brush", 3);

    expectCapabilityRank(
      animation,
      "add rotation keyframe to bone",
      "manage_animation_timeline",
      3
    );
    expectCapabilityRank(
      animation,
      "change keyframe easing",
      "manage_animation_timeline",
      3
    );
    expectCapabilityRank(animation, "create looping animation", "create_animation", 3);
  });

  test("maintenance fallbacks stay out of empty discovery but remain explicitly discoverable", () => {
    const tools: BackendTool[] = [
      { name: "manage_cubes", description: "Create Bedrock cubes." },
      { name: "emulate_clicks", description: "Emulate Blockbench UI clicks." },
    ];

    expect(searchCapabilityCatalog(tools, "", 10).map((tool) => tool.capability_id))
      .toEqual(["manage_cubes"]);
    expect(searchCapabilityCatalog(tools, "emulate clicks", 10)[0]).toMatchObject({
      capability_id: "emulate_clicks",
      tier: "maintenance",
    });
  });

  test("experimental 3D Evidence remains discoverable only when relevant", () => {
    const tools: BackendTool[] = [
      {
        name: "manage_geometry_reference",
        description: "Load update or remove approved local GLB 3D Evidence.",
      },
      {
        name: "manage_cubes",
        description: "Create and update Bedrock cubes.",
      },
    ];

    expect(searchCapabilityCatalog(tools, "approved GLB evidence", 10)[0]).toMatchObject({
      capability_id: "manage_geometry_reference",
      tier: "experimental",
    });
  });

  test("runtime signature ignores changing health timestamps but detects surface identity changes", () => {
    const base = {
      timestamp: "2026-09-04T09:00:00Z",
      build_identity: `sha256:${"a".repeat(64)}`,
      instance_id: "runtime-a",
      startup_time: "2026-09-04T08:00:00Z",
      exposed_tool_count: 25,
      product: {
        id: "blockit-bedrock-entity-mcp",
        version: "0.1.0",
        profile: "bedrock_entity",
        authoring_phase: "geometry",
      },
    };

    expect(
      createRuntimeSignature({ ...base, timestamp: "2026-09-04T09:01:00Z" })
    ).toBe(createRuntimeSignature(base));
    expect(
      createRuntimeSignature({
        ...base,
        product: { ...base.product, authoring_phase: "texturing" },
        exposed_tool_count: 35,
      })
    ).not.toBe(createRuntimeSignature(base));
  });

  test("Gateway runtime URL is loopback-only", () => {
    expect(normalizeRuntimeUrl("http://127.0.0.1:3000/bb-mcp/"))
      .toBe("http://127.0.0.1:3000/bb-mcp");
    expect(() => normalizeRuntimeUrl("https://example.com/bb-mcp")).toThrow(
      /loopback/
    );
  });

  test("interrupted mutations are never classified as safe automatic retries", () => {
    expect(
      classifyInterruptedCall({
        name: "inspect_elements",
        annotations: { readOnlyHint: true },
      })
    ).toEqual({ code: "BACKEND_CALL_INTERRUPTED", safe_to_retry: true });

    expect(classifyInterruptedCall({ name: "manage_cubes" })).toEqual({
      code: "OUTCOME_UNKNOWN",
      safe_to_retry: false,
    });
  });

  test("phase handoff invalidates only backend state and explicitly keeps the client task alive", async () => {
    const backendSource = await Bun.file("gateway/backend.ts").text();

    expect(backendSource).toContain('capability === "switch_authoring_phase"');
    expect(backendSource).toContain("await this.closeConnectionUnsafe()");
    expect(backendSource).toContain("gateway_catalog_invalidated: true");
    expect(backendSource).toContain("client_reconnect_required: false");
    expect(backendSource).toContain("new_chat_required: false");
    expect(backendSource).toContain("continue same task through Gateway");
  });

  test("stdio Gateway is a first-class package command and does not log protocol traffic to stdout", async () => {
    const packageJson = await Bun.file("package.json").json();
    const source = await Bun.file("gateway/index.ts").text();
    const backendSource = await Bun.file("gateway/backend.ts").text();

    expect(packageJson.scripts.gateway).toBe("bun run ./gateway/index.ts");
    expect(source).toContain("new StdioServerTransport()");
    expect(source).not.toContain("console.log");
    expect(backendSource).toContain("new StreamableHTTPClientTransport");
    expect(backendSource.match(/\.callTool\(/g)?.length ?? 0).toBe(1);
  });
});

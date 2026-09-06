import { describe, expect, test } from "bun:test";
import {
  GATEWAY_TOOL_NAMES,
  classifyCapabilityTier,
  classifyInterruptedCall,
  compactGatewayCapabilityStructuredContent,
  createRuntimeSignature,
  normalizeRuntimeUrl,
  searchCapabilityCatalog,
  type BackendTool,
} from "@/gateway/contract";

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

  test("Gateway compacts manage_cubes continuation receipts without dropping UV-changing state", () => {
    const geometryBatch = compactGatewayCapabilityStructuredContent(
      "manage_cubes",
      {
        modified: 1,
        effects: [
          {
            before: {
              uuid: "cube-a",
              from: [0, 0, 0],
              face_uvs: { north: [0, 0, 4, 4] },
            },
            after: {
              uuid: "cube-a",
              from: [1, 0, 0],
              box_uv_region: { logical_rect: [0, 0, 4, 4] },
              face_uvs: { north: [0, 0, 4, 4] },
            },
            geometry_effect: {
              changed_fields: ["from"],
              center_delta: [1, 0, 0],
            },
          },
        ],
      }
    );
    const geometryJson = JSON.stringify(geometryBatch);
    expect(geometryJson).not.toContain('"before"');
    expect(geometryJson).not.toContain('"face_uvs"');
    expect(geometryJson).toContain('"box_uv_region"');
    expect(geometryJson).toContain('"center_delta"');

    const uvUpdate = compactGatewayCapabilityStructuredContent(
      "manage_cubes",
      {
        before: {
          uuid: "cube-b",
          face_uvs: { north: [0, 0, 4, 4] },
        },
        after: {
          uuid: "cube-b",
          face_uvs: { north: [4, 0, 8, 4] },
        },
        geometry_effect: {
          changed_fields: ["faces"],
          faces_changed: true,
        },
      }
    );
    const uvJson = JSON.stringify(uvUpdate);
    expect(uvJson).not.toContain('"before"');
    expect(uvJson).toContain('"face_uvs"');
    expect(uvJson).toContain('"faces_changed"');

    const unrelated = { detail: { uuid: "cube-a" } };
    expect(
      compactGatewayCapabilityStructuredContent("inspect_elements", unrelated)
    ).toBe(unrelated);
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

  test("stdio Gateway keeps discovery bounded and does not advertise unproxied Runtime surfaces", async () => {
    const packageJson = await Bun.file("package.json").json();
    const source = await Bun.file("gateway/index.ts").text();
    const backendSource = await Bun.file("gateway/backend.ts").text();

    expect(packageJson.scripts.gateway).toBe("bun run ./gateway/index.ts");
    expect(source).toContain("new StdioServerTransport()");
    expect(source).toContain("compactGatewayCapabilityStructuredContent");
    expect(source).toContain('max(50).default(4)');
    expect(source).toContain("Runtime resources and prompts are not proxied");
    expect(source).toContain("inputSchema: tool.inputSchema ?? {}");
    expect(source).not.toContain("structuredContent: { capability: tool }");
    expect(source).not.toContain("console.log");
    expect(backendSource).toContain("new StreamableHTTPClientTransport");
    expect(backendSource.match(/\.callTool\(/g)?.length ?? 0).toBe(1);
  });
});

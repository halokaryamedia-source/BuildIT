import { describe, expect, test } from "bun:test";
import {
  searchCapabilityCatalog,
  type BackendTool,
} from "@/gateway/contract";

describe("BlockIT Gateway capability discovery hardening", () => {
  const tools: BackendTool[] = [
    {
      name: "manage_cubes",
      description: "Create and update Bedrock geometry cubes.",
    },
    {
      name: "create_brush_preset",
      description: "Create a reusable texture brush preset.",
    },
    {
      name: "manage_geometry_reference",
      description: "Load approved GLB geometry evidence.",
    },
    {
      name: "emulate_clicks",
      description: "Emulate Blockbench UI clicks for maintenance.",
    },
  ];

  test("exact capability name short-circuits to exactly one result", () => {
    const exact = searchCapabilityCatalog(tools, "manage_cubes", 50);
    expect(exact).toHaveLength(1);
    expect(exact[0]).toMatchObject({
      capability_id: "manage_cubes",
      tier: "primary",
    });
  });

  test("exact capability lookup is case-insensitive but not fuzzy", () => {
    expect(searchCapabilityCatalog(tools, "MANAGE_CUBES", 50)).toHaveLength(1);
    expect(searchCapabilityCatalog(tools, "manage_cube", 50)[0]?.capability_id)
      .toBe("manage_cubes");
  });

  test("primary capability outranks comparable lower-tier semantic matches", () => {
    const ranked = searchCapabilityCatalog(tools, "geometry create", 4);
    expect(ranked[0]).toMatchObject({
      capability_id: "manage_cubes",
      tier: "primary",
    });
  });

  test("empty discovery excludes maintenance fallback", () => {
    const ids = searchCapabilityCatalog(tools, "", 10)
      .map((entry) => entry.capability_id);
    expect(ids).not.toContain("emulate_clicks");
  });

  test("maintenance remains available only when explicitly targeted", () => {
    const exact = searchCapabilityCatalog(tools, "emulate_clicks", 10);
    expect(exact).toEqual([
      expect.objectContaining({
        capability_id: "emulate_clicks",
        tier: "maintenance",
      }),
    ]);
  });

  test("experimental remains discoverable for relevant evidence intent", () => {
    const result = searchCapabilityCatalog(tools, "approved GLB geometry evidence", 4);
    expect(result[0]).toMatchObject({
      capability_id: "manage_geometry_reference",
      tier: "experimental",
    });
  });
});

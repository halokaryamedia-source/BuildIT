import { describe, expect, test } from "bun:test";

describe("default MCP registration is runtime-lazy", () => {
  test("default tool registry reconstructs outside Blockbench without reading runtime globals", async () => {
    // Prove the registry import succeeds because runtime globals stay execution-owned,
    // not because this test environment accidentally provides Blockbench's Painter.
    expect("Painter" in globalThis).toBe(false);

    const module = await import("../server/tools");
    const exposed = Object.values(module.tools).filter((tool) => tool.enabled);
    expect(exposed.length).toBeGreaterThan(0);
    expect(exposed.some((tool) => tool.name === "place_cube")).toBe(true);
    expect(exposed.some((tool) => tool.name === "paint_with_brush")).toBe(true);
    expect(exposed.some((tool) => tool.name === "activate_texture")).toBe(true);
    expect(exposed.some((tool) => tool.name === "apply_texture")).toBe(false);
  });
});

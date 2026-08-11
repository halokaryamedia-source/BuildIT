import { describe, expect, test } from "bun:test";

describe("default MCP registration is runtime-lazy", () => {
  test("default product registry reconstructs outside Blockbench with a bounded description surface", async () => {
    // Prove the registry import succeeds because runtime globals stay execution-owned,
    // not because this test environment accidentally provides Blockbench's Painter.
    expect("Painter" in globalThis).toBe(false);

    const module = await import("../server/tools");
    // Other contract tests deliberately register in-process fixture tools against
    // the shared factory registry. They are test state, not the BlockIT product surface.
    const exposed = Object.values(module.tools).filter(
      (tool) => tool.enabled && !tool.name.includes("fixture")
    );
    const descriptionCharacters = exposed.reduce(
      (total, tool) => total + tool.description.length,
      0
    );

    expect(exposed.length).toBe(62);
    expect(descriptionCharacters).toBeLessThan(11_500);
    expect(exposed.some((tool) => tool.name === "place_cube")).toBe(true);
    expect(exposed.some((tool) => tool.name === "paint_with_brush")).toBe(true);
    expect(exposed.some((tool) => tool.name === "activate_texture")).toBe(true);
    expect(exposed.some((tool) => tool.name === "apply_texture")).toBe(false);
    expect(exposed.some((tool) => tool.name === "filter_by_material")).toBe(false);
  });
});

import { describe, expect, test } from "bun:test";
import { importToolDocs } from "@/server/tools/import";
import { uiToolDocs } from "@/server/tools/ui";

describe("default MCP registration is runtime-lazy", () => {
  test("default product registry reconstructs outside Blockbench with a bounded description surface", async () => {
    // Prove the registry import succeeds because runtime globals stay execution-owned,
    // not because this test environment accidentally provides Blockbench's Painter.
    expect("Painter" in globalThis).toBe(false);

    const module = await import("../server/tools");
    const extendedToolNames = new Set([
      ...importToolDocs.map((tool) => tool.name),
      ...uiToolDocs.map((tool) => tool.name),
    ]);

    // Other tests deliberately register fixture and extended-family tools in the
    // shared process. Exclude those so this budget measures the default Bedrock
    // product surface rather than mutable test state.
    const catalog = Object.values(module.tools).filter(
      (tool) => !tool.name.includes("fixture") && !extendedToolNames.has(tool.name)
    );
    const descriptionCharacters = catalog.reduce(
      (total, tool) => total + tool.description.length,
      0
    );

    expect(catalog.length).toBe(75);
    expect(descriptionCharacters).toBeLessThan(11_500);
    expect(catalog.some((tool) => tool.name === "manage_cubes")).toBe(true);
    expect(catalog.some((tool) => tool.name === "paint_with_brush")).toBe(true);
    expect(catalog.some((tool) => tool.name === "activate_texture")).toBe(true);
    expect(catalog.some((tool) => tool.name === "manage_animation_controller")).toBe(true);
    expect(catalog.some((tool) => tool.name === "manage_geometry_reference")).toBe(true);
  });
});

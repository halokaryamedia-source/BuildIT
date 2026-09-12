import { describe, expect, test } from "bun:test";
import { importToolDocs } from "@/server/tools/import";
import { uiToolDocs } from "@/server/tools/ui";

describe("default MCP registration is runtime-lazy", () => {
  test("default product registry reconstructs outside Blockbench with a bounded description surface", async () => {
    // Prove the registry import succeeds because runtime globals stay execution-owned,
    // not because this test environment accidentally provides Blockbench's Painter.
    const probe = Bun.spawnSync([process.execPath, "-e", 'if ("Painter" in globalThis) throw Error("unexpected runtime"); await import("./server/tools.ts");'], {cwd:process.cwd()});
    expect(probe.exitCode).toBe(0);

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

    // Two legacy 3D-assisted definitions were intentionally retired. Retained
    // internal/disabled definitions remain source-owned, so the default registry
    // now contains 78 definitions rather than the historical 80.
    expect(catalog.length).toBe(78);
    expect(descriptionCharacters).toBeLessThan(11_800);
    expect(catalog.some((tool) => tool.name === "manage_cubes")).toBe(true);
    expect(catalog.some((tool) => tool.name === "paint_with_brush")).toBe(true);
    expect(catalog.some((tool) => tool.name === "paint_texture_transaction")).toBe(true);
    expect(catalog.some((tool) => tool.name === "activate_texture")).toBe(true);
    expect(catalog.some((tool) => tool.name === "manage_render_profile")).toBe(true);
    expect(catalog.some((tool) => tool.name === "manage_animation_controller")).toBe(true);
    expect(catalog.some((tool) => tool.name === "manage_geometry_reference")).toBe(false);
    expect(catalog.some((tool) => tool.name === "materialize_3d_assisted_scaffold")).toBe(false);
  });
});

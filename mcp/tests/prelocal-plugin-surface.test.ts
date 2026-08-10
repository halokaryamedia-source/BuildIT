import { describe, expect, test } from "bun:test";
import { createSurfaceManifest } from "@/lib/surfaceManifest";
import { PRODUCT_NAME, PRODUCT_REPOSITORY } from "@/lib/productIdentity";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local BlockIT plugin surface hardening", () => {
  test("surface manifest distinguishes exposed/disabled/catalog entries deterministically", () => {
    const manifest = createSurfaceManifest({
      profile: "bedrock_entity",
      tools: {
        exposed_b: { name: "exposed_b", description: "", enabled: true, status: "stable" },
        disabled_a: { name: "disabled_a", description: "", enabled: false, status: "experimental" },
        exposed_a: { name: "exposed_a", description: "", enabled: true, status: "stable" },
      },
      resources: {
        texture: { name: "texture", description: "", uriTemplate: "textures://{id}" },
      },
      prompts: {
        disabled_prompt: { name: "disabled_prompt", description: "", arguments: [], enabled: false, status: "stable" },
        bedrock_prompt: { name: "bedrock_prompt", description: "", arguments: [], enabled: true, status: "stable" },
      },
    });

    expect(manifest.tools).toEqual({
      exposed_count: 2,
      disabled_count: 1,
      catalog_count: 3,
      exposed: ["exposed_a", "exposed_b"],
      disabled: ["disabled_a"],
    });
    expect(manifest.resources.available_count).toBe(1);
    expect(manifest.prompts.exposed_count).toBe(1);
    expect(manifest.prompts.disabled).toEqual(["disabled_prompt"]);
  });

  test("plugin identity is BlockIT-owned while upstream attribution remains documentation-only", async () => {
    expect(PRODUCT_NAME).toContain("BlockIT");
    expect(PRODUCT_REPOSITORY).toBe("https://github.com/halokaryamedia-source/BuildIT");
    const indexSource = await source("index.ts");
    const readme = await source("README.md");
    expect(indexSource).toContain("title: PRODUCT_NAME");
    expect(indexSource).toContain("repository: PRODUCT_REPOSITORY");
    expect(indexSource).not.toContain("jasonjgardner.github.io/blockbench-mcp-plugin");
    expect(readme).toContain("Do **not** use the upstream hosted");
  });

  test("panel count language reflects MCP exposure instead of visible filter count", async () => {
    const panel = await source("ui/panel.html");
    const uiSource = await source("ui/index.ts");
    expect(panel).toContain("surface.tools.exposed_count");
    expect(panel).toContain("surface.prompts.exposed_count");
    expect(panel).toContain("surface.resources.available_count");
    expect(panel).not.toContain("filteredTools.length}}/{{tools.length");
    expect(uiSource).toContain("showDisabled: false");
    expect(uiSource).toContain("createSurfaceManifest");
  });

  test("Blockbench Tool Test cannot bypass disabled registration or full schema validation", async () => {
    const dialog = await source("ui/toolTestDialog.ts");
    const disabledGuard = dialog.indexOf("!tools[toolName]?.enabled");
    const fullValidation = dialog.indexOf("toolDef.parameterSchema.parseAsync(args)");
    const execute = dialog.indexOf("toolDef.execute(validatedArgs)");
    expect(disabledGuard).toBeGreaterThan(-1);
    expect(fullValidation).toBeGreaterThan(disabledGuard);
    expect(execute).toBeGreaterThan(fullValidation);
  });

  test("capability matrix protects native Bedrock gaps from deletion-by-absence", async () => {
    const matrix = await source("../docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md");
    for (const capability of [
      "TextureMesh",
      "Locators / NullObject locators",
      "Animation controllers",
      "Native Bedrock bounding-box fields",
      "Animated textures",
      "Bone binding expression",
      "Per-face `material_instance`",
    ]) {
      expect(matrix).toContain(capability);
    }
    expect(matrix).toContain("MCP GAP — protected");
    expect(matrix).toContain("not evidence that the native Bedrock capability may be removed");
  });
});

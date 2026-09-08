import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("texture material workflow and diagnostics", () => {
  test("texturing guidance keeps the established material facade and bounded diagnostics", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");

    expect(skill).toContain("PBR/material semantics → manage_material / manage_material_instances");
    expect(skill).toContain("list_materials");
    expect(skill).toContain("get_material_info");
    expect(skill).toContain("normal XOR height");
    expect(skill).toContain("MERS");
    expect(skill).toContain("authoring_status");
    expect(skill).toContain("seam_continuity");
    expect(skill).toContain("pbr_content");
  });

  test("foundation material standard documents native MERS and save readiness semantics", async () => {
    const standard = await source("../docs/foundation/10-material-standard.md");
    expect(standard).toContain("MER texture + subsurface_value>0");
    expect(standard).toContain("save.path_ready");
    expect(standard).toContain("normal XOR height");
    expect(standard).toContain("manage_material");
  });

  test("runtime augments existing texture/material tools instead of adding another MCP surface", async () => {
    const [runtime, server] = await Promise.all([
      source("server/tools/texture-authoring-runtime.ts"),
      source("server/server.ts"),
    ]);

    for (const tool of [
      "list_textures",
      "list_materials",
      "get_material_info",
      "manage_material",
    ]) {
      expect(runtime).toContain(`runtimeDefinition(\"${tool}\")`);
    }
    expect(runtime).not.toContain("createTool(");
    expect(server).toContain("wireTextureAuthoringRuntime();");
  });
});

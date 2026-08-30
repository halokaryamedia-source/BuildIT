import { describe, expect, test } from "bun:test";
import { exportModelParameters } from "@/server/tools/export";
import { createTextureParameters, importTextureSetParameters } from "@/server/tools/texture";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local asset-authoring usage slimming", () => {
  test("asset authoring bypasses repository-development boot and development-brief", async () => {
    const agents = await source("../AGENTS.md");
    expect(agents).toContain("### Asset Authoring");
    expect(agents).toContain("do not automatically load");
    expect(agents).toContain("Asset authoring is not software **Development**");
    expect(agents).toMatch(/do not route it through `development-brief`/i);
  });

  test("router stays compact and routing-only while modelling owns visual gates", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    expect(orchestrator.length).toBeLessThan(5_000);
    expect(modelling.length).toBeLessThan(13_000);

    for (const required of [
      "Tool Lane Discipline",
      "State Reuse / Anti-Loop",
      "HANDOFF_REQUIRED",
      "capture_model_views",
      "modify_cube",
      "export_model",
      "geometry/rig/UV judgement",
    ]) expect(orchestrator).toContain(required);

    expect(orchestrator).not.toContain("FAIL / UNVERIFIED / PASS");
    expect(orchestrator.toLowerCase()).not.toContain("difference-first");
    expect(orchestrator.toLowerCase()).not.toContain("existing geometry may be a task baseline");

    for (const required of ["SUPPORTED", "PROVISIONAL", "CONFLICTING", "UNAVAILABLE", "difference-first", "FAIL", "UNVERIFIED", "PASS", "BLOCKED", "geometry_effect"]) {
      expect(modelling.toLowerCase()).toContain(required.toLowerCase());
    }
  });

  test("filesystem export omits large returned content by default but remains opt-in", () => {
    expect(exportModelParameters.parse({ path: "/tmp/model.json" }).max_content_length).toBeUndefined();
    expect(exportModelParameters.parse({}).max_content_length).toBeUndefined();
    expect(exportModelParameters.parse({ path: "/tmp/model.json", max_content_length: 500 }).max_content_length).toBe(500);
  });

  test("filesystem export preserves native target semantics and verifies writes", async () => {
    const exportSource = await source("server/tools/export.ts");
    for (const marker of [
      'destructiveHint: true',
      'codec_id === "bedrock" && exportFs.existsSync(path)',
      "exportFs.writeFileSync",
      "exportFs.statSync(path)",
      "codec.afterSave(path)",
      "currentExportProjectLifecycle()",
    ]) expect(exportSource).toContain(marker);
  });

  test("filesystem export path must be platform-absolute", () => {
    for (const path of ["/tmp/model.json", "C:\\Exports\\model.json", "D:/Exports/model.bbmodel", "\\\\server\\share\\model.json"]) {
      expect(exportModelParameters.safeParse({ path }).success).toBe(true);
    }
    for (const path of ["", "model.json", "exports/model.json", ".\\model.json", "C:model.json"]) {
      expect(exportModelParameters.safeParse({ path }).success).toBe(false);
    }
  });

  test("filesystem import paths are deterministic", () => {
    for (const path of ["/tmp/material.texture_set.json", "C:\\Exports\\material.texture_set.json", "D:/Exports/material.texture_set.json", "\\\\server\\share\\material.texture_set.json"]) {
      expect(importTextureSetParameters.safeParse({ path }).success).toBe(true);
    }
    for (const path of ["material.texture_set.json", "textures/material.texture_set.json", ".\\material.texture_set.json", "C:material.texture_set.json"]) {
      expect(importTextureSetParameters.safeParse({ path }).success).toBe(false);
    }
  });

  test("create_texture image file sources do not depend on Blockbench cwd", () => {
    for (const data of ["data:image/png;base64,AAAA", "/tmp/texture.png", "C:\\Textures\\skin.png", "D:/Textures/skin.png", "\\\\server\\share\\skin.png", "file:///tmp/texture.png", "file://C:/Textures/skin.png"]) {
      expect(createTextureParameters.safeParse({ name: "skin", data }).success).toBe(true);
    }
    for (const data of ["texture.png", "textures/skin.png", ".\\skin.png", "https://example.com/skin.png"]) {
      expect(createTextureParameters.safeParse({ name: "skin", data }).success).toBe(false);
    }
  });

  test("create_texture converts RGBA byte alpha to TinyColor alpha range", async () => {
    expect(createTextureParameters.safeParse({ name: "translucent", fill_color: [255, 0, 0, 128], layer_name: "base" }).success).toBe(true);
    const texture = await source("server/tools/texture.ts");
    expect(texture).toContain("a: Number(fill_color[3] ?? 255) / 255");
  });

  test("high-frequency reads stay compact and fresh mutation state avoids redundant inspect", async () => {
    const files = await Promise.all([
      source("server/tools/element-inspection.ts"),
      source("server/tools/project.ts"),
      source("server/tools/animation.ts"),
      source("server/tools/animation-inspection.ts"),
      source("server/tools/locators.ts"),
    ]);
    for (const text of files) expect(text).not.toContain("JSON.stringify(result, null, 2)");
    const locatorSource = files[4];
    expect(locatorSource).toContain("function mutationResult(");
    expect(locatorSource).toContain("structuredContent: summary");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    expect(orchestrator).toContain("Do not automatically re-read fresh mutation targets with `inspect_element`");
  });

  test("Cube correction results avoid redundant state and identity copies", async () => {
    const cubes = await source("server/tools/cubes.ts");
    const singleStart = cubes.indexOf("createTool(cubeToolDocs[1].name");
    const batchStart = cubes.indexOf("createTool(cubeToolDocs[2].name", singleStart);
    const single = cubes.slice(singleStart, batchStart);
    const batch = cubes.slice(batchStart);
    expect(single).toContain("after,");
    expect(single).toContain("geometry_effect");
    expect(batch).toContain("before,");
    expect(batch).toContain("after,");
    expect(batch).toContain("geometry_effect");
  });

  test("capability architecture keeps the existing registration profile", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("asset_authoring_profile");
  });
});

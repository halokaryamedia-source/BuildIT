import { describe, expect, test } from "bun:test";
import { exportModelParameters } from "@/server/tools/export";
import {
  createTextureParameters,
  importTextureSetParameters,
} from "@/server/tools/texture";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local asset-authoring usage slimming", () => {
  test("asset authoring bypasses repository-development boot and development-brief", async () => {
    const agents = await source("../AGENTS.md");
    expect(agents).toContain("### Asset Authoring");
    expect(agents).toContain("do not automatically load");
    expect(agents).toContain("Asset authoring is not software **Developing**");
    expect(agents).toContain("Do not route it through `development-brief`");

    const readme = await source("../README.md");
    expect(readme).toContain("## Current Documentation Owners");
    expect(readme).toContain("Root `AGENTS.md` owns routing");
    expect(readme).toContain("docs/knowledge/operations/local-acceptance-runbook.md");
    expect(readme).not.toContain("## Start By Task");
    expect(readme).not.toContain("## Mandatory Session Boot");
  });

  test("normal authoring skill stack remains compact while hard gates stay present", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    expect(orchestrator.length).toBeLessThan(8_000);
    expect(modelling.length).toBeLessThan(13_000);
    for (const required of [
      "Minimum Necessary Evidence",
      "FAIL / UNVERIFIED / PASS",
      "BLOCKED",
      "capture_model_views",
      "modify_cube",
      "export_model",
    ]) expect(orchestrator).toContain(required);
    for (const required of [
      "SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE",
      "difference-first",
      "FAIL",
      "UNVERIFIED",
      "PASS",
      "BLOCKED",
      "geometry_effect",
      "same causal correction direction has failed twice without new evidence",
    ]) expect(modelling.toLowerCase()).toContain(required.toLowerCase());
  });

  test("filesystem export omits large returned content by default but remains opt-in", () => {
    expect(exportModelParameters.parse({ path: "/tmp/model.json" }).max_content_length).toBeUndefined();
    expect(exportModelParameters.parse({}).max_content_length).toBeUndefined();
    expect(exportModelParameters.parse({ path: "/tmp/model.json", max_content_length: 500 }).max_content_length).toBe(500);
  });

  test("filesystem export preserves native target semantics and verifies writes", async () => {
    const exportSource = await source("server/tools/export.ts");
    expect(exportSource).toContain('destructiveHint: true');
    expect(exportSource).toContain('codec_id === "bedrock" && exportFs.existsSync(path)');
    expect(exportSource).toContain("const previousSavePath = Project!.save_path");
    expect(exportSource).toContain("const previousName = Project!.name");
    expect(exportSource).toContain("Project!.name = filesystemStem(path)");
    expect(exportSource).toContain("Project!.name = previousName");
    expect(exportSource).toContain("? filesystemFileName(path)");
    expect(exportSource).toContain("Project!.save_path = path;");
    expect(exportSource).toContain("Project!.save_path = previousSavePath;");
    expect(exportSource).toContain("byteLength === 0");
    expect(exportSource).toContain("exportFs.statSync(path)");
    expect(exportSource).toContain("!writtenStat.isFile() || writtenStat.size !== byteLength");
    expect(exportSource).toContain("must end in .${expectedExtension}");
    expect(exportSource).toContain("codec.afterSave(path)");
    expect(exportSource).toContain("currentExportProjectLifecycle()");
    expect(exportSource).toContain("lifecycle.export_codec === codec_id");
    expect(exportSource).toContain("project: currentExportProjectLifecycle()");

    const existingGuard = exportSource.indexOf('codec_id === "bedrock" && exportFs.existsSync(path)');
    const compileCall = exportSource.indexOf("codec.compile(effectiveOptions)");
    const writeCall = exportSource.indexOf("exportFs.writeFileSync");
    const statCall = exportSource.indexOf("exportFs.statSync(path)");
    expect(existingGuard).toBeGreaterThan(-1);
    expect(existingGuard).toBeLessThan(compileCall);
    expect(writeCall).toBeGreaterThan(-1);
    expect(writeCall).toBeLessThan(statCall);
  });

  test("filesystem export path must be platform-absolute", () => {
    for (const path of [
      "/tmp/model.json",
      "C:\\Exports\\model.json",
      "D:/Exports/model.bbmodel",
      "\\\\server\\share\\model.json",
    ]) {
      expect(exportModelParameters.safeParse({ path }).success).toBe(true);
    }

    for (const path of [
      "",
      "model.json",
      "exports/model.json",
      ".\\model.json",
      "C:model.json",
    ]) {
      expect(exportModelParameters.safeParse({ path }).success).toBe(false);
    }
  });

  test("filesystem import and export paths are deterministic", () => {
    for (const path of [
      "/tmp/material.texture_set.json",
      "C:\\Exports\\material.texture_set.json",
      "D:/Exports/material.texture_set.json",
      "\\\\server\\share\\material.texture_set.json",
    ]) {
      expect(importTextureSetParameters.safeParse({ path }).success).toBe(true);
    }
    for (const path of [
      "material.texture_set.json",
      "textures/material.texture_set.json",
      ".\\material.texture_set.json",
      "C:material.texture_set.json",
    ]) {
      expect(importTextureSetParameters.safeParse({ path }).success).toBe(false);
    }
  });

  test("create_texture image file sources do not depend on Blockbench cwd", () => {
    for (const data of [
      "data:image/png;base64,AAAA",
      "/tmp/texture.png",
      "C:\\Textures\\skin.png",
      "D:/Textures/skin.png",
      "\\\\server\\share\\skin.png",
      "file:///tmp/texture.png",
      "file://C:/Textures/skin.png",
    ]) {
      expect(createTextureParameters.safeParse({ name: "skin", data }).success).toBe(true);
    }
    for (const data of [
      "texture.png",
      "textures/skin.png",
      ".\\skin.png",
      "https://example.com/skin.png",
    ]) {
      expect(createTextureParameters.safeParse({ name: "skin", data }).success).toBe(false);
    }
  });

  test("create_texture converts RGBA byte alpha to TinyColor alpha range", async () => {
    expect(
      createTextureParameters.safeParse({
        name: "translucent",
        fill_color: [255, 0, 0, 128],
        layer_name: "base",
      }).success
    ).toBe(true);
    const texture = await source("server/tools/texture.ts");
    expect(texture).toContain("a: Number(fill_color[3] ?? 255) / 255");
    expect(texture).not.toContain("a: Number(fill_color[3] ?? 255),");
  });

  test("high-frequency read outputs use compact JSON and locator mutation does not require redundant read", async () => {
    const files = await Promise.all([
      source("server/tools/element-inspection.ts"),
      source("server/tools/project.ts"),
      source("server/tools/animation.ts"),
      source("server/tools/animation-inspection.ts"),
      source("server/tools/locators.ts"),
    ]);
    for (const text of files) expect(text).not.toContain("JSON.stringify(result, null, 2)");
    const locatorSource = files[4];
    expect(locatorSource).not.toContain("JSON.stringify(state, null, 2)");
    expect(locatorSource).toContain("JSON.stringify(state)");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    expect(orchestrator).toContain("Do not automatically re-read them with `inspect_element`");
  });

  test("single-Cube correction returns current state without repeating the full previous state", async () => {
    const cubes = await source("server/tools/cubes.ts");
    const singleStart = cubes.indexOf("createTool(cubeToolDocs[1].name");
    const batchStart = cubes.indexOf("createTool(cubeToolDocs[2].name", singleStart);
    const single = cubes.slice(singleStart, batchStart);
    const batch = cubes.slice(batchStart);

    expect(single).not.toContain("cube: after,");
    expect(single).toContain("after,");
    expect(single).not.toContain("\n        before,\n");
    expect(single).toContain("geometry_effect");

    expect(batch).toContain("before,");
    expect(batch).toContain("after,");
    expect(batch).toContain("geometry_effect");

    const history = await source("server/tools/history.ts");
    expect(history).toContain("JSON.stringify(summarizeHistory(limit))");
  });

  test("capability architecture is unchanged", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("asset_authoring_profile");
  });
});

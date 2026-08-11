import { describe, expect, test } from "bun:test";
import { createProjectParameters } from "@/server/tools/project";
import { addGroupParameters } from "@/server/tools/element";
import {
  BLOCKIT_MODEL_CODEC_IDS,
  exportModelParameters,
  listExportFormatsParameters,
} from "@/server/tools/export";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local generic semantics narrowing", () => {
  test("project creation has no redundant format selector", () => {
    expect(createProjectParameters.parse({ name: "entity" })).toEqual({ name: "entity" });
    expect(createProjectParameters.safeParse({ name: "entity", format: "bedrock" }).success).toBe(false);
    expect(createProjectParameters.safeParse({ name: "entity", format: "java_block" }).success).toBe(false);
    expect(createProjectParameters.safeParse({ name: "entity", format: "bedrock_block" }).success).toBe(false);
  });

  test("add_group exposes only finite Bedrock bone create state", () => {
    expect(addGroupParameters.safeParse({ name: "body" }).success).toBe(true);
    expect(addGroupParameters.safeParse({ name: "body", origin: [0, Infinity, 0] }).success).toBe(false);
    expect(addGroupParameters.safeParse({ name: "body", rotation: [0, 0, -Infinity] }).success).toBe(false);
    for (const editorOnly of [
      { selected: true },
      { shade: false },
      { visibility: false },
      { autouv: "1" },
    ]) {
      expect(addGroupParameters.safeParse({ name: "body", ...editorOnly }).success).toBe(false);
    }
  });
  test("model export exposes only Bedrock geometry and editable Blockbench project codecs", () => {
    expect(BLOCKIT_MODEL_CODEC_IDS).toEqual(["bedrock", "project"]);
    expect(listExportFormatsParameters.parse({})).toEqual({});
    expect(exportModelParameters.parse({}).codec_id).toBe("bedrock");
    expect(exportModelParameters.safeParse({ codec_id: "project" }).success).toBe(true);
    expect(exportModelParameters.safeParse({ codec_id: "obj" }).success).toBe(false);
    expect(exportModelParameters.safeParse({ codec_id: "gltf" }).success).toBe(false);
  });

  test("fixed export-format discovery is default-disabled without removing export capability", async () => {
    const exportSource = await source("server/tools/export.ts");
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    expect(exportSource).toContain("exportToolDocs[0].status,\n    false");
    expect(exportSource).toContain("BLOCKIT_MODEL_CODEC_IDS = [\"bedrock\", \"project\"]");
    expect(exportSource).toContain("const codec = registry[codec_id]");
    expect(skill).toContain("`export_model` supports:");
    expect(skill).not.toContain("list_export_formats");
  });
  test("generic full-app capture and editor-camera mutation are default-disabled", async () => {
    const camera = await source("server/tools/camera.ts");
    expect(camera).toContain("cameraToolDocs[1].status, false");
    expect(camera).toContain("cameraToolDocs[2].status, false");
    expect(camera).toContain("capture_model_views");
  });

  test("generic per-face texture apply is disabled for Bedrock single-texture authoring", async () => {
    const texture = await source("server/tools/texture.ts");
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const audit = await source("../docs/knowledge/reviews/mcp-prelocal-generic-semantics-audit-2026-08-10.md");
    expect(texture).toContain("textureToolDocs[1].status, false");
    expect(texture).toContain("native Bedrock Entity is single_texture");
    expect(skill).not.toContain("- `apply_texture`");
    expect(skill).toContain("use `activate_texture` to choose the active/default working texture");
    expect(audit).toContain("**DEFAULT-DISABLE** the inherited generic per-face `Texture.apply()` wrapper");
  });
  test("raw per-face texture discovery is disabled for Bedrock single-texture authoring", async () => {
    const elements = await source("server/tools/element.ts");
    const start = elements.indexOf('name: "filter_by_material"');
    const registration = elements.indexOf("elementToolDocs[7].status, false");
    expect(start).toBeGreaterThan(-1);
    expect(registration).toBeGreaterThan(start);
    expect(elements).toContain("effective face texture comes from Texture.getDefault()");
  });
  test("validator inferred element references declare their non-authoritative source", async () => {
    const validator = await source("server/resources/validator.ts");
    expect(validator).toContain('elementRefsSource: elementRefs.length > 0 ? "message_heuristic" : "none"');
    expect(validator).toContain("elementRefsAuthoritative: false");
  });

  test("generic nodes resource remains explicitly deferred until protected native gaps have owners", async () => {
    const audit = await source("../docs/knowledge/reviews/mcp-prelocal-generic-semantics-audit-2026-08-10.md");
    const matrix = await source("../docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md");
    expect(audit).toContain("`nodes://{id}`");
    expect(audit).toContain("DEFER — retain for now");
    expect(matrix).toContain("Generic `nodes://{id}` observation");
    expect(matrix).toContain("Transitional / deferred");
  });
});

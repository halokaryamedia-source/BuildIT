import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { workflowToolDocs } from "../src/server/tools/workflow";

function readJson(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;
}

describe("compact workflow tools", () => {
  test("registers only the three high-value orchestration tools", () => {
    expect(workflowToolDocs.map((tool) => tool.name)).toEqual([
      "validate_reference_contract",
      "save_texture_evidence",
      "complete_stage",
    ]);
  });

  test("stage profiles expose workflow tools only where needed", () => {
    const config = readJson("Engine/codex/tool-profiles.json");

    expect(config.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools).toContain(
      "validate_reference_contract"
    );
    expect(config.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools).toContain(
      "complete_stage"
    );
    expect(config.profiles.BEDROCK_CUBOID_TEXTURE.allowed_tools).toContain(
      "save_texture_evidence"
    );
    expect(config.profiles.FINAL_VALIDATION_READONLY.allowed_tools).toContain(
      "validate_reference_contract"
    );
    expect(config.profiles.GEOMETRY_LOCAL_REPAIR.allowed_tools).not.toContain(
      "complete_stage"
    );
  });

  test("complete_stage reuses checkpointing and updates state atomically", () => {
    const source = readFileSync("src/server/tools/workflow.ts", "utf8");

    expect(source).toContain('getAllToolDefinitions()["save_project_checkpoint"]');
    expect(source).toContain("writeJsonAtomically(fs, statePath, state)");
    expect(source).toContain("activateToolProfile(nextProfile)");
    expect(source).toContain("STATE_REVISION_MISMATCH");
    expect(source).toContain("STAGE_EVIDENCE_MISSING");
  });

  test("texture evidence avoids returning PNG base64 through Codex", () => {
    const source = readFileSync("src/server/tools/workflow.ts", "utf8");

    expect(source).toContain("bufferFromDataUrl(texture.getDataURL())");
    expect(source).toContain("writeFileAtomically(fs, path, data)");
    expect(source).toContain("byte_length: data.byteLength");
  });

  test("high-volume inspection tools return structured content", () => {
    const project = readFileSync("src/server/tools/project.ts", "utf8");
    const cubeUv = readFileSync("src/server/tools/cubeUv.ts", "utf8");

    expect(project).toContain("structuredContent: { status: \"PASS\", ...snapshot }");
    expect(cubeUv).toContain("structuredContent: { status: \"PASS\", ...layout }");
    expect(cubeUv).toContain('id: elementIdSchema.describe("Explicit cube UUID or name.")');
  });

  test("atomic file helper rejects paths outside the approved root", () => {
    const source = readFileSync("src/lib/atomicFiles.ts", "utf8");

    expect(source).toContain("assertInsideRoot");
    expect(source).toContain("is outside approved root");
    expect(source).toContain("writeFileAtomically");
  });
});

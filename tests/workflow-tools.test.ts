import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { workflowToolDocs } from "../src/server/tools/workflow";
import {
  assertInsideRoot,
  normalizePathForCompare,
} from "../src/lib/atomicFiles";

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

    for (const profileId of [
      "BEDROCK_CUBOID_GEOMETRY",
      "BEDROCK_CUBOID_TEXTURE",
      "BEDROCK_CUBOID_ANIMATION",
      "FINAL_VALIDATION_READONLY",
    ]) {
      expect(config.profiles[profileId].allowed_tools).toContain(
        "validate_reference_contract"
      );
    }
    expect(config.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools).toContain(
      "complete_stage"
    );
    expect(config.profiles.BEDROCK_CUBOID_TEXTURE.allowed_tools).toContain(
      "save_texture_evidence"
    );
    expect(config.profiles.GEOMETRY_LOCAL_REPAIR.allowed_tools).not.toContain(
      "complete_stage"
    );
  });

  test("complete_stage reuses checkpointing and updates state atomically", () => {
    const source = readFileSync("src/server/tools/workflow.ts", "utf8");

    expect(source).toContain('"save_project_checkpoint"');
    expect(source).toContain("checkpointTool.execute");
    expect(source).toContain("writeJsonAtomically(fs, statePath, state)");
    expect(source).toContain("activateToolProfile(nextProfile)");
    expect(source).toContain("STATE_REVISION_MISMATCH");
    expect(source).toContain("STAGE_EVIDENCE_MISSING");
    expect(source).toContain("STAGE_REPORT_NOT_PASS");
  });

  test("validation is stage-aware and does not require unfinished build output during preflight", () => {
    const source = readFileSync("src/server/tools/workflow.ts", "utf8");

    expect(source).toContain('const validateBuiltGeometry = require_evidence || stage !== "GEOMETRY"');
    expect(source).toContain('const validateTexture = stage === "TEXTURE" || stage === "FINAL_VALIDATION"');
    expect(source).toContain('const validateAnimation = stage === "ANIMATION" || stage === "FINAL_VALIDATION"');
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
    const history = readFileSync("src/server/tools/history.ts", "utf8");

    expect(project).toContain('structuredContent: { status: "PASS", ...snapshot }');
    expect(cubeUv).toContain('structuredContent: { status: "PASS", ...layout }');
    expect(cubeUv).toContain('id: elementIdSchema.describe("Explicit cube UUID or name.")');
    expect(history).toContain("returning ${summary.returned} entries");
    expect(history).toContain('structuredContent: { status: "PASS", ...summary }');
  });

  test("path authorization collapses traversal before root comparison", () => {
    expect(normalizePathForCompare("C:\\repo\\session\\evidence\\..\\..\\outside.png"))
      .toBe("c:/repo/outside.png");
    expect(() =>
      assertInsideRoot(
        "C:\\repo\\session\\evidence\\..\\..\\outside.png",
        "C:\\repo\\session"
      )
    ).toThrow("outside approved root");
    expect(() =>
      assertInsideRoot(
        "C:\\repo\\session\\evidence\\texture.png",
        "C:\\repo\\session"
      )
    ).not.toThrow();
  });
});

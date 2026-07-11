import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { workflowToolDocs } from "../src/server/tools/workflow";
import {
  assertInsideRoot,
  normalizePathForCompare,
} from "../src/lib/atomicFiles";

const readJson = (path: string) =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;

describe("compact workflow tools", () => {
  test("keeps only three high-value generic orchestration tools", () => {
    expect(workflowToolDocs.map((tool) => tool.name)).toEqual([
      "validate_reference_contract",
      "save_texture_evidence",
      "complete_stage",
    ]);
  });

  test("profiles expose guarded Geometry completion and generic completion only where appropriate", () => {
    const config = readJson("../engines/shared/profiles/tool-profiles.json");
    expect(config.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools).toContain(
      "complete_geometry_stage"
    );
    expect(config.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools).not.toContain(
      "complete_stage"
    );
    expect(config.profiles.BEDROCK_CUBOID_TEXTURE.allowed_tools).toContain(
      "save_texture_evidence"
    );
    expect(config.profiles.BEDROCK_CUBOID_TEXTURE.allowed_tools).toContain(
      "complete_stage"
    );
    expect(config.profiles.GEOMETRY_LOCAL_REPAIR.allowed_tools).not.toContain(
      "complete_stage"
    );
  });

  test("workflow writes are atomic and state-revision guarded", () => {
    const source = readFileSync("src/server/tools/workflow.ts", "utf8");
    expect(source).toContain("writeJsonAtomically(fs, statePath, state)");
    expect(source).toContain("STATE_REVISION_MISMATCH");
    expect(source).toContain("STAGE_EVIDENCE_MISSING");
  });

  test("path authorization collapses traversal", () => {
    expect(
      normalizePathForCompare(
        "C:\\repo\\session\\evidence\\..\\..\\outside.png"
      )
    ).toBe("c:/repo/outside.png");
    expect(() =>
      assertInsideRoot("C:\\repo\\outside.png", "C:\\repo\\session")
    ).toThrow("outside approved root");
  });
});

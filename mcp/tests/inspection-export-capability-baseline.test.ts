import { describe, expect, test } from "bun:test";
import { inspectElementParameters } from "@/server/tools/element-inspection";
import {
  BLOCKIT_MODEL_CODEC_IDS,
  exportModelParameters,
} from "@/server/tools/export";

describe("inspection capability baseline", () => {
  test("retains compact geometry and UV detail modes", () => {
    expect(inspectElementParameters.safeParse({ id: "element", detail: "geometry" }).success).toBe(true);
    expect(inspectElementParameters.safeParse({ id: "element", detail: "uv" }).success).toBe(true);
    expect(inspectElementParameters.safeParse({ id: "element", detail: "other" }).success).toBe(false);
  });
});

describe("export capability baseline", () => {
  test("retains intentional Bedrock and editable project codecs", () => {
    expect([...BLOCKIT_MODEL_CODEC_IDS]).toEqual(["bedrock", "project"]);
    expect(exportModelParameters.safeParse({ codec_id: "bedrock" }).success).toBe(true);
    expect(exportModelParameters.safeParse({ codec_id: "project" }).success).toBe(true);
  });

  test("retains filesystem and bounded-content controls", () => {
    expect(exportModelParameters.safeParse({
      codec_id: "project",
      path: "/tmp/model.bbmodel",
      overwrite: true,
      max_content_length: 0,
    }).success).toBe(true);
    expect(exportModelParameters.safeParse({ codec_id: "bedrock", max_content_length: 2_000_001 }).success).toBe(false);
  });
});

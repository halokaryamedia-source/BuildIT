import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  encodedBase64Length,
  planTransportDimensions,
} from "../src/lib/imageTransport";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

describe("bounded Reference Visual transport", () => {
  test("preserves aspect ratio while bounding the longest edge", () => {
    expect(planTransportDimensions(1491, 1055, 1400)).toEqual({
      width: 1400,
      height: 991,
      downscaled: true,
    });
    expect(planTransportDimensions(640, 360, 1400)).toEqual({
      width: 640,
      height: 360,
      downscaled: false,
    });
  });

  test("computes the exact base64 expansion budget", () => {
    expect(encodedBase64Length(0)).toBe(0);
    expect(encodedBase64Length(1)).toBe(4);
    expect(encodedBase64Length(3)).toBe(4);
    expect(encodedBase64Length(4)).toBe(8);
    expect(encodedBase64Length(768 * 1024)).toBe(1024 * 1024);
  });

  test("normal production exposes only the compact preview tool", () => {
    const profiles = json("../engines/shared/profiles/tool-profiles.json");
    for (const profileId of ["BOOTSTRAP", "BEDROCK_CUBOID_GEOMETRY"]) {
      const tools = new Set<string>(profiles.profiles[profileId].allowed_tools);
      expect(tools.has("inspect_reference_visual_preview"), profileId).toBe(true);
      expect(tools.has("inspect_reference_visual"), profileId).toBe(false);
    }
    expect(profiles.profiles.GEOMETRY_LOCAL_REPAIR).toBeUndefined();
    expect(profiles.profiles.GEOMETRY_VISUAL_REBUILD).toBeUndefined();
    expect(profiles.forbidden_in_normal_profiles).toContain(
      "inspect_reference_visual"
    );
  });

  test("preview tool keeps original authority separate from transport bytes", () => {
    const source = read("src/server/tools/reference-visual-preview.ts");
    expect(source).toContain("original_reference");
    expect(source).toContain("transport_preview");
    expect(source).toContain("max_transport_bytes");
    expect(source).toContain("image_generation_count_impact: 0");
    expect(source).toContain("preview.data.toString(\"base64\")");
    expect(source).not.toContain("data: source.toString(\"base64\")");
  });

  test("stage policy forbids original multi-megabyte image responses", () => {
    const stages = json("../engines/shared/profiles/stage-profiles.json");
    expect(stages.geometry_visual_policy.reference_tool).toBe(
      "inspect_reference_visual_preview"
    );
    expect(
      stages.global.image_transport_policy.original_binary_in_tool_response_forbidden
    ).toBe(true);
    expect(stages.global.image_transport_policy.default_max_transport_bytes).toBe(
      768 * 1024
    );
  });
});

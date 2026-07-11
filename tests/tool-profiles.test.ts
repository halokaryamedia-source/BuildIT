import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

interface ProfileDefinition {
  description: string;
  allowed_tools?: string[];
  include_all?: boolean;
}

interface ToolProfileConfig {
  schema_version: string;
  default_profile: string;
  core_tools: string[];
  profiles: Record<string, ProfileDefinition>;
  stage_map: Record<string, string>;
  forbidden_in_normal_profiles: string[];
}

const config = JSON.parse(
  readFileSync("Engine/codex/tool-profiles.json", "utf8")
) as ToolProfileConfig;

function exposed(profileId: string): Set<string> {
  const profile = config.profiles[profileId];
  if (!profile || profile.include_all) {
    throw new Error(`Profile ${profileId} is unavailable or unbounded.`);
  }
  return new Set([...config.core_tools, ...(profile.allowed_tools ?? [])]);
}

describe("exact MCP tool profile contract", () => {
  test("normal profile counts are intentionally compact and stable", () => {
    const expectedCounts: Record<string, number> = {
      BOOTSTRAP: 9,
      BEDROCK_CUBOID_GEOMETRY: 19,
      BEDROCK_CUBOID_TEXTURE: 27,
      BEDROCK_CUBOID_ANIMATION: 18,
      FINAL_VALIDATION_READONLY: 16,
      GEOMETRY_LOCAL_REPAIR: 15,
      TEXTURE_LOCAL_REPAIR: 20,
      ANIMATION_LOCAL_REPAIR: 13,
    };

    for (const [profileId, expected] of Object.entries(expectedCounts)) {
      expect(exposed(profileId).size, profileId).toBe(expected);
    }
  });

  test("normal profiles contain no duplicate names or forbidden capabilities", () => {
    for (const [profileId, profile] of Object.entries(config.profiles)) {
      if (profile.include_all) continue;
      const allowed = profile.allowed_tools ?? [];
      expect(new Set(allowed).size, `${profileId} has duplicates`).toBe(allowed.length);
      const names = exposed(profileId);
      for (const forbidden of config.forbidden_in_normal_profiles) {
        expect(names.has(forbidden), `${profileId} exposes ${forbidden}`).toBe(false);
      }
    }
  });

  test("repair profiles are strict subsets of their parent stage profiles", () => {
    const pairs = [
      ["GEOMETRY_LOCAL_REPAIR", "BEDROCK_CUBOID_GEOMETRY"],
      ["TEXTURE_LOCAL_REPAIR", "BEDROCK_CUBOID_TEXTURE"],
      ["ANIMATION_LOCAL_REPAIR", "BEDROCK_CUBOID_ANIMATION"],
    ] as const;

    for (const [repairId, stageId] of pairs) {
      const repair = exposed(repairId);
      const stage = exposed(stageId);
      for (const name of repair) {
        expect(stage.has(name), `${repairId} adds ${name}`).toBe(true);
      }
      expect(repair.size).toBeLessThan(stage.size);
    }
  });

  test("Geometry excludes project setup and cross-stage arguments are guarded", () => {
    const geometry = exposed("BEDROCK_CUBOID_GEOMETRY");
    expect(geometry.has("create_project")).toBe(false);
    expect(geometry.has("configure_project")).toBe(false);
    expect(geometry.has("create_texture")).toBe(false);
    expect(geometry.has("set_cube_face_uv")).toBe(false);
    expect(geometry.has("create_animation")).toBe(false);
    expect(geometry.has("export_model")).toBe(false);
    expect(geometry.has("validate_reference_contract")).toBe(true);
    expect(geometry.has("complete_stage")).toBe(true);

    const runtime = readFileSync("src/lib/toolProfiles.ts", "utf8");
    expect(runtime).toContain("TOOL_PROFILE_ARGUMENT_BLOCKED");
    expect(runtime).toContain('toolName === "place_cube"');
    expect(runtime).toContain('toolName === "modify_cube"');
    expect(runtime).toContain('toolName === "create_texture"');
  });

  test("every normal review stage exposes compact validation", () => {
    for (const profileId of [
      "BEDROCK_CUBOID_GEOMETRY",
      "BEDROCK_CUBOID_TEXTURE",
      "BEDROCK_CUBOID_ANIMATION",
      "FINAL_VALIDATION_READONLY",
    ]) {
      expect(exposed(profileId).has("validate_reference_contract"), profileId).toBe(true);
    }
  });

  test("Texture is cuboid/classic-only and Final Validation is read-mostly", () => {
    const texture = exposed("BEDROCK_CUBOID_TEXTURE");
    expect(texture.has("set_cube_face_uv")).toBe(true);
    expect(texture.has("get_uv_layout")).toBe(true);
    expect(texture.has("save_texture_evidence")).toBe(true);
    expect(texture.has("gradient_tool")).toBe(false);
    expect(texture.has("set_mesh_uv")).toBe(false);
    expect(texture.has("create_pbr_material")).toBe(false);

    const finalProfile = exposed("FINAL_VALIDATION_READONLY");
    expect(finalProfile.has("export_model")).toBe(true);
    expect(finalProfile.has("save_project_checkpoint")).toBe(true);
    expect(finalProfile.has("capture_standard_views")).toBe(true);
    expect(finalProfile.has("validate_reference_contract")).toBe(true);
    expect(finalProfile.has("complete_stage")).toBe(true);
    expect(finalProfile.has("place_cube")).toBe(false);
    expect(finalProfile.has("paint_with_brush")).toBe(false);
    expect(finalProfile.has("manage_keyframes")).toBe(false);
  });

  test("stage map resolves only exact normal profiles", () => {
    expect(config.stage_map).toEqual({
      GEOMETRY: "BEDROCK_CUBOID_GEOMETRY",
      TEXTURE: "BEDROCK_CUBOID_TEXTURE",
      ANIMATION: "BEDROCK_CUBOID_ANIMATION",
      FINAL_VALIDATION: "FINAL_VALIDATION_READONLY",
    });
  });
});

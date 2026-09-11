import { describe, expect, test } from "bun:test";
import { getCapabilityMetadata } from "@/lib/capabilityMetadata";

describe("Native Bedrock capability discovery", () => {
  test("keeps native authoring capabilities on the primary discovery path", () => {
    for (const capability of [
      "manage_locator",
      "bone_rigging",
      "apply_texture",
      "inspect_particle",
      "manage_particle",
    ]) {
      expect(getCapabilityMetadata(capability).tier).toBe("primary");
    }
  });

  test("keeps focused aliases for native authoring discovery", () => {
    expect(getCapabilityMetadata("manage_locator").searchAliases).toContain("attachment point");
    expect(getCapabilityMetadata("bone_rigging").searchAliases).toContain("pivot hierarchy");
    expect(getCapabilityMetadata("apply_texture").searchAliases).toContain("texture face");
    expect(getCapabilityMetadata("manage_particle").searchAliases).toContain("snowstorm");
  });
});

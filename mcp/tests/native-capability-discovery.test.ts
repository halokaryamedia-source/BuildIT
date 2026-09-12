import { describe, expect, test } from "bun:test";
import { getCapabilityMetadata } from "@/lib/capabilityMetadata";

describe("Native Bedrock capability discovery", () => {
  test("keeps semantic authoring capabilities primary and helper routes support", () => {
    for (const capability of [
      "manage_locator",
      "inspect_particle",
      "manage_particle",
    ]) {
      expect(getCapabilityMetadata(capability).tier).toBe("primary");
    }

    for (const capability of ["bone_rigging", "apply_texture"]) {
      expect(getCapabilityMetadata(capability).tier).toBe("support");
    }
  });

  test("keeps focused aliases on the canonical semantic owner", () => {
    expect(getCapabilityMetadata("manage_locator").searchAliases).toContain("attachment point");
    expect(getCapabilityMetadata("modify_group").searchAliases).toContain("bone pivot");
    expect(getCapabilityMetadata("bone_rigging").searchAliases).toContain("inverse kinematics");
    expect(getCapabilityMetadata("bone_rigging").searchAliases).not.toContain("pivot hierarchy");
    expect(getCapabilityMetadata("apply_texture").searchAliases).toContain("texture face");
    expect(getCapabilityMetadata("manage_particle").searchAliases).toContain("snowstorm");
  });
});

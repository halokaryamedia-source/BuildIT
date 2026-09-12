import { describe, expect, test } from "bun:test";
import { getCapabilityMetadata } from "../lib/capabilityMetadata";
import {
  classifyMcpToolPhase,
  isMcpToolExposedForPhase,
} from "../lib/authoringPhase";

describe("capability discovery efficiency", () => {
  test("canonical semantic geometry capabilities outrank overlapping rig helper", () => {
    for (const capability of [
      "add_group",
      "modify_group",
      "reparent_element",
      "remove_element",
      "rename_element",
    ]) {
      expect(getCapabilityMetadata(capability).tier).toBe("primary");
    }

    expect(getCapabilityMetadata("bone_rigging").tier).toBe("support");
    expect(getCapabilityMetadata("bone_rigging").searchAliases).toEqual(
      expect.arrayContaining(["inverse kinematics", "ik target", "mirror bone"])
    );
  });

  test("texture state and legacy helpers stay below semantic authoring tools", () => {
    expect(getCapabilityMetadata("activate_texture").tier).toBe("support");
    expect(getCapabilityMetadata("apply_texture").tier).toBe("support");

    for (const capability of [
      "create_texture",
      "paint_texture_transaction",
      "paint_with_brush",
      "manage_material",
    ]) {
      expect(getCapabilityMetadata(capability).tier).toBe("primary");
    }
  });

  test("selection helpers remain authoring support instead of animation surface", () => {
    for (const capability of ["select_all_of_type", "get_selection"]) {
      expect(classifyMcpToolPhase(capability, "elements")).toBe("geometry");
      expect(isMcpToolExposedForPhase(capability, "elements", "geometry")).toBe(true);
      expect(isMcpToolExposedForPhase(capability, "elements", "texturing")).toBe(true);
      expect(isMcpToolExposedForPhase(capability, "elements", "animation")).toBe(false);
    }
  });
});

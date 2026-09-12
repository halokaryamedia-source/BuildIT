import { describe, expect, test } from "bun:test";
import { getCapabilityMetadata } from "../lib/capabilityMetadata";
import { searchCapabilityCatalog } from "./contract";

const tool = (name: string, description = "") => ({
  name,
  description,
  annotations: {},
});

describe("canonical capability metadata", () => {
  test("preserves tier ownership outside Gateway", () => {
    expect(getCapabilityMetadata("manage_cubes").tier).toBe("primary");
    expect(getCapabilityMetadata("manage_geometry_reference").tier).toBe("support");
    expect(getCapabilityMetadata("risky_eval").tier).toBe("maintenance");
    expect(getCapabilityMetadata("unknown_future_tool").tier).toBe("support");
  });

  test("search consumes canonical aliases", () => {
    const results = searchCapabilityCatalog(
      [
        tool("manage_animation_controller", "Authors animation controllers."),
        tool("manage_cubes", "Authors cubes."),
      ],
      "state machine",
      4
    );

    expect(results[0]?.capability_id).toBe("manage_animation_controller");
  });

  test("declares affinity changes while transport refresh remains conservative", () => {
    const project = getCapabilityMetadata("create_project").effects;
    expect(project.projectAffinity).toBe("adopt_created_project");
    expect(project.phaseAffinity).toBe("preserve");
    expect(project.invalidateCatalog).toBe(true);

    const phase = getCapabilityMetadata("switch_authoring_phase").effects;
    expect(phase.projectAffinity).toBe("preserve");
    expect(phase.phaseAffinity).toBe("update_from_result");
    expect(phase.invalidateCatalog).toBe(true);

    const ordinary = getCapabilityMetadata("manage_cubes").effects;
    expect(ordinary.projectAffinity).toBe("preserve");
    expect(ordinary.phaseAffinity).toBe("preserve");
    expect(ordinary.invalidateCatalog).toBe(false);
  });
});

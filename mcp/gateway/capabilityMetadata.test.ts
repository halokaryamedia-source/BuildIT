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
    expect(getCapabilityMetadata("manage_geometry_reference").tier).toBe("experimental");
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
});

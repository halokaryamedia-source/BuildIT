import { describe, expect, test } from "bun:test";
import { resolveGatewayCapabilityEffects } from "./capabilityEffects";

describe("resolveGatewayCapabilityEffects", () => {
  test("adopts created project through metadata", () => {
    const resolved = resolveGatewayCapabilityEffects(
      "create_project",
      { project: { uuid: "project-123" } },
      "geometry"
    );

    expect(resolved.effects.projectAffinity).toBe("adopt_created_project");
    expect(resolved.effects.invalidateCatalog).toBe(true);
    expect(resolved.projectUuid).toBe("project-123");
    expect(resolved.authoringPhase).toBeNull();
  });

  test("updates authoring phase through metadata", () => {
    const resolved = resolveGatewayCapabilityEffects(
      "switch_authoring_phase",
      { phase: "animation", surface_changed: true },
      "geometry"
    );

    expect(resolved.effects.phaseAffinity).toBe("update_from_result");
    expect(resolved.effects.invalidateCatalog).toBe(true);
    expect(resolved.authoringPhase).toBe("animation");
    expect(resolved.surfaceChanged).toBe(true);
  });

  test("ordinary capabilities preserve affinity", () => {
    const resolved = resolveGatewayCapabilityEffects(
      "manage_cubes",
      { changed: true },
      "geometry"
    );

    expect(resolved.effects.projectAffinity).toBe("preserve");
    expect(resolved.effects.phaseAffinity).toBe("preserve");
    expect(resolved.effects.invalidateCatalog).toBe(false);
    expect(resolved.projectUuid).toBeNull();
    expect(resolved.authoringPhase).toBeNull();
  });
});

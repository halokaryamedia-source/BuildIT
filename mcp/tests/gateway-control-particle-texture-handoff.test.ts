import { describe, expect, test } from "bun:test";
import { buildControlDelta } from "@/gateway/control";

describe("LazyDesigner Control particle texture handoff", () => {
  test("generated particle texture is a dependency handoff, not an Animation mutation", () => {
    const delta = buildControlDelta({
      capability: "manage_particle",
      phaseBefore: "animation",
      phaseAfter: "animation",
      projectUuid: "project-a",
      succeeded: true,
      result: {
        texture_dependency: {
          source: "generated",
          texture: "textures/particle/dust",
          status: "REQUIRES_TEXTURING",
          authoring_domain: "TEXTURING",
          entry_capability: "create_texture",
          resume_capability: "manage_particle",
        },
      },
    });

    expect(delta.authoring_domain).toBe("ANIMATION");
    expect(delta.invalidates.authoring_domains).toEqual([]);
    expect(delta.invalidates.workspace_projection).toBe(false);
    expect(delta.invalidates.acceptance_gates).toBe(false);
    expect(delta.next_intent).toBe("AUTHOR_PARTICLE_TEXTURE_THEN_RESUME");
  });

  test("completed particle mutation still invalidates Animation only", () => {
    const delta = buildControlDelta({
      capability: "manage_particle",
      phaseBefore: "animation",
      phaseAfter: "animation",
      projectUuid: "project-a",
      succeeded: true,
      result: {
        texture_dependency: {
          source: "existing",
          texture: "textures/particle/dust",
          status: "SATISFIED",
        },
      },
    });

    expect(delta.invalidates.authoring_domains).toEqual(["ANIMATION"]);
    expect(delta.next_intent).toBe("VERIFY_OR_CONTINUE_ANIMATION");
  });
});

import { describe, expect, test } from "bun:test";
import {
  buildParticleTextureDependencyPlan,
  manageParticleParameters,
  particleToolDocs,
} from "@/server/tools/particle";

describe("particle texture dependency contract", () => {
  test("keeps particle authoring to inspect/manage only", () => {
    expect(particleToolDocs.map((tool) => tool.name)).toEqual([
      "inspect_particle",
      "manage_particle",
    ]);
    expect(particleToolDocs.map((tool) => tool.name)).not.toContain(
      "create_particle_texture"
    );
  });

  test("accepts existing and vanilla particle texture provenance without a handoff", () => {
    for (const source of ["existing", "vanilla"] as const) {
      const parsed = manageParticleParameters.safeParse({
        create: {
          identifier: `blockit:${source}_texture_particle`,
          texture: "textures/particle/particles",
        },
        texture_dependency: {
          source,
          texture: "textures/particle/particles",
        },
      });

      expect(parsed.success, source).toBe(true);
      if (!parsed.success) continue;
      expect(
        buildParticleTextureDependencyPlan(parsed.data.texture_dependency)
      ).toEqual({
        source,
        texture: "textures/particle/particles",
        status: "SATISFIED",
      });
    }
  });

  test("routes generated particle bitmaps through existing Texturing capabilities", () => {
    const parsed = manageParticleParameters.safeParse({
      create: {
        identifier: "blockit:generated_dust",
        texture: "textures/particle/generated_dust",
      },
      texture_dependency: {
        source: "generated",
        texture: "textures/particle/generated_dust",
        name: "generated_dust.png",
        width: 32,
        height: 32,
        description: "Small transparent brown dust fragments for an impact burst.",
      },
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const plan = buildParticleTextureDependencyPlan(
      parsed.data.texture_dependency
    );
    expect(plan).toEqual({
      source: "generated",
      texture: "textures/particle/generated_dust",
      status: "REQUIRES_TEXTURING",
      authoring_domain: "TEXTURING",
      entry_capability: "create_texture",
      create_texture: {
        name: "generated_dust.png",
        type: "blank",
        width: 32,
        height: 32,
      },
      paint_capabilities: [
        "paint_fill_tool",
        "draw_shape_tool",
        "gradient_tool",
        "paint_with_brush",
        "eraser_tool",
      ],
      description: "Small transparent brown dust fragments for an impact burst.",
      transparent: true,
      resume_capability: "manage_particle",
    });
  });

  test("dependency metadata cannot silently disagree with authored particle JSON", () => {
    expect(
      manageParticleParameters.safeParse({
        create: {
          identifier: "blockit:mismatch",
          texture: "textures/particle/a",
        },
        texture_dependency: {
          source: "generated",
          texture: "textures/particle/b",
          name: "b.png",
          description: "Mismatch should fail before authoring.",
        },
      }).success
    ).toBe(false);

    expect(
      manageParticleParameters.safeParse({
        create: { identifier: "blockit:implicit" },
        texture_dependency: {
          source: "generated",
          texture: "textures/particle/generated",
          name: "generated.png",
          description: "Dependency metadata must not mutate particle JSON implicitly.",
        },
      }).success
    ).toBe(false);
  });
});

import { describe, expect, test } from "bun:test";
import { animationEffectOperationSchema } from "@/server/tools/animation-effects";
import {
  particleMutationOperationSchema,
  particleTextureDependencySchema,
  buildParticleTextureDependencyPlan,
} from "@/server/tools/particle";

describe("Animation Effects capability baseline", () => {
  test("retains add/update/remove across effect channels", () => {
    expect(animationEffectOperationSchema.safeParse({ operation: "add", channel: "particle", time: 0, effect: "fx" }).success).toBe(true);
    expect(animationEffectOperationSchema.safeParse({ operation: "add", channel: "sound", time: 0, effect: "sound" }).success).toBe(true);
    expect(animationEffectOperationSchema.safeParse({ operation: "add", channel: "timeline", time: 0, script: "q.life_time" }).success).toBe(true);
    expect(animationEffectOperationSchema.safeParse({ operation: "update", channel: "particle", keyframe_uuid: "k", data_point_index: 0, effect: "fx2" }).success).toBe(true);
    expect(animationEffectOperationSchema.safeParse({ operation: "remove", channel: "sound", keyframe_uuid: "k", data_point_index: 0 }).success).toBe(true);
    expect(animationEffectOperationSchema.safeParse({ operation: "remove", channel: "timeline", keyframe_uuid: "k" }).success).toBe(true);
  });
});

describe("Particle capability baseline", () => {
  const validOperations = [
    { op: "set_identifier", identifier: "test:effect" },
    { op: "set_render", material: "particles_alpha" },
    { op: "set_component", component: "minecraft:emitter_rate_steady", value: {} },
    { op: "remove_component", component: "minecraft:emitter_rate_steady" },
    { op: "set_curve", name: "curve.test", value: [0, 1] },
    { op: "remove_curve", name: "curve.test" },
    { op: "set_event", name: "event.test", value: {} },
    { op: "remove_event", name: "event.test" },
    { op: "patch", path: ["components", "minecraft:particle_lifetime_expression"], value: {} },
  ] as const;

  test("retains every mutation operation", () => {
    for (const operation of validOperations) {
      expect(particleMutationOperationSchema.safeParse(operation).success, operation.op).toBe(true);
    }
  });

  test("retains existing, vanilla, and generated texture dependencies", () => {
    expect(particleTextureDependencySchema.safeParse({ source: "existing", texture: "textures/particle/foo" }).success).toBe(true);
    expect(particleTextureDependencySchema.safeParse({ source: "vanilla", texture: "textures/particle/generic" }).success).toBe(true);

    const generated = {
      source: "generated" as const,
      texture: "textures/particle/foo",
      output_path: "/tmp/textures/particle/foo.png",
      name: "foo",
      description: "soft particle",
    };
    expect(particleTextureDependencySchema.safeParse(generated).success).toBe(true);
    const parsed = particleTextureDependencySchema.parse(generated);
    const plan = buildParticleTextureDependencyPlan(parsed);
    expect(plan?.status).toBe("REQUIRES_TEXTURING");
    if (plan?.status === "REQUIRES_TEXTURING") {
      expect(plan.entry_capability).toBe("create_texture");
      expect(plan.paint_capabilities).toContain("paint_texture_transaction");
      expect(plan.resume_capability).toBe("manage_particle");
    }
  });
});

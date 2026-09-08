import { describe, expect, test } from "bun:test";
import {
  inspectParticleParameters,
  manageParticleParameters,
  particleToolDocs,
} from "../server/tools/particle";
import {
  PARTICLE_REFERENCE_IDS,
  getParticleReferencePayload,
  particleReferenceResourceDocs,
} from "../server/resources/particle";

describe("particle MCP contract", () => {
  test("keeps the authoring surface to two focused tools", () => {
    expect(particleToolDocs.map((tool) => tool.name)).toEqual([
      "inspect_particle",
      "manage_particle",
    ]);
  });

  test("supports one-call create, save intent and native preview request", () => {
    const parsed = manageParticleParameters.safeParse({
      create: {
        identifier: "blockit:engine_smoke",
        preset: "trail",
        texture: "textures/particle/engine_smoke",
      },
      operations: [
        {
          op: "patch",
          path: ["components", "minecraft:emitter_rate_steady", "spawn_rate"],
          value: 18,
        },
      ],
      output: {
        path: "C:\\packs\\example\\particles\\engine_smoke.particle.json",
      },
      preview: true,
    });

    expect(parsed.success).toBe(true);
  });

  test("accepts future component payloads as JSON while keeping authored identity strict", () => {
    const futureComponent = manageParticleParameters.safeParse({
      create: { identifier: "blockit:future" },
      operations: [
        {
          op: "set_component",
          component: "vendor:future_component",
          value: {
            numeric_zero: 0,
            molang: "variable.power * 20",
            nested: [true, null, { future: "value" }],
          },
        },
      ],
    });
    const badIdentifier = manageParticleParameters.safeParse({
      create: { identifier: "Bad Namespace:Particle" },
    });

    expect(futureComponent.success).toBe(true);
    expect(badIdentifier.success).toBe(false);
  });

  test("requires one source form and keeps full inspection opt-in", () => {
    expect(inspectParticleParameters.safeParse({
      source: { content: "{\"particle_effect\":{}}" },
    }).success).toBe(true);
    expect(inspectParticleParameters.safeParse({
      source: {
        path: "/tmp/example.particle.json",
        content: "{\"particle_effect\":{}}",
      },
    }).success).toBe(false);
  });

  test("rejects ambiguous patch payloads before runtime mutation", () => {
    expect(manageParticleParameters.safeParse({
      create: { identifier: "blockit:test" },
      operations: [
        {
          op: "patch",
          path: ["components", "x"],
          remove: true,
          value: {},
        },
      ],
    }).success).toBe(false);

    expect(manageParticleParameters.safeParse({
      create: { identifier: "blockit:test" },
      operations: [
        {
          op: "set_render",
        },
      ],
    }).success).toBe(false);
  });
});

describe("particle reference resource contract", () => {
  test("keeps one lazy resource with bounded sections", () => {
    expect(particleReferenceResourceDocs.map((resource) => resource.name)).toEqual([
      "particle-reference",
    ]);
    expect(PARTICLE_REFERENCE_IDS).toEqual(["components", "curves", "events", "presets", "molang", "workflow"]);
    expect((getParticleReferencePayload("molang") as any).variables["variable.particle_age"]).toBeTruthy();
  });
});

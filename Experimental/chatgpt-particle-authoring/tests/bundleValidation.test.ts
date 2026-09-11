import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  validateParticleBundle,
  validateParticleBundleReferences,
  type JsonObject,
} from "../src";
import { particle } from "./helpers";

function withTexture(document: JsonObject, texture: string): JsonObject {
  const effect = document.particle_effect as JsonObject;
  const description = effect.description as JsonObject;
  description.basic_render_parameters = {
    material: "particles_alpha",
    texture,
  };
  return document;
}

describe("experimental particle bundle preflight", () => {
  test("reports a missing child particle effect", () => {
    const master = particle(
      {},
      {
        start: {
          particle_effect: {
            effect: "test:missing_child",
            type: "emitter",
          },
        },
      },
      "test:master"
    );

    const diagnostics = validateParticleBundleReferences([
      { identifier: "test:master", document: master },
    ]);

    expect(diagnostics.map((entry) => entry.code)).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.missingParticleBundleReference
    );
  });

  test("reports duplicate and mismatched authored identifiers", () => {
    const diagnostics = validateParticleBundle({
      entries: [
        {
          identifier: "test:duplicate",
          document: particle({}, undefined, "test:wrong"),
        },
        {
          identifier: "test:duplicate",
          document: particle({}, undefined, "test:duplicate"),
        },
      ],
    });

    const codes = diagnostics.map((entry) => entry.code);
    expect(codes).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.duplicateParticleBundleIdentifier
    );
    expect(codes).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.particleBundleIdentifierMismatch
    );
  });

  test("reports circular child-effect chains", () => {
    const a = particle(
      {},
      {
        next: {
          particle_effect: { effect: "test:b", type: "emitter" },
        },
      },
      "test:a"
    );
    const b = particle(
      {},
      {
        next: {
          particle_effect: { effect: "test:a", type: "emitter" },
        },
      },
      "test:b"
    );

    const diagnostics = validateParticleBundle({
      entries: [
        { identifier: "test:a", document: a },
        { identifier: "test:b", document: b },
      ],
    });
    expect(diagnostics.map((entry) => entry.code)).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.circularParticleBundleReference
    );
  });

  test("reports orphan entries and unavailable texture paths from a declared root", () => {
    const master = particle(
      {},
      {
        start: {
          particle_effect: { effect: "test:child", type: "emitter" },
        },
      },
      "test:master"
    );
    const child = withTexture(
      particle({}, undefined, "test:child"),
      "textures/particle/missing"
    );
    const orphan = particle({}, undefined, "test:orphan");

    const diagnostics = validateParticleBundle({
      root_identifier: "test:master",
      available_texture_paths: ["textures/particle/available"],
      entries: [
        { identifier: "test:master", document: master },
        { identifier: "test:child", document: child },
        { identifier: "test:orphan", document: orphan },
      ],
    });

    const codes = diagnostics.map((entry) => entry.code);
    expect(codes).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.orphanParticleBundleEntry
    );
    expect(codes).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.missingParticleTextureReference
    );
  });

  test("accepts a resolved acyclic child effect", () => {
    const master = particle(
      {},
      {
        start: {
          particle_effect: { effect: "test:child", type: "emitter" },
        },
      },
      "test:master"
    );
    const child = particle(
      { "minecraft:particle_initial_speed": 4 },
      undefined,
      "test:child"
    );

    expect(
      validateParticleBundle({
        root_identifier: "test:master",
        entries: [
          { identifier: "test:master", document: master },
          { identifier: "test:child", document: child },
        ],
      })
    ).toEqual([]);
  });
});

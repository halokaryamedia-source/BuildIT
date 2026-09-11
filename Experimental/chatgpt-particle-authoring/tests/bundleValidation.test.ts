import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  validateParticleBundleReferences,
} from "../src";
import { particle } from "./helpers";

describe("experimental particle bundle reference preflight", () => {
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

    expect(diagnostics.map((entry) => entry.code)).toEqual([
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.missingParticleBundleReference,
    ]);
  });

  test("reports duplicate authored identifiers before reference resolution", () => {
    const diagnostics = validateParticleBundleReferences([
      {
        identifier: "test:duplicate",
        document: particle({}, undefined, "test:duplicate"),
      },
      {
        identifier: "test:duplicate",
        document: particle({}, undefined, "test:duplicate"),
      },
    ]);

    expect(diagnostics.map((entry) => entry.code)).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.duplicateParticleBundleIdentifier
    );
  });

  test("accepts a resolved child effect", () => {
    const master = particle(
      {},
      {
        start: {
          particle_effect: {
            effect: "test:child",
            type: "emitter",
          },
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
      validateParticleBundleReferences([
        { identifier: "test:master", document: master },
        { identifier: "test:child", document: child },
      ])
    ).toEqual([]);
  });
});

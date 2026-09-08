import { describe, expect, test } from "bun:test";
import {
  applyParticleOperations,
  createParticleDocument,
  inspectParticleDocument,
  parseParticleDocument,
  particleDocumentIsValid,
  serializeParticleDocument,
} from "../lib/bedrockParticleDocument";

describe("Bedrock particle document", () => {
  test("creates a bounded valid baseline without requiring a large preset surface", () => {
    const document = createParticleDocument({
      identifier: "blockit:test_smoke",
      preset: "steady",
      texture: "textures/particle/test_smoke",
    });
    const summary = inspectParticleDocument(document);

    expect(summary.identifier).toBe("blockit:test_smoke");
    expect(summary.texture).toBe("textures/particle/test_smoke");
    expect(summary.components).toContain("minecraft:emitter_rate_steady");
    expect(summary.components).toContain("minecraft:particle_appearance_billboard");
    expect(particleDocumentIsValid(document)).toBe(true);
  });

  test("targeted patch preserves unknown components, events, curves and explicit zero values", () => {
    const source = parseParticleDocument(JSON.stringify({
      format_version: "1.10.0",
      future_top_level: { keep: 0 },
      particle_effect: {
        description: {
          identifier: "blockit:future_particle",
          basic_render_parameters: {
            material: "particles_alpha",
            texture: "textures/particle/future",
            future_render_flag: 0,
          },
        },
        curves: {
          "variable.custom_curve": {
            type: "linear",
            input: "variable.particle_age",
            horizontal_range: 1,
            nodes: [0, 1],
          },
        },
        events: {
          keep_me: { expression: "variable.keep = 0;" },
        },
        components: {
          "minecraft:emitter_rate_steady": {
            spawn_rate: 100,
            max_particles: 64,
            future_rate_field: 0,
          },
          "minecraft:particle_lifetime_expression": { max_lifetime: 1 },
          "minecraft:particle_appearance_billboard": {
            size: [0.1, 0.1],
            facing_camera_mode: "rotate_xyz",
          },
          "vendor:future_component": {
            explicit_zero: 0,
            nested: { preserve: true },
          },
        },
      },
    }));

    const next = applyParticleOperations(source, [
      {
        op: "patch",
        path: ["components", "minecraft:emitter_rate_steady", "spawn_rate"],
        value: 50,
      },
    ]);

    const effect = next.particle_effect as Record<string, any>;
    expect(effect.components["minecraft:emitter_rate_steady"]).toEqual({
      spawn_rate: 50,
      max_particles: 64,
      future_rate_field: 0,
    });
    expect(effect.components["vendor:future_component"]).toEqual({
      explicit_zero: 0,
      nested: { preserve: true },
    });
    expect(effect.events.keep_me).toEqual({ expression: "variable.keep = 0;" });
    expect((next.future_top_level as Record<string, unknown>).keep).toBe(0);
  });

  test("detects mutually exclusive emitter modes and unresolved local events", () => {
    const document = createParticleDocument({ identifier: "blockit:conflict" });
    const next = applyParticleOperations(document, [
      {
        op: "set_component",
        component: "minecraft:emitter_rate_instant",
        value: { num_particles: 4 },
      },
      {
        op: "set_component",
        component: "minecraft:particle_lifetime_events",
        value: { expiration_event: "missing_event" },
      },
    ]);
    const summary = inspectParticleDocument(next);

    expect(summary.diagnostics.some((entry) => entry.code === "multiple_emitter_rates")).toBe(true);
    expect(summary.diagnostics.some((entry) => entry.code === "missing_local_event")).toBe(true);
    expect(particleDocumentIsValid(next)).toBe(false);
  });

  test("preserves nested particle dependencies and warns on self recursion", () => {
    const document = createParticleDocument({ identifier: "blockit:self" });
    const next = applyParticleOperations(document, [
      {
        op: "set_event",
        name: "again",
        value: {
          randomize: [
            {
              weight: 1,
              particle_effect: { effect: "blockit:self", type: "emitter" },
            },
            { weight: 1 },
          ],
        },
      },
    ]);
    const summary = inspectParticleDocument(next);

    expect(summary.nested_particle_effects).toEqual(["blockit:self"]);
    expect(summary.diagnostics.some((entry) => entry.code === "self_recursive_particle_event")).toBe(true);
  });

  test("diagnoses malformed known shapes, curve contracts and event nodes without rejecting future fields", () => {
    const document = createParticleDocument({ identifier: "blockit:diagnostics" });
    const next = applyParticleOperations(document, [
      {
        op: "set_component",
        component: "minecraft:particle_appearance_billboard",
        value: { size: [1, 2, 3], facing_camera_mode: "future_mode" },
      },
      {
        op: "set_curve",
        name: "bad_curve_name",
        value: { type: "linear", nodes: [0, 1] },
      },
      {
        op: "set_event",
        name: "bad_event",
        value: { particle_effect: { type: "future_type" } },
      },
      {
        op: "set_component",
        component: "vendor:future_component",
        value: { preserved: true },
      },
    ]);
    const summary = inspectParticleDocument(next);

    expect(summary.diagnostics.some((entry) => entry.code === "invalid_billboard_size")).toBe(true);
    expect(summary.diagnostics.some((entry) => entry.code === "unknown_billboard_facing_mode")).toBe(true);
    expect(summary.diagnostics.some((entry) => entry.code === "curve_name_not_variable")).toBe(true);
    expect(summary.diagnostics.some((entry) => entry.code === "curve_input_missing")).toBe(true);
    expect(summary.diagnostics.some((entry) => entry.code === "particle_event_effect_missing")).toBe(true);
    expect(summary.diagnostics.some((entry) => entry.code === "unknown_particle_event_type")).toBe(true);
    expect(summary.component_groups.unknown).toContain("vendor:future_component");
  });

  test("serializes stable JSON without dropping zero values", () => {
    const document = createParticleDocument({ identifier: "blockit:zero" });
    const next = applyParticleOperations(document, [
      {
        op: "set_component",
        component: "vendor:test",
        value: { zero: 0, off: false, nil: null },
      },
    ]);
    const roundTrip = parseParticleDocument(serializeParticleDocument(next));
    const effect = roundTrip.particle_effect as Record<string, any>;

    expect(effect.components["vendor:test"]).toEqual({ zero: 0, off: false, nil: null });
  });
});

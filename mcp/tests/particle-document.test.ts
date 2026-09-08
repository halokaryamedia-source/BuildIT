import { describe, expect, test } from "bun:test";
import {
  applyParticleOperations,
  createParticleDocument,
  inspectParticleDocument,
  parseParticleDocument,
  serializeParticleDocument,
} from "../lib/bedrockParticleDocument";

describe("Bedrock particle document", () => {
  test("creates a minimal valid Bedrock particle document", () => {
    const document = createParticleDocument({ identifier: "blockit:test_particle" });
    expect(document).toEqual({
      format_version: "1.10.0",
      particle_effect: {
        description: {
          identifier: "blockit:test_particle",
          basic_render_parameters: {
            material: "particles_alpha",
            texture: "textures/particle/particles",
          },
        },
        components: {},
      },
    });
    expect(inspectParticleDocument(document).diagnostics).toEqual([]);
  });

  test("preserves unknown fields while applying targeted component mutations", () => {
    const source = parseParticleDocument({
      format_version: "1.10.0",
      future_root: { retained: true },
      particle_effect: {
        description: {
          identifier: "demo:trail",
          basic_render_parameters: {
            material: "particles_alpha",
            texture: "textures/particle/custom",
            future_render_flag: "keep-me",
          },
        },
        future_effect_block: { exact: [1, 2, 3] },
        components: {
          "minecraft:particle_lifetime_expression": { max_lifetime: 2 },
          "vendor:future_component": { enabled: true, threshold: 0 },
        },
      },
    });

    const next = applyParticleOperations(source, [
      {
        op: "set_component",
        component: "minecraft:emitter_rate_steady",
        value: { spawn_rate: "variable.power * 20", max_particles: 128 },
      },
    ]);

    expect(next.future_root).toEqual({ retained: true });
    expect(next.particle_effect.future_effect_block).toEqual({ exact: [1, 2, 3] });
    expect(next.particle_effect.description.basic_render_parameters.future_render_flag).toBe("keep-me");
    expect(next.particle_effect.components?.["vendor:future_component"]).toEqual({ enabled: true, threshold: 0 });
    expect(source.particle_effect.components?.["minecraft:emitter_rate_steady"]).toBeUndefined();
  });

  test("supports curves, nested particle events, Molang and compact inspection", () => {
    let document = createParticleDocument({ identifier: "demo:drops" });
    document = applyParticleOperations(document, [
      {
        op: "set_component",
        component: "minecraft:emitter_shape_point",
        value: { offset: ["math.random(-2, 2)", 5, "math.random(-2, 2)"] },
      },
      {
        op: "set_curve",
        name: "variable.alpha_curve",
        value: {
          type: "linear",
          input: "variable.particle_age / variable.particle_lifetime",
          horizontal_range: 1,
          nodes: [1, 0],
        },
      },
      {
        op: "set_event",
        name: "expire",
        value: {
          randomize: [
            {
              weight: 2,
              particle_effect: { effect: "demo:drop_splash", type: "emitter" },
            },
            { weight: 1 },
          ],
        },
      },
    ]);

    const inspection = inspectParticleDocument(document);
    expect(inspection.component_names).toEqual(["minecraft:emitter_shape_point"]);
    expect(inspection.curve_names).toEqual(["variable.alpha_curve"]);
    expect(inspection.event_names).toEqual(["expire"]);
    expect(inspection.nested_particle_effects).toEqual(["demo:drop_splash"]);
    expect(inspection.molang_expression_count).toBeGreaterThanOrEqual(3);
  });

  test("rejects duplicate targets and destructive no-ops in a bounded batch", () => {
    const document = createParticleDocument({ identifier: "demo:test" });
    expect(() =>
      applyParticleOperations(document, [
        { op: "set_identifier", identifier: "demo:renamed" },
        { op: "set_identifier", identifier: "demo:renamed_again" },
      ])
    ).toThrow("more than once");

    expect(() =>
      applyParticleOperations(document, [{ op: "set_identifier", identifier: "demo:test" }])
    ).toThrow("destructive no-op");
  });

  test("serializes finite JSON and keeps explicit zero values", () => {
    let document = createParticleDocument({ identifier: "demo:zero" });
    document = applyParticleOperations(document, [
      {
        op: "set_component",
        component: "minecraft:particle_motion_dynamic",
        value: { linear_drag_coefficient: 0, linear_acceleration: [0, -9.8, 0] },
      },
    ]);
    const serialized = serializeParticleDocument(document);
    expect(serialized).toContain('"linear_drag_coefficient": 0');
    expect(serialized.endsWith("\n")).toBe(true);
  });
});

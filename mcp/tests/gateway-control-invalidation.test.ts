import { describe, expect, test } from "bun:test";
import { buildNavigatorDelta } from "@/gateway/navigator";

describe("LazyDesigner Control minimum invalidation", () => {
  test("local cube transform does not reset unrelated Texture or Animation", () => {
    const delta = buildNavigatorDelta({
      capability: "manage_cubes",
      phaseBefore: null,
      phaseAfter: null,
      projectUuid: "project-a",
      succeeded: true,
      result: {
        geometry_effect: {
          changed_fields: ["rotation", "origin"],
        },
      },
    });

    expect(delta.invalidates.authoring_domains).toEqual(["GEOMETRY"]);
  });

  test("shape or UV-sensitive cube changes invalidate dependent Texture and Animation knowledge", () => {
    const delta = buildNavigatorDelta({
      capability: "manage_cubes",
      phaseBefore: null,
      phaseAfter: null,
      projectUuid: "project-a",
      succeeded: true,
      result: {
        effects: [
          {
            geometry_effect: {
              changed_fields: ["from", "to"],
            },
          },
        ],
      },
    });

    expect(delta.invalidates.authoring_domains).toEqual([
      "GEOMETRY",
      "TEXTURING",
      "ANIMATION",
    ]);
  });

  test("hierarchy changes invalidate Geometry and Animation but preserve Texture by default", () => {
    const delta = buildNavigatorDelta({
      capability: "reparent_element",
      phaseBefore: null,
      phaseAfter: null,
      projectUuid: "project-a",
      succeeded: true,
    });

    expect(delta.invalidates.authoring_domains).toEqual([
      "GEOMETRY",
      "ANIMATION",
    ]);
  });

  test("paint/material changes invalidate only Texture knowledge", () => {
    for (const capability of ["paint_with_brush", "manage_material"] as const) {
      const delta = buildNavigatorDelta({
        capability,
        phaseBefore: null,
        phaseAfter: null,
        projectUuid: "project-a",
        succeeded: true,
      });
      expect(delta.invalidates.authoring_domains, capability).toEqual(["TEXTURING"]);
    }
  });

  test("animation changes invalidate only Animation knowledge", () => {
    const delta = buildNavigatorDelta({
      capability: "manage_animation_timeline",
      phaseBefore: null,
      phaseAfter: null,
      projectUuid: "project-a",
      succeeded: true,
    });
    expect(delta.invalidates.authoring_domains).toEqual(["ANIMATION"]);
  });

  test("unknown Geometry mutation receipt fails safe instead of pretending precision", () => {
    const delta = buildNavigatorDelta({
      capability: "manage_cubes",
      phaseBefore: null,
      phaseAfter: null,
      projectUuid: "project-a",
      succeeded: true,
    });
    expect(delta.invalidates.authoring_domains).toEqual([
      "GEOMETRY",
      "TEXTURING",
      "ANIMATION",
    ]);
  });
});

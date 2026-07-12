import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { geometryFreshnessPayload } from "../src/lib/geometryFreshness";

const read = (path: string) => readFileSync(path, "utf8");

function cube(parent: any = "root") {
  return {
    uuid: "cube-1",
    name: "body",
    from: [0, 0, 0],
    to: [4, 2, 2],
    origin: [0, 0, 0],
    rotation: [0, 0, 0],
    inflate: 0,
    visibility: true,
    parent,
  };
}

describe("Geometry transformed-world freshness", () => {
  test("changes when a parent group rotation changes world-space corners", () => {
    const parentA = {
      uuid: "group-1",
      name: "root_group",
      origin: [0, 0, 0],
      rotation: [0, 0, 0],
      visibility: true,
      parent: "root" as const,
    };
    const parentB = {
      ...parentA,
      rotation: [0, 90, 0],
    };

    const before = geometryFreshnessPayload({
      cubes: [cube(parentA)],
      groups: [parentA],
    });
    const after = geometryFreshnessPayload({
      cubes: [cube(parentB)],
      groups: [parentB],
    });

    expect(after).not.toEqual(before);
    expect((after.cubes as any[])[0].transformed_corners).not.toEqual(
      (before.cubes as any[])[0].transformed_corners
    );
  });

  test("changes for hierarchy, visibility, and mesh-structure changes", () => {
    const baseGroup = {
      uuid: "group-1",
      name: "root_group",
      origin: [0, 0, 0],
      rotation: [0, 0, 0],
      visibility: true,
      parent: "root" as const,
    };
    const base = geometryFreshnessPayload({
      cubes: [cube(baseGroup)],
      groups: [baseGroup],
      meshes: [
        {
          uuid: "mesh-1",
          name: "mesh",
          origin: [0, 0, 0],
          rotation: [0, 0, 0],
          visibility: true,
          parent: baseGroup,
          vertices: { a: [0, 0, 0], b: [1, 0, 0], c: [0, 1, 0] },
          faces: { face: { vertices: ["a", "b", "c"] } },
        },
      ],
    });

    const changed = geometryFreshnessPayload({
      cubes: [cube({ ...baseGroup, visibility: false })],
      groups: [
        { ...baseGroup, visibility: false, parent: { uuid: "new-parent" } },
      ],
      meshes: [
        {
          uuid: "mesh-1",
          name: "mesh",
          origin: [0, 0, 0],
          rotation: [0, 0, 0],
          visibility: true,
          parent: baseGroup,
          vertices: { a: [0, 0, 0], b: [2, 0, 0], c: [0, 1, 0] },
          faces: { face: { vertices: ["a", "b", "c"] } },
        },
      ],
    });

    expect(changed).not.toEqual(base);
  });

  test("binds analyzer output and guards every review/revision/approval route", () => {
    const guards = read("src/server/geometry-freshness-guards.ts");
    for (const marker of [
      "geometry_world_signature",
      "transformed_geometry_v1",
      "GEOMETRY_WORLD_SIGNATURE_MISSING",
      "GEOMETRY_WORLD_SIGNATURE_STALE",
      "record_geometry_visual_decision",
      "prepare_geometry_visual_rebuild",
      "verify_geometry_review_ready",
      "submit_geometry_for_review",
      "complete_geometry_stage",
      "validate_geometry_contract",
    ]) {
      expect(guards).toContain(marker);
    }
    expect(guards).toContain("analyzer.annotations.readOnlyHint = false");
  });

  test("installs freshness guards before profile and write-lease wrappers", () => {
    const tools = read("src/server/tools.ts");
    const freshness = tools.indexOf("installGeometryFreshnessGuards();");
    const profiles = tools.indexOf("initializeToolProfiles();");
    expect(freshness).toBeGreaterThan(-1);
    expect(profiles).toBeGreaterThan(freshness);
  });

  test("documents that canonical analyzer output is a persistent lease-owned write", () => {
    const skill = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    const agents = read("../AGENTS.md");
    expect(skill).toContain("analyze_geometry_views` persists canonical metrics");
    expect(skill).toContain("transformed world-space signature");
    expect(agents).toContain(
      "`analyze_geometry_views` persists canonical evidence and therefore requires"
    );
  });
});

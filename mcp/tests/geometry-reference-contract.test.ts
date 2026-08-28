import { describe, expect, test } from "bun:test";
import {
  BLOCKIT_ROUTE1_REFERENCE_PREFIX,
  manageGeometryReferenceParameters,
  projectToolDocs,
  route1ReferenceYawDegrees,
  summarizeRoute1WorldBounds,
} from "@/server/tools/project";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Route 1 geometry reference contract", () => {
  test("accepts one local GLB load contract and rejects broader importer semantics", () => {
    expect(
      manageGeometryReferenceParameters.safeParse({
        action: "load",
        path: "/tmp/elephant.glb",
        source_front_direction: "+z",
        origin: [0, 0, 0],
        uniform_scale: 1,
      }).success
    ).toBe(true);

    for (const invalid of [
      { action: "load", path: "elephant.glb", source_front_direction: "+z" },
      { action: "load", path: "/tmp/elephant.gltf", source_front_direction: "+z" },
      { action: "load", path: "/tmp/elephant.glb" },
      { action: "load", path: "/tmp/elephant.glb", source_front_direction: "+x" },
    ]) {
      expect(manageGeometryReferenceParameters.safeParse(invalid).success).toBe(false);
    }
  });

  test("update and remove are bounded to the existing transient reference", () => {
    expect(
      manageGeometryReferenceParameters.safeParse({
        action: "update",
        id: "reference-uuid",
        wireframe: true,
      }).success
    ).toBe(true);
    expect(
      manageGeometryReferenceParameters.safeParse({
        action: "update",
        id: "reference-uuid",
      }).success
    ).toBe(false);
    expect(
      manageGeometryReferenceParameters.safeParse({
        action: "remove",
        id: "reference-uuid",
      }).success
    ).toBe(true);
    expect(
      manageGeometryReferenceParameters.safeParse({
        action: "remove",
        id: "reference-uuid",
        visibility: false,
      }).success
    ).toBe(false);
  });

  test("front registration is deterministic for the Route 1 +Z/-Z contract", () => {
    expect(route1ReferenceYawDegrees("+z", "+z")).toBe(0);
    expect(route1ReferenceYawDegrees("-z", "-z")).toBe(0);
    expect(route1ReferenceYawDegrees("+z", "-z")).toBe(180);
    expect(route1ReferenceYawDegrees("-z", "+z")).toBe(180);
  });

  test("summarizes finite raw world bounds without promoting them to target dimensions", () => {
    const summary = summarizeRoute1WorldBounds(
      [-16, 0, -8],
      [16, 32, 8],
      16
    );

    expect(summary.bounds_basis).toBe("raw_reference_world_aabb");
    expect(summary.world_bounds.center).toEqual([0, 16, 0]);
    expect(summary.world_bounds.size_xyz).toEqual([32, 32, 16]);
    expect(summary.dimensions_blockbench_units).toEqual({
      width: 32,
      height: 32,
      length: 16,
    });
    expect(summary.dimensions_blocks).toEqual({
      width: 2,
      height: 2,
      length: 1,
    });

    expect(() =>
      summarizeRoute1WorldBounds([0, 0, 0], [0, 1, 1], 16)
    ).toThrow("positive finite 3D span");
    expect(() =>
      summarizeRoute1WorldBounds([0, 0, 0], [1, 1, 1], 0)
    ).toThrow("block size must be finite and positive");
  });

  test("tool stays Geometry evidence rather than mesh conversion", () => {
    const tool = projectToolDocs.find(
      (entry) => entry.name === "manage_geometry_reference"
    );
    expect(tool).toBeDefined();
    expect(tool?.status).toBe("experimental");
    expect(tool?.description).toContain("transient 3D evidence");
    expect(tool?.description).toContain("never converts mesh triangles");
    expect(BLOCKIT_ROUTE1_REFERENCE_PREFIX).toBe("blockit_route1__");
  });

  test("runtime owner is root-only, fail-closed, transient, and evidence-bearing", async () => {
    const project = await source("server/tools/project.ts");
    expect(project).toContain("types?.reference_model");
    expect(project).toContain('reference.addTo("root")');
    expect(project).toContain("locked: true");
    expect(project).toContain("export: false");
    expect(project).toContain("await waitForReferenceLoad(reference)");
    expect(project).toContain("Undo.cancelEdit(true)");
    expect(project).toContain("v1 supports one active Route 1 reference");
    expect(project).toContain(
      "new THREE.Box3().setFromObject(reference.mesh, true)"
    );
    expect(project).toContain('bounds_basis: "raw_reference_world_aabb"');
    expect(project).toContain("dimensions_blockbench_units");
    expect(project).toContain("dimensions_blocks");
    expect(project).toContain("triangle_count");
    expect(project).toContain("readRoute1ReferenceEvidence(reference);");
    expect(project).toContain("reference_only: true");
    expect(project).toContain("production_geometry: false");
    expect(project).not.toContain("voxelize");
    expect(project).not.toContain("decimat");
  });
});

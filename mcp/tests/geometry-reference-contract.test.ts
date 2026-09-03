import { describe, expect, test } from "bun:test";
import {
  BLOCKIT_THREE_D_ASSISTED_REFERENCE_PREFIX,
  assertThreeDAssistedReferenceInvariant,
  isBlockItThreeDAssistedReference,
  manageGeometryReferenceParameters,
  projectToolDocs,
  threeDAssistedReferenceYawDegrees,
  summarizeThreeDAssistedWorldBounds,
} from "@/server/tools/project";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("3D-Assisted geometry reference contract", () => {
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

  test("front registration is deterministic for the 3D-Assisted +Z/-Z contract", () => {
    expect(threeDAssistedReferenceYawDegrees("+z", "+z")).toBe(0);
    expect(threeDAssistedReferenceYawDegrees("-z", "-z")).toBe(0);
    expect(threeDAssistedReferenceYawDegrees("+z", "-z")).toBe(180);
    expect(threeDAssistedReferenceYawDegrees("-z", "+z")).toBe(180);
  });

  test("summarizes finite raw world bounds without promoting them to target dimensions", () => {
    const summary = summarizeThreeDAssistedWorldBounds(
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
      summarizeThreeDAssistedWorldBounds([0, 0, 0], [0, 1, 1], 16)
    ).toThrow("positive finite 3D span");
    expect(() =>
      summarizeThreeDAssistedWorldBounds([0, 0, 0], [1, 1, 1], 0)
    ).toThrow("block size must be finite and positive");
  });

  test("runtime ownership survives rename while lifecycle invariants fail closed", () => {
    const owned = {
      type: "reference_model",
      name: "renamed-reference",
      three_d_assisted_owned: true,
      parent: "root",
      locked: true,
      export: false,
      scale: [1, 1, 1],
    } as any;
    expect(isBlockItThreeDAssistedReference(owned)).toBe(true);
    expect(() => assertThreeDAssistedReferenceInvariant(owned)).not.toThrow();

    expect(() =>
      assertThreeDAssistedReferenceInvariant({ ...owned, parent: {} } as any)
    ).toThrow("must remain at the outliner root");
    expect(() =>
      assertThreeDAssistedReferenceInvariant({ ...owned, locked: false } as any)
    ).toThrow("must remain locked");
    expect(() =>
      assertThreeDAssistedReferenceInvariant({ ...owned, export: true } as any)
    ).toThrow("must remain export=false");
    expect(() =>
      assertThreeDAssistedReferenceInvariant({ ...owned, scale: [1, 2, 1] } as any)
    ).toThrow("uniform positive scale");
  });

  test("tool stays Geometry evidence rather than mesh conversion", () => {
    const tool = projectToolDocs.find(
      (entry) => entry.name === "manage_geometry_reference"
    );
    expect(tool).toBeDefined();
    expect(tool?.status).toBe("experimental");
    expect(tool?.description).toContain("3D-Assisted Evidence");
    expect(tool?.description).toContain("never converts mesh triangles");
    expect(BLOCKIT_THREE_D_ASSISTED_REFERENCE_PREFIX).toBe("blockit_3d_assisted__");
  });

  test("runtime owner is root-only, fail-closed, transient, and evidence-bearing", async () => {
    const project = await source("server/tools/project.ts");
    expect(project).toContain("types?.reference_model");
    expect(project).toContain('reference.addTo("root")');
    expect(project).toContain("reference.three_d_assisted_owned = true");
    expect(project).toContain("locked: true");
    expect(project).toContain("export: false");
    expect(project).toContain("assertThreeDAssistedReferenceInvariant(reference)");
    expect(project).toContain("await waitForReferenceLoad(reference)");
    expect(project).toContain("Undo.cancelEdit(true)");
    expect(project).toContain("v1 supports one active 3D-Assisted Evidence reference");
    expect(project).toContain(
      "new THREE.Box3().setFromObject(reference.mesh, true)"
    );
    expect(project).toContain('bounds_basis: "raw_reference_world_aabb"');
    expect(project).toContain("dimensions_blockbench_units");
    expect(project).toContain("dimensions_blocks");
    expect(project).toContain("triangle_count");
    expect(project).toContain("readThreeDAssistedReferenceEvidence(reference);");
    expect(project).toContain("reference_only: true");
    expect(project).toContain("production_geometry: false");
    expect(project).not.toContain("threeDAssistedReferenceRegistry");
    expect(project).not.toContain("voxelize");
    expect(project).not.toContain("decimat");
  });

  test("existing reference_models resource preserves 3D-Assisted reconnect evidence", async () => {
    const resource = await source("server/resources.ts");
    expect(resource).toContain("isBlockItThreeDAssistedReference");
    expect(resource).toContain("readThreeDAssistedReferenceEvidence");
    expect(resource).toContain("recoverThreeDAssistedAlignment");
    expect(resource).toContain("three_d_assisted_owned: threeDAssistedOwned");
    expect(resource).toContain("reference_only: threeDAssistedOwned ? true : null");
    expect(resource).toContain("production_geometry: threeDAssistedOwned ? false : null");
    expect(resource).toContain("alignment: threeDAssistedOwned ? recoverThreeDAssistedAlignment(refModel) : null");
    expect(resource).toContain("threeDAssistedOwned && loaded");
    expect(resource).toContain("readThreeDAssistedReferenceEvidence(refModel)");
    expect(resource).not.toContain("threeDAssistedReferenceRegistry");
  });
});

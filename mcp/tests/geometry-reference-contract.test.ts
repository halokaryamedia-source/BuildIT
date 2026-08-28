import { describe, expect, test } from "bun:test";
import {
  BLOCKIT_ROUTE1_REFERENCE_PREFIX,
  manageGeometryReferenceParameters,
  projectToolDocs,
  route1ReferenceYawDegrees,
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

  test("runtime owner is root-only, fail-closed, and transient", async () => {
    const project = await source("server/tools/project.ts");
    expect(project).toContain("types?.reference_model");
    expect(project).toContain('reference.addTo("root")');
    expect(project).toContain("locked: true");
    expect(project).toContain("export: false");
    expect(project).toContain("await waitForReferenceLoad(reference)");
    expect(project).toContain("Undo.cancelEdit(true)");
    expect(project).toContain("v1 supports one active Route 1 reference");
    expect(project).not.toContain("voxelize");
    expect(project).not.toContain("decimat");
  });
});

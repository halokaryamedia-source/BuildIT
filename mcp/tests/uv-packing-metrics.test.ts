import { expect, test } from "bun:test";
import { buildUvAtlasAudit } from "@/server/tools/texture";

const face = (uv: [number, number, number, number]) => ({
  cube_uuid: "cube", cube_name: "cube", face: "north", uv,
  box_uv: false, autouv: 0, mirror_uv: false, face_rotation: 0,
});
test("packing measures union, not sum, including reversed UV and clipped occupancy", () => {
  const audit = buildUvAtlasAudit([
    face([0, 0, 4, 4]), face([4, 4, 0, 0]),
    face([2, 2, 6, 6]), face([7, 7, 10, 10]),
  ], 8, 8);
  expect(audit.state).toBe("available");
  if (audit.state !== "available") throw new Error("audit unavailable");
  expect(audit.packing.face_area).toBe(57);
  expect(audit.packing.occupied_area).toBe(29);
  expect(audit.packing.occupancy_ratio).toBe(29 / 64);
  expect(audit.packing.occupied_size).toEqual([8, 8]);
  expect(audit.packing.padding).toBe("unverified");
  expect(audit.out_of_bounds.count).toBe(1);
});
test("empty and fractional layouts retain meaningful area and bounds", () => {
  const empty = buildUvAtlasAudit([], 16, 16);
  if (empty.state !== "available") throw new Error("audit unavailable");
  expect(empty.packing.occupied_bounds).toBeNull();
  expect(empty.packing.occupancy_ratio).toBe(0);
  const fractional = buildUvAtlasAudit([face([1.5, 2, 2, 3])], 16, 16);
  if (fractional.state !== "available") throw new Error("audit unavailable");
  expect(fractional.packing.occupied_area).toBe(0.5);
  expect(fractional.packing.occupied_size).toEqual([0.5, 1]);
});

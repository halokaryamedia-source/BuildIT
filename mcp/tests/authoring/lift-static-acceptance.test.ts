import { describe, expect, test } from "bun:test";
import { buildUvAtlasAudit, type UvAtlasUsage } from "@/server/tools/texture";

const MODEL_PATH = "../workspace/active/lift/lift.bbmodel";
const GEO_PATH = "../workspace/active/lift/lift.geo.json";
const ANIMATION_PATH = "../workspace/active/lift/lift.animation.json";
const REFERENCE_PATHS = [
  "../workspace/active/lift/references/approved-reference.png",
  "../workspace/active/lift/references/window-detail.png",
] as const;
const FACE_KEYS = ["north", "south", "east", "west", "up", "down"] as const;

type JsonObject = Record<string, any>;

type GroupNode = {
  name: string;
  uuid: string;
  origin?: number[];
  children?: unknown[];
};

async function json(path: string): Promise<JsonObject> {
  return Bun.file(path).json() as Promise<JsonObject>;
}

function collectGroups(nodes: unknown[]): GroupNode[] {
  const groups: GroupNode[] = [];
  const visit = (value: unknown): void => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    const node = value as JsonObject;
    if (typeof node.name === "string" && typeof node.uuid === "string" && Array.isArray(node.children)) {
      groups.push(node as GroupNode);
      for (const child of node.children) visit(child);
    }
  };
  for (const node of nodes) visit(node);
  return groups;
}

function requireNamedGroup(groups: GroupNode[], name: string): GroupNode {
  const group = groups.find((candidate) => candidate.name === name);
  expect(group, `Missing Lift group ${name}.`).toBeDefined();
  return group!;
}

function modelBounds(elements: JsonObject[]) {
  const mins = [0, 1, 2].map((axis) =>
    Math.min(...elements.map((element) => Number(element.from[axis])))
  );
  const maxs = [0, 1, 2].map((axis) =>
    Math.max(...elements.map((element) => Number(element.to[axis])))
  );
  return {
    min: mins,
    max: maxs,
    size: maxs.map((value, axis) => value - mins[axis]),
  };
}

function uvUsages(elements: JsonObject[]): UvAtlasUsage[] {
  const usages: UvAtlasUsage[] = [];
  for (const cube of elements) {
    const size = [0, 1, 2].map((axis) => Number(cube.to[axis]) - Number(cube.from[axis]));
    for (const faceKey of FACE_KEYS) {
      const face = cube.faces?.[faceKey] as JsonObject | undefined;
      if (!face || face.texture === null || face.texture === undefined) continue;
      const axes =
        faceKey === "up" || faceKey === "down"
          ? [0, 2]
          : faceKey === "east" || faceKey === "west"
            ? [2, 1]
            : [0, 1];
      usages.push({
        cube_uuid: String(cube.uuid),
        cube_name: String(cube.name),
        face: faceKey,
        uv: (face.uv as number[]).map(Number),
        box_uv: cube.box_uv === true,
        autouv: Number(cube.autouv ?? 0),
        mirror_uv: cube.mirror_uv === true,
        face_rotation: Number(face.rotation ?? 0),
        surface_area: Math.abs(size[axes[0]] * size[axes[1]]),
      });
    }
  }
  return usages;
}

function nativePositionEndpoints(animation: JsonObject, groupUuid: string): [number, number] {
  const animator = animation.animators?.[groupUuid] as JsonObject | undefined;
  expect(animator, `Missing native animator ${groupUuid}.`).toBeDefined();
  const frames = ((animator!.keyframes ?? []) as JsonObject[])
    .filter((frame) => frame.channel === "position")
    .sort((a, b) => Number(a.time) - Number(b.time));
  expect(frames.length).toBe(2);
  const x = (frame: JsonObject) => Number(frame.data_points?.[0]?.x ?? 0);
  return [x(frames[0]), x(frames[1])];
}

function exportedEndpoints(animation: JsonObject, bone: string): [number, number] {
  const position = animation.bones?.[bone]?.position as Record<string, number[]> | undefined;
  expect(position, `Missing exported ${bone} position curve.`).toBeDefined();
  const times = Object.keys(position!).sort((a, b) => Number(a) - Number(b));
  return [Number(position![times[0]][0]), Number(position![times[times.length - 1]][0])];
}

describe("Lift committed static acceptance", () => {
  test("pins the approved editable asset structure before any live session", async () => {
    const model = await json(MODEL_PATH);
    const elements = model.elements as JsonObject[];
    const textures = model.textures as JsonObject[];
    const groups = collectGroups((model.outliner ?? []) as unknown[]);

    expect(model.meta?.model_format).toBe("bedrock");
    expect(model.resolution).toEqual({ width: 1024, height: 1024 });
    expect(elements.length).toBe(40);
    expect(new Set(elements.map((element) => element.uuid)).size).toBe(40);
    expect(elements.every((element) => element.type === "cube" && element.export !== false)).toBe(true);
    expect(modelBounds(elements)).toEqual({
      min: [-40, 0, -48],
      max: [40, 80, 48],
      size: [80, 80, 96],
    });

    expect(textures.length).toBe(1);
    expect(textures[0].uuid).toBe("c0826723-15e2-fd4b-4b2e-6d447cb0d434");
    expect(textures[0].width).toBe(1024);
    expect(textures[0].height).toBe(1024);
    expect(textures[0].uv_width).toBe(1024);
    expect(textures[0].uv_height).toBe(1024);
    expect(String(textures[0].source)).toMatch(/^data:image\/png;base64,/);

    const expectedGroups = [
      "lift",
      "cabin",
      "facade",
      "door_left",
      "door_right",
      "interior_fittings",
      "window_left",
    ];
    for (const name of expectedGroups) requireNamedGroup(groups, name);
    expect(requireNamedGroup(groups, "door_left").origin).toEqual([-27, 4, 43]);
    expect(requireNamedGroup(groups, "door_right").origin).toEqual([27, 4, 43]);

    for (const element of elements) {
      for (const faceKey of FACE_KEYS) {
        const face = element.faces?.[faceKey] as JsonObject | undefined;
        expect(face, `${element.name}.${faceKey}`).toBeDefined();
        expect(face!.texture).toBe(0);
        expect(Array.isArray(face!.uv) && face!.uv.length === 4).toBe(true);
        expect((face!.uv as unknown[]).every((value) => Number.isFinite(Number(value)))).toBe(true);
      }
    }

    for (const reference of REFERENCE_PATHS) {
      const file = Bun.file(reference);
      expect(await file.exists(), reference).toBe(true);
      expect(file.size).toBeGreaterThan(0);
    }
  });

  test("precomputes the documented UV footprint without promoting it to visual or native PASS", async () => {
    const model = await json(MODEL_PATH);
    const usages = uvUsages(model.elements as JsonObject[]);
    expect(usages.length).toBe(240);

    const audit = buildUvAtlasAudit(usages, 1024, 1024);
    expect(audit.state).toBe("available");
    if (audit.state !== "available") return;
    expect(audit.invalid_uv.count).toBe(0);
    expect(audit.fractional_uv.count).toBe(0);
    expect(audit.packing.occupied_area).toBe(115456);
    expect(audit.packing.occupied_size).toEqual([512, 516]);
    expect(audit.packing.occupancy_ratio).toBeCloseTo(0.110107421875, 12);
    expect(audit.packing.padding).toBe("unverified");
  });

  test("geometry and animation exports correspond to the committed Blockbench source", async () => {
    const [model, geo, exported] = await Promise.all([
      json(MODEL_PATH),
      json(GEO_PATH),
      json(ANIMATION_PATH),
    ]);
    const groups = collectGroups((model.outliner ?? []) as unknown[]);
    const doorLeft = requireNamedGroup(groups, "door_left");
    const doorRight = requireNamedGroup(groups, "door_right");

    const geometry = geo["minecraft:geometry"]?.[0] as JsonObject;
    expect(geometry.description?.texture_width).toBe(1024);
    expect(geometry.description?.texture_height).toBe(1024);
    const bones = geometry.bones as JsonObject[];
    expect(bones.reduce((sum, bone) => sum + ((bone.cubes ?? []) as unknown[]).length, 0)).toBe(40);
    const geoLeft = bones.find((bone) => bone.name === "door_left")!;
    const geoRight = bones.find((bone) => bone.name === "door_right")!;
    expect(geoLeft.pivot).toEqual([27, 4, 43]);
    expect(geoRight.pivot).toEqual([-27, 4, 43]);
    expect(geoLeft.pivot[0]).toBe(-Number(doorLeft.origin?.[0]));
    expect(geoRight.pivot[0]).toBe(-Number(doorRight.origin?.[0]));

    const nativeAnimations = model.animations as JsonObject[];
    expect(nativeAnimations.map((animation) => animation.name).sort()).toEqual([
      "animation.lift.door_close",
      "animation.lift.door_open",
    ]);
    const exportedAnimations = exported.animations as Record<string, JsonObject>;
    expect(Object.keys(exportedAnimations).sort()).toEqual([
      "animation.lift.door_close",
      "animation.lift.door_open",
    ]);

    const nativeOpen = nativeAnimations.find((animation) => animation.name === "animation.lift.door_open")!;
    const nativeClose = nativeAnimations.find((animation) => animation.name === "animation.lift.door_close")!;
    const exportOpen = exportedAnimations["animation.lift.door_open"];
    const exportClose = exportedAnimations["animation.lift.door_close"];
    for (const animation of [nativeOpen, nativeClose, exportOpen, exportClose]) {
      expect(Number(animation.length ?? animation.animation_length)).toBe(1.2);
    }
    expect(nativeOpen.loop).toBe("once");
    expect(nativeClose.loop).toBe("hold");
    expect(exportClose.loop).toBe("hold_on_last_frame");

    const nativeOpenLeft = nativePositionEndpoints(nativeOpen, doorLeft.uuid);
    const nativeOpenRight = nativePositionEndpoints(nativeOpen, doorRight.uuid);
    const nativeCloseLeft = nativePositionEndpoints(nativeClose, doorLeft.uuid);
    const nativeCloseRight = nativePositionEndpoints(nativeClose, doorRight.uuid);
    expect(nativeOpenLeft).toEqual([0, -18]);
    expect(nativeOpenRight).toEqual([0, 18]);
    expect(nativeCloseLeft).toEqual([-18, 0]);
    expect(nativeCloseRight).toEqual([18, 0]);

    const exportOpenLeft = exportedEndpoints(exportOpen, "door_left");
    const exportOpenRight = exportedEndpoints(exportOpen, "door_right");
    const exportCloseLeft = exportedEndpoints(exportClose, "door_left");
    const exportCloseRight = exportedEndpoints(exportClose, "door_right");
    expect(exportOpenLeft).toEqual(nativeOpenLeft.map((value) => -value));
    expect(exportOpenRight).toEqual(nativeOpenRight.map((value) => -value));
    expect(exportCloseLeft).toEqual(nativeCloseLeft.map((value) => -value));
    expect(exportCloseRight).toEqual(nativeCloseRight.map((value) => -value));
    expect(Object.keys(exportOpen.bones ?? {}).sort()).toEqual(["door_left", "door_right"]);
    expect(Object.keys(exportClose.bones ?? {}).sort()).toEqual(["door_left", "door_right"]);
  });
});

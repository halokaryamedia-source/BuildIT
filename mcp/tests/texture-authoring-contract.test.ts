import { describe, expect, test } from "bun:test";
import {
  requireNativeFillTolerance,
  requirePaintCoordinates,
} from "@/server/tools/paint";
import {
  requireFiniteInspectableFaceUv,
  requireFiniteInspectableVector2,
} from "@/server/tools/element-inspection";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function toolBlock(paint: string, index: number, nextIndex: number): string {
  const start = paint.indexOf(`paintToolDocs[${index}].name`);
  const end = paint.indexOf(`paintToolDocs[${nextIndex}].name`, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return paint.slice(start, end);
}

describe("texturing authoring contract", () => {
  test("fill tolerance fails closed instead of being silently ignored", () => {
    expect(() => requireNativeFillTolerance(undefined)).not.toThrow();
    expect(() => requireNativeFillTolerance(0)).toThrow(
      "native fill matches the exact source color"
    );
    expect(() => requireNativeFillTolerance(25)).toThrow(
      "native fill matches the exact source color"
    );
  });

  test("coordinate-driven paint operations reject empty work before runtime mutation", () => {
    expect(() => requirePaintCoordinates([], "paint_with_brush")).toThrow(
      "requires at least one coordinate"
    );
    expect(() =>
      requirePaintCoordinates([{ x: 4, y: 8 }], "paint_with_brush")
    ).not.toThrow();
  });

  test("native Painter lifecycle owns Undo for direct stroke tools", async () => {
    const paint = await source("server/tools/paint.ts");

    for (const [index, nextIndex] of [
      [0, 1],
      [1, 2],
      [2, 3],
      [4, 5],
      [5, 6],
      [7, 8],
    ] as const) {
      const block = toolBlock(paint, index, nextIndex);
      expect(block).toContain("startPaintTool");
      expect(block).toContain("stopPaintTool");
      expect(block).not.toContain("Undo.initEdit");
      expect(block).not.toContain("Undo.finishEdit");
    }
  });

  test("brush and eraser honor connected versus separated stroke semantics", async () => {
    const paint = await source("server/tools/paint.ts");

    const eraser = toolBlock(paint, 5, 6);
    expect(eraser).toContain('requirePaintCoordinates(coordinates, "eraser_tool")');
    expect(eraser).toContain("movePaintTool");
    expect(eraser).toContain("!connect_strokes");

    const brush = toolBlock(paint, 7, 8);
    expect(brush).toContain(
      'requirePaintCoordinates(coordinates, "paint_with_brush")'
    );
    expect(brush).toContain("BarItems.brush_tool.select()");
    expect(brush).toContain(
      'setBarItemValue("blend_mode", brush_settings.blend_mode)'
    );
    expect(brush).toContain("movePaintTool");
    expect(brush).toContain("!connect_strokes");
    expect(brush).not.toContain("Painter.editCircle");
    expect(brush).not.toContain("Painter.editSquare");
  });

  test("Cube inspection exposes finite authored UV state and face rectangles", async () => {
    expect(requireFiniteInspectableVector2([8, 16], "fixture")).toEqual([8, 16]);
    expect(() =>
      requireFiniteInspectableVector2([8, Number.NaN], "fixture")
    ).toThrow();

    expect(
      requireFiniteInspectableFaceUv([0, 0, 4, 8], "fixture")
    ).toEqual([0, 0, 4, 8]);
    expect(() =>
      requireFiniteInspectableFaceUv([0, 0, 4, Number.POSITIVE_INFINITY], "fixture")
    ).toThrow();

    const inspection = await source("server/tools/element-inspection.ts");
    for (const marker of [
      "CUBE_FACE_KEYS",
      'mode: cube.box_uv ? ("box_uv" as const) : ("per_face" as const)',
      "box_uv: cube.box_uv === true",
      "uv_offset: requireFiniteInspectableVector2",
      "autouv: cube.autouv",
      "mirror_uv: cube.mirror_uv === true",
      "face.uv",
      "rotation: face.rotation",
      "enabled: face.enabled !== false",
      "uv: inspectCubeUv(cube)",
    ]) {
      expect(inspection).toContain(marker);
    }

    for (const face of ["north", "south", "east", "west", "up", "down"]) {
      expect(inspection).toContain(`"${face}"`);
    }
  });
});

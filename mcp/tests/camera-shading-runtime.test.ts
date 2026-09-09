import { afterEach, expect, test } from "bun:test";
import { withShadedCapture } from "@/server/tools/camera";

const globals = globalThis as any;
const originalSettings = globals.settings;
const originalCanvas = globals.Canvas;
afterEach(() => {
  globals.settings = originalSettings;
  globals.Canvas = originalCanvas;
});

test("capture enables shading during rendering and restores the user's setting", () => {
  const updates: boolean[] = [];
  globals.settings = { shading: { value: false } };
  globals.Canvas = { updateShading: () => updates.push(globals.settings.shading.value) };
  const result = withShadedCapture(() => globals.settings.shading.value);
  expect(result).toBe(true);
  expect(globals.settings.shading.value).toBe(false);
  expect(updates).toEqual([true, false]);
});

test("capture restores shading after render failure", () => {
  globals.settings = { shading: { value: false } };
  globals.Canvas = { updateShading() {} };
  expect(() => withShadedCapture(() => { throw new Error("render failed"); })).toThrow("render failed");
  expect(globals.settings.shading.value).toBe(false);
});

test("already shaded capture preserves the setting and missing state fails closed", () => {
  globals.settings = { shading: { value: true } };
  globals.Canvas = { updateShading() {} };
  expect(withShadedCapture(() => "image")).toBe("image");
  expect(globals.settings.shading.value).toBe(true);
  globals.settings = {};
  expect(() => withShadedCapture(() => "image")).toThrow("shading");
});

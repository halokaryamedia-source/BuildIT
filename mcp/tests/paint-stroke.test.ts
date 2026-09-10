import {test, expect} from "bun:test";
import {runPaintStroke} from "@/lib/paintStroke";

test("failed native strokes restore bitmap and release Painter without committing", () => {
  const g = globalThis as any, old = {Painter:g.Painter, Undo:g.Undo};
  let pixel = 10, commits = 0, releases = 0;
  g.Undo = {current_save:undefined, cancelEdit() {pixel = 10; this.current_save = undefined;}};
  g.Painter = {current:{}, brushChanges:false, stopPaintTool() {
    releases++;
    if (this.paint_stroke_canceled) {delete this.paint_stroke_canceled; return;}
    commits++; g.Undo.current_save = undefined;
  }};
  const start = () => {g.Undo.current_save = {}; pixel = 20; g.Painter.brushChanges = true; g.Painter.current.cached_canvases = {};};
  try {
    for (const stage of ["start", "move", "shape", "gradient"]) {
      expect(() => runPaintStroke(() => {start(); throw new Error(stage);})).toThrow(stage);
      expect(pixel).toBe(10); expect(g.Undo.current_save).toBeUndefined();
      expect(g.Painter.current).toEqual({}); expect(g.Painter.brushChanges).toBe(false);
    }
    expect(commits).toBe(0); expect(releases).toBe(4);
    runPaintStroke(start); expect(pixel).toBe(20); expect(commits).toBe(1);
    g.Undo.current_save = {unrelated:true};
    expect(() => runPaintStroke(start)).toThrow("active Undo");
    expect(g.Undo.current_save).toEqual({unrelated:true});
    g.Undo.current_save = undefined;
    expect(() => runPaintStroke(() => {g.Painter.paint_stroke_canceled = true;})).toThrow("canceled");
    expect(commits).toBe(1);
  } finally {Object.assign(g, old);}
});

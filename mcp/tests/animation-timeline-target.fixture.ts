import { expect } from "bun:test";
import { getAllToolDefinitions } from "@/lib/factories";
import { registerAnimationTools } from "@/server/tools/animation";

async function verifyTarget() {
  const keys = ["AnimationItem", "Timeline", "Animator", "Undo"] as const;
  const globals = globalThis as any;
  const previous = keys.map(key => globals[key]);
  let undoTarget: unknown;
  const make = (uuid: string) => ({
    uuid, name: uuid, loop: "once",
    select() { globals.AnimationItem.selected = this; },
    setLoop(loop: string) { this.loop = loop; },
  });
  const a = make("A"), b = make("B");
  globals.AnimationItem = { all: [a, b], selected: b };
  globals.Timeline = {
    time: 0, playing: false, pauses: 0,
    pause() { this.playing = false; this.pauses++; },
    start() { this.playing = true; },
    setTime(time: number) { this.time = time; },
  };
  globals.Animator = { preview() {} };
  globals.Undo = { initEdit(data: any) { undoTarget = data.animations[0]; }, finishEdit() {}, cancelEdit() {} };
  if (!getAllToolDefinitions().animation_timeline) registerAnimationTools();
  const tool = getAllToolDefinitions().animation_timeline;
  const run = async (args: object) => tool.execute(await tool.parameterSchema.parseAsync(args));
  try {
    const result: any = await run({ animation_id: "A", action: "loop", loop_mode: "hold" });
    expect(a.loop).toBe("hold");
    expect(b.loop).toBe("once");
    expect(undoTarget).toBe(a);
    expect(result.structuredContent.animation.uuid).toBe("A");
    expect(globals.AnimationItem.selected).toBe(b);
    await run({ animation_id: "A", action: "set_time", time: 0.6 });
    expect(globals.AnimationItem.selected).toBe(a);
    expect(globals.Timeline.time).toBe(0.6);
    await run({ animation_id: "B", action: "select" });
    expect(globals.AnimationItem.selected).toBe(b);
    const pauses = globals.Timeline.pauses;
    await expect(run({ animation_id: "missing", action: "play" })).rejects.toThrow();
    expect(globals.AnimationItem.selected).toBe(b);
    expect(globals.Timeline.pauses).toBe(pauses);
    expect(globals.Timeline.playing).toBe(false);
    await run({ animation_id: "A", action: "play" });
    expect(globals.AnimationItem.selected).toBe(a);
    expect(globals.Timeline.playing).toBe(true);
  } finally {
    keys.forEach((key, i) => globals[key] = previous[i]);
  }
}

await verifyTarget();

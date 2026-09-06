import { expect, test } from "bun:test";
import { join } from "node:path";

test("native executor respects explicit clip and rejects invalid identity before side effects", () => {
  const child = Bun.spawnSync([process.execPath, "run", join(import.meta.dir, "animation-timeline-target.fixture.ts")], { stdout: "pipe", stderr: "pipe" });
  expect(child.exitCode, child.stderr.toString()).toBe(0);
});

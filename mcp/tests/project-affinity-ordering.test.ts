import { describe, expect, test } from "bun:test";

describe("Runtime project-affinity dispatch ordering", () => {
  test("queued tool calls re-check socket liveness before entering native project dispatch", async () => {
    const source = await Bun.file("server/net.ts").text();
    const queue = source.indexOf("runRuntimeRequestExclusive(async () => {");
    const liveness = source.indexOf(
      "socket.destroyed || !socket.writable",
      queue
    );
    const dispatch = source.indexOf("return await dispatch()", liveness);
    const abandonedCatch = source.indexOf(
      "if (error instanceof RuntimeRequestAbandonedError) return",
      dispatch
    );
    const projectErrorCatch = source.indexOf(
      "if (error instanceof RuntimeProjectContextError",
      abandonedCatch
    );

    expect(queue).toBeGreaterThan(-1);
    expect(liveness).toBeGreaterThan(queue);
    expect(dispatch).toBeGreaterThan(liveness);
    expect(abandonedCatch).toBeGreaterThan(dispatch);
    expect(projectErrorCatch).toBeGreaterThan(abandonedCatch);
  });
});
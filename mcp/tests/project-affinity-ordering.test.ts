import { describe, expect, test } from "bun:test";

describe("Runtime project-affinity dispatch ordering", () => {
  test("queued tool calls re-check socket liveness before entering native project dispatch", async () => {
    const source = await Bun.file("server/net.ts").text();
    const queue = source.indexOf("runRuntimeOperationExclusive(generation, async () => {");
    const liveness = source.indexOf(
      "socket.destroyed || !socket.writable || shuttingDown",
      queue
    );
    const dispatch = source.indexOf("return await dispatch()", liveness);
    const abandonedCatch = source.indexOf(
      "error instanceof RuntimeRequestAbandonedError",
      dispatch
    );
    const retiredCatch = source.indexOf(
      "error instanceof RuntimeGenerationRetiredError",
      abandonedCatch
    );
    const projectErrorCatch = source.indexOf(
      "if (error instanceof RuntimeProjectContextError",
      retiredCatch
    );

    expect(queue).toBeGreaterThan(-1);
    expect(liveness).toBeGreaterThan(queue);
    expect(dispatch).toBeGreaterThan(liveness);
    expect(abandonedCatch).toBeGreaterThan(dispatch);
    expect(retiredCatch).toBeGreaterThanOrEqual(abandonedCatch);
    expect(projectErrorCatch).toBeGreaterThan(retiredCatch);
  });
});

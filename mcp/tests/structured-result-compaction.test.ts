import { describe, expect, test } from "bun:test";
import { z } from "zod";
import { createTool, registerToolsOnServer } from "@/lib/factories";

type CapturedToolCallback = (
  args: unknown,
  extra: unknown
) => Promise<unknown>;

function createCaptureServer() {
  const callbacks = new Map<string, CapturedToolCallback>();

  return {
    callbacks,
    server: {
      registerTool(
        name: string,
        _definition: unknown,
        callback: CapturedToolCallback
      ) {
        callbacks.set(name, callback);
      },
    },
  };
}

describe("structured MCP result compaction", () => {
  test("replaces an exact JSON mirror with a compact text summary", async () => {
    const capture = createCaptureServer();
    const payload = {
      item: { uuid: "fixture-uuid", name: "fixture" },
      content: "x".repeat(2048),
    };

    createTool(
      "structured_result_compaction_fixture",
      {
        description: "Structured result compaction fixture",
        parameters: z.object({}),
        async execute() {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(payload),
              },
            ],
            structuredContent: payload,
          };
        },
      },
      "experimental"
    );

    registerToolsOnServer(capture.server);
    const callback = capture.callbacks.get("structured_result_compaction_fixture");
    expect(callback).toBeDefined();
    if (!callback) throw new Error("Structured result fixture was not registered.");

    const result = await callback({}, {});
    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "structured_result_compaction_fixture returned structured data.",
        },
      ],
      structuredContent: payload,
    });
  });

  test("preserves concise text that adds information beyond structured data", async () => {
    const capture = createCaptureServer();
    const payload = { uuid: "summary-fixture-uuid", changed: true };

    createTool(
      "structured_result_summary_fixture",
      {
        description: "Structured result summary fixture",
        parameters: z.object({}),
        async execute() {
          return {
            content: [
              {
                type: "text" as const,
                text: "Updated the requested fixture.",
              },
            ],
            structuredContent: payload,
          };
        },
      },
      "experimental"
    );

    registerToolsOnServer(capture.server);
    const callback = capture.callbacks.get("structured_result_summary_fixture");
    expect(callback).toBeDefined();
    if (!callback) throw new Error("Structured summary fixture was not registered.");

    const result = await callback({}, {});
    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "Updated the requested fixture.",
        },
      ],
      structuredContent: payload,
    });
  });
});

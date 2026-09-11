import { describe, expect, test } from "bun:test";
import { z } from "zod";
import {
  createTool,
  registerToolsOnServer,
  withToolBranch,
} from "@/lib/factories";

describe("Tool factory zero-loss contracts", () => {
  test("withToolBranch preserves strict executor validation while adding a discriminator", () => {
    const executorSchema = z.object({ value: z.number().int().min(1) }).strict();
    const routed = withToolBranch(executorSchema, "operation", "run");

    expect(routed.parse({ operation: "run", value: 2 })).toEqual({
      operation: "run",
      value: 2,
    });
    expect(() => routed.parse({ operation: "run", value: 2, extra: true })).toThrow();
  });

  test("runtime callback validates canonical schema and compacts mirrored structured results", async () => {
    const toolName = "__test_zero_loss_factory_contract";
    const schema = z.object({ value: z.number().int() }).strict();

    createTool(
      toolName,
      {
        description: "Test-only factory contract.",
        parameters: schema,
        async execute({ value }) {
          const structuredContent = { value, preserved: true };
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(structuredContent),
              },
            ],
            structuredContent,
          };
        },
      },
      "stable"
    );

    let callback: ((args: unknown, extra: unknown) => Promise<unknown>) | null = null;
    const fakeServer = {
      registerTool(
        name: string,
        _definition: unknown,
        handler: (args: unknown, extra: unknown) => Promise<unknown>
      ) {
        if (name === toolName) callback = handler;
      },
      server: {
        setRequestHandler() {},
      },
    };

    registerToolsOnServer(fakeServer, [toolName]);
    expect(callback).not.toBeNull();

    await expect(callback!({ value: 1, extra: true }, {})).rejects.toThrow();

    const result = (await callback!({ value: 7 }, {})) as {
      content: Array<{ type: string; text?: string }>;
      structuredContent?: unknown;
    };

    expect(result.structuredContent).toEqual({ value: 7, preserved: true });
    expect(result.content).toEqual([
      {
        type: "text",
        text: `${toolName} returned structured data.`,
      },
    ]);
  });
});

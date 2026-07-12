import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

const guardedTools = new Set([
  "submit_stage_for_review",
  "complete_stage",
]);

let installed = false;

async function assertGeometryReady(
  args: Record<string, unknown>,
  context?: ToolContext
): Promise<Record<string, any>> {
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;
  const gate = definitions.verify_geometry_review_ready;
  if (!gate?.execute) {
    throw new Error("verify_geometry_review_ready is unavailable.");
  }
  const result = await gate.execute(
    {
      session_root: args.session_root,
      expected_project_uuid: args.expected_project_uuid,
      require_standard_views: true,
    },
    context
  );
  const structured = result?.structuredContent as Record<string, any> | undefined;
  if (!structured || structured.result !== "PASS") {
    const codes = Array.isArray(structured?.issues)
      ? structured.issues
          .map((issue: any) => issue?.code)
          .filter(Boolean)
          .join(", ")
      : "unknown";
    throw new Error(
      `FINAL_GEOMETRY_REVIEW_NOT_READY: ${structured?.result ?? "UNKNOWN"}; ${codes}`
    );
  }
  return structured;
}

/** Final review and approval can never rely on a generic PASS report alone. */
export function installFinalValidationGeometryGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;

  for (const name of guardedTools) {
    const definition = definitions[name];
    if (!definition?.execute) continue;
    const execute = definition.execute;
    definition.execute = async (args, context) => {
      if (args.stage !== "FINAL_VALIDATION") {
        return execute(args, context);
      }
      const geometryGate = await assertGeometryReady(args, context);
      const result = await execute(args, context);
      if (result?.structuredContent && typeof result.structuredContent === "object") {
        result.structuredContent.geometry_review_gate = geometryGate;
      }
      return result;
    };
  }

  installed = true;
}

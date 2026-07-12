import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import { resolveMutationExecutionContext } from "@/lib/mutationContext";
import { releaseProjectWriteLease } from "@/lib/writeLease";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

const submissionTools = new Set([
  "submit_geometry_for_review",
  "submit_stage_for_review",
]);

let installed = false;

/**
 * Review waits must not retain a writer lease. A successful submission has
 * already persisted its checkpoint and review-state revision, so the next
 * APPROVED/REVISION action should acquire a fresh lease from current context.
 */
export function installReviewSubmissionLeaseGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;

  for (const name of submissionTools) {
    const definition = definitions[name];
    if (!definition?.execute) continue;
    const execute = definition.execute;
    definition.execute = async (args, context) => {
      const result = await execute(args, context);
      releaseProjectWriteLease(resolveMutationExecutionContext(context));
      if (result?.structuredContent && typeof result.structuredContent === "object") {
        result.structuredContent.lease_status = "UNCLAIMED";
        result.structuredContent.lease_acquisition_required_after_review = true;
      }
      return result;
    };
  }

  installed = true;
}

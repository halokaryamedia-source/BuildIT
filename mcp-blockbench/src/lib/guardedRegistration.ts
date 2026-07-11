import { getEnabledToolDefinitions, type ToolContext } from "@/lib/factories";
import { getExecutionProfileState } from "@/lib/executionState";
import {
  assertToolMutationAllowed,
  type MutationExecutionContext,
} from "@/lib/writeLease";

interface StoredToolDefinition {
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>, context?: ToolContext) => Promise<unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    openWorldHint?: boolean;
  };
}

export interface SessionExecutionIdentity {
  sessionId: string | null;
  clientName: string | null;
}

function requestId(extra: unknown): string | number | null {
  if (!extra || typeof extra !== "object") return null;
  const value = (extra as { requestId?: unknown }).requestId;
  return typeof value === "string" || typeof value === "number" ? value : null;
}

function normalizeResult(result: unknown): unknown {
  if (typeof result === "string") {
    return { content: [{ type: "text", text: result }] };
  }
  if (result && typeof result === "object" && "content" in result) return result;
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
}

export function registerGuardedToolsOnServer(
  server: unknown,
  identityProvider: () => SessionExecutionIdentity
): void {
  const definitions = getEnabledToolDefinitions() as Record<
    string,
    StoredToolDefinition
  >;
  const typedServer = server as {
    registerTool: (
      name: string,
      definition: {
        title: string;
        description: string;
        inputSchema: Record<string, unknown>;
      },
      callback: (args: unknown, extra: unknown) => Promise<unknown>
    ) => void;
  };

  for (const [name, definition] of Object.entries(definitions)) {
    typedServer.registerTool(
      name,
      {
        title: definition.title,
        description: definition.description,
        inputSchema: definition.inputSchema,
      },
      async (rawArgs: unknown, extra: unknown) => {
        const args = (rawArgs ?? {}) as Record<string, unknown>;
        const identity = identityProvider();
        const profile = getExecutionProfileState();
        const mutationContext: MutationExecutionContext = {
          sessionId: identity.sessionId,
          clientName: identity.clientName,
          requestId: requestId(extra),
          profileId: profile.profileId,
          profileRevision: profile.profileRevision,
          profileHash: profile.profileHash,
        };
        assertToolMutationAllowed(
          name,
          args,
          mutationContext,
          definition.annotations?.readOnlyHint
        );

        const reportProgress: ToolContext["reportProgress"] = () => {};
        const context = {
          reportProgress,
          ...mutationContext,
        } as ToolContext;
        return normalizeResult(await definition.execute(args, context));
      }
    );
  }
}

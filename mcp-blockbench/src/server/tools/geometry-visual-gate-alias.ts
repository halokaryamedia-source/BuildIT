/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, getAllToolDefinitions, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";

const legacyGeometryVisualGateParameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().optional(),
});

export const geometryVisualGateAliasToolDocs: ToolSpec[] = [
  {
    name: "verify_geometry_visual_gate",
    description:
      "Deprecated compatibility alias. Delegates to verify_geometry_review_ready and cannot bypass deterministic metrics, five-view evidence, Reference Visual identity, fingerprint freshness, or rotation safety.",
    annotations: { title: "Verify Geometry Visual Gate (Compatibility)", readOnlyHint: true, openWorldHint: true },
    parameters: legacyGeometryVisualGateParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

export function registerGeometryVisualGateAliasTools(): void {
  createTool(
    geometryVisualGateAliasToolDocs[0].name,
    {
      ...geometryVisualGateAliasToolDocs[0],
      async execute({ session_root, expected_project_uuid }) {
        const gate = getAllToolDefinitions()["verify_geometry_review_ready"] as unknown as {
          execute?: (args: Record<string, unknown>) => Promise<any>;
        };
        if (!gate?.execute) {
          throw new Error("verify_geometry_review_ready is unavailable.");
        }
        const delegated = await gate.execute({
          session_root,
          expected_project_uuid,
          require_standard_views: true,
        });
        return {
          content: delegated?.content ?? [],
          structuredContent: {
            ...(delegated?.structuredContent ?? {}),
            deprecated_alias: "verify_geometry_visual_gate",
            delegated_to: "verify_geometry_review_ready",
          },
        };
      },
    },
    geometryVisualGateAliasToolDocs[0].status
  );
}

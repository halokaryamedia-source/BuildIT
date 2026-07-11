import { z } from "zod";
import { createTool, type ToolContext, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import { resolveMutationExecutionContext } from "@/lib/mutationContext";
import {
  acquireProjectWriteLease,
  getProjectWriteLeaseSnapshot,
  releaseProjectWriteLease,
  renewProjectWriteLease,
  type ProjectWriteLeaseSnapshot,
} from "@/lib/writeLease";

const actionEnum = z.enum(["acquire", "renew", "release", "status"]);

export const manageProjectWriteLeaseParameters = z
  .object({
    action: actionEnum,
    asset_id: z.string().regex(/^[a-z0-9_]+$/).optional(),
    session_root: z.string().min(1).optional(),
    expected_project_uuid: z.string().min(1).optional(),
    expected_state_revision: z.number().int().min(0).optional(),
    expected_stage: z
      .enum(["GEOMETRY", "TEXTURE", "ANIMATION", "FINAL_VALIDATION"])
      .optional(),
    ttl_minutes: z.number().int().min(5).max(120).optional().default(30),
  })
  .superRefine((value, context) => {
    if (value.action !== "acquire") return;
    for (const key of [
      "asset_id",
      "session_root",
      "expected_project_uuid",
      "expected_state_revision",
      "expected_stage",
    ] as const) {
      if (value[key] === undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} is required when action is acquire.`,
        });
      }
    }
  });

export const leaseToolDocs: ToolSpec[] = [
  {
    name: "manage_project_write_lease",
    description:
      "Acquires, renews, releases, or inspects the single project write lease used to block concurrent and stale Blockbench mutations.",
    annotations: {
      title: "Manage Project Write Lease",
      destructiveHint: false,
      openWorldHint: true,
    },
    parameters: manageProjectWriteLeaseParameters,
    status: STATUS_STABLE,
  },
];

export function registerLeaseTools(): void {
  createTool(
    leaseToolDocs[0].name,
    {
      ...leaseToolDocs[0],
      async execute(value, rawContext?: ToolContext) {
        const context = resolveMutationExecutionContext(rawContext);
        let lease: ProjectWriteLeaseSnapshot;
        if (value.action === "acquire") {
          lease = acquireProjectWriteLease(
            {
              assetId: value.asset_id!,
              sessionRoot: value.session_root!,
              expectedProjectUuid: value.expected_project_uuid!,
              expectedStateRevision: value.expected_state_revision!,
              expectedStage: value.expected_stage!,
              ttlMinutes: value.ttl_minutes,
            },
            context
          );
        } else if (value.action === "renew") {
          lease = renewProjectWriteLease(context, value.ttl_minutes);
        } else if (value.action === "release") {
          lease = releaseProjectWriteLease(context);
        } else {
          lease = getProjectWriteLeaseSnapshot();
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Project write lease ${value.action}: ${lease.status}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            action: value.action,
            lease,
          },
        };
      },
    },
    leaseToolDocs[0].status
  );
}

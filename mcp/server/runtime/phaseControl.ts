import { z } from "zod";
import { createTool } from "@/lib/factories";
import {
  getActiveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";

let phaseSwitchHandler:
  | ((phase: McpAuthoringPhase) => void)
  | undefined;

export function setMcpPhaseSwitchHandler(
  handler: (phase: McpAuthoringPhase) => void
): void {
  phaseSwitchHandler = handler;
}

export function requestMcpPhaseSwitch(phase: McpAuthoringPhase): void {
  if (!phaseSwitchHandler) {
    throw new Error("Runtime phase switching is unavailable; reload BlockIT.");
  }
  phaseSwitchHandler(phase);
}

export const phaseControlToolDocs = {
  name: "switch_authoring_phase",
  description:
    "Changes focus or hands off AUTHORING↔Animation in the same task. Animation requires a checkpoint and either user approvals or explicitly authorized autonomous verification; internal PASS never means user approval.",
  parameters: z.object({
    target_phase: z.enum(["geometry", "texturing", "animation"]),
    reason: z.string().min(1),
    resume_from: z.string().min(1),
    readiness: z.union([
      z.object({
        geometry_approved: z.literal(true),
        uv_layout: z.literal("PASS"),
        texture_approved: z.literal(true),
        checkpoint: z.string().min(1).describe(
          "Saved .bbmodel checkpoint path; records explicit user approval, never inferred by the caller."
        ),
        no_blockers: z.literal(true),
      }).strict(),
      z.object({
        autonomous_authorized: z.literal(true).describe(
          "User explicitly authorized autonomous execution; never infer this from tool availability."
        ),
        geometry_verified: z.literal(true),
        uv_layout: z.literal("PASS"),
        texture_verified: z.literal(true),
        checkpoint: z.string().min(1),
        evidence: z.string().min(1).describe(
          "Current-revision geometry/texture evidence and readiness summary; not a user-approval claim."
        ),
        no_blockers: z.literal(true),
      }).strict(),
    ]).optional(),
  }).refine(value => value.target_phase !== "animation" || value.readiness !== undefined, {
    message:
      "Animation handoff requires user-approved or authorized-autonomous readiness, UV Layout PASS, and a saved checkpoint.",
    path: ["readiness"],
  }),
  status: "stable" as const,
};

export function registerPhaseControlTool(): void {
  createTool(
    "switch_authoring_phase",
    {
      ...phaseControlToolDocs,
      async execute({ target_phase, reason, resume_from, readiness }) {
        if (!phaseSwitchHandler) {
          throw new Error("Runtime phase switching is unavailable; reload BlockIT.");
        }
        const previousPhase = getActiveMcpAuthoringPhase();
        const surfaceChanged =
          (previousPhase === "animation") !== (target_phase === "animation");
        return {
          content: [
            {
              type: "text" as const,
              text: `MCP authoring focus switched to ${target_phase}. Continue this task through Gateway.`,
            },
          ],
          structuredContent: {
            phase: target_phase,
            reason,
            resume_from,
            readiness,
            surface_changed: surfaceChanged,
            reload_required: false,
            action: "continue through Gateway in the same task",
          },
        };
      },
    },
    "stable",
    true
  );
}

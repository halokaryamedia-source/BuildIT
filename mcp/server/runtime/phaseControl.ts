import { z } from "zod";
import { createTool } from "@/lib/factories";
import {
  getActiveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";
import {
  ANIMATION_HANDOFF_READINESS_RULE,
  animationHandoffReadinessSchema,
  summarizeAnimationHandoffReadiness,
} from "@/lib/authoringReadiness";

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
    `Changes focus or hands off AUTHORING↔Animation in the same task. ${ANIMATION_HANDOFF_READINESS_RULE}`,
  parameters: z.object({
    target_phase: z.enum(["geometry", "texturing", "animation"]),
    reason: z.string().min(1),
    resume_from: z.string().min(1),
    readiness: animationHandoffReadinessSchema.optional(),
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
        const readinessSummary = readiness
          ? summarizeAnimationHandoffReadiness(readiness)
          : null;
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
            readiness_summary: readinessSummary,
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

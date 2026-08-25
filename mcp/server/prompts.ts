import { z } from "zod";
import { createPrompt, prompts } from "@/lib/factories";
import { getPromptContent } from "@/lib/promptLoader";
import {
  buildMcpPhaseHandoffContract,
  buildMcpPhasePromptHeader,
  getActiveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";

const PHASE_SOURCE_SECTIONS: Record<McpAuthoringPhase, string[]> = {
  geometry: [
    "Minimum Necessary Evidence",
    "Simple Rigid Fast Path",
    "Geometry / Visual Gate",
    "UV Layout",
  ],
  texturing: [
    "Minimum Necessary Evidence",
    "Texture Atlas",
    "Texture Styling",
    "Texture Verify",
  ],
  animation: ["Minimum Necessary Evidence"],
};

const ANIMATION_RUNTIME_WORKFLOW = `## Animation Workflow

Precondition: required hierarchy/pivots are suitable. Animation owns motion, not structural rig mutation.

\`\`\`text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
controller state/composition/effects  → manage_animation_controller
existing animation effects            → manage_animation_effects
transform keyframes / Molang values   → manage_keyframes
curve change with evidence            → animation_graph_editor
time/length/FPS/loop/Molang controls  → animation_timeline
batch coherent operations             → batch_keyframe_operations
explicit copy/paste/mirror            → animation_copy_paste
\`\`\`

Reuse fresh UUID/state. A structural bone/pivot/IK/parenting defect requires HANDOFF_REQUIRED to Geometry; do not search for bone_rigging in Animation. Verify pose/readability → timing/phase → weight/contact → attachment/clipping → secondary motion → effect synchronization → loop seam/neutral return. Same causal correction direction failing twice without new evidence → BLOCKED.`;

function readSection(markdown: string, heading: string): string {
  const marker = `## ${heading}`;
  const start = markdown.indexOf(marker);
  if (start < 0) {
    throw new Error(`Canonical Bedrock workflow is missing section: ${heading}`);
  }
  const next = markdown.indexOf("\n## ", start + marker.length);
  return markdown.slice(start, next < 0 ? markdown.length : next).trim();
}

/**
 * The canonical markdown remains the full pipeline source, but Codex receives
 * only shared evidence guidance + sections owned by the active phase. This
 * prevents later-phase tool names from looking callable in the current session.
 */
export function selectMcpPhaseWorkflowBody(
  workflow: string,
  phase: McpAuthoringPhase
): string {
  const sections = PHASE_SOURCE_SECTIONS[phase].map((heading) =>
    readSection(workflow, heading)
  );
  if (phase === "animation") sections.push(ANIMATION_RUNTIME_WORKFLOW);
  return sections.join("\n\n");
}

// Maintainer/reference markdown stays source-preserved under prompts/, but only
// the phase-filtered Bedrock Entity workflow is registered at runtime.
createPrompt("bedrock_entity_workflow", {
  title: "Minecraft Bedrock Entity Workflow",
  description:
    "Compact BlockIT operating contract for Bedrock Entity authoring: minimum evidence, visual gates, bounded correction, downstream readiness, native capability boundaries, and Bedrock/.bbmodel export.",
  argsSchema: z.object({}),
  async generate() {
    const phase = getActiveMcpAuthoringPhase();
    const workflow = getPromptContent("bedrock_entity_workflow");
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              buildMcpPhasePromptHeader(phase),
              selectMcpPhaseWorkflowBody(workflow, phase),
              buildMcpPhaseHandoffContract(phase),
            ].join("\n\n"),
          },
        },
      ],
    };
  },
});

export default prompts;

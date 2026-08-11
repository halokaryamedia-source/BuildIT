import { z } from "zod";
import { createPrompt, prompts } from "@/lib/factories";
import { getPromptContent } from "@/lib/promptLoader";

// Maintainer/reference markdown stays source-preserved under prompts/, but only
// the canonical Bedrock Entity workflow is bundled and registered at runtime.
createPrompt("bedrock_entity_workflow", {
  title: "Minecraft Bedrock Entity Workflow",
  description:
    "Compact BlockIT operating contract for Bedrock Entity authoring: minimum evidence, visual gates, bounded correction, downstream readiness, native capability boundaries, and Bedrock/.bbmodel export.",
  argsSchema: z.object({}),
  async generate() {
    const text = getPromptContent("bedrock_entity_workflow");
    return {
      messages: [{ role: "user", content: { type: "text", text } }],
    };
  },
});

export default prompts;

import { z } from "zod";
import { createPrompt, prompts } from "@/lib/factories";
import { getPromptContent } from "@/lib/promptLoader";

// Maintainer/development guidance remains source-preserved but is not part of
// the normal agent-facing BlockIT MCP prompt surface.
createPrompt(
  "blockbench_native_apis",
  {
    description:
      "Maintainer-only Blockbench native API security/reference guidance. Disabled in the normal BlockIT Bedrock Entity MCP surface.",
    argsSchema: z.object({}),
    async generate() {
      const text = getPromptContent("blockbench_native_apis");
      return {
        messages: [{ role: "user", content: { type: "text", text } }],
      };
    },
  },
  "stable",
  false
);

createPrompt(
  "blockbench_code_eval_safety",
  {
    description:
      "Maintainer-only safety guidance for Blockbench code evaluation. Disabled together with risky_eval in the normal BlockIT Bedrock Entity MCP surface.",
    argsSchema: z.object({}),
    async generate() {
      const text = getPromptContent("blockbench_code_eval_safety");
      return {
        messages: [{ role: "user", content: { type: "text", text } }],
      };
    },
  },
  "stable",
  false
);

createPrompt("bedrock_entity_workflow", {
  title: "Minecraft Bedrock Entity Workflow",
  description:
    "Canonical BlockIT workflow guidance for creating or revising Minecraft Bedrock Entity models in Blockbench. Covers inspect-first Cuboid modelling, hierarchy/pivots, canonical visual gates, Bedrock texture/Paint/PBR/material-instance work, animation boundaries, protected native capability gaps, and Bedrock/.bbmodel export outcomes.",
  argsSchema: z.object({}),
  async generate() {
    const text = getPromptContent("bedrock_entity_workflow");
    return {
      messages: [{ role: "user", content: { type: "text", text } }],
    };
  },
});

export default prompts;

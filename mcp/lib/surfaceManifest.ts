import type { IMCPPrompt, IMCPResource, IMCPTool } from "@/types";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";

function sortedNames(values: Array<{ name: string }>): string[] {
  return values.map((value) => value.name).sort((a, b) => a.localeCompare(b));
}

export function createSurfaceManifest({
  profile,
  tools,
  resources,
  prompts,
}: {
  profile: McpRegistrationProfile;
  tools: Record<string, IMCPTool>;
  resources: Record<string, IMCPResource>;
  prompts: Record<string, IMCPPrompt>;
}) {
  const toolCatalog = Object.values(tools);
  const exposedTools = toolCatalog.filter((tool) => tool.enabled);
  const disabledTools = toolCatalog.filter((tool) => !tool.enabled);
  const promptCatalog = Object.values(prompts);
  const exposedPrompts = promptCatalog.filter((prompt) => prompt.enabled);
  const disabledPrompts = promptCatalog.filter((prompt) => !prompt.enabled);
  const availableResources = Object.values(resources);

  return {
    profile,
    tools: {
      exposed_count: exposedTools.length,
      disabled_count: disabledTools.length,
      catalog_count: toolCatalog.length,
      exposed: sortedNames(exposedTools),
      disabled: sortedNames(disabledTools),
    },
    resources: {
      available_count: availableResources.length,
      available: sortedNames(availableResources),
    },
    prompts: {
      exposed_count: exposedPrompts.length,
      disabled_count: disabledPrompts.length,
      catalog_count: promptCatalog.length,
      exposed: sortedNames(exposedPrompts),
      disabled: sortedNames(disabledPrompts),
    },
  } as const;
}

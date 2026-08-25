import type { IMCPTool, IMCPPrompt, IMCPResource } from "@/types";
import { VERSION } from "@/lib/constants";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";
import type { McpAuthoringPhase } from "@/lib/authoringPhase";
import {
  PRODUCT_NAME,
  PRODUCT_REPOSITORY,
} from "@/lib/productIdentity";
import { createSurfaceManifest } from "@/lib/surfaceManifest";
import { statusBarSetup, statusBarTeardown } from "@/ui/statusBar";
import { openToolTestDialog, toolTestDialogTeardown } from "@/ui/toolTestDialog";
import { openPromptPreviewDialog, promptPreviewDialogTeardown } from "@/ui/promptPreviewDialog";
import { openPromptOverrideDialog, overrideDialogTeardown, PROMPT_OVERRIDE_CHANGED } from "@/ui/promptOverrideDialog";
import { hasPromptOverride } from "@/lib/promptLoader";
import { formatArgumentCount } from "@/ui/i18n";
import panelCSS from "@/ui/panel.css";
import template from "@/ui/panel.html";

let panel: Panel | undefined;
let overrideListener: (() => void) | undefined;
let panelCssHandle: { delete(): void } | undefined;

export function uiSetup({
  tools,
  resources,
  prompts,
  profile,
  phase,
}: {
  tools: Record<string, IMCPTool>;
  resources: Record<string, IMCPResource>;
  prompts: Record<string, IMCPPrompt>;
  profile: McpRegistrationProfile;
  phase: McpAuthoringPhase;
}) {
  const surface = createSurfaceManifest({ profile, phase, tools, resources, prompts });
  panelCssHandle?.delete();
  panelCssHandle = Blockbench.addCSS(panelCSS);

  // Stateless HTTP has no durable MCP client session to display. The status bar
  // represents the local server surface only, not a fabricated connection count.
  statusBarSetup();

  panel = new Panel("mcp_panel", {
    id: "mcp_panel",
    icon: "robot",
    name: "MCP",
    default_side: "right",
    resizable: true,
    component: {
      mounted() {
        // Listen for override changes to refresh badge state
        // @ts-ignore - Vue component context
        const vm = this;
        const handler = () => vm.$forceUpdate();
        document.addEventListener(PROMPT_OVERRIDE_CHANGED, handler);
        overrideListener = () => document.removeEventListener(PROMPT_OVERRIDE_CHANGED, handler);
      },
      beforeDestroy() {
        if (overrideListener) {
          overrideListener();
          overrideListener = undefined;
        }
      },
      data: () => ({
        server: {
          name: PRODUCT_NAME,
          version: VERSION,
          repositoryUrl: PRODUCT_REPOSITORY,
          profile,
          authoringPhase: phase,
          endpoint: `127.0.0.1:${Settings.get("mcp_port") || 3000}${Settings.get("mcp_endpoint") || "/bb-mcp"}`,
          transport: "Streamable HTTP (stateless JSON)",
        },
        surface,
        tools: Object.values(tools).map((tool) => ({
          name: tool.name,
          description: tool.description,
          enabled: tool.enabled,
          status: tool.status,
        })),
        resources: Object.values(resources).map((resource) => ({
          name: resource.name,
          description: resource.description,
          uriTemplate: resource.uriTemplate,
        })),
        prompts: Object.values(prompts).map((prompt) => ({
          name: prompt.name,
          description: prompt.description,
          enabled: prompt.enabled,
          status: prompt.status,
          argumentCount: Object.keys(prompt.arguments).length,
        })),
        toolsFilter: {
          search: "",
          showExperimental: true,
          showDisabled: false,
        },
        resourcesFilter: {
          search: "",
        },
        promptsFilter: {
          search: "",
          showExperimental: true,
          showDisabled: false,
        },
      }),
      computed: {
        filteredTools(): Array<{ name: string; description: string; enabled: boolean; status: string }> {
          // @ts-ignore - Vue component context
          const { tools, toolsFilter } = this;
          const searchLower = toolsFilter.search.toLowerCase();
          return tools.filter((tool: { name: string; status: string; enabled: boolean }) => {
            if (!tool.enabled && !toolsFilter.showDisabled) return false;
            if (tool.status === "experimental" && !toolsFilter.showExperimental) return false;
            if (searchLower && !tool.name.toLowerCase().includes(searchLower)) return false;
            return true;
          });
        },
        filteredResources(): Array<{ name: string; description: string; uriTemplate: string }> {
          // @ts-ignore - Vue component context
          const { resources, resourcesFilter } = this;
          const searchLower = resourcesFilter.search.toLowerCase();
          if (!searchLower) return resources;
          return resources.filter((resource: { name: string }) =>
            resource.name.toLowerCase().includes(searchLower)
          );
        },
        filteredPrompts(): Array<{ name: string; description: string; enabled: boolean; status: string; argumentCount: number }> {
          // @ts-ignore - Vue component context
          const { prompts, promptsFilter } = this;
          const searchLower = promptsFilter.search.toLowerCase();
          return prompts.filter((prompt: { name: string; status: string; enabled: boolean }) => {
            if (!prompt.enabled && !promptsFilter.showDisabled) return false;
            if (prompt.status === "experimental" && !promptsFilter.showExperimental) return false;
            if (searchLower && !prompt.name.toLowerCase().includes(searchLower)) return false;
            return true;
          });
        },
      },
      methods: {
        tl(key: string, variables?: string | number | (string | number)[]): string {
          return tl(key, variables);
        },
        getDisplayName(toolName: string): string {
          return toolName.replace("blockbench_", "");
        },
        openToolTest(toolName: string): void {
          openToolTestDialog(toolName);
        },
        openPromptPreview(promptName: string): void {
          openPromptPreviewDialog(promptName);
        },
        openPromptOverride(promptName: string): void {
          openPromptOverrideDialog(promptName);
        },
        isPromptOverridden(promptName: string): boolean {
          return hasPromptOverride(promptName);
        },
        formatArgumentCount,
        onToolsToggle(event: Event): void {
          const details = event.target as HTMLDetailsElement;
          if (!details.open) {
            // @ts-ignore - Vue component context
            this.toolsFilter.search = "";
          }
        },
        onResourcesToggle(event: Event): void {
          const details = event.target as HTMLDetailsElement;
          if (!details.open) {
            // @ts-ignore - Vue component context
            this.resourcesFilter.search = "";
          }
        },
        onPromptsToggle(event: Event): void {
          const details = event.target as HTMLDetailsElement;
          if (!details.open) {
            // @ts-ignore - Vue component context
            this.promptsFilter.search = "";
          }
        },
      },
      name: "mcp_panel",
      template,
    },
    expand_button: true,
  });

  return panel;
}

export function uiTeardown(): void {
  if (overrideListener) {
    overrideListener();
    overrideListener = undefined;
  }
  overrideDialogTeardown();
  toolTestDialogTeardown();
  promptPreviewDialogTeardown();
  statusBarTeardown();
  panel?.delete();
  panel = undefined;
  panelCssHandle?.delete();
  panelCssHandle = undefined;
}

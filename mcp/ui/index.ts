import type { IMCPTool, IMCPPrompt, IMCPResource } from "@/types";
import { VERSION } from "@/lib/constants";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";
import type { McpAuthoringPhase } from "@/lib/authoringPhase";
import { PRODUCT_REPOSITORY } from "@/lib/productIdentity";
import {
  BLOCKIT_RUNTIME_STATUS_CHANGED,
  statusBarSetup,
  statusBarTeardown,
  type BlockItRuntimeStatusDetail,
  type McpServerStatus,
} from "@/ui/statusBar";
import { openToolTestDialog, toolTestDialogTeardown } from "@/ui/toolTestDialog";
import { openPromptPreviewDialog, promptPreviewDialogTeardown } from "@/ui/promptPreviewDialog";
import {
  openPromptOverrideDialog,
  overrideDialogTeardown,
  PROMPT_OVERRIDE_CHANGED,
} from "@/ui/promptOverrideDialog";
import { hasPromptOverride } from "@/lib/promptLoader";
import { formatArgumentCount } from "@/ui/i18n";
import panelCSS from "@/ui/panel.css";
import template from "@/ui/panel.html";

let panel: Panel | undefined;
let overrideListener: (() => void) | undefined;
let runtimeStatusListener: (() => void) | undefined;
let panelCssHandle: { delete(): void } | undefined;

export function uiSetup({
  tools,
  resources,
  prompts,
}: {
  tools: Record<string, IMCPTool>;
  resources: Record<string, IMCPResource>;
  prompts: Record<string, IMCPPrompt>;
  profile: McpRegistrationProfile;
  phase: McpAuthoringPhase;
}) {
  const port = Settings.get("mcp_port") || 3000;
  const endpoint = Settings.get("mcp_endpoint") || "/bb-mcp";
  const runtimeEndpoint = `127.0.0.1:${port}${endpoint}`;

  panelCssHandle?.delete();
  panelCssHandle = Blockbench.addCSS(panelCSS);

  // Stateless HTTP has no durable client session. The panel presents only
  // actionable Runtime readiness by default; transport/catalog details stay
  // behind Advanced details and add no background reads or polling.
  statusBarSetup();

  panel = new Panel("mcp_panel", {
    id: "mcp_panel",
    icon: "robot",
    name: "BlockIT",
    default_side: "right",
    resizable: true,
    component: {
      mounted() {
        // @ts-ignore - Vue component context
        const vm = this;

        const overrideHandler = () => vm.$forceUpdate();
        document.addEventListener(PROMPT_OVERRIDE_CHANGED, overrideHandler);
        overrideListener?.();
        overrideListener = () =>
          document.removeEventListener(PROMPT_OVERRIDE_CHANGED, overrideHandler);

        const statusHandler = (event: Event) => {
          const detail = (event as CustomEvent<BlockItRuntimeStatusDetail>).detail;
          if (!detail) return;
          vm.runtime.state = detail.state;
          vm.runtime.detail = detail.detail ?? "";
        };
        document.addEventListener(BLOCKIT_RUNTIME_STATUS_CHANGED, statusHandler);
        runtimeStatusListener?.();
        runtimeStatusListener = () =>
          document.removeEventListener(BLOCKIT_RUNTIME_STATUS_CHANGED, statusHandler);
      },
      beforeDestroy() {
        overrideListener?.();
        overrideListener = undefined;
        runtimeStatusListener?.();
        runtimeStatusListener = undefined;
      },
      data: () => ({
        server: {
          version: VERSION,
          repositoryUrl: PRODUCT_REPOSITORY,
          endpoint: runtimeEndpoint,
        },
        runtime: {
          state: "running" as McpServerStatus,
          detail: "",
        },
        // Keep original registry object references instead of copying enabled
        // flags. Vue observes those fields, so AUTHORING↔Animation surface changes
        // stay current without polling or a second synchronization layer.
        tools: Object.values(tools),
        resources: Object.values(resources),
        prompts: Object.values(prompts),
        toolsFilter: {
          search: "",
          showExperimental: true,
          showDisabled: false,
        },
        resourcesFilter: {
          search: "",
        },
      }),
      computed: {
        availableToolCount(): number {
          // @ts-ignore - Vue component context
          return this.tools.filter((tool: IMCPTool) => tool.enabled).length;
        },
        filteredTools(): IMCPTool[] {
          // @ts-ignore - Vue component context
          const { tools, toolsFilter } = this;
          const searchLower = toolsFilter.search.trim().toLowerCase();
          return tools.filter((tool: IMCPTool) => {
            if (!tool.enabled && !toolsFilter.showDisabled) return false;
            if (tool.status === "experimental" && !toolsFilter.showExperimental) return false;
            if (
              searchLower &&
              !`${tool.name} ${tool.description}`.toLowerCase().includes(searchLower)
            ) {
              return false;
            }
            return true;
          });
        },
        filteredResources(): IMCPResource[] {
          // @ts-ignore - Vue component context
          const { resources, resourcesFilter } = this;
          const searchLower = resourcesFilter.search.trim().toLowerCase();
          if (!searchLower) return resources;
          return resources.filter((resource: IMCPResource) =>
            `${resource.name} ${resource.description}`
              .toLowerCase()
              .includes(searchLower)
          );
        },
        availablePrompts(): IMCPPrompt[] {
          // @ts-ignore - Vue component context
          return this.prompts.filter((prompt: IMCPPrompt) => prompt.enabled);
        },
        availablePromptCount(): number {
          // @ts-ignore - Vue component context
          return this.prompts.filter((prompt: IMCPPrompt) => prompt.enabled).length;
        },
      },
      methods: {
        tl(key: string, variables?: string | number | (string | number)[]): string {
          return tl(key, variables);
        },
        runtimeStatusLabel(state: McpServerStatus): string {
          if (state === "starting") return "Starting";
          if (state === "failed") return "Runtime Error";
          return "Ready";
        },
        getDisplayName(toolName: string): string {
          return toolName.replace("blockbench_", "");
        },
        promptArgumentCount(prompt: IMCPPrompt): number {
          return Object.keys(prompt.arguments).length;
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
          // @ts-ignore - Vue component context
          if (!details.open) this.toolsFilter.search = "";
          // Event-driven refresh is enough to reconcile any external native
          // surface mutation; there is deliberately no background polling.
          // @ts-ignore - Vue component context
          this.$forceUpdate();
        },
        onResourcesToggle(event: Event): void {
          const details = event.target as HTMLDetailsElement;
          // @ts-ignore - Vue component context
          if (!details.open) this.resourcesFilter.search = "";
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
  overrideListener?.();
  overrideListener = undefined;
  runtimeStatusListener?.();
  runtimeStatusListener = undefined;
  overrideDialogTeardown();
  toolTestDialogTeardown();
  promptPreviewDialogTeardown();
  statusBarTeardown();
  panel?.delete();
  panel = undefined;
  panelCssHandle?.delete();
  panelCssHandle = undefined;
}

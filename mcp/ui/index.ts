import type { IMCPTool, IMCPPrompt, IMCPResource } from "@/types";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";
import type { McpAuthoringPhase } from "@/lib/authoringPhase";
import { pluginBrowserSetup, pluginBrowserTeardown } from "@/ui/pluginBrowser";
import {
  BLOCKIT_RUNTIME_STATUS_CHANGED,
  statusBarSetup,
  statusBarTeardown,
  type BlockItRuntimeStatusDetail,
  type McpServerStatus,
} from "@/ui/statusBar";
import { toolTestDialogTeardown } from "@/ui/toolTestDialog";
import { promptPreviewDialogTeardown } from "@/ui/promptPreviewDialog";
import { overrideDialogTeardown } from "@/ui/promptOverrideDialog";
import panelCSS from "@/ui/panel.css";
import template from "@/ui/panel.html";

let panel: Panel | undefined;
let runtimeStatusListener: (() => void) | undefined;
let panelCssHandle: { delete(): void } | undefined;

type UiSetupInput = {
  tools: Record<string, IMCPTool>;
  resources: Record<string, IMCPResource>;
  prompts: Record<string, IMCPPrompt>;
  profile: McpRegistrationProfile;
  phase: McpAuthoringPhase;
};

export function uiSetup(input: UiSetupInput) {
  // Keep the public setup contract stable even though normal human UI no longer
  // exposes Runtime registries or AI workflow internals.
  void input;

  // Blockbench reload order is not guaranteed to be perfectly serialized.
  // Make setup idempotent by clearing every UI/listener owner before rebuilding.
  uiTeardown();

  panelCssHandle = Blockbench.addCSS(panelCSS);
  statusBarSetup();
  pluginBrowserSetup();

  panel = new Panel("mcp_panel", {
    id: "mcp_panel",
    icon: "robot",
    name: "LazyDesigner",
    default_side: "right",
    resizable: true,
    component: {
      mounted() {
        // @ts-ignore - Vue component context
        const vm = this;
        const statusHandler = (event: Event) => {
          const detail = (event as CustomEvent<BlockItRuntimeStatusDetail>).detail;
          if (!detail) return;
          vm.runtime.state = detail.state;
        };
        document.addEventListener(BLOCKIT_RUNTIME_STATUS_CHANGED, statusHandler);
        runtimeStatusListener?.();
        runtimeStatusListener = () =>
          document.removeEventListener(BLOCKIT_RUNTIME_STATUS_CHANGED, statusHandler);
      },
      beforeDestroy() {
        runtimeStatusListener?.();
        runtimeStatusListener = undefined;
      },
      data: () => ({
        runtime: {
          state: "running" as McpServerStatus,
        },
      }),
      methods: {
        runtimeStatusLabel(state: McpServerStatus): string {
          if (state === "starting") return "Starting";
          if (state === "failed") return "Needs attention";
          return "Ready";
        },
        runtimeStatusMessage(state: McpServerStatus): string {
          if (state === "starting") return "Preparing AI authoring...";
          if (state === "failed") return "AI authoring is not available right now.";
          return "AI authoring is ready.";
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
  pluginBrowserTeardown();
  runtimeStatusListener?.();
  runtimeStatusListener = undefined;

  // These dialogs are no longer part of the normal human-facing panel, but
  // teardown remains so hot reload can safely close one opened by an older build.
  overrideDialogTeardown();
  toolTestDialogTeardown();
  promptPreviewDialogTeardown();

  statusBarTeardown();
  panel?.delete();
  panel = undefined;
  panelCssHandle?.delete();
  panelCssHandle = undefined;
}

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { IMCPTool, IMCPPrompt, IMCPResource } from "@/types";
import { VERSION } from "@/lib/constants";
import { statusBarSetup, statusBarTeardown } from "@/ui/statusBar";
import { sessionManager, type Session } from "@/lib/sessions";
import {
  serverState,
  getMcpServerKey,
  type McpServerState,
} from "@/lib/serverState";
import { openToolTestDialog } from "@/ui/toolTestDialog";
import { openPromptPreviewDialog } from "@/ui/promptPreviewDialog";
import { openPromptOverrideDialog, overrideDialogTeardown, PROMPT_OVERRIDE_CHANGED } from "@/ui/promptOverrideDialog";
import { hasPromptOverride } from "@/lib/promptLoader";
import { formatArgumentCount } from "@/ui/i18n";
import panelCSS from "@/ui/panel.css";
import template from "@/ui/panel.html";

let panel: Panel | undefined;
let unsubscribe: (() => void) | undefined;
let unsubscribeServer: (() => void) | undefined;
let overrideListener: (() => void) | undefined;

export function uiSetup({
  server,
  tools,
  resources,
  prompts,
}: {
  server: McpServer;
  tools: Record<string, IMCPTool>;
  resources: Record<string, IMCPResource>;
  prompts: Record<string, IMCPPrompt>;
}) {
  Blockbench.addCSS(panelCSS);

  // Setup the status bar
  statusBarSetup(server);

  panel = new Panel("mcp_panel", {
    id: "mcp_panel",
    icon: "robot",
    name: "MCP",
    default_side: "right",
    resizable: true,
    component: {
      mounted() {
        // Subscribe to session changes
        // @ts-ignore
        const vm = this;
        unsubscribe = sessionManager.subscribe((sessions: Session[]) => {
          vm.sessions = sessions.map((s: Session) => ({
            id: s.id,
            connectedAt: s.connectedAt,
            lastActivity: s.lastActivity,
            clientName: s.clientName,
            clientVersion: s.clientVersion,
          }));
          vm.server.connected = sessions.length > 0;
        });

        unsubscribeServer = serverState.subscribe((runtime: McpServerState) => {
          vm.server.status = runtime.status;
          vm.server.requestedPort = runtime.requestedPort;
          vm.server.port = runtime.port;
          vm.server.endpoint = runtime.endpoint;
          vm.server.url = runtime.url ?? "";
          vm.server.autoPort = runtime.autoPort;
          vm.server.fallbackUsed = runtime.fallbackUsed;
          vm.server.errorMessage = runtime.errorMessage ?? "";
          vm.server.projectName = runtime.projectName ?? "";
          vm.server.projectUuid = runtime.projectUuid ?? "";
        });

        // Listen for override changes to refresh badge state
        const handler = () => vm.$forceUpdate();
        document.addEventListener(PROMPT_OVERRIDE_CHANGED, handler);
        overrideListener = () => document.removeEventListener(PROMPT_OVERRIDE_CHANGED, handler);
      },
      beforeDestroy() {
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = undefined;
        }
        if (unsubscribeServer) {
          unsubscribeServer();
          unsubscribeServer = undefined;
        }
        if (overrideListener) {
          overrideListener();
          overrideListener = undefined;
        }
      },
      data: () => ({
        sessions: [] as Array<{ id: string; connectedAt: Date; lastActivity: Date; clientName?: string; clientVersion?: string }>,
        server: {
          connected: false,
          name: "Blockbench MCP",
          version: VERSION,
          status: "starting" as McpServerState["status"],
          requestedPort: 3000,
          port: undefined as number | undefined,
          endpoint: "/bb-mcp",
          url: "",
          autoPort: true,
          fallbackUsed: false,
          errorMessage: "",
          projectName: "",
          projectUuid: "",
        },
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
        // Filter states
        toolsFilter: {
          search: "",
          showExperimental: true,
        },
        resourcesFilter: {
          search: "",
        },
        promptsFilter: {
          search: "",
          showExperimental: true,
        },
      }),
      computed: {
        filteredTools(): Array<{ name: string; description: string; enabled: boolean; status: string }> {
          // @ts-ignore - Vue component context
          const { tools, toolsFilter } = this;
          const searchLower = toolsFilter.search.toLowerCase();
          return tools.filter((tool: { name: string; status: string }) => {
            // Check status filter (stable always visible, experimental based on toggle)
            if (tool.status === "experimental" && !toolsFilter.showExperimental) return false;
            // Check search filter (name only)
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
          return prompts.filter((prompt: { name: string; status: string }) => {
            // Check status filter (stable always visible, experimental based on toggle)
            if (prompt.status === "experimental" && !promptsFilter.showExperimental) return false;
            // Check search filter (name only)
            if (searchLower && !prompt.name.toLowerCase().includes(searchLower)) return false;
            return true;
          });
        },
      },
      methods: {
        // Expose tl() to Vue template
        tl(key: string, variables?: string | number | (string | number)[]): string {
          return tl(key, variables);
        },
        getDisplayName(toolName: string): string {
          return toolName.replace("blockbench_", "");
        },
        formatSessionId(session: { id: string; clientName?: string; clientVersion?: string }): string {
          if (session.clientName) {
            return session.clientVersion
              ? `${session.clientName} v${session.clientVersion}`
              : session.clientName;
          }
          return session.id.slice(0, 8) + "...";
        },
        formatTime(date: Date): string {
          return new Date(date).toLocaleTimeString();
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
        serverStatusLabel(): string {
          // @ts-ignore - Vue component context
          const status = this.server.status;
          const keyMap: Record<string, string> = {
            starting: "mcp.server.status_starting",
            listening: "mcp.server.status_listening",
            error: "mcp.server.status_error",
            stopped: "mcp.server.status_stopped",
          };
          return tl(keyMap[status] ?? "mcp.server.status_starting");
        },
        serverKey(): string {
          // @ts-ignore - Vue component context
          const { server } = this;
          return getMcpServerKey(
            server.projectName || null,
            server.port ?? server.requestedPort
          );
        },
        async copyText(text: string): Promise<void> {
          try {
            await navigator.clipboard.writeText(text);
            Blockbench.showQuickMessage(tl("mcp.server.copied"), 1500);
          } catch {
            Blockbench.showQuickMessage(tl("mcp.dialog.copy_failed"), 2000);
          }
        },
        copyUrl(): Promise<void> {
          // @ts-ignore - Vue component context
          return this.copyText(this.server.url);
        },
        getCodexSnippet(): string {
          // @ts-ignore - Vue component context
          const { server } = this;
          const key = this.serverKey();
          return `[mcp_servers.${key}]\nurl = "${server.url}"`;
        },
        getCursorSnippet(): string {
          // @ts-ignore - Vue component context
          const { server } = this;
          const key = this.serverKey();
          return JSON.stringify(
            { mcpServers: { [key]: { url: server.url } } },
            null,
            2
          );
        },
        getVSCodeSnippet(): string {
          return this.getCursorSnippet();
        },
        getClaudeDesktopSnippet(): string {
          // @ts-ignore - Vue component context
          const { server } = this;
          const key = this.serverKey();
          return JSON.stringify(
            {
              mcpServers: {
                [key]: {
                  command: "npx",
                  args: ["-y", "mcp-remote", server.url],
                },
              },
            },
            null,
            2
          );
        },
        copySnippet(
          kind: "codex" | "cursor" | "vscode" | "claude"
        ): Promise<void> {
          const getters: Record<string, () => string> = {
            codex: () => this.getCodexSnippet(),
            cursor: () => this.getCursorSnippet(),
            vscode: () => this.getVSCodeSnippet(),
            claude: () => this.getClaudeDesktopSnippet(),
          };
          return this.copyText(getters[kind]());
        },
      },
      name: "mcp_panel",
      template,
    },
    expand_button: true,
  });

  return panel;
}

export function uiTeardown() {
  overrideDialogTeardown();
  statusBarTeardown();
  panel?.delete();
}

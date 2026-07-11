/**
 * BuildIT MCP Server bootstrap.
 *
 * Keep this file intentionally dependency-free. Blockbench creates a local
 * plugin entry with fallback metadata before executing the bundle. Registering
 * the plugin before loading the runtime guarantees that the correct identity is
 * visible even when a later runtime dependency fails.
 *
 * @author MIVUBI
 * @upstream https://github.com/achmadawdi/mcp-blockbench
 * @repository https://github.com/halokaryamedia-source/BuildIT
 */
/// <reference types="three" />
/// <reference types="blockbench-types" />

type BuildITRuntime = typeof import("./runtime");

let runtime: BuildITRuntime | null = null;

BBPlugin.register("mcp", {
  version: "1.6.3",
  title: "BuildIT MCP Server",
  author: "MIVUBI",
  description:
    "Connect Blockbench to BuildIT and MCP-compatible AI clients through the canonical local server.",
  tags: ["MCP", "AI", "BuildIT"],
  icon: "hub",
  variant: "desktop",
  min_version: "5.0.0",

  async onload() {
    try {
      // The build wrapper declares a bundle-scoped `process` variable without
      // requesting permission. Request and assign it only after registration so
      // Blockbench never falls back to the blank local-plugin identity.
      // @ts-ignore - requireNativeModule and the writable process binding are Blockbench runtime globals.
      process = requireNativeModule("process", {
        message: "System access is required to run BuildIT MCP inside Blockbench.",
        detail:
          "BuildIT MCP uses the local process runtime only for the MCP server and controlled workspace operations.",
        optional: false,
      });

      if (!process) {
        throw new Error("Process permission was not granted.");
      }

      runtime = await import("./runtime");
      await runtime.startPluginRuntime();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[BuildIT MCP] Runtime startup failed:", error);
      Blockbench.showMessageBox({
        title: "BuildIT MCP Server",
        icon: "error",
        message:
          `The plugin was registered, but the MCP runtime could not start.\n\n${message}\n\n` +
          "Open Help → Developer Tools → Console for the full error.",
      });
    }
  },

  onunload() {
    runtime?.stopPluginRuntime();
    runtime = null;
  },

  oninstall() {
    Blockbench.showQuickMessage("Installed BuildIT MCP Server by MIVUBI", 2500);
  },

  onuninstall() {
    runtime?.stopPluginRuntime();
    runtime = null;
    Blockbench.showQuickMessage("Uninstalled BuildIT MCP Server", 2500);
  },
});

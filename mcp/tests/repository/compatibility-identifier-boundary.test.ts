import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("LazyDesigner compatibility identifier boundary", () => {
  test("install, protocol and persisted identifiers remain stable during presentation rename", async () => {
    const [pkgText, contract, affinity, settings, authoringPhase, profile, plugin, statusBar] = await Promise.all([
      source("package.json"),
      source("gateway/contract.ts"),
      source("gateway/projectAffinity.ts"),
      source("ui/settings.ts"),
      source("lib/authoringPhase.ts"),
      source("lib/registrationProfile.ts"),
      source("index.ts"),
      source("ui/statusBar.ts"),
    ]);
    const pkg = JSON.parse(pkgText) as { name: string; main: string };

    expect(pkg.name).toBe("blockit-bedrock-entity-mcp");
    expect(pkg.main).toBe("dist/blockit_mcp.js");
    expect(contract).toContain('GATEWAY_NAME = "blockit-gateway"');
    expect(affinity).toContain('"x-blockit-project-uuid"');
    expect(affinity).toContain('"x-blockit-authoring-phase"');
    expect(settings).toContain('"blockit_mcp.extended_families_enabled"');
    expect(authoringPhase).toContain('MCP_AUTHORING_PHASE_SETTING_ID = "mcp_authoring_phase"');
    expect(profile).toContain('"mcp_extended_families_enabled"');
    expect(plugin).toContain('BBPlugin.register("blockit_mcp"');
    expect(plugin).toContain("__BLOCKIT_BUILD_ID__");
    expect(statusBar).toContain('BLOCKIT_RUNTIME_STATUS_CHANGED = "blockit-runtime-status-changed"');
  });

  test("human-facing Runtime, affinity, settings and status language uses LazyDesigner", async () => {
    const [affinity, settings, plugin, server, statusBar, readme] = await Promise.all([
      source("gateway/projectAffinity.ts"),
      source("ui/settings.ts"),
      source("index.ts"),
      source("server/server.ts"),
      source("ui/statusBar.ts"),
      source("README.md"),
    ]);

    expect(affinity).toContain("LazyDesigner project affinity");
    expect(affinity).toContain("LazyDesigner authoring phase affinity");
    expect(settings).toContain("LazyDesigner Legacy UI Fallbacks");
    expect(server).toContain("LazyDesigner Bedrock Entity authoring");
    expect(plugin).toContain("Installed LazyDesigner Bedrock Entity MCP");
    expect(plugin).toContain("Uninstalled LazyDesigner Bedrock Entity MCP");
    expect(plugin).toContain("LazyDesigner MCP initialization failed");
    expect(statusBar).toContain('return "LazyDesigner Starting"');
    expect(statusBar).toContain('return "LazyDesigner Error"');
    expect(statusBar).toContain('return "LazyDesigner Ready"');
    expect(statusBar).toContain("Click to open LazyDesigner panel");
    expect(readme).toContain("LazyDesigner");

    expect(affinity).not.toContain('throw new Error("BlockIT');
    expect(settings).not.toContain("BlockIT Legacy UI Fallbacks");
    expect(server).not.toContain("BlockIT Bedrock Entity authoring");
    expect(plugin).not.toContain("Installed BlockIT Bedrock Entity MCP");
    expect(plugin).not.toContain("Uninstalled BlockIT Bedrock Entity MCP");
    expect(statusBar).not.toContain('return "BlockIT');
  });

  test("compatibility policy explicitly forbids blind bulk rename", async () => {
    const policy = await source("../docs/04-system/compatibility-identifiers.md");
    expect(policy).toContain("Do not bulk-replace `blockit` across the repository");
    expect(policy).toContain("Compatibility-Bound Identifiers");
    expect(policy).toContain("Presentation Identity");
    expect(policy).toContain("Migration Preconditions");
  });
});

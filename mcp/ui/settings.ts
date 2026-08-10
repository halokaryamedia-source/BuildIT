import { MCP_EXTENDED_FAMILIES_SETTING_ID } from "@/lib/registrationProfile";

const settings: Setting[] = [];

export function settingsSetup(): void {
  settingsTeardown();
  const category = "general";

  settings.push(
    new Setting("mcp_port", {
      name: tl("mcp.settings.port_name"),
      description: tl("mcp.settings.port_desc"),
      type: "number",
      value: 3000,
      category,
      icon: "numbers",
    }),
    new Setting("mcp_endpoint", {
      name: tl("mcp.settings.endpoint_name"),
      description: tl("mcp.settings.endpoint_desc"),
      type: "text",
      value: "/bb-mcp",
      category,
      icon: "webhook",
    }),
    new Setting(MCP_EXTENDED_FAMILIES_SETTING_ID, {
      name: "Extended MCP Families",
      description:
        "Explicitly expose the source-preserved generic import/UI fallback families on the next MCP plugin load. risky_eval and from_geo_json remain disabled.",
      type: "toggle",
      value: false,
      category,
      icon: "extension",
    })
  );
}

export function settingsTeardown(): void {
  for (const setting of settings.splice(0)) {
    setting.delete();
  }
}

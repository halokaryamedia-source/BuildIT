import { MCP_EXTENDED_FAMILIES_SETTING_ID } from "@/lib/registrationProfile";

const settings: Setting[] = [];

export function settingsSetup() {
  const category = "general";

  settings.push(
    new Setting("mcp_instructions", {
      name: tl("mcp.settings.instructions_name"),
      description: tl("mcp.settings.instructions_desc"),
      type: "text",
      value:
        "Generate simple, low-poly models for Minecraft inside Blockbench.",
      category,
      icon: "psychology",
    }),
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
    new Setting("mcp_prompt_cdn_enabled", {
      name: tl("mcp.settings.prompt_cdn_name"),
      description: tl("mcp.settings.prompt_cdn_desc"),
      type: "toggle",
      // Local bundled prompts are authoritative. CDN content is an optional
      // fallback for prompt names not provided by the Local build.
      value: false,
      category,
      icon: "cloud_download",
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

export function settingsTeardown() {
  settings.forEach((setting) => {
    setting.delete();
  });
}

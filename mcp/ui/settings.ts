import { MCP_EXTENDED_FAMILIES_SETTING_ID } from "@/lib/registrationProfile";
import {
  DEFAULT_MCP_AUTHORING_PHASE,
  MCP_AUTHORING_PHASE_SETTING_ID,
} from "@/lib/authoringPhase";

const settings: Setting[] = [];
let extendedProfileHandler: ((enabled: boolean) => void) | undefined;

const EXTENDED_FAMILIES_STORAGE_KEY =
  "blockit_mcp.extended_families_enabled";

export function setExtendedMcpFamiliesEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(
      EXTENDED_FAMILIES_STORAGE_KEY,
      enabled ? "true" : "false"
    );
  } catch {
    // The normal Blockbench setting remains the fallback source.
  }
  Settings.save();
  Blockbench.showQuickMessage(
    `BlockIT EXTENDED profile ${enabled ? "enabled" : "disabled"}. MCP surface updated.`,
    3000
  );
  extendedProfileHandler?.(enabled);
}

export function setExtendedMcpProfileHandler(
  handler: (enabled: boolean) => void
): void {
  extendedProfileHandler = handler;
}

export function clearExtendedMcpProfileHandler(): void {
  extendedProfileHandler = undefined;
}

export function isExtendedMcpFamiliesEnabled(): boolean {
  try {
    const storedValue = localStorage.getItem(EXTENDED_FAMILIES_STORAGE_KEY);
    if (storedValue === "true" || storedValue === "false") {
      return storedValue === "true";
    }
  } catch {
    // Fall through to the normal Blockbench setting.
  }
  return Settings.get(MCP_EXTENDED_FAMILIES_SETTING_ID) === true;
}

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
    new Setting(MCP_AUTHORING_PHASE_SETTING_ID, {
      name: "MCP Authoring Phase",
      description:
        "Expose Core tools plus exactly one authoring phase on the next plugin load/reload. Change phase only at a deliberate Geometry, Texturing, or Animation handoff.",
      type: "select",
      value: DEFAULT_MCP_AUTHORING_PHASE,
      options: {
        geometry: "Geometry + Rig + UV Layout",
        texturing: "Texturing",
        animation: "Animation",
      },
      requires_restart: true,
      category,
    }),
    new Setting(MCP_EXTENDED_FAMILIES_SETTING_ID, {
      name: "Extended MCP Families",
      description:
        "Explicitly expose the source-preserved generic import/UI fallback families immediately. risky_eval and from_geo_json remain disabled.",
      type: "toggle",
      value: false,
      category,
      icon: "extension",
      onChange(value) {
        setExtendedMcpFamiliesEnabled(value === true);
      },
    })
  );
}

export function settingsTeardown(): void {
  for (const setting of settings.splice(0)) {
    setting.delete();
  }
}

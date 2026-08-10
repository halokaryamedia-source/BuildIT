import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
  EXTENDED_LEGACY_REGISTRATION_FAMILIES,
  MCP_EXTENDED_FAMILIES_SETTING_ID,
  getRegistrationFamilies,
  resolveMcpRegistrationProfile,
} from "@/lib/registrationProfile";

describe("P1.2 MCP family gates", () => {
  test("extended families require an explicit boolean opt-in", () => {
    expect(resolveMcpRegistrationProfile(undefined)).toBe(
      DEFAULT_MCP_REGISTRATION_PROFILE
    );
    expect(resolveMcpRegistrationProfile(false)).toBe(
      DEFAULT_MCP_REGISTRATION_PROFILE
    );
    expect(resolveMcpRegistrationProfile("true")).toBe(
      DEFAULT_MCP_REGISTRATION_PROFILE
    );
    expect(resolveMcpRegistrationProfile(true)).toBe("extended");
  });

  test("extended profile adds only the proven generic fallback families", () => {
    expect(EXTENDED_LEGACY_REGISTRATION_FAMILIES).toEqual(["import", "ui"]);

    const defaultFamilies = getRegistrationFamilies("bedrock_entity");
    const extendedFamilies = getRegistrationFamilies("extended");

    expect(extendedFamilies).toEqual([
      ...defaultFamilies,
      ...EXTENDED_LEGACY_REGISTRATION_FAMILIES,
    ]);
  });

  test("plugin setting is default-off and applied before server startup", async () => {
    const [settingsSource, indexSource] = await Promise.all([
      readFile(new URL("../ui/settings.ts", import.meta.url), "utf8"),
      readFile(new URL("../index.ts", import.meta.url), "utf8"),
    ]);

    expect(settingsSource).toContain(
      `new Setting(MCP_EXTENDED_FAMILIES_SETTING_ID, {`
    );

    const settingStart = settingsSource.indexOf(
      "new Setting(MCP_EXTENDED_FAMILIES_SETTING_ID"
    );
    const nextSetting = settingsSource.indexOf(
      'new Setting("mcp_session_timeout"',
      settingStart
    );
    expect(settingsSource.slice(settingStart, nextSetting)).toContain(
      "value: false"
    );

    const settingsSetup = indexSource.indexOf("settingsSetup();");
    const gatedRegistration = indexSource.indexOf("registerMcpProfile(");
    const serverStartup = indexSource.indexOf("createNetServer(net");

    expect(settingsSetup).toBeGreaterThan(-1);
    expect(gatedRegistration).toBeGreaterThan(settingsSetup);
    expect(serverStartup).toBeGreaterThan(gatedRegistration);
    expect(indexSource).toContain(
      "Settings.get(MCP_EXTENDED_FAMILIES_SETTING_ID)"
    );
  });

  test("registration root adds profiles idempotently by family", async () => {
    const source = await readFile(
      new URL("../server/tools.ts", import.meta.url),
      "utf8"
    );

    expect(source).toContain(
      "const registeredFamilies = new Set<McpRegistrationFamily>();"
    );
    expect(source).toContain("if (registeredFamilies.has(family)) continue;");
    expect(source).toContain("registeredFamilies.add(family);");
    expect(source).toContain(
      "registerMcpProfile(DEFAULT_MCP_REGISTRATION_PROFILE);"
    );
  });

  test("dangerous tools stay disabled inside opted-in fallback families", async () => {
    const [importSource, uiSource] = await Promise.all([
      readFile(new URL("../server/tools/import.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/ui.ts", import.meta.url), "utf8"),
    ]);

    const geoJsonStart = importSource.indexOf(
      "createTool(importToolDocs[0].name"
    );
    expect(geoJsonStart).toBeGreaterThan(-1);
    expect(importSource.slice(geoJsonStart)).toContain(
      "importToolDocs[0].status, false"
    );

    const riskyEvalStart = uiSource.indexOf("createTool(\n    uiToolDocs[1].name");
    const nextUiTool = uiSource.indexOf(
      "createTool(\n    uiToolDocs[2].name",
      riskyEvalStart
    );
    expect(riskyEvalStart).toBeGreaterThan(-1);
    expect(nextUiTool).toBeGreaterThan(riskyEvalStart);
    expect(uiSource.slice(riskyEvalStart, nextUiTool)).toContain(
      "uiToolDocs[1].status,\n    false"
    );
  });

  test("setting identifier remains centralized", () => {
    expect(MCP_EXTENDED_FAMILIES_SETTING_ID).toBe(
      "mcp_extended_families_enabled"
    );
  });
});

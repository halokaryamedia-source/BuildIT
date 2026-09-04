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
  test("internal extended compatibility still requires explicit boolean opt-in", () => {
    expect(resolveMcpRegistrationProfile(undefined)).toBe(DEFAULT_MCP_REGISTRATION_PROFILE);
    expect(resolveMcpRegistrationProfile(false)).toBe(DEFAULT_MCP_REGISTRATION_PROFILE);
    expect(resolveMcpRegistrationProfile("true")).toBe(DEFAULT_MCP_REGISTRATION_PROFILE);
    expect(resolveMcpRegistrationProfile(true)).toBe("extended");
  });

  test("extended compatibility adds only legacy fallback families", () => {
    expect(EXTENDED_LEGACY_REGISTRATION_FAMILIES).toEqual(["import", "ui"]);
    expect(getRegistrationFamilies("extended")).toEqual([
      ...getRegistrationFamilies("bedrock_entity"),
      ...EXTENDED_LEGACY_REGISTRATION_FAMILIES,
    ]);
  });

  test("Blockbench presents fallback families as debug maintenance rather than authoring profile", async () => {
    const [settingsSource, indexSource] = await Promise.all([
      readFile(new URL("../ui/settings.ts", import.meta.url), "utf8"),
      readFile(new URL("../index.ts", import.meta.url), "utf8"),
    ]);

    expect(settingsSource).toContain(`new Setting(MCP_EXTENDED_FAMILIES_SETTING_ID, {`);
    expect(settingsSource).toContain('name: "Legacy UI Fallbacks (Debug)"');
    expect(settingsSource).toContain("not an authoring profile");
    expect(settingsSource).toContain("value: false");

    const settingsSetup = indexSource.indexOf("settingsSetup();");
    const gatedRegistration = indexSource.indexOf("registerMcpProfile(");
    const serverStartup = indexSource.indexOf("if (!(await startMcpServer())) return;");
    expect(settingsSetup).toBeGreaterThan(-1);
    expect(gatedRegistration).toBeGreaterThan(settingsSetup);
    expect(serverStartup).toBeGreaterThan(gatedRegistration);
    expect(indexSource).toContain("isExtendedMcpFamiliesEnabled()");
  });

  test("registration root keeps family registration idempotent", async () => {
    const source = await readFile(new URL("../server/tools.ts", import.meta.url), "utf8");
    expect(source).toContain("const registeredFamilies = new Set<McpRegistrationFamily>();");
    expect(source).toContain("if (registeredFamilies.has(family)) return;");
    expect(source).toContain("registeredFamilies.add(family);");
    expect(source).toContain("registerMcpProfile(DEFAULT_MCP_REGISTRATION_PROFILE);");
  });

  test("dangerous fallback tools remain disabled", async () => {
    const [importSource, uiSource] = await Promise.all([
      readFile(new URL("../server/tools/import.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/ui.ts", import.meta.url), "utf8"),
    ]);
    expect(importSource).toContain("importToolDocs[0].status, false");
    expect(uiSource).toContain("uiToolDocs[1].status");
    expect(uiSource).toContain("false");
  });

  test("setting identifier remains compatible", () => {
    expect(MCP_EXTENDED_FAMILIES_SETTING_ID).toBe("mcp_extended_families_enabled");
  });
});

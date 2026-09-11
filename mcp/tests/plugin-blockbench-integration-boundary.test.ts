import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Blockbench integration ownership", () => {
  test("plugin entrypoint delegates settings, UI, prompt and reference integration", async () => {
    const indexSource = await source("index.ts");

    expect(indexSource).toContain("new BlockbenchIntegration()");
    expect(indexSource).toContain("blockbenchIntegration.setupBase");
    expect(indexSource).toContain("blockbenchIntegration.loadPrompts");
    expect(indexSource).toContain("blockbenchIntegration.setupUi");
    expect(indexSource).toContain("blockbenchIntegration.teardown");

    expect(indexSource).not.toContain("settingsSetup()");
    expect(indexSource).not.toContain("uiSetup({");
    expect(indexSource).not.toContain("registerReferenceModelsResource()");
    expect(indexSource).not.toContain("initPromptLoader()");
  });

  test("settings teardown owns its callback cleanup", async () => {
    const settingsSource = await source("ui/settings.ts");
    expect(settingsSource).toContain("extendedProfileHandler = undefined;");
  });

  test("UI setup is idempotent across plugin reloads", async () => {
    const uiSource = await source("ui/index.ts");
    const setupBody = uiSource.slice(uiSource.indexOf("export function uiSetup"));
    expect(setupBody).toContain("uiTeardown();");
  });
});

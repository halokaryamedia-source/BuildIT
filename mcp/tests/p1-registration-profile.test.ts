import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import {
  BEDROCK_ENTITY_REGISTRATION_FAMILIES,
  DEFAULT_MCP_REGISTRATION_PROFILE,
  EXTENDED_LEGACY_REGISTRATION_FAMILIES,
  getRegistrationFamilies,
} from "@/lib/registrationProfile";

describe("P1 Bedrock Entity registration profile", () => {
  test("default profile preserves audited Bedrock families", () => {
    expect(DEFAULT_MCP_REGISTRATION_PROFILE).toBe("bedrock_entity");

    const families = new Set(getRegistrationFamilies());

    for (const requiredFamily of [
      "animation",
      "animation_inspection",
      "camera",
      "cubes",
      "elements",
      "element_inspection",
      "export",
      "history",
      "material_instances",
      "paint",
      "project",
      "textures",
      "validator_resources",
    ]) {
      expect(families.has(requiredFamily as never)).toBe(true);
    }

    expect(families.has("import" as never)).toBe(false);
    expect(families.has("ui" as never)).toBe(false);
  });

  test("extended profile adds only retained generic fallback families", () => {
    const defaultFamilies = getRegistrationFamilies("bedrock_entity");
    const extendedFamilies = getRegistrationFamilies("extended");

    expect(new Set(defaultFamilies).size).toBe(defaultFamilies.length);
    expect(new Set(extendedFamilies).size).toBe(extendedFamilies.length);

    expect(extendedFamilies).toEqual([
      ...BEDROCK_ENTITY_REGISTRATION_FAMILIES,
      ...EXTENDED_LEGACY_REGISTRATION_FAMILIES,
    ]);
    expect(EXTENDED_LEGACY_REGISTRATION_FAMILIES).toEqual(["import", "ui"]);
  });

  test("registration root consumes the explicit default profile", async () => {
    const source = await readFile(
      new URL("../server/tools.ts", import.meta.url),
      "utf8"
    );

    expect(source).toContain(
      "registerMcpProfile(DEFAULT_MCP_REGISTRATION_PROFILE);"
    );
    expect(source).toContain("getRegistrationFamilies(profile)");
    expect(source).toContain("import: registerImportTools");
    expect(source).toContain("ui: registerUITools");
    expect(source).not.toContain("registerImportTools,\n  registerUITools");
  });

  test("developer and eval prompts are not default registered", async () => {
    const source = await readFile(
      new URL("../server/prompts.ts", import.meta.url),
      "utf8"
    );

    const nativePrompt = source.indexOf('"blockbench_native_apis"');
    const evalPrompt = source.indexOf('"blockbench_code_eval_safety"');
    const strategyPrompt = source.indexOf('createPrompt("bedrock_entity_workflow"');

    expect(nativePrompt).toBeGreaterThan(-1);
    expect(evalPrompt).toBeGreaterThan(-1);
    expect(strategyPrompt).toBeGreaterThan(-1);

    expect(source.slice(nativePrompt, evalPrompt)).toContain('"stable",\n  false');
    expect(source.slice(evalPrompt, strategyPrompt)).toContain('"stable",\n  false');
  });
});

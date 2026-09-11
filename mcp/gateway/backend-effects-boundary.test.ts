import { describe, expect, test } from "bun:test";

const backendSource = await Bun.file(new URL("./backend.ts", import.meta.url)).text();

describe("Gateway capability effect boundary", () => {
  test("backend routes affinity changes through declarative metadata", () => {
    expect(backendSource).toContain("resolveGatewayCapabilityEffects");
    expect(backendSource).toContain("getCapabilityMetadata(capability)");
  });

  test("backend does not branch on canonical capability names", () => {
    expect(backendSource).not.toContain('capability === "create_project"');
    expect(backendSource).not.toContain('capability === "switch_authoring_phase"');
    expect(backendSource).not.toContain('capability !== "switch_authoring_phase"');
  });
});

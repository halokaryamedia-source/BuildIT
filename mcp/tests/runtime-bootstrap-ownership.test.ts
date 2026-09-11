import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Runtime bootstrap ownership", () => {
  test("server.ts delegates intelligence wiring to one bootstrap", async () => {
    const text = await source("server/server.ts");

    expect(text).toContain("initializeRuntimeCapabilityWiring();");
    expect(text).not.toContain("wireAuthoringQualityIntelligence();");
    expect(text).not.toContain("wireTextureQualityRuntime();");
    expect(text).not.toContain("wireAnimationNativeIntelligence();");
    expect(text).not.toContain("describeMcpSurfaceToolNames(profile, phase)");
  });

  test("runtime bootstrap is explicitly idempotent", async () => {
    const text = await source("server/runtime/bootstrap.ts");

    expect(text).toContain("let initialized = false");
    expect(text).toContain("if (initialized) return");
    expect(text).toContain("initialized = true");
  });
});

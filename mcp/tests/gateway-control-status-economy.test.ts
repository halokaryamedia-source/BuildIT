import { describe, expect, test } from "bun:test";
import { decorateCapabilities } from "@/gateway/control";

describe("LazyDesigner Control status economy", () => {
  test("capability decoration stays useful without a status-only current domain", () => {
    const [capability] = decorateCapabilities([
      {
        capability_id: "paint_with_brush",
        description: "Paint texture pixels.",
        tier: "primary",
        read_only: false,
        destructive: true,
        idempotent: false,
      },
    ]);

    expect(capability.control.authoring_domain).toBe("TEXTURING");
    expect(capability.control.current_domain).toBe(false);
    expect(capability.control.eligibility).toBe("AVAILABLE");
  });

  test("search and describe do not perform metadata-only status rereads", async () => {
    const source = await Bun.file("gateway/index.ts").text();
    const searchStart = source.indexOf("GATEWAY_TOOLS.searchCapabilities");
    const describeStart = source.indexOf("GATEWAY_TOOLS.describeCapability");
    const invokeStart = source.indexOf("GATEWAY_TOOLS.invokeCapability");

    const searchBlock = source.slice(searchStart, describeStart);
    const describeBlock = source.slice(describeStart, invokeStart);

    expect(searchBlock).toContain("backend.searchCapabilities");
    expect(searchBlock).not.toContain("backend.getStatus()");
    expect(describeBlock).toContain("backend.describeCapability");
    expect(describeBlock).not.toContain("backend.getStatus()");
    expect(describeBlock).not.toContain("current_phase:");
  });

  test("status reads remain explicit for orientation and phase handoff only", async () => {
    const source = await Bun.file("gateway/index.ts").text();
    expect(source).toContain("await backend.getStatus()");
    expect(source).toContain('const phaseBefore = capability === "switch_authoring_phase"');
  });
});

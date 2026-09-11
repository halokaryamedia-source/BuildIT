import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8");
}

describe("quality diagnostics vs gate ownership", () => {
  test("quality intelligence remains evidence-only", async () => {
    const quality = await source("../server/tools/quality-intelligence.ts");

    for (const field of [
      "geometry_hygiene",
      "surface_quality_summary",
      "rig_graph",
      "reference_envelope_fidelity",
      "optimization_opportunities",
      "color_profile",
      "root_motion",
      "animation_quality",
    ]) {
      expect(quality).toContain(`field: "${field}"`);
    }

    expect(quality).not.toMatch(/field:\s*["'](?:approved|approval|visual_pass|user_approval|gate)["']/i);
    expect(quality).not.toContain("requestMcpPhaseSwitch(");
    expect(quality).not.toContain("setMcpPhaseSwitchHandler(");
    expect(quality).not.toContain("geometry_approved");
    expect(quality).not.toContain("texture_approved");
    expect(quality).not.toContain("autonomous_authorized");
  });

  test("handoff approval semantics live in the readiness owner", async () => {
    const [readiness, phaseControl] = await Promise.all([
      source("../lib/authoringReadiness.ts"),
      source("../server/runtime/phaseControl.ts"),
    ]);

    expect(readiness).toContain('"USER_APPROVED"');
    expect(readiness).toContain('"AUTONOMOUS_VERIFIED"');
    expect(readiness).toContain("Internal diagnostic PASS never equals user approval");
    expect(phaseControl).toContain("animationHandoffReadinessSchema");
    expect(phaseControl).toContain("summarizeAnimationHandoffReadiness");
  });
});

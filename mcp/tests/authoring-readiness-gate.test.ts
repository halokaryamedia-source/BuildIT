import { describe, expect, test } from "bun:test";
import {
  animationHandoffReadinessSchema,
  classifyAnimationHandoffReadiness,
  summarizeAnimationHandoffReadiness,
} from "@/lib/authoringReadiness";

describe("Animation handoff readiness gate", () => {
  test("distinguishes explicit user approval from autonomous verification", () => {
    const approved = animationHandoffReadinessSchema.parse({
      geometry_approved: true,
      uv_layout: "PASS",
      texture_approved: true,
      checkpoint: "C:/asset/checkpoint.bbmodel",
      no_blockers: true,
    });
    const autonomous = animationHandoffReadinessSchema.parse({
      autonomous_authorized: true,
      geometry_verified: true,
      uv_layout: "PASS",
      texture_verified: true,
      checkpoint: "C:/asset/checkpoint.bbmodel",
      evidence: "Current revision geometry and texture evidence verified.",
      no_blockers: true,
    });

    expect(classifyAnimationHandoffReadiness(approved)).toBe("USER_APPROVED");
    expect(classifyAnimationHandoffReadiness(autonomous)).toBe("AUTONOMOUS_VERIFIED");
    expect(summarizeAnimationHandoffReadiness(approved).user_approval_claim).toBe(true);
    expect(summarizeAnimationHandoffReadiness(autonomous).user_approval_claim).toBe(false);
    expect(summarizeAnimationHandoffReadiness(autonomous).evidence_present).toBe(true);
  });

  test("rejects incomplete readiness instead of inferring PASS", () => {
    expect(() => animationHandoffReadinessSchema.parse({
      geometry_approved: true,
      uv_layout: "PASS",
      checkpoint: "C:/asset/checkpoint.bbmodel",
      no_blockers: true,
    })).toThrow();

    expect(() => animationHandoffReadinessSchema.parse({
      autonomous_authorized: true,
      geometry_verified: true,
      uv_layout: "PASS",
      texture_verified: true,
      checkpoint: "C:/asset/checkpoint.bbmodel",
      evidence: "",
      no_blockers: true,
    })).toThrow();
  });
});

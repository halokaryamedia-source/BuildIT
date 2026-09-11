import { describe, expect, test } from "bun:test";
import { deriveValidatorGateVerdict } from "@/lib/validationVerdict";

describe("Validator gate verdict", () => {
  test("errors block technical readiness", () => {
    const verdict = deriveValidatorGateVerdict(2, 3);
    expect(verdict.state).toBe("BLOCKED");
    expect(verdict.can_continue_technical_validation).toBe(false);
    expect(verdict.approval_claim).toBe(false);
    expect(verdict.visual_pass_claim).toBe(false);
  });

  test("warnings require review without pretending approval", () => {
    const verdict = deriveValidatorGateVerdict(0, 2);
    expect(verdict.state).toBe("REVIEW_REQUIRED");
    expect(verdict.can_continue_technical_validation).toBe(true);
    expect(verdict.approval_claim).toBe(false);
    expect(verdict.visual_pass_claim).toBe(false);
  });

  test("clean validator is technical evidence only", () => {
    const verdict = deriveValidatorGateVerdict(0, 0);
    expect(verdict.state).toBe("VALIDATOR_CLEAR");
    expect(verdict.can_continue_technical_validation).toBe(true);
    expect(verdict.approval_claim).toBe(false);
    expect(verdict.visual_pass_claim).toBe(false);
    expect(verdict.meaning).toContain("does not imply");
  });
});

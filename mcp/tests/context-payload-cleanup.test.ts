import { describe, expect, test } from "bun:test";
import { inspectAnimationParameters } from "@/server/tools/animation-inspection";
import { listOutlineParameters } from "@/server/tools/element";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local context and payload cleanup", () => {
  test("canonical workflow stays compact while preserving hard validity invariants", async () => {
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    expect(workflow.length).toBeLessThan(10_000);
    for (const invariant of [
      "minimum necessary evidence",
      "SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE",
      "visual_verdict: not_evaluated",
      "FAIL",
      "UNVERIFIED",
      "PASS",
      "BLOCKED",
      "same causal correction direction fails twice without new evidence",
      "geometry_effect",
      "Protected Native Capability Gaps",
      "Native Bedrock PBR and per-face `material_instance` are **not** gaps",
    ]) {
      expect(workflow.toLowerCase()).toContain(invariant.toLowerCase());
    }
  });

  test("panel metadata uses actual tool descriptions", async () => {
    const factories = await source("lib/factories.ts");
    expect(factories).toContain("description: toolDef.description");
    expect(factories).not.toContain("description: toolDef.title,");
  });

  test("Texture resource stays metadata-only and routes image reads to get_texture", async () => {
    const resources = await source("server/resources.ts");
    expect(resources).toContain("has_source: Boolean(texture.source)");
    expect(resources).not.toContain("source: texture.source || null");
    expect(resources).toContain("use `get_texture` when image data is actually needed");
  });

  test("validator status is summary-only with lazy detail resources", async () => {
    const validator = await source("server/resources/validator.ts");
    const start = validator.indexOf('createResource("validator-status"');
    const end = validator.indexOf('createResource("validator-checks"', start);
    const statusSection = validator.slice(start, end);
    expect(statusSection).toContain("detail_resources");
    expect(statusSection).toContain('errors: "validator://errors"');
    expect(statusSection).not.toContain("const errors = Validator.errors.map");
    expect(statusSection).not.toContain("const warnings = Validator.warnings.map");
  });

  test("animation summary keeps particle-effect keyframes lazy by default", async () => {
    expect(inspectAnimationParameters.parse({}).include_effect_keyframes).toBe(false);
    expect(
      inspectAnimationParameters.parse({ include_effect_keyframes: true })
        .include_effect_keyframes
    ).toBe(true);

    const inspection = await source("server/tools/animation-inspection.ts");
    expect(inspection).toContain(
      "inspectParticleEffects(animation, include_effect_keyframes)"
    );
    expect(inspection).toContain(
      "...(includeKeyframes ? { keyframes: inspectedKeyframes } : {})"
    );
  });

  test("list_outline bounds breadth as well as depth", async () => {
    const parsed = listOutlineParameters.parse({});
    expect(parsed.max_depth).toBe(32);
    expect(parsed.max_nodes).toBe(500);
    expect(listOutlineParameters.safeParse({ max_nodes: 5001 }).success).toBe(false);

    const elements = await source("server/tools/element.ts");
    const start = elements.indexOf("createTool(elementToolDocs[2].name");
    const end = elements.indexOf("createTool(elementToolDocs[3].name", start);
    const outline = elements.slice(start, end);
    expect(outline).toContain("let returnedNodes = 0");
    expect(outline).toContain("returnedNodes >= max_nodes");
    expect(outline).toContain("truncated_at_max_nodes: nodeLimitReached || undefined");
    expect(outline).toContain("returned_nodes: returnedNodes");
  });

  test("context cleanup changes payload, not Bedrock capability/profile architecture", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const next = await source("../docs/knowledge/next-action.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("context_mode");
    expect(next).toContain("MCP_TOOL_EXPOSURE_WIRE_AUDIT_COMPLETE_LOCAL_DEFERRED_LOADING_PROOF_REQUIRED");
    expect(next).toContain("`nodes://` remains unchanged");
  });
});

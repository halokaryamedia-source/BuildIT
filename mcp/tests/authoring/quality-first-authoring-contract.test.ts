import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("quality-first generic authoring contract", () => {
  test("runtime guidance preserves explicit atlas constraints and distinguishes concealed contact evidence", async () => {
    const prompt = await source("prompts/bedrock_entity_workflow.md");
    expect(prompt).toContain("Approved bitmap size/density takes precedence");
    expect(prompt).toContain("bounded surface/contact review");
    expect(prompt).toContain("side/bottom views");
    expect(prompt).toContain("Known major mismatch stays FAIL");
    expect(prompt).not.toContain("New AI production uses logical UV 128×128");
  });
  test("review boundaries preserve rejection and require current differences and playable motion", async () => {
    const [router, geometry, texture, animation, flow] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
      source("../docs/knowledge/flow.md"),
    ]);
    expect(router).toMatch(/historical approvals[\s\S]*rejection/);
    expect(router).toContain("UNKNOWN");
    expect(geometry).toMatch(/dimensions[\s\S]*user before dependent construction/);
    expect(geometry).toMatch(/remaining reference differences[\s\S]*representative extremes/);
    expect(texture).toMatch(/identity-critical patch[\s\S]*before propagation/);
    expect(animation).toMatch(/three consecutive cycles[\s\S]*playable evidence[\s\S]*UNVERIFIED/);
    expect(flow).toMatch(/operation evidence, technical checks, internal visual verdict and user acceptance/);
  });
  test("Geometry protects assembly, mapped resize, motion readiness, and requested atlas constraints", async () => {
    const skill = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");

    for (const marker of [
      "motion-ready structure",
      "required surface class",
      "PRESERVE_MAPPING | PRESERVE_DENSITY | RELAYOUT",
      "Requested atlas size and density are constraints",
      "whole assembly boundary",
    ]) expect(skill).toContain(marker);

    expect(skill).toMatch(/known rig\/contact defect[^\n]*does not wait for Animation/i);
    expect(skill).toMatch(/RESIZE[^\n]*mapped\/textured Geometry[\s\S]*UV\/pixel impact/i);
    expect(skill).toMatch(/Do not silently enlarge the atlas/i);
  });

  test("Texturing proves material intent before propagation and protects variants and live authority", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");

    for (const marker of [
      "representative patch/cohort",
      "formula/gradient/color count is not quality evidence",
      "Requested atlas size/density are constraints",
      "production base role",
      "required hidden material surfaces",
      "stale exported PNG/bbmodel",
    ]) expect(skill).toContain(marker);

    expect(skill).toMatch(/never silently enlarge/i);
    expect(skill).toMatch(/Variants preserve[\s\S]*dimensions\/mapping/i);
  });

  test("Animation proves rig readiness, caller semantics, and time-based quality", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    for (const marker of [
      "representative extreme poses",
      "external query/variable caller semantics",
      "signed reverse semantics",
      "repeated full-loop playback",
      "three static snapshots do not prove",
    ]) expect(skill).toContain(marker);

    expect(skill).toMatch(/handoff Geometry first/i);
  });

  test("Finalization is progressive-disclosure and separates save/export/proof levels", async () => {
    const [root, finalization] = await Promise.all([
      source("../AGENTS.md"),
      source("../docs/foundation/09-finalization-standard.md"),
    ]);

    expect(root).toContain("At `FINALIZATION`, load only `docs/foundation/09-finalization-standard.md`");
    expect(root).toMatch(/do not load it during earlier authoring stages/i);

    for (const marker of [
      "Requested Deliverable Contract",
      "Identifier / Reference Integrity",
      "NATIVE_SAVED",
      "EXPORTED",
      "PARSE / REFERENCE VERIFIED",
      "VISUAL PASS",
      "MINECRAFT RUNTIME VERIFIED | UNVERIFIED",
      "current summary, not append-only history",
      "missing requested output",
      "FINALIZATION BLOCKED",
    ]) expect(finalization).toContain(marker);

    expect(finalization).toMatch(/do not patch compiled JSON/i);
    expect(finalization).toMatch(/does not satisfy a separately requested animation export/i);
  });

  test("quality hardening remains generic rather than fixture or object specific", async () => {
    const files = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
      source("../docs/foundation/09-finalization-standard.md"),
    ]);

    for (const text of files) {
      for (const fixture of ["tiger-transport-pickup", "small_cannon_boat", "station-sign", "palm-fruit", "businessman-npc", "lift-quality"]) {
        expect(text.toLowerCase()).not.toContain(fixture);
      }
    }
  });
});

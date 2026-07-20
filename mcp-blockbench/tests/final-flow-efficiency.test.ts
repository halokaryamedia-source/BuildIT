import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { requiredGeometryFinalViews } from "../src/lib/geometryRuntime";
import { genericStageNextOperation } from "../src/server/tools/stage-context";

const read = (path: string) => readFileSync(path, "utf8");

const chatgptRoot = "../engines/chatgpt/skills/blockbench-reference-studio";

describe("final upstream-to-downstream flow efficiency", () => {
  test("keeps one current ChatGPT flow with two approvals and mandatory Golden Sample guidance", () => {
    const skill = read(`${chatgptRoot}/SKILL.md`);
    const flow = read(`${chatgptRoot}/references/FLOW.md`);
    const sheetCompatibility = read(
      `${chatgptRoot}/references/SHEET_SPECIFICATIONS.md`
    );
    const handoffContract = read(
      `${chatgptRoot}/references/CODEX_HANDOFF_CONTRACT.md`
    );
    const prompt = read(`${chatgptRoot}/templates/TURNAROUND_PROMPT.md`);
    const combined = `${skill}\n${flow}\n${sheetCompatibility}\n${handoffContract}\n${prompt}`;

    expect(skill).toContain("exactly two approval moments");
    expect(skill).toContain("Mandatory Golden Sample design system");
    expect(skill).toContain("Compact single-source writing rule");
    expect(flow).toContain("There is no routine third approval");
    expect(sheetCompatibility).toContain(
      "Numbered technical sheets are deprecated and forbidden"
    );
    expect(prompt).toContain("Top / Footprint");
    expect(prompt).toContain("Right Side");

    for (const stale of [
      "Sheet 01",
      "Sheets 02–04",
      "four approved sheets",
      "TECHNICAL_SHEETS_REVIEW",
      "STAGE_CONTRACTS_REVIEW",
    ]) {
      expect(combined).not.toContain(stale);
    }
  });

  test("uses one consistent authority order inside the Reference Package", () => {
    const skill = read(`${chatgptRoot}/SKILL.md`);
    const handoff = read(
      `${chatgptRoot}/templates/CODEX_REFERENCE_HANDOFF.template.md`
    );
    const skillManifest = skill.indexOf("3. `reference_manifest.json`");
    const skillGeometry = skill.indexOf("4. `GEOMETRY.md`");
    const handoffManifest = handoff.indexOf("3. executable `reference_manifest.json`");
    const handoffStage = handoff.indexOf("4. concise stage Markdown files");
    expect(skillManifest).toBeGreaterThan(0);
    expect(skillGeometry).toBeGreaterThan(skillManifest);
    expect(handoffManifest).toBeGreaterThan(0);
    expect(handoffStage).toBeGreaterThan(handoffManifest);
  });

  test("prevents blank-model analysis and returns the post-preview next operation", () => {
    const production = read("../engines/shared/skills/blockbench-production/SKILL.md");
    const geometry = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    const preview = read("src/server/tools/reference-visual-preview.ts");
    expect(production).toContain("zero-start: build primary form before first capture/analyze");
    expect(geometry).toContain("Never analyze an empty project");
    expect(preview).toContain("BUILD_PRIMARY_FORM_FROM_MANIFEST");
    expect(preview).toContain("next_safe_operation: nextSafeOperation");
  });

  test("routes stage context without polling or generic CONTINUE_STAGE ambiguity", () => {
    expect(
      genericStageNextOperation({
        stage: "TEXTURE",
        rebindRequired: false,
        identityReady: true,
        leaseStatus: "ACTIVE",
        leaseProjectUuid: "u",
        runtimeUuid: "u",
        workflowState: "TEXTURE_IN_PROGRESS",
      })
    ).toBe("CONTINUE_TEXTURE_WORK");
    expect(
      genericStageNextOperation({
        stage: "ANIMATION",
        rebindRequired: false,
        identityReady: true,
        leaseStatus: "ACTIVE",
        leaseProjectUuid: "u",
        runtimeUuid: "u",
        workflowState: "ANIMATION_REVIEW",
      })
    ).toBe("AWAIT_ANIMATION_REVIEW");
    expect(
      genericStageNextOperation({
        stage: "FINAL_VALIDATION",
        rebindRequired: false,
        identityReady: true,
        leaseStatus: "ACTIVE",
        leaseProjectUuid: "u",
        runtimeUuid: "u",
        workflowState: "FINAL_VALIDATION",
      })
    ).toBe("RUN_FINAL_VALIDATION_PREFLIGHT");
  });

  test("requires asymmetric Right Side before Geometry runtime becomes final-ready", () => {
    expect(requiredGeometryFinalViews("BILATERAL")).toEqual([
      "front",
      "left_side",
      "back",
      "top_footprint",
      "front_left_3_4",
    ]);
    expect(requiredGeometryFinalViews("ASYMMETRIC")).toEqual([
      "front",
      "left_side",
      "right_side",
      "back",
      "top_footprint",
      "front_left_3_4",
    ]);
  });

  test("removes duplicate happy-path validation and mandatory Sol routing", () => {
    const texture = read("../engines/shared/skills/blockbench-texture/SKILL.md");
    const animation = read("../engines/shared/skills/blockbench-animation/SKILL.md");
    const validation = read("../engines/shared/skills/blockbench-validation/SKILL.md");
    const geometry = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    const routing = read("../engines/codex/MODEL_ROUTING.md");

    expect(texture).toContain(
      "record_stage_review_report\n→ submit_stage_for_review"
    );
    expect(animation).toContain(
      "record_stage_review_report\n→ submit_stage_for_review"
    );
    expect(texture).not.toContain(
      "record_stage_review_report\n→ validate_reference_contract"
    );
    expect(animation).not.toContain(
      "record_stage_review_report\n→ validate_reference_contract"
    );
    expect(validation).toContain("require_evidence=false");
    expect(geometry).toContain("visual_director only when");
    expect(routing).toContain("Reference inspection is not automatically a Sol call");
    expect(routing).not.toContain(
      "Use `visual_director` once per unchanged Reference Visual hash"
    );
  });

  test("locks Ponytail and OpenSpec to the full pipeline rather than Geometry only", () => {
    const ponytail = read(
      "../openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
    );
    const spec = read(
      "../openspec/changes/codex-local-workflow-rework/specs/codex-local-workflow/spec.md"
    );
    for (const stage of [
      "CHATGPT REFERENCE STUDIO",
      "Geometry review",
      "Texture review",
      "Animation review",
      "Final Validation review",
      "workspace completion",
    ]) {
      expect(`${ponytail}\n${spec}`).toContain(stage);
    }
    expect(ponytail).toContain("get_runtime_status`: once at startup");
    expect(ponytail).toContain("never poll after every tool");
  });

  test("defines one integrated final acceptance from ChatGPT to DONE", () => {
    const acceptance = read("../engines/codex/FINAL_ACCEPTANCE_TEST.md");
    expect(acceptance).toContain("Part A — ChatGPT Website");
    expect(acceptance).toContain("Part B — Codex + Blockbench");
    expect(acceptance).toContain("final approval reaches `DONE`");
    expect(acceptance).toContain("workspace completion");
  });
});

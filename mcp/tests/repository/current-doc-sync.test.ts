import { describe, expect, test } from "bun:test";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("current developer-facing documentation sync", () => {
  test("current proof, tool counts, and developer-loop ownership stay aligned", async () => {
    const [flow, llms, implementation, packageRules] = await Promise.all([
      text("../docs/knowledge/flow.md"),
      text("llms.txt"),
      text("../docs/knowledge/implementation-map.md"),
      text("AGENTS.md"),
    ]);

    expect(flow).toContain("current proof state        → docs/knowledge/current-validation.md");
    expect(flow).not.toContain("docs/foundation/validation-report.md");

    expect(llms).toContain("51 callable tools across authoring phases");
    expect(llms).toContain("currently **25 exposed tools**");
    expect(llms).toContain("77 declared source ToolSpecs");
    expect(llms).not.toContain("64 callable tools across authoring phases");
    expect(llms).not.toContain("currently **27 exposed tools**");

    expect(packageRules).toContain(
      "scripts/        verification/measurement/preparation/local-deploy utilities"
    );
    expect(implementation).toContain(
      "developer loop: `dev:watch`, prompt watch regeneration, `deploy:local`"
    );
    expect(implementation).toContain("`mcp/tests/developer-loop.test.ts`");
    expect(implementation).toContain("77 declared source ToolSpecs");
  });

  test("execution context markers, defaults, and proof ceilings stay synchronized", async () => {
    const [root, githubRules, packageRules, flow, contributing, runbook] = await Promise.all([
      text("../AGENTS.md"),
      text("../GITHUB_RULES.md"),
      text("AGENTS.md"),
      text("../docs/knowledge/flow.md"),
      text("../CONTRIBUTING.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    for (const owner of [root, githubRules, packageRules, flow, contributing]) {
      for (const context of ["REMOTE_GITHUB", "LOCAL_CODE", "LIVE_BLOCKBENCH"]) {
        expect(owner).toContain(context);
      }
    }

    for (const marker of [
      "CONTEXT: REMOTE_GITHUB",
      "CONTEXT: LOCAL_CODE",
      "CONTEXT: LIVE_BLOCKBENCH",
      "SWITCH CONTEXT:",
    ]) {
      expect(root).toContain(marker);
    }
    expect(root).toMatch(/without a marker[\s\S]*lowest sufficient provable context/i);
    expect(root).toMatch(/never infer `LOCAL_CODE`[\s\S]*never infer `LIVE_BLOCKBENCH`/i);
    expect(root).toMatch(/`LIVE_BLOCKBENCH` is never assumed/i);
    expect(root).toMatch(/proof ceiling[\s\S]*handoff before substantial edits/i);
    expect(root).toContain("LOCAL PROOF REQUIRED");

    expect(githubRules).toContain("Execution context / proof ceiling");
    expect(githubRules).toContain("### Execution Handoff");
    expect(githubRules).toContain("FROM_CONTEXT");
    expect(githubRules).toContain("TO_CONTEXT");

    expect(packageRules).toContain("## Execution Context / Proof Ceiling");
    expect(packageRules).toMatch(
      /REMOTE_GITHUB[\s\S]*source\/static\/CI-verifiable[\s\S]*LOCAL_CODE[\s\S]*LIVE_BLOCKBENCH/i
    );

    expect(flow).toMatch(/PIN CURRENT AUTHORITY[\s\S]*EXECUTION CONTEXT[\s\S]*PROOF CEILING[\s\S]*TASK CLASS/i);
    expect(flow).not.toContain("ChatGPT → GitHub");
    expect(flow).not.toContain("Codex local / Blockbench");

    expect(runbook).toMatch(/LIVE_BLOCKBENCH[\s\S]*execution capability[\s\S]*does not activate/i);
    expect(runbook).toMatch(/targeted live debugging[\s\S]*formal Local Acceptance/i);
  });

  test("canonical authoring taxonomy keeps explicit user strategy and Gateway-aware stages", async () => {
    const [root, context, flow, implementation, router, texturing, animation, settings] = await Promise.all([
      text("../AGENTS.md"),
      text("../CONTEXT.md"),
      text("../docs/knowledge/flow.md"),
      text("../docs/knowledge/implementation-map.md"),
      text("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      text("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      text("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
      text("ui/settings.ts"),
    ]);

    for (const owner of [root, context, flow, implementation, router]) {
      expect(owner).toContain("Geometry Strategy");
      expect(owner).toContain("DIRECT");
      expect(owner).toContain("3D_ASSISTED");
      expect(owner).not.toContain("optional 3D Evidence");
    }

    for (const owner of [root, flow, router, texturing, animation]) {
      expect(owner).toContain("Gateway");
      expect(owner).toContain("switch_authoring_phase");
      expect(owner).toMatch(/same task|same task\/chat/i);
    }

    for (const owner of [root, context, flow, implementation, router]) {
      expect(owner).not.toContain("Image Reference Route");
      expect(owner).not.toContain("3D-Assisted Route");
      expect(owner).not.toContain("Standard MCP Profile");
      expect(owner).not.toContain("Extended MCP Profile");
    }

    expect(router).toContain("Shape Reconstruction");
    expect(router).toContain("PrimitiveAnything");
    expect(settings).toContain('name: "Legacy UI Fallbacks (Debug)"');
    expect(settings).toContain("not an authoring profile");
    expect(texturing).toContain("manage_material");
  });

  test("current Geometry guidance does not route through retired public tool names", async () => {
    const files = await Promise.all([
      text("../docs/knowledge/flow.md"),
      text("../docs/foundation/02-product-requirements.md"),
      text("../docs/foundation/03-modelling-workflow.md"),
      text("../docs/foundation/05-geometry-standard.md"),
      text("../docs/foundation/06-texture-standard.md"),
      text("../docs/foundation/07-visual-validation.md"),
      text("README.md"),
      text("llms.txt"),
    ]);
    const retiredPublicNames = [
      "place_cube",
      "modify_cube",
      "modify_cubes_batch",
      "list_outline",
      "find_elements_by_criteria",
      "inspect_element",
    ];
    for (const file of files) {
      for (const name of retiredPublicNames) {
        expect(file).not.toMatch(new RegExp(`\\b${name}\\b`));
      }
    }
  });
});

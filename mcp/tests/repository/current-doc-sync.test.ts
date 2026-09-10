import { describe, expect, test } from "bun:test";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

function sourceCount(source: string, pattern: RegExp, label: string): number {
  const raw = source.match(pattern)?.[1];
  if (!raw) throw new Error(`Could not read ${label} from canonical surface measurement source.`);
  return Number(raw);
}

describe("current developer-facing documentation sync", () => {
  test("current proof, Runtime shape, developer loop, and user-facing surfaces stay aligned", async () => {
    const [
      context,
      flow,
      llms,
      implementation,
      packageRules,
      rootReadme,
      mcpReadme,
      gatewayReadme,
      about,
      phaseMeasureSource,
    ] = await Promise.all([
      text("../CONTEXT.md"),
      text("../docs/knowledge/flow.md"),
      text("llms.txt"),
      text("../docs/knowledge/implementation-map.md"),
      text("AGENTS.md"),
      text("../README.md"),
      text("README.md"),
      text("gateway/README.md"),
      text("about.md"),
      text("scripts/measure-phase-surfaces.ts"),
    ]);

    const callableToolCount = sourceCount(
      phaseMeasureSource,
      /const CATALOG_TOOL_COUNT = (\d+);/,
      "callable catalog count"
    );
    const geometryToolCount = sourceCount(
      phaseMeasureSource,
      /geometry:\s*(\d+),/,
      "Geometry surface count"
    );
    const texturingToolCount = sourceCount(
      phaseMeasureSource,
      /texturing:\s*(\d+),/,
      "Texturing surface count"
    );
    const animationToolCount = sourceCount(
      phaseMeasureSource,
      /animation:\s*(\d+),/,
      "Animation surface count"
    );

    expect(callableToolCount).toBe(54);
    expect(geometryToolCount).toBe(47);
    expect(geometryToolCount).toBe(texturingToolCount);
    expect(animationToolCount).toBe(20);
    expect(flow).toContain("current proof state        → docs/knowledge/current-validation.md");
    expect(flow).not.toContain("docs/foundation/validation-report.md");

    expect(context).toContain(`**${callableToolCount} callable Bedrock tools**`);
    expect(llms).toContain(`${callableToolCount} callable tools`);
    expect(llms).toContain("MCP CORE + AUTHORING");
    expect(llms).toContain("Geometry and Texturing startup focus values expose the same AUTHORING capability set");
    expect(llms).not.toContain("controller blend-curve mutation");
    const api = JSON.parse(await text("docs/api.json"));
    expect(llms).toContain(`${api.tools.length} declared source ToolSpecs`);
    expect(llms).not.toContain("MCP CORE + exactly one ACTIVE PHASE");
    expect(llms).not.toContain("currently **25 exposed tools**");

    expect(packageRules).toContain(
      "scripts/        verification/measurement/preparation/local-deploy utilities"
    );
    expect(implementation).toContain(
      "Developer loop: `dev:watch`, prompt watch regeneration, `deploy:local`"
    );
    expect(implementation).toContain("`mcp/tests/developer-loop.test.ts`");
    expect(implementation).toContain(`${api.tools.length} declared source ToolSpecs`);
    expect(implementation).toContain(`callable union has **${callableToolCount} tools**`);
    expect(implementation).toContain(`share **${geometryToolCount}** AUTHORING tools`);
    expect(implementation).toContain(`Animation exposes **${animationToolCount}**`);
    expect(implementation).toContain("blend-transition curves are available");

    expect(rootReadme).toContain(`Active phase-union catalog   ${callableToolCount} tools`);
    expect(rootReadme).toContain(`AUTHORING source surface     ${geometryToolCount} tools`);
    expect(rootReadme).toContain(`Animation source surface     ${animationToolCount} tools`);

    expect(mcpReadme).toContain(`Active phase-union catalog   ${callableToolCount} tools`);
    expect(mcpReadme).toContain(`AUTHORING surface            ${geometryToolCount} tools`);
    expect(mcpReadme).toContain(`Animation surface            ${animationToolCount} tools`);
    expect(mcpReadme).not.toContain("materialize_3d_assisted_scaffold");

    expect(gatewayReadme).toContain(`Runtime callable union   ${callableToolCount}`);
    expect(gatewayReadme).toContain(`AUTHORING surface        ${geometryToolCount}`);
    expect(gatewayReadme).toContain(`Animation surface        ${animationToolCount}`);
    expect(gatewayReadme).toContain("client_reconnect_required=false");
    expect(gatewayReadme).toContain("without a manual AI-client reconnect");

    const { PRODUCT_ABOUT } = await import("@/lib/productIdentity");
    expect(about.trim()).toBe(PRODUCT_ABOUT);
    expect(about).not.toContain("Only the active authoring phase is exposed at a time");
    expect(about).not.toContain("reloading/restarting BlockIT MCP");

    expect(await Bun.file("../docs/knowledge/mcp-capability-backlog.md").exists()).toBe(false);
  });

  test("execution context markers, GitHub-first defaults, and proof ceilings stay synchronized", async () => {
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
    expect(root).toMatch(
      /proof ceiling[\s\S]*exhaust source\/static\/CI-verifiable work first[\s\S]*handoff only the minimum[\s\S]*never transfer the whole task/i
    );
    expect(root).toContain("LOCAL PROOF REQUIRED");

    expect(githubRules).toContain("Execution context / proof ceiling");
    expect(githubRules).toContain("GitHub-first execution partition");
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

  test("canonical authoring taxonomy has one native Geometry path, shared AUTHORING, and Gateway Animation handoff", async () => {
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
      expect(owner).not.toContain("Geometry Strategy");
      expect(owner).not.toContain("DIRECT | 3D_ASSISTED");
      expect(owner).not.toContain("Shape Reconstruction");
      expect(owner).not.toContain("PrimitiveAnything");
      expect(owner).toContain("AUTHORING");
    }

    for (const owner of [root, flow, router, texturing, animation]) {
      expect(owner).toContain("Gateway");
      expect(owner).toContain("switch_authoring_phase");
      expect(owner).toMatch(/same task|same task\/chat/i);
    }

    expect(flow).toContain("No Geometry↔Texturing `switch_authoring_phase` is required");
    expect(texturing).toContain("No Geometry↔Texturing phase switch");

    for (const owner of [root, context, flow, implementation, router]) {
      expect(owner).not.toContain("Image Reference Route");
      expect(owner).not.toContain("3D-Assisted Route");
      expect(owner).not.toContain("Standard MCP Profile");
      expect(owner).not.toContain("Extended MCP Profile");
    }

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
      "materialize_3d_assisted_scaffold",
      "manage_geometry_reference",
    ];
    for (const file of files) {
      for (const name of retiredPublicNames) {
        expect(file).not.toMatch(new RegExp(`\\b${name}\\b`));
      }
    }
  });
});

import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("experimental data-only Blockbench authoring contract", () => {
  test("request surface is bounded data rather than executable input", async () => {
    const [contract, runner, requestText, workflow] = await Promise.all([
      source("../Experimental/blockbench-web-poc/authoring-contract.mjs"),
      source("../Experimental/blockbench-web-poc/run-poc.mjs"),
      source("../Experimental/blockbench-web-poc/request.json"),
      source("../.github/workflows/blockbench-web-poc.yml"),
    ]);
    const request = JSON.parse(requestText);

    for (const marker of [
      "operations: 32",
      "groups: 8",
      "cubes: 24",
      "textures: 4",
      'operation.op === "create_texture"',
      'operation.op === "add_group"',
      'operation.op === "add_cube"',
      "project.box_uv must be true in contract v1",
      "not allowed",
    ]) expect(contract).toContain(marker);

    expect(request.schema_version).toBe(1);
    expect(request.operations.length).toBeLessThanOrEqual(32);
    expect(request.operations.filter((operation: any) => operation.op === "add_cube").length).toBeGreaterThan(1);
    for (const operation of request.operations) {
      expect(["create_texture", "add_group", "add_cube"]).toContain(operation.op);
    }

    expect(runner).toContain('authoring_contract: "data-only-v1"');
    expect(runner).toContain("loadAuthoringRequest(requestPath)");
    expect(runner).toContain("page.evaluate(async (request) =>");
    expect(runner).toContain('join(scriptDir, "request.json")');
    expect(runner).toContain('writeFileSync(join(outputDir, "request.json")');
    expect(runner).not.toContain("eval(");
    expect(runner).not.toContain("new Function");
    expect(runner).not.toContain("request.shell");
    expect(runner).not.toContain("request.command");
    expect(runner).not.toContain("request.browser_flags");

    expect(workflow).toContain('"Experimental/blockbench-web-poc/**"');
    expect(workflow).toContain("contents: read");
    expect(workflow).not.toContain("pull_request_target");
    expect(workflow).not.toContain("self-hosted");
    expect(workflow).not.toContain("${{ secrets.");
  });
});

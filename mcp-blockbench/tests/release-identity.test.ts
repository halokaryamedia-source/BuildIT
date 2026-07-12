import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

describe("final plugin release identity", () => {
  test("uses one version across package bootstrap and prompt manifest", () => {
    const packageJson = json("package.json");
    const promptManifest = json("prompts/manifest.json");
    const bootstrap = read("src/index.ts");

    expect(packageJson.version).toBe("1.7.0");
    expect(promptManifest.version).toBe(packageJson.version);
    expect(bootstrap).toContain(`version: "${packageJson.version}"`);
    expect(bootstrap).not.toContain('version: "1.6.3"');
  });

  test("build and publish validation derive identity from package version", () => {
    const build = read("scripts/index.ts");
    const publish = read("../.github/workflows/publish-blockbench-plugin.yml");

    expect(build).toContain('import { version } from "../package.json"');
    expect(build).toContain("escapeRegExp(version)");
    expect(build).not.toContain("1\\.6\\.3");
    expect(publish).toContain('Bun.file("package.json").json()');
    expect(publish).toContain("`/* v${pkg.version} */`");
    expect(publish).toContain("STABLE_FULL_LIBRARY");
    expect(publish).toContain("current_session_continues");
    expect(publish).not.toContain('"1.6.3"');
  });
});

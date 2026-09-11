import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Plugin layer ownership", () => {
  test("entrypoint delegates listener and dev sync details", async () => {
    const index = await source("index.ts");

    expect(index).toContain('from "@/plugin/devSync"');
    expect(index).toContain('from "@/plugin/runtimeHost"');
    expect(index).toContain("const runtimeHost = new RuntimeHost()");
    expect(index).not.toContain("localDevFileWatcher");
    expect(index).not.toContain("SERVER_BIND_TIMEOUT_MS");
    expect(index).not.toContain("createNetServer(");
    expect(index).not.toContain("devFs.watch(");
  });

  test("runtime host owns listener lifecycle", async () => {
    const host = await source("plugin/runtimeHost.ts");

    expect(host).toContain("export class RuntimeHost");
    expect(host).toContain("createNetServer");
    expect(host).toContain("beginRuntimeGenerationTeardown");
    expect(host).toContain("closeAndWait");
  });

  test("development watcher is production-independent", async () => {
    const devSync = await source("plugin/devSync.ts");

    expect(devSync).toContain('process.env.NODE_ENV !== "development"');
    expect(devSync).toContain("export function stopLocalDevAutoReload");
    expect(devSync).toContain("export function setupLocalDevAutoReload");
  });
});

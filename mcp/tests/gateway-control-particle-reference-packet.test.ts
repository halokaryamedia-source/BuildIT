import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("LazyDesigner Control particle reference packet", () => {
  test("delivers asset kind and particle handoff metadata without adding a particle profile", async () => {
    const packet = await source("gateway/control/packet.ts");
    const reference = await source("gateway/control/referencePackage.ts");

    expect(packet).toContain('"asset_kind"');
    expect(packet).toContain('"particle"');
    expect(packet).toContain("asset_kind: reference.asset_kind");
    expect(packet).toContain("particle: reference.particle");

    expect(reference).toContain('export type ControlReferenceAssetKind = "MODEL" | "PARTICLE"');
    expect(reference).not.toContain('| "PARTICLE";\n\nexport type ControlReferenceStage');
  });
});

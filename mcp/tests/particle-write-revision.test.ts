import { describe, expect, test } from "bun:test";
import {
  assertParticleSourceSnapshotMatches,
  assertParticleWriteRevisionUnchanged,
  captureParticleWriteRevision,
} from "../lib/particleWriteRevision";

function fakeFs(initial: Record<string, string>) {
  const files = new Map(Object.entries(initial));
  return {
    files,
    existsSync(path: string) {
      return files.has(path);
    },
    readFileSync(path: string, _encoding: "utf8") {
      const value = files.get(path);
      if (value === undefined) throw new Error(`ENOENT: ${path}`);
      return value;
    },
  };
}

describe("particle transactional write revision guards", () => {
  test("accepts an unchanged existing target", () => {
    const fs = fakeFs({ "/rp/a.particle.json": "old" });
    const revision = captureParticleWriteRevision(fs, "/rp/a.particle.json");
    expect(() =>
      assertParticleWriteRevisionUnchanged(fs, "/rp/a.particle.json", revision)
    ).not.toThrow();
  });

  test("rejects content changed after the transaction snapshot", () => {
    const fs = fakeFs({ "/rp/a.particle.json": "old" });
    const revision = captureParticleWriteRevision(fs, "/rp/a.particle.json");
    fs.files.set("/rp/a.particle.json", "external edit");
    expect(() =>
      assertParticleWriteRevisionUnchanged(fs, "/rp/a.particle.json", revision)
    ).toThrow("STALE_TARGET");
  });

  test("rejects a target that appears after a create transaction starts", () => {
    const fs = fakeFs({});
    const revision = captureParticleWriteRevision(fs, "/rp/new.particle.json");
    fs.files.set("/rp/new.particle.json", "someone else created it");
    expect(() =>
      assertParticleWriteRevisionUnchanged(fs, "/rp/new.particle.json", revision)
    ).toThrow("appeared");
  });

  test("rejects in-place source content changed after BlockIT read it", () => {
    const fs = fakeFs({ "/rp/a.particle.json": "external edit" });
    const revision = captureParticleWriteRevision(fs, "/rp/a.particle.json");
    expect(() =>
      assertParticleSourceSnapshotMatches(
        revision,
        "content when BlockIT originally read the file",
        "/rp/a.particle.json"
      )
    ).toThrow("STALE_SOURCE");
  });
});

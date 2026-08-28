import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import {
  ROUTE1_CANONICAL_HUNYUAN,
  buildRoute1PackageManifest,
  inspectBlockItBundleContent,
  inspectRoute1Fixture,
  route1FixtureSchema,
  writeRoute1Package,
  type Route1PreparedState,
} from "../scripts/route1-fixture";

const tempRoots: string[] = [];

function fixture(id = "sample-asset") {
  return {
    schema_version: 1,
    fixture_id: id,
    approved_reference: "approved-reference.png",
    approved_glb: "approved-shape.glb",
    contact_sheet: "contact-sheet.png",
    hunyuan_inputs: {
      front: "input/front.png",
      left: "input/left.png",
      back: "input/back.png",
    },
    source_front_direction: "+z",
    requested_dimensions_blocks: { width: 2, height: 3, length: 4 },
    hunyuan: {
      ...ROUTE1_CANONICAL_HUNYUAN,
      views: [...ROUTE1_CANONICAL_HUNYUAN.views],
    },
  };
}

function minimalGlb(): Buffer {
  const json = Buffer.from('{"asset":{"version":"2.0"}}');
  const jsonLength = Math.ceil(json.length / 4) * 4;
  const total = 20 + jsonLength;
  const glb = Buffer.alloc(total, 0x20);
  glb.write("glTF", 0, "ascii");
  glb.writeUInt32LE(2, 4);
  glb.writeUInt32LE(total, 8);
  glb.writeUInt32LE(jsonLength, 12);
  glb.writeUInt32LE(0x4e4f534a, 16);
  json.copy(glb, 20);
  return glb;
}

function fakeBundle(body = 'console.log("route1");\n') {
  const digest = createHash("sha256").update(body).digest("hex");
  return `/* v0.1.0 build ${digest.slice(0, 12)} */
globalThis.__BLOCKIT_BUILD_ID__ = "sha256:${digest}";
let process = requireNativeModule('process');${body}`;
}

async function makeFixture() {
  const root = await mkdtemp(join(tmpdir(), "route1-fixture-"));
  tempRoots.push(root);
  await mkdir(join(root, "input"));
  await Bun.write(join(root, "approved-reference.png"), new Uint8Array([1]));
  await Bun.write(join(root, "approved-shape.glb"), minimalGlb());
  await Bun.write(join(root, "contact-sheet.png"), new Uint8Array([2]));
  await Bun.write(join(root, "input", "front.png"), new Uint8Array([3]));
  await Bun.write(join(root, "input", "left.png"), new Uint8Array([4]));
  await Bun.write(join(root, "input", "back.png"), new Uint8Array([5]));
  await Bun.write(
    join(root, "fixture.json"),
    `${JSON.stringify(fixture(), null, 2)}\n`
  );
  return root;
}

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((root) =>
      rm(root, { recursive: true, force: true })
    )
  );
});

describe("Route 1 generic fixture preparation", () => {
  test("contract stays object-agnostic and pins the accepted MultiView provenance", () => {
    const sample = fixture("representative-asset");
    expect(route1FixtureSchema.safeParse(sample).success).toBe(true);

    expect(
      route1FixtureSchema.safeParse({
        ...sample,
        object_specific: { special_part: true },
      }).success
    ).toBe(false);
    expect(
      route1FixtureSchema.safeParse({
        ...sample,
        approved_glb: "../outside.glb",
      }).success
    ).toBe(false);
    expect(
      route1FixtureSchema.safeParse({
        ...sample,
        hunyuan_inputs: {
          ...sample.hunyuan_inputs,
          left: sample.hunyuan_inputs.front,
        },
      }).success
    ).toBe(false);
    expect(
      route1FixtureSchema.safeParse({
        ...sample,
        hunyuan: { ...sample.hunyuan, seed: 1 },
      }).success
    ).toBe(false);
  });

  test("prepare inspection verifies portable files, hashes, MultiView inputs, and GLB 2.0 header", async () => {
    const root = await makeFixture();
    const prepared = await inspectRoute1Fixture(root);
    expect(prepared.fixture.fixture_id).toBe("sample-asset");
    expect(prepared.files.approved_glb.sha256).toHaveLength(64);
    expect(prepared.files.hunyuan_inputs.front.sha256).toHaveLength(64);
    expect(prepared.files.hunyuan_inputs.left.sha256).toHaveLength(64);
    expect(prepared.files.hunyuan_inputs.back.sha256).toHaveLength(64);
    expect(prepared.fixture_json.sha256).toHaveLength(64);

    await Bun.write(join(root, "approved-shape.glb"), new Uint8Array(12));
    await expect(inspectRoute1Fixture(root)).rejects.toThrow(
      "valid glTF binary v2 header"
    );
  });

  test("BlockIT artifact identity is verified against the actual bundle body", () => {
    const bundle = fakeBundle();
    const identity = inspectBlockItBundleContent(bundle, "0.1.0");
    expect(identity.build_identity).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(() =>
      inspectBlockItBundleContent(`${bundle}//tampered`, "0.1.0")
    ).toThrow("does not match its bundled source body");
  });

  test("package contains the generic fixture inputs, exact plugin artifact, manifest, and run handoff", async () => {
    const fixtureRoot = await makeFixture();
    const inspected = await inspectRoute1Fixture(fixtureRoot);

    const artifactRoot = await mkdtemp(join(tmpdir(), "route1-artifact-"));
    tempRoots.push(artifactRoot);
    const bundlePath = join(artifactRoot, "blockit_mcp.js");
    const bundle = fakeBundle();
    await Bun.write(bundlePath, bundle);
    const identity = inspectBlockItBundleContent(bundle, "0.1.0");

    const prepared = {
      repository_head_at_prepare: "a".repeat(40),
      blockit: {
        bundle_path: bundlePath,
        version: identity.version,
        build_identity: identity.build_identity,
        bundle_sha256: createHash("sha256").update(bundle).digest("hex"),
      },
      fixture: inspected,
    } satisfies Route1PreparedState;

    const manifest = buildRoute1PackageManifest(prepared);
    expect(manifest.authority.glb_role).toBe("supporting_3d_evidence_only");
    expect(manifest.fixture_id).toBe("sample-asset");
    expect(manifest.repository_head_at_prepare).toBe("a".repeat(40));

    const output = join(artifactRoot, "Route1-Test-Ready");
    await writeRoute1Package(prepared, output);

    const packaged = JSON.parse(
      await Bun.file(join(output, "manifest.json")).text()
    );
    expect(packaged.blockit.build_identity).toBe(identity.build_identity);
    expect(packaged.fixture.hunyuan_inputs.front.sha256).toHaveLength(64);
    expect(
      await Bun.file(join(output, "plugin", "blockit_mcp.js")).exists()
    ).toBe(true);
    expect(
      await Bun.file(join(output, "fixture", "approved-shape.glb")).exists()
    ).toBe(true);
    expect(
      await Bun.file(join(output, "fixture", "input", "front.png")).exists()
    ).toBe(true);
    expect(
      await Bun.file(join(output, "fixture", "input", "left.png")).exists()
    ).toBe(true);
    expect(
      await Bun.file(join(output, "fixture", "input", "back.png")).exists()
    ).toBe(true);

    const run = await Bun.file(join(output, "RUN.md")).text();
    expect(run).toContain("object-agnostic");
    expect(run).toContain("supporting 3D evidence only");
    expect(run).toContain("Reproducible MultiView inputs");
    expect(run).toContain("repository_head_at_prepare");

    await expect(writeRoute1Package(prepared, output)).rejects.toThrow(
      "output already exists"
    );
  });

  test("package scripts expose preparation without changing MCP tool surface", async () => {
    const pkg = await Bun.file("package.json").json();
    expect(pkg.scripts["route1:prepare"]).toBe(
      "bun run ./scripts/route1-fixture.ts prepare"
    );
    expect(pkg.scripts["route1:package"]).toBe(
      "bun run ./scripts/route1-fixture.ts package"
    );

    const source = await Bun.file("./scripts/route1-fixture.ts").text();
    expect(source).toContain("ROUTE1_FIXTURE_PREPARED");
    expect(source).toContain("ROUTE1_TEST_READY_PACKAGE_CREATED");
    expect(source).toContain("repository_head_at_prepare");
    expect(source).not.toContain("manage_geometry_reference");
  });
});

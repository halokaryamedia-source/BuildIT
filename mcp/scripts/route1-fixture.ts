import { createHash, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { copyFile, mkdir, realpath, rename, rm, stat } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { z } from "zod";
import { version as packageVersion } from "../package.json";

export const ROUTE1_FIXTURE_SCHEMA_VERSION = 1;
export const ROUTE1_CANONICAL_HUNYUAN = {
  pipeline: "hunyuan3d-2mv",
  upstream_source_commit: "f8db63096c8282cb27354314d896feba5ba6ff8a",
  model_id: "tencent/Hunyuan3D-2mv",
  model_revision: "3a761b539b29fe4ff64714813aa9560fd66f5de0",
  model_subfolder: "hunyuan3d-dit-v2-mv",
  variant: "fp16",
  views: ["front", "left", "back"] as const,
  inference_steps: 50,
  guidance_scale: 5,
  octree_resolution: 256,
  num_chunks: 20_000,
  seed: 12_345,
  texture: false,
} as const;

const relativePath = z.string().min(1).refine((value) => {
  const path = value.replace(/\\/g, "/");
  if (
    value.includes("\\") ||
    isAbsolute(value) ||
    path.startsWith("/") ||
    /^[A-Za-z]:\//.test(path)
  ) return false;
  return !path.split("/").some(
    (part) => part === "" || part === "." || part === ".."
  );
}, "Fixture paths must use portable forward-slash relative paths inside the fixture directory.");

const imagePath = relativePath.refine(
  (value) => /\.(png|jpe?g|webp)$/i.test(value),
  "Images must use .png, .jpg, .jpeg, or .webp."
);
const glbPath = relativePath.refine(
  (value) => /\.glb$/i.test(value),
  "approved_glb must use .glb."
);

const hunyuanSchema = z.object({
  pipeline: z.literal(ROUTE1_CANONICAL_HUNYUAN.pipeline),
  upstream_source_commit: z.literal(
    ROUTE1_CANONICAL_HUNYUAN.upstream_source_commit
  ),
  model_id: z.literal(ROUTE1_CANONICAL_HUNYUAN.model_id),
  model_revision: z.literal(ROUTE1_CANONICAL_HUNYUAN.model_revision),
  model_subfolder: z.literal(ROUTE1_CANONICAL_HUNYUAN.model_subfolder),
  variant: z.literal(ROUTE1_CANONICAL_HUNYUAN.variant),
  views: z.tuple([z.literal("front"), z.literal("left"), z.literal("back")]),
  inference_steps: z.literal(50),
  guidance_scale: z.literal(5),
  octree_resolution: z.literal(256),
  num_chunks: z.literal(20_000),
  seed: z.literal(12_345),
  texture: z.literal(false),
}).strict();

export const route1FixtureSchema = z.object({
  schema_version: z.literal(ROUTE1_FIXTURE_SCHEMA_VERSION),
  fixture_id: z.string().regex(
    /^[a-z0-9][a-z0-9_-]{0,63}$/,
    "fixture_id must be a generic lower-case slug."
  ),
  approved_reference: imagePath,
  approved_glb: glbPath,
  contact_sheet: imagePath,
  source_front_direction: z.enum(["+z", "-z"]),
  requested_dimensions_blocks: z.object({
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
    length: z.number().finite().positive(),
  }).strict(),
  hunyuan: hunyuanSchema,
}).strict().superRefine((fixture, ctx) => {
  const files = [
    fixture.approved_reference,
    fixture.approved_glb,
    fixture.contact_sheet,
  ];
  if (new Set(files).size !== files.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["approved_reference"],
      message: "Reference, GLB, and contact sheet must be distinct files.",
    });
  }
});

type PreparedFile = {
  relative_path: string;
  source_path: string;
  size_bytes: number;
  sha256: string;
};

function staysInside(root: string, candidate: string): boolean {
  const path = relative(root, candidate);
  return path === "" || (!path.startsWith("..") && !isAbsolute(path));
}

async function sha256File(path: string): Promise<string> {
  return await new Promise((resolveHash, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolveHash(hash.digest("hex")));
  });
}

async function inspectFile(
  root: string,
  relativePath: string
): Promise<PreparedFile> {
  const requested = resolve(root, relativePath);
  if (!staysInside(root, requested)) {
    throw new Error(`Fixture path escapes root: ${relativePath}`);
  }

  let path: string;
  try {
    path = await realpath(requested);
  } catch {
    throw new Error(`Fixture file not found: ${relativePath}`);
  }
  if (!staysInside(root, path)) {
    throw new Error(`Fixture symlink escapes root: ${relativePath}`);
  }

  const info = await stat(path);
  if (!info.isFile() || info.size <= 0) {
    throw new Error(`Fixture file is empty/invalid: ${relativePath}`);
  }
  return {
    relative_path: relativePath,
    source_path: path,
    size_bytes: info.size,
    sha256: await sha256File(path),
  };
}

async function assertGlb2(file: PreparedFile): Promise<void> {
  const bytes = new Uint8Array(
    await Bun.file(file.source_path).slice(0, 12).arrayBuffer()
  );
  if (bytes.byteLength !== 12) {
    throw new Error("approved_glb is too small for GLB 2.0.");
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (
    new TextDecoder().decode(bytes.slice(0, 4)) !== "glTF" ||
    view.getUint32(4, true) !== 2
  ) {
    throw new Error("approved_glb must have a valid glTF binary v2 header.");
  }
  if (view.getUint32(8, true) !== file.size_bytes) {
    throw new Error("approved_glb header length does not match file size.");
  }
}

export async function inspectRoute1Fixture(fixtureDir: string) {
  let root: string;
  try {
    root = await realpath(resolve(fixtureDir));
  } catch {
    throw new Error(`Route 1 fixture directory not found: ${fixtureDir}`);
  }
  if (!(await stat(root)).isDirectory()) {
    throw new Error(`Route 1 fixture path is not a directory: ${fixtureDir}`);
  }

  const fixtureJson = await inspectFile(root, "fixture.json");
  let raw: unknown;
  try {
    raw = JSON.parse(await Bun.file(fixtureJson.source_path).text());
  } catch (error) {
    throw new Error(
      `Invalid Route 1 fixture.json JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const parsed = route1FixtureSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid Route 1 fixture.json: ${detail}`);
  }

  const fixture = parsed.data;
  const [approvedReference, approvedGlb, contactSheet] = await Promise.all([
    inspectFile(root, fixture.approved_reference),
    inspectFile(root, fixture.approved_glb),
    inspectFile(root, fixture.contact_sheet),
  ]);
  await assertGlb2(approvedGlb);

  return {
    fixture_dir: root,
    fixture_json: fixtureJson,
    fixture,
    files: {
      approved_reference: approvedReference,
      approved_glb: approvedGlb,
      contact_sheet: contactSheet,
    },
  };
}

export function inspectBlockItBundleContent(
  content: string,
  expectedVersion = packageVersion
) {
  const banner = content.match(
    /^\/\* v([^ ]+) build ([0-9a-f]{12}) \*\/\r?\nglobalThis\.__BLOCKIT_BUILD_ID__ = "(sha256:[0-9a-f]{64})";\r?\nlet process = requireNativeModule\('process'\);/
  );
  if (!banner) {
    throw new Error(
      "BlockIT bundle is missing the canonical build identity banner. Run `bun run build` first."
    );
  }

  const [matched, version, shortDigest, buildIdentity] = banner;
  if (version !== expectedVersion) {
    throw new Error(
      `BlockIT bundle version ${version} does not match package version ${expectedVersion}.`
    );
  }

  const digest = createHash("sha256")
    .update(content.slice(matched.length))
    .digest("hex");
  if (
    buildIdentity !== `sha256:${digest}` ||
    shortDigest !== digest.slice(0, 12)
  ) {
    throw new Error(
      "BlockIT bundle build identity does not match its bundled source body. Rebuild the canonical artifact."
    );
  }
  return {
    version,
    build_identity: buildIdentity as `sha256:${string}`,
  };
}

async function inspectBlockItArtifact(repoRoot: string) {
  const path = resolve(repoRoot, "mcp", "dist", "blockit_mcp.js");
  if (!(await Bun.file(path).exists())) {
    throw new Error(
      "Canonical mcp/dist/blockit_mcp.js is missing. Run `bun run build` from mcp first."
    );
  }
  const info = await stat(path);
  if (!info.isFile() || info.size <= 0) {
    throw new Error("Canonical BlockIT artifact is empty/invalid.");
  }
  const identity = inspectBlockItBundleContent(await Bun.file(path).text());
  return {
    bundle_path: path,
    ...identity,
    bundle_sha256: await sha256File(path),
  };
}

function repositoryHead(repoRoot: string): string {
  const result = Bun.spawnSync({
    cmd: ["git", "rev-parse", "HEAD"],
    cwd: repoRoot,
    stdout: "pipe",
    stderr: "pipe",
  });
  if (result.exitCode !== 0) {
    throw new Error(
      `Unable to read repository HEAD: ${result.stderr.toString().trim()}`
    );
  }
  const commit = result.stdout.toString().trim();
  if (!/^[0-9a-f]{40}$/.test(commit)) {
    throw new Error(`Unexpected repository HEAD: ${commit || "(empty)"}`);
  }
  return commit;
}

export async function prepareRoute1State(
  fixtureDir: string,
  repoRoot: string
) {
  const [fixture, blockit] = await Promise.all([
    inspectRoute1Fixture(fixtureDir),
    inspectBlockItArtifact(repoRoot),
  ]);
  return {
    repository_head: repositoryHead(repoRoot),
    blockit,
    fixture,
  };
}

export type Route1PreparedState = Awaited<
  ReturnType<typeof prepareRoute1State>
>;

function packagedFile(file: PreparedFile) {
  return {
    package_path: `fixture/${file.relative_path}`,
    sha256: file.sha256,
    size_bytes: file.size_bytes,
  };
}

export function buildRoute1PackageManifest(prepared: Route1PreparedState) {
  const source = prepared.fixture;
  return {
    manifest_version: 1 as const,
    fixture_schema_version: ROUTE1_FIXTURE_SCHEMA_VERSION,
    fixture_id: source.fixture.fixture_id,
    repository_head: prepared.repository_head,
    blockbench_units_per_block: 16 as const,
    blockit: {
      version: prepared.blockit.version,
      build_identity: prepared.blockit.build_identity,
      bundle_sha256: prepared.blockit.bundle_sha256,
      package_path: "plugin/blockit_mcp.js" as const,
    },
    fixture: {
      source_front_direction: source.fixture.source_front_direction,
      requested_dimensions_blocks: source.fixture.requested_dimensions_blocks,
      hunyuan: source.fixture.hunyuan,
      fixture_json: {
        package_path: "fixture/fixture.json" as const,
        sha256: source.fixture_json.sha256,
        size_bytes: source.fixture_json.size_bytes,
      },
      files: {
        approved_reference: packagedFile(source.files.approved_reference),
        approved_glb: packagedFile(source.files.approved_glb),
        contact_sheet: packagedFile(source.files.contact_sheet),
      },
    },
    authority: {
      visual_and_size: "approved_reference + requested_dimensions_blocks" as const,
      glb_role: "supporting_3d_evidence_only" as const,
      production_geometry: "blockbench_groups_and_cubes" as const,
    },
  };
}

type Manifest = ReturnType<typeof buildRoute1PackageManifest>;

function runMarkdown(manifest: Manifest): string {
  const size = manifest.fixture.requested_dimensions_blocks;
  return `# Route 1 Prepared Fixture

Fixture ID: \`${manifest.fixture_id}\`

This package is object-agnostic. The fixture identifies the representative asset only; it does not create object-specific modelling rules.

## Authority

- approved reference + requested dimensions = visual/size authority;
- approved GLB = supporting 3D evidence only;
- production geometry = normal Blockbench Groups/Cubes;
- raw GLB bounds never override requested dimensions.

Requested dimensions: ${size.width} × ${size.height} × ${size.length} blocks.
Source front: \`${manifest.fixture.source_front_direction}\`.

## Future live run

\`\`\`text
load plugin/blockit_mcp.js
→ Geometry phase
→ open/create intended Bedrock project
→ load fixture approved_glb with source_front_direction
→ inspect quantitative Route 1 evidence
→ capture explicit GLB views
→ author Groups/Cubes from approved reference + requested dimensions
→ remove transient Route 1 reference
→ export clean production .bbmodel
\`\`\`

Identity and file hashes are in \`manifest.json\`. Package creation does not prove live rendering, visual fidelity, or Route 1 quality improvement.
`;
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function copyFixtureFile(
  root: string,
  file: PreparedFile
): Promise<void> {
  const destination = resolve(root, file.relative_path);
  if (!staysInside(root, destination)) {
    throw new Error(
      `Packaged fixture path escapes destination: ${file.relative_path}`
    );
  }
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(file.source_path, destination);
}

export async function writeRoute1Package(
  prepared: Route1PreparedState,
  outputDir: string
) {
  const output = resolve(outputDir);
  if (await exists(output)) {
    throw new Error(`Route 1 package output already exists: ${output}`);
  }
  await mkdir(dirname(output), { recursive: true });

  const temp = `${output}.tmp-${process.pid}-${randomUUID()}`;
  const fixtureRoot = resolve(temp, "fixture");
  try {
    await mkdir(resolve(temp, "plugin"), { recursive: true });
    await mkdir(fixtureRoot, { recursive: true });
    await copyFile(
      prepared.blockit.bundle_path,
      resolve(temp, "plugin", "blockit_mcp.js")
    );
    await Promise.all([
      copyFixtureFile(fixtureRoot, prepared.fixture.fixture_json),
      copyFixtureFile(fixtureRoot, prepared.fixture.files.approved_reference),
      copyFixtureFile(fixtureRoot, prepared.fixture.files.approved_glb),
      copyFixtureFile(fixtureRoot, prepared.fixture.files.contact_sheet),
    ]);

    const manifest = buildRoute1PackageManifest(prepared);
    await Bun.write(
      resolve(temp, "manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`
    );
    await Bun.write(resolve(temp, "RUN.md"), runMarkdown(manifest));
    await rename(temp, output);
    return { output_dir: output, manifest };
  } catch (error) {
    await rm(temp, { recursive: true, force: true });
    throw error;
  }
}

function repoRoot(): string {
  return resolve(import.meta.dir, "..", "..");
}

async function main(): Promise<void> {
  const [command, fixtureDir, ...rest] = Bun.argv.slice(2);
  if (!fixtureDir || (command !== "prepare" && command !== "package")) {
    throw new Error(
      "Usage: <prepare|package> <fixture-directory> [--output <directory>]"
    );
  }
  if (command === "prepare" && rest.length) {
    throw new Error("prepare accepts only the fixture directory.");
  }

  const root = repoRoot();
  const prepared = await prepareRoute1State(fixtureDir, root);
  if (command === "prepare") {
    const manifest = buildRoute1PackageManifest(prepared);
    console.log(JSON.stringify({
      status: "ROUTE1_FIXTURE_PREPARED",
      fixture_id: manifest.fixture_id,
      repository_head: manifest.repository_head,
      blockit: manifest.blockit,
      fixture: manifest.fixture,
    }, null, 2));
    return;
  }

  let output: string;
  if (!rest.length) {
    output = resolve(
      root,
      "Experimental",
      "route1-hunyuan-poc",
      ".cache",
      "test-ready",
      prepared.fixture.fixture.fixture_id
    );
  } else if (rest.length === 2 && rest[0] === "--output" && rest[1]) {
    output = resolve(rest[1]);
  } else {
    throw new Error("package accepts only optional `--output <directory>`.");
  }

  const packaged = await writeRoute1Package(prepared, output);
  console.log(JSON.stringify({
    status: "ROUTE1_TEST_READY_PACKAGE_CREATED",
    fixture_id: packaged.manifest.fixture_id,
    output_dir: packaged.output_dir,
    blockit_build_identity: packaged.manifest.blockit.build_identity,
    repository_head: packaged.manifest.repository_head,
  }, null, 2));
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(
      `[route1] ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  });
}

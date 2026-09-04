import { createHash, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  copyFile,
  mkdir,
  open,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import {
  THREE_D_ASSISTED_UNITS_PER_BLOCK,
  canonicalizePrimitiveAnythingCandidate,
  freshThreeDAssistedState,
  parseThreeDAssistedWorkspaceReadme,
  primitiveAnythingCandidateSchema,
  sameThreeDAssistedDimensions,
  threeDAssistedDecompositionSchema,
  threeDAssistedStateSchema,
  type ThreeDAssistedDimensionsBlocks,
  type ThreeDAssistedState,
} from "../lib/threeDAssistedProduction";

type Dimensions = ThreeDAssistedDimensionsBlocks;

type WorkspaceContract = {
  root: string;
  readme: string;
  reference: string;
  dimensions: Dimensions;
};

const SCRIPT_DIR = import.meta.dir;
const REPO_ROOT = resolve(SCRIPT_DIR, "..", "..");
const HUNYUAN_DIR = resolve(
  REPO_ROOT,
  "Experimental",
  "three-d-assisted-hunyuan-poc"
);
const PA_DIR = resolve(REPO_ROOT, "Experimental", "primitiveanything-poc");
const EXTRACT_SCRIPT = resolve(
  SCRIPT_DIR,
  "three-d-assisted",
  "extract_reference_views.py"
);
const HUNYUAN_SCRIPT = resolve(HUNYUAN_DIR, "generate_multiview_shape.py");
const PA_PRODUCTION_SCRIPT = resolve(PA_DIR, "run_production.sh");

function usage(): never {
  throw new Error(
    [
      "Usage:",
      "  bun run three-d-assisted:run -- run --workspace /absolute/workspace/active/<asset>",
      "  bun run three-d-assisted:run -- status --workspace /absolute/workspace/active/<asset>",
      "  bun run three-d-assisted:run -- accept-shape --workspace /absolute/workspace/active/<asset>",
      "  bun run three-d-assisted:run -- reject-shape --workspace /absolute/workspace/active/<asset>",
      "  bun run three-d-assisted:run -- accept-decomposition --workspace /absolute/workspace/active/<asset>",
      "  bun run three-d-assisted:run -- reject-decomposition --workspace /absolute/workspace/active/<asset>",
    ].join("\n")
  );
}

function parseCli(): { command: string; workspace: string } {
  const args = process.argv.slice(2);
  const command = args[0];
  const workspaceIndex = args.indexOf("--workspace");
  const workspace = workspaceIndex >= 0 ? args[workspaceIndex + 1] : undefined;
  if (
    !command ||
    ![
      "run",
      "status",
      "accept-shape",
      "reject-shape",
      "accept-decomposition",
      "reject-decomposition",
    ].includes(command) ||
    !workspace
  ) {
    usage();
  }
  if (!isAbsolute(workspace)) {
    throw new Error("--workspace must be an absolute local filesystem path.");
  }
  return { command, workspace };
}

function staysInside(root: string, candidate: string): boolean {
  const path = relative(root, candidate);
  return path === "" || (!path.startsWith("..") && !isAbsolute(path));
}

async function requireFile(path: string, label: string): Promise<string> {
  let canonical: string;
  try {
    canonical = await realpath(path);
  } catch {
    throw new Error(`${label} not found: ${path}`);
  }
  const info = await stat(canonical);
  if (!info.isFile() || info.size <= 0) {
    throw new Error(`${label} is empty or not a file: ${path}`);
  }
  return canonical;
}

async function sha256File(path: string): Promise<string> {
  return await new Promise((resolveHash, rejectHash) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("error", rejectHash);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolveHash(hash.digest("hex")));
  });
}

async function assertGlb2(path: string, label: string): Promise<void> {
  const canonical = await requireFile(path, label);
  const info = await stat(canonical);
  if (info.size < 12) throw new Error(`${label} is too small for GLB 2.0.`);

  const handle = await open(canonical, "r");
  try {
    const header = Buffer.alloc(12);
    const { bytesRead } = await handle.read(header, 0, 12, 0);
    if (
      bytesRead !== 12 ||
      header.subarray(0, 4).toString("utf8") !== "glTF" ||
      header.readUInt32LE(4) !== 2 ||
      header.readUInt32LE(8) !== info.size
    ) {
      throw new Error(`${label} does not have a valid GLB 2.0 header.`);
    }
  } finally {
    await handle.close();
  }
}

async function readWorkspaceContract(
  requestedWorkspace: string
): Promise<WorkspaceContract> {
  const root = await realpath(resolve(requestedWorkspace));
  if (!(await stat(root)).isDirectory()) {
    throw new Error(`Active Workspace is not a directory: ${requestedWorkspace}`);
  }

  const readmePath = join(root, "README.md");
  const readmeCanonical = await requireFile(
    readmePath,
    "Active Workspace README"
  );
  if (!staysInside(root, readmeCanonical)) {
    throw new Error("Active Workspace README escapes the workspace root.");
  }
  const readme = await readFile(readmeCanonical, "utf8");
  const parsedWorkspace = parseThreeDAssistedWorkspaceReadme(readme);

  const referencePath = join(
    root,
    "references",
    "approved-reference.png"
  );
  const reference = await requireFile(
    referencePath,
    "Approved Reference"
  );
  if (!staysInside(root, reference)) {
    throw new Error("Approved Reference escapes the Active Workspace.");
  }

  return {
    root,
    readme,
    reference,
    dimensions: parsedWorkspace.requested_dimensions_blocks,
  };
}

function pathsFor(workspace: WorkspaceContract) {
  const assisted = join(workspace.root, "3d-assisted");
  const cache = join(workspace.root, ".cache", "3d-assisted");
  const views = join(cache, "views");
  const paCandidate = join(cache, "primitiveanything-candidate");
  return {
    assisted,
    state: join(assisted, "state.json"),
    shape: join(assisted, "shape.glb"),
    decomposition: join(assisted, "primitive-decomposition.json"),
    cache,
    views,
    left: join(views, "left.png"),
    front: join(views, "front.png"),
    back: join(views, "back.png"),
    shapeCandidate: join(cache, "shape-candidate.glb"),
    paCandidate,
    paCandidateJson: join(
      paCandidate,
      "cuboid",
      "primitive-decomposition-candidate.cuboids.json"
    ),
    paCandidatePreview: join(
      paCandidate,
      "cuboid",
      "primitive-decomposition-candidate.cuboid-preview.glb"
    ),
  };
}

async function atomicWriteJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temp = `${path}.${randomUUID()}.tmp`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rm(path, { force: true });
  await rename(temp, path);
}

async function atomicCopy(source: string, target: string): Promise<void> {
  await mkdir(dirname(target), { recursive: true });
  const temp = `${target}.${randomUUID()}.tmp`;
  await copyFile(source, temp);
  await rm(target, { force: true });
  await rename(temp, target);
}

async function writeState(
  path: string,
  state: ThreeDAssistedState
): Promise<ThreeDAssistedState> {
  const parsed = threeDAssistedStateSchema.parse(state);
  await atomicWriteJson(path, parsed);
  return parsed;
}

async function loadState(
  workspace: WorkspaceContract,
  mutate: boolean
): Promise<ThreeDAssistedState | null> {
  const paths = pathsFor(workspace);
  const referenceSha = await sha256File(workspace.reference);
  if (!(await Bun.file(paths.state).exists())) {
    if (!mutate) return null;
    await mkdir(paths.assisted, { recursive: true });
    return await writeState(paths.state, freshThreeDAssistedState(referenceSha));
  }

  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(paths.state, "utf8"));
  } catch (error) {
    throw new Error(
      `Invalid 3D-Assisted state.json: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
  let state = threeDAssistedStateSchema.parse(raw);

  if (state.reference.sha256 !== referenceSha) {
    if (!mutate) return state;
    await Promise.all([
      rm(paths.shape, { force: true }),
      rm(paths.decomposition, { force: true }),
      rm(paths.cache, { recursive: true, force: true }),
    ]);
    state = freshThreeDAssistedState(referenceSha);
    return await writeState(paths.state, state);
  }

  if (mutate && state.shape_reconstruction.status === "passed") {
    const valid =
      (await Bun.file(paths.shape).exists()) &&
      (await sha256File(paths.shape)) === state.shape_reconstruction.sha256;
    if (!valid) {
      await Promise.all([
        rm(paths.shape, { force: true }),
        rm(paths.decomposition, { force: true }),
        rm(paths.paCandidate, { recursive: true, force: true }),
      ]);
      state = threeDAssistedStateSchema.parse({
        ...state,
        shape_reconstruction: {
          status: "pending",
          implementation: state.shape_reconstruction.implementation,
        },
        primitive_decomposition: {
          status: "pending",
          implementation: state.primitive_decomposition.implementation,
        },
        last_valid_external_resume_point:
          state.view_extraction.status === "passed" ? "views" : "reference",
      });
      return await writeState(paths.state, state);
    }
  }

  if (
    mutate &&
    state.primitive_decomposition.status === "awaiting_gate" &&
    !sameThreeDAssistedDimensions(
      state.primitive_decomposition.candidate_dimensions_blocks!,
      workspace.dimensions
    )
  ) {
    await rm(paths.paCandidate, { recursive: true, force: true });
    state = threeDAssistedStateSchema.parse({
      ...state,
      primitive_decomposition: {
        status: "pending",
        implementation: state.primitive_decomposition.implementation,
      },
      last_valid_external_resume_point: "shape",
    });
    return await writeState(paths.state, state);
  }

  if (mutate && state.primitive_decomposition.status === "passed") {
    let valid =
      (await Bun.file(paths.decomposition).exists()) &&
      (await sha256File(paths.decomposition)) ===
        state.primitive_decomposition.sha256;
    if (valid) {
      try {
        const raw = threeDAssistedDecompositionSchema.parse(
          JSON.parse(await readFile(paths.decomposition, "utf8"))
        );
        valid = sameThreeDAssistedDimensions(
          raw.requested_dimensions_blocks,
          workspace.dimensions
        );
      } catch {
        valid = false;
      }
    }
    if (!valid) {
      await rm(paths.decomposition, { force: true });
      state = threeDAssistedStateSchema.parse({
        ...state,
        primitive_decomposition: {
          status: "pending",
          implementation: state.primitive_decomposition.implementation,
        },
        last_valid_external_resume_point: "shape",
      });
      return await writeState(paths.state, state);
    }
  }

  return state;
}

async function runProcess(
  command: string[],
  options?: { cwd?: string; env?: Record<string, string | undefined> }
): Promise<void> {
  const child = Bun.spawn({
    cmd: command,
    cwd: options?.cwd,
    env: { ...process.env, ...options?.env },
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await child.exited;
  if (exitCode !== 0) {
    throw new Error(
      `3D-Assisted external stage failed (${exitCode}): ${command.join(" ")}`
    );
  }
}

function hunyuanPython(): string {
  return process.env.BLOCKIT_HUNYUAN_PYTHON || "python";
}

async function ensureViews(
  workspace: WorkspaceContract,
  state: ThreeDAssistedState
): Promise<ThreeDAssistedState> {
  const paths = pathsFor(workspace);
  if (state.view_extraction.status === "passed") {
    const expected = state.view_extraction.hashes!;
    const views = [
      ["left", paths.left],
      ["front", paths.front],
      ["back", paths.back],
    ] as const;
    let current = true;
    for (const [key, path] of views) {
      if (!(await Bun.file(path).exists()) || (await sha256File(path)) !== expected[key]) {
        current = false;
        break;
      }
    }
    if (current) return state;
  }

  await rm(paths.views, { recursive: true, force: true });
  await mkdir(paths.views, { recursive: true });
  await runProcess([
    hunyuanPython(),
    EXTRACT_SCRIPT,
    workspace.reference,
    "--output-dir",
    paths.views,
  ]);
  const hashes = {
    left: await sha256File(await requireFile(paths.left, "LEFT extracted view")),
    front: await sha256File(
      await requireFile(paths.front, "FRONT extracted view")
    ),
    back: await sha256File(await requireFile(paths.back, "BACK extracted view")),
  };
  const referenceSha = await sha256File(workspace.reference);
  state = threeDAssistedStateSchema.parse({
    ...state,
    view_extraction: {
      status: "passed",
      reference_sha256: referenceSha,
      hashes,
    },
    shape_reconstruction: {
      status: "pending",
      implementation: state.shape_reconstruction.implementation,
    },
    primitive_decomposition: {
      status: "pending",
      implementation: state.primitive_decomposition.implementation,
    },
    last_valid_external_resume_point: "views",
  });
  return await writeState(paths.state, state);
}

async function generateShape(
  workspace: WorkspaceContract,
  state: ThreeDAssistedState
): Promise<ThreeDAssistedState> {
  const paths = pathsFor(workspace);
  if (state.shape_reconstruction.status === "passed") return state;
  if (state.shape_reconstruction.status === "awaiting_gate") {
    console.log(`AWAITING_SHAPE_GATE candidate=${paths.shapeCandidate}`);
    return state;
  }

  state = await ensureViews(workspace, state);
  await rm(paths.shapeCandidate, { force: true });
  await mkdir(paths.cache, { recursive: true });
  await runProcess([
    hunyuanPython(),
    HUNYUAN_SCRIPT,
    paths.front,
    paths.left,
    paths.back,
    "--output",
    paths.shapeCandidate,
  ]);
  await assertGlb2(paths.shapeCandidate, "Shape candidate");
  state = threeDAssistedStateSchema.parse({
    ...state,
    shape_reconstruction: {
      status: "awaiting_gate",
      implementation: state.shape_reconstruction.implementation,
      candidate_sha256: await sha256File(paths.shapeCandidate),
    },
    primitive_decomposition: {
      status: "pending",
      implementation: state.primitive_decomposition.implementation,
    },
    last_valid_external_resume_point: "views",
  });
  await writeState(paths.state, state);
  console.log(`AWAITING_SHAPE_GATE candidate=${paths.shapeCandidate}`);
  return state;
}

function wslExe(): string {
  return process.env.BLOCKIT_WSL_EXE || "wsl.exe";
}

function wslPath(path: string): string {
  const result = Bun.spawnSync({
    cmd: [wslExe(), "wslpath", "-a", path],
    stdout: "pipe",
    stderr: "pipe",
  });
  if (result.exitCode !== 0) {
    throw new Error(
      `Unable to convert Windows path for WSL: ${result.stderr.toString().trim()}`
    );
  }
  const converted = result.stdout.toString().trim();
  if (!converted.startsWith("/")) {
    throw new Error(`Unexpected WSL path for ${path}: ${converted || "(empty)"}`);
  }
  return converted;
}

async function runPrimitiveAnything(
  workspace: WorkspaceContract,
  state: ThreeDAssistedState
): Promise<ThreeDAssistedState> {
  const paths = pathsFor(workspace);
  if (state.primitive_decomposition.status === "passed") return state;
  if (state.primitive_decomposition.status === "awaiting_gate") {
    console.log(
      `AWAITING_DECOMPOSITION_GATE preview=${paths.paCandidatePreview} candidate=${paths.paCandidateJson}`
    );
    return state;
  }
  if (state.shape_reconstruction.status !== "passed") {
    throw new Error("PrimitiveAnything requires Shape GLB Gate PASS.");
  }
  await assertGlb2(paths.shape, "Canonical shape.glb");
  if ((await sha256File(paths.shape)) !== state.shape_reconstruction.sha256) {
    throw new Error("Canonical shape.glb hash no longer matches state.json.");
  }

  await rm(paths.paCandidate, { recursive: true, force: true });
  await mkdir(paths.paCandidate, { recursive: true });
  const width = workspace.dimensions.width * THREE_D_ASSISTED_UNITS_PER_BLOCK;
  const height = workspace.dimensions.height * THREE_D_ASSISTED_UNITS_PER_BLOCK;
  const depth = workspace.dimensions.length * THREE_D_ASSISTED_UNITS_PER_BLOCK;

  if (process.platform === "win32") {
    await runProcess([
      wslExe(),
      "bash",
      wslPath(PA_PRODUCTION_SCRIPT),
      wslPath(paths.shape),
      wslPath(paths.paCandidate),
      String(width),
      String(height),
      String(depth),
    ]);
  } else {
    await runProcess([
      "bash",
      PA_PRODUCTION_SCRIPT,
      paths.shape,
      paths.paCandidate,
      String(width),
      String(height),
      String(depth),
    ]);
  }

  const raw = JSON.parse(await readFile(paths.paCandidateJson, "utf8"));
  primitiveAnythingCandidateSchema.parse(raw);
  await assertGlb2(paths.paCandidatePreview, "Cuboid substitution preview");
  const candidateSha = await sha256File(paths.paCandidateJson);
  const previewSha = await sha256File(paths.paCandidatePreview);

  state = threeDAssistedStateSchema.parse({
    ...state,
    primitive_decomposition: {
      status: "awaiting_gate",
      implementation: state.primitive_decomposition.implementation,
      candidate_sha256: candidateSha,
      preview_sha256: previewSha,
      candidate_dimensions_blocks: workspace.dimensions,
    },
    last_valid_external_resume_point: "shape",
  });
  await writeState(paths.state, state);
  console.log(
    `AWAITING_DECOMPOSITION_GATE preview=${paths.paCandidatePreview} candidate=${paths.paCandidateJson}`
  );
  return state;
}

async function acceptShape(
  workspace: WorkspaceContract,
  state: ThreeDAssistedState
): Promise<ThreeDAssistedState> {
  const paths = pathsFor(workspace);
  if (state.shape_reconstruction.status !== "awaiting_gate") {
    throw new Error("accept-shape requires a current Shape candidate awaiting gate.");
  }
  await assertGlb2(paths.shapeCandidate, "Shape candidate");
  const candidateHash = await sha256File(paths.shapeCandidate);
  if (candidateHash !== state.shape_reconstruction.candidate_sha256) {
    throw new Error(
      "Shape candidate changed after generation. Re-run the gate against the current candidate before accepting it."
    );
  }
  await atomicCopy(paths.shapeCandidate, paths.shape);
  const hash = await sha256File(paths.shape);
  await rm(paths.decomposition, { force: true });
  await rm(paths.paCandidate, { recursive: true, force: true });

  state = threeDAssistedStateSchema.parse({
    ...state,
    shape_reconstruction: {
      status: "passed",
      implementation: state.shape_reconstruction.implementation,
      artifact: "shape.glb",
      sha256: hash,
    },
    primitive_decomposition: {
      status: "pending",
      implementation: state.primitive_decomposition.implementation,
    },
    last_valid_external_resume_point: "shape",
  });
  await writeState(paths.state, state);
  console.log(`SHAPE_GATE_PASS artifact=${paths.shape} sha256=${hash}`);
  return state;
}

async function rejectShape(
  workspace: WorkspaceContract,
  state: ThreeDAssistedState
): Promise<ThreeDAssistedState> {
  const paths = pathsFor(workspace);
  if (state.shape_reconstruction.status !== "awaiting_gate") {
    throw new Error("reject-shape requires a current Shape candidate awaiting gate.");
  }
  await rm(paths.shapeCandidate, { force: true });
  state = threeDAssistedStateSchema.parse({
    ...state,
    shape_reconstruction: {
      status: "pending",
      implementation: state.shape_reconstruction.implementation,
    },
    primitive_decomposition: {
      status: "pending",
      implementation: state.primitive_decomposition.implementation,
    },
    last_valid_external_resume_point:
      state.view_extraction.status === "passed" ? "views" : "reference",
  });
  await writeState(paths.state, state);
  console.log("SHAPE_GATE_REJECTED");
  return state;
}

async function acceptDecomposition(
  workspace: WorkspaceContract,
  state: ThreeDAssistedState
): Promise<ThreeDAssistedState> {
  const paths = pathsFor(workspace);
  if (
    state.shape_reconstruction.status !== "passed" ||
    state.primitive_decomposition.status !== "awaiting_gate"
  ) {
    throw new Error(
      "accept-decomposition requires Shape PASS and a current decomposition candidate awaiting gate."
    );
  }

  if (
    !sameThreeDAssistedDimensions(
      state.primitive_decomposition.candidate_dimensions_blocks!,
      workspace.dimensions
    )
  ) {
    throw new Error(
      "Requested Dimensions changed after PrimitiveAnything generation. Re-run decomposition for the current dimensions."
    );
  }
  await assertGlb2(paths.paCandidatePreview, "Cuboid substitution preview");
  const candidateHash = await sha256File(paths.paCandidateJson);
  const previewHash = await sha256File(paths.paCandidatePreview);
  if (
    candidateHash !== state.primitive_decomposition.candidate_sha256 ||
    previewHash !== state.primitive_decomposition.preview_sha256
  ) {
    throw new Error(
      "Decomposition candidate/preview changed after generation. Review the current candidate again before accepting it."
    );
  }
  const candidate = JSON.parse(await readFile(paths.paCandidateJson, "utf8"));
  const canonical = canonicalizePrimitiveAnythingCandidate({
    candidate,
    reference_sha256: state.reference.sha256,
    shape_sha256: state.shape_reconstruction.sha256!,
    requested_dimensions_blocks: workspace.dimensions,
  });
  await atomicWriteJson(paths.decomposition, canonical);
  const hash = await sha256File(paths.decomposition);

  state = threeDAssistedStateSchema.parse({
    ...state,
    primitive_decomposition: {
      status: "passed",
      implementation: state.primitive_decomposition.implementation,
      artifact: "primitive-decomposition.json",
      sha256: hash,
    },
    last_valid_external_resume_point: "decomposition",
  });
  await writeState(paths.state, state);
  console.log(
    `READY_FOR_BLOCKBENCH_MATERIALIZATION artifact=${paths.decomposition} sha256=${hash}`
  );
  return state;
}

async function rejectDecomposition(
  workspace: WorkspaceContract,
  state: ThreeDAssistedState
): Promise<ThreeDAssistedState> {
  const paths = pathsFor(workspace);
  if (state.primitive_decomposition.status !== "awaiting_gate") {
    throw new Error(
      "reject-decomposition requires a current decomposition candidate awaiting gate."
    );
  }
  await rm(paths.paCandidate, { recursive: true, force: true });
  state = threeDAssistedStateSchema.parse({
    ...state,
    primitive_decomposition: {
      status: "pending",
      implementation: state.primitive_decomposition.implementation,
    },
    last_valid_external_resume_point: "shape",
  });
  await writeState(paths.state, state);
  console.log("DECOMPOSITION_GATE_REJECTED");
  return state;
}

async function printStatus(workspace: WorkspaceContract): Promise<void> {
  const paths = pathsFor(workspace);
  const state = await loadState(workspace, false);
  const referenceSha = await sha256File(workspace.reference);
  const output = {
    workspace: workspace.root,
    strategy: "3D_ASSISTED",
    reference_sha256: referenceSha,
    state_present: state !== null,
    state: state
      ? {
          reference_matches: state.reference.sha256 === referenceSha,
          view_extraction: state.view_extraction.status,
          shape_reconstruction: state.shape_reconstruction.status,
          primitive_decomposition: state.primitive_decomposition.status,
          last_valid_external_resume_point:
            state.last_valid_external_resume_point,
        }
      : null,
    canonical: {
      shape_glb: await Bun.file(paths.shape).exists(),
      primitive_decomposition: await Bun.file(paths.decomposition).exists(),
    },
  };
  console.log(JSON.stringify(output, null, 2));
}

async function main(): Promise<void> {
  const { command, workspace: workspaceArg } = parseCli();
  const workspace = await readWorkspaceContract(workspaceArg);
  if (command === "status") {
    await printStatus(workspace);
    return;
  }

  let state = await loadState(workspace, true);
  if (!state) throw new Error("Failed to initialize 3D-Assisted state.");

  if (command === "accept-shape") {
    await acceptShape(workspace, state);
    return;
  }
  if (command === "reject-shape") {
    await rejectShape(workspace, state);
    return;
  }
  if (command === "accept-decomposition") {
    await acceptDecomposition(workspace, state);
    return;
  }
  if (command === "reject-decomposition") {
    await rejectDecomposition(workspace, state);
    return;
  }

  state = await generateShape(workspace, state);
  if (state.shape_reconstruction.status !== "passed") return;
  state = await runPrimitiveAnything(workspace, state);
  if (state.primitive_decomposition.status !== "passed") return;
  console.log("READY_FOR_BLOCKBENCH_MATERIALIZATION");
}

await main();

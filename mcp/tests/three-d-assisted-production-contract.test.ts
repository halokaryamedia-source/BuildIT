import { afterEach, describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { tmpdir } from "node:os";
import { materializeThreeDAssistedScaffoldFromWorkspace } from "@/server/threeDAssistedMaterializer";
import { materializeThreeDAssistedParameters } from "@/server/tools/element";
import { getAllToolDefinitions } from "@/lib/factories";
import { registerMcpProfile } from "@/server/tools";
import { searchCapabilityCatalog } from "@/gateway/contract";
import { loadState, readWorkspaceContract } from "../scripts/three-d-assisted-run";
import {
  THREE_D_ASSISTED_PRIMITIVEANYTHING_V1,
  THREE_D_ASSISTED_UNITS_PER_BLOCK,
  buildThreeDAssistedMaterializationPlan,
  canonicalizePrimitiveAnythingCandidate,
  freshThreeDAssistedState,
  parseThreeDAssistedWorkspaceReadme,
  primitiveAnythingCandidateSchema,
  threeDAssistedStateSchema,
} from "@/lib/threeDAssistedProduction";

const SHA_A = "a".repeat(64);
const SHA_B = "b".repeat(64);
const SHA_C = "c".repeat(64);

const globals = new Map<string, PropertyDescriptor | undefined>();
const workspaces: string[] = [];
function setGlobal(name: string, value: unknown) {
  if (!globals.has(name)) globals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
}
afterEach(() => {
  for (const [name, descriptor] of globals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  }
  globals.clear();
  for (const root of workspaces.splice(0)) {
    if (!root.startsWith(path.join(tmpdir(), "blockit-assisted-"))) throw new Error("Unexpected test cleanup path");
    fs.rmSync(root, { recursive: true, force: true });
  }
});

const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
function workspaceFixture() {
  const root = fs.mkdtempSync(path.join(tmpdir(), "blockit-assisted-"));
  workspaces.push(root);
  const put = (name: string, value: unknown) => {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === "string" ? value : JSON.stringify(value));
  };
  put("README.md", "Geometry Strategy: 3D_ASSISTED\nRequested Dimensions: width=1 height=1 length=1 blocks\n");
  put("references/approved-reference.png", "disposable reference bytes, not visual approval");
  put("3d-assisted/shape.glb", "disposable shape bytes, not GPU evidence");
  const referenceHash = hash(fs.readFileSync(path.join(root, "references/approved-reference.png"), "utf8"));
  const shapeHash = hash(fs.readFileSync(path.join(root, "3d-assisted/shape.glb"), "utf8"));
  const decomposition = canonicalizePrimitiveAnythingCandidate({ candidate: candidate(), reference_sha256: referenceHash,
    shape_sha256: shapeHash, requested_dimensions_blocks: { width: 1, height: 1, length: 1 } });
  put("3d-assisted/primitive-decomposition.json", decomposition);
  const base = freshThreeDAssistedState(referenceHash);
  const state = threeDAssistedStateSchema.parse({ ...base,
    shape_reconstruction: { ...base.shape_reconstruction, status: "passed", artifact: "shape.glb", sha256: shapeHash },
    primitive_decomposition: { ...base.primitive_decomposition, status: "passed", artifact: "primitive-decomposition.json", sha256: hash(JSON.stringify(decomposition)) },
    last_valid_external_resume_point: "decomposition",
  });
  put("3d-assisted/state.json", state);
  return { root, put, state };
}

function nativeFixture(failCube = false) {
  class NativeGroup {
    static all: NativeGroup[] = [];
    name = ""; uuid = "group";
    constructor(value: object) { Object.assign(this, value); }
    init() { NativeGroup.all.push(this); return this; }
    addTo(_parent: unknown) { return this; }
  }
  class NativeCube {
    static all: NativeCube[] = [];
    name = ""; uuid = "cube"; parent: unknown;
    constructor(value: object) { Object.assign(this, value); }
    init() { if (failCube) throw new Error("controlled cube failure"); NativeCube.all.push(this); return this; }
    addTo(parent: unknown) { this.parent = parent; return this; }
  }
  const undo = { started: 0, finished: 0, cancelled: 0,
    initEdit() { this.started++; },
    finishEdit() { this.finished++; },
    cancelEdit() { this.cancelled++; NativeGroup.all.length = 0; NativeCube.all.length = 0; },
  };
  setGlobal("requireNativeModule", (name: string) => ({ fs, path, crypto })[name as "fs"]);
  setGlobal("Project", {}); setGlobal("Format", { id: "bedrock" });
  setGlobal("Group", NativeGroup); setGlobal("Cube", NativeCube);
  setGlobal("Undo", undo); setGlobal("Canvas", { updateAll() {} });
  return { NativeGroup, NativeCube, undo };
}

function candidate() {
  return {
    schema_version: 1,
    method: THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.method,
    primitiveanything_source_commit:
      THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.source_commit,
    source_json: "output_shape.json",
    coordinate_conversion: {
      description: "matches upstream demo.py vertex conversion: x'=x, y'=z, z'=-y",
      matrix: [
        [1, 0, 0],
        [0, 0, 1],
        [0, -1, 0],
      ],
    },
    uniform_scale: 1,
    raw_bounds: [
      [-2, 0, -3],
      [2, 8, 3],
    ],
    final_bounds: [
      [-2, 0, -3],
      [2, 8, 3],
    ],
    cuboids: [
      {
        name: "pa_000",
        source_type: "CubeBevel",
        source_type_id: 1101002001034001,
        center: [0, 4, 0],
        size: [4, 8, 6],
        rotation_xyz: [0, 45, 0],
        pivot: [0, 4, 0],
      },
    ],
  };
}

describe("3D-Assisted production contract", () => {
  test("public materializer has one strict absolute workspace input and structured receipt", async () => {
    expect(materializeThreeDAssistedParameters.safeParse({ workspace_path: "relative" }).success).toBe(false);
    const f = workspaceFixture();
    expect(materializeThreeDAssistedParameters.safeParse({ workspace_path: f.root, primitives: [] }).success).toBe(false);
    const native = nativeFixture();
    registerMcpProfile();
    const definitions = getAllToolDefinitions();
    const catalog = Object.entries(definitions).map(([name, definition]) => ({ name, description: definition.description }));
    expect(searchCapabilityCatalog(catalog, "materialize_3d_assisted_scaffold", 5)[0]?.capability_id).toBe("materialize_3d_assisted_scaffold");
    const result = await definitions.materialize_3d_assisted_scaffold.execute({ workspace_path: f.root });
    expect(result).toMatchObject({ structuredContent: { primitive_count: 1, group_count: 1, cube_count: 1, undo_units: 1, next_step: "semantic_geometry_cleanup" } });
    expect(native.undo).toMatchObject({ started: 1, finished: 1, cancelled: 0 });
    expect(native.NativeCube.all[0].parent).toBe(native.NativeGroup.all[0]);
  });

  for (const defect of ["gate", "reference", "shape", "decomposition", "dimensions", "collision", "format", "escape"] as const) {
    test(`materializer rejects ${defect} before Undo`, () => {
      const f = workspaceFixture();
      const native = nativeFixture();
      if (defect === "gate") f.put("3d-assisted/state.json", freshThreeDAssistedState(f.state.reference.sha256));
      if (defect === "reference") f.put("references/approved-reference.png", "changed");
      if (defect === "shape") f.put("3d-assisted/shape.glb", "changed");
      if (defect === "decomposition") f.put("3d-assisted/primitive-decomposition.json", "changed");
      if (defect === "dimensions") f.put("README.md", "Geometry Strategy: 3D_ASSISTED\nRequested Dimensions: width=2 height=1 length=1 blocks");
      if (defect === "collision") new native.NativeGroup({ name: "pa_000" }).init();
      if (defect === "format") setGlobal("Format", { id: "free" });
      if (defect === "escape") setGlobal("requireNativeModule", (name: string) => name === "fs" ? { ...fs,
        realpathSync: (file: string) => file.endsWith("README.md") ? path.join(tmpdir(), "outside.md") : fs.realpathSync(file),
      } : name === "path" ? path : crypto);
      expect(() => materializeThreeDAssistedScaffoldFromWorkspace(f.root)).toThrow();
      expect(native.undo.started).toBe(0);
      expect(native.NativeCube.all).toHaveLength(0);
    });
  }

  test("partial native failure cancels the sole Undo transaction", () => {
    const f = workspaceFixture();
    const native = nativeFixture(true);
    expect(() => materializeThreeDAssistedScaffoldFromWorkspace(f.root)).toThrow("controlled cube failure");
    expect(native.undo).toMatchObject({ started: 1, finished: 0, cancelled: 1 });
    expect(native.NativeGroup.all).toHaveLength(0);
    expect(native.NativeCube.all).toHaveLength(0);
  });

  test("resume preserves accepted state, then invalidates only dimension-dependent decomposition", async () => {
    const f = workspaceFixture();
    let workspace = await readWorkspaceContract(f.root);
    expect(await loadState(workspace, true)).toEqual(f.state);
    f.put("README.md", "Geometry Strategy: 3D_ASSISTED\nRequested Dimensions: width=2 height=1 length=1 blocks");
    workspace = await readWorkspaceContract(f.root);
    const state = await loadState(workspace, true);
    expect(state?.shape_reconstruction.status).toBe("passed");
    expect(state?.primitive_decomposition.status).toBe("pending");
    expect(fs.existsSync(path.join(f.root, "3d-assisted/primitive-decomposition.json"))).toBe(false);
  });

  test("read-only status retains artifacts; changed reference invalidates derived state on resume", async () => {
    const f = workspaceFixture();
    f.put("references/approved-reference.png", "new reference");
    const workspace = await readWorkspaceContract(f.root);
    expect(await loadState(workspace, false)).toEqual(f.state);
    expect(fs.existsSync(path.join(f.root, "3d-assisted/shape.glb"))).toBe(true);
    expect((await loadState(workspace, true))?.last_valid_external_resume_point).toBe("reference");
    expect(fs.existsSync(path.join(f.root, "3d-assisted/shape.glb"))).toBe(false);
  });

  test("missing backends fail run before initializing asset state", async () => {
    const f = workspaceFixture();
    fs.unlinkSync(path.join(f.root, "3d-assisted/state.json"));
    const process = Bun.spawn(["bun", "run", "scripts/three-d-assisted-run.ts", "run", "--workspace", f.root], {
      env: { ...Bun.env, BLOCKIT_HUNYUAN_PYTHON: path.join(f.root, "missing-python.exe"), BLOCKIT_WSL_EXE: path.join(f.root, "missing-wsl.exe") },
      stdout: "pipe", stderr: "pipe",
    });
    expect(await process.exited).not.toBe(0);
    expect(await new Response(process.stderr).text()).toContain("preflight failed");
    expect(fs.existsSync(path.join(f.root, "3d-assisted/state.json"))).toBe(false);
  });
  test("workspace intake is explicit user strategy plus labelled block dimensions", () => {
    const parsed = parseThreeDAssistedWorkspaceReadme(`
Geometry Strategy: 3D_ASSISTED
Requested Dimensions: width=2 height=3 length=4 blocks
`);
    expect(parsed).toEqual({
      strategy: "3D_ASSISTED",
      requested_dimensions_blocks: { width: 2, height: 3, length: 4 },
    });
    expect(() =>
      parseThreeDAssistedWorkspaceReadme(`
Geometry Strategy: DIRECT
Requested Dimensions: width=2 height=3 length=4 blocks
`)
    ).toThrow();
    expect(() =>
      parseThreeDAssistedWorkspaceReadme(`
Geometry Strategy: 3D_ASSISTED
Requested Dimensions: 2 x 3 x 4 blocks
`)
    ).toThrow();
  });

  test("external state is resumable but cannot claim passed gates without canonical hashes", () => {
    const state = freshThreeDAssistedState(SHA_A);
    expect(state.last_valid_external_resume_point).toBe("reference");
    expect(state.shape_reconstruction.status).toBe("pending");

    expect(
      threeDAssistedStateSchema.safeParse({
        ...state,
        shape_reconstruction: {
          ...state.shape_reconstruction,
          status: "awaiting_gate",
        },
      }).success
    ).toBe(false);

    const shapePassed = threeDAssistedStateSchema.parse({
      ...state,
      shape_reconstruction: {
        ...state.shape_reconstruction,
        status: "passed",
        artifact: "shape.glb",
        sha256: SHA_B,
      },
      last_valid_external_resume_point: "shape",
    });
    expect(
      threeDAssistedStateSchema.safeParse({
        ...shapePassed,
        primitive_decomposition: {
          ...shapePassed.primitive_decomposition,
          status: "awaiting_gate",
          candidate_sha256: SHA_C,
          preview_sha256: SHA_C,
        },
      }).success
    ).toBe(false);
  });

  test("PrimitiveAnything candidate is strict deterministic data only", () => {
    expect(primitiveAnythingCandidateSchema.parse(candidate()).cuboids).toHaveLength(1);

    const wrongMatrix = candidate();
    wrongMatrix.coordinate_conversion.matrix[1][1] = 1;
    expect(primitiveAnythingCandidateSchema.safeParse(wrongMatrix).success).toBe(false);

    const wrongPivot = candidate();
    wrongPivot.cuboids[0].pivot = [1, 4, 0];
    expect(primitiveAnythingCandidateSchema.safeParse(wrongPivot).success).toBe(false);

    const wrongTypeId = candidate();
    wrongTypeId.cuboids[0].source_type_id = 1101002001034010;
    expect(primitiveAnythingCandidateSchema.safeParse(wrongTypeId).success).toBe(false);

    expect(
      primitiveAnythingCandidateSchema.safeParse({
        ...candidate(),
        command: "from_geo_json",
      }).success
    ).toBe(false);
  });

  test("canonical decomposition pins provenance and requested dimensions", () => {
    const canonical = canonicalizePrimitiveAnythingCandidate({
      candidate: candidate(),
      reference_sha256: SHA_A,
      shape_sha256: SHA_B,
      requested_dimensions_blocks: { width: 1, height: 1, length: 1 },
    });
    expect(canonical.reference_sha256).toBe(SHA_A);
    expect(canonical.shape_sha256).toBe(SHA_B);
    expect(canonical.blockbench_units_per_block).toBe(
      THREE_D_ASSISTED_UNITS_PER_BLOCK
    );
    expect(canonical.requested_dimensions_blockbench_units).toEqual({
      width: 16,
      height: 16,
      depth: 16,
    });
  });

  test("materialization plan preserves one primitive as one rotated Group plus one native Cube", () => {
    const canonical = canonicalizePrimitiveAnythingCandidate({
      candidate: candidate(),
      reference_sha256: SHA_A,
      shape_sha256: SHA_B,
      requested_dimensions_blocks: { width: 1, height: 1, length: 1 },
    });
    expect(buildThreeDAssistedMaterializationPlan(canonical)).toEqual([
      {
        group_name: "pa_000",
        group_origin: [0, 4, 0],
        group_rotation: [0, 45, 0],
        cube_name: "pa_000_cube",
        cube_from: [-2, 0, -3],
        cube_to: [2, 8, 3],
      },
    ]);
  });

  test("production orchestration pauses at visual gates and materializer stays fail-closed", async () => {
    const [orchestrator, materializer, packageText, paRunner, extractor] =
      await Promise.all([
        Bun.file("scripts/three-d-assisted-run.ts").text(),
        Bun.file("server/threeDAssistedMaterializer.ts").text(),
        Bun.file("package.json").text(),
        Bun.file("../Experimental/primitiveanything-poc/run_production.sh").text(),
        Bun.file("scripts/three-d-assisted/extract_reference_views.py").text(),
      ]);

    expect(orchestrator).toContain("AWAITING_SHAPE_GATE");
    expect(orchestrator).toContain("AWAITING_DECOMPOSITION_GATE");
    expect(orchestrator).toContain("accept-shape");
    expect(orchestrator).toContain("accept-decomposition");
    expect(orchestrator).toContain("candidate_sha256");
    expect(orchestrator).toContain("references");
    expect(orchestrator).toContain("approved-reference.png");
    expect(orchestrator).not.toContain("from_geo_json");

    const preflight = materializer.indexOf("assertScaffoldNamesAvailable(plan)");
    const undo = materializer.indexOf("Undo.initEdit({");
    expect(preflight).toBeGreaterThan(-1);
    expect(undo).toBeGreaterThan(preflight);
    expect(materializer).toContain("Undo.cancelEdit(true)");
    expect(materializer).toContain("assertMaterializedScaffold(plan, groups, cubes)");
    expect(materializer).toContain("new Group({");
    expect(materializer).toContain("new Cube({");
    expect(materializer).toContain("primitive-decomposition.json");
    expect(materializer).not.toContain("from_geo_json");
    expect(materializer).not.toContain("primitive_array");

    expect(JSON.parse(packageText).scripts["three-d-assisted:run"]).toContain(
      "three-d-assisted-run.ts"
    );
    expect(paRunner).toContain('PA_COMMIT="50586e55702cc91a81f205c3e1ea78853ce318b1"');
    expect(paRunner).toContain('git -C "$PA_ROOT" rev-parse HEAD');
    expect(paRunner).toContain("Checkpoint SHA-256 mismatch");
    expect(paRunner).toContain("--target-width");
    expect(paRunner).toContain("--target-height");
    expect(paRunner).toContain("--target-depth");
    expect(extractor).toContain('"left": crop_box');
    expect(extractor).toContain('"front": crop_box');
    expect(extractor).toContain('"back": crop_box');
  });
});

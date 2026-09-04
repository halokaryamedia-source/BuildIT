/// <reference types="three" />
/// <reference types="blockbench-types" />
import { isAbsoluteFilesystemPath } from "@/lib/util";
import {
  buildThreeDAssistedMaterializationPlan,
  parseThreeDAssistedWorkspaceReadme,
  sameThreeDAssistedDimensions,
  threeDAssistedDecompositionSchema,
  threeDAssistedStateSchema,
} from "@/lib/threeDAssistedProduction";

type NativeFs = {
  existsSync(path: string): boolean;
  readFileSync(path: string, encoding?: string): any;
  realpathSync(path: string): string;
  statSync(path: string): { isDirectory(): boolean; isFile(): boolean; size: number };
};

type NativePath = {
  isAbsolute(path: string): boolean;
  join(...parts: string[]): string;
  relative(from: string, to: string): string;
  resolve(...parts: string[]): string;
};

type NativeCrypto = {
  createHash(name: "sha256"): {
    update(data: any): any;
    digest(encoding: "hex"): string;
  };
};

function requireNative<T>(name: string): T {
  const module = requireNativeModule(name) as T | undefined;
  if (!module) {
    throw new Error(
      `3D-Assisted materialization requires Blockbench native module permission for ${name}.`
    );
  }
  return module;
}

function staysInside(pathModule: NativePath, root: string, candidate: string): boolean {
  const relativePath = pathModule.relative(root, candidate);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !pathModule.isAbsolute(relativePath))
  );
}

function requireWorkspaceFile(
  fs: NativeFs,
  pathModule: NativePath,
  root: string,
  relativePath: string,
  label: string
): string {
  const requested = pathModule.resolve(root, relativePath);
  if (!staysInside(pathModule, root, requested)) {
    throw new Error(`${label} path escapes the Active Workspace.`);
  }
  if (!fs.existsSync(requested)) {
    throw new Error(`${label} not found: ${requested}`);
  }
  const canonical = fs.realpathSync(requested);
  if (!staysInside(pathModule, root, canonical)) {
    throw new Error(`${label} symlink escapes the Active Workspace.`);
  }
  const info = fs.statSync(canonical);
  if (!info.isFile() || info.size <= 0) {
    throw new Error(`${label} is empty or not a file: ${canonical}`);
  }
  return canonical;
}

function sha256File(fs: NativeFs, crypto: NativeCrypto, path: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

function parseJsonFile(fs: NativeFs, path: string, label: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8") as string);
  } catch (error) {
    throw new Error(
      `${label} is invalid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

function requireBedrockProject(): void {
  if (!Project) {
    throw new Error(
      "Open the intended Blockbench project before materializing a 3D-Assisted scaffold."
    );
  }
  const format = Format as { id?: string } | undefined;
  if (format?.id !== "bedrock") {
    throw new Error(
      `3D-Assisted scaffold materialization requires bedrock format; current format is ${format?.id ?? "unknown"}.`
    );
  }
}

function assertScaffoldNamesAvailable(
  plan: ReturnType<typeof buildThreeDAssistedMaterializationPlan>
): void {
  const groups = new Map<string, string>();
  for (const group of Group.all ?? []) {
    groups.set(group.name.toLowerCase(), `${group.name} (${group.uuid})`);
  }
  const cubes = new Map<string, string>();
  for (const cube of Cube.all ?? []) {
    cubes.set(cube.name.toLowerCase(), `${cube.name} (${cube.uuid})`);
  }

  for (const item of plan) {
    const groupConflict = groups.get(item.group_name.toLowerCase());
    if (groupConflict) {
      throw new Error(
        `3D-Assisted scaffold Group name ${item.group_name} collides with existing ${groupConflict}. Undo/remove the old scaffold or clean Geometry before retrying.`
      );
    }
    groups.set(item.group_name.toLowerCase(), item.group_name);

    const cubeConflict = cubes.get(item.cube_name.toLowerCase());
    if (cubeConflict) {
      throw new Error(
        `3D-Assisted scaffold Cube name ${item.cube_name} collides with existing ${cubeConflict}.`
      );
    }
    cubes.set(item.cube_name.toLowerCase(), item.cube_name);
  }
}


function vec3Matches(
  actual: readonly number[] | undefined,
  expected: readonly [number, number, number]
): boolean {
  return (
    actual !== undefined &&
    actual.length >= 3 &&
    expected.every(
      (value, axis) =>
        Number.isFinite(actual[axis]) && Math.abs(actual[axis] - value) <= 1e-6
    )
  );
}

function assertMaterializedScaffold(
  plan: ReturnType<typeof buildThreeDAssistedMaterializationPlan>,
  groups: Group[],
  cubes: Cube[]
): void {
  if (groups.length !== plan.length || cubes.length !== plan.length) {
    throw new Error("3D-Assisted materialization did not create the complete scaffold.");
  }
  for (let index = 0; index < plan.length; index += 1) {
    const item = plan[index];
    const group = groups[index];
    const cube = cubes[index];
    if (
      group.name !== item.group_name ||
      cube.name !== item.cube_name ||
      !vec3Matches(group.origin, item.group_origin) ||
      !vec3Matches(group.rotation, item.group_rotation) ||
      !vec3Matches(cube.from, item.cube_from) ||
      !vec3Matches(cube.to, item.cube_to)
    ) {
      throw new Error(
        `3D-Assisted native postcondition mismatch at primitive ${item.group_name}.`
      );
    }
  }
}

export type ThreeDAssistedMaterializationReceipt = {
  primitive_count: number;
  group_count: number;
  cube_count: number;
  undo_units: 1;
  source: "workspace/3d-assisted/primitive-decomposition.json";
  next_step: "semantic_geometry_cleanup";
};

export function materializeThreeDAssistedScaffoldFromWorkspace(
  workspacePath: string
): ThreeDAssistedMaterializationReceipt {
  if (!isAbsoluteFilesystemPath(workspacePath)) {
    throw new Error(
      "3D-Assisted materialization requires an absolute Active Workspace path."
    );
  }

  const fs = requireNative<NativeFs>("fs");
  const pathModule = requireNative<NativePath>("path");
  const crypto = requireNative<NativeCrypto>("crypto");

  if (!fs.existsSync(workspacePath)) {
    throw new Error(`Active Workspace not found: ${workspacePath}`);
  }
  const root = fs.realpathSync(pathModule.resolve(workspacePath));
  if (!fs.statSync(root).isDirectory()) {
    throw new Error(`Active Workspace is not a directory: ${workspacePath}`);
  }

  const readmePath = requireWorkspaceFile(
    fs,
    pathModule,
    root,
    "README.md",
    "Active Workspace README"
  );
  const workspace = parseThreeDAssistedWorkspaceReadme(
    fs.readFileSync(readmePath, "utf8") as string
  );

  const statePath = requireWorkspaceFile(
    fs,
    pathModule,
    root,
    pathModule.join("3d-assisted", "state.json"),
    "3D-Assisted state.json"
  );
  const state = threeDAssistedStateSchema.parse(
    parseJsonFile(fs, statePath, "3D-Assisted state.json")
  );
  if (
    state.shape_reconstruction.status !== "passed" ||
    state.primitive_decomposition.status !== "passed"
  ) {
    throw new Error(
      "3D-Assisted materialization requires Shape GLB Gate PASS and Primitive Decomposition Gate PASS."
    );
  }

  const referencePath = requireWorkspaceFile(
    fs,
    pathModule,
    root,
    state.reference.path,
    "Approved Reference"
  );
  const shapePath = requireWorkspaceFile(
    fs,
    pathModule,
    root,
    pathModule.join("3d-assisted", state.shape_reconstruction.artifact!),
    "Canonical shape.glb"
  );
  const decompositionPath = requireWorkspaceFile(
    fs,
    pathModule,
    root,
    pathModule.join("3d-assisted", state.primitive_decomposition.artifact!),
    "Canonical primitive-decomposition.json"
  );

  if (sha256File(fs, crypto, referencePath) !== state.reference.sha256) {
    throw new Error(
      "Approved Reference hash no longer matches state.json. Regenerate 3D-Assisted derived artifacts first."
    );
  }
  if (sha256File(fs, crypto, shapePath) !== state.shape_reconstruction.sha256) {
    throw new Error(
      "shape.glb hash no longer matches state.json. Regenerate/re-approve Shape Reconstruction first."
    );
  }
  if (
    sha256File(fs, crypto, decompositionPath) !==
    state.primitive_decomposition.sha256
  ) {
    throw new Error(
      "primitive-decomposition.json hash no longer matches state.json."
    );
  }

  const decomposition = threeDAssistedDecompositionSchema.parse(
    parseJsonFile(
      fs,
      decompositionPath,
      "Canonical primitive-decomposition.json"
    )
  );
  if (
    decomposition.reference_sha256 !== state.reference.sha256 ||
    decomposition.shape_sha256 !== state.shape_reconstruction.sha256
  ) {
    throw new Error(
      "Primitive decomposition provenance does not match the current approved reference/shape."
    );
  }
  if (
    !sameThreeDAssistedDimensions(
      decomposition.requested_dimensions_blocks,
      workspace.requested_dimensions_blocks
    )
  ) {
    throw new Error(
      "Requested Dimensions changed after Primitive Decomposition Gate PASS. Regenerate decomposition for the current workspace dimensions."
    );
  }

  const plan = buildThreeDAssistedMaterializationPlan(decomposition);
  requireBedrockProject();
  assertScaffoldNamesAvailable(plan);

  const groups: Group[] = [];
  const cubes: Cube[] = [];

  Undo.initEdit({
    elements: [],
    groups: [],
    outliner: true,
    collections: [],
  });
  try {
    for (const item of plan) {
      const group = new Group({
        name: item.group_name,
        origin: item.group_origin,
        rotation: item.group_rotation,
      }).init();
      group.addTo("root");

      const cube = new Cube({
        name: item.cube_name,
        from: item.cube_from,
        to: item.cube_to,
        origin: item.group_origin,
        rotation: [0, 0, 0],
        autouv: 0,
        box_uv: true,
        uv_offset: [0, 0],
      }).init();
      cube.addTo(group);

      groups.push(group);
      cubes.push(cube);
    }

    assertMaterializedScaffold(plan, groups, cubes);

    Undo.finishEdit("BlockIT materialized 3D-Assisted Cuboid scaffold", {
      elements: cubes,
      groups,
      outliner: true,
    });
  } catch (error) {
    Undo.cancelEdit(true);
    Canvas.updateAll();
    throw error;
  }

  Canvas.updateAll();
  return {
    primitive_count: plan.length,
    group_count: groups.length,
    cube_count: cubes.length,
    undo_units: 1,
    source: "workspace/3d-assisted/primitive-decomposition.json",
    next_step: "semantic_geometry_cleanup",
  };
}

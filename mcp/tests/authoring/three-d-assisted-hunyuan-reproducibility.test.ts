import { spawnSync } from "node:child_process";
import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function availablePython(): string | null {
  const candidates =
    process.platform === "win32" ? ["python", "py"] : ["python3", "python"];
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (!probe.error && probe.status === 0) return candidate;
  }
  return null;
}

describe("3D-Assisted Hunyuan reproducibility contract", () => {
  test("preferred MultiView executable matches the pinned accepted evidence path", async () => {
    const script = await source(
      "../Experimental/three-d-assisted-hunyuan-poc/generate_multiview_shape.py"
    );

    for (const marker of [
      'MODEL_ID = "tencent/Hunyuan3D-2mv"',
      'MODEL_REVISION = "3a761b539b29fe4ff64714813aa9560fd66f5de0"',
      'MODEL_SUBFOLDER = "hunyuan3d-dit-v2-mv"',
      'MODEL_VARIANT = "fp16"',
      "INFERENCE_STEPS = 50",
      "GUIDANCE_SCALE = 5.0",
      "OCTREE_RESOLUTION = 256",
      "NUM_CHUNKS = 20_000",
      "DEFAULT_SEED = 12_345",
      'FRONT_DIRECTION = "+z"',
      'REQUIRED_VIEWS = ("front", "left", "back")',
      '"front": args.front',
      '"left": args.left',
      '"back": args.back',
      "require_local_model()",
      "num_inference_steps=INFERENCE_STEPS",
      "guidance_scale=GUIDANCE_SCALE",
      "octree_resolution=OCTREE_RESOLUTION",
      "num_chunks=NUM_CHUNKS",
      'output_type="trimesh"',
      '"source-multiview-separated.glb"',
    ]) expect(script).toContain(marker);

    expect(script).not.toContain("args.right");
    expect(script).not.toContain("snapshot_download");
    expect(script).not.toContain("texgen");
    expect(script).not.toContain("face_reduce");
    expect(script).not.toContain("voxel");
  });

  test("single-view baseline remains fixed and fail-closed rather than replacing MultiView", async () => {
    const script = await source(
      "../Experimental/three-d-assisted-hunyuan-poc/generate_shape.py"
    );
    for (const marker of [
      'MODEL_ID = "tencent/Hunyuan3D-2"',
      'MODEL_REVISION = "9cd649ba6913f7a852e3286bad86bfa9a2d83dcf"',
      'MODEL_SUBFOLDER = "hunyuan3d-dit-v2-0"',
      "INFERENCE_STEPS = 50",
      "GUIDANCE_SCALE = 5.0",
      "OCTREE_RESOLUTION = 256",
      "NUM_CHUNKS = 20_000",
      "DEFAULT_SEED = 12_345",
      'models_root = os.environ.get("HY3DGEN_MODELS")',
      "Pinned Hunyuan shape model is incomplete",
      "guidance_scale=GUIDANCE_SCALE",
    ]) expect(script).toContain(marker);
  });

  test("tracked 3D-Assisted Python entrypoints parse when Python is available", () => {
    const python = availablePython();
    if (!python) return;

    const files = [
      "../Experimental/three-d-assisted-hunyuan-poc/generate_shape.py",
      "../Experimental/three-d-assisted-hunyuan-poc/generate_multiview_shape.py",
      "../Experimental/three-d-assisted-hunyuan-poc/render_contact_sheet.py",
    ];
    const checker =
      "from pathlib import Path; import sys; [compile(Path(p).read_text(encoding='utf-8'), p, 'exec') for p in sys.argv[1:]]";
    const result = spawnSync(python, ["-c", checker, ...files], {
      encoding: "utf8",
    });
    if (result.error || result.status !== 0) {
      throw new Error(
        `3D-Assisted Python syntax check failed: ${result.stderr || result.stdout || result.error?.message}`
      );
    }
    expect(result.status).toBe(0);
  });

  test("3D-Assisted README locks selected image+GLB workflow while live proof remains pending", async () => {
    const readme = await source(
      "../Experimental/three-d-assisted-hunyuan-poc/README.md"
    );
    for (const marker of [
      "IMAGE + GLB SELECTED WORKFLOW LOCKED",
      "PREFERRED MULTIVIEW EXECUTABLE TRACKED",
      "GEOMETRY EVIDENCE BRIDGE STATIC SOURCE APPLIED",
      "LOCAL BLOCKBENCH ALIGNMENT/BRIDGE TEST REQUIRED",
      "NOT YET LIVE-PROVEN",
      "generate_multiview_shape.py",
      "guidance scale     5.0",
      "manage_geometry_reference",
      "reference_models://...",
      "raw Hunyuan bounds",
      "requested target dimensions",
      "mesh-to-Blockbench converter",
    ]) expect(readme).toContain(marker);

    expect(readme.toLowerCase()).toContain("image-only versus image+glb");
    expect(readme).not.toContain("BUILDIT MCP UNCHANGED");
  });
});

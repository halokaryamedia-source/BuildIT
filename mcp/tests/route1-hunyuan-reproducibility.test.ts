import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Route 1 Hunyuan reproducibility contract", () => {
  test("preferred MultiView executable matches the pinned accepted evidence path", async () => {
    const script = await source(
      "../Experimental/route1-hunyuan-poc/generate_multiview_shape.py"
    );

    for (const marker of [
      'MODEL_ID = "tencent/Hunyuan3D-2mv"',
      'MODEL_REVISION = "3a761b539b29fe4ff64714813aa9560fd66f5de0"',
      'MODEL_SUBFOLDER = "hunyuan3d-dit-v2-mv"',
      'MODEL_VARIANT = "fp16"',
      "INFERENCE_STEPS = 50",
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
      "../Experimental/route1-hunyuan-poc/generate_shape.py"
    );
    for (const marker of [
      'MODEL_ID = "tencent/Hunyuan3D-2"',
      'MODEL_SUBFOLDER = "hunyuan3d-dit-v2-0"',
      "INFERENCE_STEPS = 50",
      "OCTREE_RESOLUTION = 256",
      "NUM_CHUNKS = 20_000",
      "DEFAULT_SEED = 12_345",
      'models_root = os.environ.get("HY3DGEN_MODELS")',
      "Pinned Hunyuan shape model is incomplete",
    ]) expect(script).toContain(marker);
  });

  test("Route 1 README names the executable bridge and keeps live proof pending", async () => {
    const readme = await source(
      "../Experimental/route1-hunyuan-poc/README.md"
    );
    for (const marker of [
      "PREFERRED MULTIVIEW EXECUTABLE TRACKED",
      "GEOMETRY EVIDENCE BRIDGE STATIC SOURCE APPLIED",
      "LIVE BLOCKBENCH BRIDGE PROOF PENDING",
      "generate_multiview_shape.py",
      "manage_geometry_reference",
      "reference_models://...",
      "raw Hunyuan bounds",
      "requested target dimensions",
      "mesh-to-Blockbench converter",
      "NOT PRODUCTION",
    ]) expect(readme).toContain(marker);

    expect(readme).not.toContain("BUILDIT MCP UNCHANGED");
  });
});

#!/usr/bin/env python3
"""Generate the preferred shape-only Hunyuan3D-2mv Route 1 evidence mesh."""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import torch
from PIL import Image

from hy3dgen.rembg import BackgroundRemover
from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline


MODEL_ID = "tencent/Hunyuan3D-2mv"
MODEL_REVISION = "3a761b539b29fe4ff64714813aa9560fd66f5de0"
MODEL_SUBFOLDER = "hunyuan3d-dit-v2-mv"
MODEL_VARIANT = "fp16"
INFERENCE_STEPS = 50
OCTREE_RESOLUTION = 256
NUM_CHUNKS = 20_000
DEFAULT_SEED = 12_345
FRONT_DIRECTION = "+z"
REQUIRED_VIEWS = ("front", "left", "back")


def require_local_model() -> Path:
    models_root = os.environ.get("HY3DGEN_MODELS")
    if not models_root:
        raise RuntimeError(
            "HY3DGEN_MODELS is not set. Use the pinned local MultiView model setup in "
            "Experimental/route1-hunyuan-poc/README.md; do not silently fetch an "
            "unpinned model revision for this experiment."
        )

    model_dir = (
        Path(models_root).expanduser()
        / "tencent"
        / "Hunyuan3D-2mv"
        / MODEL_SUBFOLDER
    )
    required = (model_dir / "config.yaml", model_dir / "model.fp16.safetensors")
    missing = [path for path in required if not path.is_file()]
    if missing:
        joined = ", ".join(str(path) for path in missing)
        raise FileNotFoundError(
            f"Pinned Hunyuan MultiView shape model is incomplete: {joined}"
        )
    return model_dir


def prepare_image(path: Path) -> Image.Image:
    with Image.open(path) as source:
        if "A" in source.getbands():
            rgba = source.convert("RGBA")
            alpha_min, _ = rgba.getchannel("A").getextrema()
            if alpha_min < 255:
                return rgba.copy()
        rgb = source.convert("RGB")

    return BackgroundRemover()(rgb).convert("RGBA")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("front", type=Path, help="Approved separated FRONT crop.")
    parser.add_argument(
        "left",
        type=Path,
        help="Approved separated SIDE crop mapped to Hunyuan's left view.",
    )
    parser.add_argument("back", type=Path, help="Approved separated BACK crop.")
    parser.add_argument(
        "--output",
        type=Path,
        default=(
            Path(__file__).resolve().parent
            / ".cache"
            / "source-multiview-separated.glb"
        ),
        help="Transient shape-only GLB output path.",
    )
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    view_paths = {
        "front": args.front,
        "left": args.left,
        "back": args.back,
    }
    for view, path in view_paths.items():
        if not path.is_file():
            raise FileNotFoundError(f"{view} input image not found: {path}")

    if not torch.cuda.is_available():
        raise RuntimeError("CUDA is required for the Hunyuan Route 1 local proof.")

    model_dir = require_local_model()
    images = {view: prepare_image(path) for view, path in view_paths.items()}
    if tuple(images.keys()) != REQUIRED_VIEWS:
        raise RuntimeError(
            f"Route 1 MultiView input contract changed unexpectedly: {tuple(images.keys())}"
        )

    pipeline = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained(
        MODEL_ID,
        subfolder=MODEL_SUBFOLDER,
        variant=MODEL_VARIANT,
    )
    mesh = pipeline(
        image=images,
        num_inference_steps=INFERENCE_STEPS,
        octree_resolution=OCTREE_RESOLUTION,
        num_chunks=NUM_CHUNKS,
        generator=torch.manual_seed(args.seed),
        output_type="trimesh",
    )[0]
    if mesh is None:
        raise RuntimeError("Hunyuan MultiView returned no mesh.")
    if len(mesh.vertices) == 0 or len(mesh.faces) == 0:
        raise RuntimeError("Hunyuan MultiView returned an empty mesh.")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    mesh.export(args.output)

    device = torch.cuda.get_device_name(0)
    total_vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
    print(f"model_id={MODEL_ID}")
    print(f"model_revision={MODEL_REVISION}")
    print(f"model_dir={model_dir}")
    print(f"device={device} vram_gb={total_vram_gb:.2f}")
    print(f"views={','.join(REQUIRED_VIEWS)} front_direction={FRONT_DIRECTION}")
    print(
        f"settings=fp16 steps={INFERENCE_STEPS} octree={OCTREE_RESOLUTION} "
        f"chunks={NUM_CHUNKS} seed={args.seed}"
    )
    print(f"mesh=vertices:{len(mesh.vertices)} faces:{len(mesh.faces)}")
    print(f"output={args.output.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

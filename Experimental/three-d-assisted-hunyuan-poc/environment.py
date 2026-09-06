"""Install/check the pinned Windows shape-only environment; never run inference."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / ".cache"
SOURCE = CACHE / "Hunyuan3D-2"
SOURCE_COMMIT = "f8db63096c8282cb27354314d896feba5ba6ff8a"
MODEL_ID = "tencent/Hunyuan3D-2mv"
MODEL_REVISION = "3a761b539b29fe4ff64714813aa9560fd66f5de0"
MODEL_SUBFOLDER = "hunyuan3d-dit-v2-mv"
MODEL_VARIANT = "fp16"
# Verified against the pinned Hugging Face revision's Git/LFS object identities.
MODEL_FILES = {
    f"{MODEL_SUBFOLDER}/config.yaml": "315fd5bf601d1d103130b9fda202f1bd28eda495e68ed1621bc823d5519c5e5b",
    f"{MODEL_SUBFOLDER}/model.fp16.safetensors": "d36f5881bcdc56726b73e517cd444c13c60732431622da7268145355c8d38e9c",
}
MODELS = CACHE / "models"
U2NET = CACHE / "u2net"
PYTHON = CACHE / "venv" / "Scripts" / "python.exe"


def run(*args: str) -> str:
    return subprocess.check_output(args, text=True).strip()


def digest(path: Path, algorithm: str = "sha256") -> str:
    result = hashlib.new(algorithm)
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            result.update(chunk)
    return result.hexdigest()


def configure() -> None:
    os.environ.setdefault("HY3DGEN_MODELS", str(MODELS))
    os.environ.setdefault("U2NET_HOME", str(U2NET))
    os.environ["HF_HUB_OFFLINE"] = "1"


def check_source() -> None:
    if run("git", "-C", str(SOURCE), "rev-parse", "HEAD") != SOURCE_COMMIT:
        raise RuntimeError("Hunyuan source commit differs from the pinned implementation")
    if run("git", "-C", str(SOURCE), "status", "--porcelain", "--untracked-files=no"):
        raise RuntimeError("Hunyuan source has tracked modifications")


def check_weights() -> None:
    root = Path(os.environ.get("HY3DGEN_MODELS", str(MODELS)))
    for name, expected in MODEL_FILES.items():
        if digest(root / MODEL_ID / name) != expected:
            raise RuntimeError(f"Hunyuan weight checksum mismatch: {name}")
    # rembg's pinned u2net artifact identity; no ONNX session/model execution.
    if digest(Path(os.environ.get("U2NET_HOME", str(U2NET))) / "u2net.onnx", "md5") != "60024c5c889badc19c04ad937298a77b":
        raise RuntimeError("u2net background-removal weight checksum mismatch")


def preflight() -> None:
    configure()
    check_source()
    import torch
    import hy3dgen
    import onnxruntime
    from PIL import Image
    from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline
    from hy3dgen.rembg import BackgroundRemover
    if not Path(hy3dgen.__file__).resolve().is_relative_to(SOURCE.resolve()):
        raise RuntimeError("hy3dgen import does not resolve to the pinned checkout")
    if not torch.cuda.is_available():
        raise RuntimeError("Hunyuan PyTorch cannot access CUDA")
    check_weights()
    print(json.dumps({"stage": "hunyuan", "ready": True, "python": sys.executable,
                      "source": str(SOURCE), "models": os.environ["HY3DGEN_MODELS"],
                      "torch": torch.__version__, "gpu": torch.cuda.get_device_name(0),
                      "inference": "not_run"}))


def download_weights() -> None:
    from huggingface_hub import snapshot_download
    from rembg.sessions.u2net import U2netSession
    os.environ.pop("HF_HUB_OFFLINE", None)
    root = MODELS / MODEL_ID
    # These pinned artifacts are public; do not depend on desktop login credentials.
    snapshot_download(MODEL_ID, revision=MODEL_REVISION, allow_patterns=list(MODEL_FILES), local_dir=root, token=False)
    os.environ["U2NET_HOME"] = str(U2NET)
    U2NET.mkdir(parents=True, exist_ok=True)
    U2netSession.download_models()
    check_weights()


def setup() -> None:
    if sys.platform != "win32":
        raise RuntimeError("This setup owns the Windows Hunyuan environment")
    CACHE.mkdir(parents=True, exist_ok=True)
    if not SOURCE.exists():
        subprocess.check_call(["git", "clone", "--no-checkout", "https://github.com/Tencent-Hunyuan/Hunyuan3D-2.git", str(SOURCE)])
        subprocess.check_call(["git", "-C", str(SOURCE), "checkout", "--detach", SOURCE_COMMIT])
    check_source()
    if not PYTHON.exists():
        subprocess.check_call([sys.executable, "-m", "venv", str(CACHE / "venv")])
    subprocess.check_call([str(PYTHON), "-m", "pip", "install", "torch==2.5.1", "torchvision==0.20.1", "--index-url", "https://download.pytorch.org/whl/cu124"])
    subprocess.check_call([str(PYTHON), "-m", "pip", "install", "-c", str(ROOT / "constraints.txt"), "-e", str(SOURCE)])
    subprocess.check_call([str(PYTHON), str(Path(__file__).resolve()), "download"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["setup", "preflight", "download"])
    command = parser.parse_args().command
    {"setup": setup, "preflight": preflight, "download": download_weights}[command]()

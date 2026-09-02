#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PA_ROOT="${PA_ROOT:-$SCRIPT_DIR/.cache/PrimitiveAnything}"
ENV_NAME="${PA_ENV:-blockit-pa-poc}"
PA_COMMIT="50586e55702cc91a81f205c3e1ea78853ce318b1"
PA_DATA_REV="59606099595f9293fe5c8d05a4779ab95ac7bb69"
PA_MODEL_REV="7abafab148bd53d7c8e1f2710b66e2abf93c3ee0"
MICHELANGELO_REV="1ef441fa3ad93b4606ab60eaa8826916b27247ff"
PA_WEIGHT_SHA256="140341166b40f2038ec20933512f2e00401299d581e7b2549c0068195b616c5a"
MICHELANGELO_SHA256="0391b81c36240e8f766fedf4265df599884193a5ef65354525074b9a00887454"

command -v git >/dev/null || { echo "git is required" >&2; exit 1; }
command -v conda >/dev/null || {
  echo "conda is required. Install Miniconda/Miniforge inside WSL2, reopen the shell, then rerun." >&2
  exit 1
}

if ! command -v nvidia-smi >/dev/null; then
  echo "warning: nvidia-smi is not available in WSL. Setup can continue, but PrimitiveAnything stock demo requires CUDA at run time." >&2
fi

mkdir -p "$(dirname "$PA_ROOT")"
if [[ ! -d "$PA_ROOT/.git" ]]; then
  git clone https://github.com/PrimitiveAnything/PrimitiveAnything.git "$PA_ROOT"
fi

if [[ -n "$(git -C "$PA_ROOT" status --porcelain)" ]]; then
  echo "Refusing to change a dirty PrimitiveAnything checkout: $PA_ROOT" >&2
  echo "Move local edits elsewhere or set PA_ROOT to a clean path." >&2
  exit 1
fi

git -C "$PA_ROOT" fetch origin "$PA_COMMIT" --depth 1
git -C "$PA_ROOT" checkout --detach "$PA_COMMIT"

source "$(conda info --base)/etc/profile.d/conda.sh"
if ! conda env list | awk '{print $1}' | grep -Fxq "$ENV_NAME"; then
  conda create -y -n "$ENV_NAME" python=3.9
fi
conda activate "$ENV_NAME"

python -m pip install --upgrade pip setuptools wheel ninja
conda install -y -n "$ENV_NAME" pytorch=2.1.0 torchvision=0.16.0 pytorch-cuda=11.8 -c pytorch -c nvidia
conda install -y -n "$ENV_NAME" pytorch3d=0.7.8 -c pytorch3d -c pytorch -c nvidia
REQ_TMP="$(mktemp)"
grep -v '^git+https://github.com/facebookresearch/pytorch3d.git' "$PA_ROOT/requirements.txt" > "$REQ_TMP"
python -m pip install -r "$REQ_TMP"
rm -f "$REQ_TMP"
python -m pip install huggingface_hub

python - "$PA_ROOT" "$PA_DATA_REV" "$PA_MODEL_REV" "$MICHELANGELO_REV" "$PA_WEIGHT_SHA256" "$MICHELANGELO_SHA256" <<'PY'
from __future__ import annotations

import hashlib
import shutil
import sys
from pathlib import Path

from huggingface_hub import hf_hub_download, snapshot_download

pa_root = Path(sys.argv[1]).resolve()
data_rev, model_rev, michelangelo_rev = sys.argv[2:5]
pa_sha, miche_sha = sys.argv[5:7]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(8 * 1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


snapshot_download(
    repo_id="hyz317/PrimitiveAnything",
    repo_type="dataset",
    revision=data_rev,
    local_dir=pa_root / "data",
    allow_patterns=["basic_shapes_norm/*", "basic_shapes_norm_pc10000/*"],
)

cache_dir = pa_root / ".hf-download"
cache_dir.mkdir(parents=True, exist_ok=True)

pa_weight_download = Path(
    hf_hub_download(
        repo_id="hyz317/PrimitiveAnything",
        filename="mesh-transformer.ckpt.60.pt",
        revision=model_rev,
        local_dir=cache_dir / "primitiveanything",
    )
)
miche_download = Path(
    hf_hub_download(
        repo_id="Maikou/Michelangelo",
        filename="checkpoints/aligned_shape_latents/shapevae-256.ckpt",
        revision=michelangelo_rev,
        local_dir=cache_dir / "michelangelo",
    )
)

ckpt_dir = pa_root / "ckpt"
ckpt_dir.mkdir(parents=True, exist_ok=True)
pa_weight = ckpt_dir / "mesh-transformer.ckpt.60.pt"
miche_weight = ckpt_dir / "shapevae-256.ckpt"
shutil.copy2(pa_weight_download, pa_weight)
shutil.copy2(miche_download, miche_weight)

for path, expected in ((pa_weight, pa_sha), (miche_weight, miche_sha)):
    actual = sha256(path)
    if actual != expected:
        raise SystemExit(f"SHA-256 mismatch for {path}: expected {expected}, got {actual}")
    print(f"verified {path.name}: {actual}")

required = [
    pa_root / "data/basic_shapes_norm/SM_GR_BS_CubeBevel_001.ply",
    pa_root / "data/basic_shapes_norm/SM_GR_BS_SphereSharp_001.ply",
    pa_root / "data/basic_shapes_norm/SM_GR_BS_CylinderSharp_001.ply",
    pa_root / "data/basic_shapes_norm_pc10000/SM_GR_BS_CubeBevel_001.ply",
    pa_root / "data/basic_shapes_norm_pc10000/SM_GR_BS_SphereSharp_001.ply",
    pa_root / "data/basic_shapes_norm_pc10000/SM_GR_BS_CylinderSharp_001.ply",
]
missing = [str(path) for path in required if not path.is_file()]
if missing:
    raise SystemExit("required PrimitiveAnything data missing:\n- " + "\n- ".join(missing))
PY

cat <<EOF

PrimitiveAnything POC setup prepared.
Source: $PA_ROOT
Commit: $PA_COMMIT
Conda env: $ENV_NAME

Next:
  ./run_poc.sh /absolute/or/wsl/path/to/approved-elephant.glb
EOF

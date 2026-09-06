#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PA_ROOT="${PA_ROOT:-$SCRIPT_DIR/.cache/PrimitiveAnything}"
ENV_NAME="${PA_ENV:-blockit-pa-poc}"
PA_COMMIT="50586e55702cc91a81f205c3e1ea78853ce318b1"
PA_WEIGHT_SHA256="140341166b40f2038ec20933512f2e00401299d581e7b2549c0068195b616c5a"
MICHELANGELO_SHA256="0391b81c36240e8f766fedf4265df599884193a5ef65354525074b9a00887454"

PREFLIGHT=false
if [[ $# -eq 1 && "$1" == "--preflight" ]]; then
  PREFLIGHT=true
elif [[ $# -ne 5 ]]; then
  echo "Usage: $0 /path/to/shape.glb /path/to/output-dir <width-bb> <height-bb> <depth-bb>" >&2
  exit 2
fi

if [[ "$PREFLIGHT" == false ]]; then
  INPUT="$(realpath "$1")"
  OUTPUT_DIR="$2"
  TARGET_WIDTH="$3"
  TARGET_HEIGHT="$4"
  TARGET_DEPTH="$5"
  [[ -f "$INPUT" ]] || { echo "shape.glb not found: $INPUT" >&2; exit 1; }
fi
[[ -d "$PA_ROOT/.git" ]] || {
  echo "PrimitiveAnything is not set up. Run Experimental/primitiveanything-poc/setup_wsl.sh first." >&2
  exit 1
}
command -v git >/dev/null || { echo "git is required" >&2; exit 1; }
command -v conda >/dev/null || { echo "conda is required" >&2; exit 1; }
command -v sha256sum >/dev/null || { echo "sha256sum is required" >&2; exit 1; }
[[ "$(git -C "$PA_ROOT" rev-parse HEAD)" == "$PA_COMMIT" ]] || {
  echo "PrimitiveAnything checkout is not pinned commit $PA_COMMIT" >&2
  exit 1
}
[[ -z "$(git -C "$PA_ROOT" status --porcelain)" ]] || {
  echo "PrimitiveAnything checkout is dirty: $PA_ROOT" >&2
  exit 1
}
for spec in \
  "$PA_ROOT/ckpt/mesh-transformer.ckpt.60.pt:$PA_WEIGHT_SHA256" \
  "$PA_ROOT/ckpt/shapevae-256.ckpt:$MICHELANGELO_SHA256"; do
  path="${spec%%:*}"
  expected="${spec##*:}"
  [[ -f "$path" ]] || { echo "Pinned checkpoint missing: $path" >&2; exit 1; }
  actual="$(sha256sum "$path" | awk '{print $1}')"
  [[ "$actual" == "$expected" ]] || { echo "Checkpoint SHA-256 mismatch: $path" >&2; exit 1; }
done
command -v nvidia-smi >/dev/null || {
  echo "PrimitiveAnything requires a CUDA-capable NVIDIA GPU visible to this environment." >&2
  exit 1
}

source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate "$ENV_NAME"

python - "$PA_ROOT" <<'PY'
import sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
import torch
import pytorch3d._C
import mesh2sdf.core
import mesh_to_sdf
import skimage.measure
import seaborn
import accelerate
import primitive_anything.utils
from primitive_anything.primitive_transformer import PrimitiveTransformerDiscrete
from scipy.spatial.transform import Rotation
if not torch.cuda.is_available():
    raise SystemExit("torch.cuda.is_available() is false; PrimitiveAnything cannot run")
for folder in ("basic_shapes_norm", "basic_shapes_norm_pc10000"):
    for shape in ("CubeBevel", "SphereSharp", "CylinderSharp"):
        path = Path(sys.argv[1]) / "data" / folder / f"SM_GR_BS_{shape}_001.ply"
        if not path.is_file() or not path.stat().st_size:
            raise SystemExit(f"PrimitiveAnything data missing: {path}")
print("CUDA:", torch.cuda.get_device_name(0))
PY

if [[ "$PREFLIGHT" == true ]]; then
  echo "PrimitiveAnything preflight PASS; source=$PA_ROOT; environment=$ENV_NAME; inference=not_run"
  exit 0
fi

mkdir -p "$OUTPUT_DIR/pa" "$OUTPUT_DIR/cuboid"
OUTPUT_DIR="$(realpath "$OUTPUT_DIR")"

pushd "$PA_ROOT" >/dev/null
python demo.py --input "$INPUT" --log_path "$OUTPUT_DIR/pa"
popd >/dev/null

STEM="$(basename "$INPUT")"
STEM="${STEM%.*}"
PA_JSON="$OUTPUT_DIR/pa/output_${STEM}.json"
PA_PREVIEW="$OUTPUT_DIR/pa/output_${STEM}.glb"

[[ -f "$PA_JSON" ]] || {
  echo "PrimitiveAnything did not produce expected JSON: $PA_JSON" >&2
  exit 1
}
[[ -f "$PA_PREVIEW" ]] || {
  echo "PrimitiveAnything did not produce expected preview GLB: $PA_PREVIEW" >&2
  exit 1
}

python "$SCRIPT_DIR/convert_pa_output.py" \
  --pa-root "$PA_ROOT" \
  --input "$PA_JSON" \
  --output-dir "$OUTPUT_DIR/cuboid" \
  --model-id "primitive-decomposition-candidate" \
  --target-width "$TARGET_WIDTH" \
  --target-height "$TARGET_HEIGHT" \
  --target-depth "$TARGET_DEPTH"

CANDIDATE="$OUTPUT_DIR/cuboid/primitive-decomposition-candidate.cuboids.json"
PREVIEW="$OUTPUT_DIR/cuboid/primitive-decomposition-candidate.cuboid-preview.glb"

[[ -f "$CANDIDATE" ]] || { echo "Cuboid candidate missing: $CANDIDATE" >&2; exit 1; }
[[ -f "$PREVIEW" ]] || { echo "Cuboid preview missing: $PREVIEW" >&2; exit 1; }

echo "primitiveanything_json=$PA_JSON"
echo "primitiveanything_preview=$PA_PREVIEW"
echo "cuboid_candidate=$CANDIDATE"
echo "cuboid_preview=$PREVIEW"

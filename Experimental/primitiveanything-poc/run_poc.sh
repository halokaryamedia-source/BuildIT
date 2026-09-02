#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PA_ROOT="${PA_ROOT:-$SCRIPT_DIR/.cache/PrimitiveAnything}"
ENV_NAME="${PA_ENV:-blockit-pa-poc}"
TARGET_LONGEST="${TARGET_LONGEST:-32}"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /path/to/approved-elephant.glb [run-name]" >&2
  exit 2
fi

INPUT="$(realpath "$1")"
RUN_NAME="${2:-$(basename "${INPUT%.*}")-$(date +%Y%m%d-%H%M%S)}"
RUN_DIR="$SCRIPT_DIR/runs/$RUN_NAME"

[[ -f "$INPUT" ]] || { echo "input GLB not found: $INPUT" >&2; exit 1; }
[[ -d "$PA_ROOT/.git" ]] || { echo "PrimitiveAnything is not set up. Run ./setup_wsl.sh first." >&2; exit 1; }
command -v conda >/dev/null || { echo "conda is required" >&2; exit 1; }
command -v nvidia-smi >/dev/null || {
  echo "PrimitiveAnything stock demo requires a CUDA-capable NVIDIA GPU visible to WSL (nvidia-smi missing)." >&2
  exit 1
}

source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate "$ENV_NAME"

python - <<'PY'
import torch
if not torch.cuda.is_available():
    raise SystemExit("torch.cuda.is_available() is false; PrimitiveAnything stock demo cannot run")
print("CUDA:", torch.cuda.get_device_name(0))
PY

mkdir -p "$RUN_DIR/pa" "$RUN_DIR/cuboid"

pushd "$PA_ROOT" >/dev/null
python demo.py --input "$INPUT" --log_path "$RUN_DIR/pa"
popd >/dev/null

STEM="$(basename "$INPUT")"
STEM="${STEM%.*}"
PA_JSON="$RUN_DIR/pa/output_${STEM}.json"
PA_PREVIEW="$RUN_DIR/pa/output_${STEM}.glb"

[[ -f "$PA_JSON" ]] || {
  echo "PrimitiveAnything did not produce expected JSON: $PA_JSON" >&2
  echo "Stop here and inspect the stock PrimitiveAnything run before attempting Cuboid conversion." >&2
  exit 1
}

python "$SCRIPT_DIR/convert_pa_output.py" \
  --pa-root "$PA_ROOT" \
  --input "$PA_JSON" \
  --output-dir "$RUN_DIR/cuboid" \
  --model-id "${STEM}_pa_poc" \
  --target-longest "$TARGET_LONGEST"

cat <<EOF

POC outputs are ready:

Gate 0 — inspect stock PrimitiveAnything first:
  $PA_PREVIEW

Gate 1 — inspect pure-Cuboid substitution:
  $RUN_DIR/cuboid/${STEM}_pa_poc.cuboid-preview.glb

Blockbench editable-Cube import:
  $RUN_DIR/cuboid/${STEM}_pa_poc.geo.json

Blockbench test:
  1. Open the .geo.json as a Bedrock Entity model.
  2. Confirm Outliner contains Groups/bones with Cube children, not Mesh elements.
  3. Compare front/side/top/isometric silhouette against the approved GLB/reference.
  4. If accepted, use File > Save Project As to save a .bbmodel.

Do not continue to MCP integration if Gate 0 or Gate 1 fails.
EOF

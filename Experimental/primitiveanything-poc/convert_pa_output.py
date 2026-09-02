#!/usr/bin/env python3
"""Convert PrimitiveAnything mixed primitives into pure cuboids for Blockbench POC.

This converter intentionally does not infer anatomy. PrimitiveAnything owns primitive
placement; this file only substitutes each predicted primitive with the oriented
bounding cuboid of its canonical base shape, applies the same coordinate conversion
used by the upstream demo, and writes deterministic preview/spec/Bedrock geometry.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import warnings
from collections import Counter
from itertools import product
from pathlib import Path
from typing import Any

import numpy as np
import trimesh
from scipy.spatial.transform import Rotation

PA_SOURCE_COMMIT = "50586e55702cc91a81f205c3e1ea78853ce318b1"

TYPE_INFO: dict[int, tuple[str, str]] = {
    1101002001034001: ("CubeBevel", "SM_GR_BS_CubeBevel_001.ply"),
    1101002001034010: ("SphereSharp", "SM_GR_BS_SphereSharp_001.ply"),
    1101002001034002: ("CylinderSharp", "SM_GR_BS_CylinderSharp_001.ply"),
}

# Upstream demo.py converts rendered vertices as:
#   x' = x, y' = z, z' = -y
PA_TO_BLOCKBENCH = np.array(
    [
        [1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0],
        [0.0, -1.0, 0.0],
    ],
    dtype=np.float64,
)


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Substitute PrimitiveAnything CubeBevel/SphereSharp/CylinderSharp output "
            "with pure oriented cuboids and emit a Blockbench-importable Bedrock geo.json."
        )
    )
    parser.add_argument("--pa-root", type=Path, required=True, help="Pinned PrimitiveAnything checkout")
    parser.add_argument("--input", type=Path, required=True, help="PrimitiveAnything output_*.json")
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--model-id", default="primitiveanything_poc")
    parser.add_argument(
        "--target-longest",
        type=float,
        default=32.0,
        help=(
            "POC-only display envelope in Blockbench units when no explicit target dimensions "
            "are supplied. Default 32. This is not an approved production dimension."
        ),
    )
    parser.add_argument("--target-width", type=float, default=None)
    parser.add_argument("--target-height", type=float, default=None)
    parser.add_argument("--target-depth", type=float, default=None)
    return parser


def _vec(value: Any, length: int, label: str) -> np.ndarray:
    if not isinstance(value, list) or len(value) != length:
        raise ValueError(f"{label} must be a {length}-number array")
    result = np.asarray(value, dtype=np.float64)
    if not np.isfinite(result).all():
        raise ValueError(f"{label} contains a non-finite value")
    return result


def _clean_number(value: float) -> int | float:
    value = 0.0 if abs(value) < 1e-7 else float(value)
    rounded = round(value, 6)
    if math.isclose(rounded, round(rounded), abs_tol=1e-9):
        return int(round(rounded))
    return rounded


def _clean_vec(value: np.ndarray) -> list[int | float]:
    return [_clean_number(v) for v in value.tolist()]


def _safe_model_id(value: str) -> str:
    normalized = re.sub(r"[^a-zA-Z0-9_.-]+", "_", value).strip("_.-")
    if not normalized:
        raise ValueError("model-id becomes empty after sanitization")
    return normalized.lower()


def _load_base_bounds(pa_root: Path) -> dict[int, tuple[np.ndarray, np.ndarray]]:
    base_dir = pa_root / "data" / "basic_shapes_norm"
    result: dict[int, tuple[np.ndarray, np.ndarray]] = {}
    for type_id, (_, filename) in TYPE_INFO.items():
        path = base_dir / filename
        if not path.is_file():
            raise FileNotFoundError(
                f"missing canonical PrimitiveAnything base primitive: {path}\n"
                "Run setup_wsl.sh before conversion."
            )
        mesh = trimesh.load(path, force="mesh", process=False)
        bounds = np.asarray(mesh.bounds, dtype=np.float64)
        if bounds.shape != (2, 3) or not np.isfinite(bounds).all():
            raise ValueError(f"invalid bounds in {path}")
        local_center = (bounds[0] + bounds[1]) * 0.5
        local_size = bounds[1] - bounds[0]
        if (local_size <= 0).any():
            raise ValueError(f"non-positive primitive extent in {path}: {local_size.tolist()}")
        result[type_id] = (local_center, local_size)
    return result


def _obb_corners(center: np.ndarray, size: np.ndarray, rotation_matrix: np.ndarray) -> np.ndarray:
    half = size * 0.5
    local = np.asarray(
        [[sx * half[0], sy * half[1], sz * half[2]] for sx, sy, sz in product((-1.0, 1.0), repeat=3)],
        dtype=np.float64,
    )
    return (rotation_matrix @ local.T).T + center


def _rotation_xyz(matrix: np.ndarray, label: str) -> np.ndarray:
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        euler = Rotation.from_matrix(matrix).as_euler("XYZ", degrees=True)
    if caught:
        print(f"warning: {label}: Euler conversion encountered gimbal lock; using SciPy's valid solution")
    euler = ((euler + 180.0) % 360.0) - 180.0
    euler[np.abs(euler) < 1e-7] = 0.0
    return euler


def _load_raw_cuboids(pa_root: Path, input_path: Path) -> list[dict[str, Any]]:
    payload = json.loads(input_path.read_text(encoding="utf-8"))
    blocks = payload.get("group")
    if not isinstance(blocks, list) or not blocks:
        raise ValueError("PrimitiveAnything output must contain a non-empty 'group' array")

    base_bounds = _load_base_bounds(pa_root)
    cuboids: list[dict[str, Any]] = []

    for index, block in enumerate(blocks):
        if not isinstance(block, dict):
            raise ValueError(f"group[{index}] must be an object")
        try:
            type_id = int(block["type_id"])
            type_name, _ = TYPE_INFO[type_id]
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError(f"group[{index}] has unsupported PrimitiveAnything type_id") from exc

        data = block.get("data")
        if not isinstance(data, dict):
            raise ValueError(f"group[{index}].data must be an object")

        translation = _vec(data.get("location"), 3, f"group[{index}].data.location")
        quaternion = _vec(data.get("rotation"), 4, f"group[{index}].data.rotation")
        scale = _vec(data.get("scale"), 3, f"group[{index}].data.scale")
        if (scale <= 0).any():
            raise ValueError(f"group[{index}].data.scale must be positive")
        quat_norm = np.linalg.norm(quaternion)
        if quat_norm < 1e-8:
            raise ValueError(f"group[{index}].data.rotation quaternion has zero norm")
        quaternion = quaternion / quat_norm

        rotation_pa = Rotation.from_quat(quaternion)
        local_center, local_size = base_bounds[type_id]

        # Match upstream SRT: R @ diag(scale), followed by translation.
        center_pa = rotation_pa.apply(local_center * scale) + translation
        center_bb = PA_TO_BLOCKBENCH @ center_pa
        rotation_bb_matrix = PA_TO_BLOCKBENCH @ rotation_pa.as_matrix()
        size_bb = np.abs(scale) * local_size

        cuboids.append(
            {
                "index": index,
                "name": f"pa_{index:03d}",
                "source_type": type_name,
                "source_type_id": type_id,
                "center_raw": center_bb,
                "size_raw": size_bb,
                "rotation_matrix": rotation_bb_matrix,
                "rotation_xyz": _rotation_xyz(rotation_bb_matrix, f"group[{index}]")
            }
        )

    return cuboids


def _fit_to_target(cuboids: list[dict[str, Any]], args: argparse.Namespace) -> tuple[float, np.ndarray, np.ndarray, np.ndarray]:
    all_corners = np.concatenate(
        [_obb_corners(c["center_raw"], c["size_raw"], c["rotation_matrix"]) for c in cuboids],
        axis=0,
    )
    raw_min = all_corners.min(axis=0)
    raw_max = all_corners.max(axis=0)
    raw_extent = raw_max - raw_min
    if (raw_extent <= 0).any():
        raise ValueError(f"invalid aggregate cuboid bounds: {raw_extent.tolist()}")

    explicit = [args.target_width, args.target_height, args.target_depth]
    if any(value is not None for value in explicit):
        limits = []
        labels = ("width", "height", "depth")
        for axis, (label, value) in enumerate(zip(labels, explicit)):
            if value is None:
                continue
            if not math.isfinite(value) or value <= 0:
                raise ValueError(f"target-{label} must be positive and finite")
            limits.append(value / raw_extent[axis])
        uniform_scale = min(limits)
    else:
        if not math.isfinite(args.target_longest) or args.target_longest <= 0:
            raise ValueError("target-longest must be positive and finite")
        uniform_scale = args.target_longest / float(raw_extent.max())

    scaled_min = raw_min * uniform_scale
    scaled_max = raw_max * uniform_scale
    # POC canonical placement: centered in X/Z and grounded at Y=0.
    offset = np.array(
        [
            -(scaled_min[0] + scaled_max[0]) * 0.5,
            -scaled_min[1],
            -(scaled_min[2] + scaled_max[2]) * 0.5,
        ],
        dtype=np.float64,
    )

    final_corners = []
    for cuboid in cuboids:
        cuboid["center"] = cuboid["center_raw"] * uniform_scale + offset
        cuboid["size"] = cuboid["size_raw"] * uniform_scale
        final_corners.append(
            _obb_corners(cuboid["center"], cuboid["size"], cuboid["rotation_matrix"])
        )

    final_corners_np = np.concatenate(final_corners, axis=0)
    final_min = final_corners_np.min(axis=0)
    final_max = final_corners_np.max(axis=0)
    return uniform_scale, raw_min, raw_max, np.stack([final_min, final_max])


def _write_preview(cuboids: list[dict[str, Any]], path: Path) -> None:
    scene = trimesh.Scene()
    for cuboid in cuboids:
        transform = np.eye(4, dtype=np.float64)
        transform[:3, :3] = cuboid["rotation_matrix"]
        transform[:3, 3] = cuboid["center"]
        box = trimesh.creation.box(extents=cuboid["size"], transform=transform)
        scene.add_geometry(box, geom_name=cuboid["name"], node_name=cuboid["name"])
    scene.export(path)


def _make_geo(model_id: str, cuboids: list[dict[str, Any]], final_bounds: np.ndarray) -> dict[str, Any]:
    bounds_min, bounds_max = final_bounds
    extent = bounds_max - bounds_min
    bounds_center = (bounds_min + bounds_max) * 0.5

    bones: list[dict[str, Any]] = [{"name": "root", "pivot": [0, 0, 0]}]
    for cuboid in cuboids:
        center = cuboid["center"]
        size = cuboid["size"]
        origin = center - size * 0.5
        bones.append(
            {
                "name": cuboid["name"],
                "parent": "root",
                "pivot": _clean_vec(center),
                "rotation": _clean_vec(cuboid["rotation_xyz"]),
                "cubes": [
                    {
                        "origin": _clean_vec(origin),
                        "size": _clean_vec(size),
                        "uv": [0, 0],
                    }
                ],
            }
        )

    return {
        "format_version": "1.12.0",
        "minecraft:geometry": [
            {
                "description": {
                    "identifier": f"geometry.{model_id}",
                    "texture_width": 16,
                    "texture_height": 16,
                    "visible_bounds_width": _clean_number(max(extent[0], extent[2])),
                    "visible_bounds_height": _clean_number(extent[1]),
                    "visible_bounds_offset": _clean_vec(bounds_center),
                },
                "bones": bones,
            }
        ],
    }


def main() -> int:
    args = _parser().parse_args()
    pa_root = args.pa_root.resolve()
    input_path = args.input.resolve()
    output_dir = args.output_dir.resolve()
    model_id = _safe_model_id(args.model_id)

    if not input_path.is_file():
        raise FileNotFoundError(f"PrimitiveAnything JSON not found: {input_path}")
    if not pa_root.is_dir():
        raise FileNotFoundError(f"PrimitiveAnything checkout not found: {pa_root}")

    cuboids = _load_raw_cuboids(pa_root, input_path)
    uniform_scale, raw_min, raw_max, final_bounds = _fit_to_target(cuboids, args)
    output_dir.mkdir(parents=True, exist_ok=True)

    spec_path = output_dir / f"{model_id}.cuboids.json"
    preview_path = output_dir / f"{model_id}.cuboid-preview.glb"
    geo_path = output_dir / f"{model_id}.geo.json"
    summary_path = output_dir / f"{model_id}.summary.json"

    source_counts = Counter(c["source_type"] for c in cuboids)
    spec = {
        "schema_version": 1,
        "method": "primitiveanything-mixed-primitives-to-oriented-cuboids",
        "primitiveanything_source_commit": PA_SOURCE_COMMIT,
        "source_json": input_path.name,
        "coordinate_conversion": {
            "description": "matches upstream demo.py vertex conversion: x'=x, y'=z, z'=-y",
            "matrix": PA_TO_BLOCKBENCH.tolist(),
        },
        "uniform_scale": _clean_number(uniform_scale),
        "raw_bounds": [_clean_vec(raw_min), _clean_vec(raw_max)],
        "final_bounds": [_clean_vec(final_bounds[0]), _clean_vec(final_bounds[1])],
        "cuboids": [
            {
                "name": c["name"],
                "source_type": c["source_type"],
                "source_type_id": c["source_type_id"],
                "center": _clean_vec(c["center"]),
                "size": _clean_vec(c["size"]),
                "rotation_xyz": _clean_vec(c["rotation_xyz"]),
                "pivot": _clean_vec(c["center"]),
            }
            for c in cuboids
        ],
    }
    spec_path.write_text(json.dumps(spec, indent=2) + "\n", encoding="utf-8")

    geo = _make_geo(model_id, cuboids, final_bounds)
    geo_path.write_text(json.dumps(geo, indent=2) + "\n", encoding="utf-8")
    _write_preview(cuboids, preview_path)

    summary = {
        "status": "LOCAL_VISUAL_PROOF_REQUIRED",
        "cuboid_count": len(cuboids),
        "source_type_counts": dict(sorted(source_counts.items())),
        "outputs": {
            "cuboid_spec": spec_path.name,
            "cuboid_preview_glb": preview_path.name,
            "bedrock_geometry": geo_path.name,
        },
        "acceptance": [
            "PrimitiveAnything stock decomposition is recognizable before substitution",
            "pure-cuboid preview remains recognizable as the same subject",
            "four elephant legs remain distinct",
            "head and ears remain readable",
            "trunk remains a coherent multi-segment form",
            "Blockbench opens geo.json as editable Cubes/Groups, not Mesh elements",
        ],
    }
    summary_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    print(f"cuboids: {len(cuboids)}")
    print(f"source types: {dict(sorted(source_counts.items()))}")
    print(f"cuboid preview: {preview_path}")
    print(f"Blockbench geometry: {geo_path}")
    print("LOCAL VISUAL PROOF REQUIRED: open the geo.json in Blockbench and compare with the approved GLB/reference.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

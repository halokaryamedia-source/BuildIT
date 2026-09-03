#!/usr/bin/env python3
"""Render a deterministic four-view contact sheet from a 3D-Assisted source mesh."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw


TILE_SIZE = 512
HEADER_HEIGHT = 34
PADDING = 42
BACKGROUND = (245, 245, 245)
HEADER = (28, 28, 28)
TEXT = (240, 240, 240)
MESH_BASE = 185


def load_mesh(path: Path) -> trimesh.Trimesh:
    loaded = trimesh.load(path, force="scene")
    if isinstance(loaded, trimesh.Trimesh):
        return loaded

    meshes: list[trimesh.Trimesh] = []
    for node_name in loaded.graph.nodes_geometry:
        transform, geometry_name = loaded.graph[node_name]
        geometry = loaded.geometry[geometry_name]
        if not isinstance(geometry, trimesh.Trimesh):
            continue
        mesh = geometry.copy()
        mesh.apply_transform(transform)
        meshes.append(mesh)

    if not meshes:
        raise ValueError(f"No triangle geometry found in {path}")
    return trimesh.util.concatenate(meshes)


def normalize(vector: np.ndarray) -> np.ndarray:
    length = float(np.linalg.norm(vector))
    if length <= 1e-9:
        raise ValueError("Cannot normalize a zero vector.")
    return vector / length


def camera_basis(
    camera_position_direction: np.ndarray,
    preferred_up: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    camera_pos = normalize(camera_position_direction.astype(float))
    view_dir = -camera_pos
    right = normalize(np.cross(view_dir, preferred_up))
    up = normalize(np.cross(right, view_dir))
    return right, up, view_dir


def view_bases(front_direction: str) -> dict[str, tuple[np.ndarray, np.ndarray, np.ndarray]]:
    front_sign = -1.0 if front_direction == "-z" else 1.0
    world_up = np.array([0.0, 1.0, 0.0])

    front = (
        np.array([1.0, 0.0, 0.0]),
        world_up,
        np.array([0.0, 0.0, -front_sign]),
    )
    side = (
        np.array([0.0, 0.0, 1.0]),
        world_up,
        np.array([-1.0, 0.0, 0.0]),
    )
    top = (
        np.array([1.0, 0.0, 0.0]),
        np.array([0.0, 0.0, front_sign]),
        np.array([0.0, -1.0, 0.0]),
    )
    iso = camera_basis(
        np.array([1.0, 0.85, front_sign]),
        world_up,
    )
    return {
        "FRONT": front,
        "SIDE": side,
        "TOP": top,
        "ISOMETRIC": iso,
    }


def projected_span(
    centered_vertices: np.ndarray,
    bases: dict[str, tuple[np.ndarray, np.ndarray, np.ndarray]],
) -> float:
    max_span = 0.0
    for right, up, _ in bases.values():
        points = np.column_stack((centered_vertices @ right, centered_vertices @ up))
        span = points.max(axis=0) - points.min(axis=0)
        max_span = max(max_span, float(span.max()))
    if max_span <= 1e-9:
        raise ValueError("Mesh has zero projected extent.")
    return max_span


def render_view(
    mesh: trimesh.Trimesh,
    centered_vertices: np.ndarray,
    basis: tuple[np.ndarray, np.ndarray, np.ndarray],
    world_span: float,
) -> Image.Image:
    right, up, view_dir = basis
    screen_x = centered_vertices @ right
    screen_y = centered_vertices @ up
    depth = centered_vertices @ view_dir

    available = TILE_SIZE - 2 * PADDING
    scale = available / world_span
    px = screen_x * scale + TILE_SIZE / 2
    py = TILE_SIZE / 2 - screen_y * scale

    face_depth = depth[mesh.faces].mean(axis=1)
    order = np.argsort(face_depth)[::-1]

    normals = np.asarray(mesh.face_normals, dtype=float)
    camera_vector = -view_dir
    facing = np.abs(normals @ camera_vector)
    vertical = (normals @ np.array([0.0, 1.0, 0.0]) + 1.0) * 0.5
    brightness = np.clip(0.42 + 0.45 * facing + 0.13 * vertical, 0.0, 1.0)

    image = Image.new("RGB", (TILE_SIZE, TILE_SIZE), BACKGROUND)
    draw = ImageDraw.Draw(image)
    for face_index in order:
        triangle = mesh.faces[face_index]
        polygon = [(float(px[index]), float(py[index])) for index in triangle]
        value = int(np.clip(MESH_BASE * brightness[face_index] + 45, 55, 235))
        draw.polygon(polygon, fill=(value, value, value))

    return image


def contact_sheet(
    mesh: trimesh.Trimesh,
    front_direction: str,
) -> Image.Image:
    vertices = np.asarray(mesh.vertices, dtype=float)
    if vertices.size == 0 or len(mesh.faces) == 0:
        raise ValueError("Mesh must contain vertices and triangular faces.")

    bounds = np.asarray(mesh.bounds, dtype=float)
    center = bounds.mean(axis=0)
    centered_vertices = vertices - center

    bases = view_bases(front_direction)
    world_span = projected_span(centered_vertices, bases)

    sheet = Image.new(
        "RGB",
        (TILE_SIZE * 2, (TILE_SIZE + HEADER_HEIGHT) * 2),
        HEADER,
    )
    draw = ImageDraw.Draw(sheet)
    for index, (label, basis) in enumerate(bases.items()):
        col = index % 2
        row = index // 2
        x = col * TILE_SIZE
        y = row * (TILE_SIZE + HEADER_HEIGHT)
        draw.text((x + 12, y + 10), label, fill=TEXT)
        tile = render_view(mesh, centered_vertices, basis, world_span)
        sheet.paste(tile, (x, y + HEADER_HEIGHT))
    return sheet


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mesh", type=Path, help="Generated GLB/GLTF/OBJ mesh.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parent / ".cache" / "contact-sheet.png",
    )
    parser.add_argument(
        "--front-direction",
        choices=("-z", "+z"),
        default="-z",
        help="Canonical object front for BuildIT comparison.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.mesh.is_file():
        raise FileNotFoundError(f"Mesh not found: {args.mesh}")

    mesh = load_mesh(args.mesh)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    contact_sheet(mesh, args.front_direction).save(args.output)

    print(f"mesh=vertices:{len(mesh.vertices)} faces:{len(mesh.faces)}")
    print(f"front_direction={args.front_direction}")
    print(f"output={args.output.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

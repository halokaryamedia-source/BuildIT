#!/usr/bin/env python3
"""Deterministically extract LEFT/FRONT/BACK from BlockIT's canonical five-preview board."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reference", type=Path)
    parser.add_argument("--output-dir", type=Path, required=True)
    return parser.parse_args()


def crop_box(width: int, height: int, column: int) -> tuple[int, int, int, int]:
    if width < 6 or height < 4:
        raise ValueError("Approved Reference is too small for the canonical five-preview board.")
    y1 = 0
    y2 = round(height / 2)
    x1 = round(width * column / 3)
    x2 = round(width * (column + 1) / 3)
    if x2 <= x1 or y2 <= y1:
        raise ValueError("Approved Reference produced an empty canonical upper-row slot.")
    return (x1, y1, x2, y2)


def main() -> int:
    args = parse_args()
    reference = args.reference.resolve()
    if not reference.is_file():
        raise FileNotFoundError(f"Approved Reference not found: {reference}")

    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(reference) as source:
        image = source.convert("RGBA")
        slots = {
            "left": crop_box(image.width, image.height, 0),
            "front": crop_box(image.width, image.height, 1),
            "back": crop_box(image.width, image.height, 2),
        }
        for name, box in slots.items():
            output = output_dir / f"{name}.png"
            image.crop(box).save(output, format="PNG", optimize=False)
            print(f"{name}={output}")

    print("layout=UPPER:LEFT|FRONT|BACK normalized_y=0..0.5")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

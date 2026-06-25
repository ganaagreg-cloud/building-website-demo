#!/usr/bin/env python3
"""
Generates grayscale depth maps for dollhouse PNG images using Depth Anything V2.
Usage: python generate_depth.py <image1.png> [image2.png ...]
Output: <image>-depth.png saved next to each source file.

First run downloads the model (~200 MB) to ~/.cache/huggingface/
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image


def load_pipeline():
    from transformers import pipeline
    return pipeline(
        "depth-estimation",
        model="depth-anything/Depth-Anything-V2-Small-hf",
        device="cpu",
    )


def generate_depth_map(pipe, src_path: Path) -> Path:
    img = Image.open(src_path).convert("RGB")
    result = pipe(img)
    depth_img = result["depth"]  # PIL Image
    arr = np.array(depth_img, dtype=np.float32)
    # Normalize to 0-255 (white = near, black = far)
    if arr.max() > arr.min():
        arr = (arr - arr.min()) / (arr.max() - arr.min()) * 255.0
    depth_gray = Image.fromarray(arr.astype(np.uint8)).convert("L")
    out_path = src_path.parent / (src_path.stem + "-depth.png")
    depth_gray.save(out_path)
    return out_path


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_depth.py <image.png> [image.png ...]")
        sys.exit(1)

    print("Loading Depth Anything V2 model (downloads ~200 MB on first run)...")
    pipe = load_pipeline()
    print("Model loaded.")

    for arg in sys.argv[1:]:
        src = Path(arg).resolve()
        if not src.exists():
            print(f"  SKIP (not found): {src}")
            continue
        print(f"  Processing {src.name} ...")
        try:
            out = generate_depth_map(pipe, src)
            print(f"  -> Saved {out.name}")
        except Exception as exc:
            print(f"  ERROR ({src.name}): {exc}")

    print("Done.")


if __name__ == "__main__":
    main()

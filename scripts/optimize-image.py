#!/usr/bin/env python3
"""Otimiza uma foto (PNG/JPG) para uso web: redimensiona, comprime e
converte para JPEG progressivo, removendo metadados. Uso:

    .venv/bin/python3 scripts/optimize-image.py origem.png destino.jpg [largura_max]
"""
import sys
from PIL import Image

MAX_WIDTH_DEFAULT = 1920
QUALITY = 82


def optimize(source: str, target: str, max_width: int = MAX_WIDTH_DEFAULT) -> None:
    img = Image.open(source)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, round(img.height * ratio)), Image.LANCZOS)

    img.save(target, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    print(f"{source} -> {target} ({img.width}x{img.height})")


if __name__ == "__main__":
    src = sys.argv[1]
    dst = sys.argv[2]
    max_w = int(sys.argv[3]) if len(sys.argv) > 3 else MAX_WIDTH_DEFAULT
    optimize(src, dst, max_w)

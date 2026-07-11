#!/usr/bin/env python3
"""Recolore o logo vermelho da Monumental para o tom bordô do redesign."""
from PIL import Image
import colorsys

SOURCE = "public/img/monumentalvermelha.png"
TARGET_HUE = colorsys.rgb_to_hsv(0x9f / 255, 0x1c / 255, 0x2e / 255)[0]


def recolor(path: str) -> None:
    img = Image.open(path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            # só recolore pixels realmente vermelhos (evita tocar em branco/preto/cinza)
            if s < 0.25 or v < 0.15:
                continue
            nr, ng, nb = colorsys.hsv_to_rgb(TARGET_HUE, s, v)
            pixels[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)

    img.save(path)
    print(f"Recolorido: {path}")


if __name__ == "__main__":
    recolor(SOURCE)

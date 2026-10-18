"""
Gera os recortes da logo a partir do arquivo original.

    pip install Pillow
    python scripts/logo.py caminho/para/logo-original.jpeg

Produz em public/: logo.png (lockup completo), logo-wordmark.png (só o
nome), og-image.jpg (preview de link) e os dois favicons.

O original é quadrado, com o monograma em cima e o nome embaixo, sobre
preto. O script acha as faixas de conteúdo pela luminância em vez de usar
coordenadas fixas, então continua funcionando se a arte for reenquadrada.
"""

import os
import sys

from PIL import Image

PAD = 20
THRESHOLD = 30  # acima disso conta como conteúdo, não fundo
DEST = os.path.join(os.path.dirname(__file__), "..", "public")


def content_bands(gray, height, width):
    """Faixas verticais que contêm arte, de cima para baixo."""
    bands, start = [], None
    for y in range(height):
        row = gray.crop((0, y, width, y + 1))
        has_content = max(row.getextrema()) > THRESHOLD
        if has_content and start is None:
            start = y
        elif not has_content and start is not None:
            if y - start > 8:
                bands.append((start, y))
            start = None
    if start is not None:
        bands.append((start, height))
    return bands


def horizontal_bounds(gray, width, y0, y1):
    box = gray.crop((0, y0, width, y1)).point(lambda p: 255 if p > THRESHOLD else 0)
    bounds = box.getbbox()
    return bounds[0], bounds[2]


def main(src_path):
    im = Image.open(src_path).convert("RGB")
    gray = im.convert("L")
    bands = content_bands(gray, im.height, im.width)
    if len(bands) < 2:
        sys.exit(f"Esperava monograma e nome em faixas separadas, achei {len(bands)}.")

    # A primeira faixa é o monograma; da segunda em diante é o nome.
    mono_top, mono_bottom = bands[0]
    word_top = bands[1][0]
    bottom = bands[-1][1]

    def crop(y0, y1, out_width):
        x0, x1 = horizontal_bounds(gray, im.width, y0, y1)
        piece = im.crop(
            (
                max(0, x0 - PAD),
                max(0, y0 - PAD),
                min(im.width, x1 + PAD),
                min(im.height, y1 + PAD),
            )
        )
        height = round(out_width * piece.height / piece.width)
        return piece.resize((out_width, height), Image.LANCZOS)

    full = crop(mono_top, bottom, 760)
    full.save(f"{DEST}/logo.png", optimize=True)

    word = crop(word_top, bottom, 620)
    word.save(f"{DEST}/logo-wordmark.png", optimize=True)

    og = Image.new("RGB", (1200, 630), (8, 9, 10))
    art = full.copy()
    art.thumbnail((1200, 470), Image.LANCZOS)
    og.paste(art, ((1200 - art.width) // 2, (630 - art.height) // 2))
    og.save(f"{DEST}/og-image.jpg", quality=88, optimize=True)

    # Favicon: só o monograma, num quadrado com respiro.
    x0, x1 = horizontal_bounds(gray, im.width, mono_top, mono_bottom)
    mono = im.crop((x0, mono_top, x1, mono_bottom))
    side = max(mono.width, mono.height)
    pad = round(side * 0.10)
    square = Image.new("RGB", (side + pad * 2, side + pad * 2), (0, 0, 0))
    square.paste(
        mono, (pad + (side - mono.width) // 2, pad + (side - mono.height) // 2)
    )
    for px in (180, 32):
        square.resize((px, px), Image.LANCZOS).save(
            f"{DEST}/favicon-{px}.png", optimize=True
        )

    for name in ("logo.png", "logo-wordmark.png", "og-image.jpg", "favicon-180.png"):
        size_kb = os.path.getsize(f"{DEST}/{name}") // 1024
        print(f"  {name:<20} {size_kb} KB")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])

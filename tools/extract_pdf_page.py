"""Extrae la imagen nativa de una página del PDF de diseño.
Uso: python tools/extract_pdf_page.py <n_pagina_desde_0> <salida.jpg>
Requiere: pip install pymupdf. (Cada página del PDF es UNA imagen aplanada de 937x1664.)"""
import sys, pymupdf
PDF = r"C:/Users/posad/Desktop/page/Diseño sin título_compressed.pdf"
n, out = int(sys.argv[1]), sys.argv[2]
d = pymupdf.open(PDF)
x = d.extract_image(d[n].get_images(full=True)[0][0])
open(out, "wb").write(x["image"]); print(n, x["width"], x["height"], "->", out)

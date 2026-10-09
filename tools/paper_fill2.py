"""Rellena rects de papel liso en imágenes AMPLIADAS/borrosas: color de fondo por difusión desde TODO el contorno (inpaint NS a 1/6 de resolución,
upsample suave) + ruido fino propio (sin copiar grano: en fuentes de baja resolución el grano copiado deja motas).
Uso: python tools/paper_fill2.py in.png out.png y0,y1,x0,x1[;y0,y1,x0,x1...] [más grupos...]   (el contorno debe ser papel; si toca bordes oscuros, achicar el rect)"""
import sys, cv2, numpy as np
im = cv2.imread(sys.argv[1]); H, W = im.shape[:2]
rng = np.random.default_rng(7)
for spec in sys.argv[3:]:
    R = [tuple(map(int, g.split(","))) for g in spec.split(";")]   # varios rects separados por ';' = una sola máscara (unión)
    y0, y1 = min(r[0] for r in R), max(r[1] for r in R); x0, x1 = min(r[2] for r in R), max(r[3] for r in R)
    P = 24; a, b, c, d = max(0, y0-P), min(H, y1+P), max(0, x0-P), min(W, x1+P)
    crop = im[a:b, c:d]; m = np.zeros(crop.shape[:2], np.uint8)
    for ry0, ry1, rx0, rx1 in R: m[ry0-a:ry1-a, rx0-c:rx1-c] = 255
    f = 6; sw, sh = max(8, crop.shape[1]//f), max(8, crop.shape[0]//f)
    small = cv2.resize(crop, (sw, sh), interpolation=cv2.INTER_AREA)
    ms = cv2.dilate(cv2.resize(m, (sw, sh), interpolation=cv2.INTER_NEAREST), np.ones((3, 3), np.uint8))
    fill = cv2.inpaint(small, ms, 7, cv2.INPAINT_NS)
    base = cv2.GaussianBlur(cv2.resize(fill, (crop.shape[1], crop.shape[0]), interpolation=cv2.INTER_CUBIC), (0, 0), 6).astype(np.float32)
    n = cv2.GaussianBlur(rng.normal(0, 1, crop.shape).astype(np.float32), (0, 0), 1.1) * 3.2
    fm = cv2.GaussianBlur((m > 0).astype(np.float32), (0, 0), 2.5)[..., None]
    fm = np.clip(fm * 1.15 - .08, 0, 1) * (m > 0)[..., None] + cv2.GaussianBlur((m > 0).astype(np.float32), (0, 0), 2.5)[..., None] * (m == 0)[..., None] * .5
    out = np.clip(base + n, 0, 255) * fm + crop.astype(np.float32) * (1 - fm)
    im[a:b, c:d] = out.astype(np.uint8)
cv2.imwrite(sys.argv[2], im)

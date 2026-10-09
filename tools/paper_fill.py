"""Rellena rects de papel liso (donde estaba texto y quedan halos) con: color interpolado entre una franja izquierda y otra derecha de cada fila
+ grano copiado de una franja limpia de papel. Sirve cuando el inpaint deja fantasmas (imágenes ampliadas, texto sobre papel liso).
Uso: python tools/paper_fill.py in.png out.png y0,y1,x0,x1,gy0,gy1 [más rects...]   (gy0..gy1 = filas de la franja de grano; opcional ,gx0,gx1 = sus columnas)"""
import sys, cv2, numpy as np
im = cv2.imread(sys.argv[1]).astype(np.float32)
rng = np.random.default_rng(5)
for spec in sys.argv[3:]:
    v = list(map(int, spec.split(",")))
    y0, y1, x0, x1, g0, g1 = v[:6]
    gx0, gx1 = (v[6], v[7]) if len(v) >= 8 else (x0 + 40, x1 - 40)   # columnas de la franja de grano (por defecto las interiores)
    L = cv2.GaussianBlur(np.median(im[y0:y1, x0-16:x0-4], axis=1, keepdims=True), (0, 0), 14)
    R = cv2.GaussianBlur(np.median(im[y0:y1, x1+4:x1+16], axis=1, keepdims=True), (0, 0), 14)
    t = np.linspace(0, 1, x1 - x0)[None, :, None]
    base = L * (1 - t) + R * t
    # grano: sólo de las columnas INTERIORES de la franja (los bordes traen muescas/rasgaduras que se repetirían), teselado en x e y con espejos
    inner = im[g0:g1, gx0:gx1]; res = inner - cv2.GaussianBlur(inner, (0, 0), 6)
    w = x1 - x0
    row = res
    while row.shape[1] < w:
        row = np.hstack([row, row[:, ::-1]])
    res = row[:, :w]
    rows = []
    while sum(r.shape[0] for r in rows) < y1 - y0:
        r = res[::-1] if rng.random() < .5 else res
        rows.append(r[:, ::-1] if rng.random() < .5 else r)
    grain = np.vstack(rows)[:y1 - y0]
    m = np.zeros((y1 - y0, x1 - x0), np.float32); m[2:-2, 2:-2] = 1; m = cv2.GaussianBlur(m, (0, 0), 1.2)[..., None]
    im[y0:y1, x0:x1] = np.clip(base + grain, 0, 255) * m + im[y0:y1, x0:x1] * (1 - m)
cv2.imwrite(sys.argv[2], im.astype(np.uint8))

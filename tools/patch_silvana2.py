"""Rellena el interior de la tarjeta del reproductor de /silvana-2 (coords PDF, imagen ya limpiada con clean_bg) con papel liso:
color interpolado entre los bordes izq/der de cada fila + grano copiado de una franja limpia de la propia tarjeta.
Uso: python tools/patch_silvana2.py clean.png out.png"""
import sys, cv2, numpy as np
im = cv2.imread(sys.argv[1]); y0, y1, x0, x1 = 962, 1208, 150, 818
f = im.astype(np.float32)
# 1) color de base: lerp horizontal entre una franja izquierda y otra derecha (suavizadas en vertical)
L = cv2.GaussianBlur(f[y0:y1, x0-14:x0-2].mean(1, keepdims=True), (0, 0), 12)
R = cv2.GaussianBlur(f[y0:y1, x1+2:x1+14].mean(1, keepdims=True), (0, 0), 12)
t = np.linspace(0, 1, x1 - x0)[None, :, None]
base = L * (1 - t) + R * t
# 2) grano: residuo (original - suavizado) de una franja limpia de la tarjeta, teselado
strip = f[922:952, x0:x1]; res = strip - cv2.GaussianBlur(strip, (0, 0), 6)
rng = np.random.default_rng(3); rows = []
while sum(r.shape[0] for r in rows) < y1 - y0:
    r = res[::-1] if rng.random() < .5 else res
    rows.append(r[:, ::-1] if rng.random() < .5 else r)
grain = np.vstack(rows)[:y1 - y0]
fill = np.clip(base + grain, 0, 255)
m = np.zeros((y1 - y0, x1 - x0), np.float32); m[6:-6, 6:-6] = 1; m = cv2.GaussianBlur(m, (0, 0), 3)[..., None]
f[y0:y1, x0:x1] = fill * m + f[y0:y1, x0:x1] * (1 - m)
cv2.imwrite(sys.argv[2], f.astype(np.uint8))

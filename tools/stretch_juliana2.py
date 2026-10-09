"""Alarga en vertical el fondo de /juliana-2 (clean.png, ya sin barra: clean.png ya sin barra: fila 86 = fila 0).
Uso: python tools/stretch_mon1.py clean.png out.webp [Ap=1.0]
Bandas (coords originales del PDF, y-96): cabecera 40-460 (+B1), video 520-905 (+B2), párrafo 905-985 (+B3). Collage inferior sin tocar."""
import sys, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src); H = im.shape[0]
y = np.arange(H, dtype=np.float64)
def sm(v): v = np.clip(v, 0, 1); return v*v*(3-2*v)
def band(a, b, f, r=40): return f * sm((y-a)/r) * (1 - sm((y-b)/r))
s = 1 + band(430, 590, 1.0) + band(844, 914, 1.0, 20) + band(1140, 1240, 1.0)
newy = np.concatenate([[0], np.cumsum(s)[:-1]])
NH = int(round(newy[-1] + s[-1]))
srcy = np.interp(np.arange(NH, dtype=np.float64), newy, y).astype(np.float32)
mx = np.tile(np.arange(im.shape[1], dtype=np.float32), (NH, 1)); my = np.tile(srcy[:, None], (1, im.shape[1]))
out = cv2.remap(im, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 90]); print(out.shape, "ratio", round(NH/im.shape[1], 3))
for yo in (60, 190, 250, 400, 430, 560, 604, 640, 700, 760, 800, 844, 914, 1000, 1140, 1240, 1300, 1500):
    print(f"  y_pdf {yo+96:5d} -> y_nuevo {np.interp(yo, y, newy):7.1f}")

"""Alarga en vertical el fondo de /silvana-4 (clean.png, ya sin barra: fila 77 = fila 0).
Uso: python tools/stretch_mon1.py clean.png out.webp [Ap=1.0]
Bandas (coords originales del PDF, y-96): cabecera 40-460 (+B1), video 520-905 (+B2), párrafo 905-985 (+B3). Collage inferior sin tocar."""
import sys, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src); H = im.shape[0]
y = np.arange(H, dtype=np.float64)
def sm(v): v = np.clip(v, 0, 1); return v*v*(3-2*v)
def band(a, b, f, r=40): return f * sm((y-a)/r) * (1 - sm((y-b)/r))
s = 1 + band(4, 864, .12) + band(868, 923, 1.2, 14) + band(923, 1203, .1) + band(1338, 1468, 1.0)
newy = np.concatenate([[0], np.cumsum(s)[:-1]])
NH = int(round(newy[-1] + s[-1]))
srcy = np.interp(np.arange(NH, dtype=np.float64), newy, y).astype(np.float32)
mx = np.tile(np.arange(im.shape[1], dtype=np.float32), (NH, 1)); my = np.tile(srcy[:, None], (1, im.shape[1]))
out = cv2.remap(im, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 90]); print(out.shape, "ratio", round(NH/im.shape[1], 3))
for yo in (70, 71, 160, 340, 380, 548, 600, 640, 658, 760, 800, 868, 923, 1000, 1205, 1265, 1280, 1326, 1338, 1468, 1520):
    print(f"  y_pdf {yo+96:5d} -> y_nuevo {np.interp(yo, y, newy):7.1f}")

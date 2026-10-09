"""Alarga en vertical el fondo de /juliana-3 (j3_clean.png = PDF 938×1668 ya limpio; se quitan las 88 filas de la barra).
Uso: python tools/stretch_juliana3.py clean.png out.webp
Bandas (y recortada = y_pdf-88), sólo papel/bordes rasgados: sobre la luna/estrella/miniaturas NO se estira.
Imprime el mapa y_pdf -> y_nuevo."""
import sys, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src)[88:]; H = im.shape[0]
y = np.arange(H, dtype=np.float64)
def sm(v): v = np.clip(v, 0, 1); return v*v*(3-2*v)
def band(a, b, f, r=16): return f * sm((y-a)/r) * (1 - sm((y-b)/r))
s = (1 + band(46, 90, 2.0) + band(306, 535, .42, 30) + band(545, 566, 1.0) + band(810, 822, .8, 10)
       + band(1052, 1062, .8, 10) + band(1300, 1318, .9, 10))
newy = np.concatenate([[0], np.cumsum(s)[:-1]])
NH = int(round(newy[-1] + s[-1]))
srcy = np.interp(np.arange(NH, dtype=np.float64), newy, y).astype(np.float32)
mx = np.tile(np.arange(im.shape[1], dtype=np.float32), (NH, 1)); my = np.tile(srcy[:, None], (1, im.shape[1]))
out = cv2.remap(im, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 90]); print(out.shape, "ratio", round(NH/im.shape[1], 3))
for yp in (130, 145, 190, 330, 480, 536, 560, 668, 700, 757, 780, 860, 890, 960, 1002, 1100, 1150, 1180, 1262, 1300, 1340, 1380, 1440, 1560):
    print(f"  y_pdf {yp:5d} -> y_nuevo {np.interp(yp-88, y, newy):7.1f}")

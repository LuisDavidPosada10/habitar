"""ACORTA en vertical el fondo de /juliana-4 (j4_fill.png = PDF 159×425 ampliado ×5.92 a 942×2518, ya sin texto ni rectángulo gris).
Se quitan las 80 filas de la barra; las bandas con s<1 comprimen SÓLO papel liso (cabecera, hueco del video; más suave donde hay flores).
Uso: python tools/stretch_juliana4.py fill.png out.webp   (imprime el mapa y_recortada -> y_nueva; y_recortada = y_ampliada - 80)"""
import sys, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src)[80:]; H = im.shape[0]
y = np.arange(H, dtype=np.float64)
def sm(v): v = np.clip(v, 0, 1); return v*v*(3-2*v)
def band(a, b, f, r=40): return f * sm((y-a)/r) * (1 - sm((y-b)/r))
s = 1 - band(100, 190, .55, 30) - band(655, 1160, .66, 45) - band(1160, 1590, .3, 45)
newy = np.concatenate([[0], np.cumsum(s)[:-1]])
NH = int(round(newy[-1] + s[-1]))
srcy = np.interp(np.arange(NH, dtype=np.float64), newy, y).astype(np.float32)
mx = np.tile(np.arange(im.shape[1], dtype=np.float32), (NH, 1)); my = np.tile(srcy[:, None], (1, im.shape[1]))
out = cv2.remap(im, mx, my, cv2.INTER_AREA if False else cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 90]); print(out.shape, "ratio", round(NH/im.shape[1], 3))
for yc in (83, 160, 238, 276, 318, 348, 459, 476, 575, 604, 635, 700, 900, 1100, 1160, 1300, 1500, 1590, 1645, 1669, 1719, 1772, 1825, 1899, 1934, 2100, 2400):
    print(f"  y_rec {yc:5d} -> y_nueva {np.interp(yc, y, newy):7.1f}")

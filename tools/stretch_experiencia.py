"""Alarga en vertical el fondo de /experiencia (j5_fill.png = PDF índice 18, 899×1600, ya sin textos/botón). Quita las 82 filas de la barra.
Sólo se estira el papel liso entre la tarjeta del textarea y el collage inferior (donde va el botón): el resto es collage denso y se resuelve recortando un poco los lados ("cubrir alto").
Uso: python tools/stretch_experiencia.py fill.png out.webp   (imprime el mapa y_pdf -> y_nueva)"""
import sys, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src)[82:]; H = im.shape[0]
y = np.arange(H, dtype=np.float64)
def sm(v): v = np.clip(v, 0, 1); return v*v*(3-2*v)
def band(a, b, f, r=20): return f * sm((y-a)/r) * (1 - sm((y-b)/r))
s = 1 + band(990-82, 1115-82, .95, 25)
newy = np.concatenate([[0], np.cumsum(s)[:-1]])
NH = int(round(newy[-1] + s[-1]))
srcy = np.interp(np.arange(NH, dtype=np.float64), newy, y).astype(np.float32)
mx = np.tile(np.arange(im.shape[1], dtype=np.float32), (NH, 1)); my = np.tile(srcy[:, None], (1, im.shape[1]))
out = cv2.remap(im, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 90]); print(out.shape, "ratio", round(NH/im.shape[1], 3))
for yp in (196, 232, 267, 331, 440, 544, 575, 650, 682, 762, 800, 935, 970, 990, 1050, 1100, 1130, 1160, 1250, 1400, 1600):
    print(f"  y_pdf {yp:5d} -> y_nueva {np.interp(yp-82, y, newy):7.1f}")

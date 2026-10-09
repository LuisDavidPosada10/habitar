"""Alarga verticalmente (sólo en Y) la mitad inferior del fondo de /universos con un factor suave.
Uso: python tools/stretch_universos.py clean.png out.webp [Ab=1.88] [At=1.64]
Coordenadas = imagen ya limpiada (clean_bg + top_extend 40 => y_orig+40).
Banda inferior: s=1 hasta Y0, sube suave a Ab en Y1 y sigue hasta el final. Banda superior (papel bajo el título, baja los arcos): s sube a At entre 100-150, baja a 1 entre 320-370. Imprime el mapa y_orig->y_nuevo."""
import sys, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]
A = float(sys.argv[3]) if len(sys.argv) > 3 else 1.88
AT = float(sys.argv[4]) if len(sys.argv) > 4 else 1.64
Y0, Y1 = 990, 1090
im = cv2.imread(src); H = im.shape[0]
y = np.arange(H, dtype=np.float64)
t = np.clip((y - Y0) / (Y1 - Y0), 0, 1); t = t * t * (3 - 2 * t)
def sm(v): v = np.clip(v, 0, 1); return v * v * (3 - 2 * v)
top = sm((y - 100) / 50) * (1 - sm((y - 320) / 50))
s = 1 + (A - 1) * t + (AT - 1) * top
newy = np.concatenate([[0], np.cumsum(s)[:-1]])       # posición nueva de cada fila original
NH = int(round(newy[-1] + s[-1]))
ys = np.arange(NH, dtype=np.float64)
srcy = np.interp(ys, newy, y).astype(np.float32)       # fila original para cada fila nueva
mapx = np.tile(np.arange(im.shape[1], dtype=np.float32), (NH, 1))
mapy = np.tile(srcy[:, None], (1, im.shape[1]))
out = cv2.remap(im, mapx, mapy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 90]); print(out.shape, "ratio", round(NH / im.shape[1], 3))
for yo in (40, 145, 215, 330, 385, 460, 508, 560, 995, 1013, 1078, 1119, 1195, 1272, 1312, 1345, 1360, 1400, 1450, 1576):
    print(f"  y_clean {yo:5d} -> {np.interp(yo, y, newy):7.1f}")

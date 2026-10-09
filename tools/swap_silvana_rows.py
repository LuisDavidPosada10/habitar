"""Intercambia las miniaturas de las filas 02 y 03 del hub de Silvana (coords PDF, imagen limpia ANTES de recortar la barra).
Uso: python tools/swap_silvana_rows.py clean.png out.png
Cada miniatura nueva se recorta "cover" al tamaño del hueco y se pega SÓLO dentro de la silueta (borde rasgado) del hueco destino."""
import sys, cv2, numpy as np
im = cv2.imread(sys.argv[1]); out = im.copy()
paper = np.median(im[1095:1115, 300:460].reshape(-1, 3), 0)
d = np.abs(im.astype(int) - paper).sum(2)
A = (466, 1120, 340, 90)      # fila 02 (agua): x, y, w, h
B = (472, 1260, 332, 107)     # fila 03 (rostro con arete)
def silhouette(x, y, w, h):
    m = (d[y-3:y+h+3, x-3:x+w+3] > 60).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    f = np.zeros_like(m); cv2.drawContours(f, [max(cs, key=cv2.contourArea)], -1, 1, -1)
    return cv2.dilate(f, np.ones((3, 3), np.uint8)) > 0
def cover(src, w, h):
    sh, sw = src.shape[:2]; r = max(w / sw, h / sh)
    big = cv2.resize(src, (int(np.ceil(sw * r)), int(np.ceil(sh * r))), interpolation=cv2.INTER_CUBIC)
    y0 = (big.shape[0] - h) // 2; x0 = (big.shape[1] - w) // 2
    return big[y0:y0+h, x0:x0+w]
def thumb(b): x, y, w, h = b; return im[y:y+h, x:x+w]
for dst, src in ((A, B), (B, A)):
    x, y, w, h = dst
    sil = silhouette(*dst)[3:3+h, 3:3+w]            # silueta dentro del bbox
    new = cover(thumb(src), w, h)
    reg = out[y:y+h, x:x+w]; reg[sil] = new[sil]
cv2.imwrite(sys.argv[2], out)

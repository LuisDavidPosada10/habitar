"""Borra el título "DOS Y VEINTIDÓS" dibujado en public/juliana/bg.webp (cruza el borde rasgado de la foto, por eso no sirve un rect).
Relleno SÓLO sobre papel: polígono que sigue el borde del papel (x_e(y) medido a mano, menos 3 px); color por fila = mediana de la franja de papel x 64–72 (justo a la izquierda del texto)
(suavizada en vertical) + grano de una franja limpia de papel. Lo que quede de tinta sobre la foto oscura no se ve (oscuro sobre oscuro).
Uso: python tools/juliana_clear_title.py in.webp out.webp"""
import sys, cv2, numpy as np
im = cv2.imread(sys.argv[1]).astype(np.float32); H, W = im.shape[:2]
edge = [(228, 500), (280, 523), (297, 537), (330, 547), (363, 545), (380, 537), (397, 527), (413, 522), (432, 518)]   # (y, x del borde del papel)
poly = [(71, 230), (366, 230), (366, 296)] + [(x - 3, y) for y, x in edge if y >= 296] + [(71, 410)]
m = np.zeros((H, W), np.float32); cv2.fillPoly(m, [np.array(poly, np.int32)], 1.0)
y0, y1 = 220, 440
left = np.median(im[y0:y1, 64:72], axis=1, keepdims=True)                 # (n,1,3) color de papel por fila
left = cv2.GaussianBlur(left, (0, 0), 7)
base = np.repeat(left, W, axis=1)
inner = im[418:458, 100:420]; res = inner - cv2.GaussianBlur(inner, (0, 0), 6)
tile = np.tile(np.hstack([res, res[:, ::-1]]), (1, 3, 1))[:, :W]
grain = np.tile(np.vstack([tile, tile[::-1]]), ((y1 - y0) // 80 + 2, 1, 1))[: y1 - y0]
fill = np.zeros_like(im); fill[y0:y1] = base + grain
mm = cv2.GaussianBlur(m, (0, 0), 1.3)[..., None]
out = fill * mm + im * (1 - mm)
cv2.imwrite(sys.argv[2], out.clip(0, 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 92])

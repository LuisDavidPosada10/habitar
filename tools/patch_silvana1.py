"""Tapa el hueco del "01" (rect [232,387,134,316]) con un parche de papel liso copiado de la derecha (x 318–436), espejado y con bordes suaves.
Uso: python tools/patch_silvana1.py clean.png out.png"""
import sys, cv2, numpy as np
im = cv2.imread(sys.argv[1]); y0, y1, x0, x1 = 232, 397, 134, 316
src = im[y0:y1, 318:436][:, ::-1].astype(np.float32)
src = cv2.resize(src, (x1 - x0, y1 - y0))
dst = im[y0:y1, x0:x1].astype(np.float32)
# tono: igualar con el borde del hueco (franja de 6 px alrededor)
ring = np.concatenate([im[y0-8:y0-2, x0+10:x1-10].reshape(-1, 3), im[y0+20:y1-20, x1+2:x1+12].reshape(-1, 3)])   # sólo arriba y derecha (sin la regla de abajo; la regla corta bajo el 01 se redibuja en HTML)
src += ring.mean(0) - src.mean((0, 1))
m = np.zeros((y1 - y0, x1 - x0), np.float32); m[3:-1, 3:-3] = 1; m = cv2.GaussianBlur(m, (0, 0), 2)[..., None]
im[y0:y1, x0:x1] = (src * m + dst * (1 - m)).astype(np.uint8)
cv2.imwrite(sys.argv[2], im)

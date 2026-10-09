"""Borra el ícono de la mano y "TOCA Y DESCUBRE" sobre el agua (píxeles claros dentro del rect, inpaint Telea).
Uso: python tools/clean_silvana3_hint.py in.png out.png   (coords PDF índice 11)"""
import sys, cv2, numpy as np
im = cv2.imread(sys.argv[1]); g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
y0, y1, x0, x1 = 928, 1062, 372, 576
m = np.zeros_like(g); sub = g[y0:y1, x0:x1]
m[y0:y1, x0:x1] = (sub > 125).astype(np.uint8)
m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
cv2.imwrite(sys.argv[2], cv2.inpaint(im, m * 255, 5, cv2.INPAINT_TELEA))

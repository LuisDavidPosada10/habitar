"""Pega las 3 fotos de /juliana-3 (tools/assets/juliana3/primera|segunda|tercera.png) dentro de las miniaturas del fondo (public/juliana3/bg.webp v1,
guardado antes como scratch/juliana3_bg_v1_old.webp): warp de perspectiva a cada cuadrilátero medido (con la inclinación de cada miniatura), recorte "cubrir"
con desplazamiento vertical elegido para que se vea el rostro, y borde suave de 1 px. El botón play es HTML (el del fondo viejo queda tapado).
Uso: python tools/replace_juliana3_photos.py bg_viejo.webp out.webp"""
import sys, cv2, numpy as np
src, dst = sys.argv[1], sys.argv[2]
bg = cv2.imread(src).astype(np.float32)
# cuadriláteros TL,TR,BR,BL (coords del fondo 938×1819) + desplazamiento vertical del recorte (0 = arriba, 1 = abajo)
Q = [
  ("primera", [[170,802],[576,783],[587,1002],[180,1021]], 0.08),
  ("segunda", [[202,1048],[605,1048],[605,1262],[202,1262]], 0.0),
  ("tercera", [[212,1307],[619,1292],[627,1516],[221,1532]], 0.25),
]
for name, quad, off in Q:
    q = np.array(quad, np.float32)
    c = q.mean(0); q = c + (q - c) * 1.006 + np.sign(q - c) * 1.0           # cubre 1 px de borde viejo
    w = int(round((np.linalg.norm(q[1]-q[0]) + np.linalg.norm(q[2]-q[3])) / 2)); h = int(round((np.linalg.norm(q[3]-q[0]) + np.linalg.norm(q[2]-q[1])) / 2))
    im = cv2.imread(f"tools/assets/juliana3/{name}.png")
    ih, iw = im.shape[:2]; ar = w / h
    cw, ch = (iw, int(round(iw / ar))) if iw / ih < ar else (int(round(ih * ar)), ih)
    x0 = (iw - cw) // 2; y0 = int(round((ih - ch) * off))
    crop = cv2.resize(im[y0:y0+ch, x0:x0+cw], (w, h), interpolation=cv2.INTER_AREA)
    M = cv2.getPerspectiveTransform(np.array([[0,0],[w,0],[w,h],[0,h]], np.float32), q)
    warp = cv2.warpPerspective(crop.astype(np.float32), M, (bg.shape[1], bg.shape[0]), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    m = np.zeros(bg.shape[:2], np.float32); cv2.fillConvexPoly(m, q.round().astype(np.int32), 1.0)
    m = cv2.GaussianBlur(m, (0, 0), .7)[..., None]
    bg = warp * m + bg * (1 - m)
    print(name, "quad", w, "x", h, "crop", cw, "x", ch, "de", iw, "x", ih)
cv2.imwrite(dst, bg.clip(0, 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 92])

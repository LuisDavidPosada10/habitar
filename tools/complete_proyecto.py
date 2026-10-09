"""Completa a mano lo que el diseño deja cortado en public/proyecto/bg.webp (arriba: flor + cinta; abajo: flor roja).
Uso: python tools/complete_proyecto.py <bg_base.webp> <bg_salida.webp>
(<bg_base> = salida de clean_bg.py con tools/proyecto.json; este script NO es idempotente sobre su propia salida.)
Técnica: cinta fotográfica = traslación a lo largo de su eje (los huecos son periódicos); flor oscura = espejo corto
sobre el corte (es casi simétrica); flor roja de abajo = flor completa recortada de la página de inicio y reteñida.
Coordenadas en el lienzo final (808 de ancho, TOP=112 filas de papel arriba)."""
import os, sys, numpy as np, cv2

src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src).astype(np.float32)
H, W = im.shape[:2]
TOP = 112
BOT = 124                                         # filas de papel añadidas abajo (= bottom_extend)
CUT = H - BOT                                     # y del corte inferior original


def feather(mask, px):
    return cv2.GaussianBlur(mask.astype(np.float32), (0, 0), px)


def paste(base, patch, alpha):
    a = alpha[..., None]
    return base * (1 - a) + patch * a


# ---------- ARRIBA ----------
out = im.copy()
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

# Uniones sin salto: rampa vertical de 1 (arriba) a 0 (dentro de la imagen original).
# Las primeras ~8 filas de la captura original son defectuosas (franja clara): la copia limpia las cubre del todo (rampa=1 hasta TOP+8).
ramp = np.clip((TOP + 24 - yy) / 16.0, 0, 1)

# 1) flor oscura y papel con escritura (x 430..640): espejo corto (M filas) respecto a T0.
#    M<24 para no reflejar el centro de la flor (a y=142) y que no se duplique.
#    LIMITACIÓN CONOCIDA: los pétalos superiores siguen terminando en un borde plano a y≈T0-M. Se probó (y falló):
#    rotación 180° de la mitad inferior, inpaint Telea de radio grande (mancha borrosa) y reflejo vertical completo.
T0, M = TOP + 8, 22
a = np.zeros((H, W), np.float32)
a[T0 - M:T0, 430:640] = 1
a = feather(a, 2.5); a[:T0 - M - 1] = 0
canvas = out.copy(); canvas[T0 - M:T0] = im[T0:T0 + M][::-1]
out = paste(out, canvas, a * ramp)

# 2) cinta fotográfica: copiar a la derecha de la línea L desplazada n periodos
d = np.array([14.0, 39.5])                         # periodo (dx, dy) de los huecos
n = 3
shift = -n * d
L0 = 627.0                                         # x del borde izquierdo de la cinta en y=TOP
Lx = L0 + d[0] / d[1] * (yy - TOP)                 # línea paralela al eje de la cinta
win = (xx >= Lx) & (yy >= TOP) & (yy < TOP + 135)
M2 = np.float32([[1, 0, shift[0]], [0, 1, shift[1]]])
moved = cv2.warpAffine(im, M2, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
movedmask = cv2.warpAffine(win.astype(np.float32), M2, (W, H), flags=cv2.INTER_LINEAR)
movedmask = feather(movedmask, 2.5)
out = paste(out, moved, movedmask * ramp)

# 3) franja derecha sin cubrir por el desplazamiento (x > W+shift): replicar el borde
miss = np.zeros((H, W), np.uint8); miss[:TOP, int(W + shift[0]) - 2:] = 1
out = np.where(miss[..., None] == 1, cv2.inpaint(np.clip(out, 0, 255).astype(np.uint8), miss * 255, 9, cv2.INPAINT_TELEA).astype(np.float32), out)

# ---------- ABAJO: flor roja ----------
# pétalo viejo cortado a la derecha del ramo (x 100..190, justo sobre el corte): se borra con inpaint antes de poner la lily
_u8 = np.clip(out, 0, 255).astype(np.uint8)
_hsv = cv2.cvtColor(_u8, cv2.COLOR_BGR2HSV)
_red = (((_hsv[..., 0] < 8) | (_hsv[..., 0] > 168)) & (_hsv[..., 1] > 90) & (_hsv[..., 2] > 25)).astype(np.uint8)
_box = np.zeros_like(_red); _box[CUT - 48:CUT + 1, 114:192] = 1   # x>=114: respeta el punto de la línea de tiempo (x≈103)
_m = cv2.dilate(_red * _box, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
out = cv2.inpaint(_u8, _m * 255, 6, cv2.INPAINT_TELEA).astype(np.float32)
# esquina inferior izquierda de la miniatura (x 141..179): textura espejada de la parte contigua de la propia miniatura
_y0, _y1 = CUT - 40, CUT
_src = out[_y0:_y1, 180:218][:, ::-1]
_a = np.zeros((H, W), np.float32); _a[_y0:_y1, 141:179] = 1; _a = feather(_a, 3)[..., None]
_c = out.copy(); _c[_y0:_y1, 141:179] = _src
out = out * (1 - _a) + _c * _a

# lily completa (recortada de la página de inicio) puesta sobre el corte, reteñida con los estadísticos LAB de la flor existente.
lily = cv2.imread(os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "lily.png"), cv2.IMREAD_UNCHANGED)
SC, LX, LY = 0.76, -16, CUT - 56                # escala, esquina sup-izq (la flor se sale por el borde izquierdo)
lil = cv2.resize(lily, None, fx=SC, fy=SC, interpolation=cv2.INTER_AREA)
lh, lw = lil.shape[:2]
la = lil[..., 3].astype(np.float32) / 255
lrgb = lil[..., :3].astype(np.float32)
cur = np.clip(out, 0, 255).astype(np.uint8)
hsv = cv2.cvtColor(cur, cv2.COLOR_BGR2HSV)
ref = ((hsv[..., 0] < 8) | (hsv[..., 0] > 168)) & (hsv[..., 1] > 110) & (hsv[..., 2] > 25)
ref[:CUT - 110] = False; ref[:, 200:] = False; ref[CUT:] = False
lab = lambda x: cv2.cvtColor(x.astype(np.uint8)[None], cv2.COLOR_BGR2LAB).astype(np.float32)[0]
tl = lab(cur[ref]); sl = lab(lrgb[la > .5].astype(np.uint8))
mt, st = tl.mean(0), tl.std(0) + 1e-3; ms, ss = sl.mean(0), sl.std(0) + 1e-3
allp = cv2.cvtColor(np.clip(lrgb, 0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
allp = (allp - ms) / ss * st + mt
lrgb = cv2.cvtColor(np.clip(allp, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
x0, y0 = max(LX, 0), LY
sx = x0 - LX
fl = np.zeros((H, W, 3), np.float32); fa = np.zeros((H, W), np.float32)
fl[y0:y0 + lh, x0:x0 + lw - sx] = lrgb[:, sx:]; fa[y0:y0 + lh, x0:x0 + lw - sx] = la[:, sx:]
shadow = cv2.GaussianBlur(np.roll(np.roll(fa, 4, 0), 3, 1), (0, 0), 5) * .35
out = out * (1 - shadow[..., None])
out = paste(out, fl, fa)

cv2.imwrite(dst, np.clip(out, 0, 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 92])
print("ok", dst)

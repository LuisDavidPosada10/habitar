"""Borra el texto del diseño (inpainting) para obtener el fondo sin texto.
Uso: python tools/clean_bg.py entrada.jpg salida.webp config.json
config.json: {"crop":[x0,x1], "top_extend":N, "rects":[[y0,y1,x0,x1],...]}
  crop        columnas útiles (fuera hay marco negro del mockup). Inicio: [26,908]; Proyecto: [22,830]
  top_extend  px a añadir arriba (por si el texto queda pegado al borde / para colocar el navbar sobre papel).
              Con "top_fill":[y0,x0,x1] se rellena con un parche de papel limpio (ya inpaintado) de esa zona,
              espejado en horizontal, con el tono igualado al borde; si no, se refleja el borde.
  bottom_extend px a añadir abajo con papel limpio: "bottom_fill":[y0,x0,x1] (igual que top_fill)
  full_rects  zonas que se borran enteras (sin filtrar por tinta; papel liso)
  rects       zonas (coords de la imagen ORIGINAL) donde hay texto/botones sobre papel liso
Máscara = píxeles "tinta" (oscuros o rojos) dentro de las zonas, dilatada, + inpaint Telea.
Sólo funciona bien sobre papel liso; sobre collage deja manchas.
Requiere: opencv-python-headless numpy."""
import sys, json, numpy as np, cv2
src, dst, cfg = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3]))
im = cv2.imread(src); g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
b, gg, r = [im[:, :, i].astype(int) for i in range(3)]
ink = (g < 165) | ((r > 150) & (gg < 110) & (b < 110))
m = np.zeros(g.shape, np.uint8)
for y0, y1, x0, x1 in cfg["rects"]:
    sub = np.zeros_like(m); sub[y0:y1, x0:x1] = 1
    m |= (ink & (sub == 1)).astype(np.uint8)
for y0, y1, x0, x1 in cfg.get("full_rects", []): m[y0:y1, x0:x1] = 1   # borra TODO el rect (papel liso)
m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
out = cv2.inpaint(im, m * 255, 6, cv2.INPAINT_TELEA); inp = out
x0, x1 = cfg["crop"]; out = out[:, x0:x1]
N = cfg.get("top_extend", 0)
if N and cfg.get("top_fill"):
    y0, px0, px1 = cfg["top_fill"]
    patch = inp[y0:y0 + N, px0:px1].astype(np.float32)
    tile = np.hstack([patch, patch[:, ::-1]])
    tile = np.hstack([tile] * (out.shape[1] // tile.shape[1] + 1))[:, :out.shape[1]]
    off = out[0:6, px0 - x0:px1 - x0].reshape(-1, 3).mean(0) - patch[-6:].reshape(-1, 3).mean(0)
    tile = np.clip(tile + off, 0, 255)
    # igualar el tono con el borde de la imagen columna a columna (sólo donde hay papel: x<px1), con peso creciente hacia abajo
    d = out[0:3, px0 - x0:px1 - x0].astype(np.float32).mean(0) - tile[-3:, px0:px1].mean(0)
    d = cv2.GaussianBlur(d[None], (0, 0), 25)[0]
    d = np.clip(d, -20, 20)
    d = np.vstack([np.repeat(d[:1], px0, 0), d, np.repeat(d[-1:], tile.shape[1] - px1, 0)])
    w = (np.linspace(0, 1, N) ** 1.5)[:, None, None]
    tile = np.clip(tile + w * d[None], 0, 255)
    out = np.vstack([tile.astype(np.uint8), out])
elif N:
    out = cv2.copyMakeBorder(out, N, 0, 0, 0, cv2.BORDER_REFLECT)
B = cfg.get("bottom_extend", 0)
if B:
    y0, px0, px1 = cfg["bottom_fill"]
    avail = min(B, inp.shape[0] - y0)
    patch = inp[y0:y0 + avail, px0:px1]
    if avail < B: patch = cv2.copyMakeBorder(patch, 0, B - avail, 0, 0, cv2.BORDER_REFLECT_101)
    patch = patch.astype(np.float32)
    tile = np.hstack([patch, patch[:, ::-1]])
    tile = np.hstack([tile] * (out.shape[1] // tile.shape[1] + 1))[:, :out.shape[1]]
    d = out[-3:, px0 - x0:px1 - x0].astype(np.float32).mean(0) - tile[:3, px0:px1].mean(0)
    d = np.clip(cv2.GaussianBlur(d[None], (0, 0), 25)[0], -20, 20)
    d = np.vstack([np.repeat(d[:1], px0, 0), d, np.repeat(d[-1:], tile.shape[1] - px1, 0)])
    w = (np.linspace(1, 0, B) ** 1.5)[:, None, None]
    tile = np.clip(tile + w * d[None], 0, 255)
    out = np.vstack([out, tile.astype(np.uint8)])
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 90]); print(out.shape, "->", dst)

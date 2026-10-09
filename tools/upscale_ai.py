"""Super-resolución LOCAL con Real-ESRGAN (realesr-general-x4v3, ONNX) vía onnxruntime en CPU. La imagen NO sale del equipo.
Sólo con autorización explícita del usuario (ver CLAUDE.md). El modelo NO se guarda en el proyecto: se baja a una carpeta temporal y se BORRA al terminar.
  curl -L -o m.onnx https://huggingface.co/jonathanst29/tinier-upscale-models/resolve/main/realesr-general-x4v3.onnx   (4.8 MB, BSD-3)
Uso: python tools/upscale_ai.py m.onnx in.jpg out.png [ancho_final]   (x4 y luego Lanczos al ancho final; 159×425 → 636×1700 en 0.5 s)"""
import sys, cv2, numpy as np, onnxruntime as ort
m, src, dst = sys.argv[1:4]; im = cv2.imread(src); h, w = im.shape[:2]
s = ort.InferenceSession(m, providers=["CPUExecutionProvider"]); n = s.get_inputs()[0].name
x = (cv2.cvtColor(im, cv2.COLOR_BGR2RGB).astype(np.float32) / 255).transpose(2, 0, 1)[None]
y = np.clip(s.run(None, {n: x})[0][0].transpose(1, 2, 0), 0, 1)
y = cv2.cvtColor((y * 255).round().astype(np.uint8), cv2.COLOR_RGB2BGR)
if len(sys.argv) > 4:
    W = int(sys.argv[4]); y = cv2.resize(y, (W, round(h * W / w)), interpolation=cv2.INTER_LANCZOS4)
cv2.imwrite(dst, y); print(y.shape)

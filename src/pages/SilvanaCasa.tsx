import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /silvana-1 · Casa. Lienzo = public/silvana1/bg.webp (942×1913, sin texto ni reproductor).
 * Origen: PDF índice 9 (942×1670); filas 81–1670 (la barra verde es la real del Shell), estirado sólo en papel
 * (tools/silvana1.json + tools/patch_silvana1.py + tools/stretch_silvana1.py). Coordenadas: x = x del PDF; y = y NUEVA.
 * Fotos, hojas, flores, la línea del contador y la regla bajo el subtítulo/párrafo quedan en la imagen.
 * El rectángulo gris del diseño es el video: iframe de YouTube que arranca solo, en silencio (autoplay mudo).
 */
const W = 942, H = 1913
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1c231b"
const YT = "jam_WxXiLEQ" // Silvana Estrada – Casa (Live on KEXP)
const VID = { x: 150, y: 726, w: 670, h: 457 }

export default function SilvanaCasa() {
  return (
    <Shell theme="silvana">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ead2b6" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/942)] [--w:max(min(100vw,480px),calc((100dvh-44px)*942/1913))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/silvana1/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/silvana" label="Volver a Silvana" cx={95} cy={84} color="#1c231b" />
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(142), top: k(66), fontSize: k(23), lineHeight: k(30), letterSpacing: ".15em", fontWeight: 400 }}>
            MARCHITA &nbsp;/&nbsp; 01
          </p>
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(783), top: k(58), fontSize: k(21.5), lineHeight: k(30), letterSpacing: ".2em", fontWeight: 400 }}>
            01 / 04
          </p>

          <p className="f-bodoni absolute whitespace-nowrap [--tx:.72]" style={{ left: k(143), top: k(174), fontSize: k(190), lineHeight: k(190), fontStyle: "italic", fontWeight: 700, color: "#c8b995", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            01
          </p>
          <svg className="absolute" style={{ left: k(144), top: k(362), width: k(130), height: k(6) }} viewBox="0 0 130 6" fill={ink} aria-hidden>
            <path d="M1 3.4L129 2.2 129 3.6 1 4.4z" />
          </svg>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.76]" style={{ left: k(138), top: k(388), fontSize: k(118), lineHeight: k(100), fontStyle: "italic", fontWeight: 700, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            CASA
          </h1>
          <p className="absolute whitespace-nowrap" style={{ left: k(148), top: k(510), fontFamily: "'Libre Caslon Text', serif", fontSize: k(42.4), lineHeight: k(48), color: ink }}>
            ¿De dónde viene<br />una voz?
          </p>

          {/* video: autoplay mudo (los navegadores sólo permiten autoplay sin sonido) */}
          <div className="absolute overflow-hidden" style={{ left: k(VID.x), top: k(VID.y), width: k(VID.w), height: k(VID.h), background: "#000" }}>
            <iframe
              title="Casa · Silvana Estrada (Live on KEXP)"
              src={`https://www.youtube.com/embed/${YT}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </div>

          <p className="absolute whitespace-nowrap" style={{ left: k(561), top: k(1392), fontFamily: "'Libre Caslon Text', serif", fontSize: k(23.9), lineHeight: k(34), color: "#2b2a22" }}>
            Un viaje al origen.<br />A los lugares, personas<br />y sonidos que sembraron<br />mi voz.
          </p>
        </div>
      </div>
    </Shell>
  )
}

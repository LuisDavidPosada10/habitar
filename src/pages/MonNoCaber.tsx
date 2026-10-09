import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /mon-1 · No caber. Lienzo = public/mon1/bg.webp (941×1923, sin texto).
 * Origen: PDF índice 4 (941×1672), filas 96–1672 (la barra roja es la real del Shell), estirado en vertical
 * sólo en papel (tools/mon1.json + tools/stretch_mon1.py: cabecera +.27, video +.24, párrafo +1.6).
 * Coordenadas: x = x del PDF; y = y NUEVA (mapa impreso por stretch_mon1.py).
 */
const W = 941, H = 1923
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1d1611"
const VID = { x: 93, y: 641, w: 757, h: 472 }
const YT = "7nXBiCEYZu0"

export default function MonNoCaber() {
  return (
    <Shell theme="mon">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#e7cfb8" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/941)] [--w:max(min(100vw,480px),calc((100dvh-44px)*941/1923))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/mon1/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/mon" label="Volver a Autopoética" cx={95} cy={47} />
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(131), top: k(32), fontSize: k(22), lineHeight: k(30), letterSpacing: ".085em", fontWeight: 400 }}>
            AUTOPOÉTICA &nbsp; / &nbsp; 01
          </p>

          <p className="f-bodoni absolute whitespace-nowrap [--tx:.72]" style={{ left: k(114), top: k(118), fontSize: k(46), lineHeight: k(56), fontWeight: 400, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>01</p>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.583]" style={{ left: k(113), top: k(188), fontSize: k(156), lineHeight: k(190), fontWeight: 700, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            NO CABER
          </h1>
          <p className="absolute whitespace-nowrap" style={{ left: k(118), top: k(437), fontFamily: "'Libre Caslon Text', serif", fontSize: k(42.6), lineHeight: k(47), color: "#1d1611" }}>
            ¿Por qué tendría que<br />ser una sola cosa?
          </p>

          {/* video: YouTube (autoplay en silencio: los navegadores bloquean el autoplay con sonido) */}
          <div className="absolute overflow-hidden" style={{ left: k(VID.x), top: k(VID.y), width: k(VID.w), height: k(VID.h), background: "#231f1e" }}>
            <iframe
              title="No caber · Mon Laferte"
              src={`https://www.youtube.com/embed/${YT}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </div>

          <p className="absolute whitespace-nowrap" style={{ left: k(112), top: k(1148), fontFamily: "'Libre Caslon Text', serif", fontSize: k(26.3), lineHeight: k(36), color: "#1d1611" }}>
            En este escenario exploramos cómo Mon Laferte<br />ha desafiado etiquetas y ha construido su identidad<br />desde la contradicción, abrazando todas sus versiones.
          </p>
        </div>
      </div>
    </Shell>
  )
}

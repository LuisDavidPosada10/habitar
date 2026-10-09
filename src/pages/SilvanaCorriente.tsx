import { useState } from "react"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import WaterPond from "../kit/WaterPond"
import { useYouTube } from "../kit/useYouTube"

/**
 * /silvana-3 · La corriente. Lienzo = public/silvana3/bg.webp (942×1904, sin texto ni la mano/“TOCA Y DESCUBRE”).
 * Origen: PDF índice 11 (942×1670); filas 79–1670 (la barra verde es la real del Shell), estirado sólo en papel y en el agua
 * (tools/silvana3.json + tools/clean_silvana3_hint.py + tools/stretch_silvana3.py). Coordenadas: x = x del PDF; y = y NUEVA.
 * Foto, flores, nota manuscrita, reglas y collage quedan en la imagen. El estanque es interactivo: al tocarlo nacen ondas
 (simulación de ondas con refracción y brillo, canvas) recortadas a la silueta del agua; la pista “TOCA Y DESCUBRE” se va al primer toque.
 */
const W = 942, H = 1904
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1c231b"
const YT = "OpI5H246ziw" // sonido de fondo: video de YouTube oculto (sólo audio), arranca con el primer toque en el agua
const POND = [[120, 775], [330, 765], [560, 775], [760, 790], [850, 820], [880, 850], [905, 1000], [900, 1200], [895, 1340], [870, 1410], [800, 1440], [600, 1465], [430, 1450], [300, 1420], [150, 1390], [70, 1350], [48, 1200], [42, 1000], [50, 880], [90, 800]]
const PX0 = 40, PY0 = 760, PW = 870, PH = 710 // caja del estanque
const clip = `polygon(${POND.map(([x, y]) => `${((x - PX0) / PW) * 100}% ${((y - PY0) / PH) * 100}%`).join(",")})`

export default function SilvanaCorriente() {
  const [touched, setTouched] = useState(false)
  const audio = useYouTube(YT)

  return (
    <Shell theme="silvana">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ecd4b8" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/942)] [--w:max(min(100vw,480px),calc((100dvh-44px)*942/1904))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <div {...audio.hostEl} />
          <img src="/silvana3/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/silvana" label="Volver a Silvana" cx={95} cy={77} color={ink} />
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(138), top: k(60), fontSize: k(20.5), lineHeight: k(30), letterSpacing: ".13em", fontWeight: 400 }}>
            SILVANA ESTRADA &nbsp;/&nbsp; 03
          </p>
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(780), top: k(58), fontSize: k(21.5), lineHeight: k(30), letterSpacing: ".2em", fontWeight: 400 }}>
            03 / 04
          </p>

          <p className="f-bodoni absolute whitespace-nowrap [--tx:.92]" style={{ left: k(96), top: k(142), fontSize: k(228), lineHeight: k(228), fontStyle: "italic", fontWeight: 700, color: "#a39784", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            03
          </p>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.743]" style={{ left: k(90), top: k(367), fontSize: k(93), lineHeight: k(79), fontStyle: "italic", fontWeight: 800, letterSpacing: "-.01em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            LA<br />CORRIENTE
          </h1>
          <p className="absolute whitespace-nowrap" style={{ left: k(93), top: k(565), fontFamily: "'Libre Caslon Text', serif", fontSize: k(31.7), lineHeight: k(41), color: ink }}>
            ¿Qué pasa cuando algo<br />cambia de forma?
          </p>

          {/* estanque interactivo: agua con ondas reales (kit/WaterPond.tsx) */}
          <WaterPond
            src="/silvana3/bg.webp?v=1" sx={PX0} sy={PY0} sw={PW} sh={PH} label="Estanque: toca el agua para crear ondas"
            onFirstTouch={() => { setTouched(true); audio.play() }}
            className="absolute overflow-hidden outline-none"
            style={{ left: k(PX0), top: k(PY0), width: k(PW), height: k(PH), clipPath: clip, WebkitTapHighlightColor: "transparent" }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute flex flex-col items-center transition-opacity duration-700"
              style={{ left: k(471 - PX0 - 120), top: k(1006 - PY0), width: k(240), opacity: touched ? 0 : 1, color: "#f4ead6", filter: "drop-shadow(0 1px 6px rgba(8,18,14,.55))" }}
            >
              <svg className="touch-hint" style={{ width: k(64), height: k(84) }} viewBox="0 0 64 84" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <circle className="touch-dot" cx="32" cy="4" r="1.7" fill="currentColor" stroke="none" />
                <path className="touch-arc touch-arc-1" d="M9.5 28A24 24 0 0 1 54.5 28" />
                <path className="touch-arc touch-arc-2" d="M18 35.5A14.5 14.5 0 0 1 46 35.5" />
                <path className="touch-hand" transform="translate(-1.6 0)" d="M28.4 57V38.2a3.5 3.5 0 0 1 7 0V48a3.1 3.1 0 0 1 5.9.1 3.1 3.1 0 0 1 5.5 1.2 3 3 0 0 1 5 2.6V60c0 7.6-4 13.2-11.2 13.2h-3.3c-5 0-8.3-2.4-10.6-6.2L20.2 58a3 3 0 0 1 5-3.4l3.2 3.6" />
              </svg>
              <span className="f-mont whitespace-nowrap" style={{ marginTop: k(26), fontSize: k(19), letterSpacing: ".22em", paddingLeft: ".22em", fontWeight: 400 }}>TOCA Y DESCUBRE</span>
            </span>
          </WaterPond>

          <p className="absolute whitespace-nowrap" style={{ left: k(205), top: k(1567), fontFamily: "'Libre Caslon Text', serif", fontSize: k(21.6), lineHeight: k(31), color: "#2b2a22" }}>
            A veces, lo que parece<br />un cambio, también<br />es un comienzo.
          </p>
        </div>
      </div>
    </Shell>
  )
}

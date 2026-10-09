import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /juliana · hub de Juliana Velásquez. Lienzo = public/juliana/bg.webp (942×1905, sin textos de la UI).
 * Origen: PDF índice 13 (942×1669), filas 77–1669 (la barra azul oscuro es la real del Shell), estirado sólo en papel
 * (tools/juliana.json + tools/stretch_juliana.py). Coordenadas: x = x del PDF; y = y NUEVA (mapa de stretch_juliana.py).
 * El título es HTML ("LO QUE / PERMANECE"). El original "DOS Y VEINTIDÓS" estaba dibujado en el fondo y se borró con tools/juliana_clear_title.py.
 * Las filas llevan flecha (el PDF trae "+"), con la misma animación de toque que /mon y /silvana.
 */
const W = 942, H = 1905
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#0b1220"
const blue = "#24476f"
const GO_MS = 560

type Row = { n: string; name: string[]; to: string; top: number; h: number; ny: number; nameY: number; cy: number; tx: number }
const rows: Row[] = [
  { n: "01", name: ["2:20 A.M."], to: "/juliana-1", top: 936, h: 144, ny: 1005, nameY: 1010, cy: 1014, tx: 0.765 },
  { n: "02", name: ["CÓSEME"], to: "/juliana-2", top: 1122, h: 152, ny: 1200, nameY: 1205, cy: 1207, tx: 0.82 },
  { n: "03", name: ["DOS DOS", "DOS"], to: "/juliana-3", top: 1312, h: 152, ny: 1388, nameY: 1397, cy: 1395, tx: 0.82 },
  { n: "04", name: ["MAR", "ADENTRO"], to: "/juliana-4", top: 1505, h: 156, ny: 1578, nameY: 1591, cy: 1586, tx: 0.82 },
]

export default function HubJuliana() {
  const nav = useNavigate()
  const [go, setGo] = useState<number | null>(null)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const enter = (e: MouseEvent, i: number, to: string) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (go !== null) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return nav(to)
    setGo(i)
    timer.current = window.setTimeout(() => nav(to), GO_MS)
  }

  return (
    <Shell theme="juliana">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ead2b9" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/942)] [--w:max(min(100vw,480px),calc((100dvh-44px)*942/1905))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/juliana/bg.webp?v=3" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />
          <h1 className="f-bodoni" aria-label="Lo que permanece">
            <span aria-hidden className="absolute whitespace-nowrap [--tx:.77]" style={{ left: k(72), top: k(231), fontSize: k(88), lineHeight: k(88), fontWeight: 700, letterSpacing: ".02em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
              LO QUE
            </span>
            <span aria-hidden className="absolute whitespace-nowrap [--tx:.77]" style={{ left: k(72), top: k(329), fontSize: k(88), lineHeight: k(88), fontWeight: 700, letterSpacing: ".02em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
              PERMANECE
            </span>
          </h1>

          <BackChevron to="/universos" label="Volver a los universos" cx={92} cy={79} color={ink} />
          <p className="f-bodoni absolute whitespace-nowrap [--tx:.762]" style={{ left: k(83), top: k(418), fontSize: k(56), lineHeight: k(60), fontStyle: "italic", fontWeight: 500, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            Juliana Velásquez
          </p>
          <p className="absolute whitespace-nowrap" style={{ left: k(93), top: k(484), fontFamily: "'Libre Caslon Text', serif", fontSize: k(22.6), lineHeight: k(31), color: ink }}>
            Un universo construido desde<br />la ciudad, la vulnerabilidad,<br />el tiempo, la escena y la<br />multiplicidad.
          </p>

          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(121), top: k(871), fontSize: k(19), lineHeight: k(26), letterSpacing: ".24em", fontWeight: 400 }}>
            EXPLORA LOS ESCENARIOS
          </p>

          {rows.map((r, i) => {
            const on = go === i
            const off = go !== null && !on
            return (
              <Link
                key={r.to}
                to={r.to}
                onClick={(e) => enter(e, i, r.to)}
                aria-label={`${r.n} ${r.name.join(" ")}`}
                className="group absolute block outline-none transition-[opacity,filter] duration-300"
                style={{ left: k(104), top: k(r.top), width: k(816), height: k(r.h), opacity: off ? 0.3 : 1, filter: off ? "saturate(.4)" : undefined, "--c": blue } as CSSProperties}
              >

                <span className="f-mont absolute whitespace-nowrap" style={{ left: k(16), top: k(r.ny - r.top - 17), fontSize: k(26), lineHeight: k(34), letterSpacing: ".1em", fontWeight: 300 }}>
                  {r.n}
                </span>
                <span className="f-bodoni absolute whitespace-nowrap" style={{ left: k(134), top: k(r.nameY - r.top - (r.name.length === 1 ? 20 : 34)), fontSize: k(36), lineHeight: k(32), fontWeight: 700, transform: `scaleX(${r.tx})`, transformOrigin: "left" }}>
                  {r.name.map((l, j) => (<span key={j} className="block">{l}</span>))}
                </span>

                <span
                  className={`absolute flex items-center justify-center overflow-hidden rounded-full border-[1.4px] transition-all duration-300 group-active:scale-95 ${on ? "scale-110 " : ""}border-[#0b1220]`}
                  style={{ left: k(678), top: k(r.cy - r.top - 25), width: k(50), height: k(50) }}
                >
                  <svg className={on ? "arrow-go" : "transition-transform duration-300 group-hover:translate-x-[8%]"} style={{ width: k(24), height: k(16) }} viewBox="0 0 18 12" fill="none" aria-hidden>
                    <path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}

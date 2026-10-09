import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router"
import Shell from "../kit/Shell"
import { universes } from "../kit/data"

/**
 * Mobile-first sobre el lienzo de public/mon/bg.webp (808×1658, sin texto).
 * Origen: PDF índice 3 (850×1796, marco negro): columnas 21–829, filas 54–1712 (tools/mon.json + crop_mon.txt).
 * Coordenadas del diseño: X(x)=x-21, Y(y)=y-54. Miniaturas, línea de tiempo y separadores quedan en la imagen.
 * La barra roja es la real del Shell (44 px), el lienzo empieza debajo.
 */
const W = 808, H = 1658
const k = (n: number) => `calc(var(--k) * ${n})`
const X = (x: number) => k(x - 21)
const Y = (y: number) => k(y - 54)
const GO_MS = 560

const ink = "#1d1611"
const red = "#8a1620"
const rowTop = [1085, 1212, 1341, 1469] // y (diseño) del borde superior de cada fila

export default function HubMon() {
  const u = universes.mon
  const nav = useNavigate()
  const [go, setGo] = useState<number | null>(null)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Animación breve (marco de la fila, círculo que se rellena, flecha que avanza) y luego navega.
  const enter = (e: MouseEvent, i: number, to: string) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (go !== null) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return nav(to)
    setGo(i)
    timer.current = window.setTimeout(() => nav(to), GO_MS)
  }

  return (
    <Shell theme="mon">
      <div className="min-h-[calc(100dvh-44px)]" style={{ background: "#cdac91" }}>
        <div
          className="relative mx-auto [--k:calc(var(--w)/808)] [--w:min(100vw,480px)]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/mon/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <p className="f-mont absolute whitespace-nowrap" style={{ left: X(137), top: Y(642), fontSize: k(21.8), lineHeight: k(26), letterSpacing: ".12em", fontWeight: 600 }}>
            03 / UNIVERSO
          </p>

          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.75]" style={{ left: X(135), top: Y(683), fontSize: k(92), lineHeight: k(100), fontWeight: 500, letterSpacing: "-.02em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            AUTOPOÉTICA
          </h1>
          <h2 className="f-bodoni absolute whitespace-nowrap [--tx:.855]" style={{ left: X(135), top: Y(780), fontSize: k(56), lineHeight: k(64), fontWeight: 600, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            {u.artistLine}
          </h2>

          <p className="absolute whitespace-nowrap" style={{ left: X(137), top: Y(859), fontFamily: "'Libre Caslon Text', serif", fontSize: k(29.5), lineHeight: k(36.5), color: "#2b1b0e" }}>
            Un universo construido desde<br />la visceralidad, la contradicción,<br />la pasión y la transformación.
          </p>

          <p className="f-mont absolute whitespace-nowrap" style={{ left: X(95), top: Y(1040), fontSize: k(22), lineHeight: k(24), letterSpacing: ".12em", fontWeight: 500 }}>
            EXPLORA LOS ESCENARIOS
          </p>

          {u.scenarios.map((s, i) => {
            const on = go === i
            const off = go !== null && !on
            return (
              <Link
                key={s.to}
                to={s.to}
                onClick={(e) => enter(e, i, s.to)}
                aria-label={`${s.n} ${s.title}`}
                className="group absolute block outline-none transition-[opacity,filter] duration-300"
                style={{ left: X(92), top: Y(rowTop[i]), width: k(700), height: k(118), opacity: off ? 0.3 : 1, filter: off ? "saturate(.4)" : undefined, "--c": red } as CSSProperties}
              >
                <span aria-hidden className={`arch-ring ${on ? "arch-go" : ""}`} style={{ left: k(60), top: 0, width: k(634), height: k(118), borderRadius: k(8) }} />

                <span className="f-bodoni absolute whitespace-nowrap [--tx:.66]" style={{ left: k(72), top: k(26), fontSize: k(34), lineHeight: k(38), fontWeight: 500, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
                  {s.n}
                </span>
                <span className="f-bodoni absolute whitespace-nowrap [--tx:.56]" style={{ left: k(72), top: k(58), fontSize: k(36), lineHeight: k(42), fontWeight: 500, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
                  {s.title}
                </span>

                <span
                  className={`absolute flex items-center justify-center overflow-hidden rounded-full border-[1.3px] transition-all duration-300 group-hover:bg-[#1d1611] group-hover:text-[#f3e9da] group-active:scale-95 ${on ? "scale-110 border-[var(--c)] bg-[var(--c)] text-[#f3e9da]" : "border-[#1d1611]"}`}
                  style={{ left: k(626), top: k(29), width: k(56), height: k(56) }}
                >
                  <svg className={on ? "arrow-go" : "transition-transform duration-300 group-hover:translate-x-[8%]"} style={{ width: k(24), height: k(16) }} viewBox="0 0 18 12" fill="none" aria-hidden><path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router"
import Shell from "../kit/Shell"

/**
 * /silvana · hub de Silvana Estrada. Lienzo = public/silvana/bg.webp (941×1924, sin texto).
 * Origen: PDF índice 8 (941×1671), filas 82–1671 (la barra verde es la real del Shell), estirado sólo en papel
 * (tools/silvana.json + tools/stretch_silvana.py). Coordenadas: x = x del PDF; y = y NUEVA (mapa de stretch_silvana.py).
 * Miniaturas, línea de tiempo con puntos, regla bajo el título y flechas finas quedan en la imagen.
 * Orden = data.ts y los escenarios (02 TE GUARDO, 03 LA CORRIENTE). El PDF los trae al revés: se intercambiaron las miniaturas 02/03 en el fondo (tools/swap_silvana_rows.py).
 */
const W = 941, H = 1924
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1c231b"
const green = "#6b7a4f"
const GO_MS = 560

type Row = { n: string; name: string[]; sub: string; to: string; tx: number; top: number; h: number; ny: number; nameY: number; subY: number; cy: number }
const rows: Row[] = [
  { n: "01", name: ["CASA"], sub: "SEGUIR LA RAÍZ", to: "/silvana-1", tx: 0.66, top: 1050, h: 138, ny: 1061, nameY: 1112, subY: 1162, cy: 1110 },
  { n: "02", name: ["TE GUARDO"], sub: "CONSERVAR", to: "/silvana-2", tx: 0.66, top: 1242, h: 140, ny: 1272, nameY: 1311, subY: 1360, cy: 1314 },
  { n: "03", name: ["LA CORRIENTE"], sub: "DEJAR PASAR", to: "/silvana-3", tx: 0.66, top: 1436, h: 146, ny: 1473, nameY: 1514, subY: 1563, cy: 1513 },
  { n: "04", name: ["VENDRÁN SUAVES", "LLUVIAS"], sub: "ESCUCHAR EL TIEMPO", to: "/silvana-4", tx: 0.57, top: 1640, h: 182, ny: 1676, nameY: 1716, subY: 1802, cy: 1717 },
]

export default function HubSilvana() {
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
    <Shell theme="silvana">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#eed5bf" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/941)] [--w:max(min(100vw,480px),calc((100dvh-44px)*941/1924))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/silvana/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.743]" style={{ left: k(155), top: k(636), fontSize: k(114), lineHeight: k(100), fontWeight: 600, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            SILVANA
          </h1>
          <p className="absolute whitespace-nowrap" style={{ left: k(157), top: k(788), fontFamily: "'Libre Caslon Text', serif", fontSize: k(25.1), lineHeight: k(31.5), color: "#2b2a22" }}>
            Un universo sensible donde la<br />introspección, la transformación<br />y la conexión con lo esencial<br />se encuentran.
          </p>
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(157), top: k(978), fontSize: k(18.3), lineHeight: k(24), letterSpacing: ".235em", fontWeight: 500 }}>
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
                style={{ left: k(196), top: k(r.top), width: k(712), height: k(r.h), opacity: off ? 0.3 : 1, filter: off ? "saturate(.4)" : undefined, "--c": green } as CSSProperties}
              >
                <span aria-hidden className={`arch-ring ${on ? "arch-go" : ""}`} style={{ left: 0, top: 0, width: "100%", height: "100%", borderRadius: k(8) }} />

                <span className="f-bodoni absolute whitespace-nowrap [--tx:.62]" style={{ left: k(24), top: k(r.ny - r.top - 6), fontSize: k(52), lineHeight: k(56), fontStyle: "italic", fontWeight: 400, color: "#bdae9d", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
                  {r.n}
                </span>
                <span className="f-bodoni absolute whitespace-nowrap" style={{ left: k(24), top: k(r.nameY - r.top - 8), fontSize: k(44), lineHeight: k(34), fontStyle: "italic", fontWeight: 500, transform: `scaleX(${r.tx})`, transformOrigin: "left" }}>
                  {r.name.map((l, j) => (<span key={j} className="block">{l}</span>))}
                </span>
                <span className="f-mont absolute whitespace-nowrap" style={{ left: k(28), top: k(r.subY - r.top - 7), fontSize: k(11.3), lineHeight: k(14), letterSpacing: ".16em", fontWeight: 500, color: "#3b3a33" }}>
                  {r.sub}
                </span>

                <span
                  className={`absolute flex items-center justify-center overflow-hidden rounded-full border-[1.4px] transition-all duration-300 group-hover:bg-[#1c231b] group-hover:text-[#f3e9da] group-active:scale-95 ${on ? "scale-110 border-[var(--c)] bg-[var(--c)] text-[#f3e9da]" : "border-[#1c231b]"}`}
                  style={{ left: k(647), top: k(r.cy - r.top - 25), width: k(50), height: k(50) }}
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

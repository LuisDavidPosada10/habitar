import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { universes } from "../kit/data"

/**
 * Diseño nuevo (PDF "Pagina Web - Diseño", pág. 4, 1179×2556). El fondo (public/mon/bg.webp) es el render SIN texto:
 * collage de Mon, estrellas, línea de tiempo, miniaturas, reglas, sello y mariposa quedan en la imagen; el papel es de
 * color plano #efe8df. Título, nombre, párrafo, números, títulos de fila y círculos con flecha son HTML en unidades del
 * lienzo (--k = ancho_css / 1179). Barra transparente; el lienzo cubre el alto.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const GO_MS = 560
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic", fontWeight: 700 } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const RED = "#631413"
const LINE = "#7f6360"
const RING = "#5e3f3c"

// Filas: top del enlace, tops de la tinta del número / título / círculo y x de cada uno (lienzo)
const LX = 225, LW = 830, LH = 190
const rows = [
  { top: 1538, num: [247, 1620], tit: [246, 1665], ci: 1636 },
  { top: 1737, num: [239, 1817], tit: [236, 1863], ci: 1839 },
  { top: 1940, num: [237, 2019], tit: [234, 2063], ci: 2014 },
  { top: 2137, num: [231, 2225], tit: [231, 2272], ci: 2220 },
] as const
const titles = ["No Caber", "Tu falta de querer", "Hacerse obra", "La trenza"]
const NUM_DY = -4, TIT_DY = -6     // ajuste fino medido: la tinta queda más abajo/arriba del top de la caja

export default function HubMon() {
  const u = universes.mon
  const nav = useNavigate()
  const [go, setGo] = useState<number | null>(null)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Animación breve (flecha que avanza, las demás filas se atenúan) y luego navega.
  const enter = (e: MouseEvent, i: number, to: string) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (go !== null) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return nav(to)
    setGo(i)
    timer.current = window.setTimeout(() => nav(to), GO_MS)
  }

  return (
    <Shell theme="mon" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/mon/bg.webp?v=4" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(59), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: "scaleX(.912)" }}>
          Habitar la música
        </p>

        <BackChevron to="/universos" label="Volver a los universos" cx={104} cy={183} color="#3a1010" />

        <h1 data-m="title" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(78), top: k(901), fontSize: k(156), lineHeight: k(156), color: RED, transform: "scaleX(1.013)", transformOrigin: "left" }}>
          Lo que Arde
        </h1>

        <div className="absolute" style={{ left: k(75), top: k(1121), width: k(397), height: k(89), borderRadius: k(45), border: `${k(1.3)} solid ${LINE}` }} />
        <h2 data-m="name" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(107), top: k(1129), fontSize: k(58), lineHeight: k(76), color: "#000" }}>
          {u.artistLine}
        </h2>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ ...mont, left: k(84), top: k(1262), fontSize: k(36), lineHeight: k(35) }}>
          Un universo construido desde<br />la visceralidad, la contradicción,<br />la pasión y la transformación.
        </p>

        <p data-m="explora" className="absolute whitespace-nowrap" style={{ ...mont, fontWeight: 500, left: k(137), top: k(1464), fontSize: k(36), lineHeight: k(44) }}>
          Explora los escenarios
        </p>

        {u.scenarios.map((s, i) => {
          const r = rows[i]
          const on = go === i
          const off = go !== null && !on
          const title = titles[i]
          return (
            <Link
              key={s.to}
              to={s.to}
              onClick={(e) => enter(e, i, s.to)}
              aria-label={`${s.n} ${s.title}`}
              className="group absolute block outline-none transition-[opacity,filter] duration-300"
              style={{ left: k(LX), top: k(r.top), width: k(LW), height: k(LH), opacity: off ? 0.3 : 1, filter: off ? "saturate(.4)" : undefined } as CSSProperties}
            >
              <span data-m={`num${i}`} className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(r.num[0] - LX - 4), top: k(r.num[1] - r.top + NUM_DY), fontSize: k(46), lineHeight: k(50), fontWeight: 700, color: RED, transform: "scaleX(1.15)", transformOrigin: "left" }}>{s.n}</span>
              <span data-m={`tt${i}`} className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(r.tit[0] - LX), top: k(r.tit[1] - r.top + TIT_DY), fontSize: k(40.5), lineHeight: k(50), color: "#000" }}>{title}</span>
              <span
                data-m={`ci${i}`}
                className={`absolute flex items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-active:scale-95 ${on ? "scale-110" : ""}`}
                style={{ left: k(926 - LX), top: k(r.ci - r.top), width: k(72), height: k(72), border: `${k(1.3)} solid ${RING}`, color: "#3a1010" }}
              >
                <svg className={on ? "arrow-go" : "transition-transform duration-300 group-hover:translate-x-[8%]"} style={{ width: k(36), height: k(24) }} viewBox="0 0 18 12" fill="none" aria-hidden><path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
          )
        })}
      </div>
    </Shell>
  )
}

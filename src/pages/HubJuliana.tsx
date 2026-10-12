import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { universes } from "../kit/data"

/**
 * /juliana · hub de Juliana Velásquez. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 14, 1179×2556). Fondo = public/juliana/bg.webp:
 * render SIN texto (foto en arco con flores, línea de tiempo con puntos, miniaturas y reglas quedan en la imagen).
 * Título, nombre, párrafo, números, títulos de fila y círculos con flecha son HTML en unidades del lienzo (--k = ancho_css / 1179).
 * Orden = data.ts y los escenarios (01 2:20 A.M, 02 CÓSEME, 03 DOS DOS DOS, 04 MAR ADENTRO).
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const GO_MS = 560
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const GREEN = "#1a175e"
const NUM = "#1a175e"
const RING = "#457089"

// Filas: top del enlace, alto, tinta del número (x, y), de cada línea del nombre (x, y) y tope del círculo
const LX = 225, LW = 830
const rows = [
  { to: "/juliana-1", n: "01", name: ["2:20 A.M"], top: 1540, h: 178, num: [246, 1614], nm: [[248, 1660]], cy: 1630 },
  { to: "/juliana-2", n: "02", name: ["Cóseme"], top: 1735, h: 180, num: [239, 1811], nm: [[235, 1857]], cy: 1833 },
  { to: "/juliana-3", n: "03", name: ["DOS DOS DOS"], top: 1935, h: 178, num: [237, 2012], nm: [[234, 2058]], cy: 2007 },
  { to: "/juliana-4", n: "04", name: ["Mar Adentro"], top: 2135, h: 180, num: [231, 2218], nm: [[231, 2262]], cy: 2213 },
] as const
const NUM_DY = 4, NM_DY = 0

export default function HubJuliana() {
  const u = universes.juliana
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
    <Shell theme="juliana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/juliana/bg.webp?v=4" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(55), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(-2)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/universos" label="Volver a los universos" cx={102.5} cy={175.5} color="#3a1010" />

        <h1 data-m="title" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(94), top: k(899), fontSize: k(152), lineHeight: k(125), fontWeight: 700, color: GREEN, transform: "scaleX(1.005)", transformOrigin: "left" }}>
          Lo que florece
        </h1>

        <div className="absolute" style={{ left: k(74), top: k(1114), width: k(492), height: k(89), borderRadius: k(45), border: `${k(1.3)} solid #55616c` }} />
        <h2 data-m="name" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(98), top: k(1121), fontSize: k(58), lineHeight: k(70), fontWeight: 600, color: "#000", transform: "scaleX(.919)", transformOrigin: "left" }}>
          {u.name}
        </h2>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ ...mont, left: k(84), top: k(1255), fontSize: k(36), lineHeight: k(35) }}>
          Un universo construido desde<br />la ciudad, la vulnerabilidad,<br />el tiempo, la escena y la<br />multiplicidad.
        </p>

        <p data-m="explora" className="absolute whitespace-nowrap" style={{ ...mont, fontWeight: 500, left: k(137), top: k(1458), fontSize: k(36), lineHeight: k(44) }}>
          Explora los escenarios
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
              style={{ left: k(LX), top: k(r.top), width: k(LW), height: k(r.h), opacity: off ? 0.3 : 1, filter: off ? "saturate(.4)" : undefined } as CSSProperties}
            >
              <span data-m={`num${i}`} className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(r.num[0] - LX - 4), top: k(r.num[1] - r.top + NUM_DY - 8), fontSize: k(46), lineHeight: k(50), fontWeight: 700, color: NUM, transform: "scaleX(1.1)", transformOrigin: "left" }}>{r.n}</span>
              {r.nm.map(([x, y], j) => (
                <span key={j} data-m={`nm${i}-${j}`} className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(x - LX), top: k(y - r.top + NM_DY - 8), fontSize: k(40.5), lineHeight: k(48), fontWeight: 700, color: "#000", transform: "scaleX(1.035)", transformOrigin: "left" }}>{r.name[j]}</span>
              ))}
              <span
                data-m={`ci${i}`}
                className={`absolute flex items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-active:scale-95 ${on ? "scale-110" : ""}`}
                style={{ left: k(926 - LX), top: k(r.cy - r.top), width: k(72), height: k(72), border: `${k(1.3)} solid ${RING}`, color: GREEN }}
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

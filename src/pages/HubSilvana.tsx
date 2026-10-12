import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { universes } from "../kit/data"

/**
 * /silvana · hub de Silvana Estrada. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 9, 1179×2556). Fondo = public/silvana/bg.webp:
 * render SIN texto (foto en arco con película y flores, línea de tiempo con puntos, miniaturas y reglas quedan en la imagen).
 * Título, nombre, párrafo, números, títulos de fila y círculos con flecha son HTML en unidades del lienzo (--k = ancho_css / 1179).
 * Orden = data.ts y los escenarios (01 CASA, 02 TE GUARDO, 03 LA CORRIENTE, 04 VENDRÁN SUAVES LLUVIAS).
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const GO_MS = 560
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const GREEN = "#3b523b"
const NUM = "#718b61"
const RING = "#4d6a4d"

// Filas: top del enlace, alto, tinta del número (x, y), de cada línea del nombre (x, y) y tope del círculo
const LX = 225, LW = 830
const rows = [
  { to: "/silvana-1", n: "01", name: ["Casa"], top: 1540, h: 190, num: [251, 1629], nm: [[254, 1674]], cy: 1645 },
  { to: "/silvana-2", n: "02", name: ["Te guardo"], top: 1745, h: 192, num: [244, 1826], nm: [[241, 1871]], cy: 1848 },
  { to: "/silvana-3", n: "03", name: ["La corriente"], top: 1946, h: 188, num: [242, 2027], nm: [[237, 2072]], cy: 2025 },
  { to: "/silvana-4", n: "04", name: ["Vendrán suaves", "lluvias"], top: 2142, h: 194, num: [237, 2193], nm: [[243, 2238], [241, 2287]], cy: 2230 },
] as const
const NUM_DY = 4, NM_DY = 0

export default function HubSilvana() {
  const u = universes.silvana
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
    <Shell theme="silvana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/silvana/bg.webp?v=3" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(67), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(1)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/universos" label="Volver a los universos" cx={108} cy={190} color="#3a1010" />

        <h1 data-m="title" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(45), top: k(955), fontSize: k(124.5), lineHeight: k(125), fontWeight: 700, color: GREEN, transform: "scaleX(1.071)", transformOrigin: "left" }}>
          Lo que permanece
        </h1>

        <div className="absolute" style={{ left: k(79), top: k(1129), width: k(496), height: k(89), borderRadius: k(45), border: `${k(1.3)} solid #8a8a80` }} />
        <h2 data-m="name" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(108), top: k(1137), fontSize: k(61), lineHeight: k(70), fontWeight: 600, color: "#000" }}>
          {u.name}
        </h2>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ ...mont, left: k(87), top: k(1270), fontSize: k(36), lineHeight: k(35) }}>
          Un universo sensible donde la<br />introspección, la transformación<br />y la conexión con lo esencial<br />se encuentran.
        </p>

        <p data-m="explora" className="absolute whitespace-nowrap" style={{ ...mont, fontWeight: 500, left: k(140), top: k(1472), fontSize: k(36), lineHeight: k(44) }}>
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
                <span key={j} data-m={`nm${i}-${j}`} className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(x - LX), top: k(y - r.top + NM_DY - 8), fontSize: k(40.5), lineHeight: k(48), fontWeight: 700, color: "#000" }}>{r.name[j]}</span>
              ))}
              <span
                data-m={`ci${i}`}
                className={`absolute flex items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-active:scale-95 ${on ? "scale-110" : ""}`}
                style={{ left: k(930 - LX), top: k(r.cy - r.top), width: k(72), height: k(72), border: `${k(1.3)} solid ${RING}`, color: GREEN }}
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

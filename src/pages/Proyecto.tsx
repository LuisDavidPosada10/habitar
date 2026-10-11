import { useEffect, useState } from "react"
import { Link } from "react-router"
import Shell from "../kit/Shell"
import { Star8 } from "../kit/Pieces"
import { pillars } from "../kit/data"

/**
 * Diseño nuevo (PDF "Pagina Web - Diseño", pág. 2, 1179×2556). El fondo (public/proyecto/bg.webp) es el render
 * SIN texto: miniaturas con marco, línea de tiempo, reglas, flores y disco quedan en la imagen; el papel es de
 * color plano #efe8df (se rellenó con ese color). Todo el texto, la estrella, el botón y los "+" son HTML en
 * unidades del lienzo (--k = ancho_css / 1179). Barra transparente; el lienzo cubre el alto.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const INK = "#3a1010"
const LINE = "#461e1d"
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic", fontWeight: 600 } as const

// Filas: top del círculo "+" (lienzo) y top de la tinta del título
const ROW = [1392, 1559, 1726, 1894, 2064, 2229]
const TITLE_DY = [2, -10, -6, -3, 0, 2]   // ajuste fino medido (el alto de las mayúsculas/ascendentes cambia por fila)

export default function Proyecto() {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-pillar]")) setOpen(null)
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null)
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", esc)
    }
  }, [open])

  return (
    <Shell bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: INK }}
      >
        <img src="/proyecto/bg.webp?v=5" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(62), fontSize: k(62), lineHeight: k(70), fontWeight: 600, color: "#11110f", transform: "scaleX(.912)" }}>
          Habitar la música
        </p>
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoni, left: k(80), top: k(156), fontSize: k(41), lineHeight: k(52), fontWeight: 600, color: "#11110f", transform: "scaleX(.94)", transformOrigin: "left" }}>
          01 / Proyecto
        </p>

        <h1 data-m="h1" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(82), top: k(281), fontSize: k(103), lineHeight: k(92), color: "#631413", transform: "scaleX(.874)", transformOrigin: "left" }}>
          La música<br />también se puede<br />habitar.
        </h1>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ left: k(82), top: k(618), color: "#11110f", fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, fontSize: k(36), lineHeight: k(35) }}>
          Cada fanzine construye un universo<br />a través de imágenes, palabras,<br />materia y memoria. El papel es el<br />punto de partida. La experiencia<br />continúa cuando lo físico y lo<br />digital se encuentran.
        </p>

        <Star8 className="absolute" style={{ left: k(401), top: k(886), width: k(59), height: k(59) }} />

        <Link
          to="/universos"
          data-m="btn"
          className="absolute flex items-center justify-center whitespace-nowrap"
          style={{ ...bodoni, left: k(87), top: k(976), width: k(700), height: k(120), padding: `0 ${k(56)}`, borderRadius: k(60), border: `${k(1.2)} solid ${LINE}`, color: INK, gap: k(30), fontWeight: 500, fontSize: k(56) }}
        >
          Conoce el proyecto
          <svg viewBox="0 0 54 36" style={{ width: k(58), height: k(39) }} fill="none" aria-hidden><path d="M1 18H52M36 3l16 15-16 15" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>

        {pillars.map((p, i) => {
          const on = open === i
          const name = p.title[0] + p.title.slice(1).toLowerCase()
          return (
            <div key={p.title} data-pillar className="absolute" style={{ left: k(250), top: k(ROW[i] - 22), width: k(800), height: k(122), zIndex: on ? 20 : 1 }}>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`pillar-${i}`}
                aria-label={`${name}: ${on ? "cerrar" : "ver descripción"}`}
                onClick={() => setOpen(on ? null : i)}
                className="absolute inset-0 block text-left transition-transform duration-150 active:scale-[.985]"
              >
                <span data-m={`row${i}`} className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(248), top: k(22 + TITLE_DY[i]), fontSize: k(46.5), lineHeight: k(56), color: INK, transform: "scaleX(.975)", transformOrigin: "left" }}>
                  {name}
                </span>
                <span
                  className="absolute flex items-center justify-center rounded-full transition-transform duration-300 ease-out"
                  style={{ left: k(696), top: k(22), width: k(78), height: k(78), border: `${k(1.2)} solid ${LINE}`, transform: on ? "rotate(45deg)" : undefined, color: on ? "#8a1620" : INK, borderColor: on ? "#8a1620" : LINE }}
                >
                  <svg style={{ width: k(44), height: k(44) }} viewBox="0 0 22 22" fill="none" aria-hidden>
                    <path d="M11 1v20M1 11h20" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </span>
              </button>

              {on && (
                <div
                  id={`pillar-${i}`}
                  role="dialog"
                  aria-label={name}
                  className="pillar-pop absolute"
                  style={{
                    left: k(236), top: k(-14), width: k(450), padding: `${k(20)} ${k(26)} ${k(24)}`,
                    background: "linear-gradient(160deg,#f7ecd9,#efdcc0)",
                    border: "1px solid rgba(70,48,30,.35)",
                    boxShadow: "0 10px 26px rgba(40,22,8,.32), 0 1px 0 rgba(255,255,255,.5) inset",
                    borderRadius: k(6),
                  }}
                >
                  <span className="f-mont block" style={{ fontSize: k(22), fontWeight: 600, letterSpacing: ".18em", color: "#8a1620" }}>{p.title}</span>
                  <span className="mt-[.35em] block" style={{ fontFamily: "'Libre Caslon Text', serif", fontSize: k(31), lineHeight: k(41), color: "#2b1b0e" }}>{p.text}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Shell>
  )
}

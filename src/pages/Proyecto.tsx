import { useEffect, useState } from "react"
import { Link } from "react-router"
import Shell from "../kit/Shell"
import { pillars } from "../kit/data"

/**
 * Mobile-first sobre el lienzo de public/proyecto/bg.webp (808×1748, sin texto).
 * Coordenadas del diseño original (PDF pág. 2, 850×1512): X(x)=x-22, Y(y)=y+TOP
 * (TOP px de papel arriba para que el navbar quede sobre papel, como en Inicio;
 * BOTTOM px de papel abajo). --k = px del lienzo → px de pantalla.
 */
const TOP = 112, BOTTOM = 124
const W = 808, H = 1512 + TOP + BOTTOM
const k = (n: number) => `calc(var(--k) * ${n})`
const X = (x: number) => k(x - 22)
const Y = (y: number) => k(y + TOP)

const ink = "#1d1611"
const lines = [
  ["Más que un soporte, es un territorio", "para crear, guardar y sentir."],
  ["La música como hilo que da vida", "a cada universo."],
  ["Collage, fotografía y símbolos que", "construyen nuevas realidades."],
  ["Texturas, recortes y elementos", "que hacen tangible la experiencia."],
  ["Lo que cambia, se transforma y se", "habita en el tiempo."],
  ["Un encuentro entre lo físico, lo digital", "y lo emocional."],
]

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
    <Shell bar={false} className="-mt-11">
      <div className="min-h-dvh" style={{ background: "#f0d9bf" }}>
        <div
          className="relative mx-auto [--k:calc(var(--w)/808)] [--w:min(100vw,480px)]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/proyecto/bg.webp?v=4" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <p className="f-mont absolute whitespace-nowrap" style={{ left: X(72), top: Y(-4), fontSize: k(17), lineHeight: k(18), letterSpacing: ".22em", fontWeight: 500, color: "#3b2d20" }}>
            01 / EL PROYECTO
          </p>

          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.81]" style={{ left: X(72), top: Y(52), fontSize: k(80), lineHeight: k(72), fontWeight: 600, letterSpacing: "-.035em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            La música<br />también se puede<br />habitar<span style={{ color: "#8a1620" }}>.</span>
          </h1>

          <p className="absolute whitespace-nowrap" style={{ left: X(74), top: Y(298), fontFamily: "'Libre Caslon Text', serif", fontSize: k(25.5), lineHeight: k(32) }}>
            Cada fanzine construye un universo<br />a través de imágenes, palabras,<br />materia y memoria. El papel es el<br />punto de partida. La experiencia<br />continúa cuando lo físico y lo<br />digital se encuentran.
          </p>

          <Link
            to="/universos"
            className="f-mont absolute flex items-center justify-center rounded-full border-[1.3px] border-[#1d1611] transition hover:bg-[#1d1611] hover:text-[#f3e9da]"
            style={{ left: X(67), top: Y(587), width: k(369), height: k(76), gap: k(24), fontSize: k(17.5), letterSpacing: ".15em", fontWeight: 500 }}
          >
            CONOCE EL PROYECTO
            <svg style={{ width: k(30), height: k(20) }} viewBox="0 0 18 12" fill="none" aria-hidden><path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>

          {pillars.map((p, i) => {
            const on = open === i
            return (
              <div key={p.title} data-pillar className="absolute" style={{ left: X(150), top: Y(838 + 115 * i), width: k(630), height: k(108), zIndex: on ? 20 : 1 }}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`pillar-${i}`}
                  aria-label={`${p.title}: ${on ? "cerrar" : "ver descripción"}`}
                  onClick={() => setOpen(on ? null : i)}
                  className="group absolute inset-0 block text-left transition-transform duration-150 active:scale-[.985]"
                >
                  <span className="f-mont absolute whitespace-nowrap" style={{ left: k(201), top: k(24), fontSize: k(20), lineHeight: k(22), fontWeight: 600, letterSpacing: ".13em" }}>
                    {p.title}
                  </span>
                  <span className="absolute whitespace-nowrap" style={{ left: k(201), top: k(54), fontFamily: "'Libre Caslon Text', serif", fontSize: k(16.5), lineHeight: k(22), color: "#4a3a28" }}>
                    {lines[i][0]}<br />{lines[i][1]}
                  </span>
                  <span
                    className={`absolute flex items-center justify-center rounded-full border-[1.3px] transition-all duration-300 ease-out group-hover:bg-[#1d1611] group-hover:text-[#f3e9da] ${on ? "rotate-45 border-[#8a1620] bg-[#8a1620] text-[#f3e9da]" : "border-[#1d1611]"}`}
                    style={{ left: k(563), top: k(27), width: k(52), height: k(52) }}
                  >
                    <svg style={{ width: k(22), height: k(22) }} viewBox="0 0 22 22" fill="none" aria-hidden>
                      <path d="M11 2v18M2 11h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                {on && (
                  <div
                    id={`pillar-${i}`}
                    role="dialog"
                    aria-label={p.title}
                    className="pillar-pop absolute"
                    style={{
                      left: k(183), top: k(-12), width: k(372), padding: `${k(14)} ${k(18)} ${k(16)}`,
                      background: "linear-gradient(160deg,#f7ecd9,#efdcc0)",
                      border: "1px solid rgba(70,48,30,.35)",
                      boxShadow: "0 10px 26px rgba(40,22,8,.32), 0 1px 0 rgba(255,255,255,.5) inset",
                      borderRadius: k(4),
                    }}
                  >
                    <span className="f-mont block" style={{ fontSize: k(15), fontWeight: 600, letterSpacing: ".18em", color: "#8a1620" }}>{p.title}</span>
                    <span className="mt-[.35em] block" style={{ fontFamily: "'Libre Caslon Text', serif", fontSize: k(20), lineHeight: k(27), color: "#2b1b0e" }}>{p.text}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router"
import Shell from "../kit/Shell"
import { universes } from "../kit/data"

/**
 * Mobile-first sobre el lienzo de public/universos/bg.webp (1024×2188, sin texto).
 * Origen: PDF pág. 3 (1024×1536) → texto/flechas/estrellas borrados (tools/universos.json),
 * +40 px de papel arriba y la mitad inferior estirada en vertical (tools/stretch_universos.py, Ab=1.88, At=1.64: baja los arcos ≈141)
 * para que llene pantallas largas. Los arcos con fotos quedan en la imagen (x: 40/365/690, y: 650–1136).
 * --k = px del lienzo → px de pantalla.
 */
const W = 1024, H = 2188
const ARCH_TOP = 650, ARCH_BOT = 1136, ARCH_W = 297
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1d1611"

const cols = [
  { key: "mon", cx: 187, arch: 40, star: "#b3141c" },
  { key: "silvana", cx: 513, arch: 365, star: "#8a7a3a" },
  { key: "juliana", cx: 843, arch: 690, star: "#24476f" },
] as const

// scaleX por nombre: la tipografía del diseño es más condensada que Bodoni Moda (anchos del diseño: 205 / 230 / 108)
const GO_MS = 560
const names = { mon: ["MON LAFERTE", 0.745], silvana: ["SILVANA ESTRADA", 0.64], juliana: ["JULIANA", 0.7] } as const

export default function Universos() {
  const nav = useNavigate()
  const [go, setGo] = useState<string | null>(null)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Animación breve (anillo en el arco, estrella que gira, flecha que avanza) y luego navega.
  const enter = (e: MouseEvent, key: string, to: string) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (go) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return nav(to)
    setGo(key)
    timer.current = window.setTimeout(() => nav(to), GO_MS)
  }

  return (
    <Shell bar={false} className="-mt-11">
      <div className="flex min-h-dvh flex-col justify-end" style={{ background: "#eacfb6" }}>
        <div
          className="relative mx-auto [--k:calc(var(--w)/1024)] [--w:min(100vw,480px)]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/universos/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <p className="f-mont absolute inset-x-0 text-center whitespace-nowrap" style={{ top: k(143), fontSize: k(19), lineHeight: k(26), letterSpacing: ".4em", fontWeight: 400, color: "#3b2d20" }}>
            03 / LOS TRES UNIVERSOS
          </p>

          <h1 className="f-bodoni absolute inset-x-0 text-center whitespace-nowrap [--tx:.84]" style={{ top: k(190), fontSize: k(100), lineHeight: k(87), fontWeight: 400, letterSpacing: "-.035em", transform: "scaleX(var(--tx))" }}>
            Tres fanzines.<br />Tres universos.
          </h1>

          <p className="absolute inset-x-0 text-center whitespace-nowrap" style={{ top: k(378), fontFamily: "'Libre Caslon Text', serif", fontSize: k(26.5), lineHeight: k(35) }}>
            Cada artista, una mirada, un contexto<br />y una forma de habitar la música.
          </p>

          {cols.map((c) => {
            const u = universes[c.key]
            const on = go === c.key
            const off = go !== null && !on
            const lx = c.cx - 160, LT = ARCH_TOP - 10
            return (
              <Link
                key={c.key}
                to={u.to}
                onClick={(e) => enter(e, c.key, u.to)}
                aria-label={`Entrar al universo de ${u.name}`}
                className="group absolute block outline-none transition-[opacity,filter] duration-300"
                style={{ left: k(lx), top: k(LT), width: k(320), height: k(940), opacity: off ? 0.28 : 1, filter: off ? "saturate(.4)" : undefined, "--c": c.star } as CSSProperties}
              >
                {/* marco del arco: aparece al pasar/enfocar y "late" al elegir */}
                <span aria-hidden className={`arch-ring ${on ? "arch-go" : ""}`} style={{ left: k(c.arch - lx), top: k(ARCH_TOP - LT), width: k(ARCH_W), height: k(ARCH_BOT - ARCH_TOP), borderRadius: `${k(150)} ${k(150)} 0 0` }} />

                <span className="f-bodoni absolute inset-x-0 text-center" style={{ top: k(1179 - LT - 17), fontSize: k(28), lineHeight: k(34) }}>{u.index}</span>
                <span className="f-bodoni absolute inset-x-0 text-center whitespace-nowrap" style={{ top: k(1219 - LT - 22), fontSize: k(38), lineHeight: k(44), fontWeight: 500, transform: `scaleX(${names[c.key][1]})` }}>
                  {names[c.key][0]}
                </span>
                <span className="f-mont absolute inset-x-0 text-center whitespace-nowrap" style={{ top: k(1263 - LT - 10), fontSize: k(13.5), lineHeight: k(20), letterSpacing: ".27em", color: "#3b2d20" }}>
                  {u.album}
                </span>
                <span
                  className={`absolute flex items-center justify-center overflow-hidden rounded-full border-[1.3px] transition-all duration-300 group-hover:bg-[#1d1611] group-hover:text-[#f3e9da] group-active:scale-95 ${on ? "scale-110 border-[var(--c)] bg-[var(--c)] text-[#f3e9da]" : "border-[#1d1611]"}`}
                  style={{ left: k(160 - 31), top: k(1376 - LT - 31), width: k(62), height: k(62) }}
                >
                  <svg className={on ? "arrow-go" : "transition-transform duration-300 group-hover:translate-x-[8%]"} style={{ width: k(26), height: k(18) }} viewBox="0 0 18 12" fill="none" aria-hidden><path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className={`absolute transition-transform duration-300 group-hover:scale-110 ${on ? "star-go" : ""}`} style={{ left: k(160 - 28), top: k(1531 - LT - 42), width: k(56), height: k(84) }}>
                  <svg className="size-full" viewBox="-10 -10 20 20" preserveAspectRatio="none" fill={c.star} aria-hidden>
                    <path d="M0-10 1.2-1.2 10 0 1.2 1.2 0 10-1.2 1.2-10 0-1.2-1.2Z" />
                  </svg>
                </span>
              </Link>
            )
          })}

          <p className="f-bodoni absolute inset-x-0 text-center whitespace-nowrap italic transition-opacity duration-300" style={{ top: k(1730), fontSize: k(26), lineHeight: k(38), color: "#2b1b0e", opacity: go ? 0.3 : 1 }}>
            La música también<br />nos habita, de lugar en lugar.
          </p>
        </div>
      </div>
    </Shell>
  )
}

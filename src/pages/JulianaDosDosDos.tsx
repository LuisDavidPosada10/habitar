import { useEffect, useRef, useState, type CSSProperties } from "react"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import YouTubeEmbed from "../kit/YouTubeEmbed"

/**
 * /juliana-3 · Dos dos dos. Diseño nuevo (PDF "Pagina Web - final", pág. 2, 1179×2556). Fondo = public/juliana3/bg.webp: render SIN texto
 * (luna, flores, nota de papel rasgado vacía, las 3 miniaturas con su papel, serpiente/reloj de arena y flor de abajo; sin círculos de flecha).
 * Textos, círculos con flecha y flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179).
 * Cada fila (miniatura + flecha) es un botón: al tocarlo la flecha avanza (como en los hubs) y se abre un modal con el video de esa versión.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const NAVY = "#1a175e", STEEL = "#457089"
const GO_MS = 420

type Version = { key: string; yt: string }
const versions: Version[] = [
  { key: "Versión Original", yt: "X6OncamTHV4" },
  { key: "Versión Acústica", yt: "-JvI8Qh7GIE" },
  { key: "Versión en Vivo", yt: "67HKO-oPhmU" },
]

// Filas: caja del botón (miniatura + papel) y tope del círculo de flecha (72×72 en x 807)
const BOX_L = 262, BOX_W = 630
const rows = [
  { top: 1288, h: 280, ring: 1395 },
  { top: 1572, h: 276, ring: 1691 },
  { top: 1862, h: 274, ring: 1985 },
] as const
const dosLines = [[119.5, 307.5, "#000"], [153.5, 486.5, NAVY], [200.5, 662.5, STEEL]] as const

export default function JulianaDosDosDos() {
  const [go, setGo] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const timer = useRef<number>(0)
  const last = useRef<HTMLElement | null>(null)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const choose = (i: number, el: HTMLElement) => {
    if (go !== null) return
    last.current = el
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setOpen(i)
    setGo(i)
    timer.current = window.setTimeout(() => { setOpen(i); setGo(null) }, GO_MS)
  }
  const close = () => { setOpen(null); window.setTimeout(() => last.current?.focus(), 0) }

  return (
    <Shell theme="juliana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/juliana3/bg.webp?v=4" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(74.5), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(4.5)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/juliana" label="Volver a Lo que florece" cx={115.5} cy={186.5} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(147), top: k(164), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.932)", transformOrigin: "left" }}>
          Lo que florece/ 03
        </p>

        <h1 aria-label="Dos dos dos" className="m-0 font-normal">
          {dosLines.map(([x, y, c], i) => (
            <span key={i} data-m={`dos${i}`} aria-hidden className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(x), top: k(y), fontSize: k(184.5), lineHeight: k(184.5), fontWeight: 600, color: c, transform: "scaleX(1.08)", transformOrigin: "left" }}>DOS</span>
          ))}
        </h1>

        <p data-m="nota" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(981), fontSize: k(49.5), lineHeight: k(53), fontWeight: 400, color: NAVY, transform: `translateX(${k(-6)}) scaleX(1.01)` }}>
          ¿Y si una misma<br />historia pudiera tener varias<br />versiones?
        </p>

        {rows.map((r, i) => {
          const on = go === i
          const off = go !== null && !on
          return (
            <button
              key={i}
              type="button"
              aria-label={`${String(i + 1).padStart(2, "0")} ${versions[i].key}: ver el video`}
              aria-haspopup="dialog"
              onClick={(e) => choose(i, e.currentTarget)}
              className="group absolute block cursor-pointer text-left outline-none transition-[opacity,filter] duration-300"
              style={{ left: k(BOX_L), top: k(r.top), width: k(BOX_W), height: k(r.h), opacity: off ? 0.3 : 1, filter: off ? "saturate(.4)" : undefined } as CSSProperties}
            >
              <span
                data-m={`ci${i}`}
                className={`absolute flex items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-active:scale-95 ${on ? "scale-110" : ""}`}
                style={{ left: k(807 - BOX_L), top: k(r.ring - r.top), width: k(71), height: k(71), border: `${k(1.3)} solid ${STEEL}`, color: STEEL }}
              >
                <svg className={on ? "arrow-go" : "transition-transform duration-300 group-hover:translate-x-[8%]"} style={{ width: k(36), height: k(24) }} viewBox="0 0 18 12" fill="none" aria-hidden><path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </button>
          )
        })}
      </div>
      {open !== null && <VersionModal i={open} go={setOpen} onClose={close} />}
    </Shell>
  )
}

function VersionModal({ i, go, onClose }: { i: number; go: (n: number) => void; onClose: () => void }) {
  const v = versions[i]
  const closeBtn = useRef<HTMLButtonElement>(null)
  const [dir, setDir] = useState(1)
  const step = (d: number) => { setDir(d); go((i + d + versions.length) % versions.length) }

  useEffect(() => {
    closeBtn.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") step(1)
      else if (e.key === "ArrowLeft") step(-1)
    }
    document.addEventListener("keydown", key)
    return () => document.removeEventListener("keydown", key)
  })

  const arrow = (flip: boolean) => (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden style={{ transform: flip ? "scaleX(-1)" : undefined }}><path d="M1 7h19M14 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  )
  const serifIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const

  return (
    <div className="ficha-scrim fixed inset-0 z-50 flex items-center justify-center p-4" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        role="dialog" aria-modal="true" aria-label={`Dos dos dos · ${v.key}`}
        className="ficha-panel relative w-full max-w-[440px] overflow-hidden"
        style={{ background: "#efe8df", border: "1px solid rgba(26,23,94,.3)", borderRadius: 6, boxShadow: "0 24px 60px rgba(8,14,26,.6)", color: "#11110f" }}
      >
        <div className="flex items-center justify-between px-5 pt-4" style={{ ...serifIt, fontWeight: 600, fontSize: 17 }}>
          <span>Lo que florece/ 03 · {String(i + 1).padStart(2, "0")} / 03</span>
          <button ref={closeBtn} type="button" aria-label="Cerrar video" onClick={onClose} className="-m-2 flex size-10 items-center justify-center rounded-full transition hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-[#1a175e]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div key={i} className="ficha-swap px-5 pb-1 pt-4" style={{ ["--dir" as string]: dir }}>
          <div className="relative aspect-video w-full overflow-hidden bg-black" style={{ boxShadow: "0 8px 22px rgba(8,14,26,.45)", outline: "6px solid #f8efe0" }}>
            <YouTubeEmbed id={v.yt} title={v.key} />
          </div>
          <p className="mt-5" style={{ ...serifIt, fontWeight: 700, fontSize: 15, color: STEEL }}>{String(i + 1).padStart(2, "0")}</p>
          <span aria-hidden className="mt-2 block h-[3px] w-14 rounded-full" style={{ background: STEEL }} />
        </div>

        <div className="flex items-center justify-between px-5 pb-5 pt-4">
          <button type="button" aria-label="Versión anterior" onClick={() => step(-1)} className="flex size-11 items-center justify-center rounded-full border border-[#1a175e] text-[#1a175e] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1a175e]">{arrow(true)}</button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Versiones">
            {versions.map((d, n) => (
              <button key={d.key} type="button" role="tab" aria-selected={n === i} aria-label={d.key} onClick={() => { setDir(n > i ? 1 : -1); go(n) }} className="h-2 rounded-full transition-all duration-300" style={{ width: n === i ? 26 : 8, background: n === i ? NAVY : "rgba(26,23,94,.28)" }} />
            ))}
          </div>
          <button type="button" aria-label="Versión siguiente" onClick={() => step(1)} className="flex size-11 items-center justify-center rounded-full border border-[#1a175e] text-[#1a175e] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1a175e]">{arrow(false)}</button>
        </div>
      </div>
    </div>
  )
}

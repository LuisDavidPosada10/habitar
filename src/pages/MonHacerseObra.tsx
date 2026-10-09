import { useEffect, useRef, useState } from "react"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /mon-3 · Hacerse obra. Lienzo = public/mon3/bg.webp (941×1914, sin texto).
 * Origen: PDF índice 6 (941×1672); filas 96–1672, estirado sólo en papel (tools/mon3.json + tools/stretch_mon3.py).
 * Coordenadas: x = x del PDF; y = y NUEVA (mapa impreso por stretch_mon3.py). Fotos de las tarjetas quedan en la imagen.
 * Cada tarjeta abre una "ficha" (modal) con la foto ampliada —recorte del propio fondo—, texto y navegación entre las 4.
 */
const W = 941, H = 1914
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1d1611"
const red = "#8a1620"

// x0,x1 de cada tarjeta (PDF), centro de la etiqueta, rotación y centro del "+"
const cards = [
  { key: "CANCIÓN", x0: 50, x1: 246, cx: 144, ly: 1427, rot: -6, px: 145, text: "Una emoción que encuentra voz y melodía." },
  { key: "IMAGEN", x0: 265, x1: 471, cx: 370, ly: 1439, rot: -2, px: 371, text: "Lo que se siente, hecho retrato y símbolo." },
  { key: "ESCENA", x0: 487, x1: 694, cx: 597, ly: 1434, rot: 2.5, px: 594, text: "El cuerpo y el escenario como lugar de transformación." },
  { key: "OBRA", x0: 712, x1: 908, cx: 813, ly: 1436, rot: -2.5, px: 813, text: "Todas las formas juntas: la obra completa." },
]
const CARD_T = 1085, CARD_B = 1567, PLUS_Y = 1515
const CARD_PHOTO_B = 1380 // la foto de la tarjeta (sin etiqueta ni "+") termina aquí

export default function MonHacerseObra() {
  const [open, setOpen] = useState<number | null>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const close = () => { setOpen(null); opener.current?.focus() }

  return (
    <Shell theme="mon">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#e9d2bb" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/941)] [--w:max(min(100vw,480px),calc((100dvh-44px)*941/1914))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/mon3/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/mon" label="Volver a Autopoética" cx={95} cy={59} />
          <p className="absolute whitespace-nowrap" style={{ left: k(131), top: k(44), fontFamily: "'IBM Plex Mono', monospace", fontSize: k(24), lineHeight: k(30), letterSpacing: ".062em" }}>
            AUTOPOÉTICA / 03
          </p>

          <p className="f-bodoni absolute whitespace-nowrap [--tx:.72]" style={{ left: k(99), top: k(135), fontSize: k(46), lineHeight: k(56), fontWeight: 400, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>03</p>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.578]" style={{ left: k(98), top: k(213), fontSize: k(118), lineHeight: k(100), fontWeight: 700, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            HACERSE<br />OBRA
          </h1>
          <svg className="absolute" style={{ left: k(90), top: k(415), width: k(290), height: k(24) }} viewBox="0 0 290 24" fill={red} aria-hidden>
            <path d="M5 18C70 13 170 8 282 5c-90 5-190 10-277 14z" />
          </svg>
          <p className="absolute whitespace-nowrap" style={{ left: k(100), top: k(492), fontFamily: "'Libre Caslon Text', serif", fontSize: k(41), lineHeight: k(54), transform: "scaleX(.93)", transformOrigin: "left" }}>
            ¿Qué puede<br />convertirse<br />en arte?
          </p>

          <p className="absolute whitespace-nowrap" style={{ left: k(102), top: k(835), fontFamily: "'Libre Caslon Text', serif", fontSize: k(25.5), lineHeight: k(34), color: ink }}>
            En este escenario exploramos cómo Mon Laferte<br />transforma sus emociones, experiencias y contradicciones<br />en arte, creando un universo propio que se expresa<br />a través de diferentes formas.
          </p>

          {cards.map((c, i) => (
            <div key={c.key}>
              <button
                type="button" aria-haspopup="dialog" aria-label={`${c.key}: abrir ficha`}
                onClick={(e) => { opener.current = e.currentTarget; setOpen(i) }}
                className="group absolute block transition-transform duration-150 active:scale-[.985]"
                style={{ left: k(c.x0), top: k(CARD_T), width: k(c.x1 - c.x0), height: k(CARD_B - CARD_T) }}
              >
                <span aria-hidden className="absolute inset-0 transition-[box-shadow,background] duration-300 group-hover:bg-[#8a1620]/10 group-hover:shadow-[inset_0_0_0_2px_#8a1620] group-focus-visible:shadow-[inset_0_0_0_2px_#8a1620]" />
              </button>
              <span
                aria-hidden
                className="pointer-events-none absolute whitespace-nowrap"
                style={{ left: k(c.cx - 100), top: k(c.ly - 20), width: k(200), height: k(40), textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, fontSize: k(26), lineHeight: k(40), letterSpacing: ".02em", transform: `rotate(${c.rot}deg)` }}
              >
                {c.key}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute flex items-center justify-center rounded-full border-white"
                style={{ left: k(c.px - 28), top: k(PLUS_Y - 28), width: k(56), height: k(56), background: "#0d0b0a", borderWidth: k(2), color: "#fff" }}
              >
                <svg style={{ width: k(24), height: k(24) }} viewBox="0 0 22 22" fill="none"><path d="M11 2v18M2 11h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </span>
            </div>
          ))}
        </div>
      </div>
      {open !== null && <Ficha i={open} go={setOpen} onClose={close} />}
    </Shell>
  )
}

/** Ficha a pantalla completa de una tarjeta: foto ampliada (recorte del propio fondo), texto y navegación. */
function Ficha({ i, go, onClose }: { i: number; go: (n: number) => void; onClose: () => void }) {
  const c = cards[i]
  const closeBtn = useRef<HTMLButtonElement>(null)
  const drag = useRef<number | null>(null)
  const [dir, setDir] = useState(1)
  const step = (d: number) => { setDir(d); go((i + d + cards.length) % cards.length) }

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

  const cw = c.x1 - c.x0, ch = CARD_PHOTO_B - CARD_T
  const arrow = (flip: boolean) => (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden style={{ transform: flip ? "scaleX(-1)" : undefined }}><path d="M1 7h19M14 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  )

  return (
    <div className="ficha-scrim fixed inset-0 z-50 flex items-center justify-center p-4" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        role="dialog" aria-modal="true" aria-label={`${c.key} · ficha`}
        className="ficha-panel relative w-full max-w-[400px] overflow-hidden"
        style={{ background: "linear-gradient(165deg,#f6ead7,#ecd7bb)", border: "1px solid rgba(70,48,30,.35)", borderRadius: 6, boxShadow: "0 24px 60px rgba(30,12,4,.55), 0 1px 0 rgba(255,255,255,.55) inset", color: ink, touchAction: "pan-y" }}
        onPointerDown={(e) => { drag.current = e.clientX; e.stopPropagation() }}
        onPointerUp={(e) => { if (drag.current !== null && Math.abs(e.clientX - drag.current) > 50) step(e.clientX < drag.current ? 1 : -1); drag.current = null }}
        onPointerCancel={() => { drag.current = null }}
      >
        <div className="flex items-center justify-between px-5 pt-4" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: ".16em" }}>
          <span>AUTOPOÉTICA / 03 · {String(i + 1).padStart(2, "0")} / 04</span>
          <button ref={closeBtn} type="button" aria-label="Cerrar ficha" onClick={onClose} className="-m-2 flex size-10 items-center justify-center rounded-full transition hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-[#8a1620]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div key={i} className="ficha-swap flex gap-4 px-5 pb-2 pt-4" style={{ ["--dir" as string]: dir }}>
          <div className="relative shrink-0 overflow-hidden" style={{ width: "42%", aspectRatio: `${cw} / ${ch}`, boxShadow: "0 8px 22px rgba(30,12,4,.4)", outline: "6px solid #f8efe0", transform: "rotate(-1.2deg)" }}>
            <img src="/mon3/bg.webp?v=1" alt="" aria-hidden draggable={false} className="absolute max-w-none select-none" style={{ width: `${(941 / cw) * 100}%`, left: `${(-c.x0 / cw) * 100}%`, top: `${(-CARD_T / ch) * 100}%` }} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="f-bodoni" style={{ fontSize: 15, fontStyle: "italic", color: red }}>{String(i + 1).padStart(2, "0")}</p>
            <h2 className="f-bodoni" style={{ fontSize: "clamp(30px,9vw,40px)", lineHeight: 1, fontWeight: 700, letterSpacing: "-.01em" }}>{c.key}</h2>
            <span aria-hidden className="mt-2 block h-[3px] w-14 rounded-full" style={{ background: red }} />
            <p className="mt-3" style={{ fontFamily: "'Libre Caslon Text', serif", fontSize: 17, lineHeight: 1.4, color: "#2b1b0e" }}>{c.text}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 pb-5 pt-3">
          <button type="button" aria-label="Anterior" onClick={() => step(-1)} className="flex size-11 items-center justify-center rounded-full border border-[#1d1611] transition hover:bg-[#1d1611] hover:text-[#f3e9da] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#8a1620]">{arrow(true)}</button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Fichas">
            {cards.map((d, n) => (
              <button key={d.key} type="button" role="tab" aria-selected={n === i} aria-label={d.key} onClick={() => { setDir(n > i ? 1 : -1); go(n) }} className="h-2 rounded-full transition-all duration-300" style={{ width: n === i ? 26 : 8, background: n === i ? red : "rgba(29,22,17,.28)" }} />
            ))}
          </div>
          <button type="button" aria-label="Siguiente" onClick={() => step(1)} className="flex size-11 items-center justify-center rounded-full border border-[#1d1611] bg-[#1d1611] text-[#f3e9da] transition hover:border-[#8a1620] hover:bg-[#8a1620] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#8a1620]">{arrow(false)}</button>
        </div>
      </div>
    </div>
  )
}

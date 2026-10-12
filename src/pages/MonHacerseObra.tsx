import { useEffect, useRef, useState } from "react"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /mon-3 · Hacerse obra. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 7, 1179×2556). Fondo = public/mon3/bg.webp: render SIN
 * texto (collage, estrellas, disco, arcos con fotos y las etiquetas de papel rasgado quedan lisas). Textos, nombres de las
 * tarjetas, círculos con flecha y flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179).
 * Cada tarjeta abre una "ficha" (modal) con la foto ampliada —recorte del propio fondo—, texto y navegación entre las 4.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const red = "#8a1620"
const ink = "#1d1611"

// Arcos (x0–x1), centro de la etiqueta (cx), tope de la tinta del nombre (ty), tope del círculo (cy) y texto de la ficha
const cards = [
  { key: "Canción", x0: 50, x1: 306, cx: 177, ty: 2172, cy: 2221, text: "Una emoción que encuentra voz y melodía." },
  { key: "Escena", x0: 322, x1: 575, cx: 450, ty: 2172, cy: 2220, text: "El cuerpo y el escenario como lugar de transformación." },
  { key: "Obra", x0: 592, x1: 845, cx: 716, ty: 2170, cy: 2215, text: "Todas las formas juntas: la obra completa." },
  { key: "Imagen", x0: 861, x1: 1116, cx: 994, ty: 2175, cy: 2225, text: "Lo que se siente, hecho retrato y símbolo." },
]
const CARD_T = 1662, CARD_B = 2350
const CARD_PHOTO_B = 2150 // la foto del arco (sin la etiqueta) termina aquí

export default function MonHacerseObra() {
  const [open, setOpen] = useState<number | null>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const close = () => { setOpen(null); opener.current?.focus() }

  return (
    <Shell theme="mon" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/mon3/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(75), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(1)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/mon" label="Volver a Lo que arde" cx={114} cy={189} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(150), top: k(166), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.956)", transformOrigin: "left" }}>
          Lo que arde/ 03
        </p>

        <h1 className="m-0 font-normal">
          <span data-m="t1" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(71), top: k(330), fontSize: k(161.7), lineHeight: k(162), fontWeight: 400, color: "#000", transform: "scaleX(1.044)", transformOrigin: "left" }}>Hacerse</span>
          <span data-m="t2" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(161), top: k(492), fontSize: k(173.5), lineHeight: k(174), fontWeight: 500, color: "#631413", transform: "scaleX(1.03)", transformOrigin: "left" }}>Obra</span>
        </h1>

        <p data-m="sub" className="absolute whitespace-nowrap text-center" style={{ ...bodoniIt, left: k(40), width: k(676), top: k(796), fontSize: k(60.3), lineHeight: k(76), fontWeight: 400, color: "#275868", transform: "scaleX(1.068)" }}>
          ¿Qué puede convertirse<br />en arte?
        </p>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ ...mont, left: k(46), top: k(1067), fontSize: k(35.4), lineHeight: k(35.5) }}>
          En este escenario exploramos<br />cómo Mon Laferte transforma sus<br />emociones, experiencias y<br />contradicciones en arte, creando<br />un universo propio que se expresa<br />a través de diferentes formas.
        </p>

        {cards.map((c, i) => (
          <div key={c.key}>
            <button
              type="button" aria-haspopup="dialog" aria-label={`${c.key}: abrir ficha`}
              onClick={(e) => { opener.current = e.currentTarget; setOpen(i) }}
              className="absolute block transition-transform duration-150 active:scale-[.985]"
              style={{ left: k(c.x0), top: k(CARD_T), width: k(c.x1 - c.x0), height: k(CARD_B - CARD_T) }}
            />
            <span
              data-m={`nm${i}`} aria-hidden
              className="pointer-events-none absolute whitespace-nowrap text-center"
              style={{ ...bodoniIt, left: k(c.cx - 130), width: k(260), top: k(c.ty - 9), fontSize: k(58), lineHeight: k(66), fontWeight: 600, color: "#5b1514", transform: "scaleX(.84)" }}
            >
              {c.key}
            </span>
            <span
              data-m={`ci${i}`} aria-hidden
              className="pointer-events-none absolute flex items-center justify-center rounded-full"
              style={{ left: k(c.cx - 25.5), top: k(c.cy), width: k(51), height: k(51), border: `${k(1.3)} solid #5e3f3c`, color: "#3a1010" }}
            >
              <svg style={{ width: k(31), height: k(21) }} viewBox="0 0 18 12" fill="none"><path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>
        ))}
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
          <span>LO QUE ARDE / 03 · {String(i + 1).padStart(2, "0")} / 04</span>
          <button ref={closeBtn} type="button" aria-label="Cerrar ficha" onClick={onClose} className="-m-2 flex size-10 items-center justify-center rounded-full transition hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-[#8a1620]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div key={i} className="ficha-swap flex gap-4 px-5 pb-2 pt-4" style={{ ["--dir" as string]: dir }}>
          <div className="relative shrink-0 overflow-hidden" style={{ width: "42%", aspectRatio: `${cw} / ${ch}`, boxShadow: "0 8px 22px rgba(30,12,4,.4)", outline: "6px solid #f8efe0", transform: "rotate(-1.2deg)" }}>
            <img src="/mon3/bg.webp?v=2" alt="" aria-hidden draggable={false} className="absolute max-w-none select-none" style={{ width: `${(W / cw) * 100}%`, left: `${(-c.x0 / cw) * 100}%`, top: `${(-CARD_T / ch) * 100}%` }} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="f-bodoni" style={{ fontSize: 15, fontStyle: "italic", color: red }}>{String(i + 1).padStart(2, "0")}</p>
            <h2 style={{ ...bodoniIt, fontSize: "clamp(30px,9vw,40px)", lineHeight: 1, fontWeight: 700, letterSpacing: "-.01em" }}>{c.key}</h2>
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

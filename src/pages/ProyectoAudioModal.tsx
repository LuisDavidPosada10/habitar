import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react"

/**
 * Ventana modal de /proyecto: título, miniatura (recorte del fondo), barra de avance con tiempos,
 * atrasar/adelantar 10 s, pausa/play y flechas al audio anterior/siguiente. El <audio> vive en la página.
 */
const red = "#8a1620"
const ink = "#1d1611"
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const

type Item = { text: ReactNode; name: string }

const fmt = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`

const arrow = (flip: boolean) => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden style={{ transform: flip ? "scaleX(-1)" : undefined }}><path d="M1 7h19M14 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const skipIcon = (back: boolean) => (
  <svg width="28" height="28" viewBox="0 0 26 26" fill="none" aria-hidden style={{ transform: back ? undefined : "scaleX(-1)" }}>
    <path d="M13 4.5a8.5 8.5 0 1 1-8.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M13 1.2L9 4.5l4 3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <text x="13" y="16.6" textAnchor="middle" fontSize="7.6" fontWeight="700" fill="currentColor" style={{ fontFamily: "Montserrat, sans-serif", transform: back ? undefined : "scaleX(-1)", transformOrigin: "13px 13px" }}>10</text>
  </svg>
)

const ring = "flex items-center justify-center rounded-full transition active:scale-95 focus-visible:outline-2 focus-visible:outline-[#8a1620]"

export default function AudioModal({ i, items, audio, go, onClose }: { i: number; items: Item[]; audio: RefObject<HTMLAudioElement | null>; go: (n: number) => void; onClose: () => void }) {
  const r = items[i]
  const closeBtn = useRef<HTMLButtonElement>(null)
  const drag = useRef<number | null>(null)
  const [dir, setDir] = useState(1)
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(0)
  const [playing, setPlaying] = useState(false)
  const step = (d: number) => { setDir(d); go((i + d + items.length) % items.length) }

  useEffect(() => {
    const a = audio.current
    if (!a) return
    const sync = () => { setT(a.currentTime); setDur(Number.isFinite(a.duration) ? a.duration : 0); setPlaying(!a.paused) }
    const evs = ["timeupdate", "durationchange", "loadedmetadata", "play", "pause", "ended", "emptied"]
    evs.forEach((e) => a.addEventListener(e, sync))
    sync()
    return () => evs.forEach((e) => a.removeEventListener(e, sync))
  }, [audio])

  useEffect(() => {
    closeBtn.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight" && (e.target as Element).tagName !== "INPUT") step(1)
      else if (e.key === "ArrowLeft" && (e.target as Element).tagName !== "INPUT") step(-1)
    }
    document.addEventListener("keydown", key)
    return () => document.removeEventListener("keydown", key)
  })

  const toggle = () => { const a = audio.current; if (a) { if (a.paused) void a.play(); else a.pause() } }
  const skip = (d: number) => { const a = audio.current; if (a) a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + d)) }
  const seek = (v: number) => { const a = audio.current; if (a && a.duration) a.currentTime = (v / 1000) * a.duration }
  const ratio = dur ? t / dur : 0

  return (
    <div className="ficha-scrim fixed inset-0 z-50 flex items-center justify-center p-4" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        role="dialog" aria-modal="true" aria-label={r.name}
        className="ficha-panel relative w-full max-w-[400px] overflow-hidden"
        style={{ background: "linear-gradient(165deg,#f6ead7,#ecd7bb)", border: "1px solid rgba(70,48,30,.35)", borderRadius: 6, boxShadow: "0 24px 60px rgba(30,12,4,.55), 0 1px 0 rgba(255,255,255,.55) inset", color: ink, touchAction: "pan-y" }}
        onPointerDown={(e) => { if ((e.target as Element).closest("input,button")) return; drag.current = e.clientX; e.stopPropagation() }}
        onPointerUp={(e) => { if (drag.current !== null && Math.abs(e.clientX - drag.current) > 50) step(e.clientX < drag.current ? 1 : -1); drag.current = null }}
        onPointerCancel={() => { drag.current = null }}
      >
        <button ref={closeBtn} type="button" aria-label="Cerrar" onClick={onClose} className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full text-[#1d1611] transition hover:text-[#8a1620] active:scale-90 focus-visible:outline-2 focus-visible:outline-[#8a1620]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>

        <div key={i} className="ficha-swap px-6 pb-2 pt-7 pr-12" style={{ ["--dir" as string]: dir }}>
          <p className="f-bodoni" style={{ fontSize: 15, fontStyle: "italic", color: red }}>{String(i + 1).padStart(2, "0")}</p>
          <h2 style={{ ...bodoniIt, fontSize: "clamp(28px,8vw,36px)", lineHeight: 1.08, minHeight: "2.16em", fontWeight: 700, letterSpacing: "-.01em" }}>{r.text}</h2>
          <span aria-hidden className="mt-2 block h-[3px] w-14 rounded-full" style={{ background: red }} />
        </div>

        <div className="px-6 pt-3">
          <input
            type="range" min={0} max={1000} value={Math.round(ratio * 1000)} aria-label="Posición del audio"
            aria-valuetext={`${fmt(t)} de ${fmt(dur)}`}
            onChange={(e) => seek(Number(e.target.value))}
            className="block h-1.5 w-full cursor-pointer appearance-none rounded-full"
            style={{ background: `linear-gradient(to right, ${red} ${ratio * 100}%, rgba(29,22,17,.25) 0)`, accentColor: red }}
          />
          <div className="mt-1.5 flex justify-between tabular-nums" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, letterSpacing: ".06em", color: "rgba(29,22,17,.7)" }}>
            <span>{fmt(t)}</span><span>{fmt(dur)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 px-5 pb-1 pt-3">
          <button type="button" aria-label="Atrasar 10 segundos" onClick={() => skip(-10)} className={`${ring} size-12 text-[#1d1611] hover:text-[#8a1620]`}>{skipIcon(true)}</button>
          <button type="button" aria-label={playing ? "Pausar" : "Reproducir"} onClick={toggle} className={`${ring} size-[68px] text-[#f6ead7] hover:scale-105`} style={{ background: red, boxShadow: "0 8px 18px rgba(138,22,32,.38), 0 1px 0 rgba(255,255,255,.25) inset" }}>
            <svg width="26" height="26" viewBox="0 0 16 16" aria-hidden style={{ marginLeft: playing ? 0 : 2 }}>{playing ? <path d="M3.5 2h3v12h-3zM9.5 2h3v12h-3z" fill="currentColor" /> : <path d="M4 1.5v13L14 8z" fill="currentColor" />}</svg>
          </button>
          <button type="button" aria-label="Adelantar 10 segundos" onClick={() => skip(10)} className={`${ring} size-12 text-[#1d1611] hover:text-[#8a1620]`}>{skipIcon(false)}</button>
        </div>

        <div className="flex items-center justify-between px-5 pb-5 pt-3">
          <button type="button" aria-label="Anterior" onClick={() => step(-1)} className="flex size-11 items-center justify-center rounded-full border border-[#1d1611]/70 text-[#1d1611] transition hover:border-[#8a1620] hover:text-[#8a1620] active:scale-90 focus-visible:outline-2 focus-visible:outline-[#8a1620]">{arrow(true)}</button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Audios">
            {items.map((d, n) => (
              <button key={n} type="button" role="tab" aria-selected={n === i} aria-label={d.name} onClick={() => { setDir(n > i ? 1 : -1); go(n) }} className="h-2 rounded-full transition-all duration-300" style={{ width: n === i ? 26 : 8, background: n === i ? red : "rgba(29,22,17,.28)" }} />
            ))}
          </div>
          <button type="button" aria-label="Siguiente" onClick={() => step(1)} className="flex size-11 items-center justify-center rounded-full border border-[#1d1611]/70 text-[#1d1611] transition hover:border-[#8a1620] hover:text-[#8a1620] active:scale-90 focus-visible:outline-2 focus-visible:outline-[#8a1620]">{arrow(false)}</button>
        </div>
      </div>
    </div>
  )
}

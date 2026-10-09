import { useEffect, useRef, useState, type CSSProperties } from "react"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /juliana-3 · Dos dos dos. Lienzo = public/juliana3/bg.webp (938×1819, sin texto, sin chevrón ni raya del kicker, sin números/textos/flechas de las tarjetas).
 * Origen: PDF índice 16 (938×1668); filas 88–1668 (la barra azul oscuro con "JULIANA VELÁSQUEZ 03/04" es la real del Shell),
 * estirado sólo en papel (tools/juliana3.json + tools/stretch_juliana3.py). Coordenadas: x = x del PDF; y = y NUEVA
 * (por fila: y_pdf + D, con D1 = 117.2, D2 = 126.8, D3 = 134.8; arriba el título casi no se mueve).
 * Las 3 miniaturas (fotos del usuario insertadas con tools/replace_juliana3_photos.py; el play es HTML), la estrella, las notas manuscritas, las flores, las películas y el vinilo quedan en la imagen.
 * Cada fila (miniatura + tarjeta) es un botón: al tocarlo la flecha avanza (como en los hubs) y se abre un modal con el video de esa versión.
 */
const W = 938, H = 1819
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#0b1220"
const blue = "#24476f"
const GO_MS = 420

type Version = { key: string; line2: string; src?: string; yt?: string }
/** `yt` = id de YouTube (autoplay mudo); `src` = archivo propio. */
const versions: Version[] = [
  { key: "Versión Original", line2: "Original", yt: "X6OncamTHV4" },
  { key: "Versión Acústica", line2: "Acústica", yt: "-JvI8Qh7GIE" },
  { key: "Versión en Vivo", line2: "en Vivo", yt: "67HKO-oPhmU" },
]

type Rect = { l: number; t: number; w: number; h: number }
type Row = {
  n: string; l2: string; D: number
  nx: number; numTop: number; lineX: number; lineY: number; txX: number; txC: number; cx: number; cy: number
  thumb: Rect; card: Rect; rot: number; nsx: number; play: [number, number]
}
const rows: Row[] = [
  { n: "01", l2: "Original", D: 117.2, nx: 630, numTop: 712, lineX: 631, lineY: 757, txX: 635, txC: 778, cx: 660.5, cy: 858.5, thumb: { l: 168, t: 668, w: 420, h: 238 }, card: { l: 586, t: 676, w: 204, h: 229 }, rot: -1, nsx: .9, play: [378, 902] },
  { n: "02", l2: "Acústica", D: 126.8, nx: 657.5, numTop: 959, lineX: 657, lineY: 1002, txX: 660, txC: 1024, cx: 686.5, cy: 1102, thumb: { l: 200, t: 920, w: 408, h: 218 }, card: { l: 612, t: 930, w: 184, h: 218 }, rot: -.5, nsx: .85, play: [403.5, 1155] },
  { n: "03", l2: "en Vivo", D: 134.8, nx: 668, numTop: 1192, lineX: 669, lineY: 1239, txX: 671, txC: 1261, cx: 697, cy: 1340.5, thumb: { l: 208, t: 1160, w: 420, h: 235 }, card: { l: 625, t: 1158, w: 176, h: 230 }, rot: -.5, nsx: .95, play: [420, 1412] },
]

// título: [left, top (borde superior de las mayúsculas), alto de mayúsculas ≈ 85] de cada DOS (+16 de ajuste bajo el kicker)
const TITLE_DY = 16
const dos: [number, number][] = [[146, 195], [156, 286], [186, 377]]

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
    <Shell theme="juliana" label="JULIANA VELÁSQUEZ" counter="03/04">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ead3ba" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/938)] [--w:max(min(100vw,480px),calc((100dvh-44px)*938/1819))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/juliana3/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/juliana" label="Volver a Juliana" cx={83} cy={66} color={ink} />
          <p className="absolute whitespace-nowrap" style={{ left: k(140), top: k(52.7), fontFamily: "'IBM Plex Mono', monospace", fontSize: k(17.6), lineHeight: k(26), letterSpacing: ".13em" }}>
            DOS DOS DOS
          </p>
          <span aria-hidden className="absolute" style={{ left: k(300), top: k(65), width: k(193), height: k(2), background: ink }} />

          <h1 aria-label="Dos dos dos" className="f-bodoni">
            {dos.map(([x, y], i) => (
              <span key={i} aria-hidden className="absolute whitespace-nowrap [--tx:.84]" style={{ left: k(x - 3), top: k(y + TITLE_DY - 10.5), fontSize: k(110.8), lineHeight: k(110.8), fontStyle: "italic", fontWeight: 800, letterSpacing: "-.02em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
                DOS
              </span>
            ))}
          </h1>

          <p className="absolute whitespace-nowrap" style={{ left: k(204), top: k(595), fontFamily: "'Libre Caslon Text', serif", fontSize: k(22.6), lineHeight: k(31), color: ink }}>
            Una canción, tres versiones,<br />tres formas de sentirla.<br />Explora cada una y descubre<br />cómo cambia su significado.
          </p>

          {rows.map((r, i) => {
            const on = go === i
            const off = go !== null && !on
            const OX = r.thumb.l, OY = Math.min(r.thumb.t, r.card.t) + r.D
            const right = r.card.l + r.card.w, bottom = Math.max(r.thumb.t + r.thumb.h, r.card.t + r.card.h) + r.D
            const lx = (x: number) => x - OX
            const ly = (y: number) => y + r.D - OY
            return (
              <button
                key={r.n}
                type="button"
                aria-label={`${r.n} ${versions[i].key}: ver el video`}
                aria-haspopup="dialog"
                onClick={(e) => choose(i, e.currentTarget)}
                className="group absolute block cursor-pointer text-left outline-none transition-[opacity,filter] duration-300"
                style={{ left: k(OX), top: k(OY), width: k(right - OX), height: k(bottom - OY), opacity: off ? 0.3 : 1, filter: off ? "saturate(.4)" : undefined, "--c": blue } as CSSProperties}
              >

                {/* play sobre la miniatura (las fotos se insertaron en el fondo con tools/replace_juliana3_photos.py) */}
                <span aria-hidden className="absolute flex items-center justify-center rounded-full border-[1.6px] border-white/90 bg-black/10 text-white shadow-[0_2px_10px_rgba(0,0,0,.35)] backdrop-blur-[1px] transition-all duration-300 group-hover:scale-110" style={{ left: k(r.play[0] - OX - 36), top: k(r.play[1] - OY - 36), width: k(72), height: k(72) }}>
                  <svg style={{ width: k(26), height: k(30), marginLeft: k(4) }} viewBox="0 0 16 18" aria-hidden><path d="M2 1.2v15.6L15 9z" fill="currentColor" /></svg>
                </span>

                <span className="f-bodoni absolute whitespace-nowrap" style={{ left: k(lx(r.nx) - 5.3), top: k(ly(r.numTop) - 6), fontSize: k(38), lineHeight: k(40), fontStyle: "italic", fontWeight: 700, color: blue, transform: `scaleX(${r.nsx})`, transformOrigin: "left" }}>
                  {r.n}
                </span>
                <span aria-hidden className="absolute" style={{ left: k(lx(r.lineX)), top: k(ly(r.lineY) - 1), width: k(35), height: k(2), background: ink }} />
                <span className="absolute whitespace-nowrap" style={{ left: k(lx(r.txX)), top: k(ly(r.txC) - 12.5), fontFamily: "'Libre Caslon Text', serif", fontSize: k(20.8), lineHeight: k(28), color: ink }}>
                  Versión<br />{r.l2}
                </span>

                <span
                  className={`absolute flex items-center justify-center overflow-hidden rounded-full border-[1.4px] transition-all duration-300 group-active:scale-95 ${on ? "scale-110 " : ""}border-[#0b1220]`}
                  style={{ left: k(lx(r.cx) - 27), top: k(ly(r.cy) - 27), width: k(54), height: k(54) }}
                >
                  <svg className={on ? "arrow-go" : "transition-transform duration-300 group-hover:translate-x-[8%]"} style={{ width: k(24), height: k(16) }} viewBox="0 0 18 12" fill="none" aria-hidden>
                    <path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            )
          })}
        </div>
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

  return (
    <div className="ficha-scrim fixed inset-0 z-50 flex items-center justify-center p-4" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        role="dialog" aria-modal="true" aria-label={`Dos dos dos · ${v.key}`}
        className="ficha-panel relative w-full max-w-[440px] overflow-hidden"
        style={{ background: "linear-gradient(165deg,#f6ead7,#ecd7bb)", border: "1px solid rgba(40,50,70,.35)", borderRadius: 6, boxShadow: "0 24px 60px rgba(8,14,26,.6), 0 1px 0 rgba(255,255,255,.55) inset", color: ink }}
      >
        <div className="flex items-center justify-between px-5 pt-4" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: ".16em" }}>
          <span>DOS DOS DOS · {String(i + 1).padStart(2, "0")} / 03</span>
          <button ref={closeBtn} type="button" aria-label="Cerrar video" onClick={onClose} className="-m-2 flex size-10 items-center justify-center rounded-full transition hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-[#24476f]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div key={i} className="ficha-swap px-5 pb-1 pt-4" style={{ ["--dir" as string]: dir }}>
          <div className="relative aspect-video w-full overflow-hidden bg-black" style={{ boxShadow: "0 8px 22px rgba(8,14,26,.45)", outline: "6px solid #f8efe0" }}>
            {v.yt ? (
              <iframe
                title={v.key} className="absolute inset-0 size-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
                src={`https://www.youtube.com/embed/${v.yt}?autoplay=1&mute=1&rel=0&playsinline=1`}
              />
            ) : (
              <video src={v.src} className="absolute inset-0 size-full object-contain" autoPlay muted loop playsInline controls />
            )}
          </div>
          <p className="f-bodoni mt-5" style={{ fontSize: 15, fontStyle: "italic", color: blue }}>{String(i + 1).padStart(2, "0")}</p>
          <h2 className="f-bodoni" style={{ fontSize: "clamp(26px,8vw,34px)", lineHeight: 1.05, fontWeight: 700 }}>{v.key}</h2>
          <span aria-hidden className="mt-2 block h-[3px] w-14 rounded-full" style={{ background: blue }} />
        </div>

        <div className="flex items-center justify-between px-5 pb-5 pt-4">
          <button type="button" aria-label="Versión anterior" onClick={() => step(-1)} className="flex size-11 items-center justify-center rounded-full border border-[#0b1220] transition hover:bg-[#0b1220] hover:text-[#f3e9da] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#24476f]">{arrow(true)}</button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Versiones">
            {versions.map((d, n) => (
              <button key={d.key} type="button" role="tab" aria-selected={n === i} aria-label={d.key} onClick={() => { setDir(n > i ? 1 : -1); go(n) }} className="h-2 rounded-full transition-all duration-300" style={{ width: n === i ? 26 : 8, background: n === i ? blue : "rgba(11,18,32,.28)" }} />
            ))}
          </div>
          <button type="button" aria-label="Versión siguiente" onClick={() => step(1)} className="flex size-11 items-center justify-center rounded-full border border-[#0b1220] bg-[#0b1220] text-[#f3e9da] transition hover:border-[#24476f] hover:bg-[#24476f] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#24476f]">{arrow(false)}</button>
        </div>
      </div>
    </div>
  )
}

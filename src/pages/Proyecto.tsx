import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import Shell from "../kit/Shell"
import AudioModal from "./ProyectoAudioModal"

/**
 * Diseño nuevo (imagen "Pagina - 2.jpg", 1179×2556). El fondo (public/proyecto/bg.webp) es el render SIN texto:
 * disco, flores, estrella-divisor, líneas, miniaturas con marco, línea de tiempo y círculos "+" quedan en la imagen;
 * el papel es plano #efe8df. Los textos y el botón son HTML en unidades del lienzo (--k = ancho_css / 1179).
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const WINE = "#631413"
const INK = "#3a1010"
const LINE = "#461e1d"
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const play = { fontFamily: "'Playfair Display', serif" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic" } as const

const ROWS = [
  { text: <>¿De dónde nació todo?</>, top: 1601, sx: .926, dx: -3, src: "/media/proyecto-1.m4a", y0: 1546, h: 158, name: "¿De dónde nació todo?" },
  { text: <>¿Qué vivimos?</>, top: 1772, sx: .926, dx: 0, src: "/media/proyecto-2.m4a", y0: 1708, h: 170, name: "¿Qué vivimos?" },
  { text: <>¿Qué quedó de<br />esa experiencia?</>, top: 1931, sx: 1.01, dx: -6, src: "/media/proyecto-3.m4a", y0: 1885, h: 178, name: "¿Qué quedó de esa experiencia?" },
]

export default function Proyecto() {
  const audio = useRef<HTMLAudioElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  const listen = (i: number) => {
    const a = audio.current
    if (!a) return
    a.pause()
    a.src = ROWS[i].src
    a.currentTime = 0
    setOpen(i)
    void a.play().catch(() => {})
  }
  const close = () => { audio.current?.pause(); setOpen(null) }

  useEffect(() => {
    const a = audio.current
    return () => a?.pause()
  }, [])

  return (
    <Shell bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: INK }}
      >
        <img src="/proyecto/bg.webp?v=6" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(68), fontSize: k(62), lineHeight: k(70), fontWeight: 600, color: "#11110f", transform: "scaleX(.912)" }}>
          Habitar la música
        </p>
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoni, left: k(83), top: k(162), fontSize: k(41), lineHeight: k(52), fontWeight: 600, color: "#11110f", transform: "scaleX(.94)", transformOrigin: "left" }}>
          01 / Proyecto
        </p>

        <h1 data-m="h1" className="absolute whitespace-nowrap font-normal" style={{ ...play, fontStyle: "italic", fontWeight: 700, left: k(85), top: k(287), fontSize: k(98), lineHeight: k(91), color: WINE, transform: "scaleX(.903)", transformOrigin: "left" }}>
          La música<br />también se puede<br />habitar.
        </h1>

        <p data-m="p1" className="absolute whitespace-nowrap" style={{ ...mont, left: k(78), top: k(620), fontWeight: 500, fontSize: k(35), lineHeight: k(43), color: "#11110f" }}>
          Este proyecto nace de una pregunta:<br />
          <b style={{ fontWeight: 700, color: "#4a1010" }}>¿cómo hacer que la música pueda<br />sentirse más allá de escucharla?</b>
        </p>
        <p data-m="p2" className="absolute whitespace-nowrap" style={{ ...mont, left: k(78), top: k(795), fontWeight: 500, fontSize: k(35), lineHeight: k(43), color: "#11110f" }}>
          Exploramos cómo sus emociones,<br />atmósferas y narrativas pueden<br />encontrar otras formas de existir a<br />través del diseño.
        </p>

        <Link
          to="/universos"
          data-m="btn"
          className="absolute flex items-center justify-center whitespace-nowrap"
          style={{ ...play, left: k(146), top: k(1009), width: k(491), height: k(95), borderRadius: k(48), border: `${k(1.4)} solid ${LINE}`, color: INK, gap: k(30), fontWeight: 600, fontSize: k(44) }}
        >
          Conoce el proyecto
          <svg viewBox="0 0 54 36" style={{ width: k(46), height: k(31) }} fill="none" aria-hidden><path d="M1 18H52M36 3l16 15-16 15" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>

        <h2 data-m="tres" className="absolute inset-x-0 whitespace-nowrap text-center font-normal" style={{ ...play, fontStyle: "italic", fontWeight: 700, top: k(1287), fontSize: k(82), lineHeight: k(81), color: WINE, paddingLeft: k(10), transform: "scaleX(.988)" }}>
          Tres miradas,<br />una experiencia.
        </h2>

        <audio ref={audio} preload="none" />

        {ROWS.map((r, i) => (
          <button
            key={`b${i}`}
            type="button"
            aria-label={`${r.name}: escuchar`}
            aria-haspopup="dialog"
            onClick={() => listen(i)}
            className="absolute block cursor-pointer transition-transform duration-150 active:scale-[.99]"
            style={{ left: k(222), width: k(860), top: k(r.y0), height: k(r.h), zIndex: 2 }}
          />
        ))}

        {ROWS.map((r, i) => (
          <p key={i} data-m={`row${i}`} className="pointer-events-none absolute whitespace-nowrap text-center" style={{ ...play, fontStyle: "italic", fontWeight: 700, left: k(718 + r.dx - 230), width: k(460), transform: `scaleX(${r.sx})`, top: k(r.top - 12), fontSize: k(46), lineHeight: k(49), color: WINE }}>
            {r.text}
          </p>
        ))}

        <p data-m="end" className="absolute whitespace-nowrap text-center" style={{ ...mont, left: k(603.5 - 450), width: k(900), top: k(2160), fontWeight: 500, fontSize: k(36), lineHeight: k(43), color: "#11110f", transform: "scaleX(.952)" }}>
          Este proyecto fue nuestro camino para<br />descubrir que la música también puede tomar<br />forma, despertar los sentidos y convertirse en<br />una experiencia que permanece.
        </p>
      </div>
      {open !== null && <AudioModal i={open} items={ROWS} audio={audio} go={listen} onClose={close} />}
    </Shell>
  )
}

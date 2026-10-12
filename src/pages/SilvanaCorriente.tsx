import { useState } from "react"
import BackChevron from "../kit/BackChevron"
import PaperCurrent from "../kit/PaperCurrent"
import Shell from "../kit/Shell"
import { useYouTube } from "../kit/useYouTube"

/**
 * /silvana-3 · La corriente. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 12, 1179×2556). Fondo = public/silvana3/bg.webp: render SIN
 * texto (flores, banda verde, nota de papel con el sol, collage de abajo). El diseño dejó vacío el espacio del medio: ahí va una
 * "corriente" interactiva (kit/PaperCurrent.tsx: tiras de papel recortado que ondulan solas, se levantan y mandan una onda al
 * tocar). Misma función que el estanque anterior: el primer toque arranca con sonido el YouTube oculto (sólo audio).
 * Textos y flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179).
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const YT = "OpI5H246ziw" // sonido de fondo: video de YouTube oculto (sólo audio), arranca con el primer toque en la corriente
const POND = { x: 0, y: 930, w: 1000, h: 710 }   // ventana de la corriente (unidades del lienzo)

export default function SilvanaCorriente() {
  const [touched, setTouched] = useState(false)
  const audio = useYouTube(YT)

  return (
    <Shell theme="silvana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <div {...audio.hostEl} />
        <img src="/silvana3/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(72), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(1)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/silvana" label="Volver a Lo que permanece" cx={114} cy={186.5} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(154), top: k(169), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.956)", transformOrigin: "left" }}>
          Lo que permanece/ 03
        </p>

        <h1 className="m-0 font-normal">
          <span data-m="la" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(100), top: k(278), fontSize: k(196.5), lineHeight: k(197), fontWeight: 700, color: "#000", transform: "scaleX(1.088)", transformOrigin: "left" }}>La</span>
          <span data-m="corr" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(76), top: k(449.5), fontSize: k(207), lineHeight: k(207), fontWeight: 700, color: "#1a175e", transform: "scaleX(.972)", transformOrigin: "left" }}>Corriente</span>
        </h1>
        <p data-m="sub" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(90), top: k(709), fontSize: k(80), lineHeight: k(95), fontWeight: 400, color: "#3b523b", transform: "scaleX(1.034)", transformOrigin: "left" }}>
          ¿Qué pasa cuando algo<br />cambia de forma?
        </p>

        {/* la corriente: interactiva (ondas y desvíos al tocar; el primer toque inicia el audio) */}
        <PaperCurrent
          label="Corriente de agua: toca para crear ondas y activar el sonido"
          onFirstTouch={() => { setTouched(true); audio.play() }}
          className="absolute outline-none"
          style={{ left: k(POND.x), top: k(POND.y), width: k(POND.w), height: k(POND.h), WebkitTapHighlightColor: "transparent" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute flex flex-col items-center transition-opacity duration-700"
            style={{ left: k(430 - 150), top: k(92), width: k(300), opacity: touched ? 0 : 1, color: "#26381f" }}
          >
            <svg className="touch-hint" style={{ width: k(72), height: k(94) }} viewBox="0 0 64 84" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <circle className="touch-dot" cx="32" cy="4" r="1.7" fill="currentColor" stroke="none" />
              <path className="touch-arc touch-arc-1" d="M9.5 28A24 24 0 0 1 54.5 28" />
              <path className="touch-arc touch-arc-2" d="M18 35.5A14.5 14.5 0 0 1 46 35.5" />
              <path className="touch-hand" transform="translate(-1.6 0)" d="M28.4 57V38.2a3.5 3.5 0 0 1 7 0V48a3.1 3.1 0 0 1 5.9.1 3.1 3.1 0 0 1 5.5 1.2 3 3 0 0 1 5 2.6V60c0 7.6-4 13.2-11.2 13.2h-3.3c-5 0-8.3-2.4-10.6-6.2L20.2 58a3 3 0 0 1 5-3.4l3.2 3.6" />
            </svg>
            <span className="whitespace-nowrap" style={{ fontFamily: "Montserrat, sans-serif", marginTop: k(22), fontSize: k(27), letterSpacing: ".2em", paddingLeft: ".2em", fontWeight: 500 }}>TOCA Y DESCUBRE</span>
          </span>
        </PaperCurrent>

        <p data-m="nota" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(1774), fontSize: k(64), lineHeight: k(64), fontWeight: 400, color: "#7a8a63", transform: `translateX(${k(-21)}) scaleX(.916)` }}>
          A veces, lo que parece<br />un cambio, también<br />es un comienzo.
        </p>
      </div>
    </Shell>
  )
}

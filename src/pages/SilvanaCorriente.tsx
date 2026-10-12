import BackChevron from "../kit/BackChevron"
import MusicBox from "../kit/MusicBox"
import Shell from "../kit/Shell"
import { useYouTube } from "../kit/useYouTube"

/**
 * /silvana-3 · La corriente. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 12, 1179×2556). Fondo = public/silvana3/bg.webp: render SIN
 * texto (flores, banda verde, nota de papel con el sol, collage de abajo). El diseño dejó vacío el espacio del medio: ahí va una
 * "caja musical" (kit/MusicBox.tsx): una mariposa de papel recortado que, al tocarla, vibra, dibuja ondas y arranca el sonido
 * (YouTube oculto, sólo audio); al tocarla otra vez se pausa. Sin reproductor visible.
 * Textos y flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179).
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const YT = "OpI5H246ziw" // sonido de fondo: video de YouTube oculto (sólo audio), arranca al tocar la mariposa
const MB = { x: 190, y: 985, w: 800, h: 600 }   // ventana de la caja musical (unidades del lienzo; la mariposa queda en su centro)

export default function SilvanaCorriente() {
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

        {/* caja musical: la mariposa de papel vibra, dibuja ondas y arranca el sonido (YouTube oculto, sólo audio) */}
        <MusicBox
          label={audio.playing ? "Pausar el sonido de la corriente" : "Tocar la mariposa para escuchar el sonido de la corriente"}
          playing={audio.playing}
          onToggle={audio.toggle}
          className="absolute"
          style={{ left: k(MB.x), top: k(MB.y), width: k(MB.w), height: k(MB.h) }}
        />
        <p aria-live="polite" className="pointer-events-none absolute inset-x-0 whitespace-nowrap text-center" style={{ fontFamily: "Montserrat, sans-serif", top: k(MB.y + MB.h - 14), fontSize: k(27), letterSpacing: ".2em", fontWeight: 500, color: "#26381f" }}>
          {audio.playing ? "SUENA · TOCA PARA PAUSAR" : "TOCA LA MARIPOSA"}
        </p>

        <p data-m="nota" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(1774), fontSize: k(64), lineHeight: k(64), fontWeight: 400, color: "#7a8a63", transform: `translateX(${k(-21)}) scaleX(.916)` }}>
          A veces, lo que parece<br />un cambio, también<br />es un comienzo.
        </p>
      </div>
    </Shell>
  )
}

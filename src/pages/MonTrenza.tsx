import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import YouTubeEmbed from "../kit/YouTubeEmbed"

/**
 * /mon-4 · La trenza. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 8, 1179×2556). Fondo = public/mon4/bg.webp: render SIN texto,
 * con la foto pegada ampliada ×1.16 y el hueco del video (tablero de transparencia en el PDF) pintado de oscuro. Textos y flecha de
 * volver son HTML en unidades del lienzo (--k = ancho_css / 1179). El video (YouTube, tramo 6:18 – 7:42, autoplay en silencio) llena
 * el hueco; la flor de la esquina va en el fondo y el video se recorta alrededor (clip-path): nada queda encima del iframe.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const YT = "Ai8vQWSpHRY" // YouTube; tramo 06:18 – 07:42
const START = 378, END = 462
const VID = { x: 118, y: 1207, w: 899, h: 582 }
// Recorte (coordenadas 0–1 del rectángulo del video, regla par-impar): deja fuera la silueta de la flor, pintada en el fondo.
const CLIP = "M-0.0100 -0.0100 L1.0100 -0.0100 L1.0100 1.0100 L-0.0100 1.0100Z M-0.0089 0.7062 L-0.0089 1.0137 L0.1791 1.0137 L0.1791 0.9983 L0.1713 0.9880 L0.1758 0.9639 L0.1758 0.9261 L0.1713 0.9038 L0.1680 0.9003 L0.1613 0.9003 L0.1591 0.8969 L0.1613 0.8935 L0.1613 0.8849 L0.1580 0.8797 L0.1546 0.8797 L0.1513 0.8763 L0.1224 0.8746 L0.1212 0.8780 L0.1079 0.8814 L0.0879 0.9003 L0.0623 0.9399 L0.0601 0.9381 L0.0623 0.9330 L0.0623 0.9261 L0.0679 0.9021 L0.0667 0.8814 L0.0578 0.8797 L0.0590 0.8608 L0.0489 0.8625 L0.0356 0.8729 L0.0311 0.8797 L0.0300 0.8780 L0.0323 0.8351 L0.0300 0.8282 L0.0289 0.8007 L0.0256 0.7921 L0.0256 0.7801 L0.0234 0.7698 L0.0189 0.7577 L0.0178 0.7474 L0.0033 0.7199 L0.0033 0.7062Z"

export default function MonTrenza() {
  return (
    <Shell theme="mon" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-[calc(50%-var(--w)/2)] w-[var(--w)] [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/mon4/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(79), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(1)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/mon" label="Volver a Lo que arde" cx={114} cy={193} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(150), top: k(170), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.956)", transformOrigin: "left" }}>
          Lo que arde/ 04
        </p>

        <h1 data-m="title" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(81), top: k(430.5), fontSize: k(141), lineHeight: k(141), fontWeight: 600, color: "#000", transform: "scaleX(1.063)", transformOrigin: "left" }}>
          La trenza
        </h1>
        <p data-m="sub" className="absolute whitespace-nowrap text-center" style={{ ...bodoniIt, left: k(100), width: k(600), top: k(627), fontSize: k(64.6), lineHeight: k(76), fontWeight: 400, color: "#f8af52", transform: "scaleX(1.052)" }}>
          ¿Qué existe<br />detrás de la obra ?
        </p>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ ...mont, left: k(64), top: k(840), fontSize: k(36), lineHeight: k(35) }}>
          En este escenario conocemos la<br />historia que habita detrás de la<br />artista. A través de una conversación<br />íntima, Mon Laferte comparte sus<br />raíces, sus memorias y cómo<br />todas esas experiencias también son<br />parte de su obra.
        </p>

        <svg width="0" height="0" className="absolute" aria-hidden focusable="false"><defs><clipPath id="mon4-video-clip" clipPathUnits="objectBoundingBox"><path clipRule="evenodd" d={CLIP} /></clipPath></defs></svg>

        {/* video: YouTube llenando el hueco de la foto pegada (YouTube centra el 16:9 por dentro y deja los controles a la vista) */}
        <div className="absolute overflow-hidden" style={{ left: k(VID.x), top: k(VID.y), width: k(VID.w), height: k(VID.h), background: "#1c1818", clipPath: "url(#mon4-video-clip)" }}>
          <YouTubeEmbed id={YT} title="La trenza · Mon Laferte" vars={{ start: START, end: END }} />
        </div>
      </div>
    </Shell>
  )
}

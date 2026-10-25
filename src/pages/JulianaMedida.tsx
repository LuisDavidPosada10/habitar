import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import YouTubeEmbed from "../kit/YouTubeEmbed"

/**
 * /juliana-4 · La pista. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 15, 1179×2556). Fondo = public/juliana1/bg.webp: render
 * SIN texto (nota de papel rasgado vacía, marco de foto, flores, collage), con el hueco del video (tablero de transparencia en el PDF)
 * pintado de oscuro y el pétalo que lo tapa pegado encima. Textos y flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179).
 * El video (YouTube, autoplay en silencio) llena el hueco y se recorta alrededor del pétalo (clip-path): nada queda encima del iframe.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 500, color: "#11110f" } as const
const YT = "Np7VdWbib5k" // La pista
const VID = { x: 126, y: 1021, w: 937, h: 603 }
// Recorte (coordenadas 0–1 del rectángulo del video, regla par-impar): deja fuera el pétalo, pintado en el fondo.
const CLIP = "M-0.0100 -0.0100 L1.0100 -0.0100 L1.0100 1.0100 L-0.0100 1.0100Z M0.0000 0.9250 L0.0000 0.9981 L0.0272 0.9981 L0.0260 0.9673 L0.0347 0.9596 L0.0347 0.9519 L0.0309 0.9462 L0.0248 0.9462 L0.0161 0.9288Z"

export default function JulianaMedida() {
  return (
    <Shell theme="juliana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-[calc(50%-var(--w)/2)] w-[var(--w)] [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/juliana1/bg.webp?v=6" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(75), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(1)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/juliana" label="Volver a Lo que florece" cx={113} cy={188.5} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(148), top: k(166.5), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.935)", transformOrigin: "left" }}>
          Lo que florece/ 04
        </p>

        <h1 data-m="title" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(83), top: k(285), fontSize: k(190), lineHeight: k(190), fontWeight: 700, color: "#1a175e", transform: "scaleX(1.014)", transformOrigin: "left" }}>
          La pista
        </h1>

        <p data-m="nota" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(664), fontSize: k(47.5), lineHeight: k(48), fontWeight: 400, color: "#457089", transform: `translateX(${k(-18.5)}) scaleX(.953)` }}>
          ¿Qué comienza a contarse cuando<br />todo está en silencio?
        </p>

        <svg width="0" height="0" className="absolute" aria-hidden focusable="false"><defs><clipPath id="juliana1-video-clip" clipPathUnits="objectBoundingBox"><path clipRule="evenodd" d={CLIP} /></clipPath></defs></svg>

        {/* video: YouTube llenando el hueco de la foto pegada */}
        <div className="absolute overflow-hidden" style={{ left: k(VID.x), top: k(VID.y), width: k(VID.w), height: k(VID.h), background: "#18181c", clipPath: "url(#juliana1-video-clip)" }}>
          <YouTubeEmbed id={YT} title="La pista · Juliana Velásquez" />
        </div>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ ...mont, left: k(220), top: k(1756), fontSize: k(38), lineHeight: k(43), transform: "scaleX(.948)", transformOrigin: "left" }}>
          En la última noche del año la ciudad<br />se siente distinta. En este espacio,<br />Juliana nos invita a descubrir cómo la<br />música también habita sus noches,<br />sus ideas y sus versiones más íntimas.
        </p>
      </div>
    </Shell>
  )
}

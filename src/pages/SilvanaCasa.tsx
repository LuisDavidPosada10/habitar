import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import YouTubeEmbed from "../kit/YouTubeEmbed"

/**
 * /silvana-1 · Casa. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 10, 1179×2556). Fondo = public/silvana1/bg.webp: render SIN texto,
 * con el hueco del video (tablero de transparencia en el PDF) pintado de oscuro y la flor de lis que lo tapa pegada encima. Textos y
 * flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179). El video (YouTube, autoplay en silencio) llena el hueco y
 * se recorta alrededor de la flor (clip-path): nada queda encima del iframe. La caja redondeada del párrafo es del fondo.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const YT = "jam_WxXiLEQ" // Silvana Estrada – Casa (Live on KEXP)
const VID = { x: 163, y: 998, w: 883, h: 567 }
// Recorte (coordenadas 0–1 del rectángulo del video, regla par-impar): deja fuera la silueta de la flor, pintada en el fondo.
const CLIP = "M-0.0100 -0.0100 L1.0100 -0.0100 L1.0100 1.0100 L-0.0100 1.0100Z M0.8655 0.1456 L0.8742 0.1456 L0.8767 0.1534 L0.8817 0.1592 L0.8817 0.1709 L0.8892 0.1709 L0.8892 0.1592 L0.8917 0.1553 L0.9240 0.1301 L0.9352 0.1165 L0.9415 0.1146 L0.9552 0.1029 L0.9664 0.0796 L0.9714 0.0816 L0.9714 0.0932 L0.9751 0.1010 L0.9826 0.1049 L0.9925 0.1029 L0.9975 0.1068 L1.0087 0.1068 L1.0087 -0.0155 L0.8879 -0.0155 L0.8892 0.0175 L0.8867 0.0311 L0.8817 0.0427 L0.8767 0.0699 L0.8767 0.0816 L0.8792 0.0874 L0.8767 0.1262 L0.8742 0.1359 L0.8655 0.1359Z"

export default function SilvanaCasa() {
  return (
    <Shell theme="silvana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-[calc(50%-var(--w)/2)] w-[var(--w)] [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/silvana1/bg.webp?v=4" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(71), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(1)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/silvana" label="Volver a Lo que permanece" cx={115} cy={185.5} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(150), top: k(164), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.956)", transformOrigin: "left" }}>
          Lo que permanece/ 01
        </p>

        <h1 data-m="title" className="absolute whitespace-nowrap font-normal" style={{ ...bodoni, left: k(85), top: k(287), fontSize: k(213), lineHeight: k(213), fontWeight: 500, color: "#000", transform: "scaleX(1.024)", transformOrigin: "left" }}>
          Casa
        </h1>
        <p data-m="sub" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(70), top: k(490), fontSize: k(68), lineHeight: k(81), fontWeight: 400, color: "#5f5f5f", transform: "scaleX(1.07)", transformOrigin: "left" }}>
          ¿De dónde viene<br />una voz?
        </p>

        <svg width="0" height="0" className="absolute" aria-hidden focusable="false"><defs><clipPath id="silvana1-video-clip" clipPathUnits="objectBoundingBox"><path clipRule="evenodd" d={CLIP} /></clipPath></defs></svg>

        {/* video: YouTube llenando el hueco de la foto pegada (YouTube centra el 16:9 por dentro y deja los controles a la vista) */}
        <div className="absolute overflow-hidden" style={{ left: k(VID.x), top: k(VID.y), width: k(VID.w), height: k(VID.h), background: "#1c1818", clipPath: "url(#silvana1-video-clip)" }}>
          <YouTubeEmbed id={YT} title="Casa · Silvana Estrada (Live on KEXP)" />
        </div>

        <p data-m="para" className="absolute whitespace-nowrap text-center" style={{ ...mont, left: k(106), width: k(538), top: k(1731), fontSize: k(36), lineHeight: k(35.5) }}>
          Un viaje al origen.<br />A los lugares, personas<br />y sonidos que sembraron<br />mi voz.
        </p>
      </div>
    </Shell>
  )
}

import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import YouTubeEmbed from "../kit/YouTubeEmbed"

/**
 * /mon-1 · No caber. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 5, 1179×2556). Fondo = public/mon1/bg.webp: render SIN
 * texto con el hueco de la foto pegada pintado de oscuro (en el PDF es un tablero de transparencia). Textos, flecha de volver
 * y video son HTML en unidades del lienzo (--k = ancho_css / 1179). Barra transparente; el lienzo cubre el alto.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const VID = { x: 118, y: 1001, w: 900, h: 582 }   // hueco de la foto pegada (marco ampliado ×1.16 en el fondo)
const YT = "7nXBiCEYZu0"
// Recorte (coordenadas 0–1 del rectángulo del video, regla par-impar): deja fuera la silueta de la flor, que va pintada en el fondo.
// Así NADA se superpone al iframe (ni z-index ni imágenes encima), y el video sigue recibiendo todos los toques.
const CLIP = "M-0.0100 -0.0100 L1.0100 -0.0100 L1.0100 1.0100 L-0.0100 1.0100Z M-0.0089 0.7182 L-0.0089 1.0137 L0.1811 1.0137 L0.1811 0.9966 L0.1722 0.9880 L0.1767 0.9656 L0.1767 0.9227 L0.1744 0.9089 L0.1711 0.9003 L0.1678 0.8986 L0.1633 0.9003 L0.1611 0.8969 L0.1622 0.8832 L0.1544 0.8763 L0.1278 0.8746 L0.1089 0.8814 L0.0878 0.9003 L0.0622 0.9399 L0.0611 0.9381 L0.0678 0.9038 L0.0678 0.8797 L0.0578 0.8780 L0.0600 0.8677 L0.0589 0.8591 L0.0533 0.8591 L0.0367 0.8711 L0.0311 0.8797 L0.0300 0.8780 L0.0322 0.8608 L0.0311 0.8093 L0.0289 0.7973 L0.0256 0.7904 L0.0256 0.7749 L0.0200 0.7595 L0.0189 0.7474 L0.0044 0.7199Z"

export default function MonNoCaber() {
  return (
    <Shell theme="mon" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-[calc(50%-var(--w)/2)] w-[var(--w)] [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/mon1/bg.webp?v=4" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(59), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: "scaleX(.912)" }}>
          Habitar la música
        </p>

        <BackChevron to="/mon" label="Volver a Lo que arde" cx={105} cy={182} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(144), top: k(157), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.956)", transformOrigin: "left" }}>
          Lo que arde/ 01
        </p>

        <h1 data-m="title" className="absolute whitespace-nowrap font-normal" style={{ ...bodoniIt, left: k(66), top: k(324), fontSize: k(176.5), lineHeight: k(176.5), fontWeight: 700, color: "#000", transform: "scaleX(.98)", transformOrigin: "left" }}>
          No caber
        </h1>
        <p data-m="sub" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(90), top: k(553), fontSize: k(88.7), lineHeight: k(119), fontWeight: 600, color: "#631413", transform: "scaleX(1.035)", transformOrigin: "left" }}>
          ¿Por qué tendría que<br />ser una sola cosa?
        </p>

        <svg width="0" height="0" className="absolute" aria-hidden focusable="false"><defs><clipPath id="mon1-video-clip" clipPathUnits="objectBoundingBox"><path clipRule="evenodd" d={CLIP} /></clipPath></defs></svg>

        {/* video: YouTube en el hueco de la foto pegada. El reproductor llena todo el hueco (YouTube centra el 16:9 por dentro y deja los controles
            a la vista); autoplay en silencio. La flor de la esquina va en el fondo y el video se recorta alrededor (clip-path): nada queda por encima del iframe. */}
        <div className="absolute overflow-hidden" style={{ left: k(VID.x), top: k(VID.y), width: k(VID.w), height: k(VID.h), background: "#1c1818", clipPath: "url(#mon1-video-clip)" }}>
          <YouTubeEmbed id={YT} title="No caber · Mon Laferte" />
        </div>

        <p data-m="para" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ top: k(1740), color: "#11110f", fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, fontSize: k(37), lineHeight: k(35) }}>
          En este escenario exploramos cómo Mon<br />Laferte ha desafiado etiquetas y ha construido<br />su identidad desde la contradicción,<br />abrazando todas sus versiones.
        </p>
      </div>
    </Shell>
  )
}

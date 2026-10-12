import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import YouTubeEmbed from "../kit/YouTubeEmbed"

/**
 * /juliana-4 · Mar adentro. Diseño nuevo (PDF "Pagina Web - final", pág. 3, 1179×2556). Fondo = public/juliana4/bg.webp: render SIN texto
 * (gaviota, marco de foto con cinta, hojas, faro, medusa, concha, coral y sello), con el hueco del video (tablero de transparencia en el PDF)
 * pintado de oscuro. Textos y flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179). El video (YouTube, autoplay en
 * silencio) llena el hueco del marco.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const NAVY = "#1a175e", STEEL = "#457089"
const YT = "_pF1q5hdcqY" // Mar adentro
const VID = { x: 152, y: 1156, w: 894, h: 575 }

export default function JulianaMarAdentro() {
  return (
    <Shell theme="juliana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-[calc(50%-var(--w)/2)] w-[var(--w)] [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/juliana4/bg.webp?v=6" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(74.5), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(-2)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/juliana" label="Volver a Lo que florece" cx={110.5} cy={187} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(141), top: k(164), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.932)", transformOrigin: "left" }}>
          Lo que florece/ 04
        </p>

        <h1 aria-label="Mar adentro" className="m-0 font-normal">
          <span data-m="mar" aria-hidden className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(335), top: k(354.7), fontSize: k(182), lineHeight: k(182), fontWeight: 400, color: NAVY, transform: "scaleX(1.132)", transformOrigin: "left" }}>MAR</span>
          <span data-m="adentro" aria-hidden className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(78.7), top: k(578.8), fontSize: k(182), lineHeight: k(182), fontWeight: 400, color: STEEL, transform: "scaleX(1.117)", transformOrigin: "left" }}>ADENTRO</span>
        </h1>
        <p data-m="sub" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(841), fontSize: k(63), lineHeight: k(69), fontWeight: 400, color: NAVY, transform: "scaleX(1.095)" }}>
          ¿Qué aparece cuando dejamos<br />de mirar solamente la superficie?
        </p>

        {/* video: YouTube llenando el hueco de la foto pegada */}
        <div className="absolute overflow-hidden" style={{ left: k(VID.x), top: k(VID.y), width: k(VID.w), height: k(VID.h), background: "#18181c" }}>
          <YouTubeEmbed id={YT} title="Mar adentro · Juliana Velásquez" />
        </div>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ ...mont, left: k(227), top: k(1962), fontSize: k(36), lineHeight: k(40), transform: "scaleX(.94)", transformOrigin: "left" }}>
          Una experiencia para sumergirse.<br />Mar Adentro es un viaje sonoro<br />que nos invita a detenernos, respirar<br />y habitar la música desde otro lugar.
        </p>
      </div>
    </Shell>
  )
}

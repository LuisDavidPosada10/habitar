import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /silvana-4 · Vendrán suaves lluvias. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 13, 1179×2556). Fondo = public/silvana4/bg.webp: render
 * SIN texto (golondrinas, nota de papel rasgado, collage, dados, cámara, arco…). La píldora de Spotify de la imagen queda TAPADA por la
 * de HTML (mismo tamaño y color): es un enlace a la playlist. Textos y flecha de volver son HTML en unidades del lienzo
 * (--k = ancho_css / 1179). Barra transparente; el lienzo cubre el alto.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const PLAYLIST = "https://open.spotify.com/playlist/5nwGjVnJ3v38zcRJfoP4k5"
const PILL = { x: 166, y: 1307, w: 851, h: 188 }
const SAGE = "#7a8a63"

export default function SilvanaLluvias() {
  return (
    <Shell theme="silvana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/silvana4/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(69), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(1)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/silvana" label="Volver a Lo que permanece" cx={114.5} cy={183.5} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(148), top: k(162), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.956)", transformOrigin: "left" }}>
          Lo que permanece/ 04
        </p>

        <h1 className="m-0 font-normal">
          <span data-m="t1" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(266), top: k(327), fontSize: k(162), lineHeight: k(162), fontWeight: 600, color: "#000", transform: "scaleX(.968)", transformOrigin: "left" }}>Vendrán</span>
          <span data-m="t2" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(72), top: k(467), fontSize: k(164), lineHeight: k(164), fontWeight: 600, color: "#005a64", transform: "scaleX(.944)", transformOrigin: "left" }}>suaves</span>
          <span data-m="t3" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(583), top: k(466), fontSize: k(161), lineHeight: k(161), fontWeight: 600, color: "#000", transform: "scaleX(.985)", transformOrigin: "left" }}>lluvias</span>
        </h1>

        <p data-m="nota" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(20), top: k(826), fontSize: k(66), lineHeight: k(73), fontWeight: 400, color: SAGE, transform: "scaleX(1.049)", transformOrigin: "left" }}>
          ¿Qué permanece<br />cuando el tiempo pasa?
        </p>

        {/* playlist de Spotify: tapa por completo la píldora del fondo */}
        <a
          href={PLAYLIST} target="_blank" rel="noopener noreferrer" aria-label="Escucha la playlist Vendrán suaves lluvias en Spotify (se abre en otra pestaña)"
          className="group absolute block rounded-full outline-none transition-[transform,filter] duration-200 hover:brightness-110 focus-visible:brightness-110 active:scale-[.985]"
          style={{ left: k(PILL.x), top: k(PILL.y), width: k(PILL.w), height: k(PILL.h), background: SAGE }}
        >
          <svg className="absolute" style={{ left: k(64), top: k(PILL.h / 2 - 59), width: k(118), height: k(118) }} viewBox="0 0 62 62" fill="none" aria-hidden>
            <circle cx="31" cy="31" r="31" fill="#b8c5ba" />
            <path d="M14 22.5c11-3.4 24-2.6 35 3.2M16.5 31.5c9.4-2.6 19.4-1.8 28 2.8M19 40.2c7.6-1.9 15.2-1.3 21.6 2" stroke={SAGE} strokeWidth="4.8" strokeLinecap="round" />
          </svg>
          <span aria-hidden className="absolute" style={{ left: k(224), top: k(PILL.h / 2 - 53), width: k(3), height: k(106), background: "rgba(238,232,223,.55)" }} />
          <span data-m="p1" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(302), top: k(43), fontSize: k(55), lineHeight: k(64), fontWeight: 400, color: "#eee8df", transform: "scaleX(1.07)", transformOrigin: "left" }}>
            Escucha la playlist
          </span>
          <span data-m="p2" className="absolute whitespace-nowrap" style={{ fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 500, left: k(312), top: k(112), fontSize: k(35.6), lineHeight: k(40), color: "#eee8df" }}>
            Vendrán suaves lluvias
          </span>
        </a>

        <p data-m="para" className="absolute whitespace-nowrap" style={{ ...mont, left: k(561), top: k(1876), fontSize: k(36), lineHeight: k(41) }}>
          También en la lluvia hay<br />belleza. Todo vuelve,<br />aunque sea distinto.
        </p>
      </div>
    </Shell>
  )
}

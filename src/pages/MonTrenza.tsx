import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /mon-4 · La trenza. Lienzo = public/mon4/bg.webp (935×1916, sin texto, sin ícono de play ni la estrella derecha).
 * Origen: PDF índice 7 (935×1663); filas 96–1663, estirado sólo en papel (tools/mon4.json + tools/stretch_mon4.py).
 * Coordenadas: x = x del PDF; y = y NUEVA (mapa impreso por stretch_mon4.py). Las notas manuscritas, fotos y el trazo rojo
 * bajo el párrafo quedan en la imagen. El rectángulo gris es el "video": el iframe de YouTube se monta al cargar la página y arranca solo, en silencio
 * (los navegadores sólo permiten autoplay mudo); start=378 y end=462: 6:18 – 7:42.
 */
const W = 935, H = 1916
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1d1611"
const red = "#8a1620"
const YT = "Ai8vQWSpHRY" // YouTube; tramo 06:18 – 07:42
const START = 378, END = 462
const VID = { x: 96, y: 733, w: 747, h: 465 }

export default function MonTrenza() {

  return (
    <Shell theme="mon">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#eed3bc" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/935)] [--w:max(min(100vw,480px),calc((100dvh-44px)*935/1916))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/mon4/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/mon" label="Volver a Autopoética" cx={95} cy={59} />
          <p className="absolute whitespace-nowrap" style={{ left: k(131), top: k(44), fontFamily: "'IBM Plex Mono', monospace", fontSize: k(24), lineHeight: k(30), letterSpacing: ".062em" }}>
            AUTOPOÉTICA / 04
          </p>

          <p className="f-bodoni absolute whitespace-nowrap [--tx:.72]" style={{ left: k(86), top: k(140), fontSize: k(46), lineHeight: k(56), fontWeight: 400, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>04</p>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.555]" style={{ left: k(85), top: k(250), fontSize: k(114), lineHeight: k(100), fontWeight: 700, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            LA TRENZA
          </h1>
          <svg className="absolute" style={{ left: k(78), top: k(352), width: k(410), height: k(24) }} viewBox="0 0 410 24" fill={red} aria-hidden>
            <path d="M3 17C90 12 250 7 404 5c-130 6-290 12-401 15z" />
          </svg>
          <p className="absolute whitespace-nowrap" style={{ left: k(88), top: k(400), fontFamily: "'Libre Caslon Text', serif", fontSize: k(41), lineHeight: k(52) }}>
            ¿Qué existe<br />detrás de la obra?
          </p>

          {/* video */}
          <div className="absolute" style={{ left: k(VID.x), top: k(VID.y), width: k(VID.w), height: k(VID.h) }}>
            <iframe
              title="La trenza · Mon Laferte"
              src={`https://www.youtube.com/embed/${YT}?autoplay=1&mute=1&start=${START}&end=${END}&playsinline=1&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
              className="absolute inset-0 size-full border-0 bg-black"
            />
          </div>

          <p className="absolute whitespace-nowrap" style={{ left: k(140), top: k(1283), fontFamily: "'Libre Caslon Text', serif", fontSize: k(24.55), lineHeight: k(33.5), color: ink }}>
            En este escenario conocemos la historia que habita<br />detrás de la artista. A través de una conversación íntima,<br />Mon Laferte comparte sus raíces, sus memorias y cómo<br />todas esas experiencias también son parte de su obra.
          </p>

          {/* estrella (trazos a mano) */}
          <svg className="absolute" style={{ left: k(832), top: k(1280), width: k(96), height: k(130) }} viewBox="0 0 96 130" fill="none" stroke={ink} strokeLinecap="round" aria-hidden>
            <path d="M52 4C50 40 48 86 44 126" strokeWidth="5" />
            <path d="M6 28C34 52 64 78 90 104" strokeWidth="5" />
            <path d="M90 22C62 50 34 82 8 108" strokeWidth="5" />
            <path d="M12 66C34 64 58 62 86 60" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </Shell>
  )
}

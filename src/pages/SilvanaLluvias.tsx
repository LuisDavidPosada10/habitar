import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /silvana-4 · Vendrán suaves lluvias. Lienzo = public/silvana4/bg.webp (939×1920, sin texto).
 * Origen: PDF índice 12 (939×1670); filas 77–1670 (la barra verde es la real del Shell), estirado sólo en papel
 * (tools/silvana4.json + tools/stretch_silvana4.py). Coordenadas: x = x del PDF; y = y NUEVA (mapa de stretch_silvana4.py).
 * Fotos, flores, nota "Cielos que siempre vuelven", regla bajo el subtítulo, línea del contador y la flecha ↓ final quedan en la imagen.
 * La píldora de Spotify va ENCIMA de la que viene en la imagen (la tapa por completo): es un enlace a la playlist.
 */
const W = 939, H = 1920
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1c231b"
const PLAYLIST = "https://open.spotify.com/playlist/5nwGjVnJ3v38zcRJfoP4k5"
const PILL = { x: 146, y: 1399, w: 651, h: 126 }

export default function SilvanaLluvias() {
  return (
    <Shell theme="silvana">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ecd4b8" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/939)] [--w:max(min(100vw,480px),calc((100dvh-44px)*939/1920))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/silvana4/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/silvana" label="Volver a Silvana" cx={95} cy={77} color={ink} />
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(138), top: k(60), fontSize: k(20.5), lineHeight: k(30), letterSpacing: ".13em", fontWeight: 400 }}>
            SILVANA ESTRADA &nbsp;/&nbsp; 04
          </p>
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(778), top: k(58), fontSize: k(21.5), lineHeight: k(30), letterSpacing: ".2em", fontWeight: 400 }}>
            04 / 04
          </p>

          <p className="f-bodoni absolute whitespace-nowrap [--tx:.96]" style={{ left: k(78), top: k(168), fontSize: k(234), lineHeight: k(234), fontStyle: "italic", fontWeight: 700, color: "#a39784", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            04
          </p>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.727]" style={{ left: k(86), top: k(391), fontSize: k(83), lineHeight: k(65), fontStyle: "italic", fontWeight: 800, letterSpacing: "-.01em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            VENDRÁN<br />SUAVES<br />LLUVIAS
          </h1>
          <p className="absolute whitespace-nowrap" style={{ left: k(87), top: k(612), fontFamily: "'Libre Caslon Text', serif", fontSize: k(29.3), lineHeight: k(40), color: ink }}>
            ¿Qué permanece<br />cuando el tiempo pasa?
          </p>

          <p className="absolute whitespace-nowrap" style={{ left: k(85), top: k(823), fontFamily: "'Libre Caslon Text', serif", fontSize: k(22.3), lineHeight: k(32), color: "#2b2a22" }}>
            También en la lluvia<br />hay belleza.<br />Todo vuelve,<br />aunque sea distinto.
          </p>

          {/* playlist de Spotify */}
          <a
            href={PLAYLIST} target="_blank" rel="noopener noreferrer" aria-label="Escucha la playlist Vendrán suaves lluvias en Spotify (se abre en otra pestaña)"
            className="group absolute block rounded-full outline-none transition-[transform,filter] duration-200 hover:brightness-125 focus-visible:brightness-125 active:scale-[.985]"
            style={{ left: k(PILL.x), top: k(PILL.y), width: k(PILL.w), height: k(PILL.h), background: ink, boxShadow: "0 6px 18px rgba(20,25,15,.35)" }}
          >
            <svg className="absolute" style={{ left: k(68), top: k(PILL.h / 2 - 31), width: k(62), height: k(62) }} viewBox="0 0 62 62" fill="none" aria-hidden>
              <circle cx="31" cy="31" r="31" fill="#f6efe2" />
              <path d="M14 22.5c11-3.4 24-2.6 35 3.2M16.5 31.5c9.4-2.6 19.4-1.8 28 2.8M19 40.2c7.6-1.9 15.2-1.3 21.6 2" stroke={ink} strokeWidth="4.8" strokeLinecap="round" />
            </svg>
            <span aria-hidden className="absolute" style={{ left: k(168), top: k(PILL.h / 2 - 29), width: k(2), height: k(58), background: "rgba(243,233,218,.5)" }} />
            <span className="f-mont absolute whitespace-nowrap" style={{ left: k(204), top: k(PILL.h / 2 - 31), fontSize: k(17.4), lineHeight: k(26), letterSpacing: ".2em", fontWeight: 500, color: "#f3e9da" }}>
              ESCUCHA LA PLAYLIST
            </span>
            <span className="f-mont absolute whitespace-nowrap" style={{ left: k(204), top: k(PILL.h / 2 + 1), fontSize: k(15.2), lineHeight: k(24), letterSpacing: ".17em", fontWeight: 400, color: "#d9cdb8" }}>
              VENDRÁN SUAVES LLUVIAS
            </span>
            <svg className="absolute transition-transform duration-300 group-hover:translate-x-[22%]" style={{ left: k(556), top: k(PILL.h / 2 - 9), width: k(38), height: k(18) }} viewBox="0 0 38 18" fill="none" aria-hidden>
              <path d="M1 9h35M28 1.5L36 9l-8 7.5" stroke="#f3e9da" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </Shell>
  )
}

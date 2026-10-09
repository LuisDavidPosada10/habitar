import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { fmt, usePlayback } from "../kit/Players"

/**
 * /silvana-2 · Te guardo. Lienzo = public/silvana2/bg.webp (942×1929, sin texto ni reproductor).
 * Origen: PDF índice 10 (942×1670); filas 79–1670 (la barra verde es la real del Shell), estirado sólo en papel
 * (tools/silvana2.json + tools/patch_silvana2.py + tools/stretch_silvana2.py). Coordenadas: x = x del PDF; y = y NUEVA.
 * Foto, hojas, flor, nota manuscrita, reglas cortas, la línea del contador y la flecha ↓ final quedan en la imagen.
 * El audio es un archivo propio (public/media/te-guardo.mp3, <audio> real: play/pausa, buscar y tiempos reales); las barras del waveform
 * salen de medir el diseño.
 */
const W = 942, H = 1929
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1c231b"
const AUDIO = "/media/te-guardo.mp3"
const BARS_C = 1139 // y nueva del centro del waveform
// [x, alto] de cada barra (medidas del diseño)
const bars: [number, number][] = [[360,11],[367,12],[375,19],[383,16],[390,36],[398,51],[406,72],[414,52],[421,30],[429,20],[436,21],[443,31],[451,34],[458,25],[465,35],[473,30],[480,49],[488,72],[497,93],[505,73],[512,48],[520,33],[527,30],[534,23],[542,15],[550,18],[558,17],[565,15],[571,28],[580,41],[587,28],[595,42],[603,69],[611,102],[618,82],[626,55],[634,40],[641,18],[649,15],[656,22],[665,40],[673,23],[681,29],[688,32],[697,20],[705,29],[713,52],[721,79],[729,106],[737,87],[746,61],[756,31],[763,18],[771,32],[778,13]]
const LINE = { x: 160, w: 637, y: 1239 }

export default function SilvanaTeGuardo() {
  const p = usePlayback(204, AUDIO)
  const prog = p.t / (p.dur || 1)
  return (
    <Shell theme="silvana">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ecd4b8" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/942)] [--w:max(min(100vw,480px),calc((100dvh-44px)*942/1929))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          {p.mediaProps && <audio {...p.mediaProps} />}
          <img src="/silvana2/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/silvana" label="Volver a Silvana" cx={95} cy={78} color={ink} />
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(135), top: k(60), fontSize: k(20.5), lineHeight: k(30), letterSpacing: ".1em", fontWeight: 400 }}>
            SILVANA ESTRADA &nbsp;/&nbsp; 02
          </p>
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(779), top: k(58), fontSize: k(21.5), lineHeight: k(30), letterSpacing: ".2em", fontWeight: 400 }}>
            02 / 04
          </p>

          <p className="f-bodoni absolute whitespace-nowrap [--tx:.88]" style={{ left: k(92), top: k(149), fontSize: k(239), lineHeight: k(239), fontStyle: "italic", fontWeight: 700, color: "#a89c80", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            02
          </p>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.745]" style={{ left: k(92), top: k(376), fontSize: k(104), lineHeight: k(95), fontStyle: "italic", fontWeight: 800, letterSpacing: "-.01em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            TE<br />GUARDO
          </h1>
          <p className="absolute whitespace-nowrap" style={{ left: k(93), top: k(593), fontFamily: "'Libre Caslon Text', serif", fontSize: k(31.7), lineHeight: k(41), color: ink }}>
            ¿Qué hacemos con<br />aquello que todavía<br />queremos conservar?
          </p>

          {/* reproductor */}
          <p className="absolute whitespace-nowrap" style={{ left: k(345), top: k(970), fontFamily: "'Libre Caslon Text', serif", fontSize: k(31), lineHeight: k(40) }}>Te guardo</p>
          <p className="absolute whitespace-nowrap" style={{ left: k(345), top: k(1026), fontFamily: "'Libre Caslon Text', serif", fontSize: k(23), lineHeight: k(30), color: "#2b2a22" }}>Silvana Estrada</p>
          <button
            type="button" aria-label={p.playing ? "Pausar" : "Reproducir Te guardo"} onClick={p.toggle}
            className="absolute flex items-center justify-center rounded-full transition hover:brightness-150 active:scale-95"
            style={{ left: k(178), top: k(1025), width: k(137), height: k(137), background: ink }}
          >
            {p.playing
              ? <svg style={{ width: k(40), height: k(46) }} viewBox="0 0 16 16" aria-hidden><path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" fill="#f3e9da" /></svg>
              : <svg style={{ width: k(48), height: k(54), marginLeft: k(7) }} viewBox="0 0 16 16" aria-hidden><path d="M2.5 1v14L14.5 8z" fill="#f3e9da" /></svg>}
          </button>
          <svg className="pointer-events-none absolute" style={{ left: k(350), top: k(BARS_C - 60), width: k(440), height: k(120) }} viewBox={`350 ${-60} 440 120`} aria-hidden>
            {bars.map(([x, h]) => (
              <rect key={x} x={x - 1.2} y={-h / 2} width={2.4} height={h} rx={1.2} fill={x < 360 + prog * 418 ? "#6b7a4f" : ink} />
            ))}
          </svg>

          {/* progreso */}
          <div className="pointer-events-none absolute" style={{ left: k(LINE.x), top: k(LINE.y - 1), width: k(LINE.w), height: k(3), background: "#b8ac98" }}>
            <div className="absolute inset-y-0 left-0" style={{ width: `${prog * 100}%`, background: ink }} />
            <span className="absolute rounded-full" style={{ left: `${prog * 100}%`, top: "50%", width: k(17), height: k(17), background: ink, transform: "translate(-50%,-50%)" }} />
          </div>
          <input
            type="range" min={0} max={1000} value={Math.round(prog * 1000)} aria-label="Posición"
            onChange={(e) => p.seek(Number(e.target.value) / 1000)}
            className="absolute cursor-pointer opacity-0"
            style={{ left: k(LINE.x - 8), top: k(LINE.y - 22), width: k(LINE.w + 16), height: k(44) }}
          />
          <p className="absolute whitespace-nowrap tabular-nums" style={{ left: k(161), top: k(1252), fontFamily: "'Libre Caslon Text', serif", fontSize: k(22), lineHeight: k(28) }}>{fmt(p.t)}</p>
          <p className="absolute whitespace-nowrap tabular-nums text-right" style={{ left: k(697), top: k(1252), width: k(100), fontFamily: "'Libre Caslon Text', serif", fontSize: k(22), lineHeight: k(28) }}>{fmt(p.dur)}</p>

          <p className="absolute whitespace-nowrap" style={{ left: k(213), top: k(1488), fontFamily: "'Libre Caslon Text', serif", fontSize: k(21.9), lineHeight: k(32), color: "#2b2a22" }}>
            Una canción que habita la memoria.<br />Un refugio para todo lo que aún<br />nos importa.
          </p>
        </div>
      </div>
    </Shell>
  )
}

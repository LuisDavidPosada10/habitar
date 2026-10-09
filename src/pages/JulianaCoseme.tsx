import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { fmt, usePlayback } from "../kit/Players"

/**
 * /juliana-2 · Cóseme. Lienzo = public/juliana2/bg.webp (929×1896, sin texto, sin waveform ni línea de progreso).
 * Origen: PDF índice 15 (929×1652); filas 86–1652 (la barra azul oscuro con "JULIANA VELÁSQUEZ 02/04" es la real del Shell),
 * estirado sólo en papel (tools/juliana2.json + tools/paper_fill.py + tools/stretch_juliana2.py). Coordenadas: x = x del PDF; y = y NUEVA.
 * Estrellas, trazos azules, comillas, flores, películas y rayas bajo el kicker/“02” quedan en la imagen.
 * El audio es un archivo propio (public/media/coseme.mp3 = "Entrevista juliana.mp3"); las 52 barras del waveform salen de medir el diseño.
 */
const W = 929, H = 1896
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#0b1220"
const AUDIO = "/media/coseme.mp3"
const WAVE_C = 848 // y nueva del centro del waveform
const CIRC = { cx: 466, cy: 848, r: 50 }
// [x, alto] de cada barra (medidas del diseño; la del botón se omite)
const bars: [number, number][] = [[151,6],[162,16],[172,26],[183,41],[193,31],[201,46],[212,77],[223,102],[234,67],[245,35],[256,22],[267,49],[278,17],[288,27],[300,46],[310,94],[322,127],[334,157],[345,113],[356,62],[367,44],[378,64],[389,41],[400,24],[410,14],[532,21],[543,33],[554,52],[565,30],[576,18],[586,12],[594,13],[602,22],[612,34],[623,59],[634,84],[645,105],[656,77],[667,47],[677,45],[688,68],[698,40],[709,22],[718,24],[728,39],[738,22],[749,13],[758,9],[768,11],[779,6],[790,6]]
const LINE = { x: 148, w: 645, y: 960 }

export default function JulianaCoseme() {
  const p = usePlayback(203, AUDIO)
  const prog = p.t / (p.dur || 1)
  const px = 151 + prog * 640
  return (
    <Shell theme="juliana" label="JULIANA VELÁSQUEZ" counter="02/04">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#e9d3b9" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/929)] [--w:max(min(100vw,480px),calc((100dvh-44px)*929/1896))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          {p.mediaProps && <audio {...p.mediaProps} />}
          <img src="/juliana2/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/juliana" label="Volver a Juliana" cx={87} cy={62} color={ink} />
          <p className="absolute whitespace-nowrap" style={{ left: k(150), top: k(47), fontFamily: "'IBM Plex Mono', monospace", fontSize: k(21), lineHeight: k(30), letterSpacing: ".12em" }}>
            CÓSEME
          </p>

          <p className="f-bodoni absolute whitespace-nowrap" style={{ left: k(147), top: k(188), fontSize: k(42), lineHeight: k(50), fontStyle: "italic", fontWeight: 400, color: "#3b3a3a" }}>
            02
          </p>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.784]" style={{ left: k(122), top: k(240), fontSize: k(138), lineHeight: k(150), fontStyle: "italic", fontWeight: 800, letterSpacing: "-.02em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            CÓSEME
          </h1>

          {/* reproductor */}
          <svg className="pointer-events-none absolute" style={{ left: k(140), top: k(WAVE_C - 90), width: k(660), height: k(180) }} viewBox={`140 ${-90} 660 180`} aria-hidden>
            {bars.map(([x, h]) => (
              <rect key={x} x={x - 1.6} y={-h / 2} width={3.2} height={h} rx={1.6} fill={x < px ? ink : "#8d7f72"} />
            ))}
          </svg>
          <button
            type="button" aria-label={p.playing ? "Pausar" : "Reproducir entrevista"} onClick={p.toggle}
            className="absolute flex items-center justify-center rounded-full transition hover:brightness-150 active:scale-95"
            style={{ left: k(CIRC.cx - CIRC.r), top: k(CIRC.cy - CIRC.r), width: k(CIRC.r * 2), height: k(CIRC.r * 2), background: ink }}
          >
            {p.playing
              ? <svg style={{ width: k(30), height: k(34) }} viewBox="0 0 16 16" aria-hidden><path d="M3.2 2h2.2v12H3.2zM10.6 2h2.2v12h-2.2z" fill="#f3e9da" /></svg>
              : <svg style={{ width: k(34), height: k(40), marginLeft: k(5) }} viewBox="0 0 16 16" aria-hidden><path d="M2.5 1v14L14.5 8z" fill="#f3e9da" /></svg>}
          </button>

          <div className="pointer-events-none absolute" style={{ left: k(LINE.x), top: k(LINE.y - 1), width: k(LINE.w), height: k(2), background: "#6f6a62" }}>
            <div className="absolute inset-y-0 left-0" style={{ width: `${prog * 100}%`, background: ink, height: k(4), top: k(-1) }} />
            <span className="absolute rounded-full" style={{ left: `${prog * 100}%`, top: "50%", width: k(20), height: k(20), background: ink, transform: "translate(-50%,-50%)" }} />
          </div>
          <input
            type="range" min={0} max={1000} value={Math.round(prog * 1000)} aria-label="Posición"
            onChange={(e) => p.seek(Number(e.target.value) / 1000)}
            className="absolute cursor-pointer opacity-0"
            style={{ left: k(LINE.x - 8), top: k(LINE.y - 24), width: k(LINE.w + 16), height: k(48) }}
          />
          <p className="absolute whitespace-nowrap tabular-nums" style={{ left: k(150), top: k(976), fontFamily: "'IBM Plex Mono', monospace", fontSize: k(19), lineHeight: k(26) }}>{fmt(p.t).padStart(5, "0")}</p>
          <p className="absolute whitespace-nowrap tabular-nums text-right" style={{ left: k(693), top: k(976), width: k(100), fontFamily: "'IBM Plex Mono', monospace", fontSize: k(19), lineHeight: k(26) }}>{fmt(p.dur).padStart(5, "0")}</p>

          <p className="absolute whitespace-nowrap" style={{ left: k(254), top: k(1163), fontFamily: "'Libre Caslon Text', serif", fontSize: k(31.5), lineHeight: k(47), color: ink }}>
            En esta conversación, Juliana<br />nos habla sobre <em>CÓSEME</em>, su<br />proceso creativo y la forma en<br />la que transforma lo frágil en<br />algo poderoso.
          </p>
        </div>
      </div>
    </Shell>
  )
}

import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { fmt } from "../kit/Players"
import { useYouTube } from "../kit/useYouTube"

/**
 * /mon-2 · Tu falta de querer. Lienzo = public/mon2/bg.webp (941×1928, sin texto ni reproductor).
 * Origen: PDF índice 5 (941×1672); filas 96–1672, estirado sólo en papel (tools/mon2.json + tools/stretch_mon2.py).
 * Coordenadas: x = x del PDF; y = y NUEVA (mapa impreso por stretch_mon2.py). Las barras del waveform salen de medir el diseño.
 */
const W = 941, H = 1928
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1d1611"
const CARD_C = 880 // y del centro del reproductor
const WAVE_C = 829 // y (PDF) del centro de las barras medidas
// [x, alto, color]
const bars: [number, number, string][] = [[269,21,"#681d1a"],[281,43,"#6b1b1a"],[295,83,"#651c19"],[306,55,"#6e221f"],[318,59,"#6c1818"],[330,69,"#681d1a"],[342,132,"#67201c"],[353,101,"#701b1c"],[366,75,"#7d2728"],[376,54,"#945d53"],[392,73,"#a06c61"],[402,54,"#a37568"],[410,38,"#9e7466"],[421,48,"#a08877"],[432,73,"#8d7a68"],[442,53,"#958271"],[454,65,"#907c6b"],[462,117,"#937f6d"],[473,85,"#978270"],[484,47,"#8f7b6a"],[491,62,"#9c8776"],[503,49,"#9b8674"],[513,35,"#988370"],[526,21,"#9e8977"],[537,28,"#a79280"],[548,36,"#9e8974"],[559,55,"#99846f"],[572,49,"#978371"],[582,81,"#a5907b"],[593,49,"#a08b76"],[604,37,"#b09b86"],[615,54,"#c8b39e"],[626,22,"#d1bca7"],[637,21,"#d3bea9"],[648,17,"#d3bea9"],[659,14,"#d5c0ab"],[671,14,"#d9c5ad"]]

// En el diseño las primeras barras ya son rojas (estado "avanzado"): sin reproducir deben verse como el resto.
const unplayed = (c: string) => (parseInt(c.slice(1, 3), 16) - parseInt(c.slice(3, 5), 16) > 30 ? "#8d7f74" : c)

export default function MonTuFalta() {
  const p = useYouTube("TSWYmtJKYFo", 252)
  const prog = p.t / (p.dur || 1)
  return (
    <Shell theme="mon">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#e7cfb8" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/941)] [--w:max(min(100vw,480px),calc((100dvh-44px)*941/1928))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <div {...p.hostEl} />
          <img src="/mon2/bg.webp?v=3" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/mon" label="Volver a Autopoética" cx={95} cy={59} />
          <p className="absolute whitespace-nowrap" style={{ left: k(131), top: k(44), fontFamily: "'IBM Plex Mono', monospace", fontSize: k(24), lineHeight: k(30), letterSpacing: ".062em" }}>
            AUTOPOÉTICA / 02
          </p>

          <p className="f-bodoni absolute whitespace-nowrap [--tx:.72]" style={{ left: k(97), top: k(146), fontSize: k(46), lineHeight: k(56), fontWeight: 400, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>02</p>
          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.584]" style={{ left: k(96), top: k(205), fontSize: k(123), lineHeight: k(113), fontWeight: 700, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            TU FALTA<br />DE QUERER
          </h1>
          {/* subrayado a pincel (dos trazos) */}
          <svg className="absolute" style={{ left: k(78), top: k(432), width: k(370), height: k(20) }} viewBox="0 0 370 20" fill="#8a1620" aria-hidden>
            <path d="M4 12C40 8 100 6 156 8c-40 3-100 6-152 7 0-1 0-2 0-3z" /><path d="M240 8c40-1 90-1 128 2-38 2-92 4-128 4 0-2 0-4 0-6z" />
          </svg>
          <p className="absolute whitespace-nowrap" style={{ left: k(98), top: k(478), fontFamily: "'Libre Caslon Text', serif", fontSize: k(42), lineHeight: k(45), color: ink, transform: "scaleX(.868)", transformOrigin: "left" }}>
            ¿Qué hacemos con lo que<br />sentimos cuando ya no<br />cabe dentro?
          </p>

          {/* reproductor de audio */}
          <button type="button" aria-label={p.playing ? "Pausar" : "Reproducir"} onClick={p.toggle} className="absolute flex items-center justify-center rounded-full transition hover:brightness-125 active:scale-95" style={{ left: k(118), top: k(CARD_C - 57), width: k(115), height: k(115), background: "#5e1015" }}>
            {p.playing
              ? <svg style={{ width: k(34), height: k(38) }} viewBox="0 0 16 16" aria-hidden><path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" fill="#fff" /></svg>
              : <svg style={{ width: k(42), height: k(46), marginLeft: k(6) }} viewBox="0 0 16 16" aria-hidden><path d="M2.5 1v14L14.5 8z" fill="#fff" /></svg>}
          </button>
          <svg className="pointer-events-none absolute" style={{ left: k(258), top: k(CARD_C - 75), width: k(440), height: k(150) }} viewBox="258 -75 440 150" aria-hidden>
            {bars.map(([x, h, c]) => (
              <rect key={x} x={x - 2.5} y={-h / 2} width={5} height={h} rx={2.5} fill={x < 262 + prog * 410 ? "#681d1a" : unplayed(c)} />
            ))}
          </svg>
          <input
            type="range" min={0} max={1000} value={Math.round(prog * 1000)} aria-label="Posición"
            onChange={(e) => p.seek(Number(e.target.value) / 1000)}
            className="absolute cursor-pointer opacity-0"
            style={{ left: k(262), top: k(CARD_C - 60), width: k(420), height: k(120) }}
          />
          <p className="absolute whitespace-nowrap tabular-nums" style={{ left: k(711), top: k(CARD_C - 14), fontFamily: "'Libre Caslon Text', serif", fontSize: k(21), lineHeight: k(28) }}>
            {fmt(p.t)} / {fmt(p.dur)}
          </p>

          <p className="absolute whitespace-nowrap" style={{ left: k(139), top: k(1054), fontFamily: "'Libre Caslon Text', serif", fontSize: k(26.2), lineHeight: k(33), color: ink }}>
            En este escenario nos adentramos en la emoción,<br />la vulnerabilidad y el desamor como parte de la<br />construcción artística de Mon Laferte.
          </p>
        </div>
      </div>
    </Shell>
  )
}

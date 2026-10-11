import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { useYouTube } from "../kit/useYouTube"

/**
 * /mon-2 · Tu falta de querer. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 6, 1179×2556). Fondo = public/mon2/bg.webp:
 * render SIN texto, SIN botón de play y SIN waveform (la tarjeta gris queda lisa). Textos, botón, barras del waveform
 * (medidas del diseño) y la flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179).
 * El audio sigue siendo el de YouTube (useYouTube): empieza al tocar play.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", color: "#11110f" } as const

const BTN = { cx: 276.5, cy: 271.5 + 1000, r: 75.5 }
const WAVE_Y = 1271.5
// [x del centro, alto] de las 63 barras del diseño (ancho 5)
const bars: [number, number][] = [[414,28],[422.5,20],[430.5,17],[438.5,20],[447,27],[455.5,36],[463.5,43],[471.5,31],[479.5,19],[488,31],[496.5,43],[504.5,17],[512.5,30],[521,50],[529,81],[537.5,99],[545.5,79],[553.5,99],[562,82],[570.5,49],[578.5,30],[586.5,16],[594.5,43],[603,31],[611.5,19],[619.5,31],[627.5,43],[635.5,36],[644,28],[652.5,20],[660.5,16],[668.5,20],[678,29],[687,20],[695,16],[703,20],[711.5,27],[719.5,36],[728,43],[736,31],[744.5,19],[752.5,31],[761,43],[769,17],[777,30],[785.5,50],[793.5,81],[802,99],[810,79],[818,99],[826.5,82],[834.5,50],[843,30],[851,16],[859.5,43],[867.5,31],[875.5,19],[884,31],[892,43],[900.5,36],[908.5,28],[917,20],[925,16],[933,20],[941.5,29]]
const WX0 = 405, WX1 = 952   // tramo del waveform (para el progreso y el deslizador)

export default function MonTuFalta() {
  const p = useYouTube("TSWYmtJKYFo", 252)
  const prog = p.t / (p.dur || 1)
  return (
    <Shell theme="mon" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <div {...p.hostEl} />
        <img src="/mon2/bg.webp?v=4" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(78), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: "translateX(" + k(-4) + ") scaleX(.912)" }}>
          Habitar la música
        </p>

        <BackChevron to="/mon" label="Volver a Lo que arde" cx={105} cy={191} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(142), top: k(169), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.956)", transformOrigin: "left" }}>
          Lo que arde/ 02
        </p>

        <h1 className="m-0 font-normal">
          <span data-m="t1" className="absolute whitespace-nowrap" style={{ ...bodoni, left: k(70), top: k(265), fontSize: k(192), lineHeight: k(192), fontWeight: 500, color: "#000", transform: "scaleX(.928)", transformOrigin: "left" }}>Tu falta</span>
          <span data-m="t2" className="absolute whitespace-nowrap" style={{ ...mont, left: k(72), top: k(438.5), fontSize: k(146.4), lineHeight: k(146.4), fontWeight: 700, color: "#631413", transform: "scaleX(.98)", transformOrigin: "left" }}>de querer</span>
        </h1>

        <p data-m="sub" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(680), fontSize: k(58.2), lineHeight: k(65.5), fontWeight: 400, color: "#000", transform: `translateX(${k(-11)})` }}>
          ¿Qué hacemos con lo que<br />sentimos cuando ya no<br />cabe dentro?
        </p>

        {/* reproductor de audio */}
        <button
          type="button" data-m="play" aria-label={p.playing ? "Pausar" : "Reproducir"} onClick={p.toggle}
          className="absolute flex items-center justify-center rounded-full transition hover:brightness-125 active:scale-95"
          style={{ left: k(BTN.cx - BTN.r), top: k(BTN.cy - BTN.r), width: k(BTN.r * 2), height: k(BTN.r * 2), background: "#3a1010" }}
        >
          {p.playing
            ? <svg style={{ width: k(44), height: k(50) }} viewBox="0 0 16 16" aria-hidden><path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" fill="#efe8df" /></svg>
            : <svg style={{ width: k(54), height: k(60), marginLeft: k(8) }} viewBox="0 0 16 16" aria-hidden><path d="M2.5 1v14L14.5 8z" fill="#efe8df" /></svg>}
        </button>
        <svg className="pointer-events-none absolute" data-m="wave" style={{ left: k(WX0 - 10), top: k(WAVE_Y - 60), width: k(WX1 - WX0 + 20), height: k(120) }} viewBox={`${WX0 - 10} ${-60} ${WX1 - WX0 + 20} 120`} aria-hidden>
          {bars.map(([x, h]) => (
            <rect key={x} x={x - 2.5} y={-h / 2} width={5} height={h} rx={2.5} fill={x < WX0 + prog * (WX1 - WX0) ? "#8a1620" : "#3a1010"} />
          ))}
        </svg>
        <input
          type="range" min={0} max={1000} value={Math.round(prog * 1000)} aria-label="Posición"
          onChange={(e) => p.seek(Number(e.target.value) / 1000)}
          className="absolute cursor-pointer opacity-0"
          style={{ left: k(WX0), top: k(WAVE_Y - 60), width: k(WX1 - WX0), height: k(120) }}
        />

        <p data-m="para" className="absolute whitespace-nowrap text-center" style={{ ...mont, fontWeight: 600, left: k(256), width: k(700), top: k(1644), fontSize: k(34), lineHeight: k(35.8) }}>
          En este escenario nos<br />adentramos en la emoción,<br />la vulnerabilidad y el desamor<br />como parte de la<br />construcción artística de Mon<br />Laferte.
        </p>
      </div>
    </Shell>
  )
}

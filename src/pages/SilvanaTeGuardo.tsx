import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { usePlayback } from "../kit/Players"

/**
 * /silvana-2 · Te guardo. Diseño nuevo (PDF "Pagina Web - Diseño", pág. 11, 1179×2556). Fondo = public/silvana2/bg.webp: render SIN texto,
 * SIN botón de play y SIN waveform (la tarjeta gris queda lisa; la caja redondeada del párrafo es del fondo). Textos, botón, barras del
 * waveform (medidas del diseño) y flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179).
 * El audio es un archivo propio (public/media/te-guardo.mp3, <audio> real: play/pausa y buscar).
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const AUDIO = "/media/te-guardo.mp3"
const BTN = { cx: 290.5, cy: 1245.5, r: 75.5 }
const WAVE_Y = 1246
const MUTED = "#6d7e71", GREEN = "#3b523b"
// [x del centro, alto] de las 65 barras del diseño (ancho 4)
const bars: [number, number][] = [[428,27],[436,18],[444,16],[452,19],[460.5,27],[469,35],[477,42],[485,30],[493,18],[501.5,31],[510,42],[518,16],[526,30],[534,49],[542.5,81],[551,98],[559,78],[567,98],[575,82],[584,49],[592,29],[600,15],[608,42],[616.5,31],[625,18],[633,30],[641,42],[649,35],[657.5,28],[666,19],[674,16],[682,20],[691,28],[700.5,19],[708.5,16],[716.5,19],[725,27],[733,35],[741.5,43],[749.5,31],[758,18],[766,30],[774,43],[782.5,16],[790.5,30],[799,49],[807,81],[815,98],[823.5,78],[832,98],[840,82],[848,49],[856.5,29],[864.5,15],[873,42],[881,30],[889,18],[897.5,30],[905.5,42],[914,35],[922,27],[930.5,19],[938.5,16],[946.5,19],[955,27]]
const WX0 = 420, WX1 = 962

export default function SilvanaTeGuardo() {
  const p = usePlayback(204, AUDIO)
  const prog = p.t / (p.dur || 1)
  return (
    <Shell theme="silvana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        {p.mediaProps && <audio {...p.mediaProps} />}
        <img src="/silvana2/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(72), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(-2)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/silvana" label="Volver a Lo que permanece" cx={111} cy={186.5} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(152), top: k(164), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.956)", transformOrigin: "left" }}>
          Lo que permanece/ 02
        </p>

        <h1 className="m-0 font-normal">
          <span data-m="te" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(463), top: k(306), fontSize: k(180), lineHeight: k(180), fontWeight: 600, color: GREEN }}>Te</span>
          <span data-m="guardo" className="absolute whitespace-nowrap" style={{ ...bodoni, left: k(233), top: k(450), fontSize: k(191), lineHeight: k(191), fontWeight: 500, color: "#000", transform: "scaleX(.96)", transformOrigin: "left" }}>Guardo</span>
        </h1>
        <p data-m="sub" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(656), fontSize: k(59), lineHeight: k(56.5), fontWeight: 400, color: "#5a2242", transform: `translateX(${k(-22)}) scaleX(.895)` }}>
          ¿Qué hacemos con<br />aquello que todavía<br />queremos conservar?
        </p>

        {/* reproductor de audio (archivo propio) */}
        <button
          type="button" data-m="play" aria-label={p.playing ? "Pausar" : "Reproducir Te guardo"} onClick={p.toggle}
          className="absolute flex items-center justify-center rounded-full transition hover:brightness-110 active:scale-95"
          style={{ left: k(BTN.cx - BTN.r), top: k(BTN.cy - BTN.r), width: k(BTN.r * 2), height: k(BTN.r * 2), background: MUTED }}
        >
          {p.playing
            ? <svg style={{ width: k(44), height: k(50) }} viewBox="0 0 16 16" aria-hidden><path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" fill="#efe8df" /></svg>
            : <svg style={{ width: k(54), height: k(60), marginLeft: k(8) }} viewBox="0 0 16 16" aria-hidden><path d="M2.5 1v14L14.5 8z" fill="#efe8df" /></svg>}
        </button>
        <svg className="pointer-events-none absolute" data-m="wave" style={{ left: k(WX0 - 10), top: k(WAVE_Y - 60), width: k(WX1 - WX0 + 20), height: k(120) }} viewBox={`${WX0 - 10} -60 ${WX1 - WX0 + 20} 120`} aria-hidden>
          {bars.map(([x, h]) => (
            <rect key={x} x={x - 2} y={-h / 2} width={4} height={h} rx={2} fill={x < WX0 + prog * (WX1 - WX0) ? GREEN : MUTED} />
          ))}
        </svg>
        <input
          type="range" min={0} max={1000} value={Math.round(prog * 1000)} aria-label="Posición"
          onChange={(e) => p.seek(Number(e.target.value) / 1000)}
          className="absolute cursor-pointer opacity-0"
          style={{ left: k(WX0), top: k(WAVE_Y - 60), width: k(WX1 - WX0), height: k(120) }}
        />

        <p data-m="para" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...mont, top: k(1586), fontSize: k(36), lineHeight: k(35.5) }}>
          Una canción que habita la memoria.<br />Un refugio para todo lo que aún<br />nos importa.
        </p>
      </div>
    </Shell>
  )
}

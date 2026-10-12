import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { usePlayback } from "../kit/Players"

/**
 * /juliana-2 · Cóseme. Diseño nuevo (PDF "Pagina Web - final", pág. 1, 1179×2556). Fondo = public/juliana2/bg.webp: render SIN texto,
 * SIN botón de play y SIN waveform (la tarjeta gris queda lisa; el recuadro redondeado del párrafo es del fondo). Textos, botón, barras
 * del waveform (65, medidas del diseño) y flecha de volver son HTML en unidades del lienzo (--k = ancho_css / 1179).
 * El audio es un archivo propio (public/media/coseme.mp3, <audio> real: play/pausa y buscar).
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const AUDIO = "/media/coseme.mp3"
const NAVY = "#1a175e", MUTED = "rgba(26,23,94,.36)"
const BTN = { cx: 266, cy: 1251.5, r: 76 }
const WAVE_Y = 1251
// [x del centro, alto] de las 65 barras del diseño (ancho 4.5)
const bars: [number, number][] = [[403,28],[411.5,19],[419.5,15],[427.5,19],[436,27],[444.5,35],[452.5,43],[460.5,31],[468.5,19],[477,31],[485.5,43],[493.5,17],[501.5,30],[510,49],[518,81],[526.5,99],[534.5,79],[542.5,99],[551,82],[559,49],[567.5,30],[575.5,15],[583.5,43],[592,31],[600.5,19],[608.5,31],[616.5,43],[624.5,35],[633,27],[641.5,19],[649.5,16],[657.5,19],[666.5,28],[676,20],[684,17],[692.5,19],[700.5,27],[708.5,35],[717,43],[725,31],[733.5,19],[741.5,31],[749.5,43],[758,17],[766,30],[774.5,49],[782.5,81],[790.5,99],[799,79],[807,99],[815.5,82],[823.5,49],[832,30],[840,15],[848,43],[856.5,31],[864.5,19],[873,31],[881,43],[889.5,35],[897.5,27],[905.5,20],[914,16],[922,19],[930.5,27]]
const WX0 = 395, WX1 = 940

export default function JulianaCoseme() {
  const p = usePlayback(70, AUDIO)
  const prog = p.t / (p.dur || 1)
  return (
    <Shell theme="juliana" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        {p.mediaProps && <audio {...p.mediaProps} />}
        <img src="/juliana2/bg.webp?v=3" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(74.5), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(-.5)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/juliana" label="Volver a Lo que florece" cx={112.5} cy={186.5} color="#3a1010" />
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(150), top: k(164), fontSize: k(42), lineHeight: k(52), fontWeight: 600, color: "#000", transform: "scaleX(.923)", transformOrigin: "left" }}>
          Lo que florece/ 02
        </p>

        <h1 data-m="title" className="absolute inset-x-0 whitespace-nowrap text-center font-normal" style={{ ...bodoni, top: k(397), fontSize: k(156), lineHeight: k(156), fontWeight: 500, color: "#000", transform: "scaleX(1.045)" }}>
          CÓSEME
        </h1>
        <p data-m="sub" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(598), fontSize: k(67.5), lineHeight: k(73), fontWeight: 400, color: NAVY, transform: "scaleX(1.02)" }}>
          ¿Qué hacemos cuando<br />necesitamos que alguien<br />nos escuche?
        </p>

        {/* reproductor de audio (archivo propio) */}
        <button
          type="button" data-m="play" aria-label={p.playing ? "Pausar" : "Reproducir Cóseme"} onClick={p.toggle}
          className="absolute flex items-center justify-center rounded-full transition hover:brightness-125 active:scale-95"
          style={{ left: k(BTN.cx - BTN.r), top: k(BTN.cy - BTN.r), width: k(BTN.r * 2), height: k(BTN.r * 2), background: NAVY }}
        >
          {p.playing
            ? <svg style={{ width: k(44), height: k(50) }} viewBox="0 0 16 16" aria-hidden><path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" fill="#efe8df" /></svg>
            : <svg style={{ width: k(54), height: k(60), marginLeft: k(8) }} viewBox="0 0 16 16" aria-hidden><path d="M2.5 1v14L14.5 8z" fill="#efe8df" /></svg>}
        </button>
        <svg className="pointer-events-none absolute" data-m="wave" style={{ left: k(WX0 - 10), top: k(WAVE_Y - 60), width: k(WX1 - WX0 + 20), height: k(120) }} viewBox={`${WX0 - 10} -60 ${WX1 - WX0 + 20} 120`} aria-hidden>
          {bars.map(([x, h]) => (
            <rect key={x} x={x - 2.25} y={-h / 2} width={4.5} height={h} rx={2.2} fill={x < WX0 + prog * (WX1 - WX0) ? NAVY : MUTED} />
          ))}
        </svg>
        <input
          type="range" min={0} max={1000} value={Math.round(prog * 1000)} aria-label="Posición"
          onChange={(e) => p.seek(Number(e.target.value) / 1000)}
          className="absolute cursor-pointer opacity-0"
          style={{ left: k(WX0), top: k(WAVE_Y - 60), width: k(WX1 - WX0), height: k(120) }}
        />

        <p data-m="para" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...mont, top: k(1586), fontSize: k(36), lineHeight: k(37.5), transform: "scaleX(.92)" }}>
          Para recordarnos que crecer también significa<br />no perder la capacidad de asombro. Un<br />momento para volver a nuestro niño interior,<br />divertirnos y compartir juntos.
        </p>
      </div>
    </Shell>
  )
}

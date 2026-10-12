import { useEffect, useRef, useState, type CSSProperties } from "react"

/**
 * "Caja musical": una mariposa de papel recortado (collage) que hace de botón de audio. Al tocarla vibra y aletea, aparecen ondas
 * dibujadas (anillos irregulares que se trazan y se expanden) y empieza el sonido; mientras suena las ondas siguen saliendo y el
 * aleteo es lento; al tocarla de nuevo se pausa. El audio lo maneja quien la usa (`playing` / `onToggle`).
 * El SVG usa unidades propias (viewBox 800×600, centro de la mariposa en 400,300) y escala con el contenedor.
 * Estilos de movimiento: `.mb-*` en src/index.css (respetan prefers-reduced-motion).
 */
type Props = { playing: boolean; onToggle: () => void; label: string; className?: string; style?: CSSProperties }

// anillo irregular "dibujado a mano": círculo con ruido suave y fijo (semilla distinta por anillo)
function ring(r: number, seed: number) {
  const n = 28
  let v = 0
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    v = v * 0.55 + rnd() * 16
    const a = (i / n) * Math.PI * 2
    pts.push([400 + (r + v) * Math.cos(a), 300 + (r * 0.8 + v) * Math.sin(a)])
  }
  // Catmull-Rom → Bézier cerrada
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + "Z"
}
const RINGS = [
  { d: ring(185, 11), color: "#457089", w: 5, delay: 0, cls: "mb-r1" },
  { d: ring(185, 47), color: "#7a8a63", w: 4.2, delay: 0.85, cls: "mb-r2" },
  { d: ring(185, 93), color: "#1a175e", w: 3.4, delay: 1.7, cls: "mb-r3" },
]

export default function MusicBox({ playing, onToggle, label, className, style }: Props) {
  const [burst, setBurst] = useState(0)     // cada toque reinicia una tanda de ondas y una vibración
  const [vibe, setVibe] = useState(false)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const tap = () => {
    setBurst((b) => b + 1)
    setVibe(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setVibe(true)))
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setVibe(false), 560)
    onToggle()
  }

  return (
    <button
      type="button" onClick={tap} aria-label={label} aria-pressed={playing}
      className={`${className ?? ""} block cursor-pointer border-0 bg-transparent p-0 outline-none`}
      style={{ WebkitTapHighlightColor: "transparent", ...style }}
    >
      <svg viewBox="0 0 800 600" className="size-full overflow-visible" aria-hidden>
        <defs>
          <filter id="mb-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
          </filter>
          <filter id="mb-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#261c0e" floodOpacity=".32" />
          </filter>
        </defs>

        {/* ondas: una tanda por toque y, mientras suena, un bucle continuo */}
        <g key={burst} className={playing ? "mb-loop" : ""}>
          {(burst > 0 || playing) && RINGS.map((r, i) => (
            <path key={i} d={r.d} pathLength={1} className={`mb-ring ${r.cls}`} stroke={r.color} strokeWidth={r.w} style={{ animationDelay: `${r.delay}s` }} />
          ))}
        </g>

        {/* mariposa de papel */}
        <g transform="translate(400 300) scale(1.6)">
          <g className={`mb-fly ${vibe ? "mb-vibe" : ""} ${playing ? "mb-on" : ""}`}>
            <g transform="translate(-200 -190)" filter="url(#mb-shadow)">
              <g className="mb-wings" filter="url(#mb-rough)">
                {[1, -1].map((s) => (
                  <g key={s} transform={s === 1 ? undefined : "translate(400 0) scale(-1 1)"}>
                    {/* ala superior */}
                    <path d="M198 172C150 58 62 14 26 66 -6 116 58 172 198 192Z" fill="#a8bf96" stroke="#f6eedb" strokeWidth="7" strokeLinejoin="round" />
                    <path d="M196 176C160 100 104 70 62 94 42 118 90 160 196 188Z" fill="#5b8db8" />
                    <path d="M196 180C170 130 130 112 96 124 90 146 130 172 196 186Z" fill="#efe0c4" />
                    <circle cx="70" cy="86" r="9" fill="#e2b53f" />
                    <circle cx="118" cy="62" r="6" fill="#efe0c4" />
                    {/* ala inferior */}
                    <path d="M198 196C130 198 48 230 66 292 84 342 170 304 198 238Z" fill="#1f4e8c" stroke="#f6eedb" strokeWidth="7" strokeLinejoin="round" />
                    <path d="M196 206C150 212 98 238 104 276 126 300 178 272 196 232Z" fill="#9fc3d8" />
                    <circle cx="96" cy="290" r="8" fill="#e2b53f" />
                    <circle cx="140" cy="258" r="5" fill="#f6eedb" />
                  </g>
                ))}
              </g>
              {/* cuerpo y antenas */}
              <path d="M200 120C198 96 186 80 170 68M200 120C202 96 214 80 230 68" fill="none" stroke="#2b2a28" strokeWidth="3.4" strokeLinecap="round" />
              <circle cx="170" cy="68" r="5" fill="#2b2a28" />
              <circle cx="230" cy="68" r="5" fill="#2b2a28" />
              <ellipse cx="200" cy="196" rx="11" ry="68" fill="#2b2a28" stroke="#f6eedb" strokeWidth="3" />
              <circle cx="200" cy="124" r="14" fill="#2b2a28" stroke="#f6eedb" strokeWidth="3" />
            </g>
          </g>
        </g>
      </svg>
    </button>
  )
}

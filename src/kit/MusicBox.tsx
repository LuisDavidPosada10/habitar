import { useEffect, useRef, useState, type CSSProperties } from "react"

/**
 * "Caja musical": una mariposa (imagen recortada) que hace de botón de audio. Al tocarla vibra, aparecen ondas
 * dibujadas (anillos irregulares que se trazan y se expanden) y empieza el sonido; mientras suena las ondas siguen saliendo y al
 * tocarla de nuevo se pausa. El audio lo maneja quien la usa (`playing` / `onToggle`).
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

        {/* mariposa (foto recortada, public/silvana3/mariposa.webp): flota, vibra al tocarla; sin aleteo */}
        <g transform="translate(400 280)">
          <g className={`mb-fly ${vibe ? "mb-vibe" : ""}`}>
            <image href="/silvana3/mariposa.webp" x="-260" y="-265" width="520" height="531" filter="url(#mb-shadow)" />
          </g>
        </g>
      </svg>
    </button>
  )
}

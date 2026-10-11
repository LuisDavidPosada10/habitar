import { useMemo, type CSSProperties, type ReactNode } from "react"
import { rng, tornPolygon, type Edges } from "./torn"
import type { Photo } from "./photos"

/** Recorte rectangular de un JPG de diseño, escalable a cualquier ancho. */
export function Crop({ photo, className = "", style, label }: { photo: Photo; className?: string; style?: CSSProperties; label?: string }) {
  const { src, sw, sh, x, y, w, h } = photo
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{
        aspectRatio: `${w} / ${h}`,
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${(sw / w) * 100}% auto`,
        backgroundPosition: `${sw === w ? 0 : (x / (sw - w)) * 100}% ${sh === h ? 0 : (y / (sh - h)) * 100}%`,
        ...style,
      }}
    />
  )
}

/** Envuelve contenido con bordes de papel rasgado y sombra suave. */
export function Torn({
  children, seed = 1, edges, amp = 1.4, className = "", style, shadow = true,
}: { children: ReactNode; seed?: number; edges?: Edges; amp?: number; className?: string; style?: CSSProperties; shadow?: boolean }) {
  const clip = useMemo(() => tornPolygon(seed, edges, amp), [seed, edges, amp])
  return (
    <div className={className} style={{ filter: shadow ? "drop-shadow(0 6px 9px rgba(40,20,10,.28))" : undefined, ...style }}>
      <div style={{ clipPath: clip, WebkitClipPath: clip }}>{children}</div>
    </div>
  )
}

/** Pieza de papel (cartulina) rasgada con textura. */
export function Scrap({ color = "#e6d8bd", seed = 3, className = "", style, children, edges }: { color?: string; seed?: number; className?: string; style?: CSSProperties; children?: ReactNode; edges?: Edges }) {
  return (
    <Torn seed={seed} edges={edges} className={className} style={style}>
      <div className="paper-grain" style={{ background: color, width: "100%", height: "100%" }}>{children}</div>
    </Torn>
  )
}

/** Cinta adhesiva semitransparente. */
export function Tape({ className = "", rotate = -4, w = 84, color = "rgba(217,196,150,.72)" }: { className?: string; rotate?: number; w?: number; color?: string }) {
  const clip = useMemo(() => tornPolygon(7, { l: true, r: true }, 5, 9), [])
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ width: w, height: w * 0.3, background: color, transform: `rotate(${rotate}deg)`, clipPath: clip, boxShadow: "0 1px 2px rgba(0,0,0,.15)" }}
    />
  )
}

/** Tira de película de 35 mm. */
export function FilmStrip({ frames = 6, className = "", style, tint = "#14100e" }: { frames?: number; className?: string; style?: CSSProperties; tint?: string }) {
  const fw = 58, fh = 44
  const rand = useMemo(() => rng(frames * 31), [frames])
  const tones = useMemo(() => Array.from({ length: frames }, () => 30 + Math.floor(rand() * 40)), [frames, rand])
  return (
    <svg aria-hidden className={className} style={style} viewBox={`0 0 ${fw} ${fh * frames}`} preserveAspectRatio="none">
      <rect width={fw} height={fh * frames} fill={tint} />
      {tones.map((t, i) => (
        <g key={i}>
          <rect x="3" y={i * fh + 9} width="6" height="9" rx="1.6" fill="#efe1cb" />
          <rect x="3" y={i * fh + 27} width="6" height="9" rx="1.6" fill="#efe1cb" />
          <rect x={fw - 9} y={i * fh + 9} width="6" height="9" rx="1.6" fill="#efe1cb" />
          <rect x={fw - 9} y={i * fh + 27} width="6" height="9" rx="1.6" fill="#efe1cb" />
          <rect x="13" y={i * fh + 4} width={fw - 26} height={fh - 8} fill={`hsl(30 8% ${t}%)`} />
        </g>
      ))}
    </svg>
  )
}

/** Estrella de ocho puntas. */
export function Star({ size = 28, color = "#b3141c", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg aria-hidden className={className} width={size} height={size} viewBox="-10 -10 20 20" fill={color}>
      <path d="M0-10 1.4-1.4 10 0 1.4 1.4 0 10-1.4 1.4-10 0-1.4-1.4Z" />
      <path d="M0-5 .5-.5 5 0 .5 .5 0 5-.5 .5-5 0-.5-.5Z" transform="rotate(45)" opacity=".6" />
    </svg>
  )
}

/** Luna con cráteres, hecha solo con gradientes. */
export function Moon({ size = 72, crescent = false, className = "" }: { size?: number; crescent?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: size, height: size, borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 28%, #f4f1ea 0 18%, transparent 19%), radial-gradient(circle at 62% 40%, #b5b2ab 0 9%, transparent 10%), radial-gradient(circle at 44% 70%, #a9a59d 0 12%, transparent 13%), radial-gradient(circle at 70% 72%, #c3c0b8 0 7%, transparent 8%), radial-gradient(circle at 35% 35%, #e8e4db, #8f8b84)",
        boxShadow: "inset -8px -6px 14px rgba(0,0,0,.35)",
        ...(crescent ? { clipPath: "path('M36 0 A36 36 0 1 0 72 36 A28 28 0 1 1 36 0Z')" } : {}),
      }}
    />
  )
}

/** Disco de vinilo con surcos y etiqueta roja. */
export function Vinyl({ size = 220, label = "#b3141c", className = "", style }: { size?: number | string; label?: string; className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: size, aspectRatio: "1", borderRadius: "50%",
        background: `radial-gradient(circle, #111 0 2%, ${label} 3% 27%, #0d0d0d 28%), repeating-radial-gradient(circle, #1a1a1a 0 2px, #0b0b0b 2px 4px)`,
        boxShadow: "0 10px 24px rgba(0,0,0,.45), inset 0 0 0 3px #222",
        position: "relative", ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(from 20deg, transparent 0 20%, rgba(255,255,255,.13) 25%, transparent 30% 70%, rgba(255,255,255,.1) 75%, transparent 80%)" }} />
    </div>
  )
}

/** Margarita (flor) dibujada en SVG. */
export function Daisy({ size = 70, className = "" }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden className={className} width={size} height={size} viewBox="-50 -50 100 100">
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-27" rx="7.5" ry="21" fill="#f7f1e4" stroke="#d8cdb8" strokeWidth=".8" transform={`rotate(${(i * 360) / 14})`} />
      ))}
      <circle r="11" fill="#d9a21b" />
      <circle r="11" fill="url(#none)" />
      <circle r="6" cx="-2" cy="-2" fill="#b9810f" opacity=".6" />
    </svg>
  )
}

/** Flor roja (dalia/lirio) dibujada en SVG. */
export function RedBloom({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden className={className} width={size} height={size} viewBox="-60 -60 120 120">
      <defs>
        <radialGradient id="rb" cx="50%" cy="60%" r="70%">
          <stop offset="0" stopColor="#5a0610" />
          <stop offset=".6" stopColor="#9e1020" />
          <stop offset="1" stopColor="#c4202c" />
        </radialGradient>
      </defs>
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d="M0 0C-12-14-11-38 0-54 11-38 12-14 0 0Z" fill="url(#rb)" stroke="#4d050c" strokeWidth=".7" transform={`rotate(${(i * 360) / 16 + (i % 2) * 9}) scale(${i % 2 ? 0.8 : 1})`} />
      ))}
      <circle r="8" fill="#e0b13a" opacity=".85" />
    </svg>
  )
}

/** Ramita de flores pequeñas (gypsophila). */
export function Sprig({ height = 180, color = "#8a6a3a", className = "", style }: { height?: number; color?: string; className?: string; style?: CSSProperties }) {
  const r = useMemo(() => rng(11), [])
  const blooms = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ x: 50 + (r() - 0.5) * 70, y: 14 + i * 5.6 + r() * 4, s: 2 + r() * 2.4 })), [r])
  return (
    <svg aria-hidden className={className} style={style} height={height} viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet">
      <path d="M50 100C48 70 52 40 50 8" stroke={color} strokeWidth="1" fill="none" />
      {blooms.map((b, i) => (
        <g key={i}>
          <path d={`M50 ${b.y + 6}L${b.x} ${b.y}`} stroke={color} strokeWidth=".6" />
          <circle cx={b.x} cy={b.y} r={b.s} fill="#f6efe0" stroke={color} strokeWidth=".4" />
          <circle cx={b.x} cy={b.y} r={b.s * 0.35} fill="#c9a24a" />
        </g>
      ))}
    </svg>
  )
}

/** Nota manuscrita sobre papel. */
export function Note({ children, className = "", rotate = -3, color = "#eadcc2", style }: { children: ReactNode; className?: string; rotate?: number; color?: string; style?: CSSProperties }) {
  return (
    <Scrap color={color} seed={5} className={className} style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      <p className="px-5 py-4 text-[clamp(.95rem,1.4vw,1.2rem)] leading-[1.5] text-[#3a2a1a]" style={{ fontFamily: "'Homemade Apple', cursive" }}>
        {children}
      </p>
    </Scrap>
  )
}

/** Línea de texto "manuscrito" decorativa para hojas viejas. */
export function Scribbles({ className = "", lines = 7 }: { className?: string; lines?: number }) {
  return (
    <div aria-hidden className={`overflow-hidden text-[#4b3a28]/60 ${className}`} style={{ fontFamily: "'Homemade Apple', cursive", fontSize: ".62rem", lineHeight: 1.9 }}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="whitespace-nowrap">
          {["la noche se abre como una carta", "sin remitente ni destino claro", "guardo tu voz entre las páginas", "y el tiempo no sabe contar", "todo lo que no cabe en mí", "se vuelve canción al salir", "hay lugares que siempre vuelven"][i % 7]}
        </div>
      ))}
    </div>
  )
}

/** Estrella de 8 puntas del diseño nuevo (burdeos), a `size` px de lienzo/pantalla. */
export function Star8({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden className={className} style={style} viewBox="-10 -10 20 20" fill="#3a1010">
      <path d="M0.00 -10.00 L1.26 -3.05 L5.94 -5.94 L3.05 -1.26 L10.00 0.00 L3.05 1.26 L5.94 5.94 L1.26 3.05 L0.00 10.00 L-1.26 3.05 L-5.94 5.94 L-3.05 1.26 L-10.00 0.00 L-3.05 -1.26 L-5.94 -5.94 L-1.26 -3.05Z" />
    </svg>
  )
}

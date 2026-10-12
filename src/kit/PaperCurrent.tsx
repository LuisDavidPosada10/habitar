import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react"

/**
 * "Corriente de papel": el agua como un collage de tiras de papel recortado (salvia, crema, azules y un hilo dorado) con bordes
 * rasgados, un reborde claro de papel y sombra, apiladas en capas que ondulan solas. Al tocar, las tiras se levantan y una onda
 * viaja por ellas; al arrastrar, se abomban bajo el dedo. Canvas 2D sin dependencias, en unidades de diseño (1000×710) que escalan
 * con la pantalla. El bucle se detiene si la pestaña está oculta o el elemento sale de pantalla; con "reducir movimiento" se dibuja
 * un cuadro fijo (y un par de cuadros al tocar).
 */
type Props = { className?: string; style?: CSSProperties; children?: ReactNode; label?: string; onFirstTouch?: () => void }

const W0 = 1000, H0 = 710
const STEP = 5
const RIM = 3.4
const RIM_COLOR = "#f6eedb"

type Strip = {
  color: string; top: number; bot: number; end: number; aT: number; aB: number; ph: number; sp: number
  jt: Float32Array; jb: Float32Array; je: Float32Array
  foam?: boolean
}
type Ripple = { x: number; y: number; t: number }

// de atrás hacia adelante
const SPEC: Omit<Strip, "jt" | "jb" | "je">[] = [
  { color: "#a8bf96", top: 70, bot: 330, end: 945, aT: 22, aB: 26, ph: 0.4, sp: 0.55 },
  { color: "#efe0c4", top: 150, bot: 380, end: 890, aT: 20, aB: 24, ph: 2.1, sp: 0.7 },
  { color: "#9fc3d8", top: 225, bot: 470, end: 975, aT: 26, aB: 22, ph: 4.0, sp: 0.62 },
  { color: "#5b8db8", top: 330, bot: 560, end: 950, aT: 28, aB: 24, ph: 3.1, sp: 0.8, foam: true },
  { color: "#1f4e8c", top: 450, bot: 665, end: 985, aT: 24, aB: 20, ph: 5.2, sp: 0.9, foam: true },
  { color: "#e2b53f", top: 392, bot: 414, end: 930, aT: 30, aB: 30, ph: 1.2, sp: 1.05 },   // hilo dorado al frente
]

export default function PaperCurrent({ className, style, children, label, onFirstTouch }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const api = useRef<{ ripple: (x: number, y: number) => void; move: (id: number, x: number, y: number) => void; up: (id: number) => void } | null>(null)
  const first = useRef(false)

  useEffect(() => {
    const canvas = cv.current!, wrap = box.current!
    const ctx = canvas.getContext("2d")!
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let t = reduce ? 3 : 0, last = 0, raf = 0, onScreen = true, dead = false
    const ripples: Ripple[] = []
    const pointers = new Map<number, { x: number; y: number }>()

    // bordes rasgados: ruido suave y fijo por tira
    const noise = (n: number, amp: number) => {
      const a = new Float32Array(n); let v = 0
      for (let i = 0; i < n; i++) { v = v * 0.6 + (Math.random() - 0.5) * amp; a[i] = v }
      return a
    }
    const strips: Strip[] = SPEC.map((s) => ({ ...s, jt: noise(260, 3.2), jb: noise(260, 3.2), je: noise(24, 16) }))

    const wave = (s: Strip, base: number, a: number, x: number, k: number) =>
      base + a * Math.sin(0.0072 * x - s.sp * t + s.ph + k) + 0.55 * a * Math.sin(0.0158 * x - 1.35 * s.sp * t + s.ph * 1.7 + k * 2) + 0.3 * a * Math.sin(0.0031 * x + 0.4 * s.sp * t + k)

    const lift = (x: number, cy: number) => {
      let d = 0
      for (const r of ripples) {
        const age = t - r.t, front = age * 330, dx = Math.abs(x - r.x)
        const env = Math.exp(-age * 1.15), pack = Math.exp(-(((dx - front) / 70) ** 2))
        const near = 0.35 + 0.65 * Math.exp(-(((cy - r.y) / 260) ** 2))
        d -= 36 * env * pack * Math.cos((dx - front) / 20) * near
      }
      for (const p of pointers.values()) {
        const near = 0.3 + 0.7 * Math.exp(-(((cy - p.y) / 240) ** 2))
        d -= 40 * Math.exp(-(((x - p.x) / 85) ** 2)) * near
      }
      return d
    }

    const edge = (s: Strip, which: "t" | "b", x: number, i: number) => {
      const cy = (s.top + s.bot) / 2
      const base = which === "t" ? s.top : s.bot
      const a = which === "t" ? s.aT : s.aB
      const j = (which === "t" ? s.jt : s.jb)[Math.min(i, 259)]
      return wave(s, base, a, x, which === "t" ? 0 : 1.9) + lift(x, cy) * (which === "t" ? 1 : 0.85) + j
    }

    const trace = (s: Strip, grow: number, ys: { t: number[]; b: number[] }, xs: number[]) => {
      const n = xs.length
      ctx.beginPath()
      ctx.moveTo(xs[0] - grow, ys.t[0] - grow)
      for (let i = 1; i < n; i++) ctx.lineTo(xs[i], ys.t[i] - grow)
      // extremo derecho rasgado (baja de la orilla superior a la inferior)
      const xe = xs[n - 1], yt = ys.t[n - 1] - grow, yb = ys.b[n - 1] + grow, m = s.je.length
      for (let k = 1; k < m - 1; k++) ctx.lineTo(xe + grow + s.je[k], yt + ((yb - yt) * k) / (m - 1))
      for (let i = n - 1; i >= 0; i--) ctx.lineTo(xs[i], ys.b[i] + grow)
      ctx.lineTo(xs[0] - grow, ys.b[0] + grow)
      ctx.closePath()
    }

    const render = () => {
      const cw = canvas.width, ch = canvas.height
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cw, ch)
      const sc = cw / W0
      ctx.setTransform(sc, 0, 0, sc, 0, 0)
      for (const s of strips) {
        const xs: number[] = [], yt: number[] = [], yb: number[] = []
        for (let x = -12, i = 0; x <= s.end; x += STEP, i++) {
          xs.push(x); yt.push(edge(s, "t", x, i)); yb.push(Math.max(edge(s, "b", x, i), yt[yt.length - 1] + 14))
        }
        const ys = { t: yt, b: yb }
        // reborde claro del papel rasgado + sombra
        ctx.save()
        ctx.shadowColor = "rgba(38,28,14,.34)"; ctx.shadowBlur = 14 * sc; ctx.shadowOffsetY = 5 * sc
        trace(s, RIM, ys, xs); ctx.fillStyle = RIM_COLOR; ctx.fill()
        ctx.restore()
        trace(s, 0, ys, xs); ctx.fillStyle = s.color; ctx.fill()
        if (s.foam) {                       // hilo de espuma bajo la orilla superior
          ctx.beginPath()
          for (let i = 0; i < xs.length; i++) { const y = yt[i] + 9 + 2.2 * Math.sin(xs[i] * 0.05 - t * 1.6 + s.ph); i ? ctx.lineTo(xs[i], y) : ctx.moveTo(xs[i], y) }
          ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.stroke()
        }
      }
    }

    const setup = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight
      if (!w || !h) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr); canvas.height = Math.round((w * H0 * dpr) / W0)
      canvas.style.height = `${(w * H0) / W0}px`
      render()
    }

    const frame = (now: number) => {
      raf = 0
      if (dead) return
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now
      t += dt
      for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t > 3.4) ripples.splice(i, 1)
      render()
      if (onScreen && !document.hidden && !reduce) raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!raf && !reduce && onScreen && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }

    api.current = {
      ripple: (x, y) => { ripples.push({ x, y, t }); if (reduce) { for (const s of [0.15, 0.4, 0.7]) { t += s; render() } } else kick() },
      move: (id, x, y) => { pointers.set(id, { x, y }); if (reduce) render() },
      up: (id) => { pointers.delete(id); if (reduce) render() },
    }

    const ro = new ResizeObserver(() => { setup(); kick() }); ro.observe(wrap)
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick() }); io.observe(wrap)
    const vis = () => { if (!document.hidden) kick() }
    document.addEventListener("visibilitychange", vis)
    setup(); kick()
    return () => { dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", vis) }
  }, [])

  // coordenadas en unidades de diseño (1000×710), aunque el contenedor sea más ancho/angosto
  const pos = (e: PointerEvent) => {
    const r = box.current!.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * W0, ((e.clientY - r.top) / r.width) * W0] as const
  }
  const touch = () => { if (!first.current) { first.current = true; onFirstTouch?.() } }

  return (
    <div
      ref={box} role="button" tabIndex={0} aria-label={label}
      className={className} style={{ touchAction: "pan-y", cursor: "pointer", ...style }}
      onPointerDown={(e) => { const [x, y] = pos(e); api.current?.move(e.pointerId, x, y); api.current?.ripple(x, y); touch() }}
      onPointerMove={(e) => { if (e.buttons || e.pointerType === "mouse") { const [x, y] = pos(e); api.current?.move(e.pointerId, x, y) } }}
      onPointerUp={(e) => api.current?.up(e.pointerId)}
      onPointerCancel={(e) => api.current?.up(e.pointerId)}
      onPointerLeave={(e) => api.current?.up(e.pointerId)}
      onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); api.current?.ripple(W0 * (0.25 + Math.random() * 0.5), H0 * (0.25 + Math.random() * 0.5)); touch() } }}
    >
      <canvas ref={cv} className="absolute left-0 top-0 w-full" aria-hidden />
      {children}
    </div>
  )
}

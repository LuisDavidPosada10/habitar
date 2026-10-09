import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"

/**
 * Estanque con agua "viva": simulación de ondas (ecuación de onda 2D sobre una rejilla de baja resolución) que
 * refracta y ilumina la foto de fondo en un <canvas>. Al tocar cae una gota; al arrastrar se deja estela; de vez en cuando
 * cae una gota suave sola. El bucle sólo corre mientras hay movimiento (si no, no gasta batería).
 * Sin dependencias. `src` = imagen; (sx, sy, sw, sh) = recorte del estanque en píxeles de esa imagen.
 */
type Props = {
  src: string; sx: number; sy: number; sw: number; sh: number
  className?: string; style?: CSSProperties; children?: ReactNode
  onFirstTouch?: () => void
  label?: string
  /** Intensidad de la refracción y del brillo (1 = normal). */
  strength?: number
}

const SIM = 0.5          // resolución de la rejilla respecto del canvas
const STEPS = 2          // pasos de simulación por cuadro (velocidad de las ondas)
const DAMP = 0.988

export default function WaterPond({ src, sx, sy, sw, sh, className, style, children, onFirstTouch, label, strength = 1 }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const api = useRef<{ drop: (nx: number, ny: number, amp: number) => void } | null>(null)
  const first = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = cv.current!, box = wrap.current!
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let img: HTMLImageElement | null = null
    let cw = 0, ch = 0, gw = 0, gh = 0
    let srcData: Uint8ClampedArray, out: ImageData
    let cur: Float32Array, prev: Float32Array, gx: Float32Array, gy: Float32Array
    let raf = 0, running = false, quiet = 0, ambient = 0, dead = false

    const setup = () => {
      if (!img || !box.clientWidth) return
      const s = Math.min(window.devicePixelRatio || 1, 1.25)
      cw = Math.min(600, Math.max(120, Math.round(box.clientWidth * s)))
      ch = Math.max(80, Math.round(cw * (sh / sw)))
      canvas.width = cw; canvas.height = ch
      const off = document.createElement("canvas"); off.width = cw; off.height = ch
      const o = off.getContext("2d")!; o.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
      srcData = o.getImageData(0, 0, cw, ch).data
      out = ctx.createImageData(cw, ch)
      gw = Math.max(40, Math.round(cw * SIM)); gh = Math.max(30, Math.round(ch * SIM))
      cur = new Float32Array(gw * gh); prev = new Float32Array(gw * gh)
      gx = new Float32Array(gw * gh); gy = new Float32Array(gw * gh)
      ctx.putImageData(new ImageData(new Uint8ClampedArray(srcData), cw, ch), 0, 0)
    }

    const step = () => {
      for (let y = 1; y < gh - 1; y++) {
        let i = y * gw + 1
        for (let x = 1; x < gw - 1; x++, i++) {
          prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - gw] + cur[i + gw]) * 0.5 - prev[i]) * DAMP
        }
      }
      const t = cur; cur = prev; prev = t
    }

    const render = () => {
      // gradientes en la rejilla
      let energy = 0
      for (let y = 1; y < gh - 1; y++) {
        let i = y * gw + 1
        for (let x = 1; x < gw - 1; x++, i++) {
          gx[i] = cur[i + 1] - cur[i - 1]; gy[i] = cur[i + gw] - cur[i - gw]
          const a = cur[i] < 0 ? -cur[i] : cur[i]; if (a > energy) energy = a
        }
      }
      const K = 22 * strength, L = 70 * strength
      const fx = (gw - 1) / (cw - 1), fy = (gh - 1) / (ch - 1)
      const d = out.data
      for (let y = 0; y < ch; y++) {
        const gyF = y * fy, y0 = gyF | 0, ty = gyF - y0, y1 = y0 + 1 < gh ? y0 + 1 : y0
        for (let x = 0; x < cw; x++) {
          const gxF = x * fx, x0 = gxF | 0, tx = gxF - x0, x1 = x0 + 1 < gw ? x0 + 1 : x0
          const a = y0 * gw + x0, b = y0 * gw + x1, c = y1 * gw + x0, e = y1 * gw + x1
          const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty
          const dx = gx[a] * w00 + gx[b] * w10 + gx[c] * w01 + gx[e] * w11
          const dy = gy[a] * w00 + gy[b] * w10 + gy[c] * w01 + gy[e] * w11
          let u = x + dx * K, v = y + dy * K
          u = u < 0 ? 0 : u > cw - 1 ? cw - 1 : u; v = v < 0 ? 0 : v > ch - 1 ? ch - 1 : v
          const si = ((v | 0) * cw + (u | 0)) * 4, di = (y * cw + x) * 4
          const shade = (dx * 0.7 - dy) * L
          const spec = shade > 14 ? (shade - 14) * 1.6 : 0
          let r = srcData[si] + shade + spec, g = srcData[si + 1] + shade * 1.04 + spec, bl = srcData[si + 2] + shade * 0.95 + spec * 0.9
          d[di] = r < 0 ? 0 : r > 255 ? 255 : r; d[di + 1] = g < 0 ? 0 : g > 255 ? 255 : g; d[di + 2] = bl < 0 ? 0 : bl > 255 ? 255 : bl; d[di + 3] = 255
        }
      }
      ctx.putImageData(out, 0, 0)
      return energy
    }

    const loop = () => {
      for (let n = 0; n < STEPS; n++) step()
      const energy = render()
      quiet = energy < 0.02 ? quiet + 1 : 0
      if (quiet > 20 || dead) {
        running = false
        // al quedar en calma, deja la foto original sin refracción
        ctx.putImageData(new ImageData(new Uint8ClampedArray(srcData), cw, ch), 0, 0)
        cur.fill(0); prev.fill(0)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    const start = () => { quiet = 0; if (!running && img) { running = true; raf = requestAnimationFrame(loop) } }

    const drop = (nx: number, ny: number, amp: number) => {
      if (!img || !cur) return
      const cx = Math.round(nx * (gw - 1)), cy = Math.round(ny * (gh - 1)), r = Math.max(3, Math.round(gw * 0.018))
      for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
        const px = cx + x, py = cy + y
        if (px < 2 || py < 2 || px > gw - 3 || py > gh - 3) continue
        const q = Math.sqrt(x * x + y * y) / r
        if (q <= 1) cur[py * gw + px] -= amp * 0.5 * (1 + Math.cos(Math.PI * q))
      }
      start()
    }
    api.current = { drop }

    const scheduleAmbient = () => {
      if (reduce) return
      ambient = window.setTimeout(() => {
        if (!document.hidden) drop(0.15 + Math.random() * 0.7, 0.15 + Math.random() * 0.7, 3 + Math.random() * 2)
        scheduleAmbient()
      }, 2600 + Math.random() * 2600)
    }

    const im = new Image(); im.crossOrigin = "anonymous"
    im.onload = () => { img = im; setup(); if (!dead) scheduleAmbient() }
    im.src = src
    const ro = new ResizeObserver(() => { if (img) { setup() } })
    ro.observe(box)
    return () => { dead = true; cancelAnimationFrame(raf); window.clearTimeout(ambient); ro.disconnect(); api.current = null }
  }, [src, sx, sy, sw, sh, strength])

  const pos = (e: PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect()
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, px: e.clientX, py: e.clientY }
  }
  const down = (e: PointerEvent) => {
    const p = pos(e)
    if (!first.current) { first.current = true; onFirstTouch?.() }
    last.current = { x: e.clientX, y: e.clientY }
    api.current?.drop(p.x, p.y, 9)
  }
  const move = (e: PointerEvent) => {
    if (!last.current) return
    const dx = e.clientX - last.current.x, dy = e.clientY - last.current.y
    if (dx * dx + dy * dy < 22 * 22) return
    last.current = { x: e.clientX, y: e.clientY }
    const p = pos(e)
    api.current?.drop(p.x, p.y, 4.5)
  }
  const up = () => { last.current = null }

  return (
    <div
      ref={wrap} className={className} style={{ ...style, touchAction: "manipulation", cursor: "pointer" }}
      role="button" tabIndex={0} aria-label={label}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!first.current) { first.current = true; onFirstTouch?.() } api.current?.drop(0.25 + Math.random() * 0.5, 0.25 + Math.random() * 0.5, 9) } }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}
    >
      <canvas ref={cv} aria-hidden className="absolute inset-0 size-full" />
      {children}
    </div>
  )
}

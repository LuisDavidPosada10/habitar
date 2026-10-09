// Generador de bordes rasgados (clip-path) con semilla, para que cada pieza sea distinta pero estable.
export function rng(seed: number) {
  let s = (seed >>> 0) || 1
  return () => {
    s ^= s << 13; s >>>= 0
    s ^= s >>> 17
    s ^= s << 5; s >>>= 0
    return s / 4294967296
  }
}

export type Edges = { t?: boolean; r?: boolean; b?: boolean; l?: boolean }

/** Polígono CSS en % con los bordes indicados rasgados. `amp` es la amplitud en % del lado. */
export function tornPolygon(seed: number, edges: Edges = { t: true, r: true, b: true, l: true }, amp = 1.4, step = 3.2): string {
  const r = rng(seed)
  const jag = (on: boolean | undefined) => (on ? r() * amp : 0)
  const pts: string[] = []
  const n = (len: number) => Math.max(8, Math.round(len / step))
  const cnt = n(100)
  for (let i = 0; i <= cnt; i++) pts.push(`${((i / cnt) * 100).toFixed(2)}% ${jag(edges.t).toFixed(2)}%`)
  for (let i = 1; i <= cnt; i++) pts.push(`${(100 - jag(edges.r)).toFixed(2)}% ${((i / cnt) * 100).toFixed(2)}%`)
  for (let i = cnt - 1; i >= 0; i--) pts.push(`${((i / cnt) * 100).toFixed(2)}% ${(100 - jag(edges.b)).toFixed(2)}%`)
  for (let i = cnt - 1; i >= 1; i--) pts.push(`${jag(edges.l).toFixed(2)}% ${((i / cnt) * 100).toFixed(2)}%`)
  return `polygon(${pts.join(",")})`
}

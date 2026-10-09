import { Link } from "react-router"

/** Flecha "volver" de las pantallas de escenario (mismo chevrón en todas). Va dentro de un lienzo con `--k`; (cx, cy) = centro en unidades del lienzo. */
export default function BackChevron({ to, label, cx, cy, color = "#1d1611" }: { to: string; label: string; cx: number; cy: number; color?: string }) {
  const k = (n: number) => `calc(var(--k) * ${n})`
  return (
    <Link to={to} aria-label={label} className="absolute" style={{ left: k(cx - 40), top: k(cy - 40), width: k(80), height: k(80) }}>
      <svg className="absolute" style={{ left: k(29), top: k(22), width: k(22), height: k(36) }} viewBox="0 0 22 36" fill="none" aria-hidden>
        <path d="M19 3L4 18l15 15" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}

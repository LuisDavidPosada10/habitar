import type { ReactNode } from "react"
import { Link } from "react-router"
import Shell, { type ThemeKey } from "./Shell"
import { Star } from "./Pieces"

const back = (
  <svg width="24" height="14" viewBox="0 0 24 14" fill="none" aria-hidden><path d="M24 7H1M6 1 1 7l5 6" stroke="currentColor" strokeWidth="1.4" /></svg>
)

export const arrowRight = (
  <svg width="26" height="10" viewBox="0 0 26 10" fill="none" aria-hidden><path d="M0 5H25M21 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" /></svg>
)

type Props = {
  theme: Exclude<ThemeKey, "home">
  counter?: string
  kicker: string          // p. ej. "AUTOPOÉTICA / 01"
  index?: string          // número grande
  title: string           // admite saltos con \n
  question?: string
  intro?: ReactNode       // texto debajo del título (a la izquierda)
  backTo: string
  backLabel: string
  next?: { to: string; label: string; external?: boolean }
  children: ReactNode     // zona de medios (a la derecha en escritorio)
  footer?: ReactNode      // texto debajo de los medios
}

const fonts = { mon: "f-bodoni", silvana: "f-play", juliana: "f-play" }
const kickerFont = { mon: "f-mont", silvana: "f-mont", juliana: "f-mono" }

/** Plantilla común de los escenarios: título a un lado, medios al otro, todo fluido. */
export default function ScenarioPage({ theme, counter, kicker, index, title, question, intro, backTo, backLabel, next, children, footer }: Props) {
  const lines = title.split("\n")
  return (
    <Shell theme={theme} counter={counter} className="mx-auto max-w-[1180px] px-6 pb-20 sm:px-10">

      <nav className="flex items-center gap-4 pt-5">
        <Link to={backTo} aria-label={backLabel} className="inline-flex items-center gap-3 text-[var(--ink)] transition hover:-translate-x-1">
          {back}
        </Link>
        <p className={`${kickerFont[theme]} text-[.68rem] tracking-[.2em] text-[var(--soft)]`}>{kicker}</p>
        <span className="hidden h-px w-24 bg-[var(--ink)]/60 sm:block" />
      </nav>

      <div className="mt-6 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-start">
        <header className="lg:sticky lg:top-8">
          {index && (
            <div className="flex items-center gap-3">
              <span className={`${fonts[theme]} text-xl italic`}>{index}</span>
              <span className="h-px w-8 bg-[var(--ink)]/70" />
            </div>
          )}
          <h1 className={`${fonts[theme]} mt-3 text-[clamp(2.6rem,7vw,5.2rem)] leading-[.98] tracking-[-.01em] ${theme === "juliana" ? "italic" : ""}`}>
            {lines.map((l, i) => (<span key={i} className="block">{l}</span>))}
          </h1>
          {question && (
            <h2 className="f-caslon mt-5 max-w-[22ch] text-[clamp(1.05rem,2vw,1.45rem)] leading-[1.3]">{question}</h2>
          )}
          {intro && <div className="mt-4 max-w-[38ch] text-[clamp(.95rem,1.5vw,1.15rem)] leading-[1.5] text-[#2a1d14]">{intro}</div>}
          <Star size={20} color="var(--accent)" className="mt-6" />
        </header>

        <div className="min-w-0">
          {children}
          {footer && <div className="f-caslon mt-8 max-w-[52ch] text-[clamp(.9rem,1.35vw,1.05rem)] leading-[1.6] text-[#2b1b0e]">{footer}</div>}
          {next && (
            <div className="mt-8">
              {next.external ? (
                <a href={next.to} target="_blank" rel="noreferrer" className="f-mont inline-flex items-center gap-4 rounded-full border-[1.3px] border-[var(--ink)] px-6 py-3 text-[.68rem] font-medium tracking-[.22em] transition hover:bg-[var(--ink)] hover:text-[#f3e9da]">{next.label}{arrowRight}</a>
              ) : (
                <Link to={next.to} className="f-mont inline-flex items-center gap-4 rounded-full border-[1.3px] border-[var(--ink)] px-6 py-3 text-[.68rem] font-medium tracking-[.22em] transition hover:bg-[var(--ink)] hover:text-[#f3e9da]">{next.label}{arrowRight}</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Shell>
  )
}

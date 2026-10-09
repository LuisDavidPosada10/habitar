import { Link } from "react-router"
import Shell from "../kit/Shell"
import { Crop, FilmStrip, Star, Tape, Torn } from "../kit/Pieces"
import { photos } from "../kit/photos"
import { universes } from "../kit/data"

const arrow = (
  <svg width="26" height="10" viewBox="0 0 26 10" fill="none" aria-hidden><path d="M0 5H25M21 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" /></svg>
)

const hero = { mon: photos.monHero, silvana: photos.silvanaHero, juliana: photos.julianaHero }
const thumbs = { mon: photos.mon, silvana: photos.silvana, juliana: photos.juliana }
const titleFont = { mon: "f-bodoni", silvana: "f-bodoni", juliana: "f-play" }

/** Pantalla de un universo: retrato del artista + lista de escenarios. */
export default function Hub({ k }: { k: "mon" | "silvana" | "juliana" }) {
  const u = universes[k]
  const counter = k === "juliana" ? "05/05" : undefined
  return (
    <Shell theme={k} counter={counter} className="mx-auto grid max-w-[1200px] gap-x-12 gap-y-6 pb-16 md:grid-cols-[1fr_1fr] md:items-start md:px-8 md:pt-8">
      <div className="relative md:sticky md:top-6">
        <Torn seed={k.length * 7} edges={{ b: true }} amp={2.2}>
          <Crop photo={hero[k]} label={`Retrato de ${u.name}`} className="w-full" />
        </Torn>
        <FilmStrip frames={4} className="pointer-events-none absolute -left-3 top-[48%] hidden h-[30%] w-9 -rotate-3 md:block" />
      </div>

      <div className="px-6 md:px-0 md:pt-6">
        <p className="f-mont text-[.7rem] tracking-[.22em] text-[var(--soft)]">03 / UNIVERSO</p>
        <h1 className={`${titleFont[k]} mt-3 text-[clamp(2.4rem,6vw,4.4rem)] leading-[1] tracking-[-.01em]`}>{u.album}</h1>
        <h2 className={`${titleFont[k]} mt-1 text-[clamp(1.5rem,3vw,2.2rem)] italic`}>{u.artistLine}<span className="text-[var(--accent)]">.</span></h2>
        <p className="f-caslon mt-5 max-w-[34ch] text-[clamp(.95rem,1.5vw,1.1rem)] leading-[1.5] text-[#2b1b0e]">{u.lead}</p>

        <div className="mt-10 flex items-center gap-3">
          <Star size={18} color="var(--accent)" />
          <p className="f-mont text-[.7rem] font-medium tracking-[.22em]">EXPLORA LOS ESCENARIOS</p>
        </div>

        <ul className="mt-4 divide-y divide-[color-mix(in_srgb,var(--ink)_20%,transparent)] border-y border-[color-mix(in_srgb,var(--ink)_20%,transparent)]">
          {u.scenarios.map((s, i) => (
            <li key={s.to}>
              <Link to={s.to} className="group grid grid-cols-[2.2rem_1fr_92px_auto] items-center gap-3 py-4 transition hover:bg-black/[.03] sm:grid-cols-[2.6rem_1fr_minmax(120px,40%)_auto] sm:gap-4">
                <span className="f-bodoni text-lg italic text-[var(--accent)]">{s.n}</span>
                <span>
                  <span className={`${titleFont[k]} block text-[clamp(1.05rem,2vw,1.35rem)] leading-tight`}>{s.title}</span>
                  {s.sub && <span className="f-mont mt-1 block text-[.6rem] tracking-[.2em] text-[var(--soft)]">{s.sub}</span>}
                </span>
                <span className="relative block">
                  <Tape className="absolute -top-2 left-3 z-10 hidden sm:block" w={50} rotate={-6} />
                  <Torn seed={i + 40} amp={1.6}><Crop photo={thumbs[k][i]} className="w-full" /></Torn>
                </span>
                <span className="text-[var(--ink)] transition group-hover:translate-x-1">{arrow}</span>
              </Link>
            </li>
          ))}
        </ul>
        
      </div>
    </Shell>
  )
}

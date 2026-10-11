import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router"
import Shell from "../kit/Shell"
import { universes } from "../kit/data"
import { useJourney } from "../kit/journey"

/**
 * Diseño nuevo (PDF "Pagina Web - Diseño", pág. 3, 1179×2556). El fondo (public/universos/bg.webp) es el render SIN
 * texto: arcos con fotos, flores, collage, arcos dorados y la raya dorada quedan en la imagen; el papel es de color
 * plano #efe8df. Título, párrafo, números, nombres, subtítulos, círculos con flecha, frase y botón son HTML en
 * unidades del lienzo (--k = ancho_css / 1179). Barra transparente; el lienzo cubre el alto.
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const GO_MS = 560
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic", fontWeight: 600 } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const

const LT = 940                       // top (lienzo) del enlace de cada columna
const cols = [
  { key: "mon", cx: 229, name: "Mon Laferte", tag: "Lo que arde", color: "#631413" },
  { key: "silvana", cx: 589.5, name: "Silvana Estrada", tag: "Lo que florece", color: "#5d6a50" },
  { key: "juliana", cx: 950, name: "Juliana", tag: "Lo que permanece", color: "#001e55" },
] as const

export default function Universos() {
  const nav = useNavigate()
  const [go, setGo] = useState<string | null>(null)
  const [ctaGo, setCtaGo] = useState(false)
  const journey = useJourney()
  const showCta = journey.all && !journey.sent   // ya entró a los tres universos y aún no dejó su experiencia
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Animación breve (flecha que avanza, las demás opciones se atenúan) y luego navega.
  const enter = (e: MouseEvent, key: string, to: string) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (go) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return nav(to)
    setGo(key)
    timer.current = window.setTimeout(() => nav(to), GO_MS)
  }

  // La flecha cae y se desvanece, lo demás se atenúa, y navega a /experiencia.
  const enterCta = (e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (go || ctaGo) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return nav("/experiencia")
    setCtaGo(true)
    timer.current = window.setTimeout(() => nav("/experiencia"), GO_MS)
  }

  return (
    <Shell bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/universos/bg.webp?v=4" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(65), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: "scaleX(.912)" }}>
          Habitar la música
        </p>
        <p data-m="kick" className="absolute whitespace-nowrap" style={{ ...bodoni, left: k(86), top: k(156), fontSize: k(44), lineHeight: k(52), fontWeight: 600, transform: "scaleX(.885)", transformOrigin: "left" }}>
          03/ Los tres Universos
        </p>

        <h1 className="m-0 font-normal">
          <span data-m="tres" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(303), fontSize: k(222), lineHeight: k(222), fontWeight: 600, color: "#11110f", transform: `translateX(${k(-8)})` }}>Tres</span>
          <span data-m="uni" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(486), fontSize: k(150), lineHeight: k(150), color: "#631413", transform: `translateX(${k(-6)}) scaleX(1.049)` }}>universos</span>
        </h1>

        <p data-m="para" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...mont, top: k(682), fontSize: k(34), lineHeight: k(35) }}>
          Cada artista, una mirada, un contexto<br />y una forma de habitar la música.
        </p>

        {cols.map((c, i) => {
          const u = universes[c.key]
          const on = go === c.key
          const off = (go !== null && !on) || ctaGo
          return (
            <Link
              key={c.key}
              to={u.to}
              onClick={(e) => enter(e, c.key, u.to)}
              aria-label={`Entrar al universo de ${u.name}`}
              className="group absolute block outline-none transition-[opacity,filter] duration-300"
              style={{ left: k(c.cx - 170), top: k(LT), width: k(340), height: k(820), opacity: off ? 0.28 : 1, filter: off ? "saturate(.4)" : undefined } as CSSProperties}
            >
              <span data-m={`num${i}`} className="absolute inset-x-0 text-center" style={{ ...bodoniIt, top: k(1533 - LT), fontSize: k(46), lineHeight: k(50), fontWeight: 700, color: c.color, transform: "scaleX(1.15)" }}>{u.index}</span>
              <span data-m={`nm${i}`} className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(1571 - LT), fontSize: k(40.5), lineHeight: k(56), fontWeight: 600, color: "#000" }}>{c.name}</span>
              <span data-m={`tg${i}`} className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoniIt, top: k(1626 - LT), fontSize: k(25), lineHeight: k(34), color: c.color }}>{c.tag}</span>
              <span
                data-m={`ci${i}`}
                className={`absolute flex items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-active:scale-95 ${on ? "scale-110" : ""}`}
                style={{ left: k(170 - 30.5), top: k(1683 - LT), width: k(61), height: k(61), border: `${k(1.3)} solid #7f6360`, color: "#3a1010" }}
              >
                <svg className={on ? "arrow-go" : "transition-transform duration-300 group-hover:translate-x-[8%]"} style={{ width: k(30), height: k(20) }} viewBox="0 0 18 12" fill="none" aria-hidden><path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
          )
        })}

        <p data-m="phrase" className="absolute inset-x-0 whitespace-nowrap text-center transition-opacity duration-300" style={{ ...mont, top: k(1856), fontSize: k(34), lineHeight: k(35), opacity: go || ctaGo ? 0.3 : 1 }}>
          Tres formas de sentir, contar y habitar<br />la música.
        </p>

        {showCta && (
          <Link
            to="/experiencia" onClick={enterCta} aria-label="Déjanos tu experiencia"
            className="cta-in group absolute flex flex-col items-center outline-none"
            style={{ left: k(312), top: k(2000), width: k(555), height: k(200) }}
          >
            {/* flecha hacia abajo: se mece suave y, al tocarla, cae y se desvanece antes de navegar */}
            <svg data-m="cta-arrow" className={`shrink-0 cta-bob ${ctaGo ? "cta-down" : ""} transition-transform duration-300 group-hover:translate-y-[3px]`} style={{ width: k(39), height: k(56), marginTop: k(7) }} viewBox="0 0 39 56" fill="none" aria-hidden>
              <path d="M19.5 2V54M4 38.5l15.5 15.5L35 38.5" stroke="#cfa12e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              data-m="cta-pill"
              className="flex shrink-0 items-center justify-center whitespace-nowrap transition-opacity duration-300"
              style={{ ...bodoni, marginTop: k(31), width: k(524), height: k(103), borderRadius: k(52), border: `${k(1.2)} solid #8f7671`, fontSize: k(43), fontWeight: 500, color: "#3a1010", opacity: ctaGo ? 0.4 : 1 }}
            >
              Déjanos Tu Experiencia
            </span>
          </Link>
        )}
      </div>
    </Shell>
  )
}

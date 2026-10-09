import { createContext, useContext, useState, type CSSProperties, type ReactNode } from "react"
import { Link, useLocation } from "react-router"
import { Crop } from "./Pieces"
import { photos } from "./photos"

export type ThemeKey = "home" | "mon" | "silvana" | "juliana"

export const themes: Record<ThemeKey, { bar: string; accent: string; ink: string; soft: string }> = {
  home: { bar: "#1d1611", accent: "#b3141c", ink: "#1d1611", soft: "#6d5a45" },
  mon: { bar: "#500a0e", accent: "#8a1620", ink: "#1d1611", soft: "#6a4a3a" },
  silvana: { bar: "#1c231b", accent: "#6b7a4f", ink: "#241f14", soft: "#6a6249" },
  juliana: { bar: "#0f1a24", accent: "#24476f", ink: "#16181c", soft: "#4d5560" },
}

export const menuItems = [
  { label: "Inicio", to: "/" },
  { label: "El proyecto", to: "/proyecto" },
  { label: "Los tres universos", to: "/universos" },
  { label: "Mon Laferte", to: "/mon" },
  { label: "Silvana Estrada", to: "/silvana" },
  { label: "Juliana Velásquez", to: "/juliana" },
  { label: "Dejar tu experiencia", to: "/experiencia" },
]

const Ctx = createContext<() => void>(() => {})

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  return (
    <Ctx.Provider value={() => setOpen(true)}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#1d1611]/96 text-[#f3e9da]" role="dialog" aria-label="Menú">
          <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute right-5 top-4 text-4xl leading-none">×</button>
          <p className="mb-3 text-xs tracking-[.3em]" style={{ fontFamily: "Montserrat, sans-serif" }}>HABITAR LA MÚSICA</p>
          {menuItems.map((m) => (
            <Link key={m.to} to={m.to} onClick={() => setOpen(false)} className="text-[clamp(1.6rem,4vw,2.4rem)]" style={{ fontFamily: "'Bodoni Moda', serif", color: pathname === m.to ? "#e0525b" : undefined }}>
              {m.label}
            </Link>
          ))}
        </div>
      )}
    </Ctx.Provider>
  )
}

const decorW = (ph: { w: number; h: number }): CSSProperties => ({ width: `clamp(80px, min(20vw, calc(36dvh * ${ph.w / ph.h})), 300px)` })

const burger = (c: string) => (
  <svg width="26" height="18" viewBox="0 0 26 18" fill="none" aria-hidden><path d="M0 .9H26M0 9H26M0 17.1H26" stroke={c} strokeWidth="1.8" /></svg>
)

/** Estructura común: fondo de papel, barra superior y contenido. */
export default function Shell({
  theme = "home", label = "HABITAR LA MÚSICA", counter, bar = true, children, className = "",
}: { theme?: ThemeKey; label?: string; counter?: string; bar?: boolean; children: ReactNode; className?: string }) {
  const openMenu = useContext(Ctx)
  const t = themes[theme]
  const vars = { "--ink": t.ink, "--accent": t.accent, "--bar": t.bar, "--soft": t.soft } as CSSProperties
  const fg = bar ? "#f3e9da" : t.ink
  return (
    <div className="paper relative min-h-dvh w-full overflow-x-clip" style={{ ...vars, color: t.ink, fontFamily: "'EB Garamond', serif" }}>
      <header className="relative z-30 flex h-11 items-center justify-between px-4 sm:px-8" style={{ background: bar ? t.bar : "transparent", color: fg }}>
        <button type="button" aria-label="Abrir menú" onClick={openMenu} className="-m-2 p-2">{burger(fg)}</button>
        <p className="text-[.7rem] tracking-[.28em] sm:text-xs" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}>{label}</p>
        {counter ? (
          <p className="min-w-[26px] text-right text-[.65rem] tracking-[.12em]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{counter}</p>
        ) : (
          <span className="min-w-[26px]" aria-hidden />
        )}
      </header>
      {theme !== "home" && (
        <>
          <Crop photo={photos.decor[theme][0]} style={decorW(photos.decor[theme][0])} className="pointer-events-none absolute bottom-0 left-0 z-0  fade [--fl:0%] [--fb:0%]" />
          <Crop photo={photos.decor[theme][1]} style={decorW(photos.decor[theme][1])} className="pointer-events-none absolute bottom-0 right-0 z-0  fade [--fr:0%] [--fb:0%]" />
        </>
      )}
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  )
}

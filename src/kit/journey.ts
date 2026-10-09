import { useEffect, useState } from "react"
import { useLocation } from "react-router"

/**
 * Recorrido del visitante, guardado SÓLO en su navegador (localStorage): qué universos ya vio y si cerró la invitación a "Dejar tu experiencia".
 * Un universo cuenta como "visto" cuando el visitante ENTRA a él: su hub (/mon, /silvana, /juliana) o cualquiera de sus escenarios (/mon-1…4, etc.).
 * Cuando ya vio los tres, /universos muestra abajo la flechita "Déjanos tu experiencia" (pages/Universos.tsx) y el menú marca "Dejar tu experiencia".
 */
export const UNIVERSES = ["mon", "silvana", "juliana"] as const
export type UniverseKey = (typeof UNIVERSES)[number]

const KEY = "habitar.journey.v1"
type State = { seen: UniverseKey[]; sent: boolean }
const EMPTY: State = { seen: [], sent: false }

const read = (): State => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") } } catch { return EMPTY }
}
const write = (s: State) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* modo privado / sin almacenamiento: la invitación simplemente no se recuerda */ }
  window.dispatchEvent(new Event("habitar:journey"))
}

export const getJourney = read
export const markSent = () => write({ ...read(), sent: true })

/** Marca el universo de la ruta actual si es su hub o uno de sus escenarios (p. ej. "/mon" o "/mon-2"). Se monta una sola vez en App. */
export function JourneyTracker() {
  const { pathname } = useLocation()
  useEffect(() => {
    const m = /^\/(mon|silvana|juliana)(-[1-4])?\/?$/.exec(pathname)
    if (!m) return
    const s = read(), u = m[1] as UniverseKey
    if (!s.seen.includes(u)) write({ ...s, seen: [...s.seen, u] })
  }, [pathname])
  return null
}

export function useJourney() {
  const [s, setS] = useState<State>(read)
  useEffect(() => {
    const f = () => setS(read())
    window.addEventListener("habitar:journey", f); window.addEventListener("storage", f)
    f()   // el JourneyTracker puede haber escrito antes de que este hook empezara a escuchar
    return () => { window.removeEventListener("habitar:journey", f); window.removeEventListener("storage", f) }
  }, [])
  const all = UNIVERSES.every((u) => s.seen.includes(u))
  return { ...s, all }
}

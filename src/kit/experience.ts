import { getJourney, markSent } from "./journey"

/**
 * Envío de "Dejar tu experiencia". Destinos (variables de entorno; ver .env.example y CLAUDE.md), en este orden:
 *  1) VITE_FORMSPREE_URL → Formspree (https://formspree.io): cada respuesta llega al correo del dueño del formulario y queda en su panel (Submissions).
 *  2) VITE_EXPERIENCE_URL → cualquier endpoint propio (Supabase, función de Vercel, etc.) que reciba un POST con { text, at, seen }.
 *  3) Ninguno → en desarrollo se guarda sólo en este navegador (localStorage "habitar.experiencias") y se avisa en consola;
 *     en PRODUCCIÓN se trata como error (para no decirle "enviado" a alguien cuya respuesta no llegó a nadie).
 * `hp` es el campo trampa anti-spam (oculto): si viene lleno es un bot y se descarta en silencio.
 */
const FORMSPREE = import.meta.env.VITE_FORMSPREE_URL as string | undefined
const ENDPOINT = import.meta.env.VITE_EXPERIENCE_URL as string | undefined

export async function submitExperience(text: string, hp = "") {
  if (hp) { markSent(); return }
  const payload = { text: text.trim().slice(0, 300), at: new Date().toISOString(), seen: getJourney().seen }
  if (FORMSPREE) {
    const r = await fetch(FORMSPREE, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: "Nueva experiencia · Habitar la música",
        experiencia: payload.text,
        universos_vistos: payload.seen.join(", ") || "(ninguno)",
        fecha: payload.at,
      }),
    })
    const j = await r.json().catch(() => null)
    if (!r.ok || j?.errors) throw new Error(`Formspree: ${j?.errors?.[0]?.message ?? r.status}`)
  } else if (ENDPOINT) {
    // text/plain (y no application/json) a propósito: es una petición "simple" y evita el preflight CORS que algunos servicios no responden.
    const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
  } else if (import.meta.env.PROD) {
    throw new Error("Falta VITE_FORMSPREE_URL en el despliegue: la respuesta no tiene a dónde ir.")
  } else {
    console.warn("[experiencia] No hay VITE_FORMSPREE_URL ni VITE_EXPERIENCE_URL: la respuesta se guardó sólo en este navegador.")
    try {
      const all = JSON.parse(localStorage.getItem("habitar.experiencias") || "[]")
      localStorage.setItem("habitar.experiencias", JSON.stringify([...all, payload]))
    } catch { /* sin almacenamiento */ }
  }
  markSent()
}

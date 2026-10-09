import { useState, type FormEvent } from "react"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { submitExperience } from "../kit/experience"

/**
 * /experiencia · Dejar tu experiencia. Lienzo = public/experiencia/bg.webp (899×1637, sin textos, sin placeholder/contador de la tarjeta ni botón).
 * Origen: PDF índice 18 (899×1600); filas 82–1600 (la barra negra es la real del Shell), estirado sólo en el papel entre la tarjeta y el collage inferior
 * (tools/stretch_experiencia.py; el resto es collage denso: en pantallas largas el lienzo se agranda y recorta un poco los lados).
 * Coordenadas: x = x del PDF; y = y NUEVA (y_pdf − 82 hasta la tarjeta). Fotos, películas, flores, luna, estrellas y la nota "Gracias por habitar…" quedan en la imagen.
 * La tarjeta de papel del textarea está en la imagen; el textarea (300 caracteres) y el botón son HTML.
 * El envío va por kit/experience.ts (endpoint configurable con VITE_EXPERIENCE_URL).
 */
const W = 899, H = 1637
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#1d1611"
const red = "#b3141c"
const MAX = 300

type Status = "idle" | "sending" | "sent" | "error"

export default function Experiencia() {
  const [text, setText] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [focus, setFocus] = useState(false)
  const [hp, setHp] = useState("")   // campo trampa anti-spam: las personas no lo ven ni lo llenan; los bots sí
  const busy = status === "sending" || status === "sent"

  const send = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || busy) return
    setStatus("sending")
    try { await submitExperience(text, hp); setStatus("sent") } catch { setStatus("error") }
  }

  return (
    <Shell theme="home">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ead2b8" }}>
        <form
          onSubmit={send}
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/899)] [--w:max(min(100vw,480px),calc((100dvh-44px)*899/1637))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/experiencia/bg.webp?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/universos" label="Volver a los universos" cx={240} cy={124} color={ink} />
          <p className="f-mont absolute whitespace-nowrap" style={{ left: k(269), top: k(107.5), fontSize: k(20), lineHeight: k(33), letterSpacing: ".13em", fontWeight: 400 }}>
            06 /<br />DEJAR TU EXPERIENCIA
          </p>
          <span aria-hidden className="absolute" style={{ left: k(268), top: k(184), width: k(79), height: k(3), background: ink }} />

          <h1 className="f-bodoni" aria-label="Dejar tu experiencia.">
            <span aria-hidden className="absolute whitespace-nowrap [--tx:.82]" style={{ left: k(222), top: k(237), fontSize: k(112), lineHeight: k(112), fontWeight: 500, letterSpacing: "-.03em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
              Dejar tu
            </span>
            <span aria-hidden className="absolute whitespace-nowrap [--tx:.784]" style={{ left: k(223), top: k(346), fontSize: k(112), lineHeight: k(112), fontWeight: 500, letterSpacing: "-.03em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
              experiencia<span style={{ color: red }}>.</span>
            </span>
          </h1>

          <p className="absolute whitespace-nowrap" style={{ left: k(232), top: k(490), fontFamily: "'Libre Caslon Text', serif", fontSize: k(31.5), lineHeight: k(37.5), color: "#2b1b0e", transform: "scaleX(.885)", transformOrigin: "left" }}>
            Después de recorrer estos<br />universos, ¿qué imagen, sonido<br />o historia se quedó contigo?
          </p>

          <span aria-hidden className="pointer-events-none absolute transition-opacity duration-200" style={{ left: k(212), top: k(682), width: k(554), height: k(206), opacity: focus ? 1 : 0, boxShadow: "inset 0 0 0 2px rgba(179,20,28,.38)", borderRadius: k(4) }} />
          <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
          <label htmlFor="exp" className="sr-only">Tu experiencia</label>
          <textarea
            id="exp" value={text} maxLength={MAX} disabled={busy} placeholder="Escribe aquí..."
            onChange={(e) => { setText(e.target.value); if (status === "error") setStatus("idle") }}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            className="absolute resize-none border-0 bg-transparent outline-none placeholder:text-[#8f7e6c] disabled:opacity-80"
            style={{ left: k(228), top: k(704), width: k(526), height: k(150), padding: `0 ${k(12)}`, outline: "none", fontFamily: "'Libre Caslon Text', serif", fontSize: k(27), lineHeight: k(36), color: "#2b1b0e", caretColor: red }}
          />
          <p aria-hidden className="f-mont absolute whitespace-nowrap text-right tabular-nums" style={{ left: k(641), top: k(846), width: k(80), fontSize: k(16.5), lineHeight: k(22), letterSpacing: ".04em", color: "#6d5f52" }}>
            {text.length}/{MAX}
          </p>

          <button
            type="submit" disabled={!text.trim() || busy}
            className="group absolute flex items-center justify-between rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-[#b3141c] focus-visible:ring-offset-2 enabled:hover:brightness-125 enabled:active:scale-[.985] disabled:cursor-default"
            style={{ left: k(232), top: k(990), width: k(498), height: k(82), padding: `0 ${k(56)}`, background: "#0b0b0b", color: "#f3e9da", opacity: !text.trim() && status !== "sent" ? 0.62 : 1, boxShadow: "0 6px 16px rgba(20,10,6,.25)" }}
          >
            <span className="f-mont whitespace-nowrap" style={{ fontSize: k(22), letterSpacing: ".107em", fontWeight: 400 }}>
              {status === "sending" ? "ENVIANDO..." : status === "sent" ? "EXPERIENCIA ENVIADA" : "DEJAR MI EXPERIENCIA"}
            </span>
            {status === "sent" ? (
              <svg style={{ width: k(30), height: k(22) }} viewBox="0 0 22 16" fill="none" aria-hidden><path d="M2 8.5l5.5 5.5L20 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg className="transition-transform duration-300 group-enabled:group-hover:translate-x-1.5" style={{ width: k(30), height: k(20) }} viewBox="0 0 30 20" fill="none" aria-hidden>
                <path d="M1 10h27M20 2l8 8-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <p role="status" aria-live="polite" className="f-mont absolute text-center" style={{ left: k(232), top: k(1086), width: k(498), fontSize: k(17), lineHeight: k(24), letterSpacing: ".06em", color: status === "error" ? red : "#4a3b2e" }}>
            {status === "sent" ? "Gracias por habitar la música con nosotros." : status === "error" ? "No se pudo enviar. Inténtalo de nuevo." : ""}
          </p>
        </form>
      </div>
    </Shell>
  )
}

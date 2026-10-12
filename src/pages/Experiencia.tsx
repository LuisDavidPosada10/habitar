import { useState, type FormEvent } from "react"
import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"
import { submitExperience } from "../kit/experience"

/**
 * /experiencia · Dejar tu experiencia. Diseño nuevo (PDF "Pagina Web - final", pág. 4, 1179×2556). Fondo = public/experiencia/bg.webp: render
 * SIN texto (luna, hibisco, recuadro redondeado de la pregunta con su estrella, tarjeta de papel rasgado con su marco redondeado y flor,
 * collage de abajo: películas, disco, paloma, notas). Textos, textarea (300 caracteres), botón "Enviar respuesta" y flecha de volver son
 * HTML en unidades del lienzo (--k = ancho_css / 1179). El envío va por kit/experience.ts (Formspree / endpoint configurable).
 */
const W = 1179, H = 2556
const k = (n: number) => `calc(var(--k) * ${n})`
const bodoni = { fontFamily: "'Bodoni Moda', serif" } as const
const bodoniIt = { fontFamily: "'Bodoni Static', 'Bodoni Moda', serif", fontStyle: "italic" } as const
const mont = { fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, color: "#11110f" } as const
const RED = "#631413"
const MAX = 300

type Status = "idle" | "sending" | "sent" | "error"

export default function Experiencia() {
  const [text, setText] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [hp, setHp] = useState("")   // campo trampa anti-spam: las personas no lo ven ni lo llenan; los bots sí
  const busy = status === "sending" || status === "sent"

  const send = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || busy) return
    setStatus("sending")
    try { await submitExperience(text, hp); setStatus("sent") } catch { setStatus("error") }
  }

  return (
    <Shell theme="home" bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <form
        onSubmit={send}
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: `${W} / ${H}`, color: "#11110f" }}
      >
        <img src="/experiencia/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <p data-m="hdr" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...bodoni, top: k(74.5), fontSize: k(62), lineHeight: k(70), fontWeight: 600, transform: `translateX(${k(8.5)}) scaleX(.912)` }}>
          Habitar la música
        </p>

        <BackChevron to="/universos" label="Volver a los universos" cx={121.5} cy={187} color="#3a1010" />

        <h1 aria-label="Dejar tu experiencia" className="m-0 font-normal">
          <span data-m="t1" aria-hidden className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(254), top: k(374), fontSize: k(150), lineHeight: k(150), fontWeight: 600, color: RED, transform: "scaleX(1.07)", transformOrigin: "left" }}>Dejar tu</span>
          <span data-m="t2" aria-hidden className="absolute whitespace-nowrap" style={{ ...bodoniIt, left: k(136), top: k(541.5), fontSize: k(143), lineHeight: k(143), fontWeight: 600, color: "#000", transform: "scaleX(1.085)", transformOrigin: "left" }}>experiencia</span>
        </h1>

        <p data-m="prompt" className="absolute inset-x-0 whitespace-nowrap text-center" style={{ ...mont, top: k(786), fontSize: k(36), lineHeight: k(43) }}>
          Después de recorrer estos<br />universos, ¿qué imagen, sonido<br />o historia se quedó contigo?
        </p>

        <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
        <label htmlFor="exp" className="sr-only">Tu experiencia</label>
        <textarea
          id="exp" data-m="area" value={text} maxLength={MAX} disabled={busy} placeholder="Escribe aquí..."
          onChange={(e) => { setText(e.target.value); if (status === "error") setStatus("idle") }}
          className="absolute resize-none border-0 bg-transparent outline-none placeholder:text-[#11110f] disabled:opacity-80"
          style={{ ...mont, left: k(170), top: k(1188), width: k(870), height: k(240), padding: `0 ${k(18)}`, outline: "none", fontSize: k(30), lineHeight: k(40), caretColor: RED }}
        />
        <p aria-hidden className="absolute whitespace-nowrap tabular-nums" style={{ ...mont, fontWeight: 500, left: k(190), top: k(1425), fontSize: k(24), lineHeight: k(30), color: "#6d5f52" }}>
          {text.length}/{MAX}
        </p>

        <button
          type="submit" data-m="send" disabled={!text.trim() || busy}
          className="group absolute flex items-center justify-center rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-[#631413] focus-visible:ring-offset-2 enabled:hover:brightness-125 enabled:active:scale-[.985] disabled:cursor-default"
          style={{ left: k(257), top: k(1605), width: k(670), height: k(119), border: `${k(1.3)} solid ${RED}`, color: RED, opacity: !text.trim() && status !== "sent" ? 0.62 : 1 }}
        >
          <span data-m="sendtxt" className="whitespace-nowrap" style={{ ...bodoniIt, fontSize: k(status === "sent" ? 60 : 70), lineHeight: k(88), fontWeight: 600, transform: `translateY(${k(-6)}) scaleX(1.08)` }}>
            {status === "sending" ? "Enviando..." : status === "sent" ? "Respuesta enviada" : "Enviar respuesta"}
          </span>
        </button>

        <p role="status" aria-live="polite" className="absolute text-center" style={{ ...mont, fontWeight: 500, left: k(180), top: k(1752), width: k(820), fontSize: k(30), lineHeight: k(40), color: status === "error" ? "#b3141c" : "#3b2a24" }}>
          {status === "sent" ? "Gracias por habitar la música con nosotros." : status === "error" ? "No se pudo enviar. Inténtalo de nuevo." : ""}
        </p>
      </form>
    </Shell>
  )
}

import { useState, type ReactNode } from "react"
import { Link } from "react-router"
import ScenarioPage, { arrowRight } from "../kit/ScenarioPage"
import { AudioPlayer, VideoPlayer } from "../kit/Players"
import { Daisy, Scrap, Star, Tape } from "../kit/Pieces"

const br = (s: string) => s.split("\n").map((l, i) => (<span key={i}>{i > 0 && <br />}{l}</span>))

/* ---------------------------- Mon Laferte ---------------------------- */
const monBack = { backTo: "/mon", backLabel: "Volver a Autopoética", theme: "mon" as const }

export function NoCaber() {
  return (
    <ScenarioPage {...monBack} kicker="AUTOPOÉTICA / 01" index="01" title="NO CABER" question="¿Por qué tendría que ser una sola cosa?"
      footer="En este escenario exploramos cómo Mon Laferte ha desafiado etiquetas y ha construido su identidad desde la contradicción, abrazando todas sus versiones.">
      <VideoPlayer duration={154} />
    </ScenarioPage>
  )
}

export function TuFalta() {
  return (
    <ScenarioPage {...monBack} kicker="AUTOPOÉTICA / 02" index="02" title={"TU FALTA\nDE QUERER"} question="¿Qué hacemos con lo que sentimos cuando ya no cabe dentro?"
      footer="En este escenario nos adentramos en la emoción, la vulnerabilidad y el desamor como parte de la construcción artística de Mon Laferte.">
      <AudioPlayer title="Tu falta de querer" artist="Mon Laferte" duration={252} font="f-bodoni" />
    </ScenarioPage>
  )
}

const hacerse = [
  { k: "CANCIÓN", a: "Ver canción", t: "Una emoción que encuentra voz y melodía." },
  { k: "IMAGEN", a: "Ver imagen", t: "Lo que se siente, hecho retrato y símbolo." },
  { k: "ESCENA", a: "Ver escena", t: "El cuerpo y el escenario como lugar de transformación." },
  { k: "OBRA", a: "Ver obra", t: "Todas las formas juntas: la obra completa." },
]
export function HacerseObra() {
  const [sel, setSel] = useState(0)
  return (
    <ScenarioPage {...monBack} kicker="AUTOPOÉTICA / 03" index="03" title={"HACERSE\nOBRA"} question="¿Qué puede convertirse en arte?"
      footer="En este escenario exploramos cómo Mon Laferte transforma sus emociones, experiencias y contradicciones en arte, creando un universo propio que se expresa a través de diferentes formas.">
      <div className="grid grid-cols-2 gap-4 sm:gap-6" role="tablist" aria-label="Formas del arte">
        {hacerse.map((h, i) => (
          <button key={h.k} role="tab" aria-selected={sel === i} aria-label={h.a} onClick={() => setSel(i)} className="group relative text-left">
            <Scrap color={sel === i ? "#8a1620" : "#e3d4b8"} seed={i + 60} className={`transition ${sel === i ? "-translate-y-1" : "group-hover:-translate-y-0.5"}`}>
              <div className="flex aspect-[4/3] flex-col items-start justify-end p-4">
                <span className="f-bodoni text-sm italic opacity-70" style={{ color: sel === i ? "#f3e9da" : undefined }}>{`0${i + 1}`}</span>
                <span className="mt-1 text-[clamp(.85rem,1.6vw,1.1rem)] tracking-[.2em]" style={{ fontFamily: "'Courier Prime', monospace", color: sel === i ? "#f3e9da" : undefined }}>{h.k}</span>
              </div>
            </Scrap>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="f-caslon mt-6 border-l-2 border-[var(--accent)] pl-4 text-[clamp(.95rem,1.5vw,1.1rem)] italic">{hacerse[sel].t}</p>
    </ScenarioPage>
  )
}

export function LaTrenza() {
  return (
    <ScenarioPage {...monBack} kicker="AUTOPOÉTICA / 04" index="04" title="LA TRENZA" question="¿Qué existe detrás de la obra?"
      footer="En este escenario conocemos la historia que habita detrás de la artista. A través de una conversación íntima, Mon Laferte comparte sus raíces, sus memorias y cómo todas esas experiencias también son parte de su obra.">
      <VideoPlayer duration={180} />
    </ScenarioPage>
  )
}

/* ---------------------------- Silvana Estrada ---------------------------- */
const silBack = { backTo: "/silvana", backLabel: "Volver", theme: "silvana" as const }

export function Casa() {
  return (
    <ScenarioPage {...silBack} counter="01 / 04" kicker="MARCHITA / 01" index="01" title="CASA" question="¿De dónde viene una voz?"
      intro={br("Un viaje al origen.\nA los lugares, personas\ny sonidos que sembraron\nmi voz.")}>
      <VideoPlayer src="/media/recuerdos.webm" duration={20} />
    </ScenarioPage>
  )
}

export function TeGuardo() {
  return (
    <ScenarioPage {...silBack} counter="02 / 04" kicker="SILVANA ESTRADA / 02" index="02" title={"TE\nGUARDO"} question="¿Qué hacemos con aquello que todavía queremos conservar?"
      intro={br("Una canción que habita la memoria.\nUn refugio para todo lo que aún\nnos importa.")}
      next={{ to: "/silvana-3", label: "SIGUIENTE ESCENARIO" }}>
      <AudioPlayer title="Te guardo" artist="Silvana Estrada" duration={204} accent="#5b6b45" />
    </ScenarioPage>
  )
}

export function LaCorriente() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const add = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const id = Date.now() + Math.random()
    setRipples((rs) => [...rs.slice(-5), { id, x: e.clientX - r.left, y: e.clientY - r.top }])
    setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 1800)
  }
  return (
    <ScenarioPage {...silBack} counter="03 / 04" kicker="SILVANA ESTRADA / 03" index="03" title={"LA\nCORRIENTE"} question="¿Qué pasa cuando algo cambia de forma?"
      intro={br("A veces, lo que parece\nun cambio, también\nes un comienzo.")}
      next={{ to: "/silvana-4", label: "SIGUIENTE" }}>
      <div className="relative" style={{ filter: "drop-shadow(0 6px 9px rgba(20,25,15,.35))" }}>
        <button type="button" onPointerDown={add} aria-label="Toca para crear ondas en el agua"
          className="relative block aspect-[4/3] w-full touch-manipulation overflow-hidden rounded-[2px] text-[#f3e9da]"
          style={{ background: "radial-gradient(120% 80% at 30% 20%, #3b5a54, #1c2b2a 60%, #0f1a19)" }}>
          <span className="absolute inset-0 opacity-40" style={{ background: "repeating-radial-gradient(circle at 70% 30%, transparent 0 18px, rgba(255,255,255,.12) 19px 20px)" }} />
          {ripples.map((r) => (
            <span key={r.id} className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 animate-[ripple_1.8s_ease-out_forwards]" style={{ left: r.x, top: r.y }} />
          ))}
          <span className="f-mont absolute bottom-4 left-1/2 -translate-x-1/2 text-[.68rem] tracking-[.3em]">TOCA Y DESCUBRE</span>
          <Daisy size={64} className="absolute right-[8%] top-[18%] w-[14%] opacity-90" />
        </button>
      </div>
    </ScenarioPage>
  )
}

export function Lluvias() {
  return (
    <ScenarioPage {...silBack} counter="04 / 04" kicker="SILVANA ESTRADA / 04" index="04" title={"VENDRÁN\nSUAVES\nLLUVIAS"} question="¿Qué permanece cuando el tiempo pasa?"
      intro={br("También en la lluvia\nhay belleza.\nTodo vuelve,\naunque sea distinto.")}
      next={{ to: "/juliana", label: "SIGUIENTE" }}>
      <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="group relative block">
        <Tape className="absolute -top-3 left-6 z-10" w={90} rotate={-5} />
        <Scrap color="#e6d8bd" seed={26}>
          <div className="flex items-center justify-between gap-4 p-[clamp(1.25rem,3vw,2.25rem)]">
            <span>
              <span className="f-mont block text-[.68rem] font-medium tracking-[.25em]">ESCUCHA LA PLAYLIST</span>
              <span className="f-play mt-2 block text-[clamp(1.3rem,3vw,2.1rem)] italic leading-tight">Vendrán suaves lluvias</span>
            </span>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#1c231b] text-[#f3e9da] transition group-hover:scale-105">{arrowRight}</span>
          </div>
        </Scrap>
      </a>
    </ScenarioPage>
  )
}

/* ---------------------------- Juliana Velásquez ---------------------------- */
const julBack = { backTo: "/juliana", backLabel: "Volver", theme: "juliana" as const }

export function ALaMedida() {
  return (
    <ScenarioPage {...julBack} counter="01/04" kicker="JULIANA VELÁSQUEZ" index="01" title={"A LA\nMEDIDA"}
      question="(2:20 A.M.)"
      intro={br("Son las 2:20 a.m. y la ciudad se siente distinta. En este espacio, Juliana nos invita a descubrir cómo la música también habita sus noches, sus ideas y sus versiones más íntimas.")}>
      <VideoPlayer src="/media/archivo-nocturno.webm" duration={20} />
    </ScenarioPage>
  )
}

export function Coseme() {
  return (
    <ScenarioPage {...julBack} counter="02/04" kicker="CÓSEME" index="02" title="CÓSEME"
      intro="En esta conversación, Juliana nos habla sobre CÓSEME, su proceso creativo y la forma en la que transforma lo frágil en algo poderoso.">
      <div className="relative">
        <span aria-hidden className="f-play absolute -left-1 -top-10 text-[7rem] leading-none text-[var(--accent)]/70">“</span>
        <AudioPlayer title="Cóseme" artist="Juliana Velásquez" duration={202} accent="#24476f" />
      </div>
    </ScenarioPage>
  )
}

const versions = ["Original", "Acústica", "en Vivo"]
export function DosDosDos() {
  const [sel, setSel] = useState(0)
  return (
    <ScenarioPage {...julBack} counter="03/04" kicker="DOS DOS DOS" title={"DOS\nDOS\nDOS"}
      intro="Una canción, tres versiones, tres formas de sentirla. Explora cada una y descubre cómo cambia su significado.">
      <ul className="grid gap-3 sm:grid-cols-3">
        {versions.map((v, i) => (
          <li key={v}>
            <button type="button" aria-label={`Ver versión ${i + 1}`} aria-pressed={sel === i} onClick={() => setSel(i)} className="group w-full text-left">
              <Scrap color={sel === i ? "#24476f" : "#e6d8bd"} seed={i + 70} className="transition group-hover:-translate-y-0.5">
                <div className="p-4" style={{ color: sel === i ? "#f3e9da" : undefined }}>
                  <span className="f-play text-lg italic">{`0${i + 1}`}</span>
                  <span className="mt-1 block text-[clamp(.95rem,1.6vw,1.15rem)] leading-tight">Versión<br />{v}</span>
                </div>
              </Scrap>
            </button>
          </li>
        ))}
      </ul>
      <VideoPlayer key={sel} src="/media/versiones.webm" duration={20} label={`Reproducir versión ${versions[sel].toLowerCase()}`} className="mt-8" />
    </ScenarioPage>
  )
}

export function MarAdentro() {
  const [on, setOn] = useState(true)
  return (
    <ScenarioPage {...julBack} counter="04/04" kicker="MAR ADENTRO" index="04" title={"MAR\nADENTRO"}
      intro={br("Una experiencia para sumergirse.\nMar Adentro es un viaje sonoro\nque nos invita a detenernos, respirar\ny habitar la música desde otro lugar.")}>
      <button type="button" onClick={() => setOn((o) => !o)} aria-pressed={on} aria-label={on ? "Pausar la respiración guiada" : "Iniciar la respiración guiada"} className="relative block aspect-[4/3] w-full overflow-hidden" style={{ filter: "drop-shadow(0 6px 9px rgba(10,20,30,.4))", background: "radial-gradient(100% 90% at 50% 0%, #2b4a66, #10202e 70%)" }}>
        <span className="absolute inset-0 opacity-50" style={{ background: "repeating-linear-gradient(180deg, transparent 0 22px, rgba(255,255,255,.07) 23px 24px)" }} />
        <span className={`absolute left-1/2 top-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 ${on ? "animate-[breathe_8s_ease-in-out_infinite]" : ""}`} style={{ background: "radial-gradient(circle, rgba(255,255,255,.22), transparent 70%)" }} />
        <span className="f-mono absolute inset-x-0 bottom-5 text-center text-[.7rem] tracking-[.3em] text-[#f3e9da]">{on ? "RESPIRA" : "TOCA PARA COMENZAR"}</span>
      </button>
    </ScenarioPage>
  )
}

/* ---------------------------- Dejar tu experiencia ---------------------------- */
import Shell from "../kit/Shell"

export function Experiencia() {
  const [text, setText] = useState("")
  const [sent, setSent] = useState(false)
  return (
    <Shell theme="home" className="mx-auto max-w-[760px] px-6 pb-20 text-center sm:px-10">
      <p className="f-mont mt-12 text-[.7rem] tracking-[.22em] text-[var(--soft)]">06 / DEJAR TU EXPERIENCIA</p>
      <span className="mx-auto mt-3 block h-px w-10 bg-[var(--ink)]" />
      <h1 className="f-bodoni mt-6 text-[clamp(2.6rem,7vw,5rem)] leading-[1.02]">Dejar tu<br />experiencia<span className="text-[#b3141c]">.</span></h1>
      <p className="mx-auto mt-5 max-w-[30ch] text-[clamp(1rem,1.8vw,1.35rem)] leading-[1.3]">Después de recorrer estos universos, ¿qué imagen, sonido o historia se quedó contigo?</p>

      {sent ? (
        <p role="status" className="f-bodoni mt-12 text-[clamp(1.2rem,2.4vw,1.8rem)] italic">Gracias por habitar la música con nosotros.</p>
      ) : (
        <form className="mx-auto mt-10 max-w-[560px]" onSubmit={(e) => { e.preventDefault(); if (text.trim()) setSent(true) }}>
          <div className="relative" style={{ filter: "drop-shadow(0 6px 9px rgba(40,20,10,.25))" }}>
            <Scrap color="#e9dcc2" seed={44}>
              <label htmlFor="exp" className="sr-only">Tu experiencia</label>
              <textarea id="exp" value={text} maxLength={300} onChange={(e) => setText(e.target.value)} placeholder="Escribe aquí..." rows={6}
                className="block w-full resize-none bg-transparent p-5 text-[1.05rem] text-[var(--ink)] outline-none placeholder:text-[#6d6156]" />
              <span className="f-mont absolute bottom-3 right-4 text-[.62rem] tracking-wider text-[#6d6156]">{text.length}/300</span>
            </Scrap>
          </div>
          <button type="submit" disabled={!text.trim()} className="f-mont mx-auto mt-8 inline-flex items-center gap-6 rounded-full bg-[#101114] px-8 py-3.5 text-[.68rem] font-medium tracking-[.25em] text-[#f3e9da] transition enabled:hover:bg-[#2a2c33] disabled:opacity-50">
            DEJAR MI EXPERIENCIA {arrowRight}
          </button>
        </form>
      )}
      <Star size={22} className="mx-auto mt-14" />
      <Link to="/universos" className="f-mont mt-6 inline-block text-[.65rem] tracking-[.25em] underline underline-offset-4">VOLVER A LOS UNIVERSOS</Link>
    </Shell>
  )
}

export type { ReactNode }

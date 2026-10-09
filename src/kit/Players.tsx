import { useEffect, useRef, useState } from "react"
import { Scrap, Tape, Vinyl } from "./Pieces"

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/** Reproducción real si hay `src`; si no, simula el avance para poder diseñar/probar la interfaz. */
export function usePlayback(duration: number, src?: string) {
  const media = useRef<HTMLVideoElement | HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(duration)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (src) return
    if (!playing) return
    const id = setInterval(() => setT((x) => (x + 0.25 >= dur ? (setPlaying(false), 0) : x + 0.25)), 250)
    return () => clearInterval(id)
  }, [playing, src, dur])

  const toggle = () => {
    const el = media.current
    if (src && el) {
      if (el.paused) void el.play(); else el.pause()
    } else setPlaying((p) => !p)
  }
  const seek = (ratio: number) => {
    const el = media.current
    if (src && el) el.currentTime = ratio * (el.duration || dur)
    else setT(ratio * dur)
  }
  const mediaProps = src
    ? {
        ref: media as never, src, preload: "metadata" as const, muted,
        onPlay: () => setPlaying(true), onPause: () => setPlaying(false),
        onTimeUpdate: () => setT(media.current?.currentTime ?? 0),
        onLoadedMetadata: () => setDur(media.current?.duration || duration),
        onEnded: () => setPlaying(false),
      }
    : null
  return { playing, t, dur, muted, setMuted, toggle, seek, mediaProps, media }
}

const playIcon = (s = 16) => (<svg width={s} height={s} viewBox="0 0 16 16" aria-hidden><path d="M3 1.5v13L14 8z" fill="currentColor" /></svg>)
const pauseIcon = (s = 16) => (<svg width={s} height={s} viewBox="0 0 16 16" aria-hidden><path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" fill="currentColor" /></svg>)

function Bar({ t, dur, seek, accent = "#d0212a", light = true }: { t: number; dur: number; seek: (r: number) => void; accent?: string; light?: boolean }) {
  return (
    <input
      type="range" min={0} max={1000} value={Math.round((t / (dur || 1)) * 1000)}
      aria-label="Posición"
      onChange={(e) => seek(Number(e.target.value) / 1000)}
      className="h-1 w-full cursor-pointer appearance-none rounded-full"
      style={{ background: `linear-gradient(to right, ${accent} ${(t / (dur || 1)) * 100}%, ${light ? "rgba(255,255,255,.4)" : "rgba(30,20,10,.25)"} 0)`, accentColor: accent }}
    />
  )
}

/** Reproductor de video enmarcado en papel. */
export function VideoPlayer({ src, duration = 154, label = "Reproducir video", className = "" }: { src?: string; duration?: number; label?: string; className?: string }) {
  const p = usePlayback(duration, src)
  const box = useRef<HTMLDivElement>(null)
  return (
    <div className={`relative ${className}`}>
      <Tape className="absolute -left-3 -top-3 z-20" w={92} rotate={-8} />
      <Scrap color="#e3d4b8" seed={12} className="p-0">
        <div className="p-[clamp(8px,1.6vw,16px)]">
          <div ref={box} className="relative aspect-video overflow-hidden bg-[#1d1a19] text-white">
            {p.mediaProps && <video {...p.mediaProps} playsInline className="absolute inset-0 size-full object-cover" />}
            {!p.playing && (
              <button type="button" aria-label={label} onClick={p.toggle} className="absolute left-1/2 top-1/2 flex size-[clamp(48px,9vw,72px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/20 backdrop-blur-[1px] transition hover:bg-white/20">
                {playIcon(24)}
              </button>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-[#121010]/85 px-3 py-2 text-[.7rem]">
              <button type="button" aria-label={p.playing ? "Pausar" : "Reproducir"} onClick={p.toggle} className="shrink-0">{p.playing ? pauseIcon() : playIcon()}</button>
              <span className="shrink-0 tabular-nums" style={{ fontFamily: "Arial, sans-serif" }}>{fmt(p.t)} / {fmt(p.dur)}</span>
              <Bar t={p.t} dur={p.dur} seek={p.seek} />
              <button type="button" aria-label={p.muted ? "Activar sonido" : "Silenciar"} aria-pressed={p.muted} onClick={() => p.setMuted((m) => !m)} className="shrink-0 opacity-90">
                <svg width="18" height="16" viewBox="0 0 24 20" fill="none" aria-hidden><path d="M1 7h4l6-5v16l-6-5H1z" fill="currentColor" />{!p.muted && <path d="M14.5 6.5c1.4 1 2.2 2.2 2.2 3.5s-.8 2.5-2.2 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}</svg>
              </button>
              <button type="button" aria-label="Pantalla completa" onClick={() => void box.current?.requestFullscreen?.()} className="shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </Scrap>
    </div>
  )
}

/** Reproductor de audio: disco que gira, título y barra de progreso. */
export function AudioPlayer({ title, artist, duration = 204, src, accent = "#8a1620", className = "", font = "f-play" }: { title: string; artist?: string; duration?: number; src?: string; accent?: string; className?: string; font?: string }) {
  const p = usePlayback(duration, src)
  return (
    <div className={`relative ${className}`}>
      {p.mediaProps && <audio {...p.mediaProps} />}
      <Scrap color="#e6d8bd" seed={18}>
        <div className="flex flex-col items-center gap-5 p-[clamp(1.25rem,3vw,2.25rem)] sm:flex-row">
          <Vinyl size="clamp(110px,22vw,170px)" label={accent} className={p.playing ? "animate-[spin_5s_linear_infinite]" : ""} />
          <div className="w-full min-w-0 flex-1">
            <p className={`${font} text-[clamp(1.2rem,2.4vw,1.7rem)] italic leading-tight`}>{title}</p>
            {artist && <p className="mt-1 text-[clamp(.9rem,1.5vw,1.05rem)] text-[var(--soft)]">{artist}</p>}
            <div className="mt-5 flex items-center gap-3">
              <button type="button" aria-label={p.playing ? "Pausar" : `Reproducir ${title}`} onClick={p.toggle} className="flex size-11 shrink-0 items-center justify-center rounded-full text-white transition hover:brightness-125" style={{ background: accent }}>
                {p.playing ? pauseIcon() : playIcon()}
              </button>
              <div className="min-w-0 flex-1">
                <Bar t={p.t} dur={p.dur} seek={p.seek} accent={accent} light={false} />
                <div className="f-mont mt-1.5 flex justify-between text-[.62rem] tabular-nums tracking-wider text-[var(--soft)]"><span>{fmt(p.t)}</span><span>{fmt(p.dur)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </Scrap>
    </div>
  )
}

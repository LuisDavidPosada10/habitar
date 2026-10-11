import { useCallback, useEffect, useRef, useState } from "react"

/* Controla un video de YouTube oculto (sólo suena) con la IFrame Player API. */
type YTPlayer = { playVideo(): void; pauseVideo(): void; seekTo(s: number, allow: boolean): void; getCurrentTime(): number; getDuration(): number; destroy(): void }
type YTApi = { Player: new (el: HTMLElement, o: unknown) => YTPlayer }
declare global { interface Window { YT?: YTApi; onYouTubeIframeAPIReady?: () => void } }

let apiPromise: Promise<YTApi> | null = null
export const loadApi = () => (apiPromise ??= new Promise<YTApi>((res) => {
  if (window.YT?.Player) return res(window.YT)
  const prev = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = () => { prev?.(); res(window.YT!) }
  const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s)
}))

export function useYouTube(id: string, fallbackDuration = 0) {
  const host = useRef<HTMLDivElement>(null)
  const pl = useRef<YTPlayer | null>(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(fallbackDuration)
  /** Código de error de YouTube (100 = no existe, 101/150 = el dueño no permite incrustarlo, 2/5 = parámetros/HTML5) */
  const [error, setError] = useState<number | null>(null)

  useEffect(() => {
    let dead = false
    void loadApi().then((YT) => {
      if (dead || !host.current) return
      const el = document.createElement("div"); host.current.appendChild(el)
      pl.current = new YT.Player(el, {
        videoId: id, width: 200, height: 200,
        playerVars: { playsinline: 1, controls: 0, rel: 0, disablekb: 1, fs: 0 },
        events: {
          onError: (e: { data: number }) => { setError(e.data); setPlaying(false) },
          onReady: () => { const d = pl.current?.getDuration(); if (d) setDur(d) },
          onStateChange: (e: { data: number }) => {
            setPlaying(e.data === 1 || e.data === 3)
            if (e.data === 1) { const d = pl.current?.getDuration(); if (d) setDur(d) }
            if (e.data === 0) setT(0)
          },
        },
      })
    })
    return () => { dead = true; pl.current?.destroy(); pl.current = null }
  }, [id])

  useEffect(() => {
    if (!playing) return
    const i = setInterval(() => setT(pl.current?.getCurrentTime() ?? 0), 250)
    return () => clearInterval(i)
  }, [playing])

  const play = useCallback(() => { pl.current?.playVideo() }, [])
  const toggle = useCallback(() => { if (playing) pl.current?.pauseVideo(); else pl.current?.playVideo() }, [playing])
  const seek = useCallback((r: number) => { pl.current?.seekTo(r * (pl.current.getDuration() || dur), true); setT(r * dur) }, [dur])
  /** Contenedor oculto (200×200 sin opacidad: YouTube no reproduce bien si está display:none). */
  const hostEl = { ref: host, "aria-hidden": true as const, style: { position: "absolute" as const, left: 0, top: 0, width: 200, height: 200, opacity: 0, pointerEvents: "none" as const, zIndex: -1 } }
  return { playing, t, dur, error, play, toggle, seek, hostEl }
}

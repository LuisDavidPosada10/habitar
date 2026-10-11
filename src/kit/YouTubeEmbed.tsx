import { useEffect, useRef, useState, type CSSProperties } from "react"
import { loadApi } from "./useYouTube"

type Frame = { getIframe?: () => HTMLIFrameElement; destroy: () => void }

/**
 * Video de YouTube con la IFrame Player API (en vez de un <iframe> a pelo): manda `origin` y el referrer que YouTube
 * exige (sin ellos algunos móviles/hosts muestran "error de reproducción" / error 153) y, si el video no se puede
 * reproducir aquí (embed bloqueado, sin conexión, API bloqueada…), muestra un aviso con enlace para verlo en YouTube.
 * Ocupa todo su contenedor (position: relative/absolute). Autoplay en silencio: los navegadores bloquean el autoplay con sonido.
 */
export default function YouTubeEmbed({ id, title, vars = {}, className = "", style }: { id: string; title: string; vars?: Record<string, string | number>; className?: string; style?: CSSProperties }) {
  const host = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const varsKey = JSON.stringify(vars)

  useEffect(() => {
    let dead = false
    let ready = false
    let pl: Frame | null = null
    const timer = window.setTimeout(() => { if (!ready && !dead) setFailed(true) }, 9000)
    void loadApi().then((YT) => {
      if (dead || !host.current) return
      const el = document.createElement("div"); host.current.appendChild(el)
      pl = new YT.Player(el, {
        videoId: id, width: "100%", height: "100%",
        playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0, modestbranding: 1, origin: window.location.origin, ...JSON.parse(varsKey) },
        events: {
          onReady: () => {
            ready = true
            const f = pl?.getIframe?.()
            if (f) { f.title = title; f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin"); f.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0" }
          },
          onError: () => { ready = true; setFailed(true) },
        },
      }) as unknown as Frame
    })
    return () => { dead = true; window.clearTimeout(timer); try { pl?.destroy() } catch { /* ya destruido */ } }
  }, [id, title, varsKey])

  return (
    <div className={`absolute inset-0 ${className}`} style={style}>
      <div ref={host} className="absolute inset-0" />
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3%] bg-[#1c1818] px-[6%] text-center text-[#efe8df]">
          <p style={{ fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(11px, 3.2vw, 20px)", lineHeight: 1.3 }}>No pudimos reproducir el video aquí.</p>
          <a
            href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer"
            className="rounded-full border border-[#efe8df]/70 px-[5%] py-[1.6%]"
            style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 500, fontSize: "clamp(12px, 3.8vw, 24px)" }}
          >
            Ver en YouTube ↗
          </a>
        </div>
      )}
    </div>
  )
}

import { Link } from "react-router"
import Shell from "../kit/Shell"
import { Star8 } from "../kit/Pieces"

/**
 * Mobile-first. Diseño nuevo de 1179×2556 (PDF "Pagina Web - Diseño"): el fondo (public/inicio/bg.webp) es el
 * render de la página SIN texto (el papel es color plano #efe8df, se rellenó con ese color); estrella, pastilla,
 * título, párrafo y botón son HTML posicionado en unidades del lienzo (--k = ancho_css / 1179).
 * Barra transparente (Shell bar={false}) y el lienzo cubre el alto (ratio 2.168).
 */
const k = (n: number) => `calc(var(--k) * ${n})`
const TIT = [558, 744]
const INK = "#3a1010"

export default function Inicio() {
  return (
    <Shell bar={false} label="" className="-mt-11 min-h-dvh overflow-x-clip">
      <div
        className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--k:calc(var(--w)/1179)] [--w:max(min(100vw,480px),calc(100dvh*1179/2556))]"
        style={{ aspectRatio: "1179 / 2556" }}
      >
        <img src="/inicio/bg.webp?v=2" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

        <Star8 className="absolute" style={{ left: k(559.5), top: k(229.5), width: k(59), height: k(59) }} />

        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{ left: k(287), top: k(308), width: k(597), height: k(122), borderRadius: k(46), border: `${k(1.2)} solid #461e1d`, color: INK, fontFamily: "Comfortaa, sans-serif", fontWeight: 400, fontSize: k(39.3), lineHeight: k(41), paddingTop: k(8) }}
        >
          <span className="whitespace-nowrap">Una experiencia</span>
          <span className="whitespace-nowrap">Entre el papel y el sonido</span>
        </div>

        <h1 className="m-0 font-normal" style={{ color: "#11110f", fontFamily: "'Bodoni Static', serif" }}>
          <span className="absolute inset-x-0 whitespace-nowrap text-center" style={{ top: k(TIT[0]), fontStyle: "italic", fontWeight: 600, fontSize: k(215), lineHeight: k(215), transform: `translateX(${k(-4)})` }}>Habitar</span>
          <span className="absolute inset-x-0 whitespace-nowrap text-center" style={{ top: k(TIT[1]), fontWeight: 700, fontSize: k(212), lineHeight: k(212), transform: `translateX(${k(-5)}) scaleX(.913)` }}>la Música</span>
        </h1>

        <p
          className="absolute whitespace-nowrap text-center"
          style={{ left: k(190), width: k(774), top: k(1081), color: "#11110f", fontFamily: "Montserrat, sans-serif", fontStyle: "italic", fontWeight: 600, fontSize: k(34), lineHeight: k(35) }}
        >
          Una colección de tres fanzines<br />que explora cómo la música nos<br />habita, nos transforma y nos<br />acompaña en distintas formas<br />de vivir.
        </p>

        <Link
          to="/proyecto"
          className="absolute flex items-center justify-center"
          style={{ left: k(356), top: k(1366), width: k(466), height: k(119), borderRadius: k(58), border: `${k(1.2)} solid #461e1d`, color: INK, gap: k(34), paddingBottom: k(7), fontFamily: "'Bodoni Moda', serif", fontWeight: 600, fontSize: k(52) }}
        >
          Explorar
          <svg viewBox="0 0 54 36" style={{ width: k(58), height: k(39) }} fill="none" aria-hidden><path d="M1 18H52M36 3l16 15-16 15" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </Shell>
  )
}

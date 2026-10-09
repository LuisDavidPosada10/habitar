import { Link } from "react-router"
import Shell from "../kit/Shell"
import { Star } from "../kit/Pieces"

/**
 * Mobile-first. El diseño es de 882×1664: el fondo (public/inicio/bg.webp, sin texto)
 * se escala al ancho de la pantalla y todo el texto se posiciona (en unidades --u = 1% del
 * ancho del lienzo) sobre ese mismo lienzo, así que calza en cualquier móvil. Si la pantalla
 * es más alta que el lienzo, éste crece hasta cubrir el alto (recorta un poco a los lados).
 */
export default function Inicio() {
  return (
    <Shell bar={false} className="-mt-11 min-h-dvh overflow-hidden">
      <div className="relative left-1/2 w-[var(--w)] -translate-x-1/2 [--u:calc(var(--w)/100)] [--w:max(min(100vw,480px),53dvh)]" style={{ aspectRatio: "882 / 1664" }}>
        <img
          src="/inicio/bg.webp" alt="" aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
        />

        <Star size={30} className="absolute left-1/2 top-[7.6%] -translate-x-1/2" />
        <p className="f-mont absolute inset-x-0 top-[12.2%] text-center text-[calc(var(--u)*2.3)] leading-[1.55] tracking-[.24em]">
          UNA EXPERIENCIA<br />ENTRE PAPEL Y SONIDO
        </p>
        <h1
          className="absolute inset-x-0 top-[17%] whitespace-nowrap text-center leading-[.88] [transform:scaleX(.67)]"
          style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 500, fontSize: "calc(var(--u) * 17.5)" }}
        >
          HABITAR<br />LA MÚSICA<span className="text-[#b3141c]">.</span>
        </h1>
        <p className="absolute inset-x-0 top-[35%] mx-auto w-[45%] text-center text-[calc(var(--u)*3.7)] leading-[1.22]">
          Una colección de tres fanzines que explora cómo la música nos habita, nos transforma y nos acompaña en distintas formas de vivir.
        </p>
        <Link
          to="/proyecto"
          className="f-mont absolute left-[30.2%] top-[49.3%] flex h-[5.3%] w-[39.7%] items-center justify-center gap-[calc(var(--u)*3)] rounded-full border-[1.3px] border-[#1d1611] text-[calc(var(--u)*2.5)] font-medium tracking-[.3em] transition hover:bg-[#1d1611] hover:text-[#f3e9da]"
        >
          EXPLORAR
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden><path d="M1 6H17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>

      </div>
    </Shell>
  )
}

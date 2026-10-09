import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /juliana-4 · Mar adentro. Lienzo = public/juliana4/bg.webp (942×1926, sin texto ni rectángulo gris de video).
 * OJO: la imagen de esta página en el PDF (índice 17) es de sólo 159×425 px → se AMPLIÓ ×5.92 (Lanczos + enfoque) a 942 px; el fondo es el más
 * suave de todo el sitio (el papel liso queda bien; las texturas oscuras y la foto del mar se ven borrosas). Mejoraría con un export de mayor resolución.
 * Pipeline: tools/juliana4.json (zonas) + tools/paper_fill2.py (rellena papel con color por difusión desde el contorno + ruido fino)
 * + tools/stretch_juliana4.py (quita la barra de 80 filas y COMPRIME sólo papel: cabecera y el hueco del video; mapa en el script).
 * Coordenadas: x = x ampliada; y = y NUEVA. Kicker y su raya (la de la imagen se borró: salía borrosa), "04" y su raya, título, párrafo y el video 16:9 tipo foto pegada son HTML;
 * la raya bajo el título, la de bajo el párrafo, flores, rocas y mar quedan en la imagen.
 */
const W = 942, H = 1926
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#0b1220"
const YT = "_pF1q5hdcqY" // Mar adentro
const VID = { x: 99, y: 638, w: 712, h: 420 } // ventana más alta que 16:9 (≈1.6): el video se recorta "cubrir" por la izquierda y los controles de la derecha quedan a la vista
const BORDER = 14

export default function JulianaMarAdentro() {
  return (
    <Shell theme="juliana" label="JULIANA VELÁSQUEZ" counter="04/04">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ead3ba" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/942)] [--w:max(min(100vw,480px),calc((100dvh-44px)*942/1926))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/juliana4/bg.webp?v=3" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/juliana" label="Volver a Juliana" cx={87} cy={83} color={ink} />
          <p className="absolute whitespace-nowrap" style={{ left: k(180), top: k(70.4), fontFamily: "'IBM Plex Mono', monospace", fontSize: k(21), lineHeight: k(26), letterSpacing: ".31em" }}>
            MAR ADENTRO
          </p>

          <span aria-hidden className="absolute" style={{ left: k(416), top: k(81.5), width: k(179), height: k(2), background: ink }} />
          <p className="f-bodoni absolute whitespace-nowrap" style={{ left: k(210.4), top: k(180), fontSize: k(52), lineHeight: k(60), fontStyle: "italic", fontWeight: 400, color: "#3b3a3a", transform: "scaleX(.83)", transformOrigin: "left" }}>
            04
          </p>
          <span aria-hidden className="absolute" style={{ left: k(312), top: k(219), width: k(66), height: k(2), background: ink }} />
          <span aria-hidden className="absolute" style={{ left: k(240), top: k(264), width: k(28), height: k(2), background: ink }} />

          <h1 className="f-bodoni" aria-label="Mar adentro">
            <span aria-hidden className="absolute whitespace-nowrap [--tx:.733]" style={{ left: k(198), top: k(293.9), fontSize: k(134), lineHeight: k(134), fontStyle: "italic", fontWeight: 600, letterSpacing: "-.02em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
              MAR
            </span>
            <span aria-hidden className="absolute whitespace-nowrap [--tx:.7]" style={{ left: k(207.3), top: k(412.1), fontSize: k(134), lineHeight: k(134), fontStyle: "italic", fontWeight: 600, letterSpacing: "-.02em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
              ADENTRO
            </span>
          </h1>

          {/* video 16:9 pegado como una foto (borde de papel, sombra y dos cintas); autoplay mudo */}
          <div
            className="absolute"
            style={{ left: k(VID.x - BORDER), top: k(VID.y - BORDER), width: k(VID.w + BORDER * 2), height: k(VID.h + BORDER * 2), background: "#f7eedc", padding: k(BORDER), transform: "rotate(.7deg)", boxShadow: "0 10px 28px rgba(20,16,10,.42), 0 1px 0 rgba(255,255,255,.6) inset", border: "1px solid rgba(70,52,34,.25)" }}
          >
            <span aria-hidden className="absolute" style={{ right: k(-36), top: k(-14), width: k(150), height: k(40), background: "rgba(206,186,150,.82)", transform: "rotate(24deg)", boxShadow: "0 1px 3px rgba(40,28,14,.25)" }} />
            <span aria-hidden className="absolute" style={{ left: k(-40), bottom: k(-12), width: k(150), height: k(40), background: "rgba(206,186,150,.82)", transform: "rotate(24deg)", boxShadow: "0 1px 3px rgba(40,28,14,.25)" }} />
            <div className="relative size-full overflow-hidden" style={{ background: "#000" }}>
              <iframe
                title="Mar adentro · Juliana Velásquez"
                src={`https://www.youtube.com/embed/${YT}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
                className="absolute border-0"
                style={{ right: 0, top: 0, height: "100%", width: k((VID.h * 16) / 9) }}
              />
            </div>
          </div>

          <p className="absolute whitespace-nowrap" style={{ left: k(172), top: k(1128.5), fontFamily: "'Libre Caslon Text', serif", fontSize: k(36.1), lineHeight: k(52), color: ink }}>
            Una experiencia para sumergirse.<br />Mar Adentro es un viaje sonoro<br />que nos invita a detenernos, respirar<br />y habitar la música desde otro lugar.
          </p>
        </div>
      </div>
    </Shell>
  )
}

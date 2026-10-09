import BackChevron from "../kit/BackChevron"
import Shell from "../kit/Shell"

/**
 * /juliana-1 · A la medida (2:20 A.M.). Lienzo = public/juliana1/bg.webp (942×1913, sin texto).
 * Origen: PDF índice 14, que sólo trae 381×668 px (¡mucho menos que las otras!, sin barra ni kicker): se amplió ×2.472 con
 * Lanczos + máscara de enfoque, se borró el título y el párrafo (tools/juliana1.json + tools/paper_fill.py: papel liso con grano)
 * y se estiró sólo en papel/marco (tools/stretch_juliana1.py). Coordenadas: x = x ampliada; y = y NUEVA.
 * Estrella, trazo azul, luna, papeles azules y película quedan en la imagen. El rectángulo gris del PDF (casi cuadrado, dejaba franjas negras enormes) se borró del fondo y el video va en una ventana 16:9 tipo foto pegada; iframe de YouTube que
 * arranca solo y en silencio (los navegadores sólo permiten autoplay mudo). Se añadió la flecha de volver (el diseño no la trae).
 */
const W = 942, H = 1913
const k = (n: number) => `calc(var(--k) * ${n})`
const ink = "#0b1220"
const YT = "lbiXQQyXC48" // Juliana – A la medida (2:20AM)
const VID = { x: 115, y: 790, w: 712, h: 462 } // 16:9, centrado en el hueco de papel del marco
const BORDER = 16

export default function JulianaMedida() {
  return (
    <Shell theme="juliana">
      <div className="min-h-[calc(100dvh-44px)] overflow-x-clip" style={{ background: "#ead6bf" }}>
        <div
          className="relative left-1/2 -translate-x-1/2 [--k:calc(var(--w)/942)] [--w:max(min(100vw,480px),calc((100dvh-44px)*942/1913))]"
          style={{ width: "var(--w)", aspectRatio: `${W} / ${H}`, color: ink }}
        >
          <img src="/juliana1/bg.webp?v=3" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full" />

          <BackChevron to="/juliana" label="Volver a Juliana" cx={80} cy={72} color={ink} />

          <h1 className="f-bodoni absolute whitespace-nowrap [--tx:.645]" style={{ left: k(184), top: k(24), fontSize: k(138), lineHeight: k(122), fontWeight: 800, letterSpacing: "-.01em", transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            A LA<br />MEDIDA
          </h1>
          <p className="f-bodoni absolute whitespace-nowrap [--tx:.9]" style={{ left: k(196), top: k(268), fontSize: k(62), lineHeight: k(76), fontStyle: "italic", fontWeight: 400, transform: "scaleX(var(--tx))", transformOrigin: "left" }}>
            (2:20 A.M.)
          </p>

          {/* video 16:9 pegado como una foto (borde de papel, sombra y dos cintas); autoplay mudo */}
          <div
            className="absolute"
            style={{ left: k(VID.x - BORDER), top: k(VID.y - BORDER), width: k(VID.w + BORDER * 2), height: k(VID.h + BORDER * 2), background: "#f7eedc", padding: k(BORDER), transform: "rotate(-.8deg)", boxShadow: "0 10px 28px rgba(20,16,10,.42), 0 1px 0 rgba(255,255,255,.6) inset", border: "1px solid rgba(70,52,34,.25)" }}
          >
            <span aria-hidden className="absolute" style={{ left: k(-34), top: k(-14), width: k(150), height: k(40), background: "rgba(206,186,150,.82)", transform: "rotate(-24deg)", boxShadow: "0 1px 3px rgba(40,28,14,.25)" }} />
            <span aria-hidden className="absolute" style={{ right: k(-40), bottom: k(-12), width: k(150), height: k(40), background: "rgba(206,186,150,.82)", transform: "rotate(-24deg)", boxShadow: "0 1px 3px rgba(40,28,14,.25)" }} />
            <div className="relative size-full overflow-hidden" style={{ background: "#000" }}>
              <iframe
                title="A la medida (2:20 A.M.) · Juliana Velásquez"
                src={`https://www.youtube.com/embed/${YT}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
          </div>

          <p className="absolute whitespace-nowrap" style={{ left: k(217), top: k(1352), fontFamily: "'Libre Caslon Text', serif", fontSize: k(37.7), lineHeight: k(47), color: ink }}>
            Son las 2:20 a.m. y la ciudad se<br />siente distinta. En este espacio,<br />Juliana nos invita a descubrir<br />cómo la música también habita<br />sus noches, sus ideas y sus<br />versiones más íntimas.
          </p>
        </div>
      </div>
    </Shell>
  )
}

import type { ThemeKey } from "./Shell"

export type Scenario = { n: string; title: string; sub?: string; to: string }
export type Universe = {
  key: Exclude<ThemeKey, "home">
  to: string
  index: string
  name: string
  album: string
  artistLine: string
  lead: string
  scenarios: Scenario[]
}

export const universes: Record<"mon" | "silvana" | "juliana", Universe> = {
  mon: {
    key: "mon", to: "/mon", index: "01", name: "Mon Laferte", album: "AUTOPOÉTICA", artistLine: "Mon Laferte",
    lead: "Un universo construido desde la visceralidad, la contradicción, la pasión y la transformación.",
    scenarios: [
      { n: "01", title: "NO CABER", to: "/mon-1" },
      { n: "02", title: "TU FALTA DE QUERER", to: "/mon-2" },
      { n: "03", title: "HACERSE OBRA", to: "/mon-3" },
      { n: "04", title: "LA TRENZA", to: "/mon-4" },
    ],
  },
  silvana: {
    key: "silvana", to: "/silvana", index: "02", name: "Silvana Estrada", album: "RAÍZ Y CANTO", artistLine: "SILVANA",
    lead: "Un universo sensible donde la introspección, la transformación y la conexión con lo esencial se encuentran.",
    scenarios: [
      { n: "01", title: "CASA", sub: "SEGUIR LA RAÍZ", to: "/silvana-1" },
      { n: "02", title: "TE GUARDO", sub: "CONSERVAR", to: "/silvana-2" },
      { n: "03", title: "LA CORRIENTE", sub: "DEJAR PASAR", to: "/silvana-3" },
      { n: "04", title: "VENDRÁN SUAVES LLUVIAS", sub: "ESCUCHAR EL TIEMPO", to: "/silvana-4" },
    ],
  },
  juliana: {
    key: "juliana", to: "/juliana", index: "03", name: "Juliana Velásquez", album: "ESCRIBIR PARA EXISTIR", artistLine: "Juliana Velásquez",
    lead: "Un universo construido desde la ciudad, la vulnerabilidad, el tiempo, la escena y la multiplicidad.",
    scenarios: [
      { n: "01", title: "2:20 A.M.", to: "/juliana-1" },
      { n: "02", title: "CÓSEME", to: "/juliana-2" },
      { n: "03", title: "DOS DOS DOS", to: "/juliana-3" },
      { n: "04", title: "MAR ADENTRO", to: "/juliana-4" },
    ],
  },
}

export const pillars = [
  { title: "PAPEL", text: "Más que un soporte, es un territorio para crear, guardar y sentir." },
  { title: "SONIDO", text: "La música como hilo que da vida a cada universo." },
  { title: "IMAGEN", text: "Collage, fotografía y símbolos que construyen nuevas realidades." },
  { title: "MATERIA", text: "Texturas, recortes y elementos que hacen tangible la experiencia." },
  { title: "MOVIMIENTO", text: "Lo que cambia, se transforma y se habita en el tiempo." },
  { title: "EXPERIENCIA", text: "Un encuentro entre lo físico, lo digital y lo emocional." },
]


// Recortes de foto tomados de los JPG de diseño. Coordenadas en píxeles del JPG original.
const bgOf = (id: string) => `/photos/${id}.jpg`

export type Photo = { src: string; sw: number; sh: number; x: number; y: number; w: number; h: number }

const p = (id: string, sw: number, sh: number, x: number, y: number, w: number, h: number): Photo => ({ src: bgOf(id), sw, sh, x, y, w, h })

export const photos = {
  // Hubs de cada universo (retrato + collage superior)
  monHero: p("mon", 811, 1766, 0, 46, 811, 560),
  silvanaHero: p("silvana", 941, 1671, 0, 84, 941, 640),
  julianaHero: p("juliana", 942, 1669, 230, 150, 712, 720),

  // Miniaturas de los escenarios
  mon: [
    p("mon", 811, 1766, 396, 1080, 276, 108),
    p("mon", 811, 1766, 396, 1205, 276, 115),
    p("mon", 811, 1766, 396, 1335, 276, 112),
    p("mon", 811, 1766, 396, 1461, 276, 112),
  ],
  silvana: [
    p("silvana", 941, 1671, 469, 981, 332, 90),
    p("silvana", 941, 1671, 469, 1121, 332, 87),
    p("silvana", 941, 1671, 471, 1263, 331, 100),
    p("silvana", 941, 1671, 472, 1414, 330, 120),
  ],
  juliana: [
    p("juliana", 942, 1669, 432, 923, 318, 111),
    p("juliana", 942, 1669, 432, 1057, 318, 113),
    p("juliana", 942, 1669, 432, 1192, 318, 114),
    p("juliana", 942, 1669, 432, 1329, 318, 116),
  ],

  // Los tres universos (ventanas en arco)
  archMon: p("universos", 1024, 1536, 46, 456, 285, 500),
  archSilvana: p("universos", 1024, 1536, 366, 456, 295, 500),
  archJuliana: p("universos", 1024, 1536, 690, 456, 298, 500),
  mountains: p("universos", 1024, 1536, 0, 1090, 1024, 446),

  // El proyecto
  polaroids: p("proyecto", 812, 1512, 430, 0, 382, 820),
  pillars: [
    p("proyecto", 812, 1512, 143, 843, 162, 90),
    p("proyecto", 812, 1512, 143, 950, 162, 93),
    p("proyecto", 812, 1512, 143, 1060, 162, 102),
    p("proyecto", 812, 1512, 143, 1180, 162, 96),
    p("proyecto", 812, 1512, 143, 1292, 162, 104),
    p("proyecto", 812, 1512, 143, 1412, 162, 100),
  ],

  // Decoración de esquinas (por universo)
  decor: {
    mon: [p("mon", 811, 1766, 0, 1560, 270, 206), p("mon", 811, 1766, 600, 1580, 211, 186)],
    silvana: [p("silvana", 941, 1671, 0, 1180, 170, 491), p("silvana", 941, 1671, 805, 1575, 136, 96)],
    juliana: [p("juliana", 942, 1669, 0, 1400, 290, 269), p("juliana", 942, 1669, 620, 1480, 322, 189)],
  },

  // Inicio
  sunset: p("inicio", 882, 1626, 225, 940, 460, 440),
  vinyl: p("inicio", 882, 1626, 20, 1320, 700, 306),
  dove: p("inicio", 882, 1626, 590, 840, 290, 380),
  flowersLeft: p("inicio", 882, 1626, 0, 400, 250, 560),
  filmsRight: p("inicio", 882, 1626, 640, 120, 242, 320),
} satisfies Record<string, Photo | Photo[] | Record<string, Photo[]>>

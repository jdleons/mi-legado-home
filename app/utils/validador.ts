import { ConfiguracionCasa, Lote, ValidacionResultado } from "../types";

export function validarConstruccion(
  config: ConfiguracionCasa,
  lote: Lote
): ValidacionResultado {
  const errores: string[] = [];
  const advertencias: string[] = [];
  const sugerencias: string[] = [];

  if (config.area_m2 > 500) {
    errores.push(`El área configurada (${config.area_m2} m²) excede el máximo permitido de 500 m² en Legado del Bosque.`);
  }

  const huella_estimada = config.area_m2 / config.niveles;
  if (huella_estimada > 325) {
    errores.push(`La huella estimada por nivel (${Math.round(huella_estimada)} m²) excede los 325 m² máximos. Considera agregar un nivel o reducir el área total.`);
  }

  if (config.niveles > 3) {
    errores.push(`La normativa de LDB permite máximo 3 niveles.`);
  }

  if (lote.dif_nivel_m > 5 && lote.topo_tipo === "pronunciado" && config.niveles === 1) {
    advertencias.push(`Este lote tiene ${lote.dif_nivel_m}m de diferencia de nivel. Un diseño de 1 nivel posiblemente requiera muros de contención mayores a 5m. Considera diseño escalonado en 2 o 3 niveles.`);
  }

  const m2_por_hab = config.area_m2 / config.habitaciones;
  if (m2_por_hab < 40) {
    advertencias.push(`${config.habitaciones} habitaciones en ${config.area_m2} m² deja solo ${Math.round(m2_por_hab)} m² por habitación. Para un estándar premium de LDB considera aumentar el área.`);
  }

  if (config.deck_tipo === "voladizo-bosque" && lote.topo_tipo === "plano") {
    advertencias.push(`El deck voladizo sobre el bosque es característico de terrenos inclinados. Tu lote tiene pendiente suave.`);
  }

  if (lote.arboles_protegidos >= 6) {
    advertencias.push(`Este lote tiene ${lote.arboles_protegidos} árboles protegidos. Cualquier remoción requiere autorización previa.`);
  }

  if (lote.topo_tipo === "pronunciado" && config.niveles === 1) {
    sugerencias.push(`💡 Tu lote tiene pendiente pronunciada — ideal para casa de 2-3 niveles escalonados con vistas panorámicas.`);
  }

  if (lote.arboles_protegidos >= 5 && !config.relacion_bosque.includes("integrado")) {
    sugerencias.push(`💡 Con ${lote.arboles_protegidos} árboles protegidos, considera la relación "integrado" para aprovecharlos como parte del diseño.`);
  }

  return { valido: errores.length === 0, errores, advertencias, sugerencias };
}

// DESCRIPTORES DE ORIENTACIÓN CALLE-CASA POR ZONA
// Estos son críticos para que el render muestre correctamente
// la posición de la calle respecto a la casa
function getOrientacionVial(lote: Lote): string {
  const zona = lote.zona;
  const topo = lote.topo_tipo;

  if (zona === "Aurel Parque") {
    return `CRITICAL SITE ORIENTATION — READ CAREFULLY:
Viewpoint: standing on the street looking DOWN at the house.
- Street/road is at the TOP of the image (highest point).
- The house garage and entrance door are at street level (top).
- The house body cascades DOWNHILL away from the street.
- Living areas, terraces and decks are at lower levels, below the entrance.
- The forest canopy fills the background BELOW the house.
- Camera angle: slightly elevated, looking down the slope toward the house and forest.
DO NOT place the street below the house. DO NOT show the house above the road.`;
  }

  if (zona === "Aurel Valle") {
    if (topo === "pronunciado") {
      return `CRITICAL SITE ORIENTATION — READ CAREFULLY:
Viewpoint: standing on the street looking UP at the house.
- Street/road is at the BOTTOM front of the image.
- The garage entry door is at street level (bottom).
- The house rises UP the hillside behind the street.
- Upper floors and rooftop terrace are above, with panoramic forest views.
- Camera angle: slightly low, looking up the slope toward the house.
DO NOT place the street above the house. DO NOT show the house below the road.`;
    }
    return `CRITICAL SITE ORIENTATION — READ CAREFULLY:
Viewpoint: standing on the street looking UP at the house.
- The curved internal road runs along the lower front edge of the lot.
- Garage and entrance are at road level (front, lower).
- House sits elevated above the road on the hillside.
- Camera angle: from road level looking up at the house facade.`;
  }

  if (zona === "Aurel Cerro") {
    return `CRITICAL SITE ORIENTATION — READ CAREFULLY:
Viewpoint: standing below looking UP at the house on the hilltop.
- Access road is at the base of the hill (bottom of image).
- House sits dramatically high on the hillside, well above the road.
- Steep driveway climbs from road up to the house.
- Camera angle: from below looking up, house silhouetted against sky and forest.`;
  }

  return `SITE ORIENTATION: The access road runs along the front edge of the lot. House entrance faces the road. Living areas and terraces face the forest. Camera shows front facade with road in foreground.`;
}

export function generarPrompt(
  config: ConfiguracionCasa,
  lote: Lote,
  materiales: Array<{ id: string; prompt_keyword: string }>,
  estilos: Array<{ id: string; prompt_descriptor: string }>,
  topo_descriptores: Record<string, string>,
  relacion_bosque_opciones: Array<{ id: string; prompt_keyword: string }>,
  deck_opciones: Array<{ id: string; prompt_keyword: string }>
): string {
  const estilo_desc = estilos.find((e) => e.id === config.estilo)?.prompt_descriptor || "contemporary forest architecture";
  const materiales_desc = config.materiales.map((m) => materiales.find((mat) => mat.id === m)?.prompt_keyword).filter(Boolean).join(", ");
  const topo_desc = topo_descriptores[lote.topo_tipo] || "sloped terrain with pine forest setting";

  // Criterio constructivo: distribución vertical respecto al nivel de calle
  let desnivel_desc = "";
  if (lote.topo_tipo === "pronunciado") {
    desnivel_desc = `SLOPE CONSTRUCTION — ${lote.dif_nivel_m}m steep hillside:
The house is designed exactly like a Brazilian or Mexican hillside house — visible stepped platforms following the terrain downhill.
REFERENCE STYLE: Multi-level house where each floor is a distinct cantilevered concrete slab stepping down the hill. Like a terraced hillside villa.
- Level 1 (top): street access, entrance, garage — at road level.
- Level 2 (middle): main living areas on a concrete platform — visibly elevated above level 3.
- Level 3 (bottom): lower deck/terrace — a clean wood or concrete platform floating above the natural slope.
- Each level connected by exterior stairs integrated into the hillside.
- Exposed concrete retaining walls visible between levels — this is a design feature, not a flaw.
- The underside of cantilevered slabs is visible — air between the structure and the slope below.
- The house sits ON the hillside. The slope is VISIBLE around and below the structure.
- Trees grow from the ground around the house — never from platforms or rooftops.`;
  } else if (lote.topo_tipo === "medio") {
    desnivel_desc = `SLOPE CONSTRUCTION — ${lote.dif_nivel_m}m medium hillside:
The house steps down the slope in 2 visible levels, like a modern hillside house built on a gentle incline.
- Upper level at street grade — entrance, main floor.
- Lower level stepping down the slope — with a terrace/deck extending outward from the downhill facade.
- The downhill facade is taller than the uphill facade — exposed concrete or stone base visible on the downhill side.
- Clean wood or stone deck platform on the lower level, with glass railings.
- The house is clearly ABOVE ground — full facade visible, no buried walls.
- Mature pine trees (straight tall trunks, dark canopy) surround the lot at ground level.`;
  } else {
    desnivel_desc = `SLOPE: gentle ${lote.dif_nivel_m}m elevation change. House sits at grade with standard foundation. Single platform, no stepping required.`;
  }
  const relacion_desc = relacion_bosque_opciones.find((r) => r.id === config.relacion_bosque)?.prompt_keyword || "forest views through panoramic windows";
  const deck_desc = deck_opciones.find((d) => d.id === config.deck_tipo)?.prompt_keyword || "terrace with forest views";

  // Orientación y garage por zona
  const orientacion_vial = getOrientacionVial(lote);

  // Pendiente en lenguaje visual simple
  let slope_desc = "";
  if (lote.topo_tipo === "pronunciado") {
    slope_desc = `Steep hillside (${lote.dif_nivel_m}m drop). House has 3 stepped platforms cascading downhill. Each platform is a concrete slab cantilevered over the slope — visible structure underneath. Street and garage at the top. Living levels step down. Terraces at lower levels face the forest.`;
  } else if (lote.topo_tipo === "medio") {
    slope_desc = `Gentle hillside (${lote.dif_nivel_m}m drop). House has 2 levels following the slope. Upper floor at street level. Lower floor steps down with a terrace extending outward. Exposed concrete base visible on the downhill side.`;
  } else {
    slope_desc = `Flat lot (${lote.dif_nivel_m}m drop). House sits at grade. Single level or stacked floors.`;
  }

  // Garage — siempre en plataforma plana al nivel de calle
  const garage_visual = `Garage: ${config.parqueos} covered space(s) on a flat platform at street level — this is the entry level of the house. The garage floor is flat and level with the road. From this flat entry platform, the house then develops over the slope: at least one full living level sits ABOVE the garage platform, and additional levels step DOWN the hillside below. The garage is integrated into the architecture, not floating or on a rooftop.`;

  // Escala visual según niveles
  const escala_visual = config.niveles === 1
    ? "single-story house, low profile, one floor only"
    : config.niveles === 2
    ? "two-story house, modest scale, two floors clearly visible"
    : "three-story house, three floors maximum, residential scale";

  // Footprint aproximado (área construida / niveles = huella por piso)
  const huella = Math.round(config.area_m2 / config.niveles);

  return `Photorealistic exterior render of a RESIDENTIAL HOUSE. Guatemala highland pine forest, golden hour.

SCALE: This is a private family home — NOT a hotel, NOT a resort. ${escala_visual}. Total built area: ${config.area_m2}m² across ${config.niveles} floor(s). Each floor footprint approximately ${huella}m². Lot size: around 800m². The house occupies roughly 40% of the lot — the rest is natural pine forest.

ARCHITECTURE: ${estilo_desc}. Materials: ${materiales_desc}.

SLOPE: ${slope_desc}

ORIENTATION: ${orientacion_vial}

GARAGE: ${garage_visual}

TERRACE: ${deck_desc}. Clean wood or stone surface. No trees growing on the terrace.
FOREST: Tall straight pine trees (15-20m) at ground level around the house. Morning mist over the valley.
SHOT: Wide aerial-ish exterior shot. Show the full house and its relationship with the hillside. Hyperrealistic, 16:9.`.trim();
}
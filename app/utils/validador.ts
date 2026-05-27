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
    desnivel_desc = `CONSTRUCTION CRITERION — STEEP SLOPE (${lote.dif_nivel_m} meters total elevation change):
The house is split 50% above street level and 50% below street level, following the natural hillside without major earthwork platforms.
- The top half (garage, entrance, upper living) sits AT and slightly ABOVE street level.
- The bottom half (lower living areas, terraces, decks) descends INTO the hillside below street level, using the natural slope.
- NO large retaining fills. The design follows the terrain, not the other way around.
- Elevation change is ${lote.dif_nivel_m} METERS of vertical terrain drop — this is a site measurement in meters, NOT building floors.`;
  } else if (lote.topo_tipo === "medio") {
    desnivel_desc = `CONSTRUCTION CRITERION — MEDIUM SLOPE (${lote.dif_nivel_m} meters total elevation change):
The house is split 70% above street level and 30% below street level, minimizing earthwork and platform fills.
- 70% of the house volume (main living, bedrooms, terrace) sits ABOVE street level, rising up the hillside.
- 30% of the house (lower level, storage, semi-basement) is embedded INTO the hillside below street level, using the natural slope.
- Minimal regrading. The architecture adapts to the terrain.
- Elevation change is ${lote.dif_nivel_m} METERS of vertical terrain drop — this is a site measurement in meters, NOT building floors.`;
  } else {
    desnivel_desc = `TERRAIN: Gently sloped lot with ${lote.dif_nivel_m} meters of elevation change. House sits primarily at and above grade with minimal earthwork.`;
  }
  const relacion_desc = relacion_bosque_opciones.find((r) => r.id === config.relacion_bosque)?.prompt_keyword || "forest views through panoramic windows";
  const deck_desc = deck_opciones.find((d) => d.id === config.deck_tipo)?.prompt_keyword || "terrace with forest views";

  const loteExtra = (lote as unknown as { descriptores_render?: string; posicion_parque?: string });
  const posicion_desc = loteExtra.descriptores_render || "";

  // Orientación vial específica por zona — corrige el problema de renders invertidos
  const orientacion_vial = getOrientacionVial(lote);

  return `Photorealistic architectural concept render.
Residential house of ${config.area_m2} square meters, ${config.niveles} level(s), ${config.habitaciones} bedrooms.
PARKING: ${config.parqueos} covered garage(s) integrated at street level.
- In Aurel Parque (street at top): garage is at the top edge, camera looks down — garage implied, not focal point.
- In Aurel Valle (street at bottom): garage door faces the street at ground level, visible but not dominant — focus is on the house rising up the hillside behind it.
Do NOT show garage on rooftop. Do NOT make garage the visual center of the render.
Located at Legado del Bosque residential forest park, Guatemala City, Central America, 1,840 meters above sea level.

${orientacion_vial}

SITE CONTEXT: ${posicion_desc}

ARCHITECTURE: ${estilo_desc}.

TERRAIN: ${topo_desc} ${desnivel_desc}

MATERIALS: ${materiales_desc}. No reflective surfaces. No dominant white paint. Earth tones palette only.

OUTDOOR: ${deck_desc}.

FOREST RELATIONSHIP: ${relacion_desc}.

VIEWS: ${config.orientacion_vistas} orientation.

SETTING: Dense guatemalan highland pine forest (Pinus oocarpa), morning mist, golden hour light. ${lote.arboles_protegidos} protected mature pine trees integrated into the design. Internal curved boulevard with planted median visible. Gated residential park setting.

ROAD: Sinuous internal boulevard with stone paving and mature trees lining the road, curving organically with the natural topography.

PHOTOGRAPHY: Architectural photography, golden hour, shot showing the correct relationship between street level and house position as described above. Hyperrealistic, 16:9 aspect ratio.

IMPORTANT: Strictly follow the CRITICAL SITE ORIENTATION described above. The street-to-house relationship must be accurate. House integrates with topography. All ${lote.arboles_protegidos} protected trees preserved.

DISCLAIMER: Conceptual visualization for sales purposes, subject to validation by Mario Noriega & Asociados (MN+A).`.trim();
}
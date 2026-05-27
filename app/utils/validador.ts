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
    return `CRITICAL SITE ORIENTATION - AUREL PARQUE: The access road and street are located at the TOP of the lot (upper level). The house descends DOWN the hillside away from the street. The garage and main entrance are at street level (top). The house steps DOWN the slope, with living areas and terraces at lower levels overlooking the forest below. The view from the house looks DOWNWARD into the forest. Street is ABOVE, forest is BELOW. Never show the street below the house in this lot.`;
  }

  if (zona === "Aurel Valle") {
    if (topo === "pronunciado") {
      return `CRITICAL SITE ORIENTATION - AUREL VALLE: The internal curved boulevard is at the BOTTOM front of the lot. The house rises UP the hillside behind the street. The garage entry is at the lowest point (street level). The house climbs upward into the hillside, with upper floors having panoramic views over the treetops and valley. Street is at the BOTTOM front, house rises UP behind it.`;
    }
    return `CRITICAL SITE ORIENTATION - AUREL VALLE: The curved internal road runs along the lower front edge of the lot. The house sits above the road on the hillside. Entry from below, house elevated above street level with forest views to the north.`;
  }

  if (zona === "Aurel Cerro") {
    return `CRITICAL SITE ORIENTATION - AUREL CERRO: The access road wraps around the base of the hill. The house is positioned high on the hillside above the road, with dramatic elevation above the surrounding forest. Entry driveway climbs steeply from road to house. Maximum elevation and privacy.`;
  }

  return `The access road is at one edge of the lot. The house is positioned on the slope with the main entrance facing the road and living areas oriented toward forest views.`;
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
  const relacion_desc = relacion_bosque_opciones.find((r) => r.id === config.relacion_bosque)?.prompt_keyword || "forest views through panoramic windows";
  const deck_desc = deck_opciones.find((d) => d.id === config.deck_tipo)?.prompt_keyword || "terrace with forest views";

  const loteExtra = (lote as unknown as { descriptores_render?: string; posicion_parque?: string });
  const posicion_desc = loteExtra.descriptores_render || "";

  // Orientación vial específica por zona — corrige el problema de renders invertidos
  const orientacion_vial = getOrientacionVial(lote);

  return `Photorealistic architectural concept render.
Residential house of ${config.area_m2} square meters, ${config.niveles} level(s), ${config.habitaciones} bedrooms, ${config.parqueos} covered parking spaces.
Located at Legado del Bosque residential forest park, Guatemala City, Central America, 1,840 meters above sea level.

${orientacion_vial}

SITE CONTEXT: ${posicion_desc}

ARCHITECTURE: ${estilo_desc}.

TERRAIN: ${topo_desc}

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
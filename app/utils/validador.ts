// VALIDADOR DE CONSTRUCCIÓN — Normativa real de Legado del Bosque
// Este archivo NO tiene interfaz. Solo lógica pura.
// Recibe una configuración y devuelve si es válida y por qué.

import { ConfiguracionCasa, Lote, ValidacionResultado } from "../types";

export function validarConstruccion(
  config: ConfiguracionCasa,
  lote: Lote
): ValidacionResultado {
  const errores: string[] = [];
  const advertencias: string[] = [];
  const sugerencias: string[] = [];

  // ─── LÍMITES DUROS (errores que bloquean) ───────────────────────────

  // Regla 1: Construcción total máxima 500 m²
  if (config.area_m2 > 500) {
    errores.push(
      `El área configurada (${config.area_m2} m²) excede el máximo permitido de 500 m² en Legado del Bosque.`
    );
  }

  // Regla 2: Huella por piso máxima 325 m²
  // La huella es el área que ocupa la casa en planta (vista desde arriba)
  const huella_estimada = config.area_m2 / config.niveles;
  if (huella_estimada > 325) {
    errores.push(
      `La huella estimada por nivel (${Math.round(huella_estimada)} m²) excede los 325 m² máximos. ` +
        `Considera agregar un nivel o reducir el área total.`
    );
  }

  // Regla 3: Máximo 3 niveles
  if (config.niveles > 3) {
    errores.push(
      `La normativa de LDB permite máximo 3 niveles. Has configurado ${config.niveles}.`
    );
  }

  // Regla 4: Muro de contención máximo 5 m
  // Solo aplica en terrenos inclinados
  if (lote.dif_nivel_m > 5 && lote.topo_tipo === "pronunciado") {
    if (config.niveles === 1) {
      // En 1 nivel en terreno muy inclinado, probablemente necesites muro > 5m
      advertencias.push(
        `Este lote tiene ${lote.dif_nivel_m}m de diferencia de nivel. ` +
          `Un diseño de 1 nivel posiblemente requiera muros de contención mayores a 5m (límite normativo). ` +
          `Considera diseño escalonado en 2 o 3 niveles.`
      );
    }
  }

  // ─── ADVERTENCIAS (dejan continuar pero alertan) ─────────────────────

  // Advertencia: área muy pequeña para el número de habitaciones
  const m2_por_hab = config.area_m2 / config.habitaciones;
  if (m2_por_hab < 40) {
    advertencias.push(
      `${config.habitaciones} habitaciones en ${config.area_m2} m² deja solo ${Math.round(m2_por_hab)} m² por habitación en promedio. ` +
        `Para un estándar premium de LDB, considera aumentar el área o reducir habitaciones.`
    );
  }

  // Advertencia: deck voladizo solo posible en terrenos con pendiente
  if (
    config.deck_tipo === "voladizo-bosque" &&
    lote.topo_tipo === "plano"
  ) {
    advertencias.push(
      `El deck voladizo sobre el bosque es característico de terrenos inclinados. ` +
        `Tu lote tiene pendiente suave — el efecto de "flotación" sobre el bosque será limitado.`
    );
  }

  // Advertencia: muchos árboles protegidos
  if (lote.arboles_protegidos >= 6) {
    advertencias.push(
      `Este lote tiene ${lote.arboles_protegidos} árboles protegidos. ` +
        `Cualquier remoción requiere autorización previa de la administración de LDB. ` +
        `El diseño arquitectónico debe respetar y rodear estos árboles.`
    );
  }

  // ─── SUGERENCIAS (recomendaciones positivas) ──────────────────────────

  // Sugerencia: aprovechar la pendiente
  if (lote.topo_tipo === "pronunciado" && config.niveles === 1) {
    sugerencias.push(
      `💡 Tu lote tiene una pendiente pronunciada perfecta para una casa de 2-3 niveles escalonados. ` +
        `Esto te permite más área construida y vistas panorámicas desde el nivel superior.`
    );
  }

  // Sugerencia: orientación y deck
  if (
    lote.orientacion_calle === "Sur" &&
    !config.deck_tipo.includes("voladizo")
  ) {
    sugerencias.push(
      `💡 Con la calle al sur, el fondo de tu lote mira al norte — hacia el bosque. ` +
        `Un deck voladizo al norte te daría vistas directas al bosque sin sol directo de tarde.`
    );
  }

  // Sugerencia: aprovechar el área del lote grande
  if (lote.area_m2 > 900 && config.area_m2 < 300) {
    sugerencias.push(
      `💡 Tu lote tiene ${lote.area_m2} m² — tienes espacio para una casa más generosa. ` +
        `Considera aumentar el área para aprovechar el potencial del terreno.`
    );
  }

  return {
    valido: errores.length === 0,
    errores,
    advertencias,
    sugerencias,
  };
}

// GENERADOR DE PROMPT — construye el prompt de imagen IA a partir de la configuración
export function generarPrompt(
  config: ConfiguracionCasa,
  lote: Lote,
  materiales: Array<{ id: string; prompt_keyword: string }>,
  estilos: Array<{ id: string; prompt_descriptor: string }>,
  topo_descriptores: Record<string, string>,
  relacion_bosque_opciones: Array<{ id: string; prompt_keyword: string }>,
  deck_opciones: Array<{ id: string; prompt_keyword: string }>
): string {
  // Buscar los descriptores en inglés de cada selección
  const estilo_desc =
    estilos.find((e) => e.id === config.estilo)?.prompt_descriptor ||
    "contemporary forest architecture";

  const materiales_desc = config.materiales
    .map((m) => materiales.find((mat) => mat.id === m)?.prompt_keyword)
    .filter(Boolean)
    .join(", ");

  const topo_desc =
    topo_descriptores[lote.topo_tipo] ||
    "sloped terrain with pine forest setting";

  const relacion_desc =
    relacion_bosque_opciones.find((r) => r.id === config.relacion_bosque)
      ?.prompt_keyword || "forest views through panoramic windows";

  const deck_desc =
    deck_opciones.find((d) => d.id === config.deck_tipo)?.prompt_keyword ||
    "terrace with forest views";

  return `Photorealistic architectural concept render. 
Residential house of ${config.area_m2} square meters, ${config.niveles} level(s), ${config.habitaciones} bedrooms, ${config.parqueos} covered parking spaces.
Set in a private residential forest park in Guatemala City, Central America, at approximately 1,840 meters above sea level.

ARCHITECTURE: ${estilo_desc}.

TERRAIN: ${topo_desc}

MATERIALS: ${materiales_desc}. No reflective surfaces. No dominant white paint. Earth tones palette only. Materials must integrate with pine forest surroundings.

OUTDOOR: ${deck_desc}.

FOREST RELATIONSHIP: ${relacion_desc}.

VIEWS: ${config.orientacion_vistas} orientation. Pine forest (Pinus oocarpa) and valley views.

SETTING: Dense guatemalan highland pine forest, morning mist through pines, dappled natural light filtering through tree canopy. Existing mature pine trees preserved around and integrated into the design.

PHOTOGRAPHY: Architectural photography style, golden hour warm light, shot from below looking up through pine canopy, shallow depth of field on foreground pines. Hyperrealistic rendering, 16:9 aspect ratio.

IMPORTANT: House integrates with topography — it does not dominate the landscape. Natural materials blend with environment. No harsh geometric contrast with nature.

DISCLAIMER NOTE: This is a conceptual visualization for sales purposes only, subject to architectural and engineering validation by Mario Noriega & Asociados.`.trim();
}

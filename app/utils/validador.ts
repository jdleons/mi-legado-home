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
    advertencias.push(`Este lote tiene ${lote.dif_nivel_m}m de diferencia de nivel. Un diseño de 1 nivel posiblemente requiera muros de contención mayores a 5m (límite normativo). Considera diseño escalonado en 2 o 3 niveles.`);
  }

  const m2_por_hab = config.area_m2 / config.habitaciones;
  if (m2_por_hab < 40) {
    advertencias.push(`${config.habitaciones} habitaciones en ${config.area_m2} m² deja solo ${Math.round(m2_por_hab)} m² por habitación. Para un estándar premium de LDB considera aumentar el área o reducir habitaciones.`);
  }

  if (config.deck_tipo === "voladizo-bosque" && lote.topo_tipo === "plano") {
    advertencias.push(`El deck voladizo sobre el bosque es característico de terrenos inclinados. Tu lote tiene pendiente suave — el efecto de flotación sobre el bosque será limitado.`);
  }

  if (lote.arboles_protegidos >= 6) {
    advertencias.push(`Este lote tiene ${lote.arboles_protegidos} árboles protegidos. Cualquier remoción requiere autorización previa. El diseño debe integrar estos árboles.`);
  }

  if (lote.topo_tipo === "pronunciado" && config.niveles === 1) {
    sugerencias.push(`💡 Tu lote tiene pendiente pronunciada — ideal para casa de 2-3 niveles escalonados con vistas panorámicas desde el nivel superior.`);
  }

  if (lote.arboles_protegidos >= 5 && !config.relacion_bosque.includes("integrado")) {
    sugerencias.push(`💡 Con ${lote.arboles_protegidos} árboles protegidos en tu lote, considera la relación "integrado" — el bosque entra — para aprovechar estos ejemplares como parte del diseño.`);
  }

  return { valido: errores.length === 0, errores, advertencias, sugerencias };
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
  const posicion_contexto = loteExtra.posicion_parque || "";

  return `Photorealistic architectural concept render.
Residential house of ${config.area_m2} square meters, ${config.niveles} level(s), ${config.habitaciones} bedrooms, ${config.parqueos} covered parking spaces.
Located at Legado del Bosque residential forest park, Guatemala City, Central America, at approximately 1,840 meters above sea level.

SITE CONTEXT: ${posicion_desc}
${posicion_contexto ? `Site description: ${posicion_contexto}` : ""}

ARCHITECTURE: ${estilo_desc}.

TERRAIN: ${topo_desc}

MATERIALS: ${materiales_desc}. No reflective surfaces. No dominant white paint. Earth tones palette only. Materials must integrate with pine forest surroundings.

OUTDOOR: ${deck_desc}.

FOREST RELATIONSHIP: ${relacion_desc}.

VIEWS: ${config.orientacion_vistas} orientation. Pine forest (Pinus oocarpa) and valley views.

SETTING: Dense guatemalan highland pine forest, morning mist through pines, dappled natural light filtering through tree canopy. ${lote.arboles_protegidos} existing protected mature trees preserved around and integrated into the design. Internal curved boulevard with planted median visible at entry. Gated residential park setting with stone and wood gatehouse.

ROAD CONTEXT: Sinuous internal boulevard with landscaped median, stone paving details, mature trees lining the road. The road curves organically following the natural topography of the hillside.

PHOTOGRAPHY: Architectural photography style, golden hour warm light, shot from below looking up through pine canopy, shallow depth of field on foreground pines. Hyperrealistic rendering, 16:9 aspect ratio.

IMPORTANT: House integrates with topography — it does not dominate the landscape. Natural materials blend with environment. The design respects all ${lote.arboles_protegidos} protected trees on site.

DISCLAIMER: Conceptual visualization for sales purposes only, subject to architectural and engineering validation by Mario Noriega & Asociados (MN+A).`.trim();
}
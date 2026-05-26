// TIPOS DE DATOS — TypeScript
// TypeScript nos permite definir la "forma" de los datos.
// Si intentamos usar un campo que no existe, el editor nos avisa ANTES de ejecutar.
// Es como un contrato que dice: "un Lote SIEMPRE tiene estos campos".

export type TopoTipo = "plano" | "medio" | "pronunciado";

export interface Lote {
  id: string;
  nombre: string;
  zona: "Aurel Valle" | "Aurel Cerro" | "Aurel Parque";
  numero: number;
  area_m2: number;
  area_varas2: number;
  precio_vara2_usd: number;
  precio_total_usd: number;
  disponible: boolean;
  frente_m: number;
  fondo_promedio_m: number;
  dif_nivel_m: number;
  topo_tipo: TopoTipo;
  orientacion_calle: string;
  punto_alto_msnm: number;
  punto_bajo_msnm: number;
  arboles_protegidos: number;
  descripcion_topo: string;
  imagen_perfil: string;
  imagen_planta: string;
  notas_construccion: string;
  mantenimiento_mensual_usd: number;
  enganche_porcentaje: number;
  cuotas_enganche: number;
  credito_porcentaje: number;
}

export interface ConfiguracionCasa {
  lote_id: string;
  area_m2: number;
  niveles: 1 | 2 | 3;
  habitaciones: number;
  estilo: string;
  materiales: string[];
  deck_tipo: string;
  parqueos: number;
  relacion_bosque: string;
  orientacion_vistas: string;
  tiene_estudio: boolean;
  tiene_visitas: boolean;
  tiene_servicio: boolean;
}

export interface ValidacionResultado {
  valido: boolean;
  errores: string[];
  advertencias: string[];
  sugerencias: string[];
}

export interface Lead {
  nombre: string;
  email: string;
  telefono: string;
  tiene_lote: boolean;
}

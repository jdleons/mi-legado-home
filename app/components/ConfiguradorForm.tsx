"use client";

import { useState } from "react";
import { Lote, Lead, ConfiguracionCasa, ValidacionResultado } from "../types";
import { validarConstruccion } from "../utils/validador";
import normativaData from "../data/normativa.json";

interface Props {
  lote: Lote;
  lead: Lead;
  onComplete: (config: ConfiguracionCasa) => void;
  onBack: () => void;
}

export default function ConfiguradorForm({ lote, lead, onComplete, onBack }: Props) {
  const normativa = normativaData as typeof normativaData;

  const [config, setConfig] = useState<ConfiguracionCasa>({
    lote_id: lote.id,
    area_m2: 250,
    niveles: 2,
    habitaciones: 3,
    estilo: "contemporaneo-bosque",
    materiales: ["concreto-expuesto", "madera-natural"],
    deck_tipo: "voladizo-bosque",
    parqueos: 2,
    relacion_bosque: "visual",
    orientacion_vistas: "bosque",
    tiene_estudio: false,
    tiene_visitas: false,
    tiene_servicio: true,
  });

  // Validar en tiempo real con cada cambio
  const validacion: ValidacionResultado = validarConstruccion(config, lote);
  const huellaEstimada = Math.round(config.area_m2 / config.niveles);

  const toggleMaterial = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      materiales: prev.materiales.includes(id)
        ? prev.materiales.filter((m) => m !== id)
        : [...prev.materiales, id],
    }));
  };

  const materialesPermitidos = normativa.materiales_exteriores.filter((m) => m.permitido);

  return (
    <div className="min-h-screen bg-ldb-cream pb-32">
      {/* Header fijo */}
      <header className="bg-ldb-forest px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-ldb-sage hover:text-white transition-colors text-sm">
            ← Volver
          </button>
          <span className="text-white/30">|</span>
          <span className="font-serif text-lg text-white">Mi Legado</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-ldb-sage text-xs">{lote.nombre}</span>
          <ValidacionBadge valido={validacion.valido} errores={validacion.errores.length} />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-ldb-moss text-xs font-medium uppercase tracking-wider mb-2">Paso 2 de 3 · Configurador</p>
          <h2 className="font-serif text-3xl text-ldb-dark mb-2">Diseña tu casa</h2>
          <p className="text-ldb-warm-gray text-sm">
            Cada selección se valida en tiempo real contra la normativa de Legado del Bosque.
          </p>
        </div>

        {/* Ficha del lote seleccionado */}
        <div className="bg-ldb-forest/5 border border-ldb-forest/20 rounded-xl p-4 mb-8">
          <p className="text-xs font-medium text-ldb-moss uppercase tracking-wider mb-1">Lote seleccionado</p>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-ldb-dark">{lote.nombre}</p>
              <p className="text-sm text-ldb-warm-gray">{lote.area_m2} m² · {lote.topo_tipo} · {lote.dif_nivel_m}m desnivel</p>
              <p className="text-xs text-ldb-warm-gray mt-1">{lote.descripcion_topo}</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN 1: Área y niveles */}
        <SeccionCard titulo="Dimensiones" icono="📐">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-medium text-ldb-dark">Área construida total</label>
                <span className="font-serif text-2xl text-ldb-forest">{config.area_m2} m²</span>
              </div>
              <input
                type="range" min={150} max={500} step={10}
                value={config.area_m2}
                onChange={(e) => setConfig({ ...config, area_m2: Number(e.target.value) })}
                className="w-full accent-ldb-forest"
              />
              <div className="flex justify-between text-xs text-ldb-warm-gray mt-1">
                <span>150 m² mín.</span>
                <span className={config.area_m2 > 450 ? "text-amber-600 font-medium" : ""}>
                  500 m² máx. (normativa LDB)
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ldb-dark block mb-3">Número de niveles</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setConfig({ ...config, niveles: n as 1 | 2 | 3 })}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                      config.niveles === n
                        ? "bg-ldb-forest text-white border-ldb-forest"
                        : "bg-white text-ldb-dark border-ldb-stone/40 hover:border-ldb-moss"
                    }`}
                  >
                    {n} nivel{n > 1 ? "es" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Indicador de huella */}
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              huellaEstimada > 325 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}>
              <span>{huellaEstimada > 325 ? "⚠️" : "✓"}</span>
              <span>
                Huella estimada por nivel: <strong>{huellaEstimada} m²</strong>
                {huellaEstimada > 325
                  ? " — excede el límite de 325 m²"
                  : " — dentro del límite normativo"}
              </span>
            </div>
          </div>
        </SeccionCard>

        {/* SECCIÓN 2: Habitaciones */}
        <SeccionCard titulo="Distribución" icono="🛏">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ldb-dark block mb-3">Habitaciones</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setConfig({ ...config, habitaciones: n })}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      config.habitaciones === n
                        ? "bg-ldb-forest text-white border-ldb-forest"
                        : "bg-white text-ldb-dark border-ldb-stone/40 hover:border-ldb-moss"
                    }`}
                  >
                    {n === 5 ? "5+" : n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ldb-dark block mb-3">Parqueos</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setConfig({ ...config, parqueos: n })}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      config.parqueos === n
                        ? "bg-ldb-forest text-white border-ldb-forest"
                        : "bg-white text-ldb-dark border-ldb-stone/40 hover:border-ldb-moss"
                    }`}
                  >
                    {n} auto{n > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "tiene_estudio", label: "Estudio / home office" },
                { key: "tiene_visitas", label: "Cuarto de visitas" },
                { key: "tiene_servicio", label: "Área de servicio" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setConfig({ ...config, [key]: !config[key as keyof ConfiguracionCasa] })}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all text-left ${
                    config[key as keyof ConfiguracionCasa]
                      ? "bg-ldb-forest/10 text-ldb-forest border-ldb-forest/40"
                      : "bg-white text-ldb-warm-gray border-ldb-stone/40"
                  }`}
                >
                  {config[key as keyof ConfiguracionCasa] ? "✓ " : ""}{label}
                </button>
              ))}
            </div>
          </div>
        </SeccionCard>

        {/* SECCIÓN 3: Estilo */}
        <SeccionCard titulo="Estilo arquitectónico" icono="🏛">
          <div className="grid grid-cols-1 gap-3">
            {normativa.estilos_permitidos.map((estilo) => (
              <button
                key={estilo.id}
                onClick={() => setConfig({ ...config, estilo: estilo.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  config.estilo === estilo.id
                    ? "bg-ldb-forest text-white border-ldb-forest"
                    : "bg-white text-ldb-dark border-ldb-stone/40 hover:border-ldb-moss"
                }`}
              >
                <p className="font-medium text-sm">{estilo.nombre}</p>
                <p className={`text-xs mt-0.5 leading-relaxed ${config.estilo === estilo.id ? "text-ldb-sage" : "text-ldb-warm-gray"}`}>
                  {estilo.descripcion}
                </p>
              </button>
            ))}
          </div>
        </SeccionCard>

        {/* SECCIÓN 4: Materiales */}
        <SeccionCard titulo="Materiales exteriores" icono="🪨">
          <p className="text-xs text-ldb-warm-gray mb-4">Selecciona uno o más materiales. Los materiales prohibidos por normativa están desactivados.</p>
          <div className="grid grid-cols-1 gap-2">
            {materialesPermitidos.map((mat) => (
              <button
                key={mat.id}
                onClick={() => toggleMaterial(mat.id)}
                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  config.materiales.includes(mat.id)
                    ? "bg-ldb-forest/10 border-ldb-forest/40 text-ldb-forest"
                    : "bg-white border-ldb-stone/40 hover:border-ldb-moss"
                }`}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {config.materiales.includes(mat.id) ? "☑" : "☐"}
                </span>
                <div>
                  <p className="text-sm font-medium">{mat.nombre}</p>
                  <p className="text-xs text-ldb-warm-gray leading-relaxed">{mat.descripcion}</p>
                </div>
              </button>
            ))}
          </div>
        </SeccionCard>

        {/* SECCIÓN 5: Deck y relación con bosque */}
        <SeccionCard titulo="Exterior y bosque" icono="🌲">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-ldb-dark block mb-3">Tipo de deck / terraza</label>
              <div className="grid grid-cols-1 gap-2">
                {normativa.tipos_deck.map((deck) => (
                  <button
                    key={deck.id}
                    onClick={() => setConfig({ ...config, deck_tipo: deck.id })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      config.deck_tipo === deck.id
                        ? "bg-ldb-forest text-white border-ldb-forest"
                        : "bg-white text-ldb-dark border-ldb-stone/40 hover:border-ldb-moss"
                    }`}
                  >
                    <p className="text-sm font-medium">{deck.nombre}</p>
                    <p className={`text-xs mt-0.5 ${config.deck_tipo === deck.id ? "text-ldb-sage" : "text-ldb-warm-gray"}`}>
                      {deck.descripcion}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ldb-dark block mb-3">Relación con el bosque</label>
              <div className="grid grid-cols-1 gap-2">
                {normativa.relacion_bosque.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => setConfig({ ...config, relacion_bosque: rel.id })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      config.relacion_bosque === rel.id
                        ? "bg-ldb-forest text-white border-ldb-forest"
                        : "bg-white text-ldb-dark border-ldb-stone/40 hover:border-ldb-moss"
                    }`}
                  >
                    <p className="text-sm font-medium">{rel.nombre}</p>
                    <p className={`text-xs mt-0.5 ${config.relacion_bosque === rel.id ? "text-ldb-sage" : "text-ldb-warm-gray"}`}>
                      {rel.descripcion}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ldb-dark block mb-3">Orientación principal de vistas</label>
              <div className="grid grid-cols-2 gap-2">
                {["Bosque", "Valle", "Ciudad", "Mixto"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setConfig({ ...config, orientacion_vistas: v.toLowerCase() })}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      config.orientacion_vistas === v.toLowerCase()
                        ? "bg-ldb-forest text-white border-ldb-forest"
                        : "bg-white text-ldb-dark border-ldb-stone/40 hover:border-ldb-moss"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SeccionCard>

        {/* Alertas de validación */}
        {(validacion.errores.length > 0 || validacion.advertencias.length > 0) && (
          <div className="space-y-2 mb-6">
            {validacion.errores.map((e, i) => (
              <div key={i} className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-500 flex-shrink-0">✖</span>
                <p className="text-sm text-red-700">{e}</p>
              </div>
            ))}
            {validacion.advertencias.map((w, i) => (
              <div key={i} className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-600 flex-shrink-0">⚠</span>
                <p className="text-sm text-amber-800">{w}</p>
              </div>
            ))}
            {validacion.sugerencias.map((s, i) => (
              <div key={i} className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-600 flex-shrink-0">💡</span>
                <p className="text-sm text-green-800">{s}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón continuar fijo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ldb-stone/20 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => onComplete(config)}
            disabled={!validacion.valido}
            className="w-full bg-ldb-forest text-white py-3.5 rounded-xl font-medium hover:bg-ldb-forest-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {validacion.valido ? "Generar mi concepto →" : "Corrige los errores para continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SeccionCard({ titulo, icono, children }: { titulo: string; icono: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 mb-4 border border-ldb-stone/20">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">{icono}</span>
        <h3 className="font-serif text-lg text-ldb-dark">{titulo}</h3>
      </div>
      {children}
    </div>
  );
}

function ValidacionBadge({ valido, errores }: { valido: boolean; errores: number }) {
  if (valido) return (
    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">✓ Cumple normativa</span>
  );
  return (
    <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full">{errores} error{errores > 1 ? "es" : ""}</span>
  );
}

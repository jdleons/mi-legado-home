"use client";

import { useState } from "react";
import { Lote, Lead, ConfiguracionCasa } from "../types";
import { generarPrompt } from "../utils/validador";
import normativaData from "../data/normativa.json";

interface Props {
  lote: Lote;
  configuracion: ConfiguracionCasa;
  lead: Lead;
  onReset: () => void;
}

export default function ResumenFinal({ lote, configuracion, lead, onReset }: Props) {
  const [promptCopiado, setPromptCopiado] = useState(false);
  const normativa = normativaData as typeof normativaData;

  const prompt = generarPrompt(
    configuracion,
    lote,
    normativa.materiales_exteriores as Array<{ id: string; prompt_keyword: string }>,
    normativa.estilos_permitidos as Array<{ id: string; prompt_descriptor: string }>,
    normativa.topo_descriptores,
    normativa.relacion_bosque as Array<{ id: string; prompt_keyword: string }>,
    normativa.tipos_deck as Array<{ id: string; prompt_keyword: string }>
  );

  const copiarPrompt = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setPromptCopiado(true);
      setTimeout(() => setPromptCopiado(false), 2000);
    });
  };

  // Datos calculados
  const nombreEstilo = normativa.estilos_permitidos.find((e) => e.id === configuracion.estilo)?.nombre || "";
  const nombreMateriales = configuracion.materiales
    .map((m) => normativa.materiales_exteriores.find((mat) => mat.id === m)?.nombre)
    .filter(Boolean).join(", ");
  const nombreDeck = normativa.tipos_deck.find((d) => d.id === configuracion.deck_tipo)?.nombre || "";
  const nombreBosque = normativa.relacion_bosque.find((r) => r.id === configuracion.relacion_bosque)?.nombre || "";

  return (
    <div className="min-h-screen bg-ldb-cream">
      <header className="bg-ldb-forest px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-lg text-white">Mi Legado</span>
        <span className="text-ldb-sage text-xs border border-ldb-sage/30 px-3 py-1 rounded-full">
          Visualización conceptual
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-ldb-moss text-xs font-medium uppercase tracking-wider mb-2">Paso 3 de 3 · Tu concepto</p>
          <h2 className="font-serif text-3xl text-ldb-dark mb-1">
            {lead.nombre.split(" ")[0]}, aquí está tu visión
          </h2>
          <p className="text-ldb-warm-gray text-sm">
            Resumen de tu casa conceptual en {lote.nombre}
          </p>
        </div>

        {/* Tarjeta resumen de la casa */}
        <div className="bg-white rounded-2xl border border-ldb-stone/20 overflow-hidden mb-6">
          {/* Header visual */}
          <div className="bg-ldb-forest p-6">
            <p className="text-ldb-sage text-xs uppercase tracking-wider mb-1">{lote.zona}</p>
            <h3 className="font-serif text-2xl text-white font-semibold mb-1">{lote.nombre}</h3>
            <p className="text-ldb-sage text-sm">{nombreEstilo}</p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 divide-x divide-ldb-stone/20 border-b border-ldb-stone/20">
            <div className="p-4 text-center">
              <p className="font-serif text-2xl text-ldb-dark">{configuracion.area_m2}</p>
              <p className="text-xs text-ldb-warm-gray">m² construidos</p>
            </div>
            <div className="p-4 text-center">
              <p className="font-serif text-2xl text-ldb-dark">{configuracion.niveles}</p>
              <p className="text-xs text-ldb-warm-gray">nivel{configuracion.niveles > 1 ? "es" : ""}</p>
            </div>
            <div className="p-4 text-center">
              <p className="font-serif text-2xl text-ldb-dark">{configuracion.habitaciones}</p>
              <p className="text-xs text-ldb-warm-gray">habitaciones</p>
            </div>
          </div>

          {/* Detalles */}
          <div className="p-6 space-y-3">
            <DetalleRow label="Lote" valor={`${lote.area_m2} m² · ${lote.topo_tipo}`} />
            <DetalleRow label="Topografía" valor={`${lote.dif_nivel_m}m de desnivel · acceso al ${lote.orientacion_calle}`} />
            <DetalleRow label="Materiales" valor={nombreMateriales} />
            <DetalleRow label="Deck / terraza" valor={nombreDeck} />
            <DetalleRow label="Relación bosque" valor={nombreBosque} />
            <DetalleRow label="Vistas" valor={configuracion.orientacion_vistas} />
            <DetalleRow label="Parqueos" valor={`${configuracion.parqueos} cubierto${configuracion.parqueos > 1 ? "s" : ""}`} />
            {(configuracion.tiene_estudio || configuracion.tiene_visitas || configuracion.tiene_servicio) && (
              <DetalleRow
                label="Extras"
                valor={[
                  configuracion.tiene_estudio && "Estudio",
                  configuracion.tiene_visitas && "Cuarto de visitas",
                  configuracion.tiene_servicio && "Área de servicio",
                ].filter(Boolean).join(" · ")}
              />
            )}
          </div>
        </div>

        {/* PROMPT DE IMAGEN */}
        <div className="bg-white rounded-2xl border border-ldb-stone/20 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-serif text-xl text-ldb-dark mb-1">Prompt para generar tu render</h3>
              <p className="text-sm text-ldb-warm-gray">
                Copia este texto y pégalo en ChatGPT, Gemini, Midjourney o DALL·E para generar un render conceptual de tu casa.
              </p>
            </div>
          </div>

          {/* Cajas de herramientas */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <a
              href={`https://chat.openai.com/?q=${encodeURIComponent("Generate an architectural render based on this prompt:\n\n" + prompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs bg-ldb-sand border border-ldb-stone/40 text-ldb-dark px-3 py-1.5 rounded-lg hover:bg-ldb-stone/20 transition-colors"
            >
              Abrir en ChatGPT ↗
            </a>
            <a
              href={`https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs bg-ldb-sand border border-ldb-stone/40 text-ldb-dark px-3 py-1.5 rounded-lg hover:bg-ldb-stone/20 transition-colors"
            >
              Abrir en Gemini ↗
            </a>
          </div>

          {/* El prompt */}
          <div className="bg-ldb-dark rounded-xl p-4 font-mono text-xs text-green-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto mb-4">
            {prompt}
          </div>

          <button
            onClick={copiarPrompt}
            className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
              promptCopiado
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-ldb-forest text-white hover:bg-ldb-forest-mid"
            }`}
          >
            {promptCopiado ? "✓ Prompt copiado al portapapeles" : "Copiar prompt completo"}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-ldb-sand border border-ldb-stone/30 rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-ldb-dark mb-1">Nota importante</p>
          <p className="text-xs text-ldb-warm-gray leading-relaxed">{normativa.disclaimer}</p>
        </div>

        {/* CTA Ventas */}
        <div className="bg-ldb-forest rounded-2xl p-6 text-center">
          <p className="font-serif text-xl text-white mb-2">¿Listo para dar el siguiente paso?</p>
          <p className="text-ldb-sage text-sm mb-5">
            Tu asesor de Legado del Bosque puede mostrarte el lote en persona y conectarte con el equipo de arquitectura.
          </p>
          <a
            href="https://wa.me/50200000000?text=Hola%2C%20generé%20mi%20concepto%20de%20casa%20en%20Mi%20Legado%20y%20quisiera%20agendar%20una%20visita."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-ldb-forest font-semibold px-8 py-3 rounded-xl hover:bg-ldb-cream transition-colors text-sm"
          >
            Agendar visita con mi asesor →
          </a>
          <p className="text-ldb-sage/60 text-xs mt-3">Mariangel Ruiz · mruiz@legado.gt</p>
        </div>

        <button
          onClick={onReset}
          className="w-full mt-4 py-3 text-sm text-ldb-warm-gray hover:text-ldb-dark transition-colors"
        >
          ← Comenzar una nueva configuración
        </button>
      </div>
    </div>
  );
}

function DetalleRow({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-ldb-warm-gray min-w-24 flex-shrink-0">{label}</span>
      <span className="text-ldb-dark font-medium capitalize">{valor}</span>
    </div>
  );
}

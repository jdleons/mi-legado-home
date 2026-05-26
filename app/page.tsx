"use client";

import { useState } from "react";
import LoteCard from "./components/LoteCard";
import ConfiguradorForm from "./components/ConfiguradorForm";
import ResumenFinal from "./components/ResumenFinal";
import { Lote, Lead, ConfiguracionCasa } from "./types";
import lotesData from "./data/lotes.json";

type Paso = "bienvenida" | "lote" | "configurador" | "resumen";

export default function HomePage() {
  const [paso, setPaso] = useState<Paso>("bienvenida");
  const [lead, setLead] = useState<Lead | null>(null);
  const [loteSeleccionado, setLoteSeleccionado] = useState<Lote | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionCasa | null>(null);
  const [zonaFiltro, setZonaFiltro] = useState<string>("Todos");

  const lotes = lotesData as Lote[];
  const lotesFiltrados = zonaFiltro === "Todos" ? lotes : lotes.filter((l) => l.zona === zonaFiltro);

  if (paso === "bienvenida") {
    return (
      <div className="min-h-screen bg-ldb-forest flex flex-col">
        <header className="px-6 py-5 flex items-center justify-between">
          <div>
            <span className="font-serif text-xl text-white tracking-wide">Mi Legado</span>
            <span className="text-ldb-sage text-xs ml-2">por Pavalco</span>
          </div>
          <span className="text-ldb-sage text-xs border border-ldb-sage/30 px-3 py-1 rounded-full">
            Visualización conceptual gratuita
          </span>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-ldb-sage text-xs font-medium uppercase tracking-widest mb-4">
            Legado del Bosque · Pavalco
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-semibold leading-tight mb-4 max-w-2xl">
            Diseña la casa que merece este entorno
          </h1>
          <p className="text-ldb-sage text-lg mb-10 max-w-md leading-relaxed">
            Configura tu residencia ideal dentro de los lineamientos reales de construcción de Legado del Bosque.
          </p>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="font-serif text-xl text-white mb-1">Comenzar mi configuración</h2>
            <p className="text-ldb-sage text-sm mb-6">Tu asesor de LDB recibirá tu concepto al finalizar.</p>
            <LeadForm onSubmit={(data) => { setLead(data); setPaso("lote"); }} />
          </div>

          <p className="text-ldb-sage/50 text-xs mt-8 max-w-sm">
            Las imágenes generadas son visualizaciones conceptuales sujetas a validación por Mario Noriega & Asociados.
          </p>
        </div>
      </div>
    );
  }

  if (paso === "lote") {
    return (
      <div className="min-h-screen bg-ldb-cream pb-28">
        <header className="bg-ldb-forest px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <span className="font-serif text-lg text-white">Mi Legado</span>
          <BarraProgreso paso={2} total={4} />
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <p className="text-ldb-moss text-xs font-medium uppercase tracking-wider mb-2">Paso 1 de 3</p>
            <h2 className="font-serif text-3xl text-ldb-dark mb-2">
              Hola, {lead?.nombre.split(" ")[0]}. ¿En cuál lote imaginas tu casa?
            </h2>
            <p className="text-ldb-warm-gray">Selecciona el lote que más te interesa. Puedes cambiarlo después.</p>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {["Todos", "Aurel Valle", "Aurel Cerro", "Aurel Parque"].map((zona) => (
              <button
                key={zona}
                onClick={() => setZonaFiltro(zona)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  zonaFiltro === zona
                    ? "bg-ldb-forest text-white"
                    : "bg-white text-ldb-dark border border-ldb-stone/40 hover:border-ldb-forest"
                }`}
              >
                {zona}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {lotesFiltrados.map((lote) => (
              <LoteCard
                key={lote.id}
                lote={lote as Lote}
                seleccionado={loteSeleccionado?.id === lote.id}
                onSelect={(l) => setLoteSeleccionado(l)}
              />
            ))}
          </div>
        </div>

        {loteSeleccionado && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ldb-stone/20 p-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <p className="font-medium text-ldb-dark">{loteSeleccionado.nombre}</p>
                <p className="text-sm text-ldb-warm-gray">{loteSeleccionado.area_m2} m² · {loteSeleccionado.topo_tipo}</p>
              </div>
              <button
                onClick={() => setPaso("configurador")}
                className="bg-ldb-forest text-white px-8 py-3 rounded-xl font-medium hover:bg-ldb-forest-mid transition-colors"
              >
                Configurar mi casa →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (paso === "configurador" && loteSeleccionado) {
    return (
      <ConfiguradorForm
        lote={loteSeleccionado}
        lead={lead!}
        onComplete={(config) => { setConfiguracion(config); setPaso("resumen"); }}
        onBack={() => setPaso("lote")}
      />
    );
  }

  if (paso === "resumen" && loteSeleccionado && configuracion && lead) {
    return (
      <ResumenFinal
        lote={loteSeleccionado}
        configuracion={configuracion}
        lead={lead}
        onReset={() => { setPaso("bienvenida"); setLoteSeleccionado(null); setConfiguracion(null); }}
      />
    );
  }

  return null;
}

function LeadForm({ onSubmit }: { onSubmit: (data: Lead) => void }) {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", tiene_lote: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit(form as Lead);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-ldb-sage text-xs font-medium block mb-1.5">Nombre completo</label>
        <input type="text" required placeholder="Tu nombre" value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-ldb-sage text-sm" />
      </div>
      <div>
        <label className="text-ldb-sage text-xs font-medium block mb-1.5">Correo electrónico</label>
        <input type="email" required placeholder="tu@email.com" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-ldb-sage text-sm" />
      </div>
      <div>
        <label className="text-ldb-sage text-xs font-medium block mb-1.5">Teléfono / WhatsApp</label>
        <input type="tel" required placeholder="+502 0000-0000" value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-ldb-sage text-sm" />
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="tiene_lote" checked={form.tiene_lote}
          onChange={(e) => setForm({ ...form, tiene_lote: e.target.checked })}
          className="w-4 h-4 accent-ldb-sage" />
        <label htmlFor="tiene_lote" className="text-ldb-sage text-sm">Ya tengo un lote en mente</label>
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-ldb-sage text-ldb-forest font-semibold py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-70 mt-2">
        {loading ? "Iniciando..." : "Iniciar mi configuración →"}
      </button>
    </form>
  );
}

function BarraProgreso({ paso, total }: { paso: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${i < paso ? "w-6 bg-ldb-sage" : "w-3 bg-white/20"}`} />
      ))}
    </div>
  );
}

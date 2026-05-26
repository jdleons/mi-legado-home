"use client";

// COMPONENTE: LoteCard
// Este componente muestra la tarjeta de un lote.
// Se usa así: <LoteCard lote={lote22} onSelect={handleSelect} />
// Cada vez que lo uses, muestra los datos del lote que le pases.

import { Lote } from "../types";

// Función auxiliar: convierte el tipo de topografía a texto y color legible
function topoInfo(tipo: Lote["topo_tipo"]) {
  const map = {
    plano: {
      label: "Pendiente suave",
      color: "bg-green-100 text-green-800",
      icon: "▬",
    },
    medio: {
      label: "Pendiente media",
      color: "bg-amber-100 text-amber-800",
      icon: "◥",
    },
    pronunciado: {
      label: "Pendiente pronunciada",
      color: "bg-red-100 text-red-800",
      icon: "▲",
    },
  };
  return map[tipo];
}

// Función auxiliar: formatea un número como precio en dólares
// 738400 → "$738,400"
function formatPrecio(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

// Las "props" son los datos que recibe el componente desde afuera.
// onSelect es una función que se llama cuando el usuario hace clic en "Seleccionar".
interface LoteCardProps {
  lote: Lote;
  seleccionado?: boolean;
  onSelect: (lote: Lote) => void;
}

export default function LoteCard({
  lote,
  seleccionado = false,
  onSelect,
}: LoteCardProps) {
  const topo = topoInfo(lote.topo_tipo);

  // Si el lote no está disponible, mostramos una versión grisada
  if (!lote.disponible) {
    return (
      <div className="border border-ldb-stone/30 rounded-xl p-5 bg-ldb-sand/30 opacity-50">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-medium text-ldb-warm-gray uppercase tracking-wider">
              {lote.zona}
            </p>
            <h3 className="font-serif text-xl text-ldb-warm-gray">
              Lote {lote.numero}
            </h3>
          </div>
          <span className="bg-ldb-stone/30 text-ldb-warm-gray text-xs px-3 py-1 rounded-full">
            Reservado
          </span>
        </div>
        <p className="text-sm text-ldb-warm-gray">
          {lote.area_m2.toLocaleString()} m²
        </p>
      </div>
    );
  }

  return (
    // El borde cambia a verde oscuro si este lote está seleccionado
    <div
      className={`
        border rounded-xl p-5 cursor-pointer transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${
          seleccionado
            ? "border-ldb-forest bg-ldb-forest/5 shadow-md"
            : "border-ldb-stone/40 bg-white hover:border-ldb-moss"
        }
      `}
      onClick={() => onSelect(lote)}
    >
      {/* CABECERA: zona + número + badge de topografía */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-ldb-moss uppercase tracking-wider mb-1">
            {lote.zona}
          </p>
          <h3 className="font-serif text-2xl font-semibold text-ldb-dark">
            Lote {lote.numero}
          </h3>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${topo.color}`}
        >
          {topo.icon} {topo.label}
        </span>
      </div>

      {/* MÉTRICAS PRINCIPALES en grid de 2 columnas */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-ldb-cream rounded-lg p-3">
          <p className="text-xs text-ldb-warm-gray mb-0.5">Área total</p>
          <p className="font-medium text-ldb-dark">
            {lote.area_m2.toLocaleString()} m²
          </p>
          <p className="text-xs text-ldb-warm-gray">
            {lote.area_varas2.toLocaleString()} vrs²
          </p>
        </div>
        <div className="bg-ldb-cream rounded-lg p-3">
          <p className="text-xs text-ldb-warm-gray mb-0.5">Desde</p>
          <p className="font-medium text-ldb-dark">
            {formatPrecio(lote.precio_total_usd)}
          </p>
          <p className="text-xs text-ldb-warm-gray">
            ${lote.precio_vara2_usd}/vara²
          </p>
        </div>
      </div>

      {/* DATOS TOPOGRÁFICOS — los más importantes para el configurador */}
      <div className="border-t border-ldb-stone/20 pt-4 mb-4">
        <p className="text-xs font-medium text-ldb-warm-gray uppercase tracking-wider mb-2">
          Topografía
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm font-medium text-ldb-dark">
              {lote.frente_m}m
            </p>
            <p className="text-xs text-ldb-warm-gray">Frente</p>
          </div>
          <div>
            <p className="text-sm font-medium text-ldb-dark">
              {lote.fondo_promedio_m}m
            </p>
            <p className="text-xs text-ldb-warm-gray">Fondo</p>
          </div>
          <div>
            <p
              className={`text-sm font-medium ${lote.dif_nivel_m > 5 ? "text-amber-700" : "text-ldb-dark"}`}
            >
              {lote.dif_nivel_m}m
            </p>
            <p className="text-xs text-ldb-warm-gray">Dif. nivel</p>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN BREVE */}
      <p className="text-xs text-ldb-warm-gray leading-relaxed mb-4 line-clamp-2">
        {lote.descripcion_topo}
      </p>

      {/* DATOS FINANCIEROS */}
      <div className="flex items-center justify-between text-xs text-ldb-warm-gray border-t border-ldb-stone/20 pt-3">
        <span>Enganche {lote.enganche_porcentaje}%</span>
        <span>
          {lote.cuotas_enganche} cuotas · ${lote.mantenimiento_mensual_usd}
          /mes mant.
        </span>
      </div>

      {/* BOTÓN DE SELECCIÓN */}
      <button
        className={`
          w-full mt-4 py-2.5 rounded-lg text-sm font-medium transition-all
          ${
            seleccionado
              ? "bg-ldb-forest text-white"
              : "bg-ldb-sand text-ldb-forest hover:bg-ldb-forest hover:text-white"
          }
        `}
        onClick={(e) => {
          e.stopPropagation(); // Evitar doble clic
          onSelect(lote);
        }}
      >
        {seleccionado ? "✓ Lote seleccionado" : "Seleccionar este lote"}
      </button>
    </div>
  );
}

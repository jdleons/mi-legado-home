"use client";
import { Lote } from "../types";

function topoInfo(tipo: Lote["topo_tipo"]) {
  const map = {
    plano: { label: "Pendiente suave", bg: "#EAF3DE", color: "#3B6D11", icon: "▬" },
    medio: { label: "Pendiente media", bg: "#FAEEDA", color: "#633806", icon: "◥" },
    pronunciado: { label: "Pendiente pronunciada", bg: "#FCEBEB", color: "#A32D2D", icon: "▲" },
  };
  return map[tipo];
}

function formatPrecio(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

interface LoteCardProps {
  lote: Lote;
  seleccionado?: boolean;
  onSelect: (lote: Lote) => void;
}

export default function LoteCard({ lote, seleccionado = false, onSelect }: LoteCardProps) {
  const topo = topoInfo(lote.topo_tipo);

  if (!lote.disponible) {
    return (
      <div style={{border:"1px solid #E8DFC8",borderRadius:"12px",padding:"20px",opacity:0.5,backgroundColor:"#F5F0E8"}}>
        <p style={{fontSize:"11px",color:"#6B6B63",textTransform:"uppercase",letterSpacing:"0.1em"}}>{lote.zona}</p>
        <h3 style={{fontFamily:"Georgia,serif",fontSize:"20px",color:"#6B6B63"}}>Lote {lote.numero}</h3>
        <span style={{backgroundColor:"rgba(181,168,148,0.3)",color:"#6B6B63",fontSize:"11px",padding:"3px 10px",borderRadius:"20px"}}>Reservado</span>
      </div>
    );
  }

  return (
    <div onClick={() => onSelect(lote)}
      style={{border:seleccionado?"2px solid #2C3B1F":"1px solid #E8DFC8",borderRadius:"12px",overflow:"hidden",cursor:"pointer",backgroundColor:seleccionado?"rgba(44,59,31,0.04)":"white",transition:"all 0.2s",boxShadow:seleccionado?"0 4px 16px rgba(44,59,31,0.12)":"none"}}>

      {(lote as unknown as {rotulo?:string}).rotulo && (
        <div style={{backgroundColor:"white",padding:"16px",display:"flex",justifyContent:"center",alignItems:"center",borderBottom:"1px solid #E8DFC8"}}>
          <img
            src={(lote as unknown as {rotulo?:string}).rotulo}
            alt={`Rótulo ${lote.nombre}`}
            style={{width:"80%",height:"auto",display:"block"}}
          />
        </div>
      )}

      <div style={{padding:"20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
        <div>
          <p style={{fontSize:"10px",fontWeight:500,color:"#556B2F",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"4px"}}>{lote.zona}</p>
          <h3 style={{fontFamily:"Georgia,serif",fontSize:"22px",fontWeight:600,color:"#1A1F14"}}>Lote {lote.numero}</h3>
        </div>
        <span style={{backgroundColor:topo.bg,color:topo.color,fontSize:"11px",fontWeight:500,padding:"4px 10px",borderRadius:"20px",whiteSpace:"nowrap"}}>
          {topo.icon} {topo.label}
        </span>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}}>
        <div style={{backgroundColor:"#F5F0E8",borderRadius:"8px",padding:"12px"}}>
          <p style={{fontSize:"11px",color:"#6B6B63",marginBottom:"2px"}}>Área total</p>
          <p style={{fontWeight:500,color:"#1A1F14",fontSize:"15px"}}>{lote.area_m2.toLocaleString()} m²</p>
          <p style={{fontSize:"11px",color:"#6B6B63"}}>{lote.area_varas2.toLocaleString()} vrs²</p>
        </div>
        <div style={{backgroundColor:"#F5F0E8",borderRadius:"8px",padding:"12px"}}>

        </div>
      </div>

      <div style={{borderTop:"1px solid #E8DFC8",paddingTop:"14px",marginBottom:"14px"}}>
        <p style={{fontSize:"10px",fontWeight:500,color:"#6B6B63",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"10px"}}>Topografía</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",textAlign:"center",gap:"4px"}}>
          <div>
            <p style={{fontSize:"14px",fontWeight:500,color:"#1A1F14"}}>{lote.frente_m}m</p>
            <p style={{fontSize:"11px",color:"#6B6B63"}}>Frente</p>
          </div>
          <div>
            <p style={{fontSize:"14px",fontWeight:500,color:"#1A1F14"}}>{lote.fondo_promedio_m}m</p>
            <p style={{fontSize:"11px",color:"#6B6B63"}}>Fondo</p>
          </div>
          <div>
            <p style={{fontSize:"14px",fontWeight:500,color:lote.dif_nivel_m>5?"#BA7517":"#1A1F14"}}>{lote.dif_nivel_m}m</p>
            <p style={{fontSize:"11px",color:"#6B6B63"}}>Dif. nivel</p>
          </div>
        </div>
      </div>

      <p style={{fontSize:"12px",color:"#6B6B63",lineHeight:1.5,marginBottom:"14px"}}>{lote.descripcion_topo}</p>

      <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",color:"#6B6B63",borderTop:"1px solid #E8DFC8",paddingTop:"10px",marginBottom:"14px"}}>

      </div>

      <button onClick={(e) => { e.stopPropagation(); onSelect(lote); }}
        style={{width:"100%",padding:"10px",borderRadius:"10px",border:"none",backgroundColor:seleccionado?"#2C3B1F":"#E8DFC8",color:seleccionado?"white":"#2C3B1F",fontWeight:500,cursor:"pointer",fontSize:"14px",transition:"all 0.2s"}}>
        {seleccionado?"✓ Lote seleccionado":"Seleccionar este lote"}
      </button>
      <p style={{textAlign:"center",fontSize:"12px",color:"#9A9A93",marginTop:"10px"}}>
        Enganche {lote.enganche_porcentaje}% en {lote.cuotas_enganche} cuotas
      </p>
      </div>
    </div>
  );
}
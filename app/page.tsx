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
      <div style={{minHeight:"100vh",backgroundColor:"#2C3B1F",display:"flex",flexDirection:"column"}}>
        <header style={{padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <span style={{fontFamily:"Georgia,serif",fontSize:"20px",color:"white"}}>Mi Legado</span>
            <span style={{color:"#8A9E6D",fontSize:"12px",marginLeft:"8px"}}>por Pavalco</span>
          </div>
          <span style={{color:"#8A9E6D",fontSize:"12px",border:"1px solid rgba(138,158,109,0.3)",padding:"4px 12px",borderRadius:"20px"}}>
            Visualización conceptual gratuita
          </span>
        </header>

        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center"}}>
          <p style={{color:"#8A9E6D",fontSize:"11px",fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"16px"}}>
            Legado del Bosque · Pavalco
          </p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(32px,5vw,56px)",color:"white",fontWeight:600,lineHeight:1.2,marginBottom:"16px",maxWidth:"600px"}}>
            Diseña la casa que merece este entorno
          </h1>
          <p style={{color:"#8A9E6D",fontSize:"18px",marginBottom:"40px",maxWidth:"400px",lineHeight:1.6}}>
            Configura tu residencia ideal dentro de los lineamientos reales de construcción de Legado del Bosque.
          </p>

          <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"16px",padding:"32px",width:"100%",maxWidth:"420px"}}>
            <h2 style={{fontFamily:"Georgia,serif",fontSize:"20px",color:"white",marginBottom:"4px"}}>Comenzar mi configuración</h2>
            <p style={{color:"#8A9E6D",fontSize:"14px",marginBottom:"24px"}}>Tu asesor de LDB recibirá tu concepto al finalizar.</p>
            <LeadForm onSubmit={(data) => { setLead(data); setPaso("lote"); }} />
          </div>

          <p style={{color:"rgba(138,158,109,0.5)",fontSize:"12px",marginTop:"24px",maxWidth:"320px"}}>
            Las imágenes generadas son visualizaciones conceptuales sujetas a validación por Mario Noriega & Asociados.
          </p>
        </div>
      </div>
    );
  }

  if (paso === "lote") {
    return (
      <div style={{minHeight:"100vh",backgroundColor:"#F5F0E8",paddingBottom:"100px"}}>
        <header style={{backgroundColor:"#2C3B1F",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:"18px",color:"white"}}>Mi Legado</span>
          <span style={{color:"#8A9E6D",fontSize:"12px"}}>Paso 1 de 3</span>
        </header>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"32px 16px"}}>
          <div style={{marginBottom:"32px"}}>
            <p style={{color:"#556B2F",fontSize:"11px",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"8px"}}>Paso 1 de 3</p>
            <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(24px,3vw,32px)",color:"#1A1F14",marginBottom:"8px"}}>
              Hola, {lead?.nombre.split(" ")[0]}. ¿En cuál lote imaginas tu casa?
            </h2>
            <p style={{color:"#6B6B63"}}>Selecciona el lote que más te interesa. Puedes cambiarlo después.</p>
          </div>

          <div style={{display:"flex",gap:"8px",marginBottom:"24px",flexWrap:"wrap"}}>
            {["Todos","Aurel Valle","Aurel Cerro","Aurel Parque"].map((zona) => (
              <button key={zona} onClick={() => setZonaFiltro(zona)}
                style={{padding:"8px 16px",borderRadius:"20px",fontSize:"14px",fontWeight:500,cursor:"pointer",border: zonaFiltro===zona?"none":"1px solid #B5A894",backgroundColor:zonaFiltro===zona?"#2C3B1F":"white",color:zonaFiltro===zona?"white":"#1A1F14",transition:"all 0.2s"}}>
                {zona}
              </button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"16px",marginBottom:"32px"}}>
            {lotesFiltrados.map((lote) => (
              <LoteCard key={lote.id} lote={lote as Lote} seleccionado={loteSeleccionado?.id===lote.id} onSelect={(l) => setLoteSeleccionado(l)} />
            ))}
          </div>
        </div>

        {loteSeleccionado && (
          <div style={{position:"fixed",bottom:0,left:0,right:0,backgroundColor:"white",borderTop:"1px solid #E8DFC8",padding:"16px"}}>
            <div style={{maxWidth:"1100px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <p style={{fontWeight:500,color:"#1A1F14"}}>{loteSeleccionado.nombre}</p>
                <p style={{fontSize:"14px",color:"#6B6B63"}}>{loteSeleccionado.area_m2} m² · {loteSeleccionado.topo_tipo}</p>
              </div>
              <button onClick={() => setPaso("configurador")}
                style={{backgroundColor:"#2C3B1F",color:"white",padding:"12px 32px",borderRadius:"12px",fontWeight:500,cursor:"pointer",border:"none",fontSize:"15px"}}>
                Configurar mi casa →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (paso === "configurador" && loteSeleccionado) {
    return <ConfiguradorForm lote={loteSeleccionado} lead={lead!} onComplete={(config) => { setConfiguracion(config); setPaso("resumen"); }} onBack={() => setPaso("lote")} />;
  }

  if (paso === "resumen" && loteSeleccionado && configuracion && lead) {
    return <ResumenFinal lote={loteSeleccionado} configuracion={configuracion} lead={lead} onReset={() => { setPaso("bienvenida"); setLoteSeleccionado(null); setConfiguracion(null); }} />;
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

  const inputStyle = {width:"100%",backgroundColor:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"8px",padding:"10px 16px",color:"white",fontSize:"14px",outline:"none",boxSizing:"border-box" as const};
  const labelStyle = {color:"#8A9E6D",fontSize:"12px",fontWeight:500,display:"block",marginBottom:"6px"};

  return (
    <form onSubmit={handleSubmit}>
      <div style={{marginBottom:"16px"}}>
        <label style={labelStyle}>Nombre completo</label>
        <input type="text" required placeholder="Tu nombre" value={form.nombre} onChange={(e) => setForm({...form,nombre:e.target.value})} style={inputStyle} />
      </div>
      <div style={{marginBottom:"16px"}}>
        <label style={labelStyle}>Correo electrónico</label>
        <input type="email" required placeholder="tu@email.com" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} style={inputStyle} />
      </div>
      <div style={{marginBottom:"16px"}}>
        <label style={labelStyle}>Teléfono / WhatsApp</label>
        <input type="tel" required placeholder="+502 0000-0000" value={form.telefono} onChange={(e) => setForm({...form,telefono:e.target.value})} style={inputStyle} />
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
        <input type="checkbox" id="tiene_lote" checked={form.tiene_lote} onChange={(e) => setForm({...form,tiene_lote:e.target.checked})} style={{width:"16px",height:"16px"}} />
        <label htmlFor="tiene_lote" style={{color:"#8A9E6D",fontSize:"14px"}}>Ya tengo un lote en mente</label>
      </div>
      <button type="submit" disabled={loading}
        style={{width:"100%",backgroundColor:"#8A9E6D",color:"#2C3B1F",fontWeight:600,padding:"12px",borderRadius:"12px",border:"none",cursor:"pointer",fontSize:"15px",marginTop:"8px"}}>
        {loading ? "Iniciando..." : "Iniciar mi configuración →"}
      </button>
    </form>
  );
}

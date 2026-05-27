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
  const zonas = ["Todos", ...Array.from(new Set(lotes.map(l => l.zona)))];
  const lotesFiltrados = zonaFiltro === "Todos" ? lotes : lotes.filter((l) => l.zona === zonaFiltro);

  if (paso === "bienvenida") {
    return (
      <div style={{minHeight:"100vh",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url('/hero-casa.png')",backgroundSize:"cover",backgroundPosition:"center 30%",filter:"brightness(0.45)"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(26,31,20,0.3) 0%, rgba(26,31,20,0.7) 60%, rgba(26,31,20,0.95) 100%)"}} />

        <header style={{position:"relative",zIndex:10,padding:"24px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <img src="/logo-isotipo.png" alt="Legado del Bosque" style={{height:"48px",objectFit:"contain"}} />
          <span style={{color:"rgba(255,255,255,0.6)",fontSize:"12px",border:"1px solid rgba(255,255,255,0.2)",padding:"6px 16px",borderRadius:"20px",letterSpacing:"0.08em"}}>
            Visualización conceptual gratuita
          </span>
        </header>

        <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"0 24px 60px",textAlign:"center" as const}}>
          <p style={{color:"#8A9E6D",fontSize:"11px",fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase" as const,marginBottom:"20px"}}>
            Legado del Bosque · Parque Residencial
          </p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(36px,6vw,72px)",color:"white",fontWeight:600,lineHeight:1.1,marginBottom:"16px",maxWidth:"700px",textShadow:"0 2px 20px rgba(0,0,0,0.5)"}}>
            Este entorno merece la casa de tus sueños
          </h1>
          <p style={{color:"rgba(255,255,255,0.65)",fontSize:"clamp(16px,2vw,20px)",marginBottom:"48px",maxWidth:"480px",lineHeight:1.7}}>
            Configura tu residencia ideal en Aurel dentro de los lineamientos reales de construcción de Legado del Bosque.
          </p>

          <div style={{backgroundColor:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"20px",padding:"36px",width:"100%",maxWidth:"440px"}}>
            <h2 style={{fontFamily:"Georgia,serif",fontSize:"22px",color:"white",marginBottom:"6px"}}>Comenzar mi configuración</h2>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",marginBottom:"24px"}}>Tu asesor de LDB recibirá tu concepto al finalizar.</p>
            <LeadForm onSubmit={(data) => { setLead(data); setPaso("lote"); }} />
          </div>

          <div style={{display:"flex",gap:"40px",marginTop:"48px",flexWrap:"wrap" as const,justifyContent:"center"}}>
            {[{n:"8",l:"lotes disponibles"},{n:"155 mzs",l:"parque natural"},{n:"70%",l:"reserva forestal"}].map(({n,l}) => (
              <div key={l} style={{textAlign:"center" as const}}>
                <p style={{fontFamily:"Georgia,serif",fontSize:"28px",color:"white",fontWeight:600}}>{n}</p>
                <p style={{color:"rgba(255,255,255,0.45)",fontSize:"12px",letterSpacing:"0.08em",textTransform:"uppercase" as const}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (paso === "lote") {
    return (
      <div style={{minHeight:"100vh",backgroundColor:"#F5F0E8",paddingBottom:"100px"}}>
        <div style={{position:"relative",backgroundImage:"url('/foto-aerea.jpg')",backgroundSize:"cover",backgroundPosition:"center",paddingBottom:"48px"}}>
          <div style={{position:"absolute",inset:0,backgroundColor:"rgba(26,31,20,0.75)"}} />
          <div style={{position:"relative",zIndex:1}}>
            <div style={{padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <img src="/logo-isotipo.png" alt="LDB" style={{height:"36px",objectFit:"contain"}} />
              <span style={{color:"rgba(255,255,255,0.5)",fontSize:"12px"}}>Paso 1 de 3</span>
            </div>
            <div style={{padding:"0 24px 0",maxWidth:"1100px",margin:"0 auto"}}>
              <p style={{color:"#8A9E6D",fontSize:"11px",fontWeight:500,textTransform:"uppercase" as const,letterSpacing:"0.12em",marginBottom:"8px"}}>Selecciona tu lote</p>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(28px,4vw,44px)",color:"white",marginBottom:"8px"}}>
                Hola, {lead?.nombre.split(" ")[0]}. ¿En cuál lote imaginas tu casa?
              </h2>
              <p style={{color:"rgba(255,255,255,0.55)",fontSize:"15px"}}>Selecciona el lote que más te interesa. Puedes cambiarlo después.</p>
            </div>
          </div>
        </div>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"32px 16px"}}>
          <div style={{display:"flex",gap:"8px",marginBottom:"28px",flexWrap:"wrap" as const}}>
            {zonas.map((zona) => (
              <button key={zona} onClick={() => setZonaFiltro(zona)}
                style={{padding:"8px 20px",borderRadius:"20px",fontSize:"13px",fontWeight:500,cursor:"pointer",border:zonaFiltro===zona?"none":"1px solid #B5A894",backgroundColor:zonaFiltro===zona?"#2C3B1F":"white",color:zonaFiltro===zona?"white":"#1A1F14",transition:"all 0.2s"}}>
                {zona}
              </button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"20px"}}>
            {lotesFiltrados.map((lote) => (
              <LoteCard key={lote.id} lote={lote as Lote} seleccionado={loteSeleccionado?.id===lote.id} onSelect={(l) => setLoteSeleccionado(l)} />
            ))}
          </div>
        </div>

        {loteSeleccionado && (
          <div style={{position:"fixed",bottom:0,left:0,right:0,backgroundColor:"white",borderTop:"1px solid #E8DFC8",padding:"16px",boxShadow:"0 -4px 24px rgba(0,0,0,0.08)"}}>
            <div style={{maxWidth:"1100px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <div style={{width:"40px",height:"40px",backgroundColor:"#2C3B1F",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"16px"}}>✓</div>
                <div>
                  <p style={{fontWeight:600,color:"#1A1F14",fontSize:"15px"}}>{loteSeleccionado.nombre}</p>
                  <p style={{fontSize:"13px",color:"#6B6B63"}}>{loteSeleccionado.area_m2} m² · {loteSeleccionado.topo_tipo} · desde ${loteSeleccionado.precio_total_usd.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => setPaso("configurador")}
                style={{backgroundColor:"#2C3B1F",color:"white",padding:"14px 32px",borderRadius:"12px",fontWeight:600,cursor:"pointer",border:"none",fontSize:"15px",whiteSpace:"nowrap" as const}}>
                Tu casa ideal, a un clic →
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

  const inputStyle = {width:"100%",backgroundColor:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"10px",padding:"12px 16px",color:"white",fontSize:"14px",outline:"none",boxSizing:"border-box" as const,marginBottom:"12px"};

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" required placeholder="Nombre completo" value={form.nombre} onChange={(e) => setForm({...form,nombre:e.target.value})} style={inputStyle} />
      <input type="email" required placeholder="Correo electrónico" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} style={inputStyle} />
      <input type="tel" required placeholder="Teléfono / WhatsApp (+502)" value={form.telefono} onChange={(e) => setForm({...form,telefono:e.target.value})} style={inputStyle} />
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"20px"}}>
        <input type="checkbox" id="tiene_lote" checked={form.tiene_lote} onChange={(e) => setForm({...form,tiene_lote:e.target.checked})} style={{width:"16px",height:"16px",accentColor:"#8A9E6D"}} />
        <label htmlFor="tiene_lote" style={{color:"rgba(255,255,255,0.55)",fontSize:"13px"}}>Ya tengo un lote en mente</label>
      </div>
      <button type="submit" disabled={loading}
        style={{width:"100%",backgroundColor:"#8A9E6D",color:"#1A1F14",fontWeight:700,padding:"14px",borderRadius:"12px",border:"none",cursor:"pointer",fontSize:"15px"}}>
        {loading ? "Iniciando..." : "Iniciar mi configuración →"}
      </button>
    </form>
  );
}
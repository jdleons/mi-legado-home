"use client";
import { useState, useEffect, useRef } from "react";
import LoteCard from "./components/LoteCard";
import ConfiguradorForm from "./components/ConfiguradorForm";
import ResumenFinal from "./components/ResumenFinal";
import { Lote, Lead, ConfiguracionCasa } from "./types";
import lotesData from "./data/lotes.json";

type Paso = "bienvenida" | "lote" | "configurador" | "resumen";

// Hook para animaciones de entrada al hacer scroll
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealDiv({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      ...style
    }}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const [paso, setPaso] = useState<Paso>("bienvenida");
  const [lead, setLead] = useState<Lead | null>(null);
  const [loteSeleccionado, setLoteSeleccionado] = useState<Lote | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionCasa | null>(null);
  const [zonaFiltro, setZonaFiltro] = useState<string>("Todos");
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lotes = lotesData as Lote[];
  const zonas = ["Todos", ...Array.from(new Set(lotes.map(l => l.zona)))];
  const lotesFiltrados = zonaFiltro === "Todos" ? lotes : lotes.filter((l) => l.zona === zonaFiltro);

  if (paso === "bienvenida") {
    return (
      <div style={{minHeight:"100vh",backgroundColor:"#0D110A",overflow:"hidden"}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
          * { margin:0; padding:0; box-sizing:border-box; }
          ::placeholder { color: rgba(255,255,255,0.35) !important; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
          @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
          @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
          @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
          @keyframes pulse-ring { 0% { transform:scale(1); opacity:0.4; } 100% { transform:scale(1.8); opacity:0; } }
          .btn-primary:hover { transform:translateY(-2px); box-shadow:0 20px 60px rgba(138,158,109,0.4) !important; }
          .btn-primary { transition: all 0.3s ease !important; }
          .stat-item:hover .stat-num { color:#8A9E6D !important; }
          .stat-item { transition: all 0.3s ease; cursor:default; }
          input:focus { border-color:rgba(138,158,109,0.6) !important; background:rgba(255,255,255,0.1) !important; outline:none; }
        `}</style>

        {/* Hero parallax */}
        <div style={{position:"fixed",inset:0,zIndex:0}}>
          <div style={{
            position:"absolute",inset:0,
            backgroundImage:"url('/hero-casa.png')",
            backgroundSize:"cover",
            backgroundPosition:"center 30%",
            filter:"brightness(0.35) saturate(0.8)",
            transform:`translateY(${scrollY * 0.3}px)`,
            transition:"transform 0s"
          }} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg, rgba(13,17,10,0.2) 0%, rgba(13,17,10,0.5) 40%, rgba(13,17,10,0.92) 100%)"}} />
          {/* Partículas decorativas */}
          <div style={{position:"absolute",top:"20%",left:"10%",width:"1px",height:"60px",background:"linear-gradient(to bottom, transparent, rgba(138,158,109,0.4), transparent)",animation:"float 4s ease-in-out infinite"}} />
          <div style={{position:"absolute",top:"40%",right:"15%",width:"1px",height:"40px",background:"linear-gradient(to bottom, transparent, rgba(138,158,109,0.3), transparent)",animation:"float 6s ease-in-out infinite 1s"}} />
          <div style={{position:"absolute",top:"60%",left:"25%",width:"1px",height:"80px",background:"linear-gradient(to bottom, transparent, rgba(138,158,109,0.2), transparent)",animation:"float 5s ease-in-out infinite 2s"}} />
        </div>

        {/* Header */}
        <header style={{position:"relative",zIndex:10,padding:"28px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",
          animation: mounted ? "fadeIn 1s ease 0.2s both" : "none"}}>
          <img src="/logo-isotipo.png" alt="Legado del Bosque" style={{height:"44px",objectFit:"contain"}} />
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:"#8A9E6D",animation:"pulse-ring 2s ease-out infinite"}} />
            <span style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase"}}>
              Visualización conceptual
            </span>
          </div>
        </header>

        {/* Contenido hero */}
        <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"0 24px 80px",textAlign:"center"}}>

          <div style={{animation: mounted ? "fadeUp 1s ease 0.4s both" : "none"}}>
            <p style={{
              color:"#8A9E6D",fontSize:"11px",fontWeight:500,letterSpacing:"0.25em",
              textTransform:"uppercase",marginBottom:"24px",
              display:"inline-flex",alignItems:"center",gap:"12px"
            }}>
              <span style={{display:"inline-block",width:"32px",height:"1px",backgroundColor:"#8A9E6D"}} />
              Legado del Bosque · Parque Residencial
              <span style={{display:"inline-block",width:"32px",height:"1px",backgroundColor:"#8A9E6D"}} />
            </p>
          </div>

          <div style={{animation: mounted ? "fadeUp 1s ease 0.6s both" : "none"}}>
            <h1 style={{
              fontFamily:"'Cormorant Garamond', Georgia, serif",
              fontSize:"clamp(48px,7vw,88px)",
              color:"white",fontWeight:300,lineHeight:1.05,
              marginBottom:"8px",maxWidth:"800px",
              letterSpacing:"-0.01em"
            }}>
              Este entorno merece
            </h1>
            <h1 style={{
              fontFamily:"'Cormorant Garamond', Georgia, serif",
              fontSize:"clamp(48px,7vw,88px)",
              fontStyle:"italic",fontWeight:300,lineHeight:1.05,
              marginBottom:"32px",maxWidth:"800px",
              letterSpacing:"-0.01em",
              background:"linear-gradient(135deg, #ffffff 0%, #8A9E6D 50%, #ffffff 100%)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              animation:"shimmer 4s linear infinite"
            }}>
              la casa de tus sueños.
            </h1>
          </div>

          <div style={{animation: mounted ? "fadeUp 1s ease 0.8s both" : "none"}}>
            <p style={{
              color:"rgba(255,255,255,0.55)",
              fontSize:"clamp(16px,2vw,19px)",
              marginBottom:"56px",maxWidth:"460px",lineHeight:1.8,
              fontWeight:300,letterSpacing:"0.02em"
            }}>
              Hay lugares que te piden una casa a la altura.<br/>Este es uno de ellos.
            </p>
          </div>

          {/* Formulario */}
          <div style={{
            animation: mounted ? "fadeUp 1s ease 1s both" : "none",
            width:"100%",maxWidth:"420px"
          }}>
            <div style={{
              backgroundColor:"rgba(255,255,255,0.04)",
              backdropFilter:"blur(24px)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"24px",
              padding:"40px",
              boxShadow:"0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
            }}>
              <h2 style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontSize:"26px",color:"white",fontWeight:400,marginBottom:"6px",letterSpacing:"0.01em"}}>
                Comenzar mi configuración
              </h2>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:"13px",marginBottom:"28px",lineHeight:1.6}}>
                Al final, tu concepto llega directo a Mariangel.
              </p>
              <LeadForm onSubmit={(data) => { setLead(data); setPaso("lote"); }} />
            </div>
          </div>

          {/* Stats */}
          <div style={{
            animation: mounted ? "fadeUp 1s ease 1.2s both" : "none",
            display:"flex",gap:"56px",marginTop:"56px",flexWrap:"wrap",justifyContent:"center"
          }}>
            {[{n:"8",l:"lotes disponibles"},{n:"155 mzs",l:"parque natural"},{n:"70%",l:"reserva forestal"}].map(({n,l}) => (
              <div key={l} className="stat-item" style={{textAlign:"center"}}>
                <p className="stat-num" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontSize:"36px",color:"white",fontWeight:300,lineHeight:1,transition:"color 0.3s"}}>{n}</p>
                <p style={{color:"rgba(255,255,255,0.35)",fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",marginTop:"6px"}}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{position:"fixed",bottom:"32px",left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",opacity:scrollY > 50 ? 0 : 0.4,transition:"opacity 0.5s"}}>
          <span style={{color:"white",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase"}}>Scroll</span>
          <div style={{width:"1px",height:"40px",background:"linear-gradient(to bottom, white, transparent)",animation:"float 2s ease-in-out infinite"}} />
        </div>
      </div>
    );
  }

  if (paso === "lote") {
    return (
      <div style={{minHeight:"100vh",backgroundColor:"#F5F0E8",paddingBottom:"120px"}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
          @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
          @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
          .zona-btn:hover { background:#2C3B1F !important; color:white !important; border-color:transparent !important; }
          .zona-btn { transition: all 0.25s ease !important; }
          .continuar-btn:hover { background:#3D5229 !important; transform:translateY(-2px); box-shadow:0 12px 40px rgba(44,59,31,0.4) !important; }
          .continuar-btn { transition: all 0.3s ease !important; }
        `}</style>

        <div style={{position:"relative",backgroundImage:"url('/foto-aerea.jpg')",backgroundSize:"cover",backgroundPosition:"center",paddingBottom:"60px",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(13,17,10,0.7) 0%, rgba(13,17,10,0.6) 60%, rgba(245,240,232,1) 100%)"}} />
          <div style={{position:"relative",zIndex:1}}>
            <div style={{padding:"24px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <img src="/logo-isotipo.png" alt="LDB" style={{height:"36px",objectFit:"contain"}} />
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                {["Lote","Casa","Concepto"].map((s,i) => (
                  <div key={s} style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <div style={{width:"24px",height:"24px",borderRadius:"50%",backgroundColor:i===0?"#8A9E6D":"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:"11px",color:i===0?"#1A1F14":"rgba(255,255,255,0.5)",fontWeight:600}}>{i+1}</span>
                    </div>
                    <span style={{fontSize:"12px",color:i===0?"white":"rgba(255,255,255,0.35)",letterSpacing:"0.05em"}}>{s}</span>
                    {i<2 && <span style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",margin:"0 4px"}}>→</span>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:"20px 32px 0",maxWidth:"900px",margin:"0 auto",animation:"fadeUp 0.8s ease both"}}>
              <p style={{color:"#8A9E6D",fontSize:"11px",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:"12px"}}>Paso 1 de 3</p>
              <h2 style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontSize:"clamp(32px,5vw,52px)",color:"white",fontWeight:300,marginBottom:"12px",lineHeight:1.1}}>
                Hola, {lead?.nombre.split(" ")[0]}.<br/>
                <em>¿En cuál lote imaginas tu casa?</em>
              </h2>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:"15px",fontWeight:300}}>Cada lote es distinto. La pendiente, los árboles, las vistas — todo forma parte de tu casa.</p>
            </div>
          </div>
        </div>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"32px 16px"}}>
          <div style={{display:"flex",gap:"8px",marginBottom:"32px",flexWrap:"wrap"}}>
            {zonas.map((zona) => (
              <button key={zona} className="zona-btn" onClick={() => setZonaFiltro(zona)}
                style={{padding:"8px 20px",borderRadius:"20px",fontSize:"13px",fontWeight:500,cursor:"pointer",
                  border:zonaFiltro===zona?"none":"1px solid #C8BEA8",
                  backgroundColor:zonaFiltro===zona?"#2C3B1F":"white",
                  color:zonaFiltro===zona?"white":"#1A1F14"}}>
                {zona}
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"20px"}}>
            {lotesFiltrados.map((lote, i) => (
              <div key={lote.id} style={{animation:`fadeUp 0.6s ease ${i * 80}ms both`}}>
                <LoteCard lote={lote as Lote} seleccionado={loteSeleccionado?.id===lote.id} onSelect={(l) => setLoteSeleccionado(l)} />
              </div>
            ))}
          </div>
        </div>

        {loteSeleccionado && (
          <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,animation:"slideUp 0.4s ease both"}}>
            <div style={{
              backgroundColor:"rgba(13,17,10,0.92)",backdropFilter:"blur(20px)",
              borderTop:"1px solid rgba(255,255,255,0.08)",
              padding:"20px 32px",
              boxShadow:"0 -20px 60px rgba(0,0,0,0.3)"
            }}>
              <div style={{maxWidth:"1100px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                  <div style={{width:"44px",height:"44px",backgroundColor:"#8A9E6D",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#1A1F14",fontSize:"18px",flexShrink:0}}>✓</div>
                  <div>
                    <p style={{fontWeight:600,color:"white",fontSize:"16px"}}>{loteSeleccionado.nombre}</p>
                    <p style={{fontSize:"13px",color:"rgba(255,255,255,0.45)"}}>{loteSeleccionado.area_m2} m² · {loteSeleccionado.topo_tipo} · desde ${loteSeleccionado.precio_total_usd.toLocaleString()}</p>
                  </div>
                </div>
                <button className="continuar-btn" onClick={() => setPaso("configurador")}
                  style={{backgroundColor:"#8A9E6D",color:"#1A1F14",padding:"14px 36px",borderRadius:"14px",fontWeight:700,cursor:"pointer",border:"none",fontSize:"15px",whiteSpace:"nowrap",letterSpacing:"0.02em"}}>
                  Diseñar mi casa →
                </button>
              </div>
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
  const [focused, setFocused] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(form as Lead);
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    width:"100%",
    backgroundColor: focused === name ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)",
    border: focused === name ? "1px solid rgba(138,158,109,0.5)" : "1px solid rgba(255,255,255,0.1)",
    borderRadius:"12px",padding:"14px 16px",color:"white",fontSize:"14px",
    outline:"none",boxSizing:"border-box",marginBottom:"12px",
    transition:"all 0.25s ease",fontWeight:300,letterSpacing:"0.02em"
  });

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" required placeholder="Nombre completo" value={form.nombre}
        onChange={(e) => setForm({...form,nombre:e.target.value})}
        onFocus={() => setFocused("nombre")} onBlur={() => setFocused("")}
        style={inputStyle("nombre")} />
      <input type="email" required placeholder="Correo electrónico" value={form.email}
        onChange={(e) => setForm({...form,email:e.target.value})}
        onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
        style={inputStyle("email")} />
      <input type="tel" required placeholder="Teléfono / WhatsApp (+502)" value={form.telefono}
        onChange={(e) => setForm({...form,telefono:e.target.value})}
        onFocus={() => setFocused("tel")} onBlur={() => setFocused("")}
        style={inputStyle("tel")} />
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"24px"}}>
        <input type="checkbox" id="tiene_lote" checked={form.tiene_lote}
          onChange={(e) => setForm({...form,tiene_lote:e.target.checked})}
          style={{width:"16px",height:"16px",accentColor:"#8A9E6D",cursor:"pointer"}} />
        <label htmlFor="tiene_lote" style={{color:"rgba(255,255,255,0.4)",fontSize:"13px",cursor:"pointer",fontWeight:300}}>Ya tengo un lote en mente</label>
      </div>
      <button type="submit" disabled={loading} className="btn-primary"
        style={{width:"100%",backgroundColor:"#8A9E6D",color:"#1A1F14",fontWeight:700,padding:"16px",borderRadius:"14px",border:"none",cursor:"pointer",fontSize:"15px",letterSpacing:"0.04em",boxShadow:"0 8px 32px rgba(138,158,109,0.25)"}}>
        {loading ? (
          <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
            <span style={{width:"16px",height:"16px",border:"2px solid rgba(26,31,20,0.3)",borderTop:"2px solid #1A1F14",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}} />
            Iniciando...
          </span>
        ) : "Tu casa ideal, a un clic →"}
      </button>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </form>
  );
}

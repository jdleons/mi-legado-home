"use client";
import { useState, useEffect, useRef } from "react";
import LoteCard from "./components/LoteCard";
import ConfiguradorForm from "./components/ConfiguradorForm";
import ResumenFinal from "./components/ResumenFinal";
import { Lote, Lead, ConfiguracionCasa } from "./types";
import lotesData from "./data/lotes.json";

type Paso = "bienvenida" | "lote" | "configurador" | "resumen";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealDiv({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::placeholder { color: rgba(255,255,255,0.35) !important; }
  
  @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.1)} }

  .btn-primary:hover { transform:translateY(-2px) !important; box-shadow:0 20px 60px rgba(138,158,109,0.4) !important; }
  .btn-primary { transition: all 0.3s ease !important; }
  .zona-btn:hover { background:#2C3B1F !important; color:white !important; border-color:transparent !important; }
  .zona-btn { transition: all 0.25s ease !important; }
  .continuar-btn:hover { transform:translateY(-2px) !important; box-shadow:0 12px 40px rgba(138,158,109,0.4) !important; }
  .continuar-btn { transition: all 0.3s ease !important; }
  .stat-item:hover .stat-num { color:#8A9E6D !important; }
  .stat-num { transition: color 0.3s !important; }
  input:focus { border-color:rgba(138,158,109,0.6) !important; background:rgba(255,255,255,0.1) !important; }

  /* RESPONSIVE HERO — dos columnas en desktop */
  .hero-layout {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 80px;
    align-items: center;
    min-height: 100vh;
    padding: 120px 80px 80px;
    max-width: 1400px;
    margin: 0 auto;
  }
  .hero-left { text-align: left; }
  .hero-stats { justify-content: flex-start !important; }

  @media (max-width: 900px) {
    .hero-layout {
      grid-template-columns: 1fr;
      padding: 72px 20px 32px;
      gap: 24px;
      min-height: auto;
    }
    .hero-left { text-align: center; }
    .hero-stats { display: none !important; }
    .hero-eyebrow { justify-content: center !important; }
  }

  /* RESPONSIVE LOTES */
  .lotes-header-content {
    padding: 24px 80px 0;
    max-width: 1400px;
    margin: 0 auto;
  }
  .lotes-grid-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px 80px;
  }
  @media (max-width: 900px) {
    .lotes-header-content { padding: 20px 20px 0; }
    .lotes-grid-container { padding: 24px 16px; }
    .lotes-header-nav { display:none !important; }
    .bottom-bar-inner { flex-direction: column !important; gap: 12px !important; }
    .bottom-bar-inner button { width: 100% !important; }
  }

  /* RESPONSIVE STEPPER */
  @media (max-width: 600px) {
    .stepper-label { display: none !important; }
  }

  /* MOBILE HERO FIXES */
  @media (max-width: 900px) {
    .hero-right { width: 100%; }
    .hero-left h1 { font-size: clamp(36px, 9vw, 56px) !important; }
    .eyebrow-line { display: none !important; }
    .hero-eyebrow { justify-content: center; }
    .scroll-indicator { display: none !important; }
  }
  @media (max-width: 480px) {
    .hero-stats { gap: 24px !important; }
    .hero-stats .stat-num { font-size: 28px !important; }
  }
`;

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

  // HERO
  if (paso === "bienvenida") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0D110A", overflow: "hidden" }}>
        <style>{GLOBAL_STYLES}</style>

        {/* BG parallax */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/hero-casa.png')",
            backgroundSize: "cover", backgroundPosition: "center 30%",
            filter: "brightness(0.3) saturate(0.7)",
            transform: `translateY(${scrollY * 0.25}px)`
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(13,17,10,0.3) 0%, rgba(13,17,10,0.6) 50%, rgba(13,17,10,0.95) 100%)" }} />
          {[{top:"25%",left:"8%",h:70,d:0},{top:"50%",right:"12%",h:45,d:1.5},{top:"70%",left:"30%",h:90,d:3}].map((p,i) => (
            <div key={i} style={{position:"absolute",top:p.top,left:p.left,right:(p as {right?:string}).right,width:"1px",height:`${p.h}px`,background:"linear-gradient(to bottom,transparent,rgba(138,158,109,0.3),transparent)",animation:`float ${4+i}s ease-in-out infinite ${p.d}s`}} />
          ))}
        </div>

        {/* Header */}
        <header style={{ position: "relative", zIndex: 10, padding: "20px clamp(16px, 5vw, 80px)", display: "flex", alignItems: "center", justifyContent: "space-between", animation: mounted ? "fadeIn 1s ease 0.2s both" : "none" }}>
          <img src="/logo-isotipo.png" alt="LDB" style={{ height: "44px", objectFit: "contain" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#8A9E6D", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>Visualización conceptual</span>
          </div>
        </header>

        {/* Hero — dos columnas en desktop */}
        <div className="hero-layout" style={{ position: "relative", zIndex: 10 }}>

          {/* Columna izquierda — copy */}
          <div className="hero-left">
            <div style={{ animation: mounted ? "fadeUp 0.9s ease 0.4s both" : "none" }}>
              <p className="hero-eyebrow" style={{ color: "#8A9E6D", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <span className="eyebrow-line" style={{ display: "inline-block", width: "32px", height: "1px", backgroundColor: "#8A9E6D", flexShrink: 0 }} />
                Legado del Bosque · Parque Residencial
                <span className="eyebrow-line" style={{ display: "inline-block", width: "32px", height: "1px", backgroundColor: "#8A9E6D", flexShrink: 0 }} />
              </p>
            </div>

            <div style={{ animation: mounted ? "fadeUp 0.9s ease 0.55s both" : "none" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px,8vw,80px)", color: "white", fontWeight: 300, lineHeight: 1.05, marginBottom: "6px", letterSpacing: "-0.01em" }}>
                Este entorno merece
              </h1>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(36px,8vw,80px)", fontStyle: "italic", fontWeight: 300,
                lineHeight: 1.05, marginBottom: "32px", letterSpacing: "-0.01em",
                background: "linear-gradient(135deg, #ffffff 0%, #8A9E6D 50%, #ffffff 100%)",
                backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "shimmer 5s linear infinite"
              }}>
                la casa de tus sueños.
              </h1>
            </div>

            <div style={{ animation: mounted ? "fadeUp 0.9s ease 0.7s both" : "none" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px,1.5vw,18px)", marginBottom: "clamp(24px,4vw,48px)", maxWidth: "480px", lineHeight: 1.85, fontWeight: 300, letterSpacing: "0.02em" }}>
                Hay lugares que te piden una casa a la altura.<br />Este es uno de ellos.
              </p>
            </div>

            {/* Stats */}
            <div className="hero-stats" style={{ display: "flex", gap: "40px", flexWrap: "wrap", animation: mounted ? "fadeUp 0.9s ease 0.85s both" : "none" }}>
              {[{ n: "8", l: "lotes disponibles" }, { n: "155 mzs", l: "parque natural" }, { n: "70%", l: "reserva forestal" }].map(({ n, l }) => (
                <div key={l} className="stat-item" style={{ textAlign: "left" }}>
                  <p className="stat-num" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "34px", color: "white", fontWeight: 300, lineHeight: 1 }}>{n}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "6px" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha — formulario */}
          <div className="hero-right" style={{ animation: mounted ? "fadeUp 0.9s ease 0.7s both" : "none" }}>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px 20px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
            }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 5vw, 28px)", color: "white", fontWeight: 400, marginBottom: "8px", letterSpacing: "0.01em" }}>
                Comenzar mi configuración
              </h2>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", marginBottom: "32px", lineHeight: 1.7, fontWeight: 300 }}>
                Al final, tu concepto llega directo a Jennifer.
              </p>
              <LeadForm onSubmit={(data) => { setLead(data); setPaso("lote"); window.scrollTo({top:0,behavior:"instant"}); }} />
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: scrollY > 80 ? 0 : 0.35, transition: "opacity 0.6s", pointerEvents: "none" }}>
          <span style={{ color: "white", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, white, transparent)", animation: "float 2s ease-in-out infinite" }} />
        </div>
      </div>
    );
  }

  // LOTES
  if (paso === "lote") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8", paddingBottom: "120px" }}>
        <style>{GLOBAL_STYLES}</style>

        {/* Hero lotes */}
        <div style={{ position: "relative", backgroundImage: "url('/foto-aerea.jpg')", backgroundSize: "cover", backgroundPosition: "center", paddingBottom: "64px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,17,10,0.75) 0%, rgba(13,17,10,0.55) 50%, rgba(245,240,232,1) 100%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ padding: "24px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <img src="/logo-isotipo.png" alt="LDB" style={{ height: "36px", objectFit: "contain" }} />
              <Stepper active={0} />
            </div>
            <div className="lotes-header-content">
              <p style={{ color: "#8A9E6D", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "14px", animation: "fadeUp 0.7s ease both" }}>Paso 1 de 3</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px,4.5vw,56px)", color: "white", fontWeight: 300, marginBottom: "14px", lineHeight: 1.1, animation: "fadeUp 0.7s ease 0.1s both" }}>
                Hola, {lead?.nombre.split(" ")[0]}.<br /><em>¿En cuál lote imaginas tu casa?</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", fontWeight: 300, animation: "fadeUp 0.7s ease 0.2s both" }}>Cada lote es distinto. La pendiente, los árboles, las vistas — todo forma parte de tu casa.</p>
            </div>
          </div>
        </div>

        <div className="lotes-grid-container">
          <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
            {zonas.map((zona) => (
              <button key={zona} className="zona-btn" onClick={() => setZonaFiltro(zona)}
                style={{ padding: "8px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: 500, cursor: "pointer", border: zonaFiltro === zona ? "none" : "1px solid #C8BEA8", backgroundColor: zonaFiltro === zona ? "#2C3B1F" : "white", color: zonaFiltro === zona ? "white" : "#1A1F14" }}>
                {zona}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {lotesFiltrados.map((lote, i) => (
              <div key={lote.id} style={{ animation: `fadeUp 0.6s ease ${i * 70}ms both` }}>
                <LoteCard lote={lote as Lote} seleccionado={loteSeleccionado?.id === lote.id} onSelect={(l) => setLoteSeleccionado(l)} />
              </div>
            ))}
          </div>
        </div>

        {loteSeleccionado && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, animation: "slideUp 0.4s ease both" }}>
            <div style={{ backgroundColor: "rgba(13,17,10,0.94)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "18px 80px", boxShadow: "0 -20px 60px rgba(0,0,0,0.3)" }}>
              <div className="bottom-bar-inner" style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", backgroundColor: "#8A9E6D", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1F14", fontSize: "16px", flexShrink: 0 }}>✓</div>
                  <div>
                    <p style={{ fontWeight: 600, color: "white", fontSize: "15px" }}>{loteSeleccionado.nombre}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{loteSeleccionado.area_m2} m² · {loteSeleccionado.topo_tipo} · {loteSeleccionado.zona}</p>
                  </div>
                </div>
                <button className="continuar-btn" onClick={() => { setPaso("configurador"); window.scrollTo({top:0,behavior:"instant"}); }}
                  style={{ backgroundColor: "#8A9E6D", color: "#1A1F14", padding: "14px 40px", borderRadius: "14px", fontWeight: 700, cursor: "pointer", border: "none", fontSize: "15px", whiteSpace: "nowrap", letterSpacing: "0.03em" }}>
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
    return <ConfiguradorForm lote={loteSeleccionado} lead={lead!} onComplete={(config) => { setConfiguracion(config); setPaso("resumen"); window.scrollTo({top:0,behavior:"instant"}); }} onBack={() => { setPaso("lote"); window.scrollTo({top:0,behavior:"instant"}); }} />;
  }

  if (paso === "resumen" && loteSeleccionado && configuracion && lead) {
    return <ResumenFinal lote={loteSeleccionado} configuracion={configuracion} lead={lead} onReset={() => { setPaso("bienvenida"); setLoteSeleccionado(null); setConfiguracion(null); window.scrollTo({top:0,behavior:"instant"}); }} />;
  }

  return null;
}

// Stepper component
function Stepper({ active }: { active: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {["Lote", "Casa", "Concepto"].map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: i === active ? "#8A9E6D" : i < active ? "rgba(138,158,109,0.4)" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", flexShrink: 0 }}>
            <span style={{ fontSize: "10px", color: i === active ? "#1A1F14" : i < active ? "#8A9E6D" : "rgba(255,255,255,0.4)", fontWeight: 600 }}>{i < active ? "✓" : i + 1}</span>
          </div>
          <span className="stepper-label" style={{ fontSize: "11px", color: i === active ? "white" : "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>{s}</span>
          {i < 2 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px", margin: "0 2px" }}>→</span>}
        </div>
      ))}
    </div>
  );
}

function LeadForm({ onSubmit }: { onSubmit: (data: Lead) => void }) {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", tiene_lote: false });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    onSubmit(form as Lead);
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%", backgroundColor: focused === name ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)",
    border: focused === name ? "1px solid rgba(138,158,109,0.5)" : "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px", padding: "13px 14px", color: "white", fontSize: "14px",
    outline: "none", boxSizing: "border-box", marginBottom: "10px",
    transition: "all 0.25s ease", fontWeight: 300, letterSpacing: "0.02em"
  });

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" required placeholder="Nombre completo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} onFocus={() => setFocused("nombre")} onBlur={() => setFocused("")} style={inputStyle("nombre")} />
      <input type="email" required placeholder="Correo electrónico" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onFocus={() => setFocused("email")} onBlur={() => setFocused("")} style={inputStyle("email")} />
      <input type="tel" required placeholder="Teléfono / WhatsApp (+502)" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} onFocus={() => setFocused("tel")} onBlur={() => setFocused("")} style={inputStyle("tel")} />
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <input type="checkbox" id="tiene_lote" checked={form.tiene_lote} onChange={(e) => setForm({ ...form, tiene_lote: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: "#8A9E6D", cursor: "pointer" }} />
        <label htmlFor="tiene_lote" style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", cursor: "pointer", fontWeight: 300 }}>Ya tengo un lote en mente</label>
      </div>
      <button type="submit" disabled={loading} className="btn-primary"
        style={{ width: "100%", backgroundColor: "#8A9E6D", color: "#1A1F14", fontWeight: 700, padding: "14px", borderRadius: "14px", border: "none", cursor: "pointer", fontSize: "15px", letterSpacing: "0.04em", boxShadow: "0 8px 32px rgba(138,158,109,0.25)" }}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ width: "16px", height: "16px", border: "2px solid rgba(26,31,20,0.3)", borderTop: "2px solid #1A1F14", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
            Iniciando...
          </span>
        ) : "Tu casa ideal, a un clic →"}
      </button>
    </form>
  );
}

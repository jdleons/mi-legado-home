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
  const [generando, setGenerando] = useState(false);
  const [renderUrl, setRenderUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const normativa = normativaData as typeof normativaData;

  const prompt = generarPrompt(
    configuracion, lote,
    normativa.materiales_exteriores as Array<{id:string;prompt_keyword:string}>,
    normativa.estilos_permitidos as Array<{id:string;prompt_descriptor:string}>,
    normativa.topo_descriptores,
    normativa.relacion_bosque as Array<{id:string;prompt_keyword:string}>,
    normativa.tipos_deck as Array<{id:string;prompt_keyword:string}>
  );

  const copiarPrompt = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setPromptCopiado(true);
      setTimeout(() => setPromptCopiado(false), 2000);
    });
  };

  const generarRender = async () => {
    setGenerando(true);
    setRenderError(null);
    setRenderUrl(null);
    try {
      const res = await fetch("/api/generate-render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generando render");
      setRenderUrl(data.url);
    } catch (err: unknown) {
      setRenderError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGenerando(false);
    }
  };

  const nombreEstilo = normativa.estilos_permitidos.find((e) => e.id===configuracion.estilo)?.nombre||"";
  const nombreMateriales = configuracion.materiales.map((m) => normativa.materiales_exteriores.find((mat) => mat.id===m)?.nombre).filter(Boolean).join(", ");
  const nombreDeck = normativa.tipos_deck.find((d) => d.id===configuracion.deck_tipo)?.nombre||"";
  const nombreBosque = normativa.relacion_bosque.find((r) => r.id===configuracion.relacion_bosque)?.nombre||"";

  return (
    <div style={{minHeight:"100vh",backgroundColor:"#F5F0E8"}}>
      <header style={{backgroundColor:"#2C3B1F",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"18px",color:"white"}}>Mi Legado</span>
        <span style={{color:"#8A9E6D",fontSize:"12px",border:"1px solid rgba(138,158,109,0.3)",padding:"4px 12px",borderRadius:"20px"}}>Visualización conceptual</span>
      </header>

      <div style={{maxWidth:"680px",margin:"0 auto",padding:"32px 16px"}}>
        <p style={{color:"#556B2F",fontSize:"11px",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"8px"}}>Paso 3 de 3 · Tu concepto</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"32px",color:"#1A1F14",marginBottom:"4px"}}>
          {lead.nombre.split(" ")[0]}, aquí está tu visión
        </h2>
        <p style={{color:"#6B6B63",fontSize:"14px",marginBottom:"24px"}}>Resumen de tu casa conceptual en {lote.nombre}</p>

        {/* Render con IA */}
        <div style={{backgroundColor:"white",border:"1px solid #E8DFC8",borderRadius:"16px",overflow:"hidden",marginBottom:"16px"}}>
          <div style={{padding:"24px 24px 0"}}>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:"20px",color:"#1A1F14",marginBottom:"4px"}}>Render conceptual con IA</h3>
            <p style={{fontSize:"13px",color:"#6B6B63",marginBottom:"16px"}}>Genera una visualización arquitectónica de tu casa directamente aquí.</p>
          </div>
          {!renderUrl && !generando && (
            <div style={{padding:"0 24px 24px"}}>
              <button onClick={generarRender}
                style={{width:"100%",padding:"14px",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#2C3B1F 0%,#3D5229 100%)",color:"white",fontWeight:600,cursor:"pointer",fontSize:"15px",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                <span style={{fontSize:"18px"}}>✨</span> Generar render con DALL·E 3
              </button>
              <p style={{fontSize:"11px",color:"#9A9A93",textAlign:"center",marginTop:"8px"}}>Tarda ~20 segundos · Una imagen por sesión</p>
            </div>
          )}
          {generando && (
            <div style={{padding:"40px 24px",textAlign:"center"}}>
              <div style={{width:"48px",height:"48px",border:"3px solid #E8DFC8",borderTop:"3px solid #2C3B1F",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite"}}/>
              <p style={{color:"#2C3B1F",fontWeight:500,fontSize:"14px"}}>Generando tu render…</p>
              <p style={{color:"#6B6B63",fontSize:"12px",marginTop:"4px"}}>DALL·E 3 está visualizando tu casa</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          {renderError && (
            <div style={{padding:"0 24px 24px"}}>
              <div style={{backgroundColor:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"10px",padding:"12px 16px",marginBottom:"12px"}}>
                <p style={{color:"#DC2626",fontSize:"13px"}}>⚠ {renderError}</p>
              </div>
              <button onClick={generarRender}
                style={{width:"100%",padding:"12px",borderRadius:"10px",border:"1px solid #2C3B1F",backgroundColor:"white",color:"#2C3B1F",fontWeight:500,cursor:"pointer",fontSize:"14px"}}>
                Intentar de nuevo
              </button>
            </div>
          )}
          {renderUrl && (
            <div style={{padding:"0 24px 24px"}}>
              <div style={{borderRadius:"10px",overflow:"hidden",marginBottom:"12px",border:"1px solid #E8DFC8"}}>
                <img src={renderUrl} alt="Render conceptual" style={{width:"100%",display:"block"}}/>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <a href={renderUrl} download="mi-legado-render.jpg" target="_blank" rel="noopener noreferrer"
                  style={{flex:1,padding:"10px",borderRadius:"8px",backgroundColor:"#2C3B1F",color:"white",fontWeight:500,textAlign:"center",textDecoration:"none",fontSize:"13px"}}>
                  ⬇ Descargar imagen
                </a>
                <button onClick={generarRender}
                  style={{flex:1,padding:"10px",borderRadius:"8px",border:"1px solid #2C3B1F",backgroundColor:"white",color:"#2C3B1F",fontWeight:500,cursor:"pointer",fontSize:"13px"}}>
                  ↺ Regenerar
                </button>
              </div>
              <p style={{fontSize:"11px",color:"#9A9A93",textAlign:"center",marginTop:"8px"}}>Imagen conceptual generada por IA · No representa el diseño final</p>
            </div>
          )}
        </div>

        {/* Datos del lote */}
        <div style={{backgroundColor:"white",border:"1px solid #E8DFC8",borderRadius:"16px",overflow:"hidden",marginBottom:"16px"}}>
          <div style={{backgroundColor:"#2C3B1F",padding:"24px"}}>
            <p style={{color:"#8A9E6D",fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"4px"}}>{lote.zona}</p>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:"24px",color:"white",fontWeight:600,marginBottom:"4px"}}>{lote.nombre}</h3>
            <p style={{color:"#8A9E6D",fontSize:"14px"}}>{nombreEstilo}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:"1px solid #E8DFC8"}}>
            {[{n:configuracion.area_m2,l:"m² construidos"},{n:configuracion.niveles,l:`nivel${configuracion.niveles>1?"es":""}`},{n:configuracion.habitaciones,l:"habitaciones"}].map(({n,l})=>(
              <div key={l} style={{padding:"20px",textAlign:"center",borderRight:"1px solid #E8DFC8"}}>
                <p style={{fontFamily:"Georgia,serif",fontSize:"28px",color:"#1A1F14"}}>{n}</p>
                <p style={{fontSize:"12px",color:"#6B6B63"}}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{padding:"24px"}}>
            {[
              {l:"Lote",v:`${lote.area_m2} m² · ${lote.topo_tipo}`},
              {l:"Topografía",v:`${lote.dif_nivel_m}m de desnivel`},
              {l:"Materiales",v:nombreMateriales},
              {l:"Deck / terraza",v:nombreDeck},
              {l:"Relación bosque",v:nombreBosque},
              {l:"Vistas",v:configuracion.orientacion_vistas},
              {l:"Parqueos",v:`${configuracion.parqueos} cubierto${configuracion.parqueos>1?"s":""}`},
            ].map(({l,v})=>(
              <div key={l} style={{display:"flex",gap:"12px",fontSize:"14px",paddingBottom:"10px",borderBottom:"1px solid #F5F0E8"}}>
                <span style={{color:"#6B6B63",minWidth:"120px",flexShrink:0}}>{l}</span>
                <span style={{color:"#1A1F14",fontWeight:500,textTransform:"capitalize"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div style={{backgroundColor:"white",border:"1px solid #E8DFC8",borderRadius:"16px",padding:"24px",marginBottom:"16px"}}>
          <h3 style={{fontFamily:"Georgia,serif",fontSize:"20px",color:"#1A1F14",marginBottom:"4px"}}>Prompt para otros generadores</h3>
          <p style={{fontSize:"13px",color:"#6B6B63",marginBottom:"16px"}}>También puedes usar este texto en Midjourney, Gemini o ChatGPT.</p>
          <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"}}>
            <a href={`https://chat.openai.com/?q=${encodeURIComponent("Generate an architectural render:\n\n"+prompt)}`}
              target="_blank" rel="noopener noreferrer"
              style={{fontSize:"12px",backgroundColor:"#F5F0E8",border:"1px solid #E8DFC8",color:"#1A1F14",padding:"6px 14px",borderRadius:"8px",textDecoration:"none"}}>
              Abrir en ChatGPT ↗
            </a>
            <a href={`https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`}
              target="_blank" rel="noopener noreferrer"
              style={{fontSize:"12px",backgroundColor:"#F5F0E8",border:"1px solid #E8DFC8",color:"#1A1F14",padding:"6px 14px",borderRadius:"8px",textDecoration:"none"}}>
              Abrir en Gemini ↗
            </a>
          </div>
          <div style={{backgroundColor:"#1A1F14",borderRadius:"10px",padding:"16px",fontFamily:"monospace",fontSize:"11px",color:"#86efac",lineHeight:1.8,whiteSpace:"pre-wrap",maxHeight:"200px",overflow:"auto",marginBottom:"16px"}}>
            {prompt}
          </div>
          <button onClick={copiarPrompt}
            style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",backgroundColor:promptCopiado?"#EAF3DE":"#2C3B1F",color:promptCopiado?"#3B6D11":"white",fontWeight:500,cursor:"pointer",fontSize:"14px",transition:"all 0.2s"}}>
            {promptCopiado?"✓ Prompt copiado al portapapeles":"Copiar prompt completo"}
          </button>
        </div>

        <div style={{backgroundColor:"#F5F0E8",border:"1px solid #B5A894",borderRadius:"12px",padding:"16px",marginBottom:"16px"}}>
          <p style={{fontSize:"12px",fontWeight:500,color:"#1A1F14",marginBottom:"4px"}}>Nota importante</p>
          <p style={{fontSize:"12px",color:"#6B6B63",lineHeight:1.6}}>{normativa.disclaimer}</p>
        </div>

        <div style={{backgroundColor:"#2C3B1F",borderRadius:"16px",padding:"32px",textAlign:"center"}}>
          <p style={{fontFamily:"Georgia,serif",fontSize:"22px",color:"white",marginBottom:"8px"}}>¿Listo para dar el siguiente paso?</p>
          <p style={{color:"#8A9E6D",fontSize:"14px",marginBottom:"24px"}}>Tu asesor de Legado del Bosque puede mostrarte el lote en persona y conectarte con el equipo de arquitectura.</p>
          <a href="https://wa.me/50255267809?text=Hola%2C%20generé%20mi%20concepto%20en%20Mi%20Legado%20y%20quisiera%20agendar%20una%20visita."
            target="_blank" rel="noopener noreferrer"
            style={{display:"inline-block",backgroundColor:"white",color:"#2C3B1F",fontWeight:600,padding:"12px 32px",borderRadius:"12px",textDecoration:"none",fontSize:"14px"}}>
            Agendar visita con mi asesor →
          </a>
          <p style={{color:"rgba(138,158,109,0.6)",fontSize:"12px",marginTop:"12px"}}>Mariangel Ruiz · mruiz@legado.gt</p>
        </div>

        <button onClick={onReset}
          style={{width:"100%",marginTop:"16px",padding:"12px",fontSize:"14px",color:"#6B6B63",background:"none",border:"none",cursor:"pointer"}}>
          ← Comenzar una nueva configuración
        </button>
      </div>
    </div>
  );
}

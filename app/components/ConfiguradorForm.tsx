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
    lote_id: lote.id, area_m2: 250, niveles: 2, habitaciones: 3,
    estilo: "contemporaneo-bosque", materiales: ["concreto-expuesto","madera-natural"],
    deck_tipo: "voladizo-bosque", parqueos: 2, relacion_bosque: "visual",
    orientacion_vistas: "bosque", tiene_estudio: false, tiene_visitas: false, tiene_servicio: true,
  });

  const validacion: ValidacionResultado = validarConstruccion(config, lote);
  const huellaEstimada = Math.round(config.area_m2 / config.niveles);
  const toggleMaterial = (id: string) => {
    setConfig((prev) => ({ ...prev, materiales: prev.materiales.includes(id) ? prev.materiales.filter((m) => m !== id) : [...prev.materiales, id] }));
  };
  const materialesPermitidos = normativa.materiales_exteriores.filter((m) => m.permitido);

  const card = { background:"white", border:"1px solid #E8DFC8", borderRadius:"16px", padding:"24px", marginBottom:"16px" };
  const btnSelect = (sel:boolean) => ({ padding:"10px", borderRadius:"10px", border: sel?"none":"1px solid #B5A894", backgroundColor: sel?"#2C3B1F":"white", color: sel?"white":"#1A1F14", cursor:"pointer", fontSize:"13px", fontWeight:500 as const, transition:"all 0.2s" });
  const sectionTitle = { fontFamily:"Georgia,serif", fontSize:"18px", color:"#1A1F14", marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" };

  return (
    <div style={{minHeight:"100vh",backgroundColor:"#F5F0E8",paddingBottom:"100px"}}>
      <header style={{backgroundColor:"#2C3B1F",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <button onClick={onBack} style={{color:"#8A9E6D",background:"none",border:"none",cursor:"pointer",fontSize:"14px"}}>← Volver</button>
          <span style={{color:"rgba(255,255,255,0.3)"}}>|</span>
          <span style={{fontFamily:"Georgia,serif",fontSize:"18px",color:"white"}}>Mi Legado</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{color:"#8A9E6D",fontSize:"12px"}}>{lote.nombre}</span>
          <span style={{fontSize:"11px",padding:"3px 10px",borderRadius:"20px",backgroundColor:validacion.valido?"#EAF3DE":"#FCEBEB",color:validacion.valido?"#3B6D11":"#A32D2D"}}>
            {validacion.valido?"✓ Cumple normativa":`${validacion.errores.length} error${validacion.errores.length>1?"es":""}`}
          </span>
        </div>
      </header>

      <div style={{maxWidth:"680px",margin:"0 auto",padding:"32px 16px"}}>
        <p style={{color:"#556B2F",fontSize:"11px",fontWeight:500,textTransform:"uppercase" as const,letterSpacing:"0.1em",marginBottom:"8px"}}>Paso 2 de 3 · Configurador</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"30px",color:"#1A1F14",marginBottom:"4px"}}>Diseña tu casa</h2>
        <p style={{color:"#6B6B63",fontSize:"14px",marginBottom:"24px"}}>Cada selección se valida en tiempo real contra la normativa de Legado del Bosque.</p>

        <div style={{...card,backgroundColor:"rgba(44,59,31,0.05)",border:"1px solid rgba(44,59,31,0.2)"}}>
          <p style={{fontSize:"11px",fontWeight:500,color:"#556B2F",textTransform:"uppercase" as const,letterSpacing:"0.1em",marginBottom:"4px"}}>Lote seleccionado</p>
          <p style={{fontWeight:500,color:"#1A1F14"}}>{lote.nombre}</p>
          <p style={{fontSize:"13px",color:"#6B6B63"}}>{lote.area_m2} m² · {lote.topo_tipo} · {lote.dif_nivel_m}m desnivel</p>
          <p style={{fontSize:"12px",color:"#6B6B63",marginTop:"4px"}}>{lote.descripcion_topo}</p>
        </div>

        <div style={card}>
          <div style={sectionTitle}><span>📐</span> Dimensiones</div>
          <div style={{marginBottom:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"8px"}}>
              <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14"}}>Área construida total</label>
              <span style={{fontFamily:"Georgia,serif",fontSize:"24px",color:"#2C3B1F"}}>{config.area_m2} m²</span>
            </div>
            <input type="range" min={150} max={500} step={10} value={config.area_m2}
              onChange={(e) => setConfig({...config,area_m2:Number(e.target.value)})}
              style={{width:"100%",accentColor:"#2C3B1F"}} />
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#6B6B63",marginTop:"4px"}}>
              <span>150 m² mín.</span>
              <span style={{color:config.area_m2>450?"#BA7517":""}}>500 m² máx. (normativa LDB)</span>
            </div>
          </div>
          <div>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"12px"}}>Número de niveles</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"12px"}}>
              {[1,2,3].map((n) => (
                <button key={n} onClick={() => setConfig({...config,niveles:n as 1|2|3})} style={btnSelect(config.niveles===n)}>
                  {n} nivel{n>1?"es":""}
                </button>
              ))}
            </div>
            <div style={{padding:"10px 12px",borderRadius:"8px",fontSize:"13px",backgroundColor:huellaEstimada>325?"#FCEBEB":"#EAF3DE",color:huellaEstimada>325?"#A32D2D":"#3B6D11"}}>
              {huellaEstimada>325?"⚠️":"✓"} Huella estimada: <strong>{huellaEstimada} m²</strong>
              {huellaEstimada>325?" — excede el límite de 325 m²":" — dentro del límite normativo"}
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}><span>🛏</span> Distribución</div>
          <div style={{marginBottom:"16px"}}>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Habitaciones</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px"}}>
              {[2,3,4,5].map((n) => <button key={n} onClick={() => setConfig({...config,habitaciones:n})} style={btnSelect(config.habitaciones===n)}>{n===5?"5+":n}</button>)}
            </div>
          </div>
          <div style={{marginBottom:"16px"}}>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Parqueos</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}>
              {[1,2,3].map((n) => <button key={n} onClick={() => setConfig({...config,parqueos:n})} style={btnSelect(config.parqueos===n)}>{n} auto{n>1?"s":""}</button>)}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}>
            {[{key:"tiene_estudio",label:"Estudio"},{key:"tiene_visitas",label:"Visitas"},{key:"tiene_servicio",label:"Servicio"}].map(({key,label}) => (
              <button key={key} onClick={() => setConfig({...config,[key]:!config[key as keyof ConfiguracionCasa]})}
                style={{...btnSelect(!!config[key as keyof ConfiguracionCasa]),fontSize:"12px",textAlign:"left" as const}}>
                {config[key as keyof ConfiguracionCasa]?"✓ ":""}{label}
              </button>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}><span>🏛</span> Estilo arquitectónico</div>
          <div style={{display:"flex",flexDirection:"column" as const,gap:"8px"}}>
            {normativa.estilos_permitidos.map((estilo) => (
              <button key={estilo.id} onClick={() => setConfig({...config,estilo:estilo.id})}
                style={{...btnSelect(config.estilo===estilo.id),textAlign:"left" as const,padding:"14px"}}>
                <div style={{fontWeight:500,fontSize:"14px"}}>{estilo.nombre}</div>
                <div style={{fontSize:"12px",marginTop:"2px",color:config.estilo===estilo.id?"#8A9E6D":"#6B6B63"}}>{estilo.descripcion}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}><span>🪨</span> Materiales exteriores</div>
          <div style={{display:"flex",flexDirection:"column" as const,gap:"8px"}}>
            {materialesPermitidos.map((mat) => (
              <button key={mat.id} onClick={() => toggleMaterial(mat.id)}
                style={{display:"flex",gap:"10px",alignItems:"flex-start",padding:"12px",borderRadius:"8px",border:config.materiales.includes(mat.id)?"1px solid rgba(44,59,31,0.4)":"1px solid #B5A894",backgroundColor:config.materiales.includes(mat.id)?"rgba(44,59,31,0.08)":"white",cursor:"pointer",textAlign:"left" as const}}>
                <span style={{fontSize:"16px",marginTop:"1px"}}>{config.materiales.includes(mat.id)?"☑":"☐"}</span>
                <div>
                  <div style={{fontSize:"13px",fontWeight:500,color:"#1A1F14"}}>{mat.nombre}</div>
                  <div style={{fontSize:"12px",color:"#6B6B63",lineHeight:1.5}}>{mat.descripcion}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}><span>🌲</span> Exterior y bosque</div>
          <div style={{marginBottom:"20px"}}>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Tipo de deck / terraza</label>
            <div style={{display:"flex",flexDirection:"column" as const,gap:"8px"}}>
              {normativa.tipos_deck.map((deck) => (
                <button key={deck.id} onClick={() => setConfig({...config,deck_tipo:deck.id})}
                  style={{...btnSelect(config.deck_tipo===deck.id),textAlign:"left" as const,padding:"12px"}}>
                  <div style={{fontWeight:500,fontSize:"13px"}}>{deck.nombre}</div>
                  <div style={{fontSize:"12px",color:config.deck_tipo===deck.id?"#8A9E6D":"#6B6B63"}}>{deck.descripcion}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:"20px"}}>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Relación con el bosque</label>
            <div style={{display:"flex",flexDirection:"column" as const,gap:"8px"}}>
              {normativa.relacion_bosque.map((rel) => (
                <button key={rel.id} onClick={() => setConfig({...config,relacion_bosque:rel.id})}
                  style={{...btnSelect(config.relacion_bosque===rel.id),textAlign:"left" as const,padding:"12px"}}>
                  <div style={{fontWeight:500,fontSize:"13px"}}>{rel.nombre}</div>
                  <div style={{fontSize:"12px",color:config.relacion_bosque===rel.id?"#8A9E6D":"#6B6B63"}}>{rel.descripcion}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Orientación de vistas</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              {["Bosque","Valle","Ciudad","Mixto"].map((v) => (
                <button key={v} onClick={() => setConfig({...config,orientacion_vistas:v.toLowerCase()})} style={btnSelect(config.orientacion_vistas===v.toLowerCase())}>{v}</button>
              ))}
            </div>
          </div>
        </div>

        {(validacion.errores.length>0||validacion.advertencias.length>0||validacion.sugerencias.length>0) && (
          <div style={{display:"flex",flexDirection:"column" as const,gap:"8px",marginBottom:"16px"}}>
            {validacion.errores.map((e,i) => (
              <div key={i} style={{display:"flex",gap:"8px",padding:"12px",backgroundColor:"#FCEBEB",border:"1px solid #F7C1C1",borderRadius:"8px"}}>
                <span style={{color:"#A32D2D"}}>✖</span><p style={{fontSize:"13px",color:"#791F1F"}}>{e}</p>
              </div>
            ))}
            {validacion.advertencias.map((w,i) => (
              <div key={i} style={{display:"flex",gap:"8px",padding:"12px",backgroundColor:"#FAEEDA",border:"1px solid #FAC775",borderRadius:"8px"}}>
                <span style={{color:"#BA7517"}}>⚠</span><p style={{fontSize:"13px",color:"#633806"}}>{w}</p>
              </div>
            ))}
            {validacion.sugerencias.map((s,i) => (
              <div key={i} style={{display:"flex",gap:"8px",padding:"12px",backgroundColor:"#EAF3DE",border:"1px solid #C0DD97",borderRadius:"8px"}}>
                <span>💡</span><p style={{fontSize:"13px",color:"#3B6D11"}}>{s}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,backgroundColor:"white",borderTop:"1px solid #E8DFC8",padding:"16px"}}>
        <div style={{maxWidth:"680px",margin:"0 auto"}}>
          <button onClick={() => onComplete(config)} disabled={!validacion.valido}
            style={{width:"100%",backgroundColor:validacion.valido?"#2C3B1F":"#B5A894",color:"white",padding:"14px",borderRadius:"12px",fontWeight:500,cursor:validacion.valido?"pointer":"not-allowed",border:"none",fontSize:"15px"}}>
            {validacion.valido?"Generar mi concepto →":"Corrige los errores para continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

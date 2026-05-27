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

const ESTILOS_IMAGENES: Record<string, string> = {
  "contemporaneo-bosque": "/estilo-contemporaneo.jpg",
  "organico-natural": "/estilo-organico.jpg",
  "industrial-natural": "/estilo-industrial.jpg",
  "minimalista-calido": "/estilo-minimalista.jpg",
};

const MATERIALES_IMAGENES: Record<string, string> = {
  "concreto-expuesto": "/mat-concreto.jpg",
  "madera-natural": "/mat-madera.jpg",
  "piedra-volcanica": "/mat-piedra.jpg",
  "vidrio-negro": "/mat-vidrio.jpg",
  "acero-corten": "/mat-acero.jpg",
  "porcelana-gran-formato": "/mat-porcelana.jpg",
  "pintura-acento": "/mat-concreto.jpg",
};

const DECK_IMAGENES: Record<string, string> = {
  "voladizo-bosque": "/deck-voladizo.jpg",
  "nivel-jardin": "/deck-jardin.jpg",
  "semi-enterrado": "/deck-semi.jpg",
  "techo-habitable": "/deck-techo.jpg",
};

const BOSQUE_IMAGENES: Record<string, string> = {
  "integrado": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&q=80",
  "visual": "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=500&q=80",
  "protegido": "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=500&q=80",
};

export default function ConfiguradorForm({ lote, lead, onComplete, onBack }: Props) {
  const normativa = normativaData as typeof normativaData;
  const [config, setConfig] = useState<ConfiguracionCasa>({
    lote_id: lote.id, area_m2: 250, niveles: 2, habitaciones: 3,
    estilo: "contemporaneo-bosque", materiales: ["concreto-expuesto", "madera-natural"],
    deck_tipo: "voladizo-bosque", parqueos: 2, relacion_bosque: "visual",
    orientacion_vistas: "bosque", tiene_estudio: false, tiene_visitas: false, tiene_servicio: true,
  });

  const validacion: ValidacionResultado = validarConstruccion(config, lote);
  const huellaEstimada = Math.round(config.area_m2 / config.niveles);
  const toggleMaterial = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      materiales: prev.materiales.includes(id)
        ? prev.materiales.filter((m) => m !== id)
        : [...prev.materiales, id],
    }));
  };
  const materialesPermitidos = normativa.materiales_exteriores.filter((m) => m.permitido);

  return (
    <div style={{minHeight:"100vh",backgroundColor:"#F5F0E8",paddingBottom:"100px"}}>
      <header style={{backgroundColor:"#2C3B1F",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <button onClick={onBack} style={{color:"#8A9E6D",background:"none",border:"none",cursor:"pointer",fontSize:"14px"}}>← Volver</button>
          <span style={{color:"rgba(255,255,255,0.3)"}}>|</span>
          <img src="/logo-isotipo.png" alt="LDB" style={{height:"32px",objectFit:"contain"}} />
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{color:"#8A9E6D",fontSize:"12px"}}>{lote.nombre}</span>
          <span style={{fontSize:"11px",padding:"3px 10px",borderRadius:"20px",backgroundColor:validacion.valido?"#EAF3DE":"#FCEBEB",color:validacion.valido?"#3B6D11":"#A32D2D"}}>
            {validacion.valido ? "✓ Cumple normativa" : `${validacion.errores.length} error${validacion.errores.length > 1 ? "es" : ""}`}
          </span>
        </div>
      </header>

      <div style={{maxWidth:"720px",margin:"0 auto",padding:"32px 16px"}}>
        <p style={{color:"#8A9E6D",fontSize:"11px",fontWeight:500,textTransform:"uppercase" as const,letterSpacing:"0.2em",marginBottom:"12px",animation:"fadeUp 0.6s ease 0.1s both"}}>Paso 2 de 3 · Tu casa</p>
        <h2 style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontSize:"clamp(32px,5vw,48px)",color:"#1A1F14",marginBottom:"8px",fontWeight:300,lineHeight:1.1,animation:"fadeUp 0.6s ease 0.2s both"}}>Imagina cómo<br/><em>quieres vivir</em></h2>
        <p style={{color:"#6B6B63",fontSize:"15px",marginBottom:"28px",fontWeight:300,animation:"fadeUp 0.6s ease 0.3s both"}}>Define los trazos grandes de tu casa. Todo dentro de la normativa real de Legado del Bosque.</p>

        {/* Momentos de vida */}
        <div style={{backgroundColor:"#2C3B1F",borderRadius:"16px",padding:"24px",marginBottom:"24px"}}>
          <p style={{color:"#8A9E6D",fontSize:"11px",fontWeight:500,textTransform:"uppercase" as const,letterSpacing:"0.1em",marginBottom:"12px"}}>La vida que te espera</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            {[
              {icono:"☕",titulo:"Mañanas sin prisa",desc:"Café con vista al pino de siempre. El mismo que estará ahí mañana y en diez años."},
              {icono:"🌿",titulo:"Salir a correr entre árboles",desc:"Sin semáforos. Sin ruido. Solo el sonido de tus pasos y el bosque despertando."},
              {icono:"🌧️",titulo:"Tardes de lluvia con fuego",desc:"La chimenea encendida, la lluvia en el techo. Un privilegio que pocos conocen."},
              {icono:"🌙",titulo:"Noches de silencio real",desc:"Sin luces de la ciudad. Solo estrellas y el viento entre los pinos."},
            ].map(({icono,titulo,desc}) => (
              <div key={titulo} style={{backgroundColor:"rgba(255,255,255,0.06)",borderRadius:"10px",padding:"14px"}}>
                <p style={{fontSize:"20px",marginBottom:"6px"}}>{icono}</p>
                <p style={{color:"white",fontWeight:500,fontSize:"13px",marginBottom:"4px"}}>{titulo}</p>
                <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",lineHeight:1.5}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ficha lote */}
        <div style={{background:"linear-gradient(135deg,#2C3B1F,#3D5428)",borderRadius:"16px",padding:"20px",marginBottom:"24px",display:"flex",gap:"16px",alignItems:"center"}}>
          <img src="/foto-aerea.jpg" alt="Lote" style={{width:"80px",height:"80px",borderRadius:"10px",objectFit:"cover",flexShrink:0}} />
          <div>
            <p style={{fontSize:"11px",fontWeight:500,color:"#8A9E6D",textTransform:"uppercase" as const,letterSpacing:"0.1em",marginBottom:"2px"}}>{lote.zona}</p>
            <p style={{fontWeight:600,color:"white",fontSize:"17px",marginBottom:"2px"}}>{lote.nombre}</p>
            <p style={{fontSize:"13px",color:"rgba(255,255,255,0.6)"}}>{lote.area_m2} m² · {lote.topo_tipo} · {lote.dif_nivel_m}m desnivel</p>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",marginTop:"4px"}}>{lote.descripcion_topo}</p>
          </div>
        </div>

        {/* DIMENSIONES */}
        <SeccionCard titulo="¿Cuánto espacio necesitas para vivir bien?" icono="📐">
          <div style={{marginBottom:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"8px"}}>
              <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14"}}>Área construida total</label>
              <span style={{fontFamily:"Georgia,serif",fontSize:"28px",color:"#2C3B1F",fontWeight:600}}>{config.area_m2} m²</span>
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
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Número de niveles</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"12px"}}>
              {[1,2,3].map((n) => (
                <button key={n} onClick={() => setConfig({...config,niveles:n as 1|2|3})}
                  style={{padding:"12px",borderRadius:"10px",border:config.niveles===n?"none":"1px solid #B5A894",backgroundColor:config.niveles===n?"#2C3B1F":"white",color:config.niveles===n?"white":"#1A1F14",cursor:"pointer",fontSize:"13px",fontWeight:500,transition:"all 0.2s"}}>
                  {n} nivel{n>1?"es":""}
                </button>
              ))}
            </div>
            <div style={{padding:"10px 12px",borderRadius:"8px",fontSize:"13px",backgroundColor:huellaEstimada>325?"#FCEBEB":"#EAF3DE",color:huellaEstimada>325?"#A32D2D":"#3B6D11"}}>
              {huellaEstimada>325?"⚠️":"✓"} Huella estimada: <strong>{huellaEstimada} m²</strong>
              {huellaEstimada>325?" — excede el límite de 325 m²":" — dentro del límite normativo"}
            </div>
          </div>
        </SeccionCard>

        {/* DISTRIBUCIÓN */}
        <SeccionCard titulo="Distribución" icono="🛏">
          <div style={{marginBottom:"16px"}}>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Habitaciones</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px"}}>
              {[2,3,4,5].map((n) => (
                <button key={n} onClick={() => setConfig({...config,habitaciones:n})}
                  style={{padding:"12px",borderRadius:"10px",border:config.habitaciones===n?"none":"1px solid #B5A894",backgroundColor:config.habitaciones===n?"#2C3B1F":"white",color:config.habitaciones===n?"white":"#1A1F14",cursor:"pointer",fontSize:"14px",fontWeight:500,transition:"all 0.2s"}}>
                  {n===5?"5+":n}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:"16px"}}>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Parqueos</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}>
              {[1,2,3].map((n) => (
                <button key={n} onClick={() => setConfig({...config,parqueos:n})}
                  style={{padding:"12px",borderRadius:"10px",border:config.parqueos===n?"none":"1px solid #B5A894",backgroundColor:config.parqueos===n?"#2C3B1F":"white",color:config.parqueos===n?"white":"#1A1F14",cursor:"pointer",fontSize:"13px",fontWeight:500,transition:"all 0.2s"}}>
                  {n} auto{n>1?"s":""}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Espacios adicionales</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}>
              {[{key:"tiene_estudio",label:"Estudio",icon:"💻"},{key:"tiene_visitas",label:"Visitas",icon:"🛏"},{key:"tiene_servicio",label:"Servicio",icon:"🏠"}].map(({key,label,icon}) => (
                <button key={key} onClick={() => setConfig({...config,[key]:!config[key as keyof ConfiguracionCasa]})}
                  style={{padding:"12px 8px",borderRadius:"10px",border:config[key as keyof ConfiguracionCasa]?"none":"1px solid #B5A894",backgroundColor:config[key as keyof ConfiguracionCasa]?"#2C3B1F":"white",color:config[key as keyof ConfiguracionCasa]?"white":"#1A1F14",cursor:"pointer",fontSize:"12px",fontWeight:500,transition:"all 0.2s",textAlign:"center" as const}}>
                  <div style={{fontSize:"20px",marginBottom:"4px"}}>{icon}</div>
                  {config[key as keyof ConfiguracionCasa]?"✓ ":""}{label}
                </button>
              ))}
            </div>
          </div>
        </SeccionCard>

        {/* ESTILO ARQUITECTÓNICO - con imágenes */}
        <SeccionCard titulo="¿Cómo quieres sentirte en tu casa?" icono="🏛">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            {normativa.estilos_permitidos.map((estilo) => (
              <button key={estilo.id} onClick={() => setConfig({...config,estilo:estilo.id})}
                style={{borderRadius:"12px",border:config.estilo===estilo.id?"3px solid #2C3B1F":"1px solid #E8DFC8",overflow:"hidden",cursor:"pointer",textAlign:"left" as const,backgroundColor:"white",transition:"all 0.2s",boxShadow:config.estilo===estilo.id?"0 4px 16px rgba(44,59,31,0.2)":"none"}}>
                <div style={{position:"relative",height:"120px",overflow:"hidden"}}>
                  <img src={ESTILOS_IMAGENES[estilo.id]} alt={estilo.nombre}
                    style={{width:"100%",height:"100%",objectFit:"cover",filter:config.estilo===estilo.id?"brightness(1)":"brightness(0.85)"}} />
                  {config.estilo===estilo.id && (
                    <div style={{position:"absolute",top:"8px",right:"8px",backgroundColor:"#2C3B1F",color:"white",width:"24px",height:"24px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px"}}>✓</div>
                  )}
                </div>
                <div style={{padding:"10px 12px"}}>
                  <p style={{fontSize:"13px",fontWeight:600,color:"#1A1F14",marginBottom:"2px"}}>{estilo.nombre}</p>
                  <p style={{fontSize:"11px",color:"#6B6B63",lineHeight:1.4}}>{estilo.descripcion}</p>
                </div>
              </button>
            ))}
          </div>
        </SeccionCard>

        {/* MATERIALES - con imágenes */}
        <SeccionCard titulo="La piel de tu casa" icono="🪨">
          <p style={{fontSize:"12px",color:"#6B6B63",marginBottom:"14px"}}>Selecciona uno o más materiales. Solo materiales aprobados por la normativa de LDB.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            {materialesPermitidos.map((mat) => {
              const sel = config.materiales.includes(mat.id);
              return (
                <button key={mat.id} onClick={() => toggleMaterial(mat.id)}
                  style={{borderRadius:"12px",border:sel?"3px solid #2C3B1F":"1px solid #E8DFC8",overflow:"hidden",cursor:"pointer",textAlign:"left" as const,backgroundColor:"white",transition:"all 0.2s",boxShadow:sel?"0 4px 16px rgba(44,59,31,0.2)":"none"}}>
                  {MATERIALES_IMAGENES[mat.id] && (
                    <div style={{position:"relative",height:"90px",overflow:"hidden"}}>
                      <img src={MATERIALES_IMAGENES[mat.id]} alt={mat.nombre}
                        style={{width:"100%",height:"100%",objectFit:"cover",filter:sel?"brightness(1)":"brightness(0.8)"}} />
                      {sel && (
                        <div style={{position:"absolute",top:"6px",right:"6px",backgroundColor:"#2C3B1F",color:"white",width:"20px",height:"20px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px"}}>✓</div>
                      )}
                    </div>
                  )}
                  <div style={{padding:"8px 10px"}}>
                    <p style={{fontSize:"12px",fontWeight:600,color:"#1A1F14",marginBottom:"2px"}}>{mat.nombre}</p>
                    <p style={{fontSize:"10px",color:"#6B6B63",lineHeight:1.4}}>{mat.descripcion}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SeccionCard>

        {/* DECK - con imágenes */}
        <SeccionCard titulo="Deck y terraza" icono="🌿">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            {normativa.tipos_deck.map((deck) => (
              <button key={deck.id} onClick={() => setConfig({...config,deck_tipo:deck.id})}
                style={{borderRadius:"12px",border:config.deck_tipo===deck.id?"3px solid #2C3B1F":"1px solid #E8DFC8",overflow:"hidden",cursor:"pointer",textAlign:"left" as const,backgroundColor:"white",transition:"all 0.2s",boxShadow:config.deck_tipo===deck.id?"0 4px 16px rgba(44,59,31,0.2)":"none"}}>
                <div style={{position:"relative",height:"100px",overflow:"hidden"}}>
                  <img src={DECK_IMAGENES[deck.id]} alt={deck.nombre}
                    style={{width:"100%",height:"100%",objectFit:"cover",filter:config.deck_tipo===deck.id?"brightness(1)":"brightness(0.8)"}} />
                  {config.deck_tipo===deck.id && (
                    <div style={{position:"absolute",top:"6px",right:"6px",backgroundColor:"#2C3B1F",color:"white",width:"20px",height:"20px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px"}}>✓</div>
                  )}
                </div>
                <div style={{padding:"8px 10px"}}>
                  <p style={{fontSize:"12px",fontWeight:600,color:"#1A1F14",marginBottom:"2px"}}>{deck.nombre}</p>
                  <p style={{fontSize:"10px",color:"#6B6B63",lineHeight:1.4}}>{deck.descripcion}</p>
                </div>
              </button>
            ))}
          </div>
        </SeccionCard>

        {/* RELACIÓN CON EL BOSQUE - con imágenes */}
        <SeccionCard titulo="Relación con el bosque" icono="🌲">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"20px"}}>
            {normativa.relacion_bosque.map((rel) => (
              <button key={rel.id} onClick={() => setConfig({...config,relacion_bosque:rel.id})}
                style={{borderRadius:"12px",border:config.relacion_bosque===rel.id?"3px solid #2C3B1F":"1px solid #E8DFC8",overflow:"hidden",cursor:"pointer",textAlign:"left" as const,backgroundColor:"white",transition:"all 0.2s",boxShadow:config.relacion_bosque===rel.id?"0 4px 16px rgba(44,59,31,0.2)":"none"}}>
                <div style={{position:"relative",height:"80px",overflow:"hidden"}}>
                  <img src={BOSQUE_IMAGENES[rel.id]} alt={rel.nombre}
                    style={{width:"100%",height:"100%",objectFit:"cover",filter:config.relacion_bosque===rel.id?"brightness(1)":"brightness(0.8)"}} />
                  {config.relacion_bosque===rel.id && (
                    <div style={{position:"absolute",top:"4px",right:"4px",backgroundColor:"#2C3B1F",color:"white",width:"18px",height:"18px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px"}}>✓</div>
                  )}
                </div>
                <div style={{padding:"6px 8px"}}>
                  <p style={{fontSize:"11px",fontWeight:600,color:"#1A1F14",lineHeight:1.3}}>{rel.nombre}</p>
                </div>
              </button>
            ))}
          </div>

          <div>
            <label style={{fontSize:"14px",fontWeight:500,color:"#1A1F14",display:"block",marginBottom:"10px"}}>Orientación de vistas</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              {[{v:"bosque",l:"🌲 Bosque"},{v:"valle",l:"🏔 Valle"},{v:"ciudad",l:"🌆 Ciudad"},{v:"mixto",l:"🔭 Mixto"}].map(({v,l}) => (
                <button key={v} onClick={() => setConfig({...config,orientacion_vistas:v})}
                  style={{padding:"12px",borderRadius:"10px",border:config.orientacion_vistas===v?"none":"1px solid #B5A894",backgroundColor:config.orientacion_vistas===v?"#2C3B1F":"white",color:config.orientacion_vistas===v?"white":"#1A1F14",cursor:"pointer",fontSize:"13px",fontWeight:500,transition:"all 0.2s"}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </SeccionCard>

        {/* Alertas */}
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

      {/* Botón fijo */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,backgroundColor:"white",borderTop:"1px solid #E8DFC8",padding:"16px",boxShadow:"0 -4px 24px rgba(0,0,0,0.08)"}}>
        <div style={{maxWidth:"720px",margin:"0 auto"}}>
          <button onClick={() => onComplete(config)} disabled={!validacion.valido}
            style={{width:"100%",backgroundColor:validacion.valido?"#2C3B1F":"#B5A894",color:"white",padding:"16px",borderRadius:"12px",fontWeight:600,cursor:validacion.valido?"pointer":"not-allowed",border:"none",fontSize:"16px",letterSpacing:"0.02em"}}>
            {validacion.valido?"Generar mi concepto →":"Corrige los errores para continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SeccionCard({ titulo, icono, children }: { titulo: string; icono: string; children: React.ReactNode }) {
  return (
    <div style={{backgroundColor:"white",borderRadius:"16px",padding:"24px",marginBottom:"16px",border:"1px solid #E8DFC8",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px",paddingBottom:"14px",borderBottom:"1px solid #F5F0E8"}}>
        <span style={{fontSize:"22px"}}>{icono}</span>
        <h3 style={{fontFamily:"Georgia,serif",fontSize:"19px",color:"#1A1F14",fontWeight:600}}>{titulo}</h3>
      </div>
      {children}
    </div>
  );
}
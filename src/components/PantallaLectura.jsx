import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import { RefreshCw, Home, BookOpen, Fingerprint, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

const renderizadoLectura = (texto) => {
  if (!texto) return "";
  const partes = texto.split(/\(form\)(.*?)\(\/form\)/g);
  return partes.map((parte, i) => {
    if (i % 2 !== 0) {
      return (
        <span key={i} className="inline-block px-1.5 py-0.5 mx-1 bg-slate-50 border border-slate-200 rounded-md align-middle shadow-sm">
          <InlineMath math={parte.trim()} />
        </span>
      );
    }
    return <span key={i}>{parte}</span>;
  });
};

function PantallaLectura({ textosBD, alVolver }) {
  const [textosDelDia, setTextosDelDia] = useState([]);

  const refrescarTextos = () => {
    // Obtenemos las materias únicas presentes en la BD
    const materias = [...new Set(textosBD.map(t => t.materia))];
    let seleccion = [];

    materias.forEach(m => {
      // Filtramos por materia, mezclamos y tomamos estrictamente 5
      const porMateria = textosBD.filter(t => t.materia === m)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      seleccion = [...seleccion, ...porMateria];
    });

    // Ordenamos alfabéticamente por materia para el reporte final
    setTextosDelDia(seleccion.sort((a, b) => a.materia.localeCompare(b.materia)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => { refrescarTextos(); }, []);

  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] flex flex-col items-center p-4 md:p-12 font-serif">

      {/* BARRA DE NAVEGACIÓN (Colores Pumas) */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10 sticky top-4 z-30 bg-[#0f172a]/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/10">
        <button
            onClick={alVolver}
            className="flex items-center gap-2 text-white/70 hover:text-[#a88d45] transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <Home size={18} /> INICIO
        </button>

        <div className="hidden md:flex flex-col items-center">
            <p className="text-[#a88d45] font-black text-[10px] uppercase tracking-[0.3em]">Biblioteca Viktoria</p>
            <p className="text-white/40 text-[8px] font-bold tracking-tighter">COMPRENSIÓN LECTORA ÁREA 1</p>
        </div>

        <button
            onClick={refrescarTextos}
            className="flex items-center gap-2 bg-[#a88d45] text-[#0f172a] px-6 py-2.5 rounded-xl font-black text-[10px] shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
        >
          <RefreshCw size={14} /> Nuevos Temas
        </button>
      </div>

      {/* CONTENEDOR DE "HOJAS DE EXAMEN" */}
      <div className="w-full max-w-4xl space-y-20 mb-32">
        {textosDelDia.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] rounded-sm border-t-[12px] border-[#a88d45] p-10 md:p-24 min-h-[700px] relative overflow-hidden flex flex-col"
          >
            {/* MARCA DE AGUA INSTITUCIONAL */}
            <div className="absolute top-10 right-10 text-right opacity-10 select-none">
                <Bookmark size={120} className="text-[#0f172a] absolute -top-10 -right-10 rotate-12" />
                <span className="text-[40px] font-black text-[#0f172a] leading-none">UNAM</span>
            </div>

            <header className="mb-14 border-b-2 border-slate-50 pb-8 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#0f172a] text-[#a88d45] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {t.materia}
                  </span>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                    <Fingerprint size={12} /> Ref: {t.id}
                  </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-3 leading-tight tracking-tighter">
                {t.titulo}
              </h1>

              {t.subtitulo && (
                <h2 className="text-[#a88d45] font-bold uppercase tracking-[0.2em] text-xs">
                  {t.subtitulo}
                </h2>
              )}
            </header>

            <article className="text-xl md:text-2xl text-slate-700 leading-[1.9] text-justify relative z-10 flex-1 first-letter:text-6xl first-letter:font-black first-letter:text-[#0f172a] first-letter:mr-3 first-letter:float-left">
              {renderizadoLectura(t.contenido)}
            </article>

            <footer className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] relative z-10">
              <span>Viktoria Intelligence System</span>
              <span className="text-[#a88d45]/40 italic">Área 1: Físico-Matemáticas</span>
            </footer>

            {/* Efecto decorativo de página de libro */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-slate-50 to-transparent pointer-events-none"></div>
          </motion.div>
        ))}
      </div>

      {/* FOOTER FINAL */}
      <div className="pb-20 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
            Fin de la Sesión de Lectura
          </p>
      </div>

    </div>
  );
}

export default PantallaLectura;
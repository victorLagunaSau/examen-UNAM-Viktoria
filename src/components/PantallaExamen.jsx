import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath } from 'react-katex';
import { ChevronRight, ChevronLeft, Clock, SkipForward, AlertCircle, CheckCircle2 } from 'lucide-react';

function PantallaExamen({ preguntas, tiempo, alTerminar }) {
  const [index, setIndex] = useState(0);
  const [respuestas, setRespuestas] = useState({});

  const q = preguntas[index];
  const seleccionada = respuestas[index] !== undefined;

  const handleSeleccion = (optIdx) => {
    setRespuestas({ ...respuestas, [index]: optIdx });
  };

  const irAlFinal = () => {
    const resultadosFinales = preguntas.map((preg, i) => ({
      pregunta: preg,
      respuestaElegida: respuestas[i]
    }));
    alTerminar(resultadosFinales);
  };

  const formatearTiempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden font-sans">

      {/* HEADER: Cronómetro y Progreso con margen */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 px-6">
        <div className="flex items-center gap-3 bg-[#0f172a] text-white px-6 py-2.5 rounded-xl shadow-lg">
          <Clock size={18} className="text-emerald-400" />
          <span className="font-mono font-black text-base">{formatearTiempo(tiempo)}</span>
        </div>
        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] pr-2">
          Reactivo {index + 1} de {preguntas.length}
        </div>
      </div>

      {/* FICHA: Esquinas menos redondas (2rem en lugar de 3.5rem) */}
      <div className="ficha-viktoria w-full max-w-2xl p-0 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] overflow-hidden bg-white border-none !rounded-[2rem]">

        {/* Encabezado: Materia más grande y Check junto al texto */}
        <header className="bg-[#0f172a] p-10 flex flex-col items-center justify-center gap-3 relative">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-sm md:text-base font-black uppercase tracking-[0.4em]">
              {q.materia}
            </h2>
            {seleccionada ? (
              <CheckCircle2 className="text-emerald-400" size={22} />
            ) : (
              <AlertCircle className="text-amber-400 animate-pulse" size={22} />
            )}
          </div>
        </header>

        <div className="p-8 md:p-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug mb-10 text-center px-4">
                {q.pregunta}
              </h3>

              {q.formulaPrincipal && (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex justify-center mb-10 shadow-inner">
                  <BlockMath math={q.formulaPrincipal} />
                </div>
              )}

              <div className="flex flex-col gap-4 mb-12">
                {q.opciones.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSeleccion(i)}
                    className={`group flex items-center p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      respuestas[index] === i 
                      ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-lg' 
                      : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-emerald-200'
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-black mr-5 transition-colors ${
                      respuestas[index] === i ? 'bg-white/20 text-white' : 'bg-white shadow-sm text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + i)}:
                    </span>
                    <span className="text-sm md:text-base font-bold flex-1 leading-tight">{opt}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* DOBLE BOTÓN: Anterior y Siguiente */}
          <div className="flex gap-4 mt-4">
            {index > 0 && (
              <button
                onClick={() => setIndex(index - 1)}
                className="btn-viktoria-ghost flex-1 h-16 !rounded-2xl flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} />
                ANTERIOR
              </button>
            )}

            <button
              onClick={() => {
                if (index + 1 < preguntas.length) {
                  setIndex(index + 1);
                } else {
                  irAlFinal();
                }
              }}
              className="btn-viktoria-primary flex-[2] h-16 group !rounded-2xl"
            >
              <span className="flex items-center gap-2">
                {index + 1 === preguntas.length ? 'TERMINAR' : 'SIGUIENTE'}
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>

<button
        onClick={() => setIndex(preguntas.length - 1)} // CAMBIO: Ahora solo cambia el índice a la última pregunta
        className="mt-10 flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-amber-500 uppercase tracking-[0.4em] transition-colors"
      >
        <SkipForward size={14} />
        Ir a la última pregunta
      </button>
    </div>
  );
}

export default PantallaExamen;
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, Lightbulb, RotateCcw, FileText } from 'lucide-react';

function PantallaResultados({ respuestas, alReiniciar }) {
  const aciertos = respuestas.filter(r => r.respuestaElegida === r.pregunta.correcta).length;
  const porcentaje = Math.round((aciertos / respuestas.length) * 100);

  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] flex flex-col items-center p-6 md:p-10 font-sans">

      {/* TARJETA DE PUNTAJE (SCORE CARD) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mb-10 overflow-hidden rounded-[2rem] shadow-xl bg-white border border-slate-100"
      >
        <div className="bg-[#0f172a] p-10 text-center relative">
          <div className="absolute top-4 right-8 opacity-20">
            <Trophy className="text-emerald-400" size={80} />
          </div>
          <h1 className="text-4xl font-black italic text-white tracking-tighter mb-2">
            Resultados del Entrenamiento
          </h1>
          <p className="text-emerald-100/60 font-bold uppercase tracking-[0.3em] text-[10px]">
            Viktoria UNAM • Desempeño Final
          </p>
        </div>

        <div className="p-8 flex flex-col md:flex-row justify-around items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aciertos</p>
            <p className="text-4xl font-black text-slate-800">{aciertos} <span className="text-slate-300">/ {respuestas.length}</span></p>
          </div>
          <div className="h-12 w-px bg-slate-100 hidden md:block"></div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Calificación</p>
            <p className={`text-5xl font-black ${porcentaje >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {porcentaje}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* TABLA DE REVISIÓN DETALLADA */}
      <div className="w-full max-w-5xl space-y-6">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Análisis por Reactivo</h3>

        {respuestas.map((res, i) => {
          const esCorrecta = res.respuestaElegida === res.pregunta.correcta;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="ficha-viktoria !p-0 !rounded-[1.5rem] overflow-hidden border-none shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-12">

                {/* COLUMNA 1: PREGUNTA Y RESPUESTA (8 de 12 espacios) */}
                <div className="md:col-span-7 p-8 border-b md:border-b-0 md:border-r border-slate-50">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${esCorrecta ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {esCorrecta ? 'Correcta' : 'Incorrecta'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {res.pregunta.materia}
                    </span>
                  </div>

                  <p className="text-slate-800 font-bold leading-relaxed mb-6">
                    <span className="text-slate-300 mr-2">{i + 1}.</span>
                    {res.pregunta.pregunta}
                  </p>

                  <div className="space-y-2">
                    {res.pregunta.opciones.map((opt, idx) => {
                      const esSuEleccion = idx === res.respuestaElegida;
                      const esLaCorrecta = idx === res.pregunta.correcta;

                      let estiloOpcion = "bg-slate-50 text-slate-400 border-transparent";
                      if (esLaCorrecta) estiloOpcion = "bg-emerald-50 border-emerald-200 text-emerald-600 font-bold";
                      if (esSuEleccion && !esCorrecta) estiloOpcion = "bg-rose-50 border-rose-200 text-rose-600 font-bold";

                      return (
                        <div key={idx} className={`p-3 rounded-xl border text-xs flex items-center gap-3 transition-all ${estiloOpcion}`}>
                          <span className="opacity-60 font-black">{String.fromCharCode(65 + idx)}:</span>
                          <span>{opt}</span>
                          {esLaCorrecta && <CheckCircle2 size={14} className="ml-auto" />}
                          {esSuEleccion && !esCorrecta && <XCircle size={14} className="ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMNA 2: FEEDBACK (5 de 12 espacios) */}
                <div className="md:col-span-5 p-8 bg-slate-50/50 flex flex-col">
                  <div className="flex items-center gap-2 text-emerald-600 mb-4">
                    <Lightbulb size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Retroalimentación</span>
                  </div>

                  {/* Si falló, mostramos por qué falló esa opción específicamente */}
                  {!esCorrecta && res.respuestaElegida !== null && (
                    <div className="mb-4 p-4 bg-white rounded-2xl border border-rose-100 shadow-sm">
                      <p className="text-[11px] text-rose-800 italic leading-relaxed">
                        "Elegiste {String.fromCharCode(65 + res.respuestaElegida)}. {res.pregunta.analisisDeError[res.respuestaElegida]}"
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 mt-auto pt-4 border-t border-slate-200">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pasos sugeridos:</p>
                    {res.pregunta.explicacionPasos.map((paso, k) => (
                      <div key={k} className="flex gap-3 text-[11px] text-slate-600 leading-relaxed">
                        <span className="text-emerald-400 font-black">{k + 1}.</span>
                        <p>{paso}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BOTONES DE ACCIÓN INFERIOR */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mt-12 mb-20">
        <button
          onClick={alReiniciar}
          className="btn-viktoria-primary flex-1 !bg-slate-900 !shadow-none hover:!bg-slate-800 flex items-center justify-center gap-3"
        >
          <RotateCcw size={20} />
          NUEVO ENTRENAMIENTO
        </button>

        {/* Simulación de botón PDF */}
        <button
          onClick={() => window.print()}
          className="btn-viktoria-ghost flex-1 flex items-center justify-center gap-3 border-slate-200 text-slate-600"
        >
          <FileText size={20} />
          GUARDAR REPORTE (PDF)
        </button>
      </div>

    </div>
  );
}

export default PantallaResultados;
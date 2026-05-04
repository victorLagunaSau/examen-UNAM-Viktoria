import React from 'react';
import {motion} from 'framer-motion';
// MODIFICACIÓN AQUÍ: Se agregó BlockMath a la importación
import {BlockMath, InlineMath} from 'react-katex';
import {Trophy, CheckCircle2, XCircle, Lightbulb, RotateCcw, FileText, Fingerprint} from 'lucide-react';
import 'katex/dist/katex.min.css';

/**
 * Función de Renderizado Quirúrgico:
 * Detecta contenido entre (form) y (/form).
 */
const renderizadoMixto = (texto, esBloqueExplicativo = false) => {
    if (!texto) return "";

    const partes = texto.split(/\(form\)(.*?)\(\/form\)/g);

    return partes.map((parte, i) => {
        if (!parte) return null;

        const esFormula = i % 2 !== 0;

        if (esFormula) {
            try {
                if (esBloqueExplicativo) {
                    return (
                        <div key={i}
                             className="my-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex justify-center items-center overflow-x-auto">
                            <InlineMath math={parte.trim()}/>
                        </div>
                    );
                }
                return <InlineMath key={i} math={parte.trim()}/>;
            } catch (e) {
                return <span key={i} className="text-rose-500 font-mono">[{parte}]</span>;
            }
        }

        return <span key={i}>{parte}</span>;
    });
};

function PantallaResultados({respuestas, alReiniciar}) {
    const aciertos = respuestas.filter(r => r.respuestaElegida === r.pregunta.correcta).length;
    const porcentaje = Math.round((aciertos / respuestas.length) * 100);
    // Cálculo de estadísticas por materia
    const estadisticasPorMateria = respuestas.reduce((acc, curr) => {
        const materia = curr.pregunta.materia;
        const esCorrecta = curr.respuestaElegida === curr.pregunta.correcta;

        if (!acc[materia]) {
            acc[materia] = {totales: 0, aciertos: 0};
        }

        acc[materia].totales += 1;
        if (esCorrecta) acc[materia].aciertos += 1;

        return acc;
    }, {});

    return (
        <div className="min-h-screen w-full bg-[#fdfbf7] flex flex-col items-center p-6 md:p-10 font-sans">

            {/* TARJETA DE PUNTAJE */}
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                className="w-full max-w-5xl mb-10 overflow-hidden rounded-[2rem] shadow-xl bg-white border border-slate-100"
            >
                <div className="bg-[#0f172a] p-10 text-center relative">
                    <div className="absolute top-4 right-8 opacity-20">
                        <Trophy className="text-emerald-400" size={80}/>
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
                        <p className="text-4xl font-black text-slate-800">{aciertos} <span
                            className="text-slate-300">/ {respuestas.length}</span></p>
                    </div>
                    <div className="h-12 w-px bg-slate-100 hidden md:block"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Calificación</p>
                        <p className={`text-5xl font-black ${porcentaje >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {porcentaje}%
                        </p>
                    </div>
                </div>
                {/* RESUMEN POR MATERIA */}
                <div className="w-full max-w-5xl mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(estadisticasPorMateria).map(([materia, stats]) => {
                        const porcMateria = Math.round((stats.aciertos / stats.totales) * 100);

                        return (
                            <motion.div
                                key={materia}
                                initial={{opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        {materia}
                                    </p>
                                    <p className="text-2xl font-black text-slate-800">
                                        {stats.aciertos} <span
                                        className="text-slate-300 text-sm">/ {stats.totales}</span>
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <div className="flex justify-between items-end mb-1">
                                        <span
                                            className="text-[10px] font-bold text-slate-500">{porcMateria}% de dominio</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${porcMateria >= 70 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                            style={{width: `${porcMateria}%`}}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* TABLA DE REVISIÓN */}
            <div className="w-full max-w-5xl space-y-6">
                {respuestas.map((res, i) => {
                    const esCorrecta = res.respuestaElegida === res.pregunta.correcta;

                    return (
                        <motion.div key={i}
                                    className="ficha-viktoria !p-0 !rounded-[1.5rem] overflow-hidden border-none shadow-md mb-4 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-12">

                                {/* COLUMNA 1: PREGUNTA Y OPCIONES */}
                                <div className="md:col-span-7 p-8 border-b md:border-b-0 md:border-r border-slate-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${esCorrecta ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {esCorrecta ? 'Correcta' : 'Incorrecta'}
                                            </span>
                                            <span
                                                className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                {res.pregunta.materia}
                                            </span>
                                        </div>
                                        <span
                                            className="text-[8px] font-black text-slate-200 uppercase tracking-tighter flex items-center gap-1">
                                            <Fingerprint size={10}/> ID: {res.pregunta.id}
                                        </span>
                                    </div>

                                    <div className="text-slate-800 font-bold leading-relaxed mb-6">
                                        <span className="text-slate-300 mr-2">{i + 1}.</span>
                                        {renderizadoMixto(res.pregunta.pregunta)}
                                    </div>

                                    {/* --- INSERCIÓN DE FÓRMULA PRINCIPAL --- */}
                                    {res.pregunta.formulaPrincipal && (
                                        <div
                                            className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-center mb-8 shadow-inner overflow-x-auto">
                                            <BlockMath math={res.pregunta.formulaPrincipal}/>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {res.pregunta.opciones.map((opt, idx) => {
                                            const esSuEleccion = idx === res.respuestaElegida;
                                            const esLaCorrecta = idx === res.pregunta.correcta;

                                            // Verificamos si debemos tratar la opción como fórmula pura
                                            const esModoMatematico = res.pregunta.formulaPrincipal && res.pregunta.formulaPrincipal !== "";

                                            let estiloOpcion = "bg-slate-50 text-slate-400 border-transparent";
                                            if (esLaCorrecta) estiloOpcion = "bg-emerald-50 border-emerald-200 text-emerald-600 font-bold";
                                            if (esSuEleccion && !esCorrecta) estiloOpcion = "bg-rose-50 border-rose-200 text-rose-600 font-bold";

                                            return (
                                                <div key={idx}
                                                     className={`p-3 rounded-xl border text-xs flex items-center gap-3 ${estiloOpcion}`}>
                                                    <span
                                                        className="opacity-60 font-black shrink-0">{String.fromCharCode(65 + idx)}:</span>

                                                    <div className="flex-1 overflow-x-auto">
                                                        {/* Si la pregunta es matemática, renderizamos la opción como InlineMath directamente */}
                                                        {esModoMatematico ? (
                                                            <InlineMath math={opt.replaceAll('$', '').trim()}/>
                                                        ) : (
                                                            renderizadoMixto(opt)
                                                        )}
                                                    </div>

                                                    {esLaCorrecta &&
                                                        <CheckCircle2 size={14} className="ml-auto text-emerald-500"/>}
                                                    {esSuEleccion && !esCorrecta &&
                                                        <XCircle size={14} className="ml-auto text-rose-500"/>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* COLUMNA 2: FEEDBACK Y PASOS */}
                                <div className="md:col-span-5 p-8 bg-slate-50/50 flex flex-col">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-4">
                                        <Lightbulb size={16}/>
                                        <span
                                            className="text-[10px] font-black uppercase tracking-widest">Retroalimentación</span>
                                    </div>

                                    {!esCorrecta && res.respuestaElegida !== undefined && (
                                        <div className="mb-6 p-4 bg-white rounded-2xl border border-rose-100 shadow-sm">
                                            <p className="text-[11px] text-rose-800 italic leading-relaxed">
                                                <span className="font-black not-italic mr-1 text-rose-600">
                                                    Elegiste {String.fromCharCode(65 + res.respuestaElegida)}:
                                                </span>
                                                {renderizadoMixto(res.pregunta.analisisDeError[res.respuestaElegida])}
                                            </p>
                                        </div>
                                    )}

                                    {/* SECCIÓN 2: PASOS SUGERIDOS */}
                                    <div className="space-y-4 mt-auto pt-6 border-t border-slate-200">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Pasos
                                            sugeridos:</p>

                                        {res.pregunta.explicacionPasos.map((paso, k) => {
                                            const contenidoLimpio = paso.replace(/^Paso\s\d+:\s*/i, "");

                                            return (
                                                <div key={k}
                                                     className="flex gap-3 text-[11px] text-slate-600 leading-relaxed items-start mb-2">
                                                    <span
                                                        className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px] font-black shrink-0">
                                                        {k + 1}
                                                    </span>
                                                    <div className="flex-1">
                                                        {renderizadoMixto(contenidoLimpio, true)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mt-12 mb-20 no-print">
                <button onClick={alReiniciar}
                        className="btn-viktoria-primary flex-1 !bg-slate-900 !shadow-none hover:!bg-slate-800">
                    <RotateCcw size={20} className="inline mr-2"/> NUEVO ENTRENAMIENTO
                </button>
                <button onClick={() => window.print()}
                        className="btn-viktoria-ghost flex-1 border-slate-200 text-slate-600">
                    <FileText size={20} className="inline mr-2"/> GUARDAR REPORTE (PDF)
                </button>
            </div>

            <style>{`
                @media print {
                  .no-print { display: none !important; }
                  body { background-color: white !important; }
                  .ficha-viktoria { page-break-inside: avoid; }
                }
            `}</style>
        </div>
    );
}

export default PantallaResultados;
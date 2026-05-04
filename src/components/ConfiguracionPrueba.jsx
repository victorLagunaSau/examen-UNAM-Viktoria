import React from 'react';
import {Rocket, Target, Zap, Flame, Sparkles, ChevronRight, Hash} from 'lucide-react';

function ConfiguracionPrueba({cantidad, setCantidad, dificultad, setDificultad, alIniciar}) {

    const niveles = [
        {
            id: 2,
            label: 'Medio',
            desc: 'Examen Real',
            icon: <Target size={24}/>,
            color: 'from-emerald-400 to-emerald-600'
        },
        {id: 3, label: 'Pro', desc: 'Nivel Avanzado', icon: <Zap size={24}/>, color: 'from-amber-400 to-amber-600'},
        {id: 4, label: 'Elite', desc: 'Máxima Presión', icon: <Flame size={24}/>, color: 'from-rose-500 to-red-700'},
    ];

    return (
        <div
            className="min-h-screen w-full bg-[#fdfbf7] flex items-center justify-center p-4 md:p-10 relative overflow-hidden">

            {/* Círculos decorativos para suavizar el fondo */}
            <div
                className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-50"></div>
            <div
                className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-50"></div>

            <div
                className="ficha-viktoria w-full max-w-2xl animate-viktoria border-none p-0 overflow-hidden bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]">

                {/* HEADER CON FONDO OSCURO PARA DESCANSO VISUAL */}
                <header className="bg-[#0f172a] p-10 md:p-14 text-center relative">
                    <div className="absolute top-4 right-6 opacity-20">
                        <Sparkles className="text-emerald-400" size={60}/>
                    </div>
                    <h1 className="text-5xl font-black italic tracking-tighter text-white">
                        Viktoria <span
                        className="text-emerald-400 underline decoration-wavy decoration-1 underline-offset-8">UNAM</span>
                    </h1>
                    <p className="text-emerald-100/60 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">
                        Área 1: Ciencias Físico-Matemáticas
                    </p>
                </header>

                <div className="p-8 md:p-14">
                    {/* SECCIÓN: CANTIDAD */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-8">
                            <Hash size={18} className="text-slate-400"/>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Volumen de
                                Reactivos</h3>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {[40, 60, 100, 120].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setCantidad(n)}
                                    className={`h-14 rounded-2xl font-black transition-all duration-300 border-2 ${
                                        cantidad === n
                                            ? 'bg-[#0f172a] border-[#0f172a] text-white scale-110 shadow-lg'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-500'
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* SECCIÓN: DIFICULTAD */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-8">
                            <Flame size={18} className="text-slate-400"/>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Nivel de
                                Intensidad</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {niveles.map((n) => (
                                <button
                                    key={n.id}
                                    onClick={() => setDificultad(n.id)}
                                    className={`p-6 rounded-[2rem] border-2 transition-all duration-500 text-left flex items-center gap-5 group relative overflow-hidden ${
                                        dificultad === n.id
                                            ? 'border-transparent text-white shadow-2xl scale-[1.03]'
                                            : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                                    }`}
                                >
                                    {/* Background gradient solo cuando está seleccionado */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${n.color} transition-opacity duration-500 ${dificultad === n.id ? 'opacity-100' : 'opacity-0'}`}></div>

                                    <div
                                        className={`relative z-10 p-3 rounded-2xl ${dificultad === n.id ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                        {React.cloneElement(n.icon, {className: dificultad === n.id ? 'text-white' : 'text-slate-400'})}
                                    </div>
                                    <div className="relative z-10">
                                        <p className={`font-black text-sm uppercase tracking-tight ${dificultad === n.id ? 'text-white' : 'text-slate-800'}`}>{n.label}</p>
                                        <p className={`text-[10px] font-bold ${dificultad === n.id ? 'text-white/70' : 'text-slate-400'}`}>{n.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* BOTÓN DE ACCIÓN */}
                    <div className="mt-8 px-4 flex justify-center">
                        <button
                            onClick={() => alIniciar(cantidad, dificultad)} // Pasa los valores al padre
                            className="btn-viktoria-primary w-full max-w-md group"
                        >
                            <span>GENERAR ENTRENAMIENTO</span>
                            <ChevronRight
                                className="group-hover:translate-x-2 transition-transform duration-300"
                                size={24}
                            />
                        </button>
                    </div>
                </div>

                <footer className="bg-slate-50 p-6 text-center border-t border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">
                        Viktoria Intelligence System • v4.0
                    </p>
                </footer>

            </div>
        </div>
    );
}

export default ConfiguracionPrueba;
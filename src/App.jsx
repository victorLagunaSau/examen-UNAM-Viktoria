import React, {useState, useEffect} from 'react';
import todasLasPreguntas from './data/index.js';
import { baseDeTextos } from './data/textos.js';

import ConfiguracionPrueba from './components/ConfiguracionPrueba';
import PantallaExamen from './components/PantallaExamen';
import PantallaResultados from './components/PantallaResultados';
import PantallaLectura from './components/PantallaLectura'; // El nuevo componente

function App() {
    const [cantidad, setCantidad] = useState(60);
    const [dificultad, setDificultad] = useState(2);
    const [fase, setFase] = useState('inicio');
    const [preguntasExamen, setPreguntasExamen] = useState([]);
    const [respuestasUsuario, setRespuestasUsuario] = useState([]);
    const [tiempoRestante, setTiempoRestante] = useState(0);

    // --- Lógica del Examen ---
    const iniciarExamen = (cantFinal, difFinal) => {
        let poolPrincipal = todasLasPreguntas.filter(p => p.dificultad === difFinal);
        const cuotaMate = Math.floor(cantFinal * 0.30);
        const cuotaFisica = Math.floor(cantFinal * 0.30);
        const cuotaOtros = cantFinal - (cuotaMate + cuotaFisica);

        const filtrarPorMateria = (pool) => ({
            mate: pool.filter(p => p.materia.toLowerCase().includes("matemáticas")),
            fisica: pool.filter(p => p.materia.toLowerCase().includes("física")),
            otros: pool.filter(p => !p.materia.toLowerCase().includes("matemáticas") && !p.materia.toLowerCase().includes("física"))
        });

        const poolData = filtrarPorMateria(poolPrincipal);
        let seleccionados = [
            ...poolData.mate.sort(() => 0.5 - Math.random()).slice(0, cuotaMate),
            ...poolData.fisica.sort(() => 0.5 - Math.random()).slice(0, cuotaFisica),
            ...poolData.otros.sort(() => 0.5 - Math.random()).slice(0, cuotaOtros)
        ];

        if (seleccionados.length < cantFinal) {
            const idsUsados = new Set(seleccionados.map(p => p.id));
            const poolSobranteGlobal = todasLasPreguntas
                .filter(p => !idsUsados.has(p.id))
                .sort((a, b) => Math.abs(a.dificultad - difFinal) - Math.abs(b.dificultad - difFinal) || 0.5 - Math.random());
            seleccionados = [...seleccionados, ...poolSobranteGlobal.slice(0, cantFinal - seleccionados.length)];
        }

        const examenFinal = seleccionados.sort((a, b) => a.materia.localeCompare(b.materia));
        setPreguntasExamen(examenFinal);
        setRespuestasUsuario([]);
        setTiempoRestante(cantFinal * 60);
        setFase('examen');
    };

    // --- Timer ---
    useEffect(() => {
        let timer;
        if (fase === 'examen' && tiempoRestante > 0) {
            timer = setInterval(() => setTiempoRestante(prev => prev - 1), 1000);
        } else if (fase === 'examen' && tiempoRestante === 0) {
            setFase('resultados');
        }
        return () => clearInterval(timer);
    }, [fase, tiempoRestante]);

    return (
        <div data-theme="cupcake" className="min-h-screen bg-slate-100 font-sans">
            {/* Pantalla Inicial con opción de Lectura */}
            {fase === 'inicio' && (
                <ConfiguracionPrueba
                    cantidad={cantidad}
                    setCantidad={setCantidad}
                    dificultad={dificultad}
                    setDificultad={setDificultad}
                    alIniciar={iniciarExamen}
                    alIrALectura={() => setFase('lectura')}
                />
            )}

            {/* Nueva Pantalla de Lectura */}
            {fase === 'lectura' && (
                <PantallaLectura
                    textosBD={baseDeTextos}
                    alVolver={() => setFase('inicio')}
                />
            )}

            {fase === 'examen' && (
                <PantallaExamen
                    preguntas={preguntasExamen}
                    tiempo={tiempoRestante}
                    alTerminar={(res) => {
                        setRespuestasUsuario(res);
                        setFase('resultados');
                    }}
                />
            )}

            {fase === 'resultados' && (
                <PantallaResultados
                    respuestas={respuestasUsuario}
                    alReiniciar={() => setFase('inicio')}
                />
            )}
        </div>
    );
}

export default App;
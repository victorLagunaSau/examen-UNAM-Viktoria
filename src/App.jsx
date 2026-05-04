import React, {useState, useEffect} from 'react';
import todasLasPreguntas from './data/index.js';

import ConfiguracionPrueba from './components/ConfiguracionPrueba';
import PantallaExamen from './components/PantallaExamen';
import PantallaResultados from './components/PantallaResultados';

function App() {
    // Guardamos la configuración aquí para que no se pierda al navegar
    const [cantidad, setCantidad] = useState(25);
    const [dificultad, setDificultad] = useState(1);

    const [fase, setFase] = useState('inicio');
    const [preguntasExamen, setPreguntasExamen] = useState([]);
    const [respuestasUsuario, setRespuestasUsuario] = useState([]);
    const [tiempoRestante, setTiempoRestante] = useState(0);

    const iniciarExamen = (cantFinal, difFinal) => {
        // 1. Intentamos obtener todas las preguntas de la dificultad seleccionada primero
        let poolPrincipal = todasLasPreguntas.filter(p => p.dificultad === difFinal);

        // 2. Definimos las cuotas ideales (30% Mate, 30% Física, 40% Otros)
        const cuotaMate = Math.floor(cantFinal * 0.30);
        const cuotaFisica = Math.floor(cantFinal * 0.30);
        const cuotaOtros = cantFinal - (cuotaMate + cuotaFisica);

        // 3. Función auxiliar para filtrar por materia
        const filtrarPorMateria = (pool) => ({
            mate: pool.filter(p => p.materia.toLowerCase().includes("matemáticas")),
            fisica: pool.filter(p => p.materia.toLowerCase().includes("física")),
            otros: pool.filter(p => !p.materia.toLowerCase().includes("matemáticas") && !p.materia.toLowerCase().includes("física"))
        });

        // 4. Selección inicial con la dificultad deseada
        const poolData = filtrarPorMateria(poolPrincipal);

        let seleccionados = [
            ...poolData.mate.sort(() => 0.5 - Math.random()).slice(0, cuotaMate),
            ...poolData.fisica.sort(() => 0.5 - Math.random()).slice(0, cuotaFisica),
            ...poolData.otros.sort(() => 0.5 - Math.random()).slice(0, cuotaOtros)
        ];

        // 5. SISTEMA DE CASCADA: Si faltan preguntas, buscamos en OTRAS dificultades
        if (seleccionados.length < cantFinal) {
            const idsUsados = new Set(seleccionados.map(p => p.id));

            // Buscamos todas las preguntas que NO hemos usado de TODAS las dificultades
            const poolSobranteGlobal = todasLasPreguntas
                .filter(p => !idsUsados.has(p.id))
                // Ordenamos para que priorice dificultades cercanas (opcional)
                .sort((a, b) => Math.abs(a.dificultad - difFinal) - Math.abs(b.dificultad - difFinal) || 0.5 - Math.random());

            const faltantes = cantFinal - seleccionados.length;
            const relleno = poolSobranteGlobal.slice(0, faltantes);

            seleccionados = [...seleccionados, ...relleno];
        }

        // 6. Mezcla final y actualización de estado
        const examenFinal = seleccionados.sort(() => 0.5 - Math.random());

        setPreguntasExamen(examenFinal);
        setRespuestasUsuario([]);
        setTiempoRestante(cantFinal * 60);
        setFase('examen');
    };

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
        // "data-theme" es el truco para que DaisyUI use los colores bonitos
        <div data-theme="cupcake" className="min-h-screen bg-slate-100 font-sans">
            {fase === 'inicio' && (
                <ConfiguracionPrueba
                    cantidad={cantidad}
                    setCantidad={setCantidad}
                    dificultad={dificultad}
                    setDificultad={setDificultad}
                    alIniciar={iniciarExamen}
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
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
        // 1. Filtrar por dificultad
        let filtradas = todasLasPreguntas.filter(p => p.dificultad === difFinal);

        if (filtradas.length < cantFinal) {
            const otras = todasLasPreguntas.filter(p => p.dificultad !== difFinal);
            filtradas = [...filtradas, ...otras];
        }

        // 2. Mezclar para que no sean siempre las mismas preguntas
        const seleccionadas = filtradas
            .sort(() => 0.5 - Math.random())
            .slice(0, cantFinal);

        // 3. ¡EL TRUCO! Agrupar por materia antes de mandarlas a la pantalla
        // Esto las ordenará alfabéticamente por materia (Biología, Español, Física...)
        const agrupadasPorMateria = seleccionadas.sort((a, b) =>
            a.materia.localeCompare(b.materia)
        );

        setPreguntasExamen(agrupadasPorMateria);
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
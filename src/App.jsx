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
    const poolDificultad = todasLasPreguntas.filter(p => p.dificultad === difFinal);

    // 1. Definimos cuotas equitativas (30% para cada una)
    const cuotaMate = Math.floor(cantFinal * 0.20);
    const cuotaFisica = Math.floor(cantFinal * 0.20);
    const cuotaOtros = cantFinal - (cuotaMate + cuotaFisica);

    // 2. Filtramos por materia específica
    const poolMate = poolDificultad.filter(p => p.materia.toLowerCase().includes("matemáticas"));
    const poolFisica = poolDificultad.filter(p => p.materia.toLowerCase().includes("física"));
    const poolResto = poolDificultad.filter(p =>
        !p.materia.toLowerCase().includes("matemáticas") &&
        !p.materia.toLowerCase().includes("física")
    );

    // 3. Selección aleatoria por cuotas
    const seleccionMate = poolMate.sort(() => 0.5 - Math.random()).slice(0, cuotaMate);
    const seleccionFisica = poolFisica.sort(() => 0.5 - Math.random()).slice(0, cuotaFisica);
    const seleccionResto = poolResto.sort(() => 0.5 - Math.random()).slice(0, cuotaOtros);

    // 4. Mezcla final
    const examenFinal = [...seleccionMate, ...seleccionFisica, ...seleccionResto].sort(() => 0.5 - Math.random());

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
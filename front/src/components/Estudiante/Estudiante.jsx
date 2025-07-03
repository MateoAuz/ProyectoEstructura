import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Alert, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Estudiante() {
    const [modulos, setModulos] = useState([]);
    const [lecciones, setLecciones] = useState([]);
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [moduloDesbloqueado, setModuloDesbloqueado] = useState(1);
    const [mensaje, setMensaje] = useState('');
    const [recomendaciones, setRecomendaciones] = useState({});
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const idEstudiante = 1;

    const navigate = useNavigate();

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (cursoSeleccionado !== null) {
            obtenerProgreso();
        }
    }, [cursoSeleccionado]);


    const cargarDatos = async () => {
        try {
            const resModulos = await axios.get('http://localhost:5000/api/modulos');
            setModulos(resModulos.data);

            const resLecciones = await axios.get('http://localhost:5000/api/lecciones');
            setLecciones(resLecciones.data);

            const resEvaluaciones = await axios.get('http://localhost:5000/api/evaluaciones');
            setEvaluaciones(resEvaluaciones.data);

            const resCursos = await axios.get('http://localhost:5000/api/cursos');
            setCursos(resCursos.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };



    const verificarAvance = (moduloId) => {
        const lecs = lecciones.filter(l => l.ModuloId === moduloId);
        for (let lec of lecs) {
            const evals = evaluaciones.filter(e => e.LeccionId === lec.id);
            for (let eva of evals) {
                if (eva.puntaje_obtenido < eva.puntaje_maximo * 0.6) {
                    setMensaje(`⚠️ Necesitas reforzar el módulo ${moduloId}. Recurso: https://youtube.com/tu-video`);
                    return false;
                }
            }
        }
        setModuloDesbloqueado(moduloId + 1);
        setMensaje('');
        return true;
    };

    const obtenerRecomendacion = async (moduloId) => {
        const leccion = lecciones.find(l => l.ModuloId === moduloId);
        if (!leccion) {
            setMensaje("No hay lecciones en este módulo.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/recomendacion', {
                leccionId: leccion.id
            });
            setMensaje(res.data.recomendacion);
        } catch (error) {
            console.error("Error al obtener recomendación:", error);
            setMensaje("Error al obtener recomendación.");
        }
    };

    const obtenerRecomendaciones = async (evaluacionId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/recomendaciones/evaluacion/${evaluacionId}`);
            setRecomendaciones({ ...recomendaciones, [evaluacionId]: res.data });
        } catch (error) {
            console.error("Error al obtener recomendaciones:", error);
        }
    };

    const obtenerProgreso = async () => {
        try {
            const resProgreso = await axios.get(`http://localhost:5000/api/progreso/${idEstudiante}/${cursoSeleccionado}`);
            setModuloDesbloqueado(resProgreso.data.ModuloDesbloqueado);
        } catch (error) {
            console.error("Error al obtener progreso:", error);
        }
    };

    const obtenerRecomendacionAI = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/recomendacionAI');
            setMensaje(res.data.recomendacion);
        } catch (error) {
            console.error("Error al obtener recomendación AI:", error);
            setMensaje("Error al obtener recomendación AI.");
        }
    };



    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to right, #E3F2FD, #BBDEFB)',
                py: 5
            }}
        >
            <Container maxWidth="md">
                <Box textAlign="center" mb={4}>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        👨‍🎓 Bienvenido, Estudiante
                    </Typography>
                    <Typography variant="h6">
                        Selecciona un curso y comienza a aprender.
                    </Typography>
                </Box>

                <Box textAlign="center" mb={4}>
                    <Button
                        key={cargarDatos}
                        variant="contained"
                        sx={{
                            minWidth: 150,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: '#fff',
                            background: 'linear-gradient(to right, #1976D2, #42A5F5)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            borderRadius: 3,
                            '&:hover': {
                                background: 'linear-gradient(to right, #1565C0, #2196F3)',
                                transform: 'scale(1.05)',
                                transition: 'all 0.3s ease-in-out'
                            }
                        }}
                    >
                        Recargar Cursos
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                    {cursos.map((curso) => (
                        <Button
                            key={curso.id}
                            variant="contained"
                            sx={{
                                minWidth: 150,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: '#fff',
                                background: 'linear-gradient(to right, #1976D2, #42A5F5)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                borderRadius: 3,
                                '&:hover': {
                                    background: 'linear-gradient(to right, #1565C0, #2196F3)',
                                    transform: 'scale(1.05)',
                                    transition: 'all 0.3s ease-in-out'
                                }
                            }}
                            onClick={() => setCursoSeleccionado(curso.id)}
                        >
                            {curso.nombre}
                        </Button>
                    ))}
                </Box>


                <Box mt={5}>
                    {modulos
                        .filter(mod => mod.CursoId === cursoSeleccionado)
                        .map((mod, index) => {
                            const lecs = lecciones.filter(l => l.ModuloId === mod.id);
                            let evalId = null;
                            for (let lec of lecs) {
                                const evals = evaluaciones.filter(e => e.LeccionId === lec.id);
                                if (evals.length > 0) {
                                    evalId = evals[0].id;
                                    break;
                                }
                            }

                            return (
                                <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }} key={mod.id}>
                                    <CardContent>
                                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            📚 {mod.nombre}
                                        </Typography>

                                        {index + 1 > moduloDesbloqueado ? (
                                            <Alert severity="warning">
                                                🔒 Módulo bloqueado. Completa el módulo anterior para desbloquearlo.
                                            </Alert>
                                        ) : (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<i className="fas fa-play"></i>}
                                                    onClick={() => {
                                                        if (evalId) {
                                                            navigate(`/estudiante/evaluacion/${evalId}`);
                                                        } else {
                                                            alert("Este módulo no tiene evaluación asignada aún.");
                                                        }
                                                    }}
                                                >
                                                    Ingresar
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => obtenerRecomendacionAI()}
                                                >
                                                    Ver Recomendación AI
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="info"
                                                    onClick={() => {
                                                        if (evalId) {
                                                            obtenerRecomendaciones(evalId);
                                                        } else {
                                                            alert("Este módulo no tiene evaluación para recomendaciones.");
                                                        }
                                                    }}
                                                >
                                                    Recomendaciones Docente
                                                </Button>
                                            </Box>
                                        )}

                                        {recomendaciones[evalId] && recomendaciones[evalId].length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                {recomendaciones[evalId].map((rec) => (
                                                    <Alert key={rec.id} severity="info" sx={{ mb: 1 }}>
                                                        {rec.texto}
                                                    </Alert>
                                                ))}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                </Box>

                {mensaje && (
                    <Alert severity="info" sx={{ mt: 4 }}>
                        {mensaje}
                    </Alert>
                )}
            </Container>
        </Box>
    );
}

export default Estudiante;

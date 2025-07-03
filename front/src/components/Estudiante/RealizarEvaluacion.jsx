import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, RadioGroup, FormControlLabel, Radio, Alert, Divider } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function RealizarEvaluacion() {
    const { evaluacionId } = useParams();
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [resultado, setResultado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerPreguntas();
    }, []);

    const obtenerPreguntas = async () => {
        const res = await axios.get(`http://localhost:5000/api/preguntas/evaluacion/${evaluacionId}`);
        setPreguntas(res.data);
    };

    const handleChange = (preguntaId, respuesta) => {
        setRespuestas({ ...respuestas, [preguntaId]: respuesta });
    };

    const calcularPuntaje = async () => {
        let puntaje = 0;
        preguntas.forEach(p => {
            if (respuestas[p.id] === p.respuesta_correcta) {
                puntaje += 1;
            }
        });

        try {
            await axios.patch(`http://localhost:5000/api/evaluaciones/${evaluacionId}/puntaje`, {
                puntaje_obtenido: puntaje
            });
            setResultado(`✅ Tu puntaje es ${puntaje} de ${preguntas.length} y se ha registrado correctamente.`);
        } catch (error) {
            console.error("Error al registrar puntaje:", error);
            setResultado(`❌ Tu puntaje es ${puntaje} de ${preguntas.length}, pero no se pudo registrar en DB.`);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#0D47A1', textAlign: 'center' }}>
                📝 Realizar Evaluación
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                ⬅️ Regresar
            </Button>

            {preguntas.map(p => (
                <Card sx={{ mb: 2 }} key={p.id} elevation={3}>
                    <CardContent>
                        <Typography variant="h6">{p.texto}</Typography>
                        <RadioGroup
                            value={respuestas[p.id] || ''}
                            onChange={(e) => handleChange(p.id, e.target.value)}
                        >
                            {p.opciones.map((op, i) => (
                                <FormControlLabel key={i} value={op} control={<Radio />} label={op} />
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>
            ))}

            <Button variant="contained" onClick={calcularPuntaje} sx={{ backgroundColor: '#0D47A1' }}>
                ✅ Enviar Evaluación
            </Button>

            {resultado && <Alert severity="info" sx={{ mt: 2 }}>{resultado}</Alert>}
        </Container>
    );
}

export default RealizarEvaluacion;

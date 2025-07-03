import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button, Card, CardContent,
  IconButton, List, ListItem, ListItemText,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Preguntas from './Preguntas';

function Evaluaciones({ leccionId }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [nuevaEval, setNuevaEval] = useState('');
  const [puntaje, setPuntaje] = useState('');
  const [puntajeObtenido, setPuntajeObtenido] = useState({});
  const [recomendaciones, setRecomendaciones] = useState({});

  useEffect(() => {
    if (leccionId) obtenerEvaluaciones();
  }, [leccionId]);

  const obtenerEvaluaciones = async () => {
    const res = await axios.get(`http://localhost:5000/api/evaluaciones/leccion/${leccionId}`);
    setEvaluaciones(res.data);
  };

  const crearEvaluacion = async () => {
    if (nuevaEval.trim() === '' || puntaje.trim() === '') return;
    await axios.post('http://localhost:5000/api/evaluaciones', {
      nombre: nuevaEval,
      puntaje_maximo: parseInt(puntaje),
      LeccionId: leccionId
    });
    setNuevaEval('');
    setPuntaje('');
    obtenerEvaluaciones();
  };

  const eliminarEvaluacion = async (id) => {
    await axios.delete(`http://localhost:5000/api/evaluaciones/${id}`);
    obtenerEvaluaciones();
  };

  const registrarPuntaje = async (id) => {
    if (!puntajeObtenido[id]) return;
    await axios.patch(`http://localhost:5000/api/evaluaciones/${id}/puntaje`, {
      puntaje_obtenido: parseInt(puntajeObtenido[id])
    });
    obtenerEvaluaciones();
    setPuntajeObtenido({ ...puntajeObtenido, [id]: '' });
  };

  return (
    <Card sx={{ mb: 2, ml: 4, width: '85%' }}>
      <CardContent>
        <Typography variant="subtitle2">
          <AssignmentIcon sx={{ mr: 1 }} />
          Evaluaciones
        </Typography>

        <TextField
          label="Nombre de la evaluación"
          value={nuevaEval}
          onChange={(e) => setNuevaEval(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Puntaje máximo"
          type="number"
          value={puntaje}
          onChange={(e) => setPuntaje(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#0D47A1' }}
          onClick={crearEvaluacion}
        >
          Crear Evaluación
        </Button>

        <List>
          {evaluaciones.map((eva) => (
            <ListItem key={eva.id} sx={{ display: 'block' }}>
              <ListItemText
                primary={`${eva.nombre} - Máx: ${eva.puntaje_maximo}`}
                secondary={`Puntaje obtenido: ${eva.puntaje_obtenido ?? 'No registrado'}`}
              />

              <Preguntas evaluacionId={eva.id} />

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField
                  label="Registrar puntaje obtenido"
                  type="number"
                  size="small"
                  value={puntajeObtenido[eva.id] || ''}
                  onChange={(e) =>
                    setPuntajeObtenido({ ...puntajeObtenido, [eva.id]: e.target.value })
                  }
                  sx={{ mr: 2 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => registrarPuntaje(eva.id)}
                >
                  Registrar
                </Button>
                <IconButton color="error" onClick={() => eliminarEvaluacion(eva.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Button
                variant="outlined"
                size="small"
                onClick={() => window.open(`http://localhost:3000/estudiante/evaluacion/${eva.id}`, '_blank')}
              >
                Probar Evaluación como Estudiante
              </Button>

              {/* Mostrar campo de recomendación si nota < 7 */}
              {eva.puntaje_obtenido < 7 && eva.puntaje_obtenido !== null && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    Puntaje menor a 7. Ingrese una recomendación o link de refuerzo.
                  </Alert>
                  <TextField
                    label="Recomendación (link o texto)"
                    size="small"
                    fullWidth
                    value={recomendaciones[eva.id] || ''}
                    onChange={(e) =>
                      setRecomendaciones({ ...recomendaciones, [eva.id]: e.target.value })
                    }
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={async () => {
                      if (!recomendaciones[eva.id]) return;
                      await axios.post('http://localhost:5000/api/recomendaciones', {
                        texto: recomendaciones[eva.id],
                        EvaluacionId: eva.id
                      });
                      alert(`Recomendación para ${eva.nombre} guardada en DB`);
                    }}
                  >
                    Guardar Recomendación
                  </Button>

                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default Evaluaciones;

import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button, Card, CardContent,
  IconButton, List, ListItem, ListItemText,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Evaluaciones({ leccionId }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [nuevaEval, setNuevaEval] = useState('');
  const [puntaje, setPuntaje] = useState('');
  const [puntajeObtenido, setPuntajeObtenido] = useState({}); // objeto para cada input de puntaje obtenido

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
    setPuntajeObtenido({ ...puntajeObtenido, [id]: '' }); // limpiar input
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
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default Evaluaciones;

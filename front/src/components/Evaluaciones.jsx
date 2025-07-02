import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Card, CardContent,
  IconButton, List, ListItem, ListItemText,
  TextField,
  Typography,
  Box
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Evaluaciones({ leccionId }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [nuevaEval, setNuevaEval] = useState('');
  const [puntajeMinimo, setPuntajeMinimo] = useState('');

  const obtenerEvaluaciones = async () => {
    const res = await axios.get(`http://localhost:5000/api/evaluaciones/leccion/${leccionId}`);
    setEvaluaciones(res.data);
  };

  useEffect(() => {
    if (leccionId) obtenerEvaluaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leccionId]);

  const crearEvaluacion = async () => {
    if (nuevaEval.trim() === '' || puntajeMinimo.trim() === '') return;
    await axios.post('http://localhost:5000/api/evaluaciones', {
      nombre: nuevaEval,
      puntaje_maximo: parseInt(puntajeMinimo),
      LeccionId: leccionId
    });
    setNuevaEval('');
    setPuntajeMinimo('');
    obtenerEvaluaciones();
  };

  const eliminarEvaluacion = async (id) => {
    await axios.delete(`http://localhost:5000/api/evaluaciones/${id}`);
    obtenerEvaluaciones();
  };

  return (
    <Card sx={{ mb: 2, ml: 4, width: '85%', minWidth: 320 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AssignmentIcon sx={{ mr: 1 }} />
          Evaluaciones
        </Typography>

        {/* Inputs verticales, mismo ancho y buen espacio */}
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 2,
            mb: 2,
            maxWidth: 260
          }}
          onSubmit={(e) => { e.preventDefault(); crearEvaluacion(); }}
        >
          <TextField
            label="Nombre de la evaluación"
            value={nuevaEval}
            onChange={(e) => setNuevaEval(e.target.value)}
            size="small"
            sx={{ width: '100%' }}
          />
          <TextField
            label="Puntaje mínimo para aprobar"
            type="number"
            value={puntajeMinimo}
            inputProps={{ min: 1, max: 10 }}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 10)) {
                setPuntajeMinimo(value);
              }
            }}
            size="small"
            sx={{ width: '100%' }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: '#0D47A1', minWidth: 140, boxShadow: 1, mt: 1 }}
            size="small"
            type="submit"
          >
            Crear Evaluación
          </Button>
        </Box>

        <List>
          {evaluaciones.map((eva) => (
            <ListItem key={eva.id} sx={{ display: 'flex', alignItems: 'center', pl: 0 }}>
              <ListItemText
                primary={`${eva.nombre} - Mínimo para aprobar: ${eva.puntaje_maximo}`}
              />
              <IconButton color="error" onClick={() => eliminarEvaluacion(eva.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default Evaluaciones;
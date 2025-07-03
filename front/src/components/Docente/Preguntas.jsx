import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Select, MenuItem,
  InputLabel, FormControl, Card, CardContent, List, ListItem, ListItemText
} from '@mui/material';
import axios from 'axios';

function Preguntas({ evaluacionId }) {
  const [preguntas, setPreguntas] = useState([]);
  const [texto, setTexto] = useState('');
  const [opciones, setOpciones] = useState(['', '', '', '']);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');

  useEffect(() => {
    if (evaluacionId) obtenerPreguntas();
  }, [evaluacionId]);

  const obtenerPreguntas = async () => {
    const res = await axios.get(`http://localhost:5000/api/preguntas/evaluacion/${evaluacionId}`);
    setPreguntas(res.data);
  };

  const crearPregunta = async () => {
    await axios.post('http://localhost:5000/api/preguntas', {
      texto,
      opciones,
      respuesta_correcta: respuestaCorrecta,
      EvaluacionId: evaluacionId
    });
    setTexto('');
    setOpciones(['', '', '', '']);
    setRespuestaCorrecta('');
    obtenerPreguntas();
  };

  const handleOpcionesChange = (index, value) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = value;
    setOpciones(nuevasOpciones);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Preguntas de la Evaluación</Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            label="Texto de la pregunta"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          {opciones.map((op, i) => (
            <TextField
              key={i}
              label={`Opción ${i + 1}`}
              value={op}
              onChange={(e) => handleOpcionesChange(i, e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
          ))}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Respuesta Correcta</InputLabel>
            <Select
              value={respuestaCorrecta}
              label="Respuesta Correcta"
              onChange={(e) => setRespuestaCorrecta(e.target.value)}
            >
              {opciones.map((op, i) => (
                <MenuItem key={i} value={op}>{op}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={crearPregunta}>
            Crear Pregunta
          </Button>
        </CardContent>
      </Card>

      <Typography variant="h6">Lista de preguntas creadas:</Typography>
      <List>
        {preguntas.map(p => (
          <ListItem key={p.id}>
            <ListItemText
              primary={p.texto}
              secondary={`Respuesta correcta: ${p.respuesta_correcta}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Preguntas;

import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Alert, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';

function Recomendacion() {
  const [tiempo, setTiempo] = useState('');
  const [leccionId, setLeccionId] = useState('');
  const [resultado, setResultado] = useState('');

  const obtenerRecomendacion = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/recomendacion', {
        tiempo: parseInt(tiempo),
        leccionId: parseInt(leccionId)
      });
      setResultado(res.data.recomendacion);
    } catch (error) {
      console.error(error);
      setResultado("Error al obtener recomendación");
    }
  };


  const [lecciones, setLecciones] = useState([]);

  useEffect(() => {
    obtenerLecciones();
  }, []);

  const obtenerLecciones = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/lecciones');
      setLecciones(res.data);
    } catch (error) {
      console.error("Error al obtener lecciones:", error);
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5">
          <TipsAndUpdatesIcon sx={{ mr: 1 }} />
          Recomendación Personalizada
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="select-leccion-label">Lección</InputLabel>
          <Select
            labelId="select-leccion-label"
            value={leccionId}
            label="Lección"
            onChange={(e) => setLeccionId(e.target.value)}
          >
            {lecciones.map((lec) => (
              <MenuItem key={lec.id} value={lec.id}>
                {lec.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="number"
          label="Tiempo (min)"
          value={tiempo}
          onChange={(e) => setTiempo(e.target.value)}
          sx={{ mr: 2, mt: 2 }}
        />

        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: '#0D47A1' }}
          onClick={obtenerRecomendacion}
        >
          Obtener recomendación
        </Button>

        {resultado && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {resultado}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default Recomendacion;

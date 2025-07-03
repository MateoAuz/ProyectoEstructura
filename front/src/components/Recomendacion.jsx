import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Alert, Button, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';

function Recomendacion() {
  const [leccionId, setLeccionId] = useState('');
  const [resultado, setResultado] = useState('');
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

  const obtenerRecomendacion = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/recomendacion', {
        leccionId: parseInt(leccionId)
      });
      setResultado(res.data.recomendacion);
    } catch (error) {
      console.error(error);
      setResultado("Error al obtener recomendación");
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

        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: '#0D47A1' }}
          onClick={obtenerRecomendacion}
          disabled={!leccionId}
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

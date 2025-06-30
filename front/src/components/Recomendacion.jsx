import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Alert, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

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

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5">
          <TipsAndUpdatesIcon sx={{ mr: 1 }} />
          Recomendación Personalizada
        </Typography>

        <TextField
          type="number"
          label="ID de la lección"
          value={leccionId}
          onChange={(e) => setLeccionId(e.target.value)}
          sx={{ mr: 2, mt: 2 }}
        />

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

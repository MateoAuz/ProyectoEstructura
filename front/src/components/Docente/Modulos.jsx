import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Button, Card, CardContent,
  IconButton, List, ListItem, ListItemText,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Lecciones from './Lecciones';

function Modulos({ cursoId }) {
  const [modulos, setModulos] = useState([]);
  const [nuevoModulo, setNuevoModulo] = useState('');

  useEffect(() => {
    if (cursoId) obtenerModulos();
  }, [cursoId]);

  const obtenerModulos = async () => {
    const res = await axios.get(`http://localhost:5000/api/modulos/curso/${cursoId}`);
    setModulos(res.data);
  };

  const crearModulo = async () => {
    if (nuevoModulo.trim() === '') return;
    await axios.post('http://localhost:5000/api/modulos', {
      nombre: nuevoModulo,
      CursoId: cursoId
    });
    setNuevoModulo('');
    obtenerModulos();
  };

  const eliminarModulo = async (id) => {
    await axios.delete(`http://localhost:5000/api/modulos/${id}`);
    obtenerModulos();
  };

  return (
    <Card sx={{ mb: 2, ml: 4, width: '95%' }}>
      <CardContent>

        <Button
          variant="outlined"
          color="secondary"
          sx={{ mb: 2 }}
          onClick={() => window.history.back()}
        >
          ← Regresar
        </Button>

        <Typography variant="h6">
          <MenuBookIcon sx={{ mr: 1 }} />
          Módulos
        </Typography>
        <TextField
          label="Nombre del módulo"
          value={nuevoModulo}
          onChange={(e) => setNuevoModulo(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#0D47A1' }}
          onClick={crearModulo}
        >
          Crear Módulo
        </Button>

        <List>
          {modulos.map((mod) => (
            <ListItem key={mod.id}>
              <ListItemText primary={mod.nombre} />
              <IconButton color="error" onClick={() => eliminarModulo(mod.id)}>
                <DeleteIcon />
              </IconButton>
              <Lecciones moduloId={mod.id} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default Modulos;

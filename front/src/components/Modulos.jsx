import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Button, Card, CardContent,
  IconButton, List, ListItem, ListItemText,
  TextField,
  Typography,
  Box
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Lecciones from './Lecciones';

function Modulos({ cursoId }) {
  const [modulos, setModulos] = useState([]);
  const [nuevoModulo, setNuevoModulo] = useState('');
  const [nuevoContenido, setNuevoContenido] = useState('');

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
      nombreModulo: nuevoModulo, // <-- CAMBIO AQUÍ
      contenido: nuevoContenido,
      CursoId: cursoId
    });
    setNuevoModulo('');
    setNuevoContenido('');
    obtenerModulos();
  };

  const eliminarModulo = async (id) => {
    await axios.delete(`http://localhost:5000/api/modulos/${id}`);
    obtenerModulos();
  };

  return (
    <Card sx={{ mb: 2, ml: 4, width: '95%' }}>
      <CardContent>
        <Typography variant="h6">
          <MenuBookIcon sx={{ mr: 1 }} />
          Módulos
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, maxWidth: 420 }}>
          <TextField
            label="Nombre del módulo"
            value={nuevoModulo}
            onChange={(e) => setNuevoModulo(e.target.value)}
            sx={{ minWidth: 180 }}
          />
          <TextField
            label="Contenido del módulo"
            value={nuevoContenido}
            onChange={(e) => setNuevoContenido(e.target.value)}
            sx={{ minWidth: 220 }}
            multiline
            rows={2}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: '#0D47A1', alignSelf: 'flex-start' }}
            onClick={crearModulo}
          >
            Crear Módulo
          </Button>
        </Box>

        <List>
          {modulos.map((mod) => (
            <ListItem
              key={mod.id}
              alignItems="flex-start"
              sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 2, border: '1px solid #eee', borderRadius: 1, p: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <ListItemText
                  primary={<b>{mod.nombreModulo}</b>}
                  secondary={
                    <span style={{ color: '#555', fontStyle: 'italic' }}>
                      {mod.contenido || <span style={{ color: "#aaa" }}>Sin contenido</span>}
                    </span>
                  }
                />
                <IconButton color="error" onClick={() => eliminarModulo(mod.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Lecciones moduloId={mod.id} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default Modulos;
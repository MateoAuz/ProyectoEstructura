import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import {
  Box,
  Button, Card, CardContent,
  Container,
  IconButton, List,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Modulos from './components/Modulos';
import Recomendacion from './components/Recomendacion';

function App() {
  const [cursos, setCursos] = useState([]);
  const [nuevoCurso, setNuevoCurso] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [editandoCurso, setEditandoCurso] = useState(null);
  const [nuevoNombreCurso, setNuevoNombreCurso] = useState('');

  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    const res = await axios.get('http://localhost:5000/api/cursos');
    setCursos(res.data);
  };

  const crearCurso = async () => {
    if (nuevoCurso.trim() === '') return;
    await axios.post('http://localhost:5000/api/cursos', { nombre: nuevoCurso });
    setNuevoCurso('');
    obtenerCursos();
  };

  const eliminarCurso = async (id) => {
    await axios.delete(`http://localhost:5000/api/cursos/${id}`);
    obtenerCursos();
  };

  const actualizarCurso = async (id) => {
    await axios.patch(`http://localhost:5000/api/cursos/${id}`, { nombre: nuevoNombreCurso });
    setEditandoCurso(null);
    setNuevoNombreCurso('');
    obtenerCursos();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        <SchoolIcon sx={{ fontSize: 40, mr: 1 }} />
        Gestión de Cursos
      </Typography>

      <Card sx={{ mb: 4, width: '100%' }}>
        <CardContent>
          <Typography variant="h6">Crear Nuevo Curso</Typography>
          <TextField
            label="Nombre del curso"
            value={nuevoCurso}
            onChange={(e) => setNuevoCurso(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: '#0D47A1' }}
            onClick={crearCurso}
          >
            Crear
          </Button>
        </CardContent>
      </Card>

      <TextField
        label="Buscar curso"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <List>
        {cursos
          .filter(curso => curso.nombre.toLowerCase().includes(busqueda.toLowerCase()))
          .map((curso) => (
            <Card sx={{ mb: 2, width: '100%' }} key={curso.id}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {editandoCurso === curso.id ? (
                    <>
                      <TextField
                        value={nuevoNombreCurso}
                        onChange={(e) => setNuevoNombreCurso(e.target.value)}
                        label="Nuevo nombre"
                        sx={{ mr: 2 }}
                      />
                      <Button variant="contained" onClick={() => actualizarCurso(curso.id)}>
                        Guardar
                      </Button>
                      <Button onClick={() => setEditandoCurso(null)}>Cancelar</Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h5">{curso.nombre}</Typography>
                      <Box>
                        <IconButton onClick={() => {
                          setEditandoCurso(curso.id);
                          setNuevoNombreCurso(curso.nombre);
                        }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => eliminarCurso(curso.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
                <Modulos cursoId={curso.id} />
              </CardContent>
            </Card>
          ))}
      </List>

      <Recomendacion />
    </Container>
  );
}

export default App;

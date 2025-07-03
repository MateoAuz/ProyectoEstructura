import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Container, IconButton,
  List, TextField, Typography, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';

import Navbar from './components/Navbar';
import TreeViewCursos from './components/TreeViewCursos';
import Modulos from './components/Docente/Modulos';
import Recomendacion from './components/Recomendacion';
import Home from './components/Home';
import Estudiante from './components/Estudiante/Estudiante';
import RealizarEvaluacion from './components/Estudiante/RealizarEvaluacion';


const theme = createTheme({
  palette: {
    primary: { main: '#0D47A1' },
    secondary: { main: '#1976D2' },
    error: { main: '#D32F2F' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: { textTransform: 'none' },
  },
});

function App() {
  const [cursos, setCursos] = useState([]);
  const [nuevoCurso, setNuevoCurso] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTipo, setDialogTipo] = useState('crear');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [nuevoNombreCurso, setNuevoNombreCurso] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    const res = await axios.get('http://localhost:5000/api/cursos');
    setCursos(res.data);
  };

  const mostrarSnackbar = (mensaje, severidad = 'success') => {
    setSnackbarMessage(mensaje);
    setSnackbarSeverity(severidad);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const crearCurso = async () => {
    if (nuevoCurso.trim() === '') return;
    try {
      await axios.post('http://localhost:5000/api/cursos', { nombre: nuevoCurso });
      setNuevoCurso('');
      obtenerCursos();
      mostrarSnackbar('Curso creado correctamente');
    } catch {
      mostrarSnackbar('Error al crear curso', 'error');
    }
  };

  const eliminarCurso = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cursos/${id}`);
      obtenerCursos();
      mostrarSnackbar('Curso eliminado correctamente', 'info');
    } catch {
      mostrarSnackbar('Error al eliminar curso', 'error');
    }
  };

  const actualizarCurso = async (id) => {
    if (nuevoNombreCurso.trim() === '') return;
    try {
      await axios.patch(`http://localhost:5000/api/cursos/${id}`, { nombre: nuevoNombreCurso });
      setDialogOpen(false);
      setNuevoNombreCurso('');
      obtenerCursos();
      mostrarSnackbar('Curso actualizado correctamente');
    } catch {
      mostrarSnackbar('Error al actualizar curso', 'error');
    }
  };

  const abrirDialogCrear = () => {
    setDialogTipo('crear');
    setNuevoCurso('');
    setDialogOpen(true);
  };

  const abrirDialogEditar = (curso) => {
    setDialogTipo('editar');
    setCursoSeleccionado(curso);
    setNuevoNombreCurso(curso.nombre);
    setDialogOpen(true);
  };

  const cerrarDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/docente" element={
            <Container maxWidth="md" sx={{ mt: 4, bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
              <Typography variant="h3" gutterBottom>
                <SchoolIcon sx={{ fontSize: 40, mr: 1 }} />
                Gestión de Cursos
              </Typography>

              <TreeViewCursos />

              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6">Crear Nuevo Curso</Typography>
                  <Button variant="contained" color="primary" onClick={abrirDialogCrear}>
                    Crear Curso
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
                  .filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
                  .map(curso => (
                    <Card sx={{ mb: 2 }} key={curso.id}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h5">{curso.nombre}</Typography>
                          <Box>
                            <IconButton onClick={() => abrirDialogEditar(curso)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => eliminarCurso(curso.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        <Modulos cursoId={curso.id} />
                      </CardContent>
                    </Card>
                  ))}
              </List>

              <Dialog open={dialogOpen} onClose={cerrarDialog}>
                <DialogTitle>{dialogTipo === 'crear' ? 'Crear Nuevo Curso' : 'Editar Curso'}</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Nombre del curso"
                    fullWidth
                    value={dialogTipo === 'crear' ? nuevoCurso : nuevoNombreCurso}
                    onChange={(e) => {
                      dialogTipo === 'crear'
                        ? setNuevoCurso(e.target.value)
                        : setNuevoNombreCurso(e.target.value);
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={cerrarDialog}>Cancelar</Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      dialogTipo === 'crear'
                        ? crearCurso()
                        : actualizarCurso(cursoSeleccionado.id);
                      cerrarDialog();
                    }}
                  >
                    {dialogTipo === 'crear' ? 'Crear' : 'Guardar'}
                  </Button>
                </DialogActions>
              </Dialog>

              <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Container>
          } />

          <Route path="/estudiante" element={<Estudiante />} />
          <Route path="/estudiante/evaluacion/:evaluacionId" element={<RealizarEvaluacion />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

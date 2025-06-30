import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import TreeViewCursos from './components/TreeViewCursos';
import Navbar from './components/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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

const theme = createTheme({
  palette: {
    primary: {
      main: '#0D47A1', // azul oscuro
    },
    secondary: {
      main: '#1976D2', // celeste
    },
    error: {
      main: '#D32F2F', // rojo para errores
    },
    background: {
      default: '#f5f5f5', // fondo general
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: {
      textTransform: 'none', // 🔷 Botones con texto normal
    },
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

  // ✅ Snackbar
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
      mostrarSnackbar('Curso creado correctamente', 'success');
    } catch (error) {
      mostrarSnackbar('Error al crear curso', 'error');
    }
  };

  const eliminarCurso = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cursos/${id}`);
      obtenerCursos();
      mostrarSnackbar('Curso eliminado correctamente', 'info');
    } catch (error) {
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
      mostrarSnackbar('Curso actualizado correctamente', 'success');
    } catch (error) {
      mostrarSnackbar('Error al actualizar curso', 'error');
    }
  };

  // ✅ Dialog
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
      <Navbar />  {/* 🔷 Navbar agregado */}
      <Container maxWidth="md" sx={{ mt: 4, bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom>
          <SchoolIcon sx={{ fontSize: 40, mr: 1 }} />
          Gestión de Cursos
        </Typography>

        {/* 🔷 TreeView */}
        <TreeViewCursos />

        <Card sx={{ mb: 4, width: '100%' }}>
          <CardContent>
            <Typography variant="h6">Crear Nuevo Curso</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={abrirDialogCrear}
            >
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
            .filter(curso => curso.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            .map((curso) => (
              <Card sx={{ mb: 2, width: '100%' }} key={curso.id}>
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

        <Recomendacion />

        {/* ✅ Dialog */}
        <Dialog open={dialogOpen} onClose={cerrarDialog}>
          <DialogTitle>
            {dialogTipo === 'crear' ? 'Crear Nuevo Curso' : 'Editar Curso'}
          </DialogTitle>
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
                if (dialogTipo === 'crear') {
                  crearCurso();
                } else {
                  actualizarCurso(cursoSeleccionado.id);
                }
                cerrarDialog();
              }}
            >
              {dialogTipo === 'crear' ? 'Crear' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ Snackbar */}
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
    </ThemeProvider>
  );
}

export default App;

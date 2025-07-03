import React, { useEffect, useState } from 'react';
import {
  Typography, Container, Card, CardContent,
  Button, TextField, List, Box, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';
import Modulos from './Modulos';

function Cursos() {
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #E3F2FD, #BBDEFB)', // celeste suave
        py: 5
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            <SchoolIcon sx={{ fontSize: 40, mr: 1 }} />
            Gestión de Cursos
          </Typography>
          <Typography variant="h5">
            👩‍🏫 Bienvenido, Docente
          </Typography>
        </Box>

        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">Crear Nuevo Curso</Typography>
            <Button variant="contained" color="primary" onClick={abrirDialogCrear} sx={{ mt: 1 }}>
              Crear Curso
            </Button>
          </CardContent>
        </Card>

        <TextField
          label="Buscar curso"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          fullWidth
          sx={{ mb: 3, backgroundColor: 'white', borderRadius: 1 }}
        />

        <List>
          {cursos
            .filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            .map(curso => (
              <Card sx={{ mb: 2, borderRadius: 2 }} key={curso.id}>
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

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Cursos;

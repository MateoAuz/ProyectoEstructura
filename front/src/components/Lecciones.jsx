import DeleteIcon from '@mui/icons-material/Delete';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {
    Button, Card, CardContent,
    FormControl,
    IconButton,
    InputLabel,
    List, ListItem, ListItemText, MenuItem, Select,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Evaluaciones from './Evaluaciones';

function Lecciones({ moduloId }) {
    const [lecciones, setLecciones] = useState([]);
    const [nuevaLeccion, setNuevaLeccion] = useState('');
    const [nivel, setNivel] = useState('básico'); // nivel por defecto
    const [orden, setOrden] = useState(1);

    useEffect(() => {
        if (moduloId) obtenerLecciones();
    }, [moduloId]);

    const obtenerLecciones = async () => {
        const res = await axios.get(`http://localhost:5000/api/lecciones/modulo/${moduloId}`);
        setLecciones(res.data);
        // actualizar orden automáticamente
        setOrden(res.data.length + 1);
    };

    const crearLeccion = async () => {
        if (nuevaLeccion.trim() === '') return;
        await axios.post('http://localhost:5000/api/lecciones', {
            nombre: nuevaLeccion,
            ModuloId: moduloId,
            orden: orden,
            nivel: nivel
        });
        setNuevaLeccion('');
        setOrden(orden + 1);
        obtenerLecciones();
    };

    const eliminarLeccion = async (id) => {
        await axios.delete(`http://localhost:5000/api/lecciones/${id}`);
        obtenerLecciones();
    };

    return (
        <Card sx={{ mb: 2, ml: 4, width: '90%' }}>
            <CardContent>
                <Typography variant="subtitle1">
                    <LibraryBooksIcon sx={{ mr: 1 }} />
                    Lecciones
                </Typography>

                <TextField
                    label="Nombre de la lección"
                    value={nuevaLeccion}
                    onChange={(e) => setNuevaLeccion(e.target.value)}
                    sx={{ mr: 2, mt: 1 }}
                />

                <FormControl sx={{ mr: 2, mt: 1, minWidth: 120 }}>
                    <InputLabel id="nivel-label">Nivel</InputLabel>
                    <Select
                        labelId="nivel-label"
                        value={nivel}
                        label="Nivel"
                        onChange={(e) => setNivel(e.target.value)}
                    >
                        <MenuItem value="básico">Básico</MenuItem>
                        <MenuItem value="intermedio">Intermedio</MenuItem>
                        <MenuItem value="avanzado">Avanzado</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Orden"
                    type="number"
                    value={orden}
                    onChange={(e) => setOrden(parseInt(e.target.value))}
                    sx={{ mr: 2, mt: 1, width: 90 }}
                />

                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#0D47A1', mt: 1 }}
                    onClick={crearLeccion}
                >
                    Crear Lección
                </Button>

                <List>
                    {lecciones.map((lec) => (
                        <ListItem key={lec.id}>
                            <ListItemText
                                primary={`ID: ${lec.id} - ${lec.nombre} (Nivel: ${lec.nivel}, Orden: ${lec.orden})`}
                            />
                            <IconButton color="error" onClick={() => eliminarLeccion(lec.id)}>
                                <DeleteIcon />
                            </IconButton>
                            <Evaluaciones leccionId={lec.id} />
                        </ListItem>
                    ))}
                </List>

            </CardContent>
        </Card>
    );
}

export default Lecciones;

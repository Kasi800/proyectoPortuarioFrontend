import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import muelleService from '../services/muelleService';
import puertoService from '../services/puertoService';

import {
    TextField, Button, Checkbox, FormControlLabel,
    Paper, Typography, Grid, MenuItem, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

/**
 * FormularioMuelle
 * Componente para crear y editar muelles. Cuando se recibe un `id` en la
 * URL (vía `useParams`) carga los datos del muelle y los muestra para
 * edición; si no hay `id`, muestra un formulario en blanco para crear uno
 * nuevo.
 *
 * Flujo principal:
 * - Carga la lista de `puertos` para el desplegable.
 * - Si existe `id`, obtiene el muelle por id y rellena `formData`.
 * - `handleChange` actualiza el estado del formulario.
 * - `handleSubmit` llama a `muelleService.create` o `muelleService.update`.
 * - Muestra feedback en un `Dialog` al completar la operación.
 *
 * @returns {JSX.Element} Formulario para muelles con validación básica.
 */
const FormularioMuelle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        id_puerto: '',
        longitud_m: 0,
        calado_m: 0,
        operativo: true,
        fecha_construccion: '',
        tipo: ''
    });
    const [puertos, setPuertos] = useState([]);

    const [feedback, setFeedback] = useState({
        open: false,
        title: '',
        message: '',
        isError: false
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Cargas la lista para el desplegable
                const listaPuertos = await puertoService.getAll();
                setPuertos(listaPuertos.rows);

                // Si hay ID, cargamos los datos del muelle
                if (id) {
                    const data = await muelleService.getById(id);

                    // Aseguramos que los datos encajen en el form
                    delete data.id_muelle;
                    setFormData(data);
                } else {
                    setFormData({
                        nombre: '',
                        id_puerto: '',
                        longitud_m: 0,
                        calado_m: 0,
                        operativo: true,
                        fecha_construccion: '',
                        tipo: ''
                    });
                }
            } catch (error) {
                // Mostrar diálogo de error y mantener al usuario informado
                setFeedback({
                    open: true,
                    title: 'Ha ocurrido un error',
                    message: 'No se pudo cargar los datos: ' + (error.message || 'Error desconocido'),
                    isError: true
                });
            }
        }
        cargarDatos();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Actualiza dinámicamente el campo correspondiente. Los checkbox
        // usan `checked`, el resto usan `value`.
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await muelleService.update(id, formData);
                setFeedback({
                    open: true,
                    title: 'Operación Exitosa',
                    message: 'Muelle actualizado correctamente.',
                    isError: false
                });
            } else {
                await muelleService.create(formData);
                setFeedback({
                    open: true,
                    title: 'Operación Exitosa',
                    message: 'Muelle creado correctamente.',
                    isError: false
                });
            }
        } catch (error) {
            // Mostrar error en dialogo si la operación falla
            setFeedback({
                open: true,
                title: 'Ha ocurrido un error',
                message: 'No se pudo guardar el muelle: ' + (error.message || 'Error desconocido'),
                isError: true
            });
        }
    };

    const handleCloseFeedback = () => {
        setFeedback(prev => ({ ...prev, open: false }));

        if (!feedback.isError) {
            navigate('/muelles');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mx: 'auto', mt: 4, maxWidth: 600 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {id ? 'Editar Muelle' : 'Nuevo Muelle'}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid>
                        <TextField fullWidth label="Nombre" name="nombre"
                            value={formData.nombre} onChange={handleChange} required />
                    </Grid>
                    <Grid>
                        <TextField
                            select
                            helperText="Porfavor seleccione un puerto"
                            fullWidth
                            label="Puerto"
                            name="id_puerto"
                            value={formData.id_puerto}
                            onChange={handleChange}
                            required
                        >
                            {puertos.map((option) => (
                                <MenuItem value={option.id_puerto}>
                                    {option.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid>
                        <TextField fullWidth type="number" label="Longitud (m)" name="longitud_m"
                            value={formData.longitud_m} onChange={handleChange} inputProps={{ step: "0.01", min: "0", max: "99999999.99" }} required />
                    </Grid>
                    <Grid>
                        <TextField fullWidth type="number" label="Calado (m)" name="calado_m"
                            value={formData.calado_m} onChange={handleChange} inputProps={{ step: "0.01", min: "0", max: "999.99" }} required />
                    </Grid>
                    <Grid>
                        <TextField
                            select
                            helperText="Seleccione un tipo"
                            fullWidth
                            label="Tipo"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="carga">
                                Carga
                            </MenuItem>
                            <MenuItem value="pasajeros">
                                Pasajeros
                            </MenuItem>
                            <MenuItem value="granel">
                                Granel
                            </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid>
                        <TextField fullWidth type="date" label="Fecha de Construcción" name="fecha_construccion"
                            value={formData.fecha_construccion} slotProps={{ inputLabel: { shrink: true } }} onChange={handleChange} required />
                    </Grid>
                    <Grid>
                        <FormControlLabel
                            control={<Checkbox checked={formData.operativo} onChange={handleChange} name="operativo" />}
                            label="Muelle Activo / Operativo"
                        />
                    </Grid>

                    <Grid sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="contained" type="submit" fullWidth>
                            Guardar
                        </Button>
                        <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate('/')}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Dialog
                open={feedback.open}
                onClose={handleCloseFeedback}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {feedback.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {feedback.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFeedback} autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default FormularioMuelle;
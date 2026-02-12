import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import puertoService from '../services/puertoService';
import {
    TextField, Button, Checkbox, FormControlLabel,
    Paper, Typography, Grid, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
/**
 * FormularioPuerto
 * Componente responsable de crear y editar puertos.
 * - Si existe `id` en la ruta, carga el puerto y rellena el formulario.
 * - Envía los datos a `puertoService.create` o `puertoService.update`.
 * - Muestra feedback mediante un `Dialog` con el resultado de la operación.
 *
 * Estado principal:
 * @property {Object} formData - Datos del formulario (nombre, ciudad, pais, etc.)
 * @property {Object} feedback - Control del diálogo de resultado/errores
 *
 * @returns {JSX.Element} Formulario para crear/editar puertos.
 */
const FormularioPuerto = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        ciudad: '',
        pais: '',
        capacidad_teu: 0,
        activo: true,
        fecha_inauguracion: '',
        profundidad_media: 0
    });

    const [feedback, setFeedback] = useState({
        open: false,
        title: '',
        message: '',
        isError: false
    });

    useEffect(() => {
        // Si hay ID, cargamos los datos del puerto
        if (id) {
            const cargarPuerto = async () => {
                try {
                    const data = await puertoService.getById(id);

                    // Aseguramos que los datos encajen en el form
                    delete data.id_puerto;
                    setFormData(data);
                } catch (error) {
                    // Mostrar diálogo de error si la carga falla
                    setFeedback({
                        open: true,
                        title: 'Ha ocurrido un error',
                        message: 'No se pudo cargar los datos: ' + (error.message || 'Error desconocido'),
                        isError: true
                    });
                }
            };
            cargarPuerto();
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Actualiza el campo correspondiente del formulario. Los checkbox
        // usan la propiedad `checked`, el resto `value`.
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await puertoService.update(id, formData);
                setFeedback({
                    open: true,
                    title: 'Operación Exitosa',
                    message: 'Puerto actualizado correctamente.',
                    isError: false
                });
            } else {
                await puertoService.create(formData);
                setFeedback({
                    open: true,
                    title: 'Operación Exitosa',
                    message: 'Puerto creado correctamente.',
                    isError: false
                });
            }
        } catch (error) {
            // Mostrar diálogo con el error devuelto por la API
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
            navigate('/puertos');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mx: 'auto', mt: 4, maxWidth: 600 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {id ? 'Editar Puerto' : 'Nuevo Puerto'}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid>
                        <TextField fullWidth label="Nombre" name="nombre"
                            value={formData.nombre} onChange={handleChange} required />
                    </Grid>
                    <Grid>
                        <TextField fullWidth label="Ciudad" name="ciudad"
                            value={formData.ciudad} onChange={handleChange} required />
                    </Grid>
                    <Grid>
                        <TextField fullWidth label="País" name="pais"
                            value={formData.pais} onChange={handleChange} required />
                    </Grid>
                    <Grid>
                        <TextField fullWidth type="number" label="Capacidad (TEU)" name="capacidad_teu"
                            value={formData.capacidad_teu} onChange={handleChange} inputProps={{ min: "0" }} required />
                    </Grid>
                    <Grid>
                        <TextField fullWidth type="number" label="Profundidad (m)" name="profundidad_media"
                            value={formData.profundidad_media} onChange={handleChange} inputProps={{ step: "0.01", min: "0", max: "999.99" }} required />
                    </Grid>
                    <Grid>
                        <TextField fullWidth type="date" label="Fecha Inauguración" name="fecha_inauguracion"
                            value={formData.fecha_inauguracion} onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} required />
                    </Grid>
                    <Grid>
                        <FormControlLabel
                            control={<Checkbox checked={formData.activo} onChange={handleChange} name="activo" />}
                            label="Puerto Activo / Operativo"
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

export default FormularioPuerto;
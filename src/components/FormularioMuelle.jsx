import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import muelleService from '../services/muelleService';
import puertoService from '../services/puertoService';
import {
    TextField, Button, Checkbox, FormControlLabel,
    Paper, Typography, Grid,
    MenuItem
} from "@mui/material";

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

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Cargas la lista para el desplegable
                const listaPuertos = await puertoService.getAll();
                setPuertos(listaPuertos);

                // Si hay ID, cargamos los datos del muelle
                if (id) {
                    const data = await muelleService.getById(id);
                    // Aseguramos que los datos encajen en el form
                    setFormData(data);
                }
            } catch (error) {
                alert("Error cargando los datos:" + error.message);
                navigate('/muelles');
            }
        }
        cargarDatos();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
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
                alert("Muelle actualizado correctamente");
            } else {
                await muelleService.create(formData);
                alert("Muelle creado correctamente");
            }
            navigate('/');
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mx: 'auto', mt: 4, maxWidth: 600 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {id ? 'Editar Muelle' : 'Nuevo Muelle'}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Nombre" name="nombre"
                            value={formData.nombre} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                        <TextField fullWidth type="number" label="Longitud (m)" name="longitud_m"
                            value={formData.longitud_m} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth type="number" label="Calado (m)" name="calado_m"
                            value={formData.calado_m} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Tipo" name="tipo"
                            value={formData.tipo} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth type="date" label="Fecha de Construcción" name="fecha_construccion"
                            value={formData.fecha_construccion} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox checked={formData.operativo} onChange={handleChange} name="operativo" />}
                            label="Muelle Activo / Operativo"
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="contained" type="submit" fullWidth>
                            Guardar
                        </Button>
                        <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate('/')}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default FormularioMuelle;
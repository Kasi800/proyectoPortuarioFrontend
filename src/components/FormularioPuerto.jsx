import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import puertoService from '../services/puertoService';
import { TextField, Button, Checkbox, FormControlLabel, 
    Paper, Typography, Grid } from "@mui/material";

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

    useEffect(() => {
        // Si hay ID, cargamos los datos del puerto
        if (id) {
            const cargarPuerto = async () => {
                try {
                    const data = await puertoService.getById(id);
                    // Aseguramos que los datos encajen en el form
                    setFormData(data);
                } catch (error) {
                    alert("Error cargando puerto");
                    navigate('/puertos');
                }
            };
            cargarPuerto();
        }
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
                await puertoService.update(id, formData);
                alert("Puerto actualizado correctamente");
            } else {
                await puertoService.create(formData);
                alert("Puerto creado correctamente");
            }
            navigate('/');
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mx: 'auto', mt: 4, maxWidth: 600 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {id ? 'Editar Puerto' : 'Nuevo Puerto'}
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Nombre" name="nombre" 
                            value={formData.nombre} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Ciudad" name="ciudad" 
                            value={formData.ciudad} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="País" name="pais" 
                            value={formData.pais} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth type="number" label="Capacidad (TEU)" name="capacidad_teu" 
                            value={formData.capacidad_teu} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth type="number" label="Profundidad (m)" name="profundidad_media" 
                            value={formData.profundidad_media} onChange={handleChange} inputProps={{ step: "0.01" }} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth type="date" label="Fecha Inauguración" name="fecha_inauguracion" 
                            value={formData.fecha_inauguracion} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox checked={formData.activo} onChange={handleChange} name="activo" />}
                            label="Puerto Activo / Operativo"
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

export default FormularioPuerto;
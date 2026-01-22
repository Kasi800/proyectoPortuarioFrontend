import { useState } from 'react';
import puertoService from '../services/puertoService';
import { useNavigate } from 'react-router-dom';

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, Typography, Button, Box, TextField, Grid, CircularProgress, Alert,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

const BusquedaPuertos = () => {
    const navigate = useNavigate();

    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const [filtros, setFiltros] = useState({
        ciudad: '',
        pais: '',
        activo: 'todos',
        fecha_inauguracion_min: '',
        fecha_inauguracion_max: ''
    });

    const handleChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        setBusquedaRealizada(true);
        try {
            const params = {};

            if (filtros.ciudad) params.ciudad = filtros.ciudad.trim();
            if (filtros.pais) params.pais = filtros.pais.trim();
            if (filtros.fecha_inauguracion_min) params.fecha_inauguracion_min = filtros.fecha_inauguracion_min;
            if (filtros.fecha_inauguracion_max) params.fecha_inauguracion_max = filtros.fecha_inauguracion_max;

            if (filtros.activo !== 'todos') {
                params.activo = (filtros.activo === 'si');
            }

            const response = await puertoService.getFiltered(params);

            const data = response.rows;
            setResultados(data);

        } catch (error) {
            console.error("Error en búsqueda:", error);
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltros({ ciudad: '', pais: '', activo: 'todos', fecha_inauguracion_min: '', fecha_inauguracion_max: '' });
        setResultados([]);
        setBusquedaRealizada(false);
    };

    const handleConfirmDelete = async () => {
        handleClose();

        try {
            await puertoService.delete(idToDelete);

            // Actualizamos los datos de puertos sin el que hemos borrado
            setResultados(resultados.filter(p => p.id_puerto !== idToDelete));
        } catch (error) {
            alert("No se pudo borrar el puerto: " + error.message);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setIdToDelete(null);
    };

    const handleClickOpen = (id) => {
        setIdToDelete(id);
        setOpen(true);
    };

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Búsqueda Parametrizada de Puertos
                </Typography>

                <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
                    <Grid container spacing={2} alignItems="center">

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Ciudad"
                                helperText="Filtra los puertos por ciudad"
                                name="ciudad"
                                value={filtros.ciudad}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="Ej: Valencia"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="País"
                                helperText="Filtra los puertos por país"
                                name="pais"
                                value={filtros.pais}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="Ej: España"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Estado Operativo"
                                helperText="Filtra los puertos por estado operativo"
                                name="activo"
                                value={filtros.activo}
                                onChange={handleChange}
                            >
                                <MenuItem value="todos">Todos</MenuItem>
                                <MenuItem value="si">Activos</MenuItem>
                                <MenuItem value="no">Inactivos</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Fecha de Inauguración Mínima"
                                helperText="Filtra los puertos por fecha de inauguración mínima"
                                name="fecha_inauguracion_min"
                                value={filtros.fecha_inauguracion_min}
                                slotProps={{ inputLabel: { shrink: true } }}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Fecha de Inauguración Máxima"
                                helperText="Filtra los puertos por fecha de inauguración máxima"
                                name="fecha_inauguracion_max"
                                value={filtros.fecha_inauguracion_max}
                                slotProps={{ inputLabel: { shrink: true } }}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SearchIcon />}
                                onClick={handleSearch}
                                fullWidth
                            >
                                Buscar
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                startIcon={<ClearIcon />}
                                onClick={limpiarFiltros}
                                fullWidth
                            >
                                Limpiar
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}

                {!loading && busquedaRealizada && resultados.length === 0 && (
                    <Alert severity="info" variant="outlined">
                        No se encontraron puertos que coincidan con los criterios de búsqueda.
                    </Alert>
                )}

                {!loading && resultados.length > 0 && (
                    <>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                            Se encontraron {resultados.length} resultados:
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.TableRow' }}>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Ciudad</TableCell>
                                        <TableCell>País</TableCell>
                                        <TableCell>Capacidad TEU</TableCell>
                                        <TableCell align="center">Activo</TableCell>
                                        <TableCell>Fecha de Inauguración</TableCell>
                                        <TableCell>Profundidad media</TableCell>
                                        <TableCell align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultados.map((row) => (
                                        <TableRow key={row.id_puerto} hover>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{row.nombre}</TableCell>
                                            <TableCell>{row.ciudad}</TableCell>
                                            <TableCell>{row.pais}</TableCell>
                                            <TableCell>{row.capacidad_teu?.toLocaleString()}</TableCell>
                                            <TableCell align="center">
                                                <Checkbox checked={row.activo} disabled />
                                            </TableCell>
                                            <TableCell>{new Date(row.fecha_inauguracion).toLocaleDateString('es-ES')}</TableCell>
                                            <TableCell>{row.profundidad_media}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleClickOpen(row.id_puerto)}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                                <Button
                                                    sx={{ ml: 1 }}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => navigate('/puertos/edit/' + row.id_puerto)}
                                                >
                                                    <EditIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">¿Confirmar borrado?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Esta acción no se puede deshacer. ¿Deseas eliminar el puerto seleccionado?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Borrar
                    </Button>
                    <Button onClick={handleClose}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BusquedaPuertos;
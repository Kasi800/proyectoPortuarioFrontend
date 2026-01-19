import { useState, useEffect } from 'react';
import muelleService from '../services/muelleService';
import puertoService from '../services/puertoService';
import { useNavigate } from 'react-router-dom';

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, Typography, Button, Box, TextField, Grid, MenuItem, CircularProgress,
    Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

const BusquedaMuelles = () => {
    const navigate = useNavigate();

    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const [listaPuertos, setListaPuertos] = useState([]);

    // Filtros de Búsqueda
    const [filtros, setFiltros] = useState({
        id_puerto: '',
        operativo: 'todos'
    });

    useEffect(() => {
        async function init() {
            try {
                const data = await puertoService.getAll();
                setListaPuertos(data.rows);
            } catch (error) {
                console.error("Error cargando puertos", error);
            }
        }
        init();
    }, []);

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

            if (filtros.id_puerto) params.id_puerto = filtros.id_puerto;

            if (filtros.operativo !== 'todos') {
                params.operativo = filtros.operativo === 'si';
            }

            const response = await muelleService.getFiltered(params);
            setResultados(response.rows);

        } catch (error) {
            console.error(error);
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltros({ id_puerto: '', operativo: 'todos' });
        setResultados([]);
        setBusquedaRealizada(false);
    };

    const handleConfirmDelete = async () => {
        handleClose();

        try {
            await muelleService.delete(idToDelete);

            // Actualizamos los datos de muelles sin el que hemos borrado
            setResultados(resultados.filter(p => p.id_muelle !== idToDelete));
        } catch (error) {
            alert("No se pudo borrar el muelle: " + error.message);
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
                    Búsqueda Parametrizada de Muelles
                </Typography>

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                select
                                fullWidth
                                helperText="Filtra los muelles por puerto"
                                label="Filtrar por Puerto"
                                name="id_puerto"
                                value={filtros.id_puerto}
                                onChange={handleChange}
                                variant="outlined"
                            >
                                {listaPuertos.map((p) => (
                                    <MenuItem key={p.id_puerto} value={p.id_puerto}>
                                        {p.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Estado Operativo"
                                helperText="Filtra los muelles por estado operativo"
                                name="operativo"
                                value={filtros.operativo}
                                onChange={handleChange}
                            >
                                <MenuItem value="todos">Todos</MenuItem>
                                <MenuItem value="si">Operativos</MenuItem>
                                <MenuItem value="no">No Operativos</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1 }}>
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
                    <Alert severity="info">No se encontraron muelles con esos criterios.</Alert>
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
                                        <TableCell>Puerto</TableCell>
                                        <TableCell>Longitud (m)</TableCell>
                                        <TableCell>Calado (m)</TableCell>
                                        <TableCell>Operativo</TableCell>
                                        <TableCell>Fecha de Construcción</TableCell>
                                        <TableCell>Tipo</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultados.map((row) => (
                                        <TableRow key={row.id_muelle} hover>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{row.nombre}</TableCell>
                                            <TableCell align="center">{row.id_puerto_puerto.nombre}</TableCell>
                                            <TableCell>{row.longitud_m}</TableCell>
                                            <TableCell>{row.calado_m}</TableCell>
                                            <TableCell>
                                                <Checkbox checked={row.operativo} disabled />
                                            </TableCell>
                                            <TableCell>{row.fecha_construccion}</TableCell>
                                            <TableCell>{row.tipo}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleClickOpen(row.id_muelle)}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                                <Button
                                                    sx={{ ml: 1 }}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => navigate('/muelles/edit/' + row.id_muelle)}
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
                        Esta acción no se puede deshacer. ¿Deseas eliminar el muelle seleccionado?
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

export default BusquedaMuelles;
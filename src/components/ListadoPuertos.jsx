import { useEffect, useState } from 'react';
import puertoService from '../services/puertoService';
import { useNavigate } from 'react-router-dom';

import {
    Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, Typography, Button
} from '@mui/material';

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ListadoPuertos = () => {
    const navigate = useNavigate();

    const [puertos, setPuertos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    useEffect(() => {
        async function cargarPuertos() {
            try {
                setLoading(true);
                const data = await puertoService.getAll();
                setPuertos(data.rows);
            } catch (err) {
                // Error ya manejado en el servicio
                console.error('Error al cargar puertos:', err.message);
            } finally {
                setLoading(false);
            }
        };
        cargarPuertos();
    }, []);

    const handleConfirmDelete = async () => {
        handleClose();

        try {
            await puertoService.delete(idToDelete);

            // Actualizamos los datos de puertos sin el que hemos borrado
            setPuertos(puertos.filter(p => p.id_puerto !== idToDelete));
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography variant="h4" align="center" sx={{ my: 3 }}>
                Listado de puertos
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'background.TableRow' }}>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="center">Ciudad</TableCell>
                            <TableCell>País</TableCell>
                            <TableCell>Capacidad TEU</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell>Fecha de Inauguración</TableCell>
                            <TableCell>Profundidad media</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {puertos.map((row) => (
                            <TableRow key={row.id_puerto}>
                                <TableCell sx={{ fontWeight: 'bold' }}>{row.nombre}</TableCell>
                                <TableCell align="center">{row.ciudad}</TableCell>
                                <TableCell>{row.pais}</TableCell>
                                <TableCell>{row.capacidad_teu}</TableCell>
                                <TableCell>
                                    <Checkbox checked={row.activo} disabled />
                                </TableCell>
                                <TableCell>{new Date(row.fecha_inauguracion).toLocaleDateString('es-ES')}</TableCell>
                                <TableCell>{row.profundidad_media}</TableCell>
                                <TableCell>
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

export default ListadoPuertos;
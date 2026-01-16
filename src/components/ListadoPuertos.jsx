import { useEffect, useState } from 'react';
import puertoService from '../services/puertoService';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const ListadoPuertos = () => {
    const [puertos, setPuertos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function cargarPuertos() {
            try {
                setLoading(true);
                const data = await puertoService.getAll();
                setPuertos(data);
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
        setIdToDelete(null);

        const backup = [...puertos];
        // Actualizamos los datos de puertos sin el que hemos borrado
        setPuertos(puertos.filter(p => p.id_puerto !== idToDelete));

        try {
            await puertoService.delete(idToDelete);
        } catch (error) {
            setPuertos(backup);
            alert("No se pudo borrar el puerto: " + error.message);
        }
    };

    const handleClickOpen = (id) => {
        setIdToDelete(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
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
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell align="center">{row.ciudad}</TableCell>
                                <TableCell>{row.pais}</TableCell>
                                <TableCell>{row.capacidad_teu}</TableCell>
                                <TableCell>
                                    <Checkbox checked={row.activo} />
                                </TableCell>
                                <TableCell>{row.fecha_inauguracion}</TableCell>
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
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Borrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListadoPuertos;
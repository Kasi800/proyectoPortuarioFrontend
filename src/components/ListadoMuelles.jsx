import { useEffect, useState } from 'react';
import muelleService from '../services/muelleService';

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

const ListadoMuelles = () => {
    const [muelles, setMuelles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function cargarMuelles() {
            try {
                setLoading(true);
                const data = await muelleService.getAll();
                setMuelles(data);
            } catch (err) {
                // Error ya manejado en el servicio
                console.error('Error al cargar muelles:', err.message);
            } finally {
                setLoading(false);
            }
        };
        cargarMuelles();
    }, []);

    const handleConfirmDelete = async () => {
        setOpen(false);
        setIdToDelete(null);

        try {
            await muelleService.delete(idToDelete);

            // Actualizamos los datos de muelles sin el que hemos borrado
            setMuelles(muelles.filter(p => p.id_muelle !== idToDelete));
        } catch (error) {
            alert("No se pudo borrar el muelle: " + error.message);
        }
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
                Listado de muelles
            </Typography>

            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="center">Puerto</TableCell>
                            <TableCell>Longitud (m)</TableCell>
                            <TableCell>Calado (m)</TableCell>
                            <TableCell>Operativo</TableCell>
                            <TableCell>Fecha de Construcción</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {muelles.map((row) => (
                            <TableRow key={row.id_muelle}>
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell align="center">{row.id_puerto}</TableCell>
                                <TableCell>{row.longitud_m}</TableCell>
                                <TableCell>{row.calado_m}</TableCell>
                                <TableCell>
                                    <Checkbox checked={row.operativo} />
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

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
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
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListadoMuelles;
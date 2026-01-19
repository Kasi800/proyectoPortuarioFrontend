import { useEffect, useState } from 'react';
import muelleService from '../services/muelleService';
import { useNavigate } from 'react-router-dom';

import {
    Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Checkbox, Typography, Button
} from '@mui/material';

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ListadoMuelles = () => {
    const navigate = useNavigate();

    const [muelles, setMuelles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [totalRows, setTotalRows] = useState(0);

    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    useEffect(() => {
        async function cargarMuelles() {
            try {
                setLoading(true);

                const offset = page * rowsPerPage;
                const data = await muelleService.getFiltered({
                    limit: rowsPerPage,
                    offset: offset,
                    order: 'id_muelle:ASC'
                });

                if (data.rows) {
                    setMuelles(data.rows);
                    setTotalRows(data.count);
                } else {
                    setMuelles(data);
                }
            } catch (err) {
                // Error ya manejado en el servicio
                console.error('Error al cargar muelles:', err.message);
            } finally {
                setLoading(false);
            }
        };
        cargarMuelles();
    }, [page, rowsPerPage]);

    const handleConfirmDelete = async () => {
        handleClose();

        try {
            await muelleService.delete(idToDelete);

            // Actualizamos los datos de muelles sin el que hemos borrado
            setMuelles(muelles.filter(p => p.id_muelle !== idToDelete));
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
            <Paper sx={{ mx: 'auto', maxWidth: '95%', mb: 4 }}>
                <Typography variant="h4" align="center" sx={{ my: 3 }}>
                    Listado de muelles
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#eeeeee' }}>
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
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalRows}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                />
            </Paper>

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

export default ListadoMuelles;
import { useEffect, useState } from 'react';
import muelleService from '../services/muelleService';
import { useNavigate } from 'react-router-dom';

import {
    Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TablePagination, Typography, Button, Grid, Card, CardMedia, CardContent,
    Chip, CardActions
} from '@mui/material';

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ListadoMuelles = () => {
    const navigate = useNavigate();

    const [muelles, setMuelles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
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

                setMuelles(data.rows);
                setTotalRows(data.count);
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

    const DetailRow = ({ label, value, unit }) => (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5
        }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                {label}:
            </Typography>
            <Typography variant="body1" className="font-medium capitalize" sx={{ textAlign: 'right' }}>
                {value} {unit}
            </Typography>
        </Box>
    );

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

            <Grid container spacing={1} margin={5} >
                {muelles.map((row) => (
                    <Grid key={row.id_muelle} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card>
                            <CardMedia
                                sx={{ height: 180 }}
                                image="https://elmercantil.com/wp-content/uploads/2021/04/2021-04-30-ultimo-cajon-Reina-Sofia-scaled-e1619786100313-988x556.jpg"
                                title={"Muelle " + row.id_muelle}
                            />
                            <CardContent>
                                <Box>
                                    <Box>
                                        <Typography variant="h5" component="div">
                                            {row.nombre}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                                            {row.id_puerto_puerto.nombre}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={row.operativo ? 'Operativo' : 'No Operativo'}
                                        color={row.operativo ? 'success' : 'error'}
                                        variant="filled"
                                        size="medium"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>

                                <Box >
                                    <DetailRow label="Tipo" value={row.tipo} />
                                    <DetailRow label="Longitud" value={row.longitud_m} unit="m" />
                                    <DetailRow label="Calado" value={row.calado_m} unit="m" />
                                    <DetailRow label="Fecha Construcción" value={new Date(row.fecha_construccion).toLocaleDateString('es-ES')} />
                                </Box>
                            </CardContent>

                            <CardActions>
                                <Button
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleClickOpen(row.id_muelle)}
                                    sx={{ mr: 1 }}
                                >
                                    Borrar
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<EditIcon />}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/muelles/edit/' + row.id_muelle)}
                                >
                                    Editar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
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
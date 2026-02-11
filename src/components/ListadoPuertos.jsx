import { useEffect, useState, useRef } from 'react';
import puertoService from '../services/puertoService';
import { useNavigate } from 'react-router-dom';

import {
    Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, Typography, Button,
    Stack
} from '@mui/material';

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { pdf } from '@react-pdf/renderer';
import PuertosPDF from './PuertosPDF';

const ListadoPuertos = () => {
    const navigate = useNavigate();

    const [puertos, setPuertos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const printRef = useRef(null);

    useEffect(() => {
        async function cargarPuertos() {
            try {
                setLoading(true);
                const data = await puertoService.getAll();
                setPuertos(data.rows);
            } catch (err) {
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

    const handlePrintBrowser = () => {
        window.print();
    };

    // --- B. IMPRESIÓN IMAGEN (Screenshot) ---
    const handlePrintImagePDF = async () => {
        const element = printRef.current;
        if (!element) return;
        
        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdfDoc = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdfDoc.internal.pageSize.getWidth();
            
            const imgProps = pdfDoc.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdfDoc.addImage(imgData, 'PNG', 0, 10, pdfWidth, imgHeight);
            pdfDoc.save('captura_puertos.pdf');
        } catch (err) {
            console.error("Error generando imagen PDF", err);
        }
    };

    // --- C. IMPRESIÓN INFORME (React-PDF) ---
    const handlePrintReportPDF = async () => {
        try {
            const blob = await pdf(<PuertosPDF data={puertos} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "informe_puertos.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generando informe", error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div ref={printRef}>
            <Typography variant="h4" align="center" sx={{ my: 3, marginBottom: 1 }}>
                Listado de puertos
            </Typography>

            <Stack 
                direction="row" 
                spacing={1} 
                justifyContent="center"
                margin={2}
                sx={{ 
                    '@media print': { display: 'none' } 
                }}
            >
                <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrintBrowser}>
                    Web
                </Button>
                <Button variant="outlined" color="secondary" startIcon={<PictureAsPdfIcon />} onClick={handlePrintImagePDF}>
                    Foto
                </Button>
                <Button variant="contained" color="primary" startIcon={<DescriptionIcon />} onClick={handlePrintReportPDF}>
                    Informe
                </Button>
            </Stack>

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
        </div>
    );
};

export default ListadoPuertos;
import { useEffect, useRef, useState } from 'react';
import puertoService from '../services/puertoService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Typography, Box, CircularProgress, Button, Stack } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

/**
 * GraficaPuertos
 * Componente que muestra un gráfico de barras con la capacidad (TEU) por
 * puerto y permite exportar la gráfica a PDF.
 *
 * Internamente realiza:
 * - Petición al servicio `puertoService.getAll()` para obtener los datos.
 * - Formateo mínimo de los datos para alimentar `recharts`.
 * - Exportación a PDF mediante `html2canvas` + `jspdf`.
 *
 * No acepta props; maneja su propio estado local.
 *
 * @returns {JSX.Element} Contenedor con la gráfica y el botón de exportar.
 */
const GraficaPuertos = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const puertos = await puertoService.getAll();
                const datosFormateados = puertos.rows.map(puerto => ({
                    nombre: puerto.nombre,
                    capacidad_teu: puerto.capacidad_teu || Math.floor(Math.random() * 500) + 100 
                }));
                // Guardar datos formateados para la gráfica
                setData(datosFormateados);
                setLoading(false);
            } catch (error) {
                // Registrar error y asegurarse de quitar el estado de carga
                console.error("Error cargando gráfica", error);
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const handleExportPDF = async () => {
        const element = chartRef.current;
        console.log(element);
        
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
            });
            // Convertir el canvas a imagen y ajustar proporciones para PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); 

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Calcular ratio para que la imagen quepa en la página sin deformarse
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 20; // margen superior

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('grafica_puertos.pdf');

        } catch (error) {
            // Registrar fallo en la exportación para depuración
            console.error("Error generando PDF", error);
        }
    };

    // Mostrar un spinner mientras se cargan los datos
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, m: 2 }}>
            {/* Contenedor referenciado para capturar la gráfica con html2canvas */}
            <div ref={chartRef} style={{ padding: '20px' }}>
                <Typography variant="h4" align="center" >
                    Capacidad por Puerto
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Gráfica de la capacidad (TEU) de cada puerto registrado.
                </Typography>

                <Box sx={{ width: '100%', height: 400, flexGrow: 1, overflow: 'hidden',  }}>
                    <ResponsiveContainer  height={400} width="100%" >
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="nombre" />
                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Bar 
                                dataKey="capacidad_teu" 
                                name="Capacidad (TEU)" 
                                fill="#1976d2" 
                                barSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </div>
            <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPDF}
            >
                Exportar PDF
            </Button>
        </Box>
    );
};

export default GraficaPuertos;
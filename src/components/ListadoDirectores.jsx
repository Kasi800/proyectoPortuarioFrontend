import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../api";
import { useNavigate } from "react-router-dom";

function ListadoDirectores() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDirectores() {
      try {
        const respuesta = await api.get("/directors/");

        // Actualizamos los datos de directores
        setDatos(respuesta.datos);

        // Y no tenemos errores
        setError(null);
      } catch (error) {
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    fetchDirectores();
  }, []);

  async function handleDelete(id_director) {
    try {
      await api.delete("/directors/" + id_director);

      const datos_nuevos = datos.filter( director => director.id_director != id_director);

      // Actualizamos los datos de directores sin el que hemos borrado
      setDatos(datos_nuevos);

      // Y no tenemos errores
      setError(null);
    } catch (error) {
      setError(error.mensaje || "No se pudo conectar al servidor");
      setDatos([]);
    }
  }

  if (error != null) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {error}
        </Typography>
      </>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          No hay directores disponibles
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de directores
      </Typography>

      <TableContainer component={Paper}>
        <Table stickyHeader ria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="center">Fecha nacimiento</TableCell>
              <TableCell>Biografía</TableCell>
              <TableCell>Fotografía</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row) => (
              <TableRow key={row.id_director}>
                <TableCell>{row.name}</TableCell>
                <TableCell align="center">{row.birth_date}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: "500px",
                    textWrap: "wrap",
                    overflow: "hidden",
                  }}
                >
                  {row.biography}
                </TableCell>
                <TableCell>
                  <Avatar alt={row.name} src={row.photo_url} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(row.id_director)}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button
                    sx={{ml: 1}}
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/directors/edit/' + row.id_director)}
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
  );
}

export default ListadoDirectores;

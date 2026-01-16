import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Button from "@mui/material/Button";

function ListadoCardsDirectores() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

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

      const datos_nuevos = datos.filter(
        (director) => director.id_director != id_director
      );

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
      <Grid container spacing={1}>
        {datos.map((row) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card>
              <CardMedia
                sx={{ height: 350 }}
                image={row.photo_url}
                title={row.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {row.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {row.biography}
                </Typography>
                <Typography variant="caption" gutterBottom>
                  {row.birth_date}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/directors/edit/${row.id_director}`}>
                  <Button size="small">EDITAR</Button>
                </Link>
                <Button
                  size="small"
                  onClick={() => handleDelete(row.id_director)}
                >
                  BORRAR
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ListadoCardsDirectores;

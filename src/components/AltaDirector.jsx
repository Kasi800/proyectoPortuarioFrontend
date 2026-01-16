import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import api from "../services/api";

function AltaDirector() {
  const navigate = useNavigate();
  const [director, setDirector] = useState({
    name: "",
    birth_date: "",
    biography: "",
    photo_url: "",
  });
  const [isCamposValidos, setIsCamposValidos] = useState({
    name: true,
    birth_date: true,
    biography: true,
    photo_url: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

  useEffect(() => {
    async function fetchCreateDirector() {
      try {
        const respuesta = await api.post("/directors/", director);

        setDialogMessage(respuesta.mensaje); // Mensaje
        setDialogSeverity("success"); // Color verde
        setOpenDialog(true); // Abrir el diálogo
      } catch (error) {
        setDialogMessage(error.mensaje || "Error al crear el director");
        setDialogSeverity("error"); // Color rojo
        setOpenDialog(true); // Abrir el diálogo
      }
      // Pase lo que pase hemos terminado el proceso de actualización
      setIsUpdating(false);
    }

    if (isUpdating) fetchCreateDirector();
  }, [isUpdating]);

  function handleChange(e) {
    setDirector({ ...director, [e.target.name]: e.target.value });
  }

  function handleClick() {
    // evitar envíos duplicados por pulsar el botón tras el mensaje de inserción correcta
    if (isUpdating) return;

    if (validarDatos()) {
      setIsUpdating(true);
    }
  }

  function handleDialogClose() {
    setOpenDialog(false);

    if (dialogSeverity === "success") navigate("/");
  }

  function validarDatos() {
    let valido = true;
    let objetoValidacion = {
      name: true,
      birth_date: true,
      biography: true,
      photo_url: true,
    };

    // Validación del nombre
    if (director.name.length < 10) {
      valido = false;
      objetoValidacion.name = false;
    }

    // Validación de la biografia
    if (director.biography.length < 50) {
      valido = false;
      objetoValidacion.biography = false;
    }

    // Validación de la url de la photo
    if (!isValidURL(director.photo_url)) {
      valido = false;
      objetoValidacion.photo_url = false;
    }

    // Validación de la fecha como requerida
    if (!director.birth_date) {
      valido = false;
      objetoValidacion.birth_date = false;
    }
    // Actualizamos con los campos correctos e incorrectos
    setIsCamposValidos(objetoValidacion);

    return valido;
  }

  const isValidURL = (urlString) => {
    var patronURL = new RegExp(
      // valida protocolo
      "^(https?:\\/\\/)?" +
      // valida nombre de dominio
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      // valida OR direccion ip (v4)
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      // valida puerto y path
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      // valida queries
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      // valida fragment locator
      "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!patronURL.test(urlString);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item size={{ xs: 12, sm: 9, md: 7 }}>
          <Paper elevation={6} sx={{ mt: 3, p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Alta de director
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Nombre"
                  name="name"
                  type="text"
                  maxLength="100" // Coincide con el tamaño del campo en la BBDD
                  value={director.name}
                  onChange={handleChange}
                  error={!isCamposValidos.name}
                  helperText={
                    !isCamposValidos.name && "Compruebe el formato del nombre."
                  }
                />
              </Grid>
              <Grid item size={{ xs: 10 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                >
                  <DatePicker
                    label="Fecha de nacimiento"
                    name="birth_date"
                    minDate={dayjs("1800-01-01")}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        required: true,
                        error: !isCamposValidos.birth_date,
                        helperText: !isCamposValidos.birth_date
                          ? "La fecha es obligatoria"
                          : "",
                      },
                    }}
                    value={
                      director.birth_date ? dayjs(director.birth_date) : null
                    }
                    onChange={(newValue) =>
                      setDirector({
                        ...director,
                        birth_date: newValue.format("YYYY-MM-DD"),
                      })
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  id="biography"
                  label="Biografía"
                  name="biography"
                  type="text"
                  multiline
                  maxRows={4}
                  minRows={2}
                  maxLength="500" // En este caso no coincide con el tamaño del campo en la BBDD
                  value={director.biography}
                  onChange={handleChange}
                  error={!isCamposValidos.biography}
                  helperText={
                    !isCamposValidos.biography &&
                    "Compruebe el formato de la biografia."
                  }
                />
              </Grid>
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  id="photo_url"
                  label="URL de la fotografía"
                  name="photo_url"
                  type="text"
                  maxLength="255" // Coincide con el tamaño del campo en la BBDD
                  value={director.photo_url}
                  onChange={handleChange}
                  error={!isCamposValidos.photo_url}
                  helperText={
                    !isCamposValidos.photo_url &&
                    "Compruebe el formato de la URL de la fotografía."
                  }
                />
              </Grid>
              <Grid
                item
                size={{ xs: 10 }}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  loading={isUpdating}
                  loadingPosition="end"
                  onClick={handleClick}
                >
                  Aceptar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        disableEscapeKeyDown
        aria-labelledby="result-dialog-title"
      >
        <DialogTitle id="result-dialog-title">
          {dialogSeverity === "success" ? "Operación correcta" : "Error"}
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity={dialogSeverity} variant="filled">
            {dialogMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AltaDirector;

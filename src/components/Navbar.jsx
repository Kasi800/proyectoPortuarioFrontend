import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MovieTwoToneIcon from "@mui/icons-material/MovieTwoTone";
import { Link } from "react-router";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";

function Navbar() {
  const [anclaMenuDirectores, setAnclaMenuDirectores] = React.useState(null);
  const [anclaMenuPeliculas, setAnclaMenuPeliculas] = React.useState(null);
  const [anclaMenuXS, setAnclaMenuXS] = React.useState(null);

  const handleClickMenuDirectores = (event) => {
    setAnclaMenuDirectores(event.currentTarget);
  };

  const handleClickMenuPeliculas = (event) => {
    setAnclaMenuPeliculas(event.currentTarget);
  };

  const handleClickMenuXS = (event) => {
    setAnclaMenuXS(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnclaMenuDirectores(null);
    setAnclaMenuPeliculas(null);
    setAnclaMenuXS(null);
  };

  const linkStyle = { color: "black", textDecoration: "none" };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Menú para resolución xs  */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu movies db resolucion xs"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleClickMenuXS}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-xs"
              anchorEl={anclaMenuXS}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuXS)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <ListSubheader>Menú Directores</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/directors/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de directores
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/directors" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de directores
                  </Typography>
                </Link>
              </MenuItem>
              <Divider />
              <ListSubheader>Menú Películas</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/movies/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de peliculas
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/movies" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de peliculas
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo y nombre de la web */}
          <MovieTwoToneIcon />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mx: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MOVIES DB
          </Typography>

          {/* Menú para resolución md */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* Menú para directores en md */}
            <Button
              onClick={handleClickMenuDirectores}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Directores
            </Button>
            <Menu
              id="menu-directores"
              anchorEl={anclaMenuDirectores}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuDirectores)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/directors/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de directores
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/directors" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de directores
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
            {/* Menú para peliculas en md */}
            <Button
              onClick={handleClickMenuPeliculas}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Peliculas
            </Button>
            <Menu
              id="menu-peliculas"
              anchorEl={anclaMenuPeliculas}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuPeliculas)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/movies/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de peliculas
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/movies" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de peliculas
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;

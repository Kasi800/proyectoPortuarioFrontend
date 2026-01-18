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
import MenuItem from "@mui/material/MenuItem";
import SailingIcon from '@mui/icons-material/Sailing';
import { Link } from "react-router";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";

function Navbar() {
  const [anclaMenuPuertos, setAnclaMenuPuertos] = React.useState(null);
  const [anclaMenuMuelles, setAnclaMenuMuelles] = React.useState(null);
  const [anclaMenuXS, setAnclaMenuXS] = React.useState(null);

  const handleClickMenuPuertos = (event) => {
    setAnclaMenuPuertos(event.currentTarget);
  };

  const handleClickMenuMuelles = (event) => {
    setAnclaMenuMuelles(event.currentTarget);
  };

  const handleClickMenuXS = (event) => {
    setAnclaMenuXS(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnclaMenuPuertos(null);
    setAnclaMenuMuelles(null);
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
              <ListSubheader>Menú Puertos</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/puertos/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de puertos
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/puertos" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de puertos
                  </Typography>
                </Link>
              </MenuItem>
              <Divider />
              <ListSubheader>Menú Muelles</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/muelles/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de muelles
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/muelles" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de muelles
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo y nombre de la web */}
          <SailingIcon />
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
            Puertos DB
          </Typography>

          {/* Menú para resolución md */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* Menú para puertos en md */}
            <Button
              onClick={handleClickMenuPuertos}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Puertos
            </Button>
            <Menu
              id="menu-puertos"
              anchorEl={anclaMenuPuertos}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuPuertos)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/puertos/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de puertos
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/puertos" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de puertos
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
            {/* Menú para muelles en md */}
            <Button
              onClick={handleClickMenuMuelles}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Muelles
            </Button>
            <Menu
              id="menu-muelles"
              anchorEl={anclaMenuMuelles}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuMuelles)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/muelles/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de muelles
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/muelles" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de muelles
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

import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Inicio from "./components/Inicio";
import ListadoDirectores from "./components/ListadoDirectores";
import AltaDirector from "./components/AltaDirector";
import EditarDirector from "./components/EditarDirector"
import ListadoCardsDirectores from "./components/ListadoCardsDirectores";
import ListadoPuertos from "./components/ListadoPuertos";
import FormularioPuerto from "./components/FormularioPuerto";
import ListadoMuelles from "./components/ListadoMuelles";
import FormularioMuelle from "./components/FormularioMuelle";

import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    errorElement: <ErrorPage />,
    children: [
      // Todo esto se ve en el Outlet
      { index: true, Component: Inicio }, // Esto se ve en la ruta padre
      {
        path: "/directors",
        element: <ListadoDirectores />,
      },
      {
        path: "/directors/cards",
        element: <ListadoCardsDirectores />,
      },
      {
        path: "/directors/new",
        element: <AltaDirector />,
      },
      {
        path: "/directors/edit/:id_director",
        element: <EditarDirector />,
      },
      {
        path: "/movies",
        element: <h1>Listado de peliculas</h1>,
      },
      {
        path: "/movies/new",
        element: <h1>Alta de peliculas</h1>,
      },
      {
        path: "/puertos",
        element: <ListadoPuertos />,
      },
      {
        path: "/puertos/new",
        element: <FormularioPuerto />,
      },
      {
        path: "/puertos/edit/:id",
        element: <FormularioPuerto />,
      },
      {
        path: "/muelles",
        element: <ListadoMuelles />,
      },
      {
        path: "/muelles/new",
        element: <FormularioMuelle />,
      },
      {
        path: "/muelles/edit/:id",
        element: <FormularioMuelle />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

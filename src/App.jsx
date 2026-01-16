import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Inicio from "./components/Inicio";
import ListadoDirectores from "./components/ListadoDirectores";
import AltaDirector from "./components/AltaDirector";
import EditarDirector from "./components/EditarDirector"
import ListadoCardsDirectores from "./components/ListadoCardsDirectores";
import PuertosPage from "./components/ListadoPuertos";

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
        element: <PuertosPage />,
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

import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Inicio from "./components/Inicio";
import ListadoPuertos from "./components/ListadoPuertos";
import FormularioPuerto from "./components/FormularioPuerto";
import ListadoMuelles from "./components/ListadoMuelles";
import FormularioMuelle from "./components/FormularioMuelle";
import BusquedaMuelles from './components/BusquedaMuelles';

import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import BusquedaPuertos from "./components/BusquedaPuertos";
import { ThemeContextProvider } from "./context/ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    errorElement: <ErrorPage />,
    children: [
      // Todo esto se ve en el Outlet
      { index: true, Component: Inicio }, // Esto se ve en la ruta padre
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
      {
        path: "/muelles/search",
        element: <BusquedaMuelles />,
      },
      {
        path: "/puertos/search",
        element: <BusquedaPuertos />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <ThemeContextProvider>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </>
  );
}

export default App;

import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Inicio from "./components/Inicio";
import ListadoPuertos from "./components/ListadoPuertos";
import FormularioPuerto from "./components/FormularioPuerto";
import ListadoMuelles from "./components/ListadoMuelles";
import ListadoMuellesCards from "./components/ListadoMuellesCards";
import FormularioMuelle from "./components/FormularioMuelle";
import BusquedaMuelles from './components/BusquedaMuelles';
import GraficaPuertos from './components/GraficaPuertos';

import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import BusquedaPuertos from "./components/BusquedaPuertos";
import { ThemeContextProvider } from "./context/ThemeContext";

/**
 * App.jsx
 * Punto de entrada de la aplicación React: define las rutas y el proveedor de tema.
 *
 * Este archivo configura el router utilizando `createBrowserRouter` y envuelve
 * la aplicación con `ThemeContextProvider` para proporcionar el estado del tema.
 *
 * Nota: Algunas rutas usan la propiedad `Component` y otras `element`. Ambas
 * funcionan en versiones modernas de `react-router`, pero normalmente se
 * recomienda usar `element` con JSX para consistencia.
 */

/**
 * Router de la aplicación con las rutas principales y sus componentes.
 * Cada objeto representa una ruta hija que se renderiza dentro del `Outlet`
 * del componente padre `Home`.
 * @type {import('react-router').Router}
 */
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
        path: "/muelles/cards",
        element: <ListadoMuellesCards />,
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
      {
        path: "/puertos/graphic",
        element: <GraficaPuertos />,
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

/**
 * Componente raíz de la aplicación.
 * Envuelve a la aplicación con el proveedor de tema y monta el router.
 *
 * @returns {JSX.Element} Elemento raíz que renderiza la aplicación.
 */
export default App;

import { Link, useRouteError } from "react-router-dom";
import Navbar from "../components/Navbar";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Navbar />
      <div>
        <h1>Oops!</h1>
        <p>Ha ocurrido un error.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <Link to="/">Volver a la página de inicio</Link>
      </div>
    </>
  );
}

export default ErrorPage;

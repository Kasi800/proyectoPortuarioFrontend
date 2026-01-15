import { Outlet } from "react-router";
import Navbar from "../components/Navbar";


function Home() {
  return (
    <>
      <Navbar />
      <Outlet/>
    </>
  );
}

export default Home;

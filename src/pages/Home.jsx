import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { Toolbar } from '@mui/material';

function Home() {
  return (
    <>
      <Navbar />
      <Toolbar />
      <Outlet />
    </>
  );
}

export default Home;

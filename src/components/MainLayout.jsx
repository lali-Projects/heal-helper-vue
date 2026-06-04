import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg,#f6fafb 0%,#eef6f6 100%)" }}>
      <Navbar />
      <Outlet />
    </Box>
  );
}

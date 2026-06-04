import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Tooltip, Stack } from "@mui/material";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/auth/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";
import { useState } from "react";
import ProfileDialog from "./ProfileDialog";

const navBtnSx = ({ isActive }) => ({
  px: 2, py: 1, borderRadius: 10, textDecoration: "none",
  fontWeight: 600,
  color: isActive ? "#0f766e" : "#475569",
  background: isActive ? "rgba(13,148,136,.12)" : "transparent",
  transition: "all .15s",
});

export default function Navbar() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscribe } = useNotification();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const handleEnableNotifications = async () => {
    try { await subscribe(); alert("התראות הופעלו בהצלחה"); }
    catch (e) { alert(`לא ניתן להפעיל התראות: ${e.message}`); }
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0}
      sx={{ borderBottom: "1px solid #e2e8f0", background: "rgba(255,255,255,.85)" }}>
      <Toolbar sx={{ justifyContent: "space-between", gap: 2, py: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Box sx={{ p: 1, borderRadius: 2, background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", display: "flex" }}>
            <MedicationLiquidIcon />
          </Box>
          <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 800 }}>תזכורת תרופות</Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
          <Box component={NavLink} to="/dashboard" sx={navBtnSx}>דף התרופות</Box>
          <Box component={NavLink} to="/about" sx={navBtnSx}>אודות</Box>
        </Stack>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="הפעלת התראות דחיפה">
            <IconButton color="primary" onClick={handleEnableNotifications}>
              <NotificationsActiveIcon />
            </IconButton>
          </Tooltip>
          {user && (
            <Tooltip title="עדכון פרופיל">
              <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer", px: 1, py: .5, borderRadius: 10, "&:hover": { background: "rgba(15,23,42,.04)" } }}
                onClick={() => setProfileOpen(true)}>
                <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34, fontWeight: 700 }}>
                  {user.name?.[0] || "?"}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}>{user.name}</Typography>
              </Box>
            </Tooltip>
          )}
          <Button onClick={handleLogout} startIcon={<LogoutIcon />} color="inherit">התנתק</Button>
        </Box>
      </Toolbar>
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </AppBar>
  );
}

import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Tooltip } from "@mui/material";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";
import { useState } from "react";
import ProfileDialog from "./ProfileDialog";

export default function Navbar() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscribe } = useNotification();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleEnableNotifications = async () => {
    try { await subscribe(); alert("התראות הופעלו בהצלחה"); }
    catch (e) { alert(`לא ניתן להפעיל התראות: ${e.message}`); }
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e2e8f0" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <MedicationLiquidIcon color="primary" />
          <Typography variant="h6" color="primary.dark">תזכורת תרופות</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="הפעלת התראות דחיפה">
            <IconButton color="primary" onClick={handleEnableNotifications}>
              <NotificationsActiveIcon />
            </IconButton>
          </Tooltip>
          {user && (
            <Tooltip title="עדכון פרופיל">
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ cursor: "pointer" }}
                onClick={() => setProfileOpen(true)}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                  {user.name?.[0] || "?"}
                </Avatar>
                <Typography variant="body2">{user.name}</Typography>
              </Box>
            </Tooltip>
          )}
          <Button onClick={handleLogout} startIcon={<LogoutIcon />} color="inherit">
            התנתק
          </Button>
        </Box>
      </Toolbar>
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </AppBar>
  );
}

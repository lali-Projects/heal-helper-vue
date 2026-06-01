import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: "#0d9488", dark: "#0f766e", light: "#5eead4", contrastText: "#fff" },
    secondary: { main: "#2563eb" },
    background: { default: "#f4f8fb", paper: "#ffffff" },
    error: { main: "#dc2626" },
    success: { main: "#16a34a" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Heebo","Rubik","Segoe UI",Tahoma,sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 10, paddingInline: 18 } } },
    MuiTextField: { defaultProps: { fullWidth: true, margin: "normal" } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
  },
});

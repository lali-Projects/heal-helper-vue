import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: "#0d9488", dark: "#0f766e", light: "#5eead4", contrastText: "#fff" },
    secondary: { main: "#2563eb", dark: "#1d4ed8", light: "#60a5fa" },
    background: { default: "#f6fafb", paper: "#ffffff" },
    error: { main: "#dc2626" },
    success: { main: "#16a34a" },
    text: { primary: "#0f172a", secondary: "#475569" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Heebo","Rubik","Segoe UI",Tahoma,sans-serif',
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
    h4: { fontWeight: 800, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 20,
          paddingBlock: 10,
          boxShadow: "none",
          transition: "transform .15s ease, box-shadow .2s ease, background .2s",
          "&:hover": { transform: "translateY(-1px)" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg,#0d9488 0%,#14b8a6 100%)",
          "&:hover": { background: "linear-gradient(135deg,#0f766e 0%,#0d9488 100%)", boxShadow: "0 10px 24px rgba(13,148,136,.28)" },
        },
      },
    },
    MuiTextField: { defaultProps: { fullWidth: true, margin: "normal" } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 18 } } },
    MuiAppBar: { styleOverrides: { root: { backdropFilter: "saturate(180%) blur(10px)" } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 18, boxShadow: "0 6px 22px rgba(15,23,42,.06)" } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
  },
});

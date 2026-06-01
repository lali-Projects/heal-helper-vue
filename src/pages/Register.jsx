import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Box, Alert, Link as MLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../features/apiSlice";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_RE = /^(?=(.*[a-zA-Z]){4,})(?=(.*[0-9]){4,})(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [doRegister, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await doRegister({
        name: values.name,
        email: values.email,
        password: values.password,
        pushEndpoint: null,
        pushP256dh: null,
        pushAuth: null,
      }).unwrap();
      navigate("/login", { replace: true });
    } catch (e) {
      setServerError(e?.data || e?.error || "ההרשמה נכשלה. נסה שוב.");
    }
  };

  return (
    <div className="auth-page">
      <Box className="auth-card">
        <Typography variant="h5" align="center" gutterBottom color="primary.dark">
          הרשמה
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
          צרו חשבון כדי לנהל תזכורות תרופות
        </Typography>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{String(serverError)}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="שם מלא"
            {...register("name", {
              required: "שם הוא שדה חובה",
              minLength: { value: 2, message: "שם חייב להכיל לפחות 2 תווים" },
              maxLength: { value: 50, message: "שם חייב להיות עד 50 תווים" },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="אימייל"
            type="email"
            {...register("email", {
              required: "אימייל הוא שדה חובה",
              pattern: { value: EMAIL_RE, message: "כתובת אימייל לא תקינה" },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="סיסמה"
            type="password"
            {...register("password", {
              required: "סיסמה היא שדה חובה",
              pattern: { value: PWD_RE, message: "הסיסמה חייבת להכיל לפחות 4 אותיות, 4 ספרות ותו מיוחד אחד" },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }} disabled={isLoading}>
            {isLoading ? "נרשם..." : "צור חשבון"}
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          יש לך חשבון? <MLink component={Link} to="/login">התחבר</MLink>
        </Typography>
      </Box>
    </div>
  );
}

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControlLabel, Switch } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { useCreateMedicationMutation, useUpdateMedicationMutation } from "../features/apiSlice";

export default function MedicationFormDialog({ open, onClose, initial }) {
  const user = useSelector(selectUser);
  const [createMed, { isLoading: creating }] = useCreateMedicationMutation();
  const [updateMed, { isLoading: updating }] = useUpdateMedicationMutation();

  const today = new Date().toISOString().slice(0, 10);

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: "", dosagePerDay: 1, endDate: "", fixedSchedule: false },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name || "",
        dosagePerDay: initial?.dosagePerDay || 1,
        endDate: initial?.endDate || "",
        fixedSchedule: initial?.fixedSchedule || false,
      });
    }
  }, [open, initial, reset]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      dosagePerDay: Number(values.dosagePerDay),
      endDate: values.endDate,
      fixedSchedule: values.fixedSchedule,
      user: { id: user.id },
    };
    if (initial?.id) await updateMed({ id: initial.id, body: payload }).unwrap();
    else await createMed(payload).unwrap();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle>{initial?.id ? "עריכת תרופה" : "הוספת תרופה"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="שם התרופה"
            {...register("name", {
              required: "שם הוא שדה חובה",
              minLength: { value: 2, message: "שם חייב להכיל לפחות 2 תווים" },
              maxLength: { value: 50, message: "שם חייב להיות עד 50 תווים" },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="מנות ביום"
            type="number"
            inputProps={{ min: 1 }}
            {...register("dosagePerDay", {
              required: "מנות ביום הוא שדה חובה",
              min: { value: 1, message: "חייב להיות לפחות 1" },
              valueAsNumber: true,
            })}
            error={!!errors.dosagePerDay}
            helperText={errors.dosagePerDay?.message}
          />
          <TextField
            label="תאריך סיום"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("endDate", {
              required: "תאריך סיום הוא שדה חובה",
              validate: (v) => v >= today || "התאריך חייב להיות היום או בעתיד",
            })}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
          />
          <Controller
            control={control}
            name="fixedSchedule"
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                label="זמנים קבועים"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ביטול</Button>
          <Button type="submit" variant="contained" disabled={creating || updating}>
            שמירה
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

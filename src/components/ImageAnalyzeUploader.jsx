import { useRef, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAnalyzeMedicationImageMutation, useCreateMedicationMutation } from "../features/apiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

export default function ImageAnalyzeUploader({ onAnalyzed }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [analyze, { isLoading }] = useAnalyzeMedicationImageMutation();
  const [createMed, { isLoading: creating }] = useCreateMedicationMutation();
  const user = useSelector(selectUser);

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const dto = await analyze(file).unwrap(); // { name, dosagePerDay, endDate }
      // Auto-create medication for the logged-in user
      const payload = {
        name: dto.name,
        dosagePerDay: dto.dosagePerDay,
        endDate: dto.endDate,
        fixedSchedule: false,
        user: { id: user.id },
      };
      await createMed(payload).unwrap();
      onAnalyzed?.(dto);
    } catch (e) {
      alert(`ניתוח התמונה נכשל: ${e?.data?.message || e.message || "שגיאה"}`);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Box
      className={`upload-dropzone ${dragOver ? "drag-over" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {isLoading || creating ? (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CircularProgress />
          <Typography>מנתח תמונה...</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CloudUploadIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h6">העלאת תמונת מרשם</Typography>
          <Typography variant="body2" color="text.secondary">
            לחץ או גרור תמונה לכאן כדי לזהות אוטומטית את פרטי התרופה
          </Typography>
          {preview && <img src={preview} alt="preview" style={{ maxWidth: 180, marginTop: 8, borderRadius: 8 }} />}
          <Button size="small" sx={{ mt: 1 }} variant="outlined">בחר קובץ</Button>
        </Box>
      )}
    </Box>
  );
}

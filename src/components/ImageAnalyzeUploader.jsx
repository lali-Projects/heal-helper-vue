import { useRef, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAnalyzeMedicationImageMutation } from "../features/apiSlice";

export default function ImageAnalyzeUploader({ onAnalyzed }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [analyze, { isLoading }] = useAnalyzeMedicationImageMutation();

 const handleFile = async (file) => {
 
  try {
   
    const response = await analyze(file).unwrap();
    
    console.log("Success! Data received:", response);
    
    if (onAnalyzed) {
      onAnalyzed(response); // הפעלת ה-callback עם הנתונים שחזרו
    }

  } catch (error) {
    console.error("Upload failed:", error);
    alert(error?.data || error?.message || "שגיאה בניתוח התמונה");
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
    onClick={(e) => {
      // אם אנחנו כבר בטעינה, אל תעשה כלום
      if (isLoading) return;
      
      // מניעה של הפעלה כפולה אם לחצו בטעות על אלמנט פנימי
      inputRef.current?.click();
    }}
    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
    onDragLeave={() => setDragOver(false)}
    onDrop={onDrop}
    style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
  >
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          handleFile(file);
          // טיפ קריטי: מנקים את ערך ה-input כדי שהבחירה הבאה תעבוד תמיד
          e.target.value = ""; 
        }
      }}
    />
    {isLoading ? (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1} onClick={(e) => e.stopPropagation()}>
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
        {preview && (
          <img 
            src={preview} 
            alt="preview" 
            style={{ maxWidth: 180, marginTop: 8, borderRadius: 8 }} 
            onClick={(e) => e.stopPropagation()} // מונע פתיחה מחדש של חלונית הקבצים בלחיצה על התמונה
          />
        )}
        <Button 
          size="small" 
          sx={{ mt: 1 }} 
          variant="outlined"
          onClick={(e) => {
            // קריטי ביותר: מונע מהכפתור להפעיל גם את ה-onClick של ה-Box ועוצר את הכפילות!
            e.stopPropagation(); 
            if (!isLoading) inputRef.current?.click();
          }}
        >
          בחר קובץ
        </Button>
      </Box>
    )}
  </Box>
  );
}

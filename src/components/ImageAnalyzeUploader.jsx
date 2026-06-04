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
  // if (!file) return;
  // setPreview(URL.createObjectURL(file));

  // // כאן השינוי: יוצרים FormData
  // const formData = new FormData();
  // formData.append("file", file); // ה-"file" כאן חייב להתאים לשם הפרמטר ב-Controller ב-Java

  // try {
  //   // שולחים את ה-formData במקום את ה-file הגולמי
  //   const dto = await analyze(formData).unwrap(); 
    
  //   const prefill = {
  //     name: dto.medicine_name || "",
  //     dosage: dto.dosage || "",
  //     dosagePerDay: Number(dto.frequency) || 1,
  //     endDate: dto.endDate || "",
  //     fixedSchedule: false,
  //   };
  //   onAnalyzed?.(prefill);
  // } catch (e) {
  //   console.error("Error details:", e); // שימושי מאוד לדבג מה השרת החזיר
  //   alert(`ניתוח התמונה נכשל: ${e?.data?.message || e.message || "שגיאה"}`);
  // }
  setIsLoading(true);
  
  // 1. חובה להשתמש ב-FormData עבור העלאת קבצים ב-Multipart
  const formData = new FormData();
  
  // 2. המפתח (הפרמטר הראשון) חייב להיות המילה "file" באותיות קטנות - בדיוק מה שג'אווה מחפש!
  formData.append("file", file); 

  try {
    const response = await fetch("http://localhost:8080/medications/analyze-image", {
      method: "POST",
      // חשוב מאוד: כשמשתמשים ב-fetch עם FormData, אסור להגדיר Content-Type ידנית! 
      // הדפדפן צריך לקבוע אותו לבד כולל ה-boundary.
      body: formData, 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "שגיאה בניתוח התמונה");
    }

    const data = await response.json();
    console.log("Success! Data received:", data);
    
    // כאן תמשיך ללוגיקה שלך (למשל לעדכן את הסטייט של הטופס עם הפרטים שחזרו)

  } catch (error) {
    console.error("Upload failed:", error);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    // <Box
    //   className={`upload-dropzone ${dragOver ? "drag-over" : ""}`}
    //   onClick={() => !isLoading && inputRef.current?.click()}
    //   onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
    //   onDragLeave={() => setDragOver(false)}
    //   onDrop={onDrop}
    // >
    //   <input
    //     ref={inputRef}
    //     type="file"
    //     accept="image/*"
    //     hidden
    //     onChange={(e) => handleFile(e.target.files?.[0])}
    //   />
    //   {isLoading ? (
    //     <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
    //       <CircularProgress />
    //       <Typography>מנתח תמונה...</Typography>
    //     </Box>
    //   ) : (
    //     <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
    //       <CloudUploadIcon color="primary" sx={{ fontSize: 48 }} />
    //       <Typography variant="h6">העלאת תמונת מרשם</Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         לחץ או גרור תמונה לכאן כדי לזהות אוטומטית את פרטי התרופה
    //       </Typography>
    //       {preview && <img src={preview} alt="preview" style={{ maxWidth: 180, marginTop: 8, borderRadius: 8 }} />}
    //       <Button size="small" sx={{ mt: 1 }} variant="outlined">בחר קובץ</Button>
    //     </Box>
    //   )}
    // </Box>
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

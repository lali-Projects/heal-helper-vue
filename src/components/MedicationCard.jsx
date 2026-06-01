import { Card, CardContent, Typography, IconButton, Chip, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import MedicationIcon from "@mui/icons-material/Medication";

export default function MedicationCard({ med, onEdit, onDelete }) {
  return (
    <Card elevation={0} sx={{ p: 1, boxShadow: "0 4px 14px rgba(15,23,42,0.06)" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" gap={1} alignItems="center">
            <MedicationIcon color="primary" />
            <Typography variant="h6">{med.name}</Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => onEdit?.(med)}><EditIcon fontSize="small" /></IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete?.(med)}><DeleteIcon fontSize="small" /></IconButton>
          </Box>
        </Box>
        <Box display="flex" gap={1} mt={1.5} flexWrap="wrap">
          <Chip size="small" color="primary" variant="outlined" label={`${med.dosagePerDay} מנות ביום`} />
          <Chip size="small" icon={<EventIcon />} label={`עד ${med.endDate}`} />
          {med.fixedSchedule && <Chip size="small" color="secondary" label="זמנים קבועים" />}
        </Box>
      </CardContent>
    </Card>
  );
}

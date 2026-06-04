import { Card, CardContent, Typography, IconButton, Chip, Box, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import MedicationIcon from "@mui/icons-material/Medication";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const formatTime = (t) => {
  if (!t) return "";
  const parts = String(t).split(":");
  return `${parts[0]}:${parts[1] ?? "00"}`;
};

export default function MedicationCard({ med, onEdit, onDelete }) {
  const frequency = med.frequency ?? med.dosagePerDay;
  const schedules = med.schedules || [];

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

        {med.dosage && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            מינון: {med.dosage}
          </Typography>
        )}

        <Box display="flex" gap={1} mt={1.5} flexWrap="wrap">
          <Chip size="small" color="primary" variant="outlined" label={`${frequency ?? "?"} מנות ביום`} />
          <Chip size="small" icon={<EventIcon />} label={`עד ${med.endDate}`} />
          {med.fixedSchedule && <Chip size="small" color="secondary" label="זמנים קבועים" />}
        </Box>

        {schedules.length > 0 && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="caption" color="text.secondary">זמני נטילה</Typography>
            <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
              {schedules.map((s, i) => (
                <Chip key={s.id ?? i} size="small" icon={<AccessTimeIcon />} label={formatTime(s.timeOfDay)} />
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

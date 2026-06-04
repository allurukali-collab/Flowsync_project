import React from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

export const moduleTheme = {
  pageBg: "linear-gradient(160deg, #0f172a 0%, #16213e 45%, #1a2744 100%)",
  cardBg: "rgba(31, 42, 68, 0.92)",
  cardBorder: "1px solid rgba(255,255,255,0.08)",
  accent: "#00bcd4",
  accentSoft: "rgba(0, 188, 212, 0.15)",
  tableHead: "#243352",
  rowHover: "rgba(0, 188, 212, 0.06)",
};

const STATUS_COLORS = {
  ACTIVE: { bg: "rgba(76, 175, 80, 0.2)", color: "#81c784" },
  OPEN: { bg: "rgba(76, 175, 80, 0.2)", color: "#81c784" },
  APPROVED: { bg: "rgba(76, 175, 80, 0.2)", color: "#81c784" },
  VERIFIED: { bg: "rgba(76, 175, 80, 0.2)", color: "#81c784" },
  SUBMITTED: { bg: "rgba(33, 150, 243, 0.2)", color: "#64b5f6" },
  PENDING: { bg: "rgba(255, 193, 7, 0.2)", color: "#ffd54f" },
  DRAFT: { bg: "rgba(158, 158, 158, 0.2)", color: "#bdbdbd" },
  INCOMPLETE: { bg: "rgba(255, 152, 0, 0.2)", color: "#ffb74d" },
  REJECTED: { bg: "rgba(244, 67, 54, 0.2)", color: "#e57373" },
  HIGH: { bg: "rgba(244, 67, 54, 0.2)", color: "#ef5350" },
  MEDIUM: { bg: "rgba(255, 152, 0, 0.2)", color: "#ffa726" },
  LOW: { bg: "rgba(76, 175, 80, 0.2)", color: "#66bb6a" },
};

export function StatusBadge({ value }) {
  if (value == null || value === "") return <Typography sx={{ color: "grey.500" }}>—</Typography>;
  const key = String(value).toUpperCase().trim();
  const style = STATUS_COLORS[key] || { bg: moduleTheme.accentSoft, color: moduleTheme.accent };
  return (
    <Chip
      label={value}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 600,
        fontSize: "0.75rem",
        borderRadius: "8px",
      }}
    />
  );
}

export function ModuleLoading({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 10,
        gap: 2,
      }}
    >
      <CircularProgress sx={{ color: moduleTheme.accent }} />
      <Typography sx={{ color: "grey.400" }}>{message}</Typography>
    </Box>
  );
}

export function EmptyState({ title, message, onAdd, addLabel = "Add New" }) {
  return (
    <Paper
      sx={{
        p: 5,
        textAlign: "center",
        bgcolor: moduleTheme.cardBg,
        border: moduleTheme.cardBorder,
        borderRadius: 3,
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 56, color: "grey.600", mb: 2 }} />
      <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "grey.400", mb: 3, maxWidth: 420, mx: "auto" }}>
        {message}
      </Typography>
      {onAdd && (
        <Button variant="contained" onClick={onAdd} sx={{ bgcolor: moduleTheme.accent }}>
          {addLabel}
        </Button>
      )}
    </Paper>
  );
}

export function StatCards({ stats = [] }) {
  if (!stats.length) return null;
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((s) => (
        <Grid item xs={12} sm={6} md={3} key={s.label}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: moduleTheme.cardBg,
              border: moduleTheme.cardBorder,
              borderLeft: `4px solid ${s.color || moduleTheme.accent}`,
            }}
          >
            <Typography variant="body2" sx={{ color: "grey.400", mb: 0.5 }}>
              {s.label}
            </Typography>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
              {s.value ?? 0}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export function SearchFilterBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        mb: 2,
        minWidth: { xs: "100%", sm: 320 },
        "& .MuiOutlinedInput-root": {
          bgcolor: "rgba(0,0,0,0.2)",
          borderRadius: 2,
          color: "white",
          "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
          "&:hover fieldset": { borderColor: moduleTheme.accent },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "grey.500" }} />
          </InputAdornment>
        ),
      }}
    />
  );
}

export function RatingStars({ rating }) {
  const n = Math.min(5, Math.max(0, Number(rating) || 0));
  return (
    <Box sx={{ color: "#ffc107", letterSpacing: 1 }}>
      {"★".repeat(n)}
      <span style={{ color: "grey.600" }}>{"★".repeat(5 - n)}</span>
    </Box>
  );
}

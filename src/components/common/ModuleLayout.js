import React from "react";
import { Box, Typography, IconButton, Button, Paper } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { moduleTheme } from "../modules/moduleUi";

export default function ModuleLayout({ title, subtitle, children, action, onAdd, addLabel = "Add New" }) {
  const navigate = useNavigate();

  const headerAction =
    action ||
    (onAdd && (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
        sx={{
          bgcolor: moduleTheme.accent,
          borderRadius: 2,
          px: 2.5,
          textTransform: "none",
          fontWeight: 600,
          "&:hover": { bgcolor: "#00acc1" },
        }}
      >
        {addLabel}
      </Button>
    ));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: moduleTheme.pageBg,
        color: "white",
        px: { xs: 2, md: 4 },
        py: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.04)",
          border: moduleTheme.cardBorder,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <IconButton
          onClick={() => navigate("/dashboard")}
          sx={{
            color: "white",
            bgcolor: "rgba(0,0,0,0.25)",
            "&:hover": { bgcolor: "rgba(0,188,212,0.2)" },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: "white" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: "grey.400", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {headerAction}
      </Paper>
      {children}
    </Box>
  );
}

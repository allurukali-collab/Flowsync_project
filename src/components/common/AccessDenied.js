import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#1a1a2e",
        color: "white",
        gap: 2,
        px: 2,
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        Access Denied
      </Typography>
      <Typography variant="body1" color="grey.400" textAlign="center">
        You do not have permission to view this module.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </Box>
  );
}

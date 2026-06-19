import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import FlagIcon from "@mui/icons-material/Flag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SaveIcon from "@mui/icons-material/Save";
import ModuleLayout from "../common/ModuleLayout";
import api from "../../utils/api";
import { getStoredUser } from "../../hooks/useAuth";
import { isEmployeeDesignation } from "../../constants/roles";
import { ModuleLoading, moduleTheme } from "./moduleUi";

const FIELDS = [
  { key: "companyName", label: "Company Name", required: true },
  { key: "description", label: "About Description", multiline: true, rows: 4 },
  { key: "mission", label: "Mission", multiline: true, rows: 2 },
  { key: "vision", label: "Vision", multiline: true, rows: 2 },
  { key: "values", label: "Core Values", multiline: true, rows: 2 },
  { key: "contactEmail", label: "Contact Email" },
  { key: "contactPhone", label: "Contact Phone" },
  { key: "address", label: "Address", multiline: true, rows: 2 },
];

const safeText = (value, fallback = "Not updated yet") => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return fallback;
  }
  return value;
};

const commonPaperSx = {
  bgcolor: "rgba(8, 23, 50, 0.92)",
  border: "1px solid rgba(125, 190, 255, 0.16)",
  borderRadius: 4,
  boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
};

const inputSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.04)",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.18)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(36,217,255,0.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: moduleTheme.accent,
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.68)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: moduleTheme.accent,
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
};

export default function AboutPage() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const user = getStoredUser();
  const canEdit = !isEmployeeDesignation(user?.designation);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/api/about-us");
      const profile = res.data || {};
      setData(profile);
      setForm(profile);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await api.put("/api/about-us", form);
      const profile = res.data || {};
      setData(profile);
      setForm(profile);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModuleLayout
      title="About Us"
      subtitle="Company profile, mission, vision, values, and contact information."
    >
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: "rgba(244,67,54,0.12)",
            color: "#ffcdd2",
            border: "1px solid rgba(244,67,54,0.28)",
          }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <ModuleLoading message="Loading company profile..." />
      ) : canEdit ? (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Paper
              sx={{
                ...commonPaperSx,
                p: 3,
                height: "100%",
                background:
                  "linear-gradient(145deg, rgba(9,31,68,0.98), rgba(5,16,38,0.96))",
              }}
            >
              <Box
                sx={{
                  width: 66,
                  height: 66,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #24d9ff, #316cff)",
                  boxShadow: "0 14px 30px rgba(36,217,255,0.24)",
                  mb: 2.5,
                }}
              >
                <BusinessIcon sx={{ fontSize: 34, color: "white" }} />
              </Box>

              <Typography variant="h4" fontWeight={900} sx={{ color: "white", mb: 1 }}>
                Company Profile
              </Typography>

              <Typography sx={{ color: "rgba(230,242,255,0.7)", lineHeight: 1.7, mb: 3 }}>
                Update official company information used across employee modules.
              </Typography>

              <Stack spacing={1.3}>
                <Chip
                  label={safeText(form?.companyName, "Company name pending")}
                  sx={{
                    justifyContent: "flex-start",
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontWeight: 700,
                  }}
                />
                <Chip
                  label={safeText(form?.contactEmail, "Email pending")}
                  sx={{
                    justifyContent: "flex-start",
                    color: "rgba(230,242,255,0.78)",
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Paper sx={{ ...commonPaperSx, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={900} sx={{ color: "white" }}>
                    Edit About Details
                  </Typography>
                  <Typography sx={{ color: "rgba(230,242,255,0.62)", mt: 0.5 }}>
                    Fill the details carefully. These values will be shown to employees.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={
                    saving ? (
                      <CircularProgress size={16} sx={{ color: "#031426" }} />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    bgcolor: moduleTheme.accent,
                    color: "#031426",
                    fontWeight: 900,
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.1,
                    whiteSpace: "nowrap",
                    boxShadow: "0 12px 25px rgba(36,217,255,0.22)",
                    "&:hover": {
                      bgcolor: "#62fff0",
                    },
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />

              <Grid container spacing={2}>
                {FIELDS.map((f) => (
                  <Grid
                    item
                    xs={12}
                    md={
                      f.multiline ||
                      f.key === "companyName" ||
                      f.key === "address"
                        ? 12
                        : 6
                    }
                    key={f.key}
                  >
                    <TextField
                      label={f.required ? `${f.label} *` : f.label}
                      value={form[f.key] || ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      fullWidth
                      multiline={f.multiline}
                      rows={f.rows || 1}
                      sx={inputSx}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                ...commonPaperSx,
                p: { xs: 3, md: 5 },
                textAlign: "center",
                background:
                  "linear-gradient(145deg, rgba(10,31,66,0.98), rgba(5,16,38,0.96))",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  right: -80,
                  top: -80,
                  background: "rgba(36,217,255,0.12)",
                  filter: "blur(6px)",
                }}
              />

              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 4,
                  mx: "auto",
                  mb: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #24d9ff, #316cff)",
                  boxShadow: "0 16px 35px rgba(36,217,255,0.25)",
                }}
              >
                <BusinessIcon sx={{ fontSize: 38, color: "white" }} />
              </Box>

              <Typography variant="h3" fontWeight={900} sx={{ color: "white", mb: 1 }}>
                {safeText(data?.companyName, "Stibium Tech")}
              </Typography>

              <Typography
                sx={{
                  color: "rgba(230,242,255,0.72)",
                  maxWidth: 780,
                  mx: "auto",
                  lineHeight: 1.8,
                  fontSize: 16,
                }}
              >
                {safeText(data?.description)}
              </Typography>
            </Paper>
          </Grid>

          {[
            {
              title: "Our Mission",
              text: data?.mission,
              color: "#24d9ff",
              icon: <FlagIcon />,
            },
            {
              title: "Our Vision",
              text: data?.vision,
              color: "#8b5cf6",
              icon: <VisibilityIcon />,
            },
            {
              title: "Our Values",
              text: data?.values,
              color: "#22c55e",
              icon: <WorkspacePremiumIcon />,
            },
          ].map((block) => (
            <Grid item xs={12} md={4} key={block.title}>
              <Paper
                sx={{
                  ...commonPaperSx,
                  p: 3,
                  height: "100%",
                  borderTop: `4px solid ${block.color}`,
                  transition: "0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 22px 50px rgba(0,0,0,0.35)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: block.color,
                    bgcolor: `${block.color}20`,
                    mb: 2,
                  }}
                >
                  {block.icon}
                </Box>

                <Typography variant="h6" fontWeight={900} sx={{ color: "white", mb: 1.5 }}>
                  {block.title}
                </Typography>

                <Typography sx={{ color: "rgba(230,242,255,0.7)", lineHeight: 1.75 }}>
                  {safeText(block.text)}
                </Typography>
              </Paper>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Paper sx={{ ...commonPaperSx, p: 3 }}>
              <Typography variant="h6" fontWeight={900} sx={{ color: "white", mb: 2 }}>
                Contact Information
              </Typography>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2.5 }} />

              <Grid container spacing={2.5}>
                {[
                  {
                    icon: <EmailIcon />,
                    label: "Email",
                    value: data?.contactEmail,
                  },
                  {
                    icon: <PhoneIcon />,
                    label: "Phone",
                    value: data?.contactPhone,
                  },
                  {
                    icon: <PlaceIcon />,
                    label: "Address",
                    value: data?.address,
                  },
                ].map((item) => (
                  <Grid item xs={12} md={4} key={item.label}>
                    <Box
                      sx={{
                        p: 2,
                        height: "100%",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        bgcolor: "rgba(255,255,255,0.045)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Box sx={{ color: moduleTheme.accent, mt: 0.2 }}>
                        {item.icon}
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            color: "rgba(230,242,255,0.55)",
                            fontSize: 13,
                            mb: 0.4,
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography sx={{ color: "white", lineHeight: 1.5 }}>
                          {safeText(item.value)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </ModuleLayout>
  );
}
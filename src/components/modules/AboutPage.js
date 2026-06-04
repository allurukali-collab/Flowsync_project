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
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
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
      setData(res.data);
      setForm(res.data);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/api/about-us", form);
      setData(res.data);
      setForm(res.data);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModuleLayout
      title="About Us"
      subtitle="Company profile, mission, vision, and contact information."
    >
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
      {loading ? (
        <ModuleLoading message="Loading company profile..." />
      ) : canEdit ? (
        <Paper sx={{ p: 3, maxWidth: 800, bgcolor: moduleTheme.cardBg, border: moduleTheme.cardBorder, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ color: "white", mb: 2 }}>Edit Company Profile</Typography>
          {FIELDS.map((f) => (
            <TextField
              key={f.key}
              label={f.required ? `${f.label} *` : f.label}
              value={form[f.key] || ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              fullWidth
              multiline={f.multiline}
              rows={f.rows || 1}
              sx={{ mb: 2, "& .MuiInputBase-input": { color: "white" } }}
            />
          ))}
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: moduleTheme.accent }}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 4, bgcolor: moduleTheme.cardBg, border: moduleTheme.cardBorder, borderRadius: 3, textAlign: "center" }}>
              <BusinessIcon sx={{ fontSize: 48, color: moduleTheme.accent, mb: 2 }} />
              <Typography variant="h4" fontWeight={700} sx={{ color: "white", mb: 1 }}>
                {data?.companyName}
              </Typography>
              <Typography sx={{ color: "grey.300", maxWidth: 640, mx: "auto" }}>
                {data?.description}
              </Typography>
            </Paper>
          </Grid>
          {[
            { title: "Our Mission", text: data?.mission, color: "#00bcd4" },
            { title: "Our Vision", text: data?.vision, color: "#7e57c2" },
            { title: "Our Values", text: data?.values, color: "#4caf50" },
          ].map((block) => (
            <Grid item xs={12} md={4} key={block.title}>
              <Paper
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: moduleTheme.cardBg,
                  border: moduleTheme.cardBorder,
                  borderRadius: 2,
                  borderTop: `3px solid ${block.color}`,
                }}
              >
                <Typography variant="h6" sx={{ color: "white", mb: 1.5 }}>
                  {block.title}
                </Typography>
                <Typography sx={{ color: "grey.300", lineHeight: 1.7 }}>{block.text}</Typography>
              </Paper>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: moduleTheme.cardBg, border: moduleTheme.cardBorder, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: "white", mb: 2 }}>Contact Information</Typography>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ color: moduleTheme.accent }} />
                  <Typography sx={{ color: "grey.300" }}>{data?.contactEmail}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon sx={{ color: moduleTheme.accent }} />
                  <Typography sx={{ color: "grey.300" }}>{data?.contactPhone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PlaceIcon sx={{ color: moduleTheme.accent }} />
                  <Typography sx={{ color: "grey.300" }}>{data?.address}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </ModuleLayout>
  );
}

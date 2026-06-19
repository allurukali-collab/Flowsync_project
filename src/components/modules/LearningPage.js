import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const emptyForm = {
  courseTitle: "",
  category: "",
  trainer: "",
  duration: "",
  level: "Beginner",
  description: "",
  skills: "",
  resourceLink: "",
  status: "ACTIVE",
  createdBy: "Admin",
  startDate: "",
  endDate: "",
};

const getStatus = (course) => {
  return String(course?.status || "ACTIVE").toUpperCase();
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Not scheduled";
  }

  return String(dateValue).split("T")[0];
};

export default function LearningPage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const fetchLearning = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/learning`);

      if (!response.ok) {
        throw new Error("Unable to load learning courses");
      }

      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Learning fetch error:", error);
      showMessage("Unable to load learning courses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearning();
  }, []);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return courses;
    }

    return courses.filter((course) => {
      return (
        String(course.courseTitle || "").toLowerCase().includes(term) ||
        String(course.category || "").toLowerCase().includes(term) ||
        String(course.trainer || "").toLowerCase().includes(term) ||
        String(course.level || "").toLowerCase().includes(term) ||
        String(course.status || "").toLowerCase().includes(term)
      );
    });
  }, [courses, searchTerm]);

  const activeCount = courses.filter((course) => getStatus(course) === "ACTIVE").length;
  const inactiveCount = courses.filter((course) => getStatus(course) === "INACTIVE").length;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenDialog = () => {
    setForm(emptyForm);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setForm(emptyForm);
  };

  const handleCreateLearning = async () => {
    if (!form.courseTitle.trim()) {
      showMessage("Course title is required", "error");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        courseTitle: form.courseTitle.trim(),
        category: form.category.trim(),
        trainer: form.trainer.trim(),
        duration: form.duration.trim(),
        level: form.level.trim() || "Beginner",
        description: form.description.trim(),
        skills: form.skills.trim(),
        resourceLink: form.resourceLink.trim(),
        status: "ACTIVE",
        createdBy: form.createdBy || "Admin",
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      const response = await fetch(`${API_BASE_URL}/api/learning`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to create learning course");
      }

      showMessage("Learning course created successfully", "success");
      setOpenDialog(false);
      setForm(emptyForm);
      await fetchLearning();
    } catch (error) {
      console.error("Learning create error:", error);
      showMessage(error.message || "Unable to create learning course", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateLearning = async (learningId) => {
    if (!learningId) {
      showMessage("Learning id not found", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/learning/${learningId}/deactivate`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Unable to deactivate learning course");
      }

      showMessage("Learning course deactivated successfully", "success");
      await fetchLearning();
    } catch (error) {
      console.error("Learning deactivate error:", error);
      showMessage("Unable to deactivate learning course", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 4 },
        py: 3,
        color: "white",
        background:
          "radial-gradient(circle at top left, rgba(124,77,255,0.20), transparent 30%), linear-gradient(135deg, #071225 0%, #111a38 45%, #1b2550 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(44,39,100,0.96), rgba(18,33,66,0.96))",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => navigate("/dashboard")}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.08)",
                width: 48,
                height: 48,
                "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <Box>
              <Typography variant="h4" fontWeight={900}>
                Learning
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.5 }}>
                Create, manage and track internal learning programs.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 2.5,
              fontWeight: 900,
              bgcolor: "#7c4dff",
              color: "white",
              textTransform: "none",
              boxShadow: "0 12px 25px rgba(124,77,255,0.30)",
              "&:hover": { bgcolor: "#6a3de8" },
            }}
          >
            Add Course
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <SummaryCard title="Total Courses" value={courses.length} icon={<SchoolIcon />} />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard title="Active Courses" value={activeCount} icon={<SignalCellularAltIcon />} />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard title="Inactive Courses" value={inactiveCount} icon={<CloseIcon />} />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: "rgba(15,31,65,0.92)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
        }}
      >
        <TextField
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by course, category, trainer, level, status..."
          fullWidth
          sx={inputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "rgba(255,255,255,0.6)" }} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ p: 7, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : filteredCourses.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: "center",
            color: "white",
            borderRadius: 4,
            background: "rgba(15,31,65,0.94)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: 64,
              color: "rgba(255,255,255,0.35)",
              mb: 2,
            }}
          />

          <Typography variant="h6" fontWeight={900}>
            No learning courses available
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 1 }}>
            Create your first learning course using the Add Course button.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {filteredCourses.map((course) => {
            const status = getStatus(course);
            const isActive = status === "ACTIVE";

            return (
              <Grid item xs={12} md={6} lg={4} key={course.learningId}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    background:
                      "linear-gradient(145deg, rgba(24,31,75,0.97), rgba(11,23,52,0.97))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
                    transition: "0.22s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "rgba(124,77,255,0.45)",
                      boxShadow: "0 20px 50px rgba(124,77,255,0.14)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={900}>
                          {course.courseTitle || "-"}
                        </Typography>

                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.58)",
                            fontSize: 13,
                            mt: 0.6,
                          }}
                        >
                          Created by {course.createdBy || "Admin"}
                        </Typography>
                      </Box>

                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          fontWeight: 900,
                          color: isActive ? "#8df5a6" : "#80d8ff",
                          bgcolor: isActive
                            ? "rgba(76,175,80,0.18)"
                            : "rgba(3,169,244,0.18)",
                          borderRadius: 2,
                        }}
                      />
                    </Stack>

                    <Stack spacing={1.4} sx={{ mt: 2.5 }}>
                      <InfoRow icon={<CategoryOutlinedIcon />} label={course.category || "General"} />
                      <InfoRow icon={<PersonOutlineIcon />} label={course.trainer || "Trainer not assigned"} />
                      <InfoRow icon={<AccessTimeIcon />} label={course.duration || "Duration not added"} />
                      <InfoRow icon={<SignalCellularAltIcon />} label={course.level || "Beginner"} />
                      <InfoRow icon={<CalendarMonthIcon />} label={`Start: ${formatDate(course.startDate)}`} />
                      <InfoRow icon={<CalendarMonthIcon />} label={`End: ${formatDate(course.endDate)}`} />
                    </Stack>

                    <Box sx={{ mt: 2.5 }}>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: 13,
                          fontWeight: 800,
                          mb: 0.8,
                        }}
                      >
                        Skills Covered
                      </Typography>

                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.58)",
                          fontSize: 14,
                          minHeight: 40,
                        }}
                      >
                        {course.skills || "Not added"}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2.5 }}>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: 13,
                          fontWeight: 800,
                          mb: 0.8,
                        }}
                      >
                        Description
                      </Typography>

                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.58)",
                          fontSize: 14,
                          minHeight: 52,
                        }}
                      >
                        {course.description || "No description added"}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                      sx={{ mt: 3 }}
                    >
                      {course.resourceLink ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<LinkIcon />}
                          onClick={() => window.open(course.resourceLink, "_blank")}
                          sx={{
                            color: "#b39ddb",
                            borderColor: "rgba(179,157,219,0.45)",
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: 2,
                            "&:hover": {
                              borderColor: "#b39ddb",
                              bgcolor: "rgba(179,157,219,0.08)",
                            },
                          }}
                        >
                          Resource
                        </Button>
                      ) : (
                        <span />
                      )}

                      {isActive ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CloseIcon />}
                          onClick={() => handleDeactivateLearning(course.learningId)}
                          sx={{
                            color: "#ff8a80",
                            borderColor: "rgba(255,138,128,0.45)",
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: 2,
                            "&:hover": {
                              borderColor: "#ff8a80",
                              bgcolor: "rgba(255,138,128,0.08)",
                            },
                          }}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Chip
                          label="Inactive"
                          size="small"
                          sx={{
                            color: "rgba(255,255,255,0.55)",
                            bgcolor: "rgba(255,255,255,0.08)",
                            fontWeight: 800,
                          }}
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background:
              "linear-gradient(135deg, rgba(20,33,63,0.98), rgba(12,25,54,0.98))",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>
          Add Learning Course

          <Typography
            sx={{
              color: "rgba(255,255,255,0.62)",
              fontSize: 14,
              mt: 0.5,
            }}
          >
            Fill course details and publish a new learning item.
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Course Title"
                name="courseTitle"
                value={form.courseTitle}
                onChange={handleChange}
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Technical / Soft Skills"
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Trainer"
                name="trainer"
                value={form.trainer}
                onChange={handleChange}
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="4 Weeks / 12 Hours"
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Level"
                name="level"
                value={form.level}
                onChange={handleChange}
                placeholder="Beginner / Intermediate / Advanced"
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Resource Link"
                name="resourceLink"
                value={form.resourceLink}
                onChange={handleChange}
                placeholder="https://..."
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Start Date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                fullWidth
                sx={inputStyle}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="End Date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                fullWidth
                sx={inputStyle}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Skills Covered"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Java, Spring Boot, React, Communication"
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                sx={inputStyle}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={saving}
            sx={{
              color: "rgba(255,255,255,0.75)",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateLearning}
            disabled={saving}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              bgcolor: "#7c4dff",
              textTransform: "none",
              fontWeight: 900,
              "&:hover": { bgcolor: "#6a3de8" },
            }}
          >
            {saving ? <CircularProgress size={22} color="inherit" /> : "Create Course"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        background:
          "linear-gradient(135deg, rgba(31,39,92,0.96), rgba(13,27,58,0.96))",
        border: "1px solid rgba(255,255,255,0.09)",
        color: "white",
        boxShadow: "0 14px 35px rgba(0,0,0,0.18)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
            {title}
          </Typography>

          <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(124,77,255,0.16)",
            color: "#b39ddb",
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

function InfoRow({ icon, label }) {
  return (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="center"
      sx={{ color: "rgba(255,255,255,0.72)", fontSize: 14 }}
    >
      <Box
        sx={{
          color: "#b39ddb",
          display: "flex",
          "& svg": {
            fontSize: 19,
          },
        }}
      >
        {icon}
      </Box>

      <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.72)" }}>
        {label}
      </Typography>
    </Stack>
  );
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    backgroundColor: "rgba(255,255,255,0.045)",
    borderRadius: 2,
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.14)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.35)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7c4dff",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.65)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#b39ddb",
  },
  "& input::placeholder": {
    color: "rgba(255,255,255,0.45)",
    opacity: 1,
  },
  "& textarea::placeholder": {
    color: "rgba(255,255,255,0.45)",
    opacity: 1,
  },
};
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const emptyForm = {
  jobTitle: "",
  department: "",
  location: "",
  employmentType: "",
  experience: "",
  description: "",
  skills: "",
  status: "OPEN",
  postedBy: "Admin",
  closingDate: "",
};

const getCareerType = (career) => {
  return (
    career?.employmentType ||
    career?.type ||
    career?.jobType ||
    career?.employment_type ||
    "-"
  );
};

const getStatus = (career) => {
  return String(career?.status || "OPEN").toUpperCase();
};

export default function Careers() {
  const navigate = useNavigate();

  const [careers, setCareers] = useState([]);
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

  const fetchCareers = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/careers`);

      if (!response.ok) {
        throw new Error("Unable to load career openings");
      }

      const data = await response.json();
      setCareers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Career fetch error:", error);
      showMessage("Unable to load career openings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const filteredCareers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return careers;
    }

    return careers.filter((career) => {
      return (
        String(career.jobTitle || "").toLowerCase().includes(term) ||
        String(career.department || "").toLowerCase().includes(term) ||
        String(career.location || "").toLowerCase().includes(term) ||
        String(getCareerType(career)).toLowerCase().includes(term) ||
        String(career.experience || "").toLowerCase().includes(term) ||
        String(career.status || "").toLowerCase().includes(term)
      );
    });
  }, [careers, searchTerm]);

  const openCount = careers.filter((career) => getStatus(career) === "OPEN").length;
  const closedCount = careers.filter((career) => getStatus(career) === "CLOSED").length;

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
    if (saving) {
      return;
    }

    setOpenDialog(false);
    setForm(emptyForm);
  };

  const handleCreateCareer = async () => {
    if (!form.jobTitle.trim()) {
      showMessage("Job title is required", "error");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        jobTitle: form.jobTitle.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        employmentType: form.employmentType.trim(),
        experience: form.experience.trim(),
        description: form.description.trim(),
        skills: form.skills.trim(),
        status: "OPEN",
        postedBy: form.postedBy || "Admin",
        closingDate: form.closingDate || null,
      };

      const response = await fetch(`${API_BASE_URL}/api/careers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to create career opening");
      }

      showMessage("Career opening created successfully", "success");
      setOpenDialog(false);
      setForm(emptyForm);
      await fetchCareers();
    } catch (error) {
      console.error("Career create error:", error);
      showMessage(error.message || "Unable to create career opening", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseCareer = async (careerId) => {
    if (!careerId) {
      showMessage("Career id not found", "error");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/careers/${careerId}/close`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to close career opening");
      }

      showMessage("Career opening closed successfully", "success");
      await fetchCareers();
    } catch (error) {
      console.error("Career close error:", error);
      showMessage("Unable to close career opening", "error");
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
          "radial-gradient(circle at top left, rgba(0,188,212,0.18), transparent 30%), linear-gradient(135deg, #071225 0%, #0f1d3c 45%, #132447 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(31,49,92,0.96), rgba(18,33,66,0.96))",
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
                Careers
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.5 }}>
                Manage job openings and internal career opportunities.
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
              bgcolor: "#00bcd4",
              color: "white",
              textTransform: "none",
              boxShadow: "0 12px 25px rgba(0,188,212,0.28)",
              "&:hover": { bgcolor: "#00a3bb" },
            }}
          >
            Add New
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Total Openings"
            value={careers.length}
            icon={<BusinessCenterIcon />}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Open Positions"
            value={openCount}
            icon={<WorkOutlineIcon />}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Closed Positions"
            value={closedCount}
            icon={<CloseIcon />}
          />
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
          placeholder="Search by title, department, location, type, experience, status..."
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

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          background: "rgba(15,31,65,0.94)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.4,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={900} color="white">
              Career Openings
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
              Showing {filteredCareers.length} of {careers.length} records
            </Typography>
          </Box>

          <Chip
            label={`${openCount} Open`}
            size="small"
            sx={{
              color: "#8df5a6",
              bgcolor: "rgba(76,175,80,0.15)",
              fontWeight: 900,
              px: 1,
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ p: 7, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : filteredCareers.length === 0 ? (
          <Box sx={{ p: 8, textAlign: "center", color: "white" }}>
            <WorkOutlineIcon
              sx={{
                fontSize: 64,
                color: "rgba(255,255,255,0.35)",
                mb: 2,
              }}
            />

            <Typography variant="h6" fontWeight={900}>
              No job openings available
            </Typography>

            <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 1 }}>
              Create your first job opening using the Add New button.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                  }}
                >
                  <HeaderCell>Job Details</HeaderCell>
                  <HeaderCell>Department</HeaderCell>
                  <HeaderCell>Location</HeaderCell>
                  <HeaderCell>Type</HeaderCell>
                  <HeaderCell>Experience</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell align="right">Action</HeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCareers.map((career) => {
                  const status = getStatus(career);
                  const isOpen = status === "OPEN";
                  const careerType = getCareerType(career);

                  return (
                    <TableRow
                      key={career.careerId}
                      sx={{
                        transition: "0.2s ease",
                        "&:hover": {
                          background: "rgba(0,188,212,0.06)",
                        },
                      }}
                    >
                      <BodyCell>
                        <Typography fontWeight={900}>
                          {career.jobTitle || "-"}
                        </Typography>

                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.58)",
                            fontSize: 13,
                            mt: 0.6,
                            maxWidth: 360,
                          }}
                        >
                          Skills: {career.skills || "-"}
                        </Typography>
                      </BodyCell>

                      <BodyCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ApartmentOutlinedIcon
                            sx={{
                              fontSize: 18,
                              color: "rgba(255,255,255,0.45)",
                            }}
                          />
                          <span>{career.department || "-"}</span>
                        </Stack>
                      </BodyCell>

                      <BodyCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnOutlinedIcon
                            sx={{
                              fontSize: 18,
                              color: "rgba(255,255,255,0.45)",
                            }}
                          />
                          <span>{career.location || "-"}</span>
                        </Stack>
                      </BodyCell>

                      <BodyCell>
                        <Chip
                          label={careerType}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 800,
                            borderRadius: 2,
                          }}
                        />
                      </BodyCell>

                      <BodyCell>{career.experience || "-"}</BodyCell>

                      <BodyCell>
                        <Chip
                          label={status}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            letterSpacing: 0.4,
                            color: isOpen ? "#8df5a6" : "#80d8ff",
                            bgcolor: isOpen
                              ? "rgba(76,175,80,0.18)"
                              : "rgba(3,169,244,0.18)",
                            border: isOpen
                              ? "1px solid rgba(141,245,166,0.18)"
                              : "1px solid rgba(128,216,255,0.18)",
                            borderRadius: 2,
                          }}
                        />
                      </BodyCell>

                      <BodyCell align="right">
                        {isOpen ? (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={() => handleCloseCareer(career.careerId)}
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
                            Close
                          </Button>
                        ) : (
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.45)",
                              fontWeight: 700,
                            }}
                          >
                            Closed
                          </Typography>
                        )}
                      </BodyCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

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
          Add New Career Opening
          <Typography
            sx={{
              color: "rgba(255,255,255,0.62)",
              fontSize: 14,
              mt: 0.5,
            }}
          >
            Fill job details and publish a new opening.
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Job Title"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Employment Type"
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
                placeholder="Full Time / Contract / Internship"
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="1-3 Years"
                fullWidth
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Closing Date"
                name="closingDate"
                value={form.closingDate}
                onChange={handleChange}
                fullWidth
                sx={inputStyle}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Java, Spring Boot, React, MySQL"
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
            onClick={handleCreateCareer}
            disabled={saving}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              bgcolor: "#00bcd4",
              textTransform: "none",
              fontWeight: 900,
              "&:hover": { bgcolor: "#00a3bb" },
            }}
          >
            {saving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Create Opening"
            )}
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
          "linear-gradient(135deg, rgba(16,37,78,0.96), rgba(13,27,58,0.96))",
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
            bgcolor: "rgba(0,188,212,0.14)",
            color: "#00d8f0",
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

function HeaderCell({ children, align = "left" }) {
  return (
    <TableCell
      align={align}
      sx={{
        color: "rgba(255,255,255,0.75)",
        fontWeight: 900,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        py: 2,
        fontSize: 14,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </TableCell>
  );
}

function BodyCell({ children, align = "left" }) {
  return (
    <TableCell
      align={align}
      sx={{
        color: "white",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        py: 2.2,
        fontSize: 14,
      }}
    >
      {children}
    </TableCell>
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
      borderColor: "#00bcd4",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.65)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#00bcd4",
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
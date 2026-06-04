import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  Link as MuiLink,
  MenuItem,
  Paper,
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
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import BlockIcon from "@mui/icons-material/Block";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const API_BASE_URL = "http://localhost:8080";

const MONTHS = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

const getEmployeeId = (employee) =>
  employee?.employeeId || employee?.empId || employee?.id || "";

const getEmployeeName = (employee) =>
  employee?.name || employee?.employeeName || employee?.fullName || "-";

const getCurrentYear = () => new Date().getFullYear();

const sortStopSalaryRecords = (data) => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();

    if (dateB !== dateA) {
      return dateB - dateA;
    }

    return Number(b.stopSalaryId || b.id || 0) - Number(a.stopSalaryId || a.id || 0);
  });
};

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "rgba(15, 23, 42, 0.78)",
        border: "1px solid rgba(147,197,253,0.24)",
        borderRadius: 4,
        boxShadow: "0 20px 55px rgba(0,0,0,0.35)",
        backdropFilter: "blur(14px)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography
              sx={{
                color: "rgba(219,234,254,0.65)",
                fontSize: 12,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 0.7,
              }}
            >
              {title}
            </Typography>

            <Typography sx={{ color: "white", fontSize: 26, fontWeight: 900, mt: 1 }}>
              {value}
            </Typography>

            <Typography sx={{ color: "rgba(219,234,254,0.55)", fontSize: 13, mt: 1 }}>
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(37,99,235,0.24)",
              color: "#bfdbfe",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function StopSalaryProcessing() {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);

  const [salaryMonth, setSalaryMonth] = useState(5);
  const [salaryYear, setSalaryYear] = useState(getCurrentYear());
  const [reason, setReason] = useState("");

  const [records, setRecords] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedEmployeeId = getEmployeeId(employee);

  const getRecordEmployeeName = (record) => {
    if (record.employeeName) {
      return record.employeeName;
    }

    const matchedEmployee = employees.find(
      (item) => String(getEmployeeId(item)) === String(record.employeeId)
    );

    return getEmployeeName(matchedEmployee);
  };

  const stoppedRecords = useMemo(() => {
    return records.filter(
      (item) => String(item.status || "").toUpperCase() === "STOPPED"
    );
  }, [records]);

  const resumedRecords = useMemo(() => {
    return records.filter(
      (item) => String(item.status || "").toUpperCase() === "RESUMED"
    );
  }, [records]);

  const currentMonthStopped = useMemo(() => {
    return records.filter(
      (item) =>
        Number(item.salaryMonth) === Number(salaryMonth) &&
        Number(item.salaryYear) === Number(salaryYear) &&
        String(item.status || "").toUpperCase() === "STOPPED"
    ).length;
  }, [records, salaryMonth, salaryYear]);

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/employee/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load employees");
      }

      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Employee load error:", err);
      setError("Unable to load employees. Please check backend.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadAllStopSalaryRecords = async () => {
    try {
      setLoadingRecords(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/payroll/stop-salary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Stop Salary API is not created yet.");
      }

      const data = await response.json();
      setRecords(Array.isArray(data) ? sortStopSalaryRecords(data) : []);
    } catch (err) {
      console.warn("Stop salary records not loaded:", err);
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const loadEmployeeStopSalaryRecords = async (employeeId) => {
    if (!employeeId) {
      loadAllStopSalaryRecords();
      return;
    }

    try {
      setLoadingRecords(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/stop-salary/employee/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Stop Salary employee API is not created yet.");
      }

      const data = await response.json();
      setRecords(Array.isArray(data) ? sortStopSalaryRecords(data) : []);
    } catch (err) {
      console.warn("Employee stop salary records not loaded:", err);
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadAllStopSalaryRecords();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      loadEmployeeStopSalaryRecords(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const handleEmployeeChange = (_, value) => {
    setEmployee(value);
    setError("");
    setSuccessMessage("");

    if (!value) {
      loadAllStopSalaryRecords();
    }
  };

  const handleStopSalary = async () => {
    try {
      setError("");
      setSuccessMessage("");

      if (!selectedEmployeeId) {
        setError("Please select employee.");
        return;
      }

      if (!reason.trim()) {
        setError("Please enter stop salary reason.");
        return;
      }

      setProcessing(true);

      const token = localStorage.getItem("token");

      const payload = {
        employeeId: Number(selectedEmployeeId),
        salaryMonth: Number(salaryMonth),
        salaryYear: Number(salaryYear),
        reason,
        createdBy: "ADMIN",
      };

      const response = await fetch(`${API_BASE_URL}/api/payroll/stop-salary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Backend Stop Salary API is not created yet.");
      }

      const saved = await response.json();

      setSuccessMessage(
        `Salary stopped for ${saved.employeeName || getEmployeeName(employee)}.`
      );

      setReason("");

      await loadEmployeeStopSalaryRecords(selectedEmployeeId);
    } catch (err) {
      console.error("Stop salary error:", err);
      setError(err.message || "Unable to stop salary processing.");
    } finally {
      setProcessing(false);
    }
  };

  const handleResumeSalary = async (record) => {
    try {
      setError("");
      setSuccessMessage("");
      setProcessingId(record.stopSalaryId || record.id);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/stop-salary/${record.stopSalaryId || record.id}/resume`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to resume salary.");
      }

      setSuccessMessage("Salary resumed successfully.");

      if (selectedEmployeeId) {
        await loadEmployeeStopSalaryRecords(selectedEmployeeId);
      } else {
        await loadAllStopSalaryRecords();
      }
    } catch (err) {
      console.error("Resume salary error:", err);
      setError(err.message || "Unable to resume salary.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.45), transparent 32%), radial-gradient(circle at top right, rgba(14,165,233,0.28), transparent 35%), linear-gradient(135deg, #06152e 0%, #082f49 48%, #0f172a 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />

      <Box sx={{ p: 2 }}>
        <Breadcrumbs
          separator=">"
          sx={{
            "& .MuiBreadcrumbs-separator": {
              color: "rgba(219,234,254,0.45)",
            },
          }}
        >
          <MuiLink
            component={RouterLink}
            to="/welcome"
            sx={{ color: "#dbeafe", textDecoration: "none", fontWeight: 700 }}
          >
            Home
          </MuiLink>

          <MuiLink
            component={RouterLink}
            to="/updatepayroll"
            sx={{ color: "#dbeafe", textDecoration: "none", fontWeight: 700 }}
          >
            Payroll
          </MuiLink>

          <Typography sx={{ color: "white", fontWeight: 800 }}>
            Stop Salary Processing
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(147, 197, 253, 0.28)",
            mb: 3,
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Typography sx={{ fontSize: 28, fontWeight: 900, color: "white" }}>
            Stop Salary Processing
          </Typography>

          <Typography sx={{ color: "rgba(219,234,254,0.72)", mt: 0.8, mb: 3 }}>
            Stop salary processing for selected employee and payroll month.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3.5}>
              <Autocomplete
                fullWidth
                loading={loadingEmployees}
                options={employees}
                value={employee}
                getOptionLabel={(option) =>
                  option ? `${getEmployeeName(option)} — #${getEmployeeId(option)}` : ""
                }
                isOptionEqualToValue={(option, value) =>
                  String(getEmployeeId(option)) === String(getEmployeeId(value))
                }
                onChange={handleEmployeeChange}
                sx={{
                  minWidth: { xs: "100%", md: 360 },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee"
                    placeholder="Search employee"
                    InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "rgba(219,234,254,0.65)" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {loadingEmployees ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={fieldStyle}
                  />
                )}
                PaperComponent={(props) => (
                  <Paper
                    {...props}
                    sx={{
                      bgcolor: "rgba(15,23,42,0.98)",
                      color: "white",
                      border: "1px solid rgba(147,197,253,0.20)",
                      minWidth: 320,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <TextField
                select
                fullWidth
                label="Month"
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                sx={fieldStyle}
              >
                {MONTHS.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={1.3}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={salaryYear}
                onChange={(e) => setSalaryYear(e.target.value)}
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12} md={4.2}>
              <TextField
                fullWidth
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Example: Employee resigned / salary hold / payroll hold"
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<BlockIcon />}
                onClick={handleStopSalary}
                disabled={processing}
                sx={{
                  height: "56px",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                  bgcolor: "#dc2626",
                }}
              >
                {processing ? "Stopping..." : "Stop Salary"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  if (selectedEmployeeId) {
                    loadEmployeeStopSalaryRecords(selectedEmployeeId);
                  } else {
                    loadAllStopSalaryRecords();
                  }
                }}
                disabled={loadingRecords}
                sx={{
                  color: "#dbeafe",
                  borderColor: "rgba(147,197,253,0.55)",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 800,
                }}
              >
                Refresh Records
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Employee"
              value={selectedEmployeeId || "-"}
              subtitle={employee ? getEmployeeName(employee) : "All stop salary records"}
              icon={<PersonIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Stopped Salaries"
              value={stoppedRecords.length}
              subtitle="Currently stopped"
              icon={<BlockIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Current Month Holds"
              value={currentMonthStopped}
              subtitle={`${MONTHS.find((m) => Number(m.value) === Number(salaryMonth))?.label} ${salaryYear}`}
              icon={<CalendarMonthIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Resumed Records"
              value={resumedRecords.length}
              subtitle="Salary resumed"
              icon={<WarningAmberIcon />}
            />
          </Grid>
        </Grid>

        <Paper
          sx={{
            borderRadius: 4,
            bgcolor: "rgba(15, 23, 42, 0.78)",
            border: "1px solid rgba(147,197,253,0.24)",
            boxShadow: "0 24px 70px rgba(15,23,42,0.45)",
            backdropFilter: "blur(16px)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              bgcolor: "rgba(30,64,175,0.55)",
              borderBottom: "1px solid rgba(147,197,253,0.24)",
            }}
          >
            <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900 }}>
              Stop Salary Records
            </Typography>
          </Box>

          <TableContainer sx={{ maxHeight: 480 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "Employee",
                    "Month",
                    "Status",
                    "Reason",
                    "Created By",
                    "Created At",
                    "Action",
                  ].map((header) => (
                    <TableCell key={header} sx={headerCellStyle}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loadingRecords && (
                  <TableRow>
                    <TableCell colSpan={8} sx={emptyCellStyle}>
                      Loading stop salary records...
                    </TableCell>
                  </TableRow>
                )}

                {!loadingRecords &&
                  records.map((record, index) => {
                    const status = String(record.status || "STOPPED").toUpperCase();
                    const recordId = record.stopSalaryId || record.id;

                    return (
                      <TableRow
                        key={recordId || index}
                        sx={{
                          bgcolor:
                            index % 2 === 0
                              ? "rgba(15,23,42,0.92)"
                              : "rgba(30,41,59,0.82)",
                        }}
                      >
                        <TableCell sx={bodyCellStyle}>{index + 1}</TableCell>
                        <TableCell sx={bodyCellStyle}>
                          {getRecordEmployeeName(record)} — #{record.employeeId}
                        </TableCell>
                        <TableCell sx={bodyCellStyle}>
                          {MONTHS.find(
                            (m) => Number(m.value) === Number(record.salaryMonth)
                          )?.label || record.salaryMonth}{" "}
                          {record.salaryYear}
                        </TableCell>
                        <TableCell sx={bodyCellStyle}>
                          <Chip
                            size="small"
                            label={status}
                            sx={{
                              color: "white",
                              bgcolor:
                                status === "STOPPED"
                                  ? "rgba(239,68,68,0.65)"
                                  : "rgba(34,197,94,0.55)",
                              fontWeight: 900,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyle,
                            whiteSpace: "normal",
                            minWidth: 250,
                          }}
                        >
                          {record.reason || "-"}
                        </TableCell>
                        <TableCell sx={bodyCellStyle}>{record.createdBy || "-"}</TableCell>
                        <TableCell sx={bodyCellStyle}>
                          {record.createdAt
                            ? new Date(record.createdAt).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell sx={bodyCellStyle}>
                          {status === "STOPPED" ? (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<PlayCircleIcon />}
                              disabled={processingId === recordId}
                              onClick={() => handleResumeSalary(record)}
                              sx={{
                                bgcolor: "#16a34a",
                                textTransform: "none",
                                fontWeight: 900,
                              }}
                            >
                              Resume
                            </Button>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                {!loadingRecords && records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} sx={emptyCellStyle}>
                      No stop salary records found. Backend API will be created in next step.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    bgcolor: "rgba(15,23,42,0.72)",
    borderRadius: 2,
  },
  "& fieldset": {
    borderColor: "rgba(147,197,253,0.28)",
  },
  "&:hover fieldset": {
    borderColor: "rgba(147,197,253,0.55)",
  },
  "& .MuiSelect-icon": {
    color: "white",
  },
};

const headerCellStyle = {
  color: "white",
  bgcolor: "#1e3a8a",
  fontWeight: 900,
  borderColor: "rgba(147,197,253,0.28)",
  whiteSpace: "nowrap",
};

const bodyCellStyle = {
  color: "rgba(226,232,240,0.92)",
  borderColor: "rgba(147,197,253,0.12)",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const emptyCellStyle = {
  color: "#dbeafe",
  textAlign: "center",
  py: 5,
  fontWeight: 900,
  bgcolor: "rgba(15,23,42,0.92)",
};
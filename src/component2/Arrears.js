import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const API_BASE_URL = "http://localhost:8080";

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#ffffff",
    bgcolor: "rgba(15, 23, 42, 0.78)",
    borderRadius: 2,
    "& fieldset": {
      borderColor: "rgba(148, 163, 184, 0.35)",
    },
    "&:hover fieldset": {
      borderColor: "#60a5fa",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#60a5fa",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#cbd5e1",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
  },
  "& .MuiSvgIcon-root": {
    color: "#cbd5e1",
  },
};

const cardStyle = {
  bgcolor: "rgba(15, 23, 42, 0.86)",
  color: "#ffffff",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  borderRadius: 3,
  boxShadow: "0 14px 35px rgba(0,0,0,0.24)",
};

const paperStyle = {
  p: 3,
  bgcolor: "rgba(15, 23, 42, 0.88)",
  color: "#ffffff",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  borderRadius: 3,
  boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
};

const getCurrentEmployeeId = () => {
  return (
    localStorage.getItem("employeeId") ||
    localStorage.getItem("empId") ||
    localStorage.getItem("userEmployeeId") ||
    localStorage.getItem("loggedInEmployeeId") ||
    "ADMIN"
  );
};

export default function Arrears() {
  const [employees, setEmployees] = useState([]);
  const [arrears, setArrears] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [arrearMonth, setArrearMonth] = useState(5);
  const [arrearYear, setArrearYear] = useState(2026);
  const [arrearAmount, setArrearAmount] = useState("");
  const [reason, setReason] = useState("");

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingArrears, setLoadingArrears] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredEmployees = useMemo(() => {
    const search = employeeSearch.trim().toLowerCase();

    if (!search) {
      return employees;
    }

    return employees.filter((employee) => {
      const id = String(
        employee.employeeId || employee.empId || employee.id || ""
      ).toLowerCase();

      const name = String(
        employee.name || employee.employeeName || employee.fullName || ""
      ).toLowerCase();

      return id.includes(search) || name.includes(search);
    });
  }, [employees, employeeSearch]);

  const selectedEmployee = useMemo(() => {
    return employees.find((employee) => {
      const id = String(employee.employeeId || employee.empId || employee.id);
      return id === String(employeeId);
    });
  }, [employees, employeeId]);

  const totalPendingAmount = useMemo(() => {
    return arrears
      .filter((item) => String(item.status).toUpperCase() === "PENDING")
      .reduce((sum, item) => sum + Number(item.arrearAmount || 0), 0);
  }, [arrears]);

  const pendingCount = useMemo(() => {
    return arrears.filter(
      (item) => String(item.status).toUpperCase() === "PENDING"
    ).length;
  }, [arrears]);

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await fetch(`${API_BASE_URL}/api/employee/list`);

      if (!response.ok) {
        throw new Error("Unable to load employees");
      }

      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadArrears = async () => {
    try {
      setLoadingArrears(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/payroll/arrears`);

      if (!response.ok) {
        throw new Error("Unable to load arrears records");
      }

      const data = await response.json();
      setArrears(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load arrears records");
    } finally {
      setLoadingArrears(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadArrears();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!employeeId) {
      setError("Please select employee");
      return;
    }

    if (!arrearAmount || Number(arrearAmount) <= 0) {
      setError("Please enter valid arrear amount");
      return;
    }

    if (!reason.trim()) {
      setError("Please enter reason");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        employeeId: Number(employeeId),
        arrearMonth: Number(arrearMonth),
        arrearYear: Number(arrearYear),
        arrearAmount: Number(arrearAmount),
        reason: reason.trim(),
        createdBy: String(getCurrentEmployeeId()),
      };

      const response = await fetch(`${API_BASE_URL}/api/payroll/arrears`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to create arrears");
      }

      setMessage("Arrears created successfully");
      setEmployeeId("");
      setArrearAmount("");
      setReason("");

      await loadArrears();
    } catch (err) {
      setError(err.message || "Unable to create arrears");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (arrearId) => {
    try {
      setMessage("");
      setError("");

      const paidBy = String(getCurrentEmployeeId());

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/arrears/${arrearId}/paid?paidBy=${paidBy}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to mark arrears as paid");
      }

      setMessage("Arrears marked as paid successfully");
      await loadArrears();
    } catch (err) {
      setError(err.message || "Unable to mark arrears as paid");
    }
  };

  const getEmployeeName = (record) => {
    if (record.employeeName) {
      return record.employeeName;
    }

    const employee = employees.find((item) => {
      const id = String(item.employeeId || item.empId || item.id);
      return id === String(record.employeeId);
    });

    return employee?.name || employee?.employeeName || employee?.fullName || "-";
  };

  const getMonthName = (month) => {
    return monthOptions.find((item) => item.value === Number(month))?.label || month;
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        color: "#ffffff",
        background:
          "linear-gradient(135deg, #071426 0%, #0b1f3a 45%, #102f5c 100%)",
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        Arrears
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "#cbd5e1" }}>
        Create and manage salary arrears for employees.
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={{ color: "#cbd5e1" }}>Total Records</Typography>
              <Typography variant="h4" fontWeight="bold">
                {arrears.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={{ color: "#cbd5e1" }}>Pending Records</Typography>
              <Typography variant="h4" fontWeight="bold">
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={{ color: "#cbd5e1" }}>Pending Amount</Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{totalPendingAmount.toLocaleString("en-IN")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ ...paperStyle, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Create Arrears
        </Typography>

        <Divider sx={{ mb: 3, borderColor: "rgba(148, 163, 184, 0.25)" }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Employee"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Search by ID or name"
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Employee</InputLabel>
                <Select
                  label="Employee"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={loadingEmployees}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#0f172a",
                        color: "#ffffff",
                      },
                    },
                  }}
                >
                  {filteredEmployees.map((employee) => {
                    const id = employee.employeeId || employee.empId || employee.id;
                    const name =
                      employee.name ||
                      employee.employeeName ||
                      employee.fullName ||
                      "Employee";

                    return (
                      <MenuItem key={id} value={id}>
                        {id} - {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Selected Employee"
                value={
                  selectedEmployee
                    ? `${
                        selectedEmployee.employeeId ||
                        selectedEmployee.empId ||
                        selectedEmployee.id
                      } - ${
                        selectedEmployee.name ||
                        selectedEmployee.employeeName ||
                        selectedEmployee.fullName ||
                        ""
                      }`
                    : ""
                }
                InputProps={{ readOnly: true }}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Month</InputLabel>
                <Select
                  label="Month"
                  value={arrearMonth}
                  onChange={(e) => setArrearMonth(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#0f172a",
                        color: "#ffffff",
                      },
                    },
                  }}
                >
                  {monthOptions.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={arrearYear}
                onChange={(e) => setArrearYear(e.target.value)}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Arrear Amount"
                type="number"
                value={arrearAmount}
                onChange={(e) => setArrearAmount(e.target.value)}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  height: "56px",
                  borderRadius: 2,
                  bgcolor: "#2563eb",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                  },
                }}
              >
                {submitting ? <CircularProgress size={22} /> : "Create Arrears"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                minRows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Example: Salary correction arrears for May 2026"
                sx={inputStyle}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper sx={paperStyle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight="bold">
            Arrears Records
          </Typography>

          <Button
            variant="outlined"
            onClick={loadArrears}
            sx={{
              color: "#93c5fd",
              borderColor: "#60a5fa",
              fontWeight: "bold",
              "&:hover": {
                borderColor: "#93c5fd",
                bgcolor: "rgba(37, 99, 235, 0.16)",
              },
            }}
          >
            Refresh
          </Button>
        </Stack>

        <Divider sx={{ mb: 2, borderColor: "rgba(148, 163, 184, 0.25)" }} />

        {loadingArrears ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table
              sx={{
                "& .MuiTableCell-root": {
                  color: "#ffffff",
                  borderColor: "rgba(148, 163, 184, 0.22)",
                },
                "& .MuiTableHead-root .MuiTableCell-root": {
                  bgcolor: "rgba(30, 64, 175, 0.45)",
                  color: "#ffffff",
                  fontWeight: "bold",
                },
                "& .MuiTableBody-root .MuiTableRow-root:hover": {
                  bgcolor: "rgba(37, 99, 235, 0.16)",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Arrear ID</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Paid By</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {arrears.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No arrears records found
                    </TableCell>
                  </TableRow>
                ) : (
                  arrears.map((record) => (
                    <TableRow key={record.arrearId}>
                      <TableCell>{record.arrearId}</TableCell>
                      <TableCell>
                        {record.employeeId} - {getEmployeeName(record)}
                      </TableCell>
                      <TableCell>{getMonthName(record.arrearMonth)}</TableCell>
                      <TableCell>{record.arrearYear}</TableCell>
                      <TableCell>
                        ₹{Number(record.arrearAmount || 0).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>{record.reason || "-"}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={
                            String(record.status).toUpperCase() === "PENDING"
                              ? "warning"
                              : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{record.createdBy || "-"}</TableCell>
                      <TableCell>{record.paidBy || "-"}</TableCell>
                      <TableCell>
                        {String(record.status).toUpperCase() === "PENDING" ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleMarkAsPaid(record.arrearId)}
                          >
                            Mark Paid
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
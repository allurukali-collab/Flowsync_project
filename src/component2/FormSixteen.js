import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const API_BASE_URL = "http://localhost:8080";

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

const financialYears = [
  "2025-2026",
  "2024-2025",
  "2023-2024",
  "2022-2023",
];

const getCurrentEmployeeId = () => {
  return (
    localStorage.getItem("employeeId") ||
    localStorage.getItem("empId") ||
    localStorage.getItem("userEmployeeId") ||
    localStorage.getItem("loggedInEmployeeId") ||
    "ADMIN"
  );
};

const formatAmount = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return String(dateValue).split("T")[0];
};

export default function FormSixteen() {
  const [employees, setEmployees] = useState([]);
  const [formSixteenRecords, setFormSixteenRecords] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [financialYear, setFinancialYear] = useState("2025-2026");
  const [panNumber, setPanNumber] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [taxableIncome, setTaxableIncome] = useState("");
  const [taxDeducted, setTaxDeducted] = useState("");

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
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

  const totalTaxDeducted = useMemo(() => {
    return formSixteenRecords.reduce(
      (sum, record) => sum + Number(record.taxDeducted || 0),
      0
    );
  }, [formSixteenRecords]);

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

  const loadFormSixteenRecords = async () => {
    try {
      setLoadingRecords(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/payroll/form-sixteen`);

      if (!response.ok) {
        throw new Error("Unable to load Form 16 records");
      }

      const data = await response.json();
      setFormSixteenRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load Form 16 records");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadFormSixteenRecords();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!employeeId) {
      setError("Please select employee");
      return;
    }

    if (!financialYear) {
      setError("Please select financial year");
      return;
    }

    if (!panNumber.trim()) {
      setError("Please enter PAN number");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        employeeId: Number(employeeId),
        financialYear,
        panNumber: panNumber.trim().toUpperCase(),
        grossSalary: Number(grossSalary || 0),
        taxableIncome: Number(taxableIncome || 0),
        taxDeducted: Number(taxDeducted || 0),
        generatedBy: String(getCurrentEmployeeId()),
      };

      const response = await fetch(`${API_BASE_URL}/api/payroll/form-sixteen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to generate Form 16");
      }

      setMessage("Form 16 generated successfully");
      setEmployeeId("");
      setPanNumber("");
      setGrossSalary("");
      setTaxableIncome("");
      setTaxDeducted("");

      await loadFormSixteenRecords();
    } catch (err) {
      setError(err.message || "Unable to generate Form 16");
    } finally {
      setSubmitting(false);
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
        Form 16
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "#cbd5e1" }}>
        Generate and manage employee Form 16 tax certificate records.
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
              <Typography sx={{ color: "#cbd5e1" }}>Total Form 16</Typography>
              <Typography variant="h4" fontWeight="bold">
                {formSixteenRecords.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={{ color: "#cbd5e1" }}>Employees Covered</Typography>
              <Typography variant="h4" fontWeight="bold">
                {new Set(formSixteenRecords.map((item) => item.employeeId)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={{ color: "#cbd5e1" }}>Total TDS</Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatAmount(totalTaxDeducted)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ ...paperStyle, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Generate Form 16
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
                <InputLabel>Financial Year</InputLabel>
                <Select
                  label="Financial Year"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#0f172a",
                        color: "#ffffff",
                      },
                    },
                  }}
                >
                  {financialYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="PAN Number"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Gross Salary"
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Taxable Income"
                type="number"
                value={taxableIncome}
                onChange={(e) => setTaxableIncome(e.target.value)}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Tax Deducted"
                type="number"
                value={taxDeducted}
                onChange={(e) => setTaxDeducted(e.target.value)}
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
                {submitting ? <CircularProgress size={22} /> : "Generate"}
              </Button>
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
            Form 16 Records
          </Typography>

          <Button
            variant="outlined"
            onClick={loadFormSixteenRecords}
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

        {loadingRecords ? (
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
                  <TableCell>ID</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Financial Year</TableCell>
                  <TableCell>PAN</TableCell>
                  <TableCell>Gross Salary</TableCell>
                  <TableCell>Taxable Income</TableCell>
                  <TableCell>TDS</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Generated By</TableCell>
                  <TableCell>Generated At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {formSixteenRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No Form 16 records found
                    </TableCell>
                  </TableRow>
                ) : (
                  formSixteenRecords.map((record) => (
                    <TableRow key={record.formSixteenId}>
                      <TableCell>{record.formSixteenId}</TableCell>
                      <TableCell>
                        {record.employeeId} - {getEmployeeName(record)}
                      </TableCell>
                      <TableCell>{record.financialYear}</TableCell>
                      <TableCell>{record.panNumber || "-"}</TableCell>
                      <TableCell>{formatAmount(record.grossSalary)}</TableCell>
                      <TableCell>{formatAmount(record.taxableIncome)}</TableCell>
                      <TableCell>{formatAmount(record.taxDeducted)}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status || "GENERATED"}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{record.generatedBy || "-"}</TableCell>
                      <TableCell>{formatDate(record.generatedAt)}</TableCell>
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
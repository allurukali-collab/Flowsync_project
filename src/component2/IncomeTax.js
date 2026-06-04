import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import MuiLink from "@mui/material/Link";

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

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getCurrentFinancialYear = () => {
  const today = new Date();
  return today.getFullYear();
};

export default function IncomeTax() {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const [taxMonth, setTaxMonth] = useState(new Date().getMonth() + 1);
  const [taxYear, setTaxYear] = useState(getCurrentFinancialYear());
  const [monthlyTaxAmount, setMonthlyTaxAmount] = useState("");
  const [annualTaxAmount, setAnnualTaxAmount] = useState("");
  const [taxRegime, setTaxRegime] = useState("NEW");
  const [remarks, setRemarks] = useState("");

  const [taxRecords, setTaxRecords] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const processedOn = useMemo(() => {
    const now = new Date();
    return `Today at ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }, []);

  const selectedEmployeeId = getEmployeeId(employee);

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

  const loadEmployeeTaxRecords = async (employeeId) => {
    if (!employeeId) return;

    try {
      setLoadingRecords(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/income-tax/employee/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load employee tax records");
      }

      const data = await response.json();
      setTaxRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Tax records load error:", err);
      setError("Unable to load income tax records.");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      loadEmployeeTaxRecords(selectedEmployeeId);
    } else {
      setTaxRecords([]);
    }
  }, [selectedEmployeeId]);

  const handleEmployeeChange = (_, value) => {
    setEmployee(value);
    setSuccessMessage("");
    setError("");
    setMonthlyTaxAmount("");
    setAnnualTaxAmount("");
    setTaxRegime("NEW");
    setRemarks("");
  };

  const handleSaveTax = async () => {
    try {
      setError("");
      setSuccessMessage("");

      if (!selectedEmployeeId) {
        setError("Please select employee.");
        return;
      }

      if (!monthlyTaxAmount || Number(monthlyTaxAmount) < 0) {
        setError("Please enter valid monthly tax amount.");
        return;
      }

      setSaving(true);

      const token = localStorage.getItem("token");

      const payload = {
        employeeId: Number(selectedEmployeeId),
        taxMonth: Number(taxMonth),
        taxYear: Number(taxYear),
        monthlyTaxAmount: Number(monthlyTaxAmount),
        annualTaxAmount: annualTaxAmount ? Number(annualTaxAmount) : Number(monthlyTaxAmount) * 12,
        taxRegime,
        remarks,
        createdBy: "ADMIN",
      };

      const response = await fetch(`${API_BASE_URL}/api/payroll/income-tax`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save income tax");
      }

      const savedTax = await response.json();

      setSuccessMessage(
        `Income tax saved for ${savedTax.employeeName}. Monthly tax ₹${formatMoney(
          savedTax.monthlyTaxAmount
        )} will deduct in payroll.`
      );

      await loadEmployeeTaxRecords(selectedEmployeeId);
    } catch (err) {
      console.error("Save tax error:", err);
      setError(err.message || "Unable to save income tax.");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectRecord = (record) => {
    setTaxMonth(record.taxMonth || new Date().getMonth() + 1);
    setTaxYear(record.taxYear || getCurrentFinancialYear());
    setMonthlyTaxAmount(record.monthlyTaxAmount || "");
    setAnnualTaxAmount(record.annualTaxAmount || "");
    setTaxRegime(record.taxRegime || "NEW");
    setRemarks(record.remarks || "");
    setTabIndex(0);
  };

  const latestRecord = taxRecords?.[0];

  return (
    <>
      <Header />

      <Box sx={{ p: 2, bgcolor: "rgba(10,20,40,0.7)", overflow: "hidden" }}>
        <Breadcrumbs
          separator=">"
          sx={{
            "& .MuiBreadcrumbs-separator": {
              color: "rgba(255,255,255,0.5)",
            },
          }}
        >
          <MuiLink
            component={RouterLink}
            to="/welcome"
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            Home
          </MuiLink>

          <MuiLink
            component={RouterLink}
            to="/updatepayroll"
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            Payroll
          </MuiLink>

          <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
            Income Tax
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box
        sx={{
          mx: 2,
          my: 2,
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "rgba(30,40,60,0.6)",
          backdropFilter: "blur(8px)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
          <PersonIcon fontSize="large" />
        </IconButton>

        <Autocomplete
          fullWidth
          loading={loadingEmployees}
          options={employees}
          value={employee}
          getOptionLabel={(option) =>
            option
              ? `${getEmployeeName(option)} — #${getEmployeeId(option)}`
              : ""
          }
          isOptionEqualToValue={(option, value) =>
            String(getEmployeeId(option)) === String(getEmployeeId(value))
          }
          onChange={handleEmployeeChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select an employee..."
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loadingEmployees ? (
                      <CircularProgress color="inherit" size={18} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                sx: {
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff",
                  },
                },
              }}
            />
          )}
          PaperComponent={(props) => (
            <Paper
              {...props}
              sx={{
                bgcolor: "rgba(30,40,60,0.96)",
                color: "white",
              }}
            />
          )}
        />
      </Box>

      {(error || successMessage) && (
        <Box sx={{ mx: 2, mb: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Box>
      )}

      {employee && (
        <Box
          sx={{
            mx: 2,
            mb: 4,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              p: 1.5,
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: 1,
              backdropFilter: "blur(4px)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PersonIcon
                sx={{ fontSize: 40, color: "rgba(255,255,255,0.7)" }}
              />

              <Box>
                <Typography sx={{ color: "white", fontWeight: 600 }}>
                  {getEmployeeName(employee)}
                </Typography>

                <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                  #{selectedEmployeeId}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 4,
                color: "common.white",
                fontSize: "0.875rem",
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Email
                </Typography>
                <Typography>{employee.email || "-"}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Designation
                </Typography>
                <Typography>{employee.designation || "-"}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Income Tax Processed On
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{processedOn}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Tax Regime
                </Typography>
                <Typography sx={{ color: "#4caf50", fontWeight: 600 }}>
                  {taxRegime === "OLD" ? "Old Tax Regime" : "New Tax Regime"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Paper
            square
            sx={{
              mt: 2,
              bgcolor: "rgba(17, 20, 27, 0.6)",
              backdropFilter: "blur(8px)",
              borderRadius: 1,
            }}
          >
            <Tabs
              value={tabIndex ?? 0}
              onChange={(_, value) => setTabIndex(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": { color: "rgba(255,255,255,0.7)" },
                "& .Mui-selected": { color: "#fff" },
              }}
            >
              <Tab label="Income" />
              <Tab label="Income From Previous Employer" />
              <Tab label="Exemptions" />
              <Tab label="Perquisite" />
              <Tab label="Deductions" />
              <Tab label="Others" />
              <Tab label="House Property Income" />
              <Tab label="Regime" />
              <Tab label="Result" />
            </Tabs>
          </Paper>

          {tabIndex === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                Income Tax Setup
              </Typography>

              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "rgba(17, 24, 39, 0.78)",
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Tax Month"
                      value={taxMonth}
                      onChange={(e) => setTaxMonth(e.target.value)}
                      InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
                      sx={inputStyle}
                    >
                      {MONTHS.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Tax Year"
                      type="number"
                      value={taxYear}
                      onChange={(e) => setTaxYear(e.target.value)}
                      InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
                      sx={inputStyle}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Monthly Tax Amount"
                      type="number"
                      value={monthlyTaxAmount}
                      onChange={(e) => setMonthlyTaxAmount(e.target.value)}
                      InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Annual Tax Amount"
                      type="number"
                      value={annualTaxAmount}
                      onChange={(e) => setAnnualTaxAmount(e.target.value)}
                      placeholder="Auto: Monthly x 12"
                      InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Tax Regime"
                      value={taxRegime}
                      onChange={(e) => setTaxRegime(e.target.value)}
                      InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
                      sx={inputStyle}
                    >
                      <MenuItem value="NEW">New</MenuItem>
                      <MenuItem value="OLD">Old</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Example: June month income tax deduction"
                      InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
                      sx={inputStyle}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        component={RouterLink}
                        to="/salary"
                        variant="contained"
                      >
                        Back To Salary
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => loadEmployeeTaxRecords(selectedEmployeeId)}
                        disabled={loadingRecords}
                      >
                        Refresh
                      </Button>

                      <Button
                        variant="contained"
                        color="warning"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveTax}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Tax"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "rgba(17, 24, 39, 0.78)",
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
                      Latest Monthly Tax
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: 24, fontWeight: 800 }}>
                      ₹{formatMoney(latestRecord?.monthlyTaxAmount)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
                      Latest Annual Tax
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: 24, fontWeight: 800 }}>
                      ₹{formatMoney(latestRecord?.annualTaxAmount)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
                      Status
                    </Typography>
                    <Chip
                      label={latestRecord?.status || "NO RECORD"}
                      sx={{
                        mt: 0.8,
                        color: "white",
                        bgcolor: latestRecord ? "rgba(76,175,80,0.7)" : "rgba(158,158,158,0.5)",
                        fontWeight: 800,
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                Previous Tax Records
              </Typography>

              <TableContainer
                sx={{
                  maxHeight: 360,
                  bgcolor: "rgba(198, 194, 194, 0.2)",
                  borderRadius: 1,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {[
                        "Month",
                        "Year",
                        "Monthly Tax",
                        "Annual Tax",
                        "Regime",
                        "Status",
                        "Remarks",
                        "Updated On",
                        "Action",
                      ].map((column) => (
                        <TableCell
                          key={column}
                          sx={{
                            bgcolor: "rgba(22, 29, 43, 1)",
                            color: "white",
                            fontWeight: 800,
                          }}
                        >
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {loadingRecords && (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          sx={{ color: "white", textAlign: "center", py: 4 }}
                        >
                          Loading tax records...
                        </TableCell>
                      </TableRow>
                    )}

                    {!loadingRecords &&
                      taxRecords.map((record, index) => (
                        <TableRow key={record.id || index} hover>
                          <TableCell sx={tableCellStyle}>
                            {MONTHS.find((m) => Number(m.value) === Number(record.taxMonth))?.label ||
                              record.taxMonth}
                          </TableCell>

                          <TableCell sx={tableCellStyle}>{record.taxYear}</TableCell>

                          <TableCell sx={tableCellStyle}>
                            ₹{formatMoney(record.monthlyTaxAmount)}
                          </TableCell>

                          <TableCell sx={tableCellStyle}>
                            ₹{formatMoney(record.annualTaxAmount)}
                          </TableCell>

                          <TableCell sx={tableCellStyle}>{record.taxRegime}</TableCell>

                          <TableCell sx={tableCellStyle}>
                            <Chip
                              size="small"
                              label={record.status}
                              sx={{
                                color: "white",
                                bgcolor: "rgba(76,175,80,0.65)",
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>

                          <TableCell sx={tableCellStyle}>{record.remarks || "-"}</TableCell>

                          <TableCell sx={tableCellStyle}>
                            {formatDateTime(record.updatedAt || record.createdAt)}
                          </TableCell>

                          <TableCell sx={tableCellStyle}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleSelectRecord(record)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                    {!loadingRecords && taxRecords.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          sx={{ color: "white", textAlign: "center", py: 4 }}
                        >
                          No income tax records found for this employee.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {tabIndex !== 0 && (
            <Box
              sx={{
                mt: 2,
                p: 3,
                bgcolor: "rgba(17, 24, 39, 0.78)",
                borderRadius: 2,
                color: "white",
              }}
            >
              This tab is not connected yet. First Income Tax monthly deduction is connected to payroll.
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

const inputStyle = {
  "& .MuiInputBase-root": {
    color: "white",
    bgcolor: "rgba(0,0,0,0.35)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.65)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.22)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.45)",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
};

const tableCellStyle = {
  color: "white",
  bgcolor: "rgba(255,255,255,0.02)",
};
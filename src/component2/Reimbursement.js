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
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

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

const REIMBURSEMENT_TYPES = [
  "Travel",
  "Food",
  "Internet",
  "Mobile",
  "Medical",
  "Fuel",
  "Training",
  "Other",
];

const getEmployeeId = (employee) =>
  employee?.employeeId || employee?.empId || employee?.id || "";

const getEmployeeName = (employee) =>
  employee?.name || employee?.employeeName || employee?.fullName || "-";

const sortReimbursementRecords = (data) => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();

    if (dateB !== dateA) {
      return dateB - dateA;
    }

    return (
      Number(b.reimbursementId || b.id || 0) -
      Number(a.reimbursementId || a.id || 0)
    );
  });
};

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value) => `₹${formatMoney(value)}`;

const getCurrentYear = () => new Date().getFullYear();

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

            <Typography
              sx={{
                color: "white",
                fontSize: { xs: 22, md: 26 },
                fontWeight: 900,
                mt: 1,
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{ color: "rgba(219,234,254,0.55)", fontSize: 13, mt: 1 }}
            >
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

export default function Reimbursement() {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);

  const [reimbursementMonth, setReimbursementMonth] = useState(5);
  const [reimbursementYear, setReimbursementYear] = useState(getCurrentYear());
  const [reimbursementType, setReimbursementType] = useState("Travel");
  const [amount, setAmount] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  const [records, setRecords] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const totalAmount = useMemo(() => {
    return records.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [records]);

  const approvedAmount = useMemo(() => {
    return records
      .filter((item) => String(item.status || "").toUpperCase() === "APPROVED")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [records]);

  const pendingAmount = useMemo(() => {
    return records
      .filter((item) => String(item.status || "").toUpperCase() === "PENDING")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [records]);

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

  const loadAllReimbursements = async () => {
    try {
      setLoadingRecords(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/payroll/reimbursement`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load reimbursement records");
      }

      const data = await response.json();
      setRecords(Array.isArray(data) ? sortReimbursementRecords(data) : []);
    } catch (err) {
      console.error("All reimbursement load error:", err);
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const loadEmployeeReimbursements = async (employeeId) => {
    if (!employeeId) {
      loadAllReimbursements();
      return;
    }

    try {
      setLoadingRecords(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/reimbursement/employee/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Reimbursement API not ready");
      }

      const data = await response.json();
      setRecords(Array.isArray(data) ? sortReimbursementRecords(data) : []);
    } catch (err) {
      console.warn("Reimbursement records not loaded:", err);
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadAllReimbursements();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      loadEmployeeReimbursements(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const handleEmployeeChange = (_, value) => {
    setEmployee(value);
    setError("");
    setSuccessMessage("");

    if (!value) {
      loadAllReimbursements();
    }
  };

  const handleSave = async () => {
    try {
      setError("");
      setSuccessMessage("");

      if (!selectedEmployeeId) {
        setError("Please select employee.");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        setError("Please enter valid reimbursement amount.");
        return;
      }

      setSaving(true);

      const token = localStorage.getItem("token");

      const payload = {
        employeeId: Number(selectedEmployeeId),
        reimbursementMonth: Number(reimbursementMonth),
        reimbursementYear: Number(reimbursementYear),
        reimbursementType,
        amount: Number(amount),
        billNumber,
        remarks,
        createdBy: "ADMIN",
      };

      const response = await fetch(`${API_BASE_URL}/api/payroll/reimbursement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to save reimbursement.");
      }

      const saved = await response.json();

      setSuccessMessage(
        `Reimbursement saved for ${
          saved.employeeName || getEmployeeName(employee)
        }. Status: ${saved.status || "PENDING"}`
      );

      setAmount("");
      setBillNumber("");
      setRemarks("");

      await loadEmployeeReimbursements(selectedEmployeeId);
    } catch (err) {
      console.error("Save reimbursement error:", err);
      setError(err.message || "Unable to save reimbursement.");
    } finally {
      setSaving(false);
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
            Reimbursement
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
            Reimbursement
          </Typography>

          <Typography sx={{ color: "rgba(219,234,254,0.72)", mt: 0.8, mb: 3 }}>
            Add employee reimbursement requests. Approved amount will be added to payroll later.
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

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Month"
                value={reimbursementMonth}
                onChange={(e) => setReimbursementMonth(e.target.value)}
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

            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={reimbursementYear}
                onChange={(e) => setReimbursementYear(e.target.value)}
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Type"
                value={reimbursementType}
                onChange={(e) => setReimbursementType(e.target.value)}
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                sx={fieldStyle}
              >
                {REIMBURSEMENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Bill Number"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="Optional"
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Example: Cab bill for client visit"
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    if (selectedEmployeeId) {
                      loadEmployeeReimbursements(selectedEmployeeId);
                    } else {
                      loadAllReimbursements();
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

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 900,
                    bgcolor: "#2563eb",
                  }}
                >
                  {saving ? "Saving..." : "Save Reimbursement"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Employee"
              value={selectedEmployeeId || "-"}
              subtitle={employee ? getEmployeeName(employee) : "All reimbursement records"}
              icon={<PersonIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Total Claims"
              value={formatCurrency(totalAmount)}
              subtitle={`${records.length} reimbursement records`}
              icon={<ReceiptLongIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Approved"
              value={formatCurrency(approvedAmount)}
              subtitle="Amount added to payroll later"
              icon={<AccountBalanceWalletIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Pending"
              value={formatCurrency(pendingAmount)}
              subtitle="Waiting for approval"
              icon={<CalendarMonthIcon />}
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
              Previous Reimbursement Records
            </Typography>
          </Box>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "Employee",
                    "Month",
                    "Type",
                    "Amount",
                    "Bill No",
                    "Status",
                    "Remarks",
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
                      Loading reimbursement records...
                    </TableCell>
                  </TableRow>
                )}

                {!loadingRecords &&
                  records.map((record, index) => (
                    <TableRow
                      key={record.reimbursementId || record.id || index}
                      sx={{
                        bgcolor:
                          index % 2 === 0
                            ? "rgba(15,23,42,0.92)"
                            : "rgba(30,41,59,0.82)",
                      }}
                    >
                      <TableCell sx={bodyCellStyle}>{index + 1}</TableCell>
                      <TableCell sx={bodyCellStyle}>
                        {getRecordEmployeeName(record)}
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>
                        {MONTHS.find(
                          (m) => Number(m.value) === Number(record.reimbursementMonth)
                        )?.label || record.reimbursementMonth}{" "}
                        {record.reimbursementYear}
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>{record.reimbursementType}</TableCell>
                      <TableCell sx={amountCellStyle}>{formatCurrency(record.amount)}</TableCell>
                      <TableCell sx={bodyCellStyle}>{record.billNumber || "-"}</TableCell>
                      <TableCell sx={bodyCellStyle}>
                        <Chip
                          size="small"
                          label={record.status || "PENDING"}
                          sx={{
                            color: "white",
                            bgcolor:
                              String(record.status || "PENDING").toUpperCase() === "APPROVED"
                                ? "rgba(34,197,94,0.55)"
                                : String(record.status || "PENDING").toUpperCase() === "REJECTED"
                                ? "rgba(239,68,68,0.55)"
                                : "rgba(245,158,11,0.55)",
                            fontWeight: 800,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>{record.remarks || "-"}</TableCell>
                    </TableRow>
                  ))}

                {!loadingRecords && records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} sx={emptyCellStyle}>
                      No reimbursement records found.
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

const amountCellStyle = {
  ...bodyCellStyle,
  textAlign: "right",
  fontFamily: "monospace",
  fontWeight: 900,
};

const emptyCellStyle = {
  color: "#dbeafe",
  textAlign: "center",
  py: 5,
  fontWeight: 900,
  bgcolor: "rgba(15,23,42,0.92)",
};
import React, { useState, useMemo, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import Header from "./Header";
import {
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Breadcrumbs,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ReceiptLong as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  RemoveCircleOutline as DeductionIcon,
  CalendarMonth as CalendarIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";

const monthOptions = [
  { label: "Jan 2026", month: 1, year: 2026 },
  { label: "Feb 2026", month: 2, year: 2026 },
  { label: "Mar 2026", month: 3, year: 2026 },
  { label: "Apr 2026", month: 4, year: 2026 },
  { label: "May 2026", month: 5, year: 2026 },
  { label: "Jun 2026", month: 6, year: 2026 },
  { label: "Jul 2026", month: 7, year: 2026 },
  { label: "Aug 2026", month: 8, year: 2026 },
  { label: "Sep 2026", month: 9, year: 2026 },
  { label: "Oct 2026", month: 10, year: 2026 },
  { label: "Nov 2026", month: 11, year: 2026 },
  { label: "Dec 2026", month: 12, year: 2026 },
];

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value) => `₹${formatMoney(value)}`;

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPayrollMonthLabel = (employee) => {
  if (!employee?.payrollMonth || !employee?.payrollYear) return "-";

  const date = new Date(employee.payrollYear, employee.payrollMonth - 1, 1);

  return date.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const getTotalDeductions = (employee) => {
  if (!employee) return 0;

  return (
    Number(employee.lopDeduction || 0) +
    Number(employee.loanAmount || 0) +
    Number(employee.taxAmount || 0)
  );
};

const buildSalarySections = (employee) => {
  if (!employee) return [];

  return [
    {
      title: "Earnings",
      rows: [
        ["Monthly Gross", employee.monthlyGross, "money"],
        ["Annual CTC", employee.annualCtc, "money"],
        ["Per Day Salary", employee.perDaySalary, "money"],
      ],
    },
    {
      title: "Deductions",
      rows: [
        ["LOP Deduction", employee.lopDeduction, "money"],
        ["Loan Amount", employee.loanAmount, "money"],
        ["Tax Amount", employee.taxAmount, "money"],
        ["Total Deductions", getTotalDeductions(employee), "money"],
      ],
    },
    {
      title: "Attendance Calculation",
      rows: [
        ["Working Days", employee.workingDays, "plain"],
        ["Timesheet Present", employee.timesheetPresentDays, "plain"],
        ["Approved Reconciliation", employee.approvedReconciliationDays, "plain"],
        ["Present Days", employee.presentDays, "plain"],
        ["LOP Days", employee.lopDays, "plain"],
      ],
    },
    {
      title: "Final Salary",
      rows: [["Net Pay", employee.netSalary, "money"]],
    },
  ];
};

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "rgba(15, 23, 42, 0.92)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        borderRadius: 3,
        boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography
              sx={{
                color: "rgba(226,232,240,0.62)",
                fontSize: 12,
                fontWeight: 800,
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
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{
                color: "rgba(226,232,240,0.55)",
                fontSize: 13,
                mt: 1,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(59,130,246,0.16)",
              color: "#93c5fd",
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

function DetailItem({ label, value }) {
  return (
    <Box>
      <Typography
        sx={{
          color: "rgba(226,232,240,0.48)",
          fontSize: 11,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography sx={{ color: "white", fontWeight: 800, fontSize: 14 }}>
        {value || "-"}
      </Typography>
    </Box>
  );
}

function PayslipPreviewDialog({ open, onClose, employee }) {
  if (!employee) return null;

  const earningsRows = [
    ["Monthly Gross", employee.monthlyGross],
    ["Annual CTC", employee.annualCtc],
    ["Per Day Salary", employee.perDaySalary],
  ];

  const deductionRows = [
    ["LOP Deduction", employee.lopDeduction],
    ["Loan Amount", employee.loanAmount],
    ["Tax Amount", employee.taxAmount],
    ["Total Deductions", getTotalDeductions(employee)],
  ];

  const attendanceRows = [
    ["Working Days", employee.workingDays || 0],
    ["Timesheet Present", employee.timesheetPresentDays || 0],
    ["Approved Reconciliation", employee.approvedReconciliationDays || 0],
    ["Present Days", employee.presentDays || 0],
    ["LOP Days", employee.lopDays || 0],
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "rgba(15, 23, 42, 0.98)",
          color: "white",
          borderRadius: 4,
          border: "1px solid rgba(148, 163, 184, 0.22)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            bgcolor: "rgba(30, 64, 175, 0.18)",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 26, fontWeight: 900 }}>
              Payslip Preview
            </Typography>

            <Typography sx={{ color: "rgba(226,232,240,0.68)", mt: 0.5 }}>
              {getPayrollMonthLabel(employee)} salary statement
            </Typography>
          </Box>

          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 2.5,
            mb: 2.5,
            bgcolor: "rgba(15,23,42,0.75)",
            border: "1px solid rgba(148,163,184,0.14)",
            borderRadius: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DetailItem
                label="Employee"
                value={`${employee.employeeName || employee.name} - #${employee.employeeId}`}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem label="Designation" value={employee.designation || "-"} />
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem label="Email" value={employee.email || "-"} />
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem label="Payroll Month" value={getPayrollMonthLabel(employee)} />
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem label="Status" value={employee.status || "PROCESSED"} />
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem label="Processed On" value={formatDateTime(employee.processedAt)} />
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <SalaryMiniTable title="Earnings" color="#93c5fd" rows={earningsRows} />
          </Grid>

          <Grid item xs={12} md={6}>
            <SalaryMiniTable title="Deductions" color="#fecaca" rows={deductionRows} />
          </Grid>

          <Grid item xs={12} md={6}>
            <AttendanceMiniTable rows={attendanceRows} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                height: "100%",
                p: 2.5,
                bgcolor: "rgba(22, 101, 52, 0.18)",
                border: "1px solid rgba(34,197,94,0.24)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "rgba(187,247,208,0.85)",
                  fontSize: 13,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Final Net Pay
              </Typography>

              <Typography sx={{ color: "white", fontSize: 38, fontWeight: 900, mt: 1 }}>
                {formatCurrency(employee.netSalary)}
              </Typography>

              <Typography sx={{ color: "rgba(226,232,240,0.66)", mt: 1 }}>
                Gross {formatCurrency(employee.monthlyGross)} - Deductions{" "}
                {formatCurrency(getTotalDeductions(employee))}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          borderTop: "1px solid rgba(148, 163, 184, 0.16)",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            color: "#bfdbfe",
            borderColor: "rgba(147,197,253,0.35)",
            fontWeight: 800,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SalaryMiniTable({ title, color, rows }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: "rgba(15,23,42,0.75)",
        border: "1px solid rgba(148,163,184,0.14)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "rgba(30,64,175,0.22)" }}>
            <TableCell
              colSpan={2}
              sx={{
                color,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                borderColor: "rgba(148,163,184,0.12)",
              }}
            >
              {title}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(([label, value]) => (
            <TableRow key={label}>
              <TableCell
                sx={{
                  color: "rgba(226,232,240,0.82)",
                  borderColor: "rgba(148,163,184,0.10)",
                }}
              >
                {label}
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  color: "white",
                  fontWeight: 800,
                  fontFamily: "monospace",
                  borderColor: "rgba(148,163,184,0.10)",
                }}
              >
                {formatCurrency(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AttendanceMiniTable({ rows }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: "rgba(15,23,42,0.75)",
        border: "1px solid rgba(148,163,184,0.14)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "rgba(30,64,175,0.22)" }}>
            <TableCell
              colSpan={2}
              sx={{
                color: "#93c5fd",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                borderColor: "rgba(148,163,184,0.12)",
              }}
            >
              Attendance
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(([label, value]) => (
            <TableRow key={label}>
              <TableCell
                sx={{
                  color: "rgba(226,232,240,0.82)",
                  borderColor: "rgba(148,163,184,0.10)",
                }}
              >
                {label}
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  color: "white",
                  fontWeight: 800,
                  fontFamily: "monospace",
                  borderColor: "rgba(148,163,184,0.10)",
                }}
              >
                {value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function SalaryUpdate() {
  const defaultMonth =
    monthOptions.find((item) => item.month === 5 && item.year === 2026) ||
    monthOptions[0];

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [employeeType, setEmployeeType] = useState("Current");
  const [employee, setEmployee] = useState(null);
  const [componentSearch, setComponentSearch] = useState("");
  const [payrollEmployees, setPayrollEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openPayslipPreview, setOpenPayslipPreview] = useState(false);

  const loadProcessedPayroll = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/payroll/process?month=${selectedMonth.month}&year=${selectedMonth.year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load salary data");
      }

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];

      setPayrollEmployees(safeData);

      if (safeData.length > 0) {
        setEmployee(safeData[0]);
      } else {
        setEmployee(null);
      }
    } catch (err) {
      console.error("Salary data load error:", err);
      setError("Unable to load processed payroll data. Please process payroll first.");
      setPayrollEmployees([]);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProcessedPayroll();
  }, [selectedMonth]);

  const salarySections = useMemo(() => {
    const sections = buildSalarySections(employee);

    if (!componentSearch) return sections;

    return sections
      .map((section) => ({
        ...section,
        rows: section.rows.filter(([label]) =>
          label.toLowerCase().includes(componentSearch.toLowerCase())
        ),
      }))
      .filter((section) => section.rows.length > 0);
  }, [employee, componentSearch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 4,
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.35), transparent 32%), radial-gradient(circle at top right, rgba(14,165,233,0.22), transparent 35%), linear-gradient(135deg, #06152e 0%, #082f49 48%, #0f172a 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />

      <Box sx={{ px: 3, py: 2, bgcolor: "rgba(15,23,42,0.68)" }}>
        <Breadcrumbs
          separator=">"
          sx={{
            "& .MuiBreadcrumbs-separator": { color: "rgba(255,255,255,0.4)" },
          }}
        >
          <MuiLink
            underline="hover"
            component={RouterLink}
            color="rgba(255,255,255,0.55)"
            to="/welcome"
          >
            Home
          </MuiLink>

          <MuiLink
            underline="hover"
            component={RouterLink}
            color="rgba(255,255,255,0.55)"
            to="/updatepayroll"
          >
            Payroll
          </MuiLink>

          <Typography color="rgba(255,255,255,0.75)">Salary Update</Typography>
        </Breadcrumbs>
      </Box>

      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2.5,
          maxWidth: "1600px",
          mx: "auto",
        }}
      >
        <Paper
          sx={{
            p: { xs: 2.5, md: 3 },
            bgcolor: "rgba(15, 23, 42, 0.86)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            borderRadius: 4,
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.35)",
            mb: 2.5,
          }}
        >
          <Grid container spacing={2.5} alignItems="center">
            <Grid item xs={12} lg={3}>
              <Typography sx={{ color: "white", fontSize: 26, fontWeight: 900 }}>
                Salary Update
              </Typography>

              <Typography sx={{ color: "rgba(226,232,240,0.65)", mt: 0.5 }}>
                Processed payroll salary breakup and employee salary components.
              </Typography>
            </Grid>

            <Grid item xs={12} md={3} lg={2}>
              <TextField
                select
                size="small"
                fullWidth
                label="Payroll Month"
                value={selectedMonth.label}
                onChange={(e) => {
                  const selected = monthOptions.find(
                    (item) => item.label === e.target.value
                  );

                  if (selected) {
                    setSelectedMonth(selected);
                  }
                }}
                InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                sx={fieldStyle}
              >
                {monthOptions.map((item) => (
                  <MenuItem key={item.label} value={item.label}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3} lg={2}>
              <FormControl size="small" fullWidth sx={formControlStyle}>
                <InputLabel>Employee Type</InputLabel>

                <Select
                  value={employeeType}
                  label="Employee Type"
                  onChange={(e) => setEmployeeType(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "rgba(15,23,42,0.96)",
                        color: "white",
                      },
                    },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Current">Current Employees</MenuItem>
                  <MenuItem value="Resigned">Resigned Employees</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Autocomplete
                size="small"
                options={payrollEmployees}
                value={employee}
                getOptionLabel={(opt) =>
                  opt ? `${opt.employeeName || opt.name} — #${opt.employeeId}` : ""
                }
                isOptionEqualToValue={(option, value) =>
                  String(option.employeeId) === String(value.employeeId)
                }
                onChange={(e, val) => setEmployee(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search employee"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "rgba(255,255,255,0.48)" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={fieldStyle}
                  />
                )}
                PaperComponent={({ children, ...props }) => (
                  <Paper
                    {...props}
                    sx={{
                      bgcolor: "rgba(15,23,42,0.98)",
                      border: "1px solid rgba(148,163,184,0.18)",
                      minWidth: 560,
                      "& .MuiAutocomplete-option": {
                        color: "white",
                        fontSize: 15,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        py: 1.2,
                        "&:hover": { bgcolor: "rgba(59,130,246,0.22)" },
                        "&[aria-selected='true']": { bgcolor: "rgba(59,130,246,0.28)" },
                      },
                    }}
                  >
                    {children}
                  </Paper>
                )}
              />
            </Grid>

            <Grid item xs={12} md={3} lg={1}>
              <Button
                fullWidth
                startIcon={<RefreshIcon />}
                variant="contained"
                onClick={loadProcessedPayroll}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  height: 40,
                  fontWeight: 800,
                }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <CircularProgress size={22} />
              <Typography sx={{ color: "white" }}>
                Loading {selectedMonth.label} salary data...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && payrollEmployees.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No processed payroll found for {selectedMonth.label}. Please process payroll first.
            </Alert>
          )}

          {employee && (
            <Box
              sx={{
                mt: 2.5,
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(30, 64, 175, 0.18)",
                border: "1px solid rgba(96,165,250,0.24)",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr auto" },
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: "rgba(59,130,246,0.25)",
                    color: "#bfdbfe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 18,
                  }}
                >
                  {(employee.employeeName || employee.name || "E").charAt(0)}
                </Box>

                <Box>
                  <Typography sx={{ color: "white", fontSize: 19, fontWeight: 900 }}>
                    {employee.employeeName || employee.name} #{employee.employeeId}
                  </Typography>

                  <Typography sx={{ color: "rgba(226,232,240,0.65)", mt: 0.3 }}>
                    {employee.designation || "-"} • {employee.email || "-"}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={employee.status || "PROCESSED"}
                  sx={{
                    color: "#bbf7d0",
                    bgcolor: "rgba(34,197,94,0.16)",
                    border: "1px solid rgba(34,197,94,0.24)",
                    fontWeight: 800,
                  }}
                />

                <Chip
                  icon={<CalendarIcon sx={{ color: "#bfdbfe !important" }} />}
                  label={getPayrollMonthLabel(employee)}
                  sx={{
                    color: "#bfdbfe",
                    bgcolor: "rgba(59,130,246,0.16)",
                    border: "1px solid rgba(59,130,246,0.24)",
                    fontWeight: 800,
                  }}
                />
              </Stack>

              <Typography sx={{ color: "rgba(226,232,240,0.66)", fontSize: 13 }}>
                Processed On: {formatDateTime(employee.processedAt)}
              </Typography>
            </Box>
          )}
        </Paper>

        {employee && (
          <>
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard
                  title="Net Pay"
                  value={formatCurrency(employee.netSalary)}
                  subtitle="Final payable salary"
                  icon={<WalletIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard
                  title="Monthly Gross"
                  value={formatCurrency(employee.monthlyGross)}
                  subtitle="Before deductions"
                  icon={<TrendingUpIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard
                  title="Deductions"
                  value={formatCurrency(getTotalDeductions(employee))}
                  subtitle="LOP + loan + tax"
                  icon={<DeductionIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard
                  title="LOP Days"
                  value={employee.lopDays || 0}
                  subtitle={`Present ${employee.presentDays || 0} of ${employee.workingDays || 0} days`}
                  icon={<ReceiptIcon />}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "minmax(0, 1.8fr) minmax(360px, 0.9fr)",
                },
                gap: 2.5,
                alignItems: "start",
              }}
            >
              <Card
                sx={{
                  bgcolor: "rgba(15, 23, 42, 0.92)",
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                  borderRadius: 4,
                  boxShadow: "0 20px 45px rgba(0,0,0,0.28)",
                  minHeight: 520,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900 }}>
                        Salary Components
                      </Typography>

                      <Typography sx={{ color: "rgba(226,232,240,0.62)", mt: 0.5 }}>
                        Earnings, deductions, attendance and final salary breakup.
                      </Typography>
                    </Box>

                    <TextField
                      size="small"
                      placeholder="Search component"
                      value={componentSearch}
                      onChange={(e) => setComponentSearch(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "rgba(255,255,255,0.45)" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        width: 280,
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          bgcolor: "rgba(30,41,59,0.72)",
                          "& fieldset": { borderColor: "rgba(255,255,255,0.18)" },
                          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: "rgba(148,163,184,0.14)", mb: 2 }} />

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: 2,
                    }}
                  >
                    {salarySections.map((section) => (
                      <Box
                        key={section.title}
                        sx={{
                          border: "1px solid rgba(148,163,184,0.14)",
                          borderRadius: 3,
                          overflow: "hidden",
                          bgcolor: "rgba(15,23,42,0.45)",
                        }}
                      >
                        <Box
                          sx={{
                            px: 2,
                            py: 1.3,
                            bgcolor: "rgba(30,64,175,0.22)",
                            borderBottom: "1px solid rgba(148,163,184,0.12)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#93c5fd",
                              fontWeight: 900,
                              fontSize: 12,
                              textTransform: "uppercase",
                              letterSpacing: 0.9,
                            }}
                          >
                            {section.title}
                          </Typography>
                        </Box>

                        {section.rows.map(([label, value, type], index) => (
                          <Box
                            key={label}
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr auto",
                              gap: 2,
                              px: 2,
                              py: 1.35,
                              borderTop:
                                index > 0
                                  ? "1px solid rgba(148,163,184,0.10)"
                                  : "none",
                            }}
                          >
                            <Typography
                              sx={{ color: "rgba(226,232,240,0.82)", fontSize: 14 }}
                            >
                              {label}
                            </Typography>

                            <Typography
                              sx={{
                                color: "white",
                                fontFamily: "monospace",
                                fontWeight: 900,
                                fontSize: 14,
                              }}
                            >
                              {type === "money" ? formatCurrency(value) : value || 0}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateRows: "auto auto auto",
                  gap: 2.5,
                }}
              >
                <Card
                  sx={{
                    bgcolor: "rgba(15, 23, 42, 0.92)",
                    border: "1px solid rgba(148, 163, 184, 0.18)",
                    borderRadius: 4,
                    boxShadow: "0 20px 45px rgba(0,0,0,0.28)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900, mb: 2 }}>
                      Employee Details
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <DetailItem
                        label="Employee"
                        value={`${employee.employeeName || employee.name} - #${employee.employeeId}`}
                      />
                      <DetailItem label="Designation" value={employee.designation || "-"} />
                      <DetailItem label="Email" value={employee.email || "-"} />
                      <DetailItem label="Payroll Month" value={getPayrollMonthLabel(employee)} />
                      <DetailItem label="Status" value={employee.status || "PROCESSED"} />
                      <DetailItem label="Processed By" value={employee.processedBy || "-"} />
                      <DetailItem label="Processed On" value={formatDateTime(employee.processedAt)} />
                    </Box>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    bgcolor: "rgba(15, 23, 42, 0.92)",
                    border: "1px solid rgba(148, 163, 184, 0.18)",
                    borderRadius: 4,
                    boxShadow: "0 20px 45px rgba(0,0,0,0.28)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900, mb: 2 }}>
                      Quick Actions
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 1.4,
                      }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setOpenPayslipPreview(true)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 800,
                          height: 42,
                        }}
                      >
                        Preview Payslip
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        component={RouterLink}
                        to="/updatepayroll"
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          color: "#bfdbfe",
                          borderColor: "rgba(147,197,253,0.35)",
                          fontWeight: 800,
                          height: 42,
                        }}
                      >
                        Update Salary
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={loadProcessedPayroll}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          color: "#bfdbfe",
                          borderColor: "rgba(147,197,253,0.35)",
                          fontWeight: 800,
                          height: 42,
                        }}
                      >
                        Refresh Payroll
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    bgcolor: "rgba(15, 23, 42, 0.92)",
                    border: "1px solid rgba(148, 163, 184, 0.18)",
                    borderRadius: 4,
                    boxShadow: "0 20px 45px rgba(0,0,0,0.28)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900, mb: 2 }}>
                      Payroll Health
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <DetailItem label="Working Days" value={employee.workingDays || 0} />
                      <DetailItem label="Present Days" value={employee.presentDays || 0} />
                      <DetailItem
                        label="Timesheet Present"
                        value={employee.timesheetPresentDays || 0}
                      />
                      <DetailItem
                        label="Approved Recon."
                        value={employee.approvedReconciliationDays || 0}
                      />
                      <DetailItem label="LOP Days" value={employee.lopDays || 0} />
                      <DetailItem label="Net Pay" value={formatCurrency(employee.netSalary)} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <PayslipPreviewDialog
        open={openPayslipPreview}
        onClose={() => setOpenPayslipPreview(false)}
        employee={employee}
      />
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

const formControlStyle = {
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
  "& .MuiOutlinedInput-root": {
    color: "white",
    bgcolor: "rgba(15,23,42,0.72)",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(147,197,253,0.28)" },
    "&:hover fieldset": { borderColor: "rgba(147,197,253,0.55)" },
    "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
  },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.7)" },
};
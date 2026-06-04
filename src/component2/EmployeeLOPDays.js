import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
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
import RefreshIcon from "@mui/icons-material/Refresh";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";

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

const getCurrentYear = () => new Date().getFullYear();

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value) => `₹${formatMoney(value)}`;

const sortPayrollRecords = (data) => {
  return [...data].sort((a, b) => {
    const lopA = Number(a.lopDays || 0);
    const lopB = Number(b.lopDays || 0);

    if (lopB !== lopA) {
      return lopB - lopA;
    }

    return Number(a.employeeId || 0) - Number(b.employeeId || 0);
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

            <Typography
              sx={{ color: "white", fontSize: 26, fontWeight: 900, mt: 1 }}
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

export default function EmployeeLOPDays() {
  const [lopMonth, setLopMonth] = useState(5);
  const [lopYear, setLopYear] = useState(getCurrentYear());

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const totalEmployees = useMemo(() => {
    return records.length;
  }, [records]);

  const employeesWithLop = useMemo(() => {
    return records.filter((item) => Number(item.lopDays || 0) > 0).length;
  }, [records]);

  const totalLopDays = useMemo(() => {
    return records.reduce((sum, item) => sum + Number(item.lopDays || 0), 0);
  }, [records]);

  const totalLopDeduction = useMemo(() => {
    return records.reduce(
      (sum, item) => sum + Number(item.lopDeduction || item.lopDeductionAmount || 0),
      0
    );
  }, [records]);

  const loadPayrollLopRecords = async () => {
    try {
      setLoadingRecords(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/process?month=${lopMonth}&year=${lopYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load LOP data from payroll process API.");
      }

      const data = await response.json();
      const finalData = Array.isArray(data) ? sortPayrollRecords(data) : [];

      setRecords(finalData);
      //setSuccessMessage("LOP days loaded from Work Tracker / Timesheet successfully.");
    } catch (err) {
      console.error("Payroll LOP load error:", err);
      setError(err.message || "Unable to load LOP data.");
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadPayrollLopRecords();
  }, []);

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
            Employee LOP Days
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
            Employee LOP Days
          </Typography>

          <Typography sx={{ color: "rgba(219,234,254,0.72)", mt: 0.8, mb: 3 }}>
            LOP days are calculated automatically from Work Tracker / Timesheet and approved reconciliation data.
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
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Month"
                value={lopMonth}
                onChange={(e) => setLopMonth(e.target.value)}
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
                value={lopYear}
                onChange={(e) => setLopYear(e.target.value)}
                InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={loadPayrollLopRecords}
                disabled={loadingRecords}
                sx={{
                  height: "56px",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                  bgcolor: "#2563eb",
                  px: 4,
                }}
              >
                {loadingRecords ? "Loading..." : "Fetch LOP From Work Tracker"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Total Employees"
              value={totalEmployees}
              subtitle="Employees in payroll process"
              icon={<PersonIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Employees With LOP"
              value={employeesWithLop}
              subtitle="Employees having unpaid days"
              icon={<EventBusyIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Total LOP Days"
              value={totalLopDays}
              subtitle={`${MONTHS.find((m) => Number(m.value) === Number(lopMonth))?.label} ${lopYear}`}
              icon={<CalendarMonthIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="LOP Deduction"
              value={formatCurrency(totalLopDeduction)}
              subtitle="Calculated by backend payroll service"
              icon={<PaymentsIcon />}
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
              Work Tracker Based LOP Records
            </Typography>
          </Box>

          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "Emp ID",
                    "Employee",
                    "Designation",
                    "Month",
                    "Working Days",
                    "Timesheet Present",
                    "Approved Recon",
                    "Present Days",
                    "LOP Days",
                    "LOP Deduction",
                    "LOP Dates",
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
                    <TableCell colSpan={12} sx={emptyCellStyle}>
                      Loading LOP records from Work Tracker...
                    </TableCell>
                  </TableRow>
                )}

                {!loadingRecords &&
                  records.map((record, index) => {
                    const lopDays = Number(record.lopDays || 0);
                    const lopDates = Array.isArray(record.lopDates)
                      ? record.lopDates.join(", ")
                      : "-";

                    return (
                      <TableRow
                        key={record.id || record.employeeId || index}
                        sx={{
                          bgcolor:
                            index % 2 === 0
                              ? "rgba(15,23,42,0.92)"
                              : "rgba(30,41,59,0.82)",
                        }}
                      >
                        <TableCell sx={bodyCellStyle}>{index + 1}</TableCell>
                        <TableCell sx={bodyCellStyle}>#{record.employeeId}</TableCell>
                        <TableCell sx={bodyCellStyle}>{record.employeeName || "-"}</TableCell>
                        <TableCell sx={bodyCellStyle}>{record.designation || "-"}</TableCell>
                        <TableCell sx={bodyCellStyle}>
                          {MONTHS.find((m) => Number(m.value) === Number(record.payrollMonth || record.month))
                            ?.label || record.payrollMonth || record.month}{" "}
                          {record.payrollYear || record.year}
                        </TableCell>
                        <TableCell sx={bodyCellStyle}>{record.workingDays || 0}</TableCell>
                        <TableCell sx={bodyCellStyle}>
                          {record.timesheetPresentDays || 0}
                        </TableCell>
                        <TableCell sx={bodyCellStyle}>
                          {record.approvedReconciliationDays || 0}
                        </TableCell>
                        <TableCell sx={bodyCellStyle}>{record.presentDays || 0}</TableCell>
                        <TableCell sx={bodyCellStyle}>
                          <Chip
                            size="small"
                            label={lopDays}
                            sx={{
                              color: "white",
                              bgcolor:
                                lopDays > 0
                                  ? "rgba(239,68,68,0.65)"
                                  : "rgba(34,197,94,0.55)",
                              fontWeight: 900,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={amountCellStyle}>
                          {formatCurrency(record.lopDeduction || record.lopDeductionAmount)}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyle,
                            minWidth: 260,
                            whiteSpace: "normal",
                            lineHeight: 1.6,
                          }}
                        >
                          {lopDates}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                {!loadingRecords && records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} sx={emptyCellStyle}>
                      No LOP data found for selected month/year.
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
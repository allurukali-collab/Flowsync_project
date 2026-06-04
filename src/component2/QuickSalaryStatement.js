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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GroupsIcon from "@mui/icons-material/Groups";

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value) => `₹${formatMoney(value)}`;

const getTotalDeductions = (row) => {
  return (
    Number(row.lopDeduction || 0) +
    Number(row.loanAmount || 0) +
    Number(row.taxAmount || 0)
  );
};

const getMonthLabel = (month, year) => {
  if (!month || !year) return "-";

  const date = new Date(year, month - 1, 1);

  return date.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const generateMonthOptions = () => {
  const options = [];
  const startYear = 2026;

  for (let month = 1; month <= 12; month++) {
    const date = new Date(startYear, month - 1, 1);

    options.push({
      label: date.toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      }),
      month,
      year: startYear,
    });
  }

  return options;
};

const monthOptions = generateMonthOptions();

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "rgba(15, 23, 42, 0.76)",
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
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{
                color: "rgba(219,234,254,0.55)",
                fontSize: 13,
                mt: 1,
              }}
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

export default function QuickSalaryStatement() {
  const defaultMonth =
    monthOptions.find((item) => item.month === 5 && item.year === 2026) ||
    monthOptions[0];

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const [payrollRows, setPayrollRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const loadSalaryStatement = async () => {
    try {
      setLoading(true);
      setError("");
      setInfoMessage("");

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
        throw new Error("Failed to load processed payroll statement");
      }

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];

      setPayrollRows(safeData);
      setEmployeeFilter(null);

      if (safeData.length === 0) {
        setInfoMessage(
          `No processed payroll found for ${selectedMonth.label}. Please process payroll for this month first.`
        );
      }
    } catch (err) {
      console.error("Quick salary statement load error:", err);
      setError("Unable to load salary statement. Please process payroll first.");
      setPayrollRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalaryStatement();
  }, [selectedMonth]);

  const filteredRows = useMemo(() => {
    let rows = [...payrollRows];

    if (employeeFilter) {
      rows = rows.filter(
        (row) => String(row.employeeId) === String(employeeFilter.employeeId)
      );
    }

    if (statusFilter !== "All") {
      rows = rows.filter(
        (row) =>
          String(row.status || "PROCESSED").toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    return rows.map((row, index) => ({
      id: row.id || `${row.employeeId}-${index}`,
      serialNo: index + 1,
      employeeId: row.employeeId,
      employeeName: row.employeeName || row.name || "-",
      email: row.email || "-",
      designation: row.designation || "-",
      monthLabel: getMonthLabel(row.payrollMonth, row.payrollYear),
      workingDays: row.workingDays || 0,
      presentDays: row.presentDays || 0,
      lopDays: row.lopDays || 0,
      annualCtc: Number(row.annualCtc || 0),
      monthlyGross: Number(row.monthlyGross || 0),
      lopDeduction: Number(row.lopDeduction || 0),
      loanAmount: Number(row.loanAmount || 0),
      taxAmount: Number(row.taxAmount || 0),
      totalDeductions: getTotalDeductions(row),
      netSalary: Number(row.netSalary || 0),
      status: row.status || "PROCESSED",
      processedBy: row.processedBy || "ADMIN",
    }));
  }, [payrollRows, employeeFilter, statusFilter]);

  const totalGross = filteredRows.reduce(
    (sum, row) => sum + Number(row.monthlyGross || 0),
    0
  );

  const totalLoan = filteredRows.reduce(
    (sum, row) => sum + Number(row.loanAmount || 0),
    0
  );

  const totalTax = filteredRows.reduce(
    (sum, row) => sum + Number(row.taxAmount || 0),
    0
  );

  const totalDeductions = filteredRows.reduce(
    (sum, row) => sum + Number(row.totalDeductions || 0),
    0
  );

  const totalNetSalary = filteredRows.reduce(
    (sum, row) => sum + Number(row.netSalary || 0),
    0
  );

  const handleExportToExcel = () => {
    if (!filteredRows.length) {
      setError("No salary statement data available to export.");
      return;
    }

    const headers = [
      "#",
      "Employee ID",
      "Name",
      "Email",
      "Designation",
      "Payroll Month",
      "Working Days",
      "Present Days",
      "LOP Days",
      "Annual CTC",
      "Monthly Gross",
      "LOP Deduction",
      "Loan Deduction",
      "Income Tax",
      "Total Deductions",
      "Net Pay",
      "Status",
      "Processed By",
    ];

    const csvRows = filteredRows.map((row) => [
      row.serialNo,
      row.employeeId,
      row.employeeName,
      row.email,
      row.designation,
      row.monthLabel,
      row.workingDays,
      row.presentDays,
      row.lopDays,
      row.annualCtc,
      row.monthlyGross,
      row.lopDeduction,
      row.loanAmount,
      row.taxAmount,
      row.totalDeductions,
      row.netSalary,
      row.status,
      row.processedBy,
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `quick-salary-statement-${selectedMonth.label}.csv`;
    link.click();

    URL.revokeObjectURL(url);
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
            Quick Salary Statement
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
            Quick Salary Statement
          </Typography>

          <Typography sx={{ color: "rgba(219,234,254,0.72)", mt: 0.8, mb: 3 }}>
            Real processed payroll summary with gross salary, LOP, loan, income tax and net pay.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {infoMessage && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {infoMessage}
            </Alert>
          )}

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              select
              label="Payroll Month"
              value={selectedMonth.label}
              fullWidth
              onChange={(e) => {
                const selected = monthOptions.find(
                  (item) => item.label === e.target.value
                );

                if (selected) {
                  setSelectedMonth(selected);
                }
              }}
              InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
              sx={fieldStyle}
            >
              {monthOptions.map((item) => (
                <MenuItem key={item.label} value={item.label}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              fullWidth
              options={payrollRows}
              value={employeeFilter}
              getOptionLabel={(option) =>
                option
                  ? `${option.employeeName || option.name} — #${option.employeeId}`
                  : ""
              }
              isOptionEqualToValue={(option, value) =>
                String(option.employeeId) === String(value.employeeId)
              }
              onChange={(e, value) => setEmployeeFilter(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee Filter"
                  placeholder="All employees"
                  InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "rgba(219,234,254,0.65)" }} />
                      </InputAdornment>
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
                    "& .MuiAutocomplete-option": {
                      color: "white",
                      fontWeight: 700,
                      "&:hover": {
                        bgcolor: "rgba(37,99,235,0.25)",
                      },
                    },
                  }}
                />
              )}
            />

            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
              InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
              sx={fieldStyle}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="PROCESSED">Processed</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadSalaryStatement}
              disabled={loading}
              sx={{
                minWidth: 140,
                color: "#dbeafe",
                borderColor: "rgba(147,197,253,0.55)",
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 800,
                "&:hover": {
                  borderColor: "#93c5fd",
                  bgcolor: "rgba(59,130,246,0.16)",
                },
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToExcel}
              disabled={!filteredRows.length}
              sx={{
                minWidth: 170,
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 900,
                bgcolor: "#2563eb",
                boxShadow: "0 12px 28px rgba(37,99,235,0.35)",
                "&:hover": {
                  bgcolor: "#1d4ed8",
                },
              }}
            >
              Export Excel
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Employees"
              value={filteredRows.length}
              subtitle="Processed employees"
              icon={<GroupsIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Gross Salary"
              value={formatCurrency(totalGross)}
              subtitle="Total monthly gross"
              icon={<PaymentsIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Deductions"
              value={formatCurrency(totalDeductions)}
              subtitle={`Loan ${formatCurrency(totalLoan)} | Tax ${formatCurrency(totalTax)}`}
              icon={<TrendingDownIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Net Pay"
              value={formatCurrency(totalNetSalary)}
              subtitle="Final payable amount"
              icon={<AccountBalanceWalletIcon />}
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
          {loading ? (
            <Box
              sx={{
                minHeight: 420,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography sx={{ color: "white", fontWeight: 800 }}>
                Loading salary statement...
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 620 }}>
              <Table stickyHeader sx={{ minWidth: 1700 }}>
                <TableHead>
                  <TableRow>
                    {[
                      "#",
                      "Employee ID",
                      "Employee Name",
                      "Designation",
                      "Month",
                      "Working Days",
                      "Present Days",
                      "LOP Days",
                      "Gross",
                      "LOP Deduction",
                      "Loan",
                      "Income Tax",
                      "Total Deductions",
                      "Net Pay",
                      "Status",
                    ].map((header) => (
                      <TableCell key={header} sx={headerCellStyle}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        bgcolor:
                          index % 2 === 0
                            ? "rgba(15,23,42,0.92)"
                            : "rgba(30,41,59,0.82)",
                        "&:hover": {
                          bgcolor: "rgba(59,130,246,0.20)",
                        },
                      }}
                    >
                      <TableCell sx={bodyCellStyle}>{row.serialNo}</TableCell>
                      <TableCell sx={bodyCellStyle}>{row.employeeId}</TableCell>
                      <TableCell sx={bodyCellStyle}>
                        <Typography sx={{ color: "white", fontWeight: 900 }}>
                          {row.employeeName}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(219,234,254,0.58)",
                            fontSize: 12,
                          }}
                        >
                          {row.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>{row.designation}</TableCell>
                      <TableCell sx={bodyCellStyle}>{row.monthLabel}</TableCell>
                      <TableCell sx={bodyCellStyle}>{row.workingDays}</TableCell>
                      <TableCell sx={bodyCellStyle}>{row.presentDays}</TableCell>
                      <TableCell sx={{ ...bodyCellStyle, color: "#fca5a5" }}>
                        {row.lopDays}
                      </TableCell>
                      <TableCell sx={amountCellStyle}>
                        {formatCurrency(row.monthlyGross)}
                      </TableCell>
                      <TableCell sx={{ ...amountCellStyle, color: "#fbbf24" }}>
                        {formatCurrency(row.lopDeduction)}
                      </TableCell>
                      <TableCell sx={{ ...amountCellStyle, color: "#93c5fd" }}>
                        {formatCurrency(row.loanAmount)}
                      </TableCell>
                      <TableCell sx={{ ...amountCellStyle, color: "#fca5a5" }}>
                        {formatCurrency(row.taxAmount)}
                      </TableCell>
                      <TableCell sx={{ ...amountCellStyle, color: "#f87171" }}>
                        {formatCurrency(row.totalDeductions)}
                      </TableCell>
                      <TableCell sx={{ ...amountCellStyle, color: "#86efac" }}>
                        {formatCurrency(row.netSalary)}
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>{row.status}</TableCell>
                    </TableRow>
                  ))}

                  {filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={15}
                        sx={{
                          color: "#dbeafe",
                          textAlign: "center",
                          py: 6,
                          fontWeight: 900,
                          fontSize: 18,
                          bgcolor: "rgba(15,23,42,0.92)",
                        }}
                      >
                        No payroll processed for {selectedMonth.label}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
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
import Header from "./Header";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const COMPANY_NAME = "STIBIUM TECH";

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

const getMonthLabel = (month, year) => {
  if (!month || !year) return "-";

  const date = new Date(year, month - 1, 1);

  return date.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const getTotalDeductions = (row) => {
  return (
    Number(row.lopDeduction || 0) +
    Number(row.loanAmount || 0) +
    Number(row.taxAmount || 0)
  );
};

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

export default function PayrollStatement() {
  const defaultMonth =
    monthOptions.find((item) => item.month === 5 && item.year === 2026) ||
    monthOptions[0];

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [searchText, setSearchText] = useState("");
  const [payrollRows, setPayrollRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPayrollStatement = async () => {
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
        throw new Error("Failed to load payroll statement");
      }

      const data = await response.json();
      setPayrollRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Payroll statement load error:", err);
      setError("Unable to load payroll statement. Please process payroll first.");
      setPayrollRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrollStatement();
  }, [selectedMonth]);

  const rows = useMemo(() => {
    let list = [...payrollRows];

    if (searchText.trim()) {
      const search = searchText.toLowerCase();

      list = list.filter((row) => {
        return (
          String(row.employeeId || "").toLowerCase().includes(search) ||
          String(row.employeeName || row.name || "").toLowerCase().includes(search) ||
          String(row.email || "").toLowerCase().includes(search) ||
          String(row.designation || "").toLowerCase().includes(search)
        );
      });
    }

    return list.map((row, index) => ({
      id: row.id || `${row.employeeId}-${index}`,
      serialNo: index + 1,
      employeeId: row.employeeId,
      employeeName: row.employeeName || row.name || "-",
      email: row.email || "-",
      designation: row.designation || "-",
      monthLabel: getMonthLabel(row.payrollMonth, row.payrollYear),
      workingDays: Number(row.workingDays || 0),
      presentDays: Number(row.presentDays || 0),
      lopDays: Number(row.lopDays || 0),
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
  }, [payrollRows, searchText]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.employees += 1;
        acc.gross += Number(row.monthlyGross || 0);
        acc.lop += Number(row.lopDeduction || 0);
        acc.loan += Number(row.loanAmount || 0);
        acc.tax += Number(row.taxAmount || 0);
        acc.deductions += Number(row.totalDeductions || 0);
        acc.net += Number(row.netSalary || 0);
        return acc;
      },
      {
        employees: 0,
        gross: 0,
        lop: 0,
        loan: 0,
        tax: 0,
        deductions: 0,
        net: 0,
      }
    );
  }, [rows]);

  const handleExportToExcel = () => {
    if (!rows.length) {
      setError("No payroll statement data available to export.");
      return;
    }

    const headers = [
      "#",
      "Employee ID",
      "Name",
      "Email",
      "Designation",
      "Month",
      "Working Days",
      "Present Days",
      "LOP Days",
      "Annual CTC",
      "Monthly Gross",
      "LOP Deduction",
      "Loan Deduction",
      "Income Tax",
      "Total Deductions",
      "Net Salary",
      "Status",
      "Processed By",
    ];

    const csvRows = rows.map((row) => [
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

    const summaryRows = [
      [],
      ["Payroll Statement Summary"],
      ["Company", COMPANY_NAME],
      ["Payroll Month", selectedMonth.label],
      ["Total Employees", totals.employees],
      ["Total Gross Salary", totals.gross],
      ["Total LOP Deduction", totals.lop],
      ["Total Loan Deduction", totals.loan],
      ["Total Income Tax", totals.tax],
      ["Total Deductions", totals.deductions],
      ["Total Net Payout", totals.net],
    ];

    const csvContent = [...summaryRows, [], headers, ...csvRows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `payroll-statement-${selectedMonth.label}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
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
      <style>
        {`
          @media print {
            body, html, #root {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .no-print, .MuiAppBar-root {
              display: none !important;
            }

            #payroll-statement-print {
              box-shadow: none !important;
              border: none !important;
              background: white !important;
              color: black !important;
              margin: 0 !important;
              width: 100% !important;
            }

            #payroll-statement-print * {
              color: black !important;
            }

            @page {
              size: A4 landscape;
              margin: 8mm;
            }
          }
        `}
      </style>

      <Box className="no-print">
        <Header />
      </Box>

      <Box className="no-print" sx={{ p: 2 }}>
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
            Payroll Statement
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        <Paper
          className="no-print"
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
            Payroll Statement
          </Typography>

          <Typography sx={{ color: "rgba(219,234,254,0.72)", mt: 0.8, mb: 3 }}>
            Company-level monthly payroll report for gross salary, deductions, loan, income tax and final payout.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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

            <TextField
              fullWidth
              label="Search Employee"
              placeholder="Search by name, ID, email, designation"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputLabelProps={{ sx: { color: "rgba(219,234,254,0.75)" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(219,234,254,0.65)" }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldStyle}
            />

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadPayrollStatement}
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
              disabled={!rows.length}
              sx={{
                minWidth: 160,
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

            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={!rows.length}
              sx={{
                minWidth: 120,
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 900,
                bgcolor: "#0ea5e9",
                "&:hover": {
                  bgcolor: "#0284c7",
                },
              }}
            >
              Print
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 3 }} className="no-print">
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Employees"
              value={totals.employees}
              subtitle="Employees in statement"
              icon={<GroupsIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Gross Salary"
              value={formatCurrency(totals.gross)}
              subtitle="Total monthly gross"
              icon={<PaymentsIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Total Deductions"
              value={formatCurrency(totals.deductions)}
              subtitle={`LOP ${formatCurrency(totals.lop)} | Loan ${formatCurrency(totals.loan)} | Tax ${formatCurrency(totals.tax)}`}
              icon={<TrendingDownIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Net Payout"
              value={formatCurrency(totals.net)}
              subtitle="Final payable salary"
              icon={<AccountBalanceWalletIcon />}
            />
          </Grid>
        </Grid>

        <Paper
          id="payroll-statement-print"
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
            <Typography sx={{ color: "white", fontSize: 24, fontWeight: 900 }}>
              {COMPANY_NAME} - Payroll Statement
            </Typography>

            <Typography sx={{ color: "rgba(219,234,254,0.75)", mt: 0.5 }}>
              Payroll Month: {selectedMonth.label} | Total Employees: {totals.employees} | Net Payout:{" "}
              {formatCurrency(totals.net)}
            </Typography>
          </Box>

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
                Loading payroll statement...
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 650 }}>
              <Table stickyHeader sx={{ minWidth: 1850 }}>
                <TableHead>
                  <TableRow>
                    {[
                      "#",
                      "Emp ID",
                      "Employee",
                      "Designation",
                      "Month",
                      "Working",
                      "Present",
                      "LOP",
                      "Annual CTC",
                      "Gross",
                      "LOP Deduction",
                      "Loan",
                      "Income Tax",
                      "Total Deductions",
                      "Net Salary",
                      "Status",
                    ].map((header) => (
                      <TableCell key={header} sx={headerCellStyle}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, index) => (
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
                        {formatCurrency(row.annualCtc)}
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

                  {rows.length > 0 && (
                    <TableRow sx={{ bgcolor: "rgba(30,64,175,0.72)" }}>
                      <TableCell sx={totalCellStyle} colSpan={9}>
                        TOTAL
                      </TableCell>
                      <TableCell sx={totalAmountCellStyle}>
                        {formatCurrency(totals.gross)}
                      </TableCell>
                      <TableCell sx={totalAmountCellStyle}>
                        {formatCurrency(totals.lop)}
                      </TableCell>
                      <TableCell sx={totalAmountCellStyle}>
                        {formatCurrency(totals.loan)}
                      </TableCell>
                      <TableCell sx={totalAmountCellStyle}>
                        {formatCurrency(totals.tax)}
                      </TableCell>
                      <TableCell sx={totalAmountCellStyle}>
                        {formatCurrency(totals.deductions)}
                      </TableCell>
                      <TableCell sx={totalAmountCellStyle}>
                        {formatCurrency(totals.net)}
                      </TableCell>
                      <TableCell sx={totalCellStyle}>-</TableCell>
                    </TableRow>
                  )}

                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={16}
                        sx={{
                          color: "#dbeafe",
                          textAlign: "center",
                          py: 6,
                          fontWeight: 900,
                          fontSize: 18,
                          bgcolor: "rgba(15,23,42,0.92)",
                        }}
                      >
                        No payroll statement found for {selectedMonth.label}
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

const totalCellStyle = {
  color: "white",
  borderColor: "rgba(147,197,253,0.24)",
  fontWeight: 900,
  whiteSpace: "nowrap",
};

const totalAmountCellStyle = {
  ...totalCellStyle,
  textAlign: "right",
  fontFamily: "monospace",
};
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Autocomplete,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Header from "./Header.js";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";

const COMPANY_NAME = "STIBIUM TECH";
const COMPANY_ADDRESS = "Bangalore, Karnataka, India";

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value) => `₹${formatMoney(value)}`;

const getMonthName = (month, year) => {
  if (!month || !year) return "-";

  const date = new Date(year, month - 1, 1);

  return date.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const getPayDate = (month, year) => {
  if (!month || !year) return "-";

  const date = new Date(year, month, 0);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getGrossEarnings = (employee) => Number(employee?.monthlyGross || 0);

const getTotalDeductions = (employee) => {
  if (!employee) return 0;

  return (
    Number(employee.lopDeduction || 0) +
    Number(employee.loanAmount || 0) +
    Number(employee.taxAmount || 0)
  );
};

const getNetPayable = (employee) => Number(employee?.netSalary || 0);

const splitEarnings = (monthlyGross) => {
  const gross = Number(monthlyGross || 0);

  const basic = gross * 0.5;
  const hra = gross * 0.25;
  const specialAllowance = gross - basic - hra;

  return {
    basic,
    hra,
    specialAllowance,
  };
};

const numberToWords = (num) => {
  const number = Math.floor(Number(num || 0));

  if (number === 0) return "Zero Rupees Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertTwoDigits = (n) => {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
  };

  const convertThreeDigits = (n) => {
    let word = "";

    if (n >= 100) {
      word += `${ones[Math.floor(n / 100)]} Hundred `;
      n %= 100;
    }

    if (n > 0) {
      word += convertTwoDigits(n);
    }

    return word.trim();
  };

  let amount = number;
  let words = "";

  const crore = Math.floor(amount / 10000000);
  amount %= 10000000;

  const lakh = Math.floor(amount / 100000);
  amount %= 100000;

  const thousand = Math.floor(amount / 1000);
  amount %= 1000;

  if (crore) words += `${convertThreeDigits(crore)} Crore `;
  if (lakh) words += `${convertThreeDigits(lakh)} Lakh `;
  if (thousand) words += `${convertThreeDigits(thousand)} Thousand `;
  if (amount) words += `${convertThreeDigits(amount)} `;

  return `${words.trim()} Rupees Only`;
};

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

const td = {
  border: "1px solid #333",
  padding: "5px 7px",
  fontSize: "13px",
  lineHeight: 1.25,
  verticalAlign: "middle",
};

const th = {
  ...td,
  fontWeight: 900,
  background: "#eef6ff",
  textTransform: "uppercase",
};

const amountTd = {
  ...td,
  textAlign: "right",
  fontFamily: "Arial, sans-serif",
};

export default function Payslips() {
  const defaultMonth =
    monthOptions.find((item) => item.month === 5 && item.year === 2026) ||
    monthOptions[4];

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const payrollMonthLabel = useMemo(() => {
    return getMonthName(selectedMonth.month, selectedMonth.year);
  }, [selectedMonth]);

  const earnings = splitEarnings(employee?.monthlyGross);
  const grossEarnings = getGrossEarnings(employee);
  const totalDeductions = getTotalDeductions(employee);
  const totalReimbursements = 0;
  const netPayable = getNetPayable(employee);

  const loadPayslipData = async () => {
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
        throw new Error("Failed to load processed payroll data");
      }

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];

      setEmployees(safeData);

      if (safeData.length > 0) {
        setEmployee(safeData[0]);
      } else {
        setEmployee(null);
      }
    } catch (err) {
      console.error("Payslip load error:", err);
      setError("Unable to load payslip data. Please process payroll first.");
      setEmployees([]);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayslipData();
  }, [selectedMonth]);

  const handlePrintPayslip = () => {
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
            html,
            body,
            #root {
              background: white !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .no-print,
            .MuiAppBar-root {
              display: none !important;
            }

            #payslip-page-wrapper {
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
            }

            #payslip-print-area {
              display: block !important;
              width: 190mm !important;
              max-width: 190mm !important;
              margin: 0 auto !important;
              box-shadow: none !important;
              border: none !important;
              background: white !important;
              color: black !important;
            }

            @page {
              size: A4;
              margin: 8mm;
            }
          }
        `}
      </style>

      <Box className="no-print">
        <Header />
      </Box>

      <Box id="payslip-page-wrapper" sx={{ p: 3 }}>
        <Box className="no-print">
          <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
            <Typography
              component={RouterLink}
              to="/updatepayroll"
              sx={{ color: "#dbeafe", textDecoration: "none", fontWeight: 700 }}
            >
              Payroll
            </Typography>

            <Typography sx={{ color: "rgba(219,234,254,0.45)" }}>/</Typography>

            <Typography sx={{ color: "white", fontWeight: 800 }}>
              Payslips
            </Typography>
          </Stack>

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
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, mb: 1, color: "white" }}
            >
              Payslips
            </Typography>

            <Typography sx={{ color: "rgba(219,234,254,0.72)", mb: 3 }}>
              Select processed payroll month and employee to view or download payslip.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mb: 1 }}
            >
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    bgcolor: "rgba(15,23,42,0.72)",
                    borderRadius: 2,
                  },
                  "& fieldset": { borderColor: "rgba(147,197,253,0.28)" },
                  "&:hover fieldset": { borderColor: "rgba(147,197,253,0.55)" },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                {monthOptions.map((item) => (
                  <MenuItem key={item.label} value={item.label}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                fullWidth
                options={employees}
                value={employee}
                loading={loading}
                getOptionLabel={(option) =>
                  option
                    ? `${option.employeeName || option.name} — #${option.employeeId}`
                    : ""
                }
                isOptionEqualToValue={(option, value) =>
                  String(option.employeeId) === String(value.employeeId)
                }
                onChange={(e, value) => setEmployee(value)}
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
                          {loading ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        bgcolor: "rgba(15,23,42,0.72)",
                        borderRadius: 2,
                      },
                      "& fieldset": { borderColor: "rgba(147,197,253,0.28)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(147,197,253,0.55)",
                      },
                    }}
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

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadPayslipData}
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
                startIcon={<PrintIcon />}
                disabled={!employee}
                onClick={handlePrintPayslip}
                sx={{
                  minWidth: 180,
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
                Print / Save PDF
              </Button>
            </Stack>
          </Paper>
        </Box>

        {!employee && !loading && (
          <Paper
            className="no-print"
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "rgba(15,23,42,0.70)",
              border: "1px dashed rgba(147,197,253,0.35)",
              borderRadius: 3,
              backdropFilter: "blur(14px)",
            }}
          >
            <Typography sx={{ color: "rgba(219,234,254,0.75)" }}>
              No processed payslip found. Please process payroll first.
            </Typography>
          </Paper>
        )}

        {employee && (
          <Paper
            id="payslip-print-area"
            sx={{
              width: "100%",
              maxWidth: "980px",
              mx: "auto",
              bgcolor: "white",
              color: "black",
              borderRadius: 1,
              boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
              overflow: "hidden",
              border: "6px solid rgba(191, 219, 254, 0.95)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Arial, sans-serif",
                color: "#000",
                background: "#fff",
              }}
            >
              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...td,
                      fontSize: "21px",
                      fontWeight: 500,
                      letterSpacing: "2px",
                      height: "30px",
                    }}
                  >
                    {COMPANY_NAME}
                  </td>

                  <td
                    colSpan={2}
                    style={{
                      ...td,
                      textAlign: "center",
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  >
                    COMPANY LOGO
                  </td>
                </tr>

                <tr>
                  <td colSpan={6} style={{ ...td, fontSize: "15px" }}>
                    {COMPANY_ADDRESS}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={6}
                    style={{
                      ...td,
                      textAlign: "center",
                      fontSize: "15px",
                      padding: "10px",
                    }}
                  >
                    Payslip for the Month of {payrollMonthLabel}
                  </td>
                </tr>

                <tr>
                  <td colSpan={3} style={{ ...td, verticalAlign: "top" }}>
                    <div style={{ fontWeight: 900, marginBottom: 5 }}>
                      Employee Pay Summary
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr>
                          <td style={{ width: "42%" }}>Employee Name</td>
                          <td style={{ width: "5%" }}>:</td>
                          <td>{employee.employeeName || employee.name || "-"}</td>
                        </tr>

                        <tr>
                          <td>Designation</td>
                          <td>:</td>
                          <td>{employee.designation || "-"}</td>
                        </tr>

                        <tr>
                          <td>Date of Joining</td>
                          <td>:</td>
                          <td>-</td>
                        </tr>

                        <tr>
                          <td>Pay Period</td>
                          <td>:</td>
                          <td>{payrollMonthLabel}</td>
                        </tr>

                        <tr>
                          <td>Pay Date</td>
                          <td>:</td>
                          <td>{getPayDate(selectedMonth.month, selectedMonth.year)}</td>
                        </tr>

                        <tr>
                          <td>Employee ID</td>
                          <td>:</td>
                          <td>{employee.employeeId}</td>
                        </tr>

                        <tr>
                          <td>Email</td>
                          <td>:</td>
                          <td>{employee.email || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  <td
                    colSpan={3}
                    style={{
                      ...td,
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <div style={{ fontSize: "21px", marginBottom: 4 }}>
                      Employee Net Pay
                    </div>

                    <div style={{ fontSize: "18px", fontWeight: 900 }}>
                      {formatCurrency(netPayable)}
                    </div>

                    <div style={{ marginTop: 8, fontSize: "15px" }}>
                      Paid Days: {employee.presentDays || 0} | LOP Days:{" "}
                      {employee.lopDays || 0}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style={th}>Earnings</td>
                  <td style={th}>Amount</td>
                  <td style={th}>YTD</td>
                  <td style={th}>Deductions</td>
                  <td style={th}>Amount</td>
                  <td style={th}>YTD</td>
                </tr>

                <tr>
                  <td style={td}>Basic Salary</td>
                  <td style={amountTd}>{formatCurrency(earnings.basic)}</td>
                  <td style={amountTd}>{formatCurrency(earnings.basic)}</td>
                  <td style={td}>LOP Deduction</td>
                  <td style={amountTd}>{formatCurrency(employee.lopDeduction)}</td>
                  <td style={amountTd}>{formatCurrency(employee.lopDeduction)}</td>
                </tr>

                <tr>
                  <td style={td}>House Rent Allowance</td>
                  <td style={amountTd}>{formatCurrency(earnings.hra)}</td>
                  <td style={amountTd}>{formatCurrency(earnings.hra)}</td>
                  <td style={td}>Loan Deduction</td>
                  <td style={amountTd}>{formatCurrency(employee.loanAmount)}</td>
                  <td style={amountTd}>{formatCurrency(employee.loanAmount)}</td>
                </tr>

                <tr>
                  <td style={td}>Special Allowance</td>
                  <td style={amountTd}>
                    {formatCurrency(earnings.specialAllowance)}
                  </td>
                  <td style={amountTd}>
                    {formatCurrency(earnings.specialAllowance)}
                  </td>
                  <td style={td}>Income Tax</td>
                  <td style={amountTd}>{formatCurrency(employee.taxAmount)}</td>
                  <td style={amountTd}>{formatCurrency(employee.taxAmount)}</td>
                </tr>

                <tr>
                  <td style={{ ...td, fontWeight: 900 }}>Gross Earnings</td>
                  <td style={{ ...amountTd, fontWeight: 900 }}>
                    {formatCurrency(grossEarnings)}
                  </td>
                  <td style={{ ...amountTd, fontWeight: 900 }}>
                    {formatCurrency(grossEarnings)}
                  </td>
                  <td style={{ ...td, fontWeight: 900 }}>Total Deductions</td>
                  <td style={{ ...amountTd, fontWeight: 900 }}>
                    {formatCurrency(totalDeductions)}
                  </td>
                  <td style={{ ...amountTd, fontWeight: 900 }}>
                    {formatCurrency(totalDeductions)}
                  </td>
                </tr>

                <tr>
                  <td style={th}>Reimbursements</td>
                  <td style={th}>Amount</td>
                  <td style={th}>YTD</td>
                  <td style={td}></td>
                  <td style={td}></td>
                  <td style={td}></td>
                </tr>

                <tr>
                  <td style={td}>Travel Reimbursement</td>
                  <td style={amountTd}>{formatCurrency(0)}</td>
                  <td style={amountTd}>{formatCurrency(0)}</td>
                  <td style={td}></td>
                  <td style={td}></td>
                  <td style={td}></td>
                </tr>

                <tr>
                  <td style={td}>Other Reimbursement</td>
                  <td style={amountTd}>{formatCurrency(0)}</td>
                  <td style={amountTd}>{formatCurrency(0)}</td>
                  <td style={td}></td>
                  <td style={td}></td>
                  <td style={td}></td>
                </tr>

                <tr>
                  <td style={{ ...td, fontWeight: 900 }}>
                    Total Reimbursements
                  </td>
                  <td style={{ ...amountTd, fontWeight: 900 }}>
                    {formatCurrency(totalReimbursements)}
                  </td>
                  <td style={{ ...amountTd, fontWeight: 900 }}>
                    {formatCurrency(totalReimbursements)}
                  </td>
                  <td style={td}></td>
                  <td style={td}></td>
                  <td style={td}></td>
                </tr>

                <tr>
                  <td colSpan={4} style={th}>
                    Net Pay
                  </td>
                  <td colSpan={2} style={th}>
                    Amount
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} style={td}>
                    Gross Earnings
                  </td>
                  <td colSpan={2} style={amountTd}>
                    {formatCurrency(grossEarnings)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} style={td}>
                    Total Deductions
                  </td>
                  <td colSpan={2} style={amountTd}>
                    {formatCurrency(totalDeductions)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} style={td}>
                    Total Reimbursements
                  </td>
                  <td colSpan={2} style={amountTd}>
                    {formatCurrency(totalReimbursements)}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...td,
                      textAlign: "right",
                      fontWeight: 900,
                    }}
                  >
                    Total Net Payable
                  </td>

                  <td
                    colSpan={2}
                    style={{
                      ...amountTd,
                      fontWeight: 900,
                    }}
                  >
                    {formatCurrency(netPayable)}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={6}
                    style={{
                      ...td,
                      textAlign: "center",
                      fontWeight: 900,
                      padding: "10px",
                    }}
                  >
                    Total Net Payable {formatCurrency(netPayable)} (
                    {numberToWords(netPayable)})
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={6}
                    style={{
                      ...td,
                      textAlign: "center",
                      fontSize: "13px",
                      padding: "8px",
                    }}
                  >
                    **Total Net Payable = Gross Earnings - Total Deductions +
                    Total Reimbursements
                  </td>
                </tr>
              </tbody>
            </table>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
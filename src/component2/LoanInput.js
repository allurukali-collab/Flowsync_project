// LoanInput.js
import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { Link as RouterLink } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import PercentIcon from "@mui/icons-material/Percent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const todayString = () => new Date().toISOString().split("T")[0];

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value) => `₹${formatMoney(value)}`;

const calculateMonthlyInstallment = (loanAmount, interestRate, installments) => {
  const amount = Number(loanAmount) || 0;
  const rate = Number(interestRate) || 0;
  const months = Number(installments) || 0;

  if (amount <= 0 || months <= 0) return 0;

  const interestAmount = rate > 0 ? (amount * rate * months) / (12 * 100) : 0;
  const totalPayable = amount + interestAmount;

  return totalPayable / months;
};

const fieldStyle = {
  "& .MuiInputLabel-root": {
    color: "rgba(226,232,240,0.68)",
    fontWeight: 700,
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    bgcolor: "rgba(15,23,42,0.48)",
    borderRadius: 2,
    "& fieldset": {
      borderColor: "rgba(148,163,184,0.22)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(147,197,253,0.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#60a5fa",
    },
  },
  "& input": {
    color: "white",
    fontWeight: 700,
  },
  "& textarea": {
    color: "white",
    fontWeight: 700,
  },
  "& .MuiSelect-icon": {
    color: "rgba(226,232,240,0.75)",
  },
};

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "rgba(15,23,42,0.84)",
        border: "1px solid rgba(148,163,184,0.16)",
        borderRadius: 4,
        boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography
              sx={{
                color: "rgba(226,232,240,0.58)",
                fontSize: 12,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: "white",
                fontSize: { xs: 21, md: 26 },
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
              width: 46,
              height: 46,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(59,130,246,0.17)",
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

function EmployeeMiniCard({ employee }) {
  if (!employee) return null;

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: "rgba(30,64,175,0.18)",
        border: "1px solid rgba(96,165,250,0.25)",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
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
        {(employee.name || employee.employeeName || "E").charAt(0)}
      </Box>

      <Box sx={{ flex: 1, minWidth: 260 }}>
        <Typography sx={{ color: "white", fontWeight: 900, fontSize: 17 }}>
          {employee.name || employee.employeeName} #{employee.employeeId}
        </Typography>

        <Typography sx={{ color: "rgba(226,232,240,0.65)", fontSize: 13, mt: 0.3 }}>
          {employee.designation || "-"} • {employee.email || "-"}
        </Typography>
      </Box>

      <Chip
        label="Manager: Pankaj #103"
        sx={{
          color: "#bfdbfe",
          bgcolor: "rgba(59,130,246,0.16)",
          border: "1px solid rgba(59,130,246,0.24)",
          fontWeight: 800,
        }}
      />

      <Chip
        label="Status: PENDING after save"
        sx={{
          color: "#fde68a",
          bgcolor: "rgba(245,158,11,0.14)",
          border: "1px solid rgba(245,158,11,0.24)",
          fontWeight: 800,
        }}
      />
    </Paper>
  );
}

export default function LoanInput() {
  const [activeTab, setActiveTab] = useState("General");
  const [employeeType, setEmployeeType] = useState("All");
  const [employee, setEmployee] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingLoan, setSavingLoan] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loanForm, setLoanForm] = useState({
    loanDate: todayString(),
    deductFrom: todayString(),
    createdDate: todayString(),
    loanType: "Personal",
    loanAccountNo: "",
    loanAmount: "",
    interestRate: 0,
    noOfInstallments: "",
    demandPromissoryNote: false,
    loanCompleted: false,
    perquisiteRate: 0,
    completedDate: "",
    remarks: "",
  });

  const monthlyInstallment = useMemo(() => {
    return calculateMonthlyInstallment(
      loanForm.loanAmount,
      loanForm.interestRate,
      loanForm.noOfInstallments
    );
  }, [loanForm.loanAmount, loanForm.interestRate, loanForm.noOfInstallments]);

  const interestBalance = useMemo(() => {
    const amount = Number(loanForm.loanAmount) || 0;
    const rate = Number(loanForm.interestRate) || 0;
    const months = Number(loanForm.noOfInstallments) || 0;

    if (amount <= 0 || months <= 0 || rate <= 0) return 0;

    return (amount * rate * months) / (12 * 100);
  }, [loanForm.loanAmount, loanForm.interestRate, loanForm.noOfInstallments]);

  const totalBalance = useMemo(() => {
    return (Number(loanForm.loanAmount) || 0) + interestBalance;
  }, [loanForm.loanAmount, interestBalance]);

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/employee/list", {
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
      setEmployees(data || []);
    } catch (err) {
      console.error("Employee load error:", err);
      setError("Unable to load real employee data. Please check backend.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (employeeType === "All") return true;

      const leavingDate = emp.leavingDate || emp.lastWorkingDate || null;

      if (employeeType === "Current") return !leavingDate || leavingDate === "-";

      return leavingDate && leavingDate !== "-";
    });
  }, [employees, employeeType]);

  const handleFormChange = (field, value) => {
    setLoanForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveLoan = async () => {
    try {
      setSavingLoan(true);
      setError("");
      setSuccessMessage("");

      if (!employee) {
        throw new Error("Please select employee first");
      }

      if (!loanForm.loanAmount || Number(loanForm.loanAmount) <= 0) {
        throw new Error("Please enter valid loan amount");
      }

      if (!loanForm.noOfInstallments || Number(loanForm.noOfInstallments) <= 0) {
        throw new Error("Please enter valid number of installments");
      }

      if (!loanForm.loanDate) {
        throw new Error("Please select loan date");
      }

      if (!loanForm.deductFrom) {
        throw new Error("Please select deduct from date");
      }

      const requestBody = {
        employeeId: employee.employeeId,
        loanDate: loanForm.loanDate,
        deductFrom: loanForm.deductFrom,
        loanType: loanForm.loanType,
        loanAccountNo: loanForm.loanAccountNo,
        loanAmount: Number(loanForm.loanAmount),
        interestRate: Number(loanForm.interestRate) || 0,
        noOfInstallments: Number(loanForm.noOfInstallments),
        demandPromissoryNote: loanForm.demandPromissoryNote,
        perquisiteRate: Number(loanForm.perquisiteRate) || 0,
        remarks: loanForm.remarks,
      };

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/payroll/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save loan");
      }

      const savedLoan = await response.json();

      setSuccessMessage(
        `Loan saved successfully. Status: ${savedLoan.status}. Manager: ${
          savedLoan.managerName || "Pankaj Karn"
        }`
      );
    } catch (err) {
      console.error("Loan save error:", err);
      setError(err.message || "Unable to save loan.");
    } finally {
      setSavingLoan(false);
    }
  };

  return (
    <>
      <Header />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          px: { xs: 2, md: 3 },
          pb: 5,
        }}
      >
        <Box sx={{ py: 2 }}>
          <Breadcrumbs
            separator=">"
            sx={{
              "& .MuiBreadcrumbs-separator": { color: "rgba(255,255,255,0.4)" },
            }}
          >
            <MuiLink
              component={RouterLink}
              to="/welcome"
              underline="hover"
              sx={{ color: "rgba(255,255,255,0.58)" }}
            >
              Home
            </MuiLink>

            <MuiLink
              component={RouterLink}
              to="/updatepayroll"
              underline="hover"
              sx={{ color: "rgba(255,255,255,0.58)" }}
            >
              Payroll
            </MuiLink>

            <Typography sx={{ color: "rgba(255,255,255,0.42)" }}>Loan</Typography>
          </Breadcrumbs>
        </Box>

        <Paper
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 2.5,
            bgcolor: "rgba(15,23,42,0.86)",
            border: "1px solid rgba(148,163,184,0.18)",
            borderRadius: 4,
            boxShadow: "0 25px 60px rgba(0,0,0,0.34)",
            backdropFilter: "blur(14px)",
          }}
        >
          <Grid container spacing={2.5} alignItems="center">
            <Grid item xs={12} lg={3}>
              <Typography sx={{ color: "white", fontSize: 28, fontWeight: 900 }}>
                Employee Loan
              </Typography>

              <Typography sx={{ color: "rgba(226,232,240,0.62)", mt: 0.6 }}>
                Create employee loan requests and route them to manager approval.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} md={2} lg={1.5}>
              <FormControl size="small" fullWidth sx={fieldStyle}>
                <InputLabel>Employee Type</InputLabel>
                <Select
                  value={employeeType}
                  label="Employee Type"
                  onChange={(e) => setEmployeeType(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "rgba(15,23,42,0.98)",
                        color: "white",
                      },
                    },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Current">Current</MenuItem>
                  <MenuItem value="Resigned">Resigned</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={8} md={7} lg={5}>
              <Autocomplete
                fullWidth
                size="small"
                options={filteredEmployees}
                value={employee}
                loading={loadingEmployees}
                getOptionLabel={(option) => {
                  if (!option) return "";
                  const empName = option.name || option.employeeName || "";
                  return `${empName} — #${option.employeeId}`;
                }}
                isOptionEqualToValue={(option, value) =>
                  option.employeeId === value.employeeId
                }
                onChange={(e, val) => setEmployee(val)}
                renderOption={(props, option) => {
                  const empName = option.name || option.employeeName || "";

                  return (
                    <Box
                      component="li"
                      {...props}
                      sx={{
                        color: "white",
                        fontSize: 15,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block !important",
                        py: "10px !important",
                        px: "16px !important",
                      }}
                    >
                      {empName} — #{option.employeeId}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search employee by name or ID"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "rgba(226,232,240,0.5)" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {loadingEmployees ? <CircularProgress size={18} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      ...fieldStyle,
                      "& .MuiAutocomplete-input": {
                        minWidth: "360px !important",
                      },
                    }}
                  />
                )}
                PaperComponent={(props) => (
                  <Paper
                    {...props}
                    sx={{
                      bgcolor: "rgba(15,23,42,0.98)",
                      border: "1px solid rgba(148,163,184,0.18)",
                      minWidth: 520,
                      maxWidth: 620,
                      "& .MuiAutocomplete-listbox": {
                        py: 0.5,
                      },
                      "& .MuiAutocomplete-option": {
                        color: "white",
                        fontSize: 15,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: 44,
                        "&:hover": {
                          bgcolor: "rgba(59,130,246,0.22)",
                        },
                        "&[aria-selected='true']": {
                          bgcolor: "rgba(59,130,246,0.28)",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={3} lg={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSaveLoan}
                disabled={savingLoan}
                sx={{
                  height: 40,
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                }}
              >
                {savingLoan ? "Saving..." : "Save Loan"}
              </Button>
            </Grid>
          </Grid>

          {(error || successMessage) && (
            <Box sx={{ mt: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </Box>
          )}

          <Box sx={{ mt: 2.5 }}>
            <EmployeeMiniCard employee={employee} />
          </Box>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Loan Amount"
              value={loanForm.loanAmount ? formatCurrency(loanForm.loanAmount) : "₹0.00"}
              subtitle="Principal amount"
              icon={<AccountBalanceWalletIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Monthly EMI"
              value={monthlyInstallment ? formatCurrency(monthlyInstallment) : "₹0.00"}
              subtitle={`${loanForm.noOfInstallments || 0} installments`}
              icon={<PaymentsIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Interest"
              value={formatCurrency(interestBalance)}
              subtitle={`${loanForm.interestRate || 0}% per annum`}
              icon={<PercentIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Deduct From"
              value={loanForm.deductFrom || "-"}
              subtitle="Payroll deduction month"
              icon={<CalendarMonthIcon />}
            />
          </Grid>
        </Grid>

        <Paper
          sx={{
            bgcolor: "rgba(15,23,42,0.88)",
            border: "1px solid rgba(148,163,184,0.18)",
            borderRadius: 4,
            boxShadow: "0 25px 60px rgba(0,0,0,0.30)",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            textColor="inherit"
            sx={{
              px: 2,
              bgcolor: "rgba(15,23,42,0.72)",
              borderBottom: "1px solid rgba(148,163,184,0.14)",
              "& .MuiTab-root": {
                color: "rgba(226,232,240,0.55)",
                fontWeight: 900,
                textTransform: "none",
                minHeight: 58,
              },
              "& .Mui-selected": {
                color: "white",
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 3,
                bgcolor: "#38bdf8",
              },
            }}
          >
            <Tab label="General" value="General" />
            <Tab label="Loan Details" value="Loan Details" />
            <Tab label="Loan Repayments" value="Loan Repayments" />
            <Tab label="Loan Revision" value="Loan Revision" />
          </Tabs>

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {activeTab === "General" && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900 }}>
                    Loan Details
                  </Typography>

                  <Typography sx={{ color: "rgba(226,232,240,0.58)", mt: 0.5 }}>
                    Add principal, deduction date, installment count and loan type.
                  </Typography>
                </Box>

                <Grid container spacing={2.2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date of Loan"
                      type="date"
                      size="small"
                      value={loanForm.loanDate}
                      onChange={(e) => handleFormChange("loanDate", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Amount"
                      size="small"
                      type="number"
                      value={loanForm.loanAmount}
                      onChange={(e) => handleFormChange("loanAmount", e.target.value)}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Deduct From"
                      type="date"
                      size="small"
                      value={loanForm.deductFrom}
                      onChange={(e) => handleFormChange("deductFrom", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Interest Rate (% p.a.)"
                      size="small"
                      type="number"
                      value={loanForm.interestRate}
                      onChange={(e) => handleFormChange("interestRate", e.target.value)}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Created Date"
                      type="date"
                      size="small"
                      value={loanForm.createdDate}
                      onChange={(e) => handleFormChange("createdDate", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="No of Installments"
                      size="small"
                      type="number"
                      value={loanForm.noOfInstallments}
                      onChange={(e) =>
                        handleFormChange("noOfInstallments", e.target.value)
                      }
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Loan Type"
                      select
                      size="small"
                      value={loanForm.loanType}
                      onChange={(e) => handleFormChange("loanType", e.target.value)}
                      sx={fieldStyle}
                    >
                      <MenuItem value="Personal">Personal</MenuItem>
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="Emergency">Emergency</MenuItem>
                      <MenuItem value="Education">Education</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Loan Account No"
                      size="small"
                      value={loanForm.loanAccountNo}
                      onChange={(e) =>
                        handleFormChange("loanAccountNo", e.target.value)
                      }
                      sx={fieldStyle}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ borderColor: "rgba(148,163,184,0.14)", my: 3 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900 }}>
                    Installment Details
                  </Typography>

                  <Typography sx={{ color: "rgba(226,232,240,0.58)", mt: 0.5 }}>
                    These values are auto-calculated before saving.
                  </Typography>
                </Box>

                <Grid container spacing={2.2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Monthly Installment"
                      size="small"
                      value={monthlyInstallment ? monthlyInstallment.toFixed(2) : ""}
                      InputProps={{ readOnly: true }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Principal Balance"
                      size="small"
                      value={loanForm.loanAmount || ""}
                      InputProps={{ readOnly: true }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Interest Balance"
                      size="small"
                      value={interestBalance ? interestBalance.toFixed(2) : "0.00"}
                      InputProps={{ readOnly: true }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Total Balance"
                      size="small"
                      value={totalBalance ? totalBalance.toFixed(2) : ""}
                      InputProps={{ readOnly: true }}
                      sx={fieldStyle}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ borderColor: "rgba(148,163,184,0.14)", my: 3 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900 }}>
                    Other Information
                  </Typography>
                </Box>

                <Grid container spacing={2.2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={loanForm.demandPromissoryNote}
                          onChange={(e) =>
                            handleFormChange(
                              "demandPromissoryNote",
                              e.target.checked
                            )
                          }
                          sx={{ color: "white" }}
                        />
                      }
                      label="Demand Promissory Note"
                      sx={{ color: "rgba(226,232,240,0.75)" }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={loanForm.loanCompleted}
                          onChange={(e) =>
                            handleFormChange("loanCompleted", e.target.checked)
                          }
                          sx={{ color: "white" }}
                        />
                      }
                      label="Loan Completed"
                      sx={{ color: "rgba(226,232,240,0.75)" }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Perquisite Rate"
                      size="small"
                      type="number"
                      value={loanForm.perquisiteRate}
                      onChange={(e) =>
                        handleFormChange("perquisiteRate", e.target.value)
                      }
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Completed Date"
                      type="date"
                      size="small"
                      value={loanForm.completedDate}
                      onChange={(e) =>
                        handleFormChange("completedDate", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Remarks"
                      multiline
                      rows={3}
                      size="small"
                      value={loanForm.remarks}
                      onChange={(e) => handleFormChange("remarks", e.target.value)}
                      sx={fieldStyle}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    mt: 3,
                  }}
                >
                  <Button
                    component={RouterLink}
                    to="/salary"
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      color: "#bfdbfe",
                      borderColor: "rgba(147,197,253,0.35)",
                      fontWeight: 900,
                    }}
                  >
                    Back to Salary
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleSaveLoan}
                    disabled={savingLoan}
                    startIcon={<CheckCircleOutlineIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 900,
                      px: 3,
                    }}
                  >
                    {savingLoan ? "Saving..." : "Save Loan"}
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === "Loan Details" && (
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: "rgba(15,23,42,0.55)",
                  border: "1px solid rgba(148,163,184,0.14)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "rgba(30,64,175,0.22)" }}>
                      {[
                        "Date",
                        "Trans Type",
                        "Amount",
                        "To Principal",
                        "To Interest",
                        "Actual Principal",
                        "Actual Interest",
                        "Remarks",
                        "Perk Value",
                        "Perk Amount",
                        "Perk Rate",
                      ].map((head) => (
                        <TableCell key={head} sx={{ color: "white", fontWeight: 900 }}>
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        sx={{
                          color: "rgba(226,232,240,0.6)",
                          textAlign: "center",
                          py: 4,
                        }}
                      >
                        No loan transaction data yet.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {activeTab === "Loan Repayments" && (
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: "rgba(15,23,42,0.55)",
                  border: "1px solid rgba(148,163,184,0.14)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "rgba(30,64,175,0.22)" }}>
                      {[
                        "Date",
                        "To Principal",
                        "To Interest",
                        "Remarks",
                        "Modify Date",
                        "Modified By",
                      ].map((head) => (
                        <TableCell key={head} sx={{ color: "white", fontWeight: 900 }}>
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{
                          color: "rgba(226,232,240,0.6)",
                          textAlign: "center",
                          py: 4,
                        }}
                      >
                        No repayments available yet.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {activeTab === "Loan Revision" && (
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "rgba(15,23,42,0.55)",
                  border: "1px solid rgba(148,163,184,0.14)",
                  borderRadius: 3,
                }}
              >
                <Typography sx={{ color: "white", fontSize: 21, fontWeight: 900, mb: 1 }}>
                  Loan Revision
                </Typography>

                <Typography sx={{ color: "rgba(226,232,240,0.6)" }}>
                  Top-up and revision flow can be connected after base loan approval and deduction is completed.
                </Typography>
              </Paper>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
}
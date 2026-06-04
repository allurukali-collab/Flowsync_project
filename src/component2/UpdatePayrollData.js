import React, { useState, useMemo, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import Header from "./Header";
import {
  Typography,
  Button,
  IconButton,
  Box,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const generateMonths = (startDate, count) => {
  const months = [];
  const date = new Date(startDate);

  for (let i = 0; i < count; i++) {
    months.push({
      label: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      date: new Date(date),
    });
    date.setMonth(date.getMonth() + 1);
  }

  return months;
};

const formatCurrency = (amount) => {
  const numericAmount = Number(amount);

  if (amount === null || amount === undefined || Number.isNaN(numericAmount)) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const calculatePayroll = (
  experienceYears,
  workingDays,
  lopDays,
  loanAmount,
  taxAmount
) => {
  const safeExperience = Number(experienceYears) || 0;
  const safeWorkingDays = Number(workingDays) || 0;
  const safeLopDays = Number(lopDays) || 0;
  const safeLoanAmount = Number(loanAmount) || 0;
  const safeTaxAmount = Number(taxAmount) || 0;

  const annualCtc = (4 + safeExperience * 2) * 100000;
  const monthlyGross = annualCtc / 12;
  const perDaySalary =
    safeWorkingDays > 0 ? monthlyGross / safeWorkingDays : 0;
  const lopDeduction = perDaySalary * safeLopDays;
  const netSalary =
    monthlyGross - lopDeduction - safeLoanAmount - safeTaxAmount;

  return {
    annualCtc,
    monthlyGross,
    perDaySalary,
    lopDeduction,
    netSalary: netSalary < 0 ? 0 : netSalary,
  };
};

function MonthPicker({
  monthsToShow = 12,
  onMonthChange,
  onProcessPayroll,
  processLoading,
}) {
  const today = useMemo(() => new Date(), []);

  const allowedFutureLimit = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + 1, 1),
    [today]
  );

  const start = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() - 3, 1),
    [today]
  );

  const months = useMemo(
    () => generateMonths(start, monthsToShow),
    [start, monthsToShow]
  );

  const [selectedIndex, setSelectedIndex] = useState(
    months.findIndex(
      (m) =>
        m.date.getMonth() === today.getMonth() &&
        m.date.getFullYear() === today.getFullYear()
    )
  );

  const [openDelete, setOpenDelete] = useState(false);

  const handleSelect = (idx) => {
    if (months[idx].date > allowedFutureLimit) return;

    setSelectedIndex(idx);

    onMonthChange && onMonthChange(months[idx].date);
  };

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const selectedMonth =
    selectedIndex >= 0 ? months[selectedIndex] : months[0];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          bgcolor: "rgba(255, 255, 255, 0.29)",
          backdropFilter: "blur(8px)",
          p: 1,
          borderRadius: 1,
          mb: 2,
        }}
      >
        <IconButton disabled sx={{ color: "rgba(255,255,255,0.6)" }}>
          <ArrowBackIos />
        </IconButton>

        {months.map((m, idx) => {
          const isFuture = m.date > allowedFutureLimit;
          const isSelected = idx === selectedIndex;

          return (
            <Button
              key={`${m.label}-${m.year}`}
              onClick={() => handleSelect(idx)}
              disabled={isFuture}
              sx={{
                mx: 0.5,
                flexShrink: 0,
                color: isSelected ? "common.white" : "rgba(255,255,255,0.7)",
                bgcolor: isSelected ? "primary.main" : "transparent",
                textTransform: "uppercase",
                borderRadius: 1,
                "&:hover": {
                  bgcolor: isSelected
                    ? "primary.dark"
                    : "rgba(255,255,255,0.2)",
                },
              }}
            >
              <Typography variant="button" sx={{ fontWeight: 600 }}>
                {m.label}
              </Typography>
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {m.year}
              </Typography>
            </Button>
          );
        })}

        <IconButton disabled sx={{ color: "rgba(255,255,255,0.6)" }}>
          <ArrowForwardIos />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "rgba(255,255,255,0.05)",
          p: 2,
          borderRadius: 1,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ color: "common.white" }}>
            {selectedMonth.label} {selectedMonth.year}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontStyle: "italic",
              }}
            >
              Cutoff from 01 {selectedMonth.label} {selectedMonth.year} to 31{" "}
              {selectedMonth.label} {selectedMonth.year}
            </Typography>

            <IconButton
              size="small"
              sx={{ color: "rgba(255,255,255,0.7)", ml: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              sx={{ color: "error.light", ml: 0.5 }}
              onClick={handleOpenDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Button
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={onProcessPayroll}
          disabled={processLoading}
        >
          {processLoading ? "Processing..." : "Process Payroll"}
        </Button>
      </Box>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(2px)",
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "rgba(139, 139, 139, 0.19)" }}>
          Delete Payroll
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "rgba(139, 139, 139, 0.19)" }}>
          <DialogContentText sx={{ color: "text.primary" }}>
            ⚠️ Deleted records cannot be retrieved!
            <br />
            You are about to delete payroll for {selectedMonth.label}{" "}
            {selectedMonth.year}.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ bgcolor: "rgba(139, 139, 139, 0.19)" }}>
          <Button onClick={handleCloseDelete}>Cancel</Button>

          <Button
            onClick={() => {
              handleCloseDelete();
            }}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function UpdatePayrollData() {
  const [activeTab] = useState("Payroll Overview");
  const [employees, setEmployees] = useState([]);
  const [payrollInputs, setPayrollInputs] = useState({});
  const [selectedPayrollDate, setSelectedPayrollDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadPayrollAttendance = async (dateValue) => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const selectedDate = dateValue || new Date();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/payroll/attendance?month=${month}&year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load payroll attendance data");
      }

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];

      setEmployees(safeData);

      const defaultInputs = {};

      safeData.forEach((employee) => {
        defaultInputs[employee.employeeId] = {
          experienceYears: employee.experienceYears || 0,

          /*
            Loan and tax are automatic from backend:
            loanAmount = approved loan EMI
            taxAmount = income tax setup for selected month/year
          */
          loanAmount: Number(employee.loanAmount) || 0,
          taxAmount: Number(employee.taxAmount) || 0,
        };
      });

      setPayrollInputs(defaultInputs);
    } catch (err) {
      console.error("Payroll attendance load error:", err);
      setError(
        "Unable to load payroll attendance. Please check backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrollAttendance(selectedPayrollDate);
  }, [selectedPayrollDate]);

  const handleMonthChange = (date) => {
    setSelectedPayrollDate(date);
  };

  const handleInputChange = (employeeId, field, value) => {
    /*
      Only experience is editable.
      Loan and Tax are automatic from backend.
    */
    if (field === "loanAmount" || field === "taxAmount") {
      return;
    }

    setPayrollInputs((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value,
      },
    }));
  };

  const handleRefreshPayroll = () => {
    loadPayrollAttendance(selectedPayrollDate);
  };

  const handleProcessPayroll = async () => {
    try {
      setProcessLoading(true);
      setError("");
      setSuccessMessage("");

      if (!employees || employees.length === 0) {
        throw new Error("No employee payroll data available to process.");
      }

      const selectedDate = selectedPayrollDate || new Date();
      const payrollMonth = selectedDate.getMonth() + 1;
      const payrollYear = selectedDate.getFullYear();

      const requestBody = employees.map((employee) => {
        const input = payrollInputs[employee.employeeId] || {
          experienceYears: employee.experienceYears || 0,
          loanAmount: Number(employee.loanAmount) || 0,
          taxAmount: Number(employee.taxAmount) || 0,
        };

        /*
          Important:
          Loan and tax are always taken from backend employee object,
          not from manual editable input.
        */
        const automaticLoanAmount = Number(employee.loanAmount) || 0;
        const automaticTaxAmount = Number(employee.taxAmount) || 0;

        const payroll = calculatePayroll(
          input.experienceYears,
          employee.workingDays,
          employee.lopDays,
          automaticLoanAmount,
          automaticTaxAmount
        );

        return {
          employeeId: employee.employeeId,
          employeeName: employee.employeeName || employee.name,
          email: employee.email,
          designation: employee.designation,

          payrollMonth,
          payrollYear,

          totalMonthDays: employee.totalMonthDays,
          workingDays: employee.workingDays,
          timesheetPresentDays: employee.timesheetPresentDays,
          approvedReconciliationDays: employee.approvedReconciliationDays,
          presentDays: employee.presentDays,
          lopDays: employee.lopDays,

          experienceYears: Number(input.experienceYears) || 0,

          annualCtc: Number(payroll.annualCtc.toFixed(2)),
          monthlyGross: Number(payroll.monthlyGross.toFixed(2)),
          perDaySalary: Number(payroll.perDaySalary.toFixed(2)),
          lopDeduction: Number(payroll.lopDeduction.toFixed(2)),

          loanAmount: Number(automaticLoanAmount.toFixed(2)),
          taxAmount: Number(automaticTaxAmount.toFixed(2)),

          netSalary: Number(payroll.netSalary.toFixed(2)),

          processedBy: "ADMIN",
        };
      });

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/payroll/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to process payroll");
      }

      const savedPayroll = await response.json();

      setSuccessMessage(
        `Payroll processed successfully for ${savedPayroll.length} employees.`
      );
    } catch (err) {
      console.error("Process payroll error:", err);
      setError(err.message || "Unable to process payroll.");
    } finally {
      setProcessLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ p: 2, bgcolor: "rgba(10,20,40,0.7)" }}>
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
            underline="hover"
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            Home
          </MuiLink>

          <MuiLink
            component={RouterLink}
            to="/updatepayroll"
            underline="hover"
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            Payroll
          </MuiLink>

          <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
            {activeTab}
          </Typography>
        </Breadcrumbs>
      </Box>

      <MonthPicker
        onMonthChange={handleMonthChange}
        onProcessPayroll={handleProcessPayroll}
        processLoading={processLoading}
      />

      <Box sx={{ px: 3, pb: 4 }}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "rgba(15, 23, 42, 0.78)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Payroll Inputs
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.75)", mb: 1.5 }}
          >
            LOP Days are automatically calculated from Work Tracker and Approved
            Leave Reconciliation. Loan is automatically fetched from approved
            loan EMI. Tax is automatically fetched from Income Tax setup.
          </Typography>

          <Button
            variant="outlined"
            onClick={handleRefreshPayroll}
            disabled={loading}
            sx={{
              textTransform: "none",
              color: "white",
              borderColor: "rgba(255,255,255,0.35)",
            }}
          >
            Refresh Payroll Inputs
          </Button>
        </Paper>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 2,
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 1500 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(255,255,255,0.08)" }}>
                  <TableCell sx={headerCellStyle}>Employee ID</TableCell>
                  <TableCell sx={headerCellStyle}>Name</TableCell>
                  <TableCell sx={headerCellStyle}>Designation</TableCell>
                  <TableCell sx={headerCellStyle}>Experience</TableCell>
                  <TableCell sx={headerCellStyle}>Working Days</TableCell>
                  <TableCell sx={headerCellStyle}>Timesheet Present</TableCell>
                  <TableCell sx={headerCellStyle}>
                    Approved Reconciliation
                  </TableCell>
                  <TableCell sx={headerCellStyle}>LOP Days</TableCell>
                  <TableCell sx={headerCellStyle}>Annual CTC</TableCell>
                  <TableCell sx={headerCellStyle}>Monthly Gross</TableCell>
                  <TableCell sx={headerCellStyle}>LOP Deduction</TableCell>
                  <TableCell sx={headerCellStyle}>Loan Auto</TableCell>
                  <TableCell sx={headerCellStyle}>Tax Auto</TableCell>
                  <TableCell sx={headerCellStyle}>Net Salary</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {employees.map((employee) => {
                  const input = payrollInputs[employee.employeeId] || {
                    experienceYears: employee.experienceYears || 0,
                    loanAmount: Number(employee.loanAmount) || 0,
                    taxAmount: Number(employee.taxAmount) || 0,
                  };

                  const automaticLoanAmount = Number(employee.loanAmount) || 0;
                  const automaticTaxAmount = Number(employee.taxAmount) || 0;

                  const payroll = calculatePayroll(
                    input.experienceYears,
                    employee.workingDays,
                    employee.lopDays,
                    automaticLoanAmount,
                    automaticTaxAmount
                  );

                  return (
                    <TableRow key={employee.employeeId}>
                      <TableCell sx={{ color: "white" }}>
                        {employee.employeeId}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {employee.employeeName || employee.name}

                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          {employee.email}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        <Chip
                          label={employee.designation || "-"}
                          size="small"
                          sx={{
                            color: "white",
                            bgcolor: "rgba(33,150,243,0.25)",
                            border: "1px solid rgba(33,150,243,0.4)",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={input.experienceYears}
                          onChange={(e) =>
                            handleInputChange(
                              employee.employeeId,
                              "experienceYears",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 0 }}
                          sx={{
                            width: 90,
                            input: { color: "white" },
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.35)",
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {employee.workingDays}
                      </TableCell>

                      <TableCell sx={{ color: "#4caf50", fontWeight: 700 }}>
                        {employee.timesheetPresentDays}
                      </TableCell>

                      <TableCell sx={{ color: "#2196f3", fontWeight: 700 }}>
                        {employee.approvedReconciliationDays}
                      </TableCell>

                      <TableCell sx={{ color: "#ff5252", fontWeight: 700 }}>
                        {employee.lopDays}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatCurrency(payroll.annualCtc)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatCurrency(payroll.monthlyGross)}
                      </TableCell>

                      <TableCell sx={{ color: "#ff9800", fontWeight: 700 }}>
                        {formatCurrency(payroll.lopDeduction)}
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Auto fetched from approved loan EMI">
                          <TextField
                            size="small"
                            type="number"
                            value={automaticLoanAmount}
                            disabled
                            sx={autoFieldStyle}
                          />
                        </Tooltip>
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Auto fetched from Income Tax setup">
                          <TextField
                            size="small"
                            type="number"
                            value={automaticTaxAmount}
                            disabled
                            sx={autoFieldStyle}
                          />
                        </Tooltip>
                      </TableCell>

                      <TableCell sx={{ color: "#4caf50", fontWeight: 700 }}>
                        {formatCurrency(payroll.netSalary)}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {employees.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={14}
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        textAlign: "center",
                        py: 4,
                      }}
                    >
                      No payroll attendance data found for selected month.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

const headerCellStyle = {
  color: "white",
  fontWeight: 700,
};

const autoFieldStyle = {
  width: 120,
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#90caf9",
    fontWeight: 700,
  },
  "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
    borderColor: "rgba(144,202,249,0.35)",
  },
};
// src/component2/FinalSettlement.js
import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";

const API_BASE_URL = "http://localhost:8080";

const monthOptions = [
  { value: "All", label: "All" },
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const getMonthName = (month) => {
  const found = monthOptions.find((item) => Number(item.value) === Number(month));
  return found ? found.label : month;
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

export default function FinalSettlement() {
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterEmployee, setFilterEmployee] = useState("All");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settlingId, setSettlingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handlePay = () => {
    navigate("/finalsettlement/settleEmployee");
  };

  const loadFinalSettlements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/payroll/final-settlement`);

      if (!response.ok) {
        throw new Error("Unable to load final settlement records");
      }

      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load final settlement records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinalSettlements();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const monthMatch =
        filterMonth === "All" ||
        String(row.settlementMonth) === String(filterMonth);

      const employeeMatch =
        filterEmployee === "All" ||
        String(row.status || "").toUpperCase() === String(filterEmployee).toUpperCase();

      return monthMatch && employeeMatch;
    });
  }, [rows, filterMonth, filterEmployee]);

  const handleMarkSettled = async (finalSettlementId) => {
    try {
      setSettlingId(finalSettlementId);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/final-settlement/${finalSettlementId}/settled?settledBy=ADMIN`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to mark final settlement as settled");
      }

      setMessage("Final settlement marked as settled successfully");
      await loadFinalSettlements();
    } catch (err) {
      setError(err.message || "Unable to mark final settlement as settled");
    } finally {
      setSettlingId(null);
    }
  };

  return (
    <>
      <Header />

      <Box sx={{ p: 2, bgcolor: "rgba(10,20,40,0.7)" }}>
        <Breadcrumbs separator=">">
          <MuiLink
            component={RouterLink}
            to="/"
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
            Final Settlement
          </Typography>
        </Breadcrumbs>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mx: 2, mt: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mx: 2, mt: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          px: 2,
          py: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl
            size="small"
            sx={{
              minWidth: 140,
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.8)",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.6)",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiSelect-select": {
                color: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterMonth}
              label="Filter"
              onChange={(e) => setFilterMonth(e.target.value)}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.6)",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#0f172a",
                    color: "#ffffff",
                  },
                },
              }}
            >
              {monthOptions.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              minWidth: 160,
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.8)",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.6)",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiSelect-select": {
                color: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={filterEmployee}
              label="Status"
              onChange={(e) => setFilterEmployee(e.target.value)}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.6)",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#0f172a",
                    color: "#ffffff",
                  },
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="SETTLED">Settled</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={loadFinalSettlements}>
            Refresh
          </Button>
        </Stack>

        <Button onClick={handlePay} variant="contained">
          Settle Employee
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mx: 2,
          mt: 1,
          mb: 4,
          bgcolor: "rgba(226, 223, 223, 0.14)",
          boxShadow: "none",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& .MuiTableCell-stickyHeader": {
                  backgroundColor: "rgb(0, 0, 0)",
                  color: "white",
                },
              }}
            >
              {[
                "#",
                "Payout Month",
                "Serial No",
                "Emp ID",
                "Employee Name",
                "Leaving Date",
                "Settlement Date",
                "Net Pay",
                "Processed On",
                "Lock / Unlock",
              ].map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    color: "rgba(255, 241, 241, 0.7)",
                    bgcolor: "rgba(0,0,0,0)",
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  align="center"
                  sx={{ py: 4, color: "rgba(255,255,255,0.7)" }}
                >
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  align="center"
                  sx={{ py: 4, color: "rgba(255,255,255,0.5)" }}
                >
                  No settlement records to display.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, idx) => (
                <TableRow key={row.finalSettlementId || idx} hover>
                  <TableCell sx={{ color: "white" }}>{idx + 1}</TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {getMonthName(row.settlementMonth)} {row.settlementYear}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {row.finalSettlementId}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {row.employeeId}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {row.employeeName || "-"}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {formatDate(row.lastWorkingDate)}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {formatDate(row.settledAt)}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {formatAmount(row.finalPayableAmount)}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {formatDate(row.createdAt)}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {String(row.status).toUpperCase() === "PENDING" ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={settlingId === row.finalSettlementId}
                        onClick={() => handleMarkSettled(row.finalSettlementId)}
                      >
                        {settlingId === row.finalSettlementId
                          ? "Processing..."
                          : "Settle"}
                      </Button>
                    ) : (
                      <Chip label="SETTLED" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
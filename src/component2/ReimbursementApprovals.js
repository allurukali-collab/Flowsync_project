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
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const API_BASE_URL = "http://localhost:8080";
const PANKAJ_MANAGER_ID = "103";

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

const getLoggedInEmployeeId = () => {
  const directEmployeeId =
    localStorage.getItem("employeeId") ||
    localStorage.getItem("empId") ||
    localStorage.getItem("userEmployeeId") ||
    localStorage.getItem("loggedInEmployeeId");

  if (directEmployeeId) {
    return String(directEmployeeId);
  }

  const userData =
    localStorage.getItem("user") ||
    localStorage.getItem("userData") ||
    localStorage.getItem("loggedInUser");

  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);

      return String(
        parsedUser.employeeId ||
          parsedUser.empId ||
          parsedUser.userEmployeeId ||
          parsedUser.id ||
          ""
      );
    } catch (error) {
      return "";
    }
  }

  return "";
};

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value) => `₹${formatMoney(value)}`;

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

            <Typography sx={{ color: "white", fontSize: 26, fontWeight: 900, mt: 1 }}>
              {value}
            </Typography>

            <Typography sx={{ color: "rgba(219,234,254,0.55)", fontSize: 13, mt: 1 }}>
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

export default function ReimbursementApprovals() {
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loggedInEmployeeId = getLoggedInEmployeeId();
  const isPankajManager = loggedInEmployeeId === PANKAJ_MANAGER_ID;

  const pendingRecords = useMemo(() => {
    return records.filter(
      (item) => String(item.status || "").toUpperCase() === "PENDING"
    );
  }, [records]);

  const approvedAmount = useMemo(() => {
    return records
      .filter((item) => String(item.status || "").toUpperCase() === "APPROVED")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [records]);

  const pendingAmount = useMemo(() => {
    return pendingRecords.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [pendingRecords]);

  const loadReimbursements = async () => {
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
      console.error("Load reimbursement approvals error:", err);
      setError("Unable to load reimbursement records.");
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadReimbursements();
  }, []);

  const handleApprove = async (record) => {
    try {
      setProcessingId(record.reimbursementId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/reimbursement/${record.reimbursementId}/approve?approvedBy=${PANKAJ_MANAGER_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to approve reimbursement");
      }

      setSuccessMessage("Reimbursement approved successfully.");
      await loadReimbursements();
    } catch (err) {
      console.error("Approve reimbursement error:", err);
      setError(err.message || "Unable to approve reimbursement.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (record) => {
    try {
      setProcessingId(record.reimbursementId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/payroll/reimbursement/${record.reimbursementId}/reject?rejectedBy=${PANKAJ_MANAGER_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to reject reimbursement");
      }

      setSuccessMessage("Reimbursement rejected successfully.");
      await loadReimbursements();
    } catch (err) {
      console.error("Reject reimbursement error:", err);
      setError(err.message || "Unable to reject reimbursement.");
    } finally {
      setProcessingId(null);
    }
  };

  if (!isPankajManager) {
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

        <Box sx={{ p: 4 }}>
          <Alert severity="error">
            Access denied. Only Pankaj / Director can approve reimbursements.
          </Alert>
        </Box>
      </Box>
    );
  }

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
            to="/reimbursement"
            sx={{ color: "#dbeafe", textDecoration: "none", fontWeight: 700 }}
          >
            Reimbursement
          </MuiLink>

          <Typography sx={{ color: "white", fontWeight: 800 }}>
            Reimbursement Approvals
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
            Reimbursement Approvals
          </Typography>

          <Typography sx={{ color: "rgba(219,234,254,0.72)", mt: 0.8, mb: 3 }}>
            Only Pankaj / Director can approve or reject employee reimbursement requests.
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

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadReimbursements}
            disabled={loadingRecords}
            sx={{
              color: "#dbeafe",
              borderColor: "rgba(147,197,253,0.55)",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 800,
            }}
          >
            Refresh Approvals
          </Button>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Pending Requests"
              value={pendingRecords.length}
              subtitle="Waiting for director approval"
              icon={<PendingActionsIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Pending Amount"
              value={formatCurrency(pendingAmount)}
              subtitle="Yet to approve"
              icon={<AccountBalanceWalletIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Approved Amount"
              value={formatCurrency(approvedAmount)}
              subtitle="Already approved"
              icon={<CheckCircleIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Total Records"
              value={records.length}
              subtitle="All reimbursement records"
              icon={<RefreshIcon />}
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
              Pending Reimbursement Requests
            </Typography>
          </Box>

          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "Employee ID",
                    "Month",
                    "Type",
                    "Amount",
                    "Bill No",
                    "Status",
                    "Remarks",
                    "Action",
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
                    <TableCell colSpan={9} sx={emptyCellStyle}>
                      Loading reimbursement approval records...
                    </TableCell>
                  </TableRow>
                )}

                {!loadingRecords &&
                  pendingRecords.map((record, index) => (
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
                      <TableCell sx={bodyCellStyle}>#{record.employeeId}</TableCell>
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
                            bgcolor: "rgba(245,158,11,0.55)",
                            fontWeight: 800,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>{record.remarks || "-"}</TableCell>
                      <TableCell sx={bodyCellStyle}>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            disabled={processingId === record.reimbursementId}
                            onClick={() => handleApprove(record)}
                            sx={{
                              bgcolor: "#16a34a",
                              textTransform: "none",
                              fontWeight: 900,
                            }}
                          >
                            Approve
                          </Button>

                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<CancelIcon />}
                            disabled={processingId === record.reimbursementId}
                            onClick={() => handleReject(record)}
                            sx={{
                              bgcolor: "#dc2626",
                              textTransform: "none",
                              fontWeight: 900,
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                {!loadingRecords && pendingRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} sx={emptyCellStyle}>
                      No pending reimbursement approvals found.
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
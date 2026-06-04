import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Link as RouterLink } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const MANAGER_ID = 103;

const formatMoney = (value) => {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value) => `₹${formatMoney(value)}`;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "rgba(15,23,42,0.86)",
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

            <Typography sx={{ color: "rgba(226,232,240,0.55)", fontSize: 13, mt: 1 }}>
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

export default function LoanApprovals() {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadPendingLoans = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/payroll/loan/manager/${MANAGER_ID}/pending`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load pending loan approvals");
      }

      const data = await response.json();
      setPendingLoans(data || []);
    } catch (err) {
      console.error("Pending loan load error:", err);
      setError("Unable to load pending loans. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingLoans();
  }, []);

  const handleApprove = async (loanId) => {
    try {
      setActionLoadingId(loanId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/payroll/loan/${loanId}/approve?approvedBy=${MANAGER_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to approve loan");
      }

      const approvedLoan = await response.json();

      setSuccessMessage(
        `Loan approved successfully for ${approvedLoan.employeeName}. EMI ${formatCurrency(
          approvedLoan.monthlyInstallment
        )} will deduct from payroll.`
      );

      await loadPendingLoans();
    } catch (err) {
      console.error("Approve loan error:", err);
      setError(err.message || "Unable to approve loan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectDialog = (loan) => {
    setSelectedLoan(loan);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedLoan(null);
    setRejectionReason("");
  };

  const handleReject = async () => {
    if (!selectedLoan) return;

    try {
      setActionLoadingId(selectedLoan.id);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/payroll/loan/${selectedLoan.id}/reject?rejectedBy=${MANAGER_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            reason: rejectionReason || "Rejected by manager",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to reject loan");
      }

      const rejectedLoan = await response.json();

      setSuccessMessage(`Loan rejected for ${rejectedLoan.employeeName}.`);
      closeRejectDialog();
      await loadPendingLoans();
    } catch (err) {
      console.error("Reject loan error:", err);
      setError(err.message || "Unable to reject loan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalPendingAmount = pendingLoans.reduce(
    (sum, loan) => sum + Number(loan.loanAmount || 0),
    0
  );

  const totalMonthlyEmi = pendingLoans.reduce(
    (sum, loan) => sum + Number(loan.monthlyInstallment || 0),
    0
  );

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

            <Typography sx={{ color: "rgba(255,255,255,0.42)" }}>
              Loan Approvals
            </Typography>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box>
              <Typography sx={{ color: "white", fontSize: 28, fontWeight: 900 }}>
                Loan Approvals
              </Typography>

              <Typography sx={{ color: "rgba(226,232,240,0.62)", mt: 0.6 }}>
                Manager Pankaj #103 can approve or reject pending employee loans.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2}>
              <Chip
                label="Manager: Pankaj Karn"
                sx={{
                  color: "#bfdbfe",
                  bgcolor: "rgba(59,130,246,0.16)",
                  border: "1px solid rgba(59,130,246,0.24)",
                  fontWeight: 800,
                }}
              />

              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={loadPendingLoans}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Box>

          {(error || successMessage) && (
            <Box sx={{ mt: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </Box>
          )}
        </Paper>

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              title="Pending Loans"
              value={pendingLoans.length}
              subtitle="Waiting for manager decision"
              icon={<PendingActionsIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              title="Pending Amount"
              value={formatCurrency(totalPendingAmount)}
              subtitle="Total requested loan amount"
              icon={<AccountBalanceWalletIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              title="Monthly EMI Impact"
              value={formatCurrency(totalMonthlyEmi)}
              subtitle="Payroll deduction after approval"
              icon={<PaymentsIcon />}
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
          <Box sx={{ p: 3 }}>
            <Typography sx={{ color: "white", fontSize: 22, fontWeight: 900 }}>
              Pending Loan Requests
            </Typography>

            <Typography sx={{ color: "rgba(226,232,240,0.58)", mt: 0.5 }}>
              Approving a loan will make it active for payroll deduction.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(148,163,184,0.14)" }} />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(30,64,175,0.22)" }}>
                    {[
                      "Employee",
                      "Loan Type",
                      "Loan Amount",
                      "Monthly EMI",
                      "Installments",
                      "Deduct From",
                      "Manager",
                      "Status",
                      "Actions",
                    ].map((head) => (
                      <TableCell key={head} sx={{ color: "white", fontWeight: 900 }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pendingLoans.map((loan) => (
                    <TableRow
                      key={loan.id}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(59,130,246,0.08)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        <Typography sx={{ fontWeight: 900 }}>
                          {loan.employeeName} #{loan.employeeId}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(226,232,240,0.55)" }}
                        >
                          {loan.designation || "-"} • {loan.email || "-"}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ color: "rgba(226,232,240,0.86)", fontWeight: 700 }}>
                        {loan.loanType}
                      </TableCell>

                      <TableCell sx={{ color: "white", fontWeight: 900 }}>
                        {formatCurrency(loan.loanAmount)}
                      </TableCell>

                      <TableCell sx={{ color: "#93c5fd", fontWeight: 900 }}>
                        {formatCurrency(loan.monthlyInstallment)}
                      </TableCell>

                      <TableCell sx={{ color: "rgba(226,232,240,0.86)", fontWeight: 700 }}>
                        {loan.noOfInstallments}
                      </TableCell>

                      <TableCell sx={{ color: "rgba(226,232,240,0.86)", fontWeight: 700 }}>
                        {formatDate(loan.deductFrom)}
                      </TableCell>

                      <TableCell sx={{ color: "rgba(226,232,240,0.86)", fontWeight: 700 }}>
                        {loan.managerName || "Pankaj Karn"} #{loan.managerId || 103}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={loan.status}
                          sx={{
                            color: "#fde68a",
                            bgcolor: "rgba(245,158,11,0.14)",
                            border: "1px solid rgba(245,158,11,0.24)",
                            fontWeight: 900,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<CheckCircleOutlineIcon />}
                            disabled={actionLoadingId === loan.id}
                            onClick={() => handleApprove(loan.id)}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              fontWeight: 900,
                              bgcolor: "#16a34a",
                              "&:hover": { bgcolor: "#15803d" },
                            }}
                          >
                            Approve
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<CancelOutlinedIcon />}
                            disabled={actionLoadingId === loan.id}
                            onClick={() => openRejectDialog(loan)}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              fontWeight: 900,
                              color: "#fecaca",
                              borderColor: "rgba(248,113,113,0.55)",
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {pendingLoans.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        sx={{
                          color: "rgba(226,232,240,0.65)",
                          textAlign: "center",
                          py: 5,
                          fontWeight: 700,
                        }}
                      >
                        No pending loan approvals found for Pankaj #103.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Dialog
        open={rejectDialogOpen}
        onClose={closeRejectDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(15,23,42,0.98)",
            color: "white",
            borderRadius: 4,
            border: "1px solid rgba(148,163,184,0.22)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Reject Loan Request</DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "rgba(226,232,240,0.7)", mb: 2 }}>
            Please enter reason for rejecting{" "}
            <b>{selectedLoan?.employeeName}</b>'s loan request.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": { color: "rgba(226,232,240,0.68)" },
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(148,163,184,0.22)" },
                "&:hover fieldset": { borderColor: "rgba(147,197,253,0.45)" },
                "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={closeRejectDialog}
            sx={{ color: "#bfdbfe", textTransform: "none", fontWeight: 800 }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={actionLoadingId === selectedLoan?.id}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 900 }}
          >
            Reject Loan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
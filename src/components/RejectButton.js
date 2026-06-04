import React, { useEffect, useState } from "react";
import {
  AppBar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Modal,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { getAuthHeaders } from "../utils/api";

export default function RejectButton({
  openReject,
  onCloseReject,
  leaveRows = [],
  onRejected,
  apiUrl,
  onConfirmReject,
}) {
  const [rowsToReject, setRowsToReject] = useState(leaveRows);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    setRowsToReject(leaveRows || []);
  }, [leaveRows]);

  const getReconciliationId = (row) => {
    return (
      row?.leaveReconciliationId ||
      row?.leave_reconciliation_id ||
      row?.reconciliationId ||
      row?.reconciliationID ||
      row?.reconciliation_id ||
      row?.id
    );
  };

  const handleModalReject = async () => {
    if (!remarks.trim()) return;

    setLoading(true);

    try {
      const ids = rowsToReject
        .map((row) => getReconciliationId(row))
        .filter((id) => id !== null && id !== undefined && id !== "");

      if (!ids.length) {
        throw new Error("No valid leave reconciliation id found");
      }

      const rejectedItems = rowsToReject.map((row) => ({
        ...row,
        status: "Rejected",
        reason: row.reason,
        rejectReason: remarks,
      }));

      if (onConfirmReject) {
        await onConfirmReject(rowsToReject, remarks);
      } else {
        await axios.post(
          apiUrl || "http://localhost:8080/stWorkwave/leavereconciliation/reject",
          ids,
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          }
        );
      }

      if (onRejected) {
        onRejected(rejectedItems);
      }

      setSnackbarMsg("Rejected successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setRemarks("");
      onCloseReject();
    } catch (error) {
      console.error("API reject failed", error);
      console.log("Rows selected for reject:", rowsToReject);

      setSnackbarMsg(
        error?.response?.data?.message ||
          error?.response?.data ||
          error?.message ||
          "Reject failed"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={openReject}
        onClose={onCloseReject}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 420,
            bgcolor: "rgba(255,255,255,0.85)",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <AppBar sx={{ height: 50, mb: 2, position: "relative" }}>
            <Typography variant="h6" sx={{ p: 1 }}>
              Reject Request
            </Typography>

            <IconButton
              color="inherit"
              onClick={onCloseReject}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </AppBar>

          <Typography>
            Are you sure you want to reject these {rowsToReject.length} application
            {rowsToReject.length > 1 ? "s" : ""}?
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Enter reason here"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="outlined" onClick={onCloseReject} disabled={loading}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleModalReject}
              disabled={!remarks.trim() || loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Reject"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
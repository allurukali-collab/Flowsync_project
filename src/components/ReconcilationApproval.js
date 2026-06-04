import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Stack,
  Button,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";
import RejectButton from "./RejectButton";
import { getAuthHeaders } from "../utils/api";
import { displayPersonName } from "../utils/displayUtils";

const API_BASE = "http://localhost:8080";

// If your manager account is 103, keep it here.
// Add more manager IDs if needed.
const MANAGER_EMPLOYEE_IDS = [103];

const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const getUserRole = (user) => {
  return String(
    user?.role ||
      user?.userRole ||
      user?.roleName ||
      user?.designation ||
      user?.employeeRole ||
      user?.type ||
      ""
  )
    .trim()
    .toLowerCase();
};

const isManagerUser = (user) => {
  const employeeId = Number(user?.employeeId);
  const role = getUserRole(user);

  return (
    role === "manager" ||
    role === "ceo" ||
    role === "admin" ||
    role.includes("manager") ||
    user?.isManager === true ||
    MANAGER_EMPLOYEE_IDS.includes(employeeId)
  );
};

export default function ReconciliationApproval() {
  const navigate = useNavigate();

  const user = useMemo(() => getLoggedInUser(), []);
  const managerId = Number(user?.employeeId);
  const hasApprovalAccess = isManagerUser(user);

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openReject, setOpenReject] = useState(false);
  const [rowsToReject, setRowsToReject] = useState([]);
  const [reconRows, setReconRows] = useState([]);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!hasApprovalAccess) {
      navigate("/timesheettable", { replace: true });
    }
  }, [hasApprovalAccess, navigate]);

  const showError = (message) => {
    setSnackbarMessage(message);
    setErrorSnackbarOpen(true);
  };

  const showSuccess = (message) => {
    setSnackbarMessage(message);
    setSuccessSnackbarOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
  };

  const isPendingRow = (row) => {
    const status = String(row?.status || "").toLowerCase();
    return status === "pending" || status === "open";
  };

  const fetchReconciliationData = useCallback(async () => {
    if (!hasApprovalAccess || !managerId) return;

    try {
      const res = await fetch(
        `${API_BASE}/stWorkwave/leavereconciliation/${managerId}`,
        { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch reconciliation data");
      }

      const data = await res.json();
      setReconRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reconciliation data:", err);
      showError("Error fetching reconciliation data");
    }
  }, [hasApprovalAccess, managerId]);

  useEffect(() => {
    fetchReconciliationData();
  }, [fetchReconciliationData]);

  if (!hasApprovalAccess) {
    return null;
  }

  const filteredRows = reconRows.filter((row) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    return (
      String(row.employeeId || "").toLowerCase().includes(term) ||
      displayPersonName(row).toLowerCase().includes(term)
    );
  });

  const selectableFilteredRows = filteredRows.filter((row) =>
    isPendingRow(row)
  );

  const allSelected =
    selectableFilteredRows.length > 0 &&
    selectableFilteredRows.every((row) =>
      selected.includes(row.leaveReconciliationId)
    );

  const someSelected =
    selected.length > 0 &&
    selectableFilteredRows.some((row) =>
      selected.includes(row.leaveReconciliationId)
    ) &&
    !allSelected;

  const handleSelect = (row) => {
    if (!isPendingRow(row)) return;

    const id = row.leaveReconciliationId;

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(
        selectableFilteredRows.map((row) => row.leaveReconciliationId)
      );
    } else {
      setSelected([]);
    }
  };

  const handleApprove = async () => {
    if (!selected.length) {
      showError("Please select at least one pending reconciliation.");
      return;
    }

    const selectedPendingIds = reconRows
      .filter(
        (row) =>
          selected.includes(row.leaveReconciliationId) && isPendingRow(row)
      )
      .map((row) => row.leaveReconciliationId);

    if (!selectedPendingIds.length) {
      showError("Only pending/open reconciliations can be approved.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/stWorkwave/leavereconciliation/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(selectedPendingIds),
        }
      );

      if (!response.ok) {
        throw new Error("Approve API failed");
      }

      setSelected([]);
      await fetchReconciliationData();
      showSuccess("Approved successfully");
    } catch (error) {
      console.error("Error approving reconciliation:", error);
      showError("Error approving reconciliation");
    }
  };

  const handleOpenReject = () => {
    if (!selected.length) {
      showError("Please select at least one pending reconciliation.");
      return;
    }

    const selectedRowsData = reconRows.filter(
      (row) =>
        selected.includes(row.leaveReconciliationId) && isPendingRow(row)
    );

    if (!selectedRowsData.length) {
      showError("Only pending/open reconciliations can be rejected.");
      return;
    }

    setRowsToReject(selectedRowsData);
    setOpenReject(true);
  };

  const handleRejected = async () => {
    setSelected([]);
    setRowsToReject([]);
    setOpenReject(false);
    await fetchReconciliationData();
    showSuccess("Rejected successfully");
  };

  return (
    <div
      style={{
        position: "relative",
        textAlign: "center",
        color: "white",
        fontFamily: "Arial",
        paddingTop: 16,
      }}
    >
      <IconButton
        onClick={() => navigate("/timesheettable")}
        sx={{ position: "absolute", top: 16, left: 16, color: "white" }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <h2 style={{ margin: 0 }}>Leave Approval / Reconciliation</h2>

      <Box
        sx={{
          mt: 3,
          width: "90%",
          maxWidth: 1450,
          mx: "auto",
          border: "2px solid rgba(45,44,44,0.26)",
          borderRadius: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          p: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 3, display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/approvals")}
            sx={{
              color: "rgba(255,255,255,0.7)",
              borderColor: "rgba(255,255,255,0.5)",
            }}
          >
            ACTIVE
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/approvals/closed")}
            sx={{
              color: "rgba(255,255,255,0.7)",
              borderColor: "rgba(255,255,255,0.5)",
            }}
          >
            CLOSED
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            RECONCILIATION
          </Button>
        </Stack>

        <Box
          sx={{
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 1,
            overflow: "hidden",
            width: "90%",
            mx: "auto",
            p: 2,
            mt: 2,
            display: "flex",
            flexDirection: "column",
            height: 460,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <TextField
              variant="filled"
              placeholder="Search By Name or ID"
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{
                flex: 1,
                maxWidth: "400px",
                bgcolor: "rgba(255,255,255,0.1)",
                "& .MuiFilledInput-root": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 1,
                  border: "1px solid rgba(255,255,255,0.3)",
                },
                "& .MuiFilledInput-input": { color: "white", py: 1 },
              }}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              <Button
                variant="outlined"
                disabled={!selected.length}
                onClick={handleApprove}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:not(.Mui-disabled):hover": {
                    borderColor: "green",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(255, 255, 255, 0.57)",
                    borderColor: "rgba(255,255,255,0.3)",
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                  },
                }}
              >
                APPROVE
              </Button>

              <Button
                variant="outlined"
                disabled={!selected.length}
                onClick={handleOpenReject}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:not(.Mui-disabled):hover": {
                    borderColor: "red",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(255, 255, 255, 0.57)",
                    borderColor: "rgba(255,255,255,0.3)",
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                  },
                }}
              >
                REJECT
              </Button>
            </Stack>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 380,
              overflowY: "auto",
              flex: 1,
              mb: 2,
              backgroundColor: "rgba(0,0,0,0.26)",
              border: "1px solid rgba(255,255,255,0.9)",
              borderRadius: 1,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.12)" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      sx={{
                        color: "white",
                        "& .MuiSvgIcon-root": {
                          backgroundColor: "rgba(255,255,255,0.15)",
                          borderRadius: 1,
                        },
                        "&:hover .MuiSvgIcon-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                        },
                      }}
                    />
                  </TableCell>

                  {[
                    "Employee ID",
                    "Employee Name",
                    "Reason",
                    "Date",
                    "Status",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        py: 1.5,
                        px: 2,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const rowId = row.leaveReconciliationId;
                    const pending = isPendingRow(row);

                    return (
                      <TableRow
                        key={rowId}
                        hover
                        selected={selected.includes(rowId)}
                        sx={{
                          cursor: "default",
                          backgroundColor: "rgba(255,255,255,0.11)",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(rowId)}
                            onChange={() => handleSelect(row)}
                            disabled={!pending}
                            sx={{
                              color: "white",
                              "& .MuiSvgIcon-root": {
                                backgroundColor: "rgba(255, 255, 255, 0.22)",
                                borderRadius: 1,
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ color: "white", py: 1.3, px: 2 }}>
                          {row.employeeId}
                        </TableCell>

                        <TableCell sx={{ color: "white", py: 1.3, px: 2 }}>
                          {displayPersonName(row)}
                        </TableCell>

                        <TableCell sx={{ color: "white", py: 1.3, px: 2 }}>
                          {row.reason || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white", py: 1.3, px: 2 }}>
                          {formatDate(row.reconciliationDate)}
                        </TableCell>

                        <TableCell sx={{ color: "white", py: 1.3, px: 2 }}>
                          {row.status || "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                {!filteredRows.length && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ color: "white", py: 3 }}
                    >
                      No reconciliation records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              color: "black",
              backgroundColor: "rgba(255,249,249,0.74)",
              "& .MuiTablePagination-selectIcon": { color: "black" },
              "& .MuiTablePagination-select": { color: "black" },
              "& .MuiIconButton-root": { color: "black" },
            }}
          />
        </Box>
      </Box>

      <RejectButton
        openReject={openReject}
        onCloseReject={() => setOpenReject(false)}
        leaveRows={rowsToReject}
        onRejected={handleRejected}
        apiUrl={`${API_BASE}/stWorkwave/leavereconciliation/reject`}
      />

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setSuccessSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setErrorSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
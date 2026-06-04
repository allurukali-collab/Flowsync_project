import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import './App.css';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  Backdrop,
  Checkbox,
  Button,
  Container,
  Box,
  createTheme,
  ThemeProvider,
  styled,
  IconButton,
  Alert,
  Snackbar,
  Modal,
  TextField,
  Stack,
  Paper,
  Grid,
  TableContainer
} from "@mui/material";
//import Grid from '@mui/material/Unstable_Grid2';
import MuiAlert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "../App.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Taskname from "./Taskname";

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#1e88e5",
  color: theme.palette.common.white,
  padding: "2px !important",
  textAlign: "center",
}));

const CustomTableCell = styled(TableCell)({
  padding: "2px !important",
  textAlign: "center",
});

const TableCheckbox = styled(Checkbox)({
  color: "#3f51b5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiSvgIcon-root": {
    fontSize: "1.4rem",
  },
});

const AppbarCheckbox = styled(Checkbox)({
  color: "white",
});

const CloseIconButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  right: "4px",
  transform: "translateY(-50%)",
});

export default function LeaveReconcilation({ projectId }) {
  const API_BASE = "http://localhost:8080";
  const user = JSON.parse(localStorage.getItem("user"));
  const empID = user?.employeeId;
  const employeeName = user?.employeeName || user?.name || "";
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [codingValues, setCodingValues] = React.useState(0);
  const [testingValues, setTestingValues] = React.useState(0);
  const [devopsValues, setDevopsValues] = React.useState(0);
  const [meetingValues, setMeetingValues] = React.useState(0);
  const [dataValues, setDataValues] = React.useState(0);
  const [taValues, setTaValues] = React.useState(0);
  const [tdValues, setTdValues] = React.useState(0);
  const [eeValues, setEeValues] = React.useState(0);
  const [pmValues, setPmValues] = React.useState(0);
  const [cbValues, setCbValues] = React.useState(0);
  const [acValues, setAcValues] = React.useState(0);
  const [misValues, setMisValues] = React.useState(0);
  const [totalValues, setTotalValues] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [add, setAdd] = React.useState(0);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [result1, setResult1] = useState();
  const [reconciliationDate, setReconciliationDate] = useState(null);
  const [results, setResults] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false);
  const [apiErrorSnackbarOpen, setApiErrorSnackbarOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  // keep the rest of your file exactly same



  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const [leaveDays, setLeaveDays] = useState([]);
  const [oldReasons, setOldReasons] = useState([]);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noRowSelectedSnackbarOpen, setNoRowSelectedSnackbarOpen] = useState(false);

const getTodayFormatted = () => {
  // This avoids any UTC shift
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now - offset);
  return localDate.toISOString().split("T")[0]; // gives "2026-05-14"
};

  const isOpenRow = (row) => String(row?.status || "").toLowerCase() === "open";

  const buildRowsWithOpenRow = (data) => {
    const normalizedRows = Array.isArray(data)
      ? data.map((row) => ({
          ...row,
          reconciliationDate:
            row.reconciliationDate || row.reconciliation_date || getTodayFormatted(),
          status: row.status || "Open",
          reason: row.reason || "",
        }))
      : [];

    const hasOpenRow = normalizedRows.some((row) => isOpenRow(row));

    if (!hasOpenRow) {
      normalizedRows.unshift({
        reconciliationDate: getTodayFormatted(),
        status: "Open",
        reason: "",
      });
    }

    return normalizedRows;
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/leavereconciliation/${empID}`);
      const data = await res.json();

      const finalRows = buildRowsWithOpenRow(data);

      setLeaveDays(finalRows);
      setReasons(finalRows.map((row) => row.reason || ""));
      setOldReasons(finalRows.map((row) => row.reason || ""));
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setApiErrorMessage("Failed to load leave reconciliation data.");
      setApiErrorSnackbarOpen(true);
      setLoading(false);
    }
  };

  //Fetch Data
  useEffect(() => {
    if (!empID) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [empID]);

  const [reasons, setReasons] = useState([]);
  const [enabledRows, setEnabledRows] = useState([]);
  const [appbarChecked, setAppbarChecked] = useState(false);
  const [resetButtonsVisible, setResetButtonsVisible] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const resetHourStates = () => {
    setCodingValues(0);
    setTestingValues(0);
    setMeetingValues(0);
    setDataValues(0);
    setTaValues(0);
    setTdValues(0);
    setEeValues(0);
    setPmValues(0);
    setCbValues(0);
    setAcValues(0);
    setMisValues(0);
    setDevopsValues(0);
    setTotalValues(0);
    setTotal(0);
    setFormData([]);
  };

  const handleClose = () => {
    setReasons(leaveDays.map((r) => r.reason || ""));
    setEnabledRows([]);
    setAppbarChecked(false);
    setResetButtonsVisible(leaveDays.map(() => false));
    resetHourStates();
    setOpen(false);
  };

  const [emptyReasonSnackbarOpen, setEmptyReasonSnackbarOpen] = useState(false);
  // const pendingRows = data.filter(row => row.status !== "Open");

  const handleResetButtonClick = (index) => () => {
    const updatedReasons = [...reasons];
    updatedReasons[index] = "";
    setReasons(updatedReasons);

    const updatedLeaveDays = [...leaveDays];
    if (updatedLeaveDays[index]) {
      updatedLeaveDays[index].reason = "";
    }
    setLeaveDays(updatedLeaveDays);

    setResetButtonsVisible((prevResetButtonsVisible) => {
      const updatedButtonsVisible = [...prevResetButtonsVisible];
      updatedButtonsVisible[index] = false;
      return updatedButtonsVisible;
    });
  };

  const handleAppbarCheckboxChange = (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      const firstOpenIndex = leaveDays.findIndex((row) => isOpenRow(row));

      if (firstOpenIndex !== -1) {
        setAppbarChecked(true);
        setEnabledRows([firstOpenIndex]);
        setReconciliationDate(leaveDays[firstOpenIndex].reconciliationDate);
      } else {
        setAppbarChecked(false);
        setEnabledRows([]);
        setReconciliationDate(null);
      }
    } else {
      setAppbarChecked(false);
      setEnabledRows([]);
      setReconciliationDate(null);
    }
  };

  const handleCheckboxChange = (index) => (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setEnabledRows([index]);
      const selectedReconciliationDate = leaveDays[index].reconciliationDate;
      setReconciliationDate(selectedReconciliationDate);
      setAppbarChecked(true);
    } else {
      setEnabledRows([]);
      setReconciliationDate(null);
      setAppbarChecked(false);
    }
  };

  const handleReasonChange = (index, value) => {
    const updatedReasons = [...reasons];
    updatedReasons[index] = value;
    setReasons(updatedReasons);

    const updatedLeaveDays = [...leaveDays];
    updatedLeaveDays[index].reason = value;
    setLeaveDays(updatedLeaveDays);

    setResetButtonsVisible((prevResetButtonsVisible) => {
      const updatedButtonsVisible = [...prevResetButtonsVisible];
      updatedButtonsVisible[index] = true;
      return updatedButtonsVisible;
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 550,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  if (!empID) {
    console.error("empID is missing. Cannot proceed.");
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          Error: Employee ID is missing.
        </Typography>
      </Box>
    );
  }

  const isValidReason = (reason) => {
    if (!reason) return false;

    const trimmed = reason.trim();

    if (trimmed.length < 5) return false;
    if (!/[a-zA-Z]/.test(trimmed)) return false;

    const invalidPatterns = [/^[^a-zA-Z0-9]+$/];

    if (invalidPatterns.some((pattern) => pattern.test(trimmed))) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!empID) {
      console.error("Missing empID");
      return;
    }

    if (!reconciliationDate || enabledRows.length === 0) {
      setNoRowSelectedSnackbarOpen(true);
      console.error("Please select a reconciliation row before submitting");
      return;
    }

    setResults([]);
    setLoading(true);

    const hasInvalidReason = leaveDays.some(
      (leaveDay, index) =>
        enabledRows.includes(index) && !isValidReason(leaveDay.reason)
    );

    if (hasInvalidReason) {
      setEmptyReasonSnackbarOpen(true);
      setLoading(false);
      return;
    }

    handleOpen(true);
    setLoading(false);
  };

  const handleClearModal = () => {
    const formattedReconciliationDate = formatDate(reconciliationDate);
    setCodingValues(handleEffortValue(formattedReconciliationDate, 1) || "0");
    console.log("Coding values" + " " + codingValues);
    setTestingValues(handleEffortValue(formattedReconciliationDate, 2) || "0");
    console.log("Testing values" + " " + testingValues);
    setDevopsValues(handleEffortValue(formattedReconciliationDate, 3) || "0");
    console.log("Devops values" + " " + devopsValues);
    setMeetingValues(handleEffortValue(formattedReconciliationDate, 4) || "0");
    console.log("Meeting values" + " " + meetingValues);
    setDataValues(handleEffortValue(formattedReconciliationDate, 5) || "0");
    console.log("Data values" + " " + dataValues);
    setMisValues(handleEffortValue(formattedReconciliationDate, 7) || "0");
    console.log("Mis values" + " " + misValues);
    setTotalValues(handleEffortValue(formattedReconciliationDate, 8) || "0");
    console.log("Total values" + " " + totalValues);
  };

  const handleEffortValue = (formattedDate, taskId) => {
    const effort = handleEffort(formattedDate, taskId);
    return effort !== null && effort !== undefined ? effort : "0";
  };

  const getEffortValue = (formattedDate, taskId) => {
    if (!results) {
      return null;
    }
    const matchingEntry = results.find(
      (entry) => entry.effortDate === formattedDate && entry.taskId === taskId
    );
    return matchingEntry ? matchingEntry.effort : null;
  };

  const handleBlurEvent = (taskId, effortDate, typedValue) => {
    const convertedEffortDate = convertDateFormat(effortDate);
    const newData = {
      taskId: taskId,
      effortDate: convertedEffortDate,
      effort: typedValue,
      employeeId: empID,
      project_id: projectId,
      effort_task_description: getTaskDescription(taskId),
    };

    setFormData((prevData) => {
      const filteredData = prevData.filter(
        (item) => !(item.taskId === taskId && item.effortDate === convertedEffortDate)
      );
      return [...filteredData, newData];
    });
  };

  const convertDateFormat = (oldFormat) => {
    const [dd, mm, yy] = oldFormat.split("-");
    const convertedDate = `20${yy}-${mm}-${dd}`;
    return convertedDate;
  };

  const getTaskDescription = (taskId) => {
    switch (taskId) {
      case 1:
        return "Coding";
      case 2:
        return "Testing";
      case 3:
        return "DevOps";
      case 4:
        return "Meeting";
      case 5:
        return "Database";
      case 6:
        return "Talent and Acquisition";
      case 7:
        return "Miscellaneous";
      case 8:
        return "Training and Development";
      case 9:
        return "Employee Engagement";
      case 10:
        return "Performance Management";
      case 11:
        return "Compensation and Benefits";
      default:
        return "Audits and Compilance";
    }
  };

  const handleSubmitModal = async () => {
  if (enabledRows.length === 0 || !reconciliationDate) {
    setNoRowSelectedSnackbarOpen(true);
    return;
  }

  const totalHours = Number(total || 0);

  if (totalHours < 1) {
    setOpenSnackbar(true);
    return;
  }

  const selectedIndex = enabledRows[0];
  const selectedRow = leaveDays[selectedIndex];

  if (!selectedRow || !isValidReason(selectedRow.reason)) {
    setEmptyReasonSnackbarOpen(true);
    return;
  }

  setLoading(true);

  try {
const rawDate = selectedRow.reconciliationDate || reconciliationDate;

// Ensure date is always yyyy-MM-dd before sending to backend
const toApiDate = (d) => {
  if (!d) return null;
  // already yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  // dd-mm-yy → yyyy-MM-dd
  if (/^\d{2}-\d{2}-\d{2}$/.test(d)) {
    const [dd, mm, yy] = d.split("-");
    return `20${yy}-${mm}-${dd}`;
  }
  // dd-mm-yyyy
  if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  return d;
};

const apiDate = toApiDate(rawDate);
console.log("DATE SENDING =>", apiDate);
    const res = await fetch(`${API_BASE}/leavereconciliation/createLeaveReconciliation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: Number(empID),
        employeeName:
          employeeName || user?.employeeName || user?.name || user?.fullName || "",
        name:
          employeeName || user?.employeeName || user?.name || user?.fullName || "",
        reason: selectedRow.reason,
        reconciliationDate: apiDate,
        status: "Pending",
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create leave reconciliation.");
    }

    await fetchData();

    resetHourStates();
    setEnabledRows([]);
    setAppbarChecked(false);
    setSuccessSnackbarOpen(true);
    setOpen(false);

    // IMPORTANT:
    // Do not navigate to approval page.
    // Employee should stay on Leave Reconciliation page and see Pending history.
  } catch (error) {
    console.error("Submit Error:", error);
    setApiErrorMessage("Failed to submit leave reconciliation.");
    setApiErrorSnackbarOpen(true);
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
  const clearedLeaveDays = leaveDays.map((row) => ({
    ...row,
    reason: isOpenRow(row) ? "" : row.reason,
  }));

  const clearedReasons = clearedLeaveDays.map((row) =>
    isOpenRow(row) ? "" : row.reason || ""
  );

  setLeaveDays(clearedLeaveDays);
  setReasons(clearedReasons);
  setOldReasons(clearedReasons);
  setEnabledRows([]);
  setAppbarChecked(false);
  setResetButtonsVisible(new Array(clearedLeaveDays.length).fill(false));
  setReconciliationDate(null);
  resetHourStates();
  setOpen(false);
};

  const handleUpdateReason = async (index) => {
    const row = leaveDays[index];

    if (!row.reason) return;

    try {
      await fetch("http://localhost:8080/leavereconciliation/updateReasons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empID: empID,
          reason: row.reason,
        }),
      });

      console.log("Reason updated successfully");
    } catch (error) {
      console.error("Error updating reason:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1e88e5",
      },
      text: {
        primary: "#333",
      },
    },
  });

  const styles = {
    iconButton: {
      marginRight: "10px",
      fontSize: "0.5rem",
      marginTop: "-3%",
      transition: "box-shadow 0.3s",
    },
    iconButtonHover: {
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
    },
  };

  const MAX_VALUE = 24;

  const handleIntegerChange = (value, setterFunction) => {
    if (value === "" || value === "\b") {
      setterFunction(0);
      return true;
    }

    if (!/^\d+$/.test(String(value))) {
      setOpenSnackbar(true);
      return false;
    }

    const intValue = parseInt(value, 10);

    if (!isNaN(intValue) && intValue <= MAX_VALUE) {
      const newValue = String(intValue).slice(0, 2);
      setterFunction(newValue);
      return true;
    } else {
      setOpenSnackbar(true);
      return false;
    }
  };

  const handleHoursFieldChange = (value, setterFunction) => {
    if (value === "") {
      setterFunction("");
      setTimeout(() => {
        handleInputChange();
      }, 0);
      return;
    }

    if (!/^\d+$/.test(value)) {
      setOpenSnackbar(true);
      return;
    }

    const intValue = parseInt(value, 10);

    if (intValue > MAX_VALUE) {
      setOpenSnackbar(true);
      return;
    }
        
    setterFunction(value);
    setTimeout(() => {
      handleInputChange();
    }, 0);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseIcon = () => {
    setReasons(leaveDays.map((r) => r.reason || ""));
    setEnabledRows([]);
    setAppbarChecked(false);
    setResetButtonsVisible(leaveDays.map(() => false));
    resetHourStates();
    setOpen(false);
  };

  const formatDate = (dateString) => {
  if (!dateString) return "";

  // already dd-mm-yy
  if (/^\d{2}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [yyyy, mm, dd] = dateString.split("-");

    return `${dd}-${mm}-${yyyy.slice(-2)}`;
  }

  // yyyy-mm-ddTHH:mm:ss
  if (dateString.includes("T")) {
    const onlyDate = dateString.split("T")[0];

    const [yyyy, mm, dd] = onlyDate.split("-");

    return `${dd}-${mm}-${yyyy.slice(-2)}`;
  }

  return dateString;
};

  const handleEffort = (date, intValue, index) => {
    if (!results) {
      return 0;
    }
    const matchingEntry = results.find(
      (entry) => entry.effortDate === date && entry.taskId === intValue
    );
    if (matchingEntry) {
      console.log("Effort Date:", date);
      console.log("Task Id:", intValue);
      console.log("Matching Effort:", matchingEntry.effort);
      return matchingEntry.effort;
    }
    return 0;
  };

  const handleSuccessSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const calculateSum = () => {
    let sum = 0;
    let elements = [
      "coding",
      "testing",
      "devops",
      "meeting",
      "data",
      "ta",
      "td",
      "ee",
      "pm",
      "cb",
      "ac",
      "mis",
    ];

    elements.forEach((elementId) => {
      let element = document.getElementById(elementId);
      if (element !== null) sum += Number(element.value) || 0;
    });

    return sum;
  };

  const handleInputChange = () => {
    let sum = calculateSum();
    console.log("Sum is: " + sum);
    setTotal(sum);
  };

  const theme1 = createTheme({
    palette: {
      primary: {
        main: "#585858",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {/* back arrow */}
     <IconButton
  onClick={() => navigate("/timesheettable")}
  sx={{ color: "white" }}
>  
  <CloseIcon />
</IconButton>

      <Backdrop open={loading} style={{ zIndex: 999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      
      </Backdrop>

      <Container maxWidth="md" sx={{ pt: 6 }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}

        <Box
          sx={{
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 2,
            p: 2,
            mb: 2,
            bgcolor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            color: "white",
          }}
        >
          {/* header bar */}
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h6">Leave Reconciliation</Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <IconButton
                component={Link}
                to="/approvals/reconcilation"
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>

          {/* styled table */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 1,
              maxHeight: "calc(100vh - 225px)",
            }}
          >
            <Table
              stickyHeader
              size="small"
              sx={{
                "& .MuiTableCell-stickyHeader": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  zIndex: 2,
                  py: 1.5,
                },
                "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)": {
                  bgcolor: "rgba(255,255,255,0.05)",
                },
                "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even)": {
                  bgcolor: "rgba(255,255,255,0.10)",
                },
                "& .MuiTableBody-root .MuiTableRow-root:hover": {
                  bgcolor: "rgba(255,255,255,0.15)",
                },
                "& .MuiTableBody-root .MuiTableCell-root": {
                  color: "rgba(255,255,255,0.9)",
                  borderBottom: "none",
                  py: -1,
                  px: 2,
                },
                "& .MuiTableCell-paddingCheckbox": {
                  width: 48,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={appbarChecked}
                      onChange={handleAppbarCheckboxChange}
                      sx={{ color: "white" }}
                    />
                  </TableCell>
                  <TableCell sx={{ pl: 2 }}>Date</TableCell>
                  <TableCell sx={{ pl: 2 }}>Status</TableCell>
                  <TableCell sx={{ textAlign: "left" }}>Reason</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {leaveDays.map((leaveDay, index) => (
                  <TableRow
                    key={leaveDay.leaveReconciliationId || leaveDay.reconciliationDate || index}
                    hover
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={enabledRows.includes(index)}
                        onChange={handleCheckboxChange(index)}
                        disabled={leaveDay.status !== "Open"}
                        sx={{ color: "white" }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ pl: 2 }}>
                      {formatDate(leaveDay.reconciliationDate)}
                    </TableCell>
                    <TableCell align="left" sx={{ pl: 2 }}>
                      {leaveDay.status}
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="filled"
                        placeholder="Reason"
                        value={
                          leaveDay.status === "Open"
                            ? reasons[index] || ""
                            : leaveDay.reason || ""
                        }
                        onChange={(e) => handleReasonChange(index, e.target.value)}
                        //onBlur={() => handleUpdateReason(index)}
                        disabled={!enabledRows.includes(index) || leaveDay.status !== "Open"}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.1)",
                          paddingTop: "2px",
                          "& .MuiInputBase-input": { color: "white" },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* button row with gap */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Clear
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          style: {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <Box
          sx={style}
          style={{
            maxHeight: "calc(100vh - 75px)",
            padding: "8px",
            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{
                    py: 0.5,
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  <Typography>Date: {formatDate(reconciliationDate)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHeaderCell sx={{ bgcolor: "black" }}>Category</TableHeaderCell>
                <TableHeaderCell sx={{ bgcolor: "black" }}>
                  Effort (in hours)
                </TableHeaderCell>
                <TableHeaderCell sx={{ bgcolor: "black" }}>
                  <CloseIcon onClick={handleCloseIcon} />
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectId !== Taskname.humanResourceProjectId && (
                <TableRow className="customTableRow">
                  <TableCell
                    style={{
                      fontFamily: "Arial",
                      fontSize: "13px",
                      color: "white",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                      backgroundColor: "#676c71",
                    }}
                  >
                    Coding
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "white",
                      fontFamily: "Arial",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <TextField
                      type="text"
                      id="coding"
                      inputMode="numeric"
                      value={codingValues}
                      onChange={(e) => handleHoursFieldChange(e.target.value, setCodingValues)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          handleIntegerChange("", setCodingValues);
                          setTimeout(() => {
                            handleInputChange();
                          }, 0);
                        }
                      }}
                      onBlur={(event) => {
                        setTaskId(1);
                        handleBlurEvent(
                          1,
                          formatDate(reconciliationDate),
                          event.target.value
                        );
                      }}
                      inputProps={{
                        maxLength: 2,
                        pattern: "[0-9]*",
                        style: {
                          textAlign: "center",
                          padding: "10px 0px",
                          fontSize: "13px",
                          height: "16px",
                          backgroundColor: "#e8e9e7",
                        },
                      }}
                      onKeyPress={(event) => {
                        const charCode = event.which ? event.which : event.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                          event.preventDefault();
                        }
                      }}
                      className="customTextField"
                    />
                  </TableCell>
                </TableRow>
              )}

              {projectId !== Taskname.humanResourceProjectId && (
                <TableRow className="customTableRow">
                  <TableCell
                    style={{
                      fontFamily: "Arial",
                      fontSize: "13px",
                      color: "white",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                      backgroundColor: "#676c71",
                    }}
                  >
                    Testing
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "white",
                      fontFamily: "Arial",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <TextField
                      type="text"
                      id="testing"
                      value={testingValues}
                      onChange={(e) => handleHoursFieldChange(e.target.value, setTestingValues)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          handleIntegerChange("", setTestingValues);
                          setTimeout(() => {
                            handleInputChange();
                          }, 0);
                        }
                      }}
                      onBlur={(event) => {
                        setTaskId(2);
                        handleBlurEvent(
                          2,
                          formatDate(reconciliationDate),
                          event.target.value
                        );
                      }}
                      inputProps={{
                        maxLength: 2,
                        pattern: "[0-9]*",
                        style: {
                          textAlign: "center",
                          padding: "10px 0px",
                          fontSize: "13px",
                          height: "16px",
                          backgroundColor: "#e8e9e7",
                        },
                      }}
                      onKeyPress={(event) => {
                        const charCode = event.which ? event.which : event.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                          event.preventDefault();
                        }
                      }}
                      className="customTextField"
                    />
                  </TableCell>
                </TableRow>
              )}

              {projectId !== Taskname.humanResourceProjectId && (
                <TableRow className="customTableRow">
                  <TableCell
                    style={{
                      fontFamily: "Arial",
                      fontSize: "13px",
                      color: "white",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                      backgroundColor: "#676c71",
                    }}
                  >
                    DevOps
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "white",
                      fontFamily: "Arial",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <TextField
                      type="text"
                      id="devops"
                      value={devopsValues}
                      onChange={(e) => handleHoursFieldChange(e.target.value, setDevopsValues)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          handleIntegerChange("", setDevopsValues);
                          setTimeout(() => {
                            handleInputChange();
                          }, 0);
                        }
                      }}
                      onBlur={(event) => {
                        setTaskId(3);
                        handleBlurEvent(
                          3,
                          formatDate(reconciliationDate),
                          event.target.value
                        );
                      }}
                      inputProps={{
                        maxLength: 2,
                        pattern: "[0-9]*",
                        style: {
                          textAlign: "center",
                          padding: "10px 0px",
                          fontSize: "13px",
                          height: "16px",
                          backgroundColor: "#e8e9e7",
                        },
                      }}
                      onKeyPress={(event) => {
                        const charCode = event.which ? event.which : event.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                          event.preventDefault();
                        }
                      }}
                      className="customTextField"
                    />
                  </TableCell>
                </TableRow>
              )}

              <TableRow className="customTableRow">
                <TableCell
                  style={{
                    fontFamily: "Arial",
                    fontSize: "13px",
                    color: "white",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                    backgroundColor: "#676c71",
                  }}
                >
                  Meeting
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "white",
                    fontFamily: "Arial",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  <TextField
                    type="text"
                    id="meeting"
                    value={meetingValues}
                    onChange={(e) => handleHoursFieldChange(e.target.value, setMeetingValues)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        handleIntegerChange("", setMeetingValues);
                        setTimeout(() => {
                          handleInputChange();
                        }, 0);
                      }
                    }}
                    onBlur={(event) => {
                      setTaskId(4);
                      handleBlurEvent(
                        4,
                        formatDate(reconciliationDate),
                        event.target.value
                      );
                    }}
                    inputProps={{
                      maxLength: 2,
                      pattern: "[0-9]*",
                      style: {
                        textAlign: "center",
                        padding: "10px 0px",
                        fontSize: "13px",
                        height: "16px",
                        backgroundColor: "#e8e9e7",
                      },
                    }}
                    onKeyPress={(event) => {
                      const charCode = event.which ? event.which : event.keyCode;
                      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                        event.preventDefault();
                      }
                    }}
                    className="customTextField"
                  />
                </TableCell>
              </TableRow>

              {projectId !== Taskname.humanResourceProjectId && (
                <TableRow className="customTableRow">
                  <TableCell
                    style={{
                      fontFamily: "Arial",
                      fontSize: "13px",
                      color: "white",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                      backgroundColor: "#676c71",
                    }}
                  >
                    Database
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "white",
                      fontFamily: "Arial",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <TextField
                      type="text"
                      id="data"
                      value={dataValues}
                      onChange={(e) => handleHoursFieldChange(e.target.value, setDataValues)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          handleIntegerChange("", setDataValues);
                          setTimeout(() => {
                            handleInputChange();
                          }, 0);
                        }
                      }}
                      onBlur={(event) => {
                        setTaskId(5);
                        handleBlurEvent(
                          5,
                          formatDate(reconciliationDate),
                          event.target.value
                        );
                      }}
                      inputProps={{
                        maxLength: 2,
                        pattern: "[0-9]*",
                        style: {
                          textAlign: "center",
                          padding: "10px 0px",
                          fontSize: "13px",
                          height: "16px",
                          backgroundColor: "#e8e9e7",
                        },
                      }}
                      onKeyPress={(event) => {
                        const charCode = event.which ? event.which : event.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                          event.preventDefault();
                        }
                      }}
                      className="customTextField"
                    />
                  </TableCell>
                </TableRow>
              )}

              {projectId !== Taskname.ahWorkwaveProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow className="customTableRow">
                    <TableCell
                      style={{
                        fontFamily: "Arial",
                        fontSize: "13px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                        backgroundColor: "#676c71",
                      }}
                    >
                      Talent Acquisition
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id="ta"
                        value={taValues}
                        onChange={(e) => handleHoursFieldChange(e.target.value, setTaValues)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            handleIntegerChange("", setTaValues);
                            setTimeout(() => {
                              handleInputChange();
                            }, 0);
                          }
                        }}
                        onBlur={(event) => {
                          setTaskId(6);
                          handleBlurEvent(
                            6,
                            formatDate(reconciliationDate),
                            event.target.value
                          );
                        }}
                        inputProps={{
                          maxLength: 2,
                          pattern: "[0-9]*",
                          style: {
                            textAlign: "center",
                            padding: "10px 0px",
                            fontSize: "13px",
                            height: "16px",
                            backgroundColor: "#e8e9e7",
                          },
                        }}
                        onKeyPress={(event) => {
                          const charCode = event.which ? event.which : event.keyCode;
                          if (
                            charCode > 31 &&
                            (charCode < 48 || charCode > 57)
                          ) {
                            event.preventDefault();
                          }
                        }}
                        className="customTextField"
                      />
                    </TableCell>
                  </TableRow>
                )}

              {projectId !== Taskname.ahWorkwaveProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow className="customTableRow">
                    <TableCell
                      style={{
                        fontFamily: "Arial",
                        fontSize: "13px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                        backgroundColor: "#676c71",
                      }}
                    >
                      Training and Development
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id="td"
                        value={tdValues}
                        onChange={(e) => handleHoursFieldChange(e.target.value, setTdValues)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            handleIntegerChange("", setTdValues);
                            setTimeout(() => {
                              handleInputChange();
                            }, 0);
                          }
                        }}
                        onBlur={(event) => {
                          setTaskId(8);
                          handleBlurEvent(
                            8,
                            formatDate(reconciliationDate),
                            event.target.value
                          );
                        }}
                        inputProps={{
                          maxLength: 2,
                          pattern: "[0-9]*",
                          style: {
                            textAlign: "center",
                            padding: "10px 0px",
                            fontSize: "13px",
                            height: "16px",
                            backgroundColor: "#e8e9e7",
                          },
                        }}
                        onKeyPress={(event) => {
                          const charCode = event.which ? event.which : event.keyCode;
                          if (
                            charCode > 31 &&
                            (charCode < 48 || charCode > 57)
                          ) {
                            event.preventDefault();
                          }
                        }}
                        className="customTextField"
                      />
                    </TableCell>
                  </TableRow>
                )}

              {projectId !== Taskname.ahWorkwaveProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow className="customTableRow">
                    <TableCell
                      style={{
                        fontFamily: "Arial",
                        fontSize: "13px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                        backgroundColor: "#676c71",
                      }}
                    >
                      Employee Engagement
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id="ee"
                        value={eeValues}
                        onChange={(e) => handleHoursFieldChange(e.target.value, setEeValues)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            handleIntegerChange("", setEeValues);
                            setTimeout(() => {
                              handleInputChange();
                            }, 0);
                          }
                        }}
                        onBlur={(event) => {
                          setTaskId(9);
                          handleBlurEvent(
                            9,
                            formatDate(reconciliationDate),
                            event.target.value
                          );
                        }}
                        inputProps={{
                          maxLength: 2,
                          pattern: "[0-9]*",
                          style: {
                            textAlign: "center",
                            padding: "10px 0px",
                            fontSize: "13px",
                            height: "16px",
                            backgroundColor: "#e8e9e7",
                          },
                        }}
                        onKeyPress={(event) => {
                          const charCode = event.which ? event.which : event.keyCode;
                          if (
                            charCode > 31 &&
                            (charCode < 48 || charCode > 57)
                          ) {
                            event.preventDefault();
                          }
                        }}
                        className="customTextField"
                      />
                    </TableCell>
                  </TableRow>
                )}

              {projectId !== Taskname.ahWorkwaveProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow className="customTableRow">
                    <TableCell
                      style={{
                        fontFamily: "Arial",
                        fontSize: "13px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                        backgroundColor: "#676c71",
                      }}
                    >
                      Performance Management
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id="pm"
                        value={pmValues}
                        onChange={(e) => handleHoursFieldChange(e.target.value, setPmValues)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            handleIntegerChange("", setPmValues);
                            setTimeout(() => {
                              handleInputChange();
                            }, 0);
                          }
                        }}
                        onBlur={(event) => {
                          setTaskId(10);
                          handleBlurEvent(
                            10,
                            formatDate(reconciliationDate),
                            event.target.value
                          );
                        }}
                        inputProps={{
                          maxLength: 2,
                          pattern: "[0-9]*",
                          style: {
                            textAlign: "center",
                            padding: "10px 0px",
                            fontSize: "13px",
                            height: "16px",
                            backgroundColor: "#e8e9e7",
                          },
                        }}
                        onKeyPress={(event) => {
                          const charCode = event.which ? event.which : event.keyCode;
                          if (
                            charCode > 31 &&
                            (charCode < 48 || charCode > 57)
                          ) {
                            event.preventDefault();
                          }
                        }}
                        className="customTextField"
                      />
                    </TableCell>
                  </TableRow>
                )}

              {projectId !== Taskname.ahWorkwaveProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow className="customTableRow">
                    <TableCell
                      style={{
                        fontFamily: "Arial",
                        fontSize: "13px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                        backgroundColor: "#676c71",
                      }}
                    >
                      Compensation and Benefits
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id="cb"
                        value={cbValues}
                        onChange={(e) => handleHoursFieldChange(e.target.value, setCbValues)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            handleIntegerChange("", setCbValues);
                            setTimeout(() => {
                              handleInputChange();
                            }, 0);
                          }
                        }}
                        onBlur={(event) => {
                          setTaskId(11);
                          handleBlurEvent(
                            11,
                            formatDate(reconciliationDate),
                            event.target.value
                          );
                        }}
                        inputProps={{
                          maxLength: 2,
                          pattern: "[0-9]*",
                          style: {
                            textAlign: "center",
                            padding: "10px 0px",
                            fontSize: "13px",
                            height: "16px",
                            backgroundColor: "#e8e9e7",
                          },
                        }}
                        onKeyPress={(event) => {
                          const charCode = event.which ? event.which : event.keyCode;
                          if (
                            charCode > 31 &&
                            (charCode < 48 || charCode > 57)
                          ) {
                            event.preventDefault();
                          }
                        }}
                        className="customTextField"
                      />
                    </TableCell>
                  </TableRow>
                )}

              {projectId !== Taskname.ahWorkwaveProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow className="customTableRow">
                    <TableCell
                      style={{
                        fontFamily: "Arial",
                        fontSize: "13px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                        backgroundColor: "#676c71",
                      }}
                    >
                      Audits and Compilance
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id="ac"
                        value={acValues}
                        onChange={(e) => handleHoursFieldChange(e.target.value, setAcValues)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            handleIntegerChange("", setAcValues);
                            setTimeout(() => {
                              handleInputChange();
                            }, 0);
                          }
                        }}
                        onBlur={(event) => {
                          setTaskId(12);
                          handleBlurEvent(
                            12,
                            formatDate(reconciliationDate),
                            event.target.value
                          );
                        }}
                        inputProps={{
                          maxLength: 2,
                          pattern: "[0-9]*",
                          style: {
                            textAlign: "center",
                            padding: "10px 0px",
                            fontSize: "13px",
                            height: "16px",
                            backgroundColor: "#e8e9e7",
                          },
                        }}
                        onKeyPress={(event) => {
                          const charCode = event.which ? event.which : event.keyCode;
                          if (
                            charCode > 31 &&
                            (charCode < 48 || charCode > 57)
                          ) {
                            event.preventDefault();
                          }
                        }}
                        className="customTextField"
                      />
                    </TableCell>
                  </TableRow>
                )}

              <TableRow className="customTableRow">
                <TableCell
                  style={{
                    fontFamily: "Arial",
                    fontSize: "13px",
                    color: "white",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                    backgroundColor: "#676c71",
                  }}
                >
                  Miscellaneous
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "white",
                    fontFamily: "Arial",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  <TextField
                    type="text"
                    id="mis"
                    value={misValues}
                    onChange={(e) => handleHoursFieldChange(e.target.value, setMisValues)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        handleIntegerChange("", setMisValues);
                        setTimeout(() => {
                          handleInputChange();
                        }, 0);
                      }
                    }}
                    onBlur={(event) => {
                      setTaskId(7);
                      handleBlurEvent(
                        7,
                        formatDate(reconciliationDate),
                        event.target.value
                      );
                    }}
                    inputProps={{
                      maxLength: 2,
                      pattern: "[0-9]*",
                      style: {
                        textAlign: "center",
                        padding: "10px 0px",
                        fontSize: "13px",
                        height: "16px",
                        backgroundColor: "#e8e9e7",
                      },
                    }}
                    onKeyPress={(event) => {
                      const charCode = event.which ? event.which : event.keyCode;
                      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                        event.preventDefault();
                      }
                    }}
                    className="customTextField"
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "#353638",
                    fontFamily: "Arial",
                    fontSize: "13px",
                    color: "white",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "white",
                    fontFamily: "Arial",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  <TextField
                    type="text"
                    id="totalHours"
                    value={total}
                    readOnly
                    inputProps={{
                      style: {
                        textAlign: "center",
                        padding: "10px 0px",
                        fontSize: "13px",
                        height: "16px",
                        backgroundColor: "#cccccc",
                      },
                    }}
                    className="customTextField"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box
            className="buttonContainer"
            sx={{ mt: 1, display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              className="customButton"
              onClick={handleSubmitModal}
              style={{
                width: "30%",
                height: "36px",
                fontSize: "13px",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.85)",
              }}
              disabled={loading}
            >
              Submit
            </Button>

            {/* {<Button
              variant="contained"
              color="primary"
              className="customButton"
              onClick={handleClearModal}
              style={{
                fontFamily: 'Arial',
                width: '15%',
                height: '40px',
                fontSize: '11px',
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.85)',
              }}
              disabled={loading}
            >
              Clear
            </Button> } */}
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          Please enter valid reason and at least 1 hour of work
        </Alert>
      </Snackbar>

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MuiAlert
          onClose={handleSuccessSnackbarClose}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            height: "70%",
            backgroundColor: "#2e7d32",
            color: "#ffffff",
          }}
        >
          Details submitted successfully!
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={emptyReasonSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setEmptyReasonSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setEmptyReasonSnackbarOpen(false)}>
          Please provide a valid reason
        </Alert>
      </Snackbar>

      <Snackbar
        open={noRowSelectedSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setNoRowSelectedSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setNoRowSelectedSnackbarOpen(false)}>
          Please select one open reconciliation row
        </Alert>
      </Snackbar>

      <Snackbar
        open={apiErrorSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setApiErrorSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setApiErrorSnackbarOpen(false)}>
          {apiErrorMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
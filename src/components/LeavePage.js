import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  Typography,
  Box,
  Grid,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import './../style/Leave.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const LeavePage = () => {
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [applyTo, setApplyTo] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showHistory] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentEmployeeId = String(user?.employeeId || "");
  const currentEmployeeName = user?.name || user?.employeeName || "";
  const userGender = user?.gender?.toLowerCase();

  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: ""
  });

  const triggerToast = (message, type) => {
    setToastState({ show: true, message, type });
    setTimeout(() => {
      setToastState({ show: false, message: "", type: "" });
    }, 2500);
  };

  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("leaveHistory");
    return stored ? JSON.parse(stored) : [];
  });

  const [leaveBalances, setLeaveBalances] = useState(() => {
    const storedBalances = localStorage.getItem("leaveBalances");
    return storedBalances
      ? JSON.parse(storedBalances)
      : [
          { code: 'Annual Leave', type: 'Annual', value: 0.75 },
          { code: 'Restricted Holiday', type: 'RH', value: 8 },
          { code: 'LOP', type: 'LOP', value: 5 },
          { code: 'Privilege Leave', type: 'PL', value: 5 },
          { code: 'Maternity Leave', type: 'ML', value: 7 },
          { code: 'Sick Leave', type: 'SL', value: 10 }
        ];
  });

  const handleClear = () => {
    setLeaveType('');
    setStartDate(null);
    setEndDate(null);
    setApplyTo('');
    setReason('');
  };

  const handleApply = () => {
    if (!startDate || !endDate || !leaveType || !applyTo || !reason.trim()) {
      triggerToast("Please fill all fields.", "error");
      return;
    }

    if (dayjs(endDate).isBefore(dayjs(startDate), 'day')) {
      triggerToast("End date cannot be before start date.", "error");
      return;
    }

    if (leaveType === "Maternity Leave" && userGender !== "female") {
      triggerToast("Maternity Leave can only be applied by female employees.", "error");
      return;
    }

    const requestedStart = dayjs(startDate).startOf('day');
    const requestedEnd = dayjs(endDate).startOf('day');

    const isDateOverlap = history.some((entry) => {
      const entryEmployeeId = String(entry.empId || "");
      const entryStatus = String(entry.status || "").trim().toUpperCase();

      if (entryEmployeeId !== currentEmployeeId) return false;
      if (entryStatus.includes("REJECTED") || entryStatus.includes("WITHDRAWN")) return false;

      const existingStart = dayjs(entry.startDate, 'DD-MM-YYYY', true).startOf('day');
      const existingEnd = dayjs(entry.endDate, 'DD-MM-YYYY', true).startOf('day');

      if (!existingStart.isValid() || !existingEnd.isValid()) return false;

      return (
        requestedStart.isBetween(existingStart, existingEnd, 'day', '[]') ||
        requestedEnd.isBetween(existingStart, existingEnd, 'day', '[]') ||
        existingStart.isBetween(requestedStart, requestedEnd, 'day', '[]') ||
        existingEnd.isBetween(requestedStart, requestedEnd, 'day', '[]')
      );
    });

    if (isDateOverlap) {
      triggerToast("Leave already applied for selected date(s).", "error");
      return;
    }

    const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;

    const slot = leaveBalances.find((lb) => lb.code === leaveType);
    if (!slot) {
      triggerToast("Invalid leave type selected.", "error");
      return;
    }

    if (slot.value <= 0) {
      triggerToast("Selected leave is not available.", "error");
      return;
    }

    if (slot.value < days) {
      triggerToast("Insufficient leave balance.", "error");
      return;
    }

    if (leaveType === "LOP" && slot.value <= 0) {
      triggerToast("No LOP balance available.", "error");
      return;
    }

    const updatedBalances = leaveBalances.map((lb) =>
      lb.code === leaveType
        ? { ...lb, value: lb.value - days }
        : lb
    );

    setLeaveBalances(updatedBalances);
    localStorage.setItem("leaveBalances", JSON.stringify(updatedBalances));

    const newEntry = {
      id: Date.now(),
      empId: currentEmployeeId,
      name: currentEmployeeName,
      leaveType,
      startDate: dayjs(startDate).format('DD-MM-YYYY'),
      endDate: dayjs(endDate).format('DD-MM-YYYY'),
      days,
      appliedOn: dayjs().format('DD-MM-YYYY'),
      reason: reason.trim(),
      balance: updatedBalances.find((lb) => lb.code === leaveType)?.value,
      status: "Withdraw Pending"
    };

    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem("leaveHistory", JSON.stringify(updatedHistory));

    const approvals = JSON.parse(localStorage.getItem("leaveApprovals") || "[]");
    approvals.push(newEntry);
    localStorage.setItem("leaveApprovals", JSON.stringify(approvals));

    handleClear();
    triggerToast("Leave applied successfully!", "success");
  };

  return (
    <Box className="leave-container">
      <IconButton
        onClick={() => navigate('/timesheettable')}
        sx={{ position: 'absolute', top: 16, left: 16, color: 'white' }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <Box className="leave-header">
        <Typography variant="h5" className="leave-title">
          LEAVE
        </Typography>

        <Box className="random">
          <Box className="leave-buttons">
            <Button variant={showHistory ? "outlined" : "contained"} color="primary">
              APPLY
            </Button>
            <Button
              variant={showHistory ? "contained" : "outlined"}
              className="history-button"
              onClick={() => navigate('/history')}
            >
              HISTORY
            </Button>
          </Box>

          <Grid container spacing={2} className="leave-content">
            <Grid item xs={12} md={2}>
              <Box className="left-panel">
                {leaveBalances.map((leave, index) => (
                  <Button
                    key={index}
                    className="leave-type-btn"
                    variant="contained"
                    sx={{
                      border: '4px solid #6fbcff',
                      color: 'white',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      marginBottom: '10px',
                    }}
                  >
                    {leave.type}
                    <div className="leave-value">{leave.value}</div>
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box className="calendar-panel">
                <Typography variant="h6">Select Dates</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);

                      if (!startDate || (startDate && endDate)) {
                        setStartDate(newValue);
                        setEndDate(null);
                      } else if (
                        !endDate &&
                        (newValue.isSame(startDate, 'day') || newValue.isAfter(startDate, 'day'))
                      ) {
                        setEndDate(newValue);
                      }
                    }}
                    sx={{
                      '.MuiPickersDay-root': {
                        color: 'white',
                        fontSize: '1rem',
                        width: 40,
                        height: 35,
                      },
                      '.Mui-selected': {
                        backgroundColor: '#1976d2',
                        color: '#fff',
                      },
                      '.MuiPickersDay-today': {
                        border: '1px solid #fff',
                      },
                      '.MuiDayCalendar-weekDayLabel': {
                        color: 'white',
                        fontSize: '1rem',
                        width: 40,
                        height: 40,
                      },
                      '.MuiPickersCalendarHeader-label': {
                        color: 'white',
                        fontSize: '1.2rem',
                      },
                      '.MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="form-panel" sx={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <CardContent>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      displayEmpty
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="" disabled>Leave Type</MenuItem>
                      <MenuItem value="Annual Leave">AL</MenuItem>
                      <MenuItem value="Restricted Holiday">RH</MenuItem>
                      <MenuItem value="LOP">LOP</MenuItem>
                      <MenuItem value="Privilege Leave">PL</MenuItem>
                      {userGender === "female" && (
                        <MenuItem value="Maternity Leave">ML</MenuItem>
                      )}
                      <MenuItem value="Sick Leave">SL</MenuItem>
                    </Select>

                    <Box>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: { width: '100%' }
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: { width: '100%' }
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <TextField
                        label="Reason"
                        multiline
                        rows={1}
                        fullWidth
                        sx={{ width: '100%' }}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </Box>

                    <Select
                      value={applyTo}
                      onChange={(e) => setApplyTo(e.target.value)}
                      displayEmpty
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      <MenuItem value="" disabled>Apply To</MenuItem>
                      <MenuItem value="Niranjan Achutharam">Pankaj</MenuItem>
                    </Select>

                    <Grid container spacing={1} sx={{ mt: 2 }}>
                      <Grid item xs={6}>
                        <Button fullWidth variant="outlined" color="error" onClick={handleClear}>
                          CLEAR
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button fullWidth variant="contained" onClick={handleApply}>
                          APPLY
                        </Button>
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Snackbar
          open={toastState.show}
          autoHideDuration={3000}
          onClose={() => setToastState({ show: false, message: "", type: "" })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setToastState({ show: false, message: "", type: "" })}
            severity={toastState.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toastState.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default LeavePage;
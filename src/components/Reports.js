import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, RadioGroup, FormControlLabel,
  Radio, Select, MenuItem, TextField, Button, Stack
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';

export default function Reports() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState('LEAVE');
  const [employeeType, setEmployeeType] = useState('employee');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const isFormFilled = selectedEmployee && leaveType && fromDate && toDate;

  const handleReset = () => {
    setEmployeeType('employee');
    setSelectedEmployee('');
    setLeaveType('');
    setFromDate(null);
    setToDate(null);
  };

  return (
    <Box sx={{
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      px: 2,
      py: 1,
      
    }}>
       <IconButton
        onClick={() => navigate('/dashboard')}
        sx={{ position: 'absolute', top: 16, left: 16, color: 'white' }}
      >
        <ArrowBackIosIcon />
      </IconButton>

       <Typography variant="h5" className="reports-title" sx={{color:'white'}}>REPORTS</Typography>
    
  <Box className="random" sx={{    
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column', 
    width: '70%',
    height: '550px',
  }} >

  <Box className="reports-buttons" sx={{
   display: 'flex',
   justifycontent: 'center',
   gap: '10px',
   mb:'20px'
  }}>
                      <Button variant= "contained" color="primary">LEAVE</Button>
                      <Button variant="outlined" onClick={() => navigate('/timesheet')} >TIMESHEET</Button>
                    </Box>
       
      <Paper elevation={6} sx={{
        width: '100%',
        maxWidth: 600,
        p: 4,
        mb: '50px',
        border: '3px solid rgba(255,255,255,0.7)',
        backgroundColor: 'rgba(255,255,255,0.6)'
      }}>
            
        <Typography variant="h6" sx={{ mb: 1,mt : 0,  textAlign: 'center' }}>
          Employee Leave Transaction
        </Typography>

        <RadioGroup
          row
          value={employeeType}
          onChange={(e) => {
  const value = e.target.value;
  setEmployeeType(value);
  if (value === 'all') {
    setSelectedEmployee('ALL');
  } else {
    setSelectedEmployee(''); // Reset to empty when "Employee" is selected
  }
}}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="all" control={<Radio />} label="All Employees" />
          <FormControlLabel value="employee" control={<Radio />} label="Employee" />
        </RadioGroup>

     <TextField
  select
  fullWidth
  label="Employee"
  value={selectedEmployee}
  onChange={(e) => setSelectedEmployee(e.target.value)}
  sx={{ mb: 2 }}
  disabled={employeeType === 'all'}
>
  {/* Only show when employeeType is 'employee' */}
  {employeeType === 'employee' && (
    <MenuItem value="">Select Employee</MenuItem>
  )}
  {/* Always present, but hidden unless 'all' is selected */}
  {employeeType === 'all' && (
    <MenuItem value="ALL">All Employees</MenuItem>
  )}
  {/* Always present employee list */}
  <MenuItem value="Pranali - 100245">Pranali - 10023</MenuItem>
  <MenuItem value="Palak - 100214">Palak - 10022</MenuItem>
</TextField>

        <TextField
  select
  fullWidth
  label="Leave Type"
  value={leaveType}
  onChange={(e) => setLeaveType(e.target.value)}
  sx={{ mb: 2 }}
>
  <MenuItem value="">All Types</MenuItem>
  <MenuItem value="Annual Leave">Annual Leave</MenuItem>
  <MenuItem value="Sick Leave">Sick Leave</MenuItem>
  <MenuItem value="Restricted Holiday">RH</MenuItem>
  <MenuItem value="LOP">LOP</MenuItem>
  <MenuItem value="Privilege Leave">PL</MenuItem>
  <MenuItem value="Maternity Leave">ML</MenuItem>
</TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              minDate={dayjs()}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              minDate={fromDate || dayjs()} 
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Stack>
        </LocalizationProvider>

        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
         <Button
  variant="contained"
  disabled={!isFormFilled}
  sx={{ minWidth: 100 }}
  onClick={() => {
    const formData = {
      name: selectedEmployee.split(' - ')[0],
      id: selectedEmployee.split(' - ')[1],
      date: dayjs(fromDate).format('DD-MM-YYYY'),
      coding: 0,
      testing: 0,
      devops: 0,
      db: 0,
      meeting: 0,
      misc: 0,
      total: 0,
      status: leaveType,
      workStatus: 'On Leave',
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('leaveReports')) || [];
    localStorage.setItem('leaveReports', JSON.stringify([...existing, formData]));

    // Navigate to Timesheet page
    navigate('/timesheet');
  }}
>
  SUBMIT
</Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleReset}
            sx={{ minWidth: 100 }}
          >
            RESET
          </Button>
        </Stack>
      </Paper>
    </Box>
    </Box>

  );
}

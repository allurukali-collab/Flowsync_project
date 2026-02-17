import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Paper, Stack, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  FormControlLabel, Switch
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function Timesheet() {

  const navigate = useNavigate();
  const [employee, setEmployee] = useState('');
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [workType, setWorkType] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [timesheetData, setTimesheetData] = useState([]);


  // Load the filtered data from localStorage on component mount
  useEffect(() => {
    const savedFilteredData = JSON.parse(localStorage.getItem('filteredLeaveReports')) || [];
    setTimesheetData(savedFilteredData);
    
    // Optional: Clear the filtered data after loading it to avoid confusion in subsequent visits
    // localStorage.removeItem('filteredLeaveReports'); 
    
    // NOTE: Humne Timesheet.js mein filters ka state rakha hai, par unka
    // actual filtering Reports page mein ho raha hai. Isliye, hum
    // table mein woh data dikhayenge jo Reports page se bheja gaya hai.
    
    // Agar Reports page se koi data nahi aaya, toh "No Records Found" message dikhega.
  }, []); 


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleReset = () => {
    setEmployee('');
    setFromDate(dayjs());
    setToDate(dayjs());
    setWorkType('ALL');
  };

  // Check if there is data to display
  const hasData = timesheetData.length > 0;

  return (


    <Box sx={{
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      px: 2,
      py: 1,

    }}>

      <Typography variant="h5" className="reports-title" sx={{ color: 'white' }}>REPORTS</Typography>

      <Box className="random" sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '600px',
      }} >

        <Box className="reports-buttons" sx={{
          display: 'flex',
          justifycontent: 'center',
          gap: '10px',
          mb: '20px'
        }}>
          <Button variant="outlined" color="primary" onClick={() => navigate('/reports')}>LEAVE</Button>
          <Button variant="contained"  >TIMESHEET</Button>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          width="100%"
          height="20px"
          mb={2}
        >
          {/* Left Side: Internal Report Switch */}
          <FormControlLabel
            control={<Switch
              defaultChecked
              color="primary"
              onChange={() => navigate('/clientreport')}
              sx={{
                '& .MuiSwitch-thumb': {
                  color: '#1976d2', // Thumb color when OFF
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#90caf9', // Track color when OFF
                },
                '&.Mui-checked .MuiSwitch-thumb': {
                  color: '#fff', // Thumb color when ON
                },
                '&.Mui-checked .MuiSwitch-track': {
                  backgroundColor: '#1976d2', // Track color when ON
                },
              }}
            />}
            label={
              <Typography variant="subtitle1" color="white">
                Internal Report
              </Typography>
            }
          />

          {/* Right Side: All Filters - Filters are kept for the Timesheet page's purpose, but for leave, data comes from Reports page */}
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="flex-end">
            <TextField
              label="Employee"
              select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              sx={{
                width: 300,
                '& .MuiInputBase-root': { color: 'white', height: 40 },
                '& input': {
                  padding: '10px 12px',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& .MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <MenuItem value="Pranali - 10023">Pranali - 10023</MenuItem>
              <MenuItem value="Palak - 10022">Palak - 10022</MenuItem>
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                enableAccessibleFieldDOMStructure={false}
                slots={{
                  textField: (params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        width: 250,
                        '& .MuiOutlinedInput-root': {
                          height: 40,
                          '& fieldset': {
                            borderColor: 'white',
                          },
                          '&:hover fieldset': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'white',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'white',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      }}
                    />
                  ),
                }}
              />

              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                minDate={fromDate || dayjs()}
                enableAccessibleFieldDOMStructure={false}
                slots={{
                  textField: (params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        width: 250,
                        '& .MuiOutlinedInput-root': {
                          height: 40,
                          '& fieldset': {
                            borderColor: 'white',
                          },
                          '&:hover fieldset': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'white',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'white',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      }}
                    />
                  ),
                }}
              />

            </LocalizationProvider>

            <TextField
              label="Work Type"
              select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              sx={{
                width: 200,
                '& .MuiInputBase-root': { color: 'white', height: 40 },
                '& input': {
                  padding: '10px 12px',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& .MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <MenuItem value="ALL">ALL</MenuItem>
              <MenuItem value="Coding">Coding</MenuItem>
              <MenuItem value="Meeting">Meeting</MenuItem>
              <MenuItem value="Testing">Testing</MenuItem>
              <MenuItem value="DevOps">DevOps</MenuItem>
              <MenuItem value="Database">Database</MenuItem>
              <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
            </TextField>
          </Stack>
        </Box>

        {/* Sticky Header Table */}
        <TableContainer component={Paper} sx={{ flexGrow: 1, mt: 4, backgroundColor: 'transparent', border: '1px solid white', maxHeight: 320 }}>
          <Table stickyHeader size="small" >
            <TableHead>
              <TableRow  >
                {[
                  'Employee Name', 'EmpID', 'Date',
                  'Coding', 'Testing', 'DevOps', 'Database',
                  'Meeting', 'Miscellaneous', 'Total', 'Status', 'Work Status'
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      color: 'white',
                      backgroundColor: 'transparent',
                      textAlign: 'center',
                      height: 34
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {hasData ? (
                timesheetData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={index} sx={{}}>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.name}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.id}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.date}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.coding}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.testing}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.devops}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.db}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.meeting}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.misc}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.total}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.status}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.workStatus}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} sx={{ color: 'white', textAlign: 'center', py: 5 }}>
                    <Typography variant="h6" color="inherit">
                      No Records Found
                    </Typography>
                    <Typography variant="body2" color="inherit" sx={{mt: 1}}>
                      Please use the 'Leave' tab to search for leave records.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ width: '100%' }}>
          {hasData && (
            <TablePagination
              component="div"
              count={timesheetData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                border: '1px solid white',
                color: 'white',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: 'white',
                },
                '& .MuiInputBase-root': {
                  color: 'white',
                },
                '& svg': {
                  color: 'white',
                }

              }}
            />
          )}
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2, width: '100%' }}>
          <Button variant="contained" color="primary" sx={{ px: 4 }}>SEARCH</Button>
          <Button variant="outlined" color="error" onClick={handleReset} sx={{ backgroundColor: 'gray', px: 4 }}>RESET</Button>
          <Button variant="contained" color="info" sx={{ px: 4 }}>EXPORT</Button>
        </Stack>


      </Box>
    </Box>

  );
}
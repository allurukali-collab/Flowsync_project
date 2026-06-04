import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import GroupIcon from '@mui/icons-material/Group';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from './Navbar.js';

const ExcelImport = () => {
  const navigate = useNavigate();  
  const [payrollMonth, setPayrollMonth] = useState(dayjs().format("MMM YYYY"));
  const [employeeType, setEmployeeType] = useState('');
  const [importType, setImportType] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  const handleOpenErrorDialog = () => setOpenErrorDialog(true);
  const handleCloseErrorDialog = () => setOpenErrorDialog(false);

  const handleOpenDialog = () => {
  setOpenDialog(true);
  };

  const handleCloseDialog = () => {
  setOpenDialog(false);
  };

  const rows = [
    {
      file: 'Salary Revision.xlsx',
      importedOn: '10 Apr 2023 10:48:34',
      uploadedBy: 'Admin',
      type: 'Add/Revise Salary',
      status: 'COMPLETED',
    },
    {
      file: 'Salary Revision.xlsx',
      importedOn: '25 Nov 2020 20:36:26',
      uploadedBy: 'Admin',
      type: 'Add/Revise Salary',
      status: 'COMPLETED',
    },
    ...Array(7).fill({
      file: 'Attendance Swipes.xlsx',
      importedOn: '02 Nov 2020 20:10:43',
      uploadedBy: 'Admin',
      type: 'Attendance Swipes',
      status: 'COMPLETED',
    })
  ];

  return (
    <Box>
      <Navbar/>
    <Box p={1} sx={{width:'80%',margin:'0 auto',mt:'50px'}}>
      {/* Breadcrumbs */}
        <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' }, mb: 2 }}>
          <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
          <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
          <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/excelimport">Excel Import</Link>
          {/* <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Company Policies & Forms</span> */}
        </Breadcrumbs>

        {/* Filters */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 1}}>
            {/* Payroll Month Picker */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              px: 2,
              borderRadius: 1,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              width: '150px'
            }}>
              <DatePicker
                views={['year', 'month']}
                value={dayjs(payrollMonth, "MMM YYYY")}
                onChange={(newValue) => {
                  const formatted = dayjs(newValue).format("MMM YYYY");
                  setPayrollMonth(formatted);
                }}
                slotProps={{
                  textField: {
                    variant: 'standard',
                    fullWidth: true,
                    InputLabelProps: { shrink: false },
                    InputProps: {
                      disableUnderline: true,
                      sx: {
                        fontSize: '12px',
                        color: '#fff',
                        '& .MuiSvgIcon-root': { color: '#fff' }
                      }
                    },
                    inputProps: {
                      style: {
                        fontSize: '12px',
                        padding: '6px 4px',
                        color: '#fff'
                      },
                      placeholder: ''
                    },
                  },
                }}
              />
            </Box>

            {/* Employee Type Dropdown */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              px: 2,
              borderRadius: 1,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)'
            }}>
              <GroupIcon sx={{ mr: 1, color: '#ddd' }} />
              <Select
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
                variant="standard"
                disableUnderline
                sx={{ color: '#fff', '& .MuiSelect-icon': { color: '#fff' } }}
              >
                <MenuItem value="No Options" disabled>No Options</MenuItem>
              </Select>
            </Box>
          </Box>
        </LocalizationProvider>

      <FormControl sx={{ minWidth: 200,height:40,'& .MuiOutlinedInput-root': {  height: 35, 
        '& fieldset': {   
        borderColor: 'white',
    },
        '&:hover fieldset': {
         borderColor: 'white',
    },
        '&.Mui-focused fieldset': {
         borderColor: 'white',
    }}
       }}>
        <InputLabel id="import-type-label"
         sx={{
         color: 'white',
        '&.Mui-focused': {
         color: 'white',
        },
       '&.MuiInputLabel-shrink': {
        color: 'white',
      },
    }} 
        >Importer Type</InputLabel>
        <Select
          labelId="import-type-label"
          value={importType}
          label="Importer Type"
          onChange={(e) => setImportType(e.target.value)}
          sx={{
      color: 'white', // dropdown text color
      '.MuiSvgIcon-root': {
        color: 'white', // arrow color
      },
    }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Permanent Address">Employee Permanent Address</MenuItem>
          <MenuItem value="Contact Address">Employee Contact Address</MenuItem>
          <MenuItem value="Present Address">Employee Present Address</MenuItem>
          <MenuItem value="Attendance Muster">Attendance Muster</MenuItem>
          <MenuItem value="Attendance Exception">Attendance Exception</MenuItem>
          <MenuItem value="Attendance Swipes">Attendance Swipes</MenuItem>
        </Select>
      </FormControl>

      <Button variant="outlined" sx={{ float: 'right'}} onClick={() => navigate('/importexcel')}>
        Import From Excel
      </Button>

    <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 1,
            boxShadow: 1,}}>
      <Typography variant="h6" mb={1} sx={{color: 'white', border:'0.2 px solid white',borderRadius:'2px',boxShadow:'1px 1px rgba(44, 43, 43, 0.5)',p:0.5,backgroundColor: 'rgba(73, 72, 72, 0.9)'}}>
        Last 10 out of 18 Uploaded Files
      </Typography>

      <TableContainer component={Paper} sx={{backgroundColor: 'rgba(255,255,255,0.6)'}}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ height: 38 }}>
              <TableCell><b>File</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Import Log</b></TableCell>
              <TableCell><b>Delete</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}sx={{ height: 40 }}>
                <TableCell underline="hover"  sx={{ py: 0.5,color:"rgba(62, 129, 176, 0.89)" }}>
                    {row.file}
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                    Imported on {row.importedOn} by {row.uploadedBy}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>{row.type}</TableCell>
                <TableCell sx={{ py: 0.5,color: 'green' }}>{row.status}</TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Button
                    onClick={handleOpenErrorDialog}
                  >
                   View
                  </Button>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <DeleteIcon sx={{ cursor: 'pointer', color: 'gray' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
</Box>
<Dialog open={openDialog} onClose={handleCloseDialog} sx={{
    '& .MuiDialog-container': { alignItems: 'flex-start' },
    '& .MuiDialog-paper': { mt: 8 }
  }}
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(6px)',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
  }}>

  <DialogContent>
    <Box
      component="pre"
      sx={{
        backgroundColor: '#f5f5f5',
        padding: 2,
        borderRadius: 1,
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
      }}
    >
      Started Processing the excel file...
      {"\n"}Read 38 rows(s) of data from excel file successfully!
      {"\n"}Importing data from the staging table...
      {"\n"}Salary revision payout will be from <b>Apr 2023</b>.
      {"\n\n"}<strong>Updated 38 employee(s) salary revised information successfully.</strong>
      {"\n"}Total time used: 4 secs
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} autoFocus>
      OK
    </Button>
  </DialogActions>
</Dialog>

<Dialog
  open={openErrorDialog}
  onClose={handleCloseErrorDialog}
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0,0,0,0.3)'
    }
  }}
  PaperProps={{
    sx: {
      backgroundColor: 'rgba(62, 55, 55, 0.66)',
      boxShadow: 3,
      borderRadius: 2,
      minWidth: 500
    }
  }}
>
  <DialogContent>
    <Box
      sx={{
        backgroundColor: '#eaeaeaff',
        padding: 2,
        borderRadius: 1,
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        color: '#000',
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        <b>Started Processing the excel file...</b>
      </Typography>
      <Typography variant="body2">Read 38 row(s) of data from excel file successfully!</Typography>
      <Typography variant="body2">Importing data from the staging table...</Typography>

      <Box mt={2}>
        <Typography variant="body2" sx={{ color: 'red', fontWeight: 'bold' }}>
          Employee information of the following employees is not imported since employee no doesn't exist!
        </Typography>

        <Box component="pre" sx={{ color: 'red', fontSize: '14px' }}>
          {[
            'Row: #2 Employee No.: 0001',
            'Row: #3 Employee No.: 0002',
            'Row: #4 Employee No.: 0003',
            'Row: #5 Employee No.: 0004',
            'Row: #6 Employee No.: 00090',
            'Row: #7 Employee No.: 002',
            'Row: #8 Employee No.: 003',
            'Row: #9 Employee No.: 004',
            'Row: #10 Employee No.: 005',
            'Row: #11 Employee No.: 0068',
            'Row: #12 Employee No.: 066',
            'Row: #13 Employee No.: 5001',
            'Row: #14 Employee No.: 5002',
          ].join('\n')}
        </Box>
      </Box>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button variant="outlined" onClick={handleCloseErrorDialog}>OK</Button>
  </DialogActions>
</Dialog>
</Box>
</Box>
  );
};

export default ExcelImport;

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, IconButton, InputAdornment,
  Table, TableHead, TableRow, TableCell, TableBody, Button,
  TableContainer, Paper, Pagination, Select, MenuItem, Breadcrumbs, Link
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GroupIcon from '@mui/icons-material/Group';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Tooltip } from '@mui/material';
import jsPDF from 'jspdf';
import Navbar from './Navbar.js';


const Letter = () => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [deleteSnackbar, setDeleteSnackbar] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openPublishDialog, setOpenPublishDialog] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const updatedRow = location.state?.updatedRow;

    const handleConfirmDelete = () => {
    if (rowToDelete !== null) {
    const updated = [...rowsData];
    updated.splice(rowToDelete, 1); // remove the selected row
    setRowsData(updated);
    setRowToDelete(null);
    setOpenDeleteDialog(false);
    setDeleteSnackbar(true); // show snackbar
    }
  };

    const [rowsData, setRowsData] = useState([
  ['Address Proof Letter', 'LETTER00040#', 'Pranali(T0019) ', '22 Sep 2024', 'Pranali'],
  ['Confirmation Letter', 'LETTER00023#', 'Palak(T0012)', '29 Oct 2020', 'Palak@stibiumtech'],
  ['Address Proof Letter', 'LETTER00022#', 'Palak(T0012)', '29 Oct 2020', 'Palak@stibiumtech'],
  ['Appointment Order', 'LETTER00021#', 'Vikash(T0012)', '29 Oct 2020', 'Vikash@stibiumtech'],
  ['Address Proof Letter', 'LETTER00020#', 'Pankaj(T0044)', '29 Oct 2020', 'Pankaj@stibiumtech'],
  ['Appointment Order', 'LETTER00019#', 'Pankaj(T0044)', '22 Oct 2020', 'Pankaj@stibiumtech'],
  ['Confirmation Letter', 'LETTER00018#', 'Pankaj(T0044)', '22 Oct 2020', 'Pankaj@stibiumtech'],
  
]);

    const [searchQuery, setSearchQuery] = useState('');
    const [payrollMonth, setPayrollMonth] = useState(dayjs().format('MMM YYYY'));
    const [employeeType, setEmployeeType] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    React.useEffect(() => {
  if (updatedRow) {
    setRowsData(prev =>
      prev.map(row =>
        row[1] === updatedRow.serialNo
          ? [
              updatedRow.template,
              updatedRow.serialNo,
              updatedRow.employee,
              updatedRow.preparedOn,
              updatedRow.preparedBy,
              '-', // Status
              updatedRow.remarks || '-', // Remarks
              '-', // Employee Remarks
            ]
          : row
      )
    );

    // Clear the state so it doesn't re-trigger
    window.history.replaceState({}, document.title);
  }
}, [updatedRow]);

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

    const filteredRows = rowsData.filter((row) =>
    row.some(cell => cell.toLowerCase().includes(searchQuery.toLowerCase()))
  );

    const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

    const handleExportToExcel = () => {
    // Define headings if needed
    const headings = [
    ['Letter Template', 'Serial No', 'Employee', 'Prepared On', 'Prepared By', 'Status', 'Remarks', 'Employee Remarks']
    ];

    // Prepare worksheet data: add headings + rows
    const worksheetData = headings.concat(rowsData.map(row => [...row])); // You can adjust if needed

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Letter Data');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'letter-data.xlsx');
    };

    const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Example content
    doc.setFontSize(16);
    doc.text("Confirmation Letter", 20, 20);
    doc.setFontSize(12);
    doc.text("This is to confirm that the request has been successfully approved.", 20, 40);

    // Save the file
    doc.save("confirmation.pdf");
    };

  return (
    <Box>
      <Navbar/>
    <Box sx={{width:'80%',margin:'0 auto',mt:'70px' }}>
      {/* Breadcrumbs */}
        <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' }, mb: 2 }}>
          <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
          <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
          <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/letter">Generate Letter</Link>
          {/* <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Company Policies & Forms</span> */}
        </Breadcrumbs>

        {/* Filters */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
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

      {/* Banner */}
      <Paper sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', backgroundColor: 'rgba(53, 49, 49, 0.63)', color: 'white',border: '1px solid white' }}>
        <img
          src="https://img.icons8.com/color/48/000000/document.png"
          alt="icon"
          style={{ marginRight: 12 }}
        />
        <Typography variant="subtitle1" >
          Using greytHR, efficiently generate and publish employee letters in just a few minutes—
          <strong>streamlining your process and saving time.</strong>
        </Typography>
        <Button variant="contained" color="primary" sx={{ ml: 'auto' }} onClick={() => navigate('/edit')}>
          Prepare Letter
        </Button>
      </Paper>

    <Box sx={{border: '2px solid white', backgroundColor: 'rgba(53, 49, 49, 0.63)', p: 1}}>
      {/* Search & Export */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <TextField
          placeholder="Search"
          size="small"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: 'white' }}>
                <SearchIcon />
              </InputAdornment>
            ),
          
          sx: {
        color: 'white',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        input: {
          color: 'white',
        },
      },
    }}
    sx={{
      width: 300,
      '& .MuiInputBase-root': {
        color: 'white',
      },
      '& .MuiOutlinedInput-root': {
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
    }}
        />
       <Tooltip title="Export to Excel"> 
        <IconButton sx={{ color: 'white' }} onClick={handleExportToExcel}>
          <DownloadIcon />
        </IconButton>
       </Tooltip> 
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{bgcolor: 'transparent', border: '2px solid white'}}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.3)'}} >
              <TableCell sx={{color: 'white'}}>Letter Template</TableCell>
              <TableCell sx={{color: 'white'}}>Serial No</TableCell>
              <TableCell sx={{color: 'white'}}>Employee</TableCell>
              <TableCell sx={{color: 'white'}}>Prepared On</TableCell>
              <TableCell sx={{color: 'white'}}>Prepared By</TableCell>
              <TableCell sx={{color: 'white'}}>Status</TableCell>
              <TableCell sx={{color: 'white'}}>Remarks</TableCell>
              <TableCell sx={{color: 'white'}}>Employee Remarks</TableCell>
              <TableCell sx={{color: 'white'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((r, i) => (
              <TableRow key={i}>
                <TableCell sx={{ color: 'white' }}>{r[0]}</TableCell>
                <TableCell sx={{ color: 'white' }}>{r[1]}</TableCell>
                <TableCell sx={{ color: 'white' }}>{r[2]}</TableCell>
                <TableCell sx={{ color: 'white' }}>{r[3]}</TableCell>
                <TableCell sx={{ color: 'white' }}>{r[4]}</TableCell>
                <TableCell sx={{ color: 'white' }}>-</TableCell>
                <TableCell sx={{ color: 'white' }}>{r[6] || '-'}</TableCell>
                <TableCell sx={{ color: 'white' }}>{r[7] || '-'}</TableCell>
                <TableCell>
                  <IconButton sx={{ color: 'white' }} onClick={handleDownloadPDF} ><DownloadIcon fontSize="small" /></IconButton>
                  <IconButton sx={{ color: 'white' }} onClick={() => setOpenPublishDialog(true)}><CloudUploadIcon fontSize="small" /></IconButton>
                  <IconButton sx={{ color: 'white' }} onClick={() => navigate('/edit', {state: {
                   rowData: {
                   template: r[0],
                   serialNo: r[1],
                   employee: r[2],
                   preparedOn: r[3],
                   preparedBy: r[4],
                   status: r[5],
                   remarks: r[6],
                   employeeRemarks: r[7],
                  },
                 },
                })
              }><EditIcon fontSize="small" /></IconButton>
                  <IconButton sx={{ color: 'white' }} onClick={() => {setOpenDeleteDialog(true); setRowToDelete(i); }}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
<Box sx={{ display: 'flex',justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
  <Pagination
    count={Math.ceil(filteredRows.length / rowsPerPage)}
    page={page}
    onChange={(e, newPage) => setPage(newPage)}
    sx={{
      '& .MuiPaginationItem-root': {
        color: 'white',                // text color
        borderColor: 'white',          // border color for outlined
      },
      '& .Mui-selected': {
        backgroundColor: 'white',
        color: 'gray',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
      },
    }}
    variant="outlined"
    shape="rounded"
  />
</Box>
</Box>
<Dialog open={openPublishDialog} onClose={() => setOpenPublishDialog(false)} sx={{'& .MuiDialog-container': {alignItems: 'flex-start',}, '& .MuiDialog-paper': {mt: 8, backgroundColor: 'rgba(53, 49, 49, 0.63)',border:'1px solid gray'},}} 
BackdropProps={{
    sx: {
      backdropFilter: 'blur(6px)', 
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
  }}>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '16px',color:'white' }}>
    Publish Letter
  </DialogTitle>
  <DialogContent>
    <Typography color="white">Are you sure you want to publish the letter to ESS?</Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
    <Button onClick={() => setOpenPublishDialog(false)} variant="outlined" sx={{ textTransform: 'none' }}>
      Cancel
    </Button>
    <Button
        onClick={() => {setOpenPublishDialog(false); setSnackbarOpen(true);
      }}
      variant="contained"
      sx={{ textTransform: 'none', backgroundColor: '#3f51b5' }}
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>
<Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity="success"
    sx={{ width: '100%' }}
  >
    Publish Letter to employee portal
  </Alert>
</Snackbar>

<Dialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
  sx={{
    '& .MuiDialog-container': { alignItems: 'flex-start' },
    '& .MuiDialog-paper': { mt: 8, backgroundColor: 'rgba(53, 49, 49, 0.63)',border:'1px solid gray' }
  }}
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(6px)',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '16px',color:'white' }}>
    Delete
  </DialogTitle>
  <DialogContent>
    <Typography color="white">
      Letter deletion is permanent, and you will have to create a new letter in the future.
      Are you sure you want to delete?
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
    <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">
      Cancel
    </Button>
    <Button onClick={handleConfirmDelete} variant="contained" sx={{ backgroundColor: '#3f51b5' }}>
      Confirm
    </Button>
  </DialogActions>
</Dialog>
<Snackbar
  open={deleteSnackbar}
  autoHideDuration={3000}
  onClose={() => setDeleteSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert severity="success" sx={{ width: '100%' }} onClose={() => setDeleteSnackbar(false)}>
    Letter deleted successfully
  </Alert>
</Snackbar>
</Box>
</Box>
  );
};

export default Letter;

import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Breadcrumbs, Link } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link as RouterLink } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.js';

const MassCom = () => {
  const navigate = useNavigate();
  const [payrollMonth, setPayrollMonth] = useState(dayjs());
  const [employeeType, setEmployeeType] = useState('');    
  const bulletins = [
    {
      category: 'General',
      Subject: 'Food Coupons',
      Type: 'Email,SMS',
      Date: '23 Sep 2024',
    },
    {
      category: 'Notification',
      Subject: 'Savings Declaration Update',
      Type: 'Email',
      Date: '13 Sep 2014',
    },
    {
      category: 'General',
      Subject: 'Food Coupons',
      Type: 'Email',
      Date: '22 OCt 2022',
    },
    {
      category: 'Notification',
      Subject: 'Savings Declaration Update',
      Type: 'SMS',
      Date: '20 Aug 2012',
    },
  ];

  return (
    <Box>
      <Navbar/>
    <Box sx={{ backgroundColor: 'transparent', maxHeight: '100vh',width:'80%',margin:'0 auto',mt:'70px' }}>
            {/* Breadcrumbs */}
              <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' } }}>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
                <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/masscom">Mass Communication</Link>
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
      <Box mb={1} mt={2}>
        <Button variant="contained" color="primary" onClick={()=> navigate('/compose')} >
          Compose
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, minHeight: 500, maxHeight: 700, backgroundColor: 'rgba(255,255,255,0.6)' }}>
        <Table >
          <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <TableRow  >
              <TableCell>Category</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bulletins.map((row, idx) => (
              <TableRow key={idx} >
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.Subject}</TableCell>
                <TableCell>{row.Type}</TableCell>
                <TableCell>{row.Date}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="primary" >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{color:'white'}}>Total Items: {bulletins.length}</Typography>
        <Box>
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default MassCom;

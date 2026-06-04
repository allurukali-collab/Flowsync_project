import React, { useState } from 'react';
import {
  Box, Breadcrumbs, Link, Select, MenuItem, Tabs, Tab, Typography, Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link as RouterLink } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.js';

const Company = () => {
  const navigate = useNavigate();
  const [payrollMonth, setPayrollMonth] = useState("Jul'25");
  const [employeeType, setEmployeeType] = useState("No Options");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Navbar/>
    <Box sx={{ width:'80%',margin:'0 auto',mt:'65px' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' } }}>
        <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
        <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Company Policies & Forms</span>
      </Breadcrumbs>

      {/* Filters */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
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
<Box
  sx={{
    display: { md: 'flex' },
    justifyContent: { md: 'center' },
  }}
>          

      {/* Tabs */}
      <Box sx={{
              border: '1px solid #cfd8dc',
              borderRadius: 2,
              p: 2,
              bgcolor: 'transparent',
              mt: 2,
              width:{md:'70%'},
            }}>
      <Box >
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Company Policies" sx={{ color: '#90a4ae' }} />
          <Tab label="Forms" sx={{ color: '#90a4ae' }} />
        </Tabs>

        {/* Content */}
        {activeTab === 0 && (
          <Box sx={{
            border: '1px solid #cfd8dc',
            borderRadius: 1,
            py: 6,
            textAlign: 'center',
            bgcolor: 'rgba(49, 47, 47, 0.57)',
            minHeight: 300
          }}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS_LiRVeB9FqtxVprOb16geHXhuveXlmqw0A&s"
              alt="empty"
              style={{ maxWidth: 180, marginBottom: 16, opacity: 0.5 }}
            />
            <Typography fontWeight={600} fontSize={16}>Let's create your first Company Policy</Typography>
            <Typography fontSize={13} color="gray" mt={1}>
              Empower your organization by enforcing industry best practices through these company policies.
            </Typography>
            <Button variant="contained" sx={{ mt: 3, px: 3, textTransform: 'none' }} onClick={() => {navigate('/policyform')}}>
              Create New Company Policy →
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{
            border: '1px solid #cfd8dc',
            borderRadius: 1,
            py: 6,
            textAlign: 'center',
            bgcolor: 'rgba(49, 47, 47, 0.57)',
            minHeight: 300
          }}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS_LiRVeB9FqtxVprOb16geHXhuveXlmqw0A&s"
              alt="empty"
              style={{ maxWidth: 180, marginBottom: 16, opacity: 0.5 }}
            />
            <Typography fontWeight={600} fontSize={16}>Let's create your first Company Policy</Typography>
            <Typography fontSize={13} color="gray" mt={1}>
              Empower your organization by creating a to share and maintain employee records.
            </Typography>
            <Button variant="contained" sx={{ mt: 3, px: 3, textTransform: 'none' }} onClick={() => {navigate('/form')}}>
              Create New Form →
            </Button>
          </Box>
        )}
        </Box>
      </Box>
      </Box>
    </Box>
     </Box>
  );
};

export default Company;

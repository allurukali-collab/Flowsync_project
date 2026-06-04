import React, { useState } from 'react';
import {
  Box, Paper, TextField, InputAdornment, Typography, Button,
  Select, MenuItem, Breadcrumbs, Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';

const Positionhistory = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [employeeType, setEmployeeType] = useState('Current Employees');
  const [activeTab] = useState('Employee');

  return (
    <Box sx={{ p: 3 }}>
        <Box sx={{
                border: '1px solid #cfd8dc',
                borderRadius: 2,
                p: 3,
                bgcolor: 'transparent',
              }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      
      <Box sx={{ minHeight: '80vh', backgroundColor: 'transparent' }}>
        <Box sx={{ borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.3)', p: 3, maxWidth: '1200px', mx: 'auto' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' } }}>
              <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
              <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
              <Typography color="rgba(255,255,255,0.7)" fontWeight={600}>Position History</Typography>
            </Breadcrumbs>

            <Box display="flex" gap={2} alignItems="center">
              <DatePicker
                views={['year', 'month']}
                open={monthPickerOpen}
                onOpen={() => setMonthPickerOpen(true)}
                onClose={() => setMonthPickerOpen(false)}
                value={selectedMonth}
                onChange={(newValue) => {
                  setSelectedMonth(newValue);
                  setMonthPickerOpen(false);
                }}
                renderInput={() => (
                  <Button
                    variant="outlined"
                    startIcon={<CalendarMonthIcon />}
                    onClick={() => setMonthPickerOpen(true)}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  >
                    Payroll Month: {selectedMonth.format("MMM 'YY")}
                  </Button>
                )}
              />

              <Select
                size="small"
                defaultValue="All"
                displayEmpty
                startAdornment={<GroupsIcon sx={{ color: 'action.active', mr: 1 }} />}
                sx={{ minWidth: 120, backgroundColor: 'white' }}
              >
                <MenuItem value="No Options">No Options</MenuItem>
              </Select>
            </Box>
          </Box>

          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e9f6fc' }}>
            <Typography>
              This page allows you to add/edit the profile details of an employee. The page helps you to keep the employee information up to date.
            </Typography>
            <Typography variant="body2" mt={1}>
              Explore greyHR by <Link href="#">Help-Doc</Link>, watching <Link href="#">How-to Videos</Link> and <Link href="#">FAQ</Link>.
            </Typography>
          </Paper>
        </Box>

        <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', mx: 'auto', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.3)', mt: 3 }}>
          <Box width="100%" maxWidth="500px">
            <Typography fontWeight="bold" fontSize="18px" mb={1} color="white">
              Start searching to see specific employee details here
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="body2" mb={1} color="white">
                Employee Type:
              </Typography>
              <Select
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
                size="small"
                variant="standard"
                disableUnderline
                sx={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  '& .MuiSelect-icon': { color: 'white' }
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Current Employees">Current Employees</MenuItem>
                <MenuItem value="Reassigned Employees">Resigned Employees</MenuItem>
              </Select>
            </Box>

            <TextField
              fullWidth
              placeholder="Search by Emp No/ Name"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  '& input': {
                    color: 'white',
                    '::placeholder': {
                      color: 'white',
                      opacity: 0.2,
                    },
                  },
                  '& fieldset': {
                    borderColor: 'white',
                    borderRadius: '20px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  }
                }
              }}
            />
          </Box>

          <Box>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmxvVgUbUVuW7In4M3VxZYEuGl29BoYeO9QA&s"
              alt="illustration"
              width={180}
            />
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
    </Box>
    </Box>
  );
};

export default Positionhistory;

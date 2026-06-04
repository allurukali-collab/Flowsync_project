import React, { useState } from 'react';
import {
   Box, Typography, Button, TextField, Paper, MenuItem,
  FormControlLabel, Switch
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';

export default function Timesheet() {
     const [selectedEmployee, setSelectedEmployee] = useState('');
     const [selectedMonth, setSelectedMonth] = useState(dayjs());
     const navigate = useNavigate();

     const handleReset = () => {
  setSelectedEmployee('');
  setSelectedMonth(dayjs()); // Reset to current month
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
    // backgroundColor: 'white'
  }} >

  <Box className="reports-buttons" sx={{
   display: 'flex',
   justifycontent: 'center',
   gap: '10px',
   mb:'20px'
  }}>
                      <Button variant= "outlined" color="primary" onClick={() => navigate('/reports')}>LEAVE</Button>
                      <Button variant="contained"  >TIMESHEET</Button>
                    </Box>

 <Box sx={{ alignSelf: 'flex-start', ml: 2, mb: 2 }}>
    <FormControlLabel
        control={<Switch
  color="primary"
  onChange={() => navigate('/timesheet')}
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
                <Typography variant="subtitle1" color="white">Client Report</Typography>
                        }
                      />
</Box>

<Paper
        elevation={6}
        sx={{
          height: '300px',
          width: '100%',
          maxWidth: 600,
          p: 4,
          border: '3px solid black',
          backgroundColor: 'rgba(255,255,255,0.4)',
        }}
      >
       {/* Employee Dropdown */}
<TextField
  select
  fullWidth
  label="Employee"
  value={selectedEmployee}
  onChange={(e) => setSelectedEmployee(e.target.value)}
  sx={{
    mb: 3,
    mt: 5,
    '& .MuiInputBase-root': {
      color: 'black',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black', // ✅ hover fix
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black',
    },
    '& .MuiInputLabel-root': {
      color: 'black',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'black',
    },
    '& .MuiSvgIcon-root': {
      color: 'black',
    },
  }}
>
  <MenuItem value="" disabled>Select Employee</MenuItem>
  <MenuItem value="Pranali- 10021">Pranali- 10021</MenuItem>
  <MenuItem value="Palak - 10022">Palak - 10022</MenuItem>
</TextField>

{/* Month Picker */}
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    views={['year', 'month']}
    label="Month & Year"
    value={selectedMonth}
    onChange={(newValue) => setSelectedMonth(newValue)}
    enableAccessibleFieldDOMStructure={false} // Prevents MUI X warning
    slotProps={{
      textField: {
        fullWidth: true,
        sx: {
          width: '100%',
          mb: 3,
          '& .MuiInputBase-root': {
            color: 'black',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
          },
          '&:hover fieldset': {
              borderColor: 'black',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
          },
          '& .MuiInputLabel-root': {
            color: 'black',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'black',
          },
          '& .MuiSvgIcon-root': {
            color: 'black',
          },
        },
      },
    }} 
  />
</LocalizationProvider>


        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button variant="contained" color="primary">
            REPORT
          </Button>
          <Button variant="outlined" color="error" onClick={handleReset}>
            RESET
          </Button>
        </Box>
      </Paper>


                    
</Box>
</Box>

 );

}
import React, { useState } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem,
  InputLabel, FormControl, Button, Divider, Breadcrumbs, Link
} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import GroupIcon from '@mui/icons-material/Group';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.js';

const Form = () => {
  const navigate = useNavigate();  
  const [payrollMonth, setPayrollMonth] = useState(dayjs().format("MMM YYYY"));
  const [employeeType, setEmployeeType] = useState("No Options");

  return (
    <Box>
      <Navbar/>
    <Box sx={{ width:'80%',margin:'0 auto',mt:'65px' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' }}}>
        <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
        <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
        <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/company">Company Policies & Forms</Link>
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
<Box
  sx={{
    display: { md: 'flex' },
    justifyContent: { md: 'center' },
  }}
>          

      {/* Form Card */}
      <Box sx={{
        border: '1px solid #cfd8dc',
        borderRadius: 2,
        p: 2,
        bgcolor: 'transparent'
      }}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
          Create Form
        </Typography>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          border: '1px solid gray',
          borderRadius: 2,
          p: 3,
          mt: 2,
          bgcolor: 'rgba(49, 47, 47, 0.57)',
          
        }}>
          {/* Left Side - Form */}
          <Box sx={{ flex: 2, pr: 4 }}>
            <Box sx={{ border: '1px solid gray', borderRadius: 1, p: 3,color:'white' }}>
              <Typography fontWeight={600} fontSize={16} mb={2} color="white">Form Information</Typography>

<TextField
  fullWidth
  required
  label="Form Name"
  placeholder="Enter Name"
  variant="outlined"
  size="small"
  sx={{
    mb: 2,
    input: { color: 'white' },               // input text
    label: { color: 'white' },               // label text
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },           // border color
      '&:hover fieldset': { borderColor: '#90caf9' },   // on hover
      '&.Mui-focused fieldset': { borderColor: 'white' } // on focus
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white'  // focused label
    },
  }}
/>

<TextField
  fullWidth
  required
  label="Description"
  placeholder="Write Description"
  variant="outlined"
  size="small"
  sx={{
    mb: 2,
    input: { color: 'white' },
    label: { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: '#90caf9' },
      '&.Mui-focused fieldset': { borderColor: 'white' }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white'
    },
  }}
/>

<TextField
  fullWidth
  required
  label="Serial No"
  placeholder="Enter Serial No."
  variant="outlined"
  size="small"
  sx={{
    mb: 2,
    input: { color: 'white' },
    label: { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: '#90caf9' },
      '&.Mui-focused fieldset': { borderColor: 'white' }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white'
    },
  }}
/>


<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
  <FormControl fullWidth size="small" required
    sx={{
      '& label': { color: 'white' },
      '& .MuiOutlinedInput-root': {
        color: 'white', // selected value text
        '& fieldset': { borderColor: 'white' },
        '&:hover fieldset': { borderColor: '#90caf9' },
        '&.Mui-focused fieldset': { borderColor: 'white' },
      },
      '& svg': { color: 'white' } // dropdown arrow
    }}
  >
    <InputLabel id="form-category-label">Form Category</InputLabel>
    <Select
      labelId="form-category-label"
      defaultValue=""
      label="Form Category"
    >
      <MenuItem value="" disabled>Select</MenuItem>
      <MenuItem value="General">General</MenuItem>
      <MenuItem value="HR">HR</MenuItem>
    </Select>
  </FormControl>

  {/* <Typography color="#2196f3" sx={{ cursor: 'pointer', fontSize: 14 }}>
    Edit Category
  </Typography> */}
</Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cfd8dc',
                borderRadius: 1,
                p: 1.5,
                mb: 2
              }}>
                <AttachmentIcon sx={{ mr: 1 }} />
                <Typography fontSize={14}>Add Attachment</Typography>
                <Typography sx={{ ml: 'auto' }} fontSize={12} color="gray">
                  Only docx, odt, pdf, xls, xlsx, doc, txt, ppt, pptx is accepted.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Image */}
          <Box sx={{ flex: 1.3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGDRy-Vk0kfrR-E6jJVYZmJF_QARMHljjx3A&s"
              alt="form-img"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
        </Box>

        {/* Footer Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="text" color="primary" onClick={() => {navigate('/company')}}>Cancel</Button>
          <Button variant="contained" color="primary">Submit</Button>
        </Box>
      </Box>
      </Box>
    </Box>
     </Box>
  );
};

export default Form;

import React, { useState } from 'react';
import {
  Box, TextField, Typography, Select, MenuItem,
  Button, Checkbox, FormControlLabel, Divider, InputLabel, IconButton, Breadcrumbs, Link
} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import GroupIcon from '@mui/icons-material/Group';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.js';

const PolicyForm = () => {
  const navigate = useNavigate();   
  const [payrollMonth, setPayrollMonth] = useState("Jul'25");
  const [employeeType, setEmployeeType] = useState("No Options");

  return (
    <Box>
      <Navbar/>
    <Box sx={{width:'80%',margin:'0 auto',mt:'65px' }}>
      {/* Breadcrumbs */}
        <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' }}}>
          <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
          <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
          <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/company">Company Policies & Forms</Link>
          {/* <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Company Policies & Forms</span> */}
        </Breadcrumbs>

        {/* Filters */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
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
       <Box sx={{
        border: '1px solid #cfd8dc',
        borderRadius: 2,
        p: 1,
        bgcolor: 'transparent',
        width:{md:'75%'},

      }}>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{color:'white'}}>
        Create Company Policy
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left Section */}
        <Box sx={{ flex: 2, border: '1px solid gray', borderRadius: 1, p: 1, bgcolor: 'rgba(41, 38, 38, 0.49)' }}>
          <Typography fontWeight={600} fontSize={16} mb={1} color="white">Policy Information</Typography>

<TextField
  fullWidth
  required
  label="Policy Name"
  variant="outlined"
  size="small"
  sx={{
    mb: 1,
    input: { color: 'white' },
    label: { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: '#90caf9' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
  }}
/>

<TextField
  fullWidth
  required
  label="Description"
  variant="outlined"
  size="small"
  sx={{
    mb: 1,
    input: { color: 'white' },
    label: { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: '#90caf9' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
  }}
/>

<TextField
  fullWidth
  required
  label="Serial No"
  variant="outlined"
  size="small"
  sx={{
    mb: 1,
    input: { color: 'white' },
    label: { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: '#90caf9' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
  }}
/>

<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
  <FormControl
    fullWidth
    size="small"
    required
    sx={{
      '& label': { color: 'white' }, // label color
      '& .MuiOutlinedInput-root': {
        color: 'white', // selected value
        '& fieldset': { borderColor: 'white' },
        '&:hover fieldset': { borderColor: '#90caf9' },
        '&.Mui-focused fieldset': { borderColor: 'white' },
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: 'white', // focused label color
      },
      '& svg': { color: 'white' }, // dropdown arrow icon
    }}
  >
    <InputLabel id="policy-category-label">Company Policy Category</InputLabel>
    <Select
      fullWidth
      required
      labelId="policy-category-label"
      defaultValue=""
      label="Company Policy Category"
    >
      <MenuItem value="" disabled>Select</MenuItem>
      <MenuItem value="General">General</MenuItem>
      <MenuItem value="PH Form">PH Form</MenuItem>
      <MenuItem value="HR">HR</MenuItem>
    </Select>
  </FormControl>
   {/* <Typography color="#2196f3" sx={{ cursor: 'pointer', fontSize: 14 }}>Edit Category</Typography> */}
</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #cfd8dc', borderRadius: 1, p: 1.5, mb: 1 }}>
            <AttachmentIcon sx={{ mr: 1, color: 'white' }} />
            <Typography fontSize={14} sx={{ color: 'white' }}>Add Attachment</Typography>
            <Typography sx={{ ml: 'auto' }} fontSize={12} color="gray">Only pdf is accepted.</Typography>
          </Box>

          <Divider sx={{ mb: 1,color:"gray" }} />

          <FormControlLabel
            control={<Checkbox sx={{color: 'white', 
            '&.Mui-checked': {
             color: 'white', 
            },
            }}/>}
            label="Release to employee self service portal"
            sx={{ mb: 1, color:"white" }}
          />

          <InputLabel sx={{ color: 'white' }}>Employee Filter</InputLabel>
          <Select fullWidth disabled size="small" defaultValue=""
            sx={{
    color: 'white', // selected text
    '& .MuiSelect-icon': { color: 'white' }, // dropdown arrow
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // border when disabled
    },
    '&.Mui-disabled': {
      color: 'white', // text when disabled
    },
  }}
          >
            <MenuItem value="">Select</MenuItem>
          </Select>

          <Typography mt={1} fontSize={12} color="gray">
            Note: Enforcing the policy ensures that employees read and acknowledge the policy before using ESS.
          </Typography>
          <Typography fontWeight={600} fontSize={14} color="gray" mt={0.5}>
            Enforce this policy
          </Typography>
        </Box>

        {/* Right Side Instruction Box */}
        <Box sx={{ flex: 1.5, bgcolor: 'rgba(41, 38, 38, 0.58)', borderRadius: 1, p: 1,color:"gray",display: { xs: 'none', sm: 'block' }  }}>
          <Typography fontWeight={600} fontSize={14} mb={1}>What is company policy?</Typography>
          <Typography fontSize={13} mb={1}>
            - Policies help and allow you to outline the benefits and opportunities your company provides to its workers.
          </Typography>
          <Typography fontSize={13} mb={1}>
            - Company policy is a guideline/rules/regulations to help employers dealing with employee accountability, health, safety, and interactions with customers.
          </Typography>
          <Typography fontSize={13} mb={1}>
            - You can create policy documents like Employee Handbook, Leave Policy, IT Policy, depending on the nature of your workplace.
          </Typography>
          <Typography fontSize={13} mb={1}>
            - Create various HR Policy documents by filling the policy information and release to your employees using Employee Filter.
          </Typography>
          <Typography fontSize={13}>
            Note: You must cancel an enforced policy to enable the Release to employee self service portal option.
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        <Button variant="text" color="primary" onClick={() => {navigate('/company')}}>Cancel</Button>
        <Button variant="contained" color="primary">Submit</Button>
      </Box>
    </Box>
    </Box>    
    </Box>
     </Box>
  );
};

export default PolicyForm;

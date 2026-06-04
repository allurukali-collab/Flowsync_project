import React, { useState } from "react";
import {Box,Tabs,Tab,TextField,Typography,Button,MenuItem,Select,InputLabel,FormControl,Grid,IconButton,Breadcrumbs,Link,} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link as RouterLink } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.js';

const Compose = () => {
  const navigate = useNavigate();    
  const [payrollMonth, setPayrollMonth] = useState(dayjs());
  const [employeeType, setEmployeeType] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [category, setCategory] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("All Employees");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("Hi [EMP_NAME_AND_NUMBER],");

  return (
    <Box>
      <Navbar/>
    <Box sx={{width:'80%',margin:'0 auto',mt:'65px'}}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' } }}>
        <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
        <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
        <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/masscom">Mass Communication</Link>
      </Breadcrumbs>

      {/* Filters */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 1 }}>
          {/* Payroll Month */}
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

          {/* Employee Type */}
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

      {/* Compose Section */}
      <Box p={1} sx={{ backgroundColor: 'rgba(46, 43, 43, 0.76)', maxWidth: '1000px',mx: 'auto',borderRadius: 2,boxShadow: 3,border:'1px solid gray' }}>
        {/* Dropdowns */}
        <Grid container spacing={2} alignItems="center" mb={1}>
          <Box>
            <InputLabel sx={{ color: 'white' }}>Category</InputLabel>
            <Select
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              size="small"
                  sx={{
      color: 'white',
      bgcolor: 'transparent',
      border: '1px solid white',
      borderRadius: 1,
      '.MuiSelect-icon': { color: 'white' },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          bgcolor: 'black',
          color: 'white',
        },
      },
    }}
            >
              <MenuItem value="">----Select----</MenuItem>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="H&R Campaign">H&R Campaign</MenuItem>
              <MenuItem value="Notification">Notification</MenuItem>
            </Select>

            <Box mt={1}>
              <InputLabel sx={{color:'white'}}>Employee Filter</InputLabel>
              <FormControl size="small">
                <Select
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                      sx={{
      color: 'white',
      bgcolor: 'transparent',
      border: '1px solid white',
      borderRadius: 1,
      '.MuiSelect-icon': { color: 'white' },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          bgcolor: 'black',
          color: 'white',
        },
      },
    }}
                >
                  <MenuItem value="All Employees">All Employees</MenuItem>
                  <MenuItem value="above 5 years">Above 5 years</MenuItem>
                  <MenuItem value="all current employees">All Current Employees</MenuItem>
                  <MenuItem value="all past employees">All Past Employees</MenuItem>
                  <MenuItem value="bangalore employees">Bangalore Employees</MenuItem>
                </Select>
              </FormControl>
              {/* <IconButton color="primary" sx={{ ml: 1 }}>
                <AddIcon />
              </IconButton> */}
            </Box>
          </Box>
        </Grid>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)}>
          <Tab label="Mail" />
          <Tab label="SMS" />
        </Tabs>

        {/* Mail tab content */}
        {tabValue === 0 && (
          <>
            <TextField
              label="Subject"
              variant="outlined"
              size="small"
              margin="normal"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
                sx={{
    '& .MuiOutlinedInput-root': {
      color: 'white',
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
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
  }}
            />

            <TextField
              fullWidth
              multiline
              rows={5}
              label="Content"
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
                sx={{
    '& .MuiOutlinedInput-root': {
      color: 'white',
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
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
  }}
            />
            <Typography variant="caption" color="error"  display="block">
              Note: Please do not change the [EMP_NAME_AND_NUMBER] tag. This tag will be replaced with the employee name and number while sending the mail.
            </Typography>

            <Box mt={1}>
              <InputLabel sx={{color:'white'}}>Attachments</InputLabel>
              <Button variant="outlined" component="label">
                Upload File
                <input type="file" hidden />
              </Button>
              <Typography variant="caption" color="gray" display="block">
                Only PDF, XLS, XLSX, DOC, DOCX, TXT, PPT, PPTX, GIF, JPG, PNG files are accepted.
              </Typography>
            </Box>
          </>
        )}

        {/* SMS tab content */}
        {tabValue === 1 && (
            <>
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Message"
            variant="outlined"
            placeholder="90 characters only..."
            sx={{ mt: 2 ,
    '& .MuiOutlinedInput-root': {
      color: 'white',
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
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
  }}

          />
            <Typography variant="caption" color="error" mt={1} display="block">
              Note: Maximum of 5 SMS per category can be sent, as it is a trial account.<br></br>
              Please note, your message will appear as, "Dear Employee, (SMS Body)- greytHR" after you send it.
            </Typography>
          
          </>
        )}

        {/* Buttons */}
        <Box mt={2} display="flex" gap={1}>
          <Button variant="contained" color="primary">
            Send
          </Button>
          <Button variant="outlined" onClick={()=> navigate('/masscom')}>Close</Button>
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default Compose;

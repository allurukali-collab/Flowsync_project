import React, { useState } from 'react';
import {Modal,Paper,Checkbox,Table,TableHead,TableRow,TableCell,TableBody,Box,Grid,Typography,TextField,Button,Select,MenuItem,InputLabel,FormControl,IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Breadcrumbs, Link } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import GroupIcon from '@mui/icons-material/Group';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from './Navbar.js';

const AddEmp = () => {
  const navigate = useNavigate();
  const [payrollMonth, setPayrollMonth] = useState(dayjs());
  const [employeeType, setEmployeeType] = useState('');
  const [locationRows, setLocationRows] = React.useState([
    { name: 'Bangalore', active: true },
    { name: 'Bellary', active: true },
    { name: 'Bidar', active: true },
    { name: 'Calicut', active: true },
    { name: 'Chennai', active: true },
    { name: 'Cochin', active: true },
    { name: 'Davangere', active: true },
  ]);

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState('');

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const activeLocations = locationRows.filter((loc) => loc.active);
const [recentlyAddedEmp, setRecentlyAddedEmp] = React.useState(null);
const [snackbarOpen, setSnackbarOpen] = React.useState(false);

// Handle Save button click
const handleSave = () => {
  const name = document.querySelector('input[placeholder="Enter Name"]').value;
  const number = document.querySelector('input[placeholder="Enter Number"]').value;
  const doj = document.querySelector('input[type="date"]').value;
  const email = document.querySelector('input[placeholder="Enter Email"]').value;
  const location = selectedLocation;

  if (!name || !number || !doj || !email || !location) {
    alert("Please fill all required fields");
    return;
  }

  const generateId = () => "T" + Math.floor(1000 + Math.random() * 9000);  
  const newEmployee = {
    id: generateId(),
    name,
    number,
    doj,
    email,
    location
  };

  // Get existing employees
  const existingEmployees = JSON.parse(localStorage.getItem("employees")) || [];

  // Add new employee
  existingEmployees.push(newEmployee);

  // Save updated list to localStorage
  localStorage.setItem("employees", JSON.stringify(existingEmployees));

  // Optionally show snackbar
  setSnackbarOpen(true);
  setRecentlyAddedEmp({ name });

  // Redirect to Analytics after short delay
  setTimeout(() => {
    navigate("/analytics");
  }, 1000); // 1 second delay to show snackbar
};

const handleSnackbarClose = () => {
  setSnackbarOpen(false);
};
  

  return (
    <Box>
      <Navbar/>
    <Box sx={{ width:'80%',margin:'0 auto',mt:'70px'  }}>
            {/* Breadcrumbs */}
              <Breadcrumbs separator=">" sx={{'& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' }, mb: 1 }}>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
                <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/addemp">Add Employee</Link>
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
      {/* Bulk Upload Section */}
      <Box
        sx={{
          width: '70%', 
          maxWidth: '900px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          p: 3,
          mb: 2,
          boxShadow: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '0 auto',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}color="white">
            Quickly add employee to the company!
          </Typography>
          <Typography sx={{ mt: 1, color: '#5783b8ff' }}>
            Add an employee by filling the form or add bunch of employee by clicking bulk upload.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, textTransform: 'none', backgroundColor: '#3f51b5' }}
            onClick={()=> {navigate('/importexcel')}}
          >
            Add Bulk Upload
          </Button>
        </Box>
        <Box
          component="img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOlHn_2z4WPjfsmVFKdiA_ppzvtgfbuS8Cg&s"
          alt="illustration"
          sx={{ maxWidth: 200 }}
        />
      </Box>

      {/* Employee Detail Form */}
      <Box
        sx={{
          width: '70%', 
          maxWidth: '900px', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          p: 3,
          boxShadow: 1,
          mt: 2,
          margin: '10px auto',
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{color:'white'}}>
          Add details of an employee
        </Typography>

        <Grid container spacing={3}>
          {/* Row 1 */}
          <Grid item xs={12} md={4}>
            <Typography fontSize={14} fontWeight={500} mb={1}sx={{color:'rgba(255,255,255,0.6)'}}>
              Employee Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField fullWidth placeholder="Enter Name" size="small" variant="outlined" sx={{input: {color:'white'}, '& .MuiOutlinedInput-root':{'& fieldset': {borderColor: 'white',}, '&:hover fieldset': {borderColor: 'white', },'&.Mui-focused fieldset': {borderColor: 'white',},},'& .MuiInputBase-input::placeholder': {color: 'white',opacity: 0.3,},}}/>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography fontSize={14} fontWeight={500} mb={1} sx={{color:'rgba(255,255,255,0.6)'}}>
              Employee Number <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField fullWidth placeholder="Enter Number" size="small" variant="outlined" sx={{input: {color:'white'}, '& .MuiOutlinedInput-root':{'& fieldset': {borderColor: 'white',}, '&:hover fieldset': {borderColor: 'white', },'&.Mui-focused fieldset': {borderColor: 'white',},},'& .MuiInputBase-input::placeholder': {color: 'white',opacity: 0.3,},}}/>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography fontSize={14} fontWeight={500} mb={1} sx={{color:'rgba(255,255,255,0.6)'}}>
              Date Of Joining <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                type="date"
                size="small"
                placeholder="Enter Date"
                InputLabelProps={{ shrink: true }}
                variant="outlined" sx={{input: {color:'white'}, '& .MuiOutlinedInput-root':{'& fieldset': {borderColor: 'white',}, '&:hover fieldset': {borderColor: 'white', },'&.Mui-focused fieldset': {borderColor: 'white',},},'& .MuiInputBase-input::placeholder': {color: 'white',opacity: 0.3,},'& input[type="date"]::-webkit-calendar-picker-indicator': {filter: 'invert(1)',},}}
              />
            </Box>
          </Grid>

          {/* Row 2 */}
          <Grid item xs={12} md={4}>
            <Typography fontSize={14} fontWeight={500} mb={1} sx={{color:'rgba(255,255,255,0.6)'}}>
              Location
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: { xs: '150px', md: '220px' },
              }}
            >
              <FormControl fullWidth size="small" sx={{ width: { md: '200px' },'& .MuiOutlinedInput-root': {'& fieldset': { borderColor: 'white' },'&:hover fieldset': { borderColor: 'white' },'&.Mui-focused fieldset': { borderColor: 'white' },}, }}>
                <Select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Select' }}
                     sx={{
                       color: 'white', // selected value
                       '& .MuiSelect-icon': {
                       color: 'white', // dropdown arrow
                       },
                   }}                  
                >
                  <MenuItem value="" disabled>Select</MenuItem>
                  {activeLocations.map((loc, index) => (
                    <MenuItem key={index} value={loc.name}>
                      {loc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                size="small"
                sx={{
                  color: '#3f51b5',
                  p: 1,
                }}
                onClick={handleOpen}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography fontSize={14} fontWeight={500} mb={1} sx={{color:'rgba(255,255,255,0.6)'}}>
              Email Id <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter Email"
              type="email"
              size="small"
              variant="outlined" sx={{input: {color:'white'}, '& .MuiOutlinedInput-root':{'& fieldset': {borderColor: 'white',}, '&:hover fieldset': {borderColor: 'white', },'&.Mui-focused fieldset': {borderColor: 'white',},},'& .MuiInputBase-input::placeholder': {color: 'white',opacity: 0.3,},}}
            />
          </Grid>
        </Grid>

        {/* Description below */}
        <Typography sx={{ mt: 3, color: '#90a4ae', fontSize: 14 }}>
          After saving, the onboarding process will start and employee will receive a Welcome Email with the link to set his password.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#3f51b5',
              color: '#3f51b5',
              mr: 2,
              borderRadius: 2,
              px: 3,
            }}
            onClick={()=>{navigate('/analytics')}}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#3f51b5',
              borderRadius: 2,
              px: 4,
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Modal for editing locations */}
      <Modal open={openModal} onClose={handleClose}>
        <Paper
          sx={{
            width: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
            p: 2,
            borderRadius: 2,
            m: 'auto',
            mt: 5,
            outline: 'none',
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={2}>
            Location
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Active</b></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locationRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      variant="standard"
                      fullWidth
                      value={row.name}
                      onChange={(e) => {
                        const newRows = [...locationRows];
                        newRows[index].name = e.target.value;
                        setLocationRows(newRows);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.active}
                      onChange={() => {
                        const newRows = [...locationRows];
                        newRows[index].active = !newRows[index].active;
                        setLocationRows(newRows);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newRows = locationRows.filter((_, i) => i !== index);
                        setLocationRows(newRows);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography
            variant="body2"
            sx={{ mt: 1, color: '#3f51b5', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => setLocationRows([...locationRows, { name: '', active: true }])}
          >
            + Add Row
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#3f51b5', textTransform: 'none' }}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Modal>
      {/* Snackbar */}
<Snackbar
  open={snackbarOpen}
  autoHideDuration={4000} // ← hides after 4 seconds
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    severity="success"
    onClose={handleSnackbarClose}
    sx={{ width: '100%' }}
    action={
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    Employee added successfully!
  </Alert>
</Snackbar>

{/* Recently Added & Related Actions Section */}
{recentlyAddedEmp && (
  <Box sx={{ mt: 3 }}>
    <Grid container spacing={3}>
      {/* Recently Added Card */}
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
            height:{sx:'100%',md: '50%'},
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom color="white">
            Recently Added
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#3f51b5',
              }}
            >
              {recentlyAddedEmp.name.charAt(0).toUpperCase()}
            </Box>
            <Box
              sx={{
                backgroundColor: '#e3f2fd',
                px: 2,
                py: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Typography fontSize={14}>
                Click here to see all employees
              </Typography>
              <Typography fontWeight="bold" fontSize={18}>→</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Related Actions */}
      <Grid item xs={12} md={8}>
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
            color:"white"
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom color="white">
            Related Actions
          </Typography>
          <Typography sx={{ mb: 1 }}>
            You can go ahead and complete the profile for the employees{' '}
            <span style={{ color: '#2196f3', cursor: 'pointer' }} onClick={() => navigate('/updateemp')}>here</span>
          </Typography>
          <Typography sx={{ mb: 1 }}>
            After adding the employees you can update the salary{' '}
            <span style={{ color: '#2196f3', cursor: 'pointer' }}>here</span>
          </Typography>
          <Typography>
            Generate different letters for employees by clicking{' '}
            <span style={{ color: '#2196f3', cursor: 'pointer' }}>here</span>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Box>
)}
    </Box>
    </Box>
  );
};

export default AddEmp;

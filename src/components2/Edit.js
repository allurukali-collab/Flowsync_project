import React, { useState } from "react";
import { Box,Button,Breadcrumbs, Link,Grid,Checkbox,MenuItem, InputAdornment,Select,Step,StepLabel,Stepper,TextField,Typography,Card,CardContent,Divider,IconButton,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link as RouterLink } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import dayjs from 'dayjs';
import { useLocation } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.js';

const steps = ["General", "Select Employees", "Preview", "Publish/Download"];

const Edit = () => {
  const navigate = useNavigate();
  const [payrollMonth, setPayrollMonth] = useState("Jul'25");
  const [employeeType, setEmployeeType] = useState("No Options");  
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState([]); 
    const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredEmployees.map((emp) => emp.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  

  const location = useLocation();
  const rowData = location.state?.rowData || {};

const originalEmployees = [
  {
    id: rowData.empId || "T0046",
    empNo: rowData.empId || "T0046",
    name: rowData.employee || "N/A",
  },
];

const filteredEmployees = originalEmployees.filter((emp) =>
  emp.empNo.toLowerCase().includes(searchText.toLowerCase()) ||
  emp.name.toLowerCase().includes(searchText.toLowerCase())
);


  const [activeStep, setActiveStep] = useState(0);
  const [template, setTemplate] = useState(rowData.template || "");
  const [signatory, setSignatory] = useState("Daisy M (CEO)");
  const [remarks, setRemarks] = useState("");

  const employeeName = rowData.employee || "N/A";
  const employeeId = rowData.empId || "#T0046";
  const initials = employeeName
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase();

  const address = rowData.address || `Aadesh Hiralal Sonar\nHouse No. 18, Palm Grove Residency\nJP Nagar 7th Phase\nBengaluru\nKarnataka\nIndia\n560078`;
  const joiningDate = rowData.joiningDate || "26 May 2020";
  const designation = rowData.designation || "Sales Director";

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  return (
    <Box>
      <Navbar/>
    <Box sx={{ p: 2,width:'80%',margin:'0 auto',mt:'50px' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' } }}>
        <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
        <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Generate Letter</span>
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
      <Box sx={{ mt:2,width:{md:'80%'} }}>
      {/* Stepper */}
      <Box sx={{ width: "100%", mb: 4, }}>
        <Stepper activeStep={activeStep} orientation="horizontal"     sx={{
      '.MuiStepLabel-label': { color: 'white' },
      
      
    }}>
          {steps.map((label, index) => (
            <Step
              key={label}
              active={index <= activeStep}
              onClick={() => handleStepClick(index)}
            >
              <StepLabel >{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container spacing={4} >
        {/* Left Summary */}
        <Grid item xs={12} md={3}>
          <Card variant="outlined"
            sx={{ backgroundColor: 'rgba(60, 53, 53, 0.74)', // make card background transparent
                  boxShadow: 'none',             // remove shadow (optional)
                  color: 'white',                 // set default text color to white
                  border: '1px solid gray',
                  width: '200px'
                }} 
          >
            <CardContent sx={{ color: 'white' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Summary:
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                Letter Template
              </Typography>
              <Typography variant="body1" mb={1}>
                {template}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                Employee
              </Typography>
              <Typography variant="body1" mb={1}>
                {rowData.employee || "N/A"}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                Signatory
              </Typography>
              <Typography variant="body1">{signatory}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Section - Depends on Step */}
       
          {activeStep === 0 && (
            // Step 1: General
            <Box display="flex" flexDirection="column" gap={1} sx={{ width:{xs:'400px',md:'500px'},backgroundColor:'rgba(48, 41, 41, 0.59)',border:'1px solid gray',borderRadius:'3px',p:2}}>
              {/* Letter Template */}
              <Box>
                <Typography variant="body1" fontWeight="500" mb={1}sx={{color: 'white'}}>
                  Letter Template<span style={{ color: "red" }}>*</span>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    p: 1,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {template || "N/A"}
                </Typography>
              </Box>

              {/* Serial No */}
              <Box>
                <Typography variant="body1" fontWeight="500" mb={0.5} sx={{color: 'white'}}>
                  Serial No.
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {rowData.serialNo || "N/A"}
                </Typography>
              </Box>

              {/* Authorised Signatory */}
              <Box>
                <Typography variant="body1" fontWeight="500" mb={1} sx={{color: 'white'}}>
                  Authorised Signatory
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Select
                    value={signatory}
                    onChange={(e) => setSignatory(e.target.value)}
                 sx={{
        color: 'rgba(255,255,255,0.8)',
        border: '1px solid white',
        borderRadius: 1,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '& .MuiSvgIcon-root': {
          color: 'white',
        },
      }}         
                  >
                    <MenuItem value="Daisy M (CEO)">Daisy M (CEO)</MenuItem>
                    <MenuItem value="Lipika Jena (Director)">
                      Lipika Jena (Director)
                    </MenuItem>
                    <MenuItem value="Jow Mathew (Director)">
                      Jow Mathew (Director)
                    </MenuItem>
                  </Select>
                  <IconButton size="small">
                    <EditIcon color="primary" />
                  </IconButton>
                </Box>
              </Box>

              {/* Remarks */}
              <Box>
                <Typography variant="body1" fontWeight="500" mb={1} sx={{color: 'white'}}>
                  Remarks
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Type your description...."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                 sx={{
      input: { color: 'white' },
      textarea: { color: 'white' },
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
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            // Step 2: Select Employees (Styled Card)
            <Box sx={{width: '400px', p:2,backgroundColor:'rgba(48, 41, 41, 0.59)',border:'1px solid gray',borderRadius:'3px'}}>
            <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            p: 2,
            maxWidth: 400,
            backgroundColor: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
            >
            {/* Avatar Circle */}
            <Box
            sx={{
            width: 50,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#66bb6a", // green circle
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 15, 
            }}
            >
           {initials}
           </Box>

           {/* Employee Details */}
           <Box>
           <Typography variant="subtitle1" fontWeight="bold">
           {employeeName}
           </Typography>
           <Typography variant="body2" color="textSecondary">
           {employeeId}
           </Typography>
           </Box>
           </Box>
           </Box>
            )}

            {activeStep === 2 && (
            // Step 3: Preview (Styled Card)
            <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2,width:{md:'75%'},backgroundColor:'rgba(48, 41, 41, 0.59)' }}>
              <Typography variant="body1" fontWeight="bold" >
                Preview Letter
              </Typography>
              <Box sx={{ border: "1px solid #eee", p: 1,borderRadius: 2,}}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box textAlign="right">
                    <Typography fontSize="12px">Date: 19 Jul 2025</Typography>
                    <Typography fontSize="12px">Ref: LETTER00040#</Typography>
                  </Box>
                </Box>

                <Typography variant="h6" align="center" fontWeight="bold" fontSize="12px" gutterBottom>
                  Address Proof Letter
                </Typography>
                <Typography
                  align="center"
                  variant="subtitle2"
                  fontWeight="bold"
                  gutterBottom
                  fontSize="12px"
                >
                  TO WHOMSOEVER IT MAY CONCERN
                </Typography>

                <Typography paragraph fontSize="12px">
                  This is to certify that <b>Mr.. {employeeName}</b> bearing <b>{employeeId}</b> has
                  been employed as <b>{designation}</b> at Greytip Software Pvt Ltd with effect
                  from <b>{joiningDate}</b>.
                </Typography>

                <Typography paragraph fontSize="12px">
                  As per our organizational records, the residential address is as follows:
                </Typography>

                <Box
                  component="pre"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.5)",
                    border: "1px solid #ccc",
                    p: 1,
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    fontSize:"12px"
                  }}
                >
                  {address}
                </Box>

                <Typography paragraph  fontSize="12px">
                  This letter has been issued upon request from {employeeName}. The organization shall
                  not be liable for verification of accuracy of the record under any circumstances.
                </Typography>

                <Box >
                  <Typography fontWeight="bold" fontSize="12px">For Greytip Software Pvt Ltd</Typography>

                  <Box >
                    <Typography fontSize="12px">{signatory.split(" (")[0]}</Typography>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
                      alt="Signature"
                      height="30"
                    />
                    <Typography fontSize="12px">{signatory.split(" (")[1]?.replace(")", "")}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
             
             {activeStep === 3 && (
        <Box sx={{width: '600px', p:2 ,backgroundColor:'rgba(48, 41, 41, 0.59)',border:'1px solid gray',borderRadius:'3px'}}>
          <Typography variant="h6" gutterBottom sx={{color:'white'}}>
            Generate Letter Summary
          </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          {/* Search Input */}
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={handleSearchChange}
            sx={{
              mt: 2,
              mb: 2,
              width: 300,
              backgroundColor: "#fafafa",
              borderRadius: 2,
            }}
            InputProps={{
              endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            }}
          />

            {/* Conditional Buttons */}
             {selected.length > 0 && (
             <Box display="flex" gap={2}>
             <Button variant="outlined" color="primary">
              Publish All
             </Button>
             <Button variant="contained" color="primary">
              Download All
             </Button>
             </Box>
            )}
          </Box>

          {/* Table */}
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selected.length === filteredEmployees.length &&
                        filteredEmployees.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Employee Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Employee Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow hover key={emp.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(emp.id)}
                        onChange={() => handleSelectOne(emp.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography color="primary" sx={{ cursor: "pointer" }}>
                        {emp.empNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="primary" sx={{ cursor: "pointer" }}>
                        {emp.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No matching employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
             

        </Grid>
      

      {/* Bottom Buttons */}
      <Divider sx={{ my: 1 }} />
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button variant="text" color="primary" onClick={()=>navigate('/letter')}>
          Cancel
        </Button>
        {activeStep > 0 && (
    <Button
      variant="contained"
      color="primary"
      onClick={() => setActiveStep(activeStep - 1)}
    >
      Previous
    </Button>
  )}

  {activeStep === steps.length - 1 ? (
    <Button
      variant="contained"
      color="success"
      onClick={() => {
        const updatedRow = {
          ...rowData,
          remarks,
        };
        navigate('/letter', { state: { updatedRow } });
      }}
    >
      Finish
    </Button>
  ) : (
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
  )}
      </Box>
    </Box>
    </Box>
    </Box>
    </Box> 
  );
};


export default Edit;

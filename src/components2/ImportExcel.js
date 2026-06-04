import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper
} from '@mui/material';
import { Breadcrumbs, Link } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import GroupIcon from '@mui/icons-material/Group';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import Navbar from './Navbar.js';

const steps = [
  'Excel Importer',
  'Excel Importer Mapping',
  'Excel Importer Validate',
  'Summary',
];

const ImportExcel = () => {
  const navigate = useNavigate();
  const [payrollMonth, setPayrollMonth] = useState(dayjs());
  const [employeeType, setEmployeeType] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [importType, setImportType] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setImportType(e.target.value);
    setShowAlert(false);
    setSelectedFile(null);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && /\.(xls|xlsx)$/i.test(file.name)) {
      setSelectedFile(file);
    } else {
      alert('Only .xls or .xlsx files are allowed.');
    }
  };

  return (
    <Box>
      <Navbar/>
    <Box sx={{  width:'80%',margin:'0 auto',mt:'70px' }}>
            {/* Breadcrumbs */}
              <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' }, mb: 1 }}>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
                <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/excelimport">Excel Import</Link>
                {/* <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Company Policies & Forms</span> */}
              </Breadcrumbs>
      
              {/* Filters */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
     <Box mt={2}>         
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel >
              <Typography variant="caption" fontWeight={600}sx={{color:'white'}}>{label.toUpperCase()}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1 UI */}
{activeStep === 0 && (
  <Box mt={1} sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
  }}>
    <Typography variant="h6" gutterBottom fontWeight={'bold'} sx={{color:'white'}}>
      Step 1: Excel Importer
    </Typography>

    <FormControl sx={{ minWidth: 300, '& .MuiOutlinedInput-root': { 
        '& fieldset': {   
        borderColor: 'white',
    },
        '&:hover fieldset': {
         borderColor: 'white',
    },
        '&.Mui-focused fieldset': {
         borderColor: 'white',
    }} }} size="small">
      <InputLabel id="import-type-label"  sx={{
         color: 'white',
        '&.Mui-focused': {
         color: 'white',
        },
       '&.MuiInputLabel-shrink': {
        color: 'white',
      },
    }} >Importer Type</InputLabel>
      <Select
        labelId="import-type-label"
        value={importType}
        label="Importer Type"
        onChange={handleChange}
          sx={{
      color: 'white', // dropdown text color
      '.MuiSvgIcon-root': {
        color: 'white', // arrow color
      },
    }}        
      >
        <MenuItem value="">
          <em>Please Select</em>
        </MenuItem>
        <MenuItem value="permanent">Employee Permanent Address</MenuItem>
        <MenuItem value="contact">Employee Contact Address</MenuItem>
        <MenuItem value="present">Employee Present Address</MenuItem>
        <MenuItem value="muster">Attendance Muster</MenuItem>
        <MenuItem value="exception">Attendance Exception</MenuItem>
        <MenuItem value="swipes">Attendance Swipes</MenuItem>
      </Select>
    </FormControl>

    {showAlert && (
      <Box mt={2}>
        <Alert
          severity="info"
          sx={{ backgroundColor: '#e6f5fd', border: '1px solid #b6e0fe' }}
        >
          Please select importer type from the drop down to upload data from excel sheet.
          You can also search for the importer by typing few characters in the drop down.
        </Alert>
      </Box>
    )}

    {!showAlert && importType && (
      <Paper
        variant="outlined"
        sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.4)', mt: 3, width: '70%' }}
      >
        <Typography fontWeight="bold" mb={1}>
          {importType === 'permanent' && 'Employee Permanent Address'}
          {importType === 'contact' && 'Employee Contact Address'}
          {importType === 'present' && 'Employee Present Address'}
          {importType === 'muster' && 'Attendance Muster'}
          {importType === 'exception' && 'Attendance Exception'}
          {importType === 'swipes' && 'Attendance Swipes'}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>
            Click this link to download a sample Excel File.{' '}
            <span style={{ color: '#03A9F4', cursor: 'pointer' }}>
              Download a sample file.<DownloadIcon />
            </span>
          </Typography>

          <Typography style={{ color: '#03A9F4', cursor: 'pointer' }}>
            Show Field Info <DownloadIcon />
          </Typography>
        </Box>
      </Paper>
    )}

    <Button
      variant="outlined"
      startIcon={<CloudUploadIcon />}
      sx={{ mt: 3 }}
      component="label"
    >
      Upload File
      <input
        type="file"
        hidden
        onChange={handleFileUpload}
        accept=".xls,.xlsx"
      />
    </Button>

    {selectedFile && (
      <Typography mt={1} fontSize={14} color="green">
        Selected File: {selectedFile.name}
      </Typography>
    )}

    <Typography mt={2} fontSize={12} color="gray">
      Note: Only XLS, XLSX files are accepted.
    </Typography>
  </Box>
)}

        {activeStep === 1 && (
  <Box mt={2} sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 1,
            boxShadow: 1,
  }}>
    <Typography variant="h6" gutterBottom fontWeight={'bold'} sx={{color:'white'}}>
      Step 2: Excel Importer Mapping
    </Typography>

    {/* Info Section */}
    <Paper variant="outlined" sx={{ p: 1, backgroundColor: 'rgba(255,255,255,0.4)', mb: 1 }}>
      <Typography variant="body2" color="textSecondary">
        If your Excel file column titles are different from the suggested titles, you need to manually map your columns to the database fields.
      </Typography>
      <Typography variant="body2" color="textSecondary" mt={1}>
        If you did use the suggested format, the columns are automatically mapped to the related field.
      </Typography>
      <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
        <li><strong>Fields From Excel</strong>: indicates the column headings from the Excel file</li>
        <li><strong>Mapped To</strong>: indicates the actual field names</li>
        <li><strong>First Record</strong>: indicates the first data recorded in the Excel file</li>
      </ul>
    </Paper>

    {/* Mapping Table */}
    <Paper variant="outlined" sx={{ overflowX: 'auto', backgroundColor: 'rgba(255,255,255,0.4)'  }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
          <tr>
            <th style={{ padding: 10, borderBottom: '1px solid #ddd', textAlign: 'left' }}>Fields From Excel</th>
            <th style={{ padding: 10, borderBottom: '1px solid #ddd', textAlign: 'left' }}>Mapped To</th>
            <th style={{ padding: 10, borderBottom: '1px solid #ddd', textAlign: 'left' }}>First Record</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>EmployeeNo</td>
            <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              <FormControl size="small" fullWidth>
                <Select defaultValue="Employee No">
                  <MenuItem value="Employee No">Employee No</MenuItem>
                  <MenuItem value="Contact Name">contact Name</MenuItem>
                  <MenuItem value="Permanent Address1">Permanent Address1</MenuItem>
                  <MenuItem value="Permanent Address2">Permanent Address2</MenuItem>
                  <MenuItem value="Permanent Address3">Permanent Address3</MenuItem>
                </Select>
              </FormControl>
            </td>
            <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>0001</td>
          </tr>
          <tr>
            <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>effc date</td>
            <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              <FormControl size="small" fullWidth>
                <Select defaultValue="">
                  <MenuItem value="">-- Select --</MenuItem>
                  <MenuItem value="Employee No">Employee No</MenuItem>
                  <MenuItem value="Contact Name">contact Name</MenuItem>
                  <MenuItem value="Permanent Address1">Permanent Address1</MenuItem>
                  <MenuItem value="Permanent Address2">Permanent Address2</MenuItem>
                  <MenuItem value="Permanent Address3">Permanent Address3</MenuItem>
                </Select>
              </FormControl>
            </td>
            <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>01 Apr 2023</td>
          </tr>
          <tr>
            <td style={{ padding: 8 }}>Annual CTC</td>
            <td style={{ padding: 8 }}>
              <FormControl size="small" fullWidth>
                <Select defaultValue="">
                  <MenuItem value="">-- Select --</MenuItem>
                  <MenuItem value="Employee No">Employee No</MenuItem>
                  <MenuItem value="Contact Name">contact Name</MenuItem>
                  <MenuItem value="Permanent Address1">Permanent Address1</MenuItem>
                  <MenuItem value="Permanent Address2">Permanent Address2</MenuItem>
                  <MenuItem value="Permanent Address3">Permanent Address3</MenuItem>
                </Select>
              </FormControl>
            </td>
            <td style={{ padding: 8 }}>258750.0</td>
          </tr>
        </tbody>
      </table>
    </Paper>
  </Box>
)}
{activeStep === 2 && (
  <Box mt={2} sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
  }}>
    <Typography variant="h6" gutterBottom fontWeight={'bold'} sx={{color:'white'}}>
      Step 3: Excel Importer Validate
    </Typography>
      <Alert
        severity="info"
        sx={{
          backgroundColor: '#E3F2FD',
          borderLeft: '5px solid #2196F3',
          width: '60%',
          py: 1,
          px: 1,
          mb: 8,
          mt: 5
        }}
      >
        <Typography variant="body1" fontWeight={500}>
          No new master found. Please click next to see the import result.
        </Typography>
      </Alert>
    </Box>
)}
{activeStep === 3 && (
  <Box
    mt={1}
    p={1}
    sx={{
      backgroundColor: 'rgba(255,255,255,0.6)',
      borderRadius: 2,
      boxShadow: 3,
      maxWidth: 900,
      margin: '0 auto',
      fontFamily: 'monospace',
      color: 'black'
    }}
  >
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Excel Importer
    </Typography>

    <Typography fontSize={12}>
      Read <strong>38 row(s)</strong> of data from excel file successfully!<br />
      Importing data from the staging table...
    </Typography>

    <Typography fontSize={12} sx={{ color: 'red' }}>
      Employee information of the following employees is not imported since employee no doesn't exist!
    </Typography>

    <Box  component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '10px', color: 'red' }}>
      {[
        '#2 Employee No.: 0001',
        '#3 Employee No.: 0002',
        '#4 Employee No.: 0003',
        '#5 Employee No.: 0004',
        '#6 Employee No.: 0005',
        '#7 Employee No.: 0002',
        '#8 Employee No.: 0003',
        '#9 Employee No.: 0004',
        '#10 Employee No.: 0005',
        '#11 Employee No.: 0008',
        '#12 Employee No.: 0006',
        '#13 Employee No.: 5801',
        '#14 Employee No.: 5802',
        '#15 Employee No.: 5803',
        '#16 Employee No.: 5814',
        '#17 Employee No.: 5828',
        '#18 Employee No.: 5029',
        '#19 Employee No.: 5832',
        '#20 Employee No.: 5836',
        '#21 Employee No.: 5071',
        '#22 Employee No.: 5095',
        '#23 Employee No.: 99',
        '#24 Employee No.: CNT1',
        '#25 Employee No.: CON-001',
        '#26 Employee No.: CON-002',
        '#27 Employee No.: CON-004',
        '#28 Employee No.: CON-005',
        '#29 Employee No.: CON-006',
        '#30 Employee No.: E0001',
        '#31 Employee No.: E0101',
        '#32 Employee No.: T0002',
        '#33 Employee No.: T0003',
      ].join('\n')}
    </Box>

    <Typography fontSize={12}>
      Total time used: <strong>8 secs</strong>
    </Typography>

    <Box   >
      <Button
        variant="outlined"
        sx={{
          borderColor: '#1976d2',
          color: '#1976d2',
          fontWeight: 'bold',
        }}
        onClick={() => navigate('/excelimport')}
      >
        OK
      </Button>
    </Box>
  </Box>
)}    

        {/* Buttons */}
        {activeStep !== 3 && (
        <Box display="flex" gap={2} mt={2}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => setActiveStep(activeStep - 1)}>
            Previous
          </Button>
          <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => setActiveStep(activeStep + 1)}>
            Next
          </Button>
          <Button variant="outlined" color="error" onClick={() => navigate('/excelimport')}>
            Cancel
          </Button>
        </Box>
        )}
        </Box>
      </Box>
         </Box>
  );
};

export default ImportExcel;

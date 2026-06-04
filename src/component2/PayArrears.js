import React, { useState } from 'react';
import Header from './Header';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  Stepper,
  Step,
  Checkbox,
  StepLabel,
  Button,
  TextField,
  Paper,
  Grid,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Table,
  TableHead,
  TableContainer,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';

const steps = ['Arrear Effective From', 'Employees', 'Process and View'];
const DUMMY_EMPS = [
  { id:'T0010', name:'Alice' },
  { id:'T0011', name:'Bob'   },
  { id:'T0012', name:'Carol' },
  // …etc
];
export default function PayArrears() {
  const [activeStep, setActiveStep] = useState(0);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [filterType, setFilterType]       = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterEmployee, setFilterEmployee] = useState('All');

  // Left/right lists + selected‐row state
  const [leftEmps,   setLeftEmps]   = useState(DUMMY_EMPS);
  const [rightEmps,  setRightEmps]  = useState([]);
  const [selLeft,    setSelLeft]    = useState([]);
  const [selRight,   setSelRight]   = useState([]);

  const handleNext = () => setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));
  const handleCancel = () => {
    // navigate back or reset
    // e.g. history.push('/arrears');
  };
   // toggle a row’s checkbox
  const toggleLeft = id =>
    setSelLeft(arr => arr.includes(id) ? arr.filter(x=>x!==id) : [...arr, id]);
  const toggleRight = id =>
    setSelRight(arr => arr.includes(id) ? arr.filter(x=>x!==id) : [...arr, id]);



  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <Box sx={{ p: 2, bgcolor: 'rgba(10,20,40,0.7)' }}>
        <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' } }}>
          <MuiLink component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)' }}>Home</MuiLink>
          <MuiLink component={RouterLink} to="/updatepayroll" sx={{ color: 'rgba(255,255,255,0.7)' }}>Payroll</MuiLink>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Pay Arrears</Typography>
        </Breadcrumbs>
      </Box>

      {/* Stepper */}
      <Paper elevation={0} sx={{ mx: 2, my: 2, p: 3, bgcolor: 'rgba(255, 255, 255, 0.09)', borderRadius: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{
          '& .MuiStepIcon-root': {
            color: 'rgba(255,255,255,0.3)',       // default (inactive) circle
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: 'green',                        // active circle
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: 'white',                        // completed circles
          },
          '& .MuiStepLabel-label': {
            color: 'rgba(255,255,255,0.3)',       // default label
          },
          '& .MuiStepLabel-label.Mui-active': {
            color: 'rgba(229, 229, 229, 0.7)',                        // active label
            fontWeight: '600',
          },
          '& .MuiStepLabel-label.Mui-completed': {
            color: 'grey',                        // completed labels
          },
        }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ mt: 3 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color:'white' }}>Step 1: Arrear Effective From</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography sx={{color:'grey'}}>Payroll Month</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography sx={{ fontWeight: 600,}}>Jul 2025</Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography sx={{color:'grey'}}>Arrear Effective From</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    value={effectiveDate}
                    onChange={e => setEffectiveDate(e.target.value)}
                    sx={{ bgcolor:'rgba(255, 255, 255, 0.29)', borderRadius: 1 }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography sx={{color:'grey'}}>Remarks</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    placeholder='type here'
                    size="small"
                    multiline
                    rows={3}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    sx={{ bgcolor:'rgba(255, 255, 255, 0.29)', borderRadius: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

{activeStep === 1 && (
            <Box sx={{ mt:2 }}>
              <Typography variant="h6" sx={{ color:'white', mb:2 }}>Step 2: Employees</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography sx={{color:'grey'}}>Payroll Month</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography sx={{ fontWeight: 600,}}>Jul 2025</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography sx={{color:'grey'}}>Arrear Effective From</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    value={effectiveDate}
                    onChange={e => setEffectiveDate(e.target.value)}
                    sx={{ bgcolor:'rgba(255, 255, 255, 0.29)', borderRadius: 1 }}
                  />
                </Grid>
              </Grid>
              {/* Filters */}
              <Grid container spacing={2} sx={{ mb:2, mt:2 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color:'rgba(255,255,255,0.7)' }}>Employee Filter</InputLabel>
                    <Select
                      value={filterType}
                      label="Employee Filter"
                      onChange={e=>setFilterType(e.target.value)}
                      sx={{
                        bgcolor:'rgba(255,255,255,0.1)',
                        color:'white',
                        '& .MuiOutlinedInput-notchedOutline':{ borderColor:'rgba(255,255,255,0.3)' }
                      }}
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Current">Current</MenuItem>
                      <MenuItem value="Resigned">Resigned</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color:'rgba(255,255,255,0.7)' }}>Category</InputLabel>
                    <Select
                      value={filterCategory}
                      label="Category"
                      onChange={e=>setFilterCategory(e.target.value)}
                      sx={{
                        bgcolor:'rgba(255,255,255,0.1)',
                        color:'white',
                        '& .MuiOutlinedInput-notchedOutline':{ borderColor:'rgba(255,255,255,0.3)' }
                      }}
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="A">Account</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color:'rgba(255,255,255,0.7)' }}>Employee</InputLabel>
                    <Select
                      value={filterEmployee}
                      label="Employee"
                      onChange={e=>setFilterEmployee(e.target.value)}
                      sx={{
                        bgcolor:'rgba(255,255,255,0.1)',
                        color:'white',
                        '& .MuiOutlinedInput-notchedOutline':{ borderColor:'rgba(255,255,255,0.3)' }
                      }}
                    >
                      <MenuItem value="All">All</MenuItem>
                      {DUMMY_EMPS.map(emp=>(
                        <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
                      
              {/* Dual‑table */}
              <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                {/* LEFT */}
                <TableContainer
                  component={Paper}
                  sx={{ flex:1, maxHeight:300, bgcolor:'rgba(255,255,255,0.05)' }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow sx={{ "& .MuiTableCell-stickyHeader": {
      backgroundColor: "rgba(33, 33, 33, 0.61)",  // your translucent blue
      color: "white",   }}}>
                        <TableCell/>
                        <TableCell sx={{ color:'white' }}>Emp No</TableCell>
                        <TableCell sx={{ color:'white' }}>Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leftEmps.map(emp=>(
                        <TableRow key={emp.id} hover>
                          <TableCell>
                            <Checkbox
                              checked={selLeft.includes(emp.id)}
                              onChange={()=>toggleLeft(emp.id)}
                              sx={{ color:'white' }}
                            />
                          </TableCell>
                          <TableCell sx={{ color:'white' }}>{emp.id}</TableCell>
                          <TableCell sx={{ color:'white' }}>{emp.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* TRANSFER */}
                <Box sx={{ display:'flex', flexDirection:'column', gap:1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={()=>{
                      const moving = leftEmps.filter(e=>selLeft.includes(e.id));
                      setRightEmps(r=>[...r,...moving]);
                      setLeftEmps(l=>l.filter(e=>!selLeft.includes(e.id)));
                      setSelLeft([]);
                    }}
                  >&gt;</Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={()=>{
                      const moving = rightEmps.filter(e=>selRight.includes(e.id));
                      setLeftEmps(l=>[...l,...moving]);
                      setRightEmps(r=>r.filter(e=>!selRight.includes(e.id)));
                      setSelRight([]);
                    }}
                  >&lt;</Button>
                </Box>

                {/* RIGHT */}
                <TableContainer
                  component={Paper}
                  sx={{ flex:1, maxHeight:300, bgcolor:'rgba(255,255,255,0.05)' }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow sx={{ "& .MuiTableCell-stickyHeader": {
      backgroundColor: "rgba(33, 33, 33, 0.63)",  // your translucent blue
      color: "white",   }}}>
                        <TableCell/>
                        <TableCell sx={{ color:'white' }}>Emp No</TableCell>
                        <TableCell sx={{ color:'white' }}>Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rightEmps.map(emp=>(
                        <TableRow key={emp.id} hover>
                          <TableCell>
                            <Checkbox
                              checked={selRight.includes(emp.id)}
                              onChange={()=>toggleRight(emp.id)}
                              sx={{ color:'white' }}
                            />
                          </TableCell>
                          <TableCell sx={{ color:'white' }}>{emp.id}</TableCell>
                          <TableCell sx={{ color:'white' }}>{emp.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Typography>/* TODO: Process and View */</Typography>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button sx={{
      color: 'rgba(255,255,255,0.7)',                // default
      '&.Mui-disabled': {
        color: 'rgba(255,255,255,0.3)',              // disabled state
      },
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',    // hover background
        color: '#fff',                               // hover text
      },
    }}onClick={handleBack} disabled={activeStep === 0}>
              Previous
            </Button>

            <Box>
              <Button onClick={handleCancel} sx={{ mr: 1, fontWeight:'bold', color:'white' }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleNext}>
                {activeStep < steps.length - 1 ? 'Next →' : 'Finish'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
}

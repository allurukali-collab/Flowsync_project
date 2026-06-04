// LoanInput.js
import React, { useState, useMemo } from 'react';
import Header from './Header';
import { Link as RouterLink } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import {
  Box,
  Breadcrumbs,
  Typography,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Autocomplete,
  Paper,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Mock employee data
const EMPLOYEES = [
  { id: 'T0018', name: 'Palak', joinDate: '10 May 2013', leavingDate: '25 Jun 2025' },
  { id: 'T0022', name: 'Pranali', joinDate: '03 Mar 2020', leavingDate: '-' },
  { id: 'T0023', name: 'Om', joinDate: '03 Mar 2019', leavingDate: '-' },
  { id: 'T0024', name: 'Ravi', joinDate: '15 Jul 2021', leavingDate: '-' },
  { id: 'T0025', name: 'Priya', joinDate: '22 Sep 2018', leavingDate: '-' },
];

export default function LoanInput() {
  const [activeTab, setActiveTab] = useState('General');
  const [employeeType, setEmployeeType] = useState('All');
  const [employee, setEmployee] = useState(null);

  // filter by type
  const filteredEmployees = useMemo(() => {
    return EMPLOYEES.filter(emp => {
      if (employeeType === 'All') return true;
      if (employeeType === 'Current') return emp.leavingDate === '-';
      return emp.leavingDate !== '-';
    });
  }, [employeeType]);

  return (
    <>
      <Header onMenuItemClick={setActiveTab} />

      {/* Breadcrumbs */}
      <Box sx={{ p:2, bgcolor:'rgba(10,20,40,0.7)' }}>
        <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator':{color:'rgba(255,255,255,0.5)'} }}>
          <MuiLink component={RouterLink} to="/" underline="hover" sx={{ color:'rgba(255,255,255,0.7)' }}>Home</MuiLink>
          <MuiLink component={RouterLink} to="/updatepayroll" underline="hover" sx={{ color:'rgba(255,255,255,0.7)' }}>Payroll</MuiLink>
          <Typography sx={{ color:'rgba(255,255,255,0.5)' }}>Loan</Typography>
        </Breadcrumbs>
      </Box>

      {/* Selection Panel */}
      <Box sx={{
        mx:2, mt:2, p:2,
        bgcolor:'rgba(255,255,255,0.05)',
        backdropFilter:'blur(6px)',
        borderRadius:2
      }}>
         <Typography
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 600,
                          color: "white",
                          mb: 3,
                        }}
                      >
                        Start searching to see specific employee details here:
                      </Typography>
        <Box sx={{ display:'flex', gap:2, alignItems:'center', flexWrap:'wrap' }}>
          <FormControl size="small" sx={{ minWidth:140 }}>
            <InputLabel sx={{ color:'rgba(255,255,255,0.7)' }}>Employee Type</InputLabel>
            <Select
              value={employeeType}
              label="Employee Type"
              onChange={e=>setEmployeeType(e.target.value)}
              sx={{
                
                color:'common.white',
                '.MuiOutlinedInput-notchedOutline': { borderColor:'rgba(255,255,255,0.5)' }
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Current">Current</MenuItem>
              <MenuItem value="Resigned">Resigned</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            size="small"
            options={filteredEmployees}
            getOptionLabel={o=>`${o.name} — #${o.id}`}
             onChange={(e,val)=>setEmployee(val)}
            sx={{ width:300,
                "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                    },
             }}
            renderInput={params=>(
              <TextField
                {...params}
                placeholder="Search by Emp No/Name"
                InputProps={{
                  ...params.InputProps,
                  startAdornment:<InputAdornment position="start"><SearchIcon sx={{color:'rgba(255,255,255,0.5)'}}/></InputAdornment>
                }}
                sx={{
                  '.MuiOutlinedInput-root':{
                    color:'common.white',
                    '.MuiOutlinedInput-notchedOutline':{borderColor:'rgba(255,255,255,0.5)'}
                  }
                }}
              />
            )}
            PaperComponent={props=>(
              <Paper {...props} sx={{bgcolor: "rgba(30, 41, 58, 0.7)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(71, 85, 105, 0.3)",
                        "& .MuiAutocomplete-option": {
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(71, 85, 105, 0.3)",
                          },
                          "&[aria-selected='true']": {
                            bgcolor: "rgba(59, 130, 246, 0.3)",
                          },
                        },
                    }}/>
            )}
          />

          {employee && (
            <Box sx={{ml:2, display:'flex',gap:2}}>
              <Box sx={{p:1, bgcolor:'rgba(255,255,255,0.1)',borderRadius:1}}>
                <Typography variant="caption" sx={{color:'rgba(255,255,255,0.7)'}}>Leaving Date</Typography>
                <Typography sx={{color:'common.white'}}>{employee.leavingDate}</Typography>
              </Box>
              <Box sx={{p:1, bgcolor:'rgba(255,255,255,0.1)',borderRadius:1}}>
                <Typography variant="caption" sx={{color:'rgba(255,255,255,0.7)'}}>Join Date</Typography>
                <Typography sx={{color:'common.white'}}>{employee.joinDate}</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

       {/* Tab panel */}
      <Box sx={{ mx:6, mt: 2, bgcolor:'rgba(49, 49, 58, 0.65)', borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          textColor="inherit"
          indicatorColor="primary"
          sx={{ px: 2, '& .MuiTab-root':{
             color: 'rgba(255, 255, 255, 0.56)',
          }, '& .Mui-selected': {
            color:'#fff',
          }
        }}
        >
          <Tab label="General" value="General" />
          <Tab label="Loan Details" value="Loan Details" />
          <Tab label="Loan Repayments" value="Loan Repayments" />
          <Tab label="Loan Revision" value="Loan Revision" />
        </Tabs>
        <Box sx={{ p:2, color: 'common.white' }}>
          {/* === GENERAL FORM === */}
          {activeTab === 'General' && (
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                color: 'common.white',
              }}
            >
              {/* Loan Details */}
              <Typography
                variant="subtitle1"
                sx={{ gridColumn: 'span 4', mt: 2, color: 'rgba(255,255,255,0.8)' }}
              >
                Loan Details
              </Typography>

              <TextField
                label="Date of Loan"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />
              <TextField
                label="Amount"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />

              <TextField
                label="Deduct From"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />
              <TextField
                label="Interest Rate (% p.a.)"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />

              <TextField
                label="Created Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />
              <TextField
                label="No of Installments"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />

              <TextField
                label="Loan Type"
                select
                size="small"
                SelectProps={{ native: true }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              >
                <option value="">--</option>
                <option value="Personal">Personal</option>
                <option value="Home">Home</option>
              </TextField>
              <TextField
                label="Loan Account No"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />

              {/* Installment Details */}
              <Typography
                variant="subtitle1"
                sx={{ gridColumn: 'span 4', mt: 3, color: 'rgba(255,255,255,0.8)' }}
              >
                Installment Details
              </Typography>

              <TextField
                label="Monthly Installment"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 1.5', bgcolor: 'rgba(255,255,255,0.05)' }}
              />
              <TextField
                label="Principal Balance"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 1.5', bgcolor: 'rgba(255,255,255,0.05)' }}
              />
              <TextField
                label="Interest Balance"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 1.5', bgcolor: 'rgba(255,255,255,0.05)' }}
              />

              {/* Other Information */}
              <Typography
                variant="subtitle1"
                sx={{ gridColumn: 'span 4', mt: 3, color: 'rgba(255,255,255,0.8)' }}
              >
                Other Information
              </Typography>

              {/* NEW: both checkboxes + labels on one line */}
<Box
  sx={{
    gridColumn: 'span 4',
    display: 'flex',
    alignItems: 'center',
    gap: 6,               // space between the two labels
    mt: 1
  }}
>
  <FormControlLabel
    control={<Checkbox sx={{ color: 'common.white' }} />}
    label="Demand Promissory Note"
    sx={{ color: 'rgba(255,255,255,0.7)' }}
  />
  <FormControlLabel
    control={<Checkbox sx={{ color: 'common.white' }} />}
    label="Loan Completed"
    sx={{ color: 'rgba(255,255,255,0.7)' }}
  />



              <TextField
                label="Perquisite Rate"
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />
              <TextField
                label="Completed Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 2', bgcolor: 'rgba(255,255,255,0.05)' }}
              />
</Box>
              <TextField
                label="Remarks"
                multiline
                rows={2}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{ gridColumn: 'span 4', bgcolor: 'rgba(255,255,255,0.05)' }}
              />

              {/* Actions */}
              <Box
                sx={{
                  gridColumn: 'span 4',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                  mt: 2,
                }}
              >
                <Button component={RouterLink} to="/salary" variant="contained" color="primary">
                  Back to Salary
                </Button>
                <Button variant="contained" color="secondary">
                  Save
                </Button>
              </Box>
            </Box>
          )}

          {/* === OTHER TABS (placeholders) === */}
          {activeTab === 'Loan Details' && (
            <>
             <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mt: 2, borderRadius: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Trans Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>To Principal</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>To Interest</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Actual Principal</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Actual Interest</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Perk Value</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Perk Amount</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Perk Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* no data yet */}
                    </TableBody>
                </Table>
             </TableContainer>
             <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Button
        component={RouterLink}
        to="/salary"
        variant="contained"
        color="primary"
      >
        Back to Salary
      </Button>
    </Box>
           </>
          )}
          {activeTab === 'Loan Repayments' &&(
             <>
             <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mt: 2, borderRadius: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>To Principal</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>To Interest</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Modifiy Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Modifiy Date</TableCell>                  </TableRow>
                    </TableHead>
                    <TableBody >
                        {/* no data yet */}
                    </TableBody>
                </Table>
             </TableContainer>
             <Box sx={{ mt: 2, gap:1, display: 'flex', justifyContent: 'center' }}>
      <Button
        component={RouterLink}
        to="/salary"
        variant="contained"
        color="primary"
      >
        Back to Salary
      </Button>
      <Button variant='contained' color='primary'>
        Save
      </Button>
    </Box>
           </>
          )}
          {activeTab === 'Loan Revision' && (
  <>
    {/* Running Loan Details Form */}
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 2,
        p: 2,
        color: 'common.white'
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ gridColumn: 'span 2', color: 'rgba(255,255,255,0.8)', mb: 1 }}
      >
        Running Loan Details
      </Typography>

      <TextField
        label="Loan Amount"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />
      <TextField
        label="Current Interest Rate"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />

      <TextField
        label="Loan Type"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />
      <TextField
        label="Total Installments"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />

      <TextField
        label="Principal Balance"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />
      <TextField
        label="No. of Installments Paid"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />

      <TextField
        label="Top Up Amount"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />
      <TextField
        label="New Loan Period"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />

      <TextField
        label="New Interest Rate"
        size="small"
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
      />

      {/* Action Buttons */}
      <Box
        sx={{
          gridColumn: 'span 2',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          mt: 1
        }}
      >
        <Button component={RouterLink} to="/salary" variant="contained" color="primary">
          Back to Salary
        </Button>
        <Button variant="contained" color="secondary">
          Save
        </Button>
      </Box>
    </Box>

    <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mt: 2, borderRadius: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Effective From</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Effective Till</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Opening Balance</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Top Up Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Loan Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Overall Loan Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Interest Rate</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Remaining Period</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* future adjustment rows */}
        </TableBody>
      </Table>
    </TableContainer>
  </>
)}
        </Box>
      </Box>
    </>
  );
}
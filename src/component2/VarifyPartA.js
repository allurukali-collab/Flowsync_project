// src/component2/VerifyPartA.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  Paper,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Header from './Header';

const steps = [
  'Upload Part A',
  'Verify Part A',
  'Upload Part B',
  'Verify Part B',
  'Generate GreytHR Part B',
  'Publish',
];

export default function VerifyPartA() {
  const [mode, setMode] = useState('selected');
  const [filterEmp, setFilterEmp] = useState('All');

  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <Box sx={{ p: 2, bgcolor: 'rgba(10,20,40,0.8)' }}>
        <Breadcrumbs
          separator=">"
          sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' } }}
        >
          <MuiLink component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Home
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to="/updatepayroll"
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Payroll
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to="/form16/generate"
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Form 16
          </MuiLink>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Verify Part A
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Stepper */}
      <Paper
        elevation={0}
        sx={{
          mx: 2,
          mt: 2,
          px: 3,
          py: 2,
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 2,
        }}
      >
        <Stepper
          activeStep={1}
          alternativeLabel
          sx={{
            '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.3)' },
            '& .MuiStepIcon-root.Mui-active': { color: '#4caf50' },
            '& .MuiStepIcon-root.Mui-completed': { color: '#90caf9' },
            '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.3)' },
            '& .MuiStepLabel-label.Mui-active': { color: '#fff', fontWeight: 600 },
            '& .MuiStepLabel-label.Mui-completed': { color: '#90caf9' },
          }}
        >
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Content */}
      <Box sx={{ mx: 2, mt: 3, color: '#fff' }}>
        <Typography variant="h6" gutterBottom>
          Step 2: VERIFY PART A
        </Typography>

        {/* mode + filter */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <RadioGroup
            row
            value={mode}
            onChange={e => setMode(e.target.value)}
            sx={{
              '& .MuiRadio-root': {
                color: '#90caf9',
                '&.Mui-checked': { color: '#90caf9' },
              },
            }}
          >
            <FormControlLabel value="selected" control={<Radio />} label="Selected employees" />
            <FormControlLabel value="all" control={<Radio />} label="All employees" />
          </RadioGroup>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={filterEmp}
              onChange={e => setFilterEmp(e.target.value)}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Alice">Alice</MenuItem>
              <MenuItem value="Bob">Bob</MenuItem>
              {/* etc */}
            </Select>
          </FormControl>
        </Box>

        {/* table */}
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            maxWidth: '80vw',
            maxHeight: 360,
            bgcolor: 'rgba(255,255,255,0.05)',
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ "& .MuiTableCell-stickyHeader": {
      backgroundColor: "rgb(0, 0, 0)",  // your translucent blue
      color: "white",   }}}>
                <TableCell sx={{ color: '#fff', width: 48 }}>
                  <Checkbox sx={{ color: '#90caf9' }} />
                </TableCell>
                <TableCell sx={{ color: '#fff' }}>Employee No</TableCell>
                <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                <TableCell sx={{ color: '#fff' }}>Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { id: 'T0010', name: 'Alice' },
                { id: 'T0011', name: 'Bob' },
                { id: 'T0012', name: 'Carol' },
              ].map(emp => (
                <TableRow key={emp.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  <TableCell>
                    <Checkbox sx={{ color: '#90caf9' }} />
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>{emp.id}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{emp.name}</TableCell>
                  <TableCell>
                    <IconButton>
                      <DownloadIcon sx={{ color: '#90caf9' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
              {/* Download button only for “All employees” */}
{mode === 'all' && (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      sx={{ textTransform: 'none' }}
    >
      Download
    </Button>
  </Box>
)}
        {/* navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/form16/generate"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Previous
          </Button>
          <Button
            component={RouterLink}
            to="/form16/upload-part-b"
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Next →
          </Button>
        </Box>
      </Box>
    </>
  );
}

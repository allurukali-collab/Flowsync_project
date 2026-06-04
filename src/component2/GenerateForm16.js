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
  Alert,
  AlertTitle,
  Button,
  Divider,
  Grid,
  TextField,
} from '@mui/material';
import Header from './Header';
//import { Link as RouterLink } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const steps = [
  'Upload Part A',
  'Verify Part A',
  'Upload Part B',
  'Verify Part B',
  'Generate GreytHR Part B',
  'Publish',
];

export default function GenerateForm16() {
  const [activeStep] = useState(0); // always show first step here
  const [zipFile, setZipFile] = useState(null);

  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <Box sx={{ p: 2, bgcolor: 'rgba(10,20,40,0.8)' }}>
        <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' } }}>
          <MuiLink component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Home
          </MuiLink>
          <MuiLink component={RouterLink} to="/updatepayroll" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Payroll
          </MuiLink>
          <MuiLink component={RouterLink} to="/form16" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Form 16
          </MuiLink>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Generate
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Stepper bar */}
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
          activeStep={activeStep}
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
          Step 1: UPLOAD PART A
        </Typography>

        {/* warning banner */}
        <Alert
          severity="warning"
          iconMapping={{ warning: <InfoOutlinedIcon /> }}
          sx={{
            mb: 3,
            color: '#bf360c',
            bgcolor: 'rgba(255, 235, 238, 1)',
            '& .MuiAlert-icon': { color: '#bf360c' },
          }}
        >
          <AlertTitle>Form 16 – Responsible Person Details are mandatory.</AlertTitle>
          <Button
            component={RouterLink}
            to="/form16/settings"
            variant="text"
            sx={{ textTransform: 'none', fontWeight: 600, ml: 1 }}
          >
            Update now
          </Button>
        </Alert>

        <Typography variant="subtitle1" gutterBottom>
          Upload Form 16 Part A Zip/PDF files
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />

        {/* file input */}
        <Button
          variant="outlined"
          component="label"
          startIcon={<InfoOutlinedIcon />}
          sx={{
            borderColor: 'rgba(255,255,255,0.5)',
            color: 'rgba(255,255,255,0.8)',
            mb: 1,
            '&:hover': {
              borderColor: '#fff',
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Upload File
          <input
            type="file"
            hidden
            accept=".zip,.pdf"
            onChange={e => setZipFile(e.target.files[0])}
          />
        </Button>
        <Typography variant="body2" color="rgba(255,255,255,0.6)">
          Note: Only ZIP, PDF files are accepted.
        </Typography>

        {/* FAQ panel */}
        <Paper
          variant="outlined"
          sx={{
            mt: 4,
            p: 2,
            bgcolor: 'rgba(255,255,255,0.08)',
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#90caf9', mb: 1 }}>
            How can I get the Form16 Part A from TRACES site?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#eee' }}>
            1. Register and <MuiLink href="https://www.tin-nsdl.com" target="_blank" sx={{ color: '#fff' }}>login</MuiLink> to TRACES.<br/>
            2. Raise a request to generate Form16 Part A. You need to fill the below details to generate:
          </Typography>

          <Box
            sx={{
              p: 2,
              bgcolor: 'rgba(255,235,238,0.4)',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="BSR Code/Receipt Number"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: '#000' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="PAN as in Statement"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: '#000' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Total Amount Deducted/Collected (Rs)"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: '#000' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Date on which Tax Deposited"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: '#000' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Challan Serial Number/DDO"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: '#000' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Challan Amount/Transfer Voucher"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: '#000' },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            3. Download the requested Part A file.<br/>
            4. Download the TRACES‑pdf‑converter utilities and generate Form16 Part A pdf files.<br/>
            5. Verify if the PDFs are signed or not. If unsigned, merge with Part B & sign both.<br/>
            6. Zip all Form16 Part A pdfs and upload under “Part A Upload” tab.
          </Typography>
        </Paper>

        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/form16"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Previous
          </Button>

          <Box>
            <Button
              component={RouterLink}
              to="/form16/verify-part-a"
              variant="contained"
              sx={{ textTransform: 'none' }}
              //disabled={!zipFile}
            >
              Next →
            </Button>
            <Button
              onClick={() => window.history.back()}
              sx={{ ml: 1, textTransform: 'none', color: 'rgba(255,255,255,0.8)' }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

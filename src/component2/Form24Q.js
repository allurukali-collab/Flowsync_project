// src/components/Form24Q.js
import React, { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const QUARTERS = [
  { key: 'q1', label: '1st Quarter (Apr 2025 – Jun 2025)' },
  { key: 'q2', label: '2nd Quarter (Jul 2025 – Sep 2025)' },
  { key: 'q3', label: '3rd Quarter (Oct 2025 – Dec 2025)' },
  { key: 'q4', label: '4th Quarter (Jan 2026 – Mar 2026)' },
];

export default function Form24Q() {
    const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [tab, setTab] = useState(0);
  const [fy, setFy] = useState('2025-2026');
  const [employeeFilter, setEmployeeFilter] = useState('All');

  const handleAccordion = panel => (_, isOpen) => {
    setExpanded(isOpen ? panel : null);
    setTab(0);
  };

  return (
    <>
      <Header />

      {/* Breadcrumbs + Action bar */}
      <Box sx={{ px: 2, pt: 2, bgcolor: 'rgba(10,20,40,0.7)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' } }}>
          <MuiLink component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)' }}>Home</MuiLink>
          <MuiLink component={RouterLink} to="/updatepayroll" sx={{ color: 'rgba(255,255,255,0.7)' }}>Payroll</MuiLink>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Form24Q</Typography>
        </Breadcrumbs>
</Box>
<Box sx={{ display: 'flex',
      alignItems: 'center',
      gap: 1,
      mt: 2,
      flexWrap: 'wrap' }}>
        <IconButton sx={{ color: 'white' }}><SettingsIcon /></IconButton>

        <Button 
        onClick={() => navigate('/form24q/challans')} 
        variant="outlined" sx={{ color: 'white', borderColor: 'white', textTransform: 'none' }}>
          Challans
        </Button>

        <FormControl size="small" sx={{ minWidth: 120, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
          <Select sx={{ color: 'white' }} value={fy} onChange={e => setFy(e.target.value)}>
            <MenuItem value="2025-2026">2025 - 2026</MenuItem>
            {/* … */}
          </Select>
        </FormControl>

        <MuiLink sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', cursor: 'pointer' }}>
          FAQs
        </MuiLink>
</Box>

      {/* Quarter Accordions */}
      <Box sx={{ p: 2 }}>
        {QUARTERS.map(q => (
          <Accordion
            key={q.key}
            expanded={expanded === q.key}
            onChange={handleAccordion(q.key)}
            sx={{
              mb: 1,
              bgcolor: expanded === q.key ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              '& .MuiAccordionSummary-content': { margin: 0 }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography sx={{ fontWeight: 'bold', color: expanded === q.key ? 'orange' : 'rgba(255,255,255,0.7)' }}>
                {q.label}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
              {/* Tabs (only one for now) */}
              <Tabs
                value={tab}
                onChange={(e, v) => setTab(v)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 2 }}
              >
                <Tab label="Form 24Q Filing" sx={{ color: 'white', textTransform: 'none' }} />
                {/* future tabs… */}
              </Tabs>

              {tab === 0 && (
                <Box>
                  {/* Receipt No */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ color: 'white', mr: 1 }}>Receipt No :</Typography>
                    <Typography sx={{ fontWeight: 600, color: 'orange' }}>(not available)</Typography>
                    <IconButton size="small" sx={{ color: 'white', ml: 1 }}><EditIcon /></IconButton>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>(Jan 2025 – Mar 2025)</Typography>

                  {/* Warning box */}
                  <Box sx={{
                    bgcolor: 'rgba(255,237,200,0.3)',
                    border: '1px solid rgba(255,224,130,0.5)',
                    borderRadius: 1,
                    p: 2,
                    mb: 3
                  }}>
                    <Typography sx={{ fontWeight: 'bold', color: 'orange', mb: 1 }}>Warning:</Typography>
                    <Typography sx={{ color: 'white', mb: 1 }}>
                      Please update the Challan for 32 employees to generate the eTDS file. <MuiLink sx={{ color: 'lightblue', cursor: 'pointer' }}>show details</MuiLink>
                    </Typography>
                    <Typography sx={{ color: 'white', mb: 2 }}>
                      Income Tax is deducted from employees but not remitted/partially remitted to the income tax department in below Payrolls.
                    </Typography>

                    {/* Inner table */}
                    <Paper sx={{ bgcolor: 'rgba(255,255,255,0.1)', overflowX: 'auto' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ '& th': { color: 'white', borderColor: 'rgba(255,255,255,0.2)' } }}>
                            <TableCell>Payroll</TableCell>
                            <TableCell>Challan Amount Remitted</TableCell>
                            <TableCell>Tax Deducted from Employees</TableCell>
                            <TableCell>Difference</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            { payroll: 'Apr 2025', remitted: '₹0', deducted: '₹2,50,365', diff: '₹2,50,365' },
                            { payroll: 'May 2025', remitted: '₹0', deducted: '₹2,18,114', diff: '₹2,18,114' }
                          ].map((row,i) => (
                            <TableRow key={i} sx={{
                              '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.05)' },
                              color: 'white'
                            }}>
                              <TableCell>{row.payroll}</TableCell>
                              <TableCell>{row.remitted}</TableCell>
                              <TableCell>{row.deducted}</TableCell>
                              <TableCell>{row.diff}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  </Box>

                  {/* Bottom buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', textTransform: 'none' }}>
                      Update Challan Details
                    </Button>
                    <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                      Generate FVU
                    </Button>
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
}

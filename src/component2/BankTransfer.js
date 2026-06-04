// src/component2/BankTransfer.js

import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Header from './Header';
import {
  Box,
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  Paper,
  Tabs,
  Tab,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';

export default function BankTransfer() {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_, value) => setTab(value);

  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <Box sx={{ p: 2, bgcolor: 'rgba(10,20,40,0.7)' }}>
        <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' } }}>
          <MuiLink component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Home
          </MuiLink>
          <MuiLink component={RouterLink} to="/updatepayroll" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Payroll
          </MuiLink>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Bank Transfers
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Tabs */}
      <Paper
        square
        sx={{
          mx: 2,
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: 1,
          color:'rgba(255, 255, 255, 0.59)'
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
        >
          <Tab label="Bank Transfers" />
          <Tab label="Void Transfers" />
          <Tab label="Pending Employees" />
          <Tab label="Completed Employees" />
          <Tab label="Transaction Update History" />
        </Tabs>
      </Paper>

      {/* Only show this block on the first tab */}
   {tab === 0 && (
        <>
          {/* Info bar + button */}
          <Box
            sx={{
              mx: 2,
              my: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'primary.light',
                color: 'primary.light'
              }}
            >
              <ListIcon />
              <Typography>
                Bank transfer pending for 0 employees.
              </Typography>
            </Paper>
            <Button
              variant="contained"
              component={RouterLink}
              to="/updatepayroll/banktransfer/create"
            >
              Create New Bank Transfer
            </Button>
          </Box>

          {/* Dark, scrollable table */}
          <Paper
            sx={{
              mx: 2,
              mb: 3,
              height: 350,
              overflow: 'auto',
              bgcolor: 'rgba(255,255,255,0.05)'
            }}
          >
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      '#',
                      'Batch ID',
                      'Employee Count',
                      'Total Amount',
                      'Date',
                      'Status',
                      'Failed Employee No',
                      'View',
                      'Refresh',
                      'Download',
                      'Delete',
                      'Export'
                    ].map((head, idx) => (
                      <TableCell
                        key={idx}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.8)',
                          fontWeight: 600
                         }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={13} align="center" sx={{ py: 8, color: 'rgba(255,255,255,0.5)' }}>
                      No Rows To Show
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Footer summary */}
          <Box sx={{ mx: 2, mb: 4, color: 'rgba(255,255,255,0.8)' }}>
            <Typography>Employee Count: 0</Typography>
            <Typography>Total Amount: Rs 0.00</Typography>
          </Box>
        </>
      )}
   {tab === 1 && (
  <>
    {/* Void Transfers table */}
    <Paper
      sx={{
        mt:3,
        mx: 2,
        mb: 3,
        height: 400,
        overflow: 'auto',
        bgcolor: 'rgba(255,255,255,0.05)'
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                'Batch ID',
                'Type',
                'Bank',
                'Branch',
                'Employee Count',
                'Total Amount',
                'Date',
              ].map((head, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 600
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </>
)}

 {tab === 2 && (
  <>
    {/* pending employee table */}
    <Paper
      sx={{
        mt:3,
        mx: 2,
        mb: 3,
        height: 400,
        overflow: 'auto',
        bgcolor: 'rgba(255,255,255,0.05)'
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                '#',
                'Name',
                'Employee No',
                'Bank',
                'Branch',
                'Account Number',
                'Ammount',
              ].map((head, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 600
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </>
)}

 {tab === 3 && (
  <>
    {/* VCompleted employee table */}
    <Paper
      sx={{
        mt:3,
        mx: 2,
        mb: 3,
        height: 400,
        overflow: 'auto',
        bgcolor: 'rgba(255,255,255,0.05)'
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                'Employee no',
                'Transaction',
                'Remark',
                'Batch ID',
                'User ID',
                'Type',
                'IFSC code',
                'Bank Name',
                'Initiated On',
                'Refer transaction No',
                'remark'


              ].map((head, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 600
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </>
)}

 {tab === 4 && (
  <>
    {/* Transaction update table */}
    <Paper
      sx={{
        mt:3,
        mx: 2,
        mb: 3,
        height: 400,
        overflow: 'auto',
        bgcolor: 'rgba(255,255,255,0.05)'
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                'Batch ID',
                'Employee Name',
                'Employee ID',
                'Updated On',
                'Previous Status',
                'Updated Status',
                'Amount',
                'Reason'
              ].map((head, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 600
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </>
)}
    </>
  );
}

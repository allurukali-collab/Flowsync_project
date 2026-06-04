import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Header from "./Header";

export default function EmployeeITDeclaration() {
  const [tabIndex, setTabIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [allowAck, setAllowAck] = useState("yes");
  const [regimeMonth, setRegimeMonth] = useState("January");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSaveOptions = () => {
    setOpenDialog(false);
    setSnackbarOpen(true);
  };

  const commonFilters = (
    <>
      <FormControl
        size="small"
        sx={{
          minWidth: 140,
          bgcolor: "rgba(255,255,255,0.12)",
          borderRadius: 1,
        }}
      >
        <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Status</InputLabel>
        <Select
          label="Status"
          defaultValue="ALL"
          sx={{ color: "white" }}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="LOCKED">Locked</MenuItem>
          <MenuItem value="PENDING">Pending for review</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          minWidth: 140,
          bgcolor: "rgba(255,255,255,0.12)",
          borderRadius: 1,
        }}
      >
        <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
          Payroll Date
        </InputLabel>
        <Select
          label="Payroll Date"
          defaultValue="ALL"
          sx={{ color: "white" }}
        >
          <MenuItem value="ALL">All</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          minWidth: 140,
          bgcolor: "rgba(255,255,255,0.12)",
          borderRadius: 1,
        }}
      >
        <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Employee</InputLabel>
        <Select
          label="Employee"
          defaultValue="ALL"
          sx={{ color: "white" }}
        >
          <MenuItem value="ALL">All</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          minWidth: 140,
          bgcolor: "rgba(255,255,255,0.12)",
          borderRadius: 1,
        }}
      >
        <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
          Filter
        </InputLabel>
        <Select
          label="Filter"
          defaultValue="ALL"
          sx={{ color: "white" }}
        >
          <MenuItem value="ALL">All</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  return (
    <>
      <Header/>

      {/* Breadcrumbs + Tabs */}
      <Box
        sx={{
          px: 2,
          pt: 2,
          bgcolor: 'rgba(10,20,40,0.7)',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Breadcrumbs
          separator=">"
          sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' } }}
        >
          <MuiLink component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Home
          </MuiLink>
          <MuiLink component={RouterLink} to="/updatepayroll" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Payroll
          </MuiLink>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Employee IT Declaration
          </Typography>
        </Breadcrumbs>
 </Box>
        <Tabs
          value={tabIndex}
          onChange={(e,v) => setTabIndex(v)}
          textColor="inherit"
          indicatorColor="primary"
          sx={{ ml: 'auto', color:'white' }}
        >
          <Tab  label="Release / Lock" />
          <Tab label="Consider Declarations" />
        </Tabs>
     

      {/* Panel: Release / Lock */}
      {tabIndex === 0 && (
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            {commonFilters}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
              }}
              onClick={() => setOpenDialog(true)}
            >
              Release Options
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 1,
              overflowX: 'auto',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& .MuiTableCell-stickyHeader": {
      backgroundColor: "rgb(0, 0, 0)",  // your translucent blue
      color: "white",   }}}>
                  <TableCell sx={{ color: 'white' }} />
                  <TableCell sx={{ color: 'white' }}>Employee No</TableCell>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Join Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Last Modified</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* No data rows */}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button variant="outlined">Send Reminder</Button>
            <Button variant="outlined">Lock Selected</Button>
            <Button variant="outlined">Lock All</Button>
            <Button variant="outlined">Release Selected</Button>
            <Button variant="contained">Release All</Button>
          </Box>
        </Box>
      )}

      {/* Panel: Consider Declarations */}
      {tabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* reuse just two filters here */}
            <FormControl size="small" sx={{ minWidth: 140, bgcolor:'rgba(255,255,255,0.12)', borderRadius:1 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Status</InputLabel>
              <Select label="Status" defaultValue="PENDING" sx={{ color:'white' }}>
                <MenuItem value="PENDING">Pending for review</MenuItem>
                <MenuItem value="ALL">All</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140, bgcolor:'rgba(255,255,255,0.12)', borderRadius:1 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Payroll Date</InputLabel>
              <Select label="Payroll Date" defaultValue="ALL" sx={{ color:'white' }}>
                <MenuItem value="ALL">All</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 1,
              overflowX: 'auto',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& .MuiTableCell-stickyHeader": {
      backgroundColor: "rgb(0, 0, 0)",  // your translucent blue
      color: "white",   }}}>
                  <TableCell sx={{ color: 'white' }} />
                  <TableCell sx={{ color: 'white' }}>#</TableCell>
                  <TableCell sx={{ color: 'white' }}>Employee No</TableCell>
                  <TableCell sx={{ color: 'white' }}>Employee Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>View Declaration</TableCell>
                  <TableCell sx={{ color: 'white' }}>Submitted On</TableCell>
                  <TableCell sx={{ color: 'white' }}>Considered From</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* No data */}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3,  }}>
            <Button variant="contained">Consider Selected</Button>
            <Button variant="contained">Consider All</Button>
            <Button variant="outlined">Download Selected</Button>
            <Button variant="outlined">Download All</Button>
          </Box>
        </Box>
        
      )}

       {/* Release Options Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth  BackdropProps={{
    sx: {
      backdropFilter: 'blur(2px)',
    }, 
  }}  PaperProps={{
    sx: {
      bgcolor: 'rgba(255, 255, 255, 0.85)',
      color: 'black',
      borderRadius: 2,
      overflow: 'hidden',          // hide any overflow
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)', 
    },
  }}>
        <DialogTitle>Release Options</DialogTitle>

        <DialogContent dividers>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl component="fieldset">
              <Typography>Allow employees to acknowledge their Business Income, if any.</Typography>
              <RadioGroup
                row
                value={allowAck}
                onChange={(e) => setAllowAck(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Allow employees to select a regime till</InputLabel>
              <Select
                value={regimeMonth}
                onChange={(e) => setRegimeMonth(e.target.value)}
                label="Allow employees to select a regime till"
              >
                {[
                  "January","February","March","April","May","June",
                  "July","August","September","October","November","December"
                ].map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveOptions}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
    variant="filled"
    sx={{ width: '100%' }}
        >
          IT Declaration release options saved successfully
        </Alert>
      </Snackbar>
    </>
  );
}


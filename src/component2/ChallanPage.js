import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Header from './Header';
import { Link as RouterLink } from 'react-router-dom';

export default function ChallansPage() {
  // state for all saved challans
  const [challans, setChallans] = useState([]);

  // dialog open?
  const [open, setOpen] = useState(false);

  // form state
  const [form, setForm] = useState({
    payrollMonth: '',
    totalAmount: '',
    bsrCode: '',
    tds: '',
    educationCess: '',
    paymentDate: '',
    ackNo: '',
    serialNo: '',
    voucherDate: '',
    bankName: '',
    surcharge: '',
    interest: '',
    chequeNo: '',
    deductionDate: '',
    minorHead: '',
    lateFee: '',
  });

  const handleOpen  = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setChallans(prev => [...prev, form]);
    // reset form
    setForm({
      payrollMonth: '',
      totalAmount: '',
      bsrCode: '',
      tds: '',
      educationCess: '',
      paymentDate: '',
      ackNo: '',
      serialNo: '',
      voucherDate: '',
      bankName: '',
      surcharge: '',
      interest: '',
      chequeNo: '',
      deductionDate: '',
      minorHead: '',
      lateFee: '',
    });
    handleClose();
  };

  return (
    <>
      <Header />

      <Box sx={{ p: 2, bgcolor: 'rgba(10,20,40,0.7)' }}>
       <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' } }}>
                 <MuiLink component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)' }}>Home</MuiLink>
                 <MuiLink component={RouterLink} to="/updatepayroll" sx={{ color: 'rgba(255,255,255,0.7)' }}>Payroll</MuiLink>
                 <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Form24Q</Typography>
               </Breadcrumbs>
      </Box>

      <Box sx={{ p: 3 }}>
        {challans.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
               bgcolor: 'rgba(0,0,0,0.3)',
    // add a subtle border‑bottom to separate from the cosmos:
    borderBottom: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>No Challan Found..</Typography>
            <Button variant="outlined" onClick={handleOpen} sx={{
      color: 'white',
      borderColor: 'white',
      textTransform: 'none',
      fontWeight: 500,
      // give it a little breathing room
      ml: 2,
      '&:hover': {
        borderColor: 'primary.light',
        backgroundColor: 'rgba(255,255,255,0.1)',
      },
    }}>
          Add Challan
            </Button>
          </Box>
        ) : (
          <Paper elevation={0}   sx={{p: 2,
    bgcolor: 'rgba(178, 178, 178, 0.17)',  // 25% opacity white
    borderRadius: 1,
    boxShadow: 1,
    overflow: 'hidden',
  }}
  >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleOpen}>
                Add Challan
              </Button>
            </Box>
            <Table stickyHeader>
              <TableHead >
                <TableRow sx={{ "& .MuiTableCell-stickyHeader": {
      backgroundColor: "rgba(0, 0, 0, 0.57)",  // your translucent blue
      color: "white",   }}}>
                  <TableCell>Payroll Month</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>BSR Code</TableCell>
                  <TableCell>TDS</TableCell>
                  <TableCell>Edu. Cess</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Ack No</TableCell>
                  <TableCell>Serial No</TableCell>
                  <TableCell>Voucher Date</TableCell>
                  <TableCell>Bank Name</TableCell>
                  <TableCell>Surcharge</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Cheque/DD No</TableCell>
                  <TableCell>Deduction Date</TableCell>
                  <TableCell>Minor Head</TableCell>
                  <TableCell>Late Fee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {challans.map((c, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{c.payrollMonth}</TableCell>
                    <TableCell>{c.totalAmount}</TableCell>
                    <TableCell>{c.bsrCode}</TableCell>
                    <TableCell>{c.tds}</TableCell>
                    <TableCell>{c.educationCess}</TableCell>
                    <TableCell>{c.paymentDate}</TableCell>
                    <TableCell>{c.ackNo}</TableCell>
                    <TableCell>{c.serialNo}</TableCell>
                    <TableCell>{c.voucherDate}</TableCell>
                    <TableCell>{c.bankName}</TableCell>
                    <TableCell>{c.surcharge}</TableCell>
                    <TableCell>{c.interest}</TableCell>
                    <TableCell>{c.chequeNo}</TableCell>
                    <TableCell>{c.deductionDate}</TableCell>
                    <TableCell>{c.minorHead}</TableCell>
                    <TableCell>{c.lateFee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      {/* ========== ADD CHALLAN DIALOG ========== */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" BackdropProps={{
    sx: {
      backdropFilter: 'blur(2px)',
    },
  }}
  // the paper itself should be dark and softly rounded
  PaperProps={{
    sx: {
      bgcolor: 'rgba(255, 255, 255, 0.56)',
      color: 'white',
      borderRadius: 2,
      overflow: 'hidden',          // hide any overflow
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)', 
    },
  }}>
        <DialogTitle sx={{ bgcolor: 'transparent', color: 'Black', px: 4, pt: 3 }}>Add Challan</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              '& .MuiFormControl-root, & .MuiTextField-root': { width: '100%' }
            }}
          >
            <FormControl size="small">
              <InputLabel>Payroll Month</InputLabel>
              <Select
                name="payrollMonth"
                value={form.payrollMonth}
                label="Payroll Month"
                onChange={handleChange}
              >
                <MenuItem value="Apr 2025">Apr 2025</MenuItem>
                <MenuItem value="May 2025">May 2025</MenuItem>
                {/* …etc */}
              </Select>
            </FormControl>
            <TextField
              name="totalAmount"
              label="Total Challan Amount"
              size="small"
              value={form.totalAmount}
              onChange={handleChange}
            />

            <TextField name="bsrCode"     label="BSR Code"     size="small" value={form.bsrCode}     onChange={handleChange}/>
            <TextField name="tds"         label="TDS"          size="small" value={form.tds}         onChange={handleChange}/>
            <TextField name="educationCess" label="Education Cess" size="small" value={form.educationCess} onChange={handleChange}/>
            <TextField name="paymentDate" label="Payment Date" size="small" type="date" InputLabelProps={{ shrink: true }} value={form.paymentDate} onChange={handleChange}/>
            <TextField name="ackNo"       label="Ack No"       size="small" value={form.ackNo}       onChange={handleChange}/>
            <TextField name="serialNo"    label="Challan Serial No" size="small" value={form.serialNo}    onChange={handleChange}/>
            <TextField name="voucherDate" label="Voucher Date" size="small" type="date" InputLabelProps={{ shrink: true }} value={form.voucherDate} onChange={handleChange}/>
            <TextField name="bankName"    label="Bank Name"    size="small" value={form.bankName}    onChange={handleChange}/>
            <TextField name="surcharge"   label="Surcharge"    size="small" value={form.surcharge}   onChange={handleChange}/>
            <TextField name="interest"    label="Interest"     size="small" value={form.interest}    onChange={handleChange}/>
            <TextField name="chequeNo"    label="Cheque/DD No"  size="small" value={form.chequeNo}    onChange={handleChange}/>
            <TextField name="deductionDate" label="Deduction Date" size="small" type="date" InputLabelProps={{ shrink: true }} value={form.deductionDate} onChange={handleChange}/>
            <FormControl size="small">
              <InputLabel>Minor Head</InputLabel>
              <Select name="minorHead" value={form.minorHead} label="Minor Head" onChange={handleChange}>
                <MenuItem value="TDS payable by taxpayer">TDS payable by taxpayer</MenuItem>
                <MenuItem value="TDS payable by bank">TDS payable by bank</MenuItem>
              </Select>
            </FormControl>
            <TextField name="lateFee"     label="Late Pay Fee" size="small" value={form.lateFee}     onChange={handleChange}/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

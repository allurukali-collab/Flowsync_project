import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  TablePagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const HistoryPage = () => {
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  // Load leaveHistory from localStorage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("leaveHistory") || "[]");
    setRowsData(storedHistory);
  }, []);

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleWithdraw = () => {
    const updatedRows = rowsData.filter((row) => !selectedRows.includes(row.id));
    setRowsData(updatedRows);
    localStorage.setItem("leaveHistory", JSON.stringify(updatedRows));

    // Also remove from leaveApprovals (if needed)
    const approvals = JSON.parse(localStorage.getItem("leaveApprovals") || "[]");
    const updatedApprovals = approvals.filter((row) => !selectedRows.includes(row.id));
    localStorage.setItem("leaveApprovals", JSON.stringify(updatedApprovals));

    setSelectedRows([]);
    triggerToast("Leave withdrawn!", "success");
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [toastState, setToastState] = useState({ show: false, message: "", type: "" });

const triggerToast = (message, type) => {
  setToastState({ show: true, message, type });
  setTimeout(() => {
    setToastState({ show: false, message: "", type: "" });
  }, 2500);
};

  return (
    <Box className="leave-container" sx={{ p: 3 }}>
      <IconButton
        onClick={() => navigate('/leavepage')}
        sx={{ position: 'absolute', top: 16, left: 16, color: 'white' }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <Box className="leave-header" sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h5" className="leave-title" sx={{ color: 'white', mb: 2 }}>LEAVE</Typography>

        <Box className="random2">
          <Box className="leave-buttons" sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="outlined" color="primary" onClick={() => navigate('/leavepage')}>APPLY</Button>
            <Button variant="contained" className="history-button">HISTORY</Button>
          </Box>
          <Box
            sx={{
              backgroundColor: 'transparent',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Button variant="contained" color="error" onClick={handleWithdraw}>
                WITHDRAW
              </Button>
            </Box>
             
            <TableContainer component={Paper} sx={{ backgroundColor: '#1b1a1aff', height: "350px",border:'1px solid rgba(255, 255, 255, 0.85)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}></TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Emp ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Leave Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Start Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>End Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reason</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Balance</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id} sx={{ height: '36px' }}>
                      <TableCell sx={{ color: 'white', py: 0.5 }}>
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                          sx={{ color: 'white', p: 0.5 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', p: 0.5 }}>{row.empId}</TableCell>
                      <TableCell sx={{ color: 'white', p: 0.5 }}>{row.leaveType}</TableCell>
                      <TableCell sx={{ color: 'white', p: 0.5 }}>{row.startDate}</TableCell>
                      <TableCell sx={{ color: 'white', p: 0.5 }}>{row.endDate}</TableCell>
                      <TableCell sx={{ color: 'white', p: 0.5 }}>{row.reason}</TableCell>
                      <TableCell sx={{ color: 'white', p: 0.5 }}>{row.balance}</TableCell>
                      <TableCell sx={{ color: 'white', p: 0.5 }}>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={rowsData.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                backgroundColor: '#e0e0e0',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                mt:'4px'
              }}
            />
            </Box>
        </Box>
      </Box>
      <Snackbar
  open={toastState.show}
  autoHideDuration={3000}
  onClose={() => setToastState({ show: false, message: "", type: "" })}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setToastState({ show: false, message: "", type: "" })}
    severity={toastState.type}
    variant="filled"
    sx={{ width: "100%" }}
  >
    {toastState.message}
  </Alert>
</Snackbar>

    </Box>
  );
};

export default HistoryPage;

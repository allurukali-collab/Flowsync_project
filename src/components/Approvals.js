import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  IconButton,
  Stack,
  Button,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Paper,
  TablePagination,
  Snackbar,
  Alert
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import SearchIcon from '@mui/icons-material/Search'
import RejectButton from './RejectButton'

export default function Approvals() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const leaveApprovalsKey = "leaveApprovals"
  const closedRowsKey = "closedRows"
  const commonLeaveHistoryKey = "leaveHistory"

  const [activeTab, setActiveTab] = useState('ACTIVE')
  const [activeRows, setActiveRows] = useState(() => {
    const stored = localStorage.getItem(leaveApprovalsKey)
    return stored ? JSON.parse(stored) : []
  })
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [rejectSnackbarOpen, setRejectSnackbarOpen] = useState(false)

  const [openReject, setOpenReject] = useState(false)
  const [toRejectRows, setToRejectRows] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem(leaveApprovalsKey)
    setActiveRows(stored ? JSON.parse(stored) : [])
  }, [])

  function handleSelect(id) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(rid => rid !== id)
        : [...prev, id]
    )
  }

  const upsertCommonHistory = (items, statusToSet) => {
    const commonHistory = JSON.parse(localStorage.getItem(commonLeaveHistoryKey) || "[]")

    const updatedCommonHistory = [...commonHistory]

    items.forEach(item => {
      const idx = updatedCommonHistory.findIndex(entry => entry.id === item.id)

      const normalizedItem = {
        ...item,
        empId: item.empId || item.empID || "",
        leaveType: item.leaveType || "Leave",
        startDate: item.startDate || item.date || "",
        endDate: item.endDate || item.date || "",
        days: item.days || 1,
        appliedOn: item.appliedOn || new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        reason: item.reason || "",
        balance: item.balance ?? "-",
        status: statusToSet,
        category:
          item.category ||
          (item.leaveType === "Leave Reconciliation" || item.leaveType === "Reconciliation"
            ? "Reconciliation"
            : "Normal Leave"),
      }

      if (idx !== -1) {
        updatedCommonHistory[idx] = {
          ...updatedCommonHistory[idx],
          ...normalizedItem,
          status: statusToSet,
        }
      } else {
        updatedCommonHistory.push(normalizedItem)
      }
    })

    localStorage.setItem(commonLeaveHistoryKey, JSON.stringify(updatedCommonHistory))
  }

  const handleApprove = () => {
    if (!selected.length) return

    const approvedItems = activeRows
      .filter(r => selected.includes(r.id))
      .map(r => ({
        ...r,
        status: 'Approved',
        reason: r.reason || 'SickLeave',
        balance: r.balance,
        category:
          r.category ||
          (r.leaveType === "Leave Reconciliation" || r.leaveType === "Reconciliation"
            ? "Reconciliation"
            : "Normal Leave"),
      }))

    const updatedActiveRows = activeRows.filter(r => !selected.includes(r.id))
    setActiveRows(updatedActiveRows)
    localStorage.setItem(leaveApprovalsKey, JSON.stringify(updatedActiveRows))

    const existing = JSON.parse(localStorage.getItem(closedRowsKey) || '[]')

    const mergedClosed = [...existing]
    approvedItems.forEach(item => {
      const existingIndex = mergedClosed.findIndex(row => row.id === item.id)
      if (existingIndex !== -1) {
        mergedClosed[existingIndex] = item
      } else {
        mergedClosed.push(item)
      }
    })

    localStorage.setItem(closedRowsKey, JSON.stringify(mergedClosed))

    approvedItems.forEach(item => {
      const employeeKey = `leaveHistory_${item.empId}`
      const employeeHistory = JSON.parse(localStorage.getItem(employeeKey) || "[]")
      const updatedHistory = employeeHistory.map(entry =>
        entry.id === item.id
          ? { ...entry, status: "Approved", balance: entry.balance }
          : entry
      )
      localStorage.setItem(employeeKey, JSON.stringify(updatedHistory))
    })

    upsertCommonHistory(approvedItems, "Approved")

    setSelected([])
    setActiveTab('CLOSED')
    setSnackbarOpen(true)
  }

  const handleOpenReject = () => {
    setToRejectRows(
      filteredRows.filter(r => selected.includes(r.id))
    )
    setOpenReject(true)
  }

  const handleCloseReject = () => setOpenReject(false)

  const onRowsRejected = (rejectedItems) => {
    const updatedActive = activeRows.filter(r => !rejectedItems.some(x => x.id === r.id))
    setActiveRows(updatedActive)
    localStorage.setItem(leaveApprovalsKey, JSON.stringify(updatedActive))
    setSelected([])

    const existingClosed = JSON.parse(localStorage.getItem(closedRowsKey) || '[]')
    const rejectedClosedItems = rejectedItems.map(item => ({
      ...item,
      status: "Rejected",
      category:
        item.category ||
        (item.leaveType === "Leave Reconciliation" || item.leaveType === "Reconciliation"
          ? "Reconciliation"
          : "Normal Leave"),
    }))

    const mergedClosed = [...existingClosed]
    rejectedClosedItems.forEach(item => {
      const existingIndex = mergedClosed.findIndex(row => row.id === item.id)
      if (existingIndex !== -1) {
        mergedClosed[existingIndex] = item
      } else {
        mergedClosed.push(item)
      }
    })

    localStorage.setItem(closedRowsKey, JSON.stringify(mergedClosed))

    rejectedItems.forEach(item => {
      const employeeKey = `leaveHistory_${item.empId}`
      const employeeHistory = JSON.parse(localStorage.getItem(employeeKey) || "[]")
      const updatedHistory = employeeHistory.map(entry =>
        entry.id === item.id
          ? { ...entry, status: "Rejected" }
          : entry
      )
      localStorage.setItem(employeeKey, JSON.stringify(updatedHistory))
    })

    upsertCommonHistory(rejectedClosedItems, "Rejected")

    setActiveTab('CLOSED')
    setRejectSnackbarOpen(true)
  }

  const filteredRows = activeRows.filter(r => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    return (
      (r.empId && r.empId.toString().includes(term)) ||
      (r.name && r.name.toLowerCase().includes(term)) ||
      (r.id && r.id.toString().includes(term))
    )
  })

  const allSelected = filteredRows.length > 0 && filteredRows.every(row => selected.includes(row.id))
  const someSelected = filteredRows.some(row => selected.includes(row.id)) && !allSelected

  return (
    <div style={{
      position: 'relative',
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Arial',
      paddingTop: 16
    }}>
      <IconButton
        onClick={() => navigate('/timesheettable')}
        sx={{ position: 'absolute', top: 16, left: 16, color: 'white' }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <h2 style={{ margin: 0 }}>Leave Approval / Reconciliation</h2>

      <Box sx={{
        mt: 3,
        width: '90%',
        maxWidth: 1450,
        mx: 'auto',
        border: '2px solid rgba(45, 44, 44, 0.26)',
        borderRadius: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.59)',
        p: 2,
      }}>
        <Stack direction="row" spacing={1} sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}
          >
            ACTIVE
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/approvals/closed')}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
            }}
          >
            CLOSED
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/approvals/reconcilation')}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
            }}
          >
            RECONCILIATION
          </Button>
        </Stack>

        <Box sx={{
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 1,
          overflow: 'hidden',
          width: '90%',
          mx: 'auto',
          p: 2,
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 460,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            justifyContent: 'space-between',
            mb: 2
          }}>
            <TextField
              variant="filled"
              placeholder="Search By Employee Name or Employee Id"
              size="small"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{
                flex: 1,
                maxWidth: '400px',
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  border: '1px solid rgba(255,255,255,0.3)'
                },
                '& .MuiFilledInput-input': { color: 'white', py: 1 }
              }}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                )
              }}
            />

            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              <Button
                variant="outlined"
                disabled={!selected.length}
                onClick={handleApprove}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:not(.Mui-disabled):hover': {
                    borderColor: 'green',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.57)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                APPROVE
              </Button>

              <Button
                variant="outlined"
                disabled={!selected.length}
                onClick={handleOpenReject}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:not(.Mui-disabled):hover': {
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.57)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                REJECT
              </Button>

              <RejectButton
                openReject={openReject}
                onCloseReject={handleCloseReject}
                leaveRows={toRejectRows}
                onConfirmReject={async () => {
                  return true
                }}
                onRejected={(rejectedItems) => {
                  onRowsRejected(rejectedItems)
                  handleCloseReject()
                }}
              />
            </Stack>
          </Box>

          <TableContainer component={Paper} sx={{
            maxHeight: 380,
            overflowY: 'auto',
            flex: 1,
            mb: 2,
            backgroundColor: 'rgba(0,0,0,0.26)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: 1,
          }}>
            <Table size='small' stickyHeader>
              <TableHead>
                <TableRow sx={{
                  "& .MuiTableCell-stickyHeader": {
                    backgroundColor: "rgb(0, 0, 0)",
                    color: "white",
                  }
                }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={e =>
                        e.target.checked
                          ? setSelected(filteredRows.map(r => r.id))
                          : setSelected([])
                      }
                      sx={{
                        color: 'white',
                        '& .MuiSvgIcon-root': {
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          borderRadius: 1,
                        },
                        '&:hover .MuiSvgIcon-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        }
                      }}
                    />
                  </TableCell>
                  {[
                    'Employee ID', 'Emp Name', 'Leave Type',
                    'Start Date', 'End Date', 'Days',
                    'Applied On', 'Reason', 'Status'
                  ].map(h => (
                    <TableCell
                      key={h}
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        py: 1.5,
                        px: 2,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <TableRow
                      key={row.id}
                      hover
                      selected={selected.includes(row.id)}
                      sx={{ cursor: 'default', backgroundColor: 'rgba(255,253,253,0.11)' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(row.id)}
                          onChange={() => handleSelect(row.id)}
                          sx={{
                            color: 'white',
                            '& .MuiSvgIcon-root': {
                              backgroundColor: 'rgba(255,255,255,0.15)',
                              borderRadius: 1,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', py: 1.3, px: 2 }}>{row.empId}</TableCell>
                      <TableCell sx={{ color: 'white', py: 0.5, px: 2 }}>{row.name}</TableCell>
                      <TableCell sx={{ color: 'white', py: 0.5, px: 2 }}>{row.leaveType}</TableCell>
                      <TableCell sx={{ color: 'white', py: 0.5, px: 2 }}>{row.startDate}</TableCell>
                      <TableCell sx={{ color: 'white', py: 0.5, px: 2 }}>{row.endDate}</TableCell>
                      <TableCell sx={{ color: 'white', py: 0.5, px: 2 }}>{row.days}</TableCell>
                      <TableCell sx={{ color: 'white', py: 0.5, px: 2 }}>{row.appliedOn}</TableCell>
                      <TableCell sx={{ color: 'white', py: 0.5, px: 2 }}>{row.reason}</TableCell>
                      <TableCell sx={{ color: 'white', py: 0.5, px: 2 }}>{row.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              color: 'black',
              backgroundColor: 'rgba(255,249,249,0.74)',
              '& .MuiTablePagination-selectIcon': { color: 'black' },
              '& .MuiTablePagination-select': { color: 'black' },
              '& .MuiIconButton-root': { color: 'black' }
            }}
          />
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert variant="filled" severity="success">
          Approved successfully
        </Alert>
      </Snackbar>

      <Snackbar
        open={rejectSnackbarOpen}
        autoHideDuration={1500}
        onClose={() => setRejectSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert variant="filled" severity="success">
          Rejected successfully
        </Alert>
      </Snackbar>
    </div>
  )
}
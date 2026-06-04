import React, { useState, useEffect } from 'react';
import {
  Box, Button, Paper, TextField, Typography, IconButton,
  Tooltip, Divider, Breadcrumbs, Link, Select, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link as RouterLink } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GroupIcon from '@mui/icons-material/Group';
import dayjs from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';
import Navbar from './Navbar.js';

const EmployeeCard = ({ emp, highlight }) => (
  <Box sx={{
    bgcolor: 'rgba(58, 55, 55, 0.54)',
    borderRadius: 2,
    border: highlight ? '2px solid #4fc3f7' : '1px solid gray',
    p: 2,
    minWidth: 100,
    textAlign: 'center',
    boxShadow: highlight ? '0 0 12px #4fc3f7' : '0 2px 8px rgba(0, 0, 0, 0.1)',
    transform: highlight ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease',
    mr:2
  }}>
    <img src={emp.image} alt={emp.name} style={{ width: 45, height: 45, borderRadius: '50%' }} />
    <Typography fontWeight={600} fontSize={12} mt={1} color="white">{emp.name}</Typography>
    <Typography fontSize={10} color="gray">{emp.title}</Typography>
    <Typography fontSize={10} color="gray">Emp ID - {emp.id}</Typography>
  </Box>
);

const OrganizationChart = () => {

  const [orgData, setOrgData] = useState(
  {
    id: 'T0041',
    name: 'Pankaj',
    title: 'CEO',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    children: [
      {
        id: 'T0015',
        name: 'Om',
        title: 'Employee',
        image: 'https://randomuser.me/api/portraits/men/43.jpg'
      },
      {
        id: 'T0019',
        name: 'Divyanshu Shivam',
        title: 'Employee',
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 'T0044',
        name: 'Shivani',
        title: 'Employee',
        image: 'https://randomuser.me/api/portraits/women/60.jpg'
      },
      {
        id: 'T0014',
        name: 'Pranali',
        title: 'Intern',
        image: 'https://randomuser.me/api/portraits/women/20.jpg'
      },
      {
        id: 'T0022',
        name: 'Palak',
        title: 'Intern',
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    ]
  });

  const [payrollMonth, setPayrollMonth] = useState("Jul'25");
  const [employeeType, setEmployeeType] = useState("No Options");

  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [openMassTransfer, setOpenMassTransfer] = useState(false);
  const [selectedReportees, setSelectedReportees] = useState([]);

  const [zoom, setZoom] = useState(1);

  const [openAssignManager, setOpenAssignManager] = useState(false);
  const [highlightedEmpId, setHighlightedEmpId] = useState(null);

  const [view, setView] = useState('vertical'); // 'vertical' or 'horizontal'

  const toggleView = (type) => {
    setView(type);
  };
  

  return (
    <Box sx={{ p: 0 }}>
      <Navbar/>
    <Box sx={{ filter: openDialog ? 'blur(4px)' : 'none',transition: '0.3s ease',width:'80%',margin:'0 auto',mt:'70px' }}>
        {/* Breadcrumb */}
  <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': {color: 'rgba(255,255,255,0.4)' } }}>
    <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
    <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
    <Typography color="rgba(255,255,255,0.7)" fontWeight={600}>Organization Chart</Typography>
  </Breadcrumbs>

  {/* Filter Row */}
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ccc',
        px: 2,
        borderRadius: 1,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        width: '150px'
      }}>
        <DatePicker
          views={['year', 'month']}
          value={dayjs(payrollMonth, "MMM YYYY")}
          onChange={(newValue) => {
            const formatted = dayjs(newValue).format("MMM YYYY");
            setPayrollMonth(formatted);
          }}
          slotProps={{
            textField: {
              variant: 'standard',
              fullWidth: true,
              InputLabelProps: { shrink: false },
              InputProps: {
                disableUnderline: true,
                sx: {
                  fontSize: '12px',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#fff',
                  '& .MuiSvgIcon-root': {
                  color: '#fff',
                  }
                }
              },
              inputProps: {
                style: {
                  fontSize: '12px',
                  padding: '6px 4px',
                  color: '#fff'
                },
                placeholder: '',
              },
            },
          }}
        />
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ccc',
        px: 2,
        borderRadius: 1,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)'
      }}>
        <GroupIcon sx={{ mr: 1, color: '#ddd' }} />
        <Select
          value={employeeType}
          onChange={(e) => setEmployeeType(e.target.value)}
          variant="standard"
          disableUnderline
          sx={{ color: '#fff','& .MuiSelect-icon': {color: '#fff'}, }}>
          <MenuItem value="No Options" disabled>No Options</MenuItem>
        </Select>
      </Box>
    </Box>
    </LocalizationProvider>
{/* Combined Container Starts */}
<Paper elevation={4} sx={{
  backgroundColor: 'rgba(28, 27, 27, 0.76)',
  borderRadius: 3,
  p: 3,
  mt: 2,
  position: 'relative', // So zoom buttons stay inside
  overflow: 'hidden'
}}>   
    {/* Buttons below filters */}
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
    <Button variant="outlined" sx={{ textTransform: 'none', fontSize: '13px', px: 2 }} onClick={() => setOpenDialog(true)}>
      Assign Top Level Manager
    </Button>
    <Button variant="outlined" sx={{ textTransform: 'none', fontSize: '13px', px: 2 }} onClick={() => setOpenMassTransfer(true)}>
      Mass Transfer
    </Button>
    <Button variant="contained" sx={{ textTransform: 'none', fontSize: '13px', px: 2 }} onClick={() => setOpenAssignManager(true)}>
      Assign Manager
    </Button>
  </Box>
      <Paper sx={{
        p: 2, mb: 2, display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'rgba(255, 255, 255, 0.12)'
      }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
      if (e.key === 'Enter') {
      const match = orgData.children.find(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (match) {
        setHighlightedEmpId(match.id);
        setTimeout(() => setHighlightedEmpId(null), 2000); // clear after 2s
      }
    }
  }}      
          InputProps={{
            startAdornment: <SearchIcon  sx={{ color: 'white' }}/>,
            sx: { borderRadius: 5, px: 1, backgroundColor: '#424242c1',color: 'white', }
          }}
            sx={{
    input: { color: 'white' },              // Text color
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray',             // Gray border
      },
      '&:hover fieldset': {
        borderColor: 'gray',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'gray',
      },
    },
  }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Vertical View">
            <IconButton onClick={() => toggleView('vertical')}>
              <UnfoldMoreIcon color={view === 'vertical' ? 'primary' : 'inherit'} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Horizontal View">
            <IconButton onClick={() => toggleView('horizontal')}>
              <SwapHorizIcon color={view === 'horizontal' ? 'primary' : 'inherit'} />
            </IconButton>
          </Tooltip>
          <Button variant="contained">Export</Button>
        </Box>
      </Paper>

{/* Organization Chart */}
<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3}}>
  <Box sx={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
      <Box sx={{
    transform: `scale(${zoom})`,
    transformOrigin: 'top center',
    transition: 'transform 0.3s ease'
  }}>
  {view === 'vertical' ? (
    // VERTICAL VIEW
    <Box>
      {/* CEO */}
      <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', mb: 4 }}>
        <EmployeeCard emp={orgData} highlight={orgData.id === highlightedEmpId} />
        {/* Vertical line below CEO */}
        <Box sx={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          width: '2px',
          height: '24px',
          bgcolor: '#ccc',
          transform: 'translateX(-50%)'
        }} />
      </Box>

      {/* Horizontal line & reportees */}
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 2 }}>
        {/* horizontal line */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          bgcolor: '#ccc'
        }} />

        {orgData.children.map(child => (
          <Box key={child.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '2px', height: '24px', bgcolor: '#ccc', mb: 1 }} />
            <EmployeeCard emp={child} highlight={child.id === highlightedEmpId} />
          </Box>
        ))}
      </Box>
    </Box>
  ) : (
    // HORIZONTAL VIEW
    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', minHeight: 250 }}>
      {/* CEO */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', mr: 6 }}>
        <EmployeeCard emp={orgData} highlight={orgData.id === highlightedEmpId} />
        {/* Horizontal line to right */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '100%',
          height: '2px',
          width: '40px',
          bgcolor: '#ccc',
          transform: 'translateY(-50%)'
        }} />
      </Box>

      {/* Vertical line connector */}
      <Box sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        pr: 2
      }}>
        {/* Central vertical line */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '20px',
          width: '2px',
          bgcolor: '#ccc',
          zIndex: 0
        }} />

        {orgData.children.map((child, index) => (
          <Box
            key={child.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Horizontal connector */}
            <Box sx={{ width: '40px', height: '2px', bgcolor: '#ccc', mr: 1 }} />
            <EmployeeCard emp={child} highlight={child.id === highlightedEmpId}  />
          </Box>
        ))}
      </Box>
    </Box>
  )}
</Box>
</Box>
</Box>

      {/* Zoom Controls */}
      <Box sx={{
        position: 'absolute', bottom: 20, right: 20,
        display: 'flex', flexDirection: 'column', gap: 1, zIndex: 9999
      }}>
        <IconButton   onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
    sx={{ bgcolor: '#fff' }}><AddIcon /></IconButton>
        <IconButton     onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
    sx={{ bgcolor: '#fff' }}
><RemoveIcon /></IconButton>
      </Box>
      </Paper> 
</Box>


      {openDialog && (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      bgcolor: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Paper elevation={3} sx={{ width: 400, p: 3, borderRadius: 2,bgcolor: '#292727be',color: 'white'  }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Set Top Level Manager</Typography>
        <IconButton onClick={() => setOpenDialog(false)}>
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>×</span>
        </IconButton>
      </Box>
      <Typography variant="body2" sx={{ mb: 1 }}>Select Manager</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by Emp No / Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
    if (e.key === 'Enter') {
      const allEmployees = [orgData, ...orgData.children];
      const match = allEmployees.find(
        emp =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (match && match.id !== orgData.id) {
        const remaining = allEmployees.filter(emp => emp.id !== match.id);
        const newTop = { ...match, title: 'Top Manager', children: remaining };
        setOrgData(newTop);
        setOpenDialog(false);
        setSearchTerm('');
      }
    }
  }}
        InputProps={{
          startAdornment: (
      <InputAdornment position="start">
        <GroupIcon sx={{ color: '#888', fontSize: 20}} />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <SearchIcon sx={{ color: '#888', fontSize: 20 }} />
      </InputAdornment>
    ),
    sx: {
      bgcolor: '#f5f5f5',
      borderRadius: 2,
      pl: 1,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ccc'
      }
    }
  }}
  inputProps={{
    style: { padding: '8px 10px', fontSize: '14px' }
  
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
        <Button variant="outlined" onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </Box>
    </Paper>
  </Box>
)}
      {openMassTransfer && (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      bgcolor: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Paper elevation={3} sx={{ width: 420, p: 3, borderRadius: 2,bgcolor: '#292727be',color: 'white' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Mass Transfer</Typography>
        <IconButton onClick={() => setOpenMassTransfer(false)}>
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>×</span>
        </IconButton>
      </Box>

      {/* Transfer From */}
      <Typography fontWeight={500} fontSize={13} mb={1}>Transfer From</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by Emp No / Name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{mb: 2}}
      />

      {/* Reportees Table */}
      <Typography fontWeight={500} fontSize={13} mb={1}>All Reportees (5)</Typography>
      <Box sx={{ border: '1px solid #ccc', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Box sx={{ display: 'flex', bgcolor: '#292727be', p: 1 }}>
          <Box sx={{ width: '30px' }}><input type="checkbox" /></Box>
          <Box sx={{ width: '100px', fontWeight: 600 }}>Emp ID</Box>
          <Box sx={{ fontWeight: 600 }}>Employee</Box>
        </Box>
        {[
          { id: 'T0015', name: 'S Rai Kumar' },
          { id: 'T0019', name: 'Aadesh Hiralal Sonar' },
          { id: 'T0022', name: 'P Hari Hara Rao' },
          { id: 'T0014', name: 'Lipika Jena' },
          { id: 'T0044', name: 'Appy Samson' },
        ].map(emp => (
          <Box key={emp.id} sx={{ display: 'flex', alignItems: 'center', p: 1, borderTop: '1px solid #eee' }}>
            <Box sx={{ width: '30px' }}>
              <input
                type="checkbox"
                checked={selectedReportees.includes(emp.id)}
                onChange={() => {
                  setSelectedReportees(prev =>
                    prev.includes(emp.id)
                      ? prev.filter(id => id !== emp.id)
                      : [...prev, emp.id]
                  );
                }}
              />
            </Box>
            <Box sx={{ width: '100px' }}>{emp.id}</Box>
            <Box>{emp.name}</Box>
          </Box>
        ))}
      </Box>

      {/* Transfer To */}
      <Typography fontWeight={500} fontSize={13} mb={1}>Transfer To</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by Emp No / Name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
        <Button variant="outlined" onClick={() => setOpenMassTransfer(false)}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </Box>
    </Paper>
  </Box>
)}

{openAssignManager && (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      bgcolor: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Paper elevation={3} sx={{ width: 420, p: 3, borderRadius: 2,bgcolor: '#292727be',color: 'white'  }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Assign Manager</Typography>
        <IconButton onClick={() => setOpenAssignManager(false)}>
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>×</span>
        </IconButton>
      </Box>

      {/* Select Reportee */}
      <Typography fontSize={13} fontWeight={500} mb={0.5}>Select Reportee</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by Emp No / Name"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <GroupIcon sx={{ color: '#aaa' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: '#aaa' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Select Manager */}
      <Typography fontSize={13} fontWeight={500} mb={0.5}>Select Manager</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by Emp No / Name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <GroupIcon sx={{ color: '#aaa' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: '#aaa' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
        <Button variant="outlined" onClick={() => setOpenAssignManager(false)}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </Box>
    </Paper>
  </Box>
)}
    </Box>
  );
};

export default OrganizationChart;

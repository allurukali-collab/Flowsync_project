import React, {useEffect, useState } from 'react';
import {Box,Typography,Breadcrumbs,Link,Select,MenuItem,TextField,IconButton,InputAdornment,Paper,Button,Table,TableHead,TableRow,TableCell,TableBody,TableContainer,TablePagination,TableSortLabel} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Slide from '@mui/material/Slide';
import Navbar from './Navbar.js';

const AnalyticsHub = () => {
  const [payrollMonth, setPayrollMonth] = useState("Jul'25");
  const [employeeType, setEmployeeType] = useState('All');
  const [selectedCard, setSelectedCard] = useState(() => {
  return localStorage.getItem("selectedCard") || "Confirmation Dues";});
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
  const localData = JSON.parse(localStorage.getItem("employees"));
  if (localData && localData.length > 0) {
    setEmployeeList(localData);
  }
}, [selectedCard]);

  const cards = [
    'All Employee Info',
    'Confirmation Dues',
    'Recent New Joiners',
    'Total Experience Headcount',
    'Blood Group Details',
    'Basic Information',
    'Upcoming Birthdays',
  ];

  const employeeData = [
    {
      id: 'T0043',
      name: 'Rose Shah',
      doj: '12 Jun 2024',
      gender: 'Female',
      dob: '13 May 1980',
      email: 'Rose@greythr.com',
      status: 'Probation',
      confirmation: '05 Jul 2025',
    },
    {
      id: 'T0041',
      name: 'Daisy George',
      doj: '09 Jun 2024',
      gender: 'Female',
      dob: '13 Jun 1973',
      email: 'Daisy@greythr.com',
      status: 'Confirmed',
      confirmation: '30 Jun 2025',
      ageRange: '50-54',
      managerId: 'T0019',
      managerName: 'Aadesh Hiralal Sonar',
      phone: '9999999999',
      bloodGroup: 'O+',
      employmentStatus: 'Active',
      pan: 'BRNPX5859D',
      uan: '123456789',
      yearsInService: '1.01',
      yearsInServiceRange: '0 - 2'   
    },
    {
      id: 'T0044',
      name: 'Appy Samson',
      doj: '01 May 2024',
      gender: 'Female',
      dob: '08 Jul 1975',
      email: 'Appy@greythr.com',
      status: 'Confirmed',
      confirmation: '30 Jun 2025',
    },
    {
      id: 'T0014',
      name: 'Lipika Jena',
      doj: '01 Sep 2021',
      gender: 'Female',
      dob: '28 May 1982',
      email: 'Lipikajena@greythr.com',
      status: 'Confirmed',
      confirmation: '30 Jun 2025',
    },
    {
      id: 'T0015',
      name: 'Balaji S K',
      doj: '04 Jun 2025',
      gender: 'Male',
      dob: '22 Jun 1977',
      email: 'Balaji@greythr.com',
      status: 'Probation',
      confirmation: '15 Jul 2025',
    },
  ];

  const [newEmployee, setNewEmployee] = useState({
  id: '',
  name: '',
  doj: '',
  gender: '',
  dob: '',
  email: '',
  status: 'Probation',
  confirmation: '',
});

const [employeeList, setEmployeeList] = useState(() => {
  const localData = JSON.parse(localStorage.getItem("employees"));
  return localData && localData.length > 0 ? localData : employeeData;
});

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddEmployee = (newEntry) => {
  setEmployeeList([newEntry, ...employeeList]);
  setNewEmployee({
    id: '',
    name: '',
    doj: '',
    gender: '',
    dob: '',
    email: '',
    status: 'Probation',
    confirmation: '',
  });
};

  const filteredData = employeeList.filter((emp) =>
    Object.values(emp).some(val =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === 'name' || orderBy === 'email' || orderBy === 'status') {
      return order === 'asc'
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    }
    return 0;
  });

  return (
<Box>  
   <Navbar/>
<Box sx={{  bgcolor: 'transparent', overflow: 'auto', transition: '0.3s ease',width:'80%',margin:'0 auto',mt:'70px'}}>

  {/* Breadcrumb */}
  <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': {color: 'rgba(255,255,255,0.4)' },fontSize:{xs:14,md:16} }}>
    <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
    <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
    <Typography color="rgba(255,255,255,0.7)" fontWeight={600} fontSize={{xs:14,md:16}}>Analytics Hub</Typography>
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

  {/* Cards */}
  <Paper sx={{ p: 2, display: 'flex',mx: 'auto', alignItems: 'center', background: 'rgba(255, 255, 255, 0.08)',borderRadius: 2,backdropFilter: 'blur(10px)',border: '1px solid rgba(255, 255, 255, 0.2)', mb:2 }}>
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {cards.map((card, i) => (
      <Box
        key={i}
        onClick={() => {
        setSelectedCard(card);
        localStorage.setItem("selectedCard", card);}}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: selectedCard === card ? 'rgba(255,255,255,0.2)' : 'transparent',
          border: selectedCard === card ? '1px solid #90caf9' : '1px solid white',
          borderRadius: 2,
          cursor: 'pointer',
          minWidth: {xs:90,md:90},
          color: '#fff',
          backdropFilter: 'blur(6px)',
          transition: '0.3s',
        }}
      >
        <StarIcon  fontSize="20" sx={{ color: '#fdd835' }} />
        <Typography variant="body2" sx={{ color: '#fff',fontSize:{xs:10,md:14}, }}>{card}</Typography>
      </Box>
    ))}
  </Box>
  </Paper>

{selectedCard === 'All Employee Info' && (
<Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
<Paper sx={{
  p: 2,
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: 2,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <Typography fontWeight={600} color="white">All Employee Info</Typography>
    <Button variant="contained" component={RouterLink} to="/addemp">Add Employee</Button>
  </Box>

  {/* Search Field */}
  <TextField
    size="small"
    placeholder="Search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: '#fff' }} />
        </InputAdornment>
      ),
      sx: {
        borderRadius: '50px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#fff',
        pl: 1
      }
    }}
    sx={{ mb: 2, width: 200 }}
  />

  {/* Full Employee Table */}
  <TableContainer sx={{
    borderRadius: '12px',
    border: '1px solid #444',
    maxHeight: 440,
    background: 'rgba(255, 255, 255, 0.03)'
  }}>
    <Table stickyHeader size="small" >
      <TableHead >
        <TableRow sx={{height: 25}}>
          {[
            "Emp ID", "Emp Name", "DOJ", "Gender", "DOB", "Email ID", "Status", "Confirmation Date", 
            "Age Range", "Manager ID", "Manager Name", "Phone No", "Blood Group", "Emp Status", 
            "PAN No", "UAN No", "Yrs in Service", "Years in Service Range"
          ].map((label, idx) => (
            <TableCell key={idx} sx={{ color: '#000', fontWeight: 400, borderBottom: '1px solid #555',padding: '6px 8px',lineHeight: '1rem'  }}>
              {label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedData
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((emp, idx) => (
            <TableRow
              key={idx}
              sx={{
                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                borderBottom: '1px solid #444',
              }}
            >
              {/* Replace these with dynamic values when data is updated */}
              <TableCell sx={{ color: '#fff' }}>{emp.id}</TableCell>
              <TableCell sx={{ color: '#90caf9', fontWeight: 500 }}>{emp.name}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{emp.doj}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{emp.gender}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{emp.dob}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{emp.email}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{emp.status}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{emp.confirmation}</TableCell>
              <TableCell sx={{ color: '#fff' }}>40 - 44</TableCell>
              <TableCell sx={{ color: '#fff' }}>T0019</TableCell>
              <TableCell sx={{ color: '#fff' }}>Daisy George</TableCell>
              <TableCell sx={{ color: '#fff' }}>9999999999</TableCell>
              <TableCell sx={{ color: '#fff' }}>O+</TableCell>
              <TableCell sx={{ color: '#fff' }}>Active</TableCell>
              <TableCell sx={{ color: '#fff' }}>ASDFG1234J</TableCell>
              <TableCell sx={{ color: '#fff' }}>123456789</TableCell>
              <TableCell sx={{ color: '#fff' }}>1.02</TableCell>
              <TableCell sx={{ color: '#fff' }}>0 - 2</TableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  <TablePagination
    component="div"
    count={sortedData.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 25]}
    sx={{ color: '#fff' }}
  />
</Paper>
</Slide>
)}
  

  {/* Confirmation Dues Section */}
  {selectedCard === 'Confirmation Dues' && (
  <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
  <Paper sx={{
    p: 2,
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Typography fontWeight={600} color="white">Confirmation Dues</Typography>
      <Button variant="contained" component={RouterLink} to="/addemp" >Add Employee</Button>
    </Box>

    {/* Search Input */}
    <TextField
      size="small"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#fff' }} />
          </InputAdornment>
        ),
        sx: {
          borderRadius: '50px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: '#fff',
          pl: 1
        }
      }}
      sx={{ mb: 2, width: 200 }}
    />

    {/* Table */}
    <TableContainer sx={{
      borderRadius: '12px',
      border: '1px solid #444',
      maxHeight: 440,
      background: 'rgba(255, 255, 255, 0.03)'
    }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {[
              { id: 'id', label: 'Emp ID' },
              { id: 'name', label: 'Emp Name' },
              { id: 'doj', label: 'DOJ' },
              { id: 'gender', label: 'Gender' },
              { id: 'dob', label: 'DOB' },
              { id: 'email', label: 'Email ID' },
              { id: 'status', label: 'Status' },
              { id: 'confirmation', label: 'Confirmation Date' }
            ].map((column) => (
              <TableCell
                key={column.id}
                sortDirection={orderBy === column.id ? order : false}
                sx={{ color: '#000', borderBottom: '1px solid #555' }}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  sx={{ color: '#000' }}
                  onClick={() => handleRequestSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((emp, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  borderBottom: '1px solid #444',
                }}
              >
                <TableCell sx={{ color: '#fff' }}>{emp.id}</TableCell>
                <TableCell>
                  <Link underline="hover" sx={{ color: '#90caf9', fontWeight: 500 }}>
                    {emp.name}
                  </Link>
                </TableCell>
                <TableCell sx={{ color: '#fff' }}>{emp.doj}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{emp.gender}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{emp.dob}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{emp.email}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{emp.status}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{emp.confirmation}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={sortedData.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
      sx={{ color: '#fff' }}
    />
  </Paper>
  </Slide>
  )}

{/* Recent New Joiners Section */}
{selectedCard === 'Recent New Joiners' && (
  <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
  <Paper
    sx={{
      p: 2,
      background: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 2,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      mt: 3,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Typography fontWeight={600} color="white">
        Recent New Joiners
      </Typography>
      <Button variant="contained" component={RouterLink} to="/addemp">Add Employee</Button>
    </Box>

    {/* Search (optional) */}
    <TextField
      size="small"
      placeholder="Search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#fff' }} />
          </InputAdornment>
        ),
        sx: {
          borderRadius: '50px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: '#fff',
          pl: 1
        }
      }}
      sx={{ mb: 2, width: 200 }}
    />

    {/* Table */}
    <TableContainer
      sx={{
        borderRadius: '12px',
        border: '1px solid #444',
        maxHeight: 440,
        background: 'rgba(255, 255, 255, 0.03)',
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {[
              { id: 'id', label: 'Emp ID' },
              { id: 'name', label: 'Emp Name' },
              { id: 'doj', label: 'DOJ' },
              { id: 'gender', label: 'Gender' },
              { id: 'dob', label: 'DOB' },
              { id: 'email', label: 'Email ID' },
              { id: 'status', label: 'Status' },
              { id: 'confirmation', label: 'Confirmation Date' },
            ].map((column) => (
              <TableCell
                key={column.id}
                sx={{ color: '#000', borderBottom: '1px solid #555' }}
              >
                <TableSortLabel sx={{ color: '#000' }}>
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Show "No Rows" Placeholder */}
          <TableRow>
            <TableCell colSpan={8}>
              <Typography
                align="center"
                sx={{ color: '#fff', py: 2, fontStyle: 'italic' }}
              >
                No Rows to Show
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

    {/* Optional Pagination (disabled for now) */}
    <TablePagination
      component="div"
      count={0}
      page={0}
      onPageChange={() => {}}
      rowsPerPage={5}
      rowsPerPageOptions={[5, 10, 25]}
      onRowsPerPageChange={() => {}}
      sx={{ color: '#fff' }}
    />
  </Paper>
  </Slide>
)}

{/* total Experience Headcount Section */}
{selectedCard === 'Total Experience Headcount' && (
  <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
    <Box>
      <Paper sx={{
        p: 2,
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontWeight={600} color="white">Total Experience Headcount</Typography>
          <Button variant="contained"component={RouterLink} to="/addemp" >Add Employee</Button>
        </Box>

        {/* Search Input */}
        <TextField
          size="small"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '50px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              pl: 1
            }
          }}
          sx={{ mb: 2, width: 200 }}
        />

        {/* Experience Headcount Table */}
        <TableContainer sx={{
          borderRadius: '12px',
          border: '1px solid #444',
          maxHeight: 440,
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#000', borderBottom: '1px solid #555' }}>
                  Group
                </TableCell>
                <TableCell sx={{ color: '#000', borderBottom: '1px solid #555' }}>
                  count(Emp ID)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { group: '0 - 2', count: 14 },
                { group: '3 - 5', count: 5 },
                { group: '6 - 9', count: 2 },
                { group: '10 - 14', count: 1 }
              ].map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                    borderBottom: '1px solid #444',
                  }}
                >
                  <TableCell sx={{ color: '#fff' }}>{row.group}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  </Slide>
)}

{/* Blood Group Deatils Section */}
{selectedCard === 'Blood Group Details' && (
  <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
    <Box>
      <Paper sx={{
        p: 2,
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontWeight={600} color="white">Blood Group Details</Typography>
          <Button variant="contained" component={RouterLink} to="/addemp">Add Employee</Button>
        </Box>

        {/* Search Input */}
        <TextField
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '50px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              pl: 1
            }
          }}
          sx={{ mb: 2, width: 200 }}
        />

        {/* Table */}
        <TableContainer sx={{
          borderRadius: '12px',
          border: '1px solid #444',
          maxHeight: 440,
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  { id: 'id', label: 'Emp ID' },
                  { id: 'name', label: 'Emp Name' },
                  { id: 'doj', label: 'DOJ' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'dob', label: 'DOB' },
                  { id: 'email', label: 'Email ID' },
                  { id: 'status', label: 'Status' },
                  { id: 'phone', label: 'Phone No.' },
                  { id: 'bloodGroup', label: 'Blood Group' },
                  { id: 'ageRange', label: 'Age Range' }
                ].map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{ color: '#000', borderBottom: '1px solid #555' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((emp, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                        borderBottom: '1px solid #444',
                      }}
                    >
                      <TableCell sx={{ color: '#fff' }}>{emp.id}</TableCell>
                      <TableCell>
                        <Link href="#" underline="hover" sx={{ color: '#90caf9', fontWeight: 500 }}>
                          {emp.name}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.doj}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.gender}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.dob}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.email}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.status}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.phone || '-'}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.bloodGroup || '-'}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.ageRange || '-'}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', color: '#aaa', py: 5 }}>
                    No Rows to Show
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ color: '#fff' }}
        />
      </Paper>
    </Box>
  </Slide>
)}

{/* Basic Information Section */}
{selectedCard === 'Basic Information' && (
  <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
    <Box>
      <Paper sx={{
        p: 2,
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontWeight={600} color="white">Basic Information</Typography>
          <Button variant="contained" component={RouterLink} to="/addemp">Add Employee</Button>
        </Box>

        {/* Search Input */}
        <TextField
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '50px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              pl: 1
            }
          }}
          sx={{ mb: 2, width: 200 }}
        />

        {/* Table */}
        <TableContainer sx={{
          borderRadius: '12px',
          border: '1px solid #444',
          maxHeight: 440,
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  { id: 'id', label: 'Emp ID' },
                  { id: 'name', label: 'Emp Name' },
                  { id: 'doj', label: 'DOJ' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'dob', label: 'DOB' },
                  { id: 'email', label: 'Email ID' },
                  { id: 'managerId', label: 'Manager ID' },
                  { id: 'managerName', label: 'Manager Name' },
                  { id: 'employmentStatus', label: 'Employment Status' },
                ].map((column) => (
                  <TableCell key={column.id} sx={{ color: '#000', borderBottom: '1px solid #555' }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((emp, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                        borderBottom: '1px solid #444',
                      }}
                    >
                      <TableCell sx={{ color: '#fff' }}>{emp.id}</TableCell>
                      <TableCell>
                        <Link underline="hover" sx={{ color: '#90caf9', fontWeight: 500 }}>
                          {emp.name}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.doj}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.gender}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.dob}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.email}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.managerId || '-'}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.managerName || '-'}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Active</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', color: '#aaa', py: 5 }}>
                    No Rows to Show
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ color: '#fff' }}
        />
      </Paper>
    </Box>
  </Slide>
)}

{/* Upcoming Birthdays Section */}
{selectedCard === 'Upcoming Birthdays' && (
  <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
    <Box>
      <Paper sx={{
        p: 2,
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontWeight={600} color="white">Upcoming Birthdays</Typography>
          <Button variant="contained" component={RouterLink} to="/addemp">Add Employee</Button>
        </Box>

        {/* Search Field */}
        <TextField
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '50px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              pl: 1
            }
          }}
          sx={{ mb: 2, width: 200 }}
        />

        {/* Table */}
        <TableContainer sx={{
          borderRadius: '12px',
          border: '1px solid #444',
          maxHeight: 440,
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  { id: 'id', label: 'Emp ID' },
                  { id: 'name', label: 'Emp Name' },
                  { id: 'doj', label: 'DOJ' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'dob', label: 'DOB' },
                  { id: 'email', label: 'Email ID' },
                  { id: 'ageRange', label: 'Age Range' },
                  { id: 'age', label: 'Age' },
                  { id: 'phone', label: 'Phone Number' },
                ].map((column) => (
                  <TableCell key={column.id} sx={{ color: '#000', borderBottom: '1px solid #555' }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((emp, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                        borderBottom: '1px solid #444',
                      }}
                    >
                      <TableCell sx={{ color: '#fff' }}>{emp.id}</TableCell>
                      <TableCell>
                        <Link href="#" underline="hover" sx={{ color: '#90caf9', fontWeight: 500 }}>
                          {emp.name}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.doj}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.gender}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.dob}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.email}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.ageRange || '-'}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.age || '-'}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{emp.phone || '-'}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', color: '#aaa', py: 5 }}>
                    No Rows to Show
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ color: '#fff' }}
        />
      </Paper>
    </Box>
  </Slide>
)}

</Box>
</Box>
  );
};

export default AnalyticsHub;

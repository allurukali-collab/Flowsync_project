import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Paper, TextField, InputAdornment,
  Select, MenuItem, Menu, Button, Breadcrumbs, Link, Tooltip, Drawer, Accordion, AccordionSummary, AccordionDetails, useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Groups';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link as RouterLink } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Info from './Info';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

const UpdateEmp = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [payrollMonth, setPayrollMonth] = useState(dayjs().format("MMM YYYY"));
  const [mainAnchorEl, setMainAnchorEl] = useState(null);
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const openMainMenu = Boolean(mainAnchorEl);
  const openInfoMenu = Boolean(infoAnchorEl);
  const [employeeType, setEmployeeType] = useState('Current Employees');

  const handleEmployeeSearch = async () => {
    const query = searchQuery.trim();

    if (!query) {
      setShowInfo(false);
      setEmployeeData(null);
      setSearchError("");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");
      setShowInfo(false);
      setEmployeeData(null);

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/employee/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const employees = await response.json();

      const foundEmployee = employees.find((employee) => {
        const employeeId = String(employee.employeeId || "").toLowerCase();
        const name = String(employee.name || "").toLowerCase();
        const email = String(employee.email || "").toLowerCase();
        const searchValue = query.toLowerCase();

        return (
          employeeId === searchValue ||
          name.includes(searchValue) ||
          email.includes(searchValue)
        );
      });

      if (!foundEmployee) {
        setSearchError("Employee not found in company records");
        setShowInfo(false);
        setEmployeeData(null);
        return;
      }

      setEmployeeData(foundEmployee);
      setShowInfo(true);
    } catch (error) {
      console.error("Employee search error:", error);
      setSearchError("Unable to search employee. Please check backend is running.");
      setShowInfo(false);
      setEmployeeData(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const handleMainMenuClick = (event) => setMainAnchorEl(event.currentTarget);
  const handleMainMenuClose = () => setMainAnchorEl(null);

  const handleInfoMenuClick = (event) => setInfoAnchorEl(event.currentTarget);
  const handleInfoMenuClose = () => setInfoAnchorEl(null);

  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const openSettingsMenu = Boolean(settingsAnchorEl);

  const handleSettingsMenuClick = (event) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsMenuClose = () => setSettingsAnchorEl(null);

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const openAdminMenu = Boolean(adminAnchorEl);

  const [setupAnchorEl, setSetupAnchorEl] = useState(null);
  const openSetupMenu = Boolean(setupAnchorEl);

  const [activeTab, setActiveTab] = useState('Employee');
  const [employeeHovered, setEmployeeHovered] = useState(false);

  const navButtonStyle = (tabName) => ({
    color: activeTab === tabName ? 'white' : 'white',
    backgroundColor: activeTab === tabName ? 'rgba(39, 37, 37, 0.74)' : 'transparent',
    fontWeight: activeTab === tabName ? 600 : 500,
    textTransform: 'none',
    borderRadius: 2,
    px: 2,
    py: 0.5,
    '&:hover': {
      backgroundColor: 'rgba(39, 37, 37, 0.74)',
    },
  });

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prev) => [...prev, inputValue, 'Thank you for reaching out!']);
      setInputValue('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <Box sx={{ backgroundColor: 'transparent', minHeight: { xs: '50vh', md: '100vh' } }}>
        {/* Navbar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(39, 37, 37, 0.74)',
          }}
        >
          <Toolbar >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <Typography variant="h6" sx={{ color: 'grey', fontWeight: "bold" }}>FlowSync</Typography>
              {!isMobile && (
                <Box sx={{ display: 'flex', gap: 1 }}>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box
                      onMouseEnter={() => setEmployeeHovered(true)}
                      onMouseLeave={() => setEmployeeHovered(false)}
                      sx={{ position: 'relative' }}
                    >
                      <Button sx={navButtonStyle('Employee')} onClick={() => setActiveTab('Employee')} >
                        Employee
                      </Button>

                      {employeeHovered && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            boxShadow: 3,
                            whiteSpace: 'nowrap',
                            mt: 1,
                            zIndex: 10,
                            fontSize: '13px',
                            fontWeight: 500,
                          }}
                        >
                          Employee Overview
                        </Box>
                      )}
                    </Box>


                    {/* MAIN */}
                    <Box
                      onMouseEnter={(e) => {
                        setMainAnchorEl(e.currentTarget);
                        setActiveTab('Main');
                      }}
                      onMouseLeave={() => setMainAnchorEl(null)}
                    >
                      <Button sx={navButtonStyle('Main')} >
                        Main
                        <KeyboardArrowDownIcon
                          sx={{
                            transform: openMainMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            color: activeTab === 'Main' ? 'white' : 'white'
                          }}
                        />
                      </Button>
                      <Menu
                        anchorEl={mainAnchorEl}
                        open={openMainMenu}
                        onClose={() => setMainAnchorEl(null)}
                        MenuListProps={{
                          onMouseEnter: () => setMainAnchorEl(mainAnchorEl),
                          onMouseLeave: () => setMainAnchorEl(null),
                        }}
                        PaperProps={{
                          sx: {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                          }
                        }}
                      >
                        <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/analytics') }} sx={{
                          "&:hover": {
                            bgcolor: "rgba(25,118,210,0.2)",
                            borderLeft: "4px solid transparent",
                            borderLeftColor: "primary.light",
                          }
                        }} >Analytics Hub</MenuItem>
                        <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/organizationchart') }} sx={{
                          "&:hover": {
                            bgcolor: "rgba(25,118,210,0.2)",
                            borderLeft: "4px solid transparent",
                            borderLeftColor: "primary.light",
                          }
                        }}>Organization Chart</MenuItem>
                      </Menu>
                    </Box>

                    {/* INFORMATION
  <Box
    onMouseEnter={(e) => {
      setInfoAnchorEl(e.currentTarget);
      setActiveTab('Information');
    }}
    onMouseLeave={() => setInfoAnchorEl(null)}
  >
    <Button sx={navButtonStyle('Information')}>
      Information
      <KeyboardArrowDownIcon
        sx={{
          transform: openInfoMenu ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          color: activeTab === 'Information' ? 'white' : 'white'
        }}
      />
    </Button>
    <Menu
      anchorEl={infoAnchorEl}
      open={openInfoMenu}
      onClose={() => setInfoAnchorEl(null)}
      MenuListProps={{
        onMouseEnter: () => setInfoAnchorEl(infoAnchorEl),
        onMouseLeave: () => setInfoAnchorEl(null),
      }}
      PaperProps={{
      sx: {
      backgroundColor: 'rgba(0,0,0,0.7)', // dropdown background black
      color: 'white',          // menu item text white
    }
  }}
    >
      <MenuItem onClick={() => {setMainAnchorEl(null); navigate('/bank')}} sx={{"&:hover": {
        bgcolor: "rgba(25,118,210,0.2)",
         borderLeft: "4px solid transparent",
        borderLeftColor: "primary.light",
      }}}>Bank/PF/ESI</MenuItem>
      <MenuItem onClick={() => {setMainAnchorEl(null); navigate('/familydetails')}} sx={{"&:hover": {
        bgcolor: "rgba(25,118,210,0.2)",
         borderLeft: "4px solid transparent",
        borderLeftColor: "primary.light",
      }}}>Family Details</MenuItem>
      <MenuItem onClick={() => {setMainAnchorEl(null); navigate('/positionhistory')}} sx={{"&:hover": {
        bgcolor: "rgba(25,118,210,0.2)",
         borderLeft: "4px solid transparent",
        borderLeftColor: "primary.light",
      }}}>Position History</MenuItem>
      <MenuItem onClick={() => {setMainAnchorEl(null); navigate('/previousemp')}} sx={{"&:hover": {
        bgcolor: "rgba(25,118,210,0.2)",
         borderLeft: "4px solid transparent",
        borderLeftColor: "primary.light",
      }}}>Previous Employment</MenuItem>
      <MenuItem onClick={() => {setMainAnchorEl(null); navigate('/separation')}} sx={{"&:hover": {
        bgcolor: "rgba(25,118,210,0.2)",
         borderLeft: "4px solid transparent",
        borderLeftColor: "primary.light",
      }}}>Separation</MenuItem>
      <MenuItem onClick={() => {setMainAnchorEl(null); navigate('/carddetails')}} sx={{"&:hover": {
        bgcolor: "rgba(25,118,210,0.2)",
         borderLeft: "4px solid transparent",
        borderLeftColor: "primary.light",
      }}}>Access Card Deatils</MenuItem>
      <MenuItem onClick={() => {setMainAnchorEl(null); navigate('/empdoc')}} sx={{"&:hover": {
        bgcolor: "rgba(25,118,210,0.2)",
         borderLeft: "4px solid transparent",
        borderLeftColor: "primary.light",
      }}}>Employmee Documents</MenuItem>
    </Menu>
  </Box> */}

                    {/* ADMIN */}
                    <Box
                      onMouseEnter={(e) => {
                        setAdminAnchorEl(e.currentTarget);
                        setActiveTab('Admin');
                      }}
                      onMouseLeave={() => setAdminAnchorEl(null)}
                    >
                      <Button sx={navButtonStyle('Admin')}>
                        Admin
                        <KeyboardArrowDownIcon
                          sx={{
                            transform: openAdminMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            color: activeTab === 'Admin' ? 'white' : 'white'
                          }}
                        />
                      </Button>
                      <Menu
                        anchorEl={adminAnchorEl}
                        open={openAdminMenu}
                        onClose={() => setAdminAnchorEl(null)}
                        MenuListProps={{
                          onMouseEnter: () => setAdminAnchorEl(adminAnchorEl),
                          onMouseLeave: () => setAdminAnchorEl(null),
                        }}
                        PaperProps={{
                          sx: {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                          }
                        }}
                      >
                        <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/letter') }} sx={{
                          "&:hover": {
                            bgcolor: "rgba(25,118,210,0.2)",
                            borderLeft: "4px solid transparent",
                            borderLeftColor: "primary.light",
                          }
                        }}>General Letter </MenuItem>
                        <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/excelimport') }} sx={{
                          "&:hover": {
                            bgcolor: "rgba(25,118,210,0.2)",
                            borderLeft: "4px solid transparent",
                            borderLeftColor: "primary.light",
                          }
                        }}>Excel Import</MenuItem>
                        <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/bulletin') }} sx={{
                          "&:hover": {
                            bgcolor: "rgba(25,118,210,0.2)",
                            borderLeft: "4px solid transparent",
                            borderLeftColor: "primary.light",
                          }
                        }}>Bulletin Board</MenuItem>
                        <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/masscom') }} sx={{
                          "&:hover": {
                            bgcolor: "rgba(25,118,210,0.2)",
                            borderLeft: "4px solid transparent",
                            borderLeftColor: "primary.light",
                          }
                        }}>Mass Communication</MenuItem>
                      </Menu>
                    </Box>

                    {/* SETUP */}
                    <Box
                      onMouseEnter={(e) => {
                        setSetupAnchorEl(e.currentTarget);
                        setActiveTab('Setup');
                      }}
                      onMouseLeave={() => setSetupAnchorEl(null)}
                    >
                      <Button sx={navButtonStyle('Setup')}>
                        Setup
                        <KeyboardArrowDownIcon
                          sx={{
                            transform: openSetupMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            color: activeTab === 'Setup' ? 'white' : 'white'
                          }}
                        />
                      </Button>
                      <Menu
                        anchorEl={setupAnchorEl}
                        open={openSetupMenu}
                        onClose={() => setSetupAnchorEl(null)}
                        MenuListProps={{
                          onMouseEnter: () => setSetupAnchorEl(setupAnchorEl),
                          onMouseLeave: () => setSetupAnchorEl(null),
                        }}
                        PaperProps={{
                          sx: {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                          }
                        }}
                      >
                        <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/company') }} sx={{
                          "&:hover": {
                            bgcolor: "rgba(25,118,210,0.2)",
                            borderLeft: "4px solid transparent",
                            borderLeftColor: "primary.light",
                          }
                        }}>Company Ploicies & Forms</MenuItem>
                      </Menu>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#fff' }}>
                <MenuIcon />
              </IconButton>
            )}

            <Tooltip title="Logout" onClick={() => { navigate('/welcome') }}>
              <IconButton sx={{ color: 'error.light' }} >
                <LogoutIcon />
              </IconButton>
            </Tooltip>

          </Toolbar>
        </AppBar>

        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              width: 250,
              bgcolor: 'rgba(20, 20, 20, 0.95)',
              color: '#fff',
              p: 2,
              height: 450
            }
          }}
        >
          <Box>
            <Accordion sx={{ bgcolor: 'transparent', color: '#fff' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
                Employee
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ cursor: 'pointer' }}>Employee Overview</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'transparent', color: '#fff' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
                Main
              </AccordionSummary>
              <AccordionDetails>
                <Typography onClick={() => { navigate('/analytics'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Analytics Hub</Typography>
                <Typography onClick={() => { navigate('/organizationchart'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Organization Chart</Typography>
              </AccordionDetails>
            </Accordion>

            {/* <Accordion sx={{ bgcolor: 'transparent', color: '#fff' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
        Information
      </AccordionSummary>
      <AccordionDetails>
        <Typography onClick={() => { navigate('/bank'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Bank/PF/ESI</Typography>
        <Typography onClick={() => { navigate('/familydetails'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Family Details</Typography>
        <Typography onClick={() => { navigate('/positionhistory'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Position History</Typography>
        <Typography onClick={() => { navigate('/previousemp'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Previous Employment</Typography>
        <Typography onClick={() => { navigate('/separation'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Separation</Typography>
        <Typography onClick={() => { navigate('/carddetails'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Access Card Details</Typography>
        <Typography onClick={() => { navigate('/empdoc'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Employee Documents</Typography>
      </AccordionDetails>
    </Accordion> */}

            <Accordion sx={{ bgcolor: 'transparent', color: '#fff' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
                Admin
              </AccordionSummary>
              <AccordionDetails>
                <Typography onClick={() => { navigate('/letter'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>General Letter</Typography>
                <Typography onClick={() => { navigate('/excelimport'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Excel Import</Typography>
                <Typography onClick={() => { navigate('/bulletin'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Bulletin Board</Typography>
                <Typography onClick={() => { navigate('/masscom'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Mass Communication</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'transparent', color: '#fff' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
                Setup
              </AccordionSummary>
              <AccordionDetails>
                <Typography onClick={() => { navigate('/company'); setMobileOpen(false); }} sx={{ cursor: 'pointer' }}>Company Policies & Forms</Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Drawer>

        {/* Page Content */}
        <Box pt={7}  >
          <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
            {/* Breadcrumb and Filters in One Row */}
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              gap={2}
              sx={{ mb: 1 }}
            >
              <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' }, fontSize: { xs: 13, md: 16 } }}>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
                <Typography color="rgba(255,255,255,0.4)" fontSize={{ xs: 12, md: 16 }}>{activeTab}</Typography>
              </Breadcrumbs>

              <Box display="flex" gap={1} alignItems="center">
                {/* Month Picker */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  px: 2,
                  py: 0.4,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  width: { xs: '150px', sm: '150px' }
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
                            color: '#fff',
                            '& .MuiSvgIcon-root': { color: '#fff' }
                          }
                        },
                        inputProps: {
                          style: {
                            fontSize: '12px',
                            padding: '6px 4px',
                            color: '#fff'
                          },
                          placeholder: ''
                        },
                      },
                    }}
                  />
                </Box>

                {/* Employee Type Dropdown */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  px: 2,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  width: { xs: '100px', sm: 'auto' }
                }}>
                  <GroupIcon sx={{ mr: 1, color: '#ddd' }} />
                  <Select
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    variant="standard"
                    disableUnderline
                    sx={{ color: '#fff', '& .MuiSelect-icon': { color: '#fff' } }}
                  >
                    <MenuItem value="No Options" disabled>No Options</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Search Section */}
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', width: '80%', maxWidth: '900px', mx: 'auto', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <Box width="100%" maxWidth="500px">
              <Typography fontWeight="bold" fontSize={{ xs: 12, md: 18 }} mb={1} color="white">
                Start searching to see specific employee details here
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="body2" mb={1} color="white" fontSize={{ xs: 12, md: 14 }}>
                  Employee Type:  </Typography>
                <Select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  size="small"
                  variant="standard"
                  disableUnderline
                  sx={{
                    color: 'white',
                    fontSize: { xs: 12, md: 14 },
                    backgroundColor: 'transparent',
                    '& .MuiSelect-icon': { color: 'white' }
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Current Employees">Current Employees</MenuItem>
                  <MenuItem value="Reassigned Employees">Resigned Employees</MenuItem>
                </Select>
              </Box>

              <TextField
                fullWidth
                placeholder="Search by Emp No/ Name"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEmployeeSearch();
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    width: { xs: 200, md: 300 },
                    color: 'white',
                    '& input': {
                      color: 'white',
                      '::placeholder': {
                        color: 'white',
                        opacity: 0.2,
                        fontSize: { xs: 12, md: 14 }
                      },
                    },
                    '& fieldset': {
                      borderColor: 'white',
                      borderRadius: '20px',

                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& input::placeholder': {
                    color: 'white',
                    opacity: 1,
                  }
                }}
              />

              {searchLoading && (
                <Typography color="white" fontSize={{ xs: 12, md: 14 }} mt={1}>
                  Searching employee...
                </Typography>
              )}

              {searchError && (
                <Typography color="error.light" fontSize={{ xs: 12, md: 14 }} mt={1}>
                  {searchError}
                </Typography>
              )}
            </Box>
            <Box>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmxvVgUbUVuW7In4M3VxZYEuGl29BoYeO9QA&s"
                alt="illustration"
                style={{ maxWidth: '75%', height: 'auto' }}
              />
            </Box>
          </Paper>
        </Box>
        {showInfo && employeeData && (
          <Box maxWidth="1000px" mx="auto">
            <Info employee={employeeData} />
          </Box>
        )}

      </Box>
    </LocalizationProvider>
  );
};

export default UpdateEmp;
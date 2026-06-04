import React, { useState, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import MuiLink from '@mui/material/Link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Stack,
  Paper,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  Collapse,
  Breadcrumbs
} from "@mui/material";
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  PowerSettingsNew as PowerIcon,
  KeyboardArrowDown as ArrowIcon,
  KeyboardArrowRight as ArrowRightIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";

const EMPLOYEES = [
  { id: "T0018", name: "Palak", joinDate: "10 May 2013", dob: "20 Nov 1986", location: "Mumbai", leavingDate: "25 Jun 2025", processedOn: "04 Jun 2025 10:13 AM" },
  { id: "T0022", name: "Pranali", joinDate: "03 Mar 2020", dob: "15 Jan 2000", location: "Bangalore", leavingDate: "-", processedOn: "04 Jun 2025 10:13 AM" },
  { id: "T0023", name: "Om", joinDate: "03 Mar 2019", dob: "20 Jan 1990", location: "Pune", leavingDate: "-", processedOn: "04 Jun 2025 10:13 AM" },
  { id: "T0024", name: "Ravi", joinDate: "15 Jul 2021", dob: "10 Dec 1992", location: "Delhi", leavingDate: "-", processedOn: "04 Jun 2025 10:13 AM" },
  { id: "T0025", name: "Priya", joinDate: "22 Sep 2018", dob: "08 May 1988", location: "Chennai", leavingDate: "-", processedOn: "04 Jun 2025 10:13 AM" },
];

const COMPONENTS = [
  { group: "NET PAY", label: "Net Pay", value: 32460.0 },
  { group: "GROSS", label: "Gross", value: 38333.0 },
  { group: "TOTAL DEDUCTIONS", label: "Total Deductions", value: -5873.0 },
  { group: "SALARY MASTER", label: "Salary Master", value: 38333.0 },
  { group: "CALCULATION FIELDS", label: "Calculation Fields", value: 0.0 },
  { group: "CTC ITEMS", label: "CTC Items", value: 0.0 },
  { group: "PF RELATED ITEMS", label: "PF Related Items", value: 0.0 },
  { group: "ESI RELATED ITEMS", label: "ESI Related Items", value: 0.0 }
];

export default function SalaryUpdate() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState({});
const [activeTab, setActiveTab] = useState('');
  const [employeeType, setEmployeeType] = useState("Current");
  const [employee, setEmployee] = useState(null);
  const [compFilter, setCompFilter] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});

  // Filter components by search term
  const filteredComponents = useMemo(() => {
    if (!compFilter) return COMPONENTS;
    return COMPONENTS.filter(
      (comp) =>
        comp.label.toLowerCase().includes(compFilter.toLowerCase()) ||
        comp.group.toLowerCase().includes(compFilter.toLowerCase())
    );
  }, [compFilter]);

  // Group components by group name
  const groupedComponents = useMemo(() => {
    const groups = {};
    filteredComponents.forEach((comp) => {
      if (!groups[comp.group]) {
        groups[comp.group] = [];
      }
      groups[comp.group].push(comp);
    });
    return groups;
  }, [filteredComponents]);

  const handleOpen = (key) => (e) =>
    setAnchorEl((prev) => ({ ...prev, [key]: e.currentTarget }));
  const handleClose = (key) => () =>
    setAnchorEl((prev) => ({ ...prev, [key]: null }));

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const formatValue = (value) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age;
  };

  const menus = {
    payrollInputs: [
      "Salary",
      "Loan",
      "Income Tax",
      "Reimbursement",
      "Employee LOP Days",
      "Stop Salary Processing",
      "Arrears",
      "Final Settlement",
    ],
    process: ["Payroll Process"],
    verify: ["Quick Salary Statement", "Payroll Statement"],
    payout: ["Bank Transfer", "Payslips"],
    publishedInfo: [
      "Payslip",
      "CTC Payslip",
      "YTD Summary",
      "Loan Statement",
      "IT Statement",
    ],
    admin: [
      "Form 16",
      "Form24Q",
      "Employee IT Declaration",
      "POI Overview",
      "FBP Planner",
    ],
  };

  const renderMenu = (key) => (
    <Menu
      anchorEl={anchorEl[key]}
      open={Boolean(anchorEl[key])}
      onClose={handleClose(key)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
          color: "grey",
          bgcolor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          "& .MuiMenuItem-root": {
            px: 3,
            py: 1,
            borderLeft: "4px solid transparent",
            transition: "all .2s ease",
            "&:hover": {
              bgcolor: "rgba(25,118,210,0.2)",
              color: "common.white",
              borderLeftColor: "primary.main",
            },
          },
        },
      }}
    >
      {menus[key].map((item) => (
        <MenuItem key={item} 
         component={key === 'payrollInputs' && (item === 'Salary' || item === 'Loan') ? RouterLink : undefined}
          to={
            key === 'payrollInputs' && item === 'Salary'
              ? '/salary'
              : key === 'payrollInputs' && item === 'Loan'
              ? '/loan'
              : undefined
          }          
        onClick={handleClose(key)}>
          {item}
        </MenuItem>
      ))}
    </Menu>
  );



  return (
    <Box
      sx={{
        minHeight: "100vh",
        
      }}
    >
      {/* Keep existing navbar exactly as it was */}
        <AppBar position="sticky" sx={{ position: 'sticky', top: 0, zIndex: 1100,bgcolor: "rgba(27, 26, 26, 0.92)", boxShadow: "none" }}>
        <Toolbar sx={{ px: 2 }}>
          {/* Logo */}
          <Typography variant="h6" sx={{ mr: 4, fontWeight: "bold", color: "grey" }}>
            FlowSync
          </Typography>

          {/* Navbar */}
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, overflowX: "auto" }}>
            {/* Always show Payroll */}
            <Button
              sx={{
                textTransform: "none",
                bgcolor: "rgba(255,246,246,0.29)",
                color: "black",
              }}
            >
              Payroll
            </Button>

            {/* Desktop: show all menus inline */}
            {!isMobile &&
              Object.keys(menus).map((key) => (
                <Box key={key}>
                  <Button
                    endIcon={<ArrowIcon />}
                    sx={{ color: "white", textTransform: "none" }}
                    onClick={handleOpen(key)}
                  >
                    {
                      {
                        payrollInputs: "Payroll Inputs",
                        process: "Process",
                        verify: "Verify",
                        payout: "Payout",
                        publishedInfo: "Published Info",
                        admin: "Admin",
                      }[key]
                    }
                  </Button>
                  {renderMenu(key)}
                </Box>
              ))}

            {/* Mobile: collapse rest under More */}
            {isMobile && (
              <Box>
                <Button
                  endIcon={<ArrowIcon />}
                  sx={{ color: "white", textTransform: "none" }}
                  onClick={handleOpen("more")}
                >
                  More
                </Button>
                <Menu
                  anchorEl={anchorEl.more}
                  open={Boolean(anchorEl.more)}
                  onClose={handleClose("more")}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  PaperProps={{
                    sx: {
                      color: "grey",
                      bgcolor: "rgba(0,0,0,0.85)",
                      backdropFilter: "blur(8px)",
                      "& .MuiMenuItem-root": {
                        color: "common.white",
                        px: 3,
                        py: 1,
                        transition: "all 0.2s ease",
                        borderLeft: "4px solid transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        "&:hover": {
                          bgcolor: "rgba(25,118,210,0.2)",
                          borderLeftColor: "primary.light",
                        },
                      },
                    },
                  }}
                >
                  {Object.keys(menus).map((key) => (
                    <MenuItem key={key} onClick={handleOpen(key)}>
                      {
                        {
                          payrollInputs: "Payroll Inputs",
                          process: "Process",
                          verify: "Verify",
                          payout: "Payout",
                          publishedInfo: "Published Info",
                          admin: "Admin",
                        }[key]
                      }
                      <ArrowRightIcon fontSize="small" />
                    </MenuItem>
                  ))}
                </Menu>
                {/* Nested submenus */}
                {Object.keys(menus).map((key) => renderMenu(key))}
              </Box>
            )}
          </Stack>

          {/* Right icons */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ color: "white" }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <SettingsIcon />
            </IconButton>
            <IconButton sx={{ color: "error.light" }}>
              <PowerIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box sx={{ p:2, bgcolor:"rgba(39, 37, 37, 0.38)" }}>
        <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ '& .MuiBreadcrumbs-separator':{ color:"rgba(255,255,255,0.4)" } }}>
          <MuiLink underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</MuiLink>
          <MuiLink underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updatepayroll">Payroll</MuiLink>
          <MuiLink underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/salary">Salary Update</MuiLink>
          <Typography color="rgba(255,255,255,0.4)">{activeTab}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 4,
            bgcolor: "rgba(30, 41, 59, 0.3)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(71, 85, 105, 0.3)",
            borderRadius: 4,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 4,
              alignItems: "flex-start",
            }}
          >
            {/* Left side - Search and form */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "white",
                  mb: 3,
                }}
              >
                Start searching to see specific employee details here:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", sm: 200 },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiSelect-select": {
                      color: "white",
                    },
                    "& .MuiSelect-icon": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "rgba(30, 41, 59, 0.69)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(71, 85, 105, 0.3)",
                        "& .MuiMenuItem-root": {
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(71, 85, 105, 0.3)",
                          },
                        },
                      },
                    },
                  }}
                >
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    value={employeeType}
                    label="Employee Type"
                    onChange={(e) => setEmployeeType(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Current">Current Employees</MenuItem>
                    <MenuItem value="Resigned">Resigned Employees</MenuItem>
                  </Select>
                </FormControl>

                <Autocomplete
                  size="small"
                  sx={{
                    flex: 1,
                    minWidth: { width:350, },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                  }}
                  options={EMPLOYEES}
                  getOptionLabel={(opt) => `${opt.name} — #${opt.id}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search by Emp No/Name"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  PaperComponent={({ children, ...props }) => (
                    <Paper
                      {...props}
                      sx={{
                        bgcolor: "rgba(30, 41, 59, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(71, 85, 105, 0.3)",
                        "& .MuiAutocomplete-option": {
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(71, 85, 105, 0.3)",
                          },
                          "&[aria-selected='true']": {
                            bgcolor: "rgba(59, 130, 246, 0.3)",
                          },
                        },
                      }}
                    >
                      {children}
                    </Paper>
                  )}
                  onChange={(e, val) => setEmployee(val)}
                />
              </Box>

              {/* Employee selection confirmation */}
              {employee && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    bgcolor: "rgba(30, 58, 138, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography sx={{ color: "white", fontWeight: 500 }}>
                      {employee.name} #{employee.id}
                    </Typography>
                    <Typography
                      sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem" }}
                    >
                      Payroll Processed On: {employee.processedOn}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "rgba(59, 130, 246, 0.5)",
                        color: "rgba(168, 181, 201, 0.8)",
                        "&:hover": {
                          bgcolor: "rgba(30, 58, 138, 0.3)",
                          borderColor: "rgba(59, 130, 246, 0.8)",
                        },
                      }}
                    >
                      Preview Payslip
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "rgba(59, 130, 246, 0.5)",
                        color: "rgba(168, 181, 201, 0.8)",
                        "&:hover": {
                          bgcolor: "rgba(30, 58, 138, 0.3)",
                          borderColor: "rgba(59, 130, 246, 0.8)",
                        },
                      }}
                    >
                      Update Salary
                    </Button>
                    <Button
                      size="small"
                      sx={{
                        bgcolor: "rgba(59, 130, 246, 0.8)",
                        color:"white",
                        "&:hover": {
                          bgcolor: "rgba(59, 130, 246, 1)",
                          color:"white",
                        },
                      }}
                    >
                      Process Payroll
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            {/* { Right side - Illustration */}
            {/* <Box sx={{ width: { lg: 320 } }}>
              <PayrollIllustration />
            </Box> */}
          </Box> 
        </Paper>

        {/* Employee Details Section */}
        {employee && (
           <Box
    component="section"
    sx={{
      width: '100vw',               // span the full viewport
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',          // recentre
      marginRight: '-50vw',
      px: { xs: 2, md: 4 },         // optional inner padding
      mt: 4
    }}>
            <Grid container spacing={3}>
              {/* Component Breakdown - Left Side */}
              <Grid item xs={12} md={9}>
                <Card
                  sx={{
                    p:2,
                    bgcolor: "rgba(30, 41, 59, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(71, 85, 105, 0.3)",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "white", fontWeight:600 }}>
                        Component Group
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: "rgba(59, 130, 246, 0.8)",
                          "&:hover": {
                            bgcolor: "rgba(59, 130, 246, 0.1)",
                          },
                        }}
                        onClick={() => {
                          const allExpanded = Object.keys(groupedComponents).every(
                            (group) => expandedGroups[group]
                          );
                          const newState = {};
                          Object.keys(groupedComponents).forEach((group) => {
                            newState[group] = !allExpanded;
                          });
                          setExpandedGroups(newState);
                        }}
                      >
                        Expand All
                      </Button>
                    </Box>

                    <TextField
                      placeholder="Search by component"
                      size="small"
                      fullWidth
                      value={compFilter}
                      onChange={(e) => setCompFilter(e.target.value)}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "rgba(71, 85, 105, 0.3)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "rgba(255, 255, 255, 0.5)",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Box sx={{ border: "1px solid rgba(71, 85, 105, 0.3)", borderRadius: 1 }}>
                      {Object.entries(groupedComponents).map(([group, items], index) => (
                        <Box key={group}>
                          <Box
                            onClick={() => toggleGroup(group)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 2,
                              bgcolor: "rgba(71, 85, 105, 0.2)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              borderTop: index > 0 ? "1px solid rgba(71, 85, 105, 0.3)" : "none",
                              "&:hover": {
                                bgcolor: "rgba(71, 85, 105, 0.4)",
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {expandedGroups[group] ? (
                                <ExpandLessIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                              ) : (
                                <ExpandMoreIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                              )}
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  color: "white",
                                  fontSize: "0.875rem",
                                  textTransform: "uppercase",
                                }}
                              >
                                {group}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                color: "white",
                                fontFamily: "monospace",
                                fontWeight: 500,
                              }}
                            >
                              {formatValue(items.reduce((sum, item) => sum + item.value, 0))}
                            </Typography>
                          </Box>

                          <Collapse in={expandedGroups[group]}>
                            <Box sx={{ bgcolor: "rgba(30, 41, 59, 0.3)" }}>
                              {items.map((item, itemIndex) => (
                                <Box
                                  key={itemIndex}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 2,
                                    borderTop: "1px solid rgba(71, 85, 105, 0.2)",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                      bgcolor: "rgba(71, 85, 105, 0.2)",
                                    },
                                  }}
                                >
                                  <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                                    {item.label}
                                  </Typography>
                                  <Typography sx={{ color: "white", fontFamily: "monospace" }}>
                                    {formatValue(item.value)}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </Box>
                      ))}

                      {Object.keys(groupedComponents).length === 0 && (
                        <Box sx={{ p: 4, textAlign: "center" }}>
                          <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                            No matching components found
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Employee Details - Right Side */}
              <Grid item xs={12} md={12}>
                <Card
                  sx={{
                    bgcolor: "rgba(30, 41, 59, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(71, 85, 105, 0.3)",
                    borderRadius: 2,
                    height: "fit-content",
                  }}
                >
                  <CardContent sx={{p:2}}>
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 3}}>
                      Details 
                    </Typography> 
                    

                    <Box sx={{ space: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255, 255, 255, 0.5)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            mb: 0.5,
                          }}
                        >
                          Employee
                        </Typography>
                        <Typography sx={{ color: "white", fontWeight: 500 }}>
                          {employee.name} - #{employee.id}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255, 255, 255, 0.5)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            mb: 0.5,
                          }}
                        >
                          Join Date
                        </Typography>
                        <Typography sx={{ color: "white" }}>{employee.joinDate}</Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255, 255, 255, 0.5)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            mb: 0.5,
                          }}
                        >
                          Date Of Birth
                        </Typography>
                        <Typography sx={{ color: "white" }}>
                          {employee.dob} ({calculateAge(employee.dob)} Yrs {Math.floor(Math.random() * 12)} Months)
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255, 255, 255, 0.5)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            mb: 0.5,
                          }}
                        >
                          Location
                        </Typography>
                        <Typography sx={{ color: "white" }}>{employee.location}</Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255, 255, 255, 0.5)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            mb: 0.5,
                          }}
                        >
                          Leaving Date
                        </Typography>
                        <Typography sx={{ color: "white" }}>
                          {employee.leavingDate === "-" ? "Current Employee" : employee.leavingDate}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
           </Box>      
        )}
      </Box>
    </Box>
  );
}

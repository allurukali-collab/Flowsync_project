import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  PowerSettingsNew as PowerIcon,
  KeyboardArrowDown as ArrowIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from "@mui/icons-material";

// Navbar menu definitions
const menus = {
  payrollInputs: ["Salary", "Loan", "Income Tax", "Reimbursement", "Employee LOP Days", "Stop Salary Processing", "Arrears", "Final Settlement"],
  process: ["Payroll Process"],
  verify: ["Quick Salary Statement", "Payroll Statement"],
  payout: ["Bank Transfer", "Payslips"],
  publishedInfo: ["Payslip", "CTC Payslip", "YTD Summary", "Loan Statement", "IT Statement"],
  admin: ["Form 16", "Form24Q", "Employee IT Declaration", "POI Overview", "FBP Planner"],
};

export default function Header({ onMenuItemClick }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState({});

  const handleOpen = key => e =>
    setAnchorEl(prev => ({ ...prev, [key]: e.currentTarget }));
  const handleClose = key => () =>
    setAnchorEl(prev => ({ ...prev, [key]: null }));

  const renderMenu = key => (
    <Menu
      anchorEl={anchorEl[key]}
      open={Boolean(anchorEl[key])}
      onClose={handleClose(key)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
         color:'grey',
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
      {menus[key].map(item => (
        <MenuItem
          key={item}
          component={key === 'payrollInputs' && (item === 'Salary' || item === 'Loan') ? RouterLink : undefined}
          to={
            key === 'payrollInputs' && item === 'Salary'
              ? '/salary'
              : key === 'payrollInputs' && item === 'Loan'
              ? '/loan'
              : undefined
          }
          onClick={() => {
            handleClose(key)();
            onMenuItemClick(item);
          }}
        >
          {item}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <AppBar position="sticky" sx={{ position: 'sticky', top: 0, zIndex: 1100,bgcolor: "rgba(27, 26, 26, 0.92)", boxShadow: "none" }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" sx={{ mr: 4, fontWeight: "bold", color: "grey" }}>
          FlowSync
        </Typography>

        <Stack direction="row" spacing={2} sx={{ flexGrow: 1, overflowX: "auto" }}>
          <Button
            sx={{ textTransform: "none", bgcolor: "rgba(255,246,246,0.29)", color: "black" }}
          >
            Payroll
          </Button>

          {/* Desktop menu */}
          {!isMobile &&
            Object.keys(menus).map(key => (
              <Box key={key}>
                <Button
                  endIcon={<ArrowIcon />}
                  sx={{ color: "white", textTransform: "none" }}
                  onClick={handleOpen(key)}
                >
                  {{
                    payrollInputs: "Payroll Inputs",
                    process: "Process",
                    verify: "Verify",
                    payout: "Payout",
                    publishedInfo: "Published Info",
                    admin: "Admin",
                  }[key]}
                </Button>
                {renderMenu(key)}
              </Box>
            ))}

          {/* Mobile collapse */}
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
                {Object.keys(menus).map(key => (
                  <MenuItem
                    key={key}
                    sx={{ color: "common.white" }}
                    onClick={() => {
                      handleClose("more")();
                      onMenuItemClick(key);
                    }}
                  >
                    {{
                      payrollInputs: "Payroll Inputs",
                      process: "Process",
                      verify: "Verify",
                      payout: "Payout",
                      publishedInfo: "Published Info",
                      admin: "Admin",
                    }[key]}
                    <ArrowRightIcon fontSize="small" sx={{ ml: 1 }} />
                  </MenuItem>
                ))}
              </Menu>
              {Object.keys(menus).map(key => renderMenu(key))}
            </Box>
          )}
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ color: "white" }}><SearchIcon /></IconButton>
          <IconButton sx={{ color: "white" }}><SettingsIcon /></IconButton>
          <IconButton sx={{ color: "error.light" }}><PowerIcon /></IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

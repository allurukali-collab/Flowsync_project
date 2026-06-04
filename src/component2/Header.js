import React, { useMemo, useState } from "react";
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

const PANKAJ_MANAGER_ID = "103";

const getLoggedInEmployeeId = () => {
  const directEmployeeId =
    localStorage.getItem("employeeId") ||
    localStorage.getItem("empId") ||
    localStorage.getItem("userEmployeeId") ||
    localStorage.getItem("loggedInEmployeeId");

  if (directEmployeeId) {
    return String(directEmployeeId);
  }

  const userData =
    localStorage.getItem("user") ||
    localStorage.getItem("userData") ||
    localStorage.getItem("loggedInUser");

  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);

      return String(
        parsedUser.employeeId ||
          parsedUser.empId ||
          parsedUser.userEmployeeId ||
          parsedUser.id ||
          ""
      );
    } catch (error) {
      return "";
    }
  }

  return "";
};

const getMenus = (isPankajManager) => ({
  payrollInputs: [
    "Salary",
    "Loan",
    ...(isPankajManager ? ["Loan Approvals"] : []),
    "Income Tax",
    "Reimbursement",
    ...(isPankajManager ? ["Reimbursement Approvals"] : []),
    "Employee LOP Days",
    "Stop Salary Processing",
    "Arrears",
    "Final Settlement",
  ],
  process: ["Payroll Process", "CTC Payslip"],
  verify: ["Quick Salary Statement", "Payroll Statement"],
  payout: ["Bank Transfer", "Payslips"],
  admin: ["Form 16", "Form24Q", "Employee IT Declaration", "POI Overview"],
});

const getRoutePath = (key, item) => {
  if (key === "process" && item === "Payroll Process") {
    return "/updatepayroll";
  }

  if (key === "process" && item === "CTC Payslip") {
    return "/payslips";
  }

  if (key === "verify" && item === "Quick Salary Statement") {
    return "/quickSalary";
  }

  if (key === "verify" && item === "Payroll Statement") {
    return "/payrollstatement";
  }

  if (key === "payout" && item === "Bank Transfer") {
    return "/banktransfer";
  }

  if (key === "payout" && item === "Payslips") {
    return "/payslips";
  }

  if (key === "payrollInputs" && item === "Salary") {
    return "/salary";
  }

  if (key === "payrollInputs" && item === "Loan") {
    return "/loan";
  }

  if (key === "payrollInputs" && item === "Loan Approvals") {
    return "/loan-approvals";
  }

  if (key === "payrollInputs" && item === "Income Tax") {
    return "/incometax";
  }

  if (key === "payrollInputs" && item === "Reimbursement") {
    return "/reimbursement";
  }

  if (key === "payrollInputs" && item === "Reimbursement Approvals") {
    return "/reimbursement-approvals";
  }

  if (key === "payrollInputs" && item === "Employee LOP Days") {
    return "/employee-lop-days";
  }

  if (key === "payrollInputs" && item === "Stop Salary Processing") {
    return "/stop-salary-processing";
  }

  if (key === "payrollInputs" && item === "Arrears") {
    return "/arrears";
  }

  if (key === "payrollInputs" && item === "Final Settlement") {
    return "/finalsettlement";
  }

  if (key === "admin" && item === "Form 16") {
    return "/form16";
  }

  if (key === "admin" && item === "Form24Q") {
    return "/form24q";
  }

  if (key === "admin" && item === "Employee IT Declaration") {
    return "/employeeitdeclaration";
  }

  if (key === "admin" && item === "POI Overview") {
    return "/poioverview";
  }

  return undefined;
};

export default function Header({ onMenuItemClick = () => {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState({});

  const loggedInEmployeeId = getLoggedInEmployeeId();
  const isPankajManager = loggedInEmployeeId === PANKAJ_MANAGER_ID;

  const menus = useMemo(() => getMenus(isPankajManager), [isPankajManager]);

  const handleOpen = (key) => (e) =>
    setAnchorEl((prev) => ({ ...prev, [key]: e.currentTarget }));

  const handleClose = (key) => () =>
    setAnchorEl((prev) => ({ ...prev, [key]: null }));

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
      {menus[key].map((item) => {
        const routePath = getRoutePath(key, item);

        return (
          <MenuItem
            key={item}
            component={routePath ? RouterLink : undefined}
            to={routePath}
            onClick={() => {
              handleClose(key)();
              onMenuItemClick(item);
            }}
          >
            {item}
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        bgcolor: "rgba(27, 26, 26, 0.92)",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <Typography
          variant="h6"
          sx={{ mr: 4, fontWeight: "bold", color: "grey" }}
        >
          FlowSync
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ flexGrow: 1, overflowX: "auto" }}
        >
          <Button
            sx={{
              textTransform: "none",
              bgcolor: "rgba(255,246,246,0.29)",
              color: "black",
            }}
          >
            Payroll
          </Button>

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
                      admin: "Admin",
                    }[key]
                  }
                </Button>

                {renderMenu(key)}
              </Box>
            ))}

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
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
                  <MenuItem
                    key={key}
                    sx={{
                      color: "common.white",
                      justifyContent: "space-between",
                    }}
                    onClick={(e) => {
                      handleOpen(key)(e);
                    }}
                  >
                    {
                      {
                        payrollInputs: "Payroll Inputs",
                        process: "Process",
                        verify: "Verify",
                        payout: "Payout",
                        admin: "Admin",
                      }[key]
                    }

                    <ArrowRightIcon fontSize="small" sx={{ ml: 1 }} />
                  </MenuItem>
                ))}
              </Menu>

              {Object.keys(menus).map((key) => renderMenu(key))}
            </Box>
          )}
        </Stack>

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
  );
}
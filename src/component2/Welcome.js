import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Storage as StorageIcon,
  CreditCard as CreditCardIcon,
  ArrowForward as ArrowForwardIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  const favouriteItems = [
    {
      title: "Update Employee Data",
      description: "Update employee profile and official details.",
      icon: PersonIcon,
      type: "employee",
      route: "/updateemp",
    },
    {
      title: "Add Employee",
      description: "Create a new employee record.",
      icon: PersonIcon,
      type: "employee",
      route: "/addemp",
    },
    {
      title: "Update Payroll Data",
      description: "Update monthly payroll inputs.",
      icon: StorageIcon,
      type: "payroll",
      route: "/updatepayroll",
    },
    {
      title: "Process Payroll",
      description: "Run payroll calculation process.",
      icon: CreditCardIcon,
      type: "payroll",
      route: "/updatepayroll",
    },
    {
      title: "Salary Statement",
      description: "Generate monthly salary statement.",
      icon: StorageIcon,
      type: "payroll",
      route: "/updatepayroll",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const getAccentColor = (type) => {
    return type === "payroll" ? "#f59e0b" : "#38bdf8";
  };

  const getSoftColor = (type) => {
    return type === "payroll"
      ? "rgba(245, 158, 11, 0.13)"
      : "rgba(56, 189, 248, 0.13)";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "#ffffff",
        background:
          "linear-gradient(135deg, #07111f 0%, #0b1730 45%, #050816 100%)",
        overflowX: "hidden",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(5, 10, 20, 0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "64px !important",
            px: { xs: 2, md: 4 },
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
              }}
            >
              F
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.4px",
                color: "#ffffff",
              }}
            >
              FlowSync
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton
              sx={{
                color: "#cbd5e1",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
              }}
            >
              <SearchIcon />
            </IconButton>

            <IconButton
              sx={{
                color: "#cbd5e1",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
              }}
            >
              <SettingsIcon />
            </IconButton>

            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#fb7185",
                "&:hover": { backgroundColor: "rgba(251,113,133,0.12)" },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.86))",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 20px 55px rgba(0,0,0,0.30)",
          }}
        >
          <Box>
            <Chip
              label="Payroll Management"
              size="small"
              sx={{
                mb: 1.5,
                color: "#7dd3fc",
                backgroundColor: "rgba(14,165,233,0.12)",
                border: "1px solid rgba(125,211,252,0.22)",
                fontWeight: 700,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                mb: 1,
                color: "#ffffff",
              }}
            >
              Components
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                fontSize: "15px",
                maxWidth: 650,
                lineHeight: 1.7,
              }}
            >
              Manage employee records, payroll data, payroll processing, and
              salary statements in one place.
            </Typography>
          </Box>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "#ffffff",
                mb: 0.4,
              }}
            >
              Quick Actions
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              Choose a module to continue your workflow.
            </Typography>
          </Box>

          <Chip
            label={`${favouriteItems.length} Components`}
            sx={{
              color: "#e2e8f0",
              backgroundColor: "rgba(148,163,184,0.12)",
              border: "1px solid rgba(148,163,184,0.18)",
              fontWeight: 700,
            }}
          />
        </Stack>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2.5}>
            {favouriteItems.map((item, index) => {
              const Icon = item.icon;
              const accent = getAccentColor(item.type);
              const soft = getSoftColor(item.type);

              return (
                <Grid key={index} item xs={12} sm={6} md={4} lg={2.4}>
                  <Card
                    onClick={() => item.route && navigate(item.route)}
                    sx={{
                      height: 210,
                      borderRadius: "20px",
                      background: "rgba(15,23,42,0.82)",
                      border: "1px solid rgba(148,163,184,0.16)",
                      boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
                      cursor: "pointer",
                      transition: "all 0.22s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        borderColor: accent,
                        boxShadow: "0 18px 42px rgba(0,0,0,0.34)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        height: "100%",
                        p: 2.5,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: "14px",
                            backgroundColor: soft,
                            color: accent,
                            border: `1px solid ${accent}55`,
                          }}
                        >
                          <Icon />
                        </Avatar>

                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            color: accent,
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <ArrowForwardIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                      </Stack>

                      <Typography
                        sx={{
                          color: "#ffffff",
                          fontWeight: 850,
                          fontSize: "17px",
                          lineHeight: 1.25,
                          mb: 1.2,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "13px",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Box sx={{ mt: "auto", pt: 2 }}>
                        <Typography
                          sx={{
                            color: accent,
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.3px",
                          }}
                        >
                          Click to open
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box
          sx={{
            p: 2.5,
            borderRadius: "18px",
            backgroundColor: "rgba(15,23,42,0.55)",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  backgroundColor: "rgba(56,189,248,0.13)",
                  color: "#38bdf8",
                }}
              >
                <DashboardIcon />
              </Avatar>

              <Box>
                <Typography sx={{ fontWeight: 800, color: "#ffffff" }}>
                  Need to go back to main dashboard?
                </Typography>
                <Typography sx={{ color: "#94a3b8", fontSize: "13px" }}>
                  You can return to the main module dashboard anytime.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              onClick={() => navigate("/dashboard")}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                borderRadius: "12px",
                px: 3,
                background: "linear-gradient(135deg, #2563eb, #0284c7)",
                boxShadow: "none",
              }}
            >
              Go to Dashboard
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
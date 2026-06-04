import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ModuleLayout from "../common/ModuleLayout";
import api from "../../utils/api";
import { getStoredUser } from "../../hooks/useAuth";
import { ModuleLoading, moduleTheme } from "./moduleUi";

export default function EmployeeDashboardPage() {
  const user = getStoredUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.employeeId) return;
    setLoading(true);
    api
     .get(`/api/auth/dashboard/${user.employeeId}`)
      .then((res) => setData(res.data))
      .catch((e) =>
        setError(e.response?.data?.message || e.message || "Failed to load dashboard")
      )
      .finally(() => setLoading(false));
  }, [user?.employeeId]);

  const statCards = [
    { label: "Hours This Week", value: data?.totalHoursThisWeek, icon: AccessTimeIcon, color: "#00bcd4" },
    { label: "Hours This Month", value: data?.totalHoursThisMonth, icon: CalendarMonthIcon, color: "#7e57c2" },
    { label: "Pending Timesheets", value: data?.pendingTimesheets, icon: PendingActionsIcon, color: "#ff9800" },
    { label: "Approved Timesheets", value: data?.approvedTimesheets, icon: CheckCircleOutlineIcon, color: "#4caf50" },
  ];

  return (
    <ModuleLayout
      title="Employee Dashboard"
      subtitle={`Welcome back — track your work hours and timesheet status.`}
    >
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
      {loading ? (
        <ModuleLoading message="Loading your dashboard..." />
      ) : (
        <>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              bgcolor: moduleTheme.cardBg,
              border: moduleTheme.cardBorder,
              background: `linear-gradient(135deg, rgba(0,188,212,0.12) 0%, ${moduleTheme.cardBg} 60%)`,
            }}
          >
            <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
              Hello, {data?.employeeName || user?.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              <Chip label={`ID: ${data?.employeeId || user?.employeeId}`} size="small" sx={{ bgcolor: "rgba(0,0,0,0.3)", color: "grey.300" }} />
              <Chip label={data?.designation || data?.role || user?.designation} size="small" sx={{ bgcolor: moduleTheme.accentSoft, color: moduleTheme.accent }} />
            </Box>
          </Paper>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={card.label}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: moduleTheme.cardBg,
                      border: moduleTheme.cardBorder,
                      borderLeft: `4px solid ${card.color}`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${card.color}22` }}>
                      <Icon sx={{ color: card.color }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: "grey.400" }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                        {card.value ?? 0}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, bgcolor: moduleTheme.cardBg, border: moduleTheme.cardBorder }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <Typography variant="h6" sx={{ color: "white" }}>Recent Activities</Typography>
              <Typography variant="body2" sx={{ color: "grey.500" }}>Your latest timesheet entries</Typography>
            </Box>
            {(data?.recentActivities || []).length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography sx={{ color: "grey.500" }}>No recent timesheet activity yet.</Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: moduleTheme.tableHead }}>
                    <TableCell sx={{ color: "grey.400", fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ color: "grey.400", fontWeight: 600 }}>Task</TableCell>
                    <TableCell sx={{ color: "grey.400", fontWeight: 600 }}>Hours</TableCell>
                    <TableCell sx={{ color: "grey.400", fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data?.recentActivities || []).map((a, i) => (
                    <TableRow key={i} hover sx={{ "&:hover": { bgcolor: moduleTheme.rowHover } }}>
                      <TableCell sx={{ color: "white" }}>{a.date}</TableCell>
                      <TableCell sx={{ color: "white" }}>Task #{a.taskId}</TableCell>
                      <TableCell sx={{ color: "white" }}>{a.hours}h</TableCell>
                      <TableCell>
                        <Chip label={a.workStatus || "—"} size="small" sx={{ bgcolor: moduleTheme.accentSoft, color: moduleTheme.accent }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </>
      )}
    </ModuleLayout>
  );
}

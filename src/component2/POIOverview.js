import React, { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import Header from "./Header";

export default function POIOverview() {
  const [year, setYear] = useState("2025-2026");
  const [tab, setTab] = useState(0);
  const [mode, setMode] = useState("bulk");

    const handleTab = (_, v) => setTab(v);

  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <Box
        sx={{
          px: 2,
          pt: 2,
          bgcolor: "rgba(10,20,40,0.7)",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Breadcrumbs
          separator=">"
          sx={{ "& .MuiBreadcrumbs-separator": { color: "rgba(255,255,255,0.5)" } }}
        >
          <MuiLink component={RouterLink} to="/welcome" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Home
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to="/updatepayroll"
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            Payroll
          </MuiLink>
          <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>POI Overview</Typography>
        </Breadcrumbs>
      </Box>

      {/* Year selector & tools */}
      <Box
        sx={{
          px: 3,
          pt: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mt:2
        }}
      >
        <FormControl size="small" sx={{
      minWidth: 160,
      bgcolor: "rgba(255,255,255,0.1)",
      borderRadius: 1,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.3)",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.5)",
      },
    }}>
          <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }} >Apr 2025 - Mar 2026</InputLabel>
          <Select
            value={year}
            label="Apr 2025 - Mar 2026"
            onChange={(e) => setYear(e.target.value)}
            sx={{color:'white'}}
          >
            <MenuItem value="2025-2026">Apr 2025 – Mar 2026</MenuItem>
            <MenuItem value="2024-2025">Apr 2024 – Mar 2025</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ color: "white" }}>
          <TuneIcon />
        </IconButton>
      </Box>

      {/* Status tabs */}
      {/* STATUS TABS (4 across) */}
      <Tabs
        value={tab}
        onChange={handleTab}
        variant="fullWidth"
        sx={{
          mb: 3,
          // give the whole Tabs a max width so 4 tabs fit nicely
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          "& .MuiTab-root": {
            minWidth: 0,     // allow tabs to shrink
            flex: 1,         // distribute evenly
            py: 1,
            fontSize: 14,
            color:'grey'
          },
        }}
        TabIndicatorProps={{
          sx: { backgroundColor: "#52748fff", height: 3 },
        }}
      >
        <Tab label="Yet to be released" />
        <Tab label="Released" />
        <Tab label="Pending for review" />
        <Tab label="Pending for payroll" />
        {/* if you truly want only 4 across, drop one of these */}
      </Tabs>

      {/* Filters & toggles */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          ml:2
        }}
      >
        <Typography sx={{ color: "white" }}>Filter employees as per regime</Typography>
        <FormControl size="small" sx={{
      minWidth: 100,
      bgcolor: "rgba(255,255,255,0.1)",
      borderRadius: 1,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.3)",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.5)",
      },
    }}>
          <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Both</InputLabel>
          <Select
            value="both"
            label="Both"
            sx={{ color: "white",}}
          >
            <MenuItem value="both">Both</MenuItem>
            <MenuItem value="old">Old Regime</MenuItem>
            <MenuItem value="new">New Regime</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, v) => v && setMode(v)}
          size="small"
          sx={{ ml: 3 }}
        >
          <ToggleButton value="bulk"sx={{
          color: "rgba(255,255,255,0.7)",
          borderColor: "rgba(255,255,255,0.3)",
          "&.Mui-selected": {
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            borderColor: "rgba(255,255,255,0.5)",
          },
        }}>
            Bulk Select
          </ToggleButton>
          <ToggleButton value="individual" sx={{
          color: "rgba(255,255,255,0.7)",
          borderColor: "rgba(255,255,255,0.3)",
          "&.Mui-selected": {
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            borderColor: "rgba(255,255,255,0.5)",
          },
        }}>
            Individual Details
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ flexGrow: 1, mr:2 }} />

        <Button variant="outlined" sx={{ color: "white", borderColor: "white" }}>
          Excel Export
        </Button>
      </Box>

      {/* Main content area */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 3,
          px: 3,
          pb: 3,
        }}
      >
        {/* Left: employee list */}
        <Paper
          elevation={1}
          sx={{
             width: { xs: '100%', md: '45%' },
            bgcolor: 'rgba(85, 82, 82, 0.4)',
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ color: "white" }}>19 records</Typography>
            <TextField
              size="small"
              placeholder="Enter Emp. Name or ID"
              InputProps={{
                sx: { bgcolor: "rgba(255,255,255,0.12)" },
                endAdornment: <SearchIcon sx={{ color: "white", mr: 1 }} />,
              }}
              sx={{ width: 240 }}
            />
          </Box>
          <TableContainer sx={{ maxHeight: 360 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& .MuiTableCell-stickyHeader": {
      backgroundColor: "rgb(0, 0, 0)",  // your translucent blue
      color: "white",   }}}>
                  <TableCell sx={{ color: "white", width: 48 }} />
                  <TableCell sx={{ color: "white" }}>Employee Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* map your rows here */}
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i} hover>
                    <TableCell>
                      <input type="checkbox" />
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      A Sample Employee (#T00{i + 1})
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Right: selected panel */}
       <Box
          sx={{
            width: { xs: '100%', md: '45%' },
            bgcolor: 'rgba(72, 70, 70, 0.4)',
            borderRadius: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',       // center the checkbox + button
            gap: 2,
          }}
        >
          <Box component="div" sx={{ color: 'white', fontSize: 18 }}>
            0 Employees Selected
          </Box>
          <Box>
            <input type="checkbox" id="release" />
            <label htmlFor="release" style={{ marginLeft: 8, color: 'white' }}>
              Release
            </label>
          </Box>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}

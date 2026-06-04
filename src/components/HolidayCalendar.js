import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function HolidayCalendar() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("IND-BLR");
  const [year, setYear] = useState("2026");

  const [holidayList, setHolidayList] = useState([]);
  const [years, setYears] = useState([]);
  const [locations, setLocations] = useState([]);

  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "",
  });

  const triggerToast = (message, type) => {
    setToastState({ show: true, message, type });
    setTimeout(() => {
      setToastState({ show: false, message: "", type: "" });
    }, 2500);
  };

  // 🎯 API CALLS
  const fetchYears = async () => {
    const res = await fetch("http://localhost:8080/api/holidays/years");
    const data = await res.json();
    setYears(data);
  };

  const fetchLocations = async () => {
    const res = await fetch("http://localhost:8080/api/holidays/locations");
    const data = await res.json();
    setLocations(data);
  };

  const fetchHolidays = async (year, location) => {
    const res = await fetch(
      `http://localhost:8080/api/holidays?year=${year}&location=${location}`,
    );
    const data = await res.json();
    setHolidayList(data);
  };

  useEffect(() => {
    fetchYears();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (year && location) {
      fetchHolidays(year, location);
    }
  }, [year, location]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Holiday Calendar ${year} - ${location}`, 14, 20);

    const tableColumn = [
      "Holiday Date",
      "Holiday Type",
      "Holiday Day",
      "Occasion",
    ];

    const tableRows = holidayList.map((h) => [
      formatDate(h.holidayDate),
      h.holidayType,
      h.holidayDay,
      h.occasion,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(`holiday_calendar_${year}_${location}.pdf`);
    triggerToast("PDF downloaded successfully!", "success");
  };
  return (
    <Box className="holiday-container">
      <IconButton
        onClick={() => navigate("/timesheettable")}
        sx={{ position: "absolute", top: 15, left: 16, color: "white" }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          p: { xs: 2, sm: 3 },
          margin: "10px auto",
          width: { xs: "95%", sm: "80%" },
          maxWidth: "1510px",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 2,
            color: "white",
          }}
        >
          Holiday Calendar {year}
        </Typography>

        {/* TABLE */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            maxHeight: 550,
            minHeight: 550,
            overflowX: "auto",
            width: { xs: "100%", sm: "95%", md: "90%" },
            mx: "auto",
            border: "1px solid white",
            borderCollapse: "separate",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Holiday Date",
                  "Holiday Type",
                  "Holiday Day",
                  "Occasion",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {holidayList.map((holiday, index) => (
                <TableRow key={index} sx={{height: 45}}>
                  <TableCell
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      py: 1,
                     
                    }}
                  >
                    {formatDate(holiday.holidayDate)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      py: 1,
               
                    }}
                  >
                    {holiday.holidayType}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      py: 1,
                    }}
                  >
                    {holiday.holidayDay}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      py: 1,
                    }}
                  >
                    {holiday.occasion}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* DROPDOWNS */}
        <Box
          sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}
        >
          {/* YEAR */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: "white" }}>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
              sx={{
                color: "white", // <-- white text
                ".MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // white border
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                ".MuiSvgIcon-root": { color: "white" }, // dropdown arrow icon white
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#0b0b0be7", // 👈 your custom dropdown background
                    color: "white", // 👈 optional: text color inside dropdown
                  },
                },
              }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* LOCATION */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel sx={{ color: "white" }}>Location</InputLabel>
            <Select
              value={location}
              label="Location"
              onChange={(e) => setLocation(e.target.value)}
              sx={{
                color: "white", // <-- white text
                ".MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // white border
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                ".MuiSvgIcon-root": { color: "white" }, // dropdown arrow icon white
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#0b0b0be7", // 👈 your custom dropdown background
                    color: "white", // 👈 optional: text color inside dropdown
                  },
                },
              }}
            >
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* BUTTONS */}
          <Button variant="contained" onClick={handleExport}>
            EXPORT
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate("/timesheettable")}
          >
            CLOSE
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={toastState.show}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toastState.type} variant="filled">
          {toastState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HolidayCalendar;
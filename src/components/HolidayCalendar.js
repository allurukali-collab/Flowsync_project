import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const holidays = {
  2021: {
    "ind-blr": [
      {
        date: "01-01-2021",
        day: "Friday",
        type: "Annual Holiday",
        occasion: "New Year",
      },
      {
        date: "26-01-2021",
        day: "Tuesday",
        type: "Annual Holiday",
        occasion: "Republic Day",
      },
      {
        date: "29-03-2021",
        day: "Monday",
        type: "Restricted Holiday",
        occasion: "Holi",
      },
      {
        date: "02-04-2021",
        day: "Friday",
        type: "Restricted Holiday",
        occasion: "Good Friday",
      },
      {
        date: "14-04-2021",
        day: "Wednesday",
        type: "Restricted Holiday",
        occasion: "Ambedkar Jayanti",
      },
      {
        date: "13-05-2021",
        day: "Thursday",
        type: "Restricted Holiday",
        occasion: "Idul Fitr",
      },
      {
        date: "15-08-2021",
        day: "Sunday",
        type: "Annual Holiday",
        occasion: "Independence Day",
      },
      {
        date: "02-10-2021",
        day: "Saturday",
        type: "Annual Holiday",
        occasion: "Gandhi Jayanti",
      },
      {
        date: "04-11-2021",
        day: "Thursday",
        type: "Annual Holiday",
        occasion: "Diwali",
      },
    ],
    "usa-ny": [
      {
        date: "01-01-2021",
        day: "Friday",
        type: "Federal Holiday",
        occasion: "New Year",
      },
      {
        date: "04-07-2021",
        day: "Sunday",
        type: "Federal Holiday",
        occasion: "Independence Day",
      },
      {
        date: "25-11-2021",
        day: "Thursday",
        type: "Federal Holiday",
        occasion: "Thanksgiving Day",
      },
      {
        date: "25-12-2021",
        day: "Saturday",
        type: "Federal Holiday",
        occasion: "Christmas Day",
      },
    ],
    "uk-ldn": [
      {
        date: "01-01-2021",
        day: "Friday",
        type: "Bank Holiday",
        occasion: "New Year",
      },
      {
        date: "02-04-2021",
        day: "Friday",
        type: "Bank Holiday",
        occasion: "Good Friday",
      },
      {
        date: "05-04-2021",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Easter Monday",
      },
      {
        date: "27-12-2021",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Christmas Day (substitute)",
      },
    ],
  },
  2022: {
    "ind-blr": [
      {
        date: "01-01-2022",
        day: "Saturday",
        type: "Annual Holiday",
        occasion: "New Year",
      },
      {
        date: "26-01-2022",
        day: "Wednesday",
        type: "Annual Holiday",
        occasion: "Republic Day",
      },
      {
        date: "18-03-2022",
        day: "Friday",
        type: "Restricted Holiday",
        occasion: "Holi",
      },
      {
        date: "15-04-2022",
        day: "Friday",
        type: "Restricted Holiday",
        occasion: "Good Friday",
      },
      {
        date: "03-05-2022",
        day: "Tuesday",
        type: "Restricted Holiday",
        occasion: "Idul Fitr",
      },
      {
        date: "15-08-2022",
        day: "Monday",
        type: "Annual Holiday",
        occasion: "Independence Day",
      },
      {
        date: "02-10-2022",
        day: "Sunday",
        type: "Annual Holiday",
        occasion: "Gandhi Jayanti",
      },
      {
        date: "24-10-2022",
        day: "Monday",
        type: "Annual Holiday",
        occasion: "Diwali",
      },
    ],
    "usa-ny": [
      {
        date: "01-01-2022",
        day: "Saturday",
        type: "Federal Holiday",
        occasion: "New Year",
      },
      {
        date: "04-07-2022",
        day: "Monday",
        type: "Federal Holiday",
        occasion: "Independence Day",
      },
      {
        date: "24-11-2022",
        day: "Thursday",
        type: "Federal Holiday",
        occasion: "Thanksgiving Day",
      },
      {
        date: "25-12-2022",
        day: "Sunday",
        type: "Federal Holiday",
        occasion: "Christmas Day",
      },
    ],
    "uk-ldn": [
      {
        date: "01-01-2022",
        day: "Saturday",
        type: "Bank Holiday",
        occasion: "New Year",
      },
      {
        date: "15-04-2022",
        day: "Friday",
        type: "Bank Holiday",
        occasion: "Good Friday",
      },
      {
        date: "18-04-2022",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Easter Monday",
      },
      {
        date: "26-12-2022",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Boxing Day",
      },
    ],
  },
  2023: {
    "ind-blr": [
      {
        date: "01-01-2023",
        day: "Sunday",
        type: "Annual Holiday",
        occasion: "New Year",
      },
      {
        date: "26-01-2023",
        day: "Thursday",
        type: "Annual Holiday",
        occasion: "Republic Day",
      },
      {
        date: "08-03-2023",
        day: "Wednesday",
        type: "Restricted Holiday",
        occasion: "Holi",
      },
      {
        date: "07-04-2023",
        day: "Friday",
        type: "Restricted Holiday",
        occasion: "Good Friday",
      },
      {
        date: "22-04-2023",
        day: "Saturday",
        type: "Restricted Holiday",
        occasion: "Idul Fitr",
      },
      {
        date: "01-05-2023",
        day: "Monday",
        type: "Annual Holiday",
        occasion: "Labour Day",
      },
      {
        date: "29-06-2023",
        day: "Thursday",
        type: "Restricted Holiday",
        occasion: "Bakrid",
      },
      {
        date: "15-08-2023",
        day: "Tuesday",
        type: "Annual Holiday",
        occasion: "Independence Day",
      },
      {
        date: "02-10-2023",
        day: "Monday",
        type: "Annual Holiday",
        occasion: "Gandhi Jayanti",
      },
      {
        date: "23-10-2023",
        day: "Monday",
        type: "Annual Holiday",
        occasion: "Dussehra",
      },
      {
        date: "12-11-2023",
        day: "Sunday",
        type: "Annual Holiday",
        occasion: "Diwali",
      },
    ],
    "usa-ny": [
      {
        date: "01-01-2023",
        day: "Sunday",
        type: "Federal Holiday",
        occasion: "New Year",
      },
      {
        date: "04-07-2023",
        day: "Tuesday",
        type: "Federal Holiday",
        occasion: "Independence Day",
      },
      {
        date: "19-06-2023",
        day: "Monday",
        type: "Federal Holiday",
        occasion: "Juneteenth",
      },
      {
        date: "11-11-2023",
        day: "Saturday",
        type: "Federal Holiday",
        occasion: "Veterans Day",
      },
      {
        date: "23-11-2023",
        day: "Thursday",
        type: "Federal Holiday",
        occasion: "Thanksgiving Day",
      },
      {
        date: "25-12-2023",
        day: "Monday",
        type: "Federal Holiday",
        occasion: "Christmas Day",
      },
    ],
    "uk-ldn": [
      {
        date: "01-01-2023",
        day: "Sunday",
        type: "Bank Holiday",
        occasion: "New Year",
      },
      {
        date: "07-04-2023",
        day: "Friday",
        type: "Bank Holiday",
        occasion: "Good Friday",
      },
      {
        date: "10-04-2023",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Easter Monday",
      },
      {
        date: "28-08-2023",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Summer Bank Holiday",
      },
      {
        date: "25-12-2023",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Christmas Day",
      },
      {
        date: "26-12-2023",
        day: "Tuesday",
        type: "Bank Holiday",
        occasion: "Boxing Day",
      },
    ],
  },
  2024: {
    "ind-blr": [
      {
        date: "01-01-2024",
        day: "Monday",
        type: "Annual Holiday",
        occasion: "New Year",
      },
      {
        date: "26-01-2024",
        day: "Friday",
        type: "Annual Holiday",
        occasion: "Republic Day",
      },
      {
        date: "25-03-2024",
        day: "Monday",
        type: "Restricted Holiday",
        occasion: "Holi",
      },
      {
        date: "29-03-2024",
        day: "Friday",
        type: "Restricted Holiday",
        occasion: "Good Friday",
      },
      {
        date: "09-04-2024",
        day: "Tuesday",
        type: "Restricted Holiday",
        occasion: "Ugadi",
      },
      {
        date: "11-04-2024",
        day: "Thursday",
        type: "Restricted Holiday",
        occasion: "Idul Fitr",
      },
      {
        date: "01-05-2024",
        day: "Wednesday",
        type: "Annual Holiday",
        occasion: "Labour Day",
      },
      {
        date: "17-06-2024",
        day: "Monday",
        type: "Restricted Holiday",
        occasion: "Bakrid/Eid al Adha",
      },
      {
        date: "15-08-2024",
        day: "Thursday",
        type: "Annual Holiday",
        occasion: "Independence Day",
      },
      {
        date: "02-10-2024",
        day: "Wednesday",
        type: "Annual Holiday",
        occasion: "Gandhi Jayanti",
      },
      {
        date: "11-10-2024",
        day: "Friday",
        type: "Restricted Holiday",
        occasion: "Maha Navami",
      },
      {
        date: "31-10-2024",
        day: "Thursday",
        type: "Annual Holiday",
        occasion: "Deepavali Holiday",
      },
    ],
    "usa-ny": [
      {
        date: "01-01-2024",
        day: "Monday",
        type: "Federal Holiday",
        occasion: "New Year",
      },
      {
        date: "19-06-2024",
        day: "Wednesday",
        type: "Federal Holiday",
        occasion: "Juneteenth",
      },
      {
        date: "04-07-2024",
        day: "Thursday",
        type: "Federal Holiday",
        occasion: "Independence Day",
      },
      {
        date: "28-11-2024",
        day: "Thursday",
        type: "Federal Holiday",
        occasion: "Thanksgiving Day",
      },
      {
        date: "11-11-2024",
        day: "Monday",
        type: "Federal Holiday",
        occasion: "Veterans Day",
      },
      {
        date: "25-12-2024",
        day: "Wednesday",
        type: "Federal Holiday",
        occasion: "Christmas Day",
      },
    ],
    "uk-ldn": [
      {
        date: "01-01-2024",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "New Year",
      },
      {
        date: "29-03-2024",
        day: "Friday",
        type: "Bank Holiday",
        occasion: "Good Friday",
      },
      {
        date: "01-04-2024",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Easter Monday",
      },
      {
        date: "25-09-2024",
        day: "Wednesday",
        type: "Bank Holiday",
        occasion: "Summer Bank Holiday",
      },
      {
        date: "25-12-2024",
        day: "Wednesday",
        type: "Bank Holiday",
        occasion: "Christmas Day",
      },
      {
        date: "26-12-2024",
        day: "Thursday",
        type: "Bank Holiday",
        occasion: "Boxing Day",
      },
    ],
  },
  2025: {
    "ind-blr": [
      {
        date: "01-01-2025",
        day: "Wednesday",
        type: "Annual Holiday",
        occasion: "New Year",
      },
      {
        date: "26-01-2025",
        day: "Sunday",
        type: "Annual Holiday",
        occasion: "Republic Day",
      },
      {
        date: "14-03-2025",
        day: "Friday",
        type: "Restricted Holiday",
        occasion: "Holi",
      },
      {
        date: "18-04-2025",
        day: "Friday",
        type: "Restricted Holiday",
        occasion: "Good Friday",
      },
      {
        date: "31-03-2025",
        day: "Monday",
        type: "Restricted Holiday",
        occasion: "Ugadi",
      },
      {
        date: "30-03-2025",
        day: "Sunday",
        type: "Restricted Holiday",
        occasion: "Idul Fitr",
      },
      {
        date: "01-05-2025",
        day: "Thursday",
        type: "Annual Holiday",
        occasion: "Labour Day",
      },
      {
        date: "06-10-2025",
        day: "Monday",
        type: "Restricted Holiday",
        occasion: "Bakrid/Eid al Adha",
      },
      {
        date: "15-08-2025",
        day: "Friday",
        type: "Annual Holiday",
        occasion: "Independence Day",
      },
      {
        date: "02-10-2025",
        day: "Thursday",
        type: "Annual Holiday",
        occasion: "Gandhi Jayanti",
      },
      {
        date: "21-10-2025",
        day: "Tuesday",
        type: "Restricted Holiday",
        occasion: "Maha Navami",
      },
      {
        date: "20-10-2025",
        day: "Monday",
        type: "Annual Holiday",
        occasion: "Deepavali",
      },
    ],
    "usa-ny": [
      {
        date: "01-01-2025",
        day: "Wednesday",
        type: "Federal Holiday",
        occasion: "New Year",
      },
      {
        date: "19-06-2025",
        day: "Thursday",
        type: "Federal Holiday",
        occasion: "Juneteenth",
      },
      {
        date: "04-07-2025",
        day: "Friday",
        type: "Federal Holiday",
        occasion: "Independence Day",
      },
      {
        date: "27-11-2025",
        day: "Thursday",
        type: "Federal Holiday",
        occasion: "Thanksgiving Day",
      },
      {
        date: "11-11-2025",
        day: "Tuesday",
        type: "Federal Holiday",
        occasion: "Veterans Day",
      },
      {
        date: "25-12-2025",
        day: "Thursday",
        type: "Federal Holiday",
        occasion: "Christmas Day",
      },
    ],
    "uk-ldn": [
      {
        date: "01-01-2025",
        day: "Wednesday",
        type: "Bank Holiday",
        occasion: "New Year",
      },
      {
        date: "18-04-2025",
        day: "Friday",
        type: "Bank Holiday",
        occasion: "Good Friday",
      },
      {
        date: "21-04-2025",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Easter Monday",
      },
      {
        date: "25-08-2025",
        day: "Monday",
        type: "Bank Holiday",
        occasion: "Summer Bank Holiday",
      },
      {
        date: "25-12-2025",
        day: "Thursday",
        type: "Bank Holiday",
        occasion: "Christmas Day",
      },
      {
        date: "26-12-2025",
        day: "Friday",
        type: "Bank Holiday",
        occasion: "Boxing Day",
      },
    ],
  }
};

function HolidayCalendar() {
  const [location, setLocation] = useState('ind-blr');
  const [year, setYear] = useState('2025');
  const navigate = useNavigate();
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

  const handleExport = () => {
    const selected = holidays[year][location];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Date,Day,Type,Occasion",
        ...selected.map((h) => `${h.date},${h.day},${h.type},${h.occasion}`),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `holiday_calendar_${year}_${location}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Downloaded successfully!", "success");
  };

  const handleClose = () => {
    navigate("/timesheettable");
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
          backgroundColor: "rgba(0, 0, 0, 0.6)", // previously rgba(255,255,255,0.9)
          p: { xs: 2, sm: 3 },
          margin: "10px auto",
          width: { xs: "95%", sm: "80%" },
          maxWidth: "1510px",
          overflow: "hidden",
          boxShadow: 0, // remove shadow
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
            mb: 2,
            color: "white", // adjust as needed for visibility
          }}
        >
          Holiday Calendar {year}
        </Typography>

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
                <TableCell
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 6)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Holiday Date</strong>
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 6)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Holiday Type</strong>
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 6)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Holiday Day</strong>
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 6)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Occasion</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holidays[year][location].map((holiday, index) => (
                <TableRow key={index} sx={{ height: 45 }}>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      py: 0.5,
                    }}
                  >
                    {holiday.date}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      py: 0.5,
                    }}
                  >
                    {holiday.day}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      py: 0.5,
                    }}
                  >
                    {holiday.type}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      py: 0.5,
                    }}
                  >
                    {holiday.occasion}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "flex-start",
            mt: 2,
            mr: 8.5,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 100, marginLeft: "auto" }}>
            <InputLabel id="year-label" sx={{ color: "white" }}>
              Year
            </InputLabel>
            <Select
              labelId="year-label"
              id="year"
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                ".MuiSvgIcon-root": { color: "white" },
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
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2026">2026</MenuItem>
              <MenuItem value="2027">2027</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="location-label" sx={{ color: "white" }}>
              Location
            </InputLabel>
            <Select
              labelId="location-label"
              id="location"
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
              <MenuItem value="ind-blr">IND-BLR</MenuItem>
              <MenuItem value="usa-ny">USA-NY</MenuItem>
              <MenuItem value="uk-ldn">UK-LDN</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{ display: "flex", gap: 2, maxWidth: "200px", width: "100%" }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleExport}
            >
              EXPORT
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleClose}
            >
              CLOSE
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={toastState.show}
        autoHideDuration={3000}
        onClose={() => setToastState({ show: false, message: "", type: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastState({ show: false, message: "", type: "" })}
          severity={toastState.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HolidayCalendar;

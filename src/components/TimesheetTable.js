import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useTheme, createTheme } from "@mui/material/styles";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./../style/Timesheet.css";
// import Navbar from './Navbar';
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Taskname from "./Taskname";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const TimesheetTable = ({ empID, projectId }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [codingValues, setCodingValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [testingValues, setTestingValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [devopsValues, setDevopsValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [meetingValues, setMeetingValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [dataValues, setDataValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [taValues, setTaValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [tdValues, setTdValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [eeValues, setEeValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [pmValues, setPmValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [cbValues, setCbValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [acValues, setAcValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [misValues, setMisValues] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [totalValues, setTotalValues] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [warningMessage, setWarningMessage] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [enteredValues, setEnteredValues] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [results, setResults] = useState([]);
  const [editedValues, setEditedValues] = useState(Array(7).fill(false));
  const [editedTestingValues, setEditedTestingValues] = useState(
    Array(7).fill(false),
  );
  const [editedDevopsValues, setEditedDevopsValues] = useState(
    Array(7).fill(false),
  );
  const [editedMeetingValues, setEditedMeetingValues] = useState(
    Array(7).fill(false),
  );
  const [editedDataValues, setEditedDataValues] = useState(
    Array(7).fill(false),
  );
  const [editedTaValues, setEditedTaValues] = useState(Array(7).fill(false));
  const [editedTdValues, setEditedTdValues] = useState(Array(7).fill(false));
  const [editedEeValues, setEditedEeValues] = useState(Array(7).fill(false));
  const [editedPmValues, setEditedPmValues] = useState(Array(7).fill(false));
  const [editedCbValues, setEditedCbValues] = useState(Array(7).fill(false));
  const [editedAcValues, setEditedAcValues] = useState(Array(7).fill(false));
  const [editedMisValues, setEditedMisValues] = useState(Array(7).fill(false));
  const [workStatusValues, setWorkStatusValues] = useState(
    Array(7).fill("WFO"),
  );
  const [open, setOpen] = React.useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false);
  const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const [data1, setData1] = useState([]);
  const [formData, setFormData] = useState([]);
  const [result1, setResult1] = useState();
  const [dates, setDates] = useState({
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
    sat: "",
    sun: "",
  });
  const [effort, setEffort] = useState(" ");
  const [effortDate, setEffortDate] = useState("");
  // const [employeeId, setEmployeeId] = useState("");
  const employeeId = user?.employeeId;
  const [effort_task_description, setEffort_task_description] = useState("");
  const [loading, setLoading] = useState(false);
  const [blurScreen, setBlurScreen] = useState(false);
  const [allowedModules, setAllowedModules] = useState([]);

  useEffect(() => {
    if (!employeeId) return;

    fetch(`http://localhost:8080/api/employee/modules?employeeId=${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Allowed Modules:", data);
        setAllowedModules(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Module fetch error:", err));
  }, [employeeId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (projectId === Taskname.humanResourceProjectId) {
          document.body.classList.add("overflow-visible");
        } else {
          document.body.classList.remove("overflow-visible");
        }
        console.log("Project ID:", projectId);
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - today.getDay() + 1 + 7 * weekOffset,
        );
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        const formattedStartDate = getFormattedDate(startOfWeek);
        const formattedEndDate = getFormattedDate(endOfWeek);

        const timeManagementResponse = await axios.get(
          `/stubium/employee/${empID}/effortDateRange`,
          {
            params: {
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            },
          },
        );

        console.log(
          "Time Management Response Data:",
          timeManagementResponse.data,
        );
        const results = timeManagementResponse.data;
        console.log("Results:", results);
        setResults(results);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchData();
    setDatesForWeek(weekOffset);
  }, [weekOffset, empID, totalValues, projectId]);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const getFormattedDate = (date) => {
    const formatter = new Intl.DateTimeFormat("en", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });

    const formattedDate = formatter.format(date);
    const parts = formattedDate.split("/");
    return `${parts[1]}-${parts[0]}-${parts[2]}`;
  };

  const setDatesForWeek = (offset) => {
    const today = new Date();
    today.setDate(today.getDate() + 7 * offset);
    const day = today.getDay();

    const daysToAdd = {
      mon: 1 - day,
      tue: 2 - day,
      wed: 3 - day,
      thu: 4 - day,
      fri: 5 - day,
      sat: 6 - day,
      sun: 7 - day,
    };

    const monDate = new Date(today);
    monDate.setDate(today.getDate() + daysToAdd.mon);
    const tueDate = new Date(today);
    tueDate.setDate(today.getDate() + daysToAdd.tue);
    const wedDate = new Date(today);
    wedDate.setDate(today.getDate() + daysToAdd.wed);
    const thuDate = new Date(today);
    thuDate.setDate(today.getDate() + daysToAdd.thu);
    const friDate = new Date(today);
    friDate.setDate(today.getDate() + daysToAdd.fri);
    const satDate = new Date(today);
    satDate.setDate(today.getDate() + daysToAdd.sat);
    const sunDate = new Date(today);
    sunDate.setDate(today.getDate() + daysToAdd.sun);

    setDates({
      mon: getFormattedDate(monDate),
      tue: getFormattedDate(tueDate),
      wed: getFormattedDate(wedDate),
      thu: getFormattedDate(thuDate),
      fri: getFormattedDate(friDate),
      sat: getFormattedDate(satDate),
      sun: getFormattedDate(sunDate),
    });
  };

  const updateEnteredValues = () => {
    setEnteredValues((prevEnteredValues) => {
      const currentWeekEnteredValues = {
        coding: codingValues,
        testing: testingValues,
        devops: devopsValues,
        meeting: meetingValues,
        data: dataValues,
        ta: taValues,
        td: tdValues,
        ee: eeValues,
        pm: pmValues,
        cb: cbValues,
        ac: acValues,
        mis: misValues,
        total: totalValues,
      };
      return {
        ...prevEnteredValues,
        [weekOffset]: currentWeekEnteredValues,
      };
    });
  };

  const handleArrowRightClick = () => {
    if (weekOffset < 0) {
      setLoading(true);
      setBlurScreen(true);
      setWeekOffset((prevOffset) => prevOffset + 1);
      updateEnteredValues();
      setTimeout(() => {
        setEditedValues(Array(7).fill(false));
        setEditedTestingValues(Array(7).fill(false));
        setEditedDevopsValues(Array(7).fill(false));
        setEditedMeetingValues(Array(7).fill(false));
        setEditedDataValues(Array(7).fill(false));
        setEditedTaValues(Array(7).fill(false));
        setEditedTdValues(Array(7).fill(false));
        setEditedEeValues(Array(7).fill(false));
        setEditedPmValues(Array(7).fill(false));
        setEditedCbValues(Array(7).fill(false));
        setEditedAcValues(Array(7).fill(false));
        setEditedMisValues(Array(7).fill(false));
        setCodingValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 1) || 0,
          ),
        );
        setTestingValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 2) || 0,
          ),
        );

        setDevopsValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 3) || 0,
          ),
        );
        setMeetingValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 4) || 0,
          ),
        );
        setDataValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 5) || 0,
          ),
        );
        setTaValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 6) || 0,
          ),
        );
        setTdValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 8) || 0,
          ),
        );
        setEeValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 9) || 0,
          ),
        );
        setPmValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 10) || 0,
          ),
        );
        setCbValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 11) || 0,
          ),
        );
        setAcValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 12) || 0,
          ),
        );
        setMisValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 7) || 0,
          ),
        );
        setTotalValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 0) || 0,
          ),
        );
        setEditedValues(Array(7).fill(false));
        setEditedTestingValues(Array(7).fill(false));
        setEditedDevopsValues(Array(7).fill(false));
        setEditedMeetingValues(Array(7).fill(false));
        setEditedDataValues(Array(7).fill(false));
        setEditedTaValues(Array(7).fill(false));
        setEditedTdValues(Array(7).fill(false));
        setEditedEeValues(Array(7).fill(false));
        setEditedPmValues(Array(7).fill(false));
        setEditedCbValues(Array(7).fill(false));
        setEditedAcValues(Array(7).fill(false));
        setEditedMisValues(Array(7).fill(false));
        setBlurScreen(false);
        setLoading(false);
      }, 2000);
    }
  };

  const handleArrowLeftClick = () => {
    if (weekOffset > -2) {
      setBlurScreen(true);
      setLoading(true);
      setWeekOffset((prevOffset) => prevOffset - 1);
      updateEnteredValues();
      setTimeout(() => {
        setEditedValues(Array(7).fill(false));
        setEditedTestingValues(Array(7).fill(false));
        setEditedDevopsValues(Array(7).fill(false));
        setEditedMeetingValues(Array(7).fill(false));
        setEditedDataValues(Array(7).fill(false));
        setEditedTaValues(Array(7).fill(false));
        setEditedTdValues(Array(7).fill(false));
        setEditedEeValues(Array(7).fill(false));
        setEditedPmValues(Array(7).fill(false));
        setEditedCbValues(Array(7).fill(false));
        setEditedAcValues(Array(7).fill(false));
        setEditedMisValues(Array(7).fill(false));

        setCodingValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 1) || 0,
          ),
        );
        setTestingValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 2) || 0,
          ),
        );
        setDevopsValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 3) || 0,
          ),
        );
        setMeetingValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 4) || 0,
          ),
        );
        setDataValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 5) || 0,
          ),
        );
        setTaValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 6) || 0,
          ),
        );
        setTdValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 8) || 0,
          ),
        );
        setEeValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 9) || 0,
          ),
        );
        setPmValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 10) || 0,
          ),
        );
        setCbValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 11) || 0,
          ),
        );
        setAcValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 12) || 0,
          ),
        );
        setMisValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 7) || 0,
          ),
        );

        setTotalValues((prevValues) =>
          prevValues.map(
            (_, index) => handleEffort(dates[daysOfWeek[index]], 0) || 0,
          ),
        );

        setEditedValues(Array(7).fill(false));
        setEditedTestingValues(Array(7).fill(false));
        setEditedDevopsValues(Array(7).fill(false));
        setEditedMeetingValues(Array(7).fill(false));
        setEditedDataValues(Array(7).fill(false));
        setEditedTaValues(Array(7).fill(false));
        setEditedTdValues(Array(7).fill(false));
        setEditedEeValues(Array(7).fill(false));
        setEditedPmValues(Array(7).fill(false));
        setEditedCbValues(Array(7).fill(false));
        setEditedAcValues(Array(7).fill(false));
        setEditedMisValues(Array(7).fill(false));
        setBlurScreen(false);
        setLoading(false);
      }, 2000);
    }
  };

  const isFutureDay = (dayOfWeek) => {
    const today = new Date();
    const currentWeekOffset =
      new Date().getDay() === 0 ? weekOffset - 1 : weekOffset;
    const offsetDate = new Date(
      today.setDate(today.getDate() + 7 * currentWeekOffset),
    );
    const currentDay = today.getDay();
    if (currentWeekOffset >= -2 && currentWeekOffset <= 0) {
      return currentWeekOffset === 0 ? dayOfWeek > currentDay : false;
    } else {
      return true;
    }
  };

  const handleCodingChange = (index, value) => {
    setTaskId(1);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newCodingValues = [...codingValues];
      newCodingValues[index] = value;
      setCodingValues(newCodingValues);
      updateTotalValues(index, value, "coding");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: {
            ...currentWeekEnteredValues,
            coding: newCodingValues,
          },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleTestingChange = (index, value) => {
    setTaskId(2);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newTestingValues = [...testingValues];
      newTestingValues[index] = value;
      setTestingValues(newTestingValues);
      updateTotalValues(index, value, "testing");
      setWarningMessage("");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: {
            ...currentWeekEnteredValues,
            testing: newTestingValues,
          },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleDevopsChange = (index, value) => {
    setTaskId(3);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newDevopsValues = [...devopsValues];
      newDevopsValues[index] = value;
      setDevopsValues(newDevopsValues);
      updateTotalValues(index, value, "devops");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: {
            ...currentWeekEnteredValues,
            devops: newDevopsValues,
          },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleMeetingChange = (index, value) => {
    setTaskId(4);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newMeetingValues = [...meetingValues];
      newMeetingValues[index] = value;
      setMeetingValues(newMeetingValues);
      updateTotalValues(index, value, "meeting");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: {
            ...currentWeekEnteredValues,
            meeting: newMeetingValues,
          },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleDataChange = (index, value) => {
    setTaskId(5);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newDataValues = [...dataValues];
      newDataValues[index] = value;
      setDataValues(newDataValues);
      updateTotalValues(index, value, "data");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: { ...currentWeekEnteredValues, data: newDataValues },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleTaChange = (index, value) => {
    setTaskId(6);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newTaValues = [...taValues];
      newTaValues[index] = value;
      setTaValues(newTaValues);
      updateTotalValues(index, value, "ta");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: { ...currentWeekEnteredValues, ta: newTaValues },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleTdChange = (index, value) => {
    setTaskId(8);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newTdValues = [...tdValues];
      newTdValues[index] = value;
      console.log("New TD Values:", newTdValues); // Add this line
      setTdValues(newTdValues);
      updateTotalValues(index, value, "td");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: { ...currentWeekEnteredValues, td: newTdValues },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleEeChange = (index, value) => {
    setTaskId(9);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newEeValues = [...eeValues];
      newEeValues[index] = value;
      setEeValues(newEeValues);
      updateTotalValues(index, value, "ee");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: { ...currentWeekEnteredValues, ee: newEeValues },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handlePmChange = (index, value) => {
    setTaskId(10);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newPmValues = [...pmValues];
      newPmValues[index] = value;
      setPmValues(newPmValues);
      updateTotalValues(index, value, "pm");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: { ...currentWeekEnteredValues, pm: newPmValues },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleCbChange = (index, value) => {
    setTaskId(11);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newCbValues = [...cbValues];
      newCbValues[index] = value;
      setCbValues(newCbValues);
      updateTotalValues(index, value, "cb");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: { ...currentWeekEnteredValues, cb: newCbValues },
        };
      });
    } else {
      setOpen(true);
    }
  };

  const handleAcChange = (index, value) => {
    setTaskId(12);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newAcValues = [...acValues];
      newAcValues[index] = value;
      setAcValues(newAcValues);
      updateTotalValues(index, value, "ac");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: { ...currentWeekEnteredValues, ac: newAcValues },
        };
      });
    } else {
      setOpen(true);
    }
  };
  const handleMisChange = (index, value) => {
    setTaskId(7);
    if (value >= 0 && value <= 24 && !isNaN(value)) {
      const newMisValues = [...misValues];
      newMisValues[index] = value;
      setMisValues(newMisValues);
      updateTotalValues(index, value, "mis");
      setEnteredValues((prevEnteredValues) => {
        const currentWeekEnteredValues = prevEnteredValues[weekOffset] || {};
        return {
          ...prevEnteredValues,
          [weekOffset]: { ...currentWeekEnteredValues, mis: newMisValues },
        };
      });
    } else {
      setOpen(true);
    }
  };
  const handleWorkStatusChange = (index, value) => {
    const newStatus = [...workStatusValues];
    newStatus[index] = value;
    setWorkStatusValues(newStatus);
  };

  const updateTotalValues = (index, value, type) => {
    const newTotalValues = [...totalValues];
    let total = 0;

    if (type === "coding") {
      total =
        value +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "testing") {
      total =
        codingValues[index] +
        value +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "devops") {
      total =
        codingValues[index] +
        testingValues[index] +
        value +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "meeting") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        value +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "data") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        value +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "ta") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        value +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "td") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        value +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "ee") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        value +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "pm") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        value +
        cbValues[index] +
        acValues[index] +
        misValues[index];
    } else if (type === "cb") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        value +
        acValues[index] +
        misValues[index];
    } else if (type === "ac") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        value +
        acValues[index] +
        misValues[index];
    } else if (type === "mis") {
      total =
        codingValues[index] +
        testingValues[index] +
        devopsValues[index] +
        meetingValues[index] +
        dataValues[index] +
        taValues[index] +
        tdValues[index] +
        eeValues[index] +
        pmValues[index] +
        cbValues[index] +
        acValues[index] +
        value;
    }

    newTotalValues[index] = total;
    console.log("Total Values:", totalValues);
    setTotalValues(newTotalValues);
  };

  const handleCancel = () => {
    setCodingValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 1) || 0,
      ),
    );
    setTestingValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 2) || 0,
      ),
    );
    setDevopsValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 3) || 0,
      ),
    );
    setMeetingValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 4) || 0,
      ),
    );
    setDataValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 5) || 0,
      ),
    );
    setTaValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 6) || 0,
      ),
    );
    setTdValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 8) || 0,
      ),
    );
    setEeValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 9) || 0,
      ),
    );
    setPmValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 10) || 0,
      ),
    );
    setCbValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 11) || 0,
      ),
    );
    setAcValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 12) || 0,
      ),
    );
    setMisValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 7) || 0,
      ),
    );
    setTotalValues((prevValues) =>
      prevValues.map(
        (_, index) => handleEffort(dates[daysOfWeek[index]], 0) || 0,
      ),
    );
  };

  const handleTotal = (date1, intValue1, empID) => {
    const totalEntry = results.find(
      (entry) =>
        entry.effortDate === date1 &&
        entry.taskId === intValue1 &&
        entry.employeeId === empID,
    );
    if (totalEntry) {
      return totalEntry.effort;
    }
    return 0;
  };

  const handleSum1 = (index) => {
    let ele1 = document.getElementById(`coding_${index}`);
    let ele2 = document.getElementById(`testing_${index}`);
    let ele3 = document.getElementById(`devops_${index}`);
    let ele4 = document.getElementById(`meeting_${index}`);
    let ele5 = document.getElementById(`data_${index}`);
    let ele6 = document.getElementById(`ta_${index}`);
    let ele7 = document.getElementById(`td_${index}`);
    let ele8 = document.getElementById(`ee_${index}`);
    let ele9 = document.getElementById(`pm_${index}`);
    let ele10 = document.getElementById(`cb_${index}`);
    let ele11 = document.getElementById(`ac_${index}`);
    let ele12 = document.getElementById(`mis_${index}`);
    let sum =
      Number(ele1 !== null ? ele1.value : 0) +
      Number(ele2 !== null ? ele2.value : 0) +
      Number(ele3 !== null ? ele3.value : 0) +
      Number(ele4 !== null ? ele4.value : 0) +
      Number(ele5 !== null ? ele5.value : 0) +
      Number(ele6 !== null ? ele6.value : 0) +
      Number(ele7 !== null ? ele7.value : 0) +
      Number(ele8 !== null ? ele8.value : 0) +
      Number(ele9 !== null ? ele9.value : 0) +
      Number(ele10 !== null ? ele10.value : 0) +
      Number(ele11 !== null ? ele11.value : 0) +
      Number(ele12 !== null ? ele12.value : 0);
    return sum;
  };

  const theme = useTheme();

  const theme1 = createTheme({
    palette: {
      primary: {
        main: "#585858",
      },
    },
  });
  const handleEffort = (date, intValue, index) => {
    const matchingEntry = results.find(
      (entry) => entry.effortDate === date && entry.taskId === intValue,
    );
    if (matchingEntry) {
      console.log("Effort Date:", date);
      console.log("Task Id:", intValue);
      console.log("Matching Effort:", matchingEntry.effort);
      return matchingEntry.effort;
    }
    return 0;
  };

  const handleBlurEvent = (taskId, effortDate, typedValue) => {
    const convertedEffortDate = convertDateFormat(effortDate);

    const newData = {
      taskId: taskId,
      effortDate: convertedEffortDate,
      effort: typedValue,
      employeeId: empID,
      project_id: projectId,
      effort_task_description: getTaskDescription(taskId),
    };
    setFormData((prevData) => [...prevData, newData]);
  };

  const convertDateFormat = (oldFormat) => {
    const [dd, mm, yy] = oldFormat.split("-");
    const convertedDate = `20${yy}-${mm}-${dd}`;
    return convertedDate;
  };

  const getTaskDescription = (taskId) => {
    switch (taskId) {
      case 1:
        return "Coding";
      case 2:
        return "Testing";
      case 3:
        return "DevOps";
      case 4:
        return "Meeting";
      case 5:
        return "Database";
      case 6:
        return "Talent Acquisition";
      case 7:
        return "Miscellaneous";
      case 8:
        return "Training and Development";
      case 9:
        return "Employee Engagement";
      case 10:
        return "Performance Management";
      case 11:
        return "Compensation and Benefits";
      default:
        return "Audits and Compilance";
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("/stibium/recordwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("API call successful");
        setFormData([]);
        setSuccessSnackbarOpen(true);
      } else {
        console.error("API call failed");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (codingValues[index] > 0) {
          const newValue = Math.floor(codingValues[index] / 10);
          shouldResetValue = newValue === 0;
          setCodingValues((prevCodingValues) => {
            const newCodingValues = [...prevCodingValues];
            newCodingValues[index] = shouldResetValue ? 0 : newValue;
            return newCodingValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown1 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (testingValues[index] > 0) {
          const newValue = Math.floor(testingValues[index] / 10);
          shouldResetValue = newValue === 0;
          setTestingValues((prevTestingValues) => {
            const newTestingValues = [...prevTestingValues];
            newTestingValues[index] = shouldResetValue ? 0 : newValue;
            return newTestingValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown2 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (devopsValues[index] > 0) {
          const newValue = Math.floor(devopsValues[index] / 10);
          shouldResetValue = newValue === 0;
          setDevopsValues((prevDevopsValues) => {
            const newDevopsValues = [...prevDevopsValues];
            newDevopsValues[index] = shouldResetValue ? 0 : newValue;
            return newDevopsValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown3 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (meetingValues[index] > 0) {
          const newValue = Math.floor(meetingValues[index] / 10);
          shouldResetValue = newValue === 0;
          setMeetingValues((prevMeetingValues) => {
            const newMeetingValues = [...prevMeetingValues];
            newMeetingValues[index] = shouldResetValue ? 0 : newValue;
            return newMeetingValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown4 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (dataValues[index] > 0) {
          const newValue = Math.floor(dataValues[index] / 10);
          shouldResetValue = newValue === 0;
          setDataValues((prevDataValues) => {
            const newDataValues = [...prevDataValues];
            newDataValues[index] = shouldResetValue ? 0 : newValue;
            return newDataValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown5 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (taValues[index] > 0) {
          const newValue = Math.floor(taValues[index] / 10);
          shouldResetValue = newValue === 0;
          setTaValues((prevTaValues) => {
            const newTaValues = [...prevTaValues];
            newTaValues[index] = shouldResetValue ? 0 : newValue;
            return newTaValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown6 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (misValues[index] > 0) {
          const newValue = Math.floor(misValues[index] / 10);
          shouldResetValue = newValue === 0;
          setMisValues((prevMisValues) => {
            const newMisValues = [...prevMisValues];
            newMisValues[index] = shouldResetValue ? 0 : newValue;
            return newMisValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown7 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (tdValues[index] > 0) {
          const newValue = Math.floor(misValues[index] / 10);
          shouldResetValue = newValue === 0;
          setTdValues((prevTdValues) => {
            const newTdValues = [...prevTdValues];
            newTdValues[index] = shouldResetValue ? 0 : newValue;
            return newTdValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown8 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (eeValues[index] > 0) {
          const newValue = Math.floor(misValues[index] / 10);
          shouldResetValue = newValue === 0;
          setEeValues((prevEeValues) => {
            const newEeValues = [...prevEeValues];
            newEeValues[index] = shouldResetValue ? 0 : newValue;
            return newEeValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown9 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (pmValues[index] > 0) {
          const newValue = Math.floor(misValues[index] / 10);
          shouldResetValue = newValue === 0;
          setPmValues((prevPmValues) => {
            const newPmValues = [...prevPmValues];
            newPmValues[index] = shouldResetValue ? 0 : newValue;
            return newPmValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown10 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (cbValues[index] > 0) {
          const newValue = Math.floor(misValues[index] / 10);
          shouldResetValue = newValue === 0;
          setCbValues((prevCbValues) => {
            const newCbValues = [...prevCbValues];
            newCbValues[index] = shouldResetValue ? 0 : newValue;
            return newCbValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  const handleKeyDown11 = (event, index) => {
    if (event.key === "Backspace") {
      setEditedValues((prevEditedValues) => {
        const newEditedValues = [...prevEditedValues];
        let shouldResetValue = false;
        if (acValues[index] > 0) {
          const newValue = Math.floor(misValues[index] / 10);
          shouldResetValue = newValue === 0;
          setAcValues((prevAcValues) => {
            const newAcValues = [...prevAcValues];
            newAcValues[index] = shouldResetValue ? 0 : newValue;
            return newAcValues;
          });
        }
        newEditedValues[index] = !shouldResetValue;
        return newEditedValues;
      });
    }
  };

  return (
    <Grid container direction="row" style={{ minHeight: "100vh" }}>
      {/* 👉 Sidebar with buttons */}
      <Grid
        item
        xs={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 2,
          p: 2,
          pl: 6, //ad extra padding to shift right
        }}
      >
        <IconButton
          onClick={() => navigate("/dashboard")}
          sx={{
            color: "common.white",
            top: 13,
            left: 16,
            position: "absolute",
          }}
        >
          <ArrowBackIosIcon fontSize="30" />
        </IconButton>

        {allowedModules.includes("APPROVALS") && (
          <Button
            variant="outlined"
            className="sidebar-button"
            onClick={() => navigate("/approvals")}
            sx={{ height: 50, lineHeight: "50px" }}
          >
            APPROVALS
          </Button>
        )}

        {allowedModules.includes("LEAVE_RECONCILIATION") && (
          <Button
            variant="outlined"
            className="sidebar-button"
            onClick={() => navigate("/leaveReconcilation")}
          >
            LEAVE RECONCILIATION
          </Button>
        )}

        {allowedModules.includes("LEAVE") && (
          <Button
            variant="outlined"
            className="sidebar-button"
            onClick={() => navigate("/leavepage")}
            sx={{ height: 50, lineHeight: "50px" }}
          >
            LEAVE
          </Button>
        )}

        {allowedModules.includes("HOLIDAY_CALENDAR") && (
          <Button
            variant="outlined"
            className="sidebar-button"
            onClick={() => navigate("/holidaycalendar")}
          >
            HOLIDAY CALENDAR
          </Button>
        )}
      </Grid>

      {loading && (
        <div className="spinner-overlay">
          <CircularProgress
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}
      <Grid item xs={10} className={`wrapper ${blurScreen ? "blur" : ""}`}>
        <h1 className="title">Worksheet Tracker</h1>
        <p style={{ display: "none" }}>Project ID: {projectId}</p>
        {results.map((item, index) => (
          <p style={{ display: "none" }} key={index}>
            Effort Date: {item.effortDate}, Task ID: {item.taskId}
          </p>
        ))}
        <TableContainer
          component={Paper}
          sx={{ width: "110%", marginTop: "3%" }}
        >
          <Table sx={{ minWidth: 800 }} aria-label="simple table">
            <TableHead style={{ maxHeight: "50px", border: "1px solid grey" }}>
              <TableRow
                style={{
                  backgroundColor: theme.palette.primary.main,
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
              >
                <TableCell
                  style={{
                    width: "35px",
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: "20px",
                    fontWeight: "bold",
                    height: "10px",
                    color: "white",
                    backgroundColor: "black",
                  }}
                >
                  Task
                </TableCell>
                <TableCell
                  style={{
                    width: "90px",
                    fontFamily: "Arial",
                    fontSize: "12px",
                    height: "10px",
                    color: "white",
                    backgroundColor: "black",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "120px",
                      display: "flex",
                      alignItems: "left",
                      justifyContent: weekOffset > -2 ? "left" : "flex-end",
                      gap: "4px",
                      cursor: "pointer",
                      marginLeft: "-22% ",
                    }}
                  >
                    <IconButton
                      onClick={handleArrowLeftClick}
                      style={{
                        color: "white",
                        padding: "0",
                        marginLeft: "4px",
                        display: weekOffset > -2 ? "block" : "none",
                      }}
                    >
                      <KeyboardArrowLeftIcon style={{ fontSize: "35px" }} />
                    </IconButton>
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                        backgroundColor: "black",
                      }}
                    >
                      Mon
                      <br />
                      {dates.mon}
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  style={{
                    width: "90px",
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    height: "10px",
                    color: "white",
                    backgroundColor: "black",
                  }}
                >
                  Tue
                  <br /> {dates.tue}{" "}
                </TableCell>
                <TableCell
                  style={{
                    width: "90px",
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    height: "10px",
                    color: "white",
                    backgroundColor: "black",
                  }}
                >
                  Wed
                  <br />
                  {dates.wed}{" "}
                </TableCell>
                <TableCell
                  style={{
                    width: "90px",
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    height: "10px",
                    color: "white",
                    backgroundColor: "black",
                  }}
                >
                  Thu
                  <br />
                  {dates.thu}{" "}
                </TableCell>
                <TableCell
                  style={{
                    width: "90px",
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    height: "10px",
                    color: "white",
                    backgroundColor: "black",
                  }}
                >
                  Fri
                  <br />
                  {dates.fri}{" "}
                </TableCell>
                <TableCell
                  style={{
                    width: "90px",
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    height: "10px",
                    color: "white",
                    backgroundColor: "black",
                  }}
                >
                  Sat
                  <br />
                  {dates.sat}{" "}
                </TableCell>
                <TableCell
                  style={{
                    width: "90px",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    height: "10px",
                    color: "white",
                    backgroundColor: "Black",
                  }}
                >
                  <div
                    style={{
                      width: "90px",
                      display: "flex",
                      alignItems: "left",
                      justifyContent: "left",
                      gap: "0px",
                      cursor: "pointer",
                      marginLeft: "15%",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      Sun
                      <br />
                      {dates.sun}
                    </div>
                    <div
                      style={{ display: weekOffset === 0 ? "none" : "block" }}
                    >
                      <IconButton
                        onClick={handleArrowRightClick}
                        style={{
                          color: "white",
                          padding: "0",
                          marginLeft: "1%",
                        }}
                      >
                        <KeyboardArrowRightIcon style={{ fontSize: "35px" }} />
                      </IconButton>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectId !== Taskname.humanResourceProjectId && (
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#676c71",
                      fontFamily: "Arial",
                      fontSize: "14px",
                      color: "white",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    Coding
                  </TableCell>
                  {codingValues.map((value, index) => (
                    <TableCell
                      key={index}
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        fontSize: "12px",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id={`coding_${index}`}
                        variant="filled"
                        size="small"
                        value={
                          editedValues[index]
                            ? codingValues[index]
                            : handleEffort(dates[daysOfWeek[index]], 1)
                        }
                        onChange={(event) => {
                          const inputValue = event.target.value.replace(
                            /\D/g,
                            "",
                          );
                          handleCodingChange(
                            index,
                            inputValue === "" ? 0 : parseInt(inputValue, 10),
                          );
                          setEditedValues((prevEditedValues) => {
                            const newEditedValues = [...prevEditedValues];
                            newEditedValues[index] = true;
                            return newEditedValues;
                          });
                        }}
                        onBlur={(event) => {
                          setTaskId(1);
                          handleBlurEvent(
                            1,
                            dates[daysOfWeek[index]],
                            event.target.value,
                          );
                        }}
                        onKeyDown={handleKeyDown}
                        onWheel={(e) => e.target.blur()}
                        InputProps={{
                          inputProps: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: {
                              textAlign: "center",
                              padding: "10px 0px",
                              fontSize: "13px",
                              height: "16px",
                            },
                          },
                          disableUnderline: true,
                          disabled: isFutureDay(index + 1),
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              )}

              {projectId !== Taskname.humanResourceProjectId && (
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#676c71",
                      fontFamily: "Arial",
                      color: "white",
                      fontSize: "14px",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    Testing
                  </TableCell>
                  {testingValues.map((value, index) => (
                    <TableCell
                      key={index}
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id={`testing_${index}`}
                        variant="filled"
                        size="small"
                        value={
                          editedTestingValues[index]
                            ? testingValues[index]
                            : handleEffort(dates[daysOfWeek[index]], 2)
                        }
                        onChange={(event) => {
                          const inputValue = event.target.value.replace(
                            /\D/g,
                            "",
                          );
                          handleTestingChange(
                            index,
                            inputValue === "" ? 0 : parseInt(inputValue, 10),
                          );
                          setEditedTestingValues((prevEditedValues) => {
                            const newEditedValues = [...prevEditedValues];
                            newEditedValues[index] = true;
                            return newEditedValues;
                          });
                        }}
                        onBlur={(event) => {
                          setTaskId(2);
                          handleBlurEvent(
                            2,
                            dates[daysOfWeek[index]],
                            event.target.value,
                          );
                        }}
                        onKeyDown={handleKeyDown1}
                        onWheel={(e) => e.target.blur()}
                        InputProps={{
                          inputProps: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: {
                              textAlign: "center",
                              padding: "10px 0px",
                              fontSize: "13px",
                              height: "16px",
                            },
                          },
                          disableUnderline: true,
                          disabled: isFutureDay(index + 1),
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              )}

              {projectId !== Taskname.humanResourceProjectId && (
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#676c71",
                      fontFamily: "Arial",
                      fontSize: "14px",
                      color: "white",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    DevOps
                  </TableCell>
                  {devopsValues.map((value, index) => (
                    <TableCell
                      key={index}
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id={`devops_${index}`}
                        variant="filled"
                        size="small"
                        value={
                          editedDevopsValues[index]
                            ? devopsValues[index]
                            : handleEffort(dates[daysOfWeek[index]], 3)
                        }
                        onChange={(event) => {
                          const inputValue = event.target.value.replace(
                            /\D/g,
                            "",
                          );
                          handleDevopsChange(
                            index,
                            inputValue === "" ? 0 : parseInt(inputValue, 10),
                          );
                          setEditedDevopsValues((prevEditedValues) => {
                            const newEditedValues = [...prevEditedValues];
                            newEditedValues[index] = true;
                            return newEditedValues;
                          });
                        }}
                        onBlur={(event) => {
                          setTaskId(3);
                          handleBlurEvent(
                            3,
                            dates[daysOfWeek[index]],
                            event.target.value,
                          );
                        }}
                        onKeyDown={handleKeyDown2}
                        onWheel={(e) => e.target.blur()}
                        InputProps={{
                          inputProps: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: {
                              textAlign: "center",
                              padding: "10px 0px",
                              fontSize: "13px",
                              height: "16px",
                            },
                          },
                          disableUnderline: true,
                          disabled: isFutureDay(index + 1),
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              )}

              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "#676c71",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    color: "white",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  Meeting
                </TableCell>
                {meetingValues.map((value, index) => (
                  <TableCell
                    key={index}
                    style={{
                      backgroundColor: "white",
                      fontFamily: "Arial",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <TextField
                      type="text"
                      id={`meeting_${index}`}
                      variant="filled"
                      size="small"
                      value={
                        editedMeetingValues[index]
                          ? meetingValues[index]
                          : handleEffort(dates[daysOfWeek[index]], 4)
                      }
                      onChange={(event) => {
                        const inputValue = event.target.value.replace(
                          /\D/g,
                          "",
                        );
                        handleMeetingChange(
                          index,
                          inputValue === "" ? 0 : parseInt(inputValue, 10),
                        );
                        setEditedMeetingValues((prevEditedValues) => {
                          const newEditedValues = [...prevEditedValues];
                          newEditedValues[index] = true;
                          return newEditedValues;
                        });
                      }}
                      onBlur={(event) => {
                        setTaskId(4);
                        handleBlurEvent(
                          4,
                          dates[daysOfWeek[index]],
                          event.target.value,
                        );
                      }}
                      onKeyDown={handleKeyDown3}
                      onWheel={(e) => e.target.blur()}
                      InputProps={{
                        inputProps: {
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: {
                            textAlign: "center",
                            padding: "10px 0px",
                            fontSize: "13px",
                            height: "16px",
                          },
                        },
                        disableUnderline: true,
                        disabled: isFutureDay(index + 1),
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>

              {projectId !== Taskname.humanResourceProjectId && (
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#676c71",
                      fontFamily: "Arial",
                      fontSize: "14px",
                      color: "white",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    Database
                  </TableCell>
                  {dataValues.map((value, index) => (
                    <TableCell
                      key={index}
                      style={{
                        backgroundColor: "white",
                        fontFamily: "Arial",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <TextField
                        type="text"
                        id={`data_${index}`}
                        variant="filled"
                        size="small"
                        value={
                          editedDataValues[index]
                            ? dataValues[index]
                            : handleEffort(dates[daysOfWeek[index]], 5)
                        }
                        onChange={(event) => {
                          const inputValue = event.target.value.replace(
                            /\D/g,
                            "",
                          );
                          handleDataChange(
                            index,
                            inputValue === "" ? 0 : parseInt(inputValue, 10),
                          );
                          setEditedDataValues((prevEditedValues) => {
                            const newEditedValues = [...prevEditedValues];
                            newEditedValues[index] = true;
                            return newEditedValues;
                          });
                        }}
                        onBlur={(event) => {
                          setTaskId(5);
                          handleBlurEvent(
                            5,
                            dates[daysOfWeek[index]],
                            event.target.value,
                          );
                        }}
                        onKeyDown={handleKeyDown4}
                        onWheel={(e) => e.target.blur()}
                        InputProps={{
                          inputProps: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: {
                              textAlign: "center",
                              padding: "10px 0px",
                              fontSize: "13px",
                              height: "16px",
                            },
                          },
                          disableUnderline: true,
                          disabled: isFutureDay(index + 1),
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              )}
              {projectId !== Taskname.stibiumProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        fontFamily: "Arial",
                        fontSize: "14px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      Talent Acquisition
                    </TableCell>
                    {taValues.map((value, index) => (
                      <TableCell
                        key={index}
                        style={{
                          backgroundColor: "white",
                          fontFamily: "Arial",
                          textAlign: "center",
                          paddingTop: "1px",
                          paddingBottom: "1px",
                        }}
                      >
                        <TextField
                          type="text"
                          id={`ta_${index}`}
                          variant="filled"
                          size="small"
                          value={
                            editedTaValues[index]
                              ? taValues[index]
                              : handleEffort(dates[daysOfWeek[index]], 6)
                          }
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleTaChange(
                              index,
                              inputValue === "" ? 0 : parseInt(inputValue, 10),
                            );
                            setEditedTaValues((prevEditedValues) => {
                              const newEditedValues = [...prevEditedValues];
                              newEditedValues[index] = true;
                              return newEditedValues;
                            });
                          }}
                          onBlur={(event) => {
                            setTaskId(6);
                            handleBlurEvent(
                              6,
                              dates[daysOfWeek[index]],
                              event.target.value,
                            );
                          }}
                          onKeyDown={handleKeyDown5}
                          onWheel={(e) => e.target.blur()}
                          InputProps={{
                            inputProps: {
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              style: {
                                textAlign: "center",
                                padding: "10px 0px",
                                fontSize: "13px",
                                height: "16px",
                              },
                            },
                            disableUnderline: true,
                            disabled: isFutureDay(index + 1),
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}

              {projectId !== Taskname.stibiumProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        fontFamily: "Arial",
                        fontSize: "14px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      Training and Development
                    </TableCell>
                    {tdValues.map((value, index) => (
                      <TableCell
                        key={index}
                        style={{
                          backgroundColor: "white",
                          fontFamily: "Arial",
                          textAlign: "center",
                          paddingTop: "1px",
                          paddingBottom: "1px",
                        }}
                      >
                        <TextField
                          type="text"
                          id={`td_${index}`}
                          variant="filled"
                          size="small"
                          value={
                            editedTdValues[index]
                              ? tdValues[index]
                              : handleEffort(dates[daysOfWeek[index]], 8)
                          }
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleTdChange(
                              index,
                              inputValue === "" ? 0 : parseInt(inputValue, 10),
                            );
                            setEditedTdValues((prevEditedValues) => {
                              const newEditedValues = [...prevEditedValues];
                              newEditedValues[index] = true;
                              return newEditedValues;
                            });
                          }}
                          onBlur={(event) => {
                            setTaskId(8);
                            handleBlurEvent(
                              8,
                              dates[daysOfWeek[index]],
                              event.target.value,
                            );
                          }}
                          onKeyDown={handleKeyDown7}
                          onWheel={(e) => e.target.blur()}
                          InputProps={{
                            inputProps: {
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              style: {
                                textAlign: "center",
                                padding: "10px 0px",
                                fontSize: "13px",
                                height: "16px",
                              },
                            },
                            disableUnderline: true,
                            disabled: isFutureDay(index + 1),
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}

              {projectId !== Taskname.stibiumProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        fontFamily: "Arial",
                        fontSize: "14px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      Employee Engagement
                    </TableCell>
                    {eeValues.map((value, index) => (
                      <TableCell
                        key={index}
                        style={{
                          backgroundColor: "white",
                          fontFamily: "Arial",
                          textAlign: "center",
                          paddingTop: "1px",
                          paddingBottom: "1px",
                        }}
                      >
                        <TextField
                          type="text"
                          id={`ee_${index}`}
                          variant="filled"
                          size="small"
                          value={
                            editedEeValues[index]
                              ? eeValues[index]
                              : handleEffort(dates[daysOfWeek[index]], 9)
                          }
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleEeChange(
                              index,
                              inputValue === "" ? 0 : parseInt(inputValue, 10),
                            );
                            setEditedEeValues((prevEditedValues) => {
                              const newEditedValues = [...prevEditedValues];
                              newEditedValues[index] = true;
                              return newEditedValues;
                            });
                          }}
                          onBlur={(event) => {
                            setTaskId(9);
                            handleBlurEvent(
                              9,
                              dates[daysOfWeek[index]],
                              event.target.value,
                            );
                          }}
                          onKeyDown={handleKeyDown8}
                          onWheel={(e) => e.target.blur()}
                          InputProps={{
                            inputProps: {
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              style: {
                                textAlign: "center",
                                padding: "10px 0px",
                                fontSize: "13px",
                                height: "16px",
                              },
                            },
                            disableUnderline: true,
                            disabled: isFutureDay(index + 1),
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}

              {projectId !== Taskname.stibiumProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        fontFamily: "Arial",
                        fontSize: "14px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      Performance Management
                    </TableCell>
                    {pmValues.map((value, index) => (
                      <TableCell
                        key={index}
                        style={{
                          backgroundColor: "white",
                          fontFamily: "Arial",
                          textAlign: "center",
                          paddingTop: "1px",
                          paddingBottom: "1px",
                        }}
                      >
                        <TextField
                          type="text"
                          id={`pm_${index}`}
                          variant="filled"
                          size="small"
                          value={
                            editedPmValues[index]
                              ? pmValues[index]
                              : handleEffort(dates[daysOfWeek[index]], 10)
                          }
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handlePmChange(
                              index,
                              inputValue === "" ? 0 : parseInt(inputValue, 10),
                            );
                            setEditedPmValues((prevEditedValues) => {
                              const newEditedValues = [...prevEditedValues];
                              newEditedValues[index] = true;
                              return newEditedValues;
                            });
                          }}
                          onBlur={(event) => {
                            setTaskId(10);
                            handleBlurEvent(
                              10,
                              dates[daysOfWeek[index]],
                              event.target.value,
                            );
                          }}
                          onKeyDown={handleKeyDown9}
                          onWheel={(e) => e.target.blur()}
                          InputProps={{
                            inputProps: {
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              style: {
                                textAlign: "center",
                                padding: "10px 0px",
                                fontSize: "13px",
                                height: "16px",
                              },
                            },
                            disableUnderline: true,
                            disabled: isFutureDay(index + 1),
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}

              {projectId !== Taskname.stibiumProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        fontFamily: "Arial",
                        fontSize: "12px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      Compensation and Benefits
                    </TableCell>
                    {cbValues.map((value, index) => (
                      <TableCell
                        key={index}
                        style={{
                          backgroundColor: "white",
                          fontFamily: "Arial",
                          textAlign: "center",
                          paddingTop: "1px",
                          paddingBottom: "1px",
                        }}
                      >
                        <TextField
                          type="text"
                          id={`cb_${index}`}
                          variant="filled"
                          size="small"
                          value={
                            editedCbValues[index]
                              ? cbValues[index]
                              : handleEffort(dates[daysOfWeek[index]], 11)
                          }
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleCbChange(
                              index,
                              inputValue === "" ? 0 : parseInt(inputValue, 10),
                            );
                            setEditedCbValues((prevEditedValues) => {
                              const newEditedValues = [...prevEditedValues];
                              newEditedValues[index] = true;
                              return newEditedValues;
                            });
                          }}
                          onBlur={(event) => {
                            setTaskId(11);
                            handleBlurEvent(
                              11,
                              dates[daysOfWeek[index]],
                              event.target.value,
                            );
                          }}
                          onKeyDown={handleKeyDown10}
                          onWheel={(e) => e.target.blur()}
                          InputProps={{
                            inputProps: {
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              style: {
                                textAlign: "center",
                                padding: "10px 0px",
                                fontSize: "13px",
                                height: "16px",
                              },
                            },
                            disableUnderline: true,
                            disabled: isFutureDay(index + 1),
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}

              {projectId !== Taskname.stibiumProjectId &&
                projectId !== Taskname.aomaDeliveryProjectId &&
                projectId !== Taskname.aomaPromoProjectId &&
                projectId !== Taskname.grpsProjectId &&
                projectId !== Taskname.starProjectId &&
                projectId !== Taskname.samisProjectId &&
                projectId !== Taskname.eomProjectId &&
                projectId !== Taskname.devopsProjectId &&
                projectId !== Taskname.scubaProjectId &&
                projectId !== Taskname.carmaProjectId &&
                projectId !== Taskname.radarProjectId && (
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        fontFamily: "Arial",
                        fontSize: "12px",
                        color: "white",
                        textAlign: "center",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      Audits and Compilance
                    </TableCell>
                    {acValues.map((value, index) => (
                      <TableCell
                        key={index}
                        style={{
                          backgroundColor: "white",
                          fontFamily: "Arial",
                          textAlign: "center",
                          paddingTop: "1px",
                          paddingBottom: "1px",
                        }}
                      >
                        <TextField
                          type="text"
                          id={`ac_${index}`}
                          variant="filled"
                          size="small"
                          value={
                            editedAcValues[index]
                              ? acValues[index]
                              : handleEffort(dates[daysOfWeek[index]], 12)
                          }
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleAcChange(
                              index,
                              inputValue === "" ? 0 : parseInt(inputValue, 10),
                            );
                            setEditedAcValues((prevEditedValues) => {
                              const newEditedValues = [...prevEditedValues];
                              newEditedValues[index] = true;
                              return newEditedValues;
                            });
                          }}
                          onBlur={(event) => {
                            setTaskId(12);
                            handleBlurEvent(
                              12,
                              dates[daysOfWeek[index]],
                              event.target.value,
                            );
                          }}
                          onKeyDown={handleKeyDown11}
                          onWheel={(e) => e.target.blur()}
                          InputProps={{
                            inputProps: {
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              style: {
                                textAlign: "center",
                                padding: "10px 0px",
                                fontSize: "13px",
                                height: "16px",
                              },
                            },
                            disableUnderline: true,
                            disabled: isFutureDay(index + 1),
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}

              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "#676c71",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    color: "white",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  Miscellaneous
                </TableCell>
                {misValues.map((value, index) => (
                  <TableCell
                    key={index}
                    style={{
                      backgroundColor: "white",
                      fontFamily: "Arial",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                    }}
                  >
                    <TextField
                      type="text"
                      id={`mis_${index}`}
                      variant="filled"
                      size="small"
                      value={
                        editedMisValues[index]
                          ? misValues[index]
                          : handleEffort(dates[daysOfWeek[index]], 7)
                      }
                      onChange={(event) => {
                        const inputValue = event.target.value.replace(
                          /\D/g,
                          "",
                        );
                        handleMisChange(
                          index,
                          inputValue === "" ? 0 : parseInt(inputValue, 10),
                        );
                        setEditedMisValues((prevEditedValues) => {
                          const newEditedValues = [...prevEditedValues];
                          newEditedValues[index] = true;
                          return newEditedValues;
                        });
                      }}
                      onBlur={(event) => {
                        setTaskId(7);
                        handleBlurEvent(
                          7,
                          dates[daysOfWeek[index]],
                          event.target.value,
                        );
                      }}
                      onKeyDown={handleKeyDown6}
                      onWheel={(e) => e.target.blur()}
                      InputProps={{
                        inputProps: {
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: {
                            textAlign: "center",
                            padding: "10px 0px",
                            fontSize: "13px",
                            height: "16px",
                          },
                        },
                        disableUnderline: true,
                        disabled: isFutureDay(index + 1),
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell
                  size="small" // This reduces default padding
                  sx={{
                    backgroundColor: "#676c71",
                    color: "white",
                    fontSize: "14px",
                    textAlign: "center",
                    fontFamily: "Arial",
                    height: "20px",
                    lineHeight: "20px",
                    padding: "2px 4px", // Minimal padding
                  }}
                >
                  Work Status
                </TableCell>

                {Array(7)
                  .fill("")
                  .map((_, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{
                        height: "40",
                        padding: "1px 10px", //spacinf between dropdowns
                        backgroundColor: "white",
                      }}
                    >
                      <Select
                        value={workStatusValues[index] || "WFO"}
                        onChange={(event) =>
                          handleWorkStatusChange(index, event.target.value)
                        }
                        variant="filled"
                        size="small"
                        disabled={isFutureDay(index + 1)}
                        sx={{
                          width: "90%",
                          fontSize: "12px",
                          fontFamily: "Arial",
                          padding: 0,

                          backgroundColor: "#f0f0f0",
                          minHeight: "20",
                          lineHeight: "1",
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 100,
                              fontSize: "14px",
                              fontFamily: "Arial",
                            },
                          },
                        }}
                      >
                        <MenuItem value="WFO">
                          <em>WFO</em>
                        </MenuItem>
                        <MenuItem value="WFH">WFH</MenuItem>
                      </Select>
                    </TableCell>
                  ))}
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "#353638",
                    height: "30px",
                    fontFamily: "Arial",
                    fontSize: "14px",
                    color: "white",
                    textAlign: "center",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  Total hours
                </TableCell>
                {totalValues.map((value, index) => (
                  <TableCell
                    key={index}
                    style={{
                      backgroundColor: "#353638",
                      fontFamily: "Arial",
                      fontSize: "12px",
                      color: "white",
                      textAlign: "center",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                      paddingLeft: "1.5%",
                    }}
                  >
                    {handleSum1(index)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="buttonContainer">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="customButton"
            sx={{ border: "2px solid white" }}
          >
            Submit
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            className="customButton"
            sx={{
              backgroundColor: "grey.300",
              border: "2px solid red",

              "&:hover": {
                backgroundColor: "grey.400",
              },
            }}
          >
            Cancel
          </Button>
        </Box>

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Please enter a number between 0 and 24
          </Alert>
        </Snackbar>

        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={3000}
          onClose={handleSuccessSnackbarClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MuiAlert
            onClose={handleSuccessSnackbarClose}
            severity="success"
            sx={{
              width: "100%",
              height: "70%",
              backgroundColor: "#2e7d32",
              color: "#ffffff",
            }}
          >
            Details submitted successfully!
          </MuiAlert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};
export default TimesheetTable;

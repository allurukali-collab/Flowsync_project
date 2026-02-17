import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../style/Signup.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

function Signup() {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    


    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: empId,
          password: password,
        }),
      });

      const data = await response.json();
     
      if (!response.ok) {
        triggerToast(data.message || "Wrong Password", "error");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      triggerToast("Signed in successfully!", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      triggerToast("Server not reachable", "error");
      setIsLoading(false);
    }
    
  };
  

  const triggerToast = (message, type) => {
    setToastState({ show: true, message, type });
    setTimeout(() => {
      setToastState({ show: false, message: "", type: "" });
    }, 1000);
  };

  const handleCancel = () => {
  setEmpId("");
  setPassword("");
  setShowPassword(false);
};
  return (
    <>
      <div className="signup-container" style={{ position: "relative" }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.11)",
              backdropFilter: "blur(5px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <CircularProgress size={60} thickness={4.0} />
            <p style={{ marginTop: "12px", fontWeight: "500", color: "#333" }}>
              Redirecting to Dashboard...
            </p>
          </div>
        )}

        <div className="form-box">
          <div className="logo">Stibium</div>
          <h2>Sign In</h2>
          <form onSubmit={handleSignup}>
            <Box mb={3}>
              <TextField
                fullWidth
                required
                label="Employee ID"
                variant="outlined"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                required
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <div className="button-group">
              <button
                type="button"
                className="cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="submit">
                Submit
              </button>
            </div>

            <p className="reset-link">
              {" "}
              <Link to="/forgotpass">Reset Password?</Link>
            </p>
          </form>
        </div>
      </div>
      +
      <Snackbar
        open={toastState.show}
        autoHideDuration={1000}
        onClose={() => setToastState({ show: false, message: "", type: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastState({ show: false, message: "", type: "" })}
          severity={toastState.type}
          variant="filled"
          sx={{ width: "90%" }}
        >
          {toastState.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Signup;

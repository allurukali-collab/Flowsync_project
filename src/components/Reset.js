import React, { Component } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, OutlinedInput } from "@mui/material";

export class Reset extends Component {
  state = {
    step: "OTP",
    otp: "",
    alertMessage: "",
    alertSeverity: "",
    openSnackbar: false,
    showPassword: false,
    loading: false,
    cooldown: 30,
    canResend: false,
  };
  componentDidMount() {
    const successMessage = this.props.location?.state?.successMessage;

    if (successMessage) {
      this.showAlert(successMessage, "success");
    }
   // added this
    this.startCooldown();
  }

  startCooldown = () => {
    this.setState({ canResend: false, cooldown: 30 });

    this.timer = setInterval(() => {
      this.setState((prev) => {
        if (prev.cooldown <= 1) {
          clearInterval(this.timer);
          return { cooldown: 0, canResend: true };
        }
        return { cooldown: prev.cooldown - 1 };
      });
    }, 1000);
  };

  showAlert = (message, severity) => {
    this.setState({
      alertMessage: message,
      alertSeverity: severity,
      openSnackbar: true,
    });
  };

  handleOtpVerify = async (e) => {
    e.preventDefault();
    const { otp } = this.state;
    const email = this.props.location?.state?.email;

    if (otp.length !== 6) {
      this.showAlert("Enter valid 6 digit OTP", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) throw new Error();

      this.showAlert("OTP verified successfully", "success");
      this.setState({ step: "PASSWORD" });
    } catch {
      this.showAlert("Invalid OTP", "error");
    }
  };

  handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const email = this.props.location?.state?.email;
    const newPassword = this.newPassword;
    const confirmPassword = this.confirmPassword;

    if (!newPassword || !confirmPassword) {
      this.showAlert("All fields required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showAlert("Passwords do not match", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword,
          confirmPassword, 
        }),
      });
      const msg = await res.text();

      if (!res.ok) {
        this.showAlert(msg, "error");
        return;
      }

      this.showAlert("Password reset successful", "success");
      setTimeout(() => this.props.navigate("/"), 1500);
    } catch {
      this.showAlert("Server error", "error");
    }
  };

  handleResendOtp = async () => {
    const email = this.props.location?.state?.email;

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/resend-otp?email=${email}`,
        { method: "POST" },
      );

      if (!res.ok) throw new Error();

      this.showAlert("OTP resent to your email", "success");
      this.setState({ otp: "" });

      // ✅ Restart cooldown after resend
      this.startCooldown();
    } catch {
      this.showAlert("Failed to resend OTP", "error");
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const email = this.props.location?.state?.email;
    const newPassword = this.newPassword;
    const confirmPassword = this.confirmPassword;

    if (!newPassword || !confirmPassword) {
      this.showAlert("All fields are required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showAlert("Passwords do not match", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });

      const msg = await res.text();

      if (!res.ok) {
        this.showAlert(msg, "error");
        return;
      }

      this.showAlert("Password reset successful!", "success");
      setTimeout(() => this.props.navigate("/"), 1500);
    } catch {
      this.showAlert("Server error", "error");
    }
  };
  handleOtpChange = (value, index) => {
    const otpArr = this.state.otp.split("");
    otpArr[index] = value;
    const otp = otpArr.join("").slice(0, 6);

    this.setState({ otp });

    // auto move to next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  togglePassword = () => {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  };

  render() {
    const { step, showPassword, openSnackbar, alertMessage, alertSeverity } =
      this.state;

    return (
      <div className="forgot-pass-wrapper">
        {step === "OTP" && (
          <form className="forgot-pass-form" onSubmit={this.handleOtpVerify}>
            <h3>Enter OTP</h3>

            <Box
              sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}
            >
              {[...Array(6)].map((_, i) => (
                <OutlinedInput
                  key={i}
                  id={`otp-${i}`}
                  value={this.state.otp[i] || ""}
                  onChange={(e) => this.handleOtpChange(e.target.value, i)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "18px",
                      width: "25px",
                    },
                  }}
                />
              ))}
            </Box>
            <div className="div">
              <span className="span">Did not recieve OTP?</span>
              <button
                type="button"
                className="resend-btn"
                disabled={!this.state.canResend}
                onClick={this.handleResendOtp}
                style={{
                  background: "none",
                  border: "none",
                  color: this.state.canResend ? "#1976d2" : "gray",
                  cursor: this.state.canResend ? "pointer" : "not-allowed",
                }}
              >
                {this.state.canResend
                  ? "Resend OTP"
                  : `Resend in ${this.state.cooldown}s`}
              </button>
            </div>

            <button className="submit-btn">Verify OTP</button>
          </form>
        )}

        {step === "PASSWORD" && (
          <form
            className="forgot-pass-form"
            onSubmit={this.handlePasswordSubmit}
          >
            <h3>Reset Password</h3>

            <Box sx={{ mb: 2 }}>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                onChange={(e) => (this.newPassword = e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => (this.confirmPassword = e.target.value)}
              />
            </Box>

            <button className="submit-btn">Submit</button>
          </form>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={1500}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={alertSeverity} variant="filled">
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

function ResetWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  return <Reset navigate={navigate} location={location} />;
}

export default ResetWrapper;

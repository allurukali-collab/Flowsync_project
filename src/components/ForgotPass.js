import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Snackbar, Alert } from "@mui/material";
import "./../style/ForgotPass.css";

class ForgotPass extends Component {
  state = {
    showError: false,
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const email = this.emailInput?.value;

    if (!email || !email.includes("@")) {
      this.setState({ showError: true });
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!res.ok) {
        throw new Error("Email not found");
      }

      this.props.navigate("/reset", {
        state: {
          email,
          successMessage: "OTP sent to your registered email",
        },
      });
    } catch (err) {
      this.setState({ showError: true });
    }
  };

  render() {
    return (
      <div className="forgot-pass-wrapper">
        <Snackbar
          open={this.state.showError}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={2000}
          onClose={() => this.setState({ showError: false })}
        >
          <Alert severity="error" variant="filled">
            Email not found or invalid
          </Alert>
        </Snackbar>

        <form className="forgot-pass-form" onSubmit={this.handleSubmit}>
          <h3>Forgot Password</h3>
          <Box sx={{ width: 500, maxWidth: "100%", mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              inputRef={(ref) => (this.emailInput = ref)}
            />
          </Box>
          <button className="submit-btn">Submit</button>
        </form>
      </div>
    );
  }
}

function ForgotPassWrapper() {
  const navigate = useNavigate();
  return <ForgotPass navigate={navigate} />;
}
export default ForgotPassWrapper;

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  MenuItem,
} from "@mui/material";
import axios from "axios"; // axios instance

// Setup axios interceptor for auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AuthPage = () => {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    businessName: "",
    password: "",
    otpSendType: "EMAIL", // or "MOBILE"
  });
  const [otp, setOtp] = useState("");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // "form" | "otp"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ SIGNUP
  const handleRegister = async () => {
    const { name, email, mobile, businessName, password, otpSendType } = form;
    if (!name || !email || !mobile || !businessName || !password) {
      setError("All fields are required!");
      return;
    }
    try {
      setError("");
      const res = await axios.post("/signup", {
        name,
        email,
        mobile,
        businessName,
        otpSendType,
        password,
      });
      setAccountId(res.data?.data?.accountId);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed!");
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required!");
      return;
    }
    try {
      setError("");
      await axios.post("/verify-otp", {
        accountId,
        otp,
      });
      alert("OTP verified 🎉 You can now login.");
      setStep("form");
      setTab(0); // switch to login
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed!");
    }
  };

  // ✅ LOGIN
  // ✅ LOGIN
  const handleLogin = async () => {
    if (!form.email && !form.mobile) {
      setError("Email or Mobile is required!");
      return;
    }
    if (!form.password) {
      setError("Password is required!");
      return;
    }

    try {
      setError("");

      // build payload dynamically
      const payload = { password: form.password };
      if (form.email) payload.email = form.email;
      if (form.mobile) payload.mobile = form.mobile;

      console.log("Login payload:", payload); // 🐛 Debug

      const res = await axios.post(
        "http://localhost:5000/api/auth/signin",
        payload
      );

      localStorage.setItem("token", res.data?.data?.token);

      alert("Login successful ✅");
      // TODO: navigate("/catalog");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#1a2236",
        zIndex: 2000,
      }}
    >
      <Paper
        elevation={8}
        sx={{ width: 400, p: 4, borderRadius: 3, bgcolor: "#232946" }}
      >
        <Tabs
          value={tab}
          onChange={(e, newValue) => {
            setTab(newValue);
            setError("");
            setStep("form");
          }}
          centered
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            mb: 2,
            "& .MuiTab-root": { color: "#b8c1ec" },
            "& .Mui-selected": { color: "#eebbc3 !important" },
            "& .MuiTabs-indicator": { backgroundColor: "#eebbc3" },
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {/* LOGIN */}
        {tab === 0 && step === "form" && (
          <>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={form.email}
              onChange={handleChange}
              InputProps={{ style: { color: "#b8c1ec" } }}
              InputLabelProps={{ style: { color: "#b8c1ec" } }}
            />
            <TextField
              label="Mobile"
              fullWidth
              margin="normal"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              InputProps={{ style: { color: "#b8c1ec" } }}
              InputLabelProps={{ style: { color: "#b8c1ec" } }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              value={form.password}
              onChange={handleChange}
              InputProps={{ style: { color: "#b8c1ec" } }}
              InputLabelProps={{ style: { color: "#b8c1ec" } }}
            />
            {error && (
              <Typography color="#eebbc3" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "#eebbc3",
                color: "#232946",
                fontWeight: "bold",
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </>
        )}

        {/* REGISTER */}
        {tab === 1 && step === "form" && (
          <>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Mobile"
              fullWidth
              margin="normal"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
            />
            <TextField
              label="Business Name"
              fullWidth
              margin="normal"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <TextField
              select
              label="Send OTP via"
              fullWidth
              margin="normal"
              name="otpSendType"
              value={form.otpSendType}
              onChange={handleChange}
            >
              <MenuItem value="EMAIL">Email</MenuItem>
              <MenuItem value="MOBILE">Mobile</MenuItem>
            </TextField>

            {error && (
              <Typography color="#eebbc3" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "#eebbc3", color: "#232946" }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </>
        )}

        {/* OTP STEP */}
        {tab === 1 && step === "otp" && (
          <>
            <TextField
              label="Enter OTP"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {error && (
              <Typography color="#eebbc3" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "#eebbc3", color: "#232946" }}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AuthPage;

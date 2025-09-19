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
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import {
  EmailOutlined,
  PhoneAndroid,
  LockOutlined,
  PersonOutline,
  BusinessOutlined,
  SmsOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

const baseUrl = import.meta.env?.REACT_APP_SERVER_PORT || "https://nobita.imontechnologies.in";

const AuthPage = () => {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    businessName: "",
    password: "",
    otpSendType: "EMAIL",
  });
  const [otp, setOtp] = useState("");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Signup
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

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required!");
      return;
    }
    try {
      setError("");
      await axios.post("/verify-otp", { accountId, otp });
      alert("OTP verified 🎉 You can now login.");
      setStep("form");
      setTab(0);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed!");
    }
  };

  // Login
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
      const payload = { password: form.password };
      if (form.email) payload.email = form.email;
      if (form.mobile) payload.mobile = form.mobile;

      const res = await axios.post(
        `${baseUrl}/api/auth/signin`,
        payload
      );
      localStorage.setItem("token", res.data?.data?.token);
      alert("Login successful ✅");
      navigate("/"); // redirect to home after login
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
        elevation={10}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 4,
          bgcolor: "#232946",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="#eebbc3" fontWeight="bold" mb={2}>
          {tab === 0 ? "Welcome Back 👋" : "Create Your Account 📝"}
        </Typography>

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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mobile"
              fullWidth
              margin="normal"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroid sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
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
                borderRadius: "20px",
                "&:hover": { bgcolor: "#f7ccd2" },
              }}
              onClick={handleLogin}
            >
              🔑 Login
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mobile"
              fullWidth
              margin="normal"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroid sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Business Name"
              fullWidth
              margin="normal"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessOutlined sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
            />
            {/* <TextField
              select
              label="Send OTP via"
              fullWidth
              margin="normal"
              name="otpSendType"
              value={form.otpSendType}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SmsOutlined sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="EMAIL">Email</MenuItem>
              <MenuItem value="MOBILE">Mobile</MenuItem>
            </TextField> */}

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
                borderRadius: "20px",
                "&:hover": { bgcolor: "#f7ccd2" },
              }}
              onClick={handleRegister}
            >
              ✍️ Register
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SmsOutlined sx={{ color: "#b8c1ec" }} />
                  </InputAdornment>
                ),
              }}
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
                borderRadius: "20px",
                "&:hover": { bgcolor: "#f7ccd2" },
              }}
              onClick={handleVerifyOtp}
            >
              ✅ Verify OTP
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AuthPage;

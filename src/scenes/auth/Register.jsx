import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

const AuthPage = () => {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // Dummy validation (replace with API call)
    if (uniqueId !== "admin" || password !== "1234") {
      setError("Wrong ID or Password");
    } else {
      setError("");
      alert("Login successful ✅");
    }
  };

  const handleRegister = () => {
    if (!name || !uniqueId || !password) {
      setError("All fields are required!");
    } else {
      setError("");
      alert("Registered successfully 🎉");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* Tabs for switching between Login & Register */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => {
            setTab(newValue);
            setError("");
          }}
          centered
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {tab === 0 ? (
          <>
            <TextField
              label="Unique ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Unique ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AuthPage;

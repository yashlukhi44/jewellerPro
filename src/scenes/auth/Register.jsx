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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#1a2236", // updated background color
        zIndex: 2000,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
          bgcolor: "#232946", // updated Paper color
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
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              color: "#b8c1ec", // tab text color
            },
            "& .Mui-selected": {
              color: "#eebbc3 !important", // selected tab color
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#eebbc3", // indicator color
            },
          }}
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
              InputProps={{
                style: { color: "#b8c1ec" }, // input text color
              }}
              InputLabelProps={{
                style: { color: "#b8c1ec" }, // label color
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#b8c1ec",
                  },
                  "&:hover fieldset": {
                    borderColor: "#eebbc3",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#eebbc3",
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { color: "#b8c1ec" },
              }}
              InputLabelProps={{
                style: { color: "#b8c1ec" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#b8c1ec",
                  },
                  "&:hover fieldset": {
                    borderColor: "#eebbc3",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#eebbc3",
                  },
                },
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
                "&:hover": {
                  bgcolor: "#ffd6e0",
                  color: "#232946",
                },
              }}
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
              InputProps={{
                style: { color: "#b8c1ec" },
              }}
              InputLabelProps={{
                style: { color: "#b8c1ec" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#b8c1ec",
                  },
                  "&:hover fieldset": {
                    borderColor: "#eebbc3",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#eebbc3",
                  },
                },
              }}
            />
            <TextField
              label="Unique ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              InputProps={{
                style: { color: "#b8c1ec" },
              }}
              InputLabelProps={{
                style: { color: "#b8c1ec" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#b8c1ec",
                  },
                  "&:hover fieldset": {
                    borderColor: "#eebbc3",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#eebbc3",
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { color: "#b8c1ec" },
              }}
              InputLabelProps={{
                style: { color: "#b8c1ec" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#b8c1ec",
                  },
                  "&:hover fieldset": {
                    borderColor: "#eebbc3",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#eebbc3",
                  },
                },
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
                "&:hover": {
                  bgcolor: "#ffd6e0",
                  color: "#232946",
                },
              }}
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

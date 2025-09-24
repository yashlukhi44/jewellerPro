import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  Button,
  TextField,
  MenuItem,
  useTheme,
  CircularProgress,
  Stack,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { tokens } from "../../theme";
import axios from "axios";

// Inactivity Settings & Profile Modal
const InactivitySettings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState("3");
  const [profile, setProfile] = useState({
    businessName: "",
    mobile: "",
    email: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch profile info
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://nobita.imontechnologies.in/api/profile/me");
        const data = res.data?.data || {};
        setProfile({
          businessName: data.businessName || "",
          name: data.name || "",
          mobile: data.mobile || "",
          email: data.email || "",
          disableThresholdMonths: period
        });
        setPeriod(data.disableThresholdMonths ? String(data.disableThresholdMonths) : "3");
      } catch (err) {
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [open]);

  // Handle profile field change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile fields
    // Update profile fields
  const handleUpdateProfile = async () => {
    setError("");
    setUpdating(true);
    try {
      await axios.put("https://nobita.imontechnologies.in/api/profile/me", {
        businessName: profile.businessName,
        name: profile.name,
        mobile: profile.mobile,
        disableThresholdMonths: Number(period),
      });
      alert("Profile updated successfully!");
      setOpen(false);
    } catch (err) {
      setError("Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  return (
  <>
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>

      {/* ICONS */}
      <Box display="flex" style={{ paddingRight: "10px" }}>
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton> */}
        
        <IconButton onClick={() => setOpen(true)}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          p={4}
          bgcolor={colors.primary[400]}
          borderRadius="12px"
          width="400px"
          mx="auto"
          mt="10%"
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h5" mb={2} color={colors.grey[100]}>
            Profile & Inactivity Settings
          </Typography>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={2}
            >
              <CircularProgress size={28} />
            </Box>
          ) : (
            <>
              {/* Profile Fields */}
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                />
                <TextField
                  label="Business Name"
                  name="businessName"
                  value={profile.businessName}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                />
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                />
                <TextField
                  label="Email"
                  name="email"
                  disabled
                  value={profile.email}
                  onChange={handleProfileChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                />
                <TextField
                  select
                  label="Inactivity Period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                >
                  <MenuItem value="3">3 Months</MenuItem>
                  <MenuItem value="6">6 Months</MenuItem>
                  <MenuItem value="12">12 Months</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  sx={{ borderRadius: 2, fontWeight: "bold" }}
                >
                  {updating ? <CircularProgress size={20} /> : "Update Profile"}
                </Button>
              </Stack>
            </>
          )}

          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default InactivitySettings;

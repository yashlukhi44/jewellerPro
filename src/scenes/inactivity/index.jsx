import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { useState } from "react";

const InactivitySettings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State
  const [inactivityPeriod, setInactivityPeriod] = useState("3");

  const disabledAccounts = [
    { business: "Shree Jewelers", mobile: "+91 98765 43210", email: "shree@example.com" },
    { business: "Raj Gold House", mobile: "+91 91234 56789", email: "raj@example.com" },
    { business: "Diamond Palace", mobile: "+91 99887 66554", email: "diamond@example.com" },
  ];

  const handleSave = () => {
    alert(`Inactivity period updated to ${inactivityPeriod} months`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={3} color={colors.grey[100]}>
        Inactivity Settings
      </Typography>

      {/* Inactivity Period Selector */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: colors.primary[400],
          borderRadius: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="inactivity-label">Inactivity Period</InputLabel>
          <Select
            labelId="inactivity-label"
            value={inactivityPeriod}
            onChange={(e) => setInactivityPeriod(e.target.value)}
          >
            <MenuItem value="3">3 Months</MenuItem>
            <MenuItem value="6">6 Months</MenuItem>
            <MenuItem value="12">12 Months</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: "#fff",
            fontWeight: "bold",
            px: 3,
            "&:hover": {
              backgroundColor: colors.greenAccent[700],
            },
          }}
        >
          Save
        </Button>
      </Paper>

      {/* Disabled Accounts Table */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          backgroundColor: colors.primary[400],
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight="600" mb={2} color={colors.grey[100]}>
          Disabled Jeweler Accounts
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: colors.greenAccent[500], fontWeight: "bold" }}>
                  Business Name
                </TableCell>
                <TableCell sx={{ color: colors.greenAccent[500], fontWeight: "bold" }}>
                  Mobile
                </TableCell>
                <TableCell sx={{ color: colors.greenAccent[500], fontWeight: "bold" }}>
                  Email
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disabledAccounts.map((acc, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ color: colors.grey[100] }}>{acc.business}</TableCell>
                  <TableCell sx={{ color: colors.grey[100] }}>{acc.mobile}</TableCell>
                  <TableCell sx={{ color: colors.grey[100] }}>{acc.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InactivitySettings;

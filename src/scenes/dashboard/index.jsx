import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, useTheme, IconButton } from "@mui/material";
import axios from "axios";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import CustomBarChart from "../../components/BarChart";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [summary, setSummary] = useState({
    initial: 0,
    active: 0,
    disabled: 0,
    pendingOrders: 0,
    pendingSignupRequests: 0,
    rejectedSignupRequests: 0,
    pendingResignRequests: 0,
    rejectedResignRequests: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://nobita.imontechnologies.in/api/profile/accounts/status-summary",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.data) {
          setSummary(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };
    fetchSummary();
  }, []);

  // Prepare graph data
  const graphData = [
    { name: "Initial", value: summary.initial },
    { name: "Active", value: summary.active },
    { name: "Disabled", value: summary.disabled },
    { name: "Pending Orders", value: summary.pendingOrders },
    { name: "Pending Signup", value: summary.pendingSignupRequests },
    { name: "Rejected Signup", value: summary.rejectedSignupRequests },
    { name: "Pending Resign", value: summary.pendingResignRequests },
    { name: "Rejected Resign", value: summary.rejectedResignRequests },
  ];

  const statCards = [
    { title: summary.active, subtitle: "Active Accounts", color: colors.greenAccent[500] },
    { title: summary.initial, subtitle: "Initial Accounts", color: colors.orangeAccent?.[400] || "#ff9800" },
    { title: summary.pendingSignupRequests, subtitle: "Pending Signups", color: colors.yellowAccent?.[400] || "#ffeb3b" },
    { title: summary.pendingOrders, subtitle: "Pending Orders", color: colors.blueAccent?.[400] || "#2196f3" },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* HEADER */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        gap={2}
        mb={3}
      >
        <Header title="Dashboard" subtitle="Welcome back 👋" /> 
      </Box>

      {/* STAT CARDS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
          gridAutoRows: "150px",
          gap: 3,
          mb: 3,
        }}
      >
        {statCards.map((card, idx) => (
          <Box key={idx} sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
            <Paper
              elevation={3}
              sx={{
                height: "100%",
                backgroundColor: colors.primary?.[400] || "#333",
                borderRadius: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              <StatBox
                title={card.title}
                subtitle={card.subtitle}
                progress={card.title / 10}
                increase=""
                // icon={
                //   <Box
                //     sx={{ width: 24, height: 24, backgroundColor: card.color, borderRadius: "50%" }}
                //   />
                // }
              />
            </Paper>
          </Box>
        ))}
      </Box>

      {/* BAR CHART */}
      <Box sx={{ height: 400 }}>
        <Paper
          elevation={3}
          sx={{ backgroundColor: colors.primary?.[400] || "#333", borderRadius: 3, p: 3 }}
        >
          <Typography variant="h6" color={colors.grey?.[100] || "#fff"} mb={2}>
            Accounts Status Summary
          </Typography>
          <CustomBarChart data={graphData} isDashboard />
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;

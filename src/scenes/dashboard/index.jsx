import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        <Button
          startIcon={<DownloadOutlinedIcon />}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontWeight: "bold",
            px: { xs: 2, md: 3 },
            py: 1,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: colors.blueAccent[600],
            },
          }}
        >
          Download Reports
        </Button>
      </Box>

      {/* LAYOUT USING GRID CLASSES */}
      <Box
        className="dashboard-grid"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(12, 1fr)",
          },
          gridAutoRows: "150px",
          gap: 3,
        }}
      >
        {/* STAT CARDS */}
        <Box
          className="stat-card"
          sx={{
            gridColumn: { xs: "span 12", md: "span 3" },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              backgroundColor: colors.primary[400],
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            <StatBox
              title="12,361"
              subtitle="Emails Sent"
              progress="0.75"
              increase="+14%"
              icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: 28 }} />}
            />
          </Paper>
        </Box>

        <Box className="stat-card" sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              backgroundColor: colors.primary[400],
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            <StatBox
              title="431,225"
              subtitle="Sales Obtained"
              progress="0.50"
              increase="+21%"
              icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: 28 }} />}
            />
          </Paper>
        </Box>

        <Box className="stat-card" sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              backgroundColor: colors.primary[400],
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            <StatBox
              title="32,441"
              subtitle="New Clients"
              progress="0.30"
              increase="+5%"
              icon={<PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: 28 }} />}
            />
          </Paper>
        </Box>

        <Box className="stat-card" sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              backgroundColor: colors.primary[400],
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            <StatBox
              title="1,325,134"
              subtitle="Traffic Received"
              progress="0.80"
              increase="+43%"
              icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: 28 }} />}
            />
          </Paper>
        </Box>

        {/* REVENUE CHART */}
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 8" }, gridRow: "span 2" }}>
          <Paper
            elevation={3}
            sx={{ height: "100%", backgroundColor: colors.primary[400], borderRadius: 3, p: 3 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6" color={colors.grey[100]}>
                  Revenue Generated
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                  $59,342.32
                </Typography>
              </Box>
              <IconButton>
                <DownloadOutlinedIcon sx={{ color: colors.greenAccent[500] }} />
              </IconButton>
            </Box>
            <BarChart isDashboard />
          </Paper>
        </Box>

        {/* TRANSACTIONS */}
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" }, gridRow: "span 2" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              backgroundColor: colors.primary[400],
              borderRadius: 3,
              overflow: "auto",
            }}
          >
            <Box p={2} borderBottom={`2px solid ${colors.primary[500]}`}>
              <Typography variant="h6" color={colors.grey[100]} fontWeight="600">
                Recent Transactions
              </Typography>
            </Box>
            {mockTransactions.map((t, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={2}
                py={1.5}
                borderBottom={`1px solid ${colors.primary[500]}`}
              >
                <Box>
                  <Typography color={colors.greenAccent[500]} fontWeight="600">
                    {t.txId}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[100]}>
                    {t.user}
                  </Typography>
                </Box>
                <Typography variant="body2" color={colors.grey[300]}>
                  {t.date}
                </Typography>
                <Box
                  px={1.5}
                  py={0.5}
                  borderRadius={2}
                  sx={{ backgroundColor: colors.greenAccent[500], color: "#fff", fontWeight: 500 }}
                >
                  ${t.cost}
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>

        {/* CAMPAIGN */}
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" }, gridRow: "span 2" }}>
          <Paper
            elevation={3}
            sx={{ height: "100%", backgroundColor: colors.primary[400], borderRadius: 3, p: 3 }}
          >
            <Typography variant="h6" fontWeight="600">
              Campaign
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
              <ProgressCircle size={120} />
              <Typography variant="h6" color={colors.greenAccent[500]} mt={2}>
                $48,352 revenue generated
              </Typography>
              <Typography variant="body2" color={colors.grey[300]}>
                Includes extra misc expenditures and costs
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* SALES QUANTITY */}
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" }, gridRow: "span 2" }}>
          <Paper
            elevation={3}
            sx={{ height: "100%", backgroundColor: colors.primary[400], borderRadius: 3, p: 3 }}
          >
            <Typography variant="h6" fontWeight="600" mb={2}>
              Sales Quantity
            </Typography>
            <BarChart isDashboard />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

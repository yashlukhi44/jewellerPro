import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LoginIcon from "@mui/icons-material/Login";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";

const Analytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State
  const [stats, setStats] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [mostOrdered, setMostOrdered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch status summary
        const statsRes = await axios.get("https://nobita.imontechnologies.in/api/profile/accounts/status-summary");
        const statsData = statsRes?.data?.data || {};
        setStats([
          {
            title: "Initial Accounts",
            value: statsData.initial || 0,
            icon: <LoginIcon fontSize="large" />,
          },
          {
            title: "Active Accounts",
            value: statsData.active || 0,
            icon: <PeopleOutlineIcon fontSize="large" />,
          },
          {
            title: "Disabled Accounts",
            value: statsData.disabled || 0,
            icon: <FavoriteBorderIcon fontSize="large" />,
          },
        ]);

        // Fetch most viewed & most ordered
        const [viewedRes, orderedRes] = await Promise.all([
          axios.get("https://nobita.imontechnologies.in/api/products/most-viewed"),
          axios.get("https://nobita.imontechnologies.in/api/products/most-ordered"),
        ]);

        setMostViewed(viewedRes.data || []);
        setMostOrdered(orderedRes.data || []);
      } catch (err) {
        setError("Error fetching analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const renderProductList = (items, type) => (
    
    <Paper
    elevation={3}
    sx={{
      p: 3,
      backgroundColor: colors.primary[400],
      borderRadius: 3,
    }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <TrendingUpIcon sx={{ color: colors.greenAccent[500] }} />
        <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
          {type === "viewed" ? "Most Viewed Products" : "Most Ordered Products"}
        </Typography>
      </Box>
      <List>
        {items?.data?.map((item, i) => (
          <Box key={item._id}>
            <ListItem
              sx={{ display: "flex", justifyContent: "space-between", px: 0 }}
            >
              <ListItemText
                primary={item.name}
                secondary={item.description}
                primaryTypographyProps={{
                  color: colors.grey[100],
                  fontWeight: "500",
                }}
                secondaryTypographyProps={{
                  color: colors.grey[300],
                }}
              />
              <Typography variant="body2" color={colors.grey[300]}>
                {type === "viewed"
                  ? `${item.viewCount} views`
                  : `${item.orderCount} orders`}
              </Typography>
            </ListItem>
            {i < items.length - 1 && (
              <Divider sx={{ borderColor: colors.primary[500] }} />
            )}
          </Box>
        ))}
      </List>
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
      >
        <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
          Analytics Dashboard
        </Typography>
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
          Download Report
        </Button>
      </Box>

      {/* Error / Loading */}
      {loading && (
        <Typography color={colors.grey[100]}>Loading...</Typography>
      )}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <>
          {/* Stats Row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              mb: 4,
            }}
          >
            {stats.map((stat, i) => (
              <Paper
                key={i}
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: colors.primary[400],
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ color: colors.greenAccent[500] }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="h6" color={colors.grey[100]}>
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Most Viewed + Most Ordered */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {renderProductList(mostViewed, "viewed")}
            {renderProductList(mostOrdered, "ordered")}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Analytics;

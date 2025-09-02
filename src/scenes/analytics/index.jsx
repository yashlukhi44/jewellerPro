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

const Analytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy data
  const stats = [
    { title: "Active Jewelers", value: "124", icon: <PeopleOutlineIcon fontSize="large" /> },
    { title: "Logins Today", value: "532", icon: <LoginIcon fontSize="large" /> },
    { title: "Wishlist Additions", value: "218", icon: <FavoriteBorderIcon fontSize="large" /> },
  ];

  const popularItems = [
    { name: "Gold Necklace", views: 230, orders: 85 },
    { name: "Diamond Ring", views: 190, orders: 70 },
    { name: "Silver Bracelet", views: 150, orders: 50 },
    { name: "Platinum Earrings", views: 120, orders: 40 },
  ];

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
              <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                {stat.value}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Popular Items */}
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
            Popular Items
          </Typography>
        </Box>
        <List>
          {popularItems.map((item, i) => (
            <Box key={i}>
              <ListItem
                sx={{ display: "flex", justifyContent: "space-between", px: 0 }}
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{ color: colors.grey[100], fontWeight: "500" }}
                />
                <Typography variant="body2" color={colors.grey[300]}>
                  {item.views} views | {item.orders} orders
                </Typography>
              </ListItem>
              {i < popularItems.length - 1 && <Divider sx={{ borderColor: colors.primary[500] }} />}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Analytics;

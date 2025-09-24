import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { tokens } from "../../theme";

const PastOrders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [status, setStatus] = useState(""); 
  const [data, setData] = useState([]);
  console.log("data",data)
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 1000, height: 400 });

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const url = status
          ? `https://nobita.imontechnologies.in/api/orders/past-month-orders?status=${status}`
          : `https://nobita.imontechnologies.in/api/orders/past-month-orders`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Transform API into readable chart dataset
        const transformed = (res.data?.data || []).map((d) => ({
          month: monthNames[d.month - 1], // e.g. 9 → "Sep"
          orders: d.totalOrders,          // e.g. 2
        }));

        setData(transformed);
        console.log("res.data?.data",res.data?.data)
      } catch (err) {
        console.error("Error fetching past orders:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [status]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
          Past 12 Months Orders
        </Typography>

        {/* Filter */}
        <FormControl sx={{ minWidth: 200 }} size="small">
  <InputLabel
    sx={{
      color: "white",
      "&.Mui-focused": {
        color: "white !important", // keeps label white when focused
      },
    }}
  >
    Status Filter
  </InputLabel>
  <Select
    value={status}
    label="Status Filter"
    onChange={(e) => setStatus(e.target.value)}
    sx={{
      backgroundColor: colors.primary[400],
      color: "white", // selected text
      "& .MuiSvgIcon-root": { color: "white" }, // dropdown arrow
      "& .MuiInputBase-input": { color: "white" }, // input text
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.3)", // border color
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
      },
    }}
  >
    {/* <MenuItem value="all">All</MenuItem> */}
    <MenuItem value="cancelled">Cancelled</MenuItem>
    <MenuItem value="pending">Pending</MenuItem>
    <MenuItem value="confirmed">Confirmed</MenuItem>
    <MenuItem value="completed">Completed</MenuItem>
  </Select>
</FormControl>

      </Box>

      {/* Chart */}
      <Paper
        elevation={3}
        sx={{ p: 3, backgroundColor: colors.primary[400], borderRadius: 3 }}
      >
        {loading ? (
          <Typography color={colors.grey[100]}>Loading...</Typography>
        ) : (
          <Box ref={containerRef} sx={{ width: "100%", height: 400 }}>
            {size.width > 0 && size.height > 0 && (
              <BarChart
              dataset={data}
              xAxis={[{ scaleType: "band", dataKey: "month" }]}
              series={[{ dataKey: "orders", label: "Orders" }]}
              width={size.width}
              height={size.height}
              colors={[colors.greenAccent[500]]}
              margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
              />
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PastOrders;

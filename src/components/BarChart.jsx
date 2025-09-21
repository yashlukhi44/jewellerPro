import { useTheme, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { tokens } from "../theme";
import { useEffect, useRef, useState } from "react";

const CustomBarChart = ({ data, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Track container size
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Safe color palette
  const colorPalette = [
    colors?.blueAccent?.[400] || "#2196f3",
    colors?.greenAccent?.[500] || "#4caf50",
    colors?.redAccent?.[400] || "#f44336",
    colors?.orangeAccent?.[400] || "#ff9800",
    colors?.yellowAccent?.[400] || "#ffeb3b",
    colors?.purpleAccent?.[400] || "#9c27b0",
    colors?.blueAccent?.[600] || "#1976d2",
    colors?.redAccent?.[500] || "#d32f2f",
  ];

  const series = data.map((item, index) => ({
    label: item.name,
    data: [item.value],
    color: colorPalette[index % colorPalette.length],
  }));

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: isDashboard ? 300 : 500,
      }}
    >
      {size.width > 0 && size.height > 0 && (
        <BarChart
          width={size.width}
          height={size.height}
          xAxis={[
            {
              data: ["Accounts"],
              scaleType: "band",
              tickLabelStyle: { fill: colors.grey[100] },
            },
          ]}
          yAxis={[
            {
              label: isDashboard ? "" : "Count",
              tickLabelStyle: { fill: colors.grey[100] },
            },
          ]}
          series={series}
          borderRadius={4}
          colors={series.map((s) => s.color)}
          legend={{ hidden: !isDashboard ? false : true }}
          margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
        />
      )}
    </Box>
  );
};

export default CustomBarChart;

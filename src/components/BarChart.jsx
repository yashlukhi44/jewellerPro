import { useTheme, Box } from "@mui/material";
import { tokens } from "../theme";
import { mockBarData as data } from "../data/mockData";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useRef, useState } from "react";

const CustomBarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const seriesKeys = ["hot dog", "burger", "sandwich", "kebab", "fries", "donut"];
  const xLabels = data.map((d) => d.country);

  const series = seriesKeys.map((key) => ({
    label: key,
    data: data.map((d) => d[key]),
  }));

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
              data: xLabels,
              scaleType: "band",
              label: isDashboard ? "" : "Country",
              tickLabelStyle: { fill: colors.grey[100] },
            },
          ]}
          yAxis={[
            {
              label: isDashboard ? "" : "Food",
              tickLabelStyle: { fill: colors.grey[100] },
            },
          ]}
          series={series}
          borderRadius={4}
          colors={["#ff7043", "#29b6f6", "#66bb6a", "#ab47bc", "#ffa726", "#ef5350"]}
          legend={{
            hidden: isDashboard,
          }}
          margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
        />
      )}
    </Box>
  );
};

export default CustomBarChart;

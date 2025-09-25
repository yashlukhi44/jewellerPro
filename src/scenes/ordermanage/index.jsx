import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import axios from "axios";

const OrderManagement = () => {
  const [rows, setRows] = useState([]);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://nobita.imontechnologies.in/api/orders"
        );

        const formatted = res.data.data.orders.map((order) => {
          const firstItem = order.items[0];
          return {
            id: order._id,
            business: order.userId || "N/A",
            phone: order.phone || "N/A",
            email: order.email || "N/A",
            itemName: firstItem?.productId?.name || "N/A",
            itemImage: firstItem?.productId?.imageUrls?.[0] || "",
            quantity: firstItem?.quantity || 0,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: new Date(order.createdAt).toLocaleString(),
          };
        });

        setRows(formatted);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Handle status change (PATCH request)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://nobita.imontechnologies.in/api/orders/${id}/status`,
        { status: newStatus }
      );
      const updated = rows.map((row) =>
        row.id === id ? { ...row, status: newStatus } : row
      );
      setRows(updated);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const columns = [
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
  field: "item",
  headerName: "Item",
  flex: 1.5,
  renderCell: (params) => (
    <Box
  display="flex"
  alignItems="center"
  gap={1.5}
  height="100%" // ensures it takes full row height
>
  {params.row.itemImage ? (
    <img
      src={params.row.itemImage}
      alt={params.row.itemName}
      style={{
        width: 44,
        height: 44,
        objectFit: "cover",
        borderRadius: "50%",
        border: "2px solid #e0e0e0",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        display: "block", // prevents inline spacing issues
      }}
    />
  ) : (
    <Box
      width={44}
      height={44}
      borderRadius="50%"
      bgcolor="#f0f0f0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize={12}
      fontWeight={600}
      color="#666"
    >
      N/A
    </Box>
  )}

  <Tooltip title={params.row.itemName} arrow>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 500,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 180,
        lineHeight: "44px", // aligns text vertically with the image
      }}
    >
      {params.row.itemName}
    </Typography>
  </Tooltip>
</Box>

  ),
}
,
    { field: "quantity", headerName: "Qty", flex: 0.5 },
    { field: "totalAmount", headerName: "Total", flex: 1 },
    {
  field: "status",
  headerName: "Status",
  flex: 1,
  renderCell: (params) => (
    <Select
      value={params.row.status}
      onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
      size="small"
      sx={{
        minWidth: 160,
        fontWeight: 600,
        borderRadius: 2,
        backgroundColor:
          params.row.status === "pending"
            ? "#fff3cd"
            : params.row.status === "confirmed"
            ? "#d1e7dd"
            : params.row.status === "in progress"
            ? "#cff4fc"
            : params.row.status === "completed"
            ? "#e2e3e5"
            : params.row.status === "cancelled"
            ? "#f8d7da"
            : "#fff",
        color:
          params.row.status === "pending"
            ? "#664d03"
            : params.row.status === "confirmed"
            ? "#0f5132"
            : params.row.status === "in progress"
            ? "#055160"
            : params.row.status === "completed"
            ? "#41464b"
            : params.row.status === "cancelled"
            ? "#842029"
            : "#000",
      }}
    >
      <MenuItem value="pending" sx={{ background: "#fff3cd", color: "#664d03", fontWeight: 600 }}>
        Pending
      </MenuItem>
      <MenuItem value="confirmed" sx={{ background: "#d1e7dd", color: "#0f5132", fontWeight: 600 }}>
        Confirmed
      </MenuItem>
      <MenuItem value="in progress" sx={{ background: "#cff4fc", color: "#055160", fontWeight: 600 }}>
        In Progress
      </MenuItem>
      <MenuItem value="completed" sx={{ background: "#e2e3e5", color: "#41464b", fontWeight: 600 }}>
        Completed
      </MenuItem>
      <MenuItem value="cancelled" sx={{ background: "#f8d7da", color: "#842029", fontWeight: 600 }}>
        Cancelled
      </MenuItem>
    </Select>
  ),
}

  ];

  return (
    <Box m="20px">
      <Header title="Order Management" subtitle="Manage Order Requests" />
      <Box
        mt={3}
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
        }}
      >
        <DataGrid getRowId={(row) => row.id} rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default OrderManagement;

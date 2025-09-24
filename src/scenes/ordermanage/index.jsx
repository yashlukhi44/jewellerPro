import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";

const OrderManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://nobita.imontechnologies.in/api/orders"
        );

        // Transform API response into table-friendly format
        const formatted = res.data.data.orders.map((order) => {
          const firstItem = order.items[0]; // take first item for display
          return {
            id: order._id,
            business: order.userId || "N/A",
            phone: order.phone || "N/A", // if API adds later
            email: order.email || "N/A", // if API adds later
            itemName: firstItem?.productId?.name || "N/A",
            itemImage: firstItem?.productId?.imageUrls?.[0] || "",
            quantity: firstItem?.quantity || 0,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: new Date(order.createdAt).toLocaleString(),
          };
        });

        setRows(formatted);
        console.log("Formatted rows", formatted);
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

  // Copy contact details to clipboard
  const handleCopy = (phone, email) => {
    navigator.clipboard.writeText(`Phone: ${phone}, Email: ${email}`);
    alert("Contact details copied!");
  };

  const columns = [
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
  field: "item",
  headerName: "Item",
  flex: 1.5,
  renderCell: (params) => (
    <Box display="flex" alignItems="center" gap={1}>
      {params.row.itemImage && (
        <img
          src={params.row.itemImage}
          alt={params.row.itemName}
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )}
      <Typography variant="body2" noWrap>
        {params.row.itemName}
      </Typography>
    </Box>
  ),
},
    { field: "quantity", headerName: "Qty", flex: 0.5 },
    { field: "totalAmount", headerName: "Total", flex: 1 },
    {
  field: "status",
  headerName: "Status",
  flex: 1,
  renderCell: (params) => {
    let color = "default";
    if (params.value === "Pending") color = "warning";
    if (params.value === "Confirmed") color = "success";
    if (params.value === "Rejected" || params.value === "Cancelled")
      color = "error";

    return <Chip label={params.value} color={color} variant="outlined" />;
  },
},
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 0.5,
    //   renderCell: (params) => (
    //     <Tooltip title="Copy Contact Details">
    //       <IconButton
    //         color="primary"
    //         onClick={() =>
    //           handleCopy(params.row.phone, params.row.email)
    //         }
    //       >
    //         <ContentCopyIcon />
    //       </IconButton>
    //     </Tooltip>
    //   ),
    // },
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

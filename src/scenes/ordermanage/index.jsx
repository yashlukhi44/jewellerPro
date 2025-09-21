import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
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
        const res = await axios.get("https://nobita.imontechnologies.in/api/orders"); // {host}/api/orders
        setRows(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // Handle status change (PATCH request)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`https://nobita.imontechnologies.in/api/orders/${id}/status`, {
        status: newStatus,
      });

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
    { field: "business", headerName: "Business Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "item",
      headerName: "Item",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.itemName}</Typography>
          {params.row.itemImage && (
            <img
              src={params.row.itemImage}
              alt={params.row.itemName}
              style={{ width: 50, height: 50, marginTop: 5 }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {["Pending", "Confirmed", "Rejected"].map((status) => (
            <Tooltip key={status} title={`Set as ${status}`}>
              <IconButton
                size="small"
                color={
                  params.row.status === status
                    ? "primary"
                    : "default"
                }
                onClick={() => handleStatusChange(params.row.id, status)}
                sx={{
                  border: "1px solid",
                  borderColor:
                    params.row.status === status ? "primary.main" : "grey.400",
                  bgcolor:
                    params.row.status === status ? "primary.light" : "transparent",
                  "&:hover": { bgcolor: "primary.light" },
                  px: 1,
                  py: 0.5,
                }}
              >
                <Typography variant="body2">{status}</Typography>
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title="Copy Contact Details">
          <IconButton
            color="primary"
            onClick={() => handleCopy(params.row.phone, params.row.email)}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Order Management" subtitle="Manage Order Requests" />
      <Box
        mt={3}
        height="70vh"
        sx={{ "& .MuiDataGrid-root": { border: "none" } }}
      >
        <DataGrid getRowId={(row) => row.id} rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default OrderManagement;
